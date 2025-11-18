import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Player,
  GameScreen,
  GameView,
  LocationId,
  LogEntry,
  JournalEntry,
  CombatState,
  GameSettings,
  Item,
  GameEvent,
  NPCId,
} from '../types/game';
import { LOCATIONS } from '../constants/locations';
import { NPCS } from '../constants/npcs';
import { getAvailableMoves } from '../constants/combatMoves';

interface GameState {
  // Screen & View Management
  currentScreen: GameScreen;
  currentView: GameView;
  setScreen: (screen: GameScreen) => void;
  setView: (view: GameView) => void;

  // Player
  player: Player;
  updatePlayer: (updates: Partial<Player>) => void;
  addXP: (amount: number) => void;
  takeDamage: (stat: 'wit' | 'stamina' | 'charm', amount: number) => void;
  heal: (stat: 'wit' | 'stamina' | 'charm', amount: number) => void;
  addItem: (item: Item) => void;
  removeItem: (itemId: string) => void;
  changeLocation: (locationId: LocationId) => void;

  // Game Log
  gameLog: LogEntry[];
  addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  clearLog: () => void;

  // Journal
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => void;

  // Combat
  combatState: CombatState | null;
  startCombat: (opponentId: NPCId) => void;
  endCombat: (victory: boolean) => void;
  executeCombatMove: (moveId: string) => void;

  // Events
  activeEvent: GameEvent | null;
  completedEvents: string[];
  triggerEvent: (event: GameEvent) => void;
  resolveEvent: (choiceIndex: number) => void;

  // Game State
  turnCount: number;
  daysPassed: number;
  gameStarted: boolean;
  gameOver: boolean;
  gameOverReason?: string;
  startGame: () => void;
  endGame: (reason: string) => void;

  // Settings
  settings: GameSettings;
  updateSettings: (updates: Partial<GameSettings>) => void;

  // Save/Load
  saveGame: () => void;
  loadGame: (save: any) => void;
  exportTranscript: () => string;

  // Fact Check Panel
  factCheckVisible: boolean;
  setFactCheckVisible: (visible: boolean) => void;

  // Book Reader
  readingBook: Item | null;
  setReadingBook: (book: Item | null) => void;
}

const initialPlayer: Player = {
  name: 'Henry James',
  title: 'The American Novelist',
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  stats: {
    wit: 50,
    erudition: 60,
    charm: 55,
    perception: 50,
    stamina: 40,
  },
  maxStats: {
    wit: 50,
    erudition: 60,
    charm: 55,
    perception: 50,
    stamina: 40,
  },
  location: 'esplanade',
  inventory: [],
  gold: 500, // Starting francs
  reputation: 50,
  relationships: {},
  journalEntries: [],
  achievements: [],
  visitedLocations: new Set(['esplanade']),
  defeatedNPCs: new Set(),
};

