/* ==================================================================
   music.js — trang nghe nhạc (không cần server, không cần API key)
   Nguồn nhạc: iTunes (nghe thử 30 giây) • Archive.org (nguyên bài)
              • file trong máy bạn • link dán trực tiếp
   ================================================================== */
(function () {
  "use strict";

  var $ = function (id) {
    return document.getElementById(id);
  };
  var audio = $("audio");

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
    $("fav-count").textContent = favs.length;
  }

  function isFav(t) {
    if (!t) return false;
    return favs.some(function (f) {
      return f.src === t.src;
    });
  }

  function toggleFav(t) {
    if (!t) return;
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
    return { src: src, title: title || "Không rõ tên", artist: artist || "", cover: cover || "" };
  }

  function publish(d) {
    try {
      localStorage.setItem("ka_nowplaying", JSON.stringify(d));
    } catch (e) {
      /* ignore */
    }
  }

  /* ---------------- phát nhạc ---------------- */
  function playTrack(t, list) {
    if (list && list.length) {
      queue = list.slice();
      index = queue.findIndex(function (x) {
        return x.src === t.src;
      });
      if (index < 0) index = 0;
    }
    current = t;
    audio.src = t.src;
    audio.volume = parseFloat($("vol").value) / 100;
    var p = audio.play();
    if (p && p.catch)
      p.catch(function () {
        setStatus("Trình duyệt chặn phát tự động — bấm nút ▶ để nghe.");
      });
    paintNow();
    markPlaying();
  }

  function paintNow() {
    if (!current) return;
    $("p-title").textContent = current.title;
    $("p-artist").textContent = current.artist;
    var c = $("cover");
    if (current.cover) {
      c.innerHTML = '<img src="' + current.cover + '" alt="" />';
    } else {
      c.innerHTML = "<span>&#127925;</span>";
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
    var btn = document.querySelector('.card[data-src="' + (current ? current.src.replace(/"/g, "") : "") + '"] .ico');
    if (btn) btn;
    syncFavIcons();
  }

  function syncFavIcons() {
    var btns = document.querySelectorAll(".card .ico");
    for (var i = 0; i < btns.length; i++) {
      var card = btns[i].closest(".card");
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
    aa.textContent = t.artist || (extra || "");
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
    box.innerHTML = "";
    if (!list.length) {
      var p = document.createElement("p");
      p.className = "hint";
      p.textContent = "Không có bài nào.";
      box.appendChild(p);
      return;
    }
    list.forEach(function (t, i) {
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
  }

  /* ---------------- nguồn 1: iTunes (30 giây) ---------------- */
  function searchItunes(q) {
    setStatus("Đang tìm trên iTunes...");
    $("results").innerHTML = "";
    var url = "https://itunes.apple.com/search?media=music&entity=song&limit=24&term=" + encodeURIComponent(q);
    return fetch(url)
      .then(function (r) {
        return r.json();
      })
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
          setStatus("Không tìm thấy bài nào. Thử từ khoá khác nhé.");
          return;
        }
        setStatus("Tìm thấy " + list.length + " bài (nghe thử 30 giây mỗi bài).");
        renderInto($("results"), list, "iTunes");
      })
      .catch(function () {
        setStatus("Không kết nối được nguồn nhạc. Kiểm tra mạng rồi thử lại.");
      });
  }

  /* ---------------- nguồn 2: Archive.org (nguyên bài) ---------------- */
  function searchArchive(q) {
    setStatus("Đang tìm trên Archive.org...");
    $("results").innerHTML = "";
    var url =
      "https://archive.org/advancedsearch.php?q=" +
      encodeURIComponent(q + " AND mediatype:(audio)") +
      "&fl%5B%5D=identifier&fl%5B%5D=title&fl%5B%5D=creator&fl%5B%5D=year&rows=20&page=1&output=json";
    return fetch(url)
      .then(function (r) {
        return r.json();
      })
      .then(function (d) {
        var docs = (d.response && d.response.docs) || [];
        if (!docs.length) {
          setStatus("Không tìm thấy. Thử từ khoá tiếng Anh (ví dụ: jazz, piano, lofi).");
          return;
        }
        setStatus("Tìm thấy " + docs.length + " album / bản thu. Bấm vào để xem danh sách bài.");
        var box = $("results");
        box.innerHTML = "";
        docs.forEach(function (doc) {
          var t = track(
            "archive:" + doc.identifier,
            doc.title || doc.identifier,
            (doc.creator ? doc.creator + " • " : "") + (doc.year || "") + " Archive.org",
            ""
          );
          box.appendChild(
            card(t, null, function () {
              openArchive(doc);
            })
          );
        });
      })
      .catch(function () {
        setStatus("Không kết nối được Archive.org. Thử lại sau nhé.");
      });
  }

  function openArchive(doc) {
    setStatus("Đang mở album...");
    fetch("https://archive.org/metadata/" + doc.identifier)
      .then(function (r) {
        return r.json();
      })
      .then(function (md) {
        var files = (md.files || []).filter(function (f) {
          return /\.(mp3|m4a|ogg)$/i.test(f.name) && f.source !== "metadata";
        });
        if (!files.length) {
          setStatus("Album này không có file nghe được.");
          return;
        }
        var list = files.map(function (f) {
          return track(
            "https://archive.org/download/" + doc.identifier + "/" + f.name.split("/").map(encodeURIComponent).join("/"),
            (f.title && f.title !== "VBR MP3" ? f.title : f.name.replace(/\.[^.]+$/, "")) || f.name,
            doc.creator || doc.title || "Archive.org",
            ""
          );
        });
        setStatus(files.length + " bài • " + (doc.title || doc.identifier));
        var box = $("results");
        box.innerHTML = "";
        var back = document.createElement("button");
        back.type = "button";
        back.className = "chip";
        back.innerHTML = "&#8592; Quay lại kết quả";
        back.addEventListener("click", function () {
          searchArchive($("q").value.trim() || "lofi");
        });
        box.appendChild(back);
        list.forEach(function (t) {
          box.appendChild(
            card(t, null, function () {
              playTrack(t, list);
            })
          );
        });
      })
      .catch(function () {
        setStatus("Không mở được album này.");
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
      setStatus("");
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
          localList.push(track("./music/" + s.file, s.title || s.file, s.artist || "My playlist", s.cover || ""));
        });
        renderInto($("local-results"), localList, "Playlist");
        setStatus("Đã nạp " + arr.length + " bài từ music/playlist.json");
      })
      .catch(function () {
        alert(
          "Chưa có file music/playlist.json.\n\nTạo file đó trong project với nội dung:\n" +
            '[\n  { "title": "Tên bài", "artist": "Ca sĩ", "file": "bai-hat.mp3" }\n]\n\n' +
            "và copy file nhạc .mp3 vào thư mục music/ nhé."
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
  // tabs
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

  // nguồn online
  var srcs = document.querySelectorAll(".chip.src");
  for (var s = 0; s < srcs.length; s++) {
    srcs[s].addEventListener("click", function () {
      for (var j = 0; j < srcs.length; j++) srcs[j].classList.remove("is-active");
      this.classList.add("is-active");
      srcMode = this.dataset.src;
      var q = $("q").value.trim();
      if (q) runSearch(q);
      else setStatus(srcMode === "itunes" ? "Nhập tên bài rồi bấm Tìm." : "Nhập từ khoá rồi bấm Tìm.");
    });
  }

  function runSearch(q) {
    if (srcMode === "archive") return searchArchive(q);
    return searchItunes(q);
  }

  $("search-form").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var q = $("q").value.trim();
    if (!q) return;
    runSearch(q);
  });

  var quicks = document.querySelectorAll("#quick .chip");
  for (var qi = 0; qi < quicks.length; qi++) {
    quicks[qi].addEventListener("click", function () {
      $("q").value = this.dataset.q;
      runSearch(this.dataset.q);
    });
  }

  // file trong máy
  $("file-input").addEventListener("change", function () {
    addLocalFiles(this.files || []);
  });
  $("load-json").addEventListener("click", loadPlaylistJson);

  // dán link
  $("link-form").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var v = $("link-input").value.trim();
    if (!v) return;
    var name = v.split("/").pop().split("?")[0] || "Link";
    var t = track(v, decodeURIComponent(name), "Từ link");
    playTrack(t, [t]);
  });

  // player
  $("btn-play").addEventListener("click", function () {
    if (!current) {
      if (queue.length) playTrack(queue[0]);
      return;
    }
    if (audio.paused) audio.play();
    else audio.pause();
  });
  $("btn-next").addEventListener("click", function () {
    nextTrack(false);
  });
  $("btn-prev").addEventListener("click", prevTrack);
  $("btn-shuffle").addEventListener("click", function () {
    shuffle = !shuffle;
    this.classList.toggle("on", shuffle);
  });
  $("btn-repeat").addEventListener("click", function () {
    repeat = (repeat + 1) % 3;
    this.classList.toggle("on", repeat > 0);
    this.innerHTML = repeat === 2 ? "&#128257;<sup>1</sup>" : "&#128257;";
    this.title = repeat === 0 ? "Lặp lại: tắt" : repeat === 1 ? "Lặp lại: cả danh sách" : "Lặp lại: 1 bài";
  });
  $("p-fav").addEventListener("click", function () {
    toggleFav(current);
  });

  audio.addEventListener("play", function () {
    $("btn-play").innerHTML = "&#10073;&#10073;";
    if (current) publish({ title: current.title, artist: current.artist, playing: true });
  });
  audio.addEventListener("pause", function () {
    $("btn-play").innerHTML = "&#9654;";
    if (current) publish({ title: current.title, artist: current.artist, playing: false });
  });
  audio.addEventListener("ended", function () {
    nextTrack(true);
  });
  audio.addEventListener("timeupdate", function () {
    if (!audio.duration) return;
    $("cur").textContent = fmt(audio.currentTime);
    $("dur").textContent = fmt(audio.duration);
    $("seek").value = Math.round((audio.currentTime / audio.duration) * 1000);
  });
  audio.addEventListener("loadedmetadata", function () {
    $("dur").textContent = fmt(audio.duration);
  });
  audio.addEventListener("error", function () {
    if (current) setStatus("Bài này không phát được (nguồn chặn hoặc link hỏng).");
  });

  $("seek").addEventListener("input", function () {
    if (audio.duration) audio.currentTime = (this.value / 1000) * audio.duration;
  });
  $("vol").addEventListener("input", function () {
    audio.volume = this.value / 100;
    lastVol = audio.volume;
    $("vol-ico").innerHTML = audio.volume === 0 ? "&#128263;" : audio.volume < 0.5 ? "&#128265;" : "&#128266;";
  });
  $("vol-ico").addEventListener("click", function () {
    if (audio.volume > 0) {
      lastVol = audio.volume;
      audio.volume = 0;
      $("vol").value = 0;
    } else {
      audio.volume = lastVol || 0.8;
      $("vol").value = Math.round(audio.volume * 100);
    }
  });

  document.addEventListener("keydown", function (ev) {
    if (ev.target && /input|textarea/i.test(ev.target.tagName)) return;
    if (ev.code === "Space") {
      ev.preventDefault();
      $("btn-play").click();
    }
    if (ev.code === "ArrowRight" && audio.duration) audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
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
  saveFavs();
  renderFavs();
  $("vol").value = 80;
  audio.volume = 0.8;
  setStatus("Nhập tên bài hát rồi bấm Tìm — hoặc bấm thử một từ khoá bên dưới.");
  searchItunes("lofi chill");
})();
