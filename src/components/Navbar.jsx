import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Briefcase, Menu, X, LogOut } from 'lucide-react';
import './Navbar.css';

function Navbar({ isLoggedIn, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close the mobile menu after moving to another page
  const [lastPath, setLastPath] = useState(location.pathname);
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    setIsOpen(false);
  }

  // Escape closes the mobile menu
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (e) => e.key === 'Escape' && setIsOpen(false);
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const linkClass = ({ isActive }) => `navbar-link${isActive ? ' is-active' : ''}`;

  return (
    <header className="navbar">
      <nav className="navbar-inner container" aria-label="Main">
        <Link to="/" className="navbar-brand">
          <span className="navbar-logo" aria-hidden="true">
            <Briefcase size={18} strokeWidth={2.25} />
          </span>
          JobTracker
        </Link>

        <button
          type="button"
          className="btn btn-ghost btn-icon navbar-toggle"
          onClick={() => setIsOpen((open) => !open)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          aria-controls="navbar-menu"
        >
          {isOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>

        <div id="navbar-menu" className={`navbar-menu${isOpen ? ' is-open' : ''}`}>
          <ul className="navbar-links">
            <li>
              <NavLink to="/" end className={linkClass}>
                Home
              </NavLink>
            </li>
            {isLoggedIn && (
              <>
                <li>
                  <NavLink to="/dashboard" className={linkClass}>
                    Tracker
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/analytics" className={linkClass}>
                    Analytics
                  </NavLink>
                </li>
              </>
            )}
            <li>
              <NavLink to="/about" className={linkClass}>
                About
              </NavLink>
            </li>
          </ul>

          <div className="navbar-actions">
            {isLoggedIn ? (
              <button type="button" className="btn btn-secondary" onClick={onLogout}>
                <LogOut size={16} aria-hidden="true" />
                Log out
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">
                  Log in
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
