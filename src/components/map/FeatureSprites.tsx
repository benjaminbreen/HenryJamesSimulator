import type { Feature } from '../../types/procedural';
import { SeededRandom } from '../../utils/seededRandom';

interface FeatureSpriteProps {
  feature: Feature;
  x: number;
  y: number;
  seed: string;
}

/**
 * Procedurally generated SVG sprites for map features
 * Each feature gets a unique but reproducible appearance based on its seed
 */
export const FeatureSprite = ({ feature, x, y, seed }: FeatureSpriteProps) => {
  const rng = new SeededRandom(seed + feature.id);

  const renderSprite = () => {
    switch (feature.type) {
      case 'furniture':
        return renderFurniture(feature, rng);
      case 'exhibit':
        return renderExhibit(feature, rng);
      case 'decoration':
        return renderDecoration(feature, rng);
      case 'vegetation':
        return renderVegetation(feature, rng);
      default:
        return renderGeneric(feature, rng);
    }
  };

  return (
    <g transform={`translate(${x}, ${y})`} className="feature-sprite">
      {renderSprite()}
      {/* Feature name on hover */}
      <title>{feature.name}</title>
    </g>
  );
};

// Furniture: chairs, desks, tables, etc.
function renderFurniture(feature: Feature, rng: SeededRandom) {
  const name = feature.name.toLowerCase();

  if (name.includes('desk') || name.includes('writing')) {
    // Ornate writing desk
    const woodColor = rng.choice(['#8B6F47', '#6B4E2E', '#5C3A21']);
    return (
      <g>
        {/* Desktop */}
        <rect x="-12" y="-4" width="24" height="12" fill={woodColor} stroke="#4A3420" strokeWidth="0.5" />
        <rect x="-11" y="-3" width="22" height="10" fill={woodColor} opacity="0.8" />
        {/* Legs */}
        <rect x="-10" y="8" width="3" height="8" fill={woodColor} />
        <rect x="7" y="8" width="3" height="8" fill={woodColor} />
        {/* Decorative inlay */}
        <rect x="-8" y="0" width="16" height="4" fill="#D4AF37" opacity="0.3" />
        {/* Papers */}
        <rect x="-6" y="-2" width="8" height="6" fill="#F5F5DC" opacity="0.9" />
        <line x1="-4" y1="0" x2="2" y2="0" stroke="#333" strokeWidth="0.3" />
        <line x1="-4" y1="2" x2="2" y2="2" stroke="#333" strokeWidth="0.3" />
      </g>
    );
  }

  if (name.includes('chair') || name.includes('seat')) {
    // Belle Époque chair
    const upholsteryColor = rng.choice(['#800020', '#2A5A3F', '#4A3A6A']);
    return (
      <g>
        {/* Seat */}
        <ellipse cx="0" cy="0" rx="8" ry="6" fill={upholsteryColor} stroke="#4A3420" strokeWidth="0.5" />
        {/* Back */}
        <rect x="-6" y="-12" width="12" height="12" fill={upholsteryColor} stroke="#4A3420" strokeWidth="0.5" rx="2" />
        {/* Decorative pattern */}
        <circle cx="0" cy="-8" r="2" fill="#D4AF37" opacity="0.5" />
        {/* Legs */}
        <line x1="-6" y1="6" x2="-6" y2="12" stroke="#4A3420" strokeWidth="1.5" />
        <line x1="6" y1="6" x2="6" y2="12" stroke="#4A3420" strokeWidth="1.5" />
      </g>
    );
  }

  if (name.includes('table')) {
    // Elegant table
    return (
      <g>
        <ellipse cx="0" cy="0" rx="16" ry="12" fill="#8B6F47" stroke="#4A3420" strokeWidth="0.5" />
        <ellipse cx="0" cy="-1" rx="15" ry="11" fill="#A88860" opacity="0.6" />
        {/* Table legs */}
        <rect x="-12" y="10" width="3" height="10" fill="#6B4E2E" />
        <rect x="9" y="10" width="3" height="10" fill="#6B4E2E" />
        {/* Items on table */}
        {rng.next() > 0.5 && (
          <>
            <circle cx="-6" cy="-2" r="3" fill="#E8DCC8" opacity="0.8" />
            <circle cx="6" cy="0" r="2" fill="#D4AF37" opacity="0.6" />
          </>
        )}
      </g>
    );
  }

  // Generic furniture
  return (
    <rect x="-8" y="-8" width="16" height="16" fill="#8B6F47" stroke="#4A3420" strokeWidth="0.5" rx="2" />
  );
}

