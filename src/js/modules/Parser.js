
const Parser = function() {
  this.needsUpdate = true;
  this.loaded = false;
  this.init();
};

Parser.prototype = {
  init: function() {
    // ui values
    this.threshold = 50;
    this.stretch = 1;
    this.threadcount = 200;
    this.size = 10;

    // results
    this.data = [];
    this.result = {};
  },

  imageToPixelArray: function(image) {
    this.data = [];
    this.image = image;

    // offscreen canvas
    const cvs = document.createElement('canvas');
    const ctx = cvs.getContext('2d');

    cvs.width = image.width;
    cvs.height = image.height;
    ctx.drawImage(image, 0, 0);

    const raw = ctx.getImageData(0, 0, image.width, image.height).data;

    // parse canvas data
    for (let i=0; i<raw.length; i+=4) {
      this.data.push({
        r: raw[i],
        g: raw[i+1],
        b: raw[i+2]
      });
    }

    // resize
    this.fitToImage();
    this.loaded = true;
  },

  fitToImage: function() {
    this.size = this.image.width / this.threadcount;
    this.needsUpdate = true;
  },

  setSize: function(size) {
    this.size = size;
    this.threadcount = Math.min(200, Math.floor(this.image.width / this.size));
    this.needsUpdate = true;
  },

  setStretch: function(stretch) {
    this.stretch = stretch;
    this.result.stretch = this.stretch;
  },

  setThreshold: function(threshold) {
    this.threshold = threshold;
    this.needsUpdate = true;
  },

  setThreadcount: function(count) {
    this.threadcount = count;
    this.needsUpdate = true;
  },

  getBrightness: function(pixel) {
    return (pixel.r + pixel.g + pixel.b) / 3;
  },

  process: function() {
    const rowCount = Math.floor(this.image.height / this.size);
    const w = this.image.width;

    this.result = {
      rows: rowCount,
      columns: this.threadcount,
      stretch: this.stretch,
      data: []
    };

    console.log(this.size);

    for (let row=0; row<rowCount; row+=1) {
      for (let col=0; col<this.threadcount; col+=1) {
        let brightness = 0;
        let count = 0;
        const baseIndex = Math.floor(col * this.size + row * this.image.width * this.size);

        for (let x=0; x<this.size; x+=1) {
          for (let y=0; y<this.size; y+=1) {
            const index = Math.floor(baseIndex + x + y * this.image.width);
            count += 1;
            brightness += this.getBrightness(this.data[index]);
          }
        }

        brightness = ((brightness / count) / 255.) * 100;
        const res = (brightness >= this.threshold) ? 1 : 0;

        this.result.data.push(res);
      }
    }

    this.needsUpdate = false;
  },

  save: function(filename, data) {
    // save data to file
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
