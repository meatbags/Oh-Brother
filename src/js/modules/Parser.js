
const Parser = function() {
  this.data = [];
  this.init();
};

Parser.prototype = {
  init: function() {
    this.threshold = 50;
    this.stretch = 1.5;
    this.threadcount = 60;
    this.size = 10;
  },

  process: function() {

  },

  data: function(data) {
    // pixel data
    this.data = data;
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
