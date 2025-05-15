const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const apiRoutes = require('./routes/api');

const app = express();
const PORT = 5050;

app.use(cors());
app.use(bodyParser.json());

// 🔧 Ensure apiRoutes is a valid router
if (typeof apiRoutes !== 'function') {
  console.error('❌ apiRoutes is not a function. Check the export in routes/api.js.');
  process.exit(1);
}


app.get('/', (req, res) => {
    res.send('✅ Elevator backend is running. Use /api/config or /api/status.');
  });
  

app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Elevator backend running on http://localhost:${PORT}`);
});


