import type { AgenticNPC, Goal, HistoryEvent } from '../types/npc';
import type { WorldGraph } from '../types/procedural';
import { SeededRandom } from '../utils/seededRandom';

export class NPCAgentSystem {
  private npcs: Map<string, AgenticNPC>;
  private world: WorldGraph;
  private updateInterval: number = 2000; // Update every 2 seconds
  private intervalId: number | null = null;

  constructor(world: WorldGraph) {
    this.npcs = new Map();
    this.world = world;
  }

  registerNPC(npc: AgenticNPC) {
    this.npcs.set(npc.id, npc);
  }

  unregisterNPC(npcId: string) {
    this.npcs.delete(npcId);
  }

  getNPC(npcId: string): AgenticNPC | undefined {
    return this.npcs.get(npcId);
  }

  getAllNPCs(): AgenticNPC[] {
    return Array.from(this.npcs.values());
  }

  getNPCsInNode(nodeId: string): AgenticNPC[] {
    return Array.from(this.npcs.values()).filter(
      (npc) => npc.position.nodeId === nodeId
    );
  }

  start() {
    if (this.intervalId !== null) return;

    this.intervalId = window.setInterval(() => {
      this.updateAllNPCs();
    }, this.updateInterval);
  }

  stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private updateAllNPCs() {
    const currentHour = new Date().getHours();

    for (const npc of this.npcs.values()) {
      this.updateNPC(npc, currentHour);
    }
  }

  private updateNPC(npc: AgenticNPC, currentHour: number) {
    // Update based on schedule
    this.updateSchedule(npc, currentHour);

    // Process current goal
    if (npc.currentGoal && !npc.currentGoal.completed) {
      this.processGoal(npc);
    } else {
      this.selectNextGoal(npc);
    }

    // Update movement
    if (npc.path.length > 0) {
      this.updateMovement(npc);
    } else if (npc.currentGoal) {
      this.planMovement(npc);
    } else {
      // Idle behavior: wander within current node
      this.wanderLocally(npc);
    }

    // Update state
    this.updateState(npc);
  }

  private updateSchedule(npc: AgenticNPC, currentHour: number) {
    const scheduledActivity = npc.schedule.find(
      (s) => s.hour === currentHour
    );

    if (scheduledActivity && npc.currentActivity !== scheduledActivity.activity) {
      npc.currentActivity = scheduledActivity.activity;

      this.addHistory(npc, {
        timestamp: Date.now(),
        type: 'moved',
        description: `Began ${scheduledActivity.description}`,
      });

      npc.recentThoughts.unshift(`Time for ${scheduledActivity.description}.`);
      if (npc.recentThoughts.length > 5) {
        npc.recentThoughts.pop();
      }
    }
  }

  private selectNextGoal(npc: AgenticNPC) {
    // Filter incomplete goals
    const incompleteGoals = npc.goals.filter((g) => !g.completed);

    if (incompleteGoals.length === 0) {
      // Generate new goal
      this.generateNewGoal(npc);
      return;
    }

    // Select highest priority goal
    const nextGoal = incompleteGoals.reduce((prev, curr) =>
      curr.priority > prev.priority ? curr : prev
    );

    npc.currentGoal = nextGoal;
  }

  private processGoal(npc: AgenticNPC) {
    if (!npc.currentGoal) return;

    const goal = npc.currentGoal;

    switch (goal.type) {
      case 'visit':
        if (goal.targetNodeId === npc.position.nodeId) {
          this.completeGoal(npc, goal);
        }
        break;

      case 'meet':
        // Check if target NPC is in same node
        if (goal.targetNpcId) {
          const targetNpc = this.getNPC(goal.targetNpcId);
          if (targetNpc && targetNpc.position.nodeId === npc.position.nodeId) {
            this.completeGoal(npc, goal);
            this.initiateInteraction(npc, targetNpc);
          }
        }
        break;

      case 'observe':
        // Observe for a while then complete
        if (npc.currentActivity === 'observing') {
          this.completeGoal(npc, goal);
        }
        break;

      case 'perform':
        // Perform activity based on profession
        if (npc.currentActivity === 'working' || npc.currentActivity === 'performing') {
          // Work for a while
          if (Math.random() > 0.95) {
            this.completeGoal(npc, goal);
          }
        }
        break;
    }
  }

