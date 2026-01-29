import { useEffect, useCallback } from 'react';

interface KeyboardNavigationOptions {
  onSave?: () => void;
  onPreview?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onEscape?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onEnter?: () => void;
  onTogglePalette?: () => void;
  onToggleInspector?: () => void;
  onToggleSplitView?: () => void;
  onShowShortcuts?: () => void;
  enabled?: boolean;
}

/**
 * useKeyboardNavigation - Hook to handle keyboard shortcuts in the editor
 * 
 * Provides comprehensive keyboard navigation for accessibility and power users.
 * All shortcuts follow common conventions (Ctrl+S for save, etc.)
 * 
 * @param options - Callback functions for various keyboard actions
 */
export function useKeyboardNavigation({
  onSave,
  onPreview,
  onUndo,
  onRedo,
  onDelete,
  onDuplicate,
  onEscape,
  onArrowUp,
  onArrowDown,
  onEnter,
  onTogglePalette,
  onToggleInspector,
  onToggleSplitView,
  onShowShortcuts,
  enabled = true,
}: KeyboardNavigationOptions) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger shortcuts if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      const isTyping = 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.isContentEditable;

      // Ctrl/Cmd + Key shortcuts (work even when typing)
      const ctrlKey = e.ctrlKey || e.metaKey;

      if (ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 's':
            e.preventDefault();
            onSave?.();
            return;
          case 'p':
            e.preventDefault();
            onPreview?.();
            return;
          case 'z':
            if (e.shiftKey) {
              e.preventDefault();
              onRedo?.();
            } else {
              e.preventDefault();
              onUndo?.();
            }
            return;
          case 'd':
            e.preventDefault();
            onDuplicate?.();
            return;
          case '1':
            e.preventDefault();
            onTogglePalette?.();
            return;
          case '2':
            e.preventDefault();
            onToggleInspector?.();
            return;
          case '3':
            e.preventDefault();
            onToggleSplitView?.();
            return;
        }
      }

      // Don't trigger non-modifier shortcuts when typing
      if (isTyping) return;

      // Single key shortcuts (only when not typing)
      switch (e.key) {
        case 'Escape':
          onEscape?.();
          break;
        case 'Delete':
        case 'Backspace':
          onDelete?.();
          break;
        case 'ArrowUp':
          e.preventDefault();
          onArrowUp?.();
          break;
        case 'ArrowDown':
          e.preventDefault();
          onArrowDown?.();
          break;
        case 'Enter':
          onEnter?.();
          break;
        case '?':
          if (e.shiftKey) {
            e.preventDefault();
            onShowShortcuts?.();
          }
          break;
      }
    },
    [
      enabled,
      onSave,
      onPreview,
      onUndo,
      onRedo,
      onDelete,
      onDuplicate,
      onEscape,
      onArrowUp,
      onArrowDown,
      onEnter,
      onTogglePalette,
      onToggleInspector,
      onToggleSplitView,
      onShowShortcuts,
    ]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, handleKeyDown]);
}
