import { useGameStore } from '../../stores/gameStore';
import { OVERWORLD_MAP, LOCATIONS } from '../../constants/locations';

const MapView = () => {
  const { player, changeLocation, setView } = useGameStore();

  return (
    <div className="space-y-4">
      <div className="ornate-border bg-white dark:bg-belle-navy/30 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-display text-belle-burgundy dark:text-belle-gold">
            Map of the Exposition
          </h2>
          <button
            onClick={() => setView('main')}
            className="px-4 py-2 border-2 border-belle-burgundy dark:border-belle-gold text-belle-burgundy dark:text-belle-gold rounded hover:bg-belle-burgundy/10 transition-all"
          >
            ← Back
          </button>
        </div>

        <pre className="ascii-art text-xs text-belle-burgundy dark:text-belle-gold overflow-x-auto">
          {OVERWORLD_MAP}
        </pre>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.values(LOCATIONS).map((location) => {
            const visited = player.visitedLocations.has(location.id);
            const isCurrent = player.location === location.id;

            return (
              <button
                key={location.id}
                onClick={() => {
                  changeLocation(location.id);
                  setView('main');
                }}
                disabled={!visited && location.isLocked}
                className={`p-3 border-2 rounded-lg text-left transition-all ${
                  isCurrent
                    ? 'bg-belle-burgundy text-belle-cream border-belle-burgundy'
                    : visited
                    ? 'border-belle-gold/30 hover:bg-belle-gold/10'
                    : 'border-gray-300 dark:border-gray-700 opacity-50'
                }`}
              >
                <div className="font-display text-sm">
                  {isCurrent && '📍 '}
                  {location.name}
                </div>
                <div className="text-xs opacity-70 mt-1">
                  {!visited && '🔒 Undiscovered'}
                  {visited && !isCurrent && '✓ Visited'}
                  {isCurrent && 'Current Location'}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MapView;
