class GeoMap {
  /**
   * Class constructor with basic configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 800,
      containerHeight: _config.containerHeight || 700,
      margin: _config.margin || {top: 0, right: 0, bottom: 0, left: 0},
      tooltipPadding: 10,
      legendBottom: 50,
      legendLeft: 50,
      legendRectHeight: 12, 
      legendRectWidth: 150
    }
    this.data = _data;
    this.initVis();
  }
  
  /**
   * We initialize scales/axes and append static elements, such as axis titles.
   */
  initVis() {
    let vis = this;

    // Calculate inner chart size. Margin specifies the space around the actual chart.
    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement).append('svg')
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight);

    // Append group element that will contain our actual chart 
    // and position it according to the given margin config
    vis.chart = vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    // Initialize projection and path generator
    vis.projection = d3.geoMercator();
    vis.geoPath = d3.geoPath().projection(vis.projection);

    vis.colorScale = d3.scaleLinear()
        .range(['#FFFFF0', '#006400'])
        .interpolate(d3.interpolateHcl);


    // Initialize gradient that we will later use for the legend
    vis.linearGradient = vis.svg.append('defs').append('linearGradient')
        .attr("id", "legend-gradient");

    // Append legend
    vis.legend = vis.chart.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${vis.config.legendLeft},${vis.height - vis.config.legendBottom})`);
    
    vis.legendRect = vis.legend.append('rect')
        .attr('width', vis.config.legendRectWidth)
        .attr('height', vis.config.legendRectHeight);

    vis.legendTitle = vis.legend.append('text')
        .attr('class', 'legend-title')
        .attr('dy', '.35em')
        .attr('y', -10)
        .text('Pop. density per square km')

    vis.updateVis();
  }

  updateVis() {
    let vis = this;

    const popDensityExtent = d3.extent(vis.data.objects.countries.geometries, d => d.properties.life_expectancy);
    
    // Update color scale
    vis.colorScale.domain(popDensityExtent);

    // Define begin and end of the color gradient (legend)
    vis.legendStops = [
      { color: '#FFFFF0', value: popDensityExtent[0], offset: 0},
      { color: '#006400', value: popDensityExtent[1], offset: 100},
    ];

    vis.renderVis();
  }


  renderVis() {
    let vis = this;

    // Convert compressed TopoJSON to GeoJSON format
    const countries = topojson.feature(vis.data, vis.data.objects.countries)

    // Defines the scale of the projection so that the geometry fits within the SVG area
    vis.projection.fitSize([vis.width, vis.height], countries);

    // Append world map
    const countryPath = vis.chart.selectAll('.country')
        .data(countries.features)
      .join('path')
        .attr('class', 'country')
        .attr('data-clickable', true)
        .attr('d', vis.geoPath)
        .attr('fill', d => {
          if (d.properties.life_expectancy) {
            return vis.colorScale(d.properties.life_expectancy);
            // return 'url(#lightstripe)';
          } else {
            if (d.properties.name == "Antarctica"){
              return 'none';
            }
            return '#cccccc';
          }
        });

    let dataMissingArea = vis.chart.selectAll('.country')
    .filter(d=>!d.properties.life_expectancy)
    .attr('data-clickable', false)
    .classed("unclickable", true);

    countryPath.filter('[data-clickable="true"]')
    .classed("unclickable", false)
        .on('mousemove', (event,d) => {
          const lifeExpectancy = d.properties.life_expectancy ? `Life expectancy: <strong>${d.properties.life_expectancy}</strong>` : 'No data available'; 
          const population = d.properties.Population ? `Population: <strong>${d.properties.Population}</strong>` : 'No data available'; 
          const gdpScore = d.properties.GDP ? `GDP: <strong>${d.properties.GDP}</strong>` : 'No data available'; 
          const countrySyatus = d.properties.Status ? `<i>Status: ${d.properties.Status}</i>` : '<i>No data available</i>'; 
          d3.select('#tooltip')
            .style('display', 'block')
            .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
            .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
            .html(`
              <div class="tooltip-title">${d.properties.name}</div>
              <div>${countrySyatus}</div>
              <div>${lifeExpectancy}</div>
              <div>${population}</div>
              <div>${gdpScore}</div>
            `);
        })
        .on('mouseleave', () => {
          d3.select('#tooltip').style('display', 'none');
        })
        .on('click', function(event, d) {
          const isActive = d3.select(this).classed('selected');
          d3.select(this).classed('selected', !isActive);
        });

    // Add legend labels
    vis.legend.selectAll('.legend-label')
        .data(vis.legendStops)
      .join('text')
        .attr('class', 'legend-label')
        .attr('text-anchor', 'middle')
        .attr('dy', '.35em')
        .attr('y', 20)
        .attr('x', (d,index) => {
          return index == 0 ? 0 : vis.config.legendRectWidth;
        })
        .text(d => Math.round(d.value * 10 ) / 10);

    // Update gradient for legend
    vis.linearGradient.selectAll('stop')
        .data(vis.legendStops)
      .join('stop')
        .attr('offset', d => d.offset)
        .attr('stop-color', d => d.color);

    vis.legendRect.attr('fill', 'url(#legend-gradient)');
  }
}