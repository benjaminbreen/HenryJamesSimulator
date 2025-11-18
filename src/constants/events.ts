import type { GameEvent } from '../types/game';

// Scripted events that can be triggered throughout the game
export const SCRIPTED_EVENTS: GameEvent[] = [
  {
    id: 'first-glimpse-tower',
    type: 'scripted',
    title: 'First Glimpse of the Tower',
    description: 'The Eiffel Tower rises before you for the first time, 300 meters of iron lattice work catching the afternoon light. Your first thought is...',
    location: 'esplanade',
    requiredLevel: 0,
    oneTime: true,
    choices: [
      {
        text: '"A triumph of engineering - magnificent in its mathematical precision."',
        outcome: {
          description: 'You appreciate the tower\'s structural achievement. The engineer in you responds to its bold geometry.',
          effects: {
            xp: 10,
            stats: { perception: 1 },
          },
        },
      },
      {
        text: '"An eyesore - the artists were right to protest this industrial monstrosity."',
        outcome: {
          description: 'Your aesthetic sensibilities rebel against the tower\'s stark modernity. Perhaps there is wisdom in tradition.',
          effects: {
            xp: 10,
            stats: { wit: 1 },
          },
        },
      },
      {
        text: '"Both magnificent and monstrous - progress always carries such ambiguity."',
        outcome: {
          description: 'You hold the contradiction in your mind, understanding that modernity is neither salvation nor catastrophe.',
          effects: {
            xp: 15,
            stats: { erudition: 1 },
            reputation: 5,
          },
        },
        requirements: {
          stat: 'erudition',
          minValue: 15,
        },
      },
    ],
  },

  {
    id: 'pickpocket-attempt',
    type: 'procedural',
    title: 'Suspicious Jostle',
    description: 'In the crowd near the Gallery of Machines, you feel a hand brush against your coat pocket. A young man with quick eyes meets your gaze for just a moment...',
    choices: [
      {
        text: 'Grab his wrist and call for the authorities',
        outcome: {
          description: 'You seize the would-be thief. A gendarme arrives and hauls him away. Your quick reflexes have protected your purse.',
          effects: {
            xp: 20,
            reputation: 5,
          },
        },
        requirements: {
          stat: 'perception',
          minValue: 20,
        },
      },
      {
        text: 'Let him go but deliver a cutting remark about his technique',
        outcome: {
          description: '"My dear fellow, if you\'re going to pursue that particular career, you might at least do it with competence." He flushes and disappears. You\'ve kept your money and your dignity.',
          effects: {
            xp: 25,
            gold: 0,
            stats: { wit: 2 },
          },
        },
        requirements: {
          stat: 'wit',
          minValue: 25,
        },
      },
      {
        text: 'Pretend not to notice and observe what happens',
        outcome: {
          description: 'You allow the interaction to complete, noting his technique. Later, you record your observations - material for a story, perhaps. The 20 francs lost seems a reasonable price for insight into criminal psychology.',
          effects: {
            xp: 30,
            gold: -20,
            stats: { erudition: 2 },
          },
        },
      },
    ],
  },

  {
    id: 'colonial-pavilion-discomfort',
    type: 'scripted',
    title: 'The Colonial Exhibition',
    description: 'At the colonial pavilion, real people from France\'s colonies have been brought here as living exhibits. A Senegalese man in traditional dress stands in a reconstructed village while Europeans gawk and point. You feel...',
    location: 'colonial-pavilion',
    oneTime: true,
    choices: [
      {
        text: 'Disgusted. This is dehumanizing spectacle masquerading as education.',
        outcome: {
          description: 'You leave quickly, stomach churning. In your journal, you write a scathing critique of this "educational" display. Some truths must be recorded, even if they\'re uncomfortable.',
          effects: {
            xp: 40,
            reputation: -10,
            stats: { erudition: 3 },
          },
        },
      },
      {
        text: 'Conflicted. The colonial project itself is the problem, not just this exhibition.',
        outcome: {
          description: 'You recognize that this display is merely a symptom. The empire itself reduces people to spectacles and resources. Your discomfort crystallizes into political understanding.',
          effects: {
            xp: 50,
            reputation: 5,
            stats: { perception: 3, erudition: 2 },
          },
        },
        requirements: {
          stat: 'erudition',
          minValue: 40,
        },
      },
      {
        text: 'Fascinated despite yourself by the craftsmanship and culture on display.',
        outcome: {
          description: 'You separate the human skill from the dehumanizing context - or try to. It\'s not entirely successful, but you learn something about West African textile techniques.',
          effects: {
            xp: 30,
            reputation: -5,
            stats: { perception: 2 },
          },
        },
      },
    ],
  },

  {
    id: 'phonograph-demonstration',
    type: 'scripted',
    title: 'The Phonograph Demonstration',
    description: 'Edison demonstrates his improved phonograph to a rapt crowd. A scratchy recording of "Au Clair de la Lune" plays, and the crowd erupts in applause. Edison looks triumphant. You think...',
    location: 'gallery-machines',
    choices: [
      {
        text: 'This will transform how we preserve and transmit culture.',
        outcome: {
          description: 'You recognize the revolutionary potential. Human voices, music, speeches - all preserved for future generations. The implications are staggering.',
          effects: {
            xp: 30,
            relationship: { npc: 'thomas-edison', change: 10 },
          },
        },
      },
      {
        text: 'The sound quality is abysmal - this is more novelty than revolution.',
        outcome: {
          description: 'Your aesthetic sensibilities rebel at the tinny, distorted reproduction. If this is the future of music, perhaps the past was better.',
          effects: {
            xp: 25,
            stats: { wit: 2 },
            relationship: { npc: 'thomas-edison', change: -5 },
          },
        },
      },
      {
        text: 'Consider the uncanny quality of the recorded voice - death and life intertwined.',
        outcome: {
          description: 'A recorded voice could outlive its owner, speaking from beyond the grave. There\'s something ghostly and unsettling about this technology. Material for a story...',
          effects: {
            xp: 40,
            stats: { erudition: 3 },
          },
        },
        requirements: {
          stat: 'erudition',
          minValue: 35,
        },
      },
    ],
  },

  {
    id: 'wilde-meeting',
    type: 'scripted',
    title: 'An Unexpected Encounter',
    description: 'At the Café Parisien, you spot Oscar Wilde holding court at a corner table. He sees you and beckons. "Mr. James! Come, rescue me from these admirers - or join them in their persecution!"',
    location: 'cafe-parisien',
    oneTime: true,
    choices: [
      {
        text: 'Join him and engage in witty repartee',
        outcome: {
          description: 'You spend an hour trading quips and aesthetic theories. Wilde is exhausting but brilliant. You emerge with your wit sharpened and your wallet lighter (he insisted on ordering champagne).',
          effects: {
            xp: 50,
            gold: -15,
            stats: { wit: 3, charm: 2 },
            relationship: { npc: 'oscar-wilde', change: 20 },
          },
        },
        requirements: {
          stat: 'wit',
          minValue: 30,
        },
      },
      {
        text: 'Politely decline and observe from a distance',
        outcome: {
          description: 'You demur with a graceful excuse. From across the café, you watch Wilde perform. Sometimes observation is more valuable than participation.',
          effects: {
            xp: 30,
            stats: { perception: 2 },
          },
        },
      },
      {
        text: 'Challenge his aesthetic philosophy directly',
        outcome: {
          description: 'You engage Wilde in serious debate about art and morality. He\'s delighted by the challenge. The conversation attracts a crowd. You part as respectful adversaries.',
          effects: {
            xp: 60,
            stats: { erudition: 3, wit: 2 },
            relationship: { npc: 'oscar-wilde', change: 15 },
            reputation: 10,
          },
        },
        requirements: {
          stat: 'erudition',
          minValue: 45,
        },
      },
    ],
  },

  {
    id: 'mysterious-letter',
    type: 'procedural',
    title: 'A Mysterious Letter',
    description: 'A street urchin delivers a sealed envelope. Inside, in elegant handwriting: "Monsieur, if you value historical truth, come to the Seine Promenade at sunset. Bring no one." It\'s unsigned.',
    choices: [
      {
        text: 'Go alone as requested',
        outcome: {
          description: 'At sunset, a mysterious figure meets you with documents suggesting certain fair exhibits are fraudulent. You\'ve stumbled onto something interesting... and possibly dangerous.',
          effects: {
            xp: 50,
            stats: { perception: 3 },
            items: ['mysterious-documents'],
          },
        },
      },
      {
        text: 'Go but bring a companion for safety',
        outcome: {
          description: 'Your contact never appears. You waited with Buffalo Bill, who was happy to provide protection but whose presence scared off your mysterious correspondent.',
          effects: {
            xp: 20,
            relationship: { npc: 'buffalo-bill', change: 10 },
          },
        },
      },
      {
        text: 'Ignore it - likely a prank or confidence scheme',
        outcome: {
          description: 'You discard the letter. Probably wise. Still, you can\'t help wondering what you might have learned...',
          effects: {
            xp: 10,
          },
        },
      },
    ],
  },

  {
    id: 'artist-argument',
    type: 'procedural',
    title: 'An Artistic Dispute',
    description: 'At the Beaux-Arts Palace, two critics are arguing loudly about Impressionism. One calls it "the future of art," the other "a passing fad for those with poor eyesight." They turn to you for judgment.',
    location: 'fine-arts-palace',
    choices: [
      {
        text: 'Defend the Impressionists with sophisticated arguments',
        outcome: {
          description: 'You articulate the Impressionist project - capturing perception rather than reality, the fleeting rather than the eternal. Your defense impresses the artists present.',
          effects: {
            xp: 40,
            stats: { erudition: 2, charm: 2 },
            relationship: { npc: 'berthe-morisot', change: 15 },
            reputation: 10,
          },
        },
        requirements: {
          stat: 'erudition',
          minValue: 40,
        },
      },
      {
        text: 'Defend academic painting as the true art',
        outcome: {
          description: 'You argue for traditional standards and technical mastery. The conservative critics applaud, though you notice the younger artists exchange disappointed glances.',
          effects: {
            xp: 30,
            stats: { wit: 2 },
            reputation: 5,
          },
        },
      },
      {
        text: 'Suggest both sides have merit, to general annoyance',
        outcome: {
          description: 'Your diplomatic non-answer pleases no one. Both sides denounce you as a fence-sitter. Sometimes the moderate position is the loneliest.',
          effects: {
            xp: 25,
            reputation: -5,
          },
        },
      },
    ],
  },
];

// Get events available at current location
export function getAvailableEvents(
  locationId: string,
  playerLevel: number,
  completedEvents: string[]
): GameEvent[] {
  return SCRIPTED_EVENTS.filter(event => {
    if (event.oneTime && completedEvents.includes(event.id)) {
      return false;
    }
    if (event.location && event.location !== locationId) {
      return false;
    }
    if (event.requiredLevel && playerLevel < event.requiredLevel) {
      return false;
    }
    return true;
  });
}
