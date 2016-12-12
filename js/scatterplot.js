

ScatterPlot = function(_parentElement, _parentElement2, _data){
    this.parentElement = _parentElement;
    this.parentElement2 = _parentElement2;
    this.data = _data;
    this.initVis();
};

ScatterPlot.prototype.initVis = function() {
    var vis = this;

    vis.margin = {top: 0, right: 0, bottom: 80, left: 120};

    vis.chart = document.getElementById(vis.parentElement);

    vis.width = vis.chart.clientWidth-vis.margin.left-vis.margin.right;
    vis.height = vis.width/1.5-vis.margin.top-vis.margin.bottom;
    vis.padding=10;

    //svg area

    vis.body = d3.select("#" + vis.parentElement);

    vis.selectData = [ { "text" : "Population density (people per sq. km of land area)" },
        { "text" : "GDP per capita (constant 2005 US$)" },
        { "text" :  "Tuberculosis case detection rate (%, all forms)" },
        { "text" : "Life expectancy at birth, total (years)" },
        { "text" :  "Population, total" },
        { "text" :  "Urban population (% of total)" },
        { "text" : "Rule of Law (WBGI)" },
        { "text" : "Government Effectiveness (WBGI)" },
        { "text" : "Political Stability (WBGI)" }
    ];

    vis.selectDataDrugs = [ { "text" : "Number of deaths related with drugs"  },
        { "text" : "Number of drug-related deaths, mortality rates per million persons" },
        { "text" : "People who consumes cannabis, %"}
    ];


    // Select X-axis Variable

    vis.span = vis.body.append('span')
        .attr("class","scatter-labelColor")
        .text('Select X-Axis variable: ');

    vis.body.append('select')
        .attr('id','xSelect')
        .on('change', xChange)
        .selectAll('option')
        .data(vis.selectDataDrugs)
        .enter()
        .append('option')
        .attr('value', function (d) { return d.text })
        .text(function (d) { return d.text ;});
    vis.body.append('br');

    // Select Y-axis Variable

    vis.span = vis.body.append('span')
        .attr("class","scatter-labelColor")
        .text('Select Y-Axis variable: ');

    vis.body.append('select')
        .attr('id','ySelect')
        .on('change', yChange)
        .selectAll('option')
        .data(vis.selectData)
        .enter()
        .append('option')
        .attr('value', function (d) { return d.text })
        .text(function (d) { return d.text ;});
    vis.body.append('br');

    vis.span = vis.body.append('span')
        .attr("class","scatter-labelColor")
        .text('Select Radius-width variable: ');

    vis.body.append('select')
        .attr('id','radiusSelect')
        .on('change', radiusChange)
        .selectAll('option')
        .data(vis.selectData)
        .enter()
        .append('option')
        .attr('value', function (d) { return d.text })
        .text(function (d) { return d.text ;});
    vis.body.append('br');

    vis.svg= d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g");


    vis.xScale = d3.scale.linear()
        .domain([d3.min(vis.data, function(d) {return d["Number of deaths related with drugs"];}), d3.max(vis.data, function(d) {return d["Number of deaths related with drugs"];})])
        .range([vis.margin.left, vis.width-vis.margin.right]);

    // Y scale
    vis.yScale = d3.scale.linear()
        .domain([d3.min(vis.data, function(d) {return d["GDP per capita (constant 2005 US$)"];}), d3.max(vis.data, function(d) {return d["Number of deaths related with drugs"];})])
        .range([vis.height-vis.margin.top, vis.margin.bottom]);

    // Radius Scale
    vis.radiusScale = d3.scale.linear()
        .domain([d3.min(vis.data, function(d) {return d["Number of deaths related with drugs"];}), d3.max(vis.data, function(d) {return d["Number of deaths related with drugs"];})])
        .range([4,30]);


    vis.regionScale = d3.scale.ordinal()
        .range(colorbrewer.Set1[5])
        .domain(["Africa","Americas","Asia","Europe","Oceania"]);


    vis.scatter_xAxis = d3.svg.axis()
        .scale(vis.xScale)
        .orient("bottom");

    vis.scatter_yAxis = d3.svg.axis()
        .scale(vis.yScale)
        .orient("left");


    vis.svg.append("g")
        .attr("class", "scatter-axis")
        .attr("id","scatterxAxis")
        .attr("transform", "translate(0,"+(vis.height+vis.padding)+")")
        .call(vis.scatter_xAxis)
        .append("text")
        .attr("id","scatterxAxisLabel")
        .attr("y", -15)
        .attr("x", vis.width)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Number of deaths related with drug");

    vis.svg.append("g")
        .attr("class", "scatter-axis")
        .attr("id", "scatteryAxis")
        .attr("transform", "translate("+(vis.margin.left-vis.padding)+",0)")
        .call(vis.scatter_yAxis)
        .append('text')
        .attr("id", "scatteryAxisLabel")
        .attr("transform", "translate("+(vis.margin.left-3*vis.padding)+","+(vis.height/2)+")rotate(-90)")
        .attr("dy", ".71em")
        .style("text-anchor", "start")
        .text("GDP per capita (constant 2005 US$)");


    function yChange() {

        var value = this.value // get the new y value
        vis.yScale // change the yScale
            .domain([
                d3.min([d3.min(vis.data,function (d) { return d[value] }),d3.min(vis.data,function (d) { return d[value] })]),
                d3.max([d3.max(vis.data,function (d) { return d[value] }),d3.max(vis.data,function (d) { return d[value] })])
            ])
        vis.scatter_yAxis.scale(vis.yScale); // change the yScale
        d3.select('#scatteryAxis') // redraw the yAxis
            .transition().duration(1000)
            .call(vis.scatter_yAxis);
        d3.select('#scatteryAxisLabel') // change the yAxisLabel
            .transition().duration(1000)
            .text(value)
        d3.selectAll('circle') // move the circles
            .transition().duration(1000)
            .delay(function (d,i) { return i*10})
            .attr('cy',function (d) { return vis.yScale(d[value]) })
    }

    function xChange() {
        var value = this.value // get the new x value
        vis.xScale // change the xScale
            .domain([
                d3.min([d3.min(vis.data,function (d) { return d[value] }),d3.min(vis.data,function (d) { return d[value] })]),
                d3.max([d3.max(vis.data,function (d) { return d[value] }),d3.max(vis.data,function (d) { return d[value] })])
            ])
        vis.scatter_xAxis.scale(vis.xScale) // change the xScale
        d3.select('#scatterxAxis') // redraw the xAxis
            .transition().duration(1000)
            .call(vis.scatter_xAxis)
        d3.select('#scatterxAxisLabel') // change the xAxisLabel
            .transition().duration(1000)
            .text(value)
        d3.selectAll('circle') // move the circles
            .transition().duration(1000)
            .delay(function (d,i) { return i*10})
            .attr('cx',function (d) { return vis.xScale(d[value]) })
    }

    function radiusChange() {
        var value = this.value // get the new radius value
        vis.radiusScale // change the radius Scale
            .domain([
                d3.min([0,d3.min(vis.data,function (d) { return d[value] })]),
                d3.max([0,d3.max(vis.data,function (d) { return d[value] })])
            ])
        d3.selectAll('circle') // move the circles
            .transition().duration(1000)
            .delay(function (d,i) { return i*10})
            .attr('r',function (d) { return vis.radiusScale(d[value]) })
    }

    //Tooltip
    vis.tooltip = d3.tip()
        .attr("class", "scatter-d3-tip")
        .style("opacity", 0);

    vis.tooltip
        .html(function(d){
            return "<strong>" + d.continent + "</strong><br>" +
                "Region: " + d['region'] + " <br>" +
                "Country: " + d['country'] + " <br>" +
                "Drug Related Number of Deaths: " + d['Number of deaths related with drugs'] + " <br>" +
                "Drug Related Rate of Deaths: " + d['Number of drug-related deaths, mortality rates per million persons'] + " <br>" ;
        });

    vis.svg.call(vis.tooltip);

    vis.circles = vis.svg.selectAll("circle")
        .data(vis.data)
        .enter().append("circle")
        .attr("class","circle_scatterplot")
        .attr("cx", function(d){ return vis.xScale(d["Number of deaths related with drugs"]); })
        .attr("cy", function(d){ return vis.yScale(d["GDP per capita (constant 2005 US$)"]); })
        .attr("r", function(d){ return vis.radiusScale(d["Number of deaths related with drugs"]); })
        .attr("fill", function(d){ return vis.regionScale(d["continent"]); })
        .on("mouseover", vis.tooltip.show)
        .on("mouseout", vis.tooltip.hide);

    // (Filter, aggregate, modify data)


    ////legend
    var chart2 = document.getElementById(vis.parentElement2);
    vis.width2 = chart2.clientWidth;
    vis.height2 =+ vis.width2;

    vis.svg2= d3.select("#" + vis.parentElement2).append("svg")
        .attr("class","svg-legend2")
        .attr("width", vis.width2)
        .attr("height", vis.height2);

    vis.legend = d3.select(".svg-legend2")
        .append("g")
        .selectAll("g")
        .data(vis.regionScale.domain())
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr('transform', function(d, i) {
            return "translate( 200," + (i *22) +")";
        });

    vis.legend.append("circle")
        .attr("cx", 15)
        .attr("cy", vis.height2/4+15)
        .attr("r", 10)
        .style("fill", vis.regionScale)
        .style("opacity","0.5")
        .style("stroke","white");

    vis.legend.append("text")
        .attr("x", 28)
        .attr("y", vis.height2/4+20)
        .text(function(d) { return d; })
        .style("fill","white");
////
    vis.wrangleData();
};

ScatterPlot.prototype.wrangleData = function() {
    var vis = this;
    vis.updateVis();
}

ScatterPlot.prototype.updateVis = function() {
    var vis = this;



}

