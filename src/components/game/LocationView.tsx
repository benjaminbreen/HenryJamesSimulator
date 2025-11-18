import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { LOCATIONS } from '../../constants/locations';
import { NPCS } from '../../constants/npcs';
import { getAvailableEvents } from '../../constants/events';
import { generateItem } from '../../utils/itemGenerator';

const LocationView = () => {
  const {
    player,
    changeLocation,
    startCombat,
    addItem,
    addLog,
    triggerEvent,
    completedEvents,
    setView,
  } = useGameStore();

  const [selectedNPC, setSelectedNPC] = useState<string | null>(null);

  const currentLocation = LOCATIONS[player.location];
  const npcsHere = currentLocation.npcs.map((id) => NPCS[id]);
  const availableEvents = getAvailableEvents(player.location, player.level, completedEvents);

  const handleExplore = () => {
    // Random encounter
    const outcomes = [
      () => {
        const item = generateItem();
        addItem(item);
        addLog({ type: 'success', message: `Found: ${item.name}!`, icon: '✨' });
      },
      () => {
        const gold = Math.floor(Math.random() * 50) + 10;
        useGameStore.getState().updatePlayer({ gold: player.gold + gold });
        addLog({ type: 'success', message: `Found ${gold} francs!`, icon: '💰' });
      },
      () => {
        addLog({
          type: 'info',
          message: currentLocation.ambientText[Math.floor(Math.random() * currentLocation.ambientText.length)],
          icon: '👁️',
        });
      },
    ];

    const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
    randomOutcome();
  };

  const handleTriggerRandomEvent = () => {
    if (availableEvents.length > 0) {
      const event = availableEvents[Math.floor(Math.random() * availableEvents.length)];
      triggerEvent(event);
    } else {
      addLog({ type: 'info', message: 'Nothing remarkable happens at the moment.', icon: '🤷' });
    }
  };

  return (
    <div className="space-y-4">
      {/* Location Display */}
      <div className="ornate-border bg-white dark:bg-belle-navy/30 p-6 space-y-4">
        <h2 className="text-3xl font-display text-belle-burgundy dark:text-belle-gold">
          {currentLocation.name}
        </h2>

        <pre className="ascii-art text-xs sm:text-sm text-belle-navy dark:text-belle-gold overflow-x-auto">
          {currentLocation.asciiArt}
        </pre>

        <p className="text-belle-navy dark:text-belle-cream leading-relaxed">
          {currentLocation.description}
        </p>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleExplore}
            className="px-4 py-2 bg-belle-burgundy text-belle-cream rounded hover:bg-belle-burgundy/90 transition-all"
          >
            🔍 Explore
          </button>
          <button
            onClick={handleTriggerRandomEvent}
            className="px-4 py-2 bg-belle-sage text-belle-navy rounded hover:bg-belle-sage/90 transition-all"
          >
            🎲 Wait for Events
          </button>
          <button
            onClick={() => setView('map')}
            className="px-4 py-2 bg-belle-gold/30 text-belle-navy dark:text-belle-cream rounded hover:bg-belle-gold/40 transition-all"
          >
            🗺️ Map (M)
          </button>
          <button
            onClick={() => setView('inventory')}
            className="px-4 py-2 bg-belle-gold/30 text-belle-navy dark:text-belle-cream rounded hover:bg-belle-gold/40 transition-all"
          >
            🎒 Inventory (I)
          </button>
          <button
            onClick={() => setView('journal')}
            className="px-4 py-2 bg-belle-gold/30 text-belle-navy dark:text-belle-cream rounded hover:bg-belle-gold/40 transition-all"
          >
            📔 Journal (J)
          </button>
        </div>
      </div>

      {/* NPCs */}
      {npcsHere.length > 0 && (
        <div className="ornate-border bg-white dark:bg-belle-navy/30 p-6 space-y-4">
          <h3 className="text-2xl font-display text-belle-burgundy dark:text-belle-gold">
            Notable Persons Present
          </h3>
          <div className="space-y-3">
            {npcsHere.map((npc) => (
              <div key={npc.id} className="border-2 border-belle-gold/30 rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-xl font-display text-belle-burgundy dark:text-belle-gold">
                      {npc.name}
                    </h4>
                    <p className="text-sm text-belle-navy/70 dark:text-belle-cream/70">
                      {npc.title}
                    </p>
                    <p className="text-sm text-belle-navy dark:text-belle-cream mt-2">
                      {npc.description}
                    </p>
                  </div>
                  <pre className="ascii-art text-xs text-belle-burgundy dark:text-belle-gold">
                    {npc.portrait}
                  </pre>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedNPC(selectedNPC === npc.id ? null : npc.id)}
                    className="px-3 py-1 bg-belle-sage text-belle-navy rounded hover:bg-belle-sage/90 transition-all text-sm"
                  >
                    💬 Approach
                  </button>
                  <button
                    onClick={() => startCombat(npc.id)}
                    className="px-3 py-1 bg-belle-burgundy text-belle-cream rounded hover:bg-belle-burgundy/90 transition-all text-sm"
                  >
                    ⚔️ Challenge
                  </button>
                </div>
                {selectedNPC === npc.id && (
                  <div className="mt-2 p-3 bg-belle-cream/50 dark:bg-black/20 rounded text-sm">
                    <p className="text-belle-navy dark:text-belle-cream italic">
                      {npc.name} regards you with {npc.personality.split(',')[0]} interest. In a
                      full implementation, you would engage in LLM-powered dialogue here, with
                      their personality and historical context shaping their responses. Use the
                      Challenge button to engage in wit-based combat instead.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Connections */}
      <div className="ornate-border bg-white dark:bg-belle-navy/30 p-6 space-y-4">
        <h3 className="text-2xl font-display text-belle-burgundy dark:text-belle-gold">
          Paths Forward
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {currentLocation.connections.map((connId) => {
            const conn = LOCATIONS[connId];
            return (
              <button
                key={connId}
                onClick={() => changeLocation(connId)}
                className="p-3 border-2 border-belle-gold/30 rounded-lg hover:bg-belle-gold/10 transition-all text-left"
              >
                <div className="font-display text-belle-burgundy dark:text-belle-gold">
                  {conn.name}
                </div>
                <div className="text-xs text-belle-navy/70 dark:text-belle-cream/70">
                  {!player.visitedLocations.has(connId) && '✨ Undiscovered'}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LocationView;
