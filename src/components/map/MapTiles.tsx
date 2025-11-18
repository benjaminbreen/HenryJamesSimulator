import type { BiomeType, TileType } from '../../types/procedural';

const TILE_SIZE = 16;

interface TileProps {
  type: TileType;
  biome: BiomeType;
  x: number;
  y: number;
}

// Enhanced Belle Époque color palette with rich variations
const COLORS = {
  // Stone/walls - Parisian limestone with variations
  wall: '#D4C5B0',
  wallDark: '#A89580',
  wallLight: '#E8DCC8',
  wallVein: '#B8A890',
  wallShadow: '#958470',

  // Wood - multiple tones for richness
  mahogany: '#6B3410',
  mahoganyDark: '#4A2008',
  mahoganyLight: '#8B5020',
  oak: '#8B6F47',
  oakDark: '#6B4F27',
  oakLight: '#AB8F67',
  walnut: '#5C4033',
  walnutDark: '#3C2013',

  // Marble - veined and polished
  marbleWhite: '#F5F0E8',
  marbleBeige: '#E8E0D5',
  marbleGray: '#D8D0C5',
  marbleVein: '#C8BCA8',
  marbleVeinDark: '#A89888',

  // Cobblestone variations
  cobble1: '#7A7A7A',
  cobble2: '#6A6A6A',
  cobble3: '#8A8A8A',
  cobble4: '#929292',
  cobbleGrout: '#5A5A5A',

  // Garden/outdoor
  grassBright: '#6A8A4C',
  grass: '#5A7A3C',
  grassDark: '#4A6A2C',
  grassShadow: '#3A5A1C',
  soil: '#8B7355',
  soilDark: '#6B5335',
  pathSand: '#D4C5A0',
  pathStone: '#B8A080',
  pathDark: '#988060',

  // Exhibition hall - industrial materials
  steel: '#586070',
  steelDark: '#404850',
  steelRivet: '#707880',
  glass: '#C8E0F8',
  glassLight: '#E0F0FF',
  glassTint: '#A8C8E8',
  brass: '#C8A870',
  brassShine: '#E8C890',

  // Salon - luxurious materials
  velvetRed: '#A82040',
  velvetDeep: '#881830',
  damask: '#B83050',
  carpet1: '#8B4049',
  carpet2: '#6B3039',
  carpetGold: '#D4B447',

  // Decorative metals and accents
  gold: '#D4AF37',
  goldDark: '#B48F17',
  goldLight: '#F4CF57',
  silver: '#C0C0C8',
  silverDark: '#A0A0A8',
  bronze: '#8C7853',

  // Themed colors
  burgundy: '#800020',
  burgundyDark: '#600010',
  sage: '#9CAF88',
  sageDark: '#7C8F68',
  cream: '#FFF8E8',
  creamDark: '#EFE8D8',

  // Lighting and shadows
  shadow: '#000000',
  highlight: '#FFFFFF',
  ambientDark: '#2A2A2A',
  ambientLight: '#F8F8F0',
};

// Helper: Simple hash function for deterministic tile variation
function tileHash(x: number, y: number): number {
  return ((x * 73856093) ^ (y * 19349663)) >>> 0;
}

// Helper: Get variant index (0-3) based on position
function getVariant(x: number, y: number, count: number = 4): number {
  return tileHash(x, y) % count;
}

// Helper: Get deterministic "random" value 0-1 based on position
function getTileRandom(x: number, y: number, offset: number = 0): number {
  const hash = tileHash(x + offset, y + offset);
  return (hash % 1000) / 1000;
}

export const MapTile = ({ type, biome, x, y }: TileProps) => {
  const renderTile = () => {
    switch (type) {
      case 'wall':
        return renderWall(biome, x, y);
      case 'floor':
        return renderFloor(biome, x, y);
      case 'door':
        return renderDoor(biome, x, y);
      case 'window':
        return renderWindow(biome, x, y);
      case 'furniture':
        return renderFurniture(biome, x, y);
      case 'feature':
        return renderFeature(biome, x, y);
      case 'empty':
        return renderEmpty();
      default:
        return renderFloor(biome, x, y);
    }
  };

  return (
    <g transform={`translate(${x * TILE_SIZE}, ${y * TILE_SIZE})`}>
      {renderTile()}
    </g>
  );
};

