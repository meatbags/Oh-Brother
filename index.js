const App = {
  init: function() {
    // set up
    App.loader = new Brother.Loader();
    App.canvas = new Brother.Canvas();
    App.parser = new Brother.Parser();
    App.loader.onload = function() {
      const img = App.loader.getImage();
      const data = App.canvas.imageToPixelArray(img);
      console.log(data[0]);
    };

    // image loader element
    App.inputElement = document.getElementById('image-loader');
    App.inputElement.onchange = function(e) {
      let reader = new FileReader();

      reader.addEventListener('load', function(event){
        const data = event.target.result;
        App.loader.load(data);
      });

      reader.readAsDataURL(e.target.files[0]);
    };
  }
}

window.onload = App.init;
