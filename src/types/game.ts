// Core game types and interfaces

export type GameScreen =
  | 'title'
  | 'game'
  | 'settings'
  | 'about'
  | 'faq'
  | 'load-game'
  | 'game-over';

export type GameView =
  | 'main'
  | 'inventory'
  | 'journal'
  | 'map'
  | 'combat'
  | 'dialogue'
  | 'event'
  | 'cutscene'
  | 'book-reader';

export type LocationId =
  | 'esplanade'
  | 'eiffel-tower'
  | 'eiffel-top'
  | 'gallery-machines'
  | 'trocadero'
  | 'champ-de-mars'
  | 'seine-promenade'
  | 'exposition-palace'
  | 'cafe-parisien'
  | 'colonial-pavilion'
  | 'fine-arts-palace';

export type NPCId = string; // e.g., 'edison', 'wilde', 'eiffel', etc.

export type ItemType = 'book' | 'document' | 'artifact' | 'clothing' | 'tool' | 'consumable';

export type StatId = 'wit' | 'erudition' | 'charm' | 'perception' | 'stamina';

export type EventType = 'procedural' | 'scripted' | 'llm-triggered';

export type CombatMoveType = 'literary-allusion' | 'gossip' | 'innuendo' | 'jibe' | 'rumor' | 'riposte';

export type GameOverReason =
  | 'exhaustion'
  | 'social-ruin'
  | 'enlightenment'
  | 'scandal'
  | 'transcendence'
  | 'diplomatic-incident';

// Player character
export interface Player {
  name: string;
  title: string; // e.g., "The American Novelist"
  level: number;
  xp: number;
  xpToNextLevel: number;
  stats: Record<StatId, number>;
  maxStats: Record<StatId, number>;
  location: LocationId;
  inventory: Item[];
  gold: number; // francs
  reputation: number; // -100 to 100
  relationships: Record<NPCId, number>; // -100 to 100
  journalEntries: JournalEntry[];
  achievements: Achievement[];
  visitedLocations: Set<LocationId>;
  defeatedNPCs: Set<NPCId>;
}

// Location/Zone
export interface Location {
  id: LocationId;
  name: string;
  description: string;
  asciiArt: string;
  npcs: NPCId[];
  connections: LocationId[];
  ambientText: string[];
  discoveryXP: number;
  exhibits?: Exhibit[]; // For Gallery of Machines and museums
  isLocked?: boolean;
  unlockCondition?: string;
}

// NPC
export interface NPC {
  id: NPCId;
  name: string;
  title: string;
  description: string;
  portrait: string; // ASCII art
  location: LocationId;
  personality: string;
  historicalContext: string;
  dialoguePrompt: string; // Sophisticated prompt for LLM
  combatStats: {
    wit: number;
    erudition: number;
    charm: number;
    moves: CombatMove[];
  };
  questGiver?: boolean;
  defeated?: boolean;
  metPlayer?: boolean;
}

// Item
export interface Item {
  id: string;
  name: string;
  type: ItemType;
  description: string;
  value: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  effect?: ItemEffect;
  readable?: boolean;
  content?: string; // For books and documents
  historicalContext?: string;
  stackable?: boolean;
  quantity?: number;
}

export interface ItemEffect {
  stat?: StatId;
  modifier: number;
  duration?: number; // turns, -1 for permanent
}

// Combat
export interface CombatMove {
  id: string;
  name: string;
  type: CombatMoveType;
  description: string;
  witDamage: number;
  charmDamage: number;
  eruditionRequirement: number;
  witCost: number;
  quote?: string; // Literary quote or historical reference
}

export interface CombatState {
  active: boolean;
  opponent: NPC;
  playerHealth: number;
  opponentHealth: number;
  turn: 'player' | 'opponent';
  log: string[];
  availableMoves: CombatMove[];
}

// Event
export interface GameEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  choices: EventChoice[];
  location?: LocationId;
  requiredLevel?: number;
  oneTime?: boolean;
  triggered?: boolean;
}

export interface EventChoice {
  text: string;
  outcome: EventOutcome;
  requirements?: {
    stat?: StatId;
    minValue?: number;
    item?: string;
    reputation?: number;
  };
}

export interface EventOutcome {
  description: string;
  effects: {
    xp?: number;
    gold?: number;
    reputation?: number;
    stats?: Partial<Record<StatId, number>>;
    items?: string[];
    relationship?: { npc: NPCId; change: number };
  };
}

// Journal
export interface JournalEntry {
  id: string;
  timestamp: number;
  type: 'observation' | 'encounter' | 'event' | 'combat' | 'discovery';
  title: string;
  content: string;
  location: LocationId;
  primarySource?: PrimarySource;
}

// Primary Sources
export interface PrimarySource {
  id: string;
  author: string;
  title: string;
  date: string;
  excerpt: string;
  context: string;
  relevance: string;
}

// Game Log
export interface LogEntry {
  id: string;
  timestamp: number;
  type: 'info' | 'success' | 'warning' | 'combat' | 'dialogue' | 'system';
  message: string;
  icon?: string;
}

// Achievement
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  hidden?: boolean;
}

// Exhibit (for Gallery of Machines)
export interface Exhibit {
  id: string;
  name: string;
  creator: string;
  country: string;
  description: string;
  historicalSignificance: string;
  category: 'machinery' | 'electricity' | 'transportation' | 'manufacturing' | 'science';
  interactionText?: string;
}

// Save Game
export interface SaveGame {
  version: string;
  timestamp: number;
  player: Player;
  gameLog: LogEntry[];
  currentLocation: LocationId;
  gameState: {
    turnCount: number;
    daysPassed: number;
    completedEvents: string[];
    unlockedLocations: LocationId[];
  };
}

// Game Settings
export interface GameSettings {
  theme: 'light' | 'dark';
  textSpeed: number;
  showHistoricalContext: boolean;
  autoSave: boolean;
  difficulty: 'tourist' | 'expatriate' | 'savant';
  accessibilityMode: boolean;
  enableFactCheck: boolean;
  enableAnimations: boolean;
  fontSize: 'small' | 'medium' | 'large';
  colorblindMode: boolean;
}

// Assessment
export interface GameAssessment {
  score: number;
  grade: 'F' | 'D' | 'C' | 'B' | 'A' | 'S';
  summary: string; // LLM-generated pithy, sarcastic summary
  categories: {
    exploration: number;
    combat: number;
    social: number;
    historical: number;
    literary: number;
  };
  highlights: string[];
  lowlights: string[];
  funnyMoment?: string;
}

// Fact Check
export interface FactCheck {
  id: string;
  claim: string;
  verdict: 'accurate' | 'mostly-accurate' | 'mixed' | 'inaccurate' | 'speculative';
  explanation: string;
  sources: string[];
  wikipediaLinks?: string[];
}
