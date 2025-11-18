export type Direction = 'north' | 'south' | 'east' | 'west';
export type Gender = 'male' | 'female' | 'nonbinary';
export type ActivityType =
  | 'working'
  | 'socializing'
  | 'observing'
  | 'eating'
  | 'walking'
  | 'resting'
  | 'shopping'
  | 'performing'
  | 'studying';

export interface Position {
  nodeId: string;
  x: number;
  y: number;
}

export interface Goal {
  id: string;
  type: 'visit' | 'meet' | 'acquire' | 'observe' | 'perform';
  description: string;
  targetNodeId?: string;
  targetNpcId?: string;
  targetItem?: string;
  priority: number;
  completed: boolean;
  deadline?: number; // timestamp
}

export interface DailySchedule {
  hour: number;
  activity: ActivityType;
  location: string;
  description: string;
}

export interface HistoryEvent {
  timestamp: number;
  type: 'moved' | 'interacted' | 'completed' | 'observed';
  description: string;
  nodeId?: string;
  npcId?: string;
}

export interface AgenticNPC {
  id: string;
  name: string;
  profession: string;
  gender: Gender;
  age: number;

  // Appearance
  seed: string;

  // Personality traits (0-1 scale)
  traits: {
    sociability: number;
    curiosity: number;
    ambition: number;
    caution: number;
    creativity: number;
  };

  // Position and movement
  position: Position;
  direction: Direction;
  isMoving: boolean;
  movementSpeed: number; // tiles per second
  path: Position[]; // Current pathfinding route

  // Goals and motivation
  currentGoal: Goal | null;
  goals: Goal[];

  // Daily schedule
  schedule: DailySchedule[];

  // History
  history: HistoryEvent[];
  conversationHistory: Array<{
    with: string;
    timestamp: number;
    summary: string;
  }>;

  // Backstory
  backstory: string;
  relationships: Record<string, number>; // NPC ID -> relationship score (-1 to 1)

  // Current state
  currentActivity: ActivityType;
  mood: 'happy' | 'neutral' | 'sad' | 'excited' | 'anxious' | 'tired';
  energy: number; // 0-100

  // Dialogue context for LLM
  recentThoughts: string[];
  knownFacts: string[]; // Things this NPC knows about the world
}

export interface NPCGenerationConfig {
  biome: string;
  nodeId: string;
  profession?: string;
  historicalFigure?: boolean;
}