// Exhibits: machinery, artifacts, displays
function renderExhibit(feature: Feature, rng: SeededRandom) {
  const name = feature.name.toLowerCase();

  if (name.includes('machine') || name.includes('engine')) {
    // Industrial machinery
    return (
      <g>
        {/* Main body */}
        <rect x="-12" y="-10" width="24" height="20" fill="#586070" stroke="#2A2A2A" strokeWidth="1" />
        {/* Gears */}
        <circle cx="-6" cy="0" r="5" fill="#4A5060" stroke="#2A2A2A" strokeWidth="0.5" />
        <circle cx="6" cy="0" r="5" fill="#4A5060" stroke="#2A2A2A" strokeWidth="0.5" />
        {/* Gear teeth */}
        <circle cx="-6" cy="0" r="3" fill="#586070" />
        <circle cx="6" cy="0" r="3" fill="#586070" />
        {/* Rivets */}
        {[...Array(6)].map((_, i) => (
          <circle
            key={i}
            cx={-10 + i * 4}
            cy="-8"
            r="1"
            fill="#D4AF37"
          />
        ))}
        {/* Steam pipes */}
        <rect x="-2" y="-18" width="4" height="8" fill="#586070" stroke="#2A2A2A" strokeWidth="0.5" />
        <ellipse cx="0" cy="-18" rx="3" ry="2" fill="#A8C8E8" opacity="0.6">
          <animate attributeName="opacity" values="0.6;0.3;0.6" dur="2s" repeatCount="indefinite" />
        </ellipse>
      </g>
    );
  }

  if (name.includes('display') || name.includes('case')) {
    // Glass display case
    return (
      <g>
        {/* Case */}
        <rect x="-10" y="-12" width="20" height="24" fill="#A8C8E8" opacity="0.3" stroke="#586070" strokeWidth="1" />
        {/* Frame */}
        <rect x="-11" y="-13" width="22" height="26" fill="none" stroke="#D4AF37" strokeWidth="2" />
        {/* Pedestal */}
        <rect x="-8" y="12" width="16" height="4" fill="#8B6F47" />
        {/* Displayed item */}
        <ellipse cx="0" cy="0" rx="6" ry="8" fill={rng.choice(['#D4AF37', '#800020', '#2A5A3F'])} opacity="0.8" />
        {/* Plaque */}
        <rect x="-8" y="8" width="16" height="3" fill="#C8A870" stroke="#8B6F47" strokeWidth="0.5" />
      </g>
    );
  }

  // Generic exhibit
  return (
    <g>
      <rect x="-10" y="-10" width="20" height="20" fill="#586070" stroke="#2A2A2A" strokeWidth="1" />
      <circle cx="0" cy="0" r="6" fill="#D4AF37" opacity="0.5" />
    </g>
  );
}

// Decorations: paintings, sculptures, plants
function renderDecoration(feature: Feature, rng: SeededRandom) {
  const name = feature.name.toLowerCase();

  if (name.includes('painting') || name.includes('portrait')) {
    // Framed painting
    const hue = rng.nextInt(0, 360);
    return (
      <g>
        {/* Frame */}
        <rect x="-10" y="-14" width="20" height="28" fill="#D4AF37" stroke="#8B6F47" strokeWidth="2" />
        {/* Canvas */}
        <rect x="-8" y="-12" width="16" height="24" fill={`hsl(${hue}, 40%, 50%)`} />
        {/* Abstract brush strokes */}
        <rect x="-6" y="-8" width="12" height="6" fill={`hsl(${hue + 30}, 50%, 60%)`} opacity="0.7" />
        <ellipse cx="0" cy="2" rx="5" ry="6" fill={`hsl(${hue + 60}, 45%, 40%)`} opacity="0.6" />
        {/* Ornate corner details */}
        <circle cx="-8" cy="-12" r="1.5" fill="#D4AF37" />
        <circle cx="8" cy="-12" r="1.5" fill="#D4AF37" />
      </g>
    );
  }

  if (name.includes('sculpture') || name.includes('statue')) {
    // Classical sculpture
    return (
      <g>
        {/* Pedestal */}
        <rect x="-8" y="8" width="16" height="6" fill="#E8DCC8" stroke="#C8BCA8" strokeWidth="0.5" />
        {/* Base */}
        <rect x="-7" y="4" width="14" height="4" fill="#E8DCC8" />
        {/* Statue body */}
        <ellipse cx="0" cy="-4" rx="5" ry="10" fill="#F5F5DC" stroke="#D4C5B0" strokeWidth="0.5" />
        {/* Head */}
        <circle cx="0" cy="-12" r="4" fill="#F5F5DC" stroke="#D4C5B0" strokeWidth="0.5" />
        {/* Arms */}
        <ellipse cx="-6" cy="-2" rx="2" ry="6" fill="#F5F5DC" transform="rotate(-20 -6 -2)" />
        <ellipse cx="6" cy="-2" rx="2" ry="6" fill="#F5F5DC" transform="rotate(20 6 -2)" />
      </g>
    );
  }

  if (name.includes('plant') || name.includes('palm')) {
    // Potted plant
    return renderVegetation(feature, rng);
  }

  // Generic decoration
  return (
    <g>
      <circle cx="0" cy="0" r="8" fill={rng.choice(['#D4AF37', '#800020', '#2A5A3F'])} opacity="0.6" />
      <circle cx="0" cy="0" r="4" fill="#E8DCC8" opacity="0.8" />
    </g>
  );
}

