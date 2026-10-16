/* ==================================================================
   tiktok.js — lấy video TikTok + tải MP4 không logo / MP3 / ảnh bìa
   + Tích hợp API Check Info User: https://ksjdjdmfmxm.x10.mx/tik1.php?user=
   ================================================================== */
(function () {
  "use strict";

  var ENDPOINTS = ["https://www.tikwm.com/api/", "https://tikwm.com/api/"];
  var USER_API = "https://ksjdjdmfmxm.x10.mx/tik1.php?user=";
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
    if (n == null || n === "") return "0";
    if (typeof n === "string" && /[KMB]$/i.test(n.trim())) return n.trim();
    n = Number(String(n).replace(/,/g, "")) || 0;
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

  /* ---------------- Phân loại Input (Video hay Username) ---------------- */
  function parseInput(raw) {
    var s = raw.trim();
    if (!s) return null;

    if (/\/(video|photo|v)\//i.test(s) || /(vm|vt)\.tiktok\.com/i.test(s) || /douyin\.com/i.test(s)) {
      return { type: "video", value: s };
    }

    var mProfile = s.match(/tiktok\.com\/@([a-zA-Z0-9._-]+)/i);
    if (mProfile) {
      return { type: "user", value: mProfile[1] };
    }

    if (/tiktok\.com/i.test(s)) {
      return { type: "video", value: s };
    }

    var cleanUser = s.replace(/^@/, "");
    if (/^[a-zA-Z0-9._-]{2,50}$/.test(cleanUser)) {
      return { type: "user", value: cleanUser };
    }

    return null;
  }

  /* ---------------- Gọi API Video (TikWM) ---------------- */
  function fetchInfo(url) {
    var i = 0;
    function attempt() {
      if (i >= ENDPOINTS.length) return Promise.reject(new Error("API video không phản hồi"));
      var ep = ENDPOINTS[i++];
      return fetch(ep + "?url=" + encodeURIComponent(url) + "&hd=1")
        .then(function (r) {
          return r.json();
        })
        .then(function (d) {
          if (!d || d.code !== 0 || !d.data) throw new Error((d && d.msg) || "Link video không hợp lệ");
          return d.data;
        })
        .catch(function (e) {
          if (i >= ENDPOINTS.length) throw e;
          return attempt();
        });
    }
    return attempt();
  }

  /* ---------------- Gọi API Check Info User (tik1.php) ---------------- */
  function fetchUserInfo(username) {
    var clean = String(username).replace(/^@/, "").trim();
    var targetUrl = USER_API + encodeURIComponent(clean);
    var proxyUrl = "https://corsproxy.io/?" + encodeURIComponent(targetUrl);

    return fetch(proxyUrl)
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (json) {
        if (!json || json.error || json.status === "error" || json.code === -1) {
          throw new Error(json.message || json.msg || json.error || "Không tìm thấy người dùng này");
        }
        return normalizeUserData(json, clean);
      });
  }

  /* Chuẩn hóa dữ liệu JSON */
  function normalizeUserData(raw, fallbackUser) {
    var d = raw.data || raw.user_info || raw.result || raw;
    var u = d.user || d.author || d;
    var st = d.stats || d.statistics || u;

    function pick(obj, keys, def) {
      for (var k = 0; k < keys.length; k++) {
        var val = obj && obj[keys[k]];
        if (val !== undefined && val !== null && val !== "") return val;
      }
      return def;
    }

    var uniqueId = pick(u, ["uniqueId", "unique_id", "username", "user", "id_name"], fallbackUser);
    var nickname = pick(u, ["nickname", "name", "fullname", "display_name", "title"], uniqueId);
    var uid = pick(u, ["id", "uid", "user_id", "secUid"], "");
    var avatar = pick(u, ["avatarLarger", "avatarMedium", "avatar", "avatarThumb", "profile_pic", "pic"], "");
    var bio = pick(u, ["signature", "bio", "description", "desc"], "");
    var verified = Boolean(pick(u, ["verified", "is_verified"], false));
    var privateAcc = Boolean(pick(u, ["privateAccount", "is_private", "secret"], false));
    var region = pick(u, ["region", "country", "language", "location"], "");

    var followers = pick(st, ["followerCount", "follower_count", "followers", "fans", "sub_count"], 0);
    var following = pick(st, ["followingCount", "following_count", "following", "followings"], 0);
    var hearts = pick(st, ["heartCount", "heart", "heart_count", "total_favorited", "likes", "digg_count"], 0);
    var videos = pick(st, ["videoCount", "video_count", "videos", "aweme_count"], 0);

    return {
      uniqueId: uniqueId,
      nickname: nickname,
      uid: uid,
      avatar: avatar,
      bio: bio,
      verified: verified,
      privateAcc: privateAcc,
      region: region,
      followers: followers,
      following: following,
      hearts: hearts,
      videos: videos,
      raw: raw
    };
  }

  /* ---------------- Tải file kèm tiến trình ---------------- */
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

  /* ---------------- Lịch sử ---------------- */
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
    if (!box || !list) return;
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

  /* ---------------- Giao diện kết quả ---------------- */
  function loading(label) {
    var d = document.createElement("div");
    d.className = "box loading";
    d.innerHTML = '<span class="spin"></span><span>Đang lấy dữ liệu: ' + esc(label.slice(0, 70)) + "...</span>";
    out.appendChild(d);
    return d;
  }

  function errorBox(msg, label) {
    var d = document.createElement("div");
    d.className = "err";
    d.innerHTML = "<b>Không lấy được dữ liệu.</b><br />" + esc(msg) + "<br /><small>" + esc(label) + "</small>";
    out.appendChild(d);
  }

  /* Render Thẻ Thông Tin User */
  function renderUser(u, targetCard) {
    var card = document.createElement("div");
    card.className = "vcard ucard";

    var badges = "";
    if (u.verified) badges += ' <span title="Tích xanh" style="color:#20d5ec">&#10004;</span>';
    if (u.privateAcc) badges += ' <span title="Tài khoản riêng tư">&#128274;</span>';

    var metaHtml = [];
    if (u.uid) metaHtml.push("<b>UID:</b> " + esc(u.uid));
    if (u.region) metaHtml.push("<b>Khu vực:</b> " + esc(u.region));

    card.innerHTML =
      '<div class="shot">' +
      (u.avatar ? '<img src="' + esc(u.avatar) + '" alt="Avatar" />' : "<span>&#128100;</span>") +
      '<span class="dur">INFO</span>' +
      "</div>" +
      "<div>" +
      '<div class="who">' +
      (u.avatar ? '<img src="' + esc(u.avatar) + '" alt="" />' : "") +
      "<div><b>" +
      esc(u.nickname) +
      badges +
      "</b><span>@" +
      esc(u.uniqueId) +
      "</span></div></div>" +
      '<p class="ttl">' +
      (u.bio ? esc(u.bio) : "<i>(Chưa có tiểu sử)</i>") +
      "</p>" +
      (metaHtml.length
        ? '<p class="ttl" style="font-size:0.85em;opacity:0.85;margin-top:4px">' + metaHtml.join(" &bull; ") + "</p>"
        : "") +
      '<div class="stats">' +
      "<span>&#128101; <b>" +
      num(u.followers) +
      "</b> Follower</span>" +
      "<span>&#10145; <b>" +
      num(u.following) +
      "</b> Đang follow</span>" +
      "<span>&#9829; <b>" +
      num(u.hearts) +
      "</b> Thích</span>" +
      "<span>&#127916; <b>" +
      num(u.videos) +
      "</b> Video</span>" +
      "</div>" +
      '<div class="dls"></div>' +
      '<div class="prog" hidden><i></i></div>' +
      "</div>";

    var dls = card.querySelector(".dls");
    var bar = card.querySelector(".prog");
    var base = "tiktok_user_" + safeName(u.uniqueId);

    if (u.avatar) {
      var btnAvt = document.createElement("button");
      btnAvt.type = "button";
      btnAvt.className = "dl main";
      btnAvt.innerHTML = "&#128444; Tải Avatar HD";
      btnAvt.addEventListener("click", function () {
        download(u.avatar, base + "_avatar.jpg", btnAvt, bar);
      });
      dls.appendChild(btnAvt);
    }

    if (u.uid) {
      var btnCopy = document.createElement("button");
      btnCopy.type = "button";
      btnCopy.className = "dl";
      btnCopy.innerHTML = "&#128203; Copy UID";
      btnCopy.addEventListener("click", function () {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(String(u.uid));
          var old = btnCopy.innerHTML;
          btnCopy.innerHTML = "&#10003; Đã copy UID";
          setTimeout(function () {
            btnCopy.innerHTML = old;
          }, 1800);
        }
      });
      dls.appendChild(btnCopy);
    }

    var profLink = document.createElement("a");
    profLink.className = "dl";
    profLink.href = "https://www.tiktok.com/@" + encodeURIComponent(u.uniqueId);
    profLink.target = "_blank";
    profLink.rel = "noopener";
    profLink.innerHTML = "&#128279; Mở trang cá nhân";
    dls.appendChild(profLink);

    if (targetCard && targetCard.parentNode) {
      targetCard.parentNode.insertBefore(card, targetCard.nextSibling);
    } else {
      out.appendChild(card);
    }

    pushHist({
      url: "@" + u.uniqueId,
      title: "Info: " + u.nickname + " (" + num(u.followers) + " flw)",
      author: u.uniqueId
    });
  }

  /* Render Thẻ Tải Video */
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

    if (nick) {
      var btnInfo = document.createElement("button");
      btnInfo.type = "button";
      btnInfo.className = "dl";
      btnInfo.innerHTML = "&#128100; Check Info Kênh";
      btnInfo.addEventListener("click", function () {
        btnInfo.disabled = true;
        btnInfo.innerHTML = "&#8987; Đang check...";
        fetchUserInfo(nick)
          .then(function (uData) {
            btnInfo.innerHTML = "&#10003; Đã hiện Info";
            renderUser(uData, card);
          })
          .catch(function (err) {
            btnInfo.disabled = false;
            btnInfo.innerHTML = "&#128100; Check Info Kênh";
            alert("Lỗi check info @" + nick + ": " + (err.message || "Không xác định"));
          });
      });
      dls.appendChild(btnInfo);
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

  /* ---------------- Chạy xử lý ---------------- */
  function run() {
    var rawList = $("urls").value.split(/[\s,]+/).filter(Boolean);
    var tasks = rawList.map(parseInput).filter(Boolean);
    out.innerHTML = "";

    if (!tasks.length) {
      errorBox(
        "Nhập link video TikTok (để tải video) hoặc nhập @username / link profile (để check info tài khoản).",
        rawList[0] || ""
      );
      return;
    }

    $("go").disabled = true;
    var chain = Promise.resolve();

    tasks.slice(0, 8).forEach(function (item) {
      chain = chain.then(function () {
        var label = item.type === "user" ? "@" + item.value : item.value;
        var box = loading(label);

        if (item.type === "user") {
          return fetchUserInfo(item.value)
            .then(function (uData) {
              box.remove();
              renderUser(uData);
            })
            .catch(function (e) {
              box.remove();
              errorBox(e.message || "Lỗi check info user", label);
            });
        } else {
          return fetchInfo(item.value)
            .then(function (info) {
              box.remove();
              render(item.value, info);
            })
            .catch(function (e) {
              box.remove();
              errorBox(e.message || "Lỗi không xác định", label);
              return new Promise(function (r) {
                setTimeout(r, 400);
              });
            });
        }
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
  if ($("hist-clear")) {
    $("hist-clear").addEventListener("click", function () {
      try {
        localStorage.removeItem(HIST_KEY);
      } catch (e) {
        /* ignore */
      }
      renderHist();
    });
  }
  $("urls").addEventListener("keydown", function (ev) {
    if (ev.key === "Enter" && (ev.ctrlKey || ev.metaKey)) run();
  });

  renderHist();
  $("urls").focus();
})();