// Wall rendering with beautiful biome-specific styles and variations
function renderWall(biome: BiomeType, x: number, y: number) {
  const variant = getVariant(x, y);
  const shadow = getTileRandom(x, y, 1) * 0.2;

  switch (biome) {
    case 'exhibition-hall': {
      // Industrial steel and glass with rivets and framework
      const rivetOffset = variant * 4;
      return (
        <>
          {/* Base steel panel */}
          <rect width={TILE_SIZE} height={TILE_SIZE} fill={COLORS.steel} />
          {/* Shadow for depth */}
          <rect x="0" y={TILE_SIZE - 2} width={TILE_SIZE} height="2" fill={COLORS.shadow} opacity={shadow + 0.2} />
          {/* Steel framework */}
          <rect x="0" y="0" width="2" height={TILE_SIZE} fill={COLORS.steelDark} />
          <rect x="0" y="0" width={TILE_SIZE} height="2" fill={COLORS.steelDark} />
          {/* Rivets */}
          <circle cx={3 + rivetOffset} cy="4" r="0.8" fill={COLORS.steelRivet} />
          <circle cx={3 + rivetOffset} cy="12" r="0.8" fill={COLORS.steelRivet} />
          {/* Glass panels with reflections */}
          <rect x="4" y="4" width="8" height="8" fill={COLORS.glass} opacity="0.4" />
          <line x1="4" y1="4" x2="12" y2="12" stroke={COLORS.glassLight} strokeWidth="0.5" opacity="0.6" />
        </>
      );
    }

    case 'outdoor-promenade':
    case 'garden': {
      // Ornate stone balustrade with weathering
      const weathering = getTileRandom(x, y, 2) > 0.7;
      return (
        <>
          {/* Base limestone */}
          <rect width={TILE_SIZE} height={TILE_SIZE} fill={COLORS.wall} />
          {/* Stone veining */}
          <line x1="0" y1={variant * 4} x2={TILE_SIZE} y2={variant * 4 + 6} stroke={COLORS.wallVein} strokeWidth="0.5" opacity="0.3" />
          {/* Decorative panel */}
          <rect x="3" y="3" width="10" height="10" fill={COLORS.wallLight} />
          {/* Shadow */}
          <rect x="3" y="11" width="10" height="2" fill={COLORS.wallShadow} opacity="0.3" />
          {/* Ornamental rosette */}
          <circle cx="8" cy="8" r="2.5" fill={COLORS.wallDark} opacity="0.4" />
          <circle cx="8" cy="8" r="1.5" fill={COLORS.gold} opacity="0.2" />
          {/* Weathering spots */}
          {weathering && <circle cx={variant * 3 + 2} cy={variant * 3 + 2} r="1" fill={COLORS.wallShadow} opacity="0.2" />}
        </>
      );
    }

    case 'street': {
      // Parisian brick building with detailed mortar
      const brickColors = [COLORS.wall, COLORS.wallDark, COLORS.wallLight];
      const brickColor = brickColors[variant % 3];
      return (
        <>
          {/* Mortar background */}
          <rect width={TILE_SIZE} height={TILE_SIZE} fill={COLORS.wallShadow} />
          {/* Bricks in running bond pattern */}
          <rect x="1" y="1" width="6" height="4" fill={brickColor} />
          <rect x="8" y="1" width="7" height="4" fill={brickColors[(variant + 1) % 3]} />
          <rect x="1" y="6" width="4" height="4" fill={brickColors[(variant + 2) % 3]} />
          <rect x="6" y="6" width="9" height="4" fill={brickColor} />
          <rect x="1" y="11" width="7" height="4" fill={brickColors[(variant + 1) % 3]} />
          <rect x="9" y="11" width="6" height="4" fill={brickColor} />
          {/* Weathering and texture */}
          <rect x="0" y="0" width={TILE_SIZE} height={TILE_SIZE} fill={COLORS.shadow} opacity={shadow} />
        </>
      );
    }

    case 'indoor-salon': {
      // Ornate wood paneling with gold leaf accents
      const panelVariant = variant % 2;
      return (
        <>
          {/* Rich mahogany base */}
          <rect width={TILE_SIZE} height={TILE_SIZE} fill={COLORS.mahogany} />
          {/* Wood grain */}
          <line x1="0" y1={variant * 3} x2={TILE_SIZE} y2={variant * 3 + 2} stroke={COLORS.mahoganyDark} strokeWidth="0.5" opacity="0.4" />
          <line x1="0" y1={variant * 3 + 6} x2={TILE_SIZE} y2={variant * 3 + 8} stroke={COLORS.mahoganyDark} strokeWidth="0.5" opacity="0.3" />
          {/* Decorative panel frame */}
          <rect x="2" y="2" width="12" height="12" fill={COLORS.mahoganyLight} opacity="0.3" />
          {/* Gold leaf accent */}
          {panelVariant === 0 && (
            <>
              <rect x="6" y="2" width="4" height="12" fill={COLORS.gold} opacity="0.2" />
              <rect x="7" y="3" width="2" height="10" fill={COLORS.goldLight} opacity="0.15" />
            </>
          )}
          {/* Carved detail */}
          <circle cx="8" cy="8" r="1.5" fill={COLORS.gold} opacity="0.3" />
          {/* Shadow for depth */}
          <rect x="1" y="13" width="14" height="2" fill={COLORS.shadow} opacity="0.2" />
        </>
      );
    }

    case 'marketplace':
    case 'backstage': {
      // Worn, utilitarian wood planks
      const plankColor = variant % 2 === 0 ? COLORS.oak : COLORS.oakDark;
      return (
        <>
          {/* Wood planks */}
          <rect width={TILE_SIZE} height={TILE_SIZE} fill={plankColor} />
          {/* Vertical plank lines */}
          <line x1="5" y1="0" x2="5" y2={TILE_SIZE} stroke={COLORS.oakDark} strokeWidth="1" />
          <line x1="11" y1="0" x2="11" y2={TILE_SIZE} stroke={COLORS.oakDark} strokeWidth="1" />
          {/* Wood grain */}
          <line x1="0" y1={variant * 4} x2="5" y2={variant * 4 + 2} stroke={COLORS.walnutDark} strokeWidth="0.5" opacity="0.3" />
          <line x1="5" y1={variant * 3} x2="11" y2={variant * 3 + 3} stroke={COLORS.walnutDark} strokeWidth="0.5" opacity="0.3" />
          <line x1="11" y1={variant * 4 + 1} x2={TILE_SIZE} y2={variant * 4 + 3} stroke={COLORS.walnutDark} strokeWidth="0.5" opacity="0.3" />
          {/* Wear and dirt */}
          <rect x="0" y="0" width={TILE_SIZE} height={TILE_SIZE} fill={COLORS.shadow} opacity={shadow + 0.1} />
        </>
      );
    }

    default: {
      // Elegant interior wall with damask wallpaper
      return (
        <>
          {/* Base wall color */}
          <rect width={TILE_SIZE} height={TILE_SIZE} fill={COLORS.creamDark} />
          {/* Damask pattern */}
          <circle cx="4" cy="4" r="2" fill={COLORS.sage} opacity="0.2" />
          <circle cx="12" cy="12" r="2" fill={COLORS.sage} opacity="0.2" />
          {/* Gold wainscoting hint */}
          <rect x="0" y="12" width={TILE_SIZE} height="4" fill={COLORS.oak} />
          <rect x="0" y="12" width={TILE_SIZE} height="1" fill={COLORS.gold} opacity="0.3" />
        </>
      );
    }
  }
}

