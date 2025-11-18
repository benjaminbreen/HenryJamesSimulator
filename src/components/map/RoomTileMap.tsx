import type { WorldNode, TileType } from '../../types/procedural';
import { MapTile, TILE_SIZE } from './MapTiles';

interface RoomTileMapProps {
  node: WorldNode;
  scale?: number;
}

// Helper to create a deterministic random based on node ID
function nodeHash(nodeId: string, offset: number = 0): number {
  let hash = offset;
  for (let i = 0; i < nodeId.length; i++) {
    hash = ((hash << 5) - hash) + nodeId.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function nodeRandom(nodeId: string, offset: number = 0): number {
  return (nodeHash(nodeId, offset) % 1000) / 1000;
}

/**
 * Renders a mini tile-based preview of a room's layout
 * Used in location view or as a minimap
 */
export const RoomTileMap = ({ node, scale = 1 }: RoomTileMapProps) => {
  // Create a varied room layout based on biome and template
  const size = node.template?.size || 'medium';
  const layout = generateRoomLayout(node, size);

  return renderRoom(node, layout, scale);
};

interface RoomLayout {
  width: number;
  height: number;
  tiles: Array<{ type: TileType; x: number; y: number }>;
}

// Generate a room layout based on biome and size
function generateRoomLayout(node: WorldNode, size: 'small' | 'medium' | 'large'): RoomLayout {
  // Determine room dimensions
  const dimensions = {
    small: { width: 8, height: 6 },
    medium: { width: 12, height: 9 },
    large: { width: 16, height: 12 },
  };

  const { width, height } = dimensions[size];
  const tiles: Array<{ type: TileType; x: number; y: number }> = [];

  // Create floor and walls
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
        tiles.push({ type: 'wall', x, y });
      } else {
        tiles.push({ type: 'floor', x, y });
      }
    }
  }

  // Add door(s)
  const doorX = Math.floor(width / 2);
  tiles.push({ type: 'door', x: doorX, y: height - 1 });

  // Add windows for indoor locations
  const isIndoor = !['outdoor-promenade', 'garden', 'street'].includes(node.biome);
  if (isIndoor && width > 6) {
    // Add windows on walls
    const windowY = Math.floor(height / 2);
    if (nodeRandom(node.id, 1) > 0.5) {
      tiles.push({ type: 'window', x: 0, y: windowY });
    }
    if (nodeRandom(node.id, 2) > 0.5 && width > 10) {
      tiles.push({ type: 'window', x: width - 1, y: windowY });
    }
    if (nodeRandom(node.id, 3) > 0.6) {
      tiles.push({ type: 'window', x: Math.floor(width / 3), y: 0 });
    }
    if (nodeRandom(node.id, 4) > 0.6 && width > 8) {
      tiles.push({ type: 'window', x: Math.floor(2 * width / 3), y: 0 });
    }
  }

  // Add furniture based on biome
  addBiomeFurniture(tiles, node, width, height);

  // Add decorative features
  addBiomeFeatures(tiles, node, width, height);

  return { width, height, tiles };
}

// Add furniture appropriate to the biome
function addBiomeFurniture(
  tiles: Array<{ type: TileType; x: number; y: number }>,
  node: WorldNode,
  width: number,
  height: number
) {
  const furnitureCount = Math.min(node.features.filter(f => f.type === 'furniture').length, 4);

  // Place furniture in open areas (not near walls)
  const placements = [
    { x: 2, y: 2 },
    { x: width - 3, y: 2 },
    { x: 2, y: height - 3 },
    { x: Math.floor(width / 2), y: Math.floor(height / 2) },
    { x: width - 3, y: height - 3 },
  ];

  for (let i = 0; i < furnitureCount && i < placements.length; i++) {
    const placement = placements[i];
    // Check if spot is available (not wall, door, or window)
    const occupied = tiles.some(t =>
      t.x === placement.x && t.y === placement.y &&
      (t.type === 'wall' || t.type === 'door' || t.type === 'window')
    );

    if (!occupied && placement.x > 0 && placement.x < width - 1 &&
        placement.y > 0 && placement.y < height - 1) {
      tiles.push({ type: 'furniture', x: placement.x, y: placement.y });
    }
  }
}

