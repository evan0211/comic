import React, { useEffect, useState, useMemo } from 'react';

const endingBg = {
  good:    'radial-gradient(ellipse at center, #0d2e0d 0%, #0a0a14 70%)',
  bad:     'radial-gradient(ellipse at center, #1a0a0a 0%, #050505 70%)',
  special: 'radial-gradient(ellipse at center, #1a0d2e 0%, #0a0a14 70%)',
};

const endingAccent = { good: '#60cc60', bad: '#cc4444', special: '#9b59b6' };

export default function EndingPage({ page, ending, onRestart, onDashboard }) {
  const [entered, setEntered] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 80);
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
      className={`ending-fullscreen ${entered ? 'page-enter' : ''}`}
      style={{ background: endingBg[ending.type] }}
    >
      {/* 粒子 */}
      <div className="ending-particles">
        {particles.map((p) => (
          <div key={p.id} className="ending-particle" style={{
            left: `${p.x}%`, width: p.size, height: p.size,
            background: accent, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`,
          }} />
        ))}
      </div>

      {/* 圖片區 */}
      <div className="ending-img-area">
        {ending.img ? (
          <img src={ending.img} alt={ending.title} className="ending-img-full" />
        ) : (
          <div className="ending-img-fallback" style={{ background: '#050510' }}>
            <EndingArt type={ending.type} accent={accent} />
          </div>
        )}
        {/* 圖片底部漸層遮罩 */}
        <div className="ending-img-fade" style={{
          background: `linear-gradient(to bottom, transparent 40%, ${endingBg[ending.type].match(/#[0-9a-f]+(?=\s+70%)/i)?.[0] ?? '#0a0a14'} 100%)`
        }} />
      </div>

      {/* 文字區 */}
      <div className="ending-text-area">
        <div className="ending-badge" style={{ color: accent, borderColor: accent }}>
          {ending.emoji} {ending.badge}
        </div>

        <h1 className="ending-title-lg" style={{ color: accent }}>
          {ending.title}
        </h1>

        <p className="ending-desc-text">{ending.description}</p>

        <p className="ending-reason-text" style={{ color: accent }}>
          {ending.reason}
        </p>

        <div className="ending-actions">
          <button className="btn-next" onClick={onRestart}>重新開始</button>
          <button className="btn-stats" onClick={onDashboard}>統計</button>
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
