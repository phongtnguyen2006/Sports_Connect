import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";

export default function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    fetch('/api/hello')
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage('Failed to reach backend'));
  }, []);

  function Home() {

  return (

    <>

      <h1>Sports Connect</h1>

      <p>testing is this working sm</p>

    </>

  );

}

  return (

    <main>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/profile" element={<Profile />} />

      </Routes>

    </main>

  );
}
