const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/choices', require('./routes/choices'));
app.use('/api/dashboard', require('./routes/dashboard'));

// 獨立 dashboard 頁面
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
