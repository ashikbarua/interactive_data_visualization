function plot_histogram(data, col_name){

    var svg_id = '#vis_1';
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 40},
        width = $(svg_id).width() - margin.left - margin.right,
        height = $(svg_id).height() - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select(svg_id)
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                      "translate(" + margin.left + "," + margin.top + ")");

    // X axis: scale and draw:
    var x = d3.scaleLinear().range([0, width]);
    var xAxis = svg.append("g")
            .attr("transform", "translate(0," + height + ")");
    var y = d3.scaleLinear().range([height, 0]);
    var yAxis = svg.append("g")
        .attr("class", "myYaxis");

    function update(data, col_name) {

        data.then(data => {

            x.domain([0, d3.max(data, function (d) {
                return +d[col_name];
            })])

            xAxis.transition().duration(1000)
                .call(d3.axisBottom(x));

            // set the parameters for the histogram
            var histogram = d3.histogram()
                .value(function (d) {
                    return d[col_name];
                })   // I need to give the vector of value
                .domain(x.domain())  // then the domain of the graphic
                .thresholds(x.ticks(70)); // then the numbers of bins

            // And apply this function to data to get the bins
            var bins = histogram(data);

            console.log(bins);
            // Y axis: scale and draw:

            y.domain([0, d3.max(bins, function (d) {
                return d.length;
            })]);   // d3.hist has to be called before the Y axis obviously

            yAxis.transition().duration(1000)
                .call(d3.axisLeft(y));

            // // append the bar rectangles to the svg element
            // svg.selectAll("rect")
            //     .data(bins)
            //     .enter()
            //     .append("rect")
            //     .attr("x", 1)
            //     .attr("transform", function (d) {
            //         return "translate(" + x(d.x0) + "," + y(d.length) + ")";
            //     })
            //     .attr("width", function (d) {
            //         return x(d.x1) - x(d.x0) - 1;
            //     })
            //     .attr("height", function (d) {
            //         return height - y(d.length);
            //     })
            //     .style("fill", "#69b3a2")

            // Create the u variable
            var u = svg.selectAll("rect")
                        .data(bins)

            u
                .enter()
                .append("rect") // Add a new rect for each new elements
                .merge(u) // get the already existing elements as well
                .transition() // and apply changes to all of them
                .duration(1000)
                .attr('id', '_each')
                .attr("transform", function (d) {
                    return "translate(" + x(d.x0) + "," + y(d.length) + ")";
                })
                .attr("width", function (d) {
                    return x(d.x1) - x(d.x0) ;
                })
                .attr("height", function (d) {
                    return height - y(d.length);
                })
                .style("fill", "#69b3a2")
                // .attr("x", function(d) { return x(d.group); })
                // .attr("y", function(d) { return y(d.value); })
                // .attr("width", x.bandwidth())
                // .attr("height", function(d) { return height - y(d.value); })
                // .attr("fill", "#69b3a2")

            // If less group in the new dataset, I delete the ones not in use anymore
            u.exit();
            u.remove();


        });
    }
    update(data, col_name);

}

function plot_scatterplot(svg_id, data){
    var margin = {top: 10, right: 30, bottom: 60, left: 60},
        width = $(svg_id).width() - margin.left - margin.right,
        height = $(svg_id).height() - margin.top - margin.bottom;

    var svg = d3.select(svg_id)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var classes = ['satm', 'satv', 'act', 'gpa'];

    console.log(data);

    data.then(data =>{

        var x = d3.scaleLinear()
            .domain([4, 8])
            .range([ 0, width ]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        var y = d3.scaleLinear()
            .domain([0, 9])
            .range([ height, 0]);

        svg.append("g")
            .call(d3.axisLeft(y));

        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height + margin.top + 20)
            .text("Sepal length");

        svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", - margin.left + 20)
            .attr("x", -margin.top)
            .text("Petal length")

        var color = d3.scaleOrdinal()
            .domain(['satm', 'satv', 'act', 'gpa'])
            .range([ "red", "green", "blue", "yellow"])


        console.log(data);
        var myCircle = svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.satm); } )
            .attr("cy", function (d) { return y(d.satv); } )
            .attr("r", 5)
            .style("fill", function (d) { return color('red') } )
            .style('opacity', 1)


        var legend = myCircle.selectAll('legend')
			.data(classes)
			.enter().append('g')
			.attr('class', 'legend')
			.attr('transform', function(d,i){ return 'translate(0,' + i * 20 + ')'; });

		legend.append('rect')
			.attr('x', width)
			.attr('width', 18)
			.attr('height', 18)
			.style('fill', color);

		legend.append('text')
			.attr('x', width - 6)
			.attr('y', 9)
			.attr('dy', '.35em')
			.style('text-anchor', 'end')
			.text(function(d){ return d; });


    })
}