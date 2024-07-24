import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditRecord = () => {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/tables/1/records/${id}`, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching record:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/tables/1/records/${id}`, user, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating record:', error);
    }
  };

  return (
    <div>
      <h1>Edit Record</h1>
      <form onSubmit={handleSubmit}>
        {Object.keys(user).map(key => (
          <div key={key}>
            <label>{key}: </label>
            <input
              type="text"
              name={key}
              value={user[key] || ''}
              onChange={handleChange}
              disabled={key === 'id'}
            />
          </div>
        ))}
        <button type="submit">Update Record</button>
      </form>
    </div>
  );
};

export default EditRecord;