// Floor rendering with beautiful biome-specific patterns and variations
function renderFloor(biome: BiomeType, x: number, y: number) {
  const variant = getVariant(x, y);
  const highlight = getTileRandom(x, y, 3) > 0.7;

  switch (biome) {
    case 'exhibition-hall': {
      // Polished white marble with elegant veining
      const marbleShades = [COLORS.marbleWhite, COLORS.marbleBeige, COLORS.marbleGray];
      const baseColor = marbleShades[variant % 3];
      return (
        <>
          {/* Base marble */}
          <rect width={TILE_SIZE} height={TILE_SIZE} fill={baseColor} />
          {/* Multiple vein layers for realism */}
          <line
            x1="0" y1={variant * 4}
            x2={TILE_SIZE} y2={variant * 4 + 8}
            stroke={COLORS.marbleVein}
            strokeWidth="0.5"
            opacity="0.3"
          />
          <line
            x1="0" y1={variant * 4 + 2}
            x2={TILE_SIZE} y2={variant * 4 + 6}
            stroke={COLORS.marbleVeinDark}
            strokeWidth="0.3"
            opacity="0.2"
          />
          {/* Polished shine */}
          {highlight && (
            <rect
              x={variant * 4} y={variant * 3}
              width="4" height="4"
              fill={COLORS.highlight}
              opacity="0.15"
            />
          )}
        </>
      );
    }

    case 'outdoor-promenade': {
      // Elegant paved promenade with varied stone slabs
      const stoneColors = [COLORS.pathStone, COLORS.pathDark, COLORS.pathSand];
      const slabColor = stoneColors[variant % 3];
      return (
        <>
          {/* Base paving stone */}
          <rect width={TILE_SIZE} height={TILE_SIZE} fill={slabColor} />
          {/* Stone joints/grout */}
          <rect x="0" y="7" width={TILE_SIZE} height="2" fill={COLORS.wallShadow} opacity="0.3" />
          <rect x="7" y="0" width="2" height={TILE_SIZE} fill={COLORS.wallShadow} opacity="0.3" />
          {/* Natural stone texture */}
          <circle cx={variant * 4 + 3} cy={variant * 3 + 4} r="1.5" fill={COLORS.pathDark} opacity="0.2" />
          <circle cx={variant * 3 + 10} cy={variant * 4 + 10} r="1" fill={COLORS.pathSand} opacity="0.3" />
        </>
      );
    }

    case 'garden': {
      // Lush grass with organic variation
      const grassShades = [COLORS.grass, COLORS.grassDark, COLORS.grassBright];
      const baseGrass = grassShades[variant % 3];
      const bladeCount = 3 + (variant % 3);
      return (
        <>
          {/* Base grass color */}
          <rect width={TILE_SIZE} height={TILE_SIZE} fill={baseGrass} />
          {/* Grass texture - small darker patches */}
          <circle cx="4" cy="4" r="1.5" fill={COLORS.grassDark} opacity="0.4" />
          <circle cx="12" cy="10" r="1.5" fill={COLORS.grassDark} opacity="0.4" />
          <circle cx="8" cy="13" r="1" fill={COLORS.grassShadow} opacity="0.3" />
          {/* Individual grass blades for detail */}
          {[...Array(bladeCount)].map((_, i) => (
            <line
              key={i}
              x1={(i * 5 + variant) % TILE_SIZE}
              y1={(i * 4 + variant * 2) % TILE_SIZE}
              x2={(i * 5 + variant) % TILE_SIZE}
              y2={((i * 4 + variant * 2) % TILE_SIZE) + 2}
              stroke={COLORS.grassBright}
              strokeWidth="0.3"
              opacity="0.5"
            />
          ))}
          {/* Occasional dirt patch */}
          {getTileRandom(x, y, 5) > 0.8 && (
            <circle cx={variant * 3 + 6} cy={variant * 4 + 8} r="2" fill={COLORS.soil} opacity="0.3" />
          )}
        </>
      );
    }

    case 'street': {
      // Irregular Parisian cobblestones
      const cobbleVariants = [COLORS.cobble1, COLORS.cobble2, COLORS.cobble3, COLORS.cobble4];
      return (
        <>
          {/* Grout/mortar base */}
          <rect width={TILE_SIZE} height={TILE_SIZE} fill={COLORS.cobbleGrout} />
          {/* Individual cobbles with variation */}
          <ellipse cx="4" cy="4" rx="3" ry="2.5" fill={cobbleVariants[variant % 4]} />
          <ellipse cx="12" cy="4" rx="2.5" ry="3" fill={cobbleVariants[(variant + 1) % 4]} />
          <ellipse cx="4" cy="12" rx="3" ry="3" fill={cobbleVariants[(variant + 2) % 4]} />
          <ellipse cx="12" cy="12" rx="2.5" ry="2.5" fill={cobbleVariants[(variant + 3) % 4]} />
          {/* Highlights on stones */}
          <ellipse cx="4" cy="3" rx="1" ry="0.5" fill={COLORS.highlight} opacity="0.2" />
          <ellipse cx="12" cy="3" rx="0.8" ry="0.5" fill={COLORS.highlight} opacity="0.2" />
          {/* Weathering and wear */}
          <rect x="0" y="0" width={TILE_SIZE} height={TILE_SIZE} fill={COLORS.shadow} opacity={getTileRandom(x, y, 6) * 0.15} />
        </>
      );
    }

    case 'indoor-salon': {
      // Luxurious parquet floor with herringbone pattern
      const woodVariants = [COLORS.oak, COLORS.oakDark, COLORS.mahogany];
      const plankColor1 = woodVariants[variant % 3];
      const plankColor2 = woodVariants[(variant + 1) % 3];
      return (
        <>
          {/* Base floor */}
          <rect width={TILE_SIZE} height={TILE_SIZE} fill={plankColor1} />
          {/* Herringbone pattern */}
          <rect x="0" y="0" width="8" height={TILE_SIZE} fill={plankColor2} opacity="0.4" />
          <polygon points="0,0 8,0 0,8" fill={plankColor1} opacity="0.6" />
          <polygon points={`${TILE_SIZE},${TILE_SIZE} 8,${TILE_SIZE} ${TILE_SIZE},8`} fill={plankColor1} opacity="0.6" />
          {/* Wood grain detail */}
          <line x1="2" y1="0" x2="2" y2={TILE_SIZE} stroke={COLORS.walnutDark} strokeWidth="0.3" opacity="0.3" />
          <line x1="6" y1="0" x2="6" y2={TILE_SIZE} stroke={COLORS.walnutDark} strokeWidth="0.3" opacity="0.3" />
          {/* Polished shine */}
          {highlight && (
            <rect x="4" y="4" width="6" height="6" fill={COLORS.highlight} opacity="0.1" />
          )}
          {/* Plush carpet overlay (occasional) */}
          {variant === 0 && (
            <>
              <rect x="2" y="2" width="12" height="12" fill={COLORS.carpet1} opacity="0.3" />
              <rect x="3" y="3" width="10" height="10" fill={COLORS.carpet2} opacity="0.2" />
              {/* Carpet pattern */}
              <circle cx="8" cy="8" r="2" fill={COLORS.carpetGold} opacity="0.3" />
            </>
          )}
        </>
      );
    }

    case 'marketplace': {
      // Well-worn market cobbles with stains and debris
      const cobbleColors = [COLORS.cobble1, COLORS.cobble2, COLORS.cobble3];
      const baseColor = cobbleColors[variant % 3];
      return (
        <>
          {/* Base cobblestone */}
          <rect width={TILE_SIZE} height={TILE_SIZE} fill={baseColor} />
          {/* Grout lines */}
          <line x1="0" y1="8" x2={TILE_SIZE} y2="8" stroke={COLORS.cobbleGrout} strokeWidth="1" />
          <line x1="8" y1="0" x2="8" y2={TILE_SIZE} stroke={COLORS.cobbleGrout} strokeWidth="1" />
          {/* Market stains (wine, produce, etc.) */}
          <circle cx={variant * 3 + 3} cy={variant * 4 + 4} r="2" fill={COLORS.burgundyDark} opacity="0.2" />
          <circle cx={variant * 4 + 10} cy={variant * 3 + 9} r="1.5" fill={COLORS.soil} opacity="0.3" />
          {/* Wear patterns */}
          <rect x="6" y="6" width="4" height="4" fill={COLORS.shadow} opacity="0.15" />
        </>
      );
    }

    case 'npc-quarters': {
      // Simple worn wood planks
      const plankColors = [COLORS.oak, COLORS.oakDark, COLORS.walnut];
      const plankColor = plankColors[variant % 3];
      return (
        <>
          {/* Horizontal planks */}
          <rect width={TILE_SIZE} height={TILE_SIZE} fill={plankColor} />
          {/* Plank seams */}
          <line x1="0" y1="5" x2={TILE_SIZE} y2="5" stroke={COLORS.walnutDark} strokeWidth="0.8" />
          <line x1="0" y1="11" x2={TILE_SIZE} y2="11" stroke={COLORS.walnutDark} strokeWidth="0.8" />
          {/* Wood grain */}
          <line x1="0" y1={variant * 2 + 2} x2={TILE_SIZE} y2={variant * 2 + 3} stroke={COLORS.oakDark} strokeWidth="0.3" opacity="0.4" />
          <line x1="0" y1={variant * 2 + 8} x2={TILE_SIZE} y2={variant * 2 + 9} stroke={COLORS.oakDark} strokeWidth="0.3" opacity="0.4" />
          {/* Knots and imperfections */}
          <circle cx={variant * 4 + 4} cy="8" r="1" fill={COLORS.walnutDark} opacity="0.4" />
          {/* Wear */}
          <rect x="0" y="0" width={TILE_SIZE} height={TILE_SIZE} fill={COLORS.shadow} opacity="0.1" />
        </>
      );
    }

    case 'backstage': {
      // Rough stage boards with paint splatters
      const boardColor = variant % 2 === 0 ? COLORS.oak : COLORS.walnut;
      return (
        <>
          {/* Vertical stage boards */}
          <rect width={TILE_SIZE} height={TILE_SIZE} fill={boardColor} />
          {/* Board lines */}
          <line x1="4" y1="0" x2="4" y2={TILE_SIZE} stroke={COLORS.walnutDark} strokeWidth="1" />
          <line x1="8" y1="0" x2="8" y2={TILE_SIZE} stroke={COLORS.walnutDark} strokeWidth="1" />
          <line x1="12" y1="0" x2="12" y2={TILE_SIZE} stroke={COLORS.walnutDark} strokeWidth="1" />
          {/* Paint splatters (from set work) */}
          {getTileRandom(x, y, 7) > 0.6 && (
            <>
              <circle cx={variant * 3 + 5} cy={variant * 4 + 6} r="1" fill={COLORS.silver} opacity="0.3" />
              <circle cx={variant * 4 + 10} cy={variant * 3 + 10} r="0.8" fill={COLORS.burgundy} opacity="0.3" />
            </>
          )}
          {/* Scuff marks */}
          <rect x={variant * 3} y={variant * 4} width="3" height="2" fill={COLORS.shadow} opacity="0.2" />
        </>
      );
    }

    default: {
      // Generic elegant tile
      return (
        <>
          <rect width={TILE_SIZE} height={TILE_SIZE} fill={COLORS.marbleBeige} />
          <line x1="0" y1={TILE_SIZE} x2={TILE_SIZE} y2="0" stroke={COLORS.marbleVein} strokeWidth="0.5" opacity="0.2" />
        </>
      );
    }
  }
}

