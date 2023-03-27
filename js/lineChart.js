class LineChartE {

    
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
     * Initialize scales/axes and append static chart elements
     */
    initVis() {
        let vis = this;

        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        vis.xScale = d3.scaleLinear()
            .range([0, vis.width]);

        vis.yScale = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.colorPalette = d3.scaleOrdinal(d3.schemeCategory10);

        // select the year range slider
        // make it the same width as the chart
        vis.slider = d3.select('#year_slider')
            .style('width', `${vis.width + 15}px`)
            .style('left', `${vis.config.margin.left}px`)
            .style('top', `${vis.config.containerHeight + 20}px`);

        // Initialize axes
        vis.xAxis = d3.axisBottom(vis.xScale)
            .ticks(15)
            .tickSizeOuter(0)
            .tickPadding(10)
            .tickFormat(d => parseInt(d));

        vis.yAxis = d3.axisLeft(vis.yScale)
            .ticks(4)
            .tickSizeOuter(0)
            .tickPadding(10);

        // Define size of SVG drawing area
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        // Append group element that will contain our actual chart (see margin convention)
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

        // Append empty x-axis group and move it to the bottom of the chart
        vis.xAxisG = vis.chart.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0,${vis.height})`);

        // Append y-axis group
        vis.yAxisG = vis.chart.append('g')
            .attr('class', 'axis y-axis')
            .call(vis.yAxis);;

        // We need to make sure that the tracking area is on top of other chart elements
        vis.chartArea = vis.chart.append('g');

        // Append x-axis label
        vis.xAxisLabel = vis.chart.append('text')
            .attr('class', 'axis-label')
            .attr('x', vis.width / 2)
            .attr('y', vis.height + 40)
            .attr('text-anchor', 'middle')
            .text('Year');
            
        // Append y-axis label
        vis.yAxisLabel = vis.chart.append('text')   
            .attr('class', 'axis-label')
            .attr('transform', 'rotate(-90)')
            .attr('x', -vis.height / 2)
            .attr('y', -40)
            .attr('text-anchor', 'middle')
            .text('Life expectancy (years)');


        // Empty tooltip group (hidden by default)
        vis.tooltip = vis.chart.append('g')
            .attr('class', 'tooltip')
            .style('display', 'none');

    }

    /**
     * Prepare the data and scales before we render it.
     */
    updateVis() {
        let vis = this;

        vis.xValue = d => d.Year;
        vis.yValue = d => d.Life_expectancy; 

        vis.line = d3.line()
            .x(d => vis.xScale(vis.xValue(d)))
            .y(d => vis.yScale(vis.yValue(d)));

        // Set the scale input domains
        vis.xScale.domain(d3.extent(vis.data, vis.xValue));
        vis.yScale.domain(d3.extent(vis.data, vis.yValue));
        vis.colorPalette.domain(vis.data.map(d => d.Country));

        vis.renderVis();
    }

    /**
     * Bind data to visual elements
     */
    renderVis() {
        let vis = this;

        // Add line path for each country in the given data
        for (let country of vis.selectedCountry) {
            vis.chartArea.selectAll('.chart-line ' + country)
                .data([vis.filterDataByCountry(country)])
                .join('path')
                .attr('class', 'chart-line ' + country)
                .attr('d', vis.line)
                .attr('stroke', vis.colorPalette(country))
                .attr('fill', 'none')
                .attr('stroke-width', 2);
        }

        // On top of the chart add a html legend
        // The legend have identify the color of each line path
        vis.legend = d3.select('.legend')
            .style('top', '0px')
            .style('left', `${vis.width + vis.config.margin.left + 20}px`)
            .selectAll('.legend-item')
            .data(vis.selectedCountry, d => d)
            .join('li')
            .attr('class', 'legend-item')
            .style('color', d => vis.colorPalette(d))
            .text(d => d);

        
        // Add a verticle rectangle to indicated the current year
        vis.chartArea.selectAll('.year-line')
            .data([vis.selectedYear])
            .join('rect')
            .attr('class', 'year-line')
            .attr('x', d => vis.xScale(d)-5)
            .attr('width', 10)
            .attr('height', vis.height)
            .attr('y', 0)
            .attr('stroke', 'black')
            .attr('opacity', '0.3')
        
        // Update the axes
        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);
    }


    // a function that return the data that have the given country parameter
    filterDataByCountry(country) {
        let vis = this;
        let filteredData = vis.data.filter(d => d.Country == country);
        return filteredData;
    }
}