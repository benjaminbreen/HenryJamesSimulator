import { useGameStore } from '../../stores/gameStore';

const FAQScreen = () => {
  const { setScreen } = useGameStore();

  const faqs = [
    {
      q: 'Is this historically accurate?',
      a: 'The game strives for historical authenticity within the constraints of being fun to play. All NPCs are real people, locations are accurate, and exhibits are based on actual displays. The "combat" system is obviously fantastical, but based on the real social dynamics of the Belle Époque. Use the Fact-Check module (F key) to learn what\'s real and what\'s creative license.',
    },
    {
      q: 'Did Henry James really attend the 1889 World\'s Fair?',
      a: 'James was frequently in Paris during the 1880s and would certainly have been aware of the fair. While we don\'t have detailed records of his specific visit, it\'s entirely plausible—and makes for a wonderful premise!',
    },
    {
      q: 'How do I win?',
      a: 'There are multiple "victory" conditions and ending states. Explore, level up, complete events, defeat NPCs in wit-battles, and pursue your own goals. The Assessment layer at game\'s end will evaluate your playthrough with a pithy, slightly sarcastic summary.',
    },
    {
      q: 'What\'s the combat system?',
      a: 'Combat is a Belle Époque battle of wits. You select moves like "Oblique Observation" or "Devastating Epigram," each costing Wit points and dealing various types of damage. Think Pokémon, but with literary allusions and social humiliation instead of elemental attacks.',
    },
    {
      q: 'Can I save my game?',
      a: 'Yes! The game auto-saves if enabled in settings. You can also manually save from the game menu and export a full transcript of your playthrough.',
    },
    {
      q: 'What are the controls?',
      a: 'Most actions are point-and-click. Key shortcuts: M (map), I (inventory), J (journal), L (log), F (fact-check), ESC (menu). Navigate with arrow keys in some views.',
    },
    {
      q: 'Are there easter eggs?',
      a: 'Of course! Keep an eye out for hidden references, secret interactions, and at least one minigame. The fair is full of surprises.',
    },
    {
      q: 'Can I read the books in my inventory?',
      a: 'Yes! Click any book in your inventory to open the book reader. Content is procedurally generated in a historically authentic style.',
    },
    {
      q: 'What\'s the Fact-Check module?',
      a: 'Press F to toggle a panel that explains the historical accuracy of recent events, with Wikipedia links for further reading. It\'s powered by an LLM that verifies claims against historical records.',
    },
  ];

  return (
    <div className="min-h-screen p-8 bg-belle-cream dark:bg-paris-night">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-display text-belle-burgundy dark:text-belle-gold">
            Frequently Asked Questions
          </h1>
          <button
            onClick={() => setScreen('title')}
            className="px-4 py-2 border-2 border-belle-burgundy dark:border-belle-gold text-belle-burgundy dark:text-belle-gold rounded hover:bg-belle-burgundy/10 transition-all"
          >
            ← Back
          </button>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="ornate-border bg-white dark:bg-belle-navy/30 p-6 space-y-2"
            >
              <h3 className="text-xl font-display text-belle-burgundy dark:text-belle-gold">
                {faq.q}
              </h3>
              <p className="text-belle-navy dark:text-belle-cream leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center text-sm text-belle-navy/60 dark:text-belle-cream/60">
          For more information, see the About page or begin playing!
        </div>
      </div>
    </div>
  );
};

export default FAQScreen;
