const express = require('express');
const router = express.Router();

// Mock data
const comics = [
  { id: 1, title: '漫畫一', author: '作者A', genre: '動作', cover: '' },
  { id: 2, title: '漫畫二', author: '作者B', genre: '冒險', cover: '' },
];

// GET all comics
router.get('/', (req, res) => {
  res.json(comics);
});

// GET single comic
router.get('/:id', (req, res) => {
  const comic = comics.find(c => c.id === parseInt(req.params.id));
  if (!comic) return res.status(404).json({ message: '找不到漫畫' });
  res.json(comic);
});

// POST create comic
router.post('/', (req, res) => {
  const comic = { id: comics.length + 1, ...req.body };
  comics.push(comic);
  res.status(201).json(comic);
});

// DELETE comic
router.delete('/:id', (req, res) => {
  const index = comics.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: '找不到漫畫' });
  comics.splice(index, 1);
  res.json({ message: '刪除成功' });
});

module.exports = router;
