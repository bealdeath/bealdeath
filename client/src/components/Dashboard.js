import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [columns, setColumns] = useState([]);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/data', {
        headers: {
          'Authorization': 'Bearer ' + token
        },
        params: {
          sortField,
          sortOrder
        }
      });

      const fetchedColumns = Object.keys(response.data.users[0]).filter(column => column !== 'isAdmin' && column !== 'password');
      setColumns(fetchedColumns);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [sortField, sortOrder]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSortChange = (e) => {
    setSortField(e.target.value);
  };

  const handleOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const applyChanges = () => {
    fetchData();
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <label>Sort Field: </label>
        <select value={sortField} onChange={handleSortChange}>
          <option value="">Select a field</option>
          {columns.map(column => (
            <option key={column} value={column}>{column}</option>
          ))}
        </select>
        <label>Sort Order: </label>
        <select value={sortOrder} onChange={handleOrderChange}>
          <option value="">Select order</option>
          <option value="ASC">Ascending</option>
          <option value="DESC">Descending</option>
        </select>
        <button onClick={applyChanges}>Apply Changes</button>
      </div>
      <table>
        <thead>
          <tr>
            {columns.map(column => (
              <th key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              {columns.map(column => (
                <td key={column}>{user[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/add-record/1">Add Record to Table 1</Link>
    </div>
  );
};

export default Dashboard;
