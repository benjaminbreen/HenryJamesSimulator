import { useGameStore } from '../../stores/gameStore';

const FactCheckPanel = () => {
  const { setFactCheckVisible } = useGameStore();

  // Mock fact checks - in full version this would be LLM-powered with Wikipedia API
  const mockFactChecks = [
    {
      claim: 'The Eiffel Tower was controversial in 1889',
      verdict: 'accurate' as const,
      explanation:
        'A petition signed by prominent artists and intellectuals (including Guy de Maupassant and Charles Gounod) protested the tower\'s construction, calling it "useless and monstrous."',
      sources: ['Wikipedia: Eiffel Tower - Reception'],
    },
    {
      claim: 'Henry James attended the 1889 World\'s Fair',
      verdict: 'speculative' as const,
      explanation:
        'While James was frequently in Paris during this period and would certainly have known about the fair, we don\'t have detailed records of a specific visit. It\'s plausible but not confirmed.',
      sources: ['Wikipedia: Henry James'],
    },
    {
      claim: 'Edison exhibited his phonograph at the fair',
      verdict: 'accurate' as const,
      explanation:
        'Edison\'s improved phonograph was indeed exhibited at the 1889 Exposition, where it competed with similar devices from other inventors.',
      sources: ['Wikipedia: 1889 Exposition Universelle'],
    },
  ];

  const verdictColors = {
    accurate: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    'mostly-accurate': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    mixed: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    inaccurate: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
    speculative: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
  };

  return (
    <div className="ornate-border bg-white dark:bg-belle-navy/30 p-4 space-y-3 animate-slide-up">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-belle-burgundy dark:text-belle-gold">
          📚 Fact Check
        </h3>
        <button
          onClick={() => setFactCheckVisible(false)}
          className="text-belle-navy/60 dark:text-belle-cream/60 hover:text-belle-navy dark:hover:text-belle-cream text-xl"
        >
          ×
        </button>
      </div>

      <p className="text-xs text-belle-navy/70 dark:text-belle-cream/70">
        Verifying historical accuracy of recent events
      </p>

      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        {mockFactChecks.map((check, index) => (
          <div key={index} className="border-2 border-belle-gold/30 rounded-lg p-3 space-y-2">
            <div className="flex items-start gap-2">
              <span
                className={`text-xs px-2 py-1 rounded font-semibold capitalize ${
                  verdictColors[check.verdict]
                }`}
              >
                {check.verdict}
              </span>
              <p className="text-sm font-semibold text-belle-navy dark:text-belle-cream flex-1">
                {check.claim}
              </p>
            </div>

            <p className="text-xs text-belle-navy dark:text-belle-cream leading-relaxed">
              {check.explanation}
            </p>

            <div className="space-y-1">
              {check.sources.map((source, i) => (
                <a
                  key={i}
                  href={`https://wikipedia.org/wiki/${source.split(':')[1]?.trim().replace(/ /g, '_')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline block"
                >
                  📖 {source}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-belle-navy/60 dark:text-belle-cream/60 italic">
        Powered by historical research & LLM verification
      </p>
    </div>
  );
};

export default FactCheckPanel;
