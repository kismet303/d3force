(function() {
	var width = 900,
	height = 600;


var svg = d3.select('#chart')
  .append("svg")
  .attr("height", height)
  .attr("width", width)
  .append("g")
  .attr("transform", "translate(0,0)")


 d3.select('svg').append("text")
        .attr("x", (40))            
        .attr("y", 440)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .style("fill", 'red')
        .text("Event");

  d3.select('svg').append("text")
        .attr("x", (40))            
        .attr("y", 40)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .style("fill", 'red')
        .text("Censored");




var radiusScale = d3.scaleSqrt().domain([2,48]).range([10,40])
 var fillColor = d3.scaleOrdinal()
    .domain(['low', 'medium', 'high', 'other'])
    .range(['#A1CCBC', '#3B9976', '#C9FFCD', '#FF89F2']);
var tooltip = floatingTooltip('tooltip', 240);


function showDetail(d) {
    // change outline to indicate hover state.
    d3.select(this).attr('stroke', 'black');

    var content = '<span class="name">USUBJID: </span><span class="value">' +
                  d.USUBJID +
                  '</span><br/>' +
                  '<span class="name">AVAL: </span><span class="value">' +
                  d.AVAL + "       " + d.GROUP +
                  '</span><br/>' +
                  '<span class="name">CNSR: </span><span class="value">' +
                  d.CENSOR + "       " +
                   '</span>'; 
    
    tooltip.showTooltip(content, d3.event);
  }

function hideDetail(d) {
    // reset outline
    d3.select(this)
      //.attr('stroke', d3.rgb(fillColor(d.group)).darker());
      .attr('stroke', 'lightblue');
    tooltip.hideTooltip();
  }



var forceXSeparate = d3.forceX(function(d){
	if (d.TRT01AN === "1") {
		return 200
	} else {
		return 700
	}
}).strength(0.1)


var forceXCombine = d3.forceX(width /2).strength(0.1)

var forceYSeparate = d3.forceY(function(d){
	if (d.CENSOR === "1") {
		return 100
	} else {
		return 500
	}
}).strength(0.1)


var forceYCombine = d3.forceY(height /2).strength(0.1)









var forceCollide = d3.forceCollide(function(d){
  	//return radiusScale(d.AVAL) + 1
  	return radiusScale(7) 
  	})

var simulation = d3.forceSimulation()
  .force("x", forceXCombine)
  .force("y", forceYCombine)
  .force("collide", forceCollide)
  


d3.queue()
  .defer(d3.csv, "src/adtte.csv")
  .await(ready)

function ready (error, datapoints) {

	var circles = svg.selectAll(".USUBJID")
	  .data(datapoints)
	  .enter().append("circle")
	  .attr("class", "artist")
	  .attr("r", function(d) {
	  	//return radiusScale(d.AVAL)
	  	return radiusScale(6)
	  })
	  .attr("fill", "lightblue")
	  .on('click', function(d) {
	  	console.log(d);
	  })
	  .on('mouseover', showDetail)
      .on('mouseout', hideDetail)

	

	d3.select("#Randomization").on('click', function(){
		console.log("Combine the bubbles")
		simulation
		  .force("x", forceXCombine)
		  .force("y", forceYCombine)
		  .alphaTarget(0.5)
		  .restart()
	})

	d3.select("#Outcome").on('click', function(){
		console.log("Separate")
		simulation
		  .force("x", forceXSeparate)
		  .force("y", forceYSeparate)
		  .alphaTarget(0.5)
		  .restart()
	})

    simulation.nodes(datapoints)
      .on('tick', ticked)

    function ticked () {
    	circles
    	  .attr("cx", function(d) {
    	  	return d.x
    	  })
    	  .attr("cy", function(d) {
    	  	return d.y
    	  })
    }

}
})();