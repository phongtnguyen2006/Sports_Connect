import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import CreateEvent from './pages/CreateEvent';
import Feed from './pages/Feed';
import ForgotPassword from './pages/ForgotPassword';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Registration from './pages/Registration';

function LoginPage() {
  const navigate = useNavigate();

  return (
    <Login
      onRegisterClick={() => navigate('/register')}
      onForgotPasswordClick={() => navigate('/forgot-password')}
    />
  );
}

function RegistrationPage() {
  const navigate = useNavigate();

  return <Registration onBackToLogin={() => navigate('/login')} />;
}

function ForgotPasswordPage() {
  const navigate = useNavigate();

  return <ForgotPassword onBackToLogin={() => navigate('/login')} />;
}

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/feed" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}