## Job Application Tracker (React.js Project)
A simple and effective web-based tool built with React.js that helps users track job applications, interviews, and rejections, while providing options for filtering, searching, exporting, and receiving interview notifications.

## Tech Stack
- Frontend: React.js
- Styling: Custom CSS (no external frameworks like Tailwind or Bootstrap used)
- Date Formatting: dayjs
- Exporting Tools: jsPDF, jspdf-autotable, ExcelJS, file-saver
- Unique IDs: uuid
- State Management: React Hooks (useState, useEffect)
- Data Storage: LocalStorage (browser-based)
- Recharts: for charts and data visualization
- React Router DOM: for routing
- No backend (local state only)

## Features
- Display cards with job info and color-coded statuses in visually styled card-like boxes.
- Set and display interview dates & times.
- Receive automatic notifications for upcoming interviews.
- Receive automatic notifications for Offer status and also for Accepted Offers.
- Export job data to Excel and PDF.
- Automatically saves data using LocalStorage.
- Add a data analytics graph showing:
  - Total jobs applied
  - Interviews pending
  - Rejections
  - Timeline range (first to last application date)
  - Job search success analysis & suggestions
  - Analyze job status trends and application growth
- AI-based suggestions based on rejection rates.
- Show detailed timeline for interview progress.
- Deploy the project online (GitHub).

## Core Functionality (Available Scripts)
- Add new job applications with details.
- Edit existing job entries.
- Delete job entries.
- Set job **status**: `Applied`, `Interview`, `Rejected`,`Offer`, `Accepted Offer`.
- Set job **application date**.
- Set **interview time** if status is Interview.

## UI Interactions
- Filter jobs by status (All, Applied, Interview, Rejected).
- Filter the applications by Date.
- Search bar to find jobs by title or company.
- Responsive layout that adjusts across screen sizes or desktop & mobile.

### Authentication (Frontend only)
- Demo Login / Logout system.
- Registration page (static).
- Protected routes for dashboard and analytics.

## Utilities
- Custom **date formatter** to display dates like `5th June 2025`.
- Conditional formatting for job status.
- Job notifications that show upcoming interviews with date and time.

### Static Chatbot Interface
- A fake interactive chatbot placed on the interface.
- No backend or AI logic — just a UI component.

### 🧭 Navigation
- Responsive Navbar with:
  - Home
  - Tracker
  - Analytics
  - About
  - Contact
  - Login / Register / Logout

## Technologies Used
| Category         | Tools / Libraries              |
|------------------|--------------------------------|
| Frontend         | React.js                       |
| Styling          | Custom CSS                     |
| Utilities        | JavaScript date formatting     |
| Icons            | [FontAwesome / Material Icons] |

## Project Structure (Simplified)
src/
├── components/
│ ├── JobForm.js
│ ├── JobItem.js
│ ├── JobList.js
│ ├── Chatbot.js
│ └── Navbar.js
│ └── ProtectedRoute.js
├── pages/
│ ├── Home.js
│ ├── Dashboard.js
│ ├── Analytics.js
│ ├── About.js
│ ├── Login.js
│ └── Register.js
├── utils/
│ └── FormatDate.js
├── App.js
├── App.css
├── index.js
└── index.css

### Install dependencies
npm install uuid dayjs jspdf jspdf-autotable exceljs file-saver classnames
Plus the standard React packages that come with create-react-app.

## Start the development server
npm start

## How to Run This Project
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/job-application-tracker.git
   cd job-application-tracker
   npm install
   npm start

## Future Improvements (Planned)
- Add Login/Register authentication system
- Integrate persistent storage (localStorage or backend + database integration for cloud sync)
- Convert to Progressive Web App (PWA)

### Making a Progressive Web App
The base setup uses create-react-app, which supports PWA out of the box. You can enable it by modifying the serviceWorkerRegistration.js.

### Deployment
Deploying this app using:
GitHub Pages
Firebase Hosting
(Deployment guide coming soon...)

## Notes
This project does not use a database. All data is stored in local component state and resets on refresh.
The authentication system is for demonstration only. It does not persist or validate real users.

## 📄 License
This project is for educational and portfolio purposes. Project built to practice frontend development and job application management logic using React.

## Author
Zeinab Ramezani Yekta