// Door rendering with enhanced details
function renderDoor(biome: BiomeType, x: number, y: number) {
  const isOutdoor = ['outdoor-promenade', 'garden', 'street'].includes(biome);
  const variant = getVariant(x, y);
  const doorColor = variant % 2 === 0 ? COLORS.mahogany : COLORS.walnut;

  return (
    <>
      {/* Floor beneath door */}
      <rect width={TILE_SIZE} height={TILE_SIZE} fill={isOutdoor ? COLORS.pathStone : COLORS.oak} />
      {/* Door frame */}
      <rect x="3" y="1" width="10" height="14" fill={COLORS.wallDark} />
      {/* Door panel */}
      <rect x="4" y="2" width="8" height="12" fill={doorColor} />
      {/* Door detail panels */}
      <rect x="5" y="3" width="6" height="4" fill={COLORS.mahoganyDark} opacity="0.3" />
      <rect x="5" y="9" width="6" height="4" fill={COLORS.mahoganyDark} opacity="0.3" />
      {/* Brass doorknob */}
      <circle cx="10" cy="8" r="1" fill={COLORS.brass} />
      <circle cx="10" cy="8" r="0.5" fill={COLORS.brassShine} opacity="0.8" />
      {/* Decorative hinge */}
      <rect x="4" y="3" width="1" height="2" fill={COLORS.bronze} />
      <rect x="4" y="11" width="1" height="2" fill={COLORS.bronze} />
    </>
  );
}

