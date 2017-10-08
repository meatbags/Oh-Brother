const App = {
  init: function() {
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
        save: document.getElementById('button-save'),
        auto: document.getElementById('button-auto')
      },
      view: {
        helper: document.getElementById('ui-helper-canvas'),
        preview: document.getElementById('ui-preview-canvas')
      }
    };

    // set up
    App.loader = new Brother.Loader();
    App.canvas = new Brother.Canvas();
    App.parser = new Brother.Parser();
    App.loader.onload = function() {
      const imgRaw = App.loader.getImageRaw();
      const data = App.canvas.imageToPixelArray(imgRaw);
      App.parser.handle(data);
      App.parser.fitImage(App.canvas.image);
      App.ui.input.size.value = App.parser.size;
      App.update();
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

    App.ui.input.size.onchange = function() {
      App.parser.size = parseFloat(this.value);
      App.update();
    };
    App.ui.input.threshold.onchange = function() {
      App.parser.threshold = parseFloat(this.value);
      App.update();
    };
    App.ui.input.stretch.onchange = function() {
      App.parser.stretch = parseFloat(this.value);
      App.update();
    };
    App.ui.input.threadcount.onchange = function() {
      const val = Math.floor(parseFloat(this.value));
      const min = parseFloat(this.min);
      const max = parseFloat(this.max);

      App.parser.threadcount = Math.max(min, Math.min(max, val));
      App.ui.input.threadcount.value = App.parser.threadcount;
      if (App.canvas.loaded) {
        App.parser.fitImage(App.canvas.image);
        App.ui.input.size.value = Math.floor(10 * App.parser.size) / 10.;
        App.update();
      }
    };
    App.ui.button.save.addEventListener('click', function(){
      console.log('Save');
    });
    App.ui.button.auto.addEventListener('click', function(){
      if (App.canvas.loaded) {
        App.parser.fitImage(App.canvas.image);
        App.ui.input.size.value = Math.floor(10 * App.parser.size) / 10.;
        App.update();
      }
    });

    // views
    App.ui.view.helper.appendChild(App.canvas.getHelperCanvas());
    App.ui.view.preview.appendChild(App.canvas.getPreviewCanvas());
  },

  update: function() {
    App.canvas.drawImage();
    App.canvas.drawGrid(App.parser.size);
  }
}

window.onload = App.init;
