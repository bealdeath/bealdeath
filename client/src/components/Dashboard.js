import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [columns, setColumns] = useState([]);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [newUser, setNewUser] = useState({ firstName: '', lastName: '', email: '', role: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/data', {
          headers: {
            'Authorization': 'Bearer ' + token,
          },
          params: {
            sortField,
            sortOrder,
          },
        });
        const fetchedColumns = Object.keys(response.data.users[0]).filter(
          (column) => column !== 'isAdmin' && column !== 'password' && column !== 'id' && column !== 'createdAt' && column !== 'updatedAt'
        );
        setColumns(fetchedColumns);
        setUsers(response.data.users);
        toast.success('Data fetched successfully');
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error fetching data');
      }
    };

    fetchData();
  }, [sortField, sortOrder]);

  const handleSort = (field) => {
    const order = sortOrder === 'ASC' ? 'DESC' : 'ASC';
    setSortField(field);
    setSortOrder(order);
  };

  const handleEdit = (user) => {
    setEditUser(user);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/tables/1/records/${id}`, {
        headers: {
          'Authorization': 'Bearer ' + token,
        },
      });
      setUsers(users.filter((user) => user.id !== id));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user');
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/tables/1/records/${editUser.id}`, editUser, {
        headers: {
          'Authorization': 'Bearer ' + token,
        },
      });
      setEditUser(null);
      const updatedUsers = users.map((user) => (user.id === editUser.id ? editUser : user));
      setUsers(updatedUsers);
      toast.success('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Error updating user');
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditUser({ ...editUser, [name]: value });
  };

  const handleNewInputChange = (event) => {
    const { name, value } = event.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddRecord = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:5000/tables/1/records`, newUser, {
        headers: {
          'Authorization': 'Bearer ' + token,
        },
      });
      setUsers([...users, response.data]);
      setNewUser({ firstName: '', lastName: '', email: '', role: '' });
      setShowAddForm(false);
      toast.success('User added successfully');
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Error adding user');
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
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editUser && (
        <form onSubmit={handleUpdate}>
          <h2>Edit Record</h2>
          {columns.map((column) => (
            <div key={column}>
              <label>{column}</label>
              <input type="text" name={column} value={editUser[column]} onChange={handleInputChange} />
            </div>
          ))}
          <button type="submit">Update Record</button>
        </form>
      )}

      {!showAddForm && (
        <button onClick={() => setShowAddForm(true)}>Add Record</button>
      )}

      {showAddForm && (
        <form onSubmit={handleAddRecord}>
          <h2>Add Record</h2>
          {columns.map((column) => (
            <div key={column}>
              <label>{column}</label>
              <input type="text" name={column} value={newUser[column]} onChange={handleNewInputChange} />
            </div>
          ))}
          <button type="submit">Add Record</button>
        </form>
      )}
    </div>
  );
};

export default Dashboard;