  private completeGoal(npc: AgenticNPC, goal: Goal) {
    goal.completed = true;

    this.addHistory(npc, {
      timestamp: Date.now(),
      type: 'completed',
      description: `Completed goal: ${goal.description}`,
    });

    npc.recentThoughts.unshift(`Accomplished: ${goal.description}`);
    if (npc.recentThoughts.length > 5) {
      npc.recentThoughts.pop();
    }

    // Boost mood and energy for completing goal
    npc.mood = 'happy';
    npc.energy = Math.min(100, npc.energy + 10);

    npc.currentGoal = null;
  }

  private generateNewGoal(npc: AgenticNPC) {
    const rng = new SeededRandom(npc.seed + Date.now().toString());

    // Generate goal based on personality
    const goalTypes: Goal['type'][] = ['visit', 'meet', 'observe'];

    if (npc.traits.curiosity > 0.6) {
      goalTypes.push('observe', 'visit');
    }

    if (npc.traits.sociability > 0.6) {
      goalTypes.push('meet');
    }

    const type = rng.choice(goalTypes);
    let newGoal: Goal;

    switch (type) {
      case 'visit': {
        // Pick a random connected node
        const currentNode = this.world.nodes.get(npc.position.nodeId);
        if (currentNode && currentNode.connections.length > 0) {
          const targetNodeId = rng.choice(currentNode.connections);
          const targetNode = this.world.nodes.get(targetNodeId);

          newGoal = {
            id: `goal-${Date.now()}-${rng.nextInt(0, 1000)}`,
            type: 'visit',
            description: `Visit ${targetNode?.name || 'new location'}`,
            targetNodeId,
            priority: rng.nextInt(5, 8),
            completed: false,
          };
        } else {
          // Fallback to observe
          newGoal = {
            id: `goal-${Date.now()}-${rng.nextInt(0, 1000)}`,
            type: 'observe',
            description: 'Observe the surroundings',
            priority: 4,
            completed: false,
          };
        }
        break;
      }

      case 'meet': {
        // Pick random NPC in different location
        const otherNPCs = this.getAllNPCs().filter(
          (n) => n.id !== npc.id && n.position.nodeId !== npc.position.nodeId
        );

        if (otherNPCs.length > 0) {
          const targetNpc = rng.choice(otherNPCs);
          newGoal = {
            id: `goal-${Date.now()}-${rng.nextInt(0, 1000)}`,
            type: 'meet',
            description: `Meet with ${targetNpc.name}`,
            targetNpcId: targetNpc.id,
            priority: rng.nextInt(5, 7),
            completed: false,
          };
        } else {
          newGoal = {
            id: `goal-${Date.now()}-${rng.nextInt(0, 1000)}`,
            type: 'observe',
            description: 'Observe the surroundings',
            priority: 4,
            completed: false,
          };
        }
        break;
      }

      default: {
        newGoal = {
          id: `goal-${Date.now()}-${rng.nextInt(0, 1000)}`,
          type: 'observe',
          description: 'Take in the sights',
          priority: rng.nextInt(3, 6),
          completed: false,
        };
      }
    }

    npc.goals.push(newGoal);
    npc.currentGoal = newGoal;
  }

  private planMovement(npc: AgenticNPC) {
    if (!npc.currentGoal) return;

    const goal = npc.currentGoal;

    // If goal has target location, move there
    if (goal.targetNodeId && goal.targetNodeId !== npc.position.nodeId) {
      // Simple pathfinding: move to adjacent node
      const currentNode = this.world.nodes.get(npc.position.nodeId);
      if (currentNode && currentNode.connections.includes(goal.targetNodeId)) {
        // Direct connection - move there
        this.moveToNode(npc, goal.targetNodeId);
      }
    } else if (goal.targetNpcId) {
      // Move to where target NPC is
      const targetNpc = this.getNPC(goal.targetNpcId);
      if (targetNpc && targetNpc.position.nodeId !== npc.position.nodeId) {
        this.moveToNode(npc, targetNpc.position.nodeId);
      }
    }
  }

