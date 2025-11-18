import type { BiomeType, TileType } from '../../types/procedural';

const TILE_SIZE = 16;

interface TileProps {
  type: TileType;
  biome: BiomeType;
  x: number;
  y: number;
}

// Belle Époque color palette
const COLORS = {
  // Stone/walls - Parisian limestone
  wall: '#D4C5B0',
  wallDark: '#A89580',
  wallLight: '#E8DCC8',

  // Floors by biome
  woodFloor: '#8B6F47',
  woodFloorLight: '#A88860',
  marble: '#E8E0D5',
  marbleVein: '#C8BCA8',
  cobblestone: '#7A7A7A',
  cobblestoneLight: '#929292',

  // Garden/outdoor
  grass: '#5A7A3C',
  grassDark: '#4A6A2C',
  path: '#B8A080',

  // Exhibition hall
  steelBeam: '#586070',
  glass: '#A8C8E8',
  exhibit: '#C8A870',

  // Decorative
  gold: '#D4AF37',
  burgundy: '#800020',
  sage: '#9CAF88',
};

export const MapTile = ({ type, biome, x, y }: TileProps) => {
  const renderTile = () => {
    switch (type) {
      case 'wall':
        return renderWall(biome);
      case 'floor':
        return renderFloor(biome);
      case 'door':
        return renderDoor(biome);
      case 'empty':
        return renderEmpty();
      default:
        return renderFloor(biome);
    }
  };

  return (
    <g transform={`translate(${x * TILE_SIZE}, ${y * TILE_SIZE})`}>
      {renderTile()}
    </g>
  );
};

// Wall rendering with biome-specific styles
function renderWall(biome: BiomeType) {
  switch (biome) {
    case 'exhibition-hall':
      // Steel and glass structure
      return (
        <>
          <rect width={TILE_SIZE} height={TILE_SIZE} fill={COLORS.steelBeam} />
          <line x1="0" y1="0" x2={TILE_SIZE} y2="0" stroke={COLORS.glass} strokeWidth="2" />
          <line x1="0" y1="0" x2="0" y2={TILE_SIZE} stroke={COLORS.glass} strokeWidth="2" />
        </>
      );

    case 'outdoor-promenade':
    case 'garden':
      // Stone balustrade
      return (
        <>
          <rect width={TILE_SIZE} height={TILE_SIZE} fill={COLORS.wall} />
          <rect x="2" y="2" width="12" height="12" fill={COLORS.wallLight} />
          <circle cx="8" cy="8" r="2" fill={COLORS.wallDark} />
        </>
      );

    case 'street':
      // Brick building wall
      return (
        <>
          <rect width={TILE_SIZE} height={TILE_SIZE} fill={COLORS.wallDark} />
          <rect x="1" y="1" width="6" height="4" fill={COLORS.wall} />
          <rect x="9" y="1" width="6" height="4" fill={COLORS.wall} />
          <rect x="1" y="7" width="6" height="4" fill={COLORS.wall} />
          <rect x="9" y="7" width="6" height="4" fill={COLORS.wall} />
          <rect x="1" y="13" width="6" height="2" fill={COLORS.wall} />
          <rect x="9" y="13" width="6" height="2" fill={COLORS.wall} />
        </>
      );

    default:
      // Ornate interior wall
      return (
        <>
          <rect width={TILE_SIZE} height={TILE_SIZE} fill={COLORS.wall} />
          <rect x="3" y="3" width="10" height="10" fill={COLORS.wallLight} />
          <rect x="6" y="1" width="4" height="14" fill={COLORS.gold} opacity="0.3" />
        </>
      );
  }
}

