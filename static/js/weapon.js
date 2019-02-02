// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
}

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//Create a SVG wrapper
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append a SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "iyear";
var chosenYAxis = "nkills";

// function used to update poverty X scale
function xScale(weaponData, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(weaponData, d => d[chosenXAxis]) * 0.8,
        d3.max(weaponData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);

    return xLinearScale;
}

// update xAxis var
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

function renderCircles(circlesGroup, newXScale, chosenXAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;
}

function renderCircleLabels(circlesLabels, newXScale, chosenXAxis) {
    circlesLabels.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]));

}

// function updateToolTip(chosenXAxis, circlesGroup) {
//     if (chosenXAxis === "poverty") {
//         var label = "In Poverty(%)"
//     }


//     var toolTip = d3.tip()
//         .attr("class", "tooltip")
//         .offset([80, -60])
//         .html(function (d) {
//             return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
//         });

//     circlesGroup.call(toolTip);

//     circlesGroup.on("mouseover", function (data) {
//         toolTip.show(data);
//     })

//         .on("mouseout", function (data, index) {
//             toolTip.hide(data);
//         });

//     return circlesGroup;
// }

d3.csv("assets/data/data1.csv").then(function (weaponData) {

    //parse data
    weaponData.forEach(function (data) {
        data.noHealthInsurance = +data.noHealthInsurance;
        data.poverty = +data.poverty;
    });

    var xLinearScale = xScale(weaponData, chosenXAxis);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(weaponData, d => d.noHealthInsurance)])
        .range([height, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(weaponData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d.noHealthInsurance))
        .attr("r", 12)
        .attr("fill", "skyblue")
        .attr("opacity", ".7");

    var circlesLabels = chartGroup.selectAll("tspan")
        .data(weaponData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d.noHealthInsurance))
        .attr("font-size", 10)
        .attr("fill", "white")
        .attr("text-anchor", "middle")
        .text(d => d.abbr);


    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .classed("active", true)
        .text("In Poverty (%)");


    // append y axis
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Lacks Healthcare(%)");

    // updateToolTip function above csv import
    // var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    // x axis labels event listener
    labelsGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

                // replaces chosenXaxis with value
                chosenXAxis = value;

                // console.log(chosenXAxis)

                // functions here found above csv import
                // updates x scale for new data
                xLinearScale = xScale(weaponData, chosenXAxis);

                // updates x axis with transition
                xAxis = renderAxes(xLinearScale, xAxis);

                // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
                circlesLabels = renderCircleLabels(circlesGroup, xLinearScale, chosenXAxis);
                // updates tooltips with new info
                // circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                // changes classes to change bold text
                // if (chosenXAxis === "poverty") {
                //     povertyLabel
                //         .classed("active", true)
                //         .classed("inactive", false);
                //     insuranceLabel
                //         .classed("active", false)
                //         .classed("inactive", true);
                // }

            }
        });
});

