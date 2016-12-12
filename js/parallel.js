



ParallelChart = function(_parentElement, _data, _data2){
    this.parentElement = _parentElement;
    this.data = _data;
    this.labels = _data2;
    this.initVis();
};

ParallelChart.prototype.initVis = function() {
    var vis = this;

    vis.margin = {top: 100, right: 50, bottom:50, left: 50};

    var chart = document.getElementById(vis.parentElement);
    var width1 = chart.clientWidth;

    var height1 = width1/3;

    vis.width=width1-vis.margin.left-vis.margin.right;
    vis.height=height1-vis.margin.top-vis.margin.bottom;

    //svg area
    vis.svg= d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g");


    vis.x = d3.scale.ordinal().rangePoints([0, vis.width], 1);
        vis.y = {};


    vis.line = d3.svg.line();
    vis.axis = d3.svg.axis().orient("left");

    // Extract the list of dimensions and create a scale for each.
    vis.x.domain(dimensions = d3.keys(vis.data[0]).filter(function(d) {
        return d != "country" && d != "region" && d != "subregion" && (vis.y[d] = d3.scale.linear()
                .domain(d3.extent(vis.data, function(p) { return +p[d]; }))
                .range([vis.height, 0]));
    }));


    vis.g = vis.svg.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function(d) { return "translate(" + vis.x(d) + ",50)"; });

    vis.g.append("g")
        .attr("class", "axis")
        .each(function(d) { d3.select(this).call(vis.axis.scale(vis.y[d])); });

    vis.g.append("g")
        .attr("class", "axis")
        .each(function(d) { d3.select(this).call(vis.axis.scale(vis.y[d])); })
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text(function(d) {

            for (i=0;i<vis.labels.length;i++) {

                if (d==vis.labels[i].key) {

                    return vis.labels[i].title;
                }

            }


        });


    // (Filter, aggregate, modify data)
    vis.wrangleData();
};

ParallelChart.prototype.wrangleData = function() {
    var vis = this;
    vis.updateVis();
}

ParallelChart.prototype.updateVis = function() {
    var vis = this;


    vis.background = vis.svg.append("g")
        .attr("class", "background")
        .selectAll("path")
        .data(vis.data)
        .enter().append("path")
        .attr("d", path)
        .attr("transform", "translate(0,50)");


    vis.foreground = vis.svg.append("g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(vis.data)
        .enter().append("path")
        .attr("d", path)
        .attr("transform", "translate(0,50)");

    function path(d) {
        return vis.line(dimensions.map(function(p) { return [vis.x(p), vis.y[p](d[p])]; }));
    };


}

