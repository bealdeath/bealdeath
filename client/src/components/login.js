import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const handleLogin = async (email, password, navigate) => {
  try {
    const response = await axios.post('http://localhost:5000/login', {
      email,
      password
    });
    localStorage.setItem('token', response.data.token);
    alert('Login successful');
    navigate('/dashboard');
  } catch (error) {
    console.error('Error:', error);
    alert('Login failed');
  }
};

const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    handleLogin(email, password, navigate);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
