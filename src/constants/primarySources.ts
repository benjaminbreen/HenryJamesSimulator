import type { PrimarySource } from '../types/game';

// Historical primary sources relevant to the 1889 World's Fair
export const PRIMARY_SOURCES: PrimarySource[] = [
  {
    id: 'eiffel-defense',
    author: 'Gustave Eiffel',
    title: 'Response to the Artists\' Petition',
    date: 'February 14, 1887',
    excerpt: '"Is it because we are engineers that people think our buildings cannot have beauty? Are not the true conditions of strength always in conformity with the secret conditions of harmony?"',
    context: 'Eiffel\'s response to a petition signed by prominent artists and intellectuals (including Maupassant and Dumas fils) protesting the construction of his tower.',
    relevance: 'Reveals the tension between artistic and engineering aesthetics in the late 19th century.',
  },
  {
    id: 'artists-petition',
    author: 'Various Artists and Intellectuals',
    title: 'Petition Against the Eiffel Tower',
    date: 'February 1887',
    excerpt: '"We, writers, painters, sculptors, architects, passionate lovers of the beauty of Paris, do protest with all our strength against the erection of this useless and monstrous Eiffel Tower in the heart of our capital."',
    context: 'A petition signed by prominent cultural figures opposing the tower\'s construction.',
    relevance: 'Demonstrates aesthetic conservatism and fear of industrial modernity.',
  },
  {
    id: 'henry-james-paris',
    author: 'Henry James',
    title: 'Letters and Notebooks',
    date: '1889',
    excerpt: '"The great Eiffel Tower, as they call it, stands in the Champ de Mars, a structure of a peculiar awkwardness and yet not without a certain bold presence."',
    context: 'James visited Paris frequently in the 1880s and observed the fair\'s preparations and opening.',
    relevance: 'Shows James\'s ambivalence about modern spectacle - fascinated but aesthetically uncertain.',
  },
  {
    id: 'wilde-decay',
    author: 'Oscar Wilde',
    title: 'The Decay of Lying',
    date: '1889',
    excerpt: '"Life imitates Art far more than Art imitates Life... The self-conscious aim of Life is to find expression, and Art offers it certain beautiful forms through which it may realize that energy."',
    context: 'Published the same year as the exposition, articulating Wilde\'s aesthetic philosophy.',
    relevance: 'Wilde\'s rejection of realism in favor of artifice stands in contrast to the fair\'s celebration of industrial progress.',
  },
  {
    id: 'buffalo-bill-program',
    author: 'Buffalo Bill\'s Wild West',
    title: 'Exhibition Program',
    date: 'May 1889',
    excerpt: '"The Wild West presents an educational exhibition of Western American life, depicting scenes from the frontier with authentic cowboys, Indians, and animals."',
    context: 'Program notes from Buffalo Bill\'s exhibition adjacent to the 1889 fair.',
    relevance: 'Shows how the American West was mythologized and commercialized for European audiences.',
  },
  {
    id: 'edison-interview',
    author: 'Thomas Edison',
    title: 'Interview with Le Figaro',
    date: 'August 1889',
    excerpt: '"The phonograph will revolutionize business, education, and entertainment. Every home will have one. The human voice will be preserved for eternity."',
    context: 'Edison gave numerous interviews during his time at the exposition promoting his inventions.',
    relevance: 'Reveals Edison\'s promotional savvy and his vision of technology\'s social impact.',
  },
  {
    id: 'official-guide',
    author: 'Exposition Committee',
    title: 'Official Guide to the Universal Exposition',
    date: '1889',
    excerpt: '"This exposition celebrates the centenary of the Republic and demonstrates to all nations the progress achieved by France in the arts of peace."',
    context: 'Official guidebook to the fair, emphasizing its political and nationalist significance.',
    relevance: 'The fair was explicitly tied to republican and nationalist ideology.',
  },
  {
    id: 'colonial-description',
    author: 'Exposition Catalog',
    title: 'Colonial Pavilions Description',
    date: '1889',
    excerpt: '"Visitors may observe authentic natives from our colonial possessions engaged in their traditional crafts and customs."',
    context: 'Description of the colonial exhibitions where real people were displayed.',
    relevance: 'Stark example of colonialist attitudes and the dehumanization of colonized peoples.',
  },
  {
    id: 'morisot-letter',
    author: 'Berthe Morisot',
    title: 'Letter to her sister',
    date: 'June 1889',
    excerpt: '"The exposition is overwhelming in its scale and noise. Everyone speaks of progress, but I find myself drawn to the quieter corners, the play of light on water."',
    context: 'Personal correspondence during the fair.',
    relevance: 'Morisot\'s impressionist sensibility contrasts with the fair\'s bombast.',
  },
  {
    id: 'bonheur-interview',
    author: 'Rosa Bonheur',
    title: 'Interview with L\'Illustration',
    date: 'July 1889',
    excerpt: '"I paint animals because they are honest creatures, incapable of the artifice and pretense that characterizes human society."',
    context: 'Interview during the fair\'s run.',
    relevance: 'Bonheur\'s skepticism about human society and preference for nature.',
  },
  {
    id: 'machinery-hall-report',
    author: 'Engineering Magazine',
    title: 'Report on the Machinery Hall',
    date: 'October 1889',
    excerpt: '"420 meters of coordinated industrial power, a symphony of steam and steel that represents the pinnacle of human achievement."',
    context: 'Technical description of the Galerie des Machines.',
    relevance: 'The quasi-religious language used to describe industrial technology.',
  },
  {
    id: 'visitor-diary',
    author: 'Anonymous American Visitor',
    title: 'Travel Diary',
    date: 'July 1889',
    excerpt: '"We spent six hours at the fair today and saw not a tenth of it. The Eiffel Tower is magnificent though the French themselves seem unsure whether to be proud or embarrassed."',
    context: 'Personal travel diary from an American tourist.',
    relevance: 'Captures the fair\'s overwhelming scale and the ambivalence about the tower.',
  },
];

// Function to get relevant primary sources based on location or event
export function getRelevantSources(locationId?: string): PrimarySource[] {
  if (locationId === 'eiffel-tower' || locationId === 'eiffel-top') {
    return PRIMARY_SOURCES.filter(s =>
      s.id === 'eiffel-defense' || s.id === 'artists-petition' || s.id === 'henry-james-paris'
    );
  }
  if (locationId === 'gallery-machines') {
    return PRIMARY_SOURCES.filter(s =>
      s.id === 'edison-interview' || s.id === 'machinery-hall-report'
    );
  }
  if (locationId === 'colonial-pavilion') {
    return [PRIMARY_SOURCES.find(s => s.id === 'colonial-description')!];
  }
  if (locationId === 'champ-de-mars') {
    return [PRIMARY_SOURCES.find(s => s.id === 'buffalo-bill-program')!];
  }
  if (locationId === 'fine-arts-palace') {
    return PRIMARY_SOURCES.filter(s =>
      s.id === 'wilde-decay' || s.id === 'morisot-letter' || s.id === 'bonheur-interview'
    );
  }

  // Default: return a random selection
  return PRIMARY_SOURCES.slice(0, 3);
}