  private moveToNode(npc: AgenticNPC, targetNodeId: string) {
    const targetNode = this.world.nodes.get(targetNodeId);
    if (!targetNode) return;

    // Create simple path (in real implementation, use A* pathfinding)
    const rng = new SeededRandom(npc.seed + Date.now().toString());
    npc.path = [
      {
        nodeId: targetNodeId,
        x: rng.nextInt(50, 150),
        y: rng.nextInt(50, 150),
      },
    ];

    npc.isMoving = true;

    this.addHistory(npc, {
      timestamp: Date.now(),
      type: 'moved',
      description: `Traveling to ${targetNode.name}`,
      nodeId: targetNodeId,
    });
  }

  private updateMovement(npc: AgenticNPC) {
    if (npc.path.length === 0) {
      npc.isMoving = false;
      return;
    }

    const target = npc.path[0];

    // If target is in different node, move there instantly (transition between nodes)
    if (target.nodeId !== npc.position.nodeId) {
      npc.position = { ...target };
      npc.path.shift();

      this.addHistory(npc, {
        timestamp: Date.now(),
        type: 'moved',
        description: `Arrived at new location`,
        nodeId: target.nodeId,
      });

      // Discover node
      const node = this.world.nodes.get(target.nodeId);
      if (node && !node.discovered) {
        node.discovered = true;
        node.visited = true;
      }
    } else {
      // Move within node
      const dx = target.x - npc.position.x;
      const dy = target.y - npc.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 5) {
        // Arrived
        npc.position = { ...target };
        npc.path.shift();
        npc.isMoving = false;
      } else {
        // Update direction based on movement
        if (Math.abs(dx) > Math.abs(dy)) {
          npc.direction = dx > 0 ? 'east' : 'west';
        } else {
          npc.direction = dy > 0 ? 'south' : 'north';
        }
      }
    }
  }

  private wanderLocally(npc: AgenticNPC) {
    // Randomly decide to wander
    if (Math.random() > 0.9 && npc.path.length === 0) {
      const rng = new SeededRandom(npc.seed + Date.now().toString());

      npc.path = [
        {
          nodeId: npc.position.nodeId,
          x: rng.nextInt(50, 150),
          y: rng.nextInt(50, 150),
        },
      ];

      npc.isMoving = true;
    }
  }

  private updateState(npc: AgenticNPC) {
    // Decrease energy over time
    npc.energy = Math.max(0, npc.energy - 0.5);

    // Update mood based on energy and goal completion
    if (npc.energy < 30) {
      npc.mood = 'tired';
    } else if (npc.currentGoal && !npc.currentGoal.completed) {
      npc.mood = 'neutral';
    }

    // Generate occasional thoughts
    if (Math.random() > 0.95) {
      const thoughts = [
        'Such fascinating sights...',
        'I wonder what lies ahead.',
        'The fair never ceases to amaze.',
        'Perhaps I should rest soon.',
      ];

      const rng = new SeededRandom(npc.seed + Date.now().toString());
      npc.recentThoughts.unshift(rng.choice(thoughts));
      if (npc.recentThoughts.length > 5) {
        npc.recentThoughts.pop();
      }
    }
  }

  private initiateInteraction(npc1: AgenticNPC, npc2: AgenticNPC) {
    // Record interaction in both NPCs' histories
    this.addHistory(npc1, {
      timestamp: Date.now(),
      type: 'interacted',
      description: `Met with ${npc2.name}`,
      npcId: npc2.id,
    });

    this.addHistory(npc2, {
      timestamp: Date.now(),
      type: 'interacted',
      description: `Met with ${npc1.name}`,
      npcId: npc1.id,
    });

    // Improve relationship
    npc1.relationships[npc2.id] = (npc1.relationships[npc2.id] || 0) + 0.1;
    npc2.relationships[npc1.id] = (npc2.relationships[npc1.id] || 0) + 0.1;

    // Both NPCs become happier from social interaction
    if (npc1.traits.sociability > 0.5) {
      npc1.mood = 'happy';
    }
    if (npc2.traits.sociability > 0.5) {
      npc2.mood = 'happy';
    }
  }

  private addHistory(npc: AgenticNPC, event: HistoryEvent) {
    npc.history.push(event);

    // Keep history limited to last 50 events
    if (npc.history.length > 50) {
      npc.history = npc.history.slice(-50);
    }
  }
}

export default NPCAgentSystem;
