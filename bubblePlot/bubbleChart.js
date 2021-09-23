// Step 1
var data = [
  {cluster:"Cluster 1", x: 70+50, y: 40+50, val: 65, color: "#1e81b0"},
  {cluster:"Cluster 2", x: 50+50, y: 120+80, val: 8, color: "#e28743"},
  {cluster:"Cluster 3", x: 180+50, y: 80+50, val: 15, color: "#ff0000"},
]

// Step 3
var svg = d3.select("svg")
          .attr("width", 500)
          .attr("height", 300)
          .attr("transform", "translate(" + 100 + "," + 100 + ")");

// Step 4
svg.selectAll("circle")
  .data(data).enter()
  .append("circle")
  .attr("cx", function(d) {return d.x})
  .attr("cy", function(d) {return d.y})
  .attr("r", function(d) {
    return Math.sqrt((d.val)*400)/Math.PI 
  })
  .attr("fill", function(d) {
    return d.color;
  });

/*// Step 5
svg.selectAll("text")
  .data(data).enter()
  .append("text")
  .attr("x", function(d) {return d.x+(Math.sqrt(d.val)/Math.PI)+50})
  .attr("y", function(d) {return d.y+4})
  .text(function(d) {return d.cluster})
  .style("font-family", "arial")
  .style("font-size", "12px")*/