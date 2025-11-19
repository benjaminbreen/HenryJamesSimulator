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
import type { WorldGraph, WorldNode } from '../types/procedural';
import type { AgenticNPC } from '../types/npc';
import type { Quest, QuestObjective } from '../types/quest';
import { MAIN_QUEST, STARTER_QUESTS } from '../types/quest';
import { LOCATIONS } from '../constants/locations';
import { NPCS } from '../constants/npcs';
import { getAvailableMoves } from '../constants/combatMoves';
import { generateWorld } from '../systems/worldGenerator';
import { NPCAgentSystem } from '../systems/npcAgentSystem';
import { geminiService } from '../services/geminiService';

// Global NPC agent system (not persisted)
let npcAgentSystem: NPCAgentSystem | null = null;

interface GameState {
  // Screen & View Management
  currentScreen: GameScreen;
  currentView: GameView;
  setScreen: (screen: GameScreen) => void;
  setView: (view: GameView) => void;

  // Procedural World
  world: WorldGraph | null;
  currentNodeId: string;
  generateNewWorld: (seed?: string) => void;
  moveToNode: (nodeId: string) => void;
  discoverNode: (nodeId: string) => void;
  getCurrentNode: () => WorldNode | null;

  // Agentic NPCs
  agenticNPCs: Map<string, AgenticNPC>;
  getNPC: (npcId: string) => AgenticNPC | undefined;
  getNPCsInNode: (nodeId: string) => AgenticNPC[];
  updateNPC: (npcId: string, updates: Partial<AgenticNPC>) => void;

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

  // NPC Dialogue
  activeDialogue: {
    npcId: string;
    conversationHistory: Array<{
      speaker: 'player' | 'npc';
      message: string;
      timestamp: number;
    }>;
  } | null;
  startDialogue: (npcId: string) => void;
  sendDialogueMessage: (message: string) => Promise<void>;
  endDialogue: () => void;
  isDialogueLoading: boolean;

  // Quest System
  quests: Quest[];
  activeQuests: Quest[];
  completedQuests: Quest[];
  addQuest: (quest: Quest) => void;
  updateQuestObjective: (questId: string, objectiveId: string, completed: boolean) => void;
  completeQuest: (questId: string) => void;
  checkQuestProgress: (nodeId?: string, npcId?: string, action?: string) => void;
  getActiveObjectives: () => QuestObjective[];
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
      world: null,
      currentNodeId: 'esplanade',
      agenticNPCs: new Map(),
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
      activeDialogue: null,
      isDialogueLoading: false,
      quests: [],
      activeQuests: [],
      completedQuests: [],

      // Screen & View
      setScreen: (screen) => set({ currentScreen: screen }),
      setView: (view) => set({ currentView: view }),

      // Procedural World
      generateNewWorld: (seed?: string) => {
        const { world, npcs } = generateWorld({
          seed,
          depth: 10,
          branchingFactor: 3,
          npcSpawnChance: 0.7,
          itemDensity: 0.6,
          eventFrequency: 0.5,
        });

        get().addLog({
          type: 'system',
          message: `A new world unfolds before you. (Seed: ${world.seed.slice(0, 8)}..., ${npcs.size} NPCs)`,
          icon: '🗺️',
        });

        // Initialize and start NPC agent system
        if (npcAgentSystem) {
          npcAgentSystem.stop();
        }
        npcAgentSystem = new NPCAgentSystem(world);

        // Register all NPCs with the agent system
        npcs.forEach((npc) => {
          npcAgentSystem!.registerNPC(npc);
        });

        // Start the agent system
        npcAgentSystem.start();

        set({
          world,
          currentNodeId: world.startNodeId,
          agenticNPCs: npcs,
        });
      },

