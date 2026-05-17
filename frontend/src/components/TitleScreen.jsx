import React, { useEffect, useState } from 'react';

export default function TitleScreen({ onStart }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`title-screen ${visible ? 'visible' : ''}`}>
      <div className="title-content">
        <div className="title-city">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="building" style={{ '--i': i }} />
          ))}
        </div>
        <div className="title-text">
          <p className="title-sub">互動漫畫</p>
          <h1 className="title-main">心靈城市</h1>
          <p className="title-desc">你的選擇，決定城市的顏色</p>
        </div>
        <button className="btn-start" onClick={onStart}>
          開始故事
        </button>
      </div>
    </div>
  );
}
