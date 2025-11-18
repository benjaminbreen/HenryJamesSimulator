// Procedural generation types for hybrid roguelike system

export type NodeType = 'anchor' | 'generated';

export type BiomeType =
  | 'exhibition-hall'
  | 'outdoor-promenade'
  | 'indoor-salon'
  | 'npc-quarters'
  | 'street'
  | 'garden'
  | 'marketplace'
  | 'backstage';

export interface WorldNode {
  id: string;
  type: NodeType;
  biome: BiomeType;
  name: string;
  description: string;
  asciiArt: string;
  connections: string[]; // IDs of connected nodes
  discovered: boolean;
  visited: boolean;
  position: { x: number; y: number }; // For map display
  depth: number; // Distance from start

  // Procedural content
  features: Feature[];
  npcs: string[]; // NPC IDs that can spawn here
  items: string[]; // Item IDs that can spawn here
  events: string[]; // Event IDs that can trigger here

  // Generation parameters (for generated nodes)
  seed?: string;
  template?: RoomTemplate;
}

export interface Feature {
  id: string;
  type: 'furniture' | 'exhibit' | 'decoration' | 'interactive';
  name: string;
  description: string;
  ascii: string;
  position?: { x: number; y: number };
  interaction?: FeatureInteraction;
}

export interface FeatureInteraction {
  type: 'examine' | 'use' | 'talk' | 'take';
  description: string;
  effect?: {
    xp?: number;
    gold?: number;
    item?: string;
    event?: string;
  };
}

export interface RoomTemplate {
  biome: BiomeType;
  size: 'small' | 'medium' | 'large';
  featureSlots: number; // How many features to place
  npcSlots: number; // How many NPCs can spawn
  crowdDensity: 'empty' | 'sparse' | 'moderate' | 'crowded';
  lighting: 'dark' | 'dim' | 'gaslight' | 'natural' | 'electric';
  atmosphere: string[]; // Possible ambient descriptions
}

export interface WorldGraph {
  nodes: Map<string, WorldNode>;
  startNodeId: string;
  anchorNodes: string[]; // IDs of hand-crafted nodes
  seed: string;
  generatedAt: number;
}

export interface GenerationConfig {
  seed?: string;
  depth: number; // How many nodes to generate
  branchingFactor: number; // Average connections per node
  npcSpawnChance: number; // 0-1 probability
  itemDensity: number; // Average items per room
  eventFrequency: number; // How often events can trigger
}

export interface NPCSpawn {
  npcId: string;
  nodeId: string;
  spawnChance: number; // 0-1, based on historical likelihood
  requirements?: {
    timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
    playerLevel?: number;
    visitedNodes?: string[];
  };
}

export interface ProceduralRoom {
  layout: RoomLayout;
  features: Feature[];
  npcs: string[];
  items: string[];
  ascii: string;
  description: string;
}

export interface RoomLayout {
  width: number;
  height: number;
  tiles: TileType[][];
  entrances: { x: number; y: number; direction: 'north' | 'south' | 'east' | 'west' }[];
  zones: Zone[]; // Functional areas within the room
}

export type TileType =
  | 'wall'
  | 'floor'
  | 'door'
  | 'window'
  | 'furniture'
  | 'feature'
  | 'empty';

export interface Zone {
  type: 'entrance' | 'seating' | 'display' | 'work' | 'storage' | 'social';
  bounds: { x: number; y: number; width: number; height: number };
  features: string[]; // IDs of features in this zone
}
