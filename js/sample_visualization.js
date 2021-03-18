
function load_sample_visualization(svg_name,data,y_field){

    // General Variables
    let chart = d3.select(svg_name);
    let chart_width  = $(svg_name).width();
    let chart_height = $(svg_name).height();

    // x position scale
	let x = d3.scaleLinear()
    		  .domain([0,data.length-1])
		      .range([10,chart_width-10]);

	// y position scale
	let y = d3.scaleLinear()
			.domain(d3.extent(data,function(d){ return d[y_field]; }))
			.range([chart_height-10,10]);

	// generate points
	let points = chart.selectAll("circle")
					.data(data).enter()
						.append("circle")
							.attr("fill-opacity",0.85)
							.attr("r",5)
							.attr("stroke-width","0px")
							.attr("cx",function(d,i){ return x(i); })
							.attr("cy",function(d){ return y(d[y_field]); })

	// return chart data that can be used later
	return {
		chart : chart,
		chart_width : chart_width,
		chart_height : chart_height,
		x_scale : x,
		y_scale : y,
		points : points
	}
}

function load_test_function(svg_name, data){
	// General Variables
    // let chart = d3.select(svg_name);
    // let chart_width  = $(svg_name).width();
    // let chart_height = $(svg_name).height();
    // var bar_height = 20;
    // var margin = 1;
	//
    // // x position scale
	// let x = d3.scaleLinear()
    // 		  .domain([0,data.length-1])
	// 	      .range([10,chart_width-10]);
	//
	// // y position scale
	// let y = d3.scaleLinear()
	// 		.domain(d3.extent(data,function(d){ return d[y_field]; }))
	// 		.range([chart_height-10,10]);
	//
	// let bars = chart.selectAll("rect")
	// 				.data(data).enter()
	// 					.append("rect")
	// 						.attr("width",function(d,i){ return x(i); })
	// 						.attr("height",function(d){ return x(d[y_field]); })
	//
	// var g = chart.selectAll("g")
    //               .data(data)
    //               .enter()
    //               .append("g")
    //               .attr("transform", function (d, i) {
    //                   return "translate(0," + i * barHeight + ")";
    //               });
	//
    // g.append("rect")
    //    .attr("width", function (d) {
    //        return scale(d);
    //    })
    //    .attr("height", barHeight - margin)
	//
	// return {
	// 	chart : chart,
	// 	chart_width : chart_width,
	// 	chart_height : chart_height,
	// 	x_scale : x,
	// 	y_scale : y,
	// 	bars : bars,
	// }


    var width = 500,
        barHeight = 20,
        margin = 1;

	let chart = d3.select(svg_name);

    var scale = d3.scaleLinear()
                 .domain([d3.min(data), d3.max(data)])
                 .range([50, 500]);

    var g = chart.selectAll("g")
                  .data(data)
                  .enter()
                  .append("g")
                  .attr("transform", function (d, i) {
                      return "translate(0," + i * barHeight + ")";
                  });

    g.append("rect")
       .attr("width", function (d) {
           return scale(d);
       })
       .attr("height", barHeight - margin)

    g.append("text")
       .attr("x", function (d) { return (scale(d)); })
       .attr("y", barHeight / 2)
       .attr("dy", ".35em")
       .text(function (d) { return d; });
}


function load_sample_visualization2(svg_name,data,x_field, y_field){

    // General Variables
    let chart = d3.select(svg_name);
    let chart_width  = $(svg_name).width();
    let chart_height = $(svg_name).height();

    // x position scale
	let x = d3.scaleLinear()
    		  .domain(d3.extent(data,function(d){ return d[x_field]; }))
		      .range([10,chart_width-10]);

	// y position scale
	let y = d3.scaleLinear()
			.domain(d3.extent(data,function(d){ return d[y_field]; }))
			.range([chart_height-10,10]);

	var color = d3.scaleOrdinal()
            .domain(["Iris-setosa", "Iris-versicolor", "Iris-virginica" ])
            .range([ "#F8766D", "#00BA38", "#619CFF"])

	// generate points
	let points = chart.selectAll("circle")
					.data(data).enter()
						.append("circle")
							.attr("fill-opacity",0.85)
							.attr("r",5)
							.attr("stroke-width","0px")
							.attr("cx",function(d,i){ return x(d[x_field]); })
							.attr("cy",function(d){ return y(d[y_field]); })
							.style("fill", function (d) { return color(d["class_name"])})

}

function load_scatterplot(svg_name,data,x_field, y_field){

    // General Variables
    let chart = d3.select(svg_name);
    let chart_width  = $(svg_name).width();
    let chart_height = $(svg_name).height();

    var margin = {top: 10, right: 30, bottom: 40, left: 50},
    width = 520 - margin.left - margin.right,
    height = 520 - margin.top - margin.bottom;

    // x position scale
	let x = d3.scaleLinear()
    		  .domain([0,data.length-1])
		      .range([10,chart_width-10]);

	// y position scale
	let y = d3.scaleLinear()
			.domain(d3.extent(data,function(d){ return d[y_field]; }))
			.range([chart_height-10,10]);


	svg.append("g")
	.attr("transform", "translate(0," + height + ")")
	.call(d3.axisBottom(x).tickSize(-height*1.3).ticks(10))
	.select(".domain").remove()

	svg.append("g")
	.call(d3.axisLeft(y).tickSize(-width*1.3).ticks(7))
	.select(".domain").remove()


	var color = d3.scaleOrdinal()
            .domain(["Iris-setosa", "Iris-versicolor", "Iris-virginica" ])
            .range([ "#F8766D", "#00BA38", "#619CFF"])

	chart.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
          .attr("cx", function (d) { return x(d[x_field]); } )
          .attr("cy", function (d) { return y(d[y_field]); } )
          .attr("r", 5)
          .style("fill", function (d) { return color(d.class_name) } )

}

d3.select("body")
	.selectAll("p")
	.style("color", "red");


function barplot_titanic(svg_name, data){

	var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

	// append the svg object to the body of the page
	var svg = d3.select(svg_name)
	  .append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform",
			  "translate(" + margin.left + "," + margin.top + ")");

	// Parse the Data


	// X axis
	var x = d3.scaleBand()
	  .range([ 0, data.length-1 ])
	  .domain(data.map(function(d) { return d.name; }))
	  .padding(0.2);
	svg.append("g")
	  .attr("transform", "translate(0," + height + ")")
	  .call(d3.axisBottom(x))
	  .selectAll("text")
		.attr("transform", "translate(-10,0)rotate(-45)")
		.style("text-anchor", "end");

	// Add Y axis
	var y = d3.scaleLinear()
	  .domain([0, 100])
	  .range([ height, 0]);
	svg.append("g")
	  .call(d3.axisLeft(y));

	// Bars
	svg.selectAll("mybar")
	  .data(data)
	  .enter()
	  .append("rect")
		.attr("x", function(d) { return x(d.name); })
		.attr("y", function(d) { return y(d.age); })
		.attr("width", x.bandwidth())
		.attr("height", function(d) { return height - y(d.age); })
		.attr("fill", "#69b3a2")

}

