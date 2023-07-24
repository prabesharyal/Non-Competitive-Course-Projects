const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

// Define monthNames array outside the d3.json callback
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Fetch the data and create the heat map
d3.json(url).then(data => {
  const dataset = data.monthlyVariance;
  const baseTemperature = data.baseTemperature;
  
  const width = 1800;
  const height = 800;
  const padding = 50;
  
  const minYear = d3.min(dataset, d => d.year);
  const maxYear = d3.max(dataset, d => d.year);
  const numYears = maxYear - minYear + 1;
  const cellWidth = Math.floor((width - padding * 2) / numYears);
  
  const minTemp = d3.min(dataset, d => baseTemperature + d.variance);
  const maxTemp = d3.max(dataset, d => baseTemperature + d.variance);
  
  const colorScale = d3.scaleSequential(d3.interpolateViridis)
  .domain([maxTemp, minTemp]);
  
  const svg = d3.select('#heatmap')
    .attr('width', width)
    .attr('height', height)
    .style('position', 'relative'); // Add this line for positioning the tooltip
  
  const xScale = d3.scaleLinear()
    .domain([minYear, maxYear])
    .range([padding, width - padding]);
  
  const yScale = d3.scaleBand()
    .domain(monthNames)
    .range([padding, height - padding]);
  
  svg.selectAll('.cell')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('x', d => xScale(d.year))
    .attr('y', d => yScale(monthNames[d.month - 1]))
    .attr('width', cellWidth)
    .attr('height', yScale.bandwidth())
    .attr('class', 'cell')
    .attr('data-month', d => d.month - 1)
    .attr('data-year', d => d.year)
    .attr('data-temp', d => baseTemperature + d.variance)
    .attr('fill', d => colorScale(baseTemperature + d.variance))
    .on('mouseover', handleMouseOver)
    .on('mouseout', handleMouseOut);
  
  // Create x-axis
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
  svg.append('g')
    .attr('id', 'x-axis')
    .attr('transform', `translate(0, ${height - padding})`)
    .call(xAxis);
  
  // Create y-axis
  const yAxis = d3.axisLeft(yScale);
  svg.append('g')
    .attr('id', 'y-axis')
    .attr('transform', `translate(${padding}, 0)`)
    .call(yAxis.tickFormat((d, i) => monthNames[i]));
  
  // Create legend
  const legendWidth = 200;
  const legendHeight = 20;
  const legendX = width / 2 - legendWidth / 2;
  const legendY = height - padding + 30;
  
  const legendScale = d3.scaleLinear()
    .domain([minTemp, maxTemp])
    .range([0, legendWidth]);
  
  const legendAxis = d3.axisBottom(legendScale).ticks(5).tickFormat(d3.format('.1f'));
  
  const legend = svg.append('g')
    .attr('id', 'legend')
    .attr('transform', `translate(${legendX}, ${legendY})`);
  
  legend.selectAll('.legend-rect')
    .data(d3.range(minTemp, maxTemp, (maxTemp - minTemp) / 50))
    .enter()
    .append('rect')
    .attr('x', (d, i) => i * (legendWidth / 50))
    .attr('y', 0)
    .attr('width', legendWidth / 50)
    .attr('height', legendHeight)
    .attr('fill', d => colorScale(d));
  
  legend.append('g')
    .attr('transform', `translate(0, ${legendHeight})`)
    .call(legendAxis);
  
});

function handleMouseOver(event, d) {
  const tooltip = d3.select('#tooltip');
  tooltip
    .style('display', 'inline')
    .attr('data-year', d.year)
    .html(
      `<strong>${d.year} - ${monthNames[d.month - 1]}</strong><br/>
      Temperature: ${(d.baseTemperature + d.variance).toFixed(2)}℃<br/>
      Variance: ${d.variance.toFixed(2)}℃`
    )
    .style('left', event.pageX + 'px')
    .style('top', event.pageY - 100 + 'px');
}

function handleMouseOut() {
  const tooltip = d3.select('#tooltip');
  tooltip.style('display', 'none');
}
