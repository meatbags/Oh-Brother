
const Parser = function() {
  this.data = [];
  this.init();
};

Parser.prototype = {
  init: function() {
    this.threshold = 50;
    this.stretch = 1;
    this.threadcount = 60;
    this.size = 10;
  },

  handle: function(data) {
    // pixel data
    this.data = data;
  },

  fitImage: function(image) {
    this.size = image.width / this.threadcount;
  },

  process: function() {

  },

  save: function(filename, data) {
    const blob = new Blob([data], {type:'application/octet-stream'});
    saveAs(blob, filename);
  }

  /*
  var data = new Uint8Array(100);
  data[0] = 0xFF;
  var blob = new Blob([data], {type: "application/octet-stream"});
  saveAs(blob, 'thing.dat');
  */
};

export default Parser;
