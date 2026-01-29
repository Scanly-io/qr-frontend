import { useEffect, useRef } from 'react';

interface FocusTrapOptions {
  enabled?: boolean;
  onEscape?: () => void;
  initialFocus?: boolean;
  restoreFocus?: boolean;
}

/**
 * useFocusTrap - Traps focus within a container (e.g., modals, panels)
 * 
 * Ensures keyboard users can't accidentally tab out of modals or dialogs.
 * Automatically handles Tab/Shift+Tab cycling and Escape key.
 * 
 * @param containerRef - Ref to the container element to trap focus within
 * @param options - Configuration options
 */
export function useFocusTrap<T extends HTMLElement>(
  containerRef: React.RefObject<T>,
  {
    enabled = true,
    onEscape,
    initialFocus = true,
    restoreFocus = true,
  }: FocusTrapOptions = {}
) {
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    // Store previously focused element for restoration
    if (restoreFocus) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
    }

    const container = containerRef.current;

    // Get all focusable elements
    const getFocusableElements = () => {
      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ].join(', ');

      return Array.from(
        container.querySelectorAll<HTMLElement>(focusableSelectors)
      ).filter((el) => {
        // Check if element is visible
        return (
          el.offsetParent !== null &&
          !el.hasAttribute('disabled') &&
          !el.getAttribute('aria-hidden')
        );
      });
    };

    // Focus first element
    if (initialFocus) {
      const focusableElements = getFocusableElements();
      focusableElements[0]?.focus();
    }

    // Handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Escape key
      if (e.key === 'Escape') {
        onEscape?.();
        return;
      }

      // Handle Tab key
      if (e.key === 'Tab') {
        const focusableElements = getFocusableElements();
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (!firstElement || !lastElement) return;

        if (e.shiftKey) {
          // Shift + Tab (backwards)
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab (forwards)
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);

      // Restore focus to previously focused element
      if (restoreFocus && previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [enabled, containerRef, onEscape, initialFocus, restoreFocus]);
}

/**
 * useFocusManagement - Manages focus for a list of items (e.g., block selection)
 * 
 * Provides arrow key navigation and focus management for lists.
 * 
 * @param items - Array of item IDs
 * @param selectedId - Currently selected item ID
 * @param onSelect - Callback when an item is selected
 */
export function useFocusManagement(
  items: string[],
  selectedId: string | null,
  onSelect: (id: string) => void
) {
  const selectNext = () => {
    if (items.length === 0) return;

    const currentIndex = selectedId ? items.indexOf(selectedId) : -1;
    const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    onSelect(items[nextIndex]);
  };

  const selectPrevious = () => {
    if (items.length === 0) return;

    const currentIndex = selectedId ? items.indexOf(selectedId) : -1;
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    onSelect(items[prevIndex]);
  };

  return {
    selectNext,
    selectPrevious,
  };
}

/**
 * useAutoFocus - Automatically focuses an element when mounted
 * 
 * @param ref - Ref to the element to focus
 * @param enabled - Whether auto-focus is enabled
 */
export function useAutoFocus<T extends HTMLElement>(
  ref: React.RefObject<T>,
  enabled = true
) {
  useEffect(() => {
    if (enabled && ref.current) {
      // Small delay to ensure element is fully rendered
      setTimeout(() => {
        ref.current?.focus();
      }, 100);
    }
  }, [enabled, ref]);
}
