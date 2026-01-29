/**
 * Payment utility functions
 */

import type { PurchasableItem } from '@/contexts/PaymentContext';

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Calculate total for items
 */
export function calculateTotal(items: PurchasableItem[]): number {
  return items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
}

/**
 * Validate purchasable item
 */
export function validatePurchasableItem(item: Partial<PurchasableItem>): item is PurchasableItem {
  return !!(
    item.id &&
    item.type &&
    item.name &&
    typeof item.price === 'number' &&
    item.price >= 0
  );
}
