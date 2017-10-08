
const Canvas = function() {
  this.image = new Image();
  this.loaded = false;
  this.init();
};

Canvas.prototype = {
  init: function() {
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

  drawImage: function() {
    const ctx = this.ctx.helper;
    const cvs = this.cvs.helper;

    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.drawImage(this.image, 0, 0);
  },

  drawGrid: function(size) {
    const cvs = this.cvs.helper;
    const ctx = this.ctx.helper;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';

    for (let x=0; x<cvs.width; x+=size) {
      ctx.fillRect(x, 0, 1, cvs.height);
    }

    for (let y=0; y<cvs.height; y+=size) {
      ctx.fillRect(0, y, cvs.width, 1);
    }
  },

  getHelperCanvas: function() {
    return this.cvs.helper;
  },

  getPreviewCanvas: function() {
    return this.cvs.preview;
  },

  imageToPixelArray: function(image) {
    const w = image.width;
    const h = image.height;

    this.cvs.offscreen.width = w;
    this.cvs.offscreen.height = h;
    this.ctx.offscreen.drawImage(image, 0, 0);

    const data = this.ctx.offscreen.getImageData(0, 0, w, h).data;
    const pixels = [];
    for (let i=0; i<data.length; i+=4) {
      pixels.push({
        r: data[i],
        g: data[i+1],
        b: data[i+2]
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

export default Canvas;
