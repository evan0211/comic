import React, { useState, useEffect } from 'react';

export default function ChoicePage({ page, onChoice, onHover }) {
  const [selected, setSelected] = useState(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleSelect = (choice) => {
    if (selected) return;
    setSelected(choice.key);
    setTimeout(() => onChoice(choice), 700);
  };

  return (
    <div className={`choice-fullscreen ${entered ? 'page-enter' : ''}`}>
      {page.choices.map((choice, i) => (
        <div
          key={choice.key}
          className={`choice-slice
            ${selected === choice.key ? 'slice-selected' : ''}
            ${selected && selected !== choice.key ? 'slice-faded' : ''}
          `}
          style={{
            '--choice-color': choice.color,
            backgroundImage: choice.img ? `url(${choice.img})` : undefined,
            backgroundColor: choice.img ? undefined : '#0a0a1e',
          }}
          onClick={() => handleSelect(choice)}
          onMouseEnter={() => onHover?.(choice.next)}
          onMouseLeave={() => onHover?.(null)}
        >
          {/* 暗色遮罩 */}
          <div className="slice-overlay" />

          {/* 文字標籤 */}
          <div className="slice-label">
            <span className="slice-text">{choice.label}</span>
            <span className="slice-desc">{choice.desc}</span>
          </div>

          {/* 選中光暈 */}
          {selected === choice.key && (
            <div className="slice-glow" style={{ background: choice.color }} />
          )}
        </div>
      ))}
    </div>
  );
}