// Window rendering with glass and frames
function renderWindow(biome: BiomeType, x: number, y: number) {
  const variant = getVariant(x, y);
  const isStainedGlass = variant % 3 === 0 && biome === 'indoor-salon';

  return (
    <>
      {/* Wall behind window */}
      <rect width={TILE_SIZE} height={TILE_SIZE} fill={COLORS.wall} />
      {/* Window frame */}
      <rect x="2" y="2" width="12" height="12" fill={COLORS.walnut} />
      {/* Glass panes */}
      {isStainedGlass ? (
        <>
          {/* Stained glass for salon */}
          <rect x="3" y="3" width="5" height="5" fill={COLORS.burgundy} opacity="0.6" />
          <rect x="8" y="3" width="5" height="5" fill={COLORS.gold} opacity="0.6" />
          <rect x="3" y="8" width="5" height="5" fill={COLORS.sage} opacity="0.6" />
          <rect x="8" y="8" width="5" height="5" fill={COLORS.glassTint} opacity="0.6" />
          {/* Lead came lines */}
          <line x1="3" y1="8" x2="13" y2="8" stroke={COLORS.shadow} strokeWidth="0.5" />
          <line x1="8" y1="3" x2="8" y2="13" stroke={COLORS.shadow} strokeWidth="0.5" />
        </>
      ) : (
        <>
          {/* Clear glass with reflection */}
          <rect x="3" y="3" width="10" height="10" fill={COLORS.glass} opacity="0.5" />
          {/* Window panes */}
          <line x1="3" y1="8" x2="13" y2="8" stroke={COLORS.walnutDark} strokeWidth="0.8" />
          <line x1="8" y1="3" x2="8" y2="13" stroke={COLORS.walnutDark} strokeWidth="0.8" />
          {/* Sky reflection */}
          <rect x="4" y="4" width="3" height="3" fill={COLORS.glassLight} opacity="0.4" />
        </>
      )}
    </>
  );
}

