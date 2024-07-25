import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import Login from './components/login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AddRecord from './components/AddRecord';
import PasswordRecovery from './components/PasswordRecovery';
import PasswordReset from './components/PasswordReset';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:5000/protected', {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
      .then(response => {
        if (response.status === 200) {
          setIsAuthenticated(true);
          setUserRole(response.data.role);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
        setUserRole('');
      });
    }
  }, []);

  return (
    <Router>
      <div>
        {isAuthenticated ? (
          <div>
            <Link to="/password-recovery">Forgot Password?</Link>
          </div>
        ) : null}
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/password-recovery" element={<PasswordRecovery />} />
          <Route path="/reset-password" element={<PasswordReset />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard userRole={userRole} /> : <Navigate to="/login" />} />
          <Route path="/add-record/:tableId" element={isAuthenticated ? <AddRecord /> : <Navigate to="/login" />} />
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
