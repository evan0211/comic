import React, { useState, useEffect, useRef } from 'react';
import ComicPage from './components/ComicPage';
import ChoicePage from './components/ChoicePage';
import ChoiceIntroPage from './components/ChoiceIntroPage';
import EndingPage from './components/EndingPage';
import TitleScreen from './components/TitleScreen';
import { pages, endings } from './data/pages';
import './index.css';

const IDLE_TIMEOUT  = 20_000; // 20 秒無操作 → 觸發自動播放
const AUTO_INTERVAL = 10_000; // 自動播放中每頁等 10 秒再翻

// ── BGM ──────────────────────────────────────────────────────
function getBgmSrc(screen, pageId, ending, hoveredPageId, isAuto) {
  if (screen === 'title') return '/music/p1.mp3';
  if (ending) {
    const route = pages[pageId]?.route;
    if (route === 'A') return '/music/a.mp3';
    if (route === 'B') return '/music/b.mp3';
    if (route === 'D') return '/music/c.mp3';
    return '/music/p1.mp3';
  }
  const page = pages[pageId];
  if (!page) return '/music/p1.mp3';
  if (page.isChoice) {
    if (isAuto) return '/music/p1.mp3'; // 自動播放：繼續播共同幕音樂
    if (hoveredPageId) {
      const hovered = pages[hoveredPageId];
      if (hovered?.route === 'A') return '/music/a.mp3';
      if (hovered?.route === 'B') return '/music/b.mp3';
      if (hovered?.route === 'D') return '/music/c.mp3';
    }
    return null;
  }
  if (page.route === 'A') return '/music/a.mp3';
  if (page.route === 'B') return '/music/b.mp3';
  if (page.route === 'D') return '/music/c.mp3';
  return '/music/p1.mp3';
}

function crossfade(audio, targetSrc, currentSrcRef, fadeTimerRef) {
  if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
  const FADE_MS = 800, STEP_MS = 50;
  const steps = FADE_MS / STEP_MS;
  const startVol = audio.volume;

  const fadeIn = () => {
    audio.volume = 0;
    audio.play().catch(() => {});
    let n = 0;
    fadeTimerRef.current = setInterval(() => {
      n++;
      audio.volume = Math.min(1, n / steps);
      if (n >= steps) { audio.volume = 1; clearInterval(fadeTimerRef.current); }
    }, STEP_MS);
  };

  if (targetSrc === null) {
    let n = 0;
    fadeTimerRef.current = setInterval(() => {
      n++;
      audio.volume = Math.max(0, startVol * (1 - n / steps));
      if (n >= steps) { clearInterval(fadeTimerRef.current); audio.pause(); }
    }, STEP_MS);
    return;
  }

  if (currentSrcRef.current === targetSrc) {
    if (audio.paused) fadeIn();
    return;
  }

  // src 不同（或第一次播放）→ 淡出換曲
  currentSrcRef.current = targetSrc;
  let n = 0;
  fadeTimerRef.current = setInterval(() => {
    n++;
    audio.volume = Math.max(0, startVol * (1 - n / steps));
    if (n >= steps) {
      clearInterval(fadeTimerRef.current);
      audio.pause();
      audio.src = targetSrc;
      fadeIn();
    }
  }, STEP_MS);
}

