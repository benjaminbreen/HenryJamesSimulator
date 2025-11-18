import { useGameStore } from '../../stores/gameStore';
import clsx from 'clsx';

const InventoryView = () => {
  const { player, setView, setReadingBook, removeItem, addLog } = useGameStore();

  const rarityColors = {
    common: 'border-gray-400 dark:border-gray-600',
    uncommon: 'border-green-500 dark:border-green-400',
    rare: 'border-blue-500 dark:border-blue-400',
    legendary: 'border-purple-500 dark:border-purple-400',
  };

  const handleUseItem = (item: typeof player.inventory[0]) => {
    if (item.readable) {
      setReadingBook(item);
    } else if (item.effect) {
      // Apply effect
      addLog({
        type: 'success',
        message: `Used ${item.name}. ${item.effect.stat} ${item.effect.modifier > 0 ? '+' : ''}${item.effect.modifier}`,
        icon: '✨',
      });
      removeItem(item.id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="ornate-border bg-white dark:bg-belle-navy/30 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-display text-belle-burgundy dark:text-belle-gold">
            Inventory
          </h2>
          <button
            onClick={() => setView('main')}
            className="px-4 py-2 border-2 border-belle-burgundy dark:border-belle-gold text-belle-burgundy dark:text-belle-gold rounded hover:bg-belle-burgundy/10 transition-all"
          >
            ← Back
          </button>
        </div>

        <div className="flex items-center gap-4 text-sm text-belle-navy dark:text-belle-cream">
          <span>Items: {player.inventory.length}</span>
          <span>|</span>
          <span>Gold: {player.gold} ₣</span>
        </div>

        {player.inventory.length === 0 ? (
          <div className="text-center py-12 text-belle-navy/60 dark:text-belle-cream/60">
            <p className="text-xl">Your satchel is empty</p>
            <p className="text-sm mt-2">Explore locations to find items</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {player.inventory.map((item) => (
              <div
                key={item.id}
                className={clsx(
                  'border-2 rounded-lg p-4 space-y-2 transition-all hover:shadow-lg',
                  rarityColors[item.rarity]
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-display text-lg text-belle-burgundy dark:text-belle-gold">
                      {item.name}
                    </h3>
                    <p className="text-xs text-belle-navy/70 dark:text-belle-cream/70 capitalize">
                      {item.type} • {item.rarity}
                    </p>
                  </div>
                  <span className="text-sm text-belle-navy dark:text-belle-gold font-semibold">
                    {item.value} ₣
                  </span>
                </div>

                <p className="text-sm text-belle-navy dark:text-belle-cream">
                  {item.description}
                </p>

                {item.historicalContext && (
                  <p className="text-xs text-belle-navy/60 dark:text-belle-cream/60 italic">
                    {item.historicalContext}
                  </p>
                )}

                <div className="flex gap-2 pt-2">
                  {item.readable && (
                    <button
                      onClick={() => handleUseItem(item)}
                      className="px-3 py-1 bg-belle-sage text-belle-navy rounded hover:bg-belle-sage/90 transition-all text-sm"
                    >
                      📖 Read
                    </button>
                  )}
                  {item.effect && (
                    <button
                      onClick={() => handleUseItem(item)}
                      className="px-3 py-1 bg-belle-burgundy text-belle-cream rounded hover:bg-belle-burgundy/90 transition-all text-sm"
                    >
                      ✨ Use
                    </button>
                  )}
                  <button
                    onClick={() => {
                      removeItem(item.id);
                      useGameStore.getState().updatePlayer({
                        gold: player.gold + Math.floor(item.value * 0.5),
                      });
                      addLog({
                        type: 'info',
                        message: `Sold ${item.name} for ${Math.floor(item.value * 0.5)} ₣`,
                        icon: '💰',
                      });
                    }}
                    className="px-3 py-1 bg-red-600/20 text-red-700 dark:text-red-400 rounded hover:bg-red-600/30 transition-all text-sm"
                  >
                    🗑️ Sell
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryView;
