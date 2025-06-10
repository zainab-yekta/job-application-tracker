## Job Application Tracker (React.js Project)
A simple and effective web-based tool built with React.js that helps users track job applications, interviews, and rejections, while providing options for filtering, searching, exporting, and receiving interview notifications.

## Live Demo & Repository (How to Run This Project)
- **Live Site**: [Job Application Tracker (GitHub Pages)](https://zainab-yekta.github.io/job-application-tracker/)
- **GitHub Repo**: [View Source Code on GitHub](https://github.com/zainab-yekta/job-application-tracker)

## Updating the Project
After making any changes to the project files, follow these steps to update your GitHub repository and the deployed GitHub Pages site:

git add .
git commit -m "Describe your change here"
git push origin main

Once you push the changes to GitHub, GitHub Pages will automatically update your live site within a few seconds. This ensures that:
- Your repository stays up to date with the latest code.
- Your live deployed site reflects the most recent changes.

### Install dependencies
npm install uuid dayjs jspdf jspdf-autotable exceljs file-saver classnames
Plus the standard React packages that come with create-react-app.

## Start the development 
cd job-application-tracker
   npm install
   npm start
   
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

## Future Improvements (Planned)
- Add Login/Register authentication system
- Integrate persistent storage (localStorage or backend + database integration for cloud sync)
- Convert to Progressive Web App (PWA)

### Making a Progressive Web App
The base setup uses create-react-app, which supports PWA out of the box. You can enable it by modifying the serviceWorkerRegistration.js.

### Deployment
This app is deployed using:
- GitHub Pages — View Live Site
- Firebase Hosting — (Coming soon...)

## Notes
This project does not use a database. All data is stored in local component state and resets on refresh.
The authentication system is for demonstration only. It does not persist or validate real users.

## 📄 License
This project is for educational and portfolio purposes. Project built to practice frontend development and job application management logic using React.
This project is licensed under the MIT License, which means:
 - You can use, copy, modify, and share it freely.
 - Just keep the copyright.
 - No warranty is provided.

## Author
Zeinab Ramezani Yekta




