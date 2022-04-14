
function plot_barchart(svg_id, data){

    const margin = 50;
    const margin2 = 80;
    let chart = d3.select(svg_id);
    let chart_width  = $(svg_id).width();
    let chart_height = $(svg_id).height();

    var xScale = d3.scaleBand().range([0, chart_width-margin2]).padding(0.4),
        yScale = d3.scaleLinear().range([chart_height-margin2, 0]);

    var g = chart.append('g')
        .attr('transform', 'translate('+margin+', '+margin+')');

    data.then(data => {

        var sepal_length_total = {'Iris-setosa': 0.0, 'Iris-versicolor': 0.0, 'Iris-virginica':0.0};
        var sepal_width_total = {'Iris-setosa': 0.0, 'Iris-versicolor': 0.0, 'Iris-virginica':0.0};
        var petal_length_total = {'Iris-setosa': 0.0, 'Iris-versicolor': 0.0, 'Iris-virginica':0.0};
        var petal_width_total = {'Iris-setosa': 0.0, 'Iris-versicolor': 0.0, 'Iris-virginica':0.0};
        var classes = ['Iris-setosa', 'Iris-versicolor', 'Iris-virginica'];

        data.forEach(d => {
            sepal_length_total[d.class] += d.sepal_length;
            sepal_width_total[d.class] += d.sepal_width;
            petal_length_total[d.class] += d.petal_length;
            petal_width_total[d.class] += d.petal_width;
        })

        function get_total(classes, data){
            var _data = []
            for (var i=0; i<classes.length; i++){
                _data.push({
                    key_: classes[i],
                    value_: data[classes[i]]
                })
            }

            return _data;
        }

        sepal_length_data = get_total(classes, sepal_length_total)
        petal_length_data = get_total(classes, petal_length_total)
        sepal_width_data = get_total(classes, sepal_width_total)
        petal_width_data = get_total(classes, petal_width_total)

        xScale.domain(classes.map(function(d){return d;}));
        // yScale.domain([0, d3.max(sepal_length_total, function(d){return Object.values(d)})])
        yScale.domain([0, 500])

        var custom_height = chart_height-margin2;

        g.append('g')
            .attr('transform', 'translate( 0, '+custom_height+')')
            .call(d3.axisBottom(xScale));

        g.append('g')
            .call(d3.axisLeft(yScale));

        var color = d3.scaleOrdinal()
            .domain(["setosa", "versicolor", "virginica" ])
            .range([ "red", "green", "blue"])

        g.selectAll(".bar")
            .data(sepal_length_data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return xScale(d.key_); })
            .attr("y", function(d) { return yScale(d.value_); })
            .style("fill", function (d) { return color(d.key_) } )
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) { return custom_height - yScale(d.value_); });


    })

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

    var classes = ['Iris-setosa', 'Iris-versicolor', 'Iris-virginica'];

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
            .domain(["Iris-setosa", "Iris-versicolor", "Iris-virginica" ])
            .range([ "red", "green", "blue"])

        var legend = svg.selectAll('legend')
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

        var myCircle = svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.sepal_length); } )
            .attr("cy", function (d) { return y(d.petal_length); } )
            .attr("r", 5)
            .style("fill", function (d) { return color(d.class) } )
            .style('opacity', 0.5)

        svg
            .call( d3.brush()                 // Add the brush feature using the d3.brush function
              .extent( [ [0,0], [width,height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
              .on("start brush", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
            )

            // Function that is triggered when brushing is performed
        function updateChart() {
            extent = d3.event.selection
            myCircle.classed("selected", function(d){ return isBrushed(extent, x(d.sepal_length), y(d.petal_length) ) } )
                .style('opacity', function(d){ return isBrushed(extent, x(d.sepal_length), y(d.petal_length) ) })
        }

        // A function that return TRUE or FALSE according if a dot is in the selection or not
        function isBrushed(brush_coords, cx, cy) {
           var x0 = brush_coords[0][0],
               x1 = brush_coords[1][0],
               y0 = brush_coords[0][1],
               y1 = brush_coords[1][1];
          return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // This return TRUE or FALSE depending on if the points is in the selected area
        }

    })
}

function plot_multibar(svg_id, data){

    var container = d3.select(svg_id),
        width = $(svg_id).width(),
        height = $(svg_id).height(),
        margin = {top: 30, right: 20, bottom: 30, left: 50},
        barPadding = .5,
        axisTicks = {qty: 5, outerSize: 0, dateFormat: '%m-%d'};

    var svg = container
       .append("svg")
       .attr("width", width)
       .attr("height", height)
       .append("g")
       .attr("transform", `translate(${margin.left},${margin.top})`);

    var xScale0 = d3.scaleBand().range([0, width - margin.left - margin.right]).padding(barPadding);
    var xScale1 = d3.scaleBand();
    var yScale = d3.scaleLinear().range([height - margin.top - margin.bottom, 0]);

    var xAxis = d3.axisBottom(xScale0).tickSizeOuter(axisTicks.outerSize);
    var yAxis = d3.axisLeft(yScale).ticks(axisTicks.qty).tickSizeOuter(axisTicks.outerSize);

    data.then(data => {

        var sepal_length_total = {'Iris-setosa': 0.0, 'Iris-versicolor': 0.0, 'Iris-virginica': 0.0};
        var sepal_width_total = {'Iris-setosa': 0.0, 'Iris-versicolor': 0.0, 'Iris-virginica': 0.0};
        var petal_length_total = {'Iris-setosa': 0.0, 'Iris-versicolor': 0.0, 'Iris-virginica': 0.0};
        var petal_width_total = {'Iris-setosa': 0.0, 'Iris-versicolor': 0.0, 'Iris-virginica': 0.0};
        var classes = ['Iris-setosa', 'Iris-versicolor', 'Iris-virginica'];

        data.forEach(d => {
            sepal_length_total[d.class] += d.sepal_length;
            sepal_width_total[d.class] += d.sepal_width;
            petal_length_total[d.class] += d.petal_length;
            petal_width_total[d.class] += d.petal_width;
        })

        var _data = []
        for (var i = 0; i < classes.length; i++) {
            _data.push({
                class_name: classes[i],
                sepal_length: sepal_length_total[classes[i]],
                petal_length: petal_length_total[classes[i]],
                sepal_width: sepal_width_total[classes[i]],
                petal_width: petal_width_total[classes[i]]
            })
        }

        xScale0.domain(_data.map(d => d.class_name));
        xScale1.domain(['sepal_length', 'petal_length', 'sepal_width', 'petal_width']).range([0, xScale0.bandwidth()]);
        // yScale.domain([0, d3.max(_data, d => d.sepal_length > d.petal_length ? d.sepal_length : d.petal_length)]);
        yScale.domain([0, 400])

        var color = d3.scaleOrdinal()
            .domain(['sepal_length', 'petal_length', 'sepal_width', 'petal_width'])
            .range([ "#E0325A", "#0439f8", "#e5a7b8", "#8399EA"])
        
        var class_name = svg.selectAll(".class_name")
            .data(_data)
            .enter().append("g")
            .attr("class", "class_name")
            .attr("transform", d => `translate(${xScale0(d.class_name)},0)`);

        class_name.selectAll(".bar.sepal_length")
            .data(d => [d])
            .enter()
            .append("rect")
            .transition()
            .duration(800)
            .attr("class", "bar sepal_length")
            .style("fill", "#e0325a")
            .attr("x", d => xScale1('sepal_length'))
            .attr("y", d => yScale(d.sepal_length))
            .attr("width", xScale1.bandwidth())
            .attr("height", d => {
                return height - margin.top - margin.bottom - yScale(d.sepal_length)
            });

        class_name.selectAll(".bar.petal_length")
            .data(d => [d])
            .enter()
            .append("rect")
            .transition()
            .duration(800)
            .attr("class", "bar petal_length")
            .style("fill", "#0439f8")
            .attr("x", d => xScale1('petal_length'))
            .attr("y", d => yScale(d.petal_length))
            .attr("width", xScale1.bandwidth())
            .attr("height", d => {
                return height - margin.top - margin.bottom - yScale(d.petal_length)
            });

        class_name.selectAll(".bar.sepal_width")
            .data(d => [d])
            .enter()
            .append("rect")
            .transition()
            .duration(800)
            .attr("class", "bar sepal_width")
            .style("fill", "#E5A7B8")
            .attr("x", d => xScale1('sepal_width'))
            .attr("y", d => yScale(d.sepal_width))
            .attr("width", xScale1.bandwidth())
            .attr("height", d => {
                return height - margin.top - margin.bottom - yScale(d.sepal_width)
            });

        class_name.selectAll(".bar.petal_width")
            .data(d => [d])
            .enter()
            .append("rect")
            .transition()
            .duration(800)
            .attr("class", "bar petal_width")
            .style("fill", "#8399ea")
            .attr("x", d => xScale1('petal_width'))
            .attr("y", d => yScale(d.petal_width))
            .attr("width", xScale1.bandwidth())
            .attr("height", d => {
                return height - margin.top - margin.bottom - yScale(d.petal_width)
            });

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);



        var legend = svg.selectAll('legend')
			.data(xScale1.domain())
			.enter().append('g')
			.attr('class', 'legend')
			.attr('transform', function(d,i){ return 'translate('+ -80 +',' + i * 20 + ')'; });

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

function plot_violinplot(svg_id, data){

    var margin = {top: 10, right: 30, bottom: 30, left: 40},
        width = $(svg_id).width() - margin.left - margin.right,
        height = $(svg_id).height() - margin.top - margin.bottom;

    var svg = d3.select(svg_id)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    var columns = ['sepal_length', 'petal_length', 'sepal_width', 'petal_width']

    d3.select("#selectColumn")
        .selectAll('selectColumn')
        .data(columns)
        .enter()
        .append('option')
        .text(function (d) { return d; })
        .attr("value", function (d) { return d; })

    data.then(data => {

        var y = d3.scaleLinear()
            .domain([ 2,10 ])
            .range([height, 0])
            svg.append("g").call( d3.axisLeft(y) )

        var x = d3.scaleBand()
            .range([ 0, width ])
            .domain(["Iris-setosa", "Iris-versicolor", "Iris-virginica"])
            .padding(0.05)

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))

        var histogram = d3.histogram()
            .domain(y.domain())
            .thresholds(y.ticks(20))
            .value(d => d)

        var sumstat = d3.nest()
            .key(function(d) { return d.class;})
            .rollup(function(d) {
            input = d.map(function(g) { return g.sepal_length;})
            bins = histogram(input)
            return(bins)
            })
            .entries(data)

        var maxNum = 0
        for ( i in sumstat ){
            allBins = sumstat[i].value
            lengths = allBins.map(function(a){return a.length;})
            longuest = d3.max(lengths)
            if (longuest > maxNum) { maxNum = longuest }
        }

        var xNum = d3.scaleLinear()
            .range([0, x.bandwidth()])
            .domain([-maxNum,maxNum])
        sumstat = sumstat.splice(0,3)
        console.log(sumstat);
        myViolin = svg.selectAll("myViolin")
            .data(sumstat)
            .enter()
            .append("g")
            .attr("transform", function(d){ return("translate(" + x(d.key) +" ,0)") } )
            .append("path")
            .datum(function(d){ return(d.value)})
            .style("stroke", "none")
            .style("fill","#89d447")
            .attr("d", d3.area()
            .x0(function(d){ return(xNum(-d.length)) } )
            .x1(function(d){ return(xNum(d.length)) } )
            .y(function(d){ return(y(d.x0)) } )
            .curve(d3.curveCatmullRom)
        )

        function update(selectedOption) {

            console.log(selectedOption)


            var sumstat2 = d3.nest()
                .key(function(d) { return d.class;})
                .rollup(function(d) {
                input = d.map(function(g) { return g[selectedOption];})
                bins = histogram(input)
                return(bins)
                })
                .entries(data)

            var maxNum2 = 0
            for ( i in sumstat2 ){
                allBins = sumstat2[i].value
                lengths = allBins.map(function(a){return a.length;})
                longuest = d3.max(lengths)
                if (longuest > maxNum2) { maxNum2 = longuest }
            }

            var xNum2 = d3.scaleLinear()
                .range([0, x.bandwidth()])
                .domain([-maxNum2,maxNum2])

            sumstat2 = sumstat2.splice(0,3)
            console.log(sumstat2);

            myViolin
                .data(sumstat2)
                .transition()
                .duration(1000)
                .attr("transform", function(d){ return("translate(" + x(d.key) +" ,0)") } )
                .attr("d", d3.area()
                .x0(function(d){ return(xNum2(-d.length)) } )
                .x1(function(d){ return(xNum2(d.length)) } )
                .y(function(d){ return(y(d.x0)) } )
                .curve(d3.curveCatmullRom)
            )
            myViolin.exit().remove();
        }

        d3.selectAll("#selectColumn").on("change", function(d) {
            var selectedOption = d3.select("#selectColumn").property("value")
            console.log(selectedOption)
            update(selectedOption)
        })
    })
}





function plot_parallel_coor(svg_id, data){
        // set the dimensions and margins of the graph
    var margin = {top: 30, right: 50, bottom: 10, left: 50},
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

    // Parse the Data
    data.then(data=> {

      // Color scale: give me a specie name, I return a color
      var color = d3.scaleOrdinal()
        .domain(["Iris-setosa", "Iris-versicolor", "Iris-virginica" ])
        .range([ "#440154ff", "#21908dff", "#fde725ff"])

      // Here I set the list of dimension manually to control the order of axis:
      dimensions = ["petal_length", "petal_width", "sepal_length", "sepal_width"]

      // For each dimension, I build a linear scale. I store all in a y object
      var y = {}
      for (i in dimensions) {
        name = dimensions[i]
        y[name] = d3.scaleLinear()
          .domain( [0,8] ) // --> Same axis range for each group
          // --> different axis range for each group --> .domain( [d3.extent(data, function(d) { return +d[name]; })] )
          .range([height, 0])
      }

      // Build the X scale -> it find the best position for each Y axis
      x = d3.scalePoint()
        .range([0, width])
        .domain(dimensions);

      // Highlight the specie that is hovered
      var highlight = function(d){

        selected_specie = d.class

        // first every group turns grey
        d3.selectAll(".line")
          .transition().duration(200)
          .style("stroke", "lightgrey")
          .style("opacity", "0.2")
        // Second the hovered specie takes its color
        d3.selectAll("." + selected_specie)
          .transition().duration(200)
          .style("stroke", color(selected_specie))
          .style("opacity", "1")
      }

      // Unhighlight
      var doNotHighlight = function(d){
        d3.selectAll(".line")
          .transition().duration(200).delay(1000)
          .style("stroke", function(d){ return( color(d.class))} )
          .style("opacity", "1")
      }

      // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
      function path(d) {
          return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
      }

      // Draw the lines
      svg
        .selectAll("myPath")
        .data(data)
        .enter()
        .append("path")
          .attr("class", function (d) { return "line " + d.class } ) // 2 class for each line: 'line' and the group name
          .attr("d",  path)
          .style("fill", "none" )
          .style("stroke", function(d){ return( color(d.class))} )
          .style("opacity", 0.5)
          .on("mouseover", highlight)
          .on("mouseleave", doNotHighlight )

      // Draw the axis:
      svg.selectAll("myAxis")
        // For each dimension of the dataset I add a 'g' element:
        .data(dimensions).enter()
        .append("g")
        .attr("class", "axis")
        // I translate this element to its right position on the x axis
        .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
        // And I build the axis with the call function
        .each(function(d) { d3.select(this).call(d3.axisLeft().ticks(5).scale(y[d])); })
        // Add axis title
        .append("text")
          .style("text-anchor", "middle")
          .attr("y", -9)
          .text(function(d) { return d; })
          .style("fill", "black")

    })
}


function plot_scatterplot_2(svg_id, data){

    var margin = {top: 10, right: 30, bottom: 60, left: 60},
        width = $(svg_id).width() - margin.left - margin.right,
        height = $(svg_id).height() - margin.top - margin.bottom;

    var svg = d3.select(svg_id)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var classes = ['Iris-setosa', 'Iris-versicolor', 'Iris-virginica'];
    var columns = ['sepal_length', 'petal_length', 'sepal_width', 'petal_width']

    d3.select("#selectButtonX")
        .selectAll('myOptions')
        .data(columns)
        .enter()
        .append('option')
        .text(function (d) { return d; })
        .attr("value", function (d) { return d; })

    d3.select("#selectButtonY")
        .selectAll('myOptions')
        .data(columns)
        .enter()
        .append('option')
        .text(function (d) { return d; })
        .attr("value", function (d) { return d; })

    document.getElementById("selectButtonX").value = "sepal_length";
    document.getElementById("selectButtonY").value = "petal_length";

    data.then(data =>{

        var x = d3.scaleLinear()
            .domain([0, 8])
            .range([ 0, width ]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        var y = d3.scaleLinear()
            .domain([0, 9])
            .range([ height, 0]);

        svg.append("g")
            .call(d3.axisLeft(y));

        var xLabel = svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height + margin.top + 20)
            .text("Sepal length");

        var yLabel = svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", - margin.left + 20)
            .attr("x", -margin.top)
            .text("Petal length")

        var color = d3.scaleOrdinal()
            .domain(["Iris-setosa", "Iris-versicolor", "Iris-virginica" ])
            .range([ "red", "green", "blue"])

        var label = d3.scaleOrdinal()
            .domain(columns)
            .range(['Sepal length', 'Petal length', 'Sepal width', 'Petal width'])

        var legend = svg.selectAll('legend')
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

        var myCircle = svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.sepal_length); } )
            .attr("cy", function (d) { return y(d.petal_length); } )
            .attr("r", 5)
            .style("fill", function (d) { return color(d.class) } )
            .style('opacity', 0.8)


        function update(selectedGroupX,selectedGroupY) {

            var dataFilter = data.map(function(d){return {x: d[selectedGroupX], y:d[selectedGroupY]} })

            myCircle
                .data(dataFilter)
                .transition()
                .duration(1000)
                .attr("cx", function(d) { return x(+d.x) })
                .attr("cy", function(d) { return y(+d.y) })

            xLabel.text(function(d){return label(selectedGroupX)})
            yLabel.text(function(d){return label(selectedGroupY)})
        }

        d3.selectAll(".selectButton").on("change", function(d) {
            var selectedOptionX = d3.select("#selectButtonX").property("value")
            var selectedOptionY = d3.select("#selectButtonY").property("value")
            update(selectedOptionX, selectedOptionY)
        })


    })
}

