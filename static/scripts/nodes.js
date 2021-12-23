

// nodes = document.getElementsByClassName('node grow');

// for (var i=0; i < nodes.length; i++){
//     console.log(nodes[i])

//     draggable = new PlainDraggable(nodes[i]);
// }




window.onload = load_arrows();


function load_arrows() {
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

                    var line = new LeaderLine(
                        start,
                        end,
                        {dash: {animation: true}, hide: true}                    
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
                    line.show(['draw'], {duration: 3000, timing: 'ease'});

                    
                }
            }
        }
    }
}
