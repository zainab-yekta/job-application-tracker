# Job Application Tracker

A React app for keeping track of job applications. You log each application, move it through its stages (Applied, Interview, Rejected, Offer, Accepted Offer), get a reminder before interviews, and see how your search is going on an analytics page. Everything runs in the browser.

**[Live demo](https://zainab-yekta.github.io/job-application-tracker/)** · **[Source code](https://github.com/zainab-yekta/job-application-tracker)**

## Features

**Tracking**
- Add, edit and delete applications with title, company, location, date and status
- Interview time field that appears when the status is Interview
- Search by job title or company, filter by status or by date
- Color coded status on each card
- Confirmation before deleting

**Reminders**
- Banner on the dashboard for interviews coming up today or tomorrow, using the interview date and time
- Message when an application moves to Offer or Accepted Offer, with the option to clear the list once you've accepted a job

**Analytics**
- Bar chart or pie chart of interviews, rejections and offers (switchable)
- Line chart of interviews over time
- Totals and the date range of your applications
- Suggestions based on your numbers, for example a nudge to follow up when several applications are still waiting

**Export**
- Download all applications as an Excel file or a PDF report

**Other**
- Register and log in (a local demo, see the notes below), with the dashboard and analytics pages only reachable when logged in
- Login stays active after a page refresh
- Responsive layout with a collapsible menu on small screens
- Small help chatbot that answers a few common questions about the app

## Tech stack

| Area | Tools |
|------|-------|
| UI | React 19 with hooks |
| Routing | React Router 7 (HashRouter, so it works on GitHub Pages) |
| Charts | Recharts |
| Export | ExcelJS, jsPDF with jspdf-autotable, FileSaver |
| Storage | Browser localStorage |
| Build | Create React App (react-scripts) |
| Hosting | GitHub Pages via gh-pages |

## Run locally

You need Node.js 18 or newer.

```bash
git clone https://github.com/zainab-yekta/job-application-tracker.git
cd job-application-tracker
npm install
npm start
```

The app opens at http://localhost:3000.

## Scripts

| Command | What it does |
|---------|--------------|
| `npm start` | Starts the development server |
| `npm run build` | Builds the production version into `build/` |
| `npm test` | Runs the test runner |
| `npm run deploy` | Builds and publishes to GitHub Pages |

## Project structure

```
src/
  components/
    Chatbot.js          help chatbot in the corner of every page
    JobForm.js          add and edit form
    JobList.js          application cards
    Navbar.js           top navigation with mobile menu
    ProtectedRoute.js   sends logged out visitors to the login page
  pages/
    Home.js
    Dashboard.js        tracker, search, filters, reminders, export
    Analytics.js        charts, totals and suggestions
    About.js
    Login.js
    Register.js
  utils/
    FormatDate.js       parses stored dates in local time and formats them for display
  App.js                routes and shared application state
  index.js
```

## Notes

- There is no server. Applications and the login are saved in your browser's localStorage, so they stay after a refresh or restart but only on that browser. Clearing site data removes them.
- The login is a front end demo. The account is stored in the browser and is not secure, so don't use a real password.
- Dates are stored as `YYYY-MM-DD` and read in your local time zone.

## License

MIT, see [LICENSE](LICENSE).

## Author

Built by **Zeinab Ramezani Yekta**
[LinkedIn](https://linkedin.com/in/zeinab-ramezani) · [GitHub](https://github.com/zainab-yekta)
