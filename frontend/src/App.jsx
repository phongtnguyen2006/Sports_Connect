import { useState } from 'react';
import Login from './pages/Login';
import Registration from './pages/Registration';
import ForgotPassword from './pages/ForgotPassword';

export default function App() {
  const [page, setPage] = useState('login');

  if (page === 'register') {
    return <Registration onBackToLogin={() => setPage('login')} />;
  }

  if (page === 'forgot-password') {
    return <ForgotPassword onBackToLogin={() => setPage('login')} />;
  }

  return (
    <Login
      onRegisterClick={() => setPage('register')}
      onForgotPasswordClick={() => setPage('forgot-password')}
    />
  );
}