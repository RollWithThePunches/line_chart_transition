var height = 300;
var width = 500;

var margin = {left:50,right:50,top:80,bottom:0};

var parseDate = d3.timeParse("%Y");

var x = d3.scaleTime()
            .range([0,width]);

var y = d3.scaleLinear()
            .range([height,0]);

var yAxis = d3.axisLeft(y)
			.ticks(3)
			.tickPadding(10)
			.tickSize(7);                        

var xAxis = d3.axisBottom(x)
			.ticks(5)
			.tickPadding(10)
			.tickSize(7)
			.tickSizeOuter(0); //tickSizeOuter removes the tick at 0

var line = d3.line()
			.x(function(d,i){ return x(d.year); })
			.y(function(d,i){ return y(d.amount); });

function transition(path) {
  path.transition()
      .duration(3000)
      .attrTween("stroke-dasharray", tweenDash)
      .each("end", function() { d3.select(this).call(transition); });
}

function tweenDash() {
  var l = this.getTotalLength(),
      i = d3.interpolateString("0," + l, l + "," + l);
  return function(t) { return i(t); };
}

var svg = d3.select("#area-chart")
			.append("svg")
			.attr("height",height + margin.top)
			.attr("width",width + margin.left);

// gridlines in x axis function
/*function make_x_gridlines() {		
    return d3.axisBottom(x)
        .ticks(5)
}*/

// gridlines in y axis function
function make_y_gridlines() {		
    return d3.axisLeft(y)
        .ticks(4)
}

d3.csv("craft-stats.csv", function(error, data) {
      if (error) throw error;

     data.forEach(function(d) {
	      d.year = parseDate(d.year);
	      d.amount = +d.amount;
     });


	x.domain(d3.extent(data,function(d){ return d.year; }));
	         
	y.domain([0, d3.max(data, function(d){ return d.amount; })]);

	var chartGroup = svg.append("g")
				.attr("transform","translate(50,-5)");

	  // X gridlines (verticle)
	  /*chartGroup.append("g")			
	      .attr("class", "grid")
	      .attr("transform", "translate(0," + height + ")")
	      .call(make_x_gridlines()
	          .tickSize(-height)
	          .tickFormat("")
	      )*/

	  // Y gridlines (horizontal)
	  chartGroup.append("g")			
	      .attr("class", "grid")
	      .attr('stroke-dasharray',('3,3'))
	      .attr('stroke-width',0.5)
	      .call(make_y_gridlines()
	          .tickSize(-width)
	          .tickFormat("")
	      )

	chartGroup.append("g")
		      .attr("class","axis y")
		      .call(yAxis);

	chartGroup.append("g")
		      .attr("class","axis x")
		      .attr('transform','translate(0,' + height + ')')
		      .call(xAxis);

	chartGroup.append("path")
				.attr("d",line(data))
				.attr('class','line')
				.attr('fill','none')
				.style('stroke','black')
				.style('stroke-width','2')
				.call(transition);
	               

});


        