// Floor rendering with biome-specific patterns
function renderFloor(biome: BiomeType) {
  switch (biome) {
    case 'exhibition-hall':
      // Polished exhibition floor
      return (
        <>
          <rect width={TILE_SIZE} height={TILE_SIZE} fill={COLORS.marble} />
          <line x1="0" y1={TILE_SIZE} x2={TILE_SIZE} y2="0" stroke={COLORS.marbleVein} strokeWidth="0.5" opacity="0.3" />
        </>
      );

    case 'outdoor-promenade':
      // Paved promenade
      return (
        <>
          <rect width={TILE_SIZE} height={TILE_SIZE} fill={COLORS.path} />
          <rect x="0" y="7" width={TILE_SIZE} height="2" fill={COLORS.wallDark} opacity="0.2" />
        </>
      );

    case 'garden':
      // Grass and garden path
      return (
        <>
          <rect width={TILE_SIZE} height={TILE_SIZE} fill={COLORS.grass} />
          <circle cx="4" cy="4" r="1" fill={COLORS.grassDark} opacity="0.5" />
          <circle cx="12" cy="10" r="1" fill={COLORS.grassDark} opacity="0.5" />
        </>
      );

    case 'street':
      // Cobblestone
      return (
        <>
          <rect width={TILE_SIZE} height={TILE_SIZE} fill={COLORS.cobblestone} />
          <circle cx="4" cy="4" r="2.5" fill={COLORS.cobblestoneLight} />
          <circle cx="12" cy="4" r="2.5" fill={COLORS.cobblestoneLight} />
          <circle cx="4" cy="12" r="2.5" fill={COLORS.cobblestoneLight} />
          <circle cx="12" cy="12" r="2.5" fill={COLORS.cobblestoneLight} />
        </>
      );

    case 'indoor-salon':
      // Parquet wood floor
      return (
        <>
          <rect width={TILE_SIZE} height={TILE_SIZE} fill={COLORS.woodFloor} />
          <rect x="0" y="0" width="8" height={TILE_SIZE} fill={COLORS.woodFloorLight} opacity="0.3" />
        </>
      );

    case 'marketplace':
      // Market cobbles with stains
      return (
        <>
          <rect width={TILE_SIZE} height={TILE_SIZE} fill={COLORS.cobblestone} />
          <rect x="2" y="2" width="4" height="4" fill={COLORS.wallDark} opacity="0.2" />
          <rect x="10" y="8" width="4" height="4" fill={COLORS.wallDark} opacity="0.2" />
        </>
      );

    case 'npc-quarters':
      // Worn wood floor
      return (
        <>
          <rect width={TILE_SIZE} height={TILE_SIZE} fill={COLORS.woodFloor} />
          <line x1="0" y1="8" x2={TILE_SIZE} y2="8" stroke={COLORS.woodFloorLight} strokeWidth="1" />
        </>
      );

    case 'backstage':
      // Plain boards
      return (
        <>
          <rect width={TILE_SIZE} height={TILE_SIZE} fill={COLORS.woodFloor} />
          <line x1="8" y1="0" x2="8" y2={TILE_SIZE} stroke={COLORS.woodFloorLight} strokeWidth="0.5" />
        </>
      );
  }
}

// Door rendering
function renderDoor(biome: BiomeType) {
  const isOutdoor = ['outdoor-promenade', 'garden', 'street'].includes(biome);

  return (
    <>
      <rect width={TILE_SIZE} height={TILE_SIZE} fill={isOutdoor ? COLORS.path : COLORS.woodFloor} />
      <rect x="4" y="2" width="8" height="12" fill={COLORS.woodFloorLight} />
      <rect x="5" y="3" width="6" height="10" fill={COLORS.woodFloor} />
      <circle cx="10" cy="8" r="1" fill={COLORS.gold} />
    </>
  );
}

// Empty/fog of war
function renderEmpty() {
  return (
    <rect width={TILE_SIZE} height={TILE_SIZE} fill="#2A2A2A" opacity="0.9" />
  );
}

// Node marker (for showing locations on the map)
interface NodeMarkerProps {
  x: number;
  y: number;
  type: 'anchor' | 'generated';
  isCurrentLocation: boolean;
  isVisited: boolean;
  name: string;
}

export const NodeMarker = ({ x, y, type, isCurrentLocation, isVisited, name }: NodeMarkerProps) => {
  const size = type === 'anchor' ? 24 : 16;
  const color = type === 'anchor' ? COLORS.gold : COLORS.sage;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Glow effect for current location */}
      {isCurrentLocation && (
        <circle cx="0" cy="0" r={size + 4} fill={COLORS.burgundy} opacity="0.3">
          <animate attributeName="r" values={`${size + 2};${size + 6};${size + 2}`} dur="2s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Main marker */}
      <circle
        cx="0"
        cy="0"
        r={size}
        fill={isCurrentLocation ? COLORS.burgundy : color}
        stroke={COLORS.gold}
        strokeWidth="2"
        opacity={isVisited ? 1 : 0.6}
      />

      {/* Icon */}
      <text
        x="0"
        y="0"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size}
        fill="white"
      >
        {isCurrentLocation ? '👤' : type === 'anchor' ? '⚓' : '✨'}
      </text>

      {/* Name label */}
      <text
        x="0"
        y={size + 12}
        textAnchor="middle"
        fontSize="10"
        fill={COLORS.gold}
        fontWeight="bold"
        style={{ textShadow: '0 0 3px black' }}
      >
        {name}
      </text>
    </g>
  );
};

// Connection path between nodes
interface PathProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  discovered: boolean;
}

export const ConnectionPath = ({ x1, y1, x2, y2, discovered }: PathProps) => {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={discovered ? COLORS.path : '#444'}
      strokeWidth="3"
      strokeDasharray={discovered ? '0' : '5,5'}
      opacity={discovered ? 0.8 : 0.3}
    />
  );
};

export { TILE_SIZE };
