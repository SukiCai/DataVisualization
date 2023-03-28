/**
 * Load TopoJSON data of the world and the data of the world wonders
 */

Promise.all([
  d3.json('data/world-110m.json'),
  d3.csv('data/Life Expectancy Data.csv')
]).then(data => {

  const geoData = data[0];
  const countryData = data[1];
  const filteredGeoDataId = []
  let selectedYear = "2015";

  geoData.objects.countries.geometries.forEach(d => {
    // for (let i = 0; i < countryData.length; i++) {
      countryData.forEach(c=>{
        if (d.properties.name == c.Country && c.Year == selectedYear) {
          filteredGeoDataId.push(geoData.objects.countries.geometries.indexOf(d));
          data_process(d, c);
        } else if (d.properties.name == "Bolivia" && c.Country.includes("Bolivia") && c.Year == selectedYear){
          filteredGeoDataId.push(geoData.objects.countries.geometries.indexOf(d));
          data_process(d, c);
        } else if (d.properties.name == "Dem. Rep. Congo" &&  c.Country.includes("Democratic Republic of the Congo") && c.Year == selectedYear){
          filteredGeoDataId.push(geoData.objects.countries.geometries.indexOf(d));
          data_process(d, c);
        } else if (d.properties.name == "Central African Rep." &&  c.Country.includes("Central African Republic") && c.Year == selectedYear){
          filteredGeoDataId.push(geoData.objects.countries.geometries.indexOf(d));
          data_process(d, c);
        } else if (d.properties.name == "S. Sudan" &&  c.Country.includes("South Sudan") && c.Year == selectedYear){
          filteredGeoDataId.push(geoData.objects.countries.geometries.indexOf(d));
          data_process(d, c);
        } else if (d.properties.name == "Tanzania" &&  c.Country.includes("United Republic of Tanzania") && c.Year == selectedYear){
          filteredGeoDataId.push(geoData.objects.countries.geometries.indexOf(d));
          data_process(d, c);
        } else if (d.properties.name == "Russia" &&  c.Country.includes("Russian Federation") && c.Year == selectedYear){
          filteredGeoDataId.push(geoData.objects.countries.geometries.indexOf(d));
          data_process(d, c);
        } else if (d.properties.name == "Iran" &&  c.Country.includes("Iran (Islamic Republic of)") && c.Year == selectedYear){
          filteredGeoDataId.push(geoData.objects.countries.geometries.indexOf(d));
          data_process(d, c);
        } else if (d.properties.name == "Laos" &&  c.Country.includes("Lao People's Democratic Republic") && c.Year == selectedYear){
          filteredGeoDataId.push(geoData.objects.countries.geometries.indexOf(d));
          data_process(d, c);
        } else if (d.properties.name == "Vietnam" &&  c.Country.includes("Viet Nam") && c.Year == selectedYear){
          filteredGeoDataId.push(geoData.objects.countries.geometries.indexOf(d));
          data_process(d, c);
        } else if (d.properties.name == "North Korea" &&  c.Country.includes("Democratic People's Republic of Korea") && c.Year == selectedYear){
          filteredGeoDataId.push(geoData.objects.countries.geometries.indexOf(d));
          data_process(d, c);
        } else if (d.properties.name == "South Korea" &&  c.Country.includes("Republic of Korea") && c.Year == selectedYear){
          filteredGeoDataId.push(geoData.objects.countries.geometries.indexOf(d));
          data_process(d, c);
        } else if (d.properties.name == "United Kingdom" &&  c.Country.includes("United Kingdom of Great Britain and Northern Ireland") && c.Year == selectedYear){
          filteredGeoDataId.push(geoData.objects.countries.geometries.indexOf(d));
          data_process(d, c);
        } else if (d.properties.name == "Syria" &&  c.Country.includes("Syrian Arab Republic") && c.Year == selectedYear){
          filteredGeoDataId.push(geoData.objects.countries.geometries.indexOf(d));
          data_process(d, c);
        } else if (d.properties.name == "Solomon Is." &&  c.Country.includes("Solomon Islands") && c.Year == selectedYear){
          filteredGeoDataId.push(geoData.objects.countries.geometries.indexOf(d));
          data_process(d, c);
        } else if (d.properties.name == "Macedonia" &&  c.Country.includes("The former Yugoslav republic of Macedonia") && c.Year == selectedYear){
          filteredGeoDataId.push(geoData.objects.countries.geometries.indexOf(d));
          data_process(d, c);
        } else if (d.properties.name == "Moldova" &&  c.Country.includes("Republic of Moldova") && c.Year == selectedYear){
          filteredGeoDataId.push(geoData.objects.countries.geometries.indexOf(d));
          data_process(d, c);
        } else if (d.properties.name == "Bosnia and Herz." &&  c.Country.includes("Bosnia and Herzegovina") && c.Year == selectedYear){
          filteredGeoDataId.push(geoData.objects.countries.geometries.indexOf(d));
          data_process(d, c);
        } else if (d.properties.name == "Venezuela" &&  c.Country.includes("Venezuela (Bolivarian Republic of)") && c.Year == selectedYear){
          filteredGeoDataId.push(geoData.objects.countries.geometries.indexOf(d));
          data_process(d, c);
        }
      })
    // }
  });

  const geoMap = new GeoMap({ 
    parentElement: '#map'
  }, data[0]);

  const geoPlot = new ScatterPlot({ 
    parentElement: '#scatterplot'
  }, data[0]);

})
.catch(error => console.error(error));

function data_process(d, c){
  d.properties.life_expectancy = +c.Life_expectancy;
  d.properties.Population = +c.Population;
  d.properties.GDP = +c.GDP;
  d.properties.Status = c.Status;
}
