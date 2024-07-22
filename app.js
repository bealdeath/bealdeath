const express = require('express');
const { sequelize, User, Table, Record } = require('./models'); // Ensure models are imported correctly

const app = express();
app.use(express.json());

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    // Sync the database
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

app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/users', async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const user = await User.create({ firstName, lastName, email });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes for tables
app.get('/tables', async (req, res) => {
  try {
    const tables = await Table.findAll();
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/tables', async (req, res) => {
  try {
    const { name } = req.body;
    const table = await Table.create({ name });
    res.status(201).json(table);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes for records
app.get('/tables/:tableId/records', async (req, res) => {
  try {
    const { tableId } = req.params;
    const records = await Record.findAll({ where: { tableId } });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/tables/:tableId/records', async (req, res) => {
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
app.put('/tables/:tableId/records/:recordId', async (req, res) => {
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
app.delete('/tables/:tableId/records/:recordId', async (req, res) => {
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
