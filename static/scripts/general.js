
let nodes = document.querySelectorAll(".node");
let links = document.querySelectorAll("a");
var mouseCursor = document.querySelector(".cursor");

var pencil_icon = document.querySelector("#pencil_icon");
var canvas = document.querySelector("#paint")
window.addEventListener("mousemove", cursor);

var is_pencil = false;

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



gsap.registerPlugin(ScrollTrigger);
// REVEAL //
gsap.utils.toArray(".revealUp").forEach(function (elem) {
  ScrollTrigger.create({
    trigger: elem,
    start: "top 80%",
    end: "bottom 20%",
    markers: false,
    onEnter: function () {
      gsap.fromTo(
        elem,
        { y: 200, autoAlpha: 0 },
        {
          duration: 1.25,
          y: 0,
          autoAlpha: 1,
          ease: "back",
          overwrite: "auto"
        }
      );
    },
    onLeave: function () {
      gsap.fromTo(elem, { autoAlpha: 1 }, { autoAlpha: 0, overwrite: "auto" });
    },
    onEnterBack: function () {
      gsap.fromTo(
        elem,
        { y: -200, autoAlpha: 0 },
        {
          duration: 1.25,
          y: 0,
          autoAlpha: 1,
          ease: "back",
          overwrite: "auto"
        }
      );
    },
    onLeaveBack: function () {
      gsap.fromTo(elem, { autoAlpha: 1 }, { autoAlpha: 0, overwrite: "auto" });
    }
  });
});