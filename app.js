require('dotenv').config();
const express = require('express');
const { sequelize, User, Table, Record } = require('./models');
const jwt = require('jsonwebtoken');
const authenticateJWT = require('./middleware/auth');
const verifyRole = require('./middleware/verifyRole');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(cors({ origin: 'http://localhost:3000' }));

// Database connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Database synchronized.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Home route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Serve login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Register user
app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, role, isAdmin } = req.body;
  try {
    const user = await User.create({ firstName, lastName, email, password, role, isAdmin });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log(`User not found: ${email}`);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('User found:', JSON.stringify(user.dataValues));
    console.log('Password provided:', password);
    console.log('Hashed password from DB:', user.password);

    const isMatch = await user.comparePassword(password);
    console.log(`Comparing: ${password} with ${user.password} -> ${isMatch}`);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Protect routes with authenticateJWT middleware
app.get('/protected', authenticateJWT, (req, res) => {
  res.send('This is a protected route');
});

// Apply role-based verification middleware
app.get('/admin', authenticateJWT, verifyRole(['admin']), (req, res) => {
  res.send('This is an admin route');
});

app.get('/editor', authenticateJWT, verifyRole(['admin', 'editor']), (req, res) => {
  res.send('This is an editor route');
});

app.get('/viewer', authenticateJWT, verifyRole(['admin', 'editor', 'viewer']), (req, res) => {
  res.send('This is a viewer route');
});

// Get all users
app.get('/users', authenticateJWT, async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const { Op, Sequelize } = require('sequelize');


// Route to serve data for charting with sorting and filtering
app.get('/api/data', authenticateJWT, async (req, res) => {
  const { sortField, sortOrder } = req.query;

  try {
    let queryOptions = {
      attributes: { exclude: ['password', 'isAdmin'] }, // Exclude sensitive columns
      order: []
    };

    if (sortField && sortOrder) {
      queryOptions.order.push([sortField, sortOrder]);
    }

    const users = await User.findAll(queryOptions);
    const columns = Object.keys(User.rawAttributes).filter(column => column !== 'password' && column !== 'isAdmin');

    res.json({ columns, users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});





// Routes for tables
app.get('/tables', authenticateJWT, async (req, res) => {
  try {
    const tables = await Table.findAll();
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/tables', authenticateJWT, async (req, res) => {
  try {
    const { name } = req.body;
    const table = await Table.create({ name });
    res.status(201).json(table);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes for records
app.get('/tables/:tableId/records', authenticateJWT, async (req, res) => {
  try {
    const { tableId } = req.params;
    const records = await Record.findAll({ where: { tableId } });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/tables/:tableId/records', authenticateJWT, async (req, res) => {
  try {
    const { tableId } = req.params;
    const { content } = req.body;
    const record = await Record.create({ content, tableId });
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a record
app.post('/tables/:tableId/records', authenticateJWT, async (req, res) => {
  try {
    const { tableId } = req.params;
    const { firstName, lastName, email, role } = req.body;

    const newRecord = await User.create({ firstName, lastName, email, role });

    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Update a record
app.put('/tables/:tableId/records/:recordId', authenticateJWT, async (req, res) => {
  try {
    const { tableId, recordId } = req.params;
    const { firstName, lastName, email, role, createdAt, updatedAt } = req.body; // Add the fields you want to update

    const record = await User.findOne({ where: { id: recordId } });
    if (record) {
      record.firstName = firstName;
      record.lastName = lastName;
      record.email = email;
      record.role = role;
      record.createdAt = createdAt;
      record.updatedAt = updatedAt;

      await record.save();
      res.json(record);
    } else {
      res.status(404).json({ error: 'Record not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Delete a record
app.delete('/tables/:tableId/records/:recordId', authenticateJWT, async (req, res) => {
  try {
    const { tableId, recordId } = req.params;
    const record = await Record.findOne({ where: { id: recordId, tableId } });
    if (record) {
      await record.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Record not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve the chart HTML file
app.get('/chart', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chart.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
