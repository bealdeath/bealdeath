import React, { useState } from 'react';
import axios from 'axios';

const PasswordRecovery = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/recover-password', { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error sending recovery email.');
    }
  };

  return (
    <div>
      <h1>Password Recovery</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <button type="submit">Send Recovery Email</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PasswordRecovery;
