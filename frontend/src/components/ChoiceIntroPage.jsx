import React, { useState, useEffect } from 'react';

export default function ChoiceIntroPage({ onContinue }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`choice-intro ${visible ? 'choice-intro-visible' : ''}`}
      onClick={onContinue}
    >
      <div className="choice-intro-inner">
        <p className="choice-intro-eyebrow">你的選擇</p>
        <h2 className="choice-intro-title">命運的十字路口</h2>
        <p className="choice-intro-body">
          霧爵士正在向一個孩子遞出那瓶發光的液體。<br />
          你只有一瞬間做出決定——
        </p>
        <p className="choice-intro-hint">點擊繼續</p>
      </div>
    </div>
  );
}
