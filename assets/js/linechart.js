 var lineWidth = 600,
        lineHeight = 125;
 
         // Parse the date / time
         var parseDate = d3.time.format("%H:%M:%S").parse;
 
         // Set the ranges
         var xLine = d3.time.scale().range([0, lineWidth]);
         var yLine1 = d3.scale.linear().range([lineHeight, 0]);
         var yLine2 = d3.scale.linear().range([lineHeight, 0]);
         
 
         // Define the axes
         var xAxis1 = d3.svg.axis().scale(xLine)
             .orient("bottom").ticks(5);
         
         var xAxis2 = d3.svg.axis().scale(xLine)
             .orient("bottom").ticks(5);
 
         var yAxis1 = d3.svg.axis().scale(yLine1)
             .orient("left").ticks(5);
         
         var yAxis2 = d3.svg.axis().scale(yLine2)
             .orient("left").ticks(5);
         
         // Define the line
         var valueline = d3.svg.line()
             .x(function(d) { return xLine(d.time); })
             .y(function(d) { return yLine1(d.freq); });
         var valueline1 = d3.svg.line()
             .x(function(d) { return xLine(d.time); })
             .y(function(d) { return yLine2(d.price); });
         
         // Adds the svg canvas for upper line chart
         var svg1 = d3.select("#lineTitle")
             .append("svg")
                 .attr("width", lineWidth+15)
                 .attr("height", lineHeight+15)
             .append("g")
                 
         // Adds the svg canvas for lower line chart
         var svg2 = d3.select("#lineTitle")
             .append("svg")
                 .attr("width", lineWidth+15)
                 .attr("height", lineHeight+15)
             .append("g")
                
 
         // Get the data
         d3.json("assets/json/trendingV2.json", function(error, data) {
             
             data.forEach(function(d) {
                 d.time = parseDate(d.time);
                 
             });
 
             // Scale the range of the data
             xLine.domain(d3.extent(data, function(d) { return d.time; }));
             yLine1.domain([0, d3.max(data, function(d) { return d.freq; })]);
             yLine2.domain([0, d3.max(data, function(d) { return d.price; })]);

 
             // Add the valueline path.
             svg1.append("path")
                 .attr("class", "line")
                 .attr("transform", "translate(50," + 0 + ")")
                 .attr("d", valueline(data));
             
             svg2.append("path")
                 .attr("class", "line")
                 .attr("transform", "translate(50," + 0 + ")")
                 .attr("d", valueline1(data));
             
             // Add the X Axis
             svg1.append("g")
                 .attr("class", "x axis")
                 .attr("transform", "translate(50," + 120 + ")")
                 .call(xAxis1);
             svg2.append("g")
                 .attr("class", "x axis")
                 .attr("transform", "translate(50," + 120 + ")")
                 .call(xAxis2);
             
             // Add the Y Axis
             svg1.append("g")
                 .attr("class", "y axis")
                 .attr("transform", "translate(50," + (-4) + ")")
                 .call(yAxis1);
             svg2.append("g")
                 .attr("class", "y axis")
                 .attr("transform", "translate(50," + (-4) + ")")
                 .call(yAxis2);
 
         });