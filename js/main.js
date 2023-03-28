/**
 * Load TopoJSON data of the world and the data of the world wonders
 */
 
// Promise.all([
//   d3.json('data/world-110m.json'),
//   d3.csv('data/world_wonders.csv')
// ]).then(data => {
//   data[1].forEach(d => {
//     d.visitors = +d.visitors;
//   })

//   const geoMap = new GeoMap({ 
//     parentElement: '#map'
//   }, data[0], data[1]);
// })
// .catch(error => console.error(error));

let data, lineChart, slider;

d3.csv('data/Life_Expectancy_Data.csv').then(_data => {

  data = _data;

  // Convert columns to numerical values
  data.forEach(d => {
    Object.keys(d).forEach(attr => {
      if (attr != 'Country' && attr != 'Status') {
        d[attr] = +d[attr];
      }
    });
  });

  lineChart = new LineChartE({ parentElement: '#line-chart'}, filter_country(selectedCountry), dispatcher, selectedCountry, selectedYear);
  lineChart.updateVis();

  barChart = new BarChart({ parentElement: '#bar-chart'}, data, dispatcher, selectedCountry, selectedYear);
  barChart.updateVis();
});



//global array to stored all the selected politician
let selectedCountry = ['Canada']
let selectedYear = 2013;
// dispatcher
let dispatcher = d3.dispatch('selectCountries','changeYear','reset', 'unSelectCountries')
// select conuntry event
dispatcher.on('selectCountries', s => {
  selectedCountry.push(s)
  lineChart.updateVis()
  // other charts update
});
// Unselect conuntry event
dispatcher.on('unSelectCountries', s => {
  selectedCountry.splice(selectedCountry.indexOf(s),1)
  lineChart.updateVis()
  // other charts update
});
// Change year event
dispatcher.on('changeYear', year => {
  lineChart.selectedYear = year
  lineChart.updateVis()
  slider.property("value", year);
  // other charts update
});

d3.select("#year_slider").property("value", selectedYear);
slider = d3.select("#year_slider").on("change", function() {
  year = d3.select(this).property("value");
  dispatcher.call('changeYear', null, year)
});

time_button = d3.select("#time_button").on("click", function() {
  autoMoveSlider();
});


// when this function trigger, the range slider would move from left to right in a total of 4 sceonds (the whole range is 2000-2015)
// the year would change accordingly
// the line chart would update accordingly
// After the interval, it would call the changeYear event again to update the line chart
function autoMoveSlider() {
  let year = 2000;
  let timer = setInterval(function() {
    if (year > 2015) {
      clearInterval(timer);
      reset();
    }else{
      dispatcher.call('changeYear', null, year)
      year++;
    }
  }, 4000/16);
}

function reset() {
  selectedCountry = ['Canada']
  selectedYear = 2013;
  lineChart.selectedYear = selectedYear
  lineChart.updateVis()
  slider.property("value", selectedYear);
}

// a helper function to filter the dataset according to the country
// The condition is the selected country
let filter_country = (selectedCountry) => {
  let filteredData = data.filter(d => {
    if(selectedCountry.includes(d.Country)){
      return true
    }else{
      return false
    }
  });
  return filteredData
}

let filter_year = (selectedYear) => {
  let filteredData = data.filter(d => {
    if(d.Year === selectedYear){
      return true
    }else{
      return false
    }
  });
  return filteredData
}

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
