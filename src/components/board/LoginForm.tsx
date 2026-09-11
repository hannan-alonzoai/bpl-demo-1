import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
          <input id="username" type="text" placeholder="doctor.name" value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>

        {error && <p style={{ color: 'var(--critical)', fontSize: 13, marginBottom: 12 }}>{error}</p>}

        <div className="row-between">
          <span className="remember"><input type="checkbox" id="remember" /> Remember me</span>
          <a href="#">Forgot password</a>
        </div>

        <button type="submit" className="signin-btn">Sign in</button>

        <div className="meta-foot">
          <span>Version 1.9.0</span>
          <span>Technology partner: Rtwo</span>
        </div>
      </form>
    </div>
  );
}
