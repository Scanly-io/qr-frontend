import { useEffect, useRef } from 'react';

/**
 * useAnnouncer - Hook to announce messages to screen readers
 * 
 * Usage:
 * const announce = useAnnouncer();
 * announce('Block added successfully');
 */
export function useAnnouncer() {
  const announcerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create announcer element if it doesn't exist
    if (!announcerRef.current) {
      const announcer = document.createElement('div');
      announcer.setAttribute('role', 'status');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      document.body.appendChild(announcer);
      announcerRef.current = announcer;
    }

    return () => {
      // Cleanup on unmount
      if (announcerRef.current) {
        announcerRef.current.remove();
        announcerRef.current = null;
      }
    };
  }, []);

  return (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!announcerRef.current) return;

    // Update aria-live if priority changes
    announcerRef.current.setAttribute('aria-live', priority);

    // Clear and set message (forces screen reader to announce)
    announcerRef.current.textContent = '';
    setTimeout(() => {
      if (announcerRef.current) {
        announcerRef.current.textContent = message;
      }
    }, 100);
  };
}
