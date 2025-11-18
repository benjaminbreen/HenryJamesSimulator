import type { Location } from '../types/game';

export const LOCATIONS: Record<string, Location> = {
  esplanade: {
    id: 'esplanade',
    name: 'Esplanade des Invalides',
    description: 'The grand entrance to the Exposition Universelle spreads before you. Throngs of visitors from every nation mill about beneath ornate archways. The iron latticework of the Eiffel Tower rises impossibly in the distance.',
    asciiArt: `
    ╔═══════════════════════════════════════════════════════════╗
    ║     ___________    EXPOSITION UNIVERSELLE    ___________  ║
    ║    |           |        PARIS 1889         |           | ║
    ║    |   [___]   |                           |   [___]   | ║
    ║    |   |   |   |      ~  ~  ~  ~  ~       |   |   |   | ║
    ║    |___|   |___|     ~  ~  ~  ~  ~  ~     |___|   |___| ║
    ║        [∩]              ~ ~ ~ ~ ~              [∩]       ║
    ║         |     👤  👤  👥  👤  👥  👤           |        ║
    ║    ═════╬═══════════════════════════════════╬═════       ║
    ║         |            ⚐  ⚐  ⚐               |           ║
    ╚═══════════════════════════════════════════════════════════╝
               "Liberté, Égalité, Fraternité"
    `,
    npcs: [],
    connections: ['eiffel-tower', 'gallery-machines', 'trocadero', 'champ-de-mars', 'cafe-parisien'],
    ambientText: [
      'A woman in a bustled dress exclaims in German over a guidebook.',
      'Vendors hawk commemorative medallions and colored prints.',
      'The smell of roasting chestnuts mingles with machine oil and perfume.',
      'A photographer sets up his apparatus, calling for subjects.',
      'Children chase each other around the fountain, shrieking with delight.',
    ],
    discoveryXP: 0,
  },

  'eiffel-tower': {
    id: 'eiffel-tower',
    name: 'Base of the Eiffel Tower',
    description: 'The iron colossus rises 300 meters above you, its latticed framework a marvel of mathematical precision. Queues form at the base for the steam-powered elevators. Critics call it an eyesore; crowds call it magnificent.',
    asciiArt: `
    ╔═══════════════════════════════════════════════════════════╗
    ║                           ▲                               ║
    ║                          ╱│╲                              ║
    ║                         ╱ │ ╲                             ║
    ║                        ╱  │  ╲                            ║
    ║                       ╱   │   ╲                           ║
    ║                      ╱    │    ╲                          ║
    ║                     ╱     │     ╲                         ║
    ║                    ╱      │      ╲                        ║
    ║                   ╱       │       ╲                       ║
    ║                  ╱        │        ╲                      ║
    ║                 ╱         │         ╲                     ║
    ║                ╱    ╔═════╧═════╗    ╲                    ║
    ║               ╱     ║  ELEVATOR ║     ╲                   ║
    ║              ╱      ║  [STEAM]  ║      ╲                  ║
    ║            ╱═══════╗╚═══════════╝╔═══════╲                ║
    ║           │  👤 👥 │             │ 👤 👥  │               ║
    ╚═══════════════════════════════════════════════════════════╝
              The Tower of Three Hundred Meters
    `,
    npcs: ['gustave-eiffel'],
    connections: ['esplanade', 'eiffel-top', 'champ-de-mars'],
    ambientText: [
      'The iron framework hums in the wind, an eerie industrial music.',
      'An American tourist declares it the eighth wonder of the world.',
      'A French intellectual mutters about "cette infame tour."',
      'Engineers examine the base supports with professional admiration.',
      'The elevator mechanism hisses and clanks rhythmically.',
    ],
    discoveryXP: 50,
  },

  'eiffel-top': {
    id: 'eiffel-top',
    name: 'Summit of the Eiffel Tower',
    description: 'All of Paris spreads beneath you like a map come to life. The Seine snakes silver through the city. The sensation of height is vertiginous and sublime. You are standing at the pinnacle of modernity.',
    asciiArt: `
    ╔═══════════════════════════════════════════════════════════╗
    ║                      ★ SUMMIT ★                          ║
    ║                    ╔═══════════╗                          ║
    ║                    ║ 👤  🔭 👤 ║                          ║
    ║                    ║ [300m]    ║                          ║
    ║                    ╚═══════════╝                          ║
    ║                                                           ║
    ║     ～～～～～～～～～～～～～～～～～～～～～～            ║
    ║    ～  ⛪ 🏛️ 🏰 ～ PARIS ～ 🌳 🏛️ 🏛️ ～               ║
    ║   ～～～～～～ Seine ～～～～～～～～～～～～              ║
    ║  ～ 🏛️ ～～～～～～～～～～～～ 🌳 ～～～                ║
    ║                                                           ║
    ║              "Veni, vidi, transcendi"                     ║
    ╚═══════════════════════════════════════════════════════════╝
    `,
    npcs: [],
    connections: ['eiffel-tower'],
    ambientText: [
      'The wind whips your coat. Paris seems impossibly distant below.',
      'A woman steadies herself against the rail, exhilarated and terrified.',
      'Champagne corks pop - someone is celebrating their courage.',
      'You can see the Seine winding through the city like a silver ribbon.',
      'The perspective is dizzying. Humanity seems very small from here.',
    ],
    discoveryXP: 100,
    isLocked: true,
    unlockCondition: 'Must have visited Eiffel Tower base',
  },

  'gallery-machines': {
    id: 'gallery-machines',
    name: 'Galerie des Machines',
    description: 'The vast iron and glass hall stretches 420 meters, longer than the tower is tall. Machines from every industrial nation clank, hiss, and roar. This is the temple of progress, the cathedral of steam and steel.',
    asciiArt: `
    ╔═══════════════════════════════════════════════════════════╗
    ║  ╔═══╗   GALERIE DES MACHINES   ╔═══╗                    ║
    ║  ║ ⚙ ║                           ║ ⚙ ║                    ║
    ║  ╠═══╣  ┌─────┐  ┌─────┐  ┌─────┐╠═══╣                   ║
    ║  ║⚡⚙║  │ ⚙⚙⚙ │  │ ⚙⚙⚙ │  │ ⚙⚙⚙ │║⚡⚙║                   ║
    ║  ╚═══╝  │ ╱│╲ │  │ ╱│╲ │  │ ╱│╲ │╚═══╝                   ║
    ║         │  │  │  │  │  │  │  │  │                        ║
    ║    👤   └──┴──┘  └──┴──┘  └──┴──┘  👥                    ║
    ║  ═══════════════════════════════════════                  ║
    ║    ♨♨♨  [STEAM]  ♨♨♨  [POWER]  ♨♨♨                      ║
    ║         "The March of Progress"                           ║
    ╚═══════════════════════════════════════════════════════════╝
    `,
    npcs: ['thomas-edison'],
    connections: ['esplanade', 'exposition-palace'],
    ambientText: [
      'The roar of machinery is almost overwhelming. Progress has a voice.',
      'A massive hydraulic press demonstrates its power, crushing metal.',
      'Edison\'s phonograph plays a tinny recording of "Au Clair de la Lune."',
      'Steam pipes hiss. The air is thick with oil and ambition.',
      'Visitors gape at the spectacle of coordinated industrial might.',
    ],
    discoveryXP: 75,
    exhibits: [
      {
        id: 'edison-phonograph',
        name: 'Edison\'s Improved Phonograph',
        creator: 'Thomas Alva Edison',
        country: 'United States',
        description: 'A cylinder phonograph that can both record and play back sound. The mechanism uses a stylus to trace grooves in a wax cylinder, capturing vibrations and reproducing them.',
        historicalSignificance: 'Represented the cutting edge of sound recording technology. Edison\'s exhibition competed with similar devices from other inventors.',
        category: 'electricity',
        interactionText: 'You hear a scratchy recording of a French song. The fidelity is poor but the miracle is undeniable - a human voice, captured and replayed.',
      },
      {
        id: 'corliss-engine',
        name: 'Corliss Steam Engine',
        creator: 'George H. Corliss',
        country: 'United States',
        description: 'A massive steam engine that powered machinery throughout the Gallery. Its enormous flywheel and precise valve mechanism represented the pinnacle of steam technology.',
        historicalSignificance: 'Corliss engines were considered the most efficient steam engines of the era, symbolizing American industrial prowess.',
        category: 'machinery',
      },
      {
        id: 'gramme-dynamo',
        name: 'Gramme Dynamo',
        creator: 'Zénobe Gramme',
        country: 'Belgium',
        description: 'An electrical generator that converts mechanical energy into electrical power. Multiple dynamos lit the fair with electrical illumination.',
        historicalSignificance: 'The 1889 fair was one of the first major exhibitions to use extensive electrical lighting, demonstrating electricity\'s potential to transform daily life.',
        category: 'electricity',
      },
      {
        id: 'otis-elevator',
        name: 'Otis Hydraulic Elevator',
        creator: 'Elisha Graves Otis',
        country: 'United States',
        description: 'A hydraulic elevator system similar to those installed in the Eiffel Tower. The system used water pressure to lift the cab safely.',
        historicalSignificance: 'Made tall buildings practical and the Eiffel Tower accessible. Revolutionized urban architecture.',
        category: 'machinery',
      },
    ],
  },

  'cafe-parisien': {
    id: 'cafe-parisien',
    name: 'Café Parisien',
    description: 'A fashionable café within the exposition grounds. Artists, intellectuals, and tourists mingle over absinthe and coffee. Conversation flows in a dozen languages. This is where reputations are made and destroyed over aperitifs.',
    asciiArt: `
    ╔═══════════════════════════════════════════════════════════╗
    ║          ═══ CAFÉ PARISIEN ═══                           ║
    ║    _______________▓▓▓_______________                      ║
    ║   |  ☕  |  ☕  |     |  ☕  |  ☕  |                     ║
    ║   | 👤👤 | 👤👤 |     | 👤👤 | 👤👤 |                     ║
    ║   |______|______|_____|______|______|                     ║
    ║   |  ☕  |  🍷  |     |  ☕  |  🍷  |                     ║
    ║   | 👤   | 👤👤 |     | 👤   | 👤👤 |                     ║
    ║   |______|______|_____|______|______|                     ║
    ║                  [BAR]                                    ║
    ║              ♪ ♫ ♪ ♫ ♪ ♫                                ║
    ║        "Le rendez-vous des esprits"                       ║
    ╚═══════════════════════════════════════════════════════════╝
    `,
    npcs: ['oscar-wilde'],
    connections: ['esplanade', 'trocadero'],
    ambientText: [
      'Someone argues passionately about Zola. Another calls him a pornographer.',
      'Absinthe glasses cloud with water, turning emerald and opalescent.',
      'A bohemian in a velvet jacket sketches the crowd.',
      'Laughter erupts from a corner table - someone has made a devastating joke.',
      'The air is thick with tobacco smoke and theory.',
    ],
    discoveryXP: 25,
  },

  'champ-de-mars': {
    id: 'champ-de-mars',
    name: 'Champ de Mars',
    description: 'The great field spreads beneath the Eiffel Tower. Buffalo Bill\'s Wild West show has set up camp nearby, and you can hear distant whoops and gunshots. The American frontier meets the French Republic.',
    asciiArt: `
    ╔═══════════════════════════════════════════════════════════╗
    ║                    [CHAMP DE MARS]                        ║
    ║   ∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿                    ║
    ║  ∿  ⛺  ∿∿∿∿∿∿∿∿∿∿∿∿∿  🐃  ∿∿∿∿∿∿∿                      ║
    ║  ∿∿∿∿∿  🤠  ∿∿∿∿∿∿  WILD WEST  ∿∿∿                      ║
    ║  ∿∿∿∿∿∿∿∿∿∿∿  👤👥  ∿∿∿∿∿∿∿∿∿∿∿∿                       ║
    ║  ∿∿∿  🐎  ∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿                       ║
    ║                                                           ║
    ║             🎪 Buffalo Bill's Show 🎪                     ║
    ║                                                           ║
    ╚═══════════════════════════════════════════════════════════╝
    `,
    npcs: ['buffalo-bill'],
    connections: ['esplanade', 'eiffel-tower', 'seine-promenade'],
    ambientText: [
      'Gunshots crack from Buffalo Bill\'s arena. Crowd roars approval.',
      'A man in fringed buckskin leads a buffalo. It looks bored.',
      'Children plead with their parents for Wild West show tickets.',
      'The smell of gunpowder and horse sweat mingles oddly with perfume.',
      'American flags snap in the breeze alongside French tricolors.',
    ],
    discoveryXP: 50,
  },

  'trocadero': {
    id: 'trocadero',
    name: 'Palais du Trocadéro',
    description: 'An ornate Moorish-Byzantine palace houses ethnographic exhibits and concerts. Its fountains cascade down terraces toward the Seine. The colonial pavilions display the spoils of empire.',
    asciiArt: `
    ╔═══════════════════════════════════════════════════════════╗
    ║          ╔═══╗ PALAIS DU TROCADÉRO ╔═══╗                 ║
    ║          ║ ☪ ║                     ║ ☪ ║                 ║
    ║        ╔═╩═══╩═╗                 ╔═╩═══╩═╗               ║
    ║        ║  ___  ║═══════════════  ║  ___  ║               ║
    ║        ║ |   | ║                 ║ |   | ║               ║
    ║        ║ |___| ║                 ║ |___| ║               ║
    ║        ╚═══════╝                 ╚═══════╝               ║
    ║           ⛲    ⛲    ⛲    ⛲                             ║
    ║         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                  ║
    ║           👤  👥  👤  👤  👥  👤                         ║
    ╚═══════════════════════════════════════════════════════════╝
    `,
    npcs: [],
    connections: ['esplanade', 'cafe-parisien', 'colonial-pavilion'],
    ambientText: [
      'Water cascades musically down the terraces into basins.',
      'A chamber orchestra plays Debussy inside the concert hall.',
      'The architecture is an orientalist fantasy - neither accurate nor subtle.',
      'Tourists photograph each other beside the fountains.',
      'The view across to the Eiffel Tower is, admittedly, superb.',
    ],
    discoveryXP: 40,
  },

  'colonial-pavilion': {
    id: 'colonial-pavilion',
    name: 'Colonial Pavilions',
    description: 'Reconstructed "native villages" display France\'s colonial acquisitions. The exhibits range from the patronizing to the offensive. Real people from colonized lands have been brought here as living displays. The whole thing is deeply uncomfortable.',
    asciiArt: `
    ╔═══════════════════════════════════════════════════════════╗
    ║      [COLONIAL EXPOSITION - FRANCE D'OUTRE-MER]          ║
    ║    ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐               ║
    ║    │ 🏠 │  │ 🏠 │  │ 🏠 │  │ 🏠 │  │ 🏠 │               ║
    ║    └────┘  └────┘  └────┘  └────┘  └────┘               ║
    ║   ALGÉRIE  TUNISIE SENEGAL  INDOCHINE TAHITI             ║
    ║                                                           ║
    ║         👤    👤    👤    👤    👤                        ║
    ║            (exhibited peoples)                            ║
    ║                                                           ║
    ║       "La Mission Civilisatrice" [sic]                    ║
    ╚═══════════════════════════════════════════════════════════╝
    `,
    npcs: [],
    connections: ['trocadero'],
    ambientText: [
      'A Senegalese man in traditional dress stares past the gawking crowd.',
      'Visitors treat human beings as curiosities. It turns your stomach.',
      'Someone calls this "educational." You consider that word carefully.',
      'The gulf between the fair\'s egalitarian ideals and this reality is stark.',
      'This is empire, displayed without shame or self-awareness.',
    ],
    discoveryXP: 30,
  },

  'fine-arts-palace': {
    id: 'fine-arts-palace',
    name: 'Palais des Beaux-Arts',
    description: 'Galleries display contemporary painting and sculpture from around the world. Academic styles compete with newer movements. The debates about what constitutes art are as intense as ever.',
    asciiArt: `
    ╔═══════════════════════════════════════════════════════════╗
    ║             PALAIS DES BEAUX-ARTS                         ║
    ║    ╔═══════════════════════════════════════╗              ║
    ║    ║  [🖼️]    [🖼️]    [🖼️]    [🖼️]  ║              ║
    ║    ║                                       ║              ║
    ║    ║  [🖼️]    [🖼️]    [🖼️]    [🖼️]  ║              ║
    ║    ║                                       ║              ║
    ║    ║    👤      👤      👥      👤        ║              ║
    ║    ║                                       ║              ║
    ║    ║  🗿     [🖼️]    [🖼️]     🗿       ║              ║
    ║    ╚═══════════════════════════════════════╝              ║
    ║              "Ars Longa, Vita Brevis"                     ║
    ╚═══════════════════════════════════════════════════════════╝
    `,
    npcs: ['rosa-bonheur', 'berthe-morisot'],
    connections: ['exposition-palace'],
    ambientText: [
      'A critic gesticulates before a Monet, denouncing "these blurry daubs."',
      'Academic paintings of Roman scenes draw larger crowds than the Impressionists.',
      'Someone whispers that the Impressionists won\'t last another decade.',
      'The light through the skylights creates its own impressionist effects.',
      'Bonheur\'s "The Horse Fair" draws a perpetual crowd of admirers.',
    ],
    discoveryXP: 60,
  },

  'seine-promenade': {
    id: 'seine-promenade',
    name: 'Seine Promenade',
    description: 'The river walk offers respite from the fair\'s cacophony. Boats drift past. Couples stroll. This is the Paris of romance and reflection, existing somehow alongside the Paris of steam and steel.',
    asciiArt: `
    ╔═══════════════════════════════════════════════════════════╗
    ║                   [LA SEINE]                              ║
    ║   🌳  🌳  🌳  🌳  🌳  🌳  🌳  🌳                          ║
    ║    👥        👤       👤👤                                ║
    ║  ═══════════════════════════════════════════              ║
    ║  ～～～～～～～～～～～～～～～～～～～～～～～            ║
    ║  ～～  ⛵  ～～～～～～～  🚢  ～～～～～～～             ║
    ║  ～～～～～～～～～～～～～～～～～～～～～～～            ║
    ║  ═══════════════════════════════════════════              ║
    ║       "Fluctuat nec mergitur"                             ║
    ╚═══════════════════════════════════════════════════════════╝
    `,
    npcs: [],
    connections: ['champ-de-mars', 'exposition-palace'],
    ambientText: [
      'The water reflects the evening sky, impressionist and serene.',
      'A boat passes, its occupants trailing hands in the current.',
      'Street musicians play a melancholy waltz.',
      'The noise of the fair seems distant here, almost unreal.',
      'Paris reveals its older, quieter self along these banks.',
    ],
    discoveryXP: 20,
  },

  'exposition-palace': {
    id: 'exposition-palace',
    name: 'Central Exposition Palace',
    description: 'The main exhibition hall contains national pavilions from dozens of countries. Each nation strives to outdo the others in displays of culture, industry, and imperial reach. The competitive spirit is palpable.',
    asciiArt: `
    ╔═══════════════════════════════════════════════════════════╗
    ║           EXPOSITION UNIVERSELLE - HALL CENTRAL           ║
    ║    ⚑     ⚐     ⚑     ⚐     ⚑     ⚐     ⚑               ║
    ║   ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐            ║
    ║   │USA│ │GBR│ │DEU│ │RUS│ │JAP│ │ITA│ │ESP│            ║
    ║   └───┘ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘            ║
    ║     👥    👤    👥    👤    👥    👤    👥              ║
    ║                                                           ║
    ║        "The Marketplace of Nations"                       ║
    ╚═══════════════════════════════════════════════════════════╝
    `,
    npcs: [],
    connections: ['gallery-machines', 'fine-arts-palace', 'seine-promenade'],
    ambientText: [
      'National pride manifests in exhibits of dubious taste and genuine achievement.',
      'The Japanese pavilion draws crowds with its elegant simplicity.',
      'German industrial exhibits compete directly with American ones.',
      'Russia displays Fabergé eggs and icons, emphasizing exotic luxury.',
      'Every nation claims to represent the future. They can\'t all be right.',
    ],
    discoveryXP: 45,
  },
};

