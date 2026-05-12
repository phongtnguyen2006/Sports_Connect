import { useEffect, useState } from 'react';

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
      <h1>Sports Connect</h1>
      <p>{message}</p>
    </main>
  );
}
