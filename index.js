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
        save: document.getElementById('button-save')
        //, auto: document.getElementById('button-auto')
      },
      view: {
        helper: document.getElementById('ui-helper-canvas'),
        preview: document.getElementById('ui-preview-canvas')
      },
      output: {
        stitches: document.getElementById('input-stitches'),
        rows: document.getElementById('input-rows'),
      }
    };

    // set up
    App.loader = new Brother.Loader();
    App.canvas = new Brother.Canvas();
    App.parser = new Brother.Parser();
    App.loader.onload = function() {
      App.parser.imageToPixelArray(App.loader.getImageRaw());
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
      App.ui.input.filename.value = e.target.files[0].name.split('.')[0];
    };

    App.ui.input.size.onchange = function() {
      if (App.parser.loaded) {
        App.parser.setSize(parseFloat(this.value));
        App.update();
        App.ui.input.threadcount.value = App.parser.threadcount;
      }
    };
    App.ui.input.threshold.onchange = function() {
      if (App.parser.loaded) {
        App.parser.setThreshold(parseFloat(this.value));
        App.update();
      }
    };
    App.ui.input.stretch.onchange = function() {
      App.parser.setStretch(parseFloat(this.value));
      App.update();
    };
    App.ui.input.threadcount.onchange = function() {
      const val = Math.floor(parseFloat(this.value));
      const min = parseFloat(this.min);
      const max = parseFloat(this.max);

      App.parser.setThreadcount(Math.max(min, Math.min(max, val)));
      App.ui.input.threadcount.value = App.parser.threadcount;
      if (App.parser.loaded) {
        App.parser.fitToImage();
        App.ui.input.size.value = Math.floor(10 * App.parser.size) / 10.;
        App.update();
      }
    };
    App.ui.button.save.addEventListener('click', function(){
      App.parser.save(App.ui.input.filename.value + '.dat');
    });
    /*
    App.ui.button.auto.addEventListener('click', function(){
      if (App.parser.loaded) {
        App.parser.fitToImage();
        App.ui.input.size.value = Math.floor(10 * App.parser.size) / 10.;
        App.update();
      }
    });
    */

    // views
    App.ui.view.helper.appendChild(App.canvas.getHelperCanvas());
    App.ui.view.preview.appendChild(App.canvas.getPreviewCanvas());
  },

  update: function() {
    if (App.parser.loaded) {
      if (App.parser.needsUpdate) {
        App.parser.process();
      }
      App.ui.output.stitches.value = App.parser.result.columns;
      App.ui.output.rows.value = App.parser.result.rows;
      App.canvas.drawImage(App.parser.image);
      App.canvas.drawGrid(App.parser.size);
      App.canvas.drawProcessed(App.parser.result);
    }
  }
}

window.onload = App.init;
