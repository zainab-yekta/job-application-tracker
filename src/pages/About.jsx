import React from 'react';
import {
  CodeXml,
  DatabaseBackup,
  ExternalLink,
  HardDrive,
  KeyRound,
  UserRound,
} from 'lucide-react';
import './About.css';

const PRIVACY = [
  {
    icon: HardDrive,
    title: 'Stored in your browser',
    text: 'Applications are saved in this browser only. Nothing is sent to a server.',
  },
  {
    icon: KeyRound,
    title: 'Passwords are hashed',
    text: 'Account passwords are stored as salted hashes, never as plain text.',
  },
  {
    icon: DatabaseBackup,
    title: 'Yours to take with you',
    text: 'Download a backup file at any time and restore it in another browser.',
  },
];

const TECH = [
  'React 19',
  'React Router',
  'Recharts',
  'Vite',
  'ExcelJS',
  'jsPDF',
  'Lucide icons',
  'Vitest',
  'Testing Library',
  'GitHub Actions',
];

function About() {
  return (
    <main className="about container">
      <header className="page-header about-header">
        <h1>About JobTracker</h1>
        <p>
          JobTracker is your personal assistant to manage and track all your job applications in one
          place. Stay organized with interview reminders, application analytics, growth trends and
          more.
        </p>
      </header>

      <section aria-labelledby="privacy-title">
        <h2 id="privacy-title" className="about-section-title">
          How your data is handled
        </h2>
        <ul className="about-grid">
          {PRIVACY.map(({ icon: Icon, title, text }) => (
            <li key={title} className="card about-item">
              <span className="about-icon" aria-hidden="true">
                <Icon size={20} />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="tech-title">
        <h2 id="tech-title" className="about-section-title">
          Built with
        </h2>
        <ul className="tech-list">
          {TECH.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </section>

      <section className="card contact-card" aria-labelledby="contact-title">
        <div>
          <h2 id="contact-title">Contact</h2>
          <p>Built by Zeinab Ramezani Yekta. Questions and feedback are welcome.</p>
        </div>
        <div className="contact-links">
          <a
            className="btn btn-secondary"
            href="https://github.com/zeinab-r-yekta"
            target="_blank"
            rel="noopener noreferrer"
          >
            <CodeXml size={16} aria-hidden="true" />
            GitHub
            <ExternalLink size={14} aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <a
            className="btn btn-secondary"
            href="https://linkedin.com/in/zeinab-ramezani"
            target="_blank"
            rel="noopener noreferrer"
          >
            <UserRound size={16} aria-hidden="true" />
            LinkedIn
            <ExternalLink size={14} aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </section>
    </main>
  );
}

export default About;
