import type { WorldGraph, WorldNode, GenerationConfig, BiomeType } from '../types/procedural';
import type { AgenticNPC } from '../types/npc';
import { SeededRandom, createGameSeed } from '../utils/seededRandom';
import { LOCATIONS } from '../constants/locations';
import { BIOME_TEMPLATES, getCompatibleBiomes } from '../constants/biomeTemplates';
import { generateRoom } from './roomGenerator';
import { NPCGenerator } from './npcGenerator';

// Define which existing locations are anchors (hand-crafted, always present)
const ANCHOR_LOCATIONS = [
  'esplanade',        // Starting point
  'eiffel-tower',     // Major landmark
  'eiffel-top',       // Goal location
  'gallery-machines', // Centerpiece
  'cafe-parisien',    // Social hub
  'exposition-palace',// Major exhibition
  'trocadero',        // Landmark
];

// Map anchor locations to biomes
const LOCATION_TO_BIOME: Record<string, BiomeType> = {
  'esplanade': 'outdoor-promenade',
  'eiffel-tower': 'outdoor-promenade',
  'eiffel-top': 'outdoor-promenade',
  'gallery-machines': 'exhibition-hall',
  'cafe-parisien': 'indoor-salon',
  'exposition-palace': 'exhibition-hall',
  'trocadero': 'outdoor-promenade',
  'champ-de-mars': 'outdoor-promenade',
  'seine-promenade': 'outdoor-promenade',
  'fine-arts-palace': 'exhibition-hall',
  'colonial-pavilion': 'exhibition-hall',
};

export class WorldGenerator {
  private rng: SeededRandom;
  private seed: string;
  private npcGenerator: NPCGenerator;
  private generatedNPCs: Map<string, AgenticNPC>;

  constructor(seed?: string) {
    this.seed = seed || createGameSeed();
    this.rng = new SeededRandom(this.seed);
    this.npcGenerator = new NPCGenerator(this.seed + '-npcs');
    this.generatedNPCs = new Map();
  }

  generateWorld(config: GenerationConfig): WorldGraph {
    const nodes = new Map<string, WorldNode>();

    // Step 1: Create anchor nodes from hand-crafted locations
    const anchorNodes = this.createAnchorNodes();
    anchorNodes.forEach(node => nodes.set(node.id, node));

    // Step 2: Generate procedural nodes between anchors
    const generatedNodes = this.generateProceduralNodes(
      anchorNodes,
      config
    );
    generatedNodes.forEach(node => nodes.set(node.id, node));

    // Step 3: Connect nodes intelligently
    this.connectNodes(nodes, config.branchingFactor);

    // Step 4: Position nodes for map display
    this.positionNodes(nodes);

    // Step 5: Populate nodes with NPCs, items, events
    this.populateNodes(nodes, config);

    // Step 6: Auto-discover adjacent nodes from starting position
    this.discoverAdjacentNodes(nodes, 'esplanade');

    return {
      nodes,
      startNodeId: 'esplanade',
      anchorNodes: anchorNodes.map(n => n.id),
      seed: this.seed,
      generatedAt: Date.now(),
      agenticNPCs: Array.from(this.generatedNPCs.keys()),
    };
  }

  private discoverAdjacentNodes(nodes: Map<string, WorldNode>, startNodeId: string): void {
    const startNode = nodes.get(startNodeId);
    if (!startNode) return;

    // Discover all nodes directly connected to starting position
    startNode.connections.forEach(connId => {
      const connectedNode = nodes.get(connId);
      if (connectedNode && !connectedNode.discovered) {
        connectedNode.discovered = true;
      }
    });
  }

  getGeneratedNPCs(): Map<string, AgenticNPC> {
    return this.generatedNPCs;
  }

  private createAnchorNodes(): WorldNode[] {
    return ANCHOR_LOCATIONS.map((locationId) => {
      const location = LOCATIONS[locationId];
      if (!location) {
        throw new Error(`Anchor location ${locationId} not found`);
      }

      const isStartLocation = locationId === 'esplanade';

      return {
        id: locationId,
        type: 'anchor',
        biome: LOCATION_TO_BIOME[locationId] || 'outdoor-promenade',
        name: location.name,
        description: location.description,
        asciiArt: location.asciiArt,
        connections: [], // Will be filled in connectNodes
        discovered: isStartLocation, // Start location is discovered
        visited: isStartLocation, // Start location is also visited immediately
        position: { x: 0, y: 0 }, // Will be positioned later
        depth: 0,
        features: [],
        npcs: location.npcs || [],
        items: [],
        events: [],
      };
    });
  }

