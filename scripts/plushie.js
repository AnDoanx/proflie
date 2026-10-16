const PlushyConfig = {
  calstone: {
    className: "calstone",
    sound: "../src/assets/sounds/calstone_neko.mp3"
  },
  oguri_cap: {
    className: "oguri_cap",
    sound: "../src/assets/sounds/oguri_cap_sneeze.mp3"
  },
  tamamo_cross: {
    className: "tamamo_cross",
    sound: "../src/assets/sounds/tamamo_cross.mp3"
  },
  hoshino: {
    className: "hoshino",
    sound: "../src/assets/sounds/hoshino-uhee.mp3"
  },
  koyuki: {
    className: "koyuki",
    sound: "../src/assets/sounds/koyuki-nihahahaha.mp3",
    hurtSound: "../src/assets/sounds/koyuki-uwah.mp3"
  }
};
const PlushyAudio = {
  lastPlayTime: 0,
  play: function (_v1, _v2 = 1) {
    const _v3 = Date.now();
    if (_v3 - this.lastPlayTime < 30) {
      return;
    }
    this.lastPlayTime = _v3;
    const _v4 = new Audio(_v1);
    _v4.volume = Math.max(0.01, Math.min(1, _v2));
    _v4.play().catch(() => {});
  }
};
const PlushyEngine = {
  plushies: [],
  activePlushy: null,
  size: 120,
  radius: 60,
  gravity: 0.55,
  frictionX: 0.995,
  frictionFloor: 0.92,
  bounceFloor: 0.65,
  bounceWall: 0.75,
  bounceCeiling: 0.5,
  isRunning: !1
};
class Plushy {
  constructor(_v5, _v6, _v7 = "calstone") {
    this.x = _v5;
    this.y = _v6;
    this.vx = (Math.random() - 0.5) * 10;
    this.vy = (Math.random() - 0.5) * 5;
    this.rot = Math.random() * 360;
    this.isDragging = !1;
    this.dragOffX = 0;
    this.dragOffY = 0;
    this.type = _v7;
    this.soundSrc = PlushyConfig[_v7].sound;
    this.hurtSoundSrc = PlushyConfig[_v7].hurtSound || PlushyConfig[_v7].sound;
    this.el = document.createElement("div");
    this.el.className = "plushy " + PlushyConfig[_v7].className;
    this.el.setAttribute("aria-label", _v7);
    document.body.appendChild(this.el);
  }
  update() {
    if (!this.isDragging) {
      this.vy += PlushyEngine.gravity;
      this.vx *= PlushyEngine.frictionX;
      this.x += this.vx;
      this.y += this.vy;
    }
    const _v8 = window.innerHeight - PlushyEngine.radius;
    const _v9 = PlushyEngine.radius;
    const _v10 = window.innerWidth - PlushyEngine.radius;
    const _v11 = PlushyEngine.radius;
    if (this.y > _v8) {
      this.y = _v8;
      this.vy *= -PlushyEngine.bounceFloor;
      this.vx *= PlushyEngine.frictionFloor;
      if (Math.abs(this.vy) < 0.8) {
        this.vy = 0;
      }
    }
    if (this.y < _v9) {
      this.y = _v9;
      this.vy *= -PlushyEngine.bounceCeiling;
    }
    if (this.x > _v10) {
      this.x = _v10;
      this.vx *= -PlushyEngine.bounceWall;
    }
    if (this.x < _v11) {
      this.x = _v11;
      this.vx *= -PlushyEngine.bounceWall;
    }
    this.rot += this.vx * 1.5;
    this.el.style.transform = "translate(" + (this.x - PlushyEngine.radius) + "px, " + (this.y - PlushyEngine.radius) + "px) rotate(" + this.rot + "deg)";
  }
}
function resolveCollisions() {
  const _v12 = PlushyEngine.plushies;
  for (let _v13 = 0; _v13 < _v12.length; _v13++) {
    for (let _v14 = _v13 + 1; _v14 < _v12.length; _v14++) {
      let _v15 = _v12[_v13];
      let _v16 = _v12[_v14];
      let _v17 = _v16.x - _v15.x;
      let _v18 = _v16.y - _v15.y;
      let _v19 = Math.sqrt(_v17 * _v17 + _v18 * _v18);
      let _v20 = PlushyEngine.radius * 2;
      if (_v19 < _v20 && _v19 > 0) {
        let _v21 = _v20 - _v19;
        let _v22 = _v17 / _v19;
        let _v23 = _v18 / _v19;
        let _v24 = _v22 * _v21 * 0.5;
        let _v25 = _v23 * _v21 * 0.5;
        if (!_v15.isDragging) {
          _v15.x -= _v24;
          _v15.y -= _v25;
        }
        if (!_v16.isDragging) {
          _v16.x += _v24;
          _v16.y += _v25;
        }
        let _v26 = _v15.vx - _v16.vx;
        let _v27 = _v15.vy - _v16.vy;
        let _v28 = (_v22 * _v26 + _v23 * _v27) * 2 / 2;
        if (!_v15.isDragging) {
          _v15.vx -= _v28 * _v22 * 0.8;
          _v15.vy -= _v28 * _v23 * 0.8;
        }
        if (!_v16.isDragging) {
          _v16.vx += _v28 * _v22 * 0.8;
          _v16.vy += _v28 * _v23 * 0.8;
        }
      }
    }
  }
}
function physicsLoop() {
  resolveCollisions();
  PlushyEngine.plushies.forEach(_v29 => _v29.update());
  requestAnimationFrame(physicsLoop);
}
function initDragEvents() {
  const _v30 = _v33 => {
    if (_v33.target.classList.contains("plushy") && (_v33.button === 0 || _v33.touches)) {
      _v33.preventDefault();
      const _v34 = _v33.touches && _v33.touches.length > 0;
      const _v35 = _v34 ? _v33.touches[0].clientX : _v33.clientX;
      const _v36 = _v34 ? _v33.touches[0].clientY : _v33.clientY;
      PlushyEngine.activePlushy = PlushyEngine.plushies.find(_v38 => _v38.el === _v33.target);
      if (!PlushyEngine.activePlushy) {
        return;
      }
      let _v37 = PlushyEngine.activePlushy;
      PlushyAudio.play(_v37.hurtSoundSrc, 0.6);
      _v37.isDragging = !0;
      _v37.dragOffX = _v35 - _v37.x;
      _v37.dragOffY = _v36 - _v37.y;
      _v37.vx = 0;
      _v37.vy = 0;
      _v37.el.style.zIndex = Date.now();
    }
  };
  const _v31 = _v39 => {
    let _v40 = PlushyEngine.activePlushy;
    if (!_v40 || !_v40.isDragging) {
      return;
    }
    const _v41 = _v39.touches && _v39.touches.length > 0;
    const _v42 = _v41 ? _v39.touches[0].clientX : _v39.clientX;
    const _v43 = _v41 ? _v39.touches[0].clientY : _v39.clientY;
    const _v44 = _v42 - _v40.dragOffX;
    const _v45 = _v43 - _v40.dragOffY;
    _v40.vx = _v40.vx * 0.3 + (_v44 - _v40.x) * 0.7;
    _v40.vy = _v40.vy * 0.3 + (_v45 - _v40.y) * 0.7;
    _v40.x = _v44;
    _v40.y = _v45;
  };
  const _v32 = () => {
    if (PlushyEngine.activePlushy) {
      const _v46 = 50;
      PlushyEngine.activePlushy.vx = Math.max(-_v46, Math.min(_v46, PlushyEngine.activePlushy.vx));
      PlushyEngine.activePlushy.vy = Math.max(-_v46, Math.min(_v46, PlushyEngine.activePlushy.vy));
      PlushyEngine.activePlushy.isDragging = !1;
      PlushyEngine.activePlushy = null;
    }
  };
  document.addEventListener("mousedown", _v30);
  document.addEventListener("touchstart", _v30, {
    passive: !1
  });
  document.addEventListener("mousemove", _v31);
  document.addEventListener("touchmove", _v47 => {
    if (PlushyEngine.activePlushy) {
      _v31(_v47);
      _v47.preventDefault();
    }
  }, {
    passive: !1
  });
  document.addEventListener("mouseup", _v32);
  document.addEventListener("touchend", _v32);
}
document.addEventListener("DOMContentLoaded", () => {
  initDragEvents();
  if (!PlushyEngine.isRunning) {
    physicsLoop();
    PlushyEngine.isRunning = true;
  }
});
function spawnPlushy(_v48, _v49 = 1) {
  if (typeof _v49 !== "number" || _v49 <= 0) {
    console.error("Vui lòng nhập số lượng hợp lệ.");
    return;
  }
  PlushyAudio.play(PlushyConfig[_v48].sound, 0.8);
  for (let _v50 = 0; _v50 < _v49; _v50++) {
    const _v51 = PlushyEngine.radius + Math.random() * (window.innerWidth - PlushyEngine.radius * 2);
    const _v52 = -PlushyEngine.size;
    const _v53 = new Plushy(_v51, _v52, _v48);
    PlushyEngine.plushies.push(_v53);
  }
  console.log("Summoned x" + _v49 + " New " + _v48 + "! (Total: " + PlushyEngine.plushies.length + ")");
}
window.spawnCalstone = (_v54 = 1) => spawnPlushy("calstone", _v54);
window.spawnOguriCap = (_v55 = 1) => spawnPlushy("oguri_cap", _v55);
window.spawnTamamoCross = (_v56 = 1) => spawnPlushy("tamamo_cross", _v56);
window.spawnHoshino = (_v57 = 1) => spawnPlushy("hoshino", _v57);
window.spawnKoyuki = (_v58 = 1) => spawnPlushy("koyuki", _v58);
