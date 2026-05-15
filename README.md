# Comic App — 互動漫畫

## 故事結構

```
第1頁 褪色的日常
  ↓
第2頁 巷弄裡的霓虹誘惑
  ↓
第3頁 互動抉擇 ← 選擇點
  ├─ 守護色彩 → 第4A頁 紫錐花的覺醒 → 第5A頁 好結局
  └─ 沉默離去 → 第4B頁 沉默的代價  → 第5B頁 壞結局
```

## 啟動

```bash
# Backend (port 3001)
cd backend && npm install && npm run dev

# Frontend (port 3000)
cd frontend && npm install && npm run dev
```

## API

| Method | Path | 說明 |
|--------|------|------|
| POST | /api/choices/good | 記錄好結局選擇 |
| POST | /api/choices/bad  | 記錄壞結局選擇 |
| GET  | /api/choices/stats | 查詢統計資料 |

## 新增分支

1. 在 `frontend/src/data/pages.js` 加入新頁面
2. 在 `backend/src/db.js` 的 INSERT 加入新 choice_key
