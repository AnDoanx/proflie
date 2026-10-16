/* ============================================================
   Discord Presence  -  hien thi trang thai Discord truc tiep
   ID Discord duoc cau hinh o hang duoi.
   Du lieu lay tu Lanyard (api.lanyard.rest) - khong can backend.
   ============================================================ */
(function () {
  "use strict";

  const DISCORD_ID = "1053893912466554922"; // <-- ID Discord cua ban
  const REST_URL = "https://api.lanyard.rest/v1/users/" + DISCORD_ID;
  const SOCKET_URL = "wss://api.lanyard.rest/socket";

  const COLORS = {
    online: "#23a55a",
    idle: "#f0b232",
    dnd: "#f23f43",
    offline: "#80848e"
  };
  const LABELS = {
    online: "Online",
    idle: "Idle",
    dnd: "Do Not Disturb",
    offline: "Offline"
  };
  const ACT_VERB = {
    0: "Playing",
    1: "Streaming",
    2: "Listening to",
    3: "Watching",
    4: "Custom Status",
    5: "Competing in"
  };

  const el = {
    dot: document.querySelector(".dot"),
    ping: document.querySelector(".ping"),
    miniText: document.querySelector(".status-discord p"),
    avatar: document.getElementById("dsc-avatar"),
    wDot: document.getElementById("dsc-dot"),
    name: document.getElementById("dsc-name"),
    status: document.getElementById("dsc-status"),
    rpc: document.getElementById("dsc-rpc"),
    large: document.getElementById("dsc-large"),
    small: document.getElementById("dsc-small"),
    actTitle: document.getElementById("dsc-act-title"),
    actDetails: document.getElementById("dsc-act-details"),
    actState: document.getElementById("dsc-act-state"),
    timebar: document.getElementById("dsc-timebar"),
    progress: document.getElementById("dsc-progress"),
    time: document.getElementById("dsc-time"),
    idle: document.getElementById("dsc-idle")
  };

  let current = null; // du lieu presence moi nhat
  let spotifyTicker = null;

  /* ---------- helpers ---------- */

  function bg(node, url) {
    if (!node) return;
    if (url) {
      node.style.backgroundImage = 'url("' + url + '")';
      node.style.display = "";
    } else {
      node.style.backgroundImage = "none";
      node.style.display = "none";
    }
  }

  function avatarUrl(user) {
    if (!user) return "";
    if (!user.avatar) {
      // avatar mac dinh cua Discord
      let idx = 0;
      try {
        idx = Number(BigInt(user.id) % BigInt(6));
      } catch (e) {
        idx = 0;
      }
      return "https://cdn.discordapp.com/embed/avatars/" + idx + ".png";
    }
    const ext = user.avatar.indexOf("a_") === 0 ? "gif" : "png";
    return "https://cdn.discordapp.com/avatars/" + user.id + "/" + user.avatar + "." + ext + "?size=128";
  }

  function assetUrl(appId, key) {
    if (!key) return "";
    // anh ngoai (link) ma Discord cache lai
    if (key.indexOf("mp:external/") === 0) {
      return "https://media.discordapp.net/external/" + key.slice(12);
    }
    if (key.indexOf("mp:") === 0) {
      return "https://media.discordapp.net/" + key.slice(3);
    }
    // bia album Spotify
    if (key.indexOf("spotify:") === 0) {
      return "https://i.scdn.co/image/" + key.slice(8);
    }
    // asset cua ung dung
    if (!appId) return "";
    return "https://cdn.discordapp.com/app-assets/" + appId + "/" + key + ".png";
  }

  function pickActivity(data) {
    const list = (data && data.activities) || [];
    const main = list.filter(function (a) {
      return a.type !== 4 && (a.name || a.details || a.state);
    });
    if (main.length) return main[0];
    return null;
  }

  function two(n) {
    return (n < 10 ? "0" : "") + n;
  }

  function formatClock(sec) {
    sec = Math.max(0, Math.floor(sec));
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return h > 0 ? h + ":" + two(m) + ":" + two(s) : two(m) + ":" + two(s);
  }

  /* ---------- render ---------- */

  function render(data) {
    if (!data || !data.discord_user) return;
    current = data;

    const status = data.discord_status || "offline";
    const color = COLORS[status] || COLORS.offline;
    const user = data.discord_user;
    const displayName = user.display_name || user.global_name || user.username || "Discord";
    const activity = pickActivity(data);
    const spotify = data.listening_to_spotify ? data.spotify : null;

    /* --- cham trang thai duoi avatar --- */
    if (el.dot) el.dot.style.backgroundColor = color;
    if (el.ping) el.ping.style.backgroundColor = color;
    if (el.miniText) {
      if (activity) {
        el.miniText.textContent = ACT_VERB[activity.type] + " " + activity.name;
      } else {
        el.miniText.textContent = LABELS[status] || "Offline";
      }
    }

    /* --- the Discord trong luoi --- */
    bg(el.avatar, avatarUrl(user));
    if (el.wDot) el.wDot.style.backgroundColor = color;
    if (el.name) el.name.textContent = displayName;
    if (el.status) {
      el.status.textContent = LABELS[status] || "Offline";
      el.status.style.color = color;
    }

    /* dang lam gi */
    let title = "";
    let details = "";
    let state = "";
    let largeKey = "";
    let largeApp = "";
    let smallKey = "";
    let smallApp = "";

    if (spotify) {
      title = spotify.song || "";
      details = (spotify.artists || []).join(", ");
      state = spotify.album || "";
      largeKey = spotify.album_art_url || "";
      largeApp = "";
    } else if (activity) {
      title = activity.name || "";
      details = activity.details || "";
      state = activity.state || "";
      if (activity.assets) {
        largeKey = activity.assets.large_image || "";
        smallKey = activity.assets.small_image || "";
        largeApp = smallApp = activity.application_id || "";
      }
    }

    const hasRpc = !!(title || details || state || largeKey);

    if (el.rpc) el.rpc.style.display = hasRpc ? "" : "none";
    if (el.idle) el.idle.style.display = hasRpc ? "none" : "";

    if (hasRpc) {
      if (el.actTitle) el.actTitle.textContent = title;
      if (el.actDetails) el.actDetails.textContent = details;
      if (el.actState) el.actState.textContent = state;
      bg(el.large, largeKey && (largeKey.indexOf("http") === 0 ? largeKey : assetUrl(largeApp, largeKey)));
      bg(el.small, smallKey && assetUrl(smallApp, smallKey));
    }

    /* thanh thoi gian */
    const stamps = spotify ? spotify.timestamps : activity ? activity.timestamps : null;
    const start = stamps && stamps.start ? stamps.start : null;
    const end = stamps && stamps.end ? stamps.end : null;
    if (hasRpc && (start || end)) {
      if (el.timebar) el.timebar.style.display = "";
      tickTime(start, end);
      if (spotifyTicker) clearInterval(spotifyTicker);
      spotifyTicker = setInterval(function () {
        tickTime(start, end);
      }, 1000);
    } else {
      if (el.timebar) el.timebar.style.display = "none";
      if (spotifyTicker) {
        clearInterval(spotifyTicker);
        spotifyTicker = null;
      }
    }
  }

  function tickTime(start, end) {
    const now = Date.now();
    if (end && el.time) {
      el.time.textContent = formatClock((end - now) / 1000) + " left";
    } else if (start && el.time) {
      el.time.textContent = formatClock((now - start) / 1000) + " elapsed";
    }
    if (start && el.progress && end) {
      const pct = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
      el.progress.style.width = pct.toFixed(2) + "%";
    } else if (start && el.progress) {
      const pct = Math.min(100, ((now - start) / 1000 / 3600) * 100);
      el.progress.style.width = pct.toFixed(2) + "%";
    }
  }

  /* ---------- lay du lieu ---------- */

  async function fetchOnce() {
    try {
      const res = await fetch(REST_URL, { cache: "no-store" });
      const json = await res.json();
      if (json && json.success && json.data) render(json.data);
    } catch (e) {
      /* im lang - khong lam hong trang */
    }
  }

  let socket = null;
  let heartbeat = null;
  let reconnect = null;

  function connectSocket() {
    if (typeof WebSocket === "undefined") return;
    try {
      socket = new WebSocket(SOCKET_URL);
    } catch (e) {
      return;
    }
    socket.onmessage = function (event) {
      let msg;
      try {
        msg = JSON.parse(event.data);
      } catch (e) {
        return;
      }
      if (msg.op === 1 && msg.d && msg.d.heartbeat_interval) {
        socket.send(JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_ID } }));
        clearInterval(heartbeat);
        heartbeat = setInterval(function () {
          if (socket && socket.readyState === 1) socket.send(JSON.stringify({ op: 3 }));
        }, msg.d.heartbeat_interval);
        return;
      }
      if (msg.op === 0 && msg.d) {
        let data = msg.d;
        if (msg.t === "INIT_STATE") {
          data = data[DISCORD_ID] || data[Object.keys(data)[0]];
        }
        if (data && data.discord_user) render(data);
      }
    };
    socket.onclose = function () {
      if (heartbeat) clearInterval(heartbeat);
      heartbeat = null;
      if (reconnect) clearTimeout(reconnect);
      reconnect = setTimeout(connectSocket, 8000);
    };
    socket.onerror = function () {};
  }

  function start() {
    fetchOnce();
    connectSocket();
    // luoi an toan: dong bo lai moi 60 giay
    setInterval(fetchOnce, 60000);
    // dong bo khi quay lai tab
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) fetchOnce();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
