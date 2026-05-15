import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Registration from './pages/Registration';

export default function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    fetch('/api/hello')
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage('Failed to reach backend'));
  }, []);

  return (
    <main>
      <Registration />
    </main>
  );
}
