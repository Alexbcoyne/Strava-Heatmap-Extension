document.addEventListener('DOMContentLoaded', function () {
    // fetch start_date(date) and movingTime(count)
    
    // const heatmapData = [ { date: new Date(1672531200 * 1000), count: 100 }, ]; // DATA EXAMPLE
    const heatmapData = [];
    getData(heatmapData);
    // authorize -> get start_date/moving_time = heatmapData -> createHeatmap()

    // create heatmap
    createHeatmap(heatmapData);
});

function getData(data) {
    fetch('https://www.strava.com/api/v3/athlete/activities?per_page=200', {
        headers: {
            Authorization: `Bearer ${config.accessToken}`
        }
    })
        .then(response => response.json())
        .then(data => {
            // Invoke the callback function with the activities data
            callback(data);
        })
        .catch(error => {
            console.error('Error fetching activities:', error);
        });
}

function createHeatmap(heatmapData) {
    // heatmap dimensions
    const width = 570;
    const height = 120;

    // create svg
    const svg = d3.select('#heatmap').append('svg').attr('width', width).attr('height', height);

    // configure calendar options
    const options = {
        cellSize: 10,
        cellPadding: 1,
        startDate: new Date().getFullYear() + '-01-01',
        endDate: new Date().getFullYear() + '-12-31',
        colorRange: ['#DBDBDB', '#FFD3C0', '#FFA37C', '#FF7E46', '#FC4C02'],
        tooltipUnit: 'minutes'
    };

    const maxCount = Math.max(...heatmapData.map(d => d.count));
    
    // build calendar heatmap
    svg.selectAll("rect")
        .data(d3.timeDays(new Date(options.startDate), new Date(options.endDate)))
        .enter()
        .append("rect")
        .attr("width", options.cellSize - options.cellPadding)
        .attr("height", options.cellSize - options.cellPadding)
        .attr("x", function (d) {
            const weekIndex = d3.timeWeek.count(d3.timeYear(d), d);
            const dayIndex = d.getDay();
            return weekIndex * (options.cellSize + options.cellPadding) + options.cellPadding;
        })
        .attr("y", function (d) {
            const weekIndex = d3.timeWeek.count(d3.timeYear(d), d);
            const dayIndex = d.getDay();
            return dayIndex * (options.cellSize + options.cellPadding) + options.cellPadding;
        })
        .attr("fill", function (d) {
            const date = formatDate(d);
            const dataPoint = heatmapData.find(data => formatDate(data.date) === date);
            const count = dataPoint ? dataPoint.count : 0;
            const colorIndex = Math.floor((count / maxCount) * (options.colorRange.length - 1));
            return options.colorRange[colorIndex];
        })
        .append("title")
        .text(function (d) {
            const date = formatDate(d);
            const dataPoint = heatmapData.find(data => formatDate(data.date) === date);
            const count = dataPoint ? dataPoint.count : 0;
            return `${date}: ${count} ${options.tooltipUnit}`;
        });
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}