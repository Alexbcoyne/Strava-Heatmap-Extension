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
    const width = 600;
    const height = 125;

    // create svg
    const svg = d3.select('#heatmap').append('svg').attr('width', width).attr('height', height);

    // configure calendar options
    const options = {
        cellSize: 10,
        cellPadding: 1,
        startDate: getOneYearAgoDate(),
        endDate: new Date(),
        colorRange: ['#FFD3C0', '#FFBA9C', '#FFA37C', '#FF8C5C', '#FF7E46', '#FF6B2B', '#FC4C02'],
        tooltipUnit: 'minutes'
    };

    const minCount = Math.min(...heatmapData.map(d => d.count));
    const maxCount = Math.max(...heatmapData.map(d => d.count));

    // Calculate the number of weeks between the start and end dates
    const numWeeks = d3.timeWeeks(options.startDate, options.endDate).length;

    // Calculate the cell size based on the available width and number of weeks
    const cellSize = Math.floor(width / (numWeeks + 1)); // +1 to accommodate the label column

    // build calendar heatmap
    svg.selectAll("rect")
        .data(d3.timeDays(options.startDate, options.endDate))
        .enter()
        .append("rect")
        .attr("width", cellSize - options.cellPadding)
        .attr("height", cellSize - options.cellPadding)
        .attr("x", function(d) {
            const dayIndex = d3.timeDay.count(options.startDate, d);
            const weekIndex = Math.floor(dayIndex / 7); // Group cells by weeks
            return (weekIndex + 1) * cellSize; // +1 to accommodate the label column
        })
        .attr("y", function(d) {
            return d.getDay() * cellSize;
        })
        .attr("fill", function (d) {
            const date = formatDate(d);
            const dataPoint = heatmapData.find(data => formatDate(data.date) === date);
            const count = dataPoint ? dataPoint.count : 0;

            if (count === 0) {
                return "#DBDBDB";
            } else {
                const colorIndex = Math.floor(((count - minCount) / (maxCount - minCount)) * (options.colorRange.length - 1));
                return options.colorRange[colorIndex];
            }
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

function getOneYearAgoDate() {
    const today = new Date();
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    return oneYearAgo;
}