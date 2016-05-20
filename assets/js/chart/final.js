var urlb = "http://stocktwitsfinal.herokuapp.com/stock?symbol=";
var b = d3.rgb(255,102,102);	
var a = d3.rgb(51,153,255);

function getmessage(name){
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


var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 680 - margin.left - margin.right,
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

d3.json("assets/json/maxsymbol.json", function(error, result) {
  if (error) throw error;
    var stock = [];
    var message;
    var topstock = [];
    var tree = {};
    var count = 0;
    for(var i=0; i< result.length; i++){
            message = getmessage(result[i]["stock"]);
            stock.push(message);
        }
        stock.sort(function(a,b){return b.size - a.size;})
    for(var j = 0; j < 21; j++){
        topstock[j] = stock[j];
    }
    console.log(topstock);
    var stockjson = JSON.parse(JSON.stringify(topstock));
    tree.name = "top stocks";
    tree.children = stockjson;
    var treejson = JSON.stringify(tree);
    var treeobj = JSON.parse(treejson);
    
    var color_scale = d3.scale.linear()
   .domain([0,topstock[0]["positive"]])
   .interpolate(d3.interpolateHcl)
   .range([a,b]);

//Tree node
  var node = div.datum(treeobj).selectAll(".node")
            .data(treemap.nodes);    
    
            node.enter().append("div")
            .attr("class", "node")
            .call(position)
            .style("background", function(d) {return color_scale(d.positive);})
            .text(function(d) { return d.children? null : d.name; })
            .on("click",function(d){
               savename(d.name);
               updateMyName();
             })
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

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function savename(name){
    var symbolspan = document.getElementById("symbol");
    symbolspan.innerHTML = name;
    listRequest(myName);
    wordCloudRequest(myName);
    moodRequest(myName);
   console.log(name);
   console.log(myName);
}
