# devmgr-web

**NOTE: Project is in early stage of development**

Keep up on your team's GitHub activity with with aggregate and individual reports.

Data reported includes a user's:

- Contribution calendar
- Pull requests
- Issues
- Issue comments

In addition to aggregating this data for multiple users, this tool also includes charts,
4-week rolling averages of activity, and sortable tables.

## Using

`devmgr-web` can be ran locally or at https://devmgr.jecko.dev/

All API calls are made from the browser and all data is kept in the browser - this is a
single-page web app with only the target GitHub instance as the back end.

### Local build

Pre-reqs:

- `yarn`
- `nodejs`

Clone this repository, run `yarn`, then run `yarn start`. Once build is complete, the app can be opened at `localhost:1234`

### Configuration

Navigate to https://devmgr.jecko.dev/settings and supply the api endpoint of the GitHub instance,
a personal access token (no additional scopes needed), and enter a few github ids to get reports for.

Click `Save` and then navigate to `Overview`