  private generateProceduralNodes(
    // @ts-expect-error - anchors used for structure but not directly accessed
    anchors: WorldNode[],
    config: GenerationConfig
  ): WorldNode[] {
    const generated: WorldNode[] = [];
    const biomeTypes: BiomeType[] = [
      'npc-quarters',
      'street',
      'garden',
      'marketplace',
      'backstage',
      'indoor-salon',
    ];

    // Generate nodes to place between // anchors
    const nodesToGenerate = Math.floor(config.depth * 1.5); // 50% more than anchors

    for (let i = 0; i < nodesToGenerate; i++) {
      const biome = this.rng.choice(biomeTypes);
      const template = this.rng.choice(BIOME_TEMPLATES[biome].roomTemplates);
      const room = generateRoom(biome, template, this.seed + `-node-${i}`);

      const node: WorldNode = {
        id: `gen-${i}`,
        type: 'generated',
        biome,
        name: this.generateRoomName(biome),
        description: room.description,
        asciiArt: room.ascii,
        connections: [],
        discovered: false,
        visited: false,
        position: { x: 0, y: 0 },
        depth: 0,
        features: room.features,
        npcs: [],
        items: [],
        events: [],
        seed: this.seed + `-node-${i}`,
        template,
      };

      generated.push(node);
    }

    return generated;
  }

  private generateRoomName(biome: BiomeType): string {
    const names: Record<BiomeType, string[]> = {
      'npc-quarters': [
        "Artist's Garret",
        "Writer's Study",
        "Inventor's Workshop",
        "Private Studio",
        "Scholar's Chamber",
      ],
      'street': [
        'Rue de Rivoli',
        'Boulevard Haussmann',
        'Narrow Alley',
        'Cobbled Lane',
        'Market Street',
      ],
      'garden': [
        'Hidden Garden',
        'Sculpture Garden',
        'Rose Garden',
        'Ornamental Grove',
      ],
      'marketplace': [
        'Vendor Row',
        'Souvenir Market',
        'Book Stalls',
        'Food Market',
      ],
      'backstage': [
        'Performers Entrance',
        'Stage Door',
        'Dressing Rooms',
        'Props Storage',
      ],
      'indoor-salon': [
        'Intimate Café',
        'Literary Salon',
        'Private Dining Room',
        'Wine Cellar',
      ],
      'exhibition-hall': [
        'Side Gallery',
        'Demonstration Hall',
        'National Pavilion',
      ],
      'outdoor-promenade': [
        'Garden Promenade',
        'Terrace Walk',
      ],
    };

    const nameList = names[biome] || ['Unknown Room'];
    const baseName = this.rng.choice(nameList);

    // Sometimes add a qualifier for variety
    if (this.rng.nextBool(0.3)) {
      const qualifiers = ['Hidden', 'Quiet', 'Grand', 'Modest', 'Elegant', 'Cramped'];
      return `${this.rng.choice(qualifiers)} ${baseName}`;
    }

    return baseName;
  }

  private connectNodes(nodes: Map<string, WorldNode>, branchingFactor: number): void {
    const nodeArray = Array.from(nodes.values());
    const anchors = nodeArray.filter(n => n.type === 'anchor');
    const generated = nodeArray.filter(n => n.type === 'generated');

    // First, connect anchors in a main path
    for (let i = 0; i < anchors.length - 1; i++) {
      const current = anchors[i];
      const next = anchors[i + 1];

      // Direct connection
      current.connections.push(next.id);
      next.connections.push(current.id);

      // Add 1-2 generated nodes between each anchor pair
      const nodesToAdd = this.rng.nextInt(1, 2);
      const availableNodes = generated.filter(n => n.connections.length < branchingFactor);

      if (availableNodes.length > 0) {
        const selectedNodes = this.rng.sample(availableNodes, Math.min(nodesToAdd, availableNodes.length));

        selectedNodes.forEach((genNode, idx) => {
          if (idx === 0) {
            // Connect to current anchor
            current.connections.push(genNode.id);
            genNode.connections.push(current.id);
          }
          if (idx === selectedNodes.length - 1) {
            // Connect to next anchor
            genNode.connections.push(next.id);
            next.connections.push(genNode.id);
          }
          if (idx > 0) {
            // Connect to previous generated node
            genNode.connections.push(selectedNodes[idx - 1].id);
            selectedNodes[idx - 1].connections.push(genNode.id);
          }
        });
      }
    }

    // Add branches: connect remaining generated nodes
    const unconnected = generated.filter(n => n.connections.length === 0);

    unconnected.forEach(node => {
      // Find compatible biome nodes nearby
      const compatibleBiomes = getCompatibleBiomes(node.biome);
      const potentialConnections = nodeArray.filter(n =>
        n.id !== node.id &&
        n.connections.length < branchingFactor &&
        compatibleBiomes.includes(n.biome)
      );

      if (potentialConnections.length > 0) {
        // Connect to 1-2 compatible nodes
        const connectionsToMake = this.rng.nextInt(1, Math.min(2, potentialConnections.length));
        const selected = this.rng.sample(potentialConnections, connectionsToMake);

        selected.forEach(target => {
          node.connections.push(target.id);
          target.connections.push(node.id);
        });
      }
    });

    // Ensure all nodes are reachable from start
    this.ensureConnectivity(nodes, 'esplanade');
  }

