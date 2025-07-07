import { getBootstrapColorForName, bootstrapColorHexMap } from './utils.js';

// Load the Google Charts corechart package
google.charts.load('current', { packages: ['corechart'] });

// Once the chart is ready to use, check for existing data and draw chart
google.charts.setOnLoadCallback(() => {
  if (window.reservationCounts) {
    drawChart(window.reservationCounts);
  }
});

export function drawChart(counts) {
  const chartContainer = document.getElementById('chart_div');

  // Clear previous content
  chartContainer.innerHTML = '';

  //Check for empty data
  if (!counts || Object.keys(counts).length === 0) {
    chartContainer.innerHTML = `
      <div class="text-muted text-center mt-3">
        <i class="bi bi-bar-chart fs-3"></i><br/>
        No reservation data to display.
      </div>
    `;
    return;
  }

  // Build chart data
  const chartData = google.visualization.arrayToDataTable([
    ['Name', 'Count', { role: 'style' }],
    ...Object.entries(counts).map(([name, count]) => {
      const colorKey = getBootstrapColorForName(name);
      const hex = bootstrapColorHexMap[colorKey] || '#000';
      return [name, count, `color: ${hex}`];
    }),
  ]);

  // Chart display options
  const options = {
    title: 'Reservations per Person',
    legend: 'none',
    hAxis: { title: 'Name' },
    vAxis: { title: 'Reservations', minValue: 0 },
  };

  // Draw chart in the container
  const chart = new google.visualization.ColumnChart(chartContainer);
  chart.draw(chartData, options);
}


google.charts.setOnLoadCallback(() => {
  if (window.reservationCounts) {
    drawChart(window.reservationCounts);
  }
});
