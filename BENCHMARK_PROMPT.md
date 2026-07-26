# LLM Benchmark: Henry James at the 1889 World's Fair - Belle Époque Roguelike RPG

## Objective
Build a fully functional, educational, and engaging roguelike RPG game where players embody Henry James exploring the 1889 Paris World's Fair (Exposition Universelle). The game must combine procedural generation, historical accuracy, strategic gameplay, and beautiful Art Nouveau-inspired design.

## Success Criteria
The implementation will be considered successful if it achieves ALL of the following:

### ✅ **Functional Requirements (Critical)**
1. **Works immediately** - User can click "Start" and play without errors
2. **Movement works** - Player can navigate between locations and see available destinations
3. **Progression works** - XP is awarded, levels increase, quests complete
4. **State persists** - Progress saves and reloads correctly across browser sessions
5. **Game loop functions** - Explore → Travel → Combat → Quests all interconnect properly

### ✅ **Educational Requirements**
1. Historical figures (Oscar Wilde, Thomas Edison, Gustave Eiffel, etc.) with accurate biographical info
2. Real locations from 1889 World's Fair (Eiffel Tower, Gallery of Machines, Trocadéro)
3. Historical context provided for major locations and events
4. Primary sources or historical quotes integrated
5. Clear distinction between historical fact and procedural fiction

### ✅ **Gameplay Requirements**
1. **Quest System** - Main quest and 3+ side quests with clear objectives
2. **Combat System** - Verbal duels with literary references (wit-based, not violence)
3. **Exploration** - Stat-based outcomes that reward smart play
4. **Progression** - XP/leveling system with meaningful stat increases
5. **Economy** - Gold/currency with purposes (shops, bribes, etc.)

### ✅ **Technical Requirements**
1. **React + TypeScript** - Type-safe implementation
2. **Tailwind CSS** - Responsive, beautiful Art Nouveau-inspired design
3. **State Management** - Zustand with persistence
4. **Procedural Generation** - World graph with 7+ anchor nodes, 15+ procedural nodes
5. **No errors** - Clean build, no TypeScript errors, no runtime crashes

---

## Technical Specification

### **Tech Stack (Required)**
```json
{
  "framework": "React 18+",
  "language": "TypeScript",
  "styling": "Tailwind CSS",
  "stateManagement": "Zustand with persist middleware",
  "buildTool": "Vite",
  "nodeCompatibility": "18.x+"
}
```

### **Project Structure**
```
src/
├── components/
│   ├── game/          # Game UI components
│   ├── map/           # Map visualization
│   └── pages/         # Screen components
├── stores/            # Zustand state management
├── systems/           # Game systems (world gen, NPCs, combat)
├── types/             # TypeScript type definitions
├── constants/         # Game data (NPCs, locations, items)
├── utils/             # Utilities (seeded RNG, generators)
└── services/          # External services (AI dialogue)
```

---

## Game Systems Design

### **1. World Generation System**

**Requirements:**
- **Anchor Nodes** (hand-crafted historical locations):
  - Esplanade des Invalides (starting point)
  - Eiffel Tower Base
  - Eiffel Tower Summit (goal)
  - Gallery of Machines
  - Café Parisien
  - Exposition Palace
  - Trocadéro Gardens
  
- **Procedural Nodes** (15+):
  - Generated with seeded RNG for reproducibility
  - Connected via graph with 2-4 connections per node
  - Biome types: exhibition-hall, indoor-salon, garden, marketplace, street, backstage, npc-quarters
  - Fog of war: only show discovered nodes
  - Auto-discover adjacent nodes when visiting

**Graph Structure:**
```typescript
interface WorldNode {
  id: string;
  type: 'anchor' | 'generated';
  biome: BiomeType;
  name: string;
  description: string;
  connections: string[];  // Node IDs
  discovered: boolean;
  visited: boolean;
  position: { x: number; y: number };  // For map display
  npcs: string[];
  items: string[];
  features: Feature[];
}

interface WorldGraph {
  nodes: Map<string, WorldNode>;
  startNodeId: string;
  seed: string;
}
```

### **2. Quest System**

**Main Quest:**
```typescript
{
  id: 'ascend-tower',
  title: 'Ascend the Eiffel Tower',
  description: 'Navigate the Exposition and reach the summit to witness the marvel of the age',
  objectives: [
    { type: 'visit', target: 'eiffel-tower' },
    { type: 'visit', target: 'eiffel-top' }
  ],
  rewards: { xp: 500, gold: 1000, reputation: 50 }
}
```

