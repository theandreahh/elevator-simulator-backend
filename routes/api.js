const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const DATA_FILE = path.join(__dirname, '../data/requests.json');
let currentConfig = {
    floorsCount: 7,
    elevatorsCount: 4,
  };
  

// Ensure file exists and is valid
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// ✅ Helper to safely read JSON
function safeReadJson(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content ? JSON.parse(content) : [];
  } catch (err) {
    console.error('❌ Failed to read/parse file:', err);
    return [];
  }
}

// GET /api/config
router.get('/config', (req, res) => {
  res.json(currentConfig);
});

// POST /api/request
router.post('/request', (req, res) => {
  const { type, floor, direction, elevatorId } = req.body;
  const entry = {
    timestamp: new Date().toISOString(),
    type,
    floor,
    direction,
    elevatorId
  };

  const data = safeReadJson(DATA_FILE);
  data.push(entry);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

  res.status(201).json({ message: 'Request logged', entry });
});

// GET /api/status
router.get('/status', (req, res) => {
  const data = safeReadJson(DATA_FILE);
  res.json({
    requestsLogged: data.length,
    recent: data.slice(-10)
  });
});

// POST /api/admin/reset
router.post('/admin/reset', (req, res) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  res.json({ message: 'Simulation log reset' });
});



  
  router.post('/config', (req, res) => {
    const { floorsCount, elevatorsCount } = req.body;
  
    if (
      typeof floorsCount === 'number' &&
      typeof elevatorsCount === 'number' &&
      floorsCount > 0 &&
      elevatorsCount > 0
    ) {
      currentConfig = { floorsCount, elevatorsCount };
      res.json({ message: 'Config updated', currentConfig });
    } else {
      res.status(400).json({ error: 'Invalid config values' });
    }
  });
  
module.exports = router;
