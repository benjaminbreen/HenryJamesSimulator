import { useGameStore } from '../../stores/gameStore';
import { useEffect, useRef } from 'react';

const GameLog = () => {
  const { gameLog } = useGameStore();
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [gameLog]);

  const typeColors = {
    info: 'text-belle-navy dark:text-belle-cream',
    success: 'text-green-700 dark:text-green-400',
    warning: 'text-orange-700 dark:text-orange-400',
    combat: 'text-red-700 dark:text-red-400',
    dialogue: 'text-purple-700 dark:text-purple-400',
    system: 'text-blue-700 dark:text-blue-400',
  };

  return (
    <div className="ornate-border bg-white dark:bg-belle-navy/30 p-4 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-belle-burgundy dark:text-belle-gold">
          Game Log
        </h3>
        <span className="text-xs text-belle-navy/60 dark:text-belle-cream/60">
          Press L to focus
        </span>
      </div>

      <div className="max-h-96 overflow-y-auto custom-scrollbar space-y-1">
        {gameLog.slice(-50).map((entry) => (
          <div
            key={entry.id}
            className={`text-sm leading-relaxed animate-fade-in ${typeColors[entry.type]}`}
          >
            <span className="mr-1">{entry.icon}</span>
            <span>{entry.message}</span>
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
};

export default GameLog;
