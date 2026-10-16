/* ==================================================================
   skills.js — 8 ô kỹ năng tương tác trên trang chủ
   Muốn đổi tên / mức độ / mô tả: sửa mảng SKILLS bên dưới rồi lưu file.
   ================================================================== */
(function () {
  "use strict";

  var SKILLS = [
    {
      id: "gaming",
      emoji: "\uD83C\uDFAE",
      name: "Gaming",
      sub: "FPS \u2022 MOBA \u2022 Souls-like",
      level: 88,
      c1: "#7a5cff",
      c2: "#59c1ff",
      desc: "Ch\u01A1i game t\u1EEB nh\u1ECF, th\u1EC3 lo\u1EA1i n\u00E0o c\u0169ng th\u1EED. FPS l\u00E0 m\u1EA1nh nh\u1EA5t, c\u00F2n Souls-like th\u00EC nghi\u1EC7n v\u00EC\u2026 kh\u00F3.",
      bars: [
        ["FPS / B\u1EAFn s\u00FAng", 92],
        ["MOBA", 85],
        ["Souls-like", 78],
      ],
      chips: ["PC", "Valorant", "Li\u00EAn Qu\u00E2n", "Minecraft", "Elden Ring"],
    },
    {
      id: "biker",
      emoji: "\uD83C\uDFCD\uFE0F",
      name: "Biker",
      sub: "Kawasaki Ninja 400",
      level: 82,
      c1: "#ff7b7b",
      c2: "#ffb36b",
      desc: "M\u00EA xe m\u00E1y v\u00E0 nh\u1EEFng chuy\u1EBFn \u0111i xa. Th\u00EDch t\u1EF1 ch\u0103m xe, thay d\u1EA7u, v\u1EC7 sinh kim phun v\u00E0 \u0111i tour cu\u1ED1i tu\u1EA7n.",
      bars: [
        ["L\u00E1i xe / x\u1EED l\u00FD t\u00ECnh hu\u1ED1ng", 86],
        ["B\u1EA3o d\u01B0\u1EE1ng c\u01A1 b\u1EA3n", 74],
        ["Tour \u0111\u01B0\u1EDDng d\u00E0i", 80],
      ],
      chips: ["Ninja 400", "Tour", "\u0110\u1ED9 xe", "B\u1EA3o d\u01B0\u1EE1ng"],
    },
    {
      id: "anime",
      emoji: "\uD83C\uDF38",
      name: "Anime & Manga",
      sub: "Otaku ch\u00EDnh hi\u1EC7u",
      level: 90,
      c1: "#ff8fd0",
      c2: "#ffd166",
      desc: "Xem anime m\u1ED7i t\u1ED1i, \u0111\u1ECDc manga v\u00E0 s\u01B0u t\u1EA7m h\u00ECnh. Gu: slice of life, romance v\u00E0 m\u1EA5y b\u1ED9 nh\u1EA1c nh\u1EBD nh\u00E0ng.",
      bars: [
        ["Anime", 95],
        ["Manga", 88],
        ["S\u01B0u t\u1EA7m / figure", 72],
      ],
      chips: ["Slice of life", "Romance", "Figure", "OST"],
    },
    {
      id: "video",
      emoji: "\uD83C\uDFAC",
      name: "Video Edit",
      sub: "CapCut \u2022 TikTok",
      level: 78,
      c1: "#59c1ff",
      c2: "#7a5cff",
      desc: "T\u1EF1 d\u1EF1ng video cho k\u00EAnh TikTok: c\u1EAFt gh\u00E9p, b\u1EAFt trend, ch\u00E8n hi\u1EC7u \u1EE9ng v\u00E0 \u0111\u1ED3ng b\u1ED9 nh\u1EA1c theo nh\u1ECBp.",
      bars: [
        ["C\u1EAFt gh\u00E9p / nh\u1ECBp", 85],
        ["Hi\u1EC7u \u1EE9ng & text", 76],
        ["X\u1EED l\u00FD \u00E2m thanh", 72],
      ],
      chips: ["CapCut", "Premiere", "TikTok", "Nh\u1EA1c trend"],
    },
    {
      id: "photo",
      emoji: "\uD83C\uDFA8",
      name: "Photo Edit",
      sub: "Photoshop \u2022 Lightroom",
      level: 74,
      c1: "#ffd166",
      c2: "#ff8fd0",
      desc: "Retouch \u1EA3nh ch\u00E2n dung, ch\u1EC9nh m\u00E0u theo mood v\u00E0 l\u00E0m \u1EA3nh b\u00ECa cho video, poster.",
      bars: [
        ["Ch\u1EC9nh m\u00E0u / mood", 80],
        ["Retouch da & s\u00E1ng", 78],
        ["Thi\u1EBFt k\u1EBF poster", 65],
      ],
      chips: ["Photoshop", "Lightroom", "Canva"],
    },
    {
      id: "code",
      emoji: "\uD83D\uDCBB",
      name: "Web & Code",
      sub: "HTML \u2022 CSS \u2022 JS",
      level: 66,
      c1: "#46e08a",
      c2: "#59c1ff",
      desc: "T\u1EF1 l\u00E0m v\u00E0 ch\u1EC9nh trang web c\u00E1 nh\u00E2n n\u00E0y. Bi\u1EBFt HTML/CSS/JS c\u01A1 b\u1EA3n v\u00E0 c\u00E1ch \u0111\u01B0a web l\u00EAn m\u1EA1ng.",
      bars: [
        ["HTML / CSS", 78],
        ["JavaScript", 62],
        ["Deploy / hosting", 56],
      ],
      chips: ["HTML", "CSS", "JS", "GitHub"],
    },
    {
      id: "lang",
      emoji: "\uD83D\uDDE3\uFE0F",
      name: "Ng\u00F4n ng\u1EEF",
      sub: "VI \u2022 EN \u2022 \u4E2D\u6587",
      level: 80,
      c1: "#ff9ad5",
      c2: "#7a5cff",
      desc: "Ti\u1EBFng Vi\u1EC7t l\u00E0 m\u1EB9 \u0111\u1EBB, ti\u1EBFng Anh d\u00F9ng h\u1EB1ng ng\u00E0y, ti\u1EBFng Trung \u0111ang h\u1ECDc th\u00EAm.",
      bars: [
        ["Ti\u1EBFng Vi\u1EC7t", 100],
        ["English", 70],
        ["\u4E2D\u6587", 55],
      ],
      chips: ["Ti\u1EBFng Vi\u1EC7t", "English", "\u4E2D\u6587"],
    },
    {
      id: "music",
      emoji: "\uD83C\uDFA7",
      name: "Music",
      sub: "Lo-fi \u2022 V-pop \u2022 OST",
      level: 85,
      c1: "#7a5cff",
      c2: "#46e08a",
      desc: "Nghe nh\u1EA1c c\u1EA3 ng\u00E0y: lo-fi l\u00FAc l\u00E0m vi\u1EC7c, V-pop l\u00FAc \u0111i \u0111\u01B0\u1EDDng v\u00E0 OST anime l\u00FAc t\u1ED1i.",
      bars: [
        ["C\u1EA3m \u00E2m / b\u1EAFt nh\u1EA1c", 88],
        ["X\u1EBFp playlist theo mood", 92],
        ["H\u00E1t", 60],
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

  /* ---------- dựng 8 ô kỹ năng ---------- */
  var tiles = [];
  SKILLS.forEach(function (s, i) {
    var tile = document.getElementById("skill-" + (i + 1));
    if (!tile) return;
    tile.dataset.skill = s.id;
    tile.style.setProperty("--sk-c1", s.c1);
    tile.style.setProperty("--sk-c2", s.c2);
    tile.setAttribute("aria-label", s.name + " — " + s.level + "%");
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
    row.appendChild(el("span", "sk-lvl", "Lv." + s.level));
    row.appendChild(el("span", "sk-xp", "+" + (xp[s.id] || 0)));

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

  /* thanh % chạy lên khi trang vừa load */
  window.addEventListener("load", function () {
    tiles.forEach(function (t) {
      setTimeout(function () {
        t.fill.style.width = t.s.level + "%";
      }, 220);
    });
  });

  /* ---------- popup chi tiết ---------- */
  var modal = document.getElementById("skill-modal");
  var current = null;

  function openModal(i, tile) {
    if (!modal) return;
    current = tiles[i];
    var s = current.s;
    document.getElementById("sk-icon").textContent = s.emoji;
    document.getElementById("sk-title").textContent = s.name;
    document.getElementById("sk-tag").textContent = s.sub;
    document.getElementById("sk-desc").textContent = s.desc;
    document.getElementById("sk-count").textContent = "+" + (xp[s.id] || 0) + " l\u1EA7n luy\u1EC7n";

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
        document.getElementById("sk-count").textContent = "+" + xp[id] + " l\u1EA7n luy\u1EC7n";
        var xpEl = current.tile.querySelector(".sk-xp");
        if (xpEl) xpEl.textContent = "+" + xp[id];
        var lvl = Math.min(100, current.s.level + Math.floor(xp[id] / 3));
        var lvlEl = current.tile.querySelector(".sk-lvl");
        if (lvlEl) lvlEl.textContent = "Lv." + lvl;
        current.fill.style.width = lvl + "%";

        var r = train.getBoundingClientRect();
        var pop = el("div", "sk-pop", "+1");
        pop.style.left = r.left + r.width / 2 + "px";
        pop.style.top = r.top - 6 + "px";
        document.body.appendChild(pop);
        setTimeout(function () {
          pop.remove();
        }, 950);
      });
  }

  /* ---------- ô Music: hiện bài đang phát ---------- */
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
      box.textContent = "Nghe nh\u1EA1c online";
      if (tile) tile.classList.remove("is-playing");
    }
  }
  paintNowPlaying();
  window.addEventListener("storage", paintNowPlaying);
  window.addEventListener("focus", paintNowPlaying);
})();
