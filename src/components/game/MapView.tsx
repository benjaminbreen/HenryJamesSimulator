import { useGameStore } from '../../stores/gameStore';
import WorldMapView from '../map/WorldMapView';

const MapView = () => {
  const { world, currentNodeId, agenticNPCs, moveToNode, setView, getCurrentNode } = useGameStore();

  const currentNode = getCurrentNode();

  if (!world || !currentNode) {
    return (
      <div className="ornate-border bg-white dark:bg-belle-navy/30 p-6">
        <p className="text-belle-navy dark:text-belle-cream">Generating world...</p>
      </div>
    );
  }

  const handleNodeClick = (nodeId: string) => {
    moveToNode(nodeId);
    setView('main');
  };

  const handleNPCClick = (npc: any) => {
    // TODO: Open dialogue modal
    console.log('Clicked NPC:', npc.name, npc.profession);
  };

  // Get discovered nodes count for stats
  const discoveredNodes = Array.from(world.nodes.values()).filter((node) => node.discovered);

  return (
    <div className="space-y-4">
      <div className="ornate-border bg-white dark:bg-belle-navy/30 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-display text-belle-burgundy dark:text-belle-gold">
              Map of the Exposition
            </h2>
            <div className="flex gap-4 mt-2 text-sm text-belle-navy/70 dark:text-belle-cream/70">
              <div>
                <span className="font-semibold">Discovered:</span> {discoveredNodes.length} /{' '}
                {world.nodes.size}
              </div>
              <div>
                <span className="font-semibold">Visited:</span>{' '}
                {discoveredNodes.filter((n) => n.visited).length}
              </div>
            </div>
          </div>
          <button
            onClick={() => setView('main')}
            className="px-4 py-2 border-2 border-belle-burgundy dark:border-belle-gold text-belle-burgundy dark:text-belle-gold rounded hover:bg-belle-burgundy/10 transition-all"
          >
            ← Back
          </button>
        </div>

        {/* Tile-based World Map */}
        <WorldMapView
          world={world}
          currentNodeId={currentNodeId}
          agenticNPCs={agenticNPCs}
          onNodeClick={handleNodeClick}
          onNPCClick={handleNPCClick}
        />

        {/* Available Destinations */}
        {currentNode.connections.length > 0 && (
          <div className="pt-4 border-t-2 border-belle-gold/50 space-y-3">
            <h3 className="text-xl font-display text-belle-burgundy dark:text-belle-gold flex items-center gap-2">
              <span>🚶</span> Available Destinations ({currentNode.connections.length})
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {currentNode.connections
                .map(connId => world.nodes.get(connId))
                .filter((node): node is NonNullable<typeof node> => node !== undefined && node.discovered)
                .sort((a, b) => {
                  // Anchors first, then by name
                  if (a.type !== b.type) return a.type === 'anchor' ? -1 : 1;
                  return a.name.localeCompare(b.name);
                })
                .map((node) => (
                  <button
                    key={node.id}
                    onClick={() => handleNodeClick(node.id)}
                    className="p-3 border-2 border-belle-gold/30 hover:border-belle-burgundy rounded-lg hover:bg-belle-gold/20 transition-all text-left group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="text-2xl">
                        {node.type === 'anchor' ? '⚓' : '✨'}
                      </div>
                      <div className="flex-1">
                        <div className="font-display text-sm font-semibold text-belle-burgundy dark:text-belle-gold group-hover:text-belle-burgundy truncate">
                          {node.name}
                        </div>
                        <div className="text-xs text-belle-navy/70 dark:text-belle-cream/70 capitalize">
                          {node.biome.replace(/-/g, ' ')}
                          {!node.visited && <span className="ml-2 text-belle-gold">✨ New!</span>}
                        </div>
                      </div>
                      <div className="text-xl opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;
