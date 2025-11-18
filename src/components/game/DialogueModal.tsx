import { useState, useEffect, useRef } from 'react';
import type { AgenticNPC } from '../../types/npc';

interface DialogueModalProps {
  npc: AgenticNPC;
  playerName: string;
  playerProfession: string;
  locationName: string;
  locationDescription: string;
  onClose: () => void;
  onSendMessage: (message: string) => Promise<void>;
  conversationHistory: Array<{
    speaker: 'player' | 'npc';
    message: string;
    timestamp: number;
  }>;
  isLoading?: boolean;
}

export const DialogueModal = ({
  npc,
  playerName,
  playerProfession: _playerProfession,
  locationName,
  locationDescription: _locationDescription,
  onClose,
  onSendMessage,
  conversationHistory,
  isLoading = false,
}: DialogueModalProps) => {
  const [inputMessage, setInputMessage] = useState('');
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory, typingText]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Typing animation for latest NPC message
  useEffect(() => {
    if (conversationHistory.length === 0) return;

    const latestMessage = conversationHistory[conversationHistory.length - 1];
    if (latestMessage.speaker !== 'npc') return;

    setIsTyping(true);
    setTypingText('');

    let currentIndex = 0;
    const text = latestMessage.message;
    const typingSpeed = 30; // ms per character

    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setTypingText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [conversationHistory]);

  const handleSend = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const message = inputMessage.trim();
    setInputMessage('');
    await onSendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Quick response suggestions
  const suggestions = [
    'Tell me about yourself',
    'What brings you to the fair?',
    'What do you think of the exposition?',
    'Good day to you',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-belle-navy/95 rounded-lg shadow-2xl flex flex-col ornate-border">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b-2 border-belle-gold/30">
          <div className="flex-1">
            <h2 className="text-2xl font-display text-belle-burgundy dark:text-belle-gold flex items-center gap-2">
              <span>Conversation with {npc.name}</span>
            </h2>
            <p className="text-sm text-belle-navy/70 dark:text-belle-cream/70 mt-1">
              {npc.profession}, Age {npc.age} • {locationName}
            </p>
            <div className="flex gap-2 mt-2 text-xs">
              <span className="px-2 py-1 bg-belle-gold/20 rounded capitalize">
                {npc.mood}
              </span>
              <span className="px-2 py-1 bg-belle-sage/20 rounded capitalize">
                {npc.currentActivity}
              </span>
              {npc.currentGoal && (
                <span className="px-2 py-1 bg-belle-burgundy/20 rounded" title={npc.currentGoal.description}>
                  🎯 Has a goal
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-belle-navy/50 hover:text-belle-burgundy dark:text-belle-cream/50 dark:hover:text-belle-gold transition-colors text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Conversation History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-belle-cream/30 dark:bg-black/20">
          {conversationHistory.length === 0 ? (
            <div className="text-center text-belle-navy/60 dark:text-belle-cream/60 italic py-8">
              <p className="text-lg mb-2">Begin your conversation...</p>
              <p className="text-sm">
                {npc.name} is currently {npc.currentActivity}.
              </p>
              {npc.recentThoughts.length > 0 && (
                <p className="text-xs mt-2 opacity-70">
                  (Thinking: "{npc.recentThoughts[0]}")
                </p>
              )}
            </div>
          ) : (
            conversationHistory.map((entry, idx) => {
              const isLatest = idx === conversationHistory.length - 1;
              const displayMessage = entry.speaker === 'npc' && isLatest && isTyping ? typingText : entry.message;

              return (
                <div
                  key={idx}
                  className={`flex ${entry.speaker === 'player' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      entry.speaker === 'player'
                        ? 'bg-belle-burgundy text-belle-cream'
                        : 'bg-white dark:bg-belle-navy/60 text-belle-navy dark:text-belle-cream border-2 border-belle-gold/30'
                    }`}
                  >
                    <div className="text-xs opacity-70 mb-1">
                      {entry.speaker === 'player' ? playerName : npc.name}
                    </div>
                    <p className="text-sm leading-relaxed">
                      {displayMessage}
                      {isLatest && isTyping && (
                        <span className="inline-block w-1 h-4 bg-current ml-1 animate-pulse" />
                      )}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions */}
        {conversationHistory.length === 0 && (
          <div className="px-6 py-3 border-t border-belle-gold/20">
            <p className="text-xs text-belle-navy/70 dark:text-belle-cream/70 mb-2">Quick responses:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputMessage(suggestion)}
                  className="px-3 py-1 text-xs bg-belle-gold/10 hover:bg-belle-gold/20 text-belle-navy dark:text-belle-cream rounded transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-6 border-t-2 border-belle-gold/30">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Speak to ${npc.name}...`}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-white dark:bg-belle-navy/60 border-2 border-belle-gold/30 rounded-lg focus:border-belle-burgundy dark:focus:border-belle-gold outline-none text-belle-navy dark:text-belle-cream placeholder-belle-navy/50 dark:placeholder-belle-cream/50 disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!inputMessage.trim() || isLoading}
              className="px-6 py-3 bg-belle-burgundy text-belle-cream rounded-lg hover:bg-belle-burgundy/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Thinking...
                </span>
              ) : (
                'Send'
              )}
            </button>
          </div>

          {/* Context info */}
          <div className="mt-3 text-xs text-belle-navy/60 dark:text-belle-cream/60 italic">
            <p>💡 Powered by Gemini AI • Historically accurate Belle Époque conversation</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DialogueModal;
