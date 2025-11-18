import { useState, useEffect } from 'react';
import { SeededRandom } from '../../utils/seededRandom';

type Direction = 'north' | 'south' | 'east' | 'west';
type Gender = 'male' | 'female' | 'nonbinary';

interface NPCSpriteProps {
  npcId: string;
  name: string;
  profession: string;
  gender: Gender;
  x: number;
  y: number;
  direction: Direction;
  isWalking: boolean;
  seed: string;
  onClick?: () => void;
}

/**
 * Animated Belle Époque NPC sprite with directional views
 * Procedurally generates appearance based on profession and seed
 */
export const NPCSprite = ({
  npcId,
  name,
  profession,
  gender,
  x,
  y,
  direction,
  isWalking,
  seed,
  onClick,
}: NPCSpriteProps) => {
  const [walkFrame, setWalkFrame] = useState(0);
  const rng = new SeededRandom(seed + npcId);

  // Walking animation
  useEffect(() => {
    if (!isWalking) {
      setWalkFrame(0);
      return;
    }

    const interval = setInterval(() => {
      setWalkFrame((f) => (f + 1) % 4);
    }, 200);

    return () => clearInterval(interval);
  }, [isWalking]);

  // Procedural appearance traits
  const hairColor = rng.choice(['#2C1810', '#4A3020', '#6B4E2E', '#8B6F47', '#C8A870', '#E8DCC8']);
  const skinTone = rng.choice(['#F5D5C5', '#E8C5B5', '#D4B5A5', '#C8A890', '#A88860']);
  const clothingColor = rng.choice(['#800020', '#2A5A3F', '#4A3A6A', '#2A4A6A', '#6A4A2A']);
  const accentColor = rng.choice(['#D4AF37', '#C8A870', '#9CAF88', '#A8C8E8']);

  // Profession-specific details
  const hasHat = profession.includes('Gentleman') || profession.includes('Inspector') || profession.includes('Aristocrat');
  const hasCane = profession.includes('Gentleman') || profession.includes('Aristocrat');
  const hasApron = profession.includes('Merchant') || profession.includes('Baker') || profession.includes('Vendor');
  const hasBriefcase = profession.includes('Clerk') || profession.includes('Inspector') || profession.includes('Merchant');

  return (
    <g
      transform={`translate(${x}, ${y})`}
      className="npc-sprite cursor-pointer transition-transform hover:scale-110"
      onClick={onClick}
    >
      {/* Shadow */}
      <ellipse cx="0" cy="18" rx="8" ry="3" fill="#000" opacity="0.3" />

      {/* Main sprite body */}
      {direction === 'south' && renderFront(walkFrame, gender, skinTone, hairColor, clothingColor, accentColor, hasHat, hasCane, hasApron, hasBriefcase)}
      {direction === 'north' && renderBack(walkFrame, hairColor, clothingColor, hasHat, hasBriefcase)}
      {direction === 'east' && renderSide(walkFrame, 'right', gender, skinTone, hairColor, clothingColor, accentColor, hasHat, hasCane, hasApron, hasBriefcase)}
      {direction === 'west' && renderSide(walkFrame, 'left', gender, skinTone, hairColor, clothingColor, accentColor, hasHat, hasCane, hasApron, hasBriefcase)}

      {/* Name label on hover */}
      <g className="opacity-0 hover:opacity-100 transition-opacity">
        <rect x="-30" y="-35" width="60" height="16" fill="#2A2A2A" opacity="0.9" rx="4" />
        <text x="0" y="-24" textAnchor="middle" fontSize="8" fill="#D4AF37" fontWeight="bold">
          {name}
        </text>
        <text x="0" y="-24" dy="10" textAnchor="middle" fontSize="6" fill="#E8DCC8">
          {profession}
        </text>
      </g>

      {/* Speech bubble when clicked */}
      <title>{`${name} - ${profession}`}</title>
    </g>
  );
};

