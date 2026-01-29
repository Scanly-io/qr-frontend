import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';
import { animations } from '@/utils/designSystem';

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

const shortcuts: Shortcut[] = [
  // Navigation
  { keys: ['Tab'], description: 'Navigate between sections', category: 'Navigation' },
  { keys: ['Shift', 'Tab'], description: 'Navigate backwards', category: 'Navigation' },
  { keys: ['?'], description: 'Show keyboard shortcuts', category: 'Navigation' },
  { keys: ['Esc'], description: 'Close modals/deselect blocks', category: 'Navigation' },
  
  // Block Management
  { keys: ['↑', '↓'], description: 'Select previous/next block', category: 'Block Management' },
  { keys: ['Enter'], description: 'Edit selected block', category: 'Block Management' },
  { keys: ['Delete'], description: 'Delete selected block', category: 'Block Management' },
  { keys: ['Backspace'], description: 'Delete selected block', category: 'Block Management' },
  { keys: ['Ctrl', 'D'], description: 'Duplicate selected block', category: 'Block Management' },
  
  // Editor Actions
  { keys: ['Ctrl', 'S'], description: 'Save microsite', category: 'Editor Actions' },
  { keys: ['Ctrl', 'P'], description: 'Preview microsite', category: 'Editor Actions' },
  { keys: ['Ctrl', 'Z'], description: 'Undo last action', category: 'Editor Actions' },
  { keys: ['Ctrl', 'Shift', 'Z'], description: 'Redo last action', category: 'Editor Actions' },
  
  // View Controls
  { keys: ['Ctrl', '1'], description: 'Toggle block palette', category: 'View Controls' },
  { keys: ['Ctrl', '2'], description: 'Toggle block inspector', category: 'View Controls' },
  { keys: ['Ctrl', '3'], description: 'Toggle split view', category: 'View Controls' },
];

interface KeyboardShortcutsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsPanel({ isOpen, onClose }: KeyboardShortcutsPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const focusableElements = document.querySelectorAll(
      '[data-keyboard-shortcuts-panel] button, [data-keyboard-shortcuts-panel] input'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleTab);
    firstElement?.focus();

    return () => window.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  // Group shortcuts by category
  const categories = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, Shortcut[]>);

  // Filter shortcuts based on search
  const filteredCategories = Object.entries(categories).reduce((acc, [category, items]) => {
    const filtered = items.filter(
      (shortcut) =>
        shortcut.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shortcut.keys.some((key) => key.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as Record<string, Shortcut[]>);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            data-keyboard-shortcuts-panel
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={animations.spring.gentle}
            role="dialog"
            aria-modal="true"
            aria-labelledby="shortcuts-title"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-3xl max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Keyboard className="w-6 h-6" />
                  <h2 id="shortcuts-title" className="text-xl font-bold">
                    Keyboard Shortcuts
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Close keyboard shortcuts panel"
                  {...animations.hover.scale}
                  {...animations.tap}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search */}
              <input
                type="text"
                placeholder="Search shortcuts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
                aria-label="Search keyboard shortcuts"
              />
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(85vh-140px)] px-6 py-4">
              {Object.entries(filteredCategories).map(([category, items]) => (
                <div key={category} className="mb-6 last:mb-0">
                  <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wide mb-3">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {items.map((shortcut, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-stone-50 transition-colors"
                      >
                        <span className="text-stone-700">{shortcut.description}</span>
                        <div className="flex items-center gap-1">
                          {shortcut.keys.map((key, keyIndex) => (
                            <span key={keyIndex} className="flex items-center gap-1">
                              <kbd className="px-2 py-1 text-xs font-semibold text-stone-600 bg-stone-100 border border-stone-300 rounded shadow-sm">
                                {key}
                              </kbd>
                              {keyIndex < shortcut.keys.length - 1 && (
                                <span className="text-stone-400 text-xs">+</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {Object.keys(filteredCategories).length === 0 && (
                <div className="text-center py-12 text-stone-400">
                  <Keyboard className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No shortcuts found matching "{searchQuery}"</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-stone-50 border-t border-stone-200 px-6 py-3 text-center text-xs text-stone-500">
              Press <kbd className="px-2 py-0.5 bg-white border border-stone-300 rounded font-semibold">?</kbd> anytime to show this panel
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
