# Strava Activity Heatmap Chrome Extension
## Work in Progress..

This extension project will gather activity data from strava and display it in a calendar heatmap format like that of GitHub's contribution wall.

## To Do
- [x] Inject a placeholder heatmap onto the page
- [ ] Add button to popup to authorize user
- [x] Create getData() function to retrieve start_date & moving_time elements from the athlete's activity data.
- [x] Create formatData() function to format activity data. <br>
Example: `{ date: new Date(1672531200 * 1000), count: 100 },`
- [x] Send newly retrieved data into createHeatmap() function.

## Roadmap
- [ ] Develop a backend service to run the authentication scripts to hide keys from frontend.
- [ ] Add the heatmap to the contentScript.js file, so the data will be show on strava.com/athlete page instead of showing on popup.html
- [ ] Add options to modify layout, specified acitivities, date ranges, etc.