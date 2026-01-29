import { useEffect, useRef } from 'react';

interface ScreenReaderAnnouncerProps {
  message: string;
  priority?: 'polite' | 'assertive';
  clearOnUnmount?: boolean;
}

/**
 * ScreenReaderAnnouncer - Announces messages to screen readers
 * 
 * This component uses ARIA live regions to announce dynamic content changes
 * to screen reader users without interrupting their current task.
 * 
 * @param message - The message to announce
 * @param priority - 'polite' (default) waits for user to finish, 'assertive' interrupts immediately
 * @param clearOnUnmount - Whether to clear the message when component unmounts
 */
export function ScreenReaderAnnouncer({ 
  message, 
  priority = 'polite',
  clearOnUnmount = true 
}: ScreenReaderAnnouncerProps) {
  const previousMessage = useRef('');

  useEffect(() => {
    // Only announce if message changed
    if (message && message !== previousMessage.current) {
      previousMessage.current = message;
    }

    return () => {
      if (clearOnUnmount) {
        previousMessage.current = '';
      }
    };
  }, [message, clearOnUnmount]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}
