import React, { useState, useEffect } from 'react';

const moodBg = {
  grey:   'linear-gradient(160deg, #1a1a2e 0%, #2a2a3e 100%)',
  neon:   'linear-gradient(160deg, #0d0d1a 0%, #1a0d2e 100%)',
  red:    'linear-gradient(160deg, #1a0d0d 0%, #2e1a1a 100%)',
  warm:   'linear-gradient(160deg, #0d1a0d 0%, #1a2e1a 100%)',
  dark:   'linear-gradient(160deg, #0a0a0a 0%, #1a1a1a 100%)',
  purple: 'linear-gradient(160deg, #0d0d1a 0%, #1a0d2e 100%)',
};

const moodAccent = {
  grey: '#5a5a8a', neon: '#cc44ff', red: '#e05555',
  warm: '#60aa60', dark: '#444',    purple: '#9b59b6',
};

export default function ComicPage({ page, onNext }) {
  const [panelIndex, setPanelIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    setPanelIndex(0);
    setEntered(false);
    const t = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(t);
  }, [page.id]);

  const currentPanel = page.panels[panelIndex];
  const isLast = panelIndex === page.panels.length - 1;
  const accent = moodAccent[currentPanel.mood] || '#5a5a8a';

  const advance = () => {
    if (animating) return;
    if (!isLast) {
      setAnimating(true);
      setTimeout(() => { setPanelIndex(i => i + 1); setAnimating(false); }, 300);
    } else {
      onNext();
    }
  };

  return (
    <div
      className={`comic-fullscreen ${entered ? 'page-enter' : ''}`}
      style={{ background: moodBg[currentPanel.mood] }}
      onClick={advance}
    >
      {/* 格數指示 */}
      <div className="panel-dots">
        {page.panels.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === panelIndex ? 'dot-active' : ''} ${i < panelIndex ? 'dot-done' : ''}`}
            style={i === panelIndex ? { background: accent } : {}}
          />
        ))}
      </div>

      <div className={`comic-fullscreen-inner ${animating ? 'panel-exit' : 'panel-show'}`}>
        {currentPanel.img ? (
          <img
            src={currentPanel.img}
            alt={currentPanel.text}
            className="manga-img-fullscreen"
          />
        ) : (
          <div
            className="manga-art-fullscreen"
            style={{ background: currentPanel.mood === 'neon' ? '#0a0015' : '#0a0a14' }}
          >
            <FallbackArt mood={currentPanel.mood} panelIndex={panelIndex} accent={accent} />
          </div>
        )}
      </div>

      <div className="tap-hint-fullscreen">
        {isLast ? '點擊繼續 →' : `點擊下一格 (${panelIndex + 1}/${page.panels.length})`}
      </div>
    </div>
  );
}

function FallbackArt({ mood, panelIndex, accent }) {
  return (
    <>
      {(mood === 'red' || mood === 'neon') && (
        <div className="speed-lines">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="speed-line" style={{ '--angle': `${i * 22.5}deg` }} />
          ))}
        </div>
      )}
      {mood === 'neon' && (
        <>
          <div className="neon-orb" style={{ left: '30%', top: '40%', background: '#cc44ff' }} />
          <div className="neon-orb" style={{ left: '60%', top: '55%', background: '#44ccff', animationDelay: '0.5s' }} />
        </>
      )}
      {mood === 'warm' && (
        <div className="flower-bloom">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="petal" style={{ '--r': `${i * 60}deg`, background: accent }} />
          ))}
          <div className="flower-center" style={{ background: accent }} />
        </div>
      )}
      {mood === 'dark' && (
        <div className="dark-particles">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="particle" style={{ '--x': `${10 + i * 11}%`, '--delay': `${i * 0.3}s` }} />
          ))}
        </div>
      )}
      {mood === 'purple' && (
        <div className="ripple-container">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="ripple" style={{ '--delay': `${i * 0.6}s`, borderColor: accent }} />
          ))}
        </div>
      )}
    </>
  );
}