function plot_densityplot(svg_id, data){

    var margin = {top: 10, right: 30, bottom: 60, left: 60},
        width = $(svg_id).width() - margin.left - margin.right,
        height = $(svg_id).height() - margin.top - margin.bottom;

    var svg = d3.select(svg_id)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var classes = ['Iris-setosa', 'Iris-versicolor', 'Iris-virginica'];
    var columns = ['sepal_length', 'petal_length', 'sepal_width', 'petal_width']

    d3.select("#selectClass")
        .selectAll('myOptions')
        .data(classes)
        .enter()
        .append('option')
        .text(function (d) { return d; })
        .attr("value", function (d) { return d; })

    d3.select("#selectAttr")
        .selectAll('myOptions')
        .data(columns)
        .enter()
        .append('option')
        .text(function (d) { return d; })
        .attr("value", function (d) { return d; })

    var color = d3.scaleOrdinal()
            .domain(classes)
            .range([ "#E0325A", "#0439f8", "#69b3a2"])

    data.then(data => {

          // add the x Axis
          var x = d3.scaleLinear()
            .domain([0, 12])
            .range([0, width]);
          svg.append("g")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x));

          // add the y Axis
          var y = d3.scaleLinear()
                    .range([height, 0])
                    .domain([0, 0.4]);
          svg.append("g")
              .call(d3.axisLeft(y));

          // Compute kernel density estimation for the first group called Setosa
          var kde = kernelDensityEstimator(kernelEpanechnikov(3), x.ticks(140))
          var density =  kde( data
            .filter(function(d){ return d.class == "Iris-setosa"})
            .map(function(d){  return +d.sepal_length; })
          )

          // Plot the area
          var curve = svg
            .append('g')
            .append("path")
              .attr("class", "mypath")
              .datum(density)
              .attr("fill", "#E0325A")
              .attr("opacity", ".8")
              .attr("stroke", "#000")
              .attr("stroke-width", 1)
              .attr("stroke-linejoin", "round")
              .attr("d",  d3.line()
                .curve(d3.curveBasis)
                  .x(function(d) { return x(d[0]); })
                  .y(function(d) { return y(d[1]); })
              );

          // A function that update the chart when slider is moved?
          function updateChart(selectedClass, selectedAttr) {
            // recompute density estimation
            kde = kernelDensityEstimator(kernelEpanechnikov(3), x.ticks(40))
            var density =  kde( data
              .filter(function(d){ return d.class == selectedClass})
              .map(function(d){  return +d[selectedAttr] })
            )

            // update the chart
            curve
              .datum(density)
              .transition()
              .duration(1000)
                .attr('fill', function(d){return color(selectedClass)})
              .attr("d",  d3.line()
                .curve(d3.curveBasis)
                  .x(function(d) { return x(d[0]); })
                  .y(function(d) { return y(d[1]); })

              );
          }

          // Listen to the slider?
          d3.selectAll(".selectColumn").on("change", function(d){
            var selectedClass = d3.select("#selectClass").property("value")
            var selectedAttr = d3.select("#selectAttr").property("value")
              console.log(selectedClass, selectedAttr);
            updateChart(selectedClass, selectedAttr)
          })

        });


        // Function to compute density
        function kernelDensityEstimator(kernel, X) {
          return function(V) {
            return X.map(function(x) {
              return [x, d3.mean(V, function(v) { return kernel(x - v); })];
            });
          };
        }
        function kernelEpanechnikov(k) {
          return function(v) {
            return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
          };
        }


}
