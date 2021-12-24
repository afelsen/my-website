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
}

// pencil tool

function pencil(){

    document.getElementById("pencil_icon_img").src="./static/images/icons/pencil_1_color.png";

    canvas.onmousedown = function(e){
        curX = e.pageX - canvas.offsetLeft;
        curY = e.pageY - canvas.offsetTop;
        hold = true;

        prevX = curX;
        prevY = curY;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
    };

    canvas.onmousemove = function(e){
        if(hold){
            curX = e.pageX - canvas.offsetLeft;
            curY = e.pageY - canvas.offsetTop;
            draw();
        }
    };

    canvas.onmouseup = function(e){
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

    canvas.onmousedown = function(e){
        curX = e.pageX - canvas.offsetLeft;
        curY = e.pageY - canvas.offsetTop;
        hold = true;

        prevX = curX;
        prevY = curY;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
    };

    canvas.onmousemove = function(e){
        if(hold){
            curX = e.pageX - canvas.offsetLeft;
            curY = e.pageY - canvas.offsetTop;
            draw();
        }
    };

    canvas.onmouseup = function(e){
        hold = false;
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

function get_python_data(){
    $.get("/getpythondata", function(data) {
        console.log($.parseJSON(data))
        var pred = $.parseJSON(data)
        document.getElementById("prediction").innerHTML = "Prediction: " + pred["probabilities_string"];

        console.log(pred["probabilities"]);
        console.log(pred["order"]);


        var probs = pred["probabilities"]
        var order = pred["order"]

        var list_elements = document.querySelector("#probabilities").children;
        for (i = 0; i < list_elements.length; i++) {

            var name = list_elements[i].className         
            var o = order[name];
            var prob = probs[name];
            
            list_elements[i].setAttribute("data-pos", o + 1);
            list_elements[i].children[0].children[2].innerHTML = Math.round(prob * 100) / 100;
            console.log(i)
            console.log(list_elements[i]);
        }


    })
}

function save(){
    var data = JSON.stringify(canvas_data);
    var image = canvas.toDataURL();
    console.log("test");
    $.post("/", { save_cdata: data, save_image: image }, get_python_data);
}

function go(){
    $.post("go_to_prediction");

}
