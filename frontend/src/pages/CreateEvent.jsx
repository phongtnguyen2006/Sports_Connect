import { useState } from 'react';

export default function CreateEvent() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(''); 
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  function handleSubmit(event) {
    event.preventDefault(); 

    const newEvent = {
      title, 
      description, 
      date,
      time,
    };

    console.log('New event:', newEvent);
  }

  return (
    <main>
      <h1>Create Event</h1>

      <form onSubmit={handleSubmit}>

        <div>
          <label htmlFor="title">Title for the event</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea 
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="date">Date</label>
          <input 
            id="date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="time">Time</label>
          <input 
            id="time"
            type="time"
            value={time}
            onChange={(event) => setTime(event.target.value)}
          />
        </div>

        <button type="submit">Create Event</button>
      </form>
    </main>
  );
}
