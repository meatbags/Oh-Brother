var Brother =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Parser = exports.Canvas = exports.Loader = undefined;

var _Loader = __webpack_require__(1);

var _Loader2 = _interopRequireDefault(_Loader);

var _Canvas = __webpack_require__(2);

var _Canvas2 = _interopRequireDefault(_Canvas);

var _Parser = __webpack_require__(3);

var _Parser2 = _interopRequireDefault(_Parser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Loader = _Loader2.default;
exports.Canvas = _Canvas2.default;
exports.Parser = _Parser2.default;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var Loader = function Loader() {
  this.image = new Image();
  this.onload = null;
};

Loader.prototype = {
  load: function load(raw) {
    this.image.onload = this.onload;
    this.image.src = raw;
  },

  getImageRaw: function getImageRaw() {
    return this.image;
  }
};

exports.default = Loader;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var Canvas = function Canvas() {
  this.image = new Image();
  this.loaded = false;
  this.init();
};

Canvas.prototype = {
  init: function init() {
    this.cvs = {
      offscreen: document.createElement('canvas'),
      helper: document.createElement('canvas'),
      preview: document.createElement('canvas')
    };
    this.ctx = {
      offscreen: this.cvs.offscreen.getContext('2d'),
      helper: this.cvs.helper.getContext('2d'),
      preview: this.cvs.preview.getContext('2d')
    };
  },

  drawImage: function drawImage() {
    var ctx = this.ctx.helper;
    var cvs = this.cvs.helper;

    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.drawImage(this.image, 0, 0);
  },

  drawGrid: function drawGrid(size) {
    var cvs = this.cvs.helper;
    var ctx = this.ctx.helper;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';

    for (var x = 0; x < cvs.width; x += size) {
      ctx.fillRect(x, 0, 1, cvs.height);
    }

    for (var y = 0; y < cvs.height; y += size) {
      ctx.fillRect(0, y, cvs.width, 1);
    }
  },

  getHelperCanvas: function getHelperCanvas() {
    return this.cvs.helper;
  },

  getPreviewCanvas: function getPreviewCanvas() {
    return this.cvs.preview;
  },

  imageToPixelArray: function imageToPixelArray(image) {
    var w = image.width;
    var h = image.height;

    this.cvs.offscreen.width = w;
    this.cvs.offscreen.height = h;
    this.ctx.offscreen.drawImage(image, 0, 0);

    var data = this.ctx.offscreen.getImageData(0, 0, w, h).data;
    var pixels = [];
    for (var i = 0; i < data.length; i += 4) {
      pixels.push({
        r: data[i],
        g: data[i + 1],
        b: data[i + 2]
      });
    }

    // prep image for draw
    this.image = image;
    this.cvs.helper.width = w;
    this.cvs.helper.height = h;
    this.loaded = true;

    return pixels;
  }
};

exports.default = Canvas;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var Parser = function Parser() {
  this.data = [];
  this.init();
};

Parser.prototype = {
  init: function init() {
    this.threshold = 50;
    this.stretch = 1;
    this.threadcount = 60;
    this.size = 10;
  },

  handle: function handle(data) {
    // pixel data
    this.data = data;
  },

  fitImage: function fitImage(image) {
    this.size = image.width / this.threadcount;
  },

  process: function process() {},

  save: function save(filename, data) {
    var blob = new Blob([data], { type: 'application/octet-stream' });
    saveAs(blob, filename);
  }

  /*
  var data = new Uint8Array(100);
  data[0] = 0xFF;
  var blob = new Blob([data], {type: "application/octet-stream"});
  saveAs(blob, 'thing.dat');
  */
};

exports.default = Parser;

/***/ })
/******/ ]);