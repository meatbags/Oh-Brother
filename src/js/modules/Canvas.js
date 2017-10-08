
const Canvas = function() {
  this.init();
};

Canvas.prototype = {
  init: function() {
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

  drawImage: function(image) {
    const ctx = this.ctx.helper;
    const cvs = this.cvs.helper;

    cvs.width = image.width;
    cvs.height = image.height;
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.drawImage(image, 0, 0);
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

  drawProcessed: function(data) {
    //console.log(data)
    const ctx = this.ctx.preview;
    const cvs = this.cvs.preview;
    const d = data.data;

    cvs.width = data.columns * this.scale;
    cvs.height = data.rows * this.scale * data.stretch;
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.fillStyle = '#000';

    for (let i=0; i<d.length; i+=1) {
      if (d[i] == 0) {
        const x = (i % data.columns) * this.scale;
        const y = Math.floor(i / data.columns) * this.scale * data.stretch;
        ctx.fillRect(x, y, this.scale, this.scale * data.stretch);
      }
    }
  },

  getHelperCanvas: function() {
    return this.cvs.helper;
  },

  getPreviewCanvas: function() {
    return this.cvs.preview;
  },
};

export default Canvas;
