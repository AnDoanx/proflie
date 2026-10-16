const STATUS_INFO = {
  online: {
    color: "#23a55a",
    text: "Online",
    glow: "0 0 5px 2px #23a55a"
  },
  idle: {
    color: "#f0b232",
    text: "Idle / AFK",
    glow: "0 0 5px 2px #f0b232"
  },
  dnd: {
    color: "#f23f43",
    text: "Do Not Disturb",
    glow: "0 0 5px 2px #f23f43"
  },
  offline: {
    color: "#7e828c",
    text: "Offline",
    glow: "none"
  },
  streaming: {
    color: "#9147ff",
    text: "Streaming",
    glow: "0 0 5px 2px #9147ff"
  }
};
const ACTIVITY_TYPE = ["Playing ", "Streaming to ", "Listening to ", "Watching ", "Custom status ", "Competing in "];
let latestActivity = null;
function getDiscordElements() {
  return {
    avatar: document.querySelector(".discord .avatar"),
    displayName: document.querySelector(".discord .display-name"),
    colorDot: document.querySelector(".discord .color-dot"),
    status: document.querySelector(".discord .status"),
    activity: document.querySelector(".discord .activity"),
    details: document.querySelector(".discord .details"),
    state: document.querySelector(".discord .state"),
    largeImage: document.querySelector(".discord .large-image"),
    smallImage: document.querySelector(".discord .small-image"),
    timebarContainer: document.querySelector(".discord .timebar-container"),
    timestampElem: document.querySelector(".discord .timestamp"),
    currentTimeElem: document.querySelector(".discord .current-time"),
    totalTimeElem: document.querySelector(".discord .total-time"),
    timebarProgress: document.querySelector(".discord .timebar-progress"),
    freeText: document.querySelector(".free"),
    statusText: document.querySelector(".status-discord p"),
    ping: document.querySelector(".ping"),
    statusDot: document.querySelector(".dot")
  };
}
function updateLanyard({
  discord_user: _v1,
  discord_status: _v2,
  activities: _v3
}) {
  const _v4 = getDiscordElements();
  if (!_v4.avatar || !_v4.displayName || !_v4.colorDot) {
    return;
  }
  _v4.avatar.style.backgroundImage = "url(https://cdn.discordapp.com/avatars/" + _v1.id + "/" + _v1.avatar + ".webp?size=80)";
  _v4.displayName.textContent = _v1.display_name;
  _v4.colorDot.style.backgroundColor = STATUS_INFO[_v2]?.color || STATUS_INFO.offline.color;
  _v3 = (_v3 || []).filter(_v6 => _v6.type !== 4);
  updateStatusBox(_v2, _v3, _v4);
  if (!_v3.length) {
    if (_v4.status) {
      _v4.status.textContent = _v2;
    }
    if (_v4.activity) {
      _v4.activity.textContent = "";
    }
    if (_v4.details) {
      _v4.details.textContent = "";
    }
    if (_v4.state) {
      _v4.state.textContent = "";
    }
    if (_v4.largeImage) {
      _v4.largeImage.style.backgroundImage = "";
    }
    if (_v4.smallImage) {
      _v4.smallImage.style.backgroundImage = "";
    }
    if (_v4.timestampElem) {
      _v4.timestampElem.textContent = "";
    }
    if (_v4.timebarContainer) {
      _v4.timebarContainer.style.display = "none";
    }
    if (_v4.freeText) {
      _v4.freeText.style.display = "block";
    }
    latestActivity = null;
    return;
  } else if (_v4.freeText) {
    _v4.freeText.style.display = "none";
  }
  const _v5 = _v3[0];
  if (_v4.status) {
    _v4.status.textContent = ACTIVITY_TYPE[_v5.type] || "";
  }
  if (_v4.activity) {
    _v4.activity.textContent = _v5.name || "";
  }
  if (_v4.details) {
    _v4.details.textContent = _v5.details || "";
  }
  if (_v4.state) {
    _v4.state.textContent = _v5.state || "";
  }
  ["large", "small"].forEach(_v7 => {
    let _v8 = _v5.assets?.[_v7 + "_image"];
    let _v9 = _v7 === "large" ? _v4.largeImage : _v4.smallImage;
    if (!_v9) {
      return;
    }
    if (!_v8) {
      _v9.style.backgroundImage = "";
      if (_v7 === "small") {
        const _v10 = document.querySelector(".discord .image-container foreignObject");
        if (_v10) {
          _v10.removeAttribute("mask");
        }
      }
      return;
    }
    if (_v8.startsWith("mp:")) {
      _v8 = "https://media.discordapp.net/" + _v8.slice(3) + "?width=160&height=160";
    } else if (_v8.startsWith("spotify:")) {
      _v8 = "https://i.scdn.co/image/" + _v8.slice(8);
    } else {
      _v8 = "https://cdn.discordapp.com/app-assets/" + _v5.application_id + "/" + _v8 + ".webp?size=160";
    }
    _v9.style.backgroundImage = "url(" + _v8 + ")";
    if (_v7 === "small") {
      const _v11 = document.querySelector(".discord .image-container foreignObject");
      if (_v11) {
        _v11.setAttribute("mask", "url(#mask-large-image)");
      }
    }
  });
  latestActivity = _v5;
  updateTimebarAndTimestamp(_v5, _v4);
}
function updateStatusBox(_v12, _v13 = [], _v14 = getDiscordElements()) {
  let _v15 = STATUS_INFO[_v12] || STATUS_INFO.offline;
  const _v16 = _v13.some(_v17 => _v17.type === 1 && _v17.url && (_v17.url.includes("twitch.tv") || _v17.url.includes("youtube.com")));
  if (_v16) {
    _v15 = STATUS_INFO.streaming;
  }
  if (_v14.statusText) {
    _v14.statusText.textContent = _v15.text;
  }
  if (_v14.ping) {
    _v14.ping.style.backgroundColor = _v15.color;
    _v14.ping.style.boxShadow = _v15.glow;
  }
  if (_v14.statusDot) {
    _v14.statusDot.style.backgroundColor = _v15.color;
  }
}
function updateTimebarAndTimestamp(_v18, _v19 = getDiscordElements()) {
  if (_v18 && _v18.timestamps && _v18.timestamps.start) {
    const _v20 = _v18.timestamps.start;
    const _v21 = _v18.timestamps.end;
    const _v22 = Date.now();
    let _v23 = _v21 && _v21 > _v20 ? _v21 - _v20 : null;
    let _v24 = _v22 - _v20;
    if (_v19.timestampElem) {
      if (_v23) {
        _v19.timestampElem.textContent = "";
      } else {
        const _v25 = Math.floor(_v24 / 1000);
        const _v26 = Math.floor(_v25 / 3600);
        const _v27 = Math.floor(_v25 % 3600 / 60);
        const _v28 = _v25 % 60;
        _v19.timestampElem.textContent = _v26 + ":" + _v27.toString().padStart(2, "0") + ":" + _v28.toString().padStart(2, "0");
      }
    }
    if (_v23 && _v19.timebarContainer && _v19.currentTimeElem && _v19.totalTimeElem && _v19.timebarProgress) {
      _v19.timebarContainer.style.display = "flex";
      const _v29 = Math.max(0, Math.min(100, _v24 / _v23 * 100));
      _v19.timebarProgress.style.width = _v29 + "%";
      const _v30 = Math.floor(_v23 / 1000 / 60);
      const _v31 = Math.floor(_v23 / 1000) % 60;
      const _v32 = Math.floor(_v24 / 1000 / 60);
      const _v33 = Math.floor(_v24 / 1000) % 60;
      _v19.currentTimeElem.textContent = _v32 + ":" + _v33.toString().padStart(2, "0");
      _v19.totalTimeElem.textContent = _v30 + ":" + _v31.toString().padStart(2, "0");
    } else if (_v19.timebarContainer) {
      _v19.timebarContainer.style.display = "none";
      if (_v19.currentTimeElem) {
        _v19.currentTimeElem.textContent = "";
      }
      if (_v19.totalTimeElem) {
        _v19.totalTimeElem.textContent = "";
      }
      if (_v19.timebarProgress) {
        _v19.timebarProgress.style.width = "0%";
      }
    }
  } else if (_v19.timebarContainer) {
    _v19.timebarContainer.style.display = "none";
    if (_v19.timestampElem) {
      _v19.timestampElem.textContent = "";
    }
    if (_v19.currentTimeElem) {
      _v19.currentTimeElem.textContent = "";
    }
    if (_v19.totalTimeElem) {
      _v19.totalTimeElem.textContent = "";
    }
    if (_v19.timebarProgress) {
      _v19.timebarProgress.style.width = "0%";
    }
  }
}
setInterval(() => {
  if (latestActivity) {
    updateTimebarAndTimestamp(latestActivity);
  }
}, 1000);
function connectLanyard() {
  const _v34 = new WebSocket("wss://api.lanyard.rest/socket");
  _v34.addEventListener("open", () => {
    _v34.send(JSON.stringify({
      op: 2,
      d: {
        subscribe_to_id: "1053893912466554922"
      }
    }));
  });
  _v34.addEventListener("message", ({
    data: _v35
  }) => {
    try {
      const {
        t: _v36,
        d: _v37
      } = JSON.parse(_v35);
      if (_v36 === "INIT_STATE" || _v36 === "PRESENCE_UPDATE") {
        updateLanyard(_v37);
      }
    } catch (_v38) {}
  });
  _v34.addEventListener("close", () => setTimeout(connectLanyard, 1000));
  _v34.addEventListener("error", () => _v34.close());
}
window.addEventListener("DOMContentLoaded", connectLanyard);
