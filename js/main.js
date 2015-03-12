$(function(){
  // create stage
  var stage = new createjs.Stage("mainCanvas");
  var images = []
  var c = $('#mainCanvas');
  var ct = c.get(0).getContext('2d');
  var container = $(c).parent();

  var intro_txt = new createjs.Text("In this interactive, you'll explore the stories behind 13 objects that police officers have mistaken for guns. The cases you're about to see vary in circumstance and outcome, but each ended with someone getting shot.", "30px Courier", "#FFFFFF")
      intro_txt.textAlign = "center";
      intro_txt.y = 150
      intro_txt.x = 660
      intro_txt.lineWidth = $(".canvasContainer").width()/1.5
      intro_txt.lineHeight = 50;

  var progress = new createjs.Shape();
  var progressBellow = new createjs.Shape();
  var txt = new createjs.Text();
  var preload = new createjs.LoadQueue();
  var manifest = [
    {src: 'https://youthradio.org/innovationlab/triggered/images/center.png', id: 'center', x: 380, y: 90},
    {src: 'https://youthradio.org/innovationlab/triggered/images/cell.png', id: 'cell', x: 1100, y: 250},
    {src: 'https://youthradio.org/innovationlab/triggered/images/taser.png', id: 'taser', x: 780, y: -10},
    {src: 'https://youthradio.org/innovationlab/triggered/images/brush.png', id: 'brush', x: 780, y: 360},
    {src: 'https://youthradio.org/innovationlab/triggered/images/pizza.png', id: 'pizza', x: 1100, y: 400},
    {src: 'https://youthradio.org/innovationlab/triggered/images/wallet.png', id: 'wallet', x: 1100, y: 10},
    {src: 'https://youthradio.org/innovationlab/triggered/images/wii.png', id: 'wii', x: 50, y: 340},
    {src: 'https://youthradio.org/innovationlab/triggered/images/pill.png', id: 'pill', x: 100, y: 150},
    {src: 'https://youthradio.org/innovationlab/triggered/images/pelletgun_a.png', id: 'pellet_gun_a', x: 180, y: 0},
    {src: 'https://youthradio.org/innovationlab/triggered/images/pelletgun_b.png', id: 'pellet_gun_b', x: 380, y: 430},
    {src: 'https://youthradio.org/innovationlab/triggered/images/waterpistol.png', id: 'water_pistol', x: 600, y: 10},
    {src: 'https://youthradio.org/innovationlab/triggered/images/toygun.png', id: 'toy_gun', x: 880, y: 230},
    {src: 'https://youthradio.org/innovationlab/triggered/images/keys.png', id: 'keys', x: 600, y: 450},
    {src: 'https://youthradio.org/innovationlab/triggered/images/mic.png', id: 'mic', x: 150, y: 120}
    ]



  window.addEventListener('resize', resize, false);
  createjs.Ticker.addEventListener("tick", stage);


// Intro text

  createjs.Tween.get(intro_txt)
  .to({alpha: 0}, 10000, createjs.Ease.sineIn)
   .wait(1000)
   .call(init)

  stage.addChild(intro_txt)

  // Get data from google spreadsheet
  function getData(){
    return $.getJSON("https://spreadsheets.google.com/feeds/list/1bVYh1nHcSqcySzoLLrkoo8HIRjzZ-yZkDP22_ndDT1A/od6/public/values?hl=en_US&alt=json", function(data) {
            return data
          });
    return data
  }

  function tick(){
    stage.update()
  }

  // canvas resize
  function resize() {
    // c.attr('width', $(container).width() ); //max width
    // c.attr('height', $(container).height() ); //max height

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

 // setting up the stage
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
      progress.graphics.beginStroke("#0B090B").drawRect(510,500,250,40);
      progressBellow.graphics.beginStroke("#0B090B").drawRect(510,500,250,40);
      txt.x = 570;
      txt.y = 500;
      txt.font = ("30px press_style_extra_lregular");
      txt.color = ("#0B090B");
      resize();
   }


  // functions from init
  function handleError(event){
    console.log(event)
  }

  function handleProgress(event) {
      progress.graphics.clear();
      // Draw the progress bar
      progress.graphics.beginFill("#E6E43A").drawRect(510,500,250*(event.loaded / event.total),40);
      txt.text = ("Loading " + Math.round(100*(event.loaded / event.total)) + "%");
      stage.addChild(progress,progressBellow,txt);
      stage.update();
  }


  function handleFileLoad(event) {
      images.push(event.item);
  }

  function handleComplete(event){
    // remove progress bar + text + skip button
    stage.removeChild(progress, progressBellow, txt);

    // fades the background
    $("canvas").animate({backgroundColor: 'rgba(0, 0, 0, 0)'}, 2000)
    $(".container-fluid").addClass("bg-image")

    // Gets data from the backend and resolves promise
    getData().then(function(results){

      // Loop through the images to create the bitmaps
        for(var i = 0; i < images.length; i++) {

          // using closure to add event listener to ALL bitmaps
          (function(){

            // adds center image to center without a filter
            if (images[i].id == "center"){
              console.log(images[i].id)
              var center_img = images[i]
              var center = preload.getResult(center_img.id)
              var center_bitmap = new createjs.Bitmap(center)
              center_bitmap.cache(0, 0, center.width, center.height);
              center_bitmap.x = center_img.x
              center_bitmap.y = center_img.y
              center_bitmap.image.id = center_img.id
              stage.addChild(center_bitmap);
            }else{
              console.log("else")
              // all other objects get a filter and event listeners
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
              bitmap.addEventListener("click", function(evt){
                 $('#main_content').empty()
                for(var a = 0; a < results.feed.entry.length; a++ ){
                  if (bitmap.image.id ===  results.feed.entry[a].gsx$id.$t){
                    var data = results.feed.entry[a]
                    var url = "js/templates/story.ejs"
                    var html = new EJS({url: url}).render(data);
                    $('#modalInfo').modal()
                    $('#main_content').append(html)
                  }
                }
              })
            }
          }())
        }
      })
    stage.update();
  }
  resize();
})


