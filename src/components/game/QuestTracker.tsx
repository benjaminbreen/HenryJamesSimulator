import { useGameStore } from '../../stores/gameStore';

const QuestTracker = () => {
  const { activeQuests, setView } = useGameStore();

  if (activeQuests.length === 0) {
    return null;
  }

  const mainQuest = activeQuests.find(q => q.type === 'main');
  const sideQuests = activeQuests.filter(q => q.type !== 'main');

  return (
    <div className="ornate-border bg-gradient-to-br from-belle-burgundy/10 to-belle-gold/10 dark:from-belle-burgundy/20 dark:to-belle-gold/20 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-display text-belle-burgundy dark:text-belle-gold flex items-center gap-2">
          <span>📜</span> Active Quests
        </h3>
        <button
          onClick={() => setView('journal')}
          className="text-xs text-belle-burgundy dark:text-belle-gold hover:underline"
        >
          View All
        </button>
      </div>

      {/* Main Quest */}
      {mainQuest && (
        <div className="border-l-4 border-belle-burgundy pl-3 space-y-1">
          <div className="font-display text-sm font-semibold text-belle-burgundy dark:text-belle-gold">
            ⭐ {mainQuest.title}
          </div>
          {mainQuest.objectives
            .filter(obj => !obj.completed)
            .slice(0, 2)
            .map(obj => (
              <div key={obj.id} className="text-xs text-belle-navy/80 dark:text-belle-cream/80 flex items-start gap-2">
                <span className="opacity-50">□</span>
                <span>
                  {obj.description}
                  {obj.targetCount && obj.currentCount !== undefined && (
                    <span className="ml-1 text-belle-gold">
                      ({obj.currentCount}/{obj.targetCount})
                    </span>
                  )}
                </span>
              </div>
            ))}
        </div>
      )}

      {/* Side Quests (show first 2) */}
      {sideQuests.slice(0, 2).map(quest => (
        <div key={quest.id} className="border-l-4 border-belle-gold/50 pl-3 space-y-1">
          <div className="font-display text-sm font-semibold text-belle-navy dark:text-belle-gold">
            {quest.title}
          </div>
          {quest.objectives
            .filter(obj => !obj.completed)
            .slice(0, 1)
            .map(obj => (
              <div key={obj.id} className="text-xs text-belle-navy/80 dark:text-belle-cream/80 flex items-start gap-2">
                <span className="opacity-50">□</span>
                <span>
                  {obj.description}
                  {obj.targetCount && obj.currentCount !== undefined && (
                    <span className="ml-1 text-belle-gold">
                      ({obj.currentCount}/{obj.targetCount})
                    </span>
                  )}
                </span>
              </div>
            ))}
        </div>
      ))}

      {sideQuests.length > 2 && (
        <div className="text-xs text-belle-navy/60 dark:text-belle-cream/60 text-center">
          +{sideQuests.length - 2} more quest{sideQuests.length - 2 !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default QuestTracker;
