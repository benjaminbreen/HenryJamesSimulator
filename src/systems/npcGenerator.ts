import type { AgenticNPC, NPCGenerationConfig, Gender, Goal, DailySchedule } from '../types/npc';
import { SeededRandom } from '../utils/seededRandom';

// Historical professions appropriate to 1889 Paris World's Fair
const PROFESSIONS = {
  'exhibition-hall': [
    'Exhibition Curator',
    'Scientific Demonstrator',
    'Industrial Engineer',
    'Patent Clerk',
    'Exhibition Guide',
    'Technical Illustrator',
  ],
  'indoor-salon': [
    'Literary Critic',
    'Art Dealer',
    'Salon Hostess',
    'Portrait Painter',
    'Music Teacher',
    'Theater Director',
  ],
  'outdoor-promenade': [
    'Street Musician',
    'Flower Seller',
    'Sketch Artist',
    'Tour Guide',
    'Balloon Vendor',
    'Newspaper Hawker',
  ],
  'npc-quarters': [
    'Hotel Concierge',
    'Personal Secretary',
    'Ladies\' Maid',
    'Valet',
    'Cook',
    'Housekeeper',
  ],
  'street': [
    'Cab Driver',
    'Policeman',
    'Lamplighter',
    'Street Sweeper',
    'Postal Carrier',
    'Delivery Boy',
  ],
  'garden': [
    'Gardener',
    'Botanist',
    'Park Keeper',
    'Landscape Architect',
    'Bird Keeper',
  ],
  'marketplace': [
    'Wine Merchant',
    'Cheese Monger',
    'Baker',
    'Butcher',
    'Fabric Merchant',
    'Antique Dealer',
  ],
  'backstage': [
    'Stage Manager',
    'Costume Designer',
    'Set Builder',
    'Lighting Technician',
    'Props Master',
  ],
};

// Period-appropriate French names
const FIRST_NAMES = {
  male: [
    'Henri', 'Pierre', 'Louis', 'Jacques', 'Georges', 'Jules', 'Émile', 'Marcel',
    'André', 'Jean', 'Paul', 'François', 'Léon', 'Charles', 'Victor', 'Gustave',
    'Théodore', 'Auguste', 'Lucien', 'Édouard',
  ],
  female: [
    'Marie', 'Louise', 'Jeanne', 'Marguerite', 'Suzanne', 'Élise', 'Hélène', 'Juliette',
    'Amélie', 'Claire', 'Cécile', 'Gabrielle', 'Mathilde', 'Pauline', 'Sophie', 'Camille',
    'Delphine', 'Léonie', 'Eugénie', 'Rosalie',
  ],
  nonbinary: ['Claude', 'Dominique', 'René', 'Camille', 'André'],
};

const SURNAMES = [
  'Dubois', 'Moreau', 'Laurent', 'Simon', 'Bernard', 'Petit', 'Rousseau', 'Lefebvre',
  'Martin', 'Mercier', 'Durand', 'Fontaine', 'Chevalier', 'Blanchard', 'Girard', 'Fournier',
  'Dupont', 'Lambert', 'Bonnet', 'Vincent', 'Lemaire', 'Garnier', 'Faure', 'Perrin',
  'Morel', 'Leroy', 'Dumas', 'Marchand', 'Leclerc', 'Bertrand',
];

export class NPCGenerator {
  private rng: SeededRandom;

  constructor(seed: string) {
    this.rng = new SeededRandom(seed);
  }

  generateNPC(config: NPCGenerationConfig): AgenticNPC {
    const gender = this.rng.choice(['male', 'female', 'nonbinary'] as Gender[]);
    const firstName = this.rng.choice(FIRST_NAMES[gender]);
    const surname = this.rng.choice(SURNAMES);
    const name = `${firstName} ${surname}`;

    const profession = config.profession || this.selectProfession(config.biome);
    const age = this.rng.nextInt(18, 65);

    const npc: AgenticNPC = {
      id: `npc-${config.nodeId}-${this.rng.nextInt(0, 10000)}`,
      name,
      profession,
      gender,
      age,
      seed: this.rng.next().toString(),

      traits: {
        sociability: this.rng.next(),
        curiosity: this.rng.next(),
        ambition: this.rng.next(),
        caution: this.rng.next(),
        creativity: this.rng.next(),
      },

      position: {
        nodeId: config.nodeId,
        x: this.rng.nextInt(50, 150),
        y: this.rng.nextInt(50, 150),
      },
      direction: this.rng.choice(['north', 'south', 'east', 'west'] as const),
      isMoving: false,
      movementSpeed: 20 + this.rng.nextInt(0, 20),
      path: [],

      currentGoal: null,
      goals: this.generateInitialGoals(profession, config.biome),

      schedule: this.generateDailySchedule(profession),

      history: [{
        timestamp: Date.now(),
        type: 'moved',
        description: `Arrived at ${config.nodeId}`,
        nodeId: config.nodeId,
      }],
      conversationHistory: [],

      backstory: this.generateBackstory(name, profession, age, gender, config.biome),
      relationships: {},

      currentActivity: this.determineActivityFromProfession(profession),
      mood: this.rng.choice(['happy', 'neutral', 'excited'] as const),
      energy: this.rng.nextInt(60, 100),

      recentThoughts: this.generateInitialThoughts(profession, config.biome),
      knownFacts: this.generateKnownFacts(profession, config.biome),
    };

    // Select initial goal
    if (npc.goals.length > 0) {
      npc.currentGoal = npc.goals[0];
    }

    return npc;
  }

  private selectProfession(biome: string): string {
    const professions = PROFESSIONS[biome as keyof typeof PROFESSIONS] || PROFESSIONS['exhibition-hall'];
    return this.rng.choice(professions);
  }

