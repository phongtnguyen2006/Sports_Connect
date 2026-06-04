import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedLayout from './components/ProtectedLayout';
import PublicRoute from './components/PublicRoute';
import CreateEvent from './pages/Feed/CreateEvent';
import Feed from './pages/Feed/Feed';
import Login from './pages/user_profile/Login';
import Profile from './pages/user_profile/Profile';
import EditProfile from './pages/user_profile/EditProfile';
import Registration from './pages/user_profile/Registration'
import CompleteRegistration from './pages/user_profile/CompleteProfilePage'
import UserEvents from './pages/user_profile/UserEvents';
import JoinedEvents from './pages/user_profile/JoinedEvents';
import PublicProfile from './pages/user_profile/PublicProfile';

export default function App() {
  const [currentUser,setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(()=>{
    const token = localStorage.getItem("access_token");

    if(!token){
      setAuthLoading(false);
      return;
    }

    fetch("/api/users/user-data",{
      headers:{
        Authorization : `Bearer ${token}`,

      },
    })
    .then((res) => {
      if (!res.ok) {
        localStorage.removeItem("access_token");
        throw new Error("Could not load current user");
      }

      return res.json();
    })
    .then((data) => setCurrentUser(data.user))
    .catch(() => setCurrentUser(null))
    .finally(() => setAuthLoading(false));

  }, []);
  return (
    <Routes>
      {/* Public auth screens — no nav bar, redirect away once logged in */}
      <Route element={<PublicRoute authLoading={authLoading} />}>
        <Route path="/login" element={<Login setCurrentUser = {setCurrentUser}/>} />
        <Route path="/Registration" element={<Registration />} />
      </Route>

      {/* Authenticated app — nav bar + feed, gated behind login */}
      <Route element={<ProtectedLayout currentUser={currentUser} setCurrentUser={setCurrentUser} authLoading={authLoading}/>}>
        <Route path="/feed" element={<Feed />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit-profile" element={<EditProfile />} />
        <Route path="/profile/joined-events" element={<JoinedEvents />} />
        <Route path="/profile/events" element={<UserEvents />} />
        <Route path="/users/:username" element={<PublicProfile />} />
      </Route>
      <Route
          path="/registration/complete-profile"
          element={<CompleteRegistration setCurrentUser = {setCurrentUser} />}
      />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
