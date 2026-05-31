import { Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import CreateEvent from './pages/CreateEvent';
import Feed from './pages/Feed';
import Login from './pages/Login';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Registration from './pages/Registration'

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/feed" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit-profile" element={<EditProfile />} />
        <Route path="/Registration" element={<Registration/>} />
      </Routes>
    </>
  );
}
