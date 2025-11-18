import { useGameStore } from '../../stores/gameStore';

const CombatView = () => {
  const { combatState, executeCombatMove } = useGameStore();

  if (!combatState) return null;

  const { opponent, playerHealth, opponentHealth, availableMoves, log } = combatState;

  return (
    <div className="space-y-4">
      <div className="ornate-border bg-white dark:bg-belle-navy/30 p-6 space-y-4">
        <h2 className="text-3xl font-display text-belle-burgundy dark:text-belle-gold text-center">
          Battle of Wits
        </h2>

        {/* Combatants */}
        <div className="grid grid-cols-2 gap-4">
          {/* Player */}
          <div className="text-center space-y-2">
            <h3 className="font-display text-xl text-belle-burgundy dark:text-belle-gold">
              You
            </h3>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className="bg-green-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${playerHealth}%` }}
              />
            </div>
            <p className="text-sm">{playerHealth}% Composure</p>
          </div>

          {/* Opponent */}
          <div className="text-center space-y-2">
            <h3 className="font-display text-xl text-belle-burgundy dark:text-belle-gold">
              {opponent.name}
            </h3>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className="bg-red-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${opponentHealth}%` }}
              />
            </div>
            <p className="text-sm">{opponentHealth}% Composure</p>
          </div>
        </div>

        {/* Opponent Portrait */}
        <div className="text-center">
          <pre className="ascii-art text-xs text-belle-burgundy dark:text-belle-gold inline-block">
            {opponent.portrait}
          </pre>
          <p className="text-sm text-belle-navy dark:text-belle-cream mt-2 italic">
            {opponent.description}
          </p>
        </div>

        {/* Combat Log */}
        <div className="bg-belle-cream/50 dark:bg-black/20 rounded-lg p-4 max-h-40 overflow-y-auto custom-scrollbar">
          <div className="space-y-1 text-sm text-belle-navy dark:text-belle-cream">
            {log.map((entry, i) => (
              <p key={i} className="leading-relaxed">
                {entry}
              </p>
            ))}
          </div>
        </div>

        {/* Available Moves */}
        <div className="space-y-3">
          <h4 className="font-display text-lg text-belle-burgundy dark:text-belle-gold">
            Your Moves:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableMoves.map((move) => (
              <button
                key={move.id}
                onClick={() => executeCombatMove(move.id)}
                className="p-3 border-2 border-belle-gold/30 rounded-lg hover:bg-belle-gold/10 transition-all text-left group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="font-display text-belle-burgundy dark:text-belle-gold group-hover:text-glow">
                      {move.name}
                    </div>
                    <p className="text-xs text-belle-navy/70 dark:text-belle-cream/70 capitalize mt-1">
                      {move.type} • Cost: {move.witCost} Wit
                    </p>
                    <p className="text-xs text-belle-navy dark:text-belle-cream mt-1">
                      {move.description}
                    </p>
                    {move.quote && (
                      <p className="text-xs text-belle-navy/60 dark:text-belle-cream/60 mt-1 italic">
                        {move.quote}
                      </p>
                    )}
                  </div>
                  <div className="text-right text-xs">
                    <div className="text-red-600 dark:text-red-400">
                      {move.witDamage + move.charmDamage} DMG
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombatView;
