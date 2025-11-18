# Henry James at the 1889 World's Fair

A beautiful, complex, fully interactive roguelike RPG set at the 1889 Paris World's Fair. Play as Henry James, the American novelist, navigating the spectacle of modernity, engaging in battles of wit with historical figures, and exploring the tension between Old World sophistication and New World vitality.

## Features

### Core Gameplay
- **Historically Accurate Setting**: Authentic recreation of the 1889 Exposition Universelle in Paris
- **Belle Époque Battle System**: Pokemon-style combat using literary allusions, gossip, innuendo, and devastating bon mots
- **Multiple Zones**: Explore the Eiffel Tower, Gallery of Machines, Café Parisien, and more
- **Experience & Leveling**: Gain XP, level up, and improve your stats (Wit, Erudition, Charm, Perception, Stamina)
- **Dynamic Events**: Procedurally generated, hard-coded, and LLM-triggered events with meaningful choices

### Historical Elements
- **Real NPCs**: Encounter Thomas Edison, Oscar Wilde, Gustave Eiffel, Rosa Bonheur, Berthe Morisot, Buffalo Bill, and more
- **Primary Sources**: Extensive historical quotes from real documents, letters, and publications
- **Authentic Exhibits**: Gallery of Machines features real exhibitions from the 1889 fair
- **Fact-Check Module**: LLM-powered historical verification with Wikipedia integration

### Game Systems
- **Inventory System**: Procedurally generated items including readable books with LLM-generated content
- **Journal System**: Record observations, encounters, events, and discoveries
- **Game Log**: Track all actions and outcomes
- **Save/Load**: Auto-save and manual save with full transcript export
- **Assessment Layer**: End-game scoring with pithy, slightly sarcastic AI-generated summary

### UI & Accessibility
- **Beautiful ASCII Art**: Sophisticated use of characters for locations, NPCs, and the overworld map
- **Light/Dark Mode**: Perfectly crafted themes with Belle Époque color palette
- **Animations**: Subtle, delightful transitions and effects
- **Customization**: Font size, text speed, difficulty levels, accessibility options
- **Responsive Design**: Works on all screen sizes

### Technical Features
- **React + TypeScript**: Modern, type-safe codebase
- **Vite**: Lightning-fast development and builds
- **Tailwind CSS**: Utility-first styling with custom Belle Époque theme
- **Zustand**: Elegant state management with persistence
- **Modular Architecture**: Clean separation of concerns, no barrel imports

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Gameplay Guide

### Controls
- **M** - Toggle map view
- **I** - Open inventory
- **J** - Open journal
- **L** - Focus game log
- **F** - Toggle fact-check panel
- **ESC** - Return to main view

### Combat System
Engage NPCs in battles of wit using moves like:
- **Literary Allusion**: Deploy sophisticated references
- **Oblique Observation**: Perfectly balanced sentences that cut deep
- **Aesthetic Paradox**: Turn conventional wisdom on its head
- **Psychological Penetration**: Reveal hidden motivations

### Progression
- Explore locations to gain XP and discover new areas
- Complete events to improve stats and relationships
- Defeat NPCs in wit-battles to earn gold and reputation
- Collect rare books and artifacts
- Make choices that shape your path through the fair

## Project Structure

```
src/
├── types/          # TypeScript interfaces and types
├── constants/      # Game data (NPCs, locations, events, primary sources)
├── stores/         # Zustand state management
├── components/     # React components
│   ├── pages/     # Screen components
│   ├── game/      # Game view components
│   ├── ui/        # Reusable UI components
│   └── layout/    # Layout components
├── utils/          # Helper functions
├── systems/        # Game logic systems
├── hooks/          # Custom React hooks
└── data/           # Additional game data
```

## Historical Accuracy

This game strives for historical authenticity while remaining entertaining:

- All NPCs are real historical figures who visited or lived in Paris in 1889
- The Eiffel Tower was genuinely controversial - many artists petitioned against it
- The Gallery of Machines exhibits are based on actual displays
- Primary source quotes are real excerpts from letters, newspapers, and books
- Buffalo Bill's Wild West show really did perform adjacent to the fair

Use the Fact-Check module (F key) to learn what's accurate and what's creative license.

## Future Enhancements

Potential additions for future versions:
- Full LLM integration for NPC dialogue
- More minigames and easter eggs
- Eiffel Tower ascent cutscene with cinematic presentation
- Expanded event system with more branching narratives
- Multiplayer "salon" mode for wit-battles
- Historical encyclopedia with deep dives into the period

## Credits

Built with:
- React & TypeScript
- Vite
- Tailwind CSS
- Zustand
- Extensive historical research

Inspired by:
- The life and works of Henry James
- The 1889 Exposition Universelle
- Belle Époque culture and aesthetics
- Classic roguelikes and choice-driven narratives

## License

MIT License - Feel free to learn from, modify, and build upon this code.

## Contributing

This is an educational and artistic project. Contributions welcome, especially:
- Additional historical NPCs with sophisticated prompts
- More primary source quotes
- Historical events with meaningful choices
- Bug fixes and performance improvements

---

*"One might say, with all due consideration for the particular circumstances, that the game presents itself with all the hallmarks of a certain... achievement."* — Henry James (probably)
