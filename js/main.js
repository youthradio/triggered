$(function(){
  window.addEventListener('resize', resize, false);
  init();

  // canvas resize
  function resize(stage) {
    stage.canvas.width = $(".canvasContainer").width();
    stage.canvas.height = $(".canvasContainer").height();
      }

   // setting up the stage for easelJS
    function init(){
      createjs.Touch.enable(stage);

      var images = []
      var stage = new createjs.Stage("mainCanvas");
          stage.enableMouseOver();
      var progress = new createjs.Shape();
      var progressBellow = new createjs.Shape();
      var txt = new createjs.Text();
      var preload = new createjs.LoadQueue();
      var manifest = [
        {src: 'images/cell.png', id: 'cell', x: 80, y: 280},
        {src: 'images/taser.png', id: 'taser', x: 900, y: 10},
        {src: 'images/underwear.png', id: 'underwear', x: 240, y: 350},
        {src: 'images/paintball.png', id: 'paintball', x: 90, y: -20},
        {src: 'images/pizza.png', id: 'pizza', x: 700, y: 400},
        {src: 'images/wallet.png', id: 'wallet', x: 940, y: 200},
        {src: 'images/wii.png', id: 'wii', x: 900, y: 330},
        ]

      preload.addEventListener("progress", handleProgress);
      preload.on('fileload', handleFileLoad);
      preload.on('complete', handleComplete);
      preload.on('error', handleError);
      preload.loadManifest(manifest);

      progress.graphics.beginStroke("#0B090B").drawRect(500,350,250,40);
      progressBellow.graphics.beginStroke("#0B090B").drawRect(500,350,250,40);
      txt.x = 520;
      txt.y = 350;
      txt.font = ("30px press_style_extra_lregular");
      txt.color = ("#0B090B");


      function handleError(event){
        console.log(event)
      }


      function handleProgress(event) {
          progress.graphics.clear();
          // Draw the progress bar
          progress.graphics.beginFill("#E6E43A").drawRect(500,350,250*(event.loaded / event.total),40);
          txt.text = ("Loading " + Math.round(100*(event.loaded / event.total)) + "%");
          stage.addChild(progress,progressBellow,txt);
          stage.update();
      }


      function handleFileLoad(event) {
          images.push(event.item);
      }

      function handleComplete(event) {
        stage.removeChild(progress, progressBellow, txt);
        for(var i = 0; i < images.length; i++) {
          // using closure to add event listener to ALL bitmaps
          (function(){
            var item = images[i];
            var img = preload.getResult(item.id);

            var bitmap = new createjs.Bitmap(img);

            // Filters
            var filter = new createjs.ColorFilter(0, 0, 0, .8, 57, 100, 103);
            var blurFilter = new createjs.BlurFilter(9, 9, 9);

            bitmap.filters = [filter, blurFilter]
            bitmap.cache(0, 0, img.width, img.height);
            bitmap.x = item.x
            bitmap.y = item.y
            stage.addChild(bitmap);

             bitmap.addEventListener("mouseover", function(evt){
                bitmap.filters = []
                bitmap.cache(0, 0, img.width, img.height);
                stage.update();
                evt.target.cursor = 'pointer'
              })
            bitmap.addEventListener("mouseout", function(){
                bitmap.filters = [filter, blurFilter]
                bitmap.cache(0, 0, img.width, img.height);
                stage.update();
              })
            bitmap.addEventListener("click", function(){
               $('#modalInfo').modal()
              })
          }())
        }
        stage.update();
      }
      resize(stage);
   }
})