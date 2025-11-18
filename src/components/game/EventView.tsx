import { useGameStore } from '../../stores/gameStore';

const EventView = () => {
  const { activeEvent, resolveEvent, player } = useGameStore();

  if (!activeEvent) return null;

  const canChoose = (choice: typeof activeEvent.choices[0]) => {
    if (!choice.requirements) return true;

    const req = choice.requirements;
    if (req.stat && req.minValue) {
      return player.stats[req.stat] >= req.minValue;
    }
    if (req.item) {
      return player.inventory.some((i) => i.id === req.item);
    }
    if (req.reputation !== undefined) {
      return player.reputation >= req.reputation;
    }
    return true;
  };

  return (
    <div className="space-y-4">
      <div className="ornate-border bg-white dark:bg-belle-navy/30 p-6 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-4xl">📖</span>
          <h2 className="text-3xl font-display text-belle-burgundy dark:text-belle-gold">
            {activeEvent.title}
          </h2>
        </div>

        <div className="bg-belle-cream/50 dark:bg-black/20 rounded-lg p-6">
          <p className="text-belle-navy dark:text-belle-cream leading-relaxed">
            {activeEvent.description}
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-display text-xl text-belle-burgundy dark:text-belle-gold">
            How do you respond?
          </h3>

          {activeEvent.choices.map((choice, index) => {
            const available = canChoose(choice);
            return (
              <button
                key={index}
                onClick={() => available && resolveEvent(index)}
                disabled={!available}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                  available
                    ? 'border-belle-gold/30 hover:bg-belle-gold/10 hover:shadow-lg'
                    : 'border-gray-300 dark:border-gray-700 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="space-y-2">
                  <p className="text-belle-navy dark:text-belle-cream font-semibold">
                    {choice.text}
                  </p>

                  {choice.requirements && (
                    <div className="text-xs text-belle-navy/70 dark:text-belle-cream/70">
                      {choice.requirements.stat && (
                        <span className={available ? 'text-green-600' : 'text-red-600'}>
                          Requires {choice.requirements.stat}: {choice.requirements.minValue}
                          {!available && ` (You have: ${player.stats[choice.requirements.stat]})`}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Preview effects */}
                  <div className="text-xs text-belle-navy/60 dark:text-belle-cream/60 flex flex-wrap gap-2">
                    {choice.outcome.effects.xp && <span>+{choice.outcome.effects.xp} XP</span>}
                    {choice.outcome.effects.gold && <span>{choice.outcome.effects.gold} ₣</span>}
                    {choice.outcome.effects.reputation && (
                      <span>
                        Rep {choice.outcome.effects.reputation > 0 ? '+' : ''}
                        {choice.outcome.effects.reputation}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EventView;
