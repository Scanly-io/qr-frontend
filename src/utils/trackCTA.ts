/**
 * Shared CTA click tracking utility.
 *
 * Call this from any block that has an outbound link or action the user
 * can click on.  The event is sent fire-and-forget so it never blocks
 * the user's navigation.
 *
 * @param buttonId  - Unique block / element ID (e.g. block.id)
 * @param label     - Human-readable label (button text, platform name, etc.)
 * @param url       - Destination URL the user is navigating to
 * @param blockType - Optional: the block type for richer analytics (e.g. "social-links", "hero")
 */

// Allow the public page to set the canonical QR slug once so every
// trackCTA call uses it instead of guessing from the URL path.
let _qrSlug: string | null = null;
export function setTrackingSlug(slug: string) {
  _qrSlug = slug;
}

export function trackCTA(
  buttonId: string,
  label: string,
  url: string,
  blockType?: string,
) {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost';
    const slug = _qrSlug || window.location.pathname.split('/public/')[1]?.split('/')[0];

    if (!slug) return;

    // Fire-and-forget — we never await this so it can't block the click
    fetch(`${API_BASE_URL}/analytics/button-click`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug,
        buttonId,
        label,
        url,
        blockType: blockType || 'unknown',
        timestamp: new Date().toISOString(),
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      }),
      // Use keepalive so the request survives page navigations
      keepalive: true,
    }).catch(() => {
      // Silently fail — analytics should never break the user experience
    });
  } catch {
    // Defensive: never throw from analytics
  }
}
