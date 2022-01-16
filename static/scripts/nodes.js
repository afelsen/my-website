all_lines = []

// window.onload =
window.addEventListener('load', debounce(load_arrows, 150));
// window.onresize = refresh_arrows();
window.addEventListener('resize', debounce(refresh_arrows, 150));

window.addEventListener('load', debounce(load_doodle_arrow, 150));
window.addEventListener('resize', debounce(refresh_doodle_arrow, 200));


function refresh_doodle_arrow(){
  for (var i = 0; i < doodle_arrow.length; i++){
    doodle_arrow[i].position();
  }
}

function load_doodle_arrow() {
  var start = document.getElementById("these");
  var end = document.querySelector("#probabilities");
  var line = new LeaderLine(
      start,
      end,
      {}
  );
  line.setOptions({startSocket: 'bottom', endSocket: 'top'});
  doodle_arrow.push(line);
}


function refresh_arrows(){
  for (var i = 0; i < all_lines.length; i++){
    all_lines[i].position();
  }
}


function load_arrows() {
    document.getElementById("welcome").className += " loaded";


    var nodes = document.getElementById("all_nodes").children;

    var coords = []
    for (var i=0; i < nodes.length; i++) {
        var colA = nodes[i].children;
        for (var j=0; j < colA.length; j++){
            if (i < nodes.length - 1){
                var colB = nodes[i+1].children
                for (var k=0; k < colB.length; k++){

                    var rng = Math.random();
                    var start = colA[j].children[0].children[0];
                    var end = colB[k].children[0].children[0];
                    if (rng < .5){
                        start = colB[k].children[0].children[0];
                        end = colA[j].children[0].children[0];
                    }

                    var do_anim = true;
                    var do_hide = true;
                    if( isMobile.any() || true ) {
                      do_anim = false;
                      do_hide = false;
                    }

                    var line = new LeaderLine(
                        start,
                        end,
                        {dash: {animation: do_anim}, hide: do_hide}
                    );


                    line.path = "straight";
                    line.color = "black";

                    if (rng < .5){
                        line.setOptions({startSocket: 'left', endSocket: 'right'});
                    }
                    else {
                        line.setOptions({startSocket: 'right', endSocket: 'left'});
                    }

                    line.setOptions({
                        startPlugColor: '#1a6be0',
                        endPlugColor: '#1efdaa',
                        endPlug: "behind",
                        gradient: true
                    })
                    line.setOptions({dropShadow: {color: 'blue', dx: 0, dy: 0}});

                    // line.hide(['none']);
                    if (do_hide){
                      line.show(['draw'], {duration: 3000, timing: 'ease'});
                    }
                    all_lines.push(line);

                }
            }
        }
    }
}
