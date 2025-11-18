import { useGameStore } from '../../stores/gameStore';

const SettingsScreen = () => {
  const { settings, updateSettings, setScreen } = useGameStore();

  return (
    <div className="min-h-screen p-8 bg-belle-cream dark:bg-paris-night">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-display text-belle-burgundy dark:text-belle-gold">
            Settings
          </h1>
          <button
            onClick={() => setScreen('title')}
            className="px-4 py-2 border-2 border-belle-burgundy dark:border-belle-gold text-belle-burgundy dark:text-belle-gold rounded hover:bg-belle-burgundy/10 transition-all"
          >
            ← Back
          </button>
        </div>

        <div className="ornate-border bg-white dark:bg-belle-navy/30 p-8 space-y-6">
          {/* Theme */}
          <div className="space-y-2">
            <label className="block text-lg font-display text-belle-navy dark:text-belle-cream">
              Theme
            </label>
            <select
              value={settings.theme}
              onChange={(e) => updateSettings({ theme: e.target.value as 'light' | 'dark' })}
              className="w-full px-4 py-2 rounded border-2 border-belle-gold/30 bg-white dark:bg-belle-navy dark:text-belle-cream"
            >
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode</option>
            </select>
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <label className="block text-lg font-display text-belle-navy dark:text-belle-cream">
              Font Size
            </label>
            <select
              value={settings.fontSize}
              onChange={(e) => updateSettings({ fontSize: e.target.value as any })}
              className="w-full px-4 py-2 rounded border-2 border-belle-gold/30 bg-white dark:bg-belle-navy dark:text-belle-cream"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <label className="block text-lg font-display text-belle-navy dark:text-belle-cream">
              Difficulty
            </label>
            <select
              value={settings.difficulty}
              onChange={(e) => updateSettings({ difficulty: e.target.value as any })}
              className="w-full px-4 py-2 rounded border-2 border-belle-gold/30 bg-white dark:bg-belle-navy dark:text-belle-cream"
            >
              <option value="tourist">Tourist (Easy)</option>
              <option value="expatriate">Expatriate (Normal)</option>
              <option value="savant">Savant (Hard)</option>
            </select>
          </div>

          {/* Boolean Settings */}
          <div className="space-y-4">
            {[
              { key: 'showHistoricalContext', label: 'Show Historical Context' },
              { key: 'autoSave', label: 'Auto-Save' },
              { key: 'enableFactCheck', label: 'Enable Fact-Check Module' },
              { key: 'enableAnimations', label: 'Enable Animations' },
              { key: 'accessibilityMode', label: 'Accessibility Mode' },
              { key: 'colorblindMode', label: 'Colorblind Mode' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[key as keyof typeof settings] as boolean}
                  onChange={(e) =>
                    updateSettings({ [key]: e.target.checked } as any)
                  }
                  className="w-5 h-5"
                />
                <span className="text-belle-navy dark:text-belle-cream">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="text-center text-sm text-belle-navy/60 dark:text-belle-cream/60">
          Changes are saved automatically
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
