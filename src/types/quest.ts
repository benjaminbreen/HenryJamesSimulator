// Quest and objective system types

export type QuestStatus = 'available' | 'active' | 'completed' | 'failed';

export type QuestType = 'main' | 'side' | 'discovery' | 'social' | 'combat';

export interface QuestObjective {
  id: string;
  description: string;
  completed: boolean;
  optional: boolean;
  // Objective types
  type: 'visit' | 'talk' | 'combat' | 'collect' | 'explore';
  targetId?: string; // Node ID, NPC ID, or item ID
  targetCount?: number;
  currentCount?: number;
}

export interface QuestReward {
  xp?: number;
  gold?: number;
  items?: string[];
  unlockNodes?: string[];
  reputation?: number;
  achievement?: string;
}

export interface Quest {
  id: string;
  type: QuestType;
  title: string;
  description: string;
  objectives: QuestObjective[];
  status: QuestStatus;
  rewards: QuestReward;
  level: number; // Minimum player level
  prerequisiteQuests?: string[];
  historicalContext?: string;
  completedAt?: number;
}

// Default main quest
export const MAIN_QUEST: Quest = {
  id: 'ascend-tower',
  type: 'main',
  title: 'Ascend the Eiffel Tower',
  description: 'Gustav Eiffel himself has invited you to climb his controversial tower. Navigate the Exposition Universelle and reach the summit to witness the marvel of the age.',
  objectives: [
    {
      id: 'visit-eiffel-base',
      description: 'Visit the Eiffel Tower',
      completed: false,
      optional: false,
      type: 'visit',
      targetId: 'eiffel-tower',
    },
    {
      id: 'visit-eiffel-top',
      description: 'Reach the summit of the Eiffel Tower',
      completed: false,
      optional: false,
      type: 'visit',
      targetId: 'eiffel-top',
    },
  ],
  status: 'active',
  rewards: {
    xp: 500,
    gold: 1000,
    reputation: 50,
    achievement: 'summit-reached',
  },
  level: 1,
  historicalContext: 'The Eiffel Tower was the tallest structure in the world in 1889, reaching 300 meters (984 feet). It was built as the entrance arch to the 1889 World\'s Fair.',
};

// Side quests
export const STARTER_QUESTS: Quest[] = [
  {
    id: 'meet-wilde',
    type: 'social',
    title: 'The Wit of Oscar Wilde',
    description: 'The famous Irish poet Oscar Wilde is visiting the Exposition. Seek him out and engage in conversation.',
    objectives: [
      {
        id: 'find-wilde',
        description: 'Locate Oscar Wilde',
        completed: false,
        optional: false,
        type: 'talk',
        targetId: 'wilde',
      },
    ],
    status: 'available',
    rewards: {
      xp: 100,
      gold: 200,
      reputation: 10,
    },
    level: 1,
    historicalContext: 'Oscar Wilde visited the 1889 Paris Exposition and was fascinated by the modern age while remaining critical of industrialization.',
  },
  {
    id: 'explore-machines',
    type: 'discovery',
    title: 'Marvels of the Machine Age',
    description: 'Visit the Gallery of Machines and witness the industrial revolution in full display.',
    objectives: [
      {
        id: 'visit-gallery',
        description: 'Visit the Gallery of Machines',
        completed: false,
        optional: false,
        type: 'visit',
        targetId: 'gallery-machines',
      },
      {
        id: 'explore-exhibits',
        description: 'Examine the exhibits',
        completed: false,
        optional: false,
        type: 'explore',
        currentCount: 0,
        targetCount: 3,
      },
    ],
    status: 'available',
    rewards: {
      xp: 150,
      gold: 100,
    },
    level: 1,
    historicalContext: 'The Gallery of Machines (Galerie des Machines) was a marvel of engineering, spanning 420 meters and showcasing the industrial power of nations.',
  },
  {
    id: 'cafe-society',
    type: 'social',
    title: 'Café Society',
    description: 'Experience the vibrant social scene at the Café Parisien, a gathering place for artists and intellectuals.',
    objectives: [
      {
        id: 'visit-cafe',
        description: 'Visit the Café Parisien',
        completed: false,
        optional: false,
        type: 'visit',
        targetId: 'cafe-parisien',
      },
      {
        id: 'talk-to-npcs',
        description: 'Converse with patrons',
        completed: false,
        optional: false,
        type: 'talk',
        currentCount: 0,
        targetCount: 2,
      },
    ],
    status: 'available',
    rewards: {
      xp: 100,
      gold: 50,
      reputation: 5,
    },
    level: 1,
  },
];