  private ensureConnectivity(nodes: Map<string, WorldNode>, startId: string): void {
    const visited = new Set<string>();
    const queue: string[] = [startId];

    // BFS to find all reachable nodes
    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (visited.has(currentId)) continue;

      visited.add(currentId);
      const current = nodes.get(currentId);
      if (!current) continue;

      current.connections.forEach(connId => {
        if (!visited.has(connId)) {
          queue.push(connId);
        }
      });
    }

    // Connect any unreachable nodes to nearest reachable node
    const unreachable = Array.from(nodes.values()).filter(n => !visited.has(n.id));

    unreachable.forEach(node => {
      const reachable = Array.from(visited).map(id => nodes.get(id)!);
      if (reachable.length > 0) {
        const nearest = this.rng.choice(reachable);
        node.connections.push(nearest.id);
        nearest.connections.push(node.id);
      }
    });
  }

  private positionNodes(nodes: Map<string, WorldNode>): void {
    // Simple force-directed positioning for map display
    const nodeArray = Array.from(nodes.values());

    // Start with anchors in rough positions
    const anchors = nodeArray.filter(n => n.type === 'anchor');
    anchors.forEach((node, i) => {
      const angle = (i / anchors.length) * Math.PI * 2;
      const radius = 5;
      node.position = {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      };
    });

    // Position generated nodes between their connections
    const generated = nodeArray.filter(n => n.type === 'generated');
    generated.forEach(node => {
      if (node.connections.length === 0) {
        node.position = { x: this.rng.nextFloat(-3, 3), y: this.rng.nextFloat(-3, 3) };
        return;
      }

      // Average position of connected nodes
      let sumX = 0, sumY = 0;
      node.connections.forEach(connId => {
        const connected = nodes.get(connId);
        if (connected && connected.position) {
          sumX += connected.position.x;
          sumY += connected.position.y;
        }
      });

      node.position = {
        x: sumX / node.connections.length + this.rng.nextFloat(-1, 1),
        y: sumY / node.connections.length + this.rng.nextFloat(-1, 1),
      };
    });
  }

  private populateNodes(nodes: Map<string, WorldNode>, config: GenerationConfig): void {
    nodes.forEach(node => {
      // Anchor nodes keep their hand-crafted historical figure NPCs (Oscar Wilde, Edison, etc.)
      // But we can add a few procedural NPCs as "extras" in anchor nodes too
      if (node.type === 'anchor') {
        // Add 0-2 procedural NPCs to anchor nodes
        if (this.rng.nextBool(0.6)) {
          const npcCount = this.rng.nextInt(0, 2);
          for (let i = 0; i < npcCount; i++) {
            const npc = this.npcGenerator.generateNPC({
              biome: node.biome,
              nodeId: node.id,
            });
            this.generatedNPCs.set(npc.id, npc);
            node.npcs.push(npc.id);
          }
        }

        // Maybe add some items
        if (this.rng.nextBool(config.itemDensity)) {
          node.items.push('random-item-' + this.rng.nextInt(1, 100));
        }
        return;
      }

      // Generated nodes: spawn procedural NPCs based on biome and template
      if (node.template && this.rng.nextBool(config.npcSpawnChance)) {
        const npcCount = this.rng.nextInt(1, node.template.npcSlots + 1);

        for (let i = 0; i < npcCount; i++) {
          const npc = this.npcGenerator.generateNPC({
            biome: node.biome,
            nodeId: node.id,
          });
          this.generatedNPCs.set(npc.id, npc);
          node.npcs.push(npc.id);
        }
      }

      // Spawn items
      const itemCount = Math.floor(config.itemDensity * 3);
      for (let i = 0; i < itemCount; i++) {
        if (this.rng.nextBool(config.itemDensity)) {
          node.items.push('random-item-' + this.rng.nextInt(1, 100));
        }
      }

      // Add potential events
      if (this.rng.nextBool(config.eventFrequency)) {
        node.events.push('random-event-' + this.rng.nextInt(1, 50));
      }
    });
  }
}

// Helper function to regenerate world
export function generateWorld(config?: Partial<GenerationConfig>): { world: WorldGraph; npcs: Map<string, AgenticNPC> } {
  const defaultConfig: GenerationConfig = {
    seed: undefined, // Will auto-generate
    depth: 10,
    branchingFactor: 3,
    npcSpawnChance: 0.7,
    itemDensity: 0.6,
    eventFrequency: 0.5,
  };

  const finalConfig = { ...defaultConfig, ...config };
  const generator = new WorldGenerator(finalConfig.seed);
  const world = generator.generateWorld(finalConfig);
  const npcs = generator.getGeneratedNPCs();

  return { world, npcs };
}
