import { useGameStore } from '../../stores/gameStore';
import WorldMapView from '../map/WorldMapView';

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

  const handleNodeClick = (nodeId: string) => {
    moveToNode(nodeId);
    setView('main');
  };

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
          onNodeClick={handleNodeClick}
        />

        {/* Quick Travel List (below map) */}
        <div className="pt-4 border-t border-belle-gold/30 space-y-3">
          <h3 className="text-lg font-display text-belle-burgundy dark:text-belle-gold">
            Quick Travel
          </h3>

          <div className="grid grid-cols-3 md:grid-cols-4 gap-2 text-xs">
            {/* Anchors first */}
            {anchorNodes.map((node) => {
              const isCurrent = node.id === currentNodeId;
              const isConnected = currentNode.connections.includes(node.id);

              return (
                <button
                  key={node.id}
                  onClick={() => {
                    if (isConnected || isCurrent) {
                      handleNodeClick(node.id);
                    }
                  }}
                  disabled={!isConnected && !isCurrent}
                  className={`p-2 border rounded text-left transition-all ${
                    isCurrent
                      ? 'bg-belle-burgundy text-belle-cream border-belle-burgundy'
                      : isConnected
                      ? 'border-belle-gold/30 hover:bg-belle-gold/10 text-belle-navy dark:text-belle-cream'
                      : 'border-gray-300 dark:border-gray-700 opacity-30'
                  }`}
                  title={node.name}
                >
                  <div className="font-semibold truncate">
                    {isCurrent && '📍 '}⚓ {node.name}
                  </div>
                </button>
              );
            })}

            {/* Connected generated nodes */}
            {generatedNodes
              .filter(n => currentNode.connections.includes(n.id) || n.id === currentNodeId)
              .map((node) => {
                const isCurrent = node.id === currentNodeId;

                return (
                  <button
                    key={node.id}
                    onClick={() => handleNodeClick(node.id)}
                    className={`p-2 border rounded text-left transition-all ${
                      isCurrent
                        ? 'bg-belle-burgundy text-belle-cream border-belle-burgundy'
                        : 'border-belle-gold/30 hover:bg-belle-gold/10 text-belle-navy dark:text-belle-cream'
                    }`}
                    title={node.name}
                  >
                    <div className="font-semibold truncate">
                      {isCurrent && '📍 '}✨ {node.name}
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
