(function () {
  const _v1 = "https://gear.miyagawamizu.workers.dev"; // backend goc cua tac gia goc - thay bang backend cua ban neu muon
  const _v2 = ""; // ma affiliate Shopee cua ban (de trong = khong gan)
  const _v3 = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  let _v4 = {
    categories: [],
    gears: [],
    orders: {},
    currentCat: "using",
    searchQuery: "",
    isEditMode: false,
    password: ""
  };
  const _v5 = document.getElementById("nav-bar");
  const _v6 = document.getElementById("gear-box");
  const _v7 = document.getElementById("setting");
  const _v8 = document.getElementById("edit-banner");
  const _v9 = document.getElementById("exit-edit-btn");
  const _v10 = document.getElementById("logout-btn");
  const _v11 = document.getElementById("reorder-btn");
  const _v12 = document.getElementById("toast-container");
  const _v13 = document.getElementById("search-container");
  const _v14 = document.getElementById("search-input");
  const _v15 = document.getElementById("search-clear-btn");
  const _v16 = document.getElementById("auth-modal");
  const _v17 = document.getElementById("auth-close");
  const _v18 = document.getElementById("auth-form");
  const _v19 = document.getElementById("auth-pass-input");
  const _v20 = document.getElementById("auth-error-msg");
  const _v21 = document.getElementById("category-modal");
  const _v22 = document.getElementById("category-close");
  const _v23 = document.getElementById("category-cancel-btn");
  const _v24 = document.getElementById("category-form");
  const _v25 = document.getElementById("category-name-input");
  const _v26 = document.getElementById("category-hidden-input");
  const _v27 = document.getElementById("edit-category-modal");
  const _v28 = document.getElementById("edit-category-close");
  const _v29 = document.getElementById("edit-category-cancel-btn");
  const _v30 = document.getElementById("edit-category-form");
  const _v31 = document.getElementById("edit-category-name-input");
  const _v32 = document.getElementById("edit-category-id-input");
  const _v33 = document.getElementById("edit-category-hidden-input");
  const _v34 = document.getElementById("confirm-modal");
  const _v35 = document.getElementById("confirm-close");
  const _v36 = document.getElementById("confirm-cancel-btn");
  const _v37 = document.getElementById("confirm-ok-btn");
  const _v38 = document.getElementById("confirm-title");
  const _v39 = document.getElementById("confirm-desc");
  let _v40 = null;
  const _v41 = document.getElementById("review-popup");
  const _v42 = document.getElementById("popup-close");
  const _v43 = document.getElementById("popup-img");
  const _v44 = document.getElementById("popup-name");
  const _v45 = document.getElementById("popup-tag");
  const _v46 = document.getElementById("popup-rating");
  const _v47 = document.getElementById("popup-buy-link");
  const _v48 = document.getElementById("popup-extra-links");
  const _v49 = document.getElementById("popup-review-text");
  const _v50 = document.getElementById("popup-youtube-container");
  const _v51 = document.getElementById("gear-modal");
  const _v52 = document.getElementById("modal-close");
  const _v53 = document.getElementById("modal-title");
  const _v54 = document.getElementById("gear-form");
  const _v55 = document.getElementById("form-gear-id");
  const _v56 = document.getElementById("form-gear-name");
  const _v57 = document.getElementById("form-gear-cat");
  const _v58 = document.getElementById("form-gear-img");
  const _v59 = document.getElementById("form-gear-buy");
  const _v60 = document.getElementById("form-gear-rating");
  const _v61 = document.getElementById("form-gear-review");
  const _v62 = document.getElementById("form-gear-yt");
  const _v63 = document.getElementById("form-gear-stared");
  const _v64 = document.getElementById("form-gear-direct-buy");
  const _v65 = document.getElementById("form-gear-hidden");
  const _v66 = document.getElementById("form-delete-btn");
  const _v67 = document.getElementById("extra-links-container");
  const _v68 = document.getElementById("btn-add-extra-link");
  const _v69 = document.getElementById("reorder-modal");
  const _v70 = document.getElementById("reorder-close");
  const _v71 = document.getElementById("reorder-cancel-btn");
  const _v72 = document.getElementById("reorder-list");
  const _v73 = document.getElementById("reorder-title");
  const _v74 = document.getElementById("reorder-save-btn");
  const _v75 = document.getElementById("reorder-cat-modal");
  const _v76 = document.getElementById("reorder-cat-close");
  const _v77 = document.getElementById("reorder-cat-cancel-btn");
  const _v78 = document.getElementById("reorder-cat-list");
  const _v79 = document.getElementById("reorder-cat-save-btn");
  let _v80 = [];
  let _v81 = null;
  let _v82 = [];
  let _v83 = null;
  let _v84 = null;
  let _v85 = null;
  function _v86(_v112) {
    if (!_v2 || !_v112) {
      return _v112;
    }
    if (!_v112.includes("shopee.vn")) {
      return _v112;
    }
    if (_v112.includes("s.shopee.vn") && !_v112.includes("an_redir")) {
      if (!_v112.includes("utm_source=an_" + _v2) && !_v112.includes("affiliate_id=" + _v2)) {
        const _v118 = _v112.includes("?") ? "&" : "?";
        return "" + _v112 + _v118 + "utm_medium=affiliates&utm_source=an_" + _v2;
      }
      return _v112;
    }
    let _v113 = _v112;
    try {
      _v113 = decodeURIComponent(_v112);
    } catch (_v119) {}
    let _v114;
    let _v115;
    const _v116 = _v113.match(/-i\.(\d+)\.(\d+)/);
    const _v117 = _v113.match(/\/product\/(\d+)\/(\d+)/);
    if (_v116) {
      _v114 = _v116[1];
      _v115 = _v116[2];
    } else if (_v117) {
      _v114 = _v117[1];
      _v115 = _v117[2];
    }
    if (_v114 && _v115) {
      return "https://shopee.vn/product/" + _v114 + "/" + _v115 + "?utm_medium=affiliates&utm_source=an_" + _v2;
    }
    if (!_v112.includes("utm_source=an_" + _v2) && !_v112.includes("affiliate_id=" + _v2)) {
      const _v120 = _v112.includes("?") ? "&" : "?";
      return "" + _v112 + _v120 + "utm_medium=affiliates&utm_source=an_" + _v2;
    }
    return _v112;
  }
  function _v87(_v121) {
    if (!_v121) {
      return "rating-default";
    }
    const _v122 = _v121.match(/^([0-9.]+)/);
    if (!_v122) {
      return "rating-default";
    }
    const _v123 = parseFloat(_v122[1]);
    if (_v123 >= 8) {
      return "rating-high";
    }
    if (_v123 >= 6) {
      return "rating-good";
    }
    if (_v123 >= 4) {
      return "rating-avg";
    }
    return "rating-bad";
  }
  function _v88(_v124, _v125 = "info") {
    if (!_v12) {
      return;
    }
    const _v126 = document.createElement("div");
    _v126.className = "toast-item " + _v125;
    _v126.textContent = _v124;
    _v12.appendChild(_v126);
    setTimeout(() => {
      _v126.style.opacity = "0";
      _v126.style.transform = "translateX(50px)";
      setTimeout(() => _v126.remove(), 300);
    }, 2800);
  }
  function _v89(_v127, _v128, _v129) {
    if (!_v34) {
      return;
    }
    _v38.textContent = _v127;
    _v39.textContent = _v128;
    _v40 = _v129;
    _v34.classList.add("active");
  }
  function _v90() {
    if (_v34) {
      _v34.classList.remove("active");
    }
    _v40 = null;
  }
  if (_v35) {
    _v35.addEventListener("click", _v90);
  }
  if (_v36) {
    _v36.addEventListener("click", _v90);
  }
  if (_v37) {
    _v37.addEventListener("click", () => {
      if (typeof _v40 === "function") {
        _v40();
      }
      _v90();
    });
  }
  function _v91(_v130) {
    if (!_v130) {
      return null;
    }
    const _v131 = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const _v132 = _v130.match(_v131);
    if (_v132 && _v132[2].length === 11) {
      return _v132[2];
    } else {
      return null;
    }
  }
  function _v92(_v133 = "", _v134 = "") {
    if (!_v67) {
      return;
    }
    const _v135 = document.createElement("div");
    _v135.className = "extra-link-item";
    const _v136 = document.createElement("input");
    _v136.type = "text";
    _v136.className = "extra-link-label";
    _v136.placeholder = "Mô tả liên kết (vd: Facebook, Taobao, Shop 2...)";
    _v136.value = _v133;
    const _v137 = document.createElement("input");
    _v137.type = "url";
    _v137.className = "extra-link-url";
    _v137.placeholder = "Liên kết https://...";
    _v137.value = _v134;
    const _v138 = document.createElement("button");
    _v138.type = "button";
    _v138.className = "btn-remove-link";
    _v138.textContent = "🗑️ Gỡ";
    _v138.addEventListener("click", () => _v135.remove());
    _v135.appendChild(_v136);
    _v135.appendChild(_v137);
    _v135.appendChild(_v138);
    _v67.appendChild(_v135);
  }
  if (_v68) {
    _v68.addEventListener("click", () => _v92("", ""));
  }
  async function _v93() {
    try {
      const _v139 = await fetch(_v1);
      const _v140 = await _v139.json();
      if (_v140.success && _v140.data) {
        let _v141 = _v140.data.categories || [];
        const _v142 = _v141.some(_v149 => _v149.id === "using");
        const _v143 = _v141.some(_v150 => _v150.id === "all");
        if (!_v143) {
          _v141.unshift({
            id: "all",
            name: "All",
            fixed: true
          });
        }
        if (!_v142) {
          _v141.unshift({
            id: "using",
            name: "Using",
            fixed: true
          });
        }
        _v141.forEach(_v151 => {
          if (_v151.id === "using" || _v151.id === "all") {
            _v151.fixed = true;
          }
        });
        _v4.categories = _v141;
        _v4.gears = _v140.data.gears || [];
        _v4.orders = _v140.data.orders || {};
        const _v144 = window.location.hash.replace("#", "");
        const _v145 = new URLSearchParams(window.location.search);
        const _v146 = _v145.get("cat") || _v145.get("tab");
        const _v147 = _v144 || _v146;
        const _v148 = _v4.categories.find(_v152 => _v152.id === _v147);
        if (_v148 && (_v4.isEditMode || !_v148.hidden)) {
          _v4.currentCat = _v147;
        } else {
          _v4.currentCat = "using";
        }
        _v94();
        _v97();
      }
    } catch (_v153) {
      _v88("Error loading data: " + _v153.message, "error");
    }
  }
  function _v94() {
    _v5.innerHTML = "";
    const _v154 = _v4.isEditMode ? _v4.categories : _v4.categories.filter(_v157 => !_v157.hidden);
    _v154.forEach(_v158 => {
      const _v159 = document.createElement("div");
      _v159.className = "nav-item " + (_v4.currentCat === _v158.id ? "nav-active" : "") + " " + (_v158.hidden ? "nav-hidden" : "");
      _v159.textContent = _v158.name;
      _v159.id = "nav-" + _v158.id;
      const _v160 = document.createElement("div");
      _v160.className = "cat-actions";
      if (!_v158.fixed) {
        const _v162 = document.createElement("span");
        _v162.className = "cat-hide-btn " + (_v158.hidden ? "is-hidden" : "");
        _v162.title = _v158.hidden ? "Currently Hidden (Click to Show)" : "Currently Visible (Click to Hide)";
        const _v163 = "<svg viewBox=\"0 0 24 24\" width=\"13\" height=\"13\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/></svg>";
        const _v164 = "<svg viewBox=\"0 0 24 24\" width=\"13\" height=\"13\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24\"/><line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\"/></svg>";
        _v162.innerHTML = _v158.hidden ? _v164 : _v163;
        _v162.addEventListener("click", async _v165 => {
          _v165.stopPropagation();
          await _v95(_v158);
        });
        _v160.appendChild(_v162);
      }
      const _v161 = document.createElement("span");
      _v161.className = "cat-edit-btn";
      _v161.innerHTML = "⚙️";
      _v161.title = "Rename / Edit Category";
      _v161.addEventListener("click", _v166 => {
        _v166.stopPropagation();
        if (_v27) {
          _v32.value = _v158.id;
          _v31.value = _v158.name;
          if (_v33) {
            _v33.checked = !!_v158.hidden;
          }
          _v27.classList.add("active");
          _v31.focus();
        }
      });
      _v160.appendChild(_v161);
      if (!_v158.fixed) {
        const _v167 = document.createElement("span");
        _v167.className = "cat-del-btn";
        _v167.innerHTML = "&times;";
        _v167.title = "Delete Category";
        _v167.addEventListener("click", _v168 => {
          _v168.stopPropagation();
          _v89("Delete Category", "Are you sure you want to delete \"" + _v158.name + "\"?", async () => {
            await _v105(_v158.id);
          });
        });
        _v160.appendChild(_v167);
      }
      _v159.appendChild(_v160);
      _v159.addEventListener("click", () => {
        _v4.currentCat = _v158.id;
        history.replaceState(null, null, "#" + _v158.id);
        _v94();
        _v97();
      });
      if (_v4.isEditMode) {
        _v159.setAttribute("draggable", "true");
        _v159.addEventListener("dragstart", _v169 => {
          _v85 = _v158.id;
          _v159.classList.add("dragging");
          _v169.dataTransfer.effectAllowed = "move";
          _v169.dataTransfer.setData("text/plain", _v158.id);
        });
        _v159.addEventListener("dragover", _v170 => {
          _v170.preventDefault();
          _v170.dataTransfer.dropEffect = "move";
          if (_v85 !== null && _v85 !== _v158.id) {
            _v159.classList.add("drag-over");
          }
        });
        _v159.addEventListener("dragleave", () => {
          _v159.classList.remove("drag-over");
        });
        _v159.addEventListener("drop", async _v171 => {
          _v171.preventDefault();
          _v159.classList.remove("drag-over");
          if (_v85 !== null && _v85 !== _v158.id) {
            const _v172 = _v4.categories.findIndex(_v176 => _v176.id === _v85);
            const _v173 = _v4.categories.findIndex(_v177 => _v177.id === _v158.id);
            const _v174 = _v4.categories.splice(_v172, 1)[0];
            _v4.categories.splice(_v173, 0, _v174);
            const _v175 = _v4.categories.map(_v178 => _v178.id);
            _v94();
            await _v96(_v175);
          }
        });
        _v159.addEventListener("dragend", () => {
          _v85 = null;
          _v159.classList.remove("dragging");
          document.querySelectorAll(".nav-item").forEach(_v179 => _v179.classList.remove("drag-over"));
        });
      }
      _v5.appendChild(_v159);
    });
    const _v155 = document.createElement("div");
    _v155.className = "nav-item";
    _v155.id = "add-list";
    _v155.textContent = "+";
    _v155.title = "Add New Category";
    _v155.addEventListener("click", () => {
      if (_v21) {
        _v25.value = "";
        if (_v26) {
          _v26.checked = false;
        }
        _v21.classList.add("active");
        _v25.focus();
      }
    });
    _v5.appendChild(_v155);
    const _v156 = document.createElement("div");
    _v156.className = "nav-item";
    _v156.id = "reorder-cat-btn";
    _v156.textContent = "↕";
    _v156.title = "Sort Categories";
    _v156.addEventListener("click", () => {
      _v108();
    });
    _v5.appendChild(_v156);
  }
  async function _v95(_v180) {
    const _v181 = !_v180.hidden;
    _v180.hidden = _v181;
    _v94();
    _v97();
    try {
      const _v182 = await fetch(_v1, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Mizu-Pass": _v4.password
        },
        body: JSON.stringify({
          action: "editCategory",
          id: _v180.id,
          name: _v180.name,
          hidden: _v181
        })
      });
      const _v183 = await _v182.json();
      if (_v183.success) {
        _v88(_v181 ? "Hidden \"" + _v180.name + "\" from guests" : "Visible \"" + _v180.name + "\" to guests", "info");
      } else {
        _v180.hidden = !_v181;
        _v94();
        _v97();
        _v88("Error updating category: " + _v183.message, "error");
      }
    } catch (_v184) {
      _v180.hidden = !_v181;
      _v94();
      _v97();
      _v88("Connection error: " + _v184.message, "error");
    }
  }
  async function _v96(_v185) {
    try {
      const _v186 = await fetch(_v1, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Mizu-Pass": _v4.password
        },
        body: JSON.stringify({
          action: "reorderCategories",
          orderedIds: _v185
        })
      });
      const _v187 = await _v186.json();
      if (_v187.success) {
        _v88("Category order saved!", "success");
      } else {
        _v88("Error saving category order: " + _v187.message, "error");
      }
    } catch (_v188) {
      _v88("Connection error while saving order", "error");
    }
  }
  function _v97() {
    _v6.innerHTML = "";
    if (_v13) {
      if (_v4.currentCat === "all") {
        _v13.style.display = "flex";
      } else {
        _v13.style.display = "none";
        _v4.searchQuery = "";
        if (_v14) {
          _v14.value = "";
        }
        if (_v15) {
          _v15.style.display = "none";
        }
      }
    }
    const _v189 = document.createElement("div");
    _v189.className = "listed";
    let _v190 = [];
    if (_v4.currentCat === "all") {
      _v190 = [..._v4.gears];
      if (_v4.searchQuery.trim()) {
        const _v192 = _v4.searchQuery.toLowerCase().trim();
        _v190 = _v190.filter(_v193 => {
          const _v194 = (_v193.name || "").toLowerCase().includes(_v192);
          const _v195 = (_v193.category || "").toLowerCase().includes(_v192);
          const _v196 = (_v193.review || "").toLowerCase().includes(_v192);
          return _v194 || _v195 || _v196;
        });
      }
    } else if (_v4.currentCat === "using") {
      _v190 = _v4.gears.filter(_v197 => _v197.stared);
    } else {
      _v190 = _v4.gears.filter(_v198 => _v198.category === _v4.currentCat);
    }
    if (!_v4.isEditMode) {
      const _v199 = new Set(_v4.categories.filter(_v200 => _v200.hidden).map(_v201 => _v201.id));
      _v190 = _v190.filter(_v202 => {
        const _v203 = _v202.hidden || _v199.has(_v202.category);
        if (!_v203) {
          return true;
        }
        if (_v202.stared) {
          if (_v4.currentCat === "using") {
            return true;
          }
          if (_v4.currentCat === "all" && _v4.searchQuery.trim()) {
            return true;
          }
        }
        return false;
      });
    }
    const _v191 = _v4.orders[_v4.currentCat] || [];
    if (_v191.length > 0) {
      const _v204 = new Map(_v191.map((_v205, _v206) => [_v205, _v206]));
      _v190.sort((_v207, _v208) => {
        const _v209 = _v204.has(_v207.id) ? _v204.get(_v207.id) : 9999;
        const _v210 = _v204.has(_v208.id) ? _v204.get(_v208.id) : 9999;
        return _v209 - _v210;
      });
    }
    _v190.forEach((_v211, _v212) => {
      const _v213 = document.createElement("div");
      _v213.className = "gear-item " + (_v211.hidden ? "gear-hidden" : "");
      const _v214 = document.createElement("div");
      _v214.className = "star " + (_v211.stared ? "stared" : "");
      _v214.title = _v4.isEditMode ? _v211.stared ? "Unpin" : "Pin" : "";
      _v214.addEventListener("click", async _v217 => {
        if (_v4.isEditMode) {
          _v217.stopPropagation();
          await _v104(_v211.id);
        }
      });
      _v213.appendChild(_v214);
      const _v215 = document.createElement("img");
      _v215.src = _v211.image || "./src/assets/images/icons/meow.png";
      _v215.alt = _v211.name;
      _v213.appendChild(_v215);
      const _v216 = document.createElement("h4");
      _v216.className = "gear-name";
      _v216.textContent = _v211.name;
      _v213.appendChild(_v216);
      if (_v4.currentCat === "using" || _v4.currentCat === "all") {
        const _v218 = _v4.categories.find(_v220 => _v220.id === _v211.category);
        const _v219 = document.createElement("p");
        _v219.className = "gear-tag";
        _v219.textContent = _v218 ? _v218.name : _v211.category;
        _v213.appendChild(_v219);
      } else if (_v211.rating) {
        const _v221 = document.createElement("p");
        _v221.className = "gear-rating " + _v87(_v211.rating);
        _v221.textContent = _v211.rating.includes("/") ? _v211.rating : _v211.rating + "/10";
        _v213.appendChild(_v221);
      }
      if (_v4.isEditMode) {
        _v213.setAttribute("draggable", "true");
        _v213.dataset.index = _v212;
        _v213.addEventListener("dragstart", _v222 => {
          _v84 = _v212;
          const _v223 = _v213.cloneNode(true);
          _v223.style.position = "absolute";
          _v223.style.top = "-9999px";
          _v223.style.right = "-9999px";
          _v223.style.background = "#fff";
          _v223.style.backdropFilter = "none";
          _v223.style.transform = "none";
          _v223.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
          _v223.style.width = _v213.offsetWidth + "px";
          _v223.style.height = _v213.offsetHeight + "px";
          document.body.appendChild(_v223);
          const _v224 = _v213.getBoundingClientRect();
          const _v225 = _v222.clientX - _v224.left;
          const _v226 = _v222.clientY - _v224.top;
          _v222.dataTransfer.setDragImage(_v223, _v225, _v226);
          setTimeout(() => {
            _v213.classList.add("dragging");
            document.body.removeChild(_v223);
          }, 0);
          _v222.dataTransfer.effectAllowed = "move";
          _v222.dataTransfer.setData("text/plain", _v211.id);
        });
        _v213.addEventListener("dragend", () => {
          _v84 = null;
          _v213.classList.remove("dragging");
          document.querySelectorAll(".gear-item").forEach(_v227 => _v227.classList.remove("drag-over"));
        });
        _v213.addEventListener("dragover", _v228 => {
          _v228.preventDefault();
          _v228.dataTransfer.dropEffect = "move";
          if (_v84 !== null && _v84 !== _v212) {
            _v213.classList.add("drag-over");
          }
        });
        _v213.addEventListener("dragleave", () => {
          _v213.classList.remove("drag-over");
        });
        _v213.addEventListener("drop", async _v229 => {
          _v229.preventDefault();
          _v213.classList.remove("drag-over");
          const _v230 = _v212;
          if (_v84 !== null && _v84 !== _v230) {
            const _v231 = _v190.splice(_v84, 1)[0];
            _v190.splice(_v230, 0, _v231);
            const _v232 = _v190.map(_v233 => _v233.id);
            _v4.orders[_v4.currentCat] = _v232;
            _v97();
            await _v98(_v4.currentCat, _v232);
          }
        });
      }
      _v213.addEventListener("click", () => _v99(_v211));
      _v189.appendChild(_v213);
    });
    if (_v4.currentCat !== "using") {
      const _v234 = document.createElement("div");
      _v234.className = "gear-item";
      _v234.id = "add-gear";
      _v234.title = "Add New Gear";
      _v234.innerHTML = "<img src=\"./src/assets/images/icons/add.svg\" alt=\"add\" />";
      _v234.addEventListener("click", () => _v102());
      _v189.appendChild(_v234);
    }
    if (_v190.length === 0 && _v4.currentCat === "all" && _v4.searchQuery.trim()) {
      _v6.innerHTML = "<p style=\"text-align:center; padding: 40px; color:#888;\">No gears found for \"" + _v4.searchQuery + "\"</p>";
    } else {
      _v6.appendChild(_v189);
    }
    if (_v4.isEditMode) {
      _v189.addEventListener("dragover", _v235 => {
        _v235.preventDefault();
        _v235.dataTransfer.dropEffect = "move";
      });
    }
  }
  async function _v98(_v236, _v237) {
    try {
      const _v238 = await fetch(_v1, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Mizu-Pass": _v4.password
        },
        body: JSON.stringify({
          action: "reorderGears",
          catId: _v236,
          orderedIds: _v237
        })
      });
      const _v239 = await _v238.json();
      if (_v239.success) {
        _v88("Position saved!", "success");
      } else {
        _v88("Error saving position: " + _v239.message, "error");
      }
    } catch (_v240) {
      _v88("Connection error while saving order", "error");
    }
  }
  if (_v14) {
    _v14.addEventListener("input", _v241 => {
      _v4.searchQuery = _v241.target.value;
      if (_v15) {
        _v15.style.display = _v4.searchQuery ? "block" : "none";
      }
      _v97();
    });
  }
  if (_v15) {
    _v15.addEventListener("click", () => {
      _v4.searchQuery = "";
      if (_v14) {
        _v14.value = "";
      }
      _v15.style.display = "none";
      _v97();
      if (_v14) {
        _v14.focus();
      }
    });
  }
  function _v99(_v242) {
    if (_v4.isEditMode) {
      _v102(_v242);
      return;
    }
    if (_v242.directBuy) {
      if (_v242.buyUrl) {
        if (_v3) {
          window.location.href = _v242.buyUrl;
        } else {
          window.open(_v242.buyUrl, "_blank", "noopener,noreferrer");
        }
      } else {
        _v100(_v242);
      }
      return;
    }
    _v100(_v242);
  }
  function _v100(_v243) {
    _v43.src = _v243.image || "./src/assets/images/icons/meow.png";
    _v44.textContent = _v243.name;
    const _v244 = _v4.categories.find(_v247 => _v247.id === _v243.category);
    _v45.textContent = _v244 ? _v244.name : _v243.category;
    _v46.textContent = _v243.rating ? _v243.rating.includes("/") ? _v243.rating : _v243.rating + "/10" : "--/10";
    _v46.className = "popup-rating " + _v87(_v243.rating);
    if (_v243.buyUrl && _v243.buyUrl.trim()) {
      _v47.href = _v243.buyUrl;
      _v47.target = _v3 ? "_self" : "_blank";
      _v47.style.display = "inline-flex";
    } else {
      _v47.style.display = "none";
    }
    if (_v48) {
      _v48.innerHTML = "";
      if (_v243.extraLinks && Array.isArray(_v243.extraLinks) && _v243.extraLinks.length > 0) {
        _v243.extraLinks.forEach(_v248 => {
          if (!_v248.url || !_v248.url.trim()) {
            return;
          }
          const _v249 = document.createElement("a");
          _v249.className = "popup-extra-btn";
          _v249.href = _v248.url.trim();
          _v249.target = _v3 ? "_self" : "_blank";
          _v249.rel = "noopener noreferrer";
          const _v250 = _v248.url.toLowerCase().includes("facebook.com") || _v248.label && _v248.label.toLowerCase().includes("facebook");
          const _v251 = _v250 ? "<img src=\"./src/assets/images/social/Facebook.svg\" alt=\"fb\" width=\"14\" height=\"14\" />" : "🔗";
          _v249.innerHTML = _v251 + "<span>" + (_v248.label || "Link") + "</span>";
          _v48.appendChild(_v249);
        });
      }
    }
    const _v245 = (_v243.review || "").trim();
    _v49.textContent = _v245 || "No detailed review available for this item.";
    const _v246 = _v91(_v243.youtube);
    if (_v246) {
      _v50.innerHTML = "<iframe src=\"https://www.youtube-nocookie.com/embed/" + _v246 + "?autoplay=0&loop=1&playlist=" + _v246 + "\" allowfullscreen allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\"></iframe>";
      if (_v243.youtube && _v243.youtube.includes("shorts")) {
        _v50.className = "popup-video-container tt-video";
      } else {
        _v50.className = "popup-video-container yt-video";
      }
      _v50.style.display = "block";
    } else {
      _v50.innerHTML = "";
      _v50.className = "popup-video-container";
      _v50.style.display = "none";
    }
    _v41.classList.add("active");
  }
  function _v101() {
    _v41.classList.remove("active");
    _v50.innerHTML = "";
    _v50.style.display = "none";
    if (_v48) {
      _v48.innerHTML = "";
    }
  }
  function _v102(_v252 = null) {
    _v57.innerHTML = "";
    _v4.categories.forEach(_v253 => {
      if (_v253.id === "using" || _v253.id === "all") {
        return;
      }
      const _v254 = document.createElement("option");
      _v254.value = _v253.id;
      _v254.textContent = _v253.name + (_v253.hidden ? " (Hidden)" : "");
      _v57.appendChild(_v254);
    });
    if (_v67) {
      _v67.innerHTML = "";
    }
    if (_v252) {
      _v53.textContent = "Edit Gear";
      _v55.value = _v252.id;
      _v56.value = _v252.name;
      _v57.value = _v252.category;
      _v58.value = _v252.image || "";
      _v59.value = _v252.buyUrl || "";
      _v60.value = _v252.rating || "";
      _v61.value = _v252.review || "";
      _v62.value = _v252.youtube || "";
      _v63.checked = !!_v252.stared;
      _v64.checked = !!_v252.directBuy;
      if (_v65) {
        _v65.checked = !!_v252.hidden;
      }
      if (_v252.extraLinks && Array.isArray(_v252.extraLinks)) {
        _v252.extraLinks.forEach(_v255 => _v92(_v255.label, _v255.url));
      }
      _v66.style.display = "block";
    } else {
      _v53.textContent = "Add New Gear";
      _v54.reset();
      _v55.value = "";
      const _v256 = _v4.currentCat !== "using" && _v4.currentCat !== "all" ? _v4.currentCat : _v4.categories.find(_v257 => !_v257.fixed)?.id || "mice";
      _v57.value = _v256;
      _v64.checked = false;
      if (_v65) {
        _v65.checked = false;
      }
      _v66.style.display = "none";
    }
    _v51.classList.add("active");
  }
  function _v103() {
    _v51.classList.remove("active");
  }
  _v54.addEventListener("submit", async _v258 => {
    _v258.preventDefault();
    const _v259 = _v54.querySelector(".btn-save");
    const _v260 = _v259.textContent;
    _v259.textContent = "Processing link...";
    _v259.disabled = true;
    let _v261 = _v59.value.trim();
    if (_v261.match(/s\.shopee\.vn\/[a-zA-Z0-9]+/)) {
      try {
        const _v265 = await fetch(_v1, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Mizu-Pass": _v4.password
          },
          body: JSON.stringify({
            action: "resolveShopee",
            url: _v261
          })
        });
        const _v266 = await _v265.json();
        if (_v266.success && _v266.finalUrl) {
          _v261 = _v266.finalUrl;
        }
      } catch (_v267) {
        console.log("Unshorten API error, falling back to original link", _v267);
      }
    }
    const _v262 = _v86(_v261);
    const _v263 = [];
    if (_v67) {
      const _v268 = _v67.querySelectorAll(".extra-link-item");
      _v268.forEach(_v269 => {
        const _v270 = _v269.querySelector(".extra-link-label");
        const _v271 = _v269.querySelector(".extra-link-url");
        const _v272 = _v270 ? _v270.value.trim() : "";
        let _v273 = _v271 ? _v271.value.trim() : "";
        if (_v273) {
          _v273 = _v86(_v273);
          _v263.push({
            label: _v272 || "Link",
            url: _v273
          });
        }
      });
    }
    const _v264 = {
      id: _v55.value || "gear_" + Date.now(),
      name: _v56.value.trim(),
      category: _v57.value,
      image: _v58.value.trim(),
      buyUrl: _v262,
      extraLinks: _v263,
      rating: _v60.value.trim(),
      review: _v61.value.trim(),
      youtube: _v62.value.trim(),
      stared: _v63.checked,
      directBuy: _v64.checked,
      hidden: _v65 ? _v65.checked : false
    };
    try {
      const _v274 = await fetch(_v1, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Mizu-Pass": _v4.password
        },
        body: JSON.stringify({
          action: "saveGear",
          gear: _v264
        })
      });
      const _v275 = await _v274.json();
      if (_v275.success) {
        _v103();
        _v88("Gear saved successfully!", "success");
        await _v93();
      } else {
        _v88(_v275.message || "Error saving gear!", "error");
      }
    } catch (_v276) {
      _v88("Worker error: " + _v276.message, "error");
    } finally {
      _v259.textContent = _v260;
      _v259.disabled = false;
    }
  });
  _v66.addEventListener("click", () => {
    const _v277 = _v55.value;
    if (!_v277) {
      return;
    }
    _v89("Delete Gear", "Are you sure you want to delete this gear?", async () => {
      _v103();
      try {
        const _v278 = await fetch(_v1, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Mizu-Pass": _v4.password
          },
          body: JSON.stringify({
            action: "deleteGear",
            id: _v277
          })
        });
        const _v279 = await _v278.json();
        if (_v279.success) {
          _v88("Gear deleted!", "success");
          await _v93();
        } else {
          _v88(_v279.message, "error");
        }
      } catch (_v280) {
        _v88("Error deleting gear: " + _v280.message, "error");
      }
    });
  });
  async function _v104(_v281) {
    try {
      const _v282 = await fetch(_v1, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Mizu-Pass": _v4.password
        },
        body: JSON.stringify({
          action: "toggleStar",
          id: _v281
        })
      });
      const _v283 = await _v282.json();
      if (_v283.success) {
        const _v284 = _v4.gears.find(_v285 => _v285.id === _v281);
        if (_v284) {
          _v284.stared = _v283.stared;
        }
        _v97();
      }
    } catch (_v286) {
      _v88("Error toggling pin: " + _v286.message, "error");
    }
  }
  if (_v24) {
    _v24.addEventListener("submit", async _v287 => {
      _v287.preventDefault();
      const _v288 = _v25.value.trim();
      const _v289 = _v26 ? _v26.checked : false;
      if (!_v288) {
        return;
      }
      try {
        const _v290 = await fetch(_v1, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Mizu-Pass": _v4.password
          },
          body: JSON.stringify({
            action: "addCategory",
            name: _v288,
            hidden: _v289
          })
        });
        const _v291 = await _v290.json();
        if (_v291.success) {
          _v21.classList.remove("active");
          _v88("New category added!", "success");
          await _v93();
        } else {
          _v88(_v291.message, "error");
        }
      } catch (_v292) {
        _v88("Error adding category: " + _v292.message, "error");
      }
    });
  }
  if (_v22) {
    _v22.addEventListener("click", () => _v21.classList.remove("active"));
  }
  if (_v23) {
    _v23.addEventListener("click", () => _v21.classList.remove("active"));
  }
  if (_v30) {
    _v30.addEventListener("submit", async _v293 => {
      _v293.preventDefault();
      const _v294 = _v32.value;
      const _v295 = _v31.value.trim();
      const _v296 = _v33 ? _v33.checked : false;
      if (!_v295) {
        return;
      }
      try {
        const _v297 = await fetch(_v1, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Mizu-Pass": _v4.password
          },
          body: JSON.stringify({
            action: "editCategory",
            id: _v294,
            name: _v295,
            hidden: _v296
          })
        });
        const _v298 = await _v297.json();
        if (_v298.success) {
          _v27.classList.remove("active");
          _v88("Category updated!", "success");
          await _v93();
        } else {
          _v88(_v298.message, "error");
        }
      } catch (_v299) {
        _v88("Error renaming category: " + _v299.message, "error");
      }
    });
  }
  if (_v28) {
    _v28.addEventListener("click", () => _v27.classList.remove("active"));
  }
  if (_v29) {
    _v29.addEventListener("click", () => _v27.classList.remove("active"));
  }
  async function _v105(_v300) {
    try {
      const _v301 = await fetch(_v1, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Mizu-Pass": _v4.password
        },
        body: JSON.stringify({
          action: "deleteCategory",
          id: _v300
        })
      });
      const _v302 = await _v301.json();
      if (_v302.success) {
        if (_v4.currentCat === _v300) {
          _v4.currentCat = "using";
        }
        _v88("Category deleted!", "success");
        await _v93();
      } else {
        _v88(_v302.message, "error");
      }
    } catch (_v303) {
      _v88("Error deleting category: " + _v303.message, "error");
    }
  }
  _v11.addEventListener("click", () => {
    _v106();
  });
  function _v106() {
    const _v304 = _v4.categories.find(_v306 => _v306.id === _v4.currentCat);
    _v73.textContent = "Sort: " + (_v304 ? _v304.name : _v4.currentCat);
    if (_v4.currentCat === "all") {
      _v80 = [..._v4.gears];
    } else if (_v4.currentCat === "using") {
      _v80 = _v4.gears.filter(_v307 => _v307.stared);
    } else {
      _v80 = _v4.gears.filter(_v308 => _v308.category === _v4.currentCat);
    }
    const _v305 = _v4.orders[_v4.currentCat] || [];
    if (_v305.length > 0) {
      const _v309 = new Map(_v305.map((_v310, _v311) => [_v310, _v311]));
      _v80.sort((_v312, _v313) => {
        const _v314 = _v309.has(_v312.id) ? _v309.get(_v312.id) : 9999;
        const _v315 = _v309.has(_v313.id) ? _v309.get(_v313.id) : 9999;
        return _v314 - _v315;
      });
    }
    _v107();
    _v69.classList.add("active");
  }
  function _v107() {
    _v72.innerHTML = "";
    if (_v80.length === 0) {
      _v72.innerHTML = "<p style='font-size: 0.85em; color: #888;'>No items to sort.</p>";
      return;
    }
    _v80.forEach((_v316, _v317) => {
      const _v318 = document.createElement("div");
      _v318.className = "reorder-row";
      _v318.setAttribute("draggable", "true");
      _v318.dataset.index = _v317;
      const _v319 = document.createElement("div");
      _v319.className = "reorder-left";
      const _v320 = document.createElement("div");
      _v320.className = "reorder-drag-handle";
      _v320.title = "Drag to move";
      _v320.innerHTML = "<svg stroke=\"currentColor\" fill=\"currentColor\" stroke-width=\"0\" viewBox=\"0 0 512 512\" height=\"20\" width=\"20\" xmlns=\"http://www.w3.org/2000/svg\"><path fill=\"none\" stroke-linecap=\"round\" stroke-miterlimit=\"10\" stroke-width=\"48\" d=\"M88 152h336M88 256h336M88 360h336\"></path></svg>";
      const _v321 = document.createElement("div");
      _v321.className = "reorder-info";
      _v321.innerHTML = "\n        <img src=\"" + (_v316.image || "./src/assets/images/icons/meow.png") + "\" alt=\"thumb\">\n        <span class=\"reorder-name\">" + _v316.name + "</span>\n      ";
      _v319.appendChild(_v320);
      _v319.appendChild(_v321);
      _v318.appendChild(_v319);
      const _v322 = document.createElement("div");
      _v322.className = "reorder-actions";
      const _v323 = document.createElement("button");
      _v323.className = "reorder-btn";
      _v323.textContent = "↑";
      _v323.disabled = _v317 === 0;
      _v323.addEventListener("click", () => {
        if (_v317 > 0) {
          const _v325 = _v80[_v317 - 1];
          _v80[_v317 - 1] = _v80[_v317];
          _v80[_v317] = _v325;
          _v107();
        }
      });
      const _v324 = document.createElement("button");
      _v324.className = "reorder-btn";
      _v324.textContent = "↓";
      _v324.disabled = _v317 === _v80.length - 1;
      _v324.addEventListener("click", () => {
        if (_v317 < _v80.length - 1) {
          const _v326 = _v80[_v317 + 1];
          _v80[_v317 + 1] = _v80[_v317];
          _v80[_v317] = _v326;
          _v107();
        }
      });
      _v322.appendChild(_v323);
      _v322.appendChild(_v324);
      _v318.appendChild(_v322);
      _v318.addEventListener("dragstart", _v327 => {
        _v81 = _v317;
        _v318.classList.add("dragging");
        _v327.dataTransfer.effectAllowed = "move";
      });
      _v318.addEventListener("dragend", () => {
        _v81 = null;
        _v318.classList.remove("dragging");
        document.querySelectorAll(".reorder-row").forEach(_v328 => _v328.classList.remove("drag-over"));
      });
      _v318.addEventListener("dragover", _v329 => {
        _v329.preventDefault();
        _v329.dataTransfer.dropEffect = "move";
        _v318.classList.add("drag-over");
      });
      _v318.addEventListener("dragleave", () => {
        _v318.classList.remove("drag-over");
      });
      _v318.addEventListener("drop", _v330 => {
        _v330.preventDefault();
        _v318.classList.remove("drag-over");
        const _v331 = _v317;
        if (_v81 !== null && _v81 !== _v331) {
          const _v332 = _v80.splice(_v81, 1)[0];
          _v80.splice(_v331, 0, _v332);
          _v107();
        }
      });
      _v72.appendChild(_v318);
    });
  }
  function _v108() {
    _v82 = [..._v4.categories];
    _v109();
    _v75.classList.add("active");
  }
  function _v109() {
    _v78.innerHTML = "";
    if (_v82.length === 0) {
      _v78.innerHTML = "<p style='font-size: 0.85em; color: #888;'>No categories to sort.</p>";
      return;
    }
    _v82.forEach((_v333, _v334) => {
      const _v335 = document.createElement("div");
      _v335.className = "reorder-row";
      _v335.setAttribute("draggable", "true");
      _v335.dataset.index = _v334;
      const _v336 = document.createElement("div");
      _v336.className = "reorder-left";
      const _v337 = document.createElement("div");
      _v337.className = "reorder-drag-handle";
      _v337.title = "Drag to move";
      _v337.innerHTML = "<svg stroke=\"currentColor\" fill=\"currentColor\" stroke-width=\"0\" viewBox=\"0 0 512 512\" height=\"20\" width=\"20\" xmlns=\"http://www.w3.org/2000/svg\"><path fill=\"none\" stroke-linecap=\"round\" stroke-miterlimit=\"10\" stroke-width=\"48\" d=\"M88 152h336M88 256h336M88 360h336\"></path></svg>";
      const _v338 = document.createElement("div");
      _v338.className = "reorder-info";
      _v338.innerHTML = "<span class=\"reorder-name\" style=\"margin-left:4px;\">" + _v333.name + "</span>";
      _v336.appendChild(_v337);
      _v336.appendChild(_v338);
      _v335.appendChild(_v336);
      const _v339 = document.createElement("div");
      _v339.className = "reorder-actions";
      const _v340 = document.createElement("button");
      _v340.className = "reorder-btn";
      _v340.textContent = "↑";
      _v340.disabled = _v334 === 0;
      _v340.addEventListener("click", () => {
        if (_v334 > 0) {
          const _v342 = _v82[_v334 - 1];
          _v82[_v334 - 1] = _v82[_v334];
          _v82[_v334] = _v342;
          _v109();
        }
      });
      const _v341 = document.createElement("button");
      _v341.className = "reorder-btn";
      _v341.textContent = "↓";
      _v341.disabled = _v334 === _v82.length - 1;
      _v341.addEventListener("click", () => {
        if (_v334 < _v82.length - 1) {
          const _v343 = _v82[_v334 + 1];
          _v82[_v334 + 1] = _v82[_v334];
          _v82[_v334] = _v343;
          _v109();
        }
      });
      _v339.appendChild(_v340);
      _v339.appendChild(_v341);
      _v335.appendChild(_v339);
      _v335.addEventListener("dragstart", _v344 => {
        _v83 = _v334;
        _v335.classList.add("dragging");
        _v344.dataTransfer.effectAllowed = "move";
      });
      _v335.addEventListener("dragend", () => {
        _v83 = null;
        _v335.classList.remove("dragging");
        document.querySelectorAll(".reorder-row").forEach(_v345 => _v345.classList.remove("drag-over"));
      });
      _v335.addEventListener("dragover", _v346 => {
        _v346.preventDefault();
        _v346.dataTransfer.dropEffect = "move";
        _v335.classList.add("drag-over");
      });
      _v335.addEventListener("dragleave", () => {
        _v335.classList.remove("drag-over");
      });
      _v335.addEventListener("drop", _v347 => {
        _v347.preventDefault();
        _v335.classList.remove("drag-over");
        const _v348 = _v334;
        if (_v83 !== null && _v83 !== _v348) {
          const _v349 = _v82.splice(_v83, 1)[0];
          _v82.splice(_v348, 0, _v349);
          _v109();
        }
      });
      _v78.appendChild(_v335);
    });
  }
  window.addEventListener("wheel", _v350 => {
    if (_v81 !== null && _v72) {
      _v72.scrollTop += _v350.deltaY;
    }
    if (_v83 !== null && _v78) {
      _v78.scrollTop += _v350.deltaY;
    }
  }, {
    passive: true
  });
  if (_v72) {
    _v72.addEventListener("dragover", _v351 => {
      _v351.preventDefault();
      const _v352 = _v72.getBoundingClientRect();
      const _v353 = 60;
      const _v354 = 10;
      if (_v351.clientY < _v352.top + _v353) {
        _v72.scrollTop -= _v354;
      } else if (_v351.clientY > _v352.bottom - _v353) {
        _v72.scrollTop += _v354;
      }
    });
  }
  if (_v78) {
    _v78.addEventListener("dragover", _v355 => {
      _v355.preventDefault();
      const _v356 = _v78.getBoundingClientRect();
      const _v357 = 60;
      const _v358 = 10;
      if (_v355.clientY < _v356.top + _v357) {
        _v78.scrollTop -= _v358;
      } else if (_v355.clientY > _v356.bottom - _v357) {
        _v78.scrollTop += _v358;
      }
    });
  }
  _v70.addEventListener("click", () => _v69.classList.remove("active"));
  if (_v71) {
    _v71.addEventListener("click", () => _v69.classList.remove("active"));
  }
  _v74.addEventListener("click", async () => {
    const _v359 = _v80.map(_v360 => _v360.id);
    try {
      const _v361 = await fetch(_v1, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Mizu-Pass": _v4.password
        },
        body: JSON.stringify({
          action: "reorderGears",
          catId: _v4.currentCat,
          orderedIds: _v359
        })
      });
      const _v362 = await _v361.json();
      if (_v362.success) {
        _v4.orders[_v4.currentCat] = _v359;
        _v69.classList.remove("active");
        _v88("Display order saved successfully!", "success");
        _v97();
      } else {
        _v88(_v362.message || "Error saving order!", "error");
      }
    } catch (_v363) {
      _v88("Worker connection error: " + _v363.message, "error");
    }
  });
  if (_v76) {
    _v76.addEventListener("click", () => _v75.classList.remove("active"));
  }
  if (_v77) {
    _v77.addEventListener("click", () => _v75.classList.remove("active"));
  }
  if (_v79) {
    _v79.addEventListener("click", async () => {
      const _v364 = _v82.map(_v365 => _v365.id);
      try {
        const _v366 = await fetch(_v1, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Mizu-Pass": _v4.password
          },
          body: JSON.stringify({
            action: "reorderCategories",
            orderedIds: _v364
          })
        });
        const _v367 = await _v366.json();
        if (_v367.success) {
          _v75.classList.remove("active");
          _v88("Category order saved!", "success");
          await _v93();
        } else {
          _v88(_v367.message || "Error saving category order!", "error");
        }
      } catch (_v368) {
        _v88("Worker connection error: " + _v368.message, "error");
      }
    });
  }
  _v7.addEventListener("click", () => {
    if (_v4.isEditMode) {
      _v110(false);
      return;
    }
    const _v369 = localStorage.getItem("khoaan_gear_pass");
    if (_v369) {
      _v4.password = _v369;
      _v110(true);
      _v88("Auto-authenticated with saved password!", "success");
      return;
    }
    _v20.style.display = "none";
    _v19.value = "";
    _v16.classList.add("active");
    _v19.focus();
  });
  _v17.addEventListener("click", () => _v16.classList.remove("active"));
  _v18.addEventListener("submit", async _v370 => {
    _v370.preventDefault();
    const _v371 = _v19.value.trim();
    if (!_v371) {
      return;
    }
    try {
      const _v372 = await fetch(_v1, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action: "verify",
          password: _v371
        })
      });
      const _v373 = await _v372.json();
      if (_v373.success) {
        _v4.password = _v371;
        localStorage.setItem("khoaan_gear_pass", _v371);
        _v16.classList.remove("active");
        _v110(true);
        _v88("Login successful! Device remembered.", "success");
      } else {
        _v20.textContent = _v373.message || "Invalid password!";
        _v20.style.display = "block";
      }
    } catch (_v374) {
      _v20.textContent = "Connection error: " + _v374.message;
      _v20.style.display = "block";
    }
  });
  function _v110(_v375) {
    _v4.isEditMode = _v375;
    if (_v375) {
      document.body.classList.add("edit-mode");
      _v8.style.display = "flex";
    } else {
      document.body.classList.remove("edit-mode");
      _v8.style.display = "none";
    }
    _v94();
    _v97();
  }
  _v9.addEventListener("click", () => _v110(false));
  _v10.addEventListener("click", () => {
    _v89("Logout", "Do you want to logout and remove the saved password from this device?", () => {
      localStorage.removeItem("khoaan_gear_pass");
      _v4.password = "";
      _v110(false);
      _v88("Logged out successfully!", "info");
    });
  });
  const _v111 = localStorage.getItem("khoaan_gear_pass");
  if (_v111) {
    _v4.password = _v111;
    _v110(true);
  }
  _v42.addEventListener("click", _v101);
  _v52.addEventListener("click", _v103);
  document.querySelectorAll(".popup-card").forEach(_v376 => {
    _v376.addEventListener("click", _v377 => {
      _v377.stopPropagation();
    });
  });
  _v93();
})();
