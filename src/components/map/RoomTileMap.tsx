import type { WorldNode } from '../../types/procedural';
import { MapTile, TILE_SIZE } from './MapTiles';

interface RoomTileMapProps {
  node: WorldNode;
  scale?: number;
}

/**
 * Renders a mini tile-based preview of a room's layout
 * Used in location view or as a minimap
 */
export const RoomTileMap = ({ node, scale = 1 }: RoomTileMapProps) => {
  // For anchor nodes without procedural layouts, create a simple representative layout
  if (!node.template || !node.seed) {
    return renderSimpleRoom(node, scale);
  }

  // For procedural nodes, we'd ideally re-generate the room layout
  // For now, create a representative layout based on template size
  return renderSimpleRoom(node, scale);
};

function renderSimpleRoom(node: WorldNode, scale: number) {
  // Create a small representative room (10x8 tiles)
  const width = 10;
  const height = 8;
  const tiles: Array<{ type: 'wall' | 'floor' | 'door'; x: number; y: number }> = [];

  // Create border walls
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
        tiles.push({ type: 'wall', x, y });
      } else {
        tiles.push({ type: 'floor', x, y });
      }
    }
  }

  // Add a door at the bottom center
  const doorX = Math.floor(width / 2);
  tiles.push({ type: 'door', x: doorX, y: height - 1 });

  const svgWidth = width * TILE_SIZE * scale;
  const svgHeight = height * TILE_SIZE * scale;

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${width * TILE_SIZE} ${height * TILE_SIZE}`}
      className="border-2 border-belle-gold/30 rounded"
    >
      {tiles.map((tile, idx) => (
        <MapTile
          key={idx}
          type={tile.type}
          biome={node.biome}
          x={tile.x}
          y={tile.y}
        />
      ))}

      {/* Add feature markers */}
      {node.features.slice(0, 3).map((feature, idx) => (
        <g key={feature.id}>
          <circle
            cx={(2 + idx * 2.5) * TILE_SIZE}
            cy={4 * TILE_SIZE}
            r={4}
            fill="#D4AF37"
            opacity="0.7"
          />
          <text
            x={(2 + idx * 2.5) * TILE_SIZE}
            y={4 * TILE_SIZE}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="8"
            fill="white"
          >
            {feature.type === 'furniture' ? '🪑' : feature.type === 'exhibit' ? '⚙️' : '✨'}
          </text>
        </g>
      ))}

      {/* Add NPC markers */}
      {node.npcs.slice(0, 2).map((npcId, idx) => (
        <circle
          key={npcId}
          cx={(width - 3 - idx * 2) * TILE_SIZE}
          cy={4 * TILE_SIZE}
          r={6}
          fill="#800020"
          opacity="0.8"
        />
      ))}
    </svg>
  );
}

export default RoomTileMap;
