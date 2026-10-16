const API_URL = "https://api.miyagawamizu.workers.dev/";
const settingBtn = document.getElementById("setting");
const settingPanel = document.getElementById("setting-panel");
const closeBtn = document.getElementById("close-setting-btn");
const authSection = document.getElementById("auth-section");
const mainSection = document.getElementById("main-setting-section");
const authInput = document.getElementById("auth-password-input");
const authSubmit = document.getElementById("auth-submit-btn");
const updateWorkerBtn = document.getElementById("update-worker-btn");
const statusContent = document.querySelector(".status-content");
const modalOverlay = document.getElementById("modal-overlay");
const authMsg = document.getElementById("auth-msg");
const updateMsg = document.getElementById("update-msg");
let modalCloseTimeout = null;
function showMizuLogs() {
  function _v1(_v2, _v3, _v4 = "#7cf0ff") {
    const _v5 = "\n            background-color: #7cf0ff; \n            color: black; \n            padding: 2px 6px; \n            border-radius: 4px; \n            font-weight: bold;\n        ";
    const _v6 = "\n            background-color: " + _v4 + "; \n            color: black; \n            padding: 2px 6px; \n            border-radius: 4px; \n            font-weight: bold;\n        ";
    const _v7 = "background-color: transparent; color: inherit; line-height: 1.5;";
    console.log("%cMizu%c %c" + _v2 + "%c " + _v3, _v5, _v7, _v6, _v7);
  }
  console.clear();
  _v1("Warning", "I didn't share the website's source code meow~", "#fbce00");
  _v1("Info", "Feel free to look at my code but meow~ you can copy, just don't make it identical meow~", "#a5d6a7");
  _v1("Sigh", "At least change the content, why are you using my words?? meow~", "#ffcc80");
  _v1("Fact", "I make this for myself meow~", "#ce93d8");
  _v1("Serious", "Do you truly understand what the word \"personal\" means? meow~", "#ffb74d");
  _v1("Stop", "Stop asking for source code meow~", "#ef5350");
  _v1("Tip", "Use f12 or anything help u learn how the code work meow~", "#90caf9");
  _v1("Original", "https://mizu.pages.dev/", "#81c784");
  _v1("IndieWeb", "Tired of the boring corporate internet? Dive into the indie web space! meow~", "#b39ddb");
  _v1("Neocities", "One of the biggest hubs for hand-crafted personal sites -> https://neocities.org/browse", "#5e95a1");
  _v1("NekoWeb", "A super cozy, growing community full of creative folks -> https://nekoweb.org/explore", "#694f57");
  _v1("Note", "Just a little note from Mizu: hope you find a cozy corner on the internet for yourself too meow~", "#ffd54f");
}
showMizuLogs();
async function fetchStatus() {
  try {
    const _v8 = await fetch(API_URL);
    const _v9 = await _v8.json();
    if (statusContent) {
      statusContent.innerHTML = "\n                <img class=\"emoji\" src=\"" + (_v9.image || "") + "\" style=\"display: " + (_v9.image ? "inline-block" : "none") + ";\" />\n                <p>" + (_v9.text || "") + "</p>\n            ";
    }
    const _v10 = document.getElementById("set-status-text");
    const _v11 = document.getElementById("set-status-img");
    if (_v10) {
      _v10.value = _v9.text || "";
    }
    if (_v11) {
      _v11.value = _v9.image || "";
    }
  } catch (_v12) {
    console.error("Failed to load data:", _v12);
  }
}
async function verifyPassword(_v13) {
  try {
    const _v14 = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "verify",
        password: _v13
      })
    });
    const _v15 = await _v14.json();
    return _v15.success;
  } catch (_v16) {
    return false;
  }
}
async function updateStatusToBackend(_v17, _v18, _v19) {
  if (updateWorkerBtn) {
    updateWorkerBtn.innerText = "Checking...";
  }
  if (updateMsg) {
    updateMsg.innerText = "";
  }
  try {
    const _v20 = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "update",
        text: _v17,
        image: _v18,
        password: _v19
      })
    });
    const _v21 = await _v20.json();
    if (_v21.success) {
      localStorage.setItem("mizu_pass", _v19);
      if (updateMsg) {
        updateMsg.innerText = "Update successfully meow!";
        updateMsg.style.color = "green";
      }
      fetchStatus();
    } else {
      if (updateMsg) {
        updateMsg.innerText = "Failed: " + _v21.message;
        updateMsg.style.color = "red";
      }
      if (_v21.message.toLowerCase().includes("password")) {
        localStorage.removeItem("mizu_pass");
        showAuthSection();
      }
    }
  } catch (_v22) {
    console.error("Update failed due to network or server error:", _v22);
    if (updateMsg) {
      updateMsg.innerText = "Server connection error.";
      updateMsg.style.color = "red";
    }
  } finally {
    if (updateWorkerBtn) {
      updateWorkerBtn.innerText = "Update Status";
    }
  }
}
function showAuthSection() {
  if (authSection) {
    authSection.style.display = "flex";
  }
  if (mainSection) {
    mainSection.style.display = "none";
  }
  if (authMsg) {
    authMsg.innerText = "";
  }
}
function showMainSection() {
  if (authSection) {
    authSection.style.display = "none";
  }
  if (mainSection) {
    mainSection.style.display = "block";
  }
  if (updateMsg) {
    updateMsg.innerText = "";
  }
}
function closeSettingModal() {
  if (settingPanel) {
    settingPanel.classList.add("closing");
  }
  if (modalOverlay) {
    modalOverlay.classList.add("closing");
  }
  if (modalCloseTimeout) {
    clearTimeout(modalCloseTimeout);
    modalCloseTimeout = null;
  }
  modalCloseTimeout = setTimeout(() => {
    if (settingPanel) {
      settingPanel.classList.remove("show", "closing");
    }
    if (modalOverlay) {
      modalOverlay.classList.remove("show", "closing");
    }
    modalCloseTimeout = null;
  }, 250);
  if (authMsg) {
    authMsg.innerText = "";
  }
  if (updateMsg) {
    updateMsg.innerText = "";
  }
}
if (settingBtn) {
  settingBtn.addEventListener("click", async _v23 => {
    _v23.preventDefault();
    if (settingPanel) {
      settingPanel.classList.remove("closing");
      settingPanel.classList.add("show");
    }
    if (modalOverlay) {
      modalOverlay.classList.remove("closing");
      modalOverlay.classList.add("show");
    }
    fetchStatus();
    const _v24 = localStorage.getItem("mizu_pass");
    if (_v24) {
      const _v25 = await verifyPassword(_v24);
      if (_v25) {
        showMainSection();
      } else {
        localStorage.removeItem("mizu_pass");
        showAuthSection();
      }
    } else {
      showAuthSection();
    }
  });
}
if (closeBtn) {
  closeBtn.addEventListener("click", closeSettingModal);
}
if (modalOverlay) {
  modalOverlay.addEventListener("click", _v26 => {
    if (_v26.target === modalOverlay) {
      closeSettingModal();
    }
  });
}
if (authSubmit) {
  authSubmit.addEventListener("click", async () => {
    const _v27 = authInput ? authInput.value : "";
    if (!_v27) {
      if (authMsg) {
        authMsg.innerText = "Please enter a password!";
      }
      return;
    }
    authSubmit.innerText = "Checking...";
    const _v28 = await verifyPassword(_v27);
    authSubmit.innerText = "Access";
    if (_v28) {
      localStorage.setItem("mizu_pass", _v27);
      showMainSection();
    } else {
      if (authMsg) {
        authMsg.innerText = "Wrong password meow!";
      }
      if (authInput) {
        authInput.value = "";
      }
    }
  });
}
if (updateWorkerBtn) {
  updateWorkerBtn.addEventListener("click", () => {
    const _v29 = document.getElementById("set-status-text").value;
    const _v30 = document.getElementById("set-status-img").value;
    const _v31 = localStorage.getItem("mizu_pass") || (authInput ? authInput.value : "");
    updateStatusToBackend(_v29, _v30, _v31);
  });
}
fetchStatus();
document.querySelectorAll(".meta").forEach(_v32 => _v32.setAttribute("translate", "no"));
const profile = document.getElementById("profile");
const about = document.getElementById("about-me");
const backToTopBtn = document.getElementById("back-to-top");
const scrollToBentoBtn = document.getElementById("scroll-to-bento");
const eatDiv = document.getElementById("eat");
function debounce(_v33, _v34) {
  let _v35;
  return (..._v36) => {
    clearTimeout(_v35);
    _v35 = setTimeout(() => _v33(..._v36), _v34);
  };
}
function toggleBackToTopButton() {
  if (!backToTopBtn) {
    return;
  }
  const _v37 = window.scrollY > 200;
  backToTopBtn.style.transform = _v37 ? "translateY(0)" : "translateY(195px)";
}
window.addEventListener("scroll", debounce(toggleBackToTopButton, 50));
if (scrollToBentoBtn) {
  window.addEventListener("scroll", debounce(() => {
    scrollToBentoBtn.style.display = window.scrollY > 100 ? "none" : "block";
  }, 50));
  scrollToBentoBtn.addEventListener("click", () => {
    const _v38 = document.getElementById("wrapper");
    if (_v38) {
      _v38.scrollIntoView({
        behavior: "smooth"
      });
    }
  });
}
if (backToTopBtn) {
  backToTopBtn.addEventListener("click", () => window.scrollTo({
    top: 0,
    behavior: "smooth"
  }));
}
document.querySelectorAll(".mctooltip").forEach(_v39 => {
  const _v40 = _v39.querySelector(".tooltip");
  if (!_v40) {
    return;
  }
  _v40.style.position = "fixed";
  _v40.style.top = "0px";
  _v40.style.left = "0px";
  let _v41 = null;
  _v39.addEventListener("mouseenter", _v42 => {
    _v40.style.display = "block";
    _v41 = _v40.getBoundingClientRect();
    let _v43 = _v42.clientY - _v41.height - 10;
    let _v44 = _v42.clientX + 10;
    if (_v44 + _v41.width > window.innerWidth) {
      _v44 = _v42.clientX - _v41.width - 10;
    }
    if (_v43 < 0) {
      _v43 = _v42.clientY + 10;
    }
    _v40.style.transform = "translate(" + _v44 + "px, " + _v43 + "px)";
  });
  _v39.addEventListener("mousemove", _v45 => {
    if (!_v41) {
      return;
    }
    let _v46 = _v45.clientY - _v41.height - 10;
    let _v47 = _v45.clientX + 10;
    if (_v47 + _v41.width > window.innerWidth) {
      _v47 = _v45.clientX - _v41.width - 10;
    }
    if (_v46 < 0) {
      _v46 = _v45.clientY + 10;
    }
    requestAnimationFrame(() => {
      _v40.style.transform = "translate(" + _v47 + "px, " + _v46 + "px)";
    });
  });
  _v39.addEventListener("mouseleave", () => {
    _v40.style.display = "none";
    _v41 = null;
  });
});
const bubbleTrigger = document.querySelector(".bubble-trigger");
if (bubbleTrigger) {
  bubbleTrigger.addEventListener("click", () => {
    bubbleTrigger.classList.toggle("active");
  });
}
const soundPath = "../src/assets/sounds/nom-nom-nom.mp3";
const audio = new Audio(soundPath);
if (eatDiv) {
  eatDiv.addEventListener("click", () => {
    audio.currentTime = 0;
    audio.play();
    eatDiv.classList.add("shake");
    setTimeout(() => {
      eatDiv.classList.remove("shake");
      eatDiv.classList.add("hidden");
    }, 1600);
  });
}
