class BarChart   {

    
    constructor(_config, _data, dispatcher, selectedCountry, selectedYear) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 1000,
            containerHeight: _config.containerHeight || 300,
            margin: _config.margin || {
                top: 25,
                right: 70,
                bottom: 50,
                left: 50
            }
        }
        this.data = _data;
        this.dispatcher = dispatcher;
        this.selectedCountry = selectedCountry;
        this.selectedYear = selectedYear;
        this.initVis();
    }

    /**
   * Initialize scales/axes and append static elements, such as axis titles
   */
  initVis() {
    let vis = this;

    // Calculate inner chart size. Margin specifies the space around the actual chart.
    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;


    // use d3 to group the data according to the year
    // and then get the country with the highest life expectancy
    // return an array of objects that contains the country, the year and the life expectancy
    vis.groupByYear = d3.group(vis.data, d => d.Year);
    vis.maxLifeExpectancy = [];
    vis.groupByYear.forEach((value, key) => {
        let max = d3.max(value, d => d.Life_expectancy);
        let country = value.find(d => d.Life_expectancy === max);
        vis.maxLifeExpectancy.push({
            country: country.Country,
            year: key,
            life_expectancy: country.Life_expectancy
        });
    });

    console.log(vis.groupByYear);
    console.log(vis.maxLifeExpectancy);

    vis.data = vis.maxLifeExpectancy;

    // Initialize scales and axes
    // Important: we flip array elements in the y output range to position the rectangles correctly
    vis.yScale = d3.scaleLinear()
      .range([vis.height, 0])

    vis.xScale = d3.scaleBand()
      .range([0, vis.width])
      .paddingInner(0.2);

    vis.xAxis = d3.axisBottom(vis.xScale)
      .tickSizeOuter(0);

    vis.yAxis = d3.axisLeft(vis.yScale)
      .ticks(6)
      .tickSizeOuter(0)

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement)
      .attr('width', vis.config.containerWidth)
      .attr('height', vis.config.containerHeight);

    // SVG Group containing the actual chart; D3 margin convention
    vis.chart = vis.svg.append('g')
      .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart.append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', `translate(0,${vis.height})`);

    // Append y-axis group
    vis.yAxisG = vis.chart.append('g')
      .attr('class', 'axis y-axis');
  }

  /**
   * Prepare data and scales before we render it
   */
  updateVis() {
    let vis = this;

    // Reverse column order depending on user selection
    if (vis.config.reverseOrder) {
      vis.data.reverse();
    }

    // Specificy x- and y-accessor functions
    vis.xValue = d => d.year;
    vis.yValue = d => d.life_expectancy;
    vis.label = d => d.country;

    // Set the scale input domains
    vis.xScale.domain(d3.reverse(vis.data.map(vis.xValue)));
    vis.yScale.domain([75,100]);

    vis.renderVis();
    console.log(d3.reverse(vis.data.map(vis.xValue)))
  }

  /**
   * Bind data to visual elements
   */
  renderVis() {
    let vis = this;

    // Add rectangles
    let bars = vis.chart.selectAll('.bar')
      .data(vis.data, vis.xValue)
      .join('rect');

    bars.style('opacity', 0.5)
      .transition().duration(500)
      .style('opacity', 1)
      .attr('class', 'bar')
      .attr('x', d => vis.xScale(vis.xValue(d)))
      .attr('width', vis.xScale.bandwidth())
      .attr('height', d => vis.height - vis.yScale(vis.yValue(d)))
      .attr('y', d => vis.yScale(vis.yValue(d)))
        .attr('fill', d => {
            console.log(d.year, vis.selectedYear)
            if (d.year === +vis.selectedYear) {
                return 'red';
            } else {
                return 'steelblue';
            }
        })



    // Add labels
    let labels = vis.chart.selectAll('.label')
        .data(vis.data, vis.xValue)
        .join('text');
    
    labels.style('opacity', 0.5)
        .transition().duration(1000)
        .style('opacity', 1)
        .attr('class', 'label')
        .attr('x', d => vis.xScale(vis.xValue(d)) + vis.xScale.bandwidth() / 2)
        .attr('y', d => vis.yScale(vis.yValue(d)) - 5)
        .text(d => vis.label(d))
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px');
        


    // Update axes
    vis.xAxisG
      .transition().duration(1000)
      .call(vis.xAxis);

    vis.yAxisG.call(vis.yAxis);
  }


}