import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  CalendarClock,
  FileDown,
  Lightbulb,
  ListChecks,
  ShieldCheck,
} from 'lucide-react';
import './Home.css';

const FEATURES = [
  {
    icon: ListChecks,
    title: 'Track every application',
    text: 'Save the role, company, location and date, then move each one from Applied to Interview, Offer or Rejected.',
  },
  {
    icon: CalendarClock,
    title: 'Interview reminders',
    text: 'Add the interview date and time and the tracker reminds you when it is today or tomorrow.',
  },
  {
    icon: BarChart3,
    title: 'See how it is going',
    text: 'Charts show your interviews, rejections and offers, and how many interviews you get over time.',
  },
  {
    icon: Lightbulb,
    title: 'Suggestions',
    text: 'Get a nudge based on your numbers, like following up when several applications have gone quiet.',
  },
  {
    icon: FileDown,
    title: 'Export and backup',
    text: 'Download your list as Excel or PDF, or save a backup file and restore it in another browser.',
  },
  {
    icon: ShieldCheck,
    title: 'Private by design',
    text: 'Everything stays in your browser. Nothing is sent to a server and passwords are stored as hashes.',
  },
];

const STEPS = [
  {
    title: 'Create an account',
    text: 'Sign up with an email and password. It takes a few seconds.',
  },
  {
    title: 'Add your applications',
    text: 'Log each job as you apply and update the status as it moves.',
  },
  {
    title: 'Follow up and review',
    text: 'Watch for interview reminders and check the analytics each week.',
  },
];

// A small, static picture of the tracker for the hero. It is decorative.
const PREVIEW_ROWS = [
  { title: 'Frontend Developer', company: 'Northwind', status: 'Interview' },
  { title: 'React Developer', company: 'Contoso', status: 'Applied' },
  { title: 'UI Engineer', company: 'Fabrikam', status: 'Offer' },
  { title: 'Web Developer', company: 'Tailspin', status: 'Rejected' },
];

function ProductPreview() {
  return (
    <div className="preview card" aria-hidden="true">
      <div className="preview-header">
        <span className="preview-dot" />
        <span className="preview-dot" />
        <span className="preview-dot" />
      </div>
      <div className="preview-stats">
        <div>
          <strong>24</strong>
          <span>Applied</span>
        </div>
        <div>
          <strong>6</strong>
          <span>Interviews</span>
        </div>
        <div>
          <strong>2</strong>
          <span>Offers</span>
        </div>
      </div>
      <div className="preview-reminder">
        <CalendarClock size={16} />
        Interview tomorrow at 10:30
      </div>
      <ul className="preview-list">
        {PREVIEW_ROWS.map((row) => (
          <li key={row.title}>
            <div>
              <strong>{row.title}</strong>
              <span>{row.company}</span>
            </div>
            <span className={`badge badge-${row.status.toLowerCase()}`}>{row.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Home({ isLoggedIn }) {
  const primaryAction = isLoggedIn ? (
    <Link to="/dashboard" className="btn btn-primary btn-lg">
      Open your tracker
      <ArrowRight size={18} aria-hidden="true" />
    </Link>
  ) : (
    <Link to="/register" className="btn btn-primary btn-lg">
      Get started
      <ArrowRight size={18} aria-hidden="true" />
    </Link>
  );

  return (
    <main className="home">
      <section className="home-hero">
        <div className="container home-hero-inner">
          <div className="home-hero-copy">
            <p className="home-eyebrow">Job search organizer</p>
            <h1 className="home-title">Keep every job application in one place</h1>
            <p className="home-lead">
              Log where you applied, get a reminder before each interview, and see which parts of
              your search are working. Your data stays in your browser.
            </p>
            <div className="home-actions">
              {primaryAction}
              {!isLoggedIn && (
                <Link to="/login" className="btn btn-secondary btn-lg">
                  Log in
                </Link>
              )}
            </div>
          </div>
          <ProductPreview />
        </div>
      </section>

      <section className="home-section" aria-labelledby="features-title">
        <div className="container">
          <div className="home-section-heading">
            <h2 id="features-title">Everything you need to stay on top of your search</h2>
            <p>No spreadsheets to set up. Add a job and the rest is ready.</p>
          </div>
          <ul className="feature-grid">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="feature card">
                <span className="feature-icon" aria-hidden="true">
                  <Icon size={22} />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-section home-section-muted" aria-labelledby="steps-title">
        <div className="container">
          <div className="home-section-heading">
            <h2 id="steps-title">How it works</h2>
          </div>
          <ol className="steps">
            {STEPS.map((step, index) => (
              <li key={step.title} className="step">
                <span className="step-number" aria-hidden="true">
                  {index + 1}
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <div className="home-cta">
            <h2>Ready to organize your job search?</h2>
            <p>It is free and works in any modern browser.</p>
            {primaryAction}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
