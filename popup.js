document.addEventListener('DOMContentLoaded', function () {
    getData();
});

function getData() {
    // fetch request to get strava athlete activity data
    const url = `https://www.strava.com/api/v3/athlete/activities?access_token=${config.accessToken}`;
    fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error (`Request failed with status code ${response.status}`);
        }
    })
    .then(data => {
        const activityData = data.map(activity => ({
            date: new Date(activity.start_date).getTime(),
            count: activity.moving_time / 60
        }));
        console.log(activityData);
        createHeatmap(activityData);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function createHeatmap(heatmapData) {
    console.log(heatmapData);

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

function formatDate(epoch) {
    const date = new Date(epoch);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}