  private generateBackstory(name: string, profession: string, age: number, gender: Gender, _biome: string): string {
    const pronouns = gender === 'male' ? ['he', 'his', 'him'] : gender === 'female' ? ['she', 'her', 'her'] : ['they', 'their', 'them'];

    const origins = [
      `${name} was born in Paris to a family of modest means`,
      `${name} came to Paris from the provinces seeking opportunity`,
      `${name} is a native Parisian, born in the Marais district`,
      `${name} arrived in Paris from Lyon five years ago`,
      `${name} grew up in the shadow of Montmartre`,
    ];

    const education = [
      `${pronouns[0]} learned ${pronouns[1]} trade through apprenticeship`,
      `${pronouns[0]} studied at a technical school`,
      `${pronouns[0]} is largely self-taught, driven by curiosity`,
      `${pronouns[0]} received formal training at a prestigious institution`,
    ];

    const motivation = [
      `${pronouns[0]} dreams of making a name for ${pronouns[2]}self at the Exposition`,
      `${pronouns[0]} hopes to make useful connections among the international visitors`,
      `${pronouns[0]} is fascinated by the modern innovations on display`,
      `${pronouns[0]} sees the fair as a chance to advance ${pronouns[1]} career`,
    ];

    return `${this.rng.choice(origins)}. ${this.rng.choice(education)}. Now ${age} years old and working as a ${profession}, ${this.rng.choice(motivation)}.`;
  }

  private generateInitialGoals(profession: string, _biome: string): Goal[] {
    const goals: Goal[] = [];

    // Professional goals
    if (profession.includes('Merchant') || profession.includes('Seller')) {
      goals.push({
        id: 'sell-goods',
        type: 'perform',
        description: 'Sell goods to visitors',
        priority: 8,
        completed: false,
      });
    }

    if (profession.includes('Guide') || profession.includes('Demonstrator')) {
      goals.push({
        id: 'educate-visitors',
        type: 'perform',
        description: 'Educate visitors about exhibits',
        priority: 7,
        completed: false,
      });
    }

    // Social goals
    goals.push({
      id: 'meet-people',
      type: 'meet',
      description: 'Meet interesting people at the fair',
      priority: this.rng.nextInt(4, 7),
      completed: false,
    });

    // Exploration goals
    goals.push({
      id: 'visit-exhibits',
      type: 'visit',
      description: 'Visit notable exhibitions',
      priority: this.rng.nextInt(3, 6),
      completed: false,
    });

    return goals.sort((a, b) => b.priority - a.priority);
  }

  private generateDailySchedule(_profession: string): DailySchedule[] {
    const schedule: DailySchedule[] = [];

    // Morning (8-12)
    schedule.push({
      hour: 8,
      activity: 'working',
      location: 'workplace',
      description: 'Begin daily duties',
    });

    // Midday (12-14)
    schedule.push({
      hour: 12,
      activity: 'eating',
      location: 'café or vendor',
      description: 'Lunch break',
    });

    // Afternoon (14-18)
    schedule.push({
      hour: 14,
      activity: 'working',
      location: 'workplace',
      description: 'Continue duties',
    });

    // Evening (18-20)
    if (this.rng.next() > 0.5) {
      schedule.push({
        hour: 18,
        activity: 'socializing',
        location: 'salon or café',
        description: 'Evening social activities',
      });
    } else {
      schedule.push({
        hour: 18,
        activity: 'walking',
        location: 'promenade',
        description: 'Evening stroll',
      });
    }

    // Night (20-22)
    schedule.push({
      hour: 20,
      activity: 'resting',
      location: 'quarters',
      description: 'Retire for the evening',
    });

    return schedule;
  }

  private determineActivityFromProfession(profession: string): 'working' | 'socializing' | 'observing' | 'walking' {
    if (profession.includes('Merchant') || profession.includes('Seller') || profession.includes('Clerk')) {
      return 'working';
    }
    if (profession.includes('Musician') || profession.includes('Artist')) {
      return 'working'; // Performing is work for artists
    }
    if (profession.includes('Guide') || profession.includes('Curator')) {
      return 'observing';
    }
    return this.rng.choice(['working', 'socializing', 'walking', 'observing'] as const);
  }

  private generateInitialThoughts(profession: string, _biome: string): string[] {
    const thoughts = [
      'What a magnificent spectacle this Exposition is!',
      'I wonder what new innovations I will see today.',
      'The crowds are larger than yesterday.',
      'This weather is perfect for the fair.',
    ];

    if (profession.includes('Merchant')) {
      thoughts.push('I hope to make good sales today.');
      thoughts.push('My wares are of the finest quality.');
    }

    if (profession.includes('Artist') || profession.includes('Musician')) {
      thoughts.push('Perhaps today I will find inspiration.');
      thoughts.push('The creative energy here is palpable.');
    }

    return this.rng.shuffle(thoughts).slice(0, 3);
  }

  private generateKnownFacts(profession: string, _biome: string): string[] {
    const facts = [
      'The Eiffel Tower is the tallest structure at the fair',
      'Over 28 million visitors are expected this year',
      'The Gallery of Machines showcases industrial innovation',
      'Buffalo Bill\'s Wild West Show is very popular',
    ];

    if (profession.includes('Engineer') || profession.includes('Demonstrator')) {
      facts.push('Edison\'s phonograph is revolutionary technology');
      facts.push('Electric lighting has transformed the modern city');
    }

    if (profession.includes('Artist') || profession.includes('Critic')) {
      facts.push('The Impressionists are finally gaining recognition');
      facts.push('The fine arts pavilion displays works from around the world');
    }

    return this.rng.shuffle(facts).slice(0, 4);
  }
}

export default NPCGenerator;
