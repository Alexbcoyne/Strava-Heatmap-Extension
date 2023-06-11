# Strava Activity Heatmap Chrome Extension
## Work in Progress..

This extension project will gather activity data from strava and display it in a calendar heatmap format like that of GitHub's contribution wall.

## To Do
- [ ] Inject a placeholder heatmap onto the page
- [ ] Add button to popup to authorize user
- [ ] Create isExpired() function to check if access token is expired.
- [ ] Create getData() function to retrieve start_date & moving_time elements from the athlete's activity data.
- [ ] Create formatData() function to format activity data. <br>
Example: `{ date: new Date(1672531200 * 1000), count: 100 },`
- [ ] Send newly retrieved data into createHeatmap() function.
- [ ] Develop a backend service to run the authentication scripts to hide keys from frontend.
