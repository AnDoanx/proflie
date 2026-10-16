/* ==================================================================
   skills.js — 8 ô kỹ năng tương tác trên trang chủ (Phiên bản Nâng cấp)
   ================================================================== */
(function () {
  "use strict";

  var SKILLS = [
    {
      id: "gaming",
      emoji: "🎮",
      name: "Gaming",
      sub: "FPS • MOBA • Souls-like",
      level: 88,
      c1: "#7a5cff",
      c2: "#59c1ff",
      desc: "Chơi game từ nhỏ, thể loại nào cũng thử. FPS là mạnh nhất, còn Souls-like thì nghiện vì… khó.",
      bars: [
        ["FPS / Bắn súng", 92],
        ["MOBA", 85],
        ["Souls-like", 78],
      ],
      chips: ["PC", "Valorant", "Liên Quân", "Minecraft", "Elden Ring"],
    },
    {
      id: "biker",
      emoji: "🏍️",
      name: "Biker",
      sub: "Kawasaki Ninja 400",
      level: 82,
      c1: "#ff7b7b",
      c2: "#ffb36b",
      desc: "Mê xe máy và những chuyến đi xa. Thích tự chăm xe, thay dầu, vệ sinh kim phun và đi tour cuối tuần.",
      bars: [
        ["Lái xe / xử lý tình huống", 86],
        ["Bảo dưỡng cơ bản", 74],
        ["Tour đường dài", 80],
      ],
      chips: ["Ninja 400", "Tour", "Độ xe", "Bảo dưỡng"],
    },
    {
      id: "anime",
      emoji: "🌸",
      name: "Anime & Manga",
      sub: "Otaku chính hiệu",
      level: 90,
      c1: "#ff8fd0",
      c2: "#ffd166",
      desc: "Xem anime mỗi tối, đọc manga và sưu tầm hình. Gu: slice of life, romance và mấy bộ nhạc nhẹ nhàng.",
      bars: [
        ["Anime", 95],
        ["Manga", 88],
        ["Sưu tầm / figure", 72],
      ],
      chips: ["Slice of life", "Romance", "Figure", "OST"],
    },
    {
      id: "video",
      emoji: "🎬",
      name: "Video Edit",
      sub: "CapCut • TikTok",
      level: 78,
      c1: "#59c1ff",
      c2: "#7a5cff",
      desc: "Tự dựng video cho kênh TikTok: cắt ghép, bắt trend, chèn hiệu ứng và đồng bộ nhạc theo nhịp.",
      bars: [
        ["Cắt ghép / nhịp", 85],
        ["Hiệu ứng & text", 76],
        ["Xử lý âm thanh", 72],
      ],
      chips: ["CapCut", "Premiere", "TikTok", "Nhạc trend"],
    },
    {
      id: "photo",
      emoji: "🎨",
      name: "Photo Edit",
      sub: "Photoshop • Lightroom",
      level: 74,
      c1: "#ffd166",
      c2: "#ff8fd0",
      desc: "Retouch ảnh chân dung, chỉnh màu theo mood và làm ảnh bìa cho video, poster.",
      bars: [
        ["Chỉnh màu / mood", 80],
        ["Retouch da & sáng", 78],
        ["Thiết kế poster", 65],
      ],
      chips: ["Photoshop", "Lightroom", "Canva"],
    },
    {
      id: "code",
      emoji: "💻",
      name: "Web & Code",
      sub: "HTML • CSS • JS",
      level: 66,
      c1: "#46e08a",
      c2: "#59c1ff",
      desc: "Tự làm và chỉnh trang web cá nhân này. Biết HTML/CSS/JS cơ bản và cách đưa web lên mạng.",
      bars: [
        ["HTML / CSS", 78],
        ["JavaScript", 62],
        ["Deploy / hosting", 56],
      ],
      chips: ["HTML", "CSS", "JS", "GitHub"],
    },
    {
      id: "lang",
      emoji: "🗣️",
      name: "Ngôn ngữ",
      sub: "VI • EN • 中文",
      level: 80,
      c1: "#ff9ad5",
      c2: "#7a5cff",
      desc: "Tiếng Việt là mẹ đẻ, tiếng Anh dùng hàng ngày, tiếng Trung đang học thêm.",
      bars: [
        ["Tiếng Việt", 100],
        ["English", 70],
        ["中文", 55],
      ],
      chips: ["Tiếng Việt", "English", "中文"],
    },
    {
      id: "music",
      emoji: "🎧",
      name: "Music",
      sub: "Lo-fi • V-pop • OST",
      level: 85,
      c1: "#7a5cff",
      c2: "#46e08a",
      desc: "Nghe nhạc cả ngày: lo-fi lúc làm việc, V-pop lúc đi đường và OST anime lúc tối.",
      bars: [
        ["Cảm âm / bắt nhạc", 88],
        ["Xếp playlist theo mood", 92],
        ["Hát", 60],
      ],
      chips: ["Lo-fi", "V-pop", "Anime OST", "Chill"],
    },
  ];

  var XP_KEY = "ka_skill_xp";
  var xp = {};
  try {
    xp = JSON.parse(localStorage.getItem(XP_KEY) || "{}") || {};
  } catch (e) {
    xp = {};
  }

  function saveXp() {
    try {
      localStorage.setItem(XP_KEY, JSON.stringify(xp));
    } catch (e) {
      /* ignore */
    }
  }

  function el(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }

  // Hiệu ứng âm thanh nhỏ khi bấm luyện tập (Sử dụng Web Audio API tích hợp sẵn)
  function playBeep() {
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // Nốt D5 vui tươi
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      // Bỏ qua nếu trình duyệt chặn AudioContext chưa tương tác
    }
  }

  // Tính danh hiệu dựa trên cấp độ kỹ năng hiện tại
  function getRankTitle(lvl) {
    if (lvl >= 95) return "🏆 Đại Sư Thần Sầu";
    if (lvl >= 90) return "🔥 Siêu Cao Thủ";
    if (lvl >= 85) return "⭐ Chuyên Gia";
    if (lvl >= 75) return "🎯 Lão Luyện";
    if (lvl >= 70) return "📘 Thành Thạo";
    return "🌱 Tập Sự";
  }

  /* ---------- Dựng 8 ô kỹ năng ---------- */
  var tiles = [];
  SKILLS.forEach(function (s, i) {
    var tile = document.getElementById("skill-" + (i + 1));
    if (!tile) return;
    tile.dataset.skill = s.id;
    tile.style.setProperty("--sk-c1", s.c1);
    tile.style.setProperty("--sk-c2", s.c2);
    
    var currentXp = xp[s.id] || 0;
    var currentLvl = Math.min(100, s.level + Math.floor(currentXp / 3));
    tile.setAttribute("aria-label", s.name + " — Lv." + currentLvl);
    tile.innerHTML = "";

    var top = el("div", "sk-top");
    top.appendChild(el("span", "sk-emoji", s.emoji));
    var txt = el("div");
    txt.appendChild(el("div", "sk-name", s.name));
    txt.appendChild(el("div", "sk-sub", s.sub));
    top.appendChild(txt);

    var bar = el("div", "sk-bar");
    var fill = el("i");
    fill.style.setProperty("--sk-c1", s.c1);
    fill.style.setProperty("--sk-c2", s.c2);
    bar.appendChild(fill);

    var row = el("div", "sk-row");
    row.appendChild(el("span", "sk-lvl", "Lv." + currentLvl));
    row.appendChild(el("span", "sk-xp", "+" + currentXp + " luyện"));

    tile.appendChild(top);
    tile.appendChild(bar);
    tile.appendChild(row);

    tile.addEventListener("mousemove", function (ev) {
      var r = tile.getBoundingClientRect();
      tile.style.setProperty("--mx", ((ev.clientX - r.left) / r.width) * 100 + "%");
      tile.style.setProperty("--my", ((ev.clientY - r.top) / r.height) * 100 + "%");
    });
    tile.addEventListener("click", function () {
      openModal(i, tile);
    });
    tiles.push({ s: s, tile: tile, fill: fill });
  });

  /* Thanh % chạy mượt khi trang vừa load */
  window.addEventListener("load", function () {
    tiles.forEach(function (t) {
      var currentXp = xp[t.s.id] || 0;
      var currentLvl = Math.min(100, t.s.level + Math.floor(currentXp / 3));
      setTimeout(function () {
        t.fill.style.width = currentLvl + "%";
      }, 220);
    });
  });

  /* ---------- Popup Chi tiết ---------- */
  var modal = document.getElementById("skill-modal");
  var current = null;

  function openModal(i, tile) {
    if (!modal) return;
    current = tiles[i];
    var s = current.s;
    var currentXp = xp[s.id] || 0;
    var currentLvl = Math.min(100, s.level + Math.floor(currentXp / 3));

    document.getElementById("sk-icon").textContent = s.emoji;
    document.getElementById("sk-title").textContent = s.name;
    document.getElementById("sk-tag").textContent = s.sub + " • " + getRankTitle(currentLvl);
    document.getElementById("sk-desc").textContent = s.desc;
    document.getElementById("sk-count").textContent = "+" + currentXp + " lần luyện tập (" + currentLvl + "%)";

    var barsBox = document.getElementById("sk-bars");
    barsBox.innerHTML = "";
    s.bars.forEach(function (b) {
      var row = el("div", "sk-barrow");
      var lbl = el("div", "lbl");
      lbl.appendChild(el("span", null, b[0]));
      lbl.appendChild(el("span", null, b[1] + "%"));
      var track = el("div", "track");
      track.appendChild(el("div", "fill"));
      row.appendChild(lbl);
      row.appendChild(track);
      barsBox.appendChild(row);
    });

    var chips = document.getElementById("sk-chips");
    chips.innerHTML = "";
    s.chips.forEach(function (c) {
      chips.appendChild(el("span", null, c));
    });

    var head = modal.querySelector(".sk-big-icon");
    if (head) head.style.background = "linear-gradient(135deg," + s.c1 + "," + s.c2 + ")";

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");

    setTimeout(function () {
      var fills = barsBox.querySelectorAll(".fill");
      for (var k = 0; k < fills.length; k++) fills[k].style.width = s.bars[k][1] + "%";
    }, 60);
    if (tile) tile.blur();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    current = null;
  }

  if (modal) {
    modal.addEventListener("click", function (ev) {
      if (ev.target === modal) closeModal();
    });
    var cbtn = document.getElementById("skill-close");
    if (cbtn) cbtn.addEventListener("click", closeModal);
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") closeModal();
    });

    var train = document.getElementById("sk-train");
    if (train)
      train.addEventListener("click", function () {
        if (!current) return;
        var id = current.s.id;
        xp[id] = (xp[id] || 0) + 1;
        saveXp();
        playBeep();

        // Rung nhẹ điện thoại nếu hỗ trợ (Haptic feedback)
        if (navigator.vibrate) {
          navigator.vibrate(40);
        }

        var currentXp = xp[id];
        var lvl = Math.min(100, current.s.level + Math.floor(currentXp / 3));

        document.getElementById("sk-count").textContent = "+" + currentXp + " lần luyện tập (" + lvl + "%)";
        document.getElementById("sk-tag").textContent = current.s.sub + " • " + getRankTitle(lvl);

        var xpEl = current.tile.querySelector(".sk-xp");
        if (xpEl) xpEl.textContent = "+" + currentXp + " luyện";
        
        var lvlEl = current.tile.querySelector(".sk-lvl");
        if (lvlEl) lvlEl.textContent = "Lv." + lvl;
        
        current.fill.style.width = lvl + "%";

        // Thêm hiệu ứng bay chữ +1 XP độc đáo tại vị trí nút bấm
        var r = train.getBoundingClientRect();
        var pop = el("div", "sk-pop", "+1 XP 🔥");
        pop.style.left = r.left + r.width / 2 + "px";
        pop.style.top = r.top - 10 + "px";
        pop.style.position = "fixed";
        pop.style.zIndex = "9999";
        pop.style.fontWeight = "bold";
        pop.style.color = current.s.c1;
        pop.style.transition = "transform 0.8s ease, opacity 0.8s ease";
        document.body.appendChild(pop);

        requestAnimationFrame(function() {
          pop.style.transform = "translateY(-40px) scale(1.2)";
          pop.style.opacity = "0";
        });

        setTimeout(function () {
          pop.remove();
        }, 800);
      });
  }

  /* ---------- Ô Music: hiện bài đang phát ---------- */
  function paintNowPlaying() {
    var box = document.getElementById("np-mini");
    var tile = document.getElementById("w-music");
    if (!box) return;
    var d = null;
    try {
      d = JSON.parse(localStorage.getItem("ka_nowplaying") || "null");
    } catch (e) {
      d = null;
    }
    if (d && d.title && d.playing !== false) {
      box.textContent = d.title;
      if (tile) tile.classList.add("is-playing");
    } else {
      box.textContent = "Nghe nhạc online";
      if (tile) tile.classList.remove("is-playing");
    }
  }
  paintNowPlaying();
  window.addEventListener("storage", paintNowPlaying);
  window.addEventListener("focus", paintNowPlaying);
})();