**Side Quests (minimum 3):**
- Meet Oscar Wilde (social quest)
- Explore Gallery of Machines (discovery quest)
- Café Society - talk to 2 NPCs (social quest)

**Quest Features:**
- Auto-tracking (visit, talk, explore, combat, collect)
- Progress indicators (e.g., "Talked to 1/2 NPCs")
- Visible quest tracker in UI
- Completion rewards (XP, gold, reputation, items)
- Journal integration

### **3. Player Character System**

```typescript
interface Player {
  name: 'Henry James';
  title: 'The American Novelist';
  level: number;
  xp: number;
  xpToNextLevel: number;
  stats: {
    wit: number;        // Affects combat, dialogue
    erudition: number;  // Affects exploration, historical insights
    charm: number;      // Affects NPC interactions
    perception: number; // Affects exploration quality
    stamina: number;    // Affects combat endurance
  };
  gold: number;         // Francs
  reputation: number;   // -100 to 100
  inventory: Item[];
  journalEntries: JournalEntry[];
}
```

**Progression:**
- XP awards: 50 for anchor visits, 25 for generated, varies by action
- Level up: every 100 XP initially, scaling
- Stat increases: +5 to all stats per level
- Visual feedback for XP gains

### **4. Combat System (Verbal Duels)**

**NOT physical combat** - battles of wit with literary references.

```typescript
interface CombatMove {
  id: string;
  name: string;
  type: 'literary-allusion' | 'gossip' | 'innuendo' | 'jibe' | 'riposte';
  witDamage: number;
  charmDamage: number;
  witCost: number;
  quote?: string;  // Historical quote or reference
}
```

**Example Moves:**
- "Wildean Epigram" - devastating wit damage
- "Jamesian Digression" - confuses opponent
- "French Bon Mot" - charm-based attack

**Combat Rewards:**
- XP: `(playerLevel × 50) + 100`
- Gold: 50-150 francs
- Reputation: +5 for victory, -10 for defeat
- Journal entry with historical context
- Quest progress if applicable

### **5. Exploration System (Stat-Based)**

**NOT pure RNG** - outcomes based on player stats.

```typescript
function explore(player: Player, location: WorldNode) {
  const perceptionBonus = Math.floor(player.stats.perception / 20);
  const eruditionBonus = Math.floor(player.stats.erudition / 20);
  const roll = Math.random() * 100 + perceptionBonus;
  
  if (roll > 85) {
    // Excellent: Rare item + 25 XP
  } else if (roll > 65) {
    // Good: Gold (25-100) + perception bonus + 15 XP
  } else if (roll > 45) {
    // Moderate: Historical insight + (30 + erudition bonus) XP
  } else if (roll > 25) {
    // Minor: Small gold + 10 XP
  } else {
    // Poor: Description + 5 XP (always gain something)
  }
}
```

**Key**: Player stats MUST affect outcomes. High perception = better finds.

### **6. NPC System**

**Two Types:**

**A. Historical NPCs (hand-crafted):**
- Oscar Wilde - Irish playwright, wit extraordinaire
- Thomas Edison - American inventor
- Gustave Eiffel - Tower architect
- Buffalo Bill Cody - Wild West Show performer
- Sarah Bernhardt - Actress

Each with:
- Biographical info
- Historical context
- Personality traits
- Combat stats
- Dialogue prompts

**B. Procedural NPCs (generated):**
- French artists, vendors, visitors
- Professions based on biome
- Simple AI behaviors
- Can be talked to, traded with

### **7. Economy System**

**Gold (Francs)** sources:
- Exploration (10-100 francs)
- Combat victories (50-150 francs)
- Quest rewards

**Gold uses:**
- Shop at Café Parisien (books, items, clothing)
- Bribery (unlock information, locations)
- Fast travel fees
- NPC gifts (improve relationships)

### **8. UI/UX Design**

