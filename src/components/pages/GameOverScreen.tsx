import { useGameStore } from '../../stores/gameStore';

const GameOverScreen = () => {
  const { player, gameOverReason, setScreen, gameLog } = useGameStore();

  // Mock assessment - in full version this would call an LLM
  const mockAssessment = {
    score: Math.floor(player.xp / 10 + player.level * 20 + player.reputation),
    grade: 'B' as const,
    summary: `Mr. James navigated the fair with characteristic ambivalence—neither fully embracing modernity's spectacle nor retreating into aesthetic fastidiousness. One senses he gathered material for future novels while maintaining a certain transatlantic remove. His encounters were judicious, if occasionally timid. Grade: B. One might have hoped for more audacity.`,
    categories: {
      exploration: 75,
      combat: 60,
      social: 70,
      historical: 80,
      literary: 85,
    },
    highlights: [
      'Defeated Oscar Wilde in a battle of epigrams',
      'Discovered all major exhibition halls',
      'Collected 12 rare books',
      'Maintained positive relationships with most NPCs',
    ],
    lowlights: [
      'Avoided the Eiffel Tower ascent',
      'Lost several wit-battles',
      'Reputation fluctuated wildly',
    ],
  };

  return (
    <div className="min-h-screen p-8 bg-belle-cream dark:bg-paris-night">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-display text-belle-burgundy dark:text-belle-gold">
            Game Over
          </h1>
          <p className="text-xl text-belle-navy dark:text-belle-cream italic">
            {gameOverReason || 'Your journey at the fair has concluded.'}
          </p>
        </div>

        <div className="ornate-border bg-white dark:bg-belle-navy/30 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="text-6xl font-display text-belle-gold">
              {mockAssessment.grade}
            </div>
            <div className="text-2xl font-display text-belle-burgundy dark:text-belle-gold">
              Score: {mockAssessment.score}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-display text-belle-burgundy dark:text-belle-gold">
              Assessment
            </h2>
            <p className="text-belle-navy dark:text-belle-cream leading-relaxed italic">
              {mockAssessment.summary}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(mockAssessment.categories).map(([category, score]) => (
              <div key={category} className="text-center space-y-1">
                <div className="text-3xl font-display text-belle-gold">{score}</div>
                <div className="text-sm text-belle-navy dark:text-belle-cream capitalize">
                  {category}
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-display text-belle-burgundy dark:text-belle-gold">
                Highlights
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-belle-navy dark:text-belle-cream">
                {mockAssessment.highlights.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-display text-belle-burgundy dark:text-belle-gold">
                Lowlights
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-belle-navy dark:text-belle-cream">
                {mockAssessment.lowlights.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-display text-belle-burgundy dark:text-belle-gold">
              Final Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
              <div>
                <div className="font-display text-2xl text-belle-gold">{player.level}</div>
                <div className="text-belle-navy dark:text-belle-cream">Level</div>
              </div>
              <div>
                <div className="font-display text-2xl text-belle-gold">{player.xp}</div>
                <div className="text-belle-navy dark:text-belle-cream">Total XP</div>
              </div>
              <div>
                <div className="font-display text-2xl text-belle-gold">
                  {player.visitedLocations.size}
                </div>
                <div className="text-belle-navy dark:text-belle-cream">Locations</div>
              </div>
              <div>
                <div className="font-display text-2xl text-belle-gold">
                  {player.defeatedNPCs.size}
                </div>
                <div className="text-belle-navy dark:text-belle-cream">NPCs Defeated</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setScreen('title')}
            className="px-8 py-3 bg-belle-burgundy text-belle-cream font-display rounded-lg hover:bg-belle-burgundy/90 transition-all"
          >
            Return to Title
          </button>
          <button
            onClick={() => {
              const transcript = gameLog
                .map((entry) => `[${new Date(entry.timestamp).toLocaleTimeString()}] ${entry.message}`)
                .join('\n');
              const blob = new Blob([transcript], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `henry-james-transcript-${Date.now()}.txt`;
              a.click();
            }}
            className="px-8 py-3 border-2 border-belle-burgundy dark:border-belle-gold text-belle-burgundy dark:text-belle-gold font-display rounded-lg hover:bg-belle-burgundy/10 transition-all"
          >
            Export Transcript
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;
