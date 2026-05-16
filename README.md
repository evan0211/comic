# 褪色城市 — 互動漫畫

一個以心理健康為主題的互動漫畫，玩家的選擇決定城市的顏色與結局。

## 故事結構

```
第一幕：褪色的日常
  ↓
你的選擇（三選一）
  ├─ 挺身而出 → 路線 A → ✨ 好結局：同理心的花
  ├─ 繼續觀察 → 路線 B → 🌑 壞結局：沉默的代價
  └─ 走向霧爵士 → 路線 D → 💜 特殊結局：霧爵士的眼淚
```

## 啟動

```bash
# 安裝依賴（第一次）
cd backend && npm install
cd ../frontend && npm install

# 後端（port 3001）
cd backend && node src/server.js

# 前端（port 3000）
cd frontend && npm run dev
```

## 功能

- 全螢幕漫畫翻頁，點擊推進
- 三路線選擇頁，hover 預覽對應 BGM
- 待機 20 秒自動播放，滑鼠移動立刻回首頁
- 四首 BGM 依場景自動切換（淡入淡出）
- 選擇統計寫入 SQLite，自動播放不計入
- 後台統計頁：`http://localhost:3001/dashboard`

## API

| Method | Path | 說明 |
|--------|------|------|
| GET | /api/choices/stats | 查詢各選項票數 |
| POST | /api/choices/:key | 記錄選擇（`?auto=1` 不寫入） |
| GET | /api/dashboard | 統計資料（JSON） |
| GET | /dashboard | 後台統計頁面 |

## 重置資料庫

```bash
rm backend/data/comic.db
# 重啟後端自動重建
```

## 檔案結構

```
frontend/src/
  components/   # TitleScreen / ComicPage / ChoicePage / EndingPage ...
  data/pages.js # 故事內容、選項、結局文字
  index.css     # 全部樣式

backend/src/
  server.js     # Express 入口
  db.js         # SQLite 初始化
  routes/       # choices / dashboard
  public/       # dashboard.html
```
