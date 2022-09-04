// current = 0
// scroll_locations = [$("#topofpage").offset().top, $("#nodes-slide").offset().top, $("#paint-slide").offset().top]

// scrolling = false;



// $(window).bind('wheel mousewheel DOMMouseScroll', function(event){

//     if (scrolling){
//         return;
//     }
    
//     if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
//         if (current > 0){
//             current--;
//             scrolling = true;
//             $('html, body').animate({
//                 scrollTop: scroll_locations[current]
//             }, 
//             {duration: 600, complete: function () {scrolling = false}}
//             );
//         }
//     }
//     else {
//         if (current < scroll_locations.length-1 ){
//             current++;
//             scrolling = true;
//             $('html, body').animate({
//                 scrollTop: scroll_locations[current]
//             }, 
//             {duration: 600, complete: function () {scrolling = false}}
//             );
//         }
//     }

//     console.log(current)
    
// });


// var touchPos;
// var drawing = false;

// // store the touching position at the start of each touch
// document.body.ontouchstart = function(e){
//     if (e.path[0].id == "paint"){
//         drawing = true;
//     }
//     else{
//         drawing = false;
//     }
//     touchPos = e.changedTouches[0].clientY;
// }

// // detect wether the "old" touchPos is 
// // greater or smaller than the newTouchPos
// document.body.ontouchmove = function(e){
//     let newTouchPos = e.changedTouches[0].clientY;
//     if (scrolling || drawing){
//         return;
//     }
//     if(newTouchPos > touchPos) {
//         if (current > 0){
//             current--;
//             scrolling = true;
//             $('html, body').animate({
//                 scrollTop: scroll_locations[current]
//             }, 
//             {duration: 600, complete: function () {scrolling = false}}
//             );
//         }
//     }
//     if(newTouchPos < touchPos) {
//         if (current < scroll_locations.length-1 ){
//             current++;
//             scrolling = true;
//             $('html, body').animate({
//                 scrollTop: scroll_locations[current]
//             }, 
//             {duration: 600, complete: function () {scrolling = false}}
//             );
//         }
//     }
// }