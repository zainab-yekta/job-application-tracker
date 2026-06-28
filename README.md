# Job Application Tracker

A web-based tool built with React.js to track job applications, interviews, and rejections — with filtering, search, data export, and analytics dashboards.

**[Live Site](https://zainab-yekta.github.io/job-application-tracker/)** · **[Source Code](https://github.com/zainab-yekta/job-application-tracker)**

---

## Tech Stack

| Category | Tools |
|----------|-------|
| Frontend | React.js |
| Data Visualization | Recharts |
| Routing | React Router DOM |
| Date Formatting | dayjs |
| Export | jsPDF, ExcelJS, file-saver |
| Unique IDs | uuid |
| State Management | React Hooks (useState, useEffect) |
| Storage | localStorage (browser-based, resets on refresh) |
| Deployment | GitHub Pages |

---

## Features

- Add, edit, and delete job applications with status tracking: `Applied`, `Interview`, `Rejected`, `Offer`, `Accepted Offer`
- Color-coded status cards with interview date and time display
- Automatic notifications for upcoming interviews and offer updates
- Export job data to Excel and PDF
- Analytics dashboard with Recharts showing:
  - Total applications, interviews pending, rejections
  - Application timeline and growth trends
  - Job search success analysis and suggestions
- Filter by status and date range; search by title or company
- Responsive layout across desktop and mobile
- Demo login/logout system with protected routes (frontend only — no backend)

---

## Run Locally

```bash
git clone https://github.com/zainab-yekta/job-application-tracker.git
cd job-application-tracker
npm install
npm start
```

Install additional dependencies:
```bash
npm install uuid dayjs jspdf jspdf-autotable exceljs file-saver classnames
```

---

## Project Structure

```
src/
├── components/
│   ├── JobForm.js
│   ├── JobItem.js
│   ├── JobList.js
│   ├── Chatbot.js
│   ├── Navbar.js
│   └── ProtectedRoute.js
├── pages/
│   ├── Home.js
│   ├── Dashboard.js
│   ├── Analytics.js
│   ├── About.js
│   ├── Login.js
│   └── Register.js
├── utils/
│   └── FormatDate.js
├── App.js
└── index.js
```

---

## Notes

- All data is stored in localStorage and resets on page refresh
- Authentication is a frontend demo only — no real user validation or persistence
- Chatbot interface is a static UI component with no backend or AI logic

---

## Author

Built by **Zeinab Ramezani Yekta** — Full-Stack Developer  
[LinkedIn](https://linkedin.com/in/zeinab-ramezani) · [GitHub](https://github.com/zainab-yekta)
