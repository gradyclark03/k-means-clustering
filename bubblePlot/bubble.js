var data = [
  {source:"Item 1", x: 100, y: 60, val: 1350, color: "#C9D6DF"},
  {source:"Item 2", x: 30, y: 80, val: 2500, color: "#F7EECF"},
  {source:"Item 3", x: 50, y: 40, val: 5700, color: "#E3E1B2"},
  {source:"Item 4", x: 190, y: 100, val: 30000, color: "#F9CAC8"},
  {source:"Item 5", x: 80, y: 170, val: 47500, color: "#D1C2E0"}
]

var svg = d3.select("svg")
          .attr("width", 500)
          .attr("height", 500);

svg.selectAll("circle")
      .data(data).enter()
      .append("circle")
        .attr("cx", function(d) {return d.x})
        .attr("cy", function(d) {return d.y})
        .attr("r", function(d) {
          return Math.sqrt(d.val)/Math.PI 
        })
        .attr("fill", function(d) {
          return d.color;
        });

svg.selectAll("text")
      .data(data).enter()
      .append("text")
        .attr("x", function(d) {return d.x+(Math.sqrt(d.val)/Math.PI)})
        .attr("y", function(d) {return d.y+4})
        .text(function(d) {return d.source})
        .style("font-family", "arial")
        .style("font-size", "12px")