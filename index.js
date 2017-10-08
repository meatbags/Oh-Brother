const App = {
  init: function() {
    // set up
    App.loader = new Brother.Loader();
    App.canvas = new Brother.Canvas();
    App.parser = new Brother.Parser();
    App.loader.onload = function() {
      const img = App.loader.getImage();
      const data = App.canvas.imageToPixelArray(img);
      App.parser.data(data);
    };

    // UI
    App.ui = {
      input: {
        image: document.getElementById('input-image'),
        filename: document.getElementById('input-filename'),
        size: document.getElementById('input-size'),
        threshold: document.getElementById('input-threshold'),
        stretch: document.getElementById('input-stretch'),
        threadcount: document.getElementById('input-threadcount')
      },
      button: {
        save: document.getElementById('button-save')
      }
    };

    // hook up
    App.ui.input.image.onchange = function(e) {
      let reader = new FileReader();
      reader.addEventListener('load', function(event){
        const data = event.target.result;
        App.loader.load(data);
      });
      reader.readAsDataURL(e.target.files[0]);
      App.ui.input.filename.value = e.target.files[0].name + '.dat';
    };
    App.ui.input.filename.onchange = function() {
      // do stuff
    };
    App.ui.input.size.onchange = function() {
      App.parser.size = this.value;
    };
    App.ui.input.threshold.onchange = function() {
      App.parser.threshold = this.value;
    };
    App.ui.input.stretch.onchange = function() {
      App.parser.stretch = this.value;
    };
    App.ui.input.threadcount.onchange = function() {
      App.parser.threadcount = this.value;
    };
    App.ui.button.save.addEventListener('click', function(){
      console.log('Save');
    });
  }
}

window.onload = App.init;
