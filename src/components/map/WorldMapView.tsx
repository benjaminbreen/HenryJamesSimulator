import type { WorldGraph, WorldNode } from '../../types/procedural';
import { NodeMarker, ConnectionPath, TILE_SIZE } from './MapTiles';
import { useMemo, useState } from 'react';

interface WorldMapViewProps {
  world: WorldGraph;
  currentNodeId: string;
  onNodeClick: (nodeId: string) => void;
}

/**
 * Renders the entire world as an SNES-style RPG map
 * Shows nodes as locations on a rendered terrain with connections
 */
export const WorldMapView = ({ world, currentNodeId, onNodeClick }: WorldMapViewProps) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Calculate map bounds and scale
  const { minX, maxX, minY, maxY, scaledNodes } = useMemo(() => {
    const nodes = Array.from(world.nodes.values()).filter(n => n.discovered);

    if (nodes.length === 0) {
      return { minX: 0, maxX: 10, minY: 0, maxY: 10, scaledNodes: [] };
    }

    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    nodes.forEach(node => {
      minX = Math.min(minX, node.position.x);
      maxX = Math.max(maxX, node.position.x);
      minY = Math.min(minY, node.position.y);
      maxY = Math.max(maxY, node.position.y);
    });

    // Add padding
    const padding = 2;
    minX -= padding;
    maxX += padding;
    minY -= padding;
    maxY += padding;

    // Scale to fit in view (each unit = 50 pixels for spacing)
    const scale = 50;
    const scaledNodes = nodes.map(node => ({
      ...node,
      screenX: (node.position.x - minX) * scale + 40,
      screenY: (node.position.y - minY) * scale + 40,
    }));

    return { minX, maxX, minY, maxY, scaledNodes };
  }, [world.nodes]);

  const currentNode = world.nodes.get(currentNodeId);
  const viewWidth = Math.max(600, (maxX - minX) * 50 + 80);
  const viewHeight = Math.max(400, (maxY - minY) * 50 + 120);

  // Render background terrain tiles
  const renderBackgroundTerrain = () => {
    const tiles = [];
    const tileSize = TILE_SIZE * 2; // Larger tiles for world map
    const cols = Math.ceil(viewWidth / tileSize) + 2;
    const rows = Math.ceil(viewHeight / tileSize) + 2;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        // Create a varied terrain pattern
        const isPath = Math.abs(x - cols / 2) < 2 || Math.abs(y - rows / 2) < 2;
        const isGrass = (x + y) % 3 === 0;

        tiles.push(
          <rect
            key={`tile-${x}-${y}`}
            x={x * tileSize}
            y={y * tileSize}
            width={tileSize}
            height={tileSize}
            fill={isPath ? '#B8A080' : isGrass ? '#5A7A3C' : '#6A8A4C'}
            opacity={0.3}
          />
        );

        // Add some texture
        if (!isPath && Math.random() > 0.7) {
          tiles.push(
            <circle
              key={`detail-${x}-${y}`}
              cx={x * tileSize + tileSize / 2}
              cy={y * tileSize + tileSize / 2}
              r={2}
              fill="#4A6A2C"
              opacity={0.4}
            />
          );
        }
      }
    }

    return tiles;
  };

  return (
    <div className="relative w-full overflow-auto bg-gradient-to-br from-belle-sage/20 to-belle-gold/10 rounded-lg border-2 border-belle-gold/30">
      <svg
        width={viewWidth}
        height={viewHeight}
        className="max-w-full h-auto"
        style={{ minHeight: '400px' }}
      >
        {/* Background terrain */}
        <g opacity="0.5">
          {renderBackgroundTerrain()}
        </g>

        {/* Decorative border */}
        <rect
          x="0"
          y="0"
          width={viewWidth}
          height={viewHeight}
          fill="none"
          stroke="#D4AF37"
          strokeWidth="4"
          opacity="0.3"
        />

        {/* Connections (draw first so they appear behind nodes) */}
        <g opacity="0.8">
          {scaledNodes.map(node => {
            return node.connections.map(connId => {
              const targetNode = scaledNodes.find(n => n.id === connId);
              if (!targetNode) return null;

              // Only draw each connection once (from lower id to higher id)
              if (node.id > connId) return null;

              const bothVisited = node.visited && targetNode.visited;

              return (
                <ConnectionPath
                  key={`${node.id}-${connId}`}
                  x1={node.screenX}
                  y1={node.screenY}
                  x2={targetNode.screenX}
                  y2={targetNode.screenY}
                  discovered={bothVisited}
                />
              );
            });
          })}
        </g>

        {/* Node markers */}
        {scaledNodes.map((node: WorldNode & { screenX: number; screenY: number }) => {
          const isCurrent = node.id === currentNodeId;
          const isHovered = node.id === hoveredNode;
          const canNavigate = currentNode?.connections.includes(node.id) || isCurrent;

          return (
            <g
              key={node.id}
              style={{ cursor: canNavigate ? 'pointer' : 'default' }}
              onClick={() => canNavigate && onNodeClick(node.id)}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Hover effect */}
              {isHovered && !isCurrent && (
                <circle
                  cx={node.screenX}
                  cy={node.screenY}
                  r={30}
                  fill="#D4AF37"
                  opacity="0.2"
                />
              )}

              {/* Node marker */}
              <NodeMarker
                x={node.screenX}
                y={node.screenY}
                type={node.type}
                isCurrentLocation={isCurrent}
                isVisited={node.visited}
                name={node.name}
              />

              {/* Show biome info on hover */}
              {isHovered && (
                <g transform={`translate(${node.screenX}, ${node.screenY - 50})`}>
                  <rect
                    x="-60"
                    y="-25"
                    width="120"
                    height="20"
                    fill="#2A2A2A"
                    rx="4"
                    opacity="0.9"
                  />
                  <text
                    x="0"
                    y="-10"
                    textAnchor="middle"
                    fontSize="10"
                    fill="#D4AF37"
                    fontWeight="bold"
                  >
                    {node.biome.replace(/-/g, ' ').toUpperCase()}
                  </text>
                </g>
              )}

              {/* Show if not accessible */}
              {!canNavigate && (
                <text
                  x={node.screenX}
                  y={node.screenY + 45}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#666"
                >
                  🔒
                </text>
              )}
            </g>
          );
        })}

        {/* Legend */}
        <g transform={`translate(${viewWidth - 180}, 20)`}>
          <rect x="0" y="0" width="160" height="110" fill="#2A2A2A" opacity="0.85" rx="8" />
          <text x="10" y="20" fontSize="12" fill="#D4AF37" fontWeight="bold">
            Legend
          </text>

          <circle cx="20" cy="40" r="8" fill="#D4AF37" stroke="#D4AF37" strokeWidth="2" />
          <text x="35" y="45" fontSize="10" fill="#E8DCC8">
            Landmark
          </text>

          <circle cx="20" cy="60" r="8" fill="#9CAF88" stroke="#D4AF37" strokeWidth="2" />
          <text x="35" y="65" fontSize="10" fill="#E8DCC8">
            Generated
          </text>

          <circle cx="20" cy="80" r="8" fill="#800020" stroke="#D4AF37" strokeWidth="2" />
          <text x="35" y="85" fontSize="10" fill="#E8DCC8">
            Current
          </text>

          <line x1="10" y1="100" x2="30" y2="100" stroke="#B8A080" strokeWidth="3" />
          <text x="35" y="105" fontSize="10" fill="#E8DCC8">
            Path
          </text>
        </g>

        {/* Title */}
        <g transform="translate(20, 30)">
          <text
            x="0"
            y="0"
            fontSize="20"
            fontWeight="bold"
            fill="#D4AF37"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
          >
            Exposition Universelle de Paris, 1889
          </text>
          <text
            x="0"
            y="20"
            fontSize="12"
            fill="#E8DCC8"
            opacity="0.8"
          >
            Seed: {world.seed}
          </text>
        </g>
      </svg>

      {/* Help text */}
      <div className="absolute bottom-4 left-4 right-4 text-center text-sm text-belle-navy/70 dark:text-belle-cream/70 bg-black/50 rounded p-2">
        Click on connected locations to travel. Explore to reveal more of the fair!
      </div>
    </div>
  );
};

export default WorldMapView;