      moveToNode: (nodeId: string) => {
        const { world, currentNodeId } = get();
        if (!world) return;

        const currentNode = world.nodes.get(currentNodeId);
        const targetNode = world.nodes.get(nodeId);

        if (!currentNode || !targetNode) return;

        // Check if nodes are connected
        if (!currentNode.connections.includes(nodeId)) {
          get().addLog({
            type: 'warning',
            message: 'You cannot reach that location from here.',
            icon: '🚫',
          });
          return;
        }

        // Check if this is first visit BEFORE marking as visited
        const isFirstVisit = !targetNode.visited;

        // Discover and reveal target node
        targetNode.discovered = true;
        targetNode.visited = true;

        // Discover connected nodes (fog of war reveal)
        targetNode.connections.forEach(connId => {
          const connNode = world.nodes.get(connId);
          if (connNode && !connNode.discovered) {
            connNode.discovered = true;
          }
        });

        // Award XP for first visit
        if (isFirstVisit) {
          const xpReward = targetNode.type === 'anchor' ? 50 : 25;
          get().addXP(xpReward);
          get().addLog({
            type: 'success',
            message: `Discovered: ${targetNode.name}! (+${xpReward} XP)`,
            icon: '✨',
          });
        }

        get().addLog({
          type: 'info',
          message: `You arrive at ${targetNode.name}.`,
          icon: '📍',
        });

        set({ currentNodeId: nodeId });

        // Check quest progress for visiting this node
        get().checkQuestProgress(nodeId);
      },

      discoverNode: (nodeId: string) => {
        const { world } = get();
        if (!world) return;

        const node = world.nodes.get(nodeId);
        if (node) {
          node.discovered = true;
        }
      },

      getCurrentNode: () => {
        const { world, currentNodeId } = get();
        if (!world) return null;
        return world.nodes.get(currentNodeId) || null;
      },

      // Agentic NPC methods
      getNPC: (npcId: string) => {
        return get().agenticNPCs.get(npcId);
      },

      getNPCsInNode: (nodeId: string) => {
        const npcs = Array.from(get().agenticNPCs.values());
        return npcs.filter((npc) => npc.position.nodeId === nodeId);
      },

      updateNPC: (npcId: string, updates: Partial<AgenticNPC>) => {
        const npcs = get().agenticNPCs;
        const npc = npcs.get(npcId);
        if (npc) {
          const updatedNPC = { ...npc, ...updates };
          npcs.set(npcId, updatedNPC);
          set({ agenticNPCs: new Map(npcs) });

          // Update in agent system too
          if (npcAgentSystem) {
            npcAgentSystem.registerNPC(updatedNPC);
          }
        }
      },

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

          const opponent = state.combatState.opponent;

