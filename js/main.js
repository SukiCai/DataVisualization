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

