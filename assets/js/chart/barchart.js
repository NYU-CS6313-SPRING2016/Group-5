
//Global Variable
var urla = "http://stocktwitsfinal.herokuapp.com/realtime_sector?sector=";
var urlb = "http://stocktwitsfinal.herokuapp.com/realtime_stock?symbol=";
//increase
var increase = [];
//scale
var color = d3.scale.linear().range(["#FF6666", "#3399FF"]);
//Color    
var b = d3.rgb(255,102,102);    
var a = d3.rgb(51,153,255);
//translate color [0,1] 
var compute = d3.interpolate(a,b);
//x,y, color scale
var cScale = d3.scale.linear()
    .range([0, 1]);
var improvementValue;

function gettreemap(name){
    var obj = httpGet(urlb.concat(name));
    var jsonobj = JSON.parse(obj);
    var message = jsonobj["messages"];
    var pos = jsonobj["positive"];
    var neg = jsonobj["negative"];
    var stock ;
    stock = {   name: name,
                size: message,
                positive: pos,
                negative: neg
            }
    return stock;
}


//data request
function getbar(name){
    var obj = httpGet(urla.concat(name));
    var jsonobj = JSON.parse(obj);
    var message = jsonobj["messages"];
    var pos = jsonobj["positive"];
    var neg = jsonobj["negative"];  
    var sector = {  "name" : name,
                    "message" : message,
                    "series" :[
                        {
                            "label" : "positive", "value" : pos
                        },
                        {
                            "label" : "negative", "value" : neg
                        }
                ]
            }
    return sector;
}


