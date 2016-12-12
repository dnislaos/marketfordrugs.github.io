/**
 * Created by Denisse on 11/24/2016.
 */

    $("#bubble-intro").append("Prices");
    var r = $('</br> <input type="button" class="bubble-btnStyle" id="bubble-button-intro" value="Start" onclick="startbubblevis();"/>');
    $("#bubble-intro").append(r);

    $( "#pricesclick" ).click(function() {
        $("#bubble-intro").fadeOut(100);
        $("#bubble-intro").fadeIn(3000);
    });

function startbubblevis() {

    $("#bubble-button-intro").animate({
        top: "0%"
    }, function(){
        $("#bubble-button-intro").remove()
    });

    $("#bubble-intro").animate({
        top: "0%"
    }, function () {

        if ($('.bubble-wrap').css('visibility') == 'hidden')
        {
            $('.bubble-wrap').css({opacity: 0.2, visibility: "visible"}).animate({opacity: 1.0},1000);;

        }
    });
};


BubbleChart = function(_parentElement, _parentElement2,_parentElement3,_data, _data2){
    this.parentElement = _parentElement;
    this.parentElement2 = _parentElement2;
    this.parentElement3 = _parentElement3;
    this.data = _data;
    this.data2 = _data2;
    this.initVis();
};

BubbleChart.prototype.initVis = function() {
    var vis = this;

    vis.margin = {top: 20, right: 50, bottom:50, left: 50};

    var chart = document.getElementById(vis.parentElement);
    var width1 = chart.clientWidth;

    var height1 =+ width1;

    vis.width=width1-vis.margin.left-vis.margin.right;
    vis.height=height1-vis.margin.top-vis.margin.bottom;
    vis.r=vis.width;

    vis.x = d3.scale.linear().range([0, vis.r]);
    vis.y = d3.scale.linear().range([0, vis.r]);



    vis.colorRegion = d3.scale.ordinal()
        .range(colorbrewer.Set1[5])
        .domain(["Africa","Americas","Asia","Europe","Oceania"]);

    vis.pack = d3.layout.pack()
        .size([vis.r, vis.r])
        .value(function(d){ return d.price;});


    //svg area
    vis.svg= d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom);


    vis.g = vis.svg.append("g")
        .attr("class","svg-bubble")
        .attr("transform", "translate(" + (vis.margin.left+vis.width - vis.r) / 2 + "," + (vis.margin.top+vis.height - vis.r) / 2 + ")");

    // (Filter, aggregate, modify data)
    vis.filteredData = vis.data.filter(function (el) {return ( isNaN(el.retail_price) == false)});
    for (var i = 0; i < vis.filteredData.length; i++) {
        vis.filteredData[i]["price"]=vis.filteredData[i]["retail_price"];
        vis.filteredData[i]["year"]=vis.filteredData[i]["retail_year"];
    }

    vis.filteredData2 = vis.data2.filter(function (el) {return ( isNaN(el.retail_price) == false)});
    for (var i = 0; i < vis.filteredData2.length; i++) {
        vis.filteredData2[i]["price"]=vis.filteredData2[i]["retail_price"];
        vis.filteredData2[i]["year"]=vis.filteredData2[i]["retail_year"];
    }

////legend
    var chart2 = document.getElementById(vis.parentElement2);
    vis.width2 = chart2.clientWidth;
    vis.height2 =+ vis.height+vis.margin.top+vis.margin.bottom;

    vis.svg2= d3.select("#" + vis.parentElement2).append("svg")
        .attr("class","svg-legend")
        .attr("width", vis.width2)
        .attr("height", vis.height2);

    vis.legend = d3.select(".svg-legend")
        .append("g")
        .selectAll("g")
        .data(vis.colorRegion.domain())
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr('transform', function(d, i) {
            return "translate( 0," + (i *22+vis.height2/2-vis.margin.top) + ")";
        });

    vis.legend.append("circle")
        .attr("cx", 15)
        .attr("cy", 15)
        .attr("r", 10)
        .style("fill", vis.colorRegion);

    vis.legend.append("text")
        .attr("x", 28)
        .attr("y", 20)
        .text(function(d) { return d; })
        .style("fill","white");
////

    vis.filteredDataFinal=vis.filteredData;
    vis.wrangleData();

};

BubbleChart.prototype.filterDrug = function(objButton) {
    var vis=this;

    if (objButton.innerHTML=="Cocaine") {
        vis.filteredDataFinal=vis.data.filter(function (el) {return ( isNaN(el.retail_price) == false)});
        for (var i = 0; i < vis.filteredData.length; i++) {
            vis.filteredDataFinal[i]["price"]=vis.filteredData[i]["retail_price"];
            vis.filteredDataFinal[i]["year"]=vis.filteredData[i]["retail_year"];
        }

    } else   if (objButton.innerHTML=="Cannabis") {
        vis.filteredDataFinal=vis.filteredData2;
        vis.filteredData=vis.data.filter(function (el) {return ( isNaN(el.wholesale_price) == false)});
        for (var i = 0; i < vis.filteredData.length; i++) {
            vis.filteredDataFinal[i]["price"]=vis.filteredData[i]["wholesale_price"];
            vis.filteredDataFinal[i]["year"]=vis.filteredData[i]["wholesale_year"];
        }

    }

    vis.filter();

};


