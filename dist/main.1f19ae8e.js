// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"main.js":[function(require,module,exports) {
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var lineWidth = 5;
var enabled = false;
var imageDataFragment;
autoSetCanvasSize(canvas);
listenToUser(canvas);

toggle.onclick = function (e) {
  if (e.target.matches(".open")) {
    toggleClose.classList.add("show");
    toggleOpen.classList.remove("show");
    tools.style.display = "none";
  } else {
    toggleClose.classList.remove("show");
    toggleOpen.classList.add("show");
    tools.style.display = "block";
  }
};

clear.onclick = function () {
  context.clearRect(0, 0, canvas.width, canvas.height);
  canvasHistory = [];
  step = -1;
  back.classList.remove("active");
  go.classList.remove("active");
};

download.onclick = function () {
  var compositeOperation = context.globalCompositeOperation;
  context.globalCompositeOperation = "destination-over";
  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  var imageData = canvas.toDataURL("image/png");
  context.putImageData(context.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
  context.globalCompositeOperation = compositeOperation;
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.href = imageData;
  a.download = "myPaint";
  a.target = "_blank";
  a.click();
};

black.onclick = function () {
  context.fillStyle = "black";
  context.strokeStyle = "black";
  black.classList.add("active");
  red.classList.remove("active");
  green.classList.remove("active");
  blue.classList.remove("active");
};

red.onclick = function () {
  context.fillStyle = "red";
  context.strokeStyle = "red";
  red.classList.add("active");
  green.classList.remove("active");
  blue.classList.remove("active");
  black.classList.remove("active");
};

green.onclick = function () {
  context.fillStyle = "green";
  context.strokeStyle = "green";
  green.classList.add("active");
  red.classList.remove("active");
  blue.classList.remove("active");
  black.classList.remove("active");
};

blue.onclick = function () {
  context.fillStyle = "blue";
  context.strokeStyle = "blue";
  blue.classList.add("active");
  green.classList.remove("active");
  red.classList.remove("active");
  black.classList.remove("active");
};

currentColor.onclick = function (e) {
  context.fillStyle = e.target.value;
  context.strokeStyle = e.target.value;
  blue.classList.remove("active");
  green.classList.remove("active");
  red.classList.remove("active");
  black.classList.remove("active");
};

currentColor.onchange = function (e) {
  context.fillStyle = e.target.value;
  context.strokeStyle = e.target.value;

  switch (e.target.value) {
    case "#000000":
      black.classList.add("active");
      break;

    case "#ff0000":
      red.classList.add("active");
      break;

    case "#008000":
      green.classList.add("active");
      break;

    case "#0000ff":
      blue.classList.add("active");
      break;
  }
};

range.onchange = function (e) {
  lineWidth = e.target.value * 1;
};

function autoSetCanvasSize(canvas) {
  canvasSize();

  window.onresize = function () {
    canvasSize();
  };
}

function canvasSize() {
  canvas.width = document.documentElement.clientWidth;
  canvas.height = document.documentElement.clientHeight;
}

function drawLine(x1, y1, x2, y2) {
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineWidth = lineWidth;
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
}

function drawCircle(x, y, radius) {
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();
}

function listenToUser(canvas) {
  var using = false;
  var lastPoint = {
    x: undefined,
    y: undefined
  }; //特性检测

  if (document.body.ontouchstart === undefined) {
    //非触屏设备
    canvas.onmousedown = function (a) {
      var x = a.clientX;
      var y = a.clientY;
      using = true;

      if (enabled) {
        clearRect(x, y);
      } else {
        lastPoint = {
          x: x,
          y: y
        };
      }
    };

    canvas.onmousemove = function (a) {
      var x = a.clientX;
      var y = a.clientY;

      if (!using) {
        return;
      }

      if (enabled) {
        clearRect(x, y);
      } else {
        var newPoint = {
          x: x,
          y: y
        };
        drawCircle(x, y, lineWidth / 2);
        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
        lastPoint = newPoint;
      }
    };

    canvas.onmouseup = function () {
      using = false;
    };
  } else {
    //触屏设备
    canvas.ontouchstart = function (a) {
      var x = a.touches[0].clientX;
      var y = a.touches[0].clientY;
      using = true;

      if (enabled) {
        clearRect(x, y);
      } else {
        lastPoint = {
          x: x,
          y: y
        };
      }
    };

    canvas.ontouchmove = function (a) {
      var x = a.touches[0].clientX;
      var y = a.touches[0].clientY;

      if (!using) {
        return;
      }

      if (enabled) {
        clearRect(x, y);
      } else {
        var newPoint = {
          x: x,
          y: y
        };
        drawCircle(x, y, lineWidth / 2);
        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
        lastPoint = newPoint;
      }
    };

    canvas.ontouchend = function () {
      using = false;
    };
  }
}

document.body.addEventListener("touchmove", function (e) {
  e.preventDefault();
}, {
  passive: false
});
},{}],"../../../AppData/Local/Yarn/Data/global/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "61228" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../AppData/Local/Yarn/Data/global/node_modules/parcel/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.1f19ae8e.js.map