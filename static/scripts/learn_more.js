function set_pred_data(data){
  var pred = $.parseJSON(data)

  var probs = pred["probabilities"]
  var order = pred["order"]

  var list_elements = document.querySelector("#probabilities").children;
  for (i = 0; i < list_elements.length; i++) {

      var name = list_elements[i].className
      var o = order[name];
      var prob = probs[name];

      var img = list_elements[i].children[0].children[0]

      if (o == 0){
        img.style.visibility = 'visible';
      }
      else {
        img.style.visibility = 'hidden';
      }


      list_elements[i].setAttribute("data-pos", o + 1);
      list_elements[i].children[0].children[2].innerHTML = Math.round(prob * 100) + "%";
  }

  var theme = document.getElementById('variable_theme');
  if (pred["prediction"] == "moon") {
      theme.setAttribute('href', Flask.url_for('static', {"filename": 'stylesheets/variable_themes/dark.css'}));
      document.cookie = "theme=dark";
  } else if (pred["prediction"] == "sun"){
      theme.setAttribute('href', Flask.url_for('static', {"filename": 'stylesheets/variable_themes/light.css'}));
      document.cookie = "theme=light";
  } else if (pred["prediction"] == "rainbow"){
      theme.setAttribute('href', Flask.url_for('static', {"filename": 'stylesheets/variable_themes/rainbow.css'}));
      document.cookie = "theme=rainbow";
  }




}

function save(){
    var data = JSON.stringify(canvas_data);
    var image = canvas.toDataURL();

    $.post('/get_theme_result', { save_cdata: data, save_image: image},
        function(data){
             set_pred_data(data);
    }).fail(function(err){
          console.log(err);
    });
}


function go(){

}
