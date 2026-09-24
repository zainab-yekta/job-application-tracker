// src/pages/About.js
import React from 'react';

function About() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto', textAlign: 'center' }}>
      <h1>About Job Tracker</h1>
      <p>
        Job Tracker is your personal assistant to manage and track all your job applications in one place. 
        Stay organized with features like interview reminders, application analytics, growth trends, and more.
      </p>

      <p>
        Your data stays in your own browser. Nothing is sent to a server.
      </p>

      <h2>Contact</h2>
      <p>
        Built by Zeinab Ramezani Yekta <br />
        <a href="https://github.com/zainab-yekta" target="_blank" rel="noopener noreferrer">GitHub</a>
        {' · '}
        <a href="https://linkedin.com/in/zeinab-ramezani" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </p>
    </div>
  );
}

export default About;
