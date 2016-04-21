
    wordCloudChart();
    function wordCloudChart(){
        d3.json("http://127.0.0.1:5000/stock?symbol=AAPL", function(error, result){
            if(error) {
                return console.warn(error);
            };
            var color = d3.scale.linear()
                .range(["#FF6699","#3399FF"])
                .domain([1,15]);

            console.log(result["words"][5][1]);

            var words = [];
            //the first 150 frequency words
            for(var i = 0; i < 150; i++){
                words.push([result["words"][i][0], result["words"][i][1]]);          
            }

            console.log(words);

            d3.layout.cloud().size([320, 350])
                    .words(words.map(function(d){return { text: d[0], size: d[1]}}))
                    .rotate(function(){return (~~(Math.random() * 2) - 1) * 30;})
                    .font("Impact")
                    .fontSize(function(d) { return Math.sqrt(d.size); })
                    .on("end", draw)
                    .start(); 
            
            function draw(words) {  
                d3.select(".wordcloud").append("svg")
                    .attr("width", 320)
                    .attr("height", 350)
                    .attr("class", "wordcloud")
                    .append("g")
                        .attr("transform", "translate(" + 160 + "," + 175 + ")")
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
            
            
        });
    }