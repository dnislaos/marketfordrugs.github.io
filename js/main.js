$(function() {
    $("#letter-container h2 a").lettering();
});


var bubblechart;
var scatterplot;
var displayhectares;
var displayworld;
var displayprevalence;
var supplydemandmap;


queue()
    .defer(d3.csv,"data/drugs_final.csv")
    .defer(d3.csv,"data/prices/cocaine.csv")
    .defer(d3.csv,"data/prices/cannabis.csv")
    .defer(d3.json, "data/map/world.json")
    .defer(d3.json, "data/map/hectares_last.json")
    .defer(d3.json, "data/map/prevalence_last.json")
    .await(createVis);



function createVis(error, drugs_final ,pCocaine, pCannabis ,world, hectares_last, prevalence_last ){

    if(error) { console.log(error); }

    // (2) Make our data look nicer and more useful


    drugs_final.forEach(function(d) {
        d["Number of deaths related with drugs"]= +d["Number of deaths related with drugs"];
        d["Number of drug-related deaths, mortality rates per million persons"]= +d["Number of drug-related deaths, mortality rates per million persons"];
        d["Population density (people per sq. km of land area)"]= +d["Population density (people per sq. km of land area)"];
        d["GDP per capita (constant 2005 US$)"]= +d["GDP per capita (constant 2005 US$)"];
        d["Tuberculosis case detection rate (%, all forms)"]= +d["Tuberculosis case detection rate (%, all forms)"];
        d["Life expectancy at birth, total (years)"]= +d["Life expectancy at birth, total (years)"];
        d["Population, total"]= +d["Population, total"];
        d["Urban population (% of total)"]= +d["Urban population (% of total)"];
        d["Rule of Law (WBGI)"]= +d["Rule of Law (WBGI)"];
        d["Government Effectiveness (WBGI)"]= +d["Government Effectiveness (WBGI)"];
        d["Political Stability (WBGI)"]= +d["Political Stability (WBGI)"];
    });

    pCocaine.forEach(function(d) {
        d.retail_price =+d.retail_price;
        d.retail_year =+d.retail_year;
        d.wholesale_price =+d.wholesale_price;
        d.wholesale_year =+d.wholesale_year;

        if (d.wholesale_price===0) {
            d.wholesale_price=NaN;
            d.wholesale_year=NaN;

        }
        if (d.retail_price===0) {
            d.retail_price=NaN;
            d.retail_price=NaN;

        }
    });

    pCannabis.forEach(function(d) {
        d.retail_price =+d.retail_price;
        d.retail_year =+d.retail_year;
        d.wholesale_price =+d.wholesale_price;
        d.wholesale_year =+d.wholesale_year;

        if (d.wholesale_price===0) {
            d.wholesale_price=NaN;
            d.wholesale_year=NaN;

        }
        if (d.retail_price===0) {
            d.retail_price=NaN;
            d.retail_price=NaN;

        }
    });

    ////////Data wrangling

    hectares_last.forEach(function (d) {
        // Convert numeric values to 'numbers'
        d.coca_cultiv = +d.coca_cultiv;
        d.opium_cultiv = +d.opium_cultiv;
        d.cannabis_cultiv = +d.cannabis_cultiv;
        d.latitude = +d.latitude;
        d.longitude = +d.longitude;
    });

    prevalence_last.forEach(function (d) {
        // Convert numeric values to 'numbers'
        d.coca = +d.coca;
        d.opium = +d.opium;
        d.cannabis = +d.cannabis;
        d.latitude = +d.latitude;
        d.longitude = +d.longitude;
    });


    pricescocaine=pCocaine;
    pricescannabis=pCannabis;
    drugsfinal=drugs_final;
    displayworld=world;
    displayhectares = hectares_last;
    displayprevalence = prevalence_last;
    // (4) Create visualization instances

    bubblechart = new BubbleChart("bubble-chart", "bubble-legend", "other2", pricescocaine, pricescannabis);
    scatterplot = new ScatterPlot("scatterPlot", "scatter-svg-legend", drugsfinal);
    supplydemandmap = new SupplyDemandMap("SupplyDemand", displayworld, displayhectares, displayprevalence);

};

