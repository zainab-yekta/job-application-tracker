import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

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
    <div className="auth-container">
      <h2>Login</h2>
      {justRegistered && !error && (
        <p className="auth-success" role="status">
          Account created. You can log in now.
        </p>
      )}
      <form onSubmit={handleLogin}>
        <label className="sr-only" htmlFor="login-email">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <label className="sr-only" htmlFor="login-password">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Login'}
        </button>
      </form>
      <p>
        Don&apos;t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;