// Furniture rendering - biome-specific pieces
function renderFurniture(biome: BiomeType, x: number, y: number) {
  const variant = getVariant(x, y, 6);

  switch (biome) {
    case 'exhibition-hall': {
      // Display case or exhibit pedestal
      if (variant % 2 === 0) {
        // Glass display case
        return (
          <>
            {renderFloor(biome, x, y)}
            {/* Case base */}
            <rect x="3" y="8" width="10" height="6" fill={COLORS.mahogany} />
            {/* Glass case */}
            <rect x="4" y="4" width="8" height="4" fill={COLORS.glass} opacity="0.4" />
            <rect x="4" y="4" width="8" height="4" fill="none" stroke={COLORS.brass} strokeWidth="0.5" />
            {/* Exhibit item inside (simplified) */}
            <circle cx="8" cy="6" r="1.5" fill={COLORS.gold} />
          </>
        );
      } else {
        // Pedestal
        return (
          <>
            {renderFloor(biome, x, y)}
            <rect x="5" y="10" width="6" height="4" fill={COLORS.marbleBeige} />
            <rect x="4" y="6" width="8" height="4" fill={COLORS.marbleGray} />
            <circle cx="8" cy="5" r="2" fill={COLORS.brass} />
          </>
        );
      }
    }

    case 'indoor-salon': {
      // Luxury furniture
      const furnitureTypes = ['chair', 'table', 'piano'];
      const furnitureType = furnitureTypes[variant % 3];

      if (furnitureType === 'chair') {
        // Ornate chair
        return (
          <>
            {renderFloor(biome, x, y)}
            {/* Chair seat */}
            <rect x="4" y="8" width="8" height="4" fill={COLORS.velvetRed} />
            <rect x="5" y="9" width="6" height="2" fill={COLORS.velvetDeep} />
            {/* Chair back */}
            <rect x="6" y="4" width="4" height="4" fill={COLORS.mahogany} />
            {/* Gold accent */}
            <rect x="7" y="5" width="2" height="2" fill={COLORS.gold} opacity="0.4" />
            {/* Legs */}
            <rect x="5" y="12" width="1" height="2" fill={COLORS.mahoganyDark} />
            <rect x="10" y="12" width="1" height="2" fill={COLORS.mahoganyDark} />
          </>
        );
      } else if (furnitureType === 'table') {
        // Side table
        return (
          <>
            {renderFloor(biome, x, y)}
            {/* Table top */}
            <rect x="3" y="7" width="10" height="3" fill={COLORS.mahogany} />
            <rect x="4" y="8" width="8" height="1" fill={COLORS.mahoganyLight} opacity="0.3" />
            {/* Legs */}
            <rect x="4" y="10" width="1" height="4" fill={COLORS.mahoganyDark} />
            <rect x="11" y="10" width="1" height="4" fill={COLORS.mahoganyDark} />
            {/* Gold trim */}
            <rect x="3" y="7" width="10" height="0.5" fill={COLORS.gold} opacity="0.5" />
          </>
        );
      } else {
        // Piano
        return (
          <>
            {renderFloor(biome, x, y)}
            {/* Piano body */}
            <rect x="2" y="6" width="12" height="8" fill={COLORS.mahoganyDark} />
            {/* Keys */}
            <rect x="3" y="12" width="10" height="2" fill={COLORS.cream} />
            {/* Black keys */}
            <rect x="4" y="12" width="1" height="1" fill={COLORS.shadow} />
            <rect x="6" y="12" width="1" height="1" fill={COLORS.shadow} />
            <rect x="9" y="12" width="1" height="1" fill={COLORS.shadow} />
          </>
        );
      }
    }

    case 'marketplace': {
      // Market stall
      return (
        <>
          {renderFloor(biome, x, y)}
          {/* Stall counter */}
          <rect x="2" y="8" width="12" height="4" fill={COLORS.oak} />
          {/* Awning support */}
          <rect x="3" y="4" width="1" height="4" fill={COLORS.oakDark} />
          <rect x="12" y="4" width="1" height="4" fill={COLORS.oakDark} />
          {/* Goods on display */}
          <circle cx="5" cy="9" r="1.5" fill={COLORS.burgundy} opacity="0.6" />
          <circle cx="8" cy="9" r="1.5" fill={COLORS.sage} opacity="0.6" />
          <circle cx="11" cy="9" r="1.5" fill={COLORS.gold} opacity="0.6" />
        </>
      );
    }

    case 'garden': {
      // Garden furniture - bench or fountain
      if (variant % 2 === 0) {
        // Bench
        return (
          <>
            {renderFloor(biome, x, y)}
            {/* Bench seat */}
            <rect x="3" y="8" width="10" height="3" fill={COLORS.oak} />
            {/* Bench back */}
            <rect x="3" y="5" width="10" height="2" fill={COLORS.oak} />
            {/* Iron frame */}
            <rect x="4" y="7" width="1" height="4" fill={COLORS.shadow} />
            <rect x="11" y="7" width="1" height="4" fill={COLORS.shadow} />
          </>
        );
      } else {
        // Small fountain
        return (
          <>
            {renderFloor(biome, x, y)}
            {/* Basin */}
            <ellipse cx="8" cy="10" rx="5" ry="3" fill={COLORS.wall} />
            <ellipse cx="8" cy="10" rx="4" ry="2" fill={COLORS.glassTint} opacity="0.6" />
            {/* Fountain center */}
            <rect x="7" y="6" width="2" height="4" fill={COLORS.wallDark} />
            {/* Water spray */}
            <circle cx="8" cy="5" r="0.5" fill={COLORS.glass} opacity="0.7" />
          </>
        );
      }
    }

    case 'npc-quarters':
    case 'backstage': {
      // Simple furniture - bed or trunk
      if (variant % 2 === 0) {
        // Simple bed
        return (
          <>
            {renderFloor(biome, x, y)}
            {/* Bed frame */}
            <rect x="2" y="6" width="12" height="7" fill={COLORS.oakDark} />
            {/* Mattress */}
            <rect x="3" y="7" width="10" height="4" fill={COLORS.cream} />
            {/* Blanket */}
            <rect x="3" y="9" width="10" height="2" fill={COLORS.burgundy} opacity="0.6" />
          </>
        );
      } else {
        // Storage trunk
        return (
          <>
            {renderFloor(biome, x, y)}
            {/* Trunk body */}
            <rect x="4" y="8" width="8" height="5" fill={COLORS.walnut} />
            {/* Metal bands */}
            <rect x="4" y="9" width="8" height="0.5" fill={COLORS.bronze} />
            <rect x="4" y="11" width="8" height="0.5" fill={COLORS.bronze} />
            {/* Lock */}
            <rect x="7" y="10" width="2" height="1" fill={COLORS.brass} />
          </>
        );
      }
    }

    default: {
      // Generic table
      return (
        <>
          {renderFloor(biome, x, y)}
          <rect x="4" y="8" width="8" height="2" fill={COLORS.oak} />
          <rect x="5" y="10" width="1" height="3" fill={COLORS.oakDark} />
          <rect x="10" y="10" width="1" height="3" fill={COLORS.oakDark} />
        </>
      );
    }
  }
}

