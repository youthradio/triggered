$(function(){
  var stage = new createjs.Stage("mainCanvas");
  var images = []

  var intro_txt = new createjs.Text("According to a ProPublica analysis, young black males are 21 times more likely than white males to be shot dead by a police officer. ", "50px Courier", "#FFFFFF")
      intro_txt.textAlign = "center";
      intro_txt.y = 100
      intro_txt.x = $(".canvasContainer").width()/2
      intro_txt.lineWidth = $(".canvasContainer").width()/1
      intro_txt.lineHeight = 50;

  var skip_button = new Image();
      skip_button.src = "images/skipintro.png"
      skip_button.onload = addSkipButton;


  var progress = new createjs.Shape();
  var progressBellow = new createjs.Shape();
  var txt = new createjs.Text();
  var preload = new createjs.LoadQueue();
  var manifest = [
    {src: 'images/cell.png', id: 'cell', x: 80, y: 280},
    {src: 'images/taser.png', id: 'taser', x: 900, y: 10},
    {src: 'images/brush.png', id: 'brush', x: 240, y: 350},
    {src: 'images/paintball.png', id: 'paintball', x: 90, y: -20},
    {src: 'images/pizza.png', id: 'pizza', x: 700, y: 400},
    {src: 'images/wallet.png', id: 'wallet', x: 940, y: 200},
    {src: 'images/wii.png', id: 'wii', x: 900, y: 330},
    {src: 'images/pill.png', id: 'pill', x: 1130, y: 300}
    ]

  window.addEventListener('resize', resize, false);
  createjs.Ticker.addEventListener("tick", stage);

// Intro text
  createjs.Tween.get(intro_txt)
  .to({alpha: 0}, 10000, createjs.Ease.sineIn)
  .to({text: "However, the available data is either incomplete or problematic. For instance, fatal shooting reports are voluntary. There is even less data available when looking at shooting of unarmed individuals, whether it is by police or other civilians."})
  .to({alpha: 1}, 1000, createjs.Ease.sineIn)
  .to({alpha: 0}, 11000, createjs.Ease.sineIn)
  .to({text: "Here are some of the stories behind those shootings. "})
  .to({alpha: 1}, 1000, createjs.Ease.sineIn)
  .to({alpha: 0}, 5000, createjs.Ease.sineIn)
  .wait(1000)
  .call(init)
  stage.addChild(intro_txt)



  function addSkipButton(){
    skip_button_bitmap = new createjs.Bitmap(skip_button);
    // skip_button_bitmap.cache(0, 0, skip_button.width, skip_button.height);
    skip_button_bitmap.y = 0
    skip_button_bitmap.x = 0
    createjs.Tween.get(skip_button_bitmap, {loop:true}).to({alpha:0}, 1500).to({alpha:1}, 500, createjs.Ease.quadIn);

    skip_button_bitmap.addEventListener("mouseover", function(evt){
      evt.target.cursor = 'pointer'
    })

    skip_button_bitmap.addEventListener("click", function(){
      skip_intro()
    })
    stage.addChild(skip_button_bitmap);
    stage.update();
  }

  function skip_intro(){
    createjs.Ticker.setPaused(true);
    stage.removeChild(intro_txt, skip_button_bitmap);
    init()
  }

  function tick(){
    stage.update()
  }

  // canvas resize
  function resize() {
    // browser viewport size
    var w = window.innerWidth;
    var h = window.innerHeight;

    // stage dimensions
    var ow = 1320; // your stage width
    var oh = 640; // your stage height


    // keep aspect ratio
    var scale = Math.min(w / ow, h / oh);
    stage.scaleX = scale;
    stage.scaleY = scale;

   // adjust canvas size
   stage.canvas.width = ow * scale;
   stage.canvas.height = oh * scale

  // update the stage
  stage.update()
  }

 // setting up the stage for easelJS
  function init(){
      // enable mouseOver
      stage.enableMouseOver();
      // Touch enable
      createjs.Touch.enable(stage);
      // preload events for manifest
      preload.addEventListener("progress", handleProgress);
      preload.on('fileload', handleFileLoad);
      preload.on('complete', handleComplete);
      preload.on('error', handleError);
      preload.loadManifest(manifest);

      // Progress bar
      progress.graphics.beginStroke("#0B090B").drawRect(500,500,250,40);
      progressBellow.graphics.beginStroke("#0B090B").drawRect(500,500,250,40);
      txt.x = 530;
      txt.y = 500;
      txt.font = ("30px press_style_extra_lregular");
      txt.color = ("#0B090B");
   }


  // functions
  function handleError(event){
    console.log(event)
  }


  function handleProgress(event) {
      progress.graphics.clear();
      // Draw the progress bar
      progress.graphics.beginFill("#E6E43A").drawRect(500,500,250*(event.loaded / event.total),40);
      txt.text = ("Loading " + Math.round(100*(event.loaded / event.total)) + "%");
      stage.addChild(progress,progressBellow,txt);
      stage.update();
  }


  function handleFileLoad(event) {
      images.push(event.item);
  }

  function handleComplete(event) {
    stage.removeChild(progress, progressBellow, txt, skip_button_bitmap);
    $("canvas").animate({backgroundColor: 'rgba(0, 0, 0, 0)'}, 1500)

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
        bitmap.image.id = item.id
        stage.addChild(bitmap);

        // event listeners
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
          console.log(bitmap.image.id)
          $('#modalInfo').modal()
          })
      }())
    }
    stage.update();
  }
  resize();
})