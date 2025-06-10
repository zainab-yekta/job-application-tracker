import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to JobTracker</h1>
      <p className="home-subtitle">
        Track your job applications, interviews, and offers — all in one place.
      </p>

      <Link to="/register">
        <button className="get-started-btn">Get Started</button>
      </Link>

      <div className="home-features">
        <h3>Key Features:</h3>
        <ul>
          <li>📌 Add and manage job applications</li>
          <li>📅 Track interview schedules</li>
          <li>📈 View analytics and trends</li>
          <li>🧠 Get smart job search suggestions</li>
        </ul>
      </div>

      <div className="home-links">
        <p>
          Already registered? <Link to="/login">Login here</Link><br />
          New user? <Link to="/register">Create an account</Link>
        </p>

        <p>
          Want to know more? Visit our <Link to="/about">About</Link> or <Link to="/contact">Contact</Link> page.
        </p>
      </div>
    </div>
  );
}

export default Home;
