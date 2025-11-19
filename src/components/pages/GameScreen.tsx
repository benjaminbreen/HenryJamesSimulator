import { useEffect } from 'react';
import { useGameStore } from '../../stores/gameStore';
import GameHeader from '../game/GameHeader';
import LocationView from '../game/LocationView';
import InventoryView from '../game/InventoryView';
import JournalView from '../game/JournalView';
import MapView from '../game/MapView';
import CombatView from '../game/CombatView';
import EventView from '../game/EventView';
import GameLog from '../game/GameLog';
import FactCheckPanel from '../game/FactCheckPanel';
import BookReader from '../game/BookReader';
import QuestTracker from '../game/QuestTracker';

const GameScreen = () => {
  const { currentView, factCheckVisible, readingBook } = useGameStore();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const { setView, setFactCheckVisible, factCheckVisible: isVisible } = useGameStore.getState();

      if (e.key === 'm' || e.key === 'M') setView('map');
      if (e.key === 'i' || e.key === 'I') setView('inventory');
      if (e.key === 'j' || e.key === 'J') setView('journal');
      if (e.key === 'l' || e.key === 'L') setView('main');
      if (e.key === 'f' || e.key === 'F') setFactCheckVisible(!isVisible);
      if (e.key === 'Escape') setView('main');
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="min-h-screen bg-belle-cream dark:bg-paris-night">
      <GameHeader />

      <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl">
        {/* Main View Area */}
        <div className="lg:col-span-2 space-y-4">
          {currentView === 'main' && <LocationView />}
          {currentView === 'inventory' && <InventoryView />}
          {currentView === 'journal' && <JournalView />}
          {currentView === 'map' && <MapView />}
          {currentView === 'combat' && <CombatView />}
          {currentView === 'event' && <EventView />}
          {currentView === 'book-reader' && readingBook && <BookReader book={readingBook} />}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <QuestTracker />
          <GameLog />
          {factCheckVisible && <FactCheckPanel />}
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
