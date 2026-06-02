import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import CreateEvent from './pages/CreateEvent';
import Feed from './pages/Feed';
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
    <>
      <NavBar currentUser={currentUser}/>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login setCurrentUser = {setCurrentUser}/>} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit-profile" element={<EditProfile />} />
        <Route path="/Registration" element={<Registration/>} />
        <Route path="/registration/complete-profile" element={<CompleteRegistration/>} />

      </Routes>
    </>
  );
}
