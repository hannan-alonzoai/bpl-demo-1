import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function EyeIcon({ off }: { off?: boolean }) {
  if (off) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M3 3l18 18" />
        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
        <path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a18.2 18.2 0 0 1-4.1 5.2M6.7 6.7A18 18 0 0 0 2 12s4 7 10 7a10.5 10.5 0 0 0 5.1-1.3" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (login(username, password)) {
      navigate('/board');
    } else {
      setError('Enter username and password');
    }
  }

  return (
    <div className="login-form-side">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="brand-label">BPL Medical Technologies</div>
        <h2>Sign in</h2>
        <p className="sub">Enter your credentials to access the dashboard.</p>

        <div className="field">
          <label htmlFor="username">Username</label>
          <div className="field-input-wrap">
            <span className="field-icon" aria-hidden>
              <UserIcon />
            </span>
            <input
              id="username"
              type="text"
              placeholder="doctor.name"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <div className="field-input-wrap">
            <span className="field-icon" aria-hidden>
              <LockIcon />
            </span>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="field-toggle-password"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword(v => !v)}
            >
              <EyeIcon off={!showPassword} />
            </button>
          </div>
        </div>

        {error ? <p className="login-error">{error}</p> : null}

        <div className="row-between">
          <span className="remember">
            <input type="checkbox" id="remember" /> Remember me
          </span>
          <a href="#">Forgot password</a>
        </div>

        <button type="submit" className="signin-btn">
          Sign in
        </button>

        <div className="meta-foot">
          <span>Version 1.9.0</span>
          <span>Technology partner: Rtwo</span>
        </div>
      </form>
    </div>
  );
}
