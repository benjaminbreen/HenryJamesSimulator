import { useGameStore } from '../../stores/gameStore';

const MapView = () => {
  const { world, currentNodeId, moveToNode, setView, getCurrentNode } = useGameStore();

  const currentNode = getCurrentNode();

  if (!world || !currentNode) {
    return (
      <div className="ornate-border bg-white dark:bg-belle-navy/30 p-6">
        <p className="text-belle-navy dark:text-belle-cream">Generating world...</p>
      </div>
    );
  }

  // Get all discovered nodes, sorted by type (anchors first) then by visited status
  const discoveredNodes = Array.from(world.nodes.values())
    .filter((node) => node.discovered)
    .sort((a, b) => {
      // Anchors before generated
      if (a.type !== b.type) {
        return a.type === 'anchor' ? -1 : 1;
      }
      // Visited before unvisited
      if (a.visited !== b.visited) {
        return a.visited ? -1 : 1;
      }
      return 0;
    });

  const anchorNodes = discoveredNodes.filter((n) => n.type === 'anchor');
  const generatedNodes = discoveredNodes.filter((n) => n.type === 'generated');

  return (
    <div className="space-y-4">
      <div className="ornate-border bg-white dark:bg-belle-navy/30 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-display text-belle-burgundy dark:text-belle-gold">
            Map of the Exposition
          </h2>
          <button
            onClick={() => setView('main')}
            className="px-4 py-2 border-2 border-belle-burgundy dark:border-belle-gold text-belle-burgundy dark:text-belle-gold rounded hover:bg-belle-burgundy/10 transition-all"
          >
            ← Back
          </button>
        </div>

        {/* World Info */}
        <div className="flex gap-4 text-sm text-belle-navy/70 dark:text-belle-cream/70">
          <div>
            <span className="font-semibold">Discovered:</span> {discoveredNodes.length} /{' '}
            {world.nodes.size}
          </div>
          <div>
            <span className="font-semibold">Visited:</span>{' '}
            {discoveredNodes.filter((n) => n.visited).length}
          </div>
          <div>
            <span className="font-semibold">Seed:</span>{' '}
            <code className="text-xs bg-belle-gold/10 px-1 rounded">{world.seed}</code>
          </div>
        </div>

        {/* Landmarks (Anchor Nodes) */}
        {anchorNodes.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xl font-display text-belle-burgundy dark:text-belle-gold flex items-center gap-2">
              ⚓ Landmarks
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {anchorNodes.map((node) => {
                const isCurrent = node.id === currentNodeId;
                const isConnected = currentNode.connections.includes(node.id);

                return (
                  <button
                    key={node.id}
                    onClick={() => {
                      if (isConnected || isCurrent) {
                        moveToNode(node.id);
                        setView('main');
                      }
                    }}
                    disabled={!isConnected && !isCurrent}
                    className={`p-3 border-2 rounded-lg text-left transition-all ${
                      isCurrent
                        ? 'bg-belle-burgundy text-belle-cream border-belle-burgundy'
                        : isConnected
                        ? 'border-belle-gold/30 hover:bg-belle-gold/10'
                        : 'border-gray-300 dark:border-gray-700 opacity-50'
                    }`}
                  >
                    <div className="font-display text-sm">
                      {isCurrent && '📍 '}
                      {node.name}
                    </div>
                    <div className="text-xs opacity-70 mt-1 space-y-0.5">
                      <div className="capitalize">{node.biome.replace(/-/g, ' ')}</div>
                      {!node.visited && <div className="text-belle-gold">Not yet visited</div>}
                      {node.visited && !isCurrent && <div>✓ Visited</div>}
                      {isCurrent && <div>Current Location</div>}
                      {!isConnected && !isCurrent && <div>🔒 Not connected</div>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Generated Locations */}
        {generatedNodes.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xl font-display text-belle-burgundy dark:text-belle-gold flex items-center gap-2">
              ✨ Discovered Locations
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {generatedNodes.map((node) => {
                const isCurrent = node.id === currentNodeId;
                const isConnected = currentNode.connections.includes(node.id);

                return (
                  <button
                    key={node.id}
                    onClick={() => {
                      if (isConnected || isCurrent) {
                        moveToNode(node.id);
                        setView('main');
                      }
                    }}
                    disabled={!isConnected && !isCurrent}
                    className={`p-3 border-2 rounded-lg text-left transition-all ${
                      isCurrent
                        ? 'bg-belle-burgundy text-belle-cream border-belle-burgundy'
                        : isConnected
                        ? 'border-belle-gold/30 hover:bg-belle-gold/10'
                        : 'border-gray-300 dark:border-gray-700 opacity-50'
                    }`}
                  >
                    <div className="font-display text-sm">
                      {isCurrent && '📍 '}
                      {node.name}
                    </div>
                    <div className="text-xs opacity-70 mt-1 space-y-0.5">
                      <div className="capitalize">{node.biome.replace(/-/g, ' ')}</div>
                      {!node.visited && <div className="text-belle-gold">Not yet visited</div>}
                      {node.visited && !isCurrent && <div>✓ Visited</div>}
                      {isCurrent && <div>Current Location</div>}
                      {!isConnected && !isCurrent && <div>🔒 Not connected</div>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="pt-4 border-t border-belle-gold/30 text-sm text-belle-navy/70 dark:text-belle-cream/70 italic">
          Only locations you've discovered appear on your map. You can only travel to locations
          directly connected to your current position. Explore to reveal more of the exposition!
        </div>
      </div>
    </div>
  );
};

export default MapView;
