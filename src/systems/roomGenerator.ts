import type { ProceduralRoom, RoomLayout, Feature, BiomeType, RoomTemplate, Zone } from '../types/procedural';
import { SeededRandom } from '../utils/seededRandom';
import { BIOME_TEMPLATES } from '../constants/biomeTemplates';

export function generateRoom(
  biome: BiomeType,
  template: RoomTemplate,
  seed: string
): ProceduralRoom {
  const rng = new SeededRandom(seed);
  const biomeTemplate = BIOME_TEMPLATES[biome];

  // Generate layout
  const layout = generateLayout(template, rng);

  // Place features
  const features = placeFeatures(
    layout,
    biomeTemplate.possibleFeatures,
    template.featureSlots,
    rng
  );

  // Generate ASCII art
  const ascii = renderASCII(layout, features, template, rng);

  // Generate description
  const description = generateDescription(biomeTemplate, features, template, rng);

  return {
    layout,
    features,
    npcs: [], // Will be populated by world generator
    items: [], // Will be populated by world generator
    ascii,
    description,
  };
}

function generateLayout(template: RoomTemplate, rng: SeededRandom): RoomLayout {
  // Determine dimensions based on size
  const dimensions = {
    small: { width: 25, height: 15 },
    medium: { width: 35, height: 20 },
    large: { width: 50, height: 30 },
  };

  const { width, height } = dimensions[template.size];

  // Create empty grid
  const tiles: ('wall' | 'floor' | 'door' | 'empty')[][] = Array(height)
    .fill(null)
    .map(() => Array(width).fill('floor'));

  // Add walls around perimeter
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
        tiles[y][x] = 'wall';
      }
    }
  }

  // Add entrances (doors)
  const entrances: RoomLayout['entrances'] = [];
  const entranceCount = rng.nextInt(1, 3);

  for (let i = 0; i < entranceCount; i++) {
    const side = rng.choice(['north', 'south', 'east', 'west'] as const);
    let x, y;

    switch (side) {
      case 'north':
        x = rng.nextInt(2, width - 3);
        y = 0;
        break;
      case 'south':
        x = rng.nextInt(2, width - 3);
        y = height - 1;
        break;
      case 'east':
        x = width - 1;
        y = rng.nextInt(2, height - 3);
        break;
      case 'west':
        x = 0;
        y = rng.nextInt(2, height - 3);
        break;
    }

    tiles[y][x] = 'door';
    entrances.push({ x, y, direction: side });
  }

  // Create functional zones
  const zones = createZones(width, height, template, rng);

  // Sometimes add interior walls for complex layouts
  if (template.size === 'large' && rng.nextBool(0.5)) {
    addInteriorWalls(tiles, rng);
  }

  return {
    width,
    height,
    tiles,
    entrances,
    zones,
  };
}

function createZones(
  width: number,
  height: number,
  template: RoomTemplate,
  _rng: SeededRandom
): Zone[] {
  const zones: Zone[] = [];

  // Entrance zone
  zones.push({
    type: 'entrance',
    bounds: { x: 1, y: 1, width: 8, height: 6 },
    features: [],
  });

  // Main social/display zone (center)
  zones.push({
    type: template.biome === 'exhibition-hall' ? 'display' : 'social',
    bounds: {
      x: Math.floor(width * 0.2),
      y: Math.floor(height * 0.2),
      width: Math.floor(width * 0.6),
      height: Math.floor(height * 0.6),
    },
    features: [],
  });

  // Additional zones based on size
  if (template.size === 'large') {
    zones.push({
      type: 'seating',
      bounds: {
        x: Math.floor(width * 0.7),
        y: Math.floor(height * 0.1),
        width: Math.floor(width * 0.25),
        height: Math.floor(height * 0.3),
      },
      features: [],
    });
  }

  return zones;
}

function addInteriorWalls(tiles: any[][], rng: SeededRandom): void {
  // Occasionally add a dividing wall
  if (rng.nextBool(0.6)) {
    const isVertical = rng.nextBool();
    const length = isVertical ? tiles.length : tiles[0].length;
    const position = rng.nextInt(
      Math.floor(length * 0.3),
      Math.floor(length * 0.7)
    );

    // Add wall with a gap (doorway)
    const gapStart = rng.nextInt(
      Math.floor(length * 0.4),
      Math.floor(length * 0.6)
    );
    const gapSize = 3;

    if (isVertical) {
      for (let y = 1; y < tiles.length - 1; y++) {
        if (y < gapStart || y > gapStart + gapSize) {
          tiles[y][position] = 'wall';
        }
      }
    } else {
      for (let x = 1; x < tiles[0].length - 1; x++) {
        if (x < gapStart || x > gapStart + gapSize) {
          tiles[position][x] = 'wall';
        }
      }
    }
  }
}