// Vegetation: trees, plants, gardens
function renderVegetation(feature: Feature, rng: SeededRandom) {
  const name = feature.name.toLowerCase();

  if (name.includes('tree')) {
    // Belle Époque ornamental tree
    const treeHeight = 20 + rng.nextInt(0, 10);
    const leafColor = rng.choice(['#5A7A3C', '#4A6A2C', '#6A8A4C']);
    return (
      <g>
        {/* Trunk */}
        <rect x="-2" y="0" width="4" height={treeHeight} fill="#6B4E2E" stroke="#4A3420" strokeWidth="0.5" />
        {/* Branches */}
        <line x1="0" y1={treeHeight * 0.3} x2="-8" y2={treeHeight * 0.2} stroke="#6B4E2E" strokeWidth="1.5" />
        <line x1="0" y1={treeHeight * 0.5} x2="8" y2={treeHeight * 0.4} stroke="#6B4E2E" strokeWidth="1.5" />
        {/* Foliage - multiple organic circles */}
        <ellipse cx="0" cy={-5} rx="12" ry="10" fill={leafColor} opacity="0.8" />
        <ellipse cx="-8" cy={-2} rx="8" ry="7" fill={leafColor} opacity="0.7" />
        <ellipse cx="8" cy={-3} rx="8" ry="7" fill={leafColor} opacity="0.7" />
        <ellipse cx="0" cy={-10} rx="9" ry="8" fill={leafColor} opacity="0.9" />
        {/* Leaf details */}
        {[...Array(5)].map((_, i) => (
          <circle
            key={i}
            cx={rng.nextInt(-8, 8)}
            cy={rng.nextInt(-12, -2)}
            r={rng.nextInt(1, 3)}
            fill="#4A6A2C"
            opacity="0.6"
          />
        ))}
      </g>
    );
  }

  if (name.includes('palm')) {
    // Palm tree in pot (common in exposition)
    return (
      <g>
        {/* Pot */}
        <ellipse cx="0" cy="12" rx="8" ry="4" fill="#C8A870" stroke="#8B6F47" strokeWidth="0.5" />
        <rect x="-7" y="4" width="14" height="8" fill="#C8A870" stroke="#8B6F47" strokeWidth="0.5" />
        {/* Trunk */}
        <rect x="-2" y="-8" width="4" height="12" fill="#8B6F47" />
        {/* Fronds */}
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * 360;
          const rad = (angle * Math.PI) / 180;
          const length = 15;
          return (
            <line
              key={i}
              x1="0"
              y1="-8"
              x2={Math.cos(rad) * length}
              y2={-8 + Math.sin(rad) * length}
              stroke="#5A7A3C"
              strokeWidth="2"
              opacity="0.8"
            />
          );
        })}
        {/* Frond leaves */}
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * 360;
          const rad = (angle * Math.PI) / 180;
          const length = 15;
          return (
            <ellipse
              key={i}
              cx={Math.cos(rad) * length}
              cy={-8 + Math.sin(rad) * length}
              rx="8"
              ry="3"
              fill="#5A7A3C"
              opacity="0.7"
              transform={`rotate(${angle} ${Math.cos(rad) * length} ${-8 + Math.sin(rad) * length})`}
            />
          );
        })}
      </g>
    );
  }

  // Generic plant/bush
  const size = 6 + rng.nextInt(0, 6);
  return (
    <g>
      <ellipse cx="0" cy="2" rx={size} ry={size * 0.8} fill="#5A7A3C" opacity="0.8" />
      <ellipse cx="-3" cy="0" rx={size * 0.7} ry={size * 0.6} fill="#6A8A4C" opacity="0.7" />
      <ellipse cx="3" cy="1" rx={size * 0.7} ry={size * 0.6} fill="#4A6A2C" opacity="0.7" />
    </g>
  );
}

// Generic feature fallback
function renderGeneric(_feature: Feature, rng: SeededRandom) {
  const size = 8 + rng.nextInt(0, 6);
  const color = rng.choice(['#D4AF37', '#800020', '#586070', '#5A7A3C']);
  return (
    <g>
      <rect x={-size} y={-size} width={size * 2} height={size * 2} fill={color} opacity="0.6" rx="2" />
      <circle cx="0" cy="0" r={size * 0.5} fill="#E8DCC8" opacity="0.5" />
    </g>
  );
}

export default FeatureSprite;
