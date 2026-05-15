import React, { useEffect, useState } from 'react';

const endingBg = {
  good:    'radial-gradient(ellipse at center, #0d2e0d 0%, #1a1a2e 70%)',
  bad:     'radial-gradient(ellipse at center, #1a0a0a 0%, #0a0a0a 70%)',
  special: 'radial-gradient(ellipse at center, #1a0d2e 0%, #0d0d1a 70%)',
};

const endingAccent = { good: '#60cc60', bad: '#cc4444', special: '#9b59b6' };

export default function EndingPage({ page, ending, onRestart, onStats }) {
  const [entered, setEntered] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 80);
    // 生成粒子
    setParticles([...Array(20)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 3,
      dur: 2 + Math.random() * 3,
      size: 3 + Math.random() * 6,
    })));
    return () => clearTimeout(t);
  }, []);

  const accent = endingAccent[ending.type];

  return (
    <div
      className={`page-wrapper ending-wrapper ${entered ? 'page-enter' : ''}`}
      style={{ background: endingBg[ending.type] }}
    >
      {/* 粒子 */}
      <div className="ending-particles">
        {particles.map((p) => (
          <div
            key={p.id}
            className="ending-particle"
            style={{
              left: `${p.x}%`,
              width: p.size,
              height: p.size,
              background: accent,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.dur}s`,
            }}
          />
        ))}
      </div>

      <div className="comic-panel ending-panel">
        {/* 結局徽章 */}
        <div className="ending-badge" style={{ color: accent, borderColor: accent }}>
          {ending.emoji} {ending.badge}
        </div>

        <div className="act-label">{page.act}</div>
        <h1 className="page-title ending-title" style={{ color: accent }}>
          {ending.title}
        </h1>

        {/* 漫畫格 */}
        <div className="manga-frame" style={{ borderColor: accent }}>
          {ending.img ? (
            <img src={ending.img} alt={ending.title} className="manga-img" />
          ) : (
            <div className="manga-art">
              <div className="art-bg" style={{ background: '#050510' }}>
                <EndingArt type={ending.type} accent={accent} />
              </div>
            </div>
          )}
        </div>

        {/* 核心訊息 */}
        <div className="ending-message" style={{ borderLeftColor: accent }}>
          <p className="ending-msg-text">💬 {ending.message}</p>
        </div>

        <p className="page-desc">{ending.description}</p>

        <div className="city-state" style={{ color: accent + 'aa' }}>
          🏙 {ending.cityState}
        </div>

        <div className="ending-actions">
          <button className="btn-next" onClick={onRestart}>重新開始</button>
          <button className="btn-stats" onClick={onStats}>查看統計</button>
        </div>
      </div>
    </div>
  );
}

function EndingArt({ type, accent }) {
  if (type === 'good') return (
    <div className="ending-art-good">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bloom-petal" style={{ '--r': `${i * 45}deg`, background: accent, '--delay': `${i * 0.1}s` }} />
      ))}
      <div className="bloom-center" style={{ background: accent }} />
      <div className="bloom-glow" style={{ boxShadow: `0 0 40px 20px ${accent}44` }} />
    </div>
  );

  if (type === 'bad') return (
    <div className="ending-art-bad">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="fog-layer" style={{ '--i': i, '--delay': `${i * 0.4}s` }} />
      ))}
      <div className="bad-light" style={{ background: accent }} />
    </div>
  );

  return (
    <div className="ending-art-special">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="ripple" style={{ '--delay': `${i * 0.7}s`, borderColor: accent }} />
      ))}
      <div className="tear-drop" style={{ background: accent }} />
    </div>
  );
}
