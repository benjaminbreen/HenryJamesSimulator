import { useGameStore } from '../../stores/gameStore';
import { NPCS } from '../../constants/npcs';
import { generateItem } from '../../utils/itemGenerator';
import RoomTileMap from '../map/RoomTileMap';
import DialogueModal from './DialogueModal';

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
    setView,
    startDialogue,
    endDialogue,
    sendDialogueMessage,
    activeDialogue,
    isDialogueLoading,
  } = useGameStore();

  const currentNode = getCurrentNode();

  // Handle loading state
  if (!currentNode || !world) {
    return (
      <div className="ornate-border bg-white dark:bg-belle-navy/30 p-6">
        <p className="text-belle-navy dark:text-belle-cream">Loading world...</p>
      </div>
    );
  }

  // Get both historical NPCs and agentic NPCs
  const historicalNPCs = currentNode.npcs.map((id) => NPCS[id]).filter(Boolean);
  const agenticNPCs = getNPCsInNode(currentNode.id);

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
          message: currentNode.description,
          icon: '👁️',
        });
      },
    ];

    const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
    randomOutcome();
  };

  return (
    <div className="space-y-4">
      {/* Location Display */}
      <div className="ornate-border bg-white dark:bg-belle-navy/30 p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-display text-belle-burgundy dark:text-belle-gold">
              {currentNode.name}
            </h2>
            <div className="text-xs text-belle-navy/70 dark:text-belle-cream/70 mt-1">
              <span className="capitalize">{currentNode.biome.replace(/-/g, ' ')}</span>
              <span className="mx-2">•</span>
              <span className="text-belle-burgundy dark:text-belle-gold">
                {currentNode.type === 'anchor' ? '⚓ Landmark' : '✨ Procedural'}
              </span>
            </div>
          </div>
        </div>

        {/* Room Visualization */}
        <div className="flex justify-center">
          <RoomTileMap node={currentNode} scale={2} />
        </div>

        <p className="text-belle-navy dark:text-belle-cream leading-relaxed italic">
          {currentNode.description}
        </p>

        {/* Main Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={handleExplore}
            className="px-4 py-3 bg-belle-burgundy text-belle-cream rounded hover:bg-belle-burgundy/90 transition-all text-center"
          >
            <div className="text-2xl">🔍</div>
            <div className="text-sm">Explore</div>
          </button>
          <button
            onClick={() => setView('map')}
            className="px-4 py-3 bg-belle-gold/80 text-belle-navy dark:text-white rounded hover:bg-belle-gold transition-all text-center"
          >
            <div className="text-2xl">🗺️</div>
            <div className="text-sm">Map</div>
          </button>
          <button
            onClick={() => setView('inventory')}
            className="px-4 py-3 bg-belle-sage text-belle-navy rounded hover:bg-belle-sage/90 transition-all text-center"
          >
            <div className="text-2xl">🎒</div>
            <div className="text-sm">Inventory</div>
          </button>
          <button
            onClick={() => setView('journal')}
            className="px-4 py-3 bg-belle-sage text-belle-navy rounded hover:bg-belle-sage/90 transition-all text-center"
          >
            <div className="text-2xl">📔</div>
            <div className="text-sm">Journal</div>
          </button>
        </div>
      </div>

      {/* Travel - Make this VERY prominent */}
      {currentNode.connections.length > 0 && (
        <div className="ornate-border bg-gradient-to-br from-belle-gold/20 to-belle-burgundy/10 dark:from-belle-gold/10 dark:to-belle-burgundy/20 p-6 space-y-4 border-2 border-belle-gold">
          <h3 className="text-2xl font-display text-belle-burgundy dark:text-belle-gold flex items-center gap-2">
            <span>🚶</span> Travel To...
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentNode.connections.map((connId) => {
              const connectedNode = world.nodes.get(connId);
              if (!connectedNode) return null;

              // Fog of war: only show discovered nodes
              if (!connectedNode.discovered) {
                return (
                  <div
                    key={connId}
                    className="p-4 border-2 border-dashed border-belle-gold/30 rounded-lg opacity-50 text-center"
                  >
                    <div className="text-3xl mb-2">❓</div>
                    <div className="font-display text-belle-burgundy dark:text-belle-gold">
                      Unexplored Path
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={connId}
                  onClick={() => {
                    moveToNode(connId);
                    addLog({
                      type: 'info',
                      message: `Traveling to ${connectedNode.name}...`,
                      icon: '🚶',
                    });
                  }}
                  className="p-4 border-2 border-belle-gold hover:border-belle-burgundy rounded-lg hover:bg-belle-gold/20 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">
                      {connectedNode.type === 'anchor' ? '⚓' : '✨'}
                    </div>
                    <div className="flex-1">
                      <div className="font-display text-lg text-belle-burgundy dark:text-belle-gold group-hover:text-belle-burgundy">
                        {connectedNode.name}
                      </div>
                      <div className="text-xs text-belle-navy/70 dark:text-belle-cream/70 capitalize">
                        {connectedNode.biome.replace(/-/g, ' ')}
                        {!connectedNode.visited && (
                          <span className="ml-2 text-belle-gold">✨ New!</span>
                        )}
                      </div>
                    </div>
                    <div className="text-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* NPCs - Simplified */}
      {(historicalNPCs.length > 0 || agenticNPCs.length > 0) && (
        <div className="ornate-border bg-white dark:bg-belle-navy/30 p-6 space-y-4">
          <h3 className="text-2xl font-display text-belle-burgundy dark:text-belle-gold">
            People Here ({historicalNPCs.length + agenticNPCs.length})
          </h3>
          <div className="grid gap-3">
            {/* Historical NPCs */}
            {historicalNPCs.map((npc) => (
              <div key={npc.id} className="border-2 border-belle-burgundy/50 rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-xl font-display text-belle-burgundy dark:text-belle-gold">
                      {npc.name} <span className="text-xs opacity-70">⭐ Historical</span>
                    </h4>
                    <p className="text-sm text-belle-navy/70 dark:text-belle-cream/70">
                      {npc.title}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => startCombat(npc.id)}
                    className="px-3 py-2 bg-belle-burgundy text-belle-cream rounded hover:bg-belle-burgundy/90 transition-all text-sm"
                  >
                    ⚔️ Challenge
                  </button>
                </div>
              </div>
            ))}

            {/* Agentic NPCs */}
            {agenticNPCs.map((npc) => (
              <div key={npc.id} className="border-2 border-belle-gold/30 rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-xl font-display text-belle-burgundy dark:text-belle-gold">
                      {npc.name}
                    </h4>
                    <p className="text-sm text-belle-navy/70 dark:text-belle-cream/70">
                      {npc.profession}, Age {npc.age} • {npc.mood}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => startDialogue(npc.id)}
                    className="px-3 py-2 bg-belle-sage text-belle-navy rounded hover:bg-belle-sage/90 transition-all text-sm"
                  >
                    💬 Talk
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dialogue Modal */}
      {activeDialogue && (() => {
        const dialogueNPC = agenticNPCs.find(npc => npc.id === activeDialogue.npcId);
        if (!dialogueNPC) return null;

        return (
          <DialogueModal
            npc={dialogueNPC}
            playerName={player.name}
            playerProfession={player.title}
            locationName={currentNode.name}
            locationDescription={currentNode.description}
            onClose={endDialogue}
            onSendMessage={sendDialogueMessage}
            conversationHistory={activeDialogue.conversationHistory}
            isLoading={isDialogueLoading}
          />
        );
      })()}
    </div>
  );
};

export default LocationView;
