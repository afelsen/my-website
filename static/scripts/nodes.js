

// nodes = document.getElementsByClassName('node grow');

// for (var i=0; i < nodes.length; i++){
//     console.log(nodes[i])

//     draggable = new PlainDraggable(nodes[i]);
// }


all_lines = []

// window.onload =
window.addEventListener('load', debounce(load_arrows, 150));
// window.onresize = refresh_arrows();
window.addEventListener('resize', debounce(refresh_arrows, 150));




function refresh_arrows(){
  for (var i = 0; i < all_lines.length; i++){
    all_lines[i].position();
  }
}


function load_arrows() {
    console.log("TEST");
    document.getElementById("welcome").className += " loaded";


    var nodes = document.getElementById("all_nodes").children;

    var coords = []
    for (var i=0; i < nodes.length; i++) {
        var colA = nodes[i].children;
        for (var j=0; j < colA.length; j++){
            console.log(colA[j]);

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
