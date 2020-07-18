// build chart
var svgWidth = 960
var svgHeight = 500

var margin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
}

//dimemsions
var width = svgWidth - margin.left - margin.right
var height = svgHeight - margin.top - margin.bottom

// //create svg wrapper/append/shift left & top margins
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)

//append group and set magins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`).classed("chart", true)

//data
d3.csv("assets/data/data.csv").then(function(data) {
    // Parse Data/Cast as numbers
    data.forEach(function(item) {
        item.age = +item.age
        item.healthcare = +item.healthcare
        item.obesity = +item.obesity
        item.poverty = +item.poverty
        item.smokes = +item.smokes
    })

    //scale
    var xScale = d3.scaleLinear()
        .domain([30, d3.max(data, d => d.age)])
        .range([0, chartWidth])
        .nice() 
    
    var yScale = d3.scaleLinear()
        .domain([8, d3.max(data, d => d.smokes)])
        .range([chartHeight, 0])
        .nice()
    
    // axis
    var bottomAxis = d3.axisBottom(xScale)
    var leftAxis = d3.axisLeft(yScale)

    // circles
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis)

    chartGroup.append("g")
      .call(leftAxis)

    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xScale(d.age))
        .attr("cy", d => yScale(d.smokes))
        .attr("r", "15")
    
    
    chartGroup.append("g")
        .selectAll('text')
        .data(data)
        .enter()
        .append("text")
        .classed("stateText", true)
        .text(d=>d.abbr)
        .attr("x", d=>xScale(d.age))
        .attr("y", d=>yScale(d.smokes))
        .attr("alignment-baseline", "central")

    
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Median Age: ${d.age}<br>Smokes: ${d.smokes}%`)
      })

    chartGroup.call(toolTip)

    circlesGroup.on("mouseover", function(circle) {
        
        toolTip.show(circle, this)
      })
        .on("mouseout", function(circle, index) {
          toolTip.hide(circle, this);
        })

    
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "aText")
      .text("Smokes (%)")

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "aText")
      .text("Age (Median)")
})