// Overworld map in beautiful ASCII
export const OVERWORLD_MAP = `
╔═════════════════════════════════════════════════════════════════════════════╗
║                    PLAN DE L'EXPOSITION UNIVERSELLE                         ║
║                              PARIS • 1889                                   ║
║                                                                             ║
║        Trocadéro ════ Colonial                                              ║
║           [T]            [C]                                                ║
║            ║              ║                                                 ║
║            ║              ║                                                 ║
║       Café══╬════════════╬════ Esplanade ════ Gallery ════ Expo            ║
║       [☕]  ║              ║       [✷]           [⚙]        [⚐]            ║
║            ║              ║        ║            ║           ║               ║
║            ║              ║        ║            ║         Seine             ║
║            ║              ║        ║            ║          [≈]              ║
║            ║              ║        ║            ║           ║               ║
║            ║              ║      Eiffel ════════╬═══════════╝               ║
║            ║              ║       [▲]           ║                           ║
║            ║              ║        ║            ║                           ║
║            ║              ║        ║            ║                           ║
║            ╚══════════════╬════ Champ ═════════╣                           ║
║                           ║      [🎪]          ║                           ║
║                           ║                    ║                           ║
║                           ║              Beaux-Arts                         ║
║                           ║                [🖼️]                            ║
║                           ╚════════════════════╝                            ║
║                                                                             ║
║  Legend: ═══ Paths  ║ Connections  [✷] Start  [▲] Tower  [⚙] Machines    ║
║          [🎪] Wild West  [☕] Café  [🖼️] Arts  [⚐] Pavilions  [≈] River    ║
║                                                                             ║
║                    Press 'M' to toggle map view                             ║
╚═════════════════════════════════════════════════════════════════════════════╝
`;
