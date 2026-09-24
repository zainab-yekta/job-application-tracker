import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const justRegistered = location.state?.registered;

  const handleLogin = (e) => {
    e.preventDefault();
    let storedUser;
    try {
      storedUser = JSON.parse(localStorage.getItem('user'));
    } catch {
      storedUser = null;
    }

    if (storedUser?.email === email.trim() && storedUser?.password === password) {
      onLogin();
      navigate('/dashboard');
    } else {
      setError('The email or password is not correct.');
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
        <button type="submit">Login</button>
      </form>
      <p>
        Don&apos;t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;
