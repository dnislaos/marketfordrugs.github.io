/**
 * Created by marcelagba on 11/25/16.
 */


$(".map-section-heading").append("Supply and Demand");
var r = $('</br> <input type="button" class="bubble-btnStyle" id="map-button-intro" value="Start" onclick="startmapvis();"/>');
$(".map-section-heading").append(r);

$( "#mapclick" ).click(function() {
    $(".map-section-heading").fadeOut(100);
    $(".map-section-heading").fadeIn(3000);
});

function startmapvis() {

    $("#map-button-intro").animate({
        top: "0%"
    }, function(){
        $("#map-button-intro").remove()
    });

    $(".map-section-heading").animate({
        top: "0%"
    }, function () {

        if ($('.map-wrap').css('visibility') == 'hidden')
        {
            $('.map-wrap').css({opacity: 0.2, visibility: "visible"}).animate({opacity: 1.0},1000);

        }
    });
};



SupplyDemandMap = function(_parentElement, _data, _data2, _data3){
    this.parentElement = _parentElement;
    this.world = _data;
    this.hectares = _data2;
    this.prevalence = _data3;
    this.initVis();
};

SupplyDemandMap.prototype.initVis = function() {
    var vis = this;

    vis.margin = {top: 0, right: 0, bottom: 0, left: 0};

    var chart = document.getElementById(vis.parentElement);
    var width1 = chart.clientWidth;
    var height1 = width1- vis.margin.top;

    vis.width = width1 - vis.margin.left - vis.margin.right;
    vis.height = height1/2 - vis.margin.top - vis.margin.bottom;

    //svg area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width)
        .attr("height", vis.height);

    //Create a mercator projection
    vis.projection = d3.geo.mercator()
        .translate([vis.width/2 , vis.height /2])
        .scale([100]);

    //specify projection in a Geo-path generator
    vis.path = d3.geo.path()
        .projection(vis.projection);

    ///Color according to development level
    vis.colormap= "Greys";

    vis.hue = d3.scale.quantile()
        .range(colorbrewer[vis.colormap][4]);

    /// / Render the World atlas by using the path generator
    vis.svg.selectAll("path")
        .data(topojson.feature(vis.world, vis.world.objects.countries).features)
        .enter().append("path")
        .attr("d", vis.path)
        .attr("class", "countries")
        .style("fill", "lightgrey")
        .style("stroke", "white")
        .style("stroke-width", "1.2px");

////////// LEGEND/////

    vis.names = ["Cocaine", "Opium", "Cannabis"];
    vis.color = ["#006d2c", "#e41a1c" , "#377eb8"];

    vis.legendnames = vis.svg.selectAll(".map-legend-text")
        .data(vis.names)
        .enter().append("g")
        .attr("class", "map-legend-text")
        .attr("transform", function (d, i) {
            return "translate(0," + i * 20 + ")";
        });

// draw legend colored rectangles
    vis.legendnames.append("rect")
        .attr("x", 100)
        .attr("y", vis.height/2 )
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d,i) {return vis.color[i]})
        .style("opacity", 0.6 );

// draw legend text
    vis.legendnames.append("text")
        .attr("x", 95)
        .attr("y", vis.height/2 +9 )
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .style("fill", "lightgrey")
        .text(function (d) {
            return d;
        });

    // (Filter, aggregate, modify data)
    vis.wrangleData();
};

SupplyDemandMap.prototype.wrangleData = function() {
    var vis = this;
    vis.updateVis();
};

