import type { Item, ItemType } from '../types/game';

// Procedurally generate items with historical authenticity
const ITEM_TEMPLATES = {
  books: [
    { prefix: 'First Edition of', suffixes: ['Daisy Miller', 'The Portrait of a Lady', 'Les Misérables', 'Madame Bovary'] },
    { prefix: 'Volume of', suffixes: ['Baudelaire Poetry', 'Verlaine Verses', 'Whitman Poems', 'Tennyson Works'] },
    { prefix: 'Translation of', suffixes: ['The Kreutzer Sonata', 'Crime and Punishment', 'The Brothers Karamazov'] },
  ],
  documents: [
    { prefix: 'Letter from', suffixes: ['William James', 'Turgenev', 'Flaubert', 'George Eliot'] },
    { prefix: 'Manuscript of', suffixes: ['Unpublished Story', 'Critical Essay', 'Travel Notes', 'Theatre Review'] },
    { prefix: '', suffixes: ['Exposition Official Catalogue', 'Railway Timetable', 'Restaurant Menu', 'Theatre Programme'] },
  ],
  artifacts: [
    { prefix: 'Commemorative', suffixes: ['Medallion', 'Coin', 'Pin', 'Ribbon'] },
    { prefix: 'Photograph of', suffixes: ['Eiffel Tower', 'Gallery of Machines', 'Buffalo Bill Show', 'Seine at Sunset'] },
    { prefix: '', suffixes: ['Pocket Watch', 'Opera Glasses', 'Walking Stick', 'Fountain Pen'] },
  ],
};

const BOOK_CONTENT_TEMPLATES = [
  `The peculiar quality of the afternoon light—that golden, somehow liquid quality peculiar to Paris in summer—fell across the page with what seemed almost an intentional arrangement of beauty...`,
  `One observes, in the machinery of modern life, a certain inevitable momentum toward complexity. The question presents itself: is this progress, or merely complication masquerading as achievement?`,
  `The Americans abroad carry with them a curious mixture of confidence and diffidence. They assert their modernity while secretly yearning for Europe's accumulated centuries...`,
];

export function generateItem(type?: ItemType): Item {
  const types: ItemType[] = ['book', 'document', 'artifact', 'clothing', 'tool', 'consumable'];
  const selectedType = type || types[Math.floor(Math.random() * types.length)];

  const rarities: Item['rarity'][] = ['common', 'common', 'uncommon', 'uncommon', 'rare', 'legendary'];
  const rarity = rarities[Math.floor(Math.random() * rarities.length)];

  const id = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  if (selectedType === 'book') {
    const template = ITEM_TEMPLATES.books[Math.floor(Math.random() * ITEM_TEMPLATES.books.length)];
    const suffix = template.suffixes[Math.floor(Math.random() * template.suffixes.length)];
    const name = template.prefix ? `${template.prefix} ${suffix}` : suffix;

    return {
      id,
      name,
      type: 'book',
      description: `A ${rarity} volume that speaks to the literary moment.`,
      value: rarity === 'legendary' ? 200 : rarity === 'rare' ? 100 : rarity === 'uncommon' ? 50 : 25,
      rarity,
      readable: true,
      content: BOOK_CONTENT_TEMPLATES[Math.floor(Math.random() * BOOK_CONTENT_TEMPLATES.length)],
      historicalContext: 'Published during the height of literary realism in the late 19th century.',
    };
  }

  if (selectedType === 'document') {
    const template = ITEM_TEMPLATES.documents[Math.floor(Math.random() * ITEM_TEMPLATES.documents.length)];
    const suffix = template.suffixes[Math.floor(Math.random() * template.suffixes.length)];
    const name = template.prefix ? `${template.prefix} ${suffix}` : suffix;

    return {
      id,
      name,
      type: 'document',
      description: `A ${rarity} document of potential significance.`,
      value: rarity === 'legendary' ? 150 : rarity === 'rare' ? 75 : rarity === 'uncommon' ? 35 : 15,
      rarity,
      readable: true,
      content: 'Monsieur, regarding the matter we discussed...',
    };
  }

  if (selectedType === 'artifact') {
    const template = ITEM_TEMPLATES.artifacts[Math.floor(Math.random() * ITEM_TEMPLATES.artifacts.length)];
    const suffix = template.suffixes[Math.floor(Math.random() * template.suffixes.length)];
    const name = template.prefix ? `${template.prefix} ${suffix}` : suffix;

    return {
      id,
      name,
      type: 'artifact',
      description: `A ${rarity} souvenir from the Exposition Universelle.`,
      value: rarity === 'legendary' ? 300 : rarity === 'rare' ? 150 : rarity === 'uncommon' ? 60 : 30,
      rarity,
    };
  }

  // Default consumable
  return {
    id,
    name: 'Café au Lait',
    type: 'consumable',
    description: 'Restores wit and stamina.',
    value: 5,
    rarity: 'common',
    effect: {
      stat: 'wit',
      modifier: 10,
    },
  };
}
