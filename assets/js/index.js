//APIS
const countyURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
const educationURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

let countyData;
let educationData;

//Creacion del svg y tooltip
const canvas = d3.select("#canvas");
const tooltip = d3
  .select("#tooltip")
  .style("position", "absolute")
  .style("padding", "10px")
  .style("padding", "10px");

const drawMap = () => {
  canvas
    .selectAll("path")
    .data(countyData)
    .enter()
    .append("path")
    .attr("d", d3.geoPath())
    .attr("class", "county")
    .attr("fill", (countyDataItem) => {
      let id = countyDataItem["id"];
      let county = educationData.find((item) => {
        return item["fips"] === id;
      });
      let percentage = county["bachelorsOrHigher"];
      if (percentage <= 15) {
        return "#01c38030";
      } else if (percentage <= 30) {
        return "#01c38050";
      } else if (percentage <= 45) {
        return "#01c38070";
      } else {
        return "#01c380";
      }
    })
    .attr("data-fips", (countyDataItem) => {
      return countyDataItem["id"];
    })
    .attr("data-education", (countyDataItem) => {
      let id = countyDataItem["id"];
      let county = educationData.find((item) => {
        return item["fips"] === id;
      });
      let percentage = county["bachelorsOrHigher"];
      return percentage;
    })
    .on("mouseover", (countyDataItem, e) => {
      tooltip
        .transition()
        .style("visibility", "visible")
        .style("left", e.pageX + 10 + "px")
        .style("top", e.pageY + 10 + "px")
        .style("font-size", "12px");

      let id = countyDataItem["id"];
      let county = educationData.find((item) => {
        return item["fips"] === id;
      });

      tooltip.text(
        county["fips"] +
          " - " +
          county["area_name"] +
          ", " +
          county["state"] +
          " : " +
          county["bachelorsOrHigher"] +
          "%"
      );

      tooltip.attr("data-education", county["bachelorsOrHigher"]);
    })
    .on("mouseout", (countyDataItem) => {
      tooltip.transition().style("visibility", "hidden");
    });
};

d3.json(countyURL).then((data) => {
  countyData = topojson.feature(data, data.objects.counties).features;

  d3.json(educationURL).then((data) => {
    educationData = data;
    drawMap();
  });
});
