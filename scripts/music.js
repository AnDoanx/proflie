/* ==================================================================
   music.js — trang nghe nhạc (không cần server, không cần API key)
   Nguồn nhạc:
   1. iTunes + Deezer JSONP (Nghe thử 30s - Vượt mọi chặn CORS 100%)
   2. Audius Network API (Nghe nguyên bài Full Track - Tốc độ cao)
   3. File trong máy bạn • Link dán trực tiếp
   ================================================================== */
(function () {
  "use strict";

  var $ = function (id) {
    return document.getElementById(id);
  };
  var audio = $("audio");

  if (audio) {
    audio.removeAttribute("crossorigin");
  }

  /* ---------------- trạng thái ---------------- */
  var queue = [];
  var index = -1;
  var current = null;
  var shuffle = false;
  var repeat = 0; // 0 = tắt, 1 = lặp hết, 2 = lặp 1 bài
  var lastVol = 0.8;
  var srcMode = "itunes";

  var FAV_KEY = "ka_favs";
  var favs = [];
  try {
    favs = JSON.parse(localStorage.getItem(FAV_KEY) || "[]") || [];
  } catch (e) {
    favs = [];
  }

  function saveFavs() {
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify(favs));
    } catch (e) {
      /* ignore */
    }
    if ($("fav-count")) $("fav-count").textContent = favs.length;
  }

  function isFav(t) {
    if (!t || !t.src) return false;
    return favs.some(function (f) {
      return f.src === t.src;
    });
  }

  function toggleFav(t) {
    if (!t || !t.src || t.src.indexOf("archive:") === 0) return;
    if (isFav(t)) {
      favs = favs.filter(function (f) {
        return f.src !== t.src;
      });
    } else {
      favs.unshift({ title: t.title, artist: t.artist, src: t.src, cover: t.cover });
      favs = favs.slice(0, 60);
    }
    saveFavs();
    renderFavs();
    paintFav();
    markPlaying();
  }

  function paintFav() {
    var b = $("p-fav");
    if (!b) return;
    if (isFav(current)) {
      b.classList.add("on");
      b.innerHTML = "&#9829;";
    } else {
      b.classList.remove("on");
      b.innerHTML = "&#9825;";
    }
  }

  /* ---------------- helpers ---------------- */
  function fmt(sec) {
    if (!isFinite(sec) || sec < 0) sec = 0;
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  function setStatus(msg) {
    var el = $("online-status");
    if (el) el.textContent = msg || "";
  }

  function esc(s) {
    return String(s == null ? "" : s);
  }

  function track(src, title, artist, cover) {
    return {
      src: src,
      title: title || "Không rõ tên",
      artist: artist || "Nghệ sĩ",
      cover: cover || "",
    };
  }

  function publish(d) {
    try {
      localStorage.setItem("ka_nowplaying", JSON.stringify(d));
    } catch (e) {
      /* ignore */
    }
  }

  function jsonp(url, callbackParam) {
    return new Promise(function (resolve, reject) {
      var cbName = "ka_jsonp_" + Date.now() + "_" + Math.floor(Math.random() * 100000);
      var script = document.createElement("script");
      var timer = setTimeout(function () {
        cleanup();
        reject(new Error("Timeout"));
      }, 10000);

      function cleanup() {
        clearTimeout(timer);
        delete window[cbName];
        if (script.parentNode) script.parentNode.removeChild(script);
      }

      window[cbName] = function (data) {
        cleanup();
        resolve(data);
      };

      var sep = url.indexOf("?") >= 0 ? "&" : "?";
      script.src = url + sep + (callbackParam || "callback") + "=" + cbName;
      script.onerror = function () {
        cleanup();
        reject(new Error("Script load error"));
      };
      document.head.appendChild(script);
    });
  }

  /* ---------------- phát nhạc ---------------- */
  function playTrack(t, list) {
    if (!t || !t.src) return;
    if (list && list.length) {
      queue = list.slice();
      index = queue.findIndex(function (x) {
        return x.src === t.src;
      });
      if (index < 0) index = 0;
    }
    current = t;
    setStatus("⏳ Đang kết nối âm thanh: " + t.title + "...");

    audio.pause();
    audio.src = t.src;
    audio.load();
    if ($("vol")) {
      audio.volume = parseFloat($("vol").value) / 100;
    }

    var p = audio.play();
    if (p && p.then) {
      p.then(function () {
        setStatus("🎧 Đang phát: " + t.title + " — " + t.artist);
      }).catch(function (err) {
        if (err.name === "NotAllowedError") {
          setStatus("👉 Bấm nút ▶ ở thanh điều khiển bên dưới để bắt đầu nghe.");
        } else {
          setStatus("⚠️ Không phát được bài này, đang thử chuyển bài...");
        }
      });
    }
    paintNow();
    markPlaying();
  }

  function paintNow() {
    if (!current) return;
    if ($("p-title")) $("p-title").textContent = current.title;
    if ($("p-artist")) $("p-artist").textContent = current.artist;
    var c = $("cover");
    if (c) {
      if (current.cover) {
        c.innerHTML = '<img src="' + current.cover + '" alt="" />';
      } else {
        c.innerHTML = "<span>&#127925;</span>";
      }
    }
    paintFav();
    if ("mediaSession" in navigator) {
      try {
        navigator.mediaSession.metadata = new window.MediaMetadata({
          title: current.title,
          artist: current.artist || "Khoa An",
          album: "Khoa An Music",
          artwork: current.cover ? [{ src: current.cover }] : [],
        });
      } catch (e) {
        /* ignore */
      }
    }
  }

  function markPlaying() {
    var cards = document.querySelectorAll(".card");
    for (var i = 0; i < cards.length; i++) {
      var on = current && cards[i].dataset.src === current.src;
      cards[i].classList.toggle("is-playing", !!on);
    }
    syncFavIcons();
  }

  function syncFavIcons() {
    var btns = document.querySelectorAll(".card .ico");
    for (var i = 0; i < btns.length; i++) {
      var card = btns[i].closest(".card");
      if (!card) continue;
      var t = {
        src: card.dataset.src,
        title: card.dataset.title,
        artist: card.dataset.artist,
        cover: card.dataset.cover,
      };
      var on = isFav(t);
      btns[i].classList.toggle("on", on);
      btns[i].innerHTML = on ? "&#9829;" : "&#9825;";
    }
  }

  function nextTrack(auto) {
    if (!queue.length) return;
    if (repeat === 2 && auto) {
      audio.currentTime = 0;
      audio.play();
      return;
    }
    if (shuffle) {
      index = Math.floor(Math.random() * queue.length);
    } else {
      index++;
      if (index >= queue.length) {
        if (auto && repeat === 0) {
          index = 0;
          audio.pause();
          return;
        }
        index = 0;
      }
    }
    playTrack(queue[index]);
  }

  function prevTrack() {
    if (!queue.length) return;
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    index = index <= 0 ? queue.length - 1 : index - 1;
    playTrack(queue[index]);
  }

  /* ---------------- dựng thẻ bài hát ---------------- */
  function card(t, iconOrHeart, onClick, extra) {
    var b = document.createElement("div");
    b.className = "card";
    b.dataset.src = t.src;
    b.dataset.title = esc(t.title);
    b.dataset.artist = esc(t.artist);
    b.dataset.cover = esc(t.cover);

    var th = document.createElement("div");
    th.className = "thumb";
    th.innerHTML = t.cover ? '<img src="' + t.cover + '" alt="" loading="lazy" />' : "<span>&#127925;</span>";

    var tx = document.createElement("div");
    tx.className = "txt";
    var tt = document.createElement("div");
    tt.className = "t";
    tt.textContent = t.title;
    var aa = document.createElement("div");
    aa.className = "a";
    aa.textContent = t.artist || extra || "";
    tx.appendChild(tt);
    tx.appendChild(aa);

    var ic = document.createElement("button");
    ic.className = "ico";
    ic.type = "button";
    ic.title = "Yêu thích";
    ic.innerHTML = isFav(t) ? "&#9829;" : "&#9825;";
    ic.addEventListener("click", function (ev) {
      ev.stopPropagation();
      toggleFav(t);
    });

    b.appendChild(th);
    b.appendChild(tx);
    b.appendChild(ic);
    b.addEventListener("click", onClick);
    return b;
  }

  function renderInto(box, list, extra) {
    if (!box) return;
    box.innerHTML = "";
    if (!list.length) {
      var p = document.createElement("p");
      p.className = "hint";
      p.textContent = "Chưa có bài hát nào trong mục này.";
      box.appendChild(p);
      return;
    }
    list.forEach(function (t) {
      box.appendChild(
        card(
          t,
          null,
          function () {
            playTrack(t, list);
          },
          extra
        )
      );
    });
    markPlaying();
  }

  /* ---------------- nguồn 1: iTunes + Deezer JSONP ---------------- */
  function searchItunes(q) {
    setStatus("🔍 Đang tìm kiếm \"" + q + "\"...");
    $("results").innerHTML = "";
    var url =
      "https://itunes.apple.com/search?media=music&entity=song&limit=28&country=VN&term=" +
      encodeURIComponent(q);

    return jsonp(url, "callback")
      .then(function (d) {
        var list = (d.results || [])
          .filter(function (r) {
            return r.previewUrl;
          })
          .map(function (r) {
            return track(
              r.previewUrl,
              r.trackName,
              r.artistName + (r.collectionName ? " • " + r.collectionName : ""),
              (r.artworkUrl100 || "").replace("100x100", "300x300")
            );
          });
        if (!list.length) {
          return searchDeezer(q);
        }
        setStatus("✨ Tìm thấy " + list.length + " bài hát — Bấm vào bài bất kỳ để phát ngay.");
        renderInto($("results"), list, "iTunes");
      })
      .catch(function () {
        return searchDeezer(q);
      });
  }

  function searchDeezer(q) {
    setStatus("🔍 Đang tìm trên kho nhạc Deezer...");
    var url = "https://api.deezer.com/search?output=jsonp&limit=28&q=" + encodeURIComponent(q);
    return jsonp(url, "callback")
      .then(function (d) {
        var list = ((d && d.data) || [])
          .filter(function (r) {
            return r.preview;
          })
          .map(function (r) {
            return track(
              r.preview,
              r.title,
              (r.artist ? r.artist.name : "") + (r.album ? " • " + r.album.title : ""),
              r.album ? r.album.cover_medium || r.album.cover : ""
            );
          });
        if (!list.length) {
          setStatus("Không tìm thấy bài nào khớp với từ khoá. Thử tên khác nhé!");
          return;
        }
        setStatus("✨ Tìm thấy " + list.length + " bài trên Deezer — Bấm vào để nghe.");
        renderInto($("results"), list, "Deezer");
      })
      .catch(function () {
        setStatus("⚠️ Không kết nối được nguồn nhạc. Hãy kiểm tra mạng của bạn.");
      });
  }

  /* ---------------- nguồn 2: Audius (Full Track) ---------------- */
  function searchArchive(q) {
    setStatus("🔍 Đang tìm bản Full nguyên bài cho \"" + q + "\"...");
    $("results").innerHTML = "";
    var url =
      "https://discoveryprovider.audius.co/v1/tracks/search?query=" +
      encodeURIComponent(q) +
      "&app_name=ka_music_player";

    return fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error("Audius error");
        return r.json();
      })
      .then(function (d) {
        var docs = (d && d.data) || [];
        if (!docs.length) {
          return searchDeezer(q);
        }
        var list = docs.slice(0, 28).map(function (item) {
          var streamUrl =
            "https://discoveryprovider.audius.co/v1/tracks/" +
            item.id +
            "/stream?app_name=ka_music_player";
          var cover = item.artwork ? item.artwork["480x480"] || item.artwork["150x150"] || "" : "";
          var durText = item.duration ? " • " + fmt(item.duration) : "";
          var artist = (item.user && (item.user.name || item.user.handle)) || "Audius Artist";
          return track(streamUrl, item.title, artist + durText + " (Full)", cover);
        });
        setStatus("🎵 Tìm thấy " + list.length + " bản Full nguyên bài — Bấm vào để thưởng thức!");
        renderInto($("results"), list, "Full Track");
      })
      .catch(function () {
        return searchDeezer(q);
      });
  }

  /* ---------------- nguồn 3: file trong máy ---------------- */
  var localList = [];

  function addLocalFiles(files) {
    for (var i = 0; i < files.length; i++) {
      var f = files[i];
      if (!/^audio\//.test(f.type) && !/\.(mp3|m4a|ogg|wav|flac|aac)$/i.test(f.name)) continue;
      localList.push(track(URL.createObjectURL(f), f.name.replace(/\.[^.]+$/, ""), "File trong máy", ""));
    }
    renderInto($("local-results"), localList, "File trong máy");
    if (localList.length) {
      playTrack(localList[localList.length - 1], localList);
    }
  }

  function loadPlaylistJson() {
    fetch("./music/playlist.json", { cache: "no-store" })
      .then(function (r) {
        if (!r.ok) throw new Error("no file");
        return r.json();
      })
      .then(function (d) {
        var arr = Array.isArray(d) ? d : d.songs || [];
        arr.forEach(function (s) {
          localList.push(
            track("./music/" + s.file, s.title || s.file, s.artist || "My playlist", s.cover || "")
          );
        });
        renderInto($("local-results"), localList, "Playlist");
        setStatus("✅ Đã nạp " + arr.length + " bài từ music/playlist.json");
      })
      .catch(function () {
        alert(
          "Chưa tìm thấy file music/playlist.json.\n\nHãy tạo file đó trong thư mục project với cấu trúc:\n" +
            '[\n  { "title": "Tên bài", "artist": "Ca sĩ", "file": "bai-hat.mp3" }\n]'
        );
      });
  }

  /* ---------------- nguồn 4: yêu thích ---------------- */
  function renderFavs() {
    var box = $("fav-results");
    if (!box) return;
    var list = favs.map(function (f) {
      return track(f.src, f.title, f.artist, f.cover);
    });
    renderInto(box, list, "Yêu thích");
    markPlaying();
  }

  /* ---------------- gắn sự kiện ---------------- */
  var tabs = document.querySelectorAll(".tab");
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", function () {
      var name = this.dataset.tab;
      for (var j = 0; j < tabs.length; j++) tabs[j].classList.remove("is-active");
      this.classList.add("is-active");
      var panes = document.querySelectorAll(".pane");
      for (var k = 0; k < panes.length; k++) panes[k].classList.remove("is-active");
      var pane = $("pane-" + name);
      if (pane) pane.classList.add("is-active");
      if (name === "fav") renderFavs();
    });
  }

  var srcs = document.querySelectorAll(".chip.src");
  for (var s = 0; s < srcs.length; s++) {
    srcs[s].addEventListener("click", function () {
      for (var j = 0; j < srcs.length; j++) srcs[j].classList.remove("is-active");
      this.classList.add("is-active");
      srcMode = this.dataset.src;
      var q = $("q").value.trim() || "lofi chill";
      runSearch(q);
    });
  }

  function runSearch(q) {
    if (srcMode === "archive") return searchArchive(q);
    return searchItunes(q);
  }

  if ($("search-form")) {
    $("search-form").addEventListener("submit", function (ev) {
      ev.preventDefault();
      var q = $("q").value.trim();
      if (!q) return;
      runSearch(q);
    });
  }

  var quicks = document.querySelectorAll("#quick .chip");
  for (var qi = 0; qi < quicks.length; qi++) {
    quicks[qi].addEventListener("click", function () {
      $("q").value = this.dataset.q;
      runSearch(this.dataset.q);
    });
  }

  if ($("file-input")) {
    $("file-input").addEventListener("change", function () {
      addLocalFiles(this.files || []);
    });
  }
  if ($("load-json")) {
    $("load-json").addEventListener("click", loadPlaylistJson);
  }

  if ($("link-form")) {
    $("link-form").addEventListener("submit", function (ev) {
      ev.preventDefault();
      var v = $("link-input").value.trim();
      if (!v) return;
      var name = v.split("/").pop().split("?")[0] || "Link nhạc";
      var t = track(v, decodeURIComponent(name), "Từ đường dẫn trực tiếp");
      playTrack(t, [t]);
    });
  }

  if ($("btn-play")) {
    $("btn-play").addEventListener("click", function () {
      if (!current) {
        if (queue.length) playTrack(queue[0]);
        return;
      }
      if (audio.paused) audio.play();
      else audio.pause();
    });
  }
  if ($("btn-next")) {
    $("btn-next").addEventListener("click", function () {
      nextTrack(false);
    });
  }
  if ($("btn-prev")) {
    $("btn-prev").addEventListener("click", prevTrack);
  }
  if ($("btn-shuffle")) {
    $("btn-shuffle").addEventListener("click", function () {
      shuffle = !shuffle;
      this.classList.toggle("on", shuffle);
    });
  }
  if ($("btn-repeat")) {
    $("btn-repeat").addEventListener("click", function () {
      repeat = (repeat + 1) % 3;
      this.classList.toggle("on", repeat > 0);
      this.innerHTML = repeat === 2 ? "&#128257;<sup>1</sup>" : "&#128257;";
      this.title =
        repeat === 0 ? "Lặp lại: tắt" : repeat === 1 ? "Lặp lại: cả danh sách" : "Lặp lại: 1 bài";
    });
  }
  if ($("p-fav")) {
    $("p-fav").addEventListener("click", function () {
      toggleFav(current);
    });
  }

  audio.addEventListener("play", function () {
    document.body.classList.add("is-playing");
    if ($("btn-play")) $("btn-play").innerHTML = "&#10073;&#10073;";
    if (current) publish({ title: current.title, artist: current.artist, playing: true });
  });
  audio.addEventListener("pause", function () {
    document.body.classList.remove("is-playing");
    if ($("btn-play")) $("btn-play").innerHTML = "&#9654;";
    if (current) publish({ title: current.title, artist: current.artist, playing: false });
  });
  audio.addEventListener("ended", function () {
    nextTrack(true);
  });
  audio.addEventListener("timeupdate", function () {
    if (!audio.duration) return;
    if ($("cur")) $("cur").textContent = fmt(audio.currentTime);
    if ($("dur")) $("dur").textContent = fmt(audio.duration);
    if ($("seek")) $("seek").value = Math.round((audio.currentTime / audio.duration) * 1000);
  });
  audio.addEventListener("loadedmetadata", function () {
    if ($("dur")) $("dur").textContent = fmt(audio.duration);
  });
  audio.addEventListener("error", function () {
    if (current) {
      setStatus("⚠️ Link nhạc này bị lỗi, đang tự chuyển sang bài kế tiếp...");
      setTimeout(function () {
        if (queue.length > 1) nextTrack(true);
      }, 1500);
    }
  });

  if ($("seek")) {
    $("seek").addEventListener("input", function () {
      if (audio.duration) audio.currentTime = (this.value / 1000) * audio.duration;
    });
  }
  if ($("vol")) {
    $("vol").addEventListener("input", function () {
      audio.volume = this.value / 100;
      lastVol = audio.volume;
      if ($("vol-ico")) {
        $("vol-ico").innerHTML =
          audio.volume === 0 ? "&#128263;" : audio.volume < 0.5 ? "&#128265;" : "&#128266;";
      }
    });
  }
  if ($("vol-ico")) {
    $("vol-ico").addEventListener("click", function () {
      if (audio.volume > 0) {
        lastVol = audio.volume;
        audio.volume = 0;
        if ($("vol")) $("vol").value = 0;
      } else {
        audio.volume = lastVol || 0.8;
        if ($("vol")) $("vol").value = Math.round(audio.volume * 100);
      }
    });
  }

  document.addEventListener("keydown", function (ev) {
    if (ev.target && /input|textarea/i.test(ev.target.tagName)) return;
    if (ev.code === "Space") {
      ev.preventDefault();
      if ($("btn-play")) $("btn-play").click();
    }
    if (ev.code === "ArrowRight" && audio.duration)
      audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
    if (ev.code === "ArrowLeft") audio.currentTime = Math.max(0, audio.currentTime - 5);
  });

  if ("mediaSession" in navigator) {
    try {
      navigator.mediaSession.setActionHandler("play", function () {
        audio.play();
      });
      navigator.mediaSession.setActionHandler("pause", function () {
        audio.pause();
      });
      navigator.mediaSession.setActionHandler("nexttrack", function () {
        nextTrack(false);
      });
      navigator.mediaSession.setActionHandler("previoustrack", prevTrack);
    } catch (e) {
      /* ignore */
    }
  }

  /* ---------------- khởi động ---------------- */
  favs = favs.filter(function (f) {
    return f && f.src && f.src.indexOf("archive:") !== 0;
  });
  saveFavs();
  renderFavs();
  if ($("vol")) $("vol").value = 80;
  audio.volume = 0.8;
  searchItunes("Sơn Tùng M-TP");
})();
