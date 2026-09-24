import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Briefcase, Info, Loader2 } from 'lucide-react';
import PasswordInput from '../components/PasswordInput';
import { MIN_PASSWORD_LENGTH } from '../hooks/useAuth';
import './Auth.css';

function Register({ onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }

    setSubmitting(true);
    const problem = await onRegister(email, password);
    setSubmitting(false);

    if (problem) {
      setError(problem);
    } else {
      navigate('/login', { state: { registered: true, email: email.trim() } });
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card card">
        <span className="auth-logo" aria-hidden="true">
          <Briefcase size={22} />
        </span>
        <h1>Create your account</h1>
        <p className="auth-subtitle">Start tracking your applications in a minute.</p>

        <form className="auth-form" onSubmit={handleRegister}>
          {error && (
            <p className="alert alert-error" role="alert">
              <AlertCircle size={18} aria-hidden="true" />
              {error}
            </p>
          )}

          <div className="field">
            <label className="field-label" htmlFor="register-email">
              Email
            </label>
            <input
              id="register-email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="register-password">
              Password
            </label>
            <PasswordInput
              id="register-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              aria-describedby="register-password-hint"
              required
            />
            <span id="register-password-hint" className="field-hint">
              At least {MIN_PASSWORD_LENGTH} characters.
            </span>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="register-confirm">
              Confirm password
            </label>
            <PasswordInput
              id="register-confirm"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={submitting}>
            {submitting && <Loader2 size={18} className="spin" aria-hidden="true" />}
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-note">
          <Info size={14} aria-hidden="true" />
          This is a demo account stored only in your browser. Please don&apos;t reuse a real
          password.
        </p>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </main>
  );
}

export default Register;
