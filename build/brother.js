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
//import './lib/FileSaver.min.js';

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
    if (size >= 2) {
      var cvs = this.cvs.helper;
      var ctx = this.ctx.helper;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';

      for (var x = 0; x < cvs.width; x += size) {
        ctx.fillRect(x, 0, 1, cvs.height);
      }

      for (var y = 0; y < cvs.height; y += size) {
        ctx.fillRect(0, y, cvs.width, 1);
      }
    }
  },

  drawProcessed: function drawProcessed(data) {
    var ctx = this.ctx.preview;
    var cvs = this.cvs.preview;
    var d = data.data;

    cvs.width = data.columns * this.scale;
    cvs.height = data.rows * this.scale;
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.fillStyle = '#000';

    for (var i = 0; i < d.length; i += 1) {
      if (d[i] == 1) {
        var x = i % data.columns * this.scale;
        var y = Math.floor(i / data.columns) * this.scale;
        ctx.fillRect(x, y, this.scale, this.scale);
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

var _Brother = __webpack_require__(4);

var _Brother2 = _interopRequireDefault(_Brother);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Parser = function Parser() {
  this.needsUpdate = true;
  this.loaded = false;
  this.brother = new _Brother2.default();
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
    this.needsUpdate = true;
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
    var sizeStretched = this.size / this.stretch;
    var rowCount = Math.floor(this.image.height / sizeStretched);

    this.result = {
      rows: rowCount,
      columns: this.threadcount,
      data: []
    };

    for (var row = 0; row < rowCount; row += 1) {
      for (var col = 0; col < this.threadcount; col += 1) {
        var brightness = 0;
        var count = 0;
        var baseIndex = Math.floor(col * this.size + Math.floor(row * sizeStretched) * this.image.width);

        for (var x = 0; x < this.size; x += 1) {
          for (var y = 0; y < sizeStretched; y += 1) {
            var index = baseIndex + x + y * this.image.width;

            if (index < this.data.length) {
              brightness += this.getBrightness(this.data[index]);
              count += 1;
            }
          }
        }

        brightness = count != 0 ? brightness / count / 255. * 100 : 0;
        var res = brightness >= this.threshold ? 0 : 1;

        this.result.data.push(res);
      }
    }

    this.needsUpdate = false;
  },

  save: function save(filename) {
    if (this.result.data) {
      // convert to binary
      var data = this.brother.convert(this.result.data, this.result.rows, this.result.columns);

      // save data to file
      var blob = new Blob([data], { type: 'application/octet-stream' });
      saveAs(blob, filename);
    } else {
      throw 'Error: No data';
    }
  },

  getLogs: function getLogs() {
    return this.brother.getLogs();
  }
};

exports.default = Parser;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// convert to the KH940 / KH930 format
// https://github.com/stg/knittington/blob/master/doc/kh940_format.txt

var Brother = function Brother() {};

Brother.prototype = {
  convert: function convert(input, rows, stitches) {
    // file data
    var data = new Uint8Array(0x8000);

    // sizing
    var memoBytes = Math.ceil(rows / 2);
    var rowNibbles = Math.ceil(stitches / 4);
    var dataBytes = Math.ceil(rowNibbles * rows / 2);
    var totalBytes = memoBytes + dataBytes;
    var rowPadding = rowNibbles * 4 - stitches;
    var offsetStart = rowNibbles * 4 * rows % 8 == 0 ? false : true;

    // headers
    var offset = 120;
    var patternNumber = 901;
    this.writeHeader(data, 0, offset, rows, stitches, patternNumber);
    this.writeHeader(data, 7, 0, 0, 0, 902);
    this.writeConstants(data, stitches, offset, totalBytes);

    // format data
    var memo = new Uint8Array(memoBytes);
    var pattern = new Uint8Array(dataBytes);
    this.writeInputToPattern(input, pattern, stitches, offsetStart, rowPadding);

    // write memo and pattern to file data
    var address = 0x7EDF;

    for (var i = memo.length - 1; i > -1; i -= 1) {
      data[address] = memo[i];
      address -= 1;
    }

    for (var _i = pattern.length - 1; _i > -1; _i -= 1) {
      data[address] = pattern[_i];
      address -= 1;
    }

    // log output
    this.logs = [];
    this.writeToLogs('Rows:', rows, 'Stitches:', stitches, 'Data Size:', input.length, '<br />', 'Memo Bytes:', memoBytes, 'Data Bytes:', dataBytes, 'Row Nibbles:', rowNibbles, 'Offset Data:', offsetStart, 'Row Padding:', rowPadding, '<br />', this.getHeader(data, 0), '<br />', this.sampleHex(pattern));

    return data;
  },

  copyValue: function copyValue(data, index, bytes, value) {
    // copy 8-bit value to memory locations
    while (bytes > 0) {
      bytes -= 1;
      data[index + bytes] = value;
    }
  },

  writeInputToPattern: function writeInputToPattern(input, pattern, stitches, offsetStart, rowPadding) {
    // write pattern
    var counter = offsetStart ? 4 : 0;

    for (var i = 0; i < input.length; i += 1) {
      var shift = 1;

      // pad if row start
      if (i % stitches == 0) {
        shift += rowPadding;
        counter += rowPadding;
      }

      // write bit
      var byte = Math.floor(counter / 8);
      pattern[byte] <<= shift;
      pattern[byte] |= input[i];

      // increment counter
      counter += 1;
    }
  },

  writeIndex: function writeIndex(data, index, bytes, value) {
    // write n-bit value at location
    var offset = 0;

    while (bytes > 0) {
      bytes -= 1;
      data[index + offset] = value >> bytes * 8 & 0xFF;
      offset += 1;
    }
  },

  decimalToNibble3: function decimalToNibble3(num) {
    // convert number to 3 digit nibbles

    var nib0 = Math.floor(num / 100) & 0xff;
    var nib1 = Math.floor(num % 100 / 10) & 0xff;
    var nib2 = num % 10 & 0xff;

    return (nib0 << 8) + (nib1 << 4) + nib2;
  },

  writeHeader: function writeHeader(data, address, offset, rows, stitches, patternNumber) {
    // header is structured in nibbles
    // OO OO HH HW WW ON NN
    // offset, height, width, 0x0, number

    var height = this.decimalToNibble3(rows);
    var width = this.decimalToNibble3(stitches);

    this.writeIndex(data, address + 0x0, 2, this.decimalToNibble3(offset));
    this.writeIndex(data, address + 0x2, 3, (height << 12) + width);
    this.writeIndex(data, address + 0x5, 2, this.decimalToNibble3(patternNumber));
  },

  writeConstants: function writeConstants(data, stitches, offset, size) {
    // NOTE: *requires update in future if more than one pattern is to be loaded
    var nextOffset = offset + size;
    var start = offset + size - 1;

    //this.copyValue(data, 0x7EE0, 7, 0x55);        // AREA0
    this.copyValue(data, 0x7EE7, 25, 0x00); // AREA1
    // CONTROL_DATA
    this.writeIndex(data, 0x7F00, 2, nextOffset); // PATTERN_PTR1 *
    this.writeIndex(data, 0x7F02, 2, 0x0001); // UNK1
    //this.writeIndex(data, 0x7F04, 2, nextOffset); // PATTERN_PTR0 *
    //this.writeIndex(data, 0x7F06, 2, offset);     // LAST_BOTTOM *
    //this.writeIndex(data, 0x7F08, 2, 0x0000);     // UNK2
    //this.writeIndex(data, 0x7F0A, 2, start);      // LAST_TOP
    //this.writeIndex(data, 0x7F0C, 4, 0x00008100); // UNK3
    this.writeIndex(data, 0x7F0C, 4, 0x00008300); // UNK3
    this.writeIndex(data, 0x7F10, 2, 0x7FF2); // HEADER_PTR *
    this.writeIndex(data, 0x7F12, 2, 0x0000); // UNK_PTR
    this.writeIndex(data, 0x7F14, 3, 0x000000); // UNK4
    // /CONTROL_DATA
    this.copyValue(data, 0x7F17, 25, 0x00); // AREA2
    this.copyValue(data, 0x7F30, 186, 0x00); // AREA3
    this.copyValue(data, 0x7FEC, 19, 0x00); // AREA4
    this.writeIndex(data, 0x7FEA, 2, 0x2901); // LOADED_PATTERN *
    //this.writeIndex(data, 0x7FFF, 1, 0x02);       // LAST_BYTE
    //this.writeIndex(data, 0x7FFC, 4, 0x30001030);

    var centreOffset = this.decimalToNibble3(Math.round(stitches / 2));
    this.writeIndex(data, 0x7FFC, 4, centreOffset);
  },

  writeToLogs: function writeToLogs() {
    var text = '';

    for (var i = 0; i < arguments.length; i += 1) {
      text += ' ' + arguments[i];
    }

    this.logs.push(text);
  },

  getLogs: function getLogs() {
    return this.logs.join('<br />');
  },

  getHeader: function getHeader(data, address) {
    var text = 'HEADER ';

    for (var i = 0; i < 7; i += 1) {
      text += data[address + i].toString(16) + ' ';
    }

    return text;
  },

  sampleHex: function sampleHex(data) {
    var sample = 'SAMPLE: ';

    for (var i = 0; i < data.length && i < 16; i += 1) {
      var val = data[i];
      sample += val.toString(16) + ' ';
    }

    return sample;
  }
};

exports.default = Brother;

/***/ })
/******/ ]);