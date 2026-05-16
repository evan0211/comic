import React, { useEffect, useState } from 'react';

const CHOICE_COLOR = { A: '#e05555', B: '#d4a017', D: '#9b59b6' };
const ENDING_BG   = { good: '#0d2e0d', bad: '#1a0a0a', special: '#1a0d2e' };

export default function DashboardPage({ onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    fetch('/api/dashboard')
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setError('無法連線到後台'); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <button className="btn-back" onClick={onBack}>← 返回</button>
        <h1 className="dashboard-title">📊 後台 Dashboard</h1>
        <button className="btn-refresh" onClick={load}>↻ 重新整理</button>
      </div>

      {loading && <p className="dash-loading">載入中…</p>}
      {error   && <p className="dash-error">{error}</p>}

      {data && (
        <div className="dashboard-body">

          {/* ── 總覽卡片 ── */}
          <div className="dash-cards">
            <div className="dash-card">
              <span className="dash-card-num">{data.total}</span>
              <span className="dash-card-label">總選擇次數</span>
            </div>
            {data.choices.map((c) => (
              <div className="dash-card" key={c.choice_key}
                style={{ borderColor: CHOICE_COLOR[c.choice_key] }}>
                <span className="dash-card-num"
                  style={{ color: CHOICE_COLOR[c.choice_key] }}>{c.count}</span>
                <span className="dash-card-label">{c.label.split('（')[0]}</span>
                <span className="dash-card-pct">{c.pct}%</span>
              </div>
            ))}
          </div>

          {/* ── 選項長條圖 ── */}
          <section className="dash-section">
            <h2 className="dash-section-title">選項分佈</h2>
            <div className="dash-bars">
              {data.choices.map((c) => (
                <div className="dash-bar-row" key={c.choice_key}>
                  <span className="dash-bar-label">{c.label.split('（')[0]}</span>
                  <div className="dash-bar-track">
                    <div
                      className="dash-bar-fill"
                      style={{
                        width: `${c.pct}%`,
                        background: CHOICE_COLOR[c.choice_key],
                      }}
                    />
                  </div>
                  <span className="dash-bar-val"
                    style={{ color: CHOICE_COLOR[c.choice_key] }}>
                    {c.count} 票 · {c.pct}%
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* ── 圓餅圖（純 CSS conic-gradient）── */}
          <section className="dash-section">
            <h2 className="dash-section-title">結局佔比</h2>
            <div className="dash-pie-wrap">
              <PieChart choices={data.choices} />
              <div className="dash-pie-legend">
                {data.endings.map((e) => (
                  <div className="dash-legend-item" key={e.choice_key}>
                    <span className="dash-legend-dot"
                      style={{ background: CHOICE_COLOR[e.choice_key] }} />
                    <span>{e.emoji} {e.badge}</span>
                    <span className="dash-legend-pct">{e.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── 結局卡片 ── */}
          <section className="dash-section">
            <h2 className="dash-section-title">結局詳情</h2>
            <div className="dash-ending-cards">
              {data.endings.map((e) => (
                <div className="dash-ending-card" key={e.choice_key}
                  style={{ background: ENDING_BG[e.type], borderColor: CHOICE_COLOR[e.choice_key] }}>
                  <div className="dash-ending-emoji">{e.emoji}</div>
                  <div className="dash-ending-badge"
                    style={{ color: CHOICE_COLOR[e.choice_key] }}>{e.badge}</div>
                  <div className="dash-ending-count"
                    style={{ color: CHOICE_COLOR[e.choice_key] }}>{e.count} 人</div>
                  <div className="dash-ending-pct">{e.pct}%</div>
                </div>
              ))}
            </div>
          </section>

          <p className="dash-updated">最後更新：{new Date(data.updatedAt).toLocaleString('zh-TW')}</p>
        </div>
      )}
    </div>
  );
}

// 純 CSS conic-gradient 圓餅圖
function PieChart({ choices }) {
  const total = choices.reduce((s, c) => s + c.count, 0);
  if (total === 0) {
    return <div className="dash-pie" style={{ background: '#222' }} />;
  }

  let cumulative = 0;
  const segments = choices.map((c) => {
    const pct = c.count / total;
    const start = cumulative;
    cumulative += pct;
    return { key: c.choice_key, start, end: cumulative };
  });

  const gradient = segments
    .map((s) => {
      const color = CHOICE_COLOR[s.key] || '#888';
      return `${color} ${(s.start * 360).toFixed(1)}deg ${(s.end * 360).toFixed(1)}deg`;
    })
    .join(', ');

  return (
    <div
      className="dash-pie"
      style={{ background: `conic-gradient(${gradient})` }}
    />
  );
}
