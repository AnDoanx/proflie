/* ==================================================================
   tiktok.js — lấy video TikTok + tải MP4 không logo / MP3 / ảnh bìa
   Web tự gọi API công khai, không cần đăng nhập, không cần token.
   Nếu sau này API đổi, chỉ cần sửa mảng ENDPOINTS bên dưới.
   ================================================================== */
(function () {
  "use strict";

  var ENDPOINTS = ["https://www.tikwm.com/api/", "https://tikwm.com/api/"];
  var HIST_KEY = "ka_tt_hist";

  var $ = function (id) {
    return document.getElementById(id);
  };
  var out = $("out");

  function esc(s) {
    return String(s == null ? "" : s).replace(/[<>&"]/g, function (c) {
      return { "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c];
    });
  }

  function num(n) {
    n = Number(n) || 0;
    if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
    if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
    return String(n);
  }

  function safeName(s) {
    return String(s || "tiktok")
      .replace(/[\\/:*?"<>|#]+/g, "_")
      .replace(/\s+/g, "_")
      .slice(0, 60);
  }

  /* ---------------- gọi API ---------------- */
  function fetchInfo(url) {
    var i = 0;
    function attempt() {
      if (i >= ENDPOINTS.length) return Promise.reject(new Error("API không phản hồi"));
      var ep = ENDPOINTS[i++];
      return fetch(ep + "?url=" + encodeURIComponent(url) + "&hd=1")
        .then(function (r) {
          return r.json();
        })
        .then(function (d) {
          if (!d || d.code !== 0 || !d.data) throw new Error((d && d.msg) || "Link không hợp lệ");
          return d.data;
        })
        .catch(function (e) {
          if (i >= ENDPOINTS.length) throw e;
          return attempt();
        });
    }
    return attempt();
  }

  /* ---------------- tải file kèm tiến trình ---------------- */
  function download(url, filename, btn, bar) {
    if (!url) return;
    var old = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = "&#8987; Đang tải...";
    if (bar) bar.parentNode.hidden = false;

    function fail() {
      btn.disabled = false;
      btn.innerHTML = old;
      window.open(url, "_blank", "noopener");
    }

    if (!window.fetch || !window.ReadableStream) {
      fail();
      return;
    }

    fetch(url, { mode: "cors" })
      .then(function (res) {
        if (!res.ok) throw new Error("bad status");
        var total = Number(res.headers.get("content-length")) || 0;
        var reader = res.body.getReader();
        var chunks = [];
        var got = 0;
        return (function pump() {
          return reader.read().then(function (r) {
            if (r.done) return;
            chunks.push(r.value);
            got += r.value.length;
            if (total && bar) bar.firstChild.style.width = Math.round((got / total) * 100) + "%";
            else if (bar && got > 2e6) bar.firstChild.style.width = Math.min(90, (got / 2e6) * 10) + "%";
            return pump();
          });
        })().then(function () {
          return new Blob(chunks, { type: res.headers.get("content-type") || "application/octet-stream" });
        });
      })
      .then(function (blob) {
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
          URL.revokeObjectURL(a.href);
          a.remove();
        }, 4000);
        btn.disabled = false;
        btn.innerHTML = "&#10003; Đã tải";
        setTimeout(function () {
          btn.innerHTML = old;
        }, 2500);
        if (bar) {
          bar.firstChild.style.width = "100%";
          setTimeout(function () {
            bar.hidden = true;
            bar.firstChild.style.width = "0";
          }, 1200);
        }
      })
      .catch(fail);
  }

  /* ---------------- lịch sử ---------------- */
  function readHist() {
    try {
      return JSON.parse(localStorage.getItem(HIST_KEY) || "[]") || [];
    } catch (e) {
      return [];
    }
  }

  function pushHist(item) {
    var h = readHist().filter(function (x) {
      return x.url !== item.url;
    });
    h.unshift(item);
    h = h.slice(0, 12);
    try {
      localStorage.setItem(HIST_KEY, JSON.stringify(h));
    } catch (e) {
      /* ignore */
    }
    renderHist();
  }

  function renderHist() {
    var h = readHist();
    var box = $("hist-box");
    var list = $("hist");
    if (!h.length) {
      box.hidden = true;
      return;
    }
    box.hidden = false;
    list.innerHTML = "";
    h.forEach(function (it) {
      var d = document.createElement("div");
      d.className = "item";
      var s = document.createElement("span");
      s.textContent = (it.author ? "@" + it.author + " — " : "") + (it.title || it.url).slice(0, 70);
      var b = document.createElement("button");
      b.type = "button";
      b.title = "Lấy lại";
      b.innerHTML = "&#8635;";
      b.addEventListener("click", function () {
        $("urls").value = it.url;
        run();
      });
      d.appendChild(s);
      d.appendChild(b);
      list.appendChild(d);
    });
  }

  /* ---------------- giao diện kết quả ---------------- */
  function loading(url) {
    var d = document.createElement("div");
    d.className = "box loading";
    d.innerHTML = '<span class="spin"></span><span>Đang lấy thông tin: ' + esc(url.slice(0, 70)) + "...</span>";
    out.appendChild(d);
    return d;
  }

  function errorBox(msg, url) {
    var d = document.createElement("div");
    d.className = "err";
    d.innerHTML = "<b>Không lấy được video.</b><br />" + esc(msg) + "<br /><small>" + esc(url) + "</small>";
    out.appendChild(d);
  }

  function render(url, info) {
    var author = (info.author && (info.author.nickname || info.author.unique_id)) || "TikTok";
    var nick = (info.author && info.author.unique_id) || "";
    var avatar = (info.author && info.author.avatar) || "";
    var id = info.id || "video";
    var base = "tiktok_" + safeName(nick || author) + "_" + id;
    var card = document.createElement("div");
    card.className = "vcard";
    card.innerHTML =
      '<div class="shot">' +
      (info.cover ? '<img src="' + esc(info.cover) + '" alt="" />' : "<span>&#127916;</span>") +
      (info.duration ? '<span class="dur">' + info.duration + "s</span>" : "") +
      "</div>" +
      "<div>" +
      '<div class="who">' +
      (avatar ? '<img src="' + esc(avatar) + '" alt="" />' : "") +
      "<div><b>" +
      esc(author) +
      "</b><span>@" +
      esc(nick) +
      "</span></div></div>" +
      '<p class="ttl">' +
      esc(info.title || "(không có mô tả)") +
      "</p>" +
      '<div class="stats"><span>&#9654; ' +
      num(info.play_count) +
      " lượt xem</span><span>&#9829; " +
      num(info.digg_count) +
      "</span><span>&#128172; " +
      num(info.comment_count) +
      "</span><span>&#8635; " +
      num(info.share_count) +
      "</span></div>" +
      '<div class="dls"></div>' +
      '<div class="prog" hidden><i></i></div>' +
      "</div>";

    var dls = card.querySelector(".dls");
    var bar = card.querySelector(".prog");

    function mk(label, link, fname, main) {
      if (!link) return;
      var b = document.createElement("button");
      b.type = "button";
      b.className = "dl" + (main ? " main" : "");
      b.innerHTML = label;
      b.addEventListener("click", function () {
        download(link, fname, b, bar);
      });
      dls.appendChild(b);
    }

    mk("&#11015; MP4 không logo", info.play, base + ".mp4", true);
    mk("&#11015; MP4 HD", info.hdplay, base + "_hd.mp4", false);
    mk("&#11015; MP4 có logo", info.wmplay, base + "_logo.mp4", false);
    mk("&#127925; MP3 (âm thanh)", info.music, base + ".mp3", false);

    if (info.cover) {
      var c = document.createElement("button");
      c.type = "button";
      c.className = "dl";
      c.innerHTML = "&#128444; Ảnh bìa";
      c.addEventListener("click", function () {
        download(info.cover, base + "_cover.jpg", c, bar);
      });
      dls.appendChild(c);
    }

    var src = document.createElement("a");
    src.className = "dl";
    src.href = url;
    src.target = "_blank";
    src.rel = "noopener";
    src.innerHTML = "&#128279; Mở trên TikTok";
    dls.appendChild(src);

    out.appendChild(card);
    pushHist({ url: url, title: info.title, author: nick || author });
  }

  /* ---------------- chạy ---------------- */
  function looksLikeTikTok(u) {
    return /tiktok\.com|douyin\.com/i.test(u);
  }

  function run() {
    var raw = $("urls").value.split(/[\s,]+/).filter(Boolean);
    var urls = raw.filter(looksLikeTikTok);
    out.innerHTML = "";
    if (!urls.length) {
      errorBox("Chưa thấy link TikTok nào. Dán link dạng tiktok.com/@ten/video/... nhé.", raw[0] || "");
      return;
    }
    $("go").disabled = true;
    var chain = Promise.resolve();
    urls.slice(0, 8).forEach(function (u) {
      chain = chain.then(function () {
        var box = loading(u);
        return fetchInfo(u)
          .then(function (info) {
            box.remove();
            render(u, info);
          })
          .catch(function (e) {
            box.remove();
            errorBox(e.message || "Lỗi không xác định", u);
            return new Promise(function (r) {
              setTimeout(r, 400);
            });
          });
      });
    });
    chain.then(function () {
      $("go").disabled = false;
    });
  }

  $("go").addEventListener("click", run);
  $("clear").addEventListener("click", function () {
    $("urls").value = "";
    out.innerHTML = "";
    $("urls").focus();
  });
  $("paste").addEventListener("click", function () {
    if (!navigator.clipboard || !navigator.clipboard.readText) {
      alert("Trình duyệt này không cho đọc clipboard — bạn dán tay giúp mình nhé.");
      return;
    }
    navigator.clipboard
      .readText()
      .then(function (t) {
        if (!t) return;
        $("urls").value = ($("urls").value ? $("urls").value.trim() + "\n" : "") + t.trim();
        run();
      })
      .catch(function () {
        alert("Không đọc được clipboard — bạn dán tay giúp mình nhé.");
      });
  });
  $("hist-clear").addEventListener("click", function () {
    try {
      localStorage.removeItem(HIST_KEY);
    } catch (e) {
      /* ignore */
    }
    renderHist();
  });
  $("urls").addEventListener("keydown", function (ev) {
    if (ev.key === "Enter" && (ev.ctrlKey || ev.metaKey)) run();
  });

  renderHist();
  $("urls").focus();
})();