function placeFeatures(
  layout: RoomLayout,
  possibleFeatures: any[],
  slotCount: number,
  rng: SeededRandom
): Feature[] {
  const features: Feature[] = [];

  // Filter features by probability
  const availableFeatures = possibleFeatures.filter(f =>
    rng.nextBool(f.probability)
  );

  // Select features to place
  const selectedCount = Math.min(slotCount, availableFeatures.length);
  const selected = rng.sample(availableFeatures, selectedCount);

  // Place each feature in a zone
  selected.forEach((featureTemplate, index) => {
    const zone = layout.zones[index % layout.zones.length];

    // Find valid position within zone bounds
    const position = {
      x: zone.bounds.x + rng.nextInt(1, Math.max(1, zone.bounds.width - 3)),
      y: zone.bounds.y + rng.nextInt(1, Math.max(1, zone.bounds.height - 2)),
    };

    const feature: Feature = {
      id: `feature-${index}`,
      type: featureTemplate.type,
      name: featureTemplate.name,
      description: featureTemplate.description,
      ascii: featureTemplate.ascii,
      position,
    };

    features.push(feature);
    zone.features.push(feature.id);
  });

  return features;
}

function renderASCII(
  layout: RoomLayout,
  features: Feature[],
  template: RoomTemplate,
  rng: SeededRandom
): string {
  const { width, height, tiles } = layout;
  const canvas: string[][] = Array(height)
    .fill(null)
    .map(() => Array(width).fill(' '));

  // Draw walls and floor
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const tile = tiles[y][x];

      switch (tile) {
        case 'wall':
          // Corner detection for better ASCII art
          if (y === 0 && x === 0) canvas[y][x] = '╔';
          else if (y === 0 && x === width - 1) canvas[y][x] = '╗';
          else if (y === height - 1 && x === 0) canvas[y][x] = '╚';
          else if (y === height - 1 && x === width - 1) canvas[y][x] = '╝';
          else if (y === 0 || y === height - 1) canvas[y][x] = '═';
          else canvas[y][x] = '║';
          break;

        case 'door':
          canvas[y][x] = '▓';
          break;

        case 'floor':
          // Vary floor tiles for texture
          canvas[y][x] = rng.nextBool(0.1) ? '░' : ' ';
          break;
      }
    }
  }

  // Place features
  features.forEach(feature => {
    if (feature.position) {
      const { x, y } = feature.position;
      const asciiLines = feature.ascii.split('\n');

      asciiLines.forEach((line, dy) => {
        if (y + dy < height) {
          for (let dx = 0; dx < line.length && x + dx < width; dx++) {
            if (line[dx] !== ' ') {
              canvas[y + dy][x + dx] = line[dx];
            }
          }
        }
      });
    }
  });

  // Add lighting effects based on template
  if (template.lighting === 'electric') {
    // Add electrical symbols in corners
    if (canvas.length > 2) {
      canvas[2][2] = '⚡';
      canvas[2][width - 3] = '⚡';
    }
  } else if (template.lighting === 'gaslight') {
    // Add gas lamp symbols
    if (canvas.length > 2) {
      canvas[2][Math.floor(width / 2)] = '♨';
    }
  }

  // Add crowd indicators based on density
  if (template.crowdDensity === 'crowded' || template.crowdDensity === 'moderate') {
    const crowdCount = template.crowdDensity === 'crowded' ? 8 : 4;

    for (let i = 0; i < crowdCount; i++) {
      const x = rng.nextInt(3, width - 4);
      const y = rng.nextInt(3, height - 4);

      if (canvas[y][x] === ' ' || canvas[y][x] === '░') {
        canvas[y][x] = '👤';
      }
    }
  }

  // Convert to string with ornate border
  const lines = canvas.map(row => row.join(''));
  return lines.join('\n');
}

function generateDescription(
  _biomeTemplate: any,
  features: Feature[],
  template: RoomTemplate,
  rng: SeededRandom
): string {
  // Select atmospheric text
  const atmosphere = rng.choice(template.atmosphere);

  // Mention prominent features
  const featureNames = features
    .slice(0, 3)
    .map(f => f.name.toLowerCase())
    .join(', ');

  // Build description
  let description = atmosphere;

  if (features.length > 0) {
    description += ` You notice ${featureNames}`;
    if (features.length > 3) {
      description += `, and ${features.length - 3} other features`;
    }
    description += '.';
  }

  // Add lighting description
  const lightingDesc = {
    dark: ' The space is poorly lit.',
    dim: ' Shadows gather in the corners.',
    gaslight: ' Gaslight casts a warm, flickering glow.',
    natural: ' Natural light streams through windows.',
    electric: ' Electric lights illuminate every detail with harsh clarity.',
  };

  description += lightingDesc[template.lighting];

  return description;
}
