//Global Variable
var data = [];
var root = [];
var sector = [];
var sectorname = [];

var bar;
var urla = "http://127.0.0.1:5000/sector?sector=";
var urlb = "http://127.0.0.1:5000/stock?symbol=";

//barchart and dfs svg   
    var svgWidth = 450,
        svgHeight = 280,
        margin = {top: 0, right: 20, bottom: 30, left: 80},
        width = svgWidth - margin.left - margin.right,
        height = svgHeight - margin.top - margin.bottom;
//xAxis//   
    var x = d3.scale.linear()
        .range([0, width]);
//yAxis  
    var y = d3.scale.ordinal()
        .rangeRoundBands([height, 0], .1);
//Color    
    var b = d3.rgb(255,102,102);	
    var a = d3.rgb(51,153,255);
//translate color [0,1] 
    var compute = d3.interpolate(a,b);
//x,y, color scale
    var cScale = d3.scale.linear()
        .range([0, 1]);
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(5);
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");
//generate svg
    var svg = d3.select("#barchart").append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//for data request
function getmessage(name){
    var obj = httpGet(urla.concat(name));
    var jsonobj = JSON.parse(obj);
    return jsonobj["messages"];
}

function getmood(name){
    var obj = httpGet(urla.concat(name));
    var jsonobj = JSON.parse(obj);
    var positive = jsonobj["positive"];
    var negative = jsonobj["negative"];
    var mood = (positive - negative) / 10;
    return mood;
}
//for treemap
function gettreemapmessage(name){
     var obj = httpGet(urlb.concat(name));
    var jsonobj = JSON.parse(obj);
    return jsonobj["messages"];
}

function gettreemappos(name){
    var obj = httpGet(urlb.concat(name));
    var jsonobj = JSON.parse(obj);
    var positive = jsonobj["positive"];
    var negative = jsonobj["negative"];
    var mood = (positive - negative) / 10;
    return positive;
}

//load json for sector
    d3.json("assets/json/sector.json", function(error,result){
        if (error) throw error;
        var sect = [];
        var sectpair;
        for(var i = 0; i < result.length; i++){
            sectorname[i] = result[i].name;
            var message = getmessage(sectorname[i]);
            var mood = getmood(sectorname[i]);
            if(message > 0){
            sect.push ({
                "message":  message,
                "name" : sectorname[i],
                "mood" : mood
            });
            }
        }
        sectpair = JSON.stringify(sect);

        var sectjson = JSON.parse(sectpair);
        sectjson.sort(function(a, b){return d3.ascending(a.message, b.message)})
        //console.log(sectjson);
        x.domain([0, d3.max(sectjson, function(d) { return d.message; })]);
        y.domain(sectjson.map(function(d) { return d.name; }));
        cScale.domain([0,d3.max(sectjson, function(d) { return d.message; })]);


        var devmax = d3.max(sectjson, function(d){return d.mood;});
        var devmin = d3.min(sectjson, function(d){return d.mood;});
        
        var color_scale = d3.scale.linear()
            .domain([devmin,devmax])
            .interpolate(d3.interpolateHcl)
            .range([a,b]);
        
// svg style code    
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("x", svgWidth-80)
            .attr("dx", ".70em")
            .style("text-anchor", "end")
            .text("Message");
    
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);
    
        svg.selectAll("rect")
            .data(sectjson)
            .enter()
            .append("rect")
            .on("click", function(d){
                bar = d.name;
                createTreemap(bar);
            })
            .attr("class", "bar")
            .attr("y", function(d) { return y(d.name); })
            .attr("height", y.rangeBand())
            .attr("x", 0)
            .attr("width", function(d) { return x(d.message); })
            .attr("fill", function(d){
            return color_scale(d.mood);
            //return compute(cScale(Math.floor(d.mood / dev) * dev));
    });
    
    var defs = svg.append("defs");
        
    var linearGradient = defs.append("linearGradient")
						.attr("id","linearColor")
						.attr("x1","0%")
						.attr("y1","100%")
						.attr("x2","0%")
						.attr("y2","0%");
 
    var stop1 = linearGradient.append("stop")
				.attr("offset","0%")
				.style("stop-color",a.toString());
 
    var stop2 = linearGradient.append("stop")
				.attr("offset","100%")
				.style("stop-color",b.toString());
        
    var colorRect = svg.append("rect")
				.attr("x", svgWidth-110)
				.attr("y", 150)
				.attr("width", 20)
				.attr("height", 70)
				.style("fill","url(#" + linearGradient.attr("id") + ")");
    var text_1 = svg.append("text")
		.attr("x",svgWidth-130)
		.attr("y",125)
        .attr("fill", "white")
		.attr("font-size", "8px")
		.text("Market Mood");
        
    var text_2 = svg.append("text")
		.attr("x",svgWidth-130)
		.attr("y",140)
        .attr("fill", "white")
		.attr("font-size", "8px")
		.text("Positive Num");
        
    var text_3 = svg.append("text")
		.attr("x",svgWidth-130)
		.attr("y",235)
        .attr("fill", "white")
		.attr("font-size", "8px")
		.text("Negative Num");
    })
    
    
function createTreemap(name){

var margin = {top: 40, right: 10, bottom: 10, left: 10},
    width = 320 - margin.left - margin.right,
    height = 340 - margin.top - margin.bottom;

//treemap layout
var treemap = d3.layout.treemap()
    .size([width, height])
    .sticky(true)
    .value(function(d) { return d.size; });

var div = d3.select("body").append("div")
    .style("position", "relative")
    .style("width", (width + margin.left + margin.right) + "px")
    .style("height", (height + margin.top + margin.bottom) + "px")
    .style("left", margin.left + "px")
    .style("top", margin.top + "px");
    
d3.json("assets/json/symbol.json", function(error, result) {
  if (error) throw error;
    var sector = name;
    var stock = [];
    var message;
    var mood;
    var tree = [];
    for(var i=0; i< result.length; i++){
        if(result[i]["sector"] === sector){
            message = gettreemapmessage(result[i]["stock"]);
            mood = gettreemapmode(result[i]["stock"]);
            if(message > 0){
                stock.push({
                name: result[i]["stock"],
                size: message,
                mood: mood
                });
            }
        }
    }
    var stockjson = JSON.parse(JSON.stringify(stock));
     tree.push({
                name: sector,
                children: stockjson
            });
    
    var treejson = JSON.stringify(tree);
    var treeobj = JSON.parse(treejson);
    
    console.log(treejson);
     
    var devmax = d3.max(treeobj, function(d){return d.mood;});
    var devmin = d3.min(treeobj, function(d){return d.mood;});
    
    var color_scale = d3.scale.linear()
   .domain([devmin,devmax])
   .interpolate(d3.interpolateHcl)
   .range(["green","red"]);

//Tree node
  var node = div.datum(treeobj).selectAll(".node")
      .data(treemap.nodes)
      .enter().append("div")
      .attr("class", "node")
      .call(position)
      .style("background", function(d) {return color_scale(d.mood);})
      .text(function(d) { return d.children? null : d.name; });
});

//rect position
function position() {
  this.style("left", function(d) { return d.x + "px"; })
      .style("top", function(d) { return d.y + "px"; })
      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
}

}




function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}