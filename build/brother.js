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
  this.init();
};

Canvas.prototype = {
  init: function init() {
    this.cvs = {
      helper: document.createElement('canvas'),
      preview: document.createElement('canvas')
    };
    this.ctx = {
      helper: this.cvs.helper.getContext('2d'),
      preview: this.cvs.preview.getContext('2d')
    };
    this.scale = 3;
  },

  drawImage: function drawImage(image) {
    var ctx = this.ctx.helper;
    var cvs = this.cvs.helper;

    cvs.width = image.width;
    cvs.height = image.height;
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.drawImage(image, 0, 0);
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

  drawProcessed: function drawProcessed(data) {
    //console.log(data)
    var ctx = this.ctx.preview;
    var cvs = this.cvs.preview;
    var d = data.data;

    cvs.width = data.columns * this.scale;
    cvs.height = data.rows * this.scale * data.stretch;
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.fillStyle = '#000';

    for (var i = 0; i < d.length; i += 1) {
      if (d[i] == 0) {
        var x = i % data.columns * this.scale;
        var y = Math.floor(i / data.columns) * this.scale * data.stretch;
        ctx.fillRect(x, y, this.scale, this.scale * data.stretch);
      }
    }
  },

  getHelperCanvas: function getHelperCanvas() {
    return this.cvs.helper;
  },

  getPreviewCanvas: function getPreviewCanvas() {
    return this.cvs.preview;
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
  this.needsUpdate = true;
  this.loaded = false;
  this.init();
};

Parser.prototype = {
  init: function init() {
    // ui values
    this.threshold = 50;
    this.stretch = 1;
    this.threadcount = 200;
    this.size = 10;

    // results
    this.data = [];
    this.result = {};
  },

  imageToPixelArray: function imageToPixelArray(image) {
    this.data = [];
    this.image = image;

    // offscreen canvas
    var cvs = document.createElement('canvas');
    var ctx = cvs.getContext('2d');

    cvs.width = image.width;
    cvs.height = image.height;
    ctx.drawImage(image, 0, 0);

    var raw = ctx.getImageData(0, 0, image.width, image.height).data;

    // parse canvas data
    for (var i = 0; i < raw.length; i += 4) {
      this.data.push({
        r: raw[i],
        g: raw[i + 1],
        b: raw[i + 2]
      });
    }

    // resize
    this.fitToImage();
    this.loaded = true;
  },

  fitToImage: function fitToImage() {
    this.size = this.image.width / this.threadcount;
    this.needsUpdate = true;
  },

  setSize: function setSize(size) {
    this.size = size;
    this.threadcount = Math.min(200, Math.floor(this.image.width / this.size));
    this.needsUpdate = true;
  },

  setStretch: function setStretch(stretch) {
    this.stretch = stretch;
    this.result.stretch = this.stretch;
  },

  setThreshold: function setThreshold(threshold) {
    this.threshold = threshold;
    this.needsUpdate = true;
  },

  setThreadcount: function setThreadcount(count) {
    this.threadcount = count;
    this.needsUpdate = true;
  },

  getBrightness: function getBrightness(pixel) {
    return (pixel.r + pixel.g + pixel.b) / 3;
  },

  process: function process() {
    var rowCount = Math.floor(this.image.height / this.size);
    var w = this.image.width;

    this.result = {
      rows: rowCount,
      columns: this.threadcount,
      stretch: this.stretch,
      data: []
    };

    console.log(this.size);

    for (var row = 0; row < rowCount; row += 1) {
      for (var col = 0; col < this.threadcount; col += 1) {
        var brightness = 0;
        var count = 0;
        var baseIndex = Math.floor(col * this.size + row * this.image.width * this.size);

        for (var x = 0; x < this.size; x += 1) {
          for (var y = 0; y < this.size; y += 1) {
            var index = Math.floor(baseIndex + x + y * this.image.width);
            count += 1;
            brightness += this.getBrightness(this.data[index]);
          }
        }

        brightness = brightness / count / 255. * 100;
        var res = brightness >= this.threshold ? 1 : 0;

        this.result.data.push(res);
      }
    }

    this.needsUpdate = false;
  },

  save: function save(filename, data) {
    // save data to file
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