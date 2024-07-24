import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/data', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setData(response.data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Tables Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default Dashboard;
