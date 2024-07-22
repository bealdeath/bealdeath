require('dotenv').config();
const express = require('express');
const { sequelize, User, Table, Record } = require('./models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateJWT = require('./middleware/auth');

const app = express();
app.use(express.json());

const secret = process.env.JWT_SECRET;

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

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Register user
app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, isAdmin } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password before saving
    const user = await User.create({ firstName, lastName, email, password: hashedPassword, isAdmin });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login user
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, isAdmin: user.isAdmin }, secret, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: error.message });
  }
});

// Protect routes with authenticateJWT middleware
app.get('/protected', authenticateJWT, (req, res) => {
  res.send('This is a protected route');
});

// Protect users route
app.get('/users', authenticateJWT, async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
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

// Update a record
app.put('/tables/:tableId/records/:recordId', authenticateJWT, async (req, res) => {
  try {
    const { tableId, recordId } = req.params;
    const { content } = req.body;
    const record = await Record.findOne({ where: { id: recordId, tableId } });
    if (record) {
      record.content = content;
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
