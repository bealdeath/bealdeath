import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/login';
import Dashboard from './components/Dashboard';
import AddRecord from './components/AddRecord';

console.log(require('react'));
console.log(require('react').version);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
    }
  }, []);

  const notify = () => toast("Wow so easy!");

  return (
    <Router>
      <div>
        <button onClick={notify}>Notify!</button>
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/add-record/:tableId" 
            element={isAuthenticated ? <AddRecord /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
          />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
};

export default App;