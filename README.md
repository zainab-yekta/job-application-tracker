# Job Application Tracker

[![CI](https://github.com/zainab-yekta/job-application-tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/zainab-yekta/job-application-tracker/actions/workflows/ci.yml)

A React app for keeping track of job applications. You log each application, move it through its stages (Applied, Interview, Rejected, Offer, Accepted Offer), get a reminder before interviews, and see how your search is going on an analytics page. Everything runs in the browser.

**[Live demo](https://zainab-yekta.github.io/job-application-tracker/)** · **[Source code](https://github.com/zainab-yekta/job-application-tracker)**

## Features

**Tracking**

- Add, edit and delete applications with title, company, location, the date you applied and a status
- Interview date and time fields that appear when the status is Interview. A past interview stays on record after the job moves on to Offer or Rejected
- Search by job title or company, filter by status or by date
- Color coded status on each card
- Form errors shown next to the form, and a confirmation before deleting

**Reminders**

- Banner on the dashboard for interviews coming up today or tomorrow, based on the interview date and time
- Message when an application moves to Offer or Accepted Offer, with the option to clear the list once you've accepted a job

**Analytics**

- Bar chart or pie chart of interviews, rejections and offers (switchable)
- Line chart of interviews over time
- Totals and the date range of your applications
- Suggestions based on your numbers, for example a nudge to follow up when several applications are still waiting

**Export**

- Download all applications as an Excel file or a PDF report, with formatted dates

**Other**

- Register and log in (a local demo, see the notes below), with the dashboard and analytics pages only reachable when logged in
- Login stays active after a page refresh
- Responsive layout with a collapsible menu on small screens
- Labels for screen readers and keyboard access to the menu and chatbot
- Help chatbot that answers questions about adding jobs, reminders, exports, analytics and where data is kept

## Tech stack

| Area    | Tools                                                    |
| ------- | -------------------------------------------------------- |
| UI      | React 19 with hooks                                      |
| Routing | React Router 7 (HashRouter, so it works on GitHub Pages) |
| Charts  | Recharts                                                 |
| Export  | ExcelJS, jsPDF with jspdf-autotable, FileSaver           |
| Storage | Browser localStorage                                     |
| Build   | Vite                                                     |
| Testing | Vitest, React Testing Library, jsdom                     |
| Quality | ESLint, Prettier, GitHub Actions                         |
| Hosting | GitHub Pages                                             |

The Analytics page and the export libraries are loaded only when they're needed, so the first page load is about 245 kB (78 kB gzipped).

## Run locally

You need Node.js 20.19 or newer.

```bash
git clone https://github.com/zainab-yekta/job-application-tracker.git
cd job-application-tracker
npm install
npm run dev
```

The app opens at http://localhost:3000/job-application-tracker/.

## Scripts

| Command                | What it does                                          |
| ---------------------- | ----------------------------------------------------- |
| `npm run dev`          | Starts the development server (`npm start` works too) |
| `npm run build`        | Builds the production version into `dist/`            |
| `npm run preview`      | Serves the production build locally                   |
| `npm test`             | Runs the tests once                                   |
| `npm run test:watch`   | Runs the tests and re-runs them on every change       |
| `npm run lint`         | Checks the code with ESLint                           |
| `npm run format`       | Formats the code with Prettier                        |
| `npm run format:check` | Checks formatting without changing files              |
| `npm run deploy`       | Builds and publishes to the `gh-pages` branch         |

## Tests

```bash
npm test
```

The tests cover date parsing and formatting, interview reminders, search and filters, the analytics suggestions, migration of data saved by older versions, the chatbot replies, the job form, and the main flows in the app (redirecting logged out visitors, staying logged in, adding a job, logging in).

## Continuous integration and deployment

Two GitHub Actions workflows live in `.github/workflows/`:

- **CI** runs on every push and pull request to `main`. It lints, checks formatting, runs the tests and builds the app.
- **Deploy to GitHub Pages** is started by hand from the Actions tab (Deploy to GitHub Pages, then Run workflow). It runs the checks again and publishes the site only if they pass.

For the deploy workflow to publish, the repository's Pages source must be set to **GitHub Actions** (Settings, Pages, Build and deployment).

## Project structure

```
.github/workflows/      CI and deploy workflows
public/                 favicon, icons and web manifest
src/
  components/
    Chatbot.jsx         help chatbot in the corner of every page
    JobForm.jsx         add and edit form with validation
    JobList.jsx         application cards
    Navbar.jsx          top navigation with mobile menu
    ProtectedRoute.jsx  sends logged out visitors to the login page
    StatusPopup.jsx     message shown for offers
  constants/
    statuses.js         the list of statuses, used everywhere
  hooks/
    useAuth.js          login state that survives a refresh
    useJobs.js          the job list, saved to localStorage
  pages/
    Home.jsx
    Dashboard.jsx       tracker, search, filters, reminders, export
    Analytics.jsx       charts, totals and suggestions
    About.jsx
    Login.jsx
    Register.jsx
  utils/                date formatting, filters, reminders, suggestions,
                        exports, validation, data migration, chatbot replies
  test/setup.js         test setup
  App.jsx               routes and offer popup
  main.jsx              entry point
index.html
vite.config.js
eslint.config.js
```

Tests sit next to the file they test, for example `utils/filterJobs.test.js`.

## Notes

- There is no server. Applications and the login are saved in your browser's localStorage, so they stay after a refresh or restart but only on that browser. Clearing site data removes them.
- The login is a front end demo. The account is stored in the browser and is not secure, so don't use a real password.
- Dates are stored as `YYYY-MM-DD` and read in your local time zone.
- Each job is saved as `{ id, title, company, location, status, appliedDate, interviewDate, interviewTime }`. Data saved by older versions of the app, which used a single `date` field, is converted when the app loads.

## License

MIT, see [LICENSE](LICENSE).

## Author

Built by **Zeinab Ramezani Yekta**
[LinkedIn](https://linkedin.com/in/zeinab-ramezani) · [GitHub](https://github.com/zainab-yekta)