// ── App ───────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen]               = useState('title');
  const [currentPageId, setCurrentPageId] = useState(1);
  const [history, setHistory]             = useState([]);
  const [currentEnding, setCurrentEnding] = useState(null);
  const [hoveredPageId, setHoveredPageId] = useState(null);
  const [isAuto, setIsAuto]               = useState(false);
  const [autoAdvanceTick, setAutoAdvanceTick] = useState(0);
  const [showChoiceIntro, setShowChoiceIntro] = useState(false);

  const audioRef       = useRef(null);
  const currentSrcRef  = useRef(null);
  const fadeTimerRef   = useRef(null);

  // refs 讓 callback 永遠讀到最新值
  const screenRef        = useRef(screen);
  const isAutoRef        = useRef(isAuto);
  const currentPageIdRef = useRef(currentPageId);
  const currentEndingRef = useRef(currentEnding);
  useEffect(() => { screenRef.current        = screen;        }, [screen]);
  useEffect(() => { isAutoRef.current        = isAuto;        }, [isAuto]);
  useEffect(() => { currentPageIdRef.current = currentPageId; }, [currentPageId]);
  useEffect(() => { currentEndingRef.current = currentEnding; }, [currentEnding]);

  // ── 自動播放 step（每次執行一步，然後排下一個 timeout）──
  const autoTimerRef = useRef(null);

  const scheduleNextStep = () => {
    if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    autoTimerRef.current = setTimeout(() => {
      if (!isAutoRef.current) return;
      doAutoStep();
    }, AUTO_INTERVAL);
  };

  const doAutoStep = () => {
    const s   = screenRef.current;
    const pid = currentPageIdRef.current;

    // 結局頁 → 回首頁重新開始
    if (currentEndingRef.current) {
      setCurrentPageId(1);
      setHistory([]);
      setCurrentEnding(null);
      setAutoAdvanceTick(0);
      setShowChoiceIntro(false);
      setScreen('title');
      setIsAuto(false);
      return;
    }

    if (s === 'title') {
      // 首頁 → 自動開始，音樂交給 BGM effect 處理
      setScreen('comic');
      scheduleNextStep();
      return;
    }

    if (s === 'comic') {
      const pg = pages[pid];
      if (!pg) return;

      if (pg.isChoice) {
        // 選擇頁：隨機選
        const choice = pg.choices[Math.floor(Math.random() * pg.choices.length)];
        fetch(`/api/choices/${choice.key}?auto=1`, { method: 'POST' }).catch(() => {});
        setHistory((h) => [...h, pid]);
        setCurrentPageId(choice.next);
      } else {
        // 漫畫頁：觸發 ComicPage 翻格/翻頁（自動播放跳過 intro）
        setShowChoiceIntro(false);
        setAutoAdvanceTick((t) => t + 1);
      }
      scheduleNextStep();
    }
  };

  // ── 待機偵測 ──────────────────────────────────────────
  useEffect(() => {
    let lastMove = Date.now();
    let idleChecker = null;

    const onMove = () => {
      lastMove = Date.now();
      // 自動播放中滑鼠一動 → 立刻回首頁
      if (isAutoRef.current) {
        if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
        setIsAuto(false);
        setCurrentPageId(1);
        setHistory([]);
        setCurrentEnding(null);
        setAutoAdvanceTick(0);
        setShowChoiceIntro(false);
        setScreen('title');
      }
    };

    idleChecker = setInterval(() => {
      if (isAutoRef.current) return; // 已在自動播放，不重複觸發
      if (Date.now() - lastMove >= IDLE_TIMEOUT) {
        setIsAuto(true);
        doAutoStep();
      }
    }, 1000);

    window.addEventListener('mousemove',  onMove, { passive: true });
    window.addEventListener('mousedown',  onMove, { passive: true });
    window.addEventListener('touchstart', onMove, { passive: true });
    window.addEventListener('keydown',    onMove, { passive: true });

    return () => {
      clearInterval(idleChecker);
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('mousedown',  onMove);
      window.removeEventListener('touchstart', onMove);
      window.removeEventListener('keydown',    onMove);
    };
  }, []); // eslint-disable-line

  // ── BGM ──────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    crossfade(audio, getBgmSrc(screen, currentPageId, currentEnding, hoveredPageId, isAuto), currentSrcRef, fadeTimerRef);
  }, [screen, currentPageId, currentEnding, hoveredPageId, isAuto]);

  // ── 導航 ─────────────────────────────────────────────
  const goTo = (id) => {
    setHistory((h) => [...h, currentPageId]);
    setCurrentPageId(id);
  };

  const handleNext = () => {
    const page = pages[currentPageId];
    if (page.endingKey) {
      setCurrentEnding(endings[page.endingKey]);
    } else if (!isAuto && pages[page.next]?.isChoice) {
      // 手動模式下一頁是選擇頁 → 先顯示過場提示
      setShowChoiceIntro(true);
    } else {
      goTo(page.next);
    }
  };

  const handleChoice = async (choice) => {
    await fetch(`/api/choices/${choice.key}`, { method: 'POST' }).catch(() => {});
    goTo(choice.next);
  };

  const handleRestart = () => {
    if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    setCurrentPageId(1);
    setHistory([]);
    setCurrentEnding(null);
    setIsAuto(false);
    setAutoAdvanceTick(0);
    setShowChoiceIntro(false);
    setScreen('title');
  };

  const startGame = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.src = '/music/p1.mp3';
      audio.volume = 1;
      currentSrcRef.current = '/music/p1.mp3';
      audio.play().catch(() => {});
    }
    setAutoAdvanceTick(0);
    setScreen('comic');
  };

  const page = pages[currentPageId];

  const renderScreen = () => {
    if (screen === 'title') return <TitleScreen onStart={startGame} />;
    if (currentEnding) {
      return (
        <EndingPage
          page={page}
          ending={currentEnding}
          onRestart={handleRestart}
          onDashboard={() => window.open('http://localhost:3001/dashboard', '_blank')}
        />
      );
    }
    if (showChoiceIntro) {
      return (
        <ChoiceIntroPage
          onContinue={() => {
            setShowChoiceIntro(false);
            goTo(pages[currentPageId].next);
          }}
        />
      );
    }
    if (page.isChoice) {
      return <ChoicePage page={page} onChoice={handleChoice} onHover={setHoveredPageId} />;
    }
    return <ComicPage page={page} onNext={handleNext} autoAdvance={autoAdvanceTick} />;
  };

  return (
    <>
      <audio ref={audioRef} loop style={{ display: 'none' }} />
      {isAuto && (
        <div className="auto-overlay">
          <span className="auto-hint">▶ 自動播放中　移動滑鼠返回首頁</span>
        </div>
      )}
      {renderScreen()}
    </>
  );
}