**Art Nouveau Aesthetic:**
- Color palette: burgundy (#800020), gold (#D4AF37), sage green (#9CAF88), cream (#FFF8E8)
- Ornate borders, flowing curves
- Font: Display font for titles (Playfair Display or similar)
- Dark mode support (warm sepia tones, not pure black)

**Key UI Components:**

```
GameScreen:
├── GameHeader (player stats, level, XP bar)
├── Main View (2/3 width)
│   ├── LocationView (current location)
│   ├── MapView (world map)
│   ├── InventoryView
│   ├── JournalView
│   └── CombatView
└── Sidebar (1/3 width)
    ├── QuestTracker (active objectives) ⭐
    ├── GameLog (recent events)
    └── FactCheckPanel (historical context)
```

**Critical UI Requirements:**
1. **Quest Tracker** - Always visible, shows 1 main + 2 side quests
2. **Travel Section** - Prominent gradient background, large buttons, "New!" indicators
3. **Room Visualization** - SVG tile-based room preview (SNES RPG style)
4. **Map** - Interactive world map with clickable nodes
5. **Responsive** - Works on desktop (mobile optional but nice)

### **9. State Persistence**

**Must Save:**
- Player stats, inventory, XP, level
- World graph (entire procedural world)
- NPC states and positions
- Quest progress
- Visited locations, defeated NPCs
- Game settings

**Custom Serialization:**
```typescript
// Maps and Sets don't serialize to JSON by default
storage: {
  getItem: (name) => {
    const data = JSON.parse(localStorage.getItem(name));
    // Reconstruct Map<string, WorldNode>
    data.world.nodes = new Map(data.world.nodes);
    return data;
  },
  setItem: (name, value) => {
    // Convert Map to Array for JSON
    value.world.nodes = Array.from(value.world.nodes.entries());
    localStorage.setItem(name, JSON.stringify(value));
  }
}
```

---

## Historical Content Requirements

### **Historical Figures (Minimum)**
Each must include:
1. **Name and title**
2. **Why they were at 1889 Fair** (historical fact)
3. **Personality traits** (based on historical records)
4. **Famous quotes** or historical context
5. **Combat style** (verbal, based on their real personality)

**Examples:**
```typescript
{
  id: 'wilde',
  name: 'Oscar Wilde',
  title: 'The Irish Playwright',
  historicalContext: 'Oscar Wilde visited the 1889 Paris Exposition and was fascinated by the modern age while remaining critical of industrialization.',
  personality: 'Witty, flamboyant, aesthete who values beauty above all',
  combatStats: {
    wit: 90,
    charm: 85,
    moves: ['Wildean Epigram', 'Aesthetic Critique', 'Paradoxical Statement']
  }
}
```

### **Historical Locations (Minimum 7 Anchors)**
Each must include:
1. **Real historical name**
2. **Accurate description** of what was there in 1889
3. **Historical significance**
4. **Fun facts** or primary sources
5. **ASCII art** or visual description

**Example:**
```typescript
{
  id: 'gallery-machines',
  name: 'Gallery of Machines (Galerie des Machines)',
  description: 'An immense iron and glass structure spanning 420 meters, showcasing the industrial might of nations. Steam engines, dynamos, and mechanical marvels fill the vast space.',
  historicalContext: 'Built for the 1889 Exposition, it was the largest interior space in the world at the time. It showcased the Second Industrial Revolution and was later demolished in 1910.',
  discoveryXP: 50
}
```

### **Educational Features**
1. **Fact Check Panel** - Toggle to see historical accuracy
2. **Journal Entries** - Automatically document historical encounters
3. **Primary Sources** - Include actual historical quotes where possible
4. **Visual Indicators** - ⭐ for historical NPCs, ⚓ for real locations

---

## Gameplay Loop

The core loop must flow seamlessly:

```
1. START GAME
   ↓
2. See Main Quest: "Ascend the Eiffel Tower"
   ↓
3. See Available Destinations (auto-discovered from start)
   ↓
4. TRAVEL to location
   ↓
5. Gain XP for first visit (must work!)
   ↓
6. EXPLORE location (stat-based outcomes)
   ↓
7. Find NPCs, items, or historical facts
   ↓
8. TALK to NPCs or COMBAT (optional)
   ↓
9. Quest progress updates automatically
   ↓
10. Check Quest Tracker for next objective
    ↓
11. TRAVEL to next location
    ↓
12. REPEAT until Eiffel Tower summit reached
    ↓
13. WIN! (Quest completion rewards)
```

**Critical**: Every action should:
- Give XP (even small amounts)
- Provide feedback (log messages, UI updates)
- Progress quests if applicable
- Feel rewarding

---

## Visual Design Specifications

### **Color Palette**
```css
:root {
  --belle-burgundy: #800020;    /* Primary accent */
  --belle-gold: #D4AF37;         /* Secondary accent, highlights */
  --belle-sage: #9CAF88;         /* Tertiary, nature */
  --belle-cream: #FFF8E8;        /* Light bg, text on dark */
  --belle-navy: #1A1A2E;         /* Dark text */
  --paris-night: #0F0F1E;        /* Dark mode bg */
}
```

### **Typography**
```css
.font-display {
  font-family: 'Playfair Display', serif;  /* Titles, headings */
}

.font-body {
  font-family: 'Lora', serif;  /* Body text, dialogue */
}
```

### **Component Styling Examples**

**Ornate Border:**
```css
.ornate-border {
  border: 2px solid var(--belle-gold);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  position: relative;
}

.ornate-border::before {
  content: '◆';
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 0 8px;
  color: var(--belle-gold);
}
```

**Travel Button (Critical - Must be Prominent):**
```tsx
<button className="p-4 border-2 border-belle-gold hover:border-belle-burgundy 
  rounded-lg hover:bg-belle-gold/20 transition-all text-left group
  bg-gradient-to-br from-belle-gold/20 to-belle-burgundy/10">
  <div className="flex items-center gap-3">
    <div className="text-3xl">⚓</div>
    <div className="flex-1">
      <div className="font-display text-lg text-belle-burgundy group-hover:text-belle-burgundy">
        Eiffel Tower
      </div>
      <div className="text-xs text-belle-navy/70 capitalize">
        outdoor-promenade • ✨ New!
      </div>
    </div>
    <div className="text-2xl opacity-0 group-hover:opacity-100">→</div>
  </div>
</button>
```

### **Room Visualization (SVG Tiles)**
- 16x16 pixel tiles, scaled up
- SNES RPG aesthetic
- Tile types: floor, wall, door, window, furniture, feature
- Animated effects: candlelight, steam, particles
- Biome-specific colors

---

## Critical Implementation Bugs to AVOID

### ❌ **Bug #1: XP Never Awarded**
**Wrong:**
```typescript
targetNode.visited = true;
if (!targetNode.visited) {  // Always false!
  addXP(50);
}
```

**Correct:**
```typescript
const isFirstVisit = !targetNode.visited;
targetNode.visited = true;
if (isFirstVisit) {
  addXP(50);
}
```

### ❌ **Bug #2: Starting Node Not Visited**
**Wrong:**
```typescript
discovered: locationId === 'esplanade',
visited: false  // Player can't see where to go!
```

**Correct:**
```typescript
const isStartLocation = locationId === 'esplanade';
discovered: isStartLocation,
visited: isStartLocation  // Start location should be visited
```

### ❌ **Bug #3: No Adjacent Discovery**
**Problem:** Player can't see where they can go from start.

**Solution:** Auto-discover all nodes connected to starting position:
```typescript
function discoverAdjacentNodes(startNodeId: string) {
  const startNode = nodes.get(startNodeId);
  startNode.connections.forEach(connId => {
    const node = nodes.get(connId);
    if (node) node.discovered = true;
  });
}
```

### ❌ **Bug #4: World Lost on Reload**
**Problem:** Only persisting player data, not world graph.

**Solution:** Persist entire world with custom Map serialization (see State Persistence section).

---

## Testing Checklist

### **Functional Tests**
- [ ] Click "Start Game" - no errors, game loads
- [ ] See starting location (Esplanade)
- [ ] See 2-4 available destinations to travel to
- [ ] Click a destination - navigation works
- [ ] Get XP notification for first visit
- [ ] Click "Explore" - get outcome based on stats
- [ ] Click "Map" - see world map with clickable nodes
- [ ] Talk to an NPC - dialogue opens
- [ ] Challenge NPC to combat - combat starts
- [ ] Win combat - get rewards (XP, gold, reputation)
- [ ] Check Journal - see entries
- [ ] Reload page - progress is saved
- [ ] Quest tracker shows active objectives
- [ ] Quest auto-completes when objectives met
- [ ] Receive quest rewards

### **Educational Tests**
- [ ] Historical NPCs have accurate bios
- [ ] Locations have historical descriptions
- [ ] Can distinguish historical fact from fiction
- [ ] Fact-check panel works (if implemented)
- [ ] Journal preserves historical encounters

### **Visual Tests**
- [ ] Art Nouveau aesthetic achieved
- [ ] Colors match Belle Époque theme
- [ ] UI is clear and readable
- [ ] Travel section is prominent
- [ ] Room visualization displays correctly
- [ ] Dark mode works (if implemented)
- [ ] Responsive on desktop

### **Performance Tests**
- [ ] No lag when navigating
- [ ] No console errors
- [ ] Build completes without errors
- [ ] TypeScript compiles cleanly

---

## Evaluation Rubric

Score the implementation on a scale of 0-100:

### **Functionality (40 points)**
- Game starts without errors (10 pts)
- Movement and navigation work (10 pts)
- XP progression works (10 pts)
- State persists across reloads (10 pts)

### **Completeness (30 points)**
- Quest system implemented (10 pts)
- Combat system implemented (10 pts)
- Exploration system implemented (5 pts)
- Economy/shops implemented (5 pts)

### **Educational Value (15 points)**
- Historical accuracy (5 pts)
- Educational content surfaced (5 pts)
- Clear fact vs fiction (5 pts)

### **Polish (15 points)**
- Visual design matches specification (5 pts)
- UI/UX is intuitive (5 pts)
- No bugs or rough edges (5 pts)

**Total Score:**
- **90-100**: Excellent - Production ready
- **75-89**: Good - Playable with minor issues
- **60-74**: Acceptable - Core features work
- **Below 60**: Incomplete - Major systems missing or broken

---

## Stretch Goals (Bonus Points)

These are NOT required but demonstrate exceptional implementation:

1. **Tutorial Overlay** - Guided first-time experience
2. **Animated Transitions** - Smooth navigation between screens
3. **Sound Effects** - Subtle Belle Époque ambiance (optional)
4. **Mobile Responsive** - Works on phones/tablets
5. **Achievement System** - Unlock badges for accomplishments
6. **Multiple Endings** - Different outcomes based on choices
7. **AI-Powered NPC Dialogue** - Integration with LLM API
8. **Speedrun Mode** - Timer and leaderboard
9. **Historical Quiz** - Test knowledge for bonus XP
10. **Export Transcript** - Save gameplay journal as text

---

## Example User Flow (Must Work Exactly Like This)

```
1. User opens app → See beautiful title screen with Eiffel Tower ASCII art

2. Click "BEGIN YOUR JOURNEY"
   → Loading... (world generates)
   → Game screen appears

3. Sidebar shows:
   📜 Active Quests
   ⭐ Ascend the Eiffel Tower
     □ Visit the Eiffel Tower
     □ Reach the summit

4. Main view shows:
   ESPLANADE DES INVALIDES
   [SVG room visualization]
   "The grand entrance to the Exposition Universelle..."
   
   🚶 Travel To... (gradient background, prominent)
   [⚓ Eiffel Tower] → outdoor-promenade • ✨ New!
   [⚓ Gallery of Machines] → exhibition-hall • ✨ New!
   [✨ Hidden Garden] → garden • ✨ New!

5. Click [⚓ Eiffel Tower]
   → Log: "Traveling to Eiffel Tower..."
   → Log: "Discovered: Eiffel Tower! (+50 XP)" ✨
   → Log: "You arrive at Eiffel Tower." 📍
   → Quest updates: ✓ Visit the Eiffel Tower

6. New location shows NPCs:
   People Here (1)
   [Gustave Eiffel ⭐ Historical]
   "The Engineer, Age 57"
   [💬 Talk] [⚔️ Challenge]

7. Click [💬 Talk]
   → Dialogue modal opens
   → Can chat with Eiffel
   → Quest may progress

8. Click "Explore"
   → Perception check...
   → "Your keen perception revealed: Commemorative Medal! (+25 XP)" ✨
   → Item added to inventory

9. Open Map view
   → See world graph with nodes
   → Esplanade and Eiffel Tower marked as visited
   → New connected nodes visible
   → Can click to travel

10. Continue until reaching Eiffel Tower Summit
    → Quest Complete! 🏆
    → Rewards: +500 XP, +1000 francs, +50 reputation
    → Victory screen
```

**Every step must work flawlessly.**

---

## Deliverables

The LLM should produce:

1. **Complete Source Code**
   - All files in proper structure
   - TypeScript types defined
   - No placeholders or TODOs
   - Clean, commented code

2. **package.json** with all dependencies

3. **README.md** with:
   - Setup instructions
   - How to run
   - Game controls
   - Project structure

4. **Working Build**
   - `npm install` succeeds
   - `npm run build` succeeds (no errors)
   - `npm run dev` runs the game

5. **Historical Content**
   - At least 5 historical NPCs with bios
   - At least 7 historical locations
   - Historical context integrated

---

## Final Notes

**This is NOT a simple task.** A successful implementation requires:
- Strong TypeScript/React skills
- State management expertise
- Procedural generation algorithms
- Game design understanding
- Historical research
- UI/UX design sense
- Attention to detail

**Expected Time:** 6-12 hours for an experienced developer.

**Lines of Code:** Approximately 2,000-3,000 lines.

**Files:** 20-30 files.

This benchmark tests an LLM's ability to:
- Architect complex multi-system applications
- Maintain consistency across interconnected systems
- Balance competing requirements (fun, educational, beautiful)
- Implement sophisticated algorithms (procedural generation, stat-based outcomes)
- Create polished, production-ready code
- Avoid common pitfalls and subtle bugs

Good luck! 🎭🗼✨
