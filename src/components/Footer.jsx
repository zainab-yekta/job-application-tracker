import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>
          Built by Zeinab Ramezani Yekta ·{' '}
          <a href="https://github.com/zeinab-r-yekta" target="_blank" rel="noopener noreferrer">
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
      </div>
    </footer>
  );
}

export default Footer;
