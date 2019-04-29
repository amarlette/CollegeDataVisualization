// Your browser will call the onload() function when the document
// has finished loading. In this case, onload() points to the
// start() method we defined below. Because of something called
// function hoisting, the start() method is callable on line 6
// even though it is defined on line 8.
window.onload = start;

// This is where all of our javascript code resides. This method
// is called by "window" when the document (everything you see on
// the screen) has finished loading.
function start() {
    // Select the graph from the HTML page and save
    // a reference to it for later.
    var graph1 = document.getElementById('graph1');


    // Specify the width and height of our graph
    // as variables so we can use them later.
    // Remember, hardcoding sucks! :)
    var width = 700;
    var height = 600;
    var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

    // Here we tell D3 to select the graph that we defined above.
    // Then, we add an <svg></svg> tag inside the graph.
    // On the <svg> element, we set the width and height.
    // Then, we save the reference to this element in the "svg" variable,
    // so we can use it later.
    // 
    // So our code now looks like this in the browser:
    // <svg width="700" height="600">
    // </svg>
    var svg1 = d3.select(graph1)
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    var svg2 = d3.select(graph1)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    

    // Remember, "svg" now references to <svg width="700" height="600"></svg>
    // So now we append a group <g></g> tag to our svg element, and return a
    // reference to that and save it in the "bars" variable.
    // 
    // Now bars looks like this:
    // <g></g>
    // 
    // And the svg element in our browser looks like this:
    // <svg width="700" height="600">
    //  <g></g>
    // </svg>
    var bars = svg1.append('g');
    var bars2 = svg1.append('g');
    var bars3 = svg2.append('g');
    var bars4 = svg2.append('g');

    // Our bar chart is going to encode the Name AverageCost as bar width.
    // This means that the length of the x axis depends on the length of the bars.
    // The y axis should contain A-Z in the alphabet (ordinal data).
    var xScale = d3.scaleLinear().range([0, width]);
    var yScale = d3.scaleBand().rangeRound([30, height], 0.3);
    var xScale2 = d3.scaleLinear().range([0, width]);
    var yScale2 = d3.scaleBand().rangeRound([30, height], 0.3);
    // Tell D3 to create a y-axis scale for us, and orient it to the left.
    // That means the labels are on the left, and tick marks on the right.
    var yAxis = d3.axisLeft(yScale);
    var yAxis2 = d3.axisLeft(yScale2);

    var tooltip = d3.select("body").append("div").attr("class", "toolTip");

    svg1.append("text")
    .attr("x", width / 2 )
    .attr("y", 15)
    .style("text-anchor", "middle")
    .text("Attendence Cost vs Expendature Per Student");
    
    svg2.append("text")
    .attr("x", width / 2 )
    .attr("y", 15)
    .style("text-anchor", "middle")
    .text("Salary After 8 Years vs Debt Upon Graduation");

    
    // var xAxis = d3.axisBottom().scale(xScale);

    // D3 will grab all the data from "data.csv" and make it available
    // to us in a callback function. It follows the form:
    // 
    // d3.csv('file_name.csv', accumulator, callback)
    // 
    // Where 'file_name.csv' - the name of the file to read
    // accumulator - a method with parameter d that lets you pre-process
    //               each row in the CSV. This affects the array of
    //               rows in the function named 'callback'
    //
    // callback - a method with parameters error, data. Error contains
    //            an error message if the data could not be found, or
    //            was malformed. The 'data' parameter is an array of
    //            rows returned after being processed by the accumulator.

    d3.csv('Top30Colleges.csv', function(d) {
        d.AverageCost = +d.AverageCost;
        d.ExpenditurePerStudent = +d.ExpenditurePerStudent;
        d.MedianDebtOnGraduation = +d.MedianDebtOnGraduation;
        d.MedianEarnings8YearsAfterEntry = +d.MedianEarnings8YearsAfterEntry;
        return d;
    }, function(error, data) {
        // We now have the "massaged" CSV data in the 'data' variable.
        var Tooltip = d3.select("#div_template")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px");
        // We set the domain of the xScale. The domain includes 0 up to
        // the maximum AverageCost in the dataset. This is because 
        xScale.domain([0, d3.max(data, function(d) {
            return d.AverageCost;
        })]);

        xScale2.domain([0, d3.max(data, function(d) {
            return d.MedianEarnings8YearsAfterEntry;
        })]);

        // We set the domain of the yScale. The scale is ordinal, and
        // contains every Name in the alphabet (the Name attribute
        // in our data array). We can use the map function to iterate
        // through each value in our data array, and make a new array
        // that contains just Names.
        yScale.domain(data.map(function(d) {
            return d.Name;
        }));

        yScale2.domain(data.map(function(d) {
            return d.Name;
        }));

        // Append the y-axis to the graph. the translate(20, 0) stuff
        // shifts the axis 20 pixels from the left. This just helps us
        // position stuff to where we want it to be.
        svg1.append('g')
            .attr('class', 'yaxis')
            .attr('transform', 'translate(225, 0)')
            // Call is a special method that lets us invoke a function
            // (called 'yAxis' in this case) which creates the actual
            // yAxis using D3.
            .call(yAxis);

        svg2.append('g')
            .attr('class', 'yaxis')
            .attr('transform', 'translate(225, 0)')
            // Call is a special method that lets us invoke a function
            // (called 'yAxis' in this case) which creates the actual
            // yAxis using D3.
            .call(yAxis2);

        // Create the bars in the graph. First, select all '.bars' that
        // currently exist, then load the data into them. enter() selects
        // all the pieces of data and lets us operate on them.

        bars.append('g')
            .selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', 250)
            .attr('y', function(d) {
                return yScale(d.Name);
            })
            .attr('width', function(d) {
                // xScale will map any number and return a number
                // within the output range we specified earlier.
                return xScale(d.AverageCost)/2;
            })
            .attr('height', function(d) {
                // Remember how we set the yScale to be an ordinal scale
                // with bands from 0 to height? And then we set the domain 
                // to contain all the Names in the alphabet? 
                return yScale.bandwidth()*.8;
            });
            
           

        bars2.append('g')
            .selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar2')
            .attr('x', 250)
            .attr('y', function(d) {
                return yScale(d.Name);
            })
            .attr('width', function(d) {
                // xScale will map any number and return a number
                // within the output range we specified earlier.
                return xScale(d.ExpenditurePerStudent)/2;
            })
            .attr('height', function(d) {
                // Remember how we set the yScale to be an ordinal scale
                // with bands from 0 to height? And then we set the domain 
                // to contain all the Names in the alphabet? 
                return yScale.bandwidth()*.8;
            });

        bars3.append('g')
            .selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', 250)
            .attr('y', function(d) {
                return yScale2(d.Name);
            })
            .attr('width', function(d) {
                // xScale will map any number and return a number
                // within the output range we specified earlier.
                return xScale2(d.MedianEarnings8YearsAfterEntry)/2;
            })
            .attr('height', function(d) {
                // Remember how we set the yScale to be an ordinal scale
                // with bands from 0 to height? And then we set the domain 
                // to contain all the Names in the alphabet? 
                return yScale2.bandwidth()*.8;
            });
            
           

        bars4.append('g')
            .selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar2')
            .attr('x', 250)
            .attr('y', function(d) {
                return yScale2(d.Name);
            })
            .attr('width', function(d) {
                // xScale will map any number and return a number
                // within the output range we specified earlier.
                return xScale2(d.MedianDebtOnGraduation)/2;
            })
            .attr('height', function(d) {
                // Remember how we set the yScale to be an ordinal scale
                // with bands from 0 to height? And then we set the domain 
                // to contain all the Names in the alphabet? 
                return yScale2.bandwidth()*.8;
            });

            var toggleColor = (function(d){
                d3.select(this).style("fill", "red");
                var num = (d.ExpenditurePerStudent/d.AverageCost)*100;
                var n = num.toFixed(2);
                tooltip
                    .style("left", d3.event.pageX - 50 + "px")
                    .style("top", d3.event.pageY - 70 + "px")
                    .style("display", "inline-block")
                    .html((d.Name) + "<br>" + "Percentage of Tuition Spent on Students: " + n +"%");
                 
            });
            var toggleColor2 = (function(d){
                d3.select(this).style("fill", "steelblue");
                tooltip.style("display", "none");
           });
           var toggleColor3 = (function(d){
            d3.select(this).style("fill", "red");
            var num = (d.MedianDebtOnGraduation/d.MedianEarnings8YearsAfterEntry);
            var n = num.toFixed(2);
            tooltip
                .style("left", d3.event.pageX - 50 + "px")
                .style("top", d3.event.pageY - 70 + "px")
                .style("display", "inline-block")
                .html((d.Name) + "<br>" + "Debt to Earnings Ratio: " + n);
             
        });

           var changewords = (function(d){
            console.log("I have been clicked");
            document.getElementById("name1").innerHTML = d.Name;
            document.getElementById("cost").innerHTML = "$" + d.AverageCost;
            document.getElementById("expend").innerHTML = "$" + d.ExpenditurePerStudent;
            document.getElementById("debt").innerHTML = "$" + d.MedianDebtOnGraduation;
            document.getElementById("earnings").innerHTML = "$" + d.MedianEarnings8YearsAfterEntry;
           })
        
            bars.selectAll(".bar")
            .on("mouseenter",toggleColor)
            .on("mouseleave", toggleColor2)
            .on("click",changewords);

            bars3.selectAll(".bar")
            .on("mouseenter",toggleColor3)
            .on("mouseleave", toggleColor2)
            .on("click",changewords);

            d3.selectAll("text").style("fill","white");
    });

}