          if (victory) {
            // Scale rewards by player level and opponent difficulty
            const xpReward = state.player.level * 50 + 100;
            const goldReward = Math.floor(Math.random() * 100) + 50;
            const reputationBonus = 5;

            get().addXP(xpReward);
            get().addLog({
              type: 'success',
              message: `Victory! You bested ${opponent.name} in a battle of wits!`,
              icon: '🏆',
            });

            get().addLog({
              type: 'success',
              message: `Rewards: +${xpReward} XP, +${goldReward} francs, +${reputationBonus} reputation`,
              icon: '💰',
            });

            const defeatedNPCs = new Set(state.player.defeatedNPCs);
            defeatedNPCs.add(opponent.id);

            // Add journal entry for memorable victory
            get().addJournalEntry({
              type: 'combat',
              title: `Victory over ${opponent.name}`,
              content: `I engaged in a spirited verbal duel with ${opponent.name}, ${opponent.title}. Through superior wit and literary references, I emerged victorious. ${opponent.historicalContext || ''}`,
              location: state.player.location,
            });

            // Check for quest progress (combat objectives)
            get().checkQuestProgress(undefined, opponent.id, 'combat');

            return {
              combatState: null,
              currentView: 'main',
              player: {
                ...state.player,
                gold: state.player.gold + goldReward,
                reputation: state.player.reputation + reputationBonus,
                defeatedNPCs,
              },
            };
          } else {
            get().addLog({
              type: 'warning',
              message: `Defeated by ${opponent.name}! Your reputation takes a hit, but you learned something valuable.`,
              icon: '💔',
            });

            // Small consolation XP for the attempt
            const consolationXP = 10;
            get().addXP(consolationXP);

            get().addJournalEntry({
              type: 'combat',
              title: `Defeat at the hands of ${opponent.name}`,
              content: `My encounter with ${opponent.name} did not go as planned. I was outmatched in this battle of wits. I must improve my skills before challenging them again.`,
              location: state.player.location,
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
      startGame: () => {
        // Generate procedural world
        get().generateNewWorld();

        // Initialize quests
        const initialQuests = [MAIN_QUEST, ...STARTER_QUESTS];
        const activeQuests = initialQuests.filter(q => q.status === 'active');

        set({
          gameStarted: true,
          currentScreen: 'game',
          quests: initialQuests,
          activeQuests,
          completedQuests: [],
          gameLog: [
            {
              id: 'welcome',
              timestamp: Date.now(),
              type: 'system',
              message: 'Welcome to the 1889 Paris World\'s Fair, Mr. James.',
              icon: '🎭',
            },
          ],
        });

        // Add quest notifications
        get().addLog({
          type: 'success',
          message: 'Quest Started: Ascend the Eiffel Tower',
          icon: '📜',
        });
      },

      endGame: (reason) => {
        // Stop NPC agent system
        if (npcAgentSystem) {
          npcAgentSystem.stop();
        }
        set({ gameOver: true, gameOverReason: reason });
      },

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

      // NPC Dialogue
      startDialogue: (npcId: string) => {
        const npc = get().agenticNPCs.get(npcId);
        if (!npc) {
          console.error('NPC not found:', npcId);
          return;
        }

        set({
          activeDialogue: {
            npcId,
            conversationHistory: [],
          },
        });

        get().addLog({
          type: 'info',
          message: `You begin a conversation with ${npc.name}.`,
          icon: '💬',
        });

        // Check quest progress for talking to this NPC
        get().checkQuestProgress(undefined, npcId);
      },

      sendDialogueMessage: async (message: string) => {
        const { activeDialogue, agenticNPCs, player, world, currentNodeId } = get();
        if (!activeDialogue) return;

        const npc = agenticNPCs.get(activeDialogue.npcId);
        if (!npc) return;

        const currentNode = world?.nodes.get(currentNodeId);
        if (!currentNode) return;

        // Add player message to history
        const playerMessage = {
          speaker: 'player' as const,
          message,
          timestamp: Date.now(),
        };

        set({
          activeDialogue: {
            ...activeDialogue,
            conversationHistory: [...activeDialogue.conversationHistory, playerMessage],
          },
          isDialogueLoading: true,
        });

        try {
          // Call Gemini API
          const response = await geminiService.generateDialogue({
            npc,
            playerMessage: message,
            playerName: player.name,
            playerProfession: player.title,
            locationName: currentNode.name,
            locationDescription: currentNode.description,
          });

          // Add NPC response to history
          const npcMessage = {
            speaker: 'npc' as const,
            message: response.message,
            timestamp: Date.now(),
          };

          set({
            activeDialogue: {
              ...activeDialogue,
              conversationHistory: [
                ...get().activeDialogue!.conversationHistory,
                npcMessage,
              ],
            },
            isDialogueLoading: false,
          });

          // Update NPC state based on response
          if (response.mood) {
            get().updateNPC(npc.id, { mood: response.mood });
          }

          if (response.newThought) {
            const updatedNPC = get().agenticNPCs.get(npc.id);
            if (updatedNPC) {
              get().updateNPC(npc.id, {
                recentThoughts: [response.newThought, ...updatedNPC.recentThoughts.slice(0, 4)],
              });
            }
          }

          // Add to NPC's conversation history
          get().updateNPC(npc.id, {
            conversationHistory: [
              ...npc.conversationHistory,
              {
                with: player.name,
                timestamp: Date.now(),
                summary: `Discussed: ${message.slice(0, 50)}...`,
              },
            ],
          });

          // Award small XP for conversation
          get().addXP(5);

        } catch (error) {
          console.error('Error in dialogue:', error);

          // Fallback response
          const fallbackMessage = {
            speaker: 'npc' as const,
            message: `I... forgive me, I seem to have lost my train of thought. Perhaps we could speak again later?`,
            timestamp: Date.now(),
          };

          set({
            activeDialogue: {
              ...activeDialogue,
              conversationHistory: [
                ...get().activeDialogue!.conversationHistory,
                fallbackMessage,
              ],
            },
            isDialogueLoading: false,
          });

          get().addLog({
            type: 'warning',
            message: 'The conversation encountered an issue.',
            icon: '⚠️',
          });
        }
      },

      endDialogue: () => {
        const { activeDialogue, agenticNPCs } = get();
        if (!activeDialogue) return;

        const npc = agenticNPCs.get(activeDialogue.npcId);
        if (npc && activeDialogue.conversationHistory.length > 0) {
          get().addLog({
            type: 'success',
            message: `Your conversation with ${npc.name} has concluded.`,
            icon: '👋',
          });
        }

        set({ activeDialogue: null, isDialogueLoading: false });
      },

      // Quest System
      addQuest: (quest: Quest) => {
        set((state) => {
          const quests = [...state.quests, { ...quest, status: 'active' as const }];
          const activeQuests = quests.filter(q => q.status === 'active');
          return { quests, activeQuests };
        });

        get().addLog({
          type: 'success',
          message: `New Quest: ${quest.title}`,
          icon: '📜',
        });

        get().addJournalEntry({
          type: 'event',
          title: quest.title,
          content: quest.description,
          location: get().player.location,
        });
      },

      updateQuestObjective: (questId: string, objectiveId: string, completed: boolean) => {
        set((state) => {
          const quests = state.quests.map(quest => {
            if (quest.id === questId) {
              const objectives = quest.objectives.map(obj =>
                obj.id === objectiveId ? { ...obj, completed } : obj
              );

              // Check if all required objectives are complete
              const allComplete = objectives
                .filter(obj => !obj.optional)
                .every(obj => obj.completed);

              return {
                ...quest,
                objectives,
                status: allComplete ? 'completed' as const : quest.status,
              };
            }
            return quest;
          });

          const activeQuests = quests.filter(q => q.status === 'active');
          const completedQuests = quests.filter(q => q.status === 'completed');

          return { quests, activeQuests, completedQuests };
        });
      },

      completeQuest: (questId: string) => {
        const quest = get().quests.find(q => q.id === questId);
        if (!quest || quest.status === 'completed') return;

        // Award rewards
        if (quest.rewards.xp) get().addXP(quest.rewards.xp);
        if (quest.rewards.gold) {
          get().updatePlayer({ gold: get().player.gold + quest.rewards.gold });
        }
        if (quest.rewards.reputation) {
          get().updatePlayer({
            reputation: get().player.reputation + quest.rewards.reputation,
          });
        }
        if (quest.rewards.items) {
          quest.rewards.items.forEach(itemId => {
            // Award items (simplified for now)
            get().addLog({
              type: 'success',
              message: `Received: ${itemId}`,
              icon: '🎁',
            });
          });
        }

        get().addLog({
          type: 'success',
          message: `Quest Completed: ${quest.title}!`,
          icon: '🏆',
        });

        if (quest.rewards.xp || quest.rewards.gold) {
          get().addLog({
            type: 'success',
            message: `Rewards: ${quest.rewards.xp ? `+${quest.rewards.xp} XP` : ''} ${quest.rewards.gold ? `+${quest.rewards.gold} francs` : ''}`,
            icon: '💰',
          });
        }

        get().addJournalEntry({
          type: 'event',
          title: `${quest.title} - Completed`,
          content: `You have completed this quest and earned your rewards.`,
          location: get().player.location,
        });

        set((state) => {
          const quests = state.quests.map(q =>
            q.id === questId ? { ...q, status: 'completed' as const, completedAt: Date.now() } : q
          );
          const activeQuests = quests.filter(q => q.status === 'active');
          const completedQuests = quests.filter(q => q.status === 'completed');
          return { quests, activeQuests, completedQuests };
        });
      },

      checkQuestProgress: (nodeId?: string, npcId?: string, action?: string) => {
        const { quests, currentNodeId } = get();
        const currentNode = nodeId || currentNodeId;

        quests.forEach(quest => {
          if (quest.status !== 'active') return;

          quest.objectives.forEach(objective => {
            if (objective.completed) return;

            // Check visit objectives
            if (objective.type === 'visit' && objective.targetId === currentNode) {
              get().updateQuestObjective(quest.id, objective.id, true);
              get().addLog({
                type: 'success',
                message: `Objective Complete: ${objective.description}`,
                icon: '✓',
              });
            }

            // Check talk objectives
            if (objective.type === 'talk' && npcId) {
              if (objective.targetId === npcId) {
                get().updateQuestObjective(quest.id, objective.id, true);
                get().addLog({
                  type: 'success',
                  message: `Objective Complete: ${objective.description}`,
                  icon: '✓',
                });
              } else if (objective.targetCount && objective.currentCount !== undefined) {
                // Count-based objectives
                const newCount = objective.currentCount + 1;
                const updatedObjective = { ...objective, currentCount: newCount };

                if (newCount >= objective.targetCount) {
                  get().updateQuestObjective(quest.id, objective.id, true);
                  get().addLog({
                    type: 'success',
                    message: `Objective Complete: ${objective.description}`,
                    icon: '✓',
                  });
                } else {
                  // Update count without completing
                  set(state => ({
                    quests: state.quests.map(q =>
                      q.id === quest.id
                        ? {
                            ...q,
                            objectives: q.objectives.map(obj =>
                              obj.id === objective.id ? updatedObjective : obj
                            ),
                          }
                        : q
                    ),
                  }));
                }
              }
            }

            // Check explore objectives
            if (objective.type === 'explore' && action === 'explore') {
              if (objective.targetCount && objective.currentCount !== undefined) {
                const newCount = objective.currentCount + 1;
                const updatedObjective = { ...objective, currentCount: newCount };

                if (newCount >= objective.targetCount) {
                  get().updateQuestObjective(quest.id, objective.id, true);
                  get().addLog({
                    type: 'success',
                    message: `Objective Complete: ${objective.description}`,
                    icon: '✓',
                  });
                } else {
                  set(state => ({
                    quests: state.quests.map(q =>
                      q.id === quest.id
                        ? {
                            ...q,
                            objectives: q.objectives.map(obj =>
                              obj.id === objective.id ? updatedObjective : obj
                            ),
                          }
                        : q
                    ),
                  }));
                }
              }
            }
          });

          // Check if quest is now complete
          const allComplete = quest.objectives
            .filter(obj => !obj.optional)
            .every(obj => obj.completed);

          if (allComplete) {
            get().completeQuest(quest.id);
          }
        });
      },

      getActiveObjectives: () => {
        const activeQuests = get().activeQuests;
        const objectives: QuestObjective[] = [];

        activeQuests.forEach(quest => {
          quest.objectives.forEach(obj => {
            if (!obj.completed) {
              objectives.push(obj);
            }
          });
        });

        return objectives;
      },
    }),
    {
      name: 'henry-james-game',
      partialize: (state) => ({
        player: state.player,
        settings: state.settings,
        completedEvents: state.completedEvents,
        world: state.world,
        currentNodeId: state.currentNodeId,
        agenticNPCs: state.agenticNPCs,
        quests: state.quests,
        activeQuests: state.activeQuests,
        completedQuests: state.completedQuests,
        gameStarted: state.gameStarted,
        turnCount: state.turnCount,
        daysPassed: state.daysPassed,
      }),
      // Custom serialization for Maps
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const { state } = JSON.parse(str);

          // Reconstruct Map for agenticNPCs
          if (state.agenticNPCs && Array.isArray(state.agenticNPCs)) {
            state.agenticNPCs = new Map(state.agenticNPCs);
          }

          // Reconstruct Map for world.nodes
          if (state.world?.nodes && Array.isArray(state.world.nodes)) {
            state.world.nodes = new Map(state.world.nodes);
          }

          // Reconstruct Sets in player
          if (state.player?.visitedLocations && Array.isArray(state.player.visitedLocations)) {
            state.player.visitedLocations = new Set(state.player.visitedLocations);
          }
          if (state.player?.defeatedNPCs && Array.isArray(state.player.defeatedNPCs)) {
            state.player.defeatedNPCs = new Set(state.player.defeatedNPCs);
          }

          return { state };
        },
        setItem: (name, value) => {
          const { state } = value;

          // Convert Map to Array for serialization
          const serializable = {
            ...state,
            agenticNPCs: state.agenticNPCs ? Array.from(state.agenticNPCs.entries()) : [],
            world: state.world ? {
              ...state.world,
              nodes: Array.from(state.world.nodes.entries()),
            } : null,
            player: state.player ? {
              ...state.player,
              visitedLocations: Array.from(state.player.visitedLocations),
              defeatedNPCs: Array.from(state.player.defeatedNPCs),
            } : state.player,
          };

          localStorage.setItem(name, JSON.stringify({ state: serializable }));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
