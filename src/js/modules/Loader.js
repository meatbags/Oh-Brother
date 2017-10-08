const Loader = function() {
  this.image = new Image;
  this.onload = null;
};

Loader.prototype = {
  load: function(raw) {
    this.image.onload = this.onload;
    this.image.src = raw;
  },

  getImage: function() {
    return this.image;
  }
};

export default Loader;
