const express = require('express');
const verifyRole = require('../middleware/verifyRole');
const router = express.Router();

// Example route accessible only by admins
router.get('/admin/data', verifyRole(['admin']), (req, res) => {
  res.send('Admin data');
});

// Example route accessible by editors and admins
router.post('/edit/data', verifyRole(['admin', 'editor']), (req, res) => {
  res.send('Edit data');
});

// Example route accessible by viewers, editors, and admins
router.get('/view/data', verifyRole(['admin', 'editor', 'viewer']), (req, res) => {
  res.send('View data');
});

module.exports = router;
