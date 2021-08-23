var dataset1 = [[10, 200], [20, 140], [30, 100], [40, 60], [50, 40], [60, 38], [70, 34], [80, 30], [90, 28]];

// append the svg object to the body of the page
var svg = d3.select("svg"),
  margin = 200,
  width = svg.attr("width") - margin,
  height = svg.attr("height") - margin

var xScale = d3.scaleLinear().domain([0, 100]).range([0, width]),
  yScale = d3.scaleLinear().domain([0, 200]).range([height, 0]);

  var g = svg.append("g")
            .attr("transform", "translate(" + 100 + "," + 100 + ")");

  // Title
  svg.append('text')
  .attr('x', width/2 + 100)
  .attr('y', 100)
  .attr('text-anchor', 'middle')
  .style('font-family', 'Helvetica')
  .style('font-size', 20)
  .text('Scatter Plot');
  
  // X label
  svg.append('text')
  .attr('x', width/2 + 100)
  .attr('y', height - 15 + 150)
  .attr('text-anchor', 'middle')
  .style('font-family', 'Helvetica')
  .style('font-size', 12)
  .text('Independant');
  
  // Y label
  svg.append('text')
  .attr('text-anchor', 'middle')
  .attr('transform', 'translate(60,' + height + ')rotate(-90)')
  .style('font-family', 'Helvetica')
  .style('font-size', 12)
  .text('Dependant');

  //X Axis
  g.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(xScale));
        
  //Y Axis
  g.append("g")
    .call(d3.axisLeft(yScale));

  svg.append("g")
    .selectAll("dot")
    .data(dataset1)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return xScale(d[0]); } )
    .attr("cy", function (d) { return yScale(d[1]); } )
    .attr("r", 2)
    .attr("transform", "translate(" + 100 + "," + 100 + ")")
    .style("fill", "#CC0000");