const initialSettings: GameSettings = {
  theme: 'light',
  textSpeed: 50,
  showHistoricalContext: true,
  autoSave: true,
  difficulty: 'expatriate',
  accessibilityMode: false,
  enableFactCheck: true,
  enableAnimations: true,
  fontSize: 'medium',
  colorblindMode: false,
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentScreen: 'title',
      currentView: 'main',
      player: initialPlayer,
      gameLog: [],
      combatState: null,
      activeEvent: null,
      completedEvents: [],
      turnCount: 0,
      daysPassed: 0,
      gameStarted: false,
      gameOver: false,
      settings: initialSettings,
      factCheckVisible: false,
      readingBook: null,

      // Screen & View
      setScreen: (screen) => set({ currentScreen: screen }),
      setView: (view) => set({ currentView: view }),

      // Player actions
      updatePlayer: (updates) =>
        set((state) => ({
          player: { ...state.player, ...updates },
        })),

      addXP: (amount) =>
        set((state) => {
          const newXP = state.player.xp + amount;
          let newLevel = state.player.level;
          let xpToNextLevel = state.player.xpToNextLevel;

          // Level up logic
          if (newXP >= xpToNextLevel) {
            newLevel += 1;
            const statIncrease = 5;
            const newMaxStats = {
              wit: state.player.maxStats.wit + statIncrease,
              erudition: state.player.maxStats.erudition + statIncrease,
              charm: state.player.maxStats.charm + statIncrease,
              perception: state.player.maxStats.perception + statIncrease,
              stamina: state.player.maxStats.stamina + statIncrease,
            };

            get().addLog({
              type: 'success',
              message: `Level Up! You are now level ${newLevel}. All stats increased by ${statIncrease}.`,
              icon: '⭐',
            });

            return {
              player: {
                ...state.player,
                xp: newXP,
                level: newLevel,
                xpToNextLevel: xpToNextLevel + 50 * newLevel,
                stats: newMaxStats,
                maxStats: newMaxStats,
              },
            };
          }

          return {
            player: { ...state.player, xp: newXP },
          };
        }),

      takeDamage: (stat, amount) =>
        set((state) => {
          const newValue = Math.max(0, state.player.stats[stat] - amount);
          return {
            player: {
              ...state.player,
              stats: { ...state.player.stats, [stat]: newValue },
            },
          };
        }),

      heal: (stat, amount) =>
        set((state) => {
          const newValue = Math.min(
            state.player.maxStats[stat],
            state.player.stats[stat] + amount
          );
          return {
            player: {
              ...state.player,
              stats: { ...state.player.stats, [stat]: newValue },
            },
          };
        }),

      addItem: (item) =>
        set((state) => ({
          player: {
            ...state.player,
            inventory: [...state.player.inventory, item],
          },
        })),

      removeItem: (itemId) =>
        set((state) => ({
          player: {
            ...state.player,
            inventory: state.player.inventory.filter((i) => i.id !== itemId),
          },
        })),

      changeLocation: (locationId) =>
        set((state) => {
          const location = LOCATIONS[locationId];
          const visitedLocations = new Set(state.player.visitedLocations);
          const isNewLocation = !visitedLocations.has(locationId);

          if (isNewLocation) {
            visitedLocations.add(locationId);
            get().addXP(location.discoveryXP);
            get().addLog({
              type: 'success',
              message: `Discovered: ${location.name}! (+${location.discoveryXP} XP)`,
              icon: '🗺️',
            });
          }

          get().addLog({
            type: 'info',
            message: `You arrive at ${location.name}.`,
            icon: '📍',
          });

          return {
            player: {
              ...state.player,
              location: locationId,
              visitedLocations,
            },
          };
        }),

      // Game Log
      addLog: (entry) =>
        set((state) => ({
          gameLog: [
            ...state.gameLog,
            {
              ...entry,
              id: `log-${Date.now()}-${Math.random()}`,
              timestamp: Date.now(),
            },
          ],
        })),

      clearLog: () => set({ gameLog: [] }),

      // Journal
      addJournalEntry: (entry) =>
        set((state) => ({
          player: {
            ...state.player,
            journalEntries: [
              ...state.player.journalEntries,
              {
                ...entry,
                id: `journal-${Date.now()}-${Math.random()}`,
                timestamp: Date.now(),
              },
            ],
          },
        })),

      // Combat
      startCombat: (opponentId) =>
        set((state) => {
          const opponent = NPCS[opponentId];
          if (!opponent) return state;

          const availableMoves = getAvailableMoves(
            state.player.level,
            state.player.stats.erudition
          );

          get().addLog({
            type: 'combat',
            message: `A battle of wits begins with ${opponent.name}!`,
            icon: '⚔️',
          });

          return {
            combatState: {
              active: true,
              opponent,
              playerHealth: 100,
              opponentHealth: 100,
              turn: 'player',
              log: [`${opponent.name} approaches with ${opponent.title} bearing.`],
              availableMoves,
            },
            currentView: 'combat',
          };
        }),

      executeCombatMove: (moveId) =>
        set((state) => {
          if (!state.combatState || state.combatState.turn !== 'player') return state;

          const move = state.combatState.availableMoves.find((m) => m.id === moveId);
          if (!move) return state;

          // Player's move
          const damage = move.witDamage + move.charmDamage;
          const newOpponentHealth = Math.max(0, state.combatState.opponentHealth - damage);
          const newPlayerWit = state.player.stats.wit - move.witCost;

          const newLog = [
            ...state.combatState.log,
            `You use ${move.name}! ${move.quote || ''}`,
            `${state.combatState.opponent.name} takes ${damage} damage!`,
          ];

          // Check for victory
          if (newOpponentHealth <= 0) {
            get().endCombat(true);
            return state;
          }

          // Opponent's move (simplified)
          const opponentMove =
            state.combatState.opponent.combatStats.moves[
              Math.floor(Math.random() * state.combatState.opponent.combatStats.moves.length)
            ];
          const opponentDamage = opponentMove.witDamage + opponentMove.charmDamage;
          const newPlayerHealth = Math.max(0, state.combatState.playerHealth - opponentDamage);

          newLog.push(
            `${state.combatState.opponent.name} uses ${opponentMove.name}!`,
            `You take ${opponentDamage} damage!`
          );

          // Check for defeat
          if (newPlayerHealth <= 0) {
            get().endCombat(false);
            return state;
          }

          return {
            combatState: {
              ...state.combatState,
              playerHealth: newPlayerHealth,
              opponentHealth: newOpponentHealth,
              log: newLog,
            },
            player: {
              ...state.player,
              stats: { ...state.player.stats, wit: newPlayerWit },
            },
          };
        }),

      endCombat: (victory) =>
        set((state) => {
          if (!state.combatState) return state;

          if (victory) {
            const xpReward = state.player.level * 50;
            const goldReward = 50;

            get().addXP(xpReward);
            get().addLog({
              type: 'success',
              message: `Victory! Earned ${xpReward} XP and ${goldReward} francs.`,
              icon: '🏆',
            });

            const defeatedNPCs = new Set(state.player.defeatedNPCs);
            defeatedNPCs.add(state.combatState.opponent.id);

            return {
              combatState: null,
              currentView: 'main',
              player: {
                ...state.player,
                gold: state.player.gold + goldReward,
                defeatedNPCs,
              },
            };
          } else {
            get().addLog({
              type: 'warning',
              message: 'Defeated in battle! Your reputation takes a hit.',
              icon: '💔',
            });

            return {
              combatState: null,
              currentView: 'main',
              player: {
                ...state.player,
                reputation: Math.max(0, state.player.reputation - 10),
              },
            };
          }
        }),

      // Events
      triggerEvent: (event) => set({ activeEvent: event, currentView: 'event' }),

      resolveEvent: (choiceIndex) =>
        set((state) => {
          if (!state.activeEvent) return state;

          const choice = state.activeEvent.choices[choiceIndex];
          if (!choice) return state;

          // Check requirements
          if (choice.requirements) {
            const req = choice.requirements;
            if (req.stat && req.minValue) {
              if (state.player.stats[req.stat] < req.minValue) {
                get().addLog({
                  type: 'warning',
                  message: `You lack the required ${req.stat} (need ${req.minValue}).`,
                  icon: '⚠️',
                });
                return state;
              }
            }
          }

          // Apply effects
          const effects = choice.outcome.effects;
          if (effects.xp) get().addXP(effects.xp);
          if (effects.gold) {
            get().updatePlayer({ gold: state.player.gold + effects.gold });
          }
          if (effects.reputation) {
            get().updatePlayer({
              reputation: state.player.reputation + effects.reputation,
            });
          }
          if (effects.stats) {
            const newStats = { ...state.player.stats };
            Object.entries(effects.stats).forEach(([stat, value]) => {
              newStats[stat as keyof typeof newStats] += value;
            });
            get().updatePlayer({ stats: newStats });
          }
          if (effects.relationship) {
            const relationships = { ...state.player.relationships };
            const current = relationships[effects.relationship.npc] || 0;
            relationships[effects.relationship.npc] = current + effects.relationship.change;
            get().updatePlayer({ relationships });
          }

          get().addLog({
            type: 'info',
            message: choice.outcome.description,
            icon: '📖',
          });

          get().addJournalEntry({
            type: 'event',
            title: state.activeEvent.title,
            content: `${state.activeEvent.description}\n\nYou chose: ${choice.text}\n\n${choice.outcome.description}`,
            location: state.player.location,
          });

          return {
            activeEvent: null,
            currentView: 'main',
            completedEvents: state.activeEvent.oneTime
              ? [...state.completedEvents, state.activeEvent.id]
              : state.completedEvents,
          };
        }),

      // Game State
      startGame: () =>
        set({
          gameStarted: true,
          currentScreen: 'game',
          gameLog: [
            {
              id: 'welcome',
              timestamp: Date.now(),
              type: 'system',
              message: 'Welcome to the 1889 Paris World\'s Fair, Mr. James.',
              icon: '🎭',
            },
          ],
        }),

      endGame: (reason) => set({ gameOver: true, gameOverReason: reason }),

      // Settings
      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),

      // Save/Load
      saveGame: () => {
        const state = get();
        const save = {
          version: '1.0.0',
          timestamp: Date.now(),
          player: state.player,
          gameLog: state.gameLog,
          completedEvents: state.completedEvents,
          turnCount: state.turnCount,
          daysPassed: state.daysPassed,
        };
        localStorage.setItem('henryJamesSave', JSON.stringify(save));
        get().addLog({
          type: 'system',
          message: 'Game saved successfully.',
          icon: '💾',
        });
      },

      loadGame: (save) => {
        set({
          player: save.player,
          gameLog: save.gameLog,
          completedEvents: save.completedEvents,
          turnCount: save.turnCount,
          daysPassed: save.daysPassed,
          gameStarted: true,
          currentScreen: 'game',
        });
      },

      exportTranscript: () => {
        const state = get();
        const transcript = state.gameLog
          .map((entry) => {
            const time = new Date(entry.timestamp).toLocaleTimeString();
            return `[${time}] ${entry.icon} ${entry.message}`;
          })
          .join('\n');

        return `HENRY JAMES AT THE 1889 WORLD'S FAIR - Game Transcript
Generated: ${new Date().toLocaleString()}
=====================================\n\n${transcript}`;
      },

      // UI State
      setFactCheckVisible: (visible) => set({ factCheckVisible: visible }),
      setReadingBook: (book) => set({ readingBook: book, currentView: book ? 'book-reader' : 'main' }),
    }),
    {
      name: 'henry-james-game',
      partialize: (state) => ({
        player: state.player,
        settings: state.settings,
        completedEvents: state.completedEvents,
      }),
    }
  )
);
