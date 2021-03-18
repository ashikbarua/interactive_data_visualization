
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

        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.sepal_length); } )
            .attr("cy", function (d) { return y(d.petal_length); } )
            .attr("r", 5)
            .style("fill", function (d) { return color(d.class) } )

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

        console.log(xScale1.domain())
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

        svg.selectAll("myViolin")
            .data(sumstat)
            .enter()
            .append("g")
            .attr("transform", function(d){ return("translate(" + x(d.key) +" ,0)") } )
            .append("path")
            .datum(function(d){ return(d.value)})
            .style("stroke", "none")
            .style("fill","#69b3a2")
            .attr("d", d3.area()
            .x0(function(d){ return(xNum(-d.length)) } )
            .x1(function(d){ return(xNum(d.length)) } )
            .y(function(d){ return(y(d.x0)) } )
            .curve(d3.curveCatmullRom)
        )
    })
}