// Feature rendering - decorative elements
function renderFeature(biome: BiomeType, x: number, y: number) {
  const variant = getVariant(x, y, 8);

  switch (biome) {
    case 'exhibition-hall': {
      // Industrial features - machinery or steam pipes
      if (variant % 2 === 0) {
        // Machine wheel
        return (
          <>
            {renderFloor(biome, x, y)}
            <circle cx="8" cy="8" r="5" fill={COLORS.steel} />
            <circle cx="8" cy="8" r="3" fill={COLORS.steelDark} />
            {/* Spokes */}
            <line x1="8" y1="3" x2="8" y2="13" stroke={COLORS.steelRivet} strokeWidth="1" />
            <line x1="3" y1="8" x2="13" y2="8" stroke={COLORS.steelRivet} strokeWidth="1" />
            <circle cx="8" cy="8" r="1.5" fill={COLORS.brass} />
          </>
        );
      } else {
        // Steam pipe
        return (
          <>
            {renderFloor(biome, x, y)}
            <rect x="6" y="0" width="4" height={TILE_SIZE} fill={COLORS.steel} />
            <ellipse cx="8" cy="6" rx="3" ry="1.5" fill={COLORS.steelDark} />
            <circle cx="7" cy="4" r="0.8" fill={COLORS.steelRivet} />
            <circle cx="9" cy="10" r="0.8" fill={COLORS.steelRivet} />
          </>
        );
      }
    }

    case 'indoor-salon': {
      // Luxury decorations - chandelier, painting, sculpture
      const decorTypes = ['chandelier', 'painting', 'sculpture'];
      const decorType = decorTypes[variant % 3];

      if (decorType === 'chandelier') {
        return (
          <>
            {renderFloor(biome, x, y)}
            {/* Chain */}
            <rect x="7.5" y="0" width="1" height="4" fill={COLORS.bronze} />
            {/* Chandelier body */}
            <ellipse cx="8" cy="5" rx="4" ry="2" fill={COLORS.gold} />
            {/* Candles */}
            <rect x="5" y="4" width="1" height="2" fill={COLORS.cream} />
            <rect x="8" y="4" width="1" height="2" fill={COLORS.cream} />
            <rect x="11" y="4" width="1" height="2" fill={COLORS.cream} />
            {/* Flames */}
            <circle cx="5.5" cy="3.5" r="0.5" fill={COLORS.goldLight} opacity="0.8" />
            <circle cx="8.5" cy="3.5" r="0.5" fill={COLORS.goldLight} opacity="0.8" />
            <circle cx="11.5" cy="3.5" r="0.5" fill={COLORS.goldLight} opacity="0.8" />
          </>
        );
      } else if (decorType === 'painting') {
        return (
          <>
            {renderWall(biome, x, y)}
            {/* Frame */}
            <rect x="3" y="3" width="10" height="10" fill={COLORS.gold} />
            {/* Canvas */}
            <rect x="4" y="4" width="8" height="8" fill={COLORS.creamDark} />
            {/* Abstract art */}
            <rect x="5" y="5" width="3" height="3" fill={COLORS.burgundy} opacity="0.6" />
            <circle cx="9" cy="9" r="2" fill={COLORS.sage} opacity="0.6" />
          </>
        );
      } else {
        // Sculpture
        return (
          <>
            {renderFloor(biome, x, y)}
            {/* Pedestal */}
            <rect x="5" y="11" width="6" height="3" fill={COLORS.marbleBeige} />
            {/* Bust */}
            <ellipse cx="8" cy="8" rx="3" ry="4" fill={COLORS.marbleWhite} />
            <circle cx="8" cy="7" r="2" fill={COLORS.marbleGray} opacity="0.3" />
          </>
        );
      }
    }

    case 'garden': {
      // Garden features - flowers, trees, statues
      const gardenFeatures = ['flowers', 'tree', 'statue'];
      const featureType = gardenFeatures[variant % 3];

      if (featureType === 'flowers') {
        return (
          <>
            {renderFloor(biome, x, y)}
            {/* Flower bed */}
            <ellipse cx="8" cy="10" rx="5" ry="3" fill={COLORS.soil} />
            {/* Flowers */}
            <circle cx="5" cy="9" r="1" fill={COLORS.burgundy} opacity="0.8" />
            <circle cx="8" cy="8" r="1" fill={COLORS.gold} opacity="0.8" />
            <circle cx="11" cy="9" r="1" fill={COLORS.damask} opacity="0.8" />
            <circle cx="7" cy="10" r="1" fill={COLORS.sage} opacity="0.8" />
            {/* Stems */}
            <line x1="5" y1="10" x2="5" y2="12" stroke={COLORS.grassDark} strokeWidth="0.5" />
            <line x1="8" y1="9" x2="8" y2="12" stroke={COLORS.grassDark} strokeWidth="0.5" />
          </>
        );
      } else if (featureType === 'tree') {
        return (
          <>
            {renderFloor(biome, x, y)}
            {/* Trunk */}
            <rect x="6" y="8" width="4" height="6" fill={COLORS.walnut} />
            {/* Canopy */}
            <circle cx="8" cy="6" r="5" fill={COLORS.grassBright} opacity="0.8" />
            <circle cx="6" cy="7" r="3" fill={COLORS.grass} opacity="0.7" />
            <circle cx="10" cy="7" r="3" fill={COLORS.grassDark} opacity="0.7" />
          </>
        );
      } else {
        // Garden statue
        return (
          <>
            {renderFloor(biome, x, y)}
            {/* Base */}
            <rect x="5" y="12" width="6" height="2" fill={COLORS.wall} />
            {/* Statue figure */}
            <ellipse cx="8" cy="9" rx="2" ry="4" fill={COLORS.wallLight} />
            <circle cx="8" cy="6" r="1.5" fill={COLORS.wallLight} />
            {/* Weathering */}
            <rect x="7" y="8" width="2" height="3" fill={COLORS.wallVein} opacity="0.3" />
          </>
        );
      }
    }

    case 'outdoor-promenade': {
      // Lamp post or flag pole
      if (variant % 2 === 0) {
        // Ornate gas lamp
        return (
          <>
            {renderFloor(biome, x, y)}
            {/* Post */}
            <rect x="7" y="4" width="2" height="10" fill={COLORS.bronze} />
            {/* Base */}
            <rect x="6" y="13" width="4" height="1" fill={COLORS.bronze} />
            {/* Lamp housing */}
            <rect x="5" y="2" width="6" height="4" fill={COLORS.glass} opacity="0.6" />
            <rect x="5" y="2" width="6" height="4" fill="none" stroke={COLORS.gold} strokeWidth="0.5" />
            {/* Light */}
            <circle cx="8" cy="4" r="1.5" fill={COLORS.goldLight} opacity="0.7" />
          </>
        );
      } else {
        // Flag pole
        return (
          <>
            {renderFloor(biome, x, y)}
            {/* Pole */}
            <rect x="7" y="0" width="1" height="14" fill={COLORS.silver} />
            {/* Flag */}
            <polygon points="8,2 14,4 8,6" fill={COLORS.burgundy} opacity="0.8" />
            <polygon points="8,3 13,4 8,5" fill={COLORS.gold} opacity="0.6" />
          </>
        );
      }
    }

    case 'marketplace': {
      // Market barrels, crates, or produce
      const marketItems = ['barrel', 'crate', 'produce'];
      const itemType = marketItems[variant % 3];

      if (itemType === 'barrel') {
        return (
          <>
            {renderFloor(biome, x, y)}
            {/* Barrel */}
            <ellipse cx="8" cy="6" rx="4" ry="2" fill={COLORS.oak} />
            <rect x="4" y="6" width="8" height="6" fill={COLORS.oakDark} />
            <ellipse cx="8" cy="12" rx="4" ry="2" fill={COLORS.oak} />
            {/* Bands */}
            <rect x="4" y="8" width="8" height="0.5" fill={COLORS.bronze} />
            <rect x="4" y="10" width="8" height="0.5" fill={COLORS.bronze} />
          </>
        );
      } else if (itemType === 'crate') {
        return (
          <>
            {renderFloor(biome, x, y)}
            {/* Crate */}
            <rect x="4" y="8" width="8" height="6" fill={COLORS.oak} />
            {/* Wood slats */}
            <line x1="4" y1="10" x2="12" y2="10" stroke={COLORS.oakDark} strokeWidth="0.5" />
            <line x1="4" y1="12" x2="12" y2="12" stroke={COLORS.oakDark} strokeWidth="0.5" />
            <line x1="7" y1="8" x2="7" y2="14" stroke={COLORS.oakDark} strokeWidth="0.5" />
            <line x1="9" y1="8" x2="9" y2="14" stroke={COLORS.oakDark} strokeWidth="0.5" />
          </>
        );
      } else {
        // Produce baskets
        return (
          <>
            {renderFloor(biome, x, y)}
            {/* Baskets */}
            <ellipse cx="5" cy="11" rx="3" ry="2" fill={COLORS.oak} />
            <ellipse cx="11" cy="11" rx="3" ry="2" fill={COLORS.oak} />
            {/* Produce */}
            <circle cx="5" cy="10" r="1" fill={COLORS.burgundy} opacity="0.8" />
            <circle cx="6" cy="10" r="0.8" fill={COLORS.burgundyDark} opacity="0.8" />
            <circle cx="11" cy="10" r="1" fill={COLORS.sage} opacity="0.8" />
            <circle cx="10" cy="10" r="0.8" fill={COLORS.sageDark} opacity="0.8" />
          </>
        );
      }
    }

    default: {
      // Generic plant
      return (
        <>
          {renderFloor(biome, x, y)}
          {/* Pot */}
          <rect x="6" y="11" width="4" height="3" fill={COLORS.wall} />
          {/* Plant */}
          <circle cx="8" cy="9" r="3" fill={COLORS.sage} opacity="0.7" />
          <circle cx="7" cy="8" r="2" fill={COLORS.sageDark} opacity="0.6" />
        </>
      );
    }
  }
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
      stroke={discovered ? COLORS.pathStone : '#444'}
      strokeWidth="3"
      strokeDasharray={discovered ? '0' : '5,5'}
      opacity={discovered ? 0.8 : 0.3}
    />
  );
};

export { TILE_SIZE };
