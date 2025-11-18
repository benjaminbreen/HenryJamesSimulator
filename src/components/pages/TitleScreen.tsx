import { useGameStore } from '../../stores/gameStore';

const TitleScreen = () => {
  const { startGame, setScreen } = useGameStore();

  const titleArt = `
    ╔═══════════════════════════════════════════════════════════════════════╗
    ║                                                                       ║
    ║        ██╗  ██╗███████╗███╗   ██╗██████╗ ██╗   ██╗                  ║
    ║        ██║  ██║██╔════╝████╗  ██║██╔══██╗╚██╗ ██╔╝                  ║
    ║        ███████║█████╗  ██╔██╗ ██║██████╔╝ ╚████╔╝                   ║
    ║        ██╔══██║██╔══╝  ██║╚██╗██║██╔══██╗  ╚██╔╝                    ║
    ║        ██║  ██║███████╗██║ ╚████║██║  ██║   ██║                     ║
    ║        ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝╚═╝  ╚═╝   ╚═╝                     ║
    ║                                                                       ║
    ║             ██╗ █████╗ ███╗   ███╗███████╗███████╗                  ║
    ║             ██║██╔══██╗████╗ ████║██╔════╝██╔════╝                  ║
    ║             ██║███████║██╔████╔██║█████╗  ███████╗                  ║
    ║        ██   ██║██╔══██║██║╚██╔╝██║██╔══╝  ╚════██║                  ║
    ║        ╚█████╔╝██║  ██║██║ ╚═╝ ██║███████╗███████║                  ║
    ║         ╚════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚══════╝                  ║
    ║                                                                       ║
    ║                 A T   T H E   W O R L D ' S   F A I R                ║
    ║                                                                       ║
    ║                          Paris • 1889                                 ║
    ║                                                                       ║
    ║                    ⚡ ▲ BELLE ÉPOQUE ROGUELIKE ▲ ⚡                    ║
    ║                                                                       ║
    ╚═══════════════════════════════════════════════════════════════════════╝

                                  ▲
                                 ╱│╲
                                ╱ │ ╲
                               ╱  │  ╲
                              ╱   │   ╲
                             ╱    │    ╲
                            ╱═════╧═════╲
                           │  EXPOSITION  │
                          │  UNIVERSELLE   │
                         ╱══════════════════╲
  `;

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-b from-belle-cream via-belle-cream to-belle-gold/10 dark:from-paris-night dark:via-paris-night dark:to-belle-gold/5">
      <div className="max-w-5xl w-full space-y-8 animate-fade-in">
        <pre className="ascii-art text-belle-burgundy dark:text-belle-gold text-center text-xs sm:text-sm leading-tight">
          {titleArt}
        </pre>

        <div className="text-center space-y-4 animate-slide-up animation-delay-200">
          <p className="text-lg text-belle-navy dark:text-belle-cream italic">
            "The great Eiffel Tower stands in the Champ de Mars, a structure of
            a peculiar awkwardness and yet not without a certain bold presence."
          </p>
          <p className="text-sm text-belle-navy/70 dark:text-belle-cream/70">
            — Henry James, Notebooks (1889)
          </p>
        </div>

        <div className="flex flex-col gap-4 max-w-md mx-auto animate-slide-up animation-delay-400">
          <button
            onClick={startGame}
            className="px-8 py-4 bg-belle-burgundy hover:bg-belle-burgundy/90 text-belle-cream font-display text-xl rounded-lg ornate-border transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            BEGIN YOUR JOURNEY
          </button>

          <button
            onClick={() => setScreen('settings')}
            className="px-8 py-3 bg-transparent border-2 border-belle-burgundy text-belle-burgundy dark:text-belle-gold dark:border-belle-gold hover:bg-belle-burgundy/10 font-display rounded-lg transition-all"
          >
            Settings
          </button>

          <button
            onClick={() => setScreen('about')}
            className="px-8 py-3 bg-transparent border-2 border-belle-burgundy text-belle-burgundy dark:text-belle-gold dark:border-belle-gold hover:bg-belle-burgundy/10 font-display rounded-lg transition-all"
          >
            About
          </button>

          <button
            onClick={() => setScreen('faq')}
            className="px-8 py-3 bg-transparent border-2 border-belle-burgundy text-belle-burgundy dark:text-belle-gold dark:border-belle-gold hover:bg-belle-burgundy/10 font-display rounded-lg transition-all"
          >
            FAQ
          </button>
        </div>

        <div className="text-center text-sm text-belle-navy/60 dark:text-belle-cream/60 space-y-1">
          <p>A historically authentic roguelike adventure</p>
          <p>Built with React • Vite • Tailwind • Historical Research</p>
        </div>
      </div>
    </div>
  );
};

export default TitleScreen;
