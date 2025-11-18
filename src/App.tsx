import { useEffect } from 'react';
import { useGameStore } from './stores/gameStore';
import TitleScreen from './components/pages/TitleScreen';
import GameScreen from './components/pages/GameScreen';
import SettingsScreen from './components/pages/SettingsScreen';
import AboutScreen from './components/pages/AboutScreen';
import FAQScreen from './components/pages/FAQScreen';
import GameOverScreen from './components/pages/GameOverScreen';
import './index.css';

function App() {
  const { currentScreen, settings } = useGameStore();

  // Apply theme
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Apply font size
  useEffect(() => {
    const sizes = { small: '14px', medium: '16px', large: '18px' };
    document.documentElement.style.fontSize = sizes[settings.fontSize];
  }, [settings.fontSize]);

  return (
    <div className="min-h-screen bg-belle-cream dark:bg-paris-night transition-colors duration-300">
      {currentScreen === 'title' && <TitleScreen />}
      {currentScreen === 'game' && <GameScreen />}
      {currentScreen === 'settings' && <SettingsScreen />}
      {currentScreen === 'about' && <AboutScreen />}
      {currentScreen === 'faq' && <FAQScreen />}
      {currentScreen === 'game-over' && <GameOverScreen />}
    </div>
  );
}

export default App;
