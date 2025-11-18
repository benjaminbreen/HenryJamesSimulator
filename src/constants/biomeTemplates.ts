import type { BiomeType, RoomTemplate } from '../types/procedural';

// Historically accurate biome templates for procedural generation

export interface BiomeTemplate {
  type: BiomeType;
  roomTemplates: RoomTemplate[];
  possibleFeatures: FeatureTemplate[];
  possibleNPCs: string[]; // NPC IDs that fit this biome
  atmosphereTexts: string[];
  historicalContext: string;
}

interface FeatureTemplate {
  name: string;
  ascii: string;
  description: string;
  probability: number; // 0-1
  type: 'furniture' | 'exhibit' | 'decoration' | 'interactive';
}

export const BIOME_TEMPLATES: Record<BiomeType, BiomeTemplate> = {
  'npc-quarters': {
    type: 'npc-quarters',
    roomTemplates: [
      {
        biome: 'npc-quarters',
        size: 'small',
        featureSlots: 5,
        npcSlots: 1,
        crowdDensity: 'empty',
        lighting: 'gaslight',
        atmosphere: [
          'The intimate space reveals much about its occupant.',
          'Personal effects scattered about speak to private life.',
          'The air carries hints of work and habitation.',
        ],
      },
      {
        biome: 'npc-quarters',
        size: 'medium',
        featureSlots: 7,
        npcSlots: 2,
        crowdDensity: 'sparse',
        lighting: 'natural',
        atmosphere: [
          'Windows overlook the Parisian rooftops.',
          'The studio space shows signs of creative labor.',
          'Organized chaos characterizes the working area.',
        ],
      },
    ],
    possibleFeatures: [
      {
        name: 'Writing Desk',
        ascii: '▓▓\n▓▓',
        description: 'A mahogany desk covered in papers and correspondence.',
        probability: 0.8,
        type: 'furniture',
      },
      {
        name: 'Easel',
        ascii: '/│\\',
        description: 'An artist\'s easel with a work in progress.',
        probability: 0.6,
        type: 'furniture',
      },
      {
        name: 'Bookshelf',
        ascii: '║▓║',
        description: 'Shelves sagging under the weight of volumes.',
        probability: 0.9,
        type: 'furniture',
      },
      {
        name: 'Typewriter',
        ascii: '▓░',
        description: 'A new Remington typewriter, modern marvel.',
        probability: 0.4,
        type: 'interactive',
      },
      {
        name: 'Phonograph',
        ascii: '♪◐',
        description: 'A small phonograph for private listening.',
        probability: 0.3,
        type: 'interactive',
      },
      {
        name: 'Workbench',
        ascii: '▓═▓',
        description: 'Tools and materials for creative work.',
        probability: 0.5,
        type: 'furniture',
      },
      {
        name: 'Chaise Longue',
        ascii: '╔══╗',
        description: 'An elegant couch for receiving visitors.',
        probability: 0.6,
        type: 'furniture',
      },
      {
        name: 'Portrait',
        ascii: '[▓]',
        description: 'A framed portrait on the wall.',
        probability: 0.7,
        type: 'decoration',
      },
    ],
    possibleNPCs: [
      'oscar-wilde',
      'rosa-bonheur',
      'berthe-morisot',
      'thomas-edison',
    ],
    atmosphereTexts: [
      'The private quarters reveal intimate details of creative life.',
      'Papers, books, and tools of the trade fill the space.',
      'A sense of purposeful solitude pervades the room.',
      'The occupant\'s personality is written in every detail.',
    ],
    historicalContext: 'Artists, writers, and intellectuals in 1889 Paris often worked from their apartments, which doubled as studios and salons.',
  },

  'indoor-salon': {
    type: 'indoor-salon',
    roomTemplates: [
      {
        biome: 'indoor-salon',
        size: 'medium',
        featureSlots: 8,
        npcSlots: 4,
        crowdDensity: 'moderate',
        lighting: 'gaslight',
        atmosphere: [
          'Smoke and conversation mingle in the warm air.',
          'The clink of glasses punctuates lively debate.',
          'Gaslight casts flickering shadows on animated faces.',
        ],
      },
      {
        biome: 'indoor-salon',
        size: 'large',
        featureSlots: 12,
        npcSlots: 6,
        crowdDensity: 'crowded',
        lighting: 'electric',
        atmosphere: [
          'The grand salon buzzes with intellectual energy.',
          'Every table hosts a different conversation, debate, or conspiracy.',
          'Waiters weave through the crowds with practiced grace.',
        ],
      },
    ],
    possibleFeatures: [
      {
        name: 'Small Table',
        ascii: '[▓]',
        description: 'A marble-topped table with wrought-iron chairs.',
        probability: 1.0,
        type: 'furniture',
      },
      {
        name: 'Bar Counter',
        ascii: '═══▓▓▓═══',
        description: 'Polished zinc counter with bottles arrayed behind.',
        probability: 0.9,
        type: 'furniture',
      },
      {
        name: 'Piano',
        ascii: '♪▓▓▓♪',
        description: 'An upright piano, occasionally played by patrons.',
        probability: 0.4,
        type: 'interactive',
      },
      {
        name: 'Fireplace',
        ascii: '╔▓▓╗',
        description: 'Marble fireplace providing warmth and ambiance.',
        probability: 0.6,
        type: 'decoration',
      },
      {
        name: 'Mirror',
        ascii: '[▓]',
        description: 'Ornate gilt mirror reflecting the scene.',
        probability: 0.8,
        type: 'decoration',
      },
      {
        name: 'Newspaper Rack',
        ascii: '║▓║',
        description: 'Le Figaro, Le Temps, and other dailies.',
        probability: 0.7,
        type: 'interactive',
      },
    ],
    possibleNPCs: [
      'oscar-wilde',
      'thomas-edison',
      'berthe-morisot',
      'rosa-bonheur',
      'gustave-eiffel',
    ],
    atmosphereTexts: [
      'The café hums with the energy of Belle Époque Paris.',
      'Every table tells a story; every conversation matters.',
      'Intellectuals, artists, and entrepreneurs mix freely.',
      'Reputations are made and destroyed over coffee and absinthe.',
    ],
    historicalContext: 'Parisian cafés and salons were crucial social spaces where artistic movements formed, political ideas circulated, and reputations were established.',
  },

  'exhibition-hall': {
    type: 'exhibition-hall',
    roomTemplates: [
      {
        biome: 'exhibition-hall',
        size: 'large',
        featureSlots: 10,
        npcSlots: 5,
        crowdDensity: 'crowded',
        lighting: 'electric',
        atmosphere: [
          'Machinery roars and clanks in symphonic discord.',
          'Electric lights reveal every detail with harsh clarity.',
          'The smell of oil and hot metal fills the air.',
        ],
      },
    ],
    possibleFeatures: [
      {
        name: 'Steam Engine',
        ascii: '╔═⚙═╗\n║▓▓▓║\n╚═══╝',
        description: 'A massive steam engine demonstrating industrial power.',
        probability: 0.7,
        type: 'exhibit',
      },
      {
        name: 'Dynamo',
        ascii: '⚡▓▓⚡',
        description: 'An electrical generator crackling with energy.',
        probability: 0.6,
        type: 'exhibit',
      },
      {
        name: 'Display Case',
        ascii: '[░░░]',
        description: 'Glass case containing smaller inventions.',
        probability: 0.9,
        type: 'exhibit',
      },
      {
        name: 'Hydraulic Press',
        ascii: '║▓║\n▓▓▓',
        description: 'A powerful press demonstrating crushing force.',
        probability: 0.4,
        type: 'exhibit',
      },
      {
        name: 'Telephone Booth',
        ascii: '[☎]',
        description: 'A demonstration of Bell\'s telephone system.',
        probability: 0.5,
        type: 'interactive',
      },
    ],
    possibleNPCs: [
      'thomas-edison',
      'gustave-eiffel',
    ],
    atmosphereTexts: [
      'Progress incarnate: the future rendered in steel and steam.',
      'Every machine a promise, every invention a revolution.',
      'The 19th century reaching toward the 20th.',
    ],
    historicalContext: 'The Gallery of Machines was the centerpiece of the 1889 fair, showcasing industrial might and technological optimism.',
  },

  'street': {
    type: 'street',
    roomTemplates: [
      {
        biome: 'street',
        size: 'medium',
        featureSlots: 6,
        npcSlots: 3,
        crowdDensity: 'moderate',
        lighting: 'natural',
        atmosphere: [
          'The cobblestones echo with footsteps and carriage wheels.',
          'Paris street life flows around you in constant motion.',
          'Shop windows display their wares to passing crowds.',
        ],
      },
    ],
    possibleFeatures: [
      {
        name: 'Gas Lamp',
        ascii: '╔♨╗',
        description: 'An ornate gas street lamp.',
        probability: 1.0,
        type: 'decoration',
      },
      {
        name: 'Vendor Cart',
        ascii: '▓⚐▓',
        description: 'A cart selling chestnuts or newspapers.',
        probability: 0.7,
        type: 'interactive',
      },
      {
        name: 'Storefront',
        ascii: '╔═══╗\n║   ║',
        description: 'A shop window displaying goods.',
        probability: 0.8,
        type: 'decoration',
      },
      {
        name: 'Bench',
        ascii: '═══',
        description: 'A public bench for resting.',
        probability: 0.5,
        type: 'furniture',
      },
    ],
    possibleNPCs: [
      'buffalo-bill',
    ],
    atmosphereTexts: [
      'Parisian street life in full bloom.',
      'The city pulses with energy and purpose.',
      'Every corner holds potential for encounter.',
    ],
    historicalContext: 'Haussmann\'s renovations had transformed Paris into a city of grand boulevards, but older neighborhoods retained their character.',
  },

  'outdoor-promenade': {
    type: 'outdoor-promenade',
    roomTemplates: [
      {
        biome: 'outdoor-promenade',
        size: 'large',
        featureSlots: 8,
        npcSlots: 6,
        crowdDensity: 'crowded',
        lighting: 'natural',
        atmosphere: [
          'The fair\'s spectacle unfolds in every direction.',
          'Crowds move like currents in a human river.',
          'The air carries music, voices, and the smell of food.',
        ],
      },
    ],
    possibleFeatures: [
      {
        name: 'Fountain',
        ascii: '╔♒╗\n║≈≈║\n╚══╝',
        description: 'An ornate fountain with cascading water.',
        probability: 0.8,
        type: 'decoration',
      },
      {
        name: 'Statue',
        ascii: ' ▓\n▓▓▓\n ▓ ',
        description: 'A commemorative statue or monument.',
        probability: 0.6,
        type: 'decoration',
      },
      {
        name: 'Photographer Stand',
        ascii: '📷',
        description: 'A photographer offering to take portraits.',
        probability: 0.4,
        type: 'interactive',
      },
      {
        name: 'Flower Seller',
        ascii: '🌸',
        description: 'A vendor selling fresh flowers.',
        probability: 0.5,
        type: 'interactive',
      },
    ],
    possibleNPCs: [
      'buffalo-bill',
      'oscar-wilde',
      'berthe-morisot',
    ],
    atmosphereTexts: [
      'The exposition in all its glory spreads before you.',
      'Nations compete in spectacle and splendor.',
      'The 19th century celebrating itself.',
    ],
    historicalContext: 'The exposition grounds covered vast areas, with elaborate landscaping and monumental architecture.',
  },

  'garden': {
    type: 'garden',
    roomTemplates: [
      {
        biome: 'garden',
        size: 'medium',
        featureSlots: 6,
        npcSlots: 2,
        crowdDensity: 'sparse',
        lighting: 'natural',
        atmosphere: [
          'A moment of tranquility amid the fair\'s chaos.',
          'Carefully cultivated nature provides respite.',
          'The sounds of the exposition fade to murmur.',
        ],
      },
    ],
    possibleFeatures: [
      {
        name: 'Flower Bed',
        ascii: '🌺🌺🌺',
        description: 'Meticulously arranged flowers in bloom.',
        probability: 0.9,
        type: 'decoration',
      },
      {
        name: 'Hedge',
        ascii: '▓▓▓',
        description: 'Sculpted hedges creating intimate spaces.',
        probability: 0.8,
        type: 'decoration',
      },
      {
        name: 'Garden Bench',
        ascii: '═══',
        description: 'A quiet bench for contemplation.',
        probability: 0.7,
        type: 'furniture',
      },
    ],
    possibleNPCs: [
      'berthe-morisot',
      'rosa-bonheur',
    ],
    atmosphereTexts: [
      'Nature tamed for aesthetic pleasure.',
      'A retreat from modern spectacle into cultivated calm.',
    ],
    historicalContext: 'French garden design was renowned for its formal elegance and careful planning.',
  },

  'marketplace': {
    type: 'marketplace',
    roomTemplates: [
      {
        biome: 'marketplace',
        size: 'medium',
        featureSlots: 10,
        npcSlots: 4,
        crowdDensity: 'crowded',
        lighting: 'natural',
        atmosphere: [
          'Vendors hawk their wares in multiple languages.',
          'The chaos of commerce and the press of bodies.',
          'Everything for sale, from souvenirs to secrets.',
        ],
      },
    ],
    possibleFeatures: [
      {
        name: 'Vendor Stall',
        ascii: '╔═╗\n║▓║',
        description: 'A stall selling exposition memorabilia.',
        probability: 1.0,
        type: 'interactive',
      },
      {
        name: 'Food Cart',
        ascii: '▓🍞▓',
        description: 'Fresh bread, cheese, or other provisions.',
        probability: 0.8,
        type: 'interactive',
      },
    ],
    possibleNPCs: [],
    atmosphereTexts: [
      'Commerce in its most direct form.',
      'Bargaining, buying, and the exchange of value.',
    ],
    historicalContext: 'Markets and vendors were ubiquitous at the exposition, selling everything from food to souvenirs.',
  },

  'backstage': {
    type: 'backstage',
    roomTemplates: [
      {
        biome: 'backstage',
        size: 'small',
        featureSlots: 4,
        npcSlots: 2,
        crowdDensity: 'empty',
        lighting: 'dim',
        atmosphere: [
          'The machinery of spectacle revealed.',
          'Props, costumes, and the smell of greasepaint.',
          'The private space behind public performance.',
        ],
      },
    ],
    possibleFeatures: [
      {
        name: 'Costume Rack',
        ascii: '║🎭║',
        description: 'Costumes hanging ready for performance.',
        probability: 0.9,
        type: 'furniture',
      },
      {
        name: 'Mirror',
        ascii: '[▓]',
        description: 'Dressing room mirror surrounded by lights.',
        probability: 0.8,
        type: 'furniture',
      },
    ],
    possibleNPCs: [
      'buffalo-bill',
    ],
    atmosphereTexts: [
      'Behind every spectacle, the unglamorous work.',
      'Illusion requires meticulous preparation.',
    ],
    historicalContext: 'Performance venues at the fair had elaborate backstage areas for performers and crew.',
  },
};

// Helper function to get appropriate biomes for connections
export function getCompatibleBiomes(biome: BiomeType): BiomeType[] {
  const connections: Record<BiomeType, BiomeType[]> = {
    'npc-quarters': ['street', 'indoor-salon', 'backstage'],
    'indoor-salon': ['street', 'outdoor-promenade', 'npc-quarters'],
    'exhibition-hall': ['outdoor-promenade', 'marketplace'],
    'street': ['outdoor-promenade', 'indoor-salon', 'marketplace', 'npc-quarters'],
    'outdoor-promenade': ['street', 'garden', 'exhibition-hall', 'indoor-salon'],
    'garden': ['outdoor-promenade', 'indoor-salon'],
    'marketplace': ['street', 'outdoor-promenade', 'exhibition-hall'],
    'backstage': ['npc-quarters', 'outdoor-promenade'],
  };

  return connections[biome] || [];
}