// Add decorative features appropriate to the biome
function addBiomeFeatures(
  tiles: Array<{ type: TileType; x: number; y: number }>,
  node: WorldNode,
  width: number,
  _height: number
) {
  const featureCount = Math.min(
    node.features.filter(f => f.type === 'decoration' || f.type === 'interactive').length,
    3
  );

  // Place features in corners or along walls
  const placements = [
    { x: 1, y: 1 },
    { x: width - 2, y: 1 },
    { x: Math.floor(width / 2), y: 1 },
  ];

  for (let i = 0; i < featureCount && i < placements.length; i++) {
    const placement = placements[i];
    const occupied = tiles.some(t =>
      t.x === placement.x && t.y === placement.y &&
      (t.type === 'wall' || t.type === 'door' || t.type === 'window' || t.type === 'furniture')
    );

    if (!occupied) {
      tiles.push({ type: 'feature', x: placement.x, y: placement.y });
    }
  }
}

// Render the room with all tiles
function renderRoom(node: WorldNode, layout: RoomLayout, scale: number) {
  const { width, height, tiles } = layout;
  const svgWidth = width * TILE_SIZE * scale;
  const svgHeight = height * TILE_SIZE * scale;

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${width * TILE_SIZE} ${height * TILE_SIZE}`}
      className="border-2 border-belle-gold/30 rounded shadow-lg"
    >
      {/* Render all tiles in order: floor, walls, furniture, features, doors, windows */}
      {tiles
        .sort((a, b) => {
          // Render order: floor first, then walls, furniture, features, doors, windows
          const order: Record<TileType, number> = {
            floor: 0,
            wall: 1,
            furniture: 2,
            feature: 3,
            door: 4,
            window: 5,
            empty: 6,
          };
          return (order[a.type] || 0) - (order[b.type] || 0);
        })
        .map((tile, idx) => (
          <MapTile
            key={`${tile.x}-${tile.y}-${idx}`}
            type={tile.type}
            biome={node.biome}
            x={tile.x}
            y={tile.y}
          />
        ))}

      {/* Add NPC position indicators */}
      {node.npcs.slice(0, 3).map((npcId, idx) => {
        const x = 3 + idx * 2;
        const y = height - 2;
        return (
          <g key={npcId}>
            <circle
              cx={x * TILE_SIZE + TILE_SIZE / 2}
              cy={y * TILE_SIZE + TILE_SIZE / 2}
              r={5}
              fill="#800020"
              opacity="0.7"
            />
            <circle
              cx={x * TILE_SIZE + TILE_SIZE / 2}
              cy={y * TILE_SIZE + TILE_SIZE / 2}
              r={3}
              fill="#FFF8E8"
              opacity="0.9"
            />
          </g>
        );
      })}

      {/* Ambient lighting effect based on biome */}
      {renderAmbientEffect(node.biome, width, height)}
    </svg>
  );
}

// Add atmospheric lighting effects
function renderAmbientEffect(biome: string, width: number, height: number) {
  const w = width * TILE_SIZE;
  const h = height * TILE_SIZE;

  switch (biome) {
    case 'exhibition-hall':
      // Cool blue-white electric lighting
      return (
        <rect
          x="0"
          y="0"
          width={w}
          height={h}
          fill="url(#exhibition-light)"
          opacity="0.15"
          pointerEvents="none"
        >
          <defs>
            <radialGradient id="exhibition-light" cx="50%" cy="30%">
              <stop offset="0%" stopColor="#E0F0FF" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
        </rect>
      );

    case 'indoor-salon':
      // Warm golden candlelight
      return (
        <rect
          x="0"
          y="0"
          width={w}
          height={h}
          fill="url(#salon-light)"
          opacity="0.2"
          pointerEvents="none"
        >
          <defs>
            <radialGradient id="salon-light" cx="50%" cy="20%">
              <stop offset="0%" stopColor="#F4CF57" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
        </rect>
      );

    case 'garden':
      // Natural green ambient light
      return (
        <rect
          x="0"
          y="0"
          width={w}
          height={h}
          fill="#6A8A4C"
          opacity="0.08"
          pointerEvents="none"
        />
      );

    case 'marketplace':
      // Warm busy atmosphere
      return (
        <rect
          x="0"
          y="0"
          width={w}
          height={h}
          fill="#D4B447"
          opacity="0.1"
          pointerEvents="none"
        />
      );

    case 'backstage':
      // Dim theatrical lighting
      return (
        <rect
          x="0"
          y="0"
          width={w}
          height={h}
          fill="#2A2A2A"
          opacity="0.15"
          pointerEvents="none"
        />
      );

    default:
      return null;
  }
}

export default RoomTileMap;
