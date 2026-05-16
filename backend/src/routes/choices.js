const express = require('express');
const router = express.Router();
const db = require('../db');

// GET 取得所有選項統計
router.get('/stats', (req, res) => {
  const rows = db.prepare('SELECT choice_key, label, count FROM choices').all();
  res.json(rows);
});

// POST 記錄一次選擇；?auto=1 時不寫入資料庫（自動播放模式）
router.post('/:key', (req, res) => {
  const { key } = req.params;
  const isAuto = req.query.auto === '1';

  if (!isAuto) {
    const row = db.prepare('SELECT id FROM choices WHERE choice_key = ?').get(key);
    if (!row) return res.status(404).json({ message: '無效的選項' });
    db.prepare('UPDATE choices SET count = count + 1 WHERE choice_key = ?').run(key);
  }

  res.json({ message: 'ok', recorded: !isAuto });
});

module.exports = router;
