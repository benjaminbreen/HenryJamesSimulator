import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { NPCS } from '../../constants/npcs';
import { getAvailableEvents } from '../../constants/events';
import { generateItem } from '../../utils/itemGenerator';
import RoomTileMap from '../map/RoomTileMap';

const LocationView = () => {
  const {
    player,
    world,
    moveToNode,
    getCurrentNode,
    getNPCsInNode,
    startCombat,
    addItem,
    addLog,
    triggerEvent,
    completedEvents,
    setView,
  } = useGameStore();

  const [selectedNPC, setSelectedNPC] = useState<string | null>(null);

  const currentNode = getCurrentNode();

  // Handle loading state
  if (!currentNode || !world) {
    return (
      <div className="ornate-border bg-white dark:bg-belle-navy/30 p-6">
        <p className="text-belle-navy dark:text-belle-cream">Generating world...</p>
      </div>
    );
  }

  // Get both historical NPCs and agentic NPCs
  const historicalNPCs = currentNode.npcs.map((id) => NPCS[id]).filter(Boolean);
  const agenticNPCs = getNPCsInNode(currentNode.id);
  const availableEvents = getAvailableEvents(currentNode.id, player.level, completedEvents);

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
        // Use node description or generate ambient text
        const ambientMessages = [
          currentNode.description,
          `The ${currentNode.biome} atmosphere surrounds you.`,
          `You notice the details of this ${currentNode.type === 'anchor' ? 'landmark' : 'space'}.`,
        ];
        addLog({
          type: 'info',
          message: ambientMessages[Math.floor(Math.random() * ambientMessages.length)],
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
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-3xl font-display text-belle-burgundy dark:text-belle-gold">
            {currentNode.name}
          </h2>
          <div className="text-xs text-belle-navy/70 dark:text-belle-cream/70 text-right">
            <div className="capitalize">{currentNode.biome.replace(/-/g, ' ')}</div>
            <div className="text-belle-burgundy dark:text-belle-gold">
              {currentNode.type === 'anchor' ? '⚓ Landmark' : '✨ Procedural'}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <pre className="ascii-art text-xs sm:text-sm text-belle-navy dark:text-belle-gold overflow-x-auto">
              {currentNode.asciiArt}
            </pre>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-xs text-belle-navy/70 dark:text-belle-cream/70 font-semibold">
              Room Layout
            </div>
            <RoomTileMap node={currentNode} scale={1.5} />
          </div>
        </div>

        <p className="text-belle-navy dark:text-belle-cream leading-relaxed">
          {currentNode.description}
        </p>

        {/* Show procedural features */}
        {currentNode.features.length > 0 && (
          <div className="pt-2 border-t border-belle-gold/30">
            <p className="text-sm text-belle-navy/80 dark:text-belle-cream/80 italic">
              Notable features: {currentNode.features.map((f) => f.name).join(', ')}
            </p>
          </div>
        )}

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
      {(historicalNPCs.length > 0 || agenticNPCs.length > 0) && (
        <div className="ornate-border bg-white dark:bg-belle-navy/30 p-6 space-y-4">
          <h3 className="text-2xl font-display text-belle-burgundy dark:text-belle-gold">
            Notable Persons Present {agenticNPCs.length > 0 && <span className="text-sm opacity-70">({historicalNPCs.length + agenticNPCs.length})</span>}
          </h3>
          <div className="space-y-3">
            {/* Historical NPCs (famous figures) */}
            {historicalNPCs.map((npc) => (
              <div key={npc.id} className="border-2 border-belle-burgundy/50 rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-xl font-display text-belle-burgundy dark:text-belle-gold">
                      {npc.name} <span className="text-xs opacity-70">⭐ Historical Figure</span>
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

            {/* Agentic NPCs (procedural characters) */}
            {agenticNPCs.map((npc) => (
              <div key={npc.id} className="border-2 border-belle-gold/30 rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-xl font-display text-belle-burgundy dark:text-belle-gold">
                      {npc.name}
                    </h4>
                    <p className="text-sm text-belle-navy/70 dark:text-belle-cream/70">
                      {npc.profession}, Age {npc.age}
                    </p>
                    <p className="text-xs text-belle-navy/60 dark:text-belle-cream/60 mt-1">
                      Currently {npc.currentActivity} • {npc.mood}
                    </p>
                    <p className="text-sm text-belle-navy dark:text-belle-cream mt-2 italic">
                      {npc.backstory.slice(0, 150)}...
                    </p>
                    {npc.currentGoal && (
                      <p className="text-xs text-belle-sage dark:text-belle-sage mt-1">
                        Goal: {npc.currentGoal.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedNPC(selectedNPC === npc.id ? null : npc.id)}
                    className="px-3 py-1 bg-belle-sage text-belle-navy rounded hover:bg-belle-sage/90 transition-all text-sm"
                  >
                    💬 Converse
                  </button>
                  <button
                    onClick={() => console.log('Challenge NPC:', npc.name)}
                    className="px-3 py-1 bg-belle-gold/30 text-belle-navy dark:text-belle-cream rounded hover:bg-belle-gold/40 transition-all text-sm"
                  >
                    ℹ️ Observe
                  </button>
                </div>
                {selectedNPC === npc.id && (
                  <div className="mt-2 p-3 bg-belle-cream/50 dark:bg-black/20 rounded text-sm space-y-2">
                    <p className="text-belle-navy dark:text-belle-cream">
                      <span className="font-semibold">{npc.name}</span> looks at you with interest.
                    </p>
                    <div className="text-xs text-belle-navy/70 dark:text-belle-cream/70">
                      Recent thoughts: "{npc.recentThoughts[0]}"
                    </div>
                    <p className="text-belle-navy/80 dark:text-belle-cream/80 italic text-xs">
                      LLM-powered dialogue coming soon! This NPC has a full AI brain with personality, goals, and history.
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
          {currentNode.connections.map((connId) => {
            const connectedNode = world.nodes.get(connId);
            if (!connectedNode) return null;

            // Fog of war: only show discovered nodes
            if (!connectedNode.discovered) {
              return (
                <div
                  key={connId}
                  className="p-3 border-2 border-belle-gold/30 rounded-lg opacity-50 text-left"
                >
                  <div className="font-display text-belle-burgundy dark:text-belle-gold">
                    ???
                  </div>
                  <div className="text-xs text-belle-navy/70 dark:text-belle-cream/70">
                    Unexplored
                  </div>
                </div>
              );
            }

            return (
              <button
                key={connId}
                onClick={() => moveToNode(connId)}
                className="p-3 border-2 border-belle-gold/30 rounded-lg hover:bg-belle-gold/10 transition-all text-left"
              >
                <div className="font-display text-belle-burgundy dark:text-belle-gold">
                  {connectedNode.name}
                </div>
                <div className="text-xs text-belle-navy/70 dark:text-belle-cream/70 space-y-1">
                  <div className="capitalize">{connectedNode.biome.replace(/-/g, ' ')}</div>
                  {!connectedNode.visited && (
                    <div className="text-belle-gold">✨ Not yet visited</div>
                  )}
                  {connectedNode.type === 'anchor' && (
                    <div className="text-belle-burgundy dark:text-belle-gold">⚓ Landmark</div>
                  )}
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
