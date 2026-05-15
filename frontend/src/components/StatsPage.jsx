import React, { useEffect, useState } from 'react';

const choiceInfo = {
  A: { emoji: '🔴', label: '挺身而出', color: '#e05555' },
  B: { emoji: '🟡', label: '繼續觀察', color: '#d4a017' },
  D: { emoji: '🟣', label: '走向霧爵士', color: '#9b59b6' },
};

export default function StatsPage({ onBack }) {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/choices/stats')
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const total = stats.reduce((s, r) => s + r.count, 0);

  return (
    <div className="page-wrapper">
      <div className="comic-panel stats-panel">
        <h1 className="page-title">📊 讀者選擇統計</h1>
        <p className="page-desc" style={{ marginBottom: 28 }}>看看大家在十字路口做了什麼選擇</p>

        {loading ? (
          <p className="loading">載入中…</p>
        ) : (
          <>
            <div className="stats-list">
              {stats.map((s) => {
                const info = choiceInfo[s.choice_key] || { emoji: '⬜', label: s.label, color: '#888' };
                const pct = total > 0 ? Math.round((s.count / total) * 100) : 0;
                return (
                  <div key={s.choice_key} className="stat-item">
                    <div className="stat-header">
                      <span className="stat-emoji">{info.emoji}</span>
                      <span className="stat-label">{info.label}</span>
                      <span className="stat-count" style={{ color: info.color }}>
                        {s.count} 票 · {pct}%
                      </span>
                    </div>
                    <div className="stat-bar-bg">
                      <div
                        className="stat-bar-fill"
                        style={{ width: `${pct}%`, background: info.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="stat-total">共 {total} 人做出選擇</p>
          </>
        )}

        {/* 結局速查表 */}
        <div className="ending-table">
          <h2 className="table-title">🏁 結局速查</h2>
          {[
            { emoji: '✨', badge: '好結局 1', path: 'A → A-2', msg: '關心的話比指責更有力量', state: '全城恢復，花瓣飄落' },
            { emoji: '🌑', badge: '壞結局 1', path: 'B → B-2', msg: '沉默比想的更重，但仍可求助', state: '城市大片灰暗，有出口提示' },
            { emoji: '💜', badge: '特殊結局 4', path: 'D → D-1', msg: '理解讓改變有了可能', state: '連最暗的角落也有光' },
          ].map((e) => (
            <div key={e.badge} className="table-row">
              <span className="table-emoji">{e.emoji}</span>
              <div className="table-body">
                <span className="table-badge">{e.badge}</span>
                <span className="table-path">{e.path}</span>
                <span className="table-msg">「{e.msg}」</span>
                <span className="table-state">🏙 {e.state}</span>
              </div>
            </div>
          ))}
        </div>

        <button className="btn-next" onClick={onBack}>← 返回</button>
      </div>
    </div>
  );
}