//get url
function httpGet(theUrl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

//Draw Variable
var barWidth = 220;
    
var chartWidth       = 230,
    barHeight        = 20,
    groupHeight      = barHeight * 2,
    gapBetweenGroups = 40;

//load json for sector
d3.json("assets/json/sector.json", function(error, result){

    var sect = [];
    var topsect = [];
    var message;
    var sectpair;
    var sectorname = [];
    var barname;
    var barmood;
    for(var i = 0; i < result.length; i++){
        sectorname[i] = result[i].name;      
        message = getbar(sectorname[i]);
        sect.push(message);
    }

    sect.sort(function(a,b){return b.message - a.message;})

    for(var j = 0; j < 9; j++){
        topsect[j] = sect[j];
    }

    sectpair = JSON.stringify(topsect);

    var sectjson = JSON.parse(sectpair); 
    //return top 10 sector
    sectjson.sort(function(a,b){return d3.ascending(a.message - b.message);});
    
    console.log(zipData);

    //Draw barchart
    var chartHeight = barHeight * zipData.length + gapBetweenGroups * 9;
     
    var x = d3.scale.linear()
        .domain([0, d3.max(zipData)])
        .range([0, chartWidth]);

    //generate svg
    var chart = d3.select("#barchart")
        .append("svg")
        .attr("width", chartWidth)
        .attr("height", chartHeight)
        .attr("class", "chart");
    //append rect   
    var bar = chart.selectAll("g")
        .data(zipData)
        .enter().append("g")
        .attr("transform", function(d, i) {
          return "translate(" + 30 + "," + (i * barHeight + gapBetweenGroups * (1 + Math.floor(i/2))) + ")";
        });
    bar.append("rect")
        .attr("class", "barRect")
        .attr("fill", function(d,i) { return color(i % 2); })
        .attr("width", x)
        .attr("height", barHeight - 5)
        .attr("dy", "20px")
        .on("click", function(d,i){
            if(i % 2 === 0) {
                barname = sectjson[Math.floor(i/2)].name;
                barmood = "positive";}
            else {
                barname = sectjson[Math.floor((i-1)/2)].name;
                barmood = "negative";
                 }
            console.log(barname,barmood);
            createTreemap(barname,barmood);
    });

    var devpos = d3.max(sectjson, function(d){return d.positive;});
    var devneg = d3.min(sectjson, function(d){return d.negative;});

    var color_scale = d3.scale.linear()
        .domain([0,devpos])
        .interpolate(d3.interpolateHcl)
        .range([a,b]);
    
    // Draw sector labels
    bar.append("text")
        .attr("class", "sectorLabel")
        .attr("x", function(d) { return (-10); })
        .attr("y", groupHeight / 2)
        .attr("dy", "5px")
        .attr("anchor", "middle")
        .attr("transform", "translate(10 ,"+ -30 +")")
        .text(function(d,i) {
          if (i % 2 === 0)
            return sectjson[Math.floor(i/2)].name;
          else
            return ""})
        .attr("fill", "white");
        
    //Draw improvement increase
    bar.append("text")
        .attr("class", "improveLabel")
        .attr("x", function(d) { return  0; })
        .attr("y", groupHeight / 2)
        .attr("dy", "5px")
        .attr("anchor", "middle")
        .attr("transform", "translate(" + 120 + ","+ -50 +")")
        .text(function(d,i) {
          if (i % 2 === 0)
            return increase[i/2];
          else
            return "Mes. Imp.  " +  improvementValue + "%"})
        .attr("fill", "white");

    //gradient
    var gradient = d3.select("#gradient").append("svg")
        .attr("width", 800)
        .attr("height", 50)
        .append("g")
        .attr("transform", "translate(0" + "," + 0 + ")");

    var defs = gradient.append("defs");
        
    var linearGradient = defs.append("linearGradient")
                        .attr("id","linearColor")
                        .attr("x1","100%")
                        .attr("y1","0%")
                        .attr("x2","0%")
                        .attr("y2","0%");

    var stop1 = linearGradient.append("stop")
                .attr("offset","0%")
                .style("stop-color", a.toString());

    var stop2 = linearGradient.append("stop")
                .attr("offset","100%")
                .style("stop-color", b.toString());
        
    var colorRect = gradient.append("rect")
                .attr("x", 100)
                .attr("y", 10)
                .attr("width", 500)
                .attr("height", 20)
                .style("fill","url(#" + linearGradient.attr("id") + ")");
        
    var text_2 = gradient.append("text")
        .attr("x",620)
        .attr("y",30)
        .attr("fill", "white")
        .text("Negative Num");
        
    var text_3 = gradient.append("text")
        .attr("x",0)
        .attr("y",30)
        .attr("fill", "white")
        .text("Positive Num");
});

    
//Treemap function    
function createTreemap(name,mood){


    //draw variable
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = 600 - margin.left - margin.right,
        height = 290 - margin.top - margin.bottom;

    //treemap layout
    var treemap = d3.layout.treemap()
        .size([width, height])
        .sticky(true)
        .value(function(d) { return d.size; });
        
    var div = d3.select("#treemap")
            .style("position", "relative")
            .style("width", (width + margin.left + margin.right) + "px")
            .style("height", (height + margin.top + margin.bottom) + "px")
            .style("left", margin.left + "px")
            .style("top", margin.top + "px");


    var tooltip = d3.select(".tooltip")
                    .style("opacity", 0);

    //treemap functional
    d3.json("assets/json/symbol.json", function(error, result) {
      if (error) throw error;
        //treemap get data
        var sector = name;
        var stock = [];
        var message;
        var tree = {};
        var topstock = [];
        for(var i=0; i< result.length; i++){
            if(result[i]["sector"] === sector){
                message = gettreemap(result[i]["stock"]);
                    stock.push(message);
                }
            }
        stock.sort(function(a,b){return b.size - a.size;});
        for(var j = 0; j < 20; j++){
            topstock[j] = stock[j];
        }
        topstock.sort(function(a,b){return b.positive - a.positive});

        var stockjson = JSON.parse(JSON.stringify(topstock));
        tree.name = sector;
        tree.children = stockjson;

        var treejson = JSON.stringify(tree);
        var treeobj = JSON.parse(treejson);
        
        var color_scale = d3.scale.linear()
           .domain([0,topstock[0][mood]])
           .interpolate(d3.interpolateHcl)
           .range([a,b]);

        //draw tree node
        var node = div.datum(treeobj).selectAll(".node")
                .data(treemap.nodes);
            
            node.transition().duration(500).call(position);
        
            node.enter().append("div")
                .attr("class", "node")
                .style("background", function(d) {return color_scale(mood == "positive"? d.positive : d.negative);});
        
            node.text(function(d) { return d.children? null : d.name; });

            node.on("click",function(d){
                 savename(d.name);})
                  .on("mouseover",function(d){
                       var obj = getprice(d.name);
                       myName = d.name;
                       var bid = obj["bid"];
                       var open = obj["open"];
                       var close = obj["close"];
                       var change = obj["change"];
                       var dayrange = obj["dayrange"];
                       var yearrange = obj["yearrange"];
                       
                       tooltip.transition().duration(200).style("opacity", 0.9);
                       tooltip.style("left", (d3.event.pageX) + "px")     
                       .style("top", (d3.event.pageY - 28) + "px");   
                   })
           .on("mouseout", function(d){
               tooltip.transition().duration(500).style("opacity",0);
           });
        
           node.exit().remove();
        
        
    });

    //rect position
    function position() {
      this.style("left", function(d) { return d.x + "px"; })
          .style("top", function(d) { return d.y + "px"; })
          .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
          .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
    }
    function savename(name){
        var symbolspan = document.getElementById("symbol");
        symbolspan.innerHTML = name;
        listRequest(myName);
        wordCloudRequest(myName);
        moodRequest(myName);
        // stockRequest(name);
        // messageRequest(name);
    }

}
