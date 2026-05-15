const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../data/comic.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS choices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    choice_key TEXT NOT NULL UNIQUE,
    label TEXT NOT NULL,
    count INTEGER DEFAULT 0
  );
`);

// 確保三個選項都存在
const upsert = db.prepare(`
  INSERT INTO choices (choice_key, label, count)
  VALUES (?, ?, 0)
  ON CONFLICT(choice_key) DO NOTHING
`);
upsert.run('A', '挺身而出（好結局路線）');
upsert.run('B', '繼續觀察（壞結局路線）');
upsert.run('D', '走向霧爵士（特殊結局路線）');

module.exports = db;
