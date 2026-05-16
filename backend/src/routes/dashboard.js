const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/dashboard — 回傳所有圖表需要的統計資料
router.get('/', (req, res) => {
  // 各選項票數
  const choices = db.prepare('SELECT choice_key, label, count FROM choices ORDER BY count DESC').all();

  const total = choices.reduce((s, r) => s + r.count, 0);

  const choicesWithPct = choices.map((r) => ({
    ...r,
    pct: total > 0 ? Math.round((r.count / total) * 100) : 0,
  }));

  // 結局分佈（依選項推算）
  const endingMap = {
    A: { badge: '好結局 1', emoji: '✨', type: 'good' },
    B: { badge: '壞結局 1', emoji: '🌑', type: 'bad' },
    D: { badge: '特殊結局 4', emoji: '💜', type: 'special' },
  };
  const endings = choicesWithPct.map((r) => ({
    ...r,
    ...(endingMap[r.choice_key] || {}),
  }));

  res.json({
    total,
    choices: choicesWithPct,
    endings,
    updatedAt: new Date().toISOString(),
  });
});

module.exports = router;
