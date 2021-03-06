var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};




function debounce(func, time){
    var time = time || 100; // 100 by default if no param
    var timer;
    return function(event){
        if(timer) clearTimeout(timer);
        timer = setTimeout(func, time, event);
    };
}



window.addEventListener('load', loaded, false);


function loaded () {
//   gsap.registerPlugin(ScrollTrigger);
// // REVEAL //
gsap.utils.toArray(".revealUp").forEach(function (elem) {
//   ScrollTrigger.create({
    // trigger: elem,
    // start: "top 80%",
    // end: "bottom 20%",
    // markers: false,
    // onEnter: function () {
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
    // },
    // onLeave: function () {
    //   gsap.fromTo(elem, { autoAlpha: 1 }, { autoAlpha: 0, overwrite: "auto" });
    // },
    // onEnterBack: function () {
    //   gsap.fromTo(
    //     elem,
    //     { y: -200, autoAlpha: 0 },
    //     {
    //       duration: 1.25,
    //       y: 0,
    //       autoAlpha: 1,
    //       ease: "back",
    //       overwrite: "auto"
    //     }
    //   );
    // },
    // onLeaveBack: function () {
    //   gsap.fromTo(elem, { autoAlpha: 1 }, { autoAlpha: 0, overwrite: "auto" });
    // }
//   });
});

}
