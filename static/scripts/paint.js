var canvas = document.getElementById("paint");
var ctx = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;
ctx.fillStyle = "black";
ctx.fillRect(0, 0, width, height);

var curX, curY, prevX, prevY;
var hold = false;
ctx.lineWidth = 3;
var fill_value = true;
var stroke_value = false;
var canvas_data = {"pencil": [], "eraser": []}

var prediction_dict = {}

doodle_arrow = []

$( document ).ready(function() {
  // onePageScroll(".main", {
  //       sectionContainer: "section",
  //       easing: "ease",
  //       animationTime: 1000,
  //       pagination: true,
  //       updateURL: true,
  //       keyboard: true,
  //       beforeMove: null,
  //       afterMove: null,
  //       loop: false,
  //       responsiveFallback: 600
  //       });
    pencil();
});

// Prevent scrolling when touching the canvas
document.body.addEventListener("touchstart", function (e) {
  if (e.target == canvas) {
    e.preventDefault();
  }
}, { passive: false });
document.body.addEventListener("touchend", function (e) {
  if (e.target == canvas) {
    e.preventDefault();
  }
}, { passive: false });
document.body.addEventListener("touchmove", function (e) {
  if (e.target == canvas) {
    e.preventDefault();
  }
}, { passive: false });


function color(color_value){
    ctx.strokeStyle = color_value;
    ctx.fillStyle = color_value;
}

function add_pixel(){
    ctx.lineWidth += 1;
}

function reduce_pixel(){
    if (ctx.lineWidth == 1){
        ctx.lineWidth = 1;
    }
    else{
        ctx.lineWidth -= 1;
    }
}

function fill(){
    fill_value = true;
    stroke_value = false;
}

function outline(){
    fill_value = false;
    stroke_value = true;
}

function reset(){
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    canvas_data = { "pencil": [], "eraser": [] }

    var list_elements = document.querySelector("#probabilities").children;
    for (i = 0; i < list_elements.length; i++) {
      if (i == 0){
        list_elements[i].setAttribute("data-pos", 0);
      }
      else {
        list_elements[i].setAttribute("data-pos", i + 1);
      }

      list_elements[i].children[0].children[2].innerHTML = "";
      var img = list_elements[i].children[0].children[0];
      img.style.visibility = 'hidden';
    }

}

// pencil tool
function pencil(){
    document.getElementById("pencil_icon_img").src="./static/images/icons/pencil_1_color.png";

    canvas.ontouchstart = function(e){
      var touch = e.touches[0];
      mouse_down(touch);
    }

    canvas.ontouchend = function(e){
      var touch = e.touches[0];
      mouse_up(touch);
    }

    canvas.ontouchmove = function(e){
      var touch = e.touches[0];
      mouse_move(touch);
    }

    canvas.onmousedown = mouse_down;

    function mouse_down(e){

        var topPos = canvas.getBoundingClientRect().top + window.scrollY;
        var leftPos = canvas.getBoundingClientRect().left + window.scrollX;
        curX = e.pageX - leftPos;
        curY = e.pageY - topPos;
        hold = true;

        prevX = curX;
        prevY = curY;
        ctx.beginPath();
        // ctx.moveTo(prevX, prevY);
    };

    canvas.onmousemove = mouse_move;

    function mouse_move(e){
        if(hold){

            var topPos = canvas.getBoundingClientRect().top + window.scrollY;
            var leftPos = canvas.getBoundingClientRect().left + window.scrollX;
            curX = e.pageX - leftPos;
            curY = e.pageY - topPos;
            draw();
        }
    };

    canvas.onmouseup = mouse_up;

    function mouse_up(e){
        hold = false;
        save()
    };

    canvas.onmouseout = function(e){
        hold = false;
    };

    function draw(){
        ctx.lineTo(curX, curY);
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();
        ctx.lineWidth = 5;
        canvas_data.pencil.push({ "startx": prevX, "starty": prevY, "endx": curX, "endy": curY, "thick": ctx.lineWidth, "color": "#ffffff" });
    }
}

// eraser tool

function eraser(){

    document.getElementById("pencil_icon_img").src="./static/images/icons/eraser_color.png";

    canvas.ontouchstart = function(e){
      var touch = e.touches[0];
      mouse_down(touch);
    }

    canvas.ontouchend = function(e){
      var touch = e.touches[0];
      mouse_up(touch);
    }

    canvas.ontouchmove = function(e){
      var touch = e.touches[0];
      mouse_move(touch);
    }

    canvas.onmousedown = mouse_down;

    function mouse_down(e){
        var topPos = canvas.getBoundingClientRect().top + window.scrollY;
        var leftPos = canvas.getBoundingClientRect().left + window.scrollX;

        curX = e.pageX - leftPos;
        curY = e.pageY - topPos;
        hold = true;

        prevX = curX;
        prevY = curY;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
    };

    canvas.onmousemove = mouse_move;

    function mouse_move(e){
        if(hold){
            var topPos = canvas.getBoundingClientRect().top + window.scrollY;
            var leftPos = canvas.getBoundingClientRect().left + window.scrollX;
            curX = e.pageX - leftPos;
            curY = e.pageY - topPos;
            draw();
        }
    };

    canvas.onmouseup = mouse_up;

    function mouse_up(e){
        hold = false;
        save();
    };

    canvas.onmouseout = function(e){
        hold = false;
    };

    function draw(){
        ctx.lineTo(curX, curY);
        ctx.strokeStyle = "#000000";
        ctx.stroke();
        ctx.lineWidth = 30;
        canvas_data.pencil.push({ "startx": prevX, "starty": prevY, "endx": curX, "endy": curY, "thick": ctx.lineWidth, "color": ctx.strokeStyle });
    }
}

function set_pred_data(data){

      var pred = $.parseJSON(data)
      prediction_dict = pred;

      var probs = pred["probabilities"]
      var order = pred["order"]

      var list_elements = document.querySelector("#probabilities").children;
      for (i = 0; i < list_elements.length; i++) {

          var name = list_elements[i].className
          var o = order[name];
          var prob = probs[name];

          var img = list_elements[i].children[0].children[0]

          if (o == 0){
            document.getElementById("go").style.animation = "glow 2s infinite";
            document.getElementById("gotext").innerHTML = pred["destinations"][i] + " &#8594"
            img.style.visibility = 'visible';

            list_elements[i].setAttribute( "onClick", "go()" );
            list_elements[i].style.cursor = "pointer";
          }
          else {
            list_elements[i].removeAttribute("onClick");
            list_elements[i].style.cursor = "none";
            img.style.visibility = 'hidden';
          }


          list_elements[i].setAttribute("data-pos", o + 1);
          list_elements[i].children[0].children[2].innerHTML = Math.round(prob * 100) + "%";
      }

}

function save(){
    var data = JSON.stringify(canvas_data);
    var image = canvas.toDataURL();

    $.post('/', { save_cdata: data, save_image: image},
        function(data){
             set_pred_data(data);
    }).fail(function(err){
          console.log(err);
    });
}

function go(){
    var pred = prediction_dict["prediction"];
    if (pred == "Book"){
        window.location.href = "education";
    }
    else if (pred == "Face"){
        window.location.href = "about";
    }
    else if (pred == "Computer"){
        window.location.href = "projects";
    }

    else if (pred == "Brain"){
        window.location.href = "research_internships";
    }

    else if (pred == "Envelope"){
        window.location.href = "mailto:afelsen85@gmail.com";
    }
}
