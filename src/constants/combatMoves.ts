import type { CombatMove } from '../types/game';

// Henry James's Belle Époque battle moves
export const PLAYER_COMBAT_MOVES: CombatMove[] = [
  {
    id: 'oblique-observation',
    name: 'The Oblique Observation',
    type: 'literary-allusion',
    description: 'Deploy a lengthy, perfectly balanced sentence that leaves your opponent uncertain whether they\'ve been complimented or cut to pieces.',
    witDamage: 20,
    charmDamage: 10,
    eruditionRequirement: 20,
    witCost: 15,
    quote: '"One might say, with all due consideration for your... particular perspective..."',
  },
  {
    id: 'international-comparison',
    name: 'Unfavorable Comparison',
    type: 'jibe',
    description: 'Draw an elaborate parallel between European sophistication and American crudeness (or vice versa) that somehow implicates your opponent.',
    witDamage: 25,
    charmDamage: 15,
    eruditionRequirement: 30,
    witCost: 20,
    quote: '"In London, of course, we would have understood the subtlety..."',
  },
  {
    id: 'psychological-penetration',
    name: 'Psychological Penetration',
    type: 'innuendo',
    description: 'Reveal that you\'ve perceived something your opponent hoped to keep hidden - not their secret, merely their desire to have one.',
    witDamage: 30,
    charmDamage: 20,
    eruditionRequirement: 40,
    witCost: 25,
    quote: '"I perceive that you are exactly the sort of person who would..."',
  },
  {
    id: 'narrative-detachment',
    name: 'Narrative Detachment',
    type: 'riposte',
    description: 'Defend by treating the entire conversation as if it were a scene in a novel you\'re simultaneously observing and writing.',
    witDamage: 15,
    charmDamage: 10,
    eruditionRequirement: 25,
    witCost: 15,
    quote: '"The scene presented itself to me with all the hallmarks of a certain... shall we say... predictability."',
  },
  {
    id: 'ambiguous-continental',
    name: 'Ambiguous Continental Reference',
    type: 'gossip',
    description: 'Mention someone important on the Continent whom neither you nor your opponent has actually met.',
    witDamage: 20,
    charmDamage: 15,
    eruditionRequirement: 20,
    witCost: 15,
    quote: '"As Turgenev once remarked to me in Baden-Baden..."',
  },
  {
    id: 'aesthetic-appreciation',
    name: 'Aesthetic Appreciation',
    type: 'literary-allusion',
    description: 'Praise something your opponent has said or done with such elaborate qualification that it becomes devastating criticism.',
    witDamage: 25,
    charmDamage: 20,
    eruditionRequirement: 35,
    witCost: 20,
    quote: '"One must admire the... courage... of your aesthetic position."',
  },
  {
    id: 'transatlantic-misunderstanding',
    name: 'The Transatlantic Misunderstanding',
    type: 'innuendo',
    description: 'Suggest that cultural differences excuse your opponent\'s gaffe, while simultaneously highlighting that gaffe.',
    witDamage: 25,
    charmDamage: 15,
    eruditionRequirement: 25,
    witCost: 18,
    quote: '"Ah, but you must forgive me - I had forgotten that in your country, such things are done differently."',
  },
  {
    id: 'retrospective-irony',
    name: 'Retrospective Irony',
    type: 'literary-allusion',
    description: 'Reference this very moment as if you\'re already writing about it in your memoirs, with ominous prescience.',
    witDamage: 30,
    charmDamage: 25,
    eruditionRequirement: 45,
    witCost: 25,
    quote: '"I shall remember this conversation, I think, as the moment when..."',
  },
  {
    id: 'passive-exposure',
    name: 'Passive Exposure',
    type: 'rumor',
    description: 'Let it be known that someone else has been talking about your opponent - you\'re merely reporting.',
    witDamage: 25,
    charmDamage: 10,
    eruditionRequirement: 20,
    witCost: 18,
    quote: '"Mrs. Wharton was just saying the other day..."',
  },
  {
    id: 'theatrical-consciousness',
    name: 'The Theatrical Consciousness',
    type: 'jibe',
    description: 'Suggest that your opponent is performing a role rather than speaking authentically.',
    witDamage: 28,
    charmDamage: 18,
    eruditionRequirement: 35,
    witCost: 22,
    quote: '"How very like a character in one of Ibsen\'s dramas you are at this moment."',
  },
];

// Advanced moves unlocked at higher levels
export const ADVANCED_MOVES: CombatMove[] = [
  {
    id: 'preface-to-demolition',
    name: 'Preface to Demolition',
    type: 'literary-allusion',
    description: 'Write a lengthy preface explaining exactly how you\'re about to destroy your opponent, then do so.',
    witDamage: 40,
    charmDamage: 30,
    eruditionRequirement: 60,
    witCost: 35,
    quote: '"Allow me first to establish the precise terms upon which your argument fails..."',
  },
  {
    id: 'ghost-story',
    name: 'The Ghost Story',
    type: 'innuendo',
    description: 'Tell a seemingly unrelated supernatural tale that contains a devastating parallel to your opponent\'s situation.',
    witDamage: 45,
    charmDamage: 35,
    eruditionRequirement: 70,
    witCost: 40,
    quote: '"There is a tale they tell in Venice of a man who thought himself secure..."',
  },
  {
    id: 'bowl-overturned',
    name: 'The Golden Bowl Overturned',
    type: 'innuendo',
    description: 'Reveal a hidden crack in what seemed perfect, changing everyone\'s understanding of the entire conversation.',
    witDamage: 50,
    charmDamage: 40,
    eruditionRequirement: 80,
    witCost: 45,
    quote: '"But surely you must have known that all along, beneath the surface..."',
  },
];

// Get available moves based on player level and stats
export function getAvailableMoves(level: number, erudition: number): CombatMove[] {
  const basicMoves = PLAYER_COMBAT_MOVES.filter(
    move => move.eruditionRequirement <= erudition
  );

  if (level >= 5) {
    const advancedMoves = ADVANCED_MOVES.filter(
      move => move.eruditionRequirement <= erudition
    );
    return [...basicMoves, ...advancedMoves];
  }

  return basicMoves;
}