SupplyDemandMap.prototype.updateVis = function() {
    var vis = this;

    //select data
    vis.selectBox = document.getElementById("option");
    vis.selectedValue = vis.selectBox.options[vis.selectBox.selectedIndex].value;

    vis.selectBox2 = document.getElementById("options");
    vis.selectedValue2 = vis.selectBox2.options[vis.selectBox2.selectedIndex].value;


    if (vis.selectedValue2 == "op1") {
        vis.hectaresf = vis.hectares}
    else {
        if (vis.selectedValue2 == "op2") {
            vis.hectaresf = vis.hectares.filter(function (el) {
                return (el.incomegroup != "High income")
//                   return (el.incomegroup == "Low income") && (el.incomegroup == "Lower middle income") && (el.incomegroup == "Upper middle income");
            })}
        else{
            if (vis.selectedValue2 == "op3") {
                vis.hectaresf = vis.hectares.filter(function (el) {
                    return (el.incomegroup == "High income")
                });
            }}};

    if (vis.selectedValue2 == "op1") {
        vis.prevalencef = vis.prevalence}
    else {
        if (vis.selectedValue2 == "op2") {
            vis.prevalencef = vis.prevalence.filter(function (el) {
                return (el.incomegroup != "High income")
//                return (el.incomegroup == "Low income") && (el.incomegroup == "Lower middle income") && (el.incomegroup == "Upper middle income");
            })}
        else{
            if (vis.selectedValue2 == "op3") {
                vis.prevalencef = vis.prevalence.filter(function (el) {
                    return (el.incomegroup == "High income")
                });
            }}};

    if (vis.selectedValue == "hectares") {
        ///////// MOUSEOVER TIP //////////
        vis.tip = d3.tip()
            .attr('class', 'map-d3-tip')
            .offset([-10, 0])
            .html(function (d) {
                if(d.coca_cultiv!=0 && d.opium_cultiv!=0 && d.cannabis_cultiv!=0) {
                    return "<strong>" + d.country + "</strong><br>"
                        + "Cocaine(ha): "+ d.coca_cultiv + "<br>"
                        + "Opium(ha): "+ d.opium_cultiv + "<br>"
                        + "Cannabis(ha): "+ d.cannabis_cultiv + "<br>";
                } else if (d.coca_cultiv==0 && d.opium_cultiv!=0 && d.cannabis_cultiv!=0) {
                    return "<strong>" + d.country + "</strong><br>"
                        + "Opium(ha): " + d.opium_cultiv + "<br>"
                        + "Cannabis(ha): " + d.cannabis_cultiv + "<br>";
                } else if (d.coca_cultiv!=0 && d.opium_cultiv==0 && d.cannabis_cultiv!=0) {
                    return "<strong>" + d.country + "</strong><br>"
                        + "Cocaine(ha): "+ d.coca_cultiv + "<br>"
                        + "Cannabis(ha): " + d.cannabis_cultiv + "<br>";
                } else if (d.coca_cultiv!=0 && d.opium_cultiv!=0 && d.cannabis_cultiv==0) {
                    return "<strong>" + d.country + "</strong><br>"
                        + "Cocaine(ha): "+ d.coca_cultiv + "<br>"
                        + "Opium(ha): " + d.opium_cultiv + "<br>";
                } else if (d.coca_cultiv!=0 && d.opium_cultiv==0 && d.cannabis_cultiv==0) {
                    return "<strong>" + d.country + "</strong><br>"
                        + "Cocaine(ha): "+ d.coca_cultiv + "<br>";
                } else if (d.coca_cultiv==0 && d.opium_cultiv!=0 && d.cannabis_cultiv==0) {
                    return "<strong>" + d.country + "</strong><br>"
                        + "Opium(ha): " + d.opium_cultiv + "<br>";
                } else if (d.coca_cultiv==0 && d.opium_cultiv==0 && d.cannabis_cultiv!=0) {
                    return "<strong>" + d.country + "</strong><br>"
                        + "Cannabis(ha): " + d.cannabis_cultiv + "<br>";
                }});

//    .html(function (d) {
//            return "<strong>" + d.country + "</strong><br>"
//                + "Cocaine(ha): "+ d.coca_cultiv + "<br>"
//                + "Opium(ha): "+ d.opium_cultiv + "<br>"
//                + "Cannabis(ha): "+ d.cannabis_cultiv + "<br>";
//        });
        vis.svg.call(vis.tip);

        // Radius Scale
        vis.cocaScale = d3.scale.linear()
            .domain(d3.extent(vis.hectaresf, function (d) {
                return d.coca_cultiv
            }))
            .range([3.57, 17.67]);

        vis.svg.selectAll("circle.map-coca2").remove();
        vis.svg.selectAll("circle.map-coca").remove();
        vis.svg.selectAll("circle.map-coca")
            .data(vis.hectaresf)
            .enter()
            .append("circle")
            .attr("class", "map-coca")
            .attr("transform", function (d) {
                return "translate(" + vis.projection([d.longitude, d.latitude]) + ")";
            })
            .attr("r", function (d) {
                return vis.cocaScale(d.coca_cultiv);
            })
            .style("fill", "#006d2c") //green
            .style("opacity", 0.6)
            //            .style("stroke", function(d) {
            //                if (d.incomegroup == "Low income") {
            //                    return "black"} //#525252
            //                else {
            //                    if (d.incomegroup == "Lower middle income") {
            //                        return "black"} //#969696
            //                        else{
            //                            if (d.incomegroup == "Upper middle income") {
            //                                return "black"} //#cccccc
            //                                else{
            //                                    return "#f7f7f7" //Upper middle income and High income
            //                        }
            //                    }}
            //                ;})
            //             .style ("stroke-width", "3")
            .on('mouseover', vis.tip.show)
            .on('mouseout', vis.tip.hide);

        vis.opiumScale = d3.scale.linear()
            .domain(d3.extent(vis.hectaresf, function (d) {
                return d.opium_cultiv
            }))
            .range([0.0178, 40]);

        vis.svg.selectAll("circle.map-opium2").remove();
        vis.svg.selectAll("circle.map-opium").remove();
        vis.svg.selectAll("circle.map-opium")
            .data(vis.hectaresf)
            .enter()
            .append("circle")
            .attr("class", "map-opium")
            .attr("transform", function (d) {
                return "translate(" + vis.projection([d.longitude, d.latitude]) + ")";
            })
            .attr("r", function (d) {
                return vis.opiumScale(d.opium_cultiv);
            })
            .style("fill", "#e41a1c") //red
            .style("opacity", 0.6)
            //            .style("stroke", function(d) {
            //                if (d.incomegroup == "Low income") {
            //                    return "black"} //#525252
            //                else {
            //                    if (d.incomegroup == "Lower middle income") {
            //                        return "black"} //#969696
            //                        else{
            //                            if (d.incomegroup == "Upper middle income") {
            //                                return "black"} //#cccccc
            //                                else{
            //                                    return "#f7f7f7" //Upper middle income and High income
            //                        }
            //                    }}
            //                ;})
            //             .style ("stroke-width", "3")
            .on('mouseover', vis.tip.show)
            .on('mouseout', vis.tip.hide);

        vis.cannabisScale = d3.scale.linear()
            .domain(d3.extent(vis.hectaresf, function (d) {
                return d.cannabis_cultiv
            }))
            .range([0, 8.39]);

        vis.svg.selectAll("circle.map-cannabis2").remove();
        vis.svg.selectAll("circle.map-cannabis").remove();
        vis.svg.selectAll("circle.map-cannabis")
            .data(vis.hectaresf)
            .enter()
            .append("circle")
            .attr("class", "map-cannabis")
            .attr("transform", function (d) {
                return "translate(" + vis.projection([d.longitude, d.latitude]) + ")";
            })
            .attr("r", function (d) {
                return vis.cannabisScale(d.cannabis_cultiv);
            })
            .style("fill", "#377eb8") //blue
            .style("opacity", 0.6)
            //            .style("stroke", function(d) {
            //                if (d.incomegroup == "Low income") {
            //                    return "black"} //#525252
            //                else {
            //                    if (d.incomegroup == "Lower middle income") {
            //                        return "black"} //#969696
            //                        else{
            //                            if (d.incomegroup == "Upper middle income") {
            //                                return "black"} //#cccccc
            //                                else{
            //                                    return "#f7f7f7" //Upper middle income and High income
            //                        }
            //                    }}
            //                ;})
            //             .style ("stroke-width", "3")
            .on('mouseover', vis.tip.show)
            .on('mouseout', vis.tip.hide);

        ////////// LEGEND/////

        //Circles
        vis.radius = d3.scale.sqrt()
            .domain([0, 183000])
            .range([0, 40]);

        vis.legend = vis.svg.append("g")
            .attr("class", "map-legend")
            .attr("transform", "translate(" + 200 + "," + (vis.height - vis.height / 8.5) + ")")
            .selectAll("g")
            .data([60000, 115000, 185000])
            .enter().append("g");

        vis.legend.append("circle")
            .attr("class", "map-legend-circle")
            .attr("cy", function (d) {
                return -vis.radius(d);
            })
            .attr("r", vis.radius);

        vis.svg.selectAll("text.map-legend-text").remove();
        vis.legend.append("text")
            .attr("class", "map-legend-text")
            .attr("y", function (d) {
                return -1.85 * vis.radius(d);
            })
            .attr("dy", "-0.5em")
            .attr("dx", "-0.8em")
            .attr("anchor", "center")
            .text(d3.format("s"));

    } else if (vis.selectedValue == "prevalence") {

        ///////// MOUSEOVER TIP //////////
        vis.tip = d3.tip()
            .attr('class', 'map-d3-tip')
            .offset([-10, 0])
            .html(function (d) {
                if(d.coca!=0 && d.opium!=0 && d.cannabis!=0) {
                    return "<strong>" + d.country + "</strong><br>"
                        + "Cocaine use (% population): "+ d.coca + "<br>"
                        + "Opium use (% population): "+ d.opium + "<br>"
                        + "Cannabis use (% population): "+ d.cannabis + "<br>";
                } else if (d.coca==0 && d.opium!=0 && d.cannabis!=0) {
                    return "<strong>" + d.country + "</strong><br>"
                        + "Opium use (% population): " + d.opium + "<br>"
                        + "Cannabis use (% population): " + d.cannabis + "<br>";
                } else if (d.coca!=0 && d.opium==0 && d.cannabis!=0) {
                    return "<strong>" + d.country + "</strong><br>"
                        + "Cocaine use (% population): "+ d.coca + "<br>"
                        + "Cannabis use (% population): " + d.cannabis + "<br>";
                } else if (d.coca!=0 && d.opium!=0 && d.cannabis==0) {
                    return "<strong>" + d.country + "</strong><br>"
                        + "Cocaine use (% population): "+ d.coca + "<br>"
                        + "Opium use (% population): " + d.opium + "<br>";
                } else if (d.coca!=0 && d.opium==0 && d.cannabis==0) {
                    return "<strong>" + d.country + "</strong><br>"
                        + "Cocaine use (% population): "+ d.coca + "<br>";
                } else if (d.coca==0 && d.opium!=0 && d.cannabis==0) {
                    return "<strong>" + d.country + "</strong><br>"
                        + "Opium use (% population): " + d.opium + "<br>";
                } else if (d.coca==0 && d.opium==0 && d.cannabis!=0) {
                    return "<strong>" + d.country + "</strong><br>"
                        + "Cannabis use (% population): " + d.cannabis + "<br>";
                }});
        vis.svg.call(vis.tip);

        // Radius Scale
        vis.cocaScaleprevalence = d3.scale.linear()
            .domain(d3.extent(vis.prevalencef, function (d) {
                return d.coca
            }))
            .range([0, 5.24]);

        vis.svg.selectAll("circle.map-coca").remove();
        vis.svg.selectAll("circle.map-coca2").remove();
        vis.svg.selectAll("circle.map-coca2")
            .data(vis.prevalencef)
            .enter()
            .append("circle")
            .attr("class", "map-coca2")
            .attr("transform", function (d) {
                return "translate(" + vis.projection([d.longitude, d.latitude]) + ")";
            })
            .attr("r", function (d) {
                return vis.cocaScaleprevalence(d.coca);
            })
            .style("fill", "black") //green
            .style("opacity", 0.6)
            //            .style("stroke", function(d) {
            //                if (d.incomegroup == "Low income") {
            //                    return "black"} //#525252
            //                else {
            //                    if (d.incomegroup == "Lower middle income") {
            //                        return "black"} //#969696
            //                        else{
            //                            if (d.incomegroup == "Upper middle income") {
            //                                return "black"} //#cccccc
            //                                else{
            //                                    return "#f7f7f7" //Upper middle income and High income
            //                        }
            //                    }}
            //                ;})
            //             .style ("stroke-width", "3")
            .on('mouseover', vis.tip.show)
            .on('mouseout', vis.tip.hide);

        vis.opiumScaleprevalence = d3.scale.linear()
            .domain(d3.extent(vis.prevalencef, function (d) {
                return d.opium
            }))
            .range([0, 13.5]);


        vis.svg.selectAll("circle.opium").remove();
        vis.svg.selectAll("circle.opium2").remove();
        vis.svg.selectAll("circle.opium2")
            .data(vis.prevalencef)
            .enter()
            .append("circle")
            .attr("class", "map-opium2")
            .attr("transform", function (d) {
                return "translate(" + vis.projection([d.longitude, d.latitude]) + ")";
            })
            .attr("r", function (d) {
                return vis.opiumScaleprevalence(d.opium);
            })
            .style("fill", "#e41a1c") //red
            .style("opacity", 0.6)
            //            .style("stroke", function(d) {
            //                if (d.incomegroup == "Low income") {
            //                    return "black"} //#525252
            //                else {
            //                    if (d.incomegroup == "Lower middle income") {
            //                        return "black"} //#969696
            //                        else{
            //                            if (d.incomegroup == "Upper middle income") {
            //                                return "black"} //#cccccc
            //                                else{
            //                                    return "#f7f7f7" //Upper middle income and High income
            //                        }
            //                    }}
            //                ;})
            //             .style ("stroke-width", "3")
            .on('mouseover', vis.tip.show)
            .on('mouseout', vis.tip.hide);

        vis.cannabisScaleprevalence = d3.scale.linear()
            .domain(d3.extent(vis.prevalencef, function (d) {
                return d.cannabis
            }))
            .range([0, 40]);

        vis.svg.selectAll("circle.map-cannabis").remove();
        vis.svg.selectAll("circle.map-cannabis2").remove();
        vis.svg.selectAll("circle.map-cannabis2")
            .data(vis.prevalencef)
            .enter()
            .append("circle")
            .attr("class", "map-cannabis2")
            .attr("transform", function (d) {
                return "translate(" + vis.projection([d.longitude, d.latitude]) + ")";
            })
            .attr("r", function (d) {
                return vis.cannabisScaleprevalence(d.cannabis);
            })
            .style("fill", "#377eb8")
            .style("opacity", 0.6)
            //            .style("stroke", function(d) {
            //                if (d.incomegroup == "Low income") {
            //                    return "black"} //#525252
            //                else {
            //                    if (d.incomegroup == "Lower middle income") {
            //                        return "black"} //#969696
            //                        else{
            //                            if (d.incomegroup == "Upper middle income") {
            //                                return "black"} //#cccccc
            //                                else{
            //                                    return "#f7f7f7" //Upper middle income and High income
            //                        }
            //                    }}
            //                ;})
            //             .style ("stroke-width", "3")
            .on('mouseover', vis.tip.show)
            .on('mouseout', vis.tip.hide);


        ////////// LEGEND/////

        //Circles
        vis.radius = d3.scale.sqrt()
            .domain([0, 18.3])
            .range([0, 40]);

        vis.legend = vis.svg.append("g")
            .attr("class", "map-legend")
            .attr("transform", "translate(" + 200 + "," + (vis.height - vis.height / 8.5) + ")")
            .selectAll("g")
            .data([5, 10, 20])
            .enter().append("g");

        vis.legend.append("circle2")
            .attr("class", "map-legend-circle")
            .attr("cy", function (d) {
                return -vis.radius(d);
            })
            .attr("r", vis.radius);

        vis.svg.selectAll("text.map-legend-text").remove();
        vis.legend.append("text")
            .attr("class", "map-legend-text")
            .attr("y", function (d) {
                return -1.8 * vis.radius(d);
            })
            .attr("dy", "-0.5em")
            .attr("dx", "-0.8em")
            .attr("anchor", "center")
            .text(function(d) { return  + d3.format(",")(d)+ "%" } );
//                d3.format("%"));

    };
};