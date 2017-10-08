
const Canvas = function() {
  this.image = new Image();
  this.cvs = document.createElement('canvas');
  this.ctx = this.cvs.getContext('2d');
};

Canvas.prototype = {
  imageToPixelArray: function(image) {
    const w = image.width;
    const h = image.height;

    this.cvs.width = w;
    this.cvs.height = h;
    this.ctx.drawImage(image, 0, 0);

    const data = this.ctx.getImageData(0, 0, w, h).data;
    const pixels = [];
    for (let i=0; i<data.length; i+=4) {
      pixels.push({
        r: data[i],
        g: data[i+1],
        b: data[i+2]
      });
    }

    return pixels;
  }
};

export default Canvas;
