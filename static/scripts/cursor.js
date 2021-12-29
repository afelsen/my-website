
var is_pencil = false;
var mouseCursor = null;

function cursor(e){
    if (!is_pencil){
      mouseCursor.style.top = e.pageY + "px";
      mouseCursor.style.left = e.pageX + "px";
    }
    else {
      pencil_icon.style.top = e.pageY + "px";
      pencil_icon.style.left = e.pageX + "px";
    }
}

if (isMobile.any()){
  mouseCursor = document.querySelector(".cursor");
  mouseCursor.style.visibility = "hidden";
}
else {
  window.addEventListener('load', trackcursor, false);
}



function trackcursor () {

  let nodes = document.querySelectorAll(".node, .nav-item");
  let links = document.querySelectorAll("button");
  mouseCursor = document.querySelector(".cursor");

  var pencil_icon = document.querySelector("#pencil_icon");
  var canvas = document.querySelector("#paint")
  window.addEventListener("mousemove", cursor);


  nodes.forEach(link => {

      link.addEventListener('mouseleave', () => {
        mouseCursor.classList.remove('pulsating-circle');
        mouseCursor.classList.remove('link-grow-invert');
      });
      link.addEventListener('mouseover', () => {
          mouseCursor.classList.add('pulsating-circle');
          mouseCursor.classList.add('link-grow-invert');
      });

  })


  links.forEach(link => {

    link.addEventListener('mouseleave', () => {
      mouseCursor.classList.remove('pulsating-circle');
      mouseCursor.classList.remove('link-grow');
    });
    link.addEventListener('mouseover', () => {
      mouseCursor.classList.add('pulsating-circle');
      mouseCursor.classList.add('link-grow');
    });

  })


  canvas.addEventListener('mouseleave', () => {
    is_pencil = false;
    pencil_icon.style.visibility = "hidden";
    mouseCursor.style.visibility = "visible";
  });
  canvas.addEventListener('mouseover', () => {
    is_pencil = true;
    pencil_icon.style.visibility = "visible";
    mouseCursor.style.visibility = "hidden";
  });

}
