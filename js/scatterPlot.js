class ScatterPlot {
  /**
   * Class constructor with basic configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 800,
      containerHeight: _config.containerHeight || 400,
      margin: _config.margin || { top: 20, right: 50, bottom: 100, left: 50 },
      tooltipPadding: 10,
      legendBottom: 50,
      legendLeft: 50,
      legendRectHeight: 12,
      legendRectWidth: 150
    }
    this.data = _data.objects.countries.geometries;
    this.initVis();
  }

  initVis() {
    // Create SVG area, initialize scales and axes
    let vis = this;

    // Calculate inner chart size. Margin specifies the space around the actual chart.
    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    vis.xScale = d3.scaleLinear()
      .range([0, vis.width]);

    vis.yScale = d3.scaleLinear()
      .range([vis.height, 0]);

    // Initialize axes
    vis.xAxis = d3.axisBottom(vis.xScale)
      .ticks(6)
      //  .tickSize(-vis.height - 10)
      //  .tickSizeOuter(0)
      .tickPadding(10)
      .tickFormat(d => d);

    vis.yAxis = d3.axisLeft(vis.yScale)
      .ticks(6)
      //  .tickSize(-vis.width - 10)
      .tickPadding(10);

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement).append('svg')
      .attr('class', 'scatter-plot')
      .attr('width', vis.config.containerWidth)
      .attr('height', vis.config.containerHeight);

    // Append group element that will contain our actual chart 
    // and position it according to the given margin config
    vis.chart = vis.svg.append('g')
      .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart.append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', `translate(0,${vis.height})`);

    // Append y-axis group
    vis.yAxisG = vis.chart.append('g')
      .attr('class', 'axis y-axis');

    // Append both axis titles
    vis.chart.append('text')
      .attr('class', 'axis-title')
      .attr('y', vis.height - 15)
      .attr('x', vis.width + 10)
      .attr('dy', '3.71em')
      .style('text-anchor', 'end')
      .text('Life Expectancy');

    vis.svg.append('text')
      .attr('class', 'axis-title')
      .attr('x', 0)
      .attr('y', 0)
      .attr('dy', '.91em')
      .text('GDP');

    vis.updateVis();
  }

  updateVis() {
    // Prepare data and scales
    let vis = this;

    // Specificy accessor functions
    vis.xValue = d => d.properties.life_expectancy;
    vis.yValue = d => d.properties.GDP;

    // Set the scale input domains
    vis.xScale.domain([0, d3.max(vis.data, vis.xValue)]);
    vis.yScale.domain([0, d3.max(vis.data, vis.yValue)]);

    vis.renderVis();
  }

  renderVis() {
    // Bind data to visual elements, update axes
    let vis = this;
    const default_option = "All";
    vis.add_mean_line();

    vis.add_circles(default_option);

    // Select the drop-down menu element
    const dropdown = d3.select("select");

    // Attach an event listener to the drop-down menu
    dropdown.on("change", function () {
      // Get the selected option
      const selectedOption = d3.select(this).property("value");
      vis.add_circles(selectedOption);
      let mean = d3.mean(vis.data.filter(d=>d.properties.Status == selectedOption), d => d.properties.GDP);
      vis.svg.selectAll('.mean-line')
      .attr("x1", vis.config.margin.left)
      .attr("y1", vis.yScale(mean))
      .attr("x2", vis.config.containerWidth)
      .attr("y2", vis.yScale(mean));

      vis.svg.selectAll('.mean-label')
      .attr("x", vis.config.margin.left + 10) 
      .attr("y", vis.yScale(mean) - 10) 
      .text("Mean GDP/Capita: "+mean);
    });
    // Update the axes/gridlines
    // We use the second .call() to remove the axis and just show gridlines
    vis.xAxisG
      .call(vis.xAxis)
      .call(g => g.select('.domain').remove());

    vis.yAxisG
      .call(vis.yAxis);
    //  .call(g => g.select('.domain').remove());
  }

  add_circles(selectedOption) {
    let vis = this;

    const circles = vis.chart.selectAll('.point')
      .data(selectedOption === "All" ? vis.data.filter(d => d.properties.GDP) : vis.data.filter(d => d.properties.GDP && d.properties.Status == selectedOption))
      .join('circle')
      .attr('class', 'point')
      .attr('r', 10)
      .attr('cy', d => vis.yScale(vis.yValue(d)))
      .attr('cx', d => vis.xScale(vis.xValue(d)))
      .attr('fill', '#217dee')
      .attr('opacity', 0.7);

    // Tooltip event listeners
    circles
      .on('mouseover', (event, d) => {
        d3.select('#tooltip')
          .style('display', 'block')
          .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')
          .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
          .html(`
                  <div class="tooltip-title"><strong>${d.properties.name}</strong></div>
                  <ul>
                    <li>Life Expectancy: ${d.properties.life_expectancy}</li>
                    <li>GDP: ${d.properties.GDP}</li>
                  </ul>
            `);
      })
      .on('mouseleave', () => {
        d3.select('#tooltip').style('display', 'none');
      });

    circles
      .on('click', function (event, d) {

        const isActive = d3.select(this).classed('selected');
        d3.select(this).classed('selected', !isActive);

        //Add text label annotation with the average accuracy of that trial

      });
  }

  add_mean_line() {
    let vis = this;
    //Add text label annotation with the average accuracy of that trial
    let mean = d3.mean(vis.data, d => d.properties.GDP);
    console.log(mean)

    const maxLE = d => {
      return d.reduce((acc, curr) => {
        return (curr.properties.life_expectancy > acc.properties.life_expectancy) ? curr : acc;
      });
    };

    let max_le = maxLE(vis.data).properties.life_expectancy;

    let mean_line = vis.svg.append("line")
      .attr('class', 'mean-line')
      .attr("x1", vis.config.margin.left)
      .attr("y1", vis.yScale(mean))
      .attr("x2", vis.config.containerWidth)
      .attr("y2", vis.yScale(mean))
      .attr("stroke", "blue")
      .attr("stroke-width", 2);

    let mean_text = vis.svg.append("text")
      .attr('class', 'mean-label')
      .attr("x", vis.config.margin.left + 10) 
      .attr("y", vis.yScale(mean) - 10) 
      .text("Mean GDP/Capita: "+mean)
      .attr("font-size", "14px")
      .attr("fill", "blue");

  }
}