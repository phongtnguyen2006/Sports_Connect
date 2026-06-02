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

export default function App() {
  const [currentUser,setCurrentUser] = useState(null);
  useEffect(()=>{
    const token = localStorage.getItem("access_token");

    if(!token){
      return;
    }

    fetch("/api/users/user-data",{
      headers:{
        Authorization : `Bearer ${token}`,

      },
    })
    .then((res) => res.json())
    .then((data) => setCurrentUser(data.user));

  }, []);
  return (
    <Routes>
      {/* Public auth screens — no nav bar, redirect away once logged in */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login setCurrentUser = {setCurrentUser}/>} />
        <Route path="/Registration" element={<Registration />} />
      </Route>

      {/* Authenticated app — nav bar + feed, gated behind login */}
      <Route element={<ProtectedLayout currentUser={currentUser}/>}>
        <Route path="/feed" element={<Feed />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit-profile" element={<EditProfile />} />

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
