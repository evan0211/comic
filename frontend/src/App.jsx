import React, { useState } from 'react';
import ComicPage from './components/ComicPage';
import ChoicePage from './components/ChoicePage';
import EndingPage from './components/EndingPage';
import StatsPage from './components/StatsPage';
import TitleScreen from './components/TitleScreen';
import { pages, endings } from './data/pages';
import './index.css';

export default function App() {
  const [screen, setScreen] = useState('title');
  const [currentPageId, setCurrentPageId] = useState(1);
  const [history, setHistory] = useState([]);
  const [currentEnding, setCurrentEnding] = useState(null);

  const page = pages[currentPageId];

  const goTo = (id) => {
    setHistory((h) => [...h, currentPageId]);
    setCurrentPageId(id);
  };

  const goToEnding = (ending) => {
    setCurrentEnding(ending);
  };

  const handleNext = () => {
    if (page.endingKey) {
      // 漫畫看完，進結局
      const ending = endings[page.endingKey];
      goToEnding(ending);
    } else {
      goTo(page.next);
    }
  };

  const handleChoice = async (choice) => {
    await fetch(`/api/choices/${choice.key}`, { method: 'POST' }).catch(() => {});
    goTo(choice.next);
  };

  const handleRestart = () => {
    setCurrentPageId(1);
    setHistory([]);
    setCurrentEnding(null);
    setScreen('title');
  };

  if (screen === 'title') {
    return <TitleScreen onStart={() => setScreen('comic')} />;
  }

  if (screen === 'stats') {
    return <StatsPage onBack={() => setScreen('comic')} />;
  }

  if (currentEnding) {
    return (
      <EndingPage
        page={page}
        ending={currentEnding}
        onRestart={handleRestart}
        onStats={() => setScreen('stats')}
      />
    );
  }

  if (page.isChoice) {
    return <ChoicePage page={page} onChoice={handleChoice} />;
  }

  return <ComicPage page={page} onNext={handleNext} />;
}
