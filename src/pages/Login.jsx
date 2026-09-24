import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, Briefcase, CheckCircle2, Loader2 } from 'lucide-react';
import PasswordInput from '../components/PasswordInput';
import './Auth.css';

function Login({ onLogin }) {
  const location = useLocation();
  const justRegistered = location.state?.registered;
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const problem = await onLogin(email, password);
    setSubmitting(false);

    if (problem) {
      setError(problem);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card card">
        <span className="auth-logo" aria-hidden="true">
          <Briefcase size={22} />
        </span>
        <h1>Welcome back</h1>
        <p className="auth-subtitle">Log in to see your applications.</p>

        <form className="auth-form" onSubmit={handleLogin}>
          {justRegistered && !error && (
            <p className="alert alert-success" role="status">
              <CheckCircle2 size={18} aria-hidden="true" />
              Account created. You can log in now.
            </p>
          )}
          {error && (
            <p className="alert alert-error" role="alert">
              <AlertCircle size={18} aria-hidden="true" />
              {error}
            </p>
          )}

          <div className="field">
            <label className="field-label" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
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
            <label className="field-label" htmlFor="login-password">
              Password
            </label>
            <PasswordInput
              id="login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={submitting}>
            {submitting && <Loader2 size={18} className="spin" aria-hidden="true" />}
            {submitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="auth-switch">
          Don&apos;t have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </main>
  );
}

export default Login;
