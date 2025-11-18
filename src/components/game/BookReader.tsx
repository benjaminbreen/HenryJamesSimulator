import type { Item } from '../../types/game';
import { useGameStore } from '../../stores/gameStore';

interface BookReaderProps {
  book: Item;
}

const BookReader = ({ book }: BookReaderProps) => {
  const { setReadingBook } = useGameStore();

  // Mock generated content - in full version this would be LLM-generated
  const fullContent = `${book.content}

The text continues in the characteristic style of the period, with lengthy, precisely balanced sentences that unfold layer upon layer of meaning. The author—whether it be James himself or one of his contemporaries—demonstrates that peculiar late-nineteenth-century fascination with consciousness, with the interior life of the mind, with what remains unspoken beneath the surface of polite conversation.

One finds here the tension between American vitality and European cultivation, between the modern and the traditional, between the life of action and the life of contemplation. It is all very subtle, very refined, very much of its moment.

The prose winds onward, accumulating clauses and qualifications, circling its subject as if reluctant to arrive at any conclusion too definitive, too unambiguous. This is the method of an age that valued nuance above all else, that saw truth not as a simple matter of fact but as something complex, layered, perpetually shifting in the light of further observation...`;

  return (
    <div className="space-y-4">
      <div className="ornate-border bg-white dark:bg-belle-navy/30 p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-display text-belle-burgundy dark:text-belle-gold">
              {book.name}
            </h2>
            <p className="text-sm text-belle-navy/70 dark:text-belle-cream/70 mt-1">
              {book.type} • {book.rarity}
            </p>
          </div>
          <button
            onClick={() => setReadingBook(null)}
            className="px-4 py-2 border-2 border-belle-burgundy dark:border-belle-gold text-belle-burgundy dark:text-belle-gold rounded hover:bg-belle-burgundy/10 transition-all"
          >
            ← Close
          </button>
        </div>

        <div className="h-px bg-belle-gold/30" />

        <div className="prose dark:prose-invert max-w-none">
          <div className="text-belle-navy dark:text-belle-cream leading-relaxed space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
            {fullContent.split('\n\n').map((paragraph, i) => (
              <p key={i} className="first-letter:text-4xl first-letter:font-display first-letter:text-belle-burgundy dark:first-letter:text-belle-gold first-letter:float-left first-letter:mr-2">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {book.historicalContext && (
          <div className="mt-6 p-4 bg-belle-cream/50 dark:bg-black/20 rounded">
            <h3 className="font-display text-sm text-belle-burgundy dark:text-belle-gold mb-2">
              Historical Context:
            </h3>
            <p className="text-xs text-belle-navy dark:text-belle-cream italic">
              {book.historicalContext}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookReader;
