import { useGameStore } from '../../stores/gameStore';

const GameHeader = () => {
  const { player, setScreen, saveGame, settings, updateSettings } = useGameStore();

  const statPercentage = (current: number, max: number) => (current / max) * 100;

  return (
    <header className="bg-belle-burgundy dark:bg-belle-navy text-belle-cream border-b-4 border-belle-gold">
      <div className="container mx-auto px-4 py-3 max-w-7xl">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Player Info */}
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-display">{player.name}</h1>
              <span className="text-sm opacity-80">{player.title}</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span>Level {player.level}</span>
              <span>|</span>
              <span>{player.gold} ₣</span>
              <span>|</span>
              <span>Rep: {player.reputation}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-3 text-xs">
            {Object.entries(player.stats).map(([stat, value]) => (
              <div key={stat} className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="capitalize font-semibold">{stat}</span>
                  <span>{value}/{player.maxStats[stat as keyof typeof player.maxStats]}</span>
                </div>
                <div className="w-20 h-2 bg-black/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-belle-gold transition-all duration-300"
                    style={{
                      width: `${statPercentage(value, player.maxStats[stat as keyof typeof player.maxStats])}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <button
              onClick={() => updateSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' })}
              className="px-3 py-2 bg-belle-gold/20 hover:bg-belle-gold/30 rounded transition-all"
              title="Toggle theme"
            >
              {settings.theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button
              onClick={saveGame}
              className="px-3 py-2 bg-belle-gold/20 hover:bg-belle-gold/30 rounded transition-all"
              title="Save game"
            >
              💾
            </button>
            <button
              onClick={() => setScreen('settings')}
              className="px-3 py-2 bg-belle-gold/20 hover:bg-belle-gold/30 rounded transition-all"
              title="Settings"
            >
              ⚙️
            </button>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mt-2 space-y-1">
          <div className="flex justify-between text-xs">
            <span>XP to next level</span>
            <span>{player.xp} / {player.xpToNextLevel}</span>
          </div>
          <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-belle-gold transition-all duration-500"
              style={{ width: `${(player.xp / player.xpToNextLevel) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default GameHeader;
