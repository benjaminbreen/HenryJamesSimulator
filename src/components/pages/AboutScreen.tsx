import { useGameStore } from '../../stores/gameStore';

const AboutScreen = () => {
  const { setScreen } = useGameStore();

  return (
    <div className="min-h-screen p-8 bg-belle-cream dark:bg-paris-night">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-display text-belle-burgundy dark:text-belle-gold">
            About This Game
          </h1>
          <button
            onClick={() => setScreen('title')}
            className="px-4 py-2 border-2 border-belle-burgundy dark:border-belle-gold text-belle-burgundy dark:text-belle-gold rounded hover:bg-belle-burgundy/10 transition-all"
          >
            ← Back
          </button>
        </div>

        <div className="ornate-border bg-white dark:bg-belle-navy/30 p-8 space-y-6 text-belle-navy dark:text-belle-cream">
          <section className="space-y-3">
            <h2 className="text-2xl font-display text-belle-burgundy dark:text-belle-gold">
              Historical Context
            </h2>
            <p className="leading-relaxed">
              The 1889 Exposition Universelle (World's Fair) in Paris celebrated the centenary of
              the French Revolution and showcased the pinnacle of late 19th-century technological
              achievement. The Eiffel Tower, built specifically for the exposition, was both
              celebrated and reviled—many leading artists and intellectuals signed a petition
              denouncing it as an eyesore.
            </p>
            <p className="leading-relaxed">
              Henry James, the American novelist, was deeply engaged with European culture and
              frequently visited Paris during this period. This game imagines his experience at
              the fair, encountering real historical figures who attended, observing the spectacle
              of modernity, and engaging in the kinds of subtle social and intellectual combat at
              which he excelled.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-display text-belle-burgundy dark:text-belle-gold">
              Historical Authenticity
            </h2>
            <p className="leading-relaxed">
              This game strives for historical accuracy while remaining entertaining. All NPCs are
              real historical figures who attended or lived in Paris during 1889. The exhibits in
              the Gallery of Machines are based on actual displays. Primary source quotes are real.
              The Fact-Check module (press F) explains what's accurate and what's speculative.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-display text-belle-burgundy dark:text-belle-gold">
              Gameplay Philosophy
            </h2>
            <p className="leading-relaxed">
              Combat is a battle of wits—literary allusions, gossip, innuendo, and devastating bon
              mots. The game is designed to be both educational and entertaining, teaching players
              about this fascinating historical moment while providing genuine roguelike challenge
              and emergent narrative complexity.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-display text-belle-burgundy dark:text-belle-gold">
              Credits
            </h2>
            <p className="leading-relaxed">
              Built with React, Vite, Tailwind CSS, and extensive historical research. Inspired by
              the life and work of Henry James, the spectacle of the 1889 World's Fair, and the
              Belle Époque's fascinating collision of tradition and modernity.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutScreen;
