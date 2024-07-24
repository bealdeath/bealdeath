import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AddRecord = () => {
  const { tableId } = useParams();
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        `http://localhost:5000/tables/${tableId}/records`,
        { content },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      alert('Record added successfully');
      console.log(response.data);
    } catch (error) {
      console.error('Error adding record:', error);
      alert('Failed to add record');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit">Add Record</button>
    </form>
  );
};

export default AddRecord;