BubbleChart.prototype.filter = function(objButton) {
    var vis=this;

   if (objButton.innerHTML=="Retail") {
    vis.visualizedData=filteredDataFinal.filter(function (el) {return ( isNaN(el.retail_price) == false)});
  for (var i = 0; i < vis.visualizedData.length; i++) {
    vis.visualizedData[i]["price"]=vis.visualizedData[i]["retail_price"];
    vis.visualizedData[i]["year"]=vis.visualizedData[i]["retail_year"];
 }

   } else   if (objButton.innerHTML=="Wholesale") {
      vis.filteredData=filteredDataFinal.filter(function (el) {return ( isNaN(el.wholesale_price) == false)});
       for (var i = 0; i < vis.visualizedData.length; i++) {
           vis.visualizedData[i]["price"]=vis.visualizedData[i]["wholesale_price"];
           vis.visualizedData[i]["year"]=vis.visualizedData[i]["wholesale_year"];
       }

  }


    vis.wrangleData();


};


BubbleChart.prototype.wrangleData = function() {
    var vis = this;

        //filterData

    var groups = {};
    for (var i = 0; i < vis.filteredData.length; i++) {
        var groupName = vis.filteredData[i].Region;
        if (!groups[groupName]) {
            groups[groupName] = [];
        }
        groups[groupName].push(vis.filteredData[i]);
    }

    myArray = [];
    for (var groupName in groups) {
        myArray.push({name: groupName, children: groups[groupName]});
    }

    vis.world={name:"world", children: myArray};


    for (var j = 0; j < vis.world.children.length; j++) {
        vis.world.children[j].children.sort( function(a, b){
            return b.price - a.price;
        });
    };

   vis.updateVis();
};

BubbleChart.prototype.updateVis = function() {
    var vis = this;

    vis.node=vis.root=vis.world;

    vis.nodes = vis.pack.nodes(vis.root);

    vis.bubble=vis.svg.selectAll("circle")
        .data(vis.nodes)
        .attr("class", function(d) {
            if (d.children) {
                return "bubble-parent";
            } else {
                return "bubble-child";
            }
        });

    vis.bubble
        .enter().append("circle");

    // Update (set the dynamic properties of the elements)
    vis.bubble
        .transition().duration(1000)
        .attr("cx",  vis.margin.left+vis.width/2 )
        .attr("cy",  vis.margin.top+vis.height/2 )
        .style("opacity", "0.2")
        .transition().duration(4000)
        .attr("cx", function(d) { return vis.margin.left+d.x; })
        .attr("cy", function(d) { return vis.margin.top+d.y; })
        .attr("r", function(d) { return d.r; })
        .style("opacity","1");

    vis.bubble
        .attr("fill", function(d){
            if (d.children) {
                return "black";
            } else {
                return vis.colorRegion(d.Region);
            }

        })
        .style("stroke", function (d){
            if (d.children) {
                return "white";
            } else {
                return "black";
            }
        })
        .style("stroke-width", function (d){
            if (d.children) {
                return "1px";
            } else {
                return "0.5px"
            }
        })
        .on("click", function(d) {
            if (vis.node == d) {
                return zoom(vis.root);
            } else {
                return zoom(d);
            }
        });

    // Exit
        vis.bubble.exit().remove();
        d3.select(".svg-bubble").on("click", function() {
            zoom(vis.root);

        });

    //       node.append("title")
   //         .text(function(d) { return d.data.name + "\n" + vis.format(d.value); });


    function zoom(d) {
        var k = (vis.r) / (d.r) / 2;

        vis.x.domain([d.x - d.r, d.x + d.r]);
        vis.y.domain([d.y - d.r, d.y + d.r]);

        if (d3.event.altKey) {
            var t = vis.svg.transition()
                .duration(7500);
        } else {
            var t = vis.svg.transition()
                .duration(750);
        }

        t.selectAll("circle")
            .attr("cx", function(d) { return vis.margin.left+vis.x(d.x); })
            .attr("cy", function(d) { return vis.margin.top+vis.y(d.y); })
            .attr("r", function(d) { return (k * d.r); });
        vis.node = d;

        d3.event.stopPropagation();

        if (vis.node.children) {
            vis.svg.select(".bubble-name").remove();

        } else {

            vis.svg.select(".bubble-name").remove();

            vis.svg.append("g")
                .attr("class","bubble-name")
                .attr("transform", "translate(" + (vis.margin.left+(vis.width/2)) + "," + ((vis.height/2)) + ")")
                .style("text-anchor","middle");

            vis.svg.select(".bubble-name").append("text")
                 .attr("y", -40)
                .text("Country: " + vis.node.name);

            vis.svg.select(".bubble-name").append("text")
                .attr("y", 0)
                .text("Price (USD): $" + vis.node.price);

            vis.svg.select(".bubble-name").append("text")
                .attr("y", 40)
                .text("Year: " + vis.node.year);

        }
    }


};

