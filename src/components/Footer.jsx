import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>
          Built by Zeinab Ramezani Yekta ·{' '}
          <a href="https://github.com/zainab-yekta" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>{' '}
          ·{' '}
          <a
            href="https://linkedin.com/in/zeinab-ramezani"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </p>
        <p>
          <Link to="/about">About this project</Link>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
