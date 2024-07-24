import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [columns, setColumns] = useState([]);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('ASC');

  const fetchData = async () => {
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
      setColumns(response.data.columns.filter(column => column !== 'password' && column !== 'isAdmin'));
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sortField, sortOrder]);

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/users/${id}`, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      fetchData(); // Refresh data after delete
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <label>Sort Field: </label>
        <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
          {columns.map((column) => (
            <option key={column} value={column}>
              {column}
            </option>
          ))}
        </select>
        <label>Sort Order: </label>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="ASC">Ascending</option>
          <option value="DESC">Descending</option>
        </select>
        <button onClick={fetchData}>Apply Sort</button>
      </div>
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} onClick={() => handleSort(column)}>
                {column}
              </th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              {columns.map((column) => (
                <td key={column}>{user[column]}</td>
              ))}
              <td>
                <Link to={`/edit-record/${user.id}`}>Edit</Link>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/add-record/1">Add Record to Table 1</Link>
    </div>
  );
};

export default Dashboard;
