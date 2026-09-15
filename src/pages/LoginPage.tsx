import { Navigate } from 'react-router-dom';
import { LoginForm } from '../components/board/LoginForm';
import { LoginHero } from '../components/board/LoginHero';
import { useAuth } from '../context/AuthContext';
import '../styles/board.css';

export function LoginPage() {
  const { isAuth } = useAuth();
  if (isAuth) return <Navigate to="/board" replace />;

  return (
    <div className="login-page">
      <div className="top-strip" aria-hidden />
      <div id="login-screen">
        <LoginHero />
        <LoginForm />
      </div>
    </div>
  );
}
