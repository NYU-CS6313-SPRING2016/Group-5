<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="Anqi Zhao, Yujia Zhai, Jingyuan Zhu, Cna Yao">
    <link rel="icon" href="assets/images/favicon.ico">

    <title>stockatwits dashboard</title>
    <link href="assets/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="assets/bootstrap/css/ie10-viewport-bug-workaround.css" rel="stylesheet">
    <link href="assets/css/main.css" rel="stylesheet">

  </head>

  <body>

    <!-- Fixed navbar -->
    <nav class="navbar navbar-default navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <a class="navbar-brand" href="#">Stocktwits Dashboard</a>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
          
          <ul class="nav navbar-nav navbar-right">
            <a class="navbar-brand">User Classification</a>
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">All type Users<span class="caret"></span></a>
              <ul class="dropdown-menu"> 
                <li><a href="#">Investor Relation</a></li>
                <li role="separator" class="divider"></li>
                <li><a href="#">Suggested User</a></li>
                <li role="separator" class="divider"></li>
                <li><a href="#">Official User</a></li>
                <li role="separator" class="divider"></li>
                <li><a href="#">Others</a></li>
              </ul>
            </li>
          </ul>
        </div><!--/.nav-collapse -->
      </div>
    </nav>

    <div class="container">

      <!--  Main Chart for sentiment analysis-->
      <div class="row">
        <div class="col-md-6">
              <div id = "barchart" width="70%"></div>
        </div>
        <div class="col-md-2">
              <div class="test" ></div>
        </div>
        <div class="col-md-4" >
            <div id="wordcloud"></div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-8">
          <div id="lineTitle" width="80%"></div>
        </div>
        <div class="col-md-4">
          <ul class="message" id="messageList">
              <li>this is a test,this is a test,this is a test,this is a test,this is a test,this is a test, this is a test,this is a test</li>
          </ul>

        </div>
      </div>

    </div> <!-- /container -->
  </body>
  <!-- Bootstrap core JavaScript==================== -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js"></script>
  <script>window.jQuery || document.write('<script src="assets/bootstrap/js/jquery.min.js"><\/script>')</script>
  <script src="assets/bootstrap/js/bootstrap.min.js"></script>
  <script src="assets/bootstrap/js/ie10-viewport-bug-workaround.js"></script>
  <script src="http://d3js.org/d3.v3.min.js"></script>
  <script src="assets/d3/d3.layout.cloud.js"></script>
  <script src="assets/js/barchart.js"></script>
  <script src="assets/js/radia.js"></script>
  <script src="assets/js/linechart.js"></script>

  <script>
  //wordcloud

  d3.json("http://127.0.0.1:5000/stock?symbol=AAPL", function(error, result){
      if(error) {
          return console.warn(error);
      };
      var color = d3.scale.linear()
          .range(["#FF6666","#3399FF"])
          .domain([1,15]);

      console.log(result["words"][5][1]);

      var words = [];
      var cloudWidth = 390,
          cloudHeight = 280;

        //the first 150 frequency words
      for(var i = 0; i < 150; i++){
        words.push([result["words"][i][0], result["words"][i][1]]);          
      }


      //draw(wordcloud);0
      d3.layout.cloud().size([cloudWidth, cloudHeight])
        .words(words.map(function(d){return { text: d[0], size: d[1]}}))
        .rotate(function(){return (~~(Math.random() * 2) - 1) * 30;})
        .font("Impact")
        .fontSize(function(d) { return d.size/10; })//Math.sqrt(d.size);
        .on("end", draw)
        .start(); 
            
      function draw(words) {  
        d3.select("#wordcloud").append("svg")
            .attr("width", cloudWidth)
            .attr("height", cloudHeight)
            .attr("class", "wordcloud")
            .append("g")
              .attr("transform", "translate(" + (cloudWidth/2 -10) + "," + cloudHeight/2 + ")")
            .selectAll("text")
              .data(words)
            .enter().append("text")
              .style("font-size", function(d) { return d.size + "px"; })
              .style("font-family", "Impact")
              .style("fill", function(d, i) { return color(i); })
              .attr("text-anchor", "middle")
              .attr("transform", function(d) {
                  return "translate(" + [d.x,d.y] + ")rotate(" + d.rotate + ")";
              })
            .transition()
            .duration(600)
            .style("opacity",0.9)
            .text(function(d) { return d.text; });
      }  
      //console.log(data["positive"]);
      var positive = result["position"];
      var negative = result["negative"];
            
      var progress = new RadialProgressChart('.test', {
            diameter: 50,
            series: [
            {
                labelStart: '\uF105',
                value: 0,
                color: {
                linearGradient: { x1: '0%', y1: '100%', x2: '50%', y2: '0%', spreadMethod: 'pad' },
                stops: [{offset: '100%', 'stop-color': '#ccddee', 'stop-opacity': 1},
                        {offset: '100%', 'stop-color': '#ffffff', 'stop-opacity': 1}]}
            }],
            center: function (d) {
                if(positive > negative){return positive;}
                else{return negative;}
            }
        });

        function loop(p) {
            if (p > 100) {
                setTimeout(function () {loop(75)}, 300)} 
            else {  progress.update(p);
                setTimeout(function () {loop(p + 1)}, 90)}    
        }

        loop(75);       
  });

    // //Message List

    // d3.json("2010.json", function(error, data){
    //     if(error) {
    //         console.log(data[2]);
    //         return console.log(error);

    //     };
        
    //     // var selction = list.selectAll("li")
    //     //   .data(data, function(d,i){ return d.})
    // });


</script>
</html>
