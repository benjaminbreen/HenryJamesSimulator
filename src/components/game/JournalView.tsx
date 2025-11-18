import { useGameStore } from '../../stores/gameStore';
import { LOCATIONS } from '../../constants/locations';

const JournalView = () => {
  const { player, setView } = useGameStore();

  const sortedEntries = [...player.journalEntries].sort((a, b) => b.timestamp - a.timestamp);

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      observation: '👁️',
      encounter: '👤',
      event: '📖',
      combat: '⚔️',
      discovery: '✨',
    };
    return icons[type] || '📝';
  };

  return (
    <div className="space-y-4">
      <div className="ornate-border bg-white dark:bg-belle-navy/30 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-display text-belle-burgundy dark:text-belle-gold">
            Journal
          </h2>
          <button
            onClick={() => setView('main')}
            className="px-4 py-2 border-2 border-belle-burgundy dark:border-belle-gold text-belle-burgundy dark:text-belle-gold rounded hover:bg-belle-burgundy/10 transition-all"
          >
            ← Back
          </button>
        </div>

        <p className="text-sm text-belle-navy/70 dark:text-belle-cream/70 italic">
          "One's notes are apt to accumulate, to reflect, as it were, the very texture of
          experience..."
        </p>

        {sortedEntries.length === 0 ? (
          <div className="text-center py-12 text-belle-navy/60 dark:text-belle-cream/60">
            <p className="text-xl">Your journal is pristine and empty</p>
            <p className="text-sm mt-2">Begin exploring to record your experiences</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedEntries.map((entry) => (
              <div
                key={entry.id}
                className="border-2 border-belle-gold/30 rounded-lg p-4 space-y-2"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getTypeIcon(entry.type)}</span>
                    <div>
                      <h3 className="font-display text-lg text-belle-burgundy dark:text-belle-gold">
                        {entry.title}
                      </h3>
                      <p className="text-xs text-belle-navy/70 dark:text-belle-cream/70">
                        {LOCATIONS[entry.location]?.name || entry.location} •{' '}
                        {new Date(entry.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-belle-navy dark:text-belle-cream leading-relaxed whitespace-pre-wrap">
                  {entry.content}
                </p>

                {entry.primarySource && (
                  <div className="mt-3 p-3 bg-belle-cream/50 dark:bg-black/20 rounded space-y-2">
                    <h4 className="font-display text-sm text-belle-burgundy dark:text-belle-gold">
                      Primary Source:
                    </h4>
                    <p className="text-xs italic text-belle-navy dark:text-belle-cream">
                      "{entry.primarySource.excerpt}"
                    </p>
                    <p className="text-xs text-belle-navy/70 dark:text-belle-cream/70">
                      — {entry.primarySource.author}, {entry.primarySource.title} (
                      {entry.primarySource.date})
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalView;