// Front-facing view (south)
function renderFront(
  frame: number,
  gender: Gender,
  skinTone: string,
  hairColor: string,
  clothingColor: string,
  accentColor: string,
  hasHat: boolean,
  hasCane: boolean,
  hasApron: boolean,
  hasBriefcase: boolean
) {
  const legOffset = frame % 2 === 0 ? 0 : 2;
  const armSwing = Math.sin(frame * Math.PI * 0.5) * 2;

  return (
    <g>
      {/* Legs (walking animation) */}
      <rect x="-3" y="6" width="3" height="10" fill={clothingColor} transform={`translate(0, ${legOffset})`} />
      <rect x="0" y="6" width="3" height="10" fill={clothingColor} transform={`translate(0, ${-legOffset})`} />

      {/* Shoes */}
      <ellipse cx="-1.5" cy="16" rx="2" ry="1.5" fill="#2C1810" transform={`translate(0, ${legOffset})`} />
      <ellipse cx="1.5" cy="16" rx="2" ry="1.5" fill="#2C1810" transform={`translate(0, ${-legOffset})`} />

      {/* Body/Dress */}
      {gender === 'female' ? (
        // Dress silhouette
        <g>
          <ellipse cx="0" cy="4" rx="6" ry="8" fill={clothingColor} />
          <path d="M -6,8 Q -8,14 -10,16 L 10,16 Q 8,14 6,8 Z" fill={clothingColor} />
        </g>
      ) : (
        // Coat/Jacket
        <rect x="-5" y="-2" width="10" height="10" fill={clothingColor} rx="1" />
      )}

      {/* Vest/Bodice */}
      <rect x="-4" y="0" width="8" height="6" fill={accentColor} opacity="0.8" />

      {/* Arms (swing animation) */}
      <rect x="-7" y="0" width="2" height="8" fill={skinTone} transform={`rotate(${armSwing} -6 0)`} />
      <rect x="5" y="0" width="2" height="8" fill={skinTone} transform={`rotate(${-armSwing} 6 0)`} />

      {/* Cane */}
      {hasCane && (
        <line x1="7" y1="8" x2="7" y2="16" stroke="#6B4E2E" strokeWidth="1" transform={`rotate(${-armSwing} 6 0)`} />
      )}

      {/* Briefcase */}
      {hasBriefcase && (
        <rect x="6" y="10" width="4" height="5" fill="#6B4E2E" stroke="#4A3420" strokeWidth="0.5" />
      )}

      {/* Apron */}
      {hasApron && (
        <path d="M -5,2 L -5,12 L 5,12 L 5,2" fill="#F5F5DC" opacity="0.8" />
      )}

      {/* Neck */}
      <rect x="-2" y="-6" width="4" height="4" fill={skinTone} />

      {/* Head */}
      <ellipse cx="0" cy="-9" rx="4.5" ry="5" fill={skinTone} />

      {/* Hair */}
      {renderHair(gender, hairColor)}

      {/* Face details */}
      <circle cx="-1.5" cy="-10" r="0.5" fill="#2C1810" />
      <circle cx="1.5" cy="-10" r="0.5" fill="#2C1810" />
      <line x1="-1" y1="-8" x2="1" y2="-8" stroke="#2C1810" strokeWidth="0.5" />

      {/* Hat */}
      {hasHat && (
        <g>
          <ellipse cx="0" cy="-13" rx="5" ry="2" fill="#2C1810" />
          <ellipse cx="0" cy="-15" rx="3.5" ry="3" fill="#2C1810" />
        </g>
      )}
    </g>
  );
}

// Back-facing view (north)
function renderBack(frame: number, hairColor: string, clothingColor: string, hasHat: boolean, hasBriefcase: boolean) {
  const legOffset = frame % 2 === 0 ? 0 : 2;

  return (
    <g>
      {/* Legs */}
      <rect x="-3" y="6" width="3" height="10" fill={clothingColor} transform={`translate(0, ${legOffset})`} />
      <rect x="0" y="6" width="3" height="10" fill={clothingColor} transform={`translate(0, ${-legOffset})`} />

      {/* Body */}
      <rect x="-5" y="-2" width="10" height="10" fill={clothingColor} rx="1" />

      {/* Jacket details */}
      <line x1="0" y1="-2" x2="0" y2="8" stroke="#2A2A2A" strokeWidth="1" />

      {/* Arms */}
      <rect x="-7" y="0" width="2" height="8" fill={clothingColor} />
      <rect x="5" y="0" width="2" height="8" fill={clothingColor} />

      {/* Briefcase */}
      {hasBriefcase && (
        <rect x="6" y="10" width="4" height="5" fill="#6B4E2E" stroke="#4A3420" strokeWidth="0.5" />
      )}

      {/* Neck */}
      <rect x="-2" y="-6" width="4" height="4" fill={clothingColor} />

      {/* Head */}
      <ellipse cx="0" cy="-9" rx="4.5" ry="5" fill={clothingColor} />

      {/* Hair back */}
      <ellipse cx="0" cy="-11" rx="5" ry="4" fill={hairColor} />

      {/* Hat */}
      {hasHat && (
        <g>
          <ellipse cx="0" cy="-13" rx="5" ry="2" fill="#2C1810" />
          <ellipse cx="0" cy="-15" rx="3.5" ry="3" fill="#2C1810" />
        </g>
      )}
    </g>
  );
}

// Side view (east/west)
function renderSide(
  frame: number,
  side: 'left' | 'right',
  gender: Gender,
  skinTone: string,
  hairColor: string,
  clothingColor: string,
  accentColor: string,
  hasHat: boolean,
  hasCane: boolean,
  hasApron: boolean,
  hasBriefcase: boolean
) {
  const legOffset = frame % 2 === 0 ? 0 : 3;
  const flip = side === 'left' ? -1 : 1;

  return (
    <g transform={`scale(${flip}, 1)`}>
      {/* Back leg */}
      <rect x="-2" y="6" width="3" height="10" fill={clothingColor} transform={`translate(${-legOffset}, 0)`} />

      {/* Front leg */}
      <rect x="-2" y="6" width="3" height="10" fill={clothingColor} transform={`translate(${legOffset}, 0)`} />

      {/* Shoes */}
      <ellipse cx="-0.5" cy="16" rx="3" ry="1.5" fill="#2C1810" transform={`translate(${-legOffset}, 0)`} />
      <ellipse cx="-0.5" cy="16" rx="3" ry="1.5" fill="#2C1810" transform={`translate(${legOffset}, 0)`} />

      {/* Body */}
      {gender === 'female' ? (
        <ellipse cx="0" cy="4" rx="5" ry="8" fill={clothingColor} />
      ) : (
        <rect x="-4" y="-2" width="8" height="10" fill={clothingColor} rx="1" />
      )}

      {/* Vest */}
      <rect x="-3" y="0" width="6" height="6" fill={accentColor} opacity="0.8" />

      {/* Back arm */}
      <rect x="-5" y="2" width="2" height="7" fill={skinTone} transform={`rotate(${-legOffset * 3} -4 2)`} />

      {/* Front arm */}
      <rect x="3" y="2" width="2" height="7" fill={skinTone} transform={`rotate(${legOffset * 3} 4 2)`} />

      {/* Cane */}
      {hasCane && (
        <line x1="5" y1="9" x2="5" y2="16" stroke="#6B4E2E" strokeWidth="1" />
      )}

      {/* Briefcase */}
      {hasBriefcase && (
        <rect x="4" y="10" width="4" height="5" fill="#6B4E2E" stroke="#4A3420" strokeWidth="0.5" />
      )}

      {/* Apron */}
      {hasApron && (
        <rect x="-3" y="2" width="6" height="10" fill="#F5F5DC" opacity="0.8" />
      )}

      {/* Head */}
      <ellipse cx="0" cy="-9" rx="4" ry="5" fill={skinTone} />

      {/* Hair side */}
      <ellipse cx="-1" cy="-11" rx="4" ry="4" fill={hairColor} />

      {/* Face profile */}
      <circle cx="3" cy="-10" r="0.5" fill="#2C1810" />
      <path d="M 3,-8 Q 4,-7 3,-6" stroke="#2C1810" strokeWidth="0.5" fill="none" />

      {/* Nose */}
      <line x1="4" y1="-9" x2="5" y2="-8.5" stroke={skinTone} strokeWidth="1" />

      {/* Hat side view */}
      {hasHat && (
        <g>
          <ellipse cx="0" cy="-13" rx="5" ry="2" fill="#2C1810" />
          <ellipse cx="0" cy="-15" rx="4" ry="3" fill="#2C1810" />
        </g>
      )}
    </g>
  );
}

// Hair styles based on gender
function renderHair(gender: Gender, hairColor: string) {
  if (gender === 'female') {
    // Updo hairstyle common in Belle Époque
    return (
      <g>
        <ellipse cx="0" cy="-12" rx="5" ry="3" fill={hairColor} />
        <ellipse cx="0" cy="-14" rx="4" ry="3" fill={hairColor} />
        <path d="M -4,-11 Q -5,-13 -4,-15" stroke={hairColor} strokeWidth="2" fill="none" />
        <path d="M 4,-11 Q 5,-13 4,-15" stroke={hairColor} strokeWidth="2" fill="none" />
      </g>
    );
  } else {
    // Short hair or slicked back
    return (
      <g>
        <ellipse cx="0" cy="-12" rx="5" ry="4" fill={hairColor} />
        <rect x="-4" y="-14" width="8" height="3" fill={hairColor} />
      </g>
    );
  }
}

export default NPCSprite;
