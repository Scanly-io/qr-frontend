/**
 * Payment Context Provider
 * 
 * Unified payment system for all purchasable items across the platform.
 * Supports Stripe Connect for direct-to-creator payments.
 * 
 * Features:
 * - Global cart management
 * - Stripe Connect integration
 * - Embedded checkout
 * - Multi-item purchases
 * - Appointment pre-payments
 */

/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import type { Stripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { X, Shield, Lock } from 'lucide-react';
import { StripeIcon, BrandColors } from '@/components/icons/BrandIcons';

// Types
export interface PurchasableItem {
  id: string;
  type: 'artwork' | 'appointment' | 'product' | 'service' | 'tip' | 'donation';
  name: string;
  price: number;
  currency?: string;
  description?: string;
  image?: string;
  quantity?: number;
  metadata?: Record<string, unknown>;
  
  // Stripe IDs (if pre-created in creator's Stripe account)
  stripeProductId?: string;
  stripePriceId?: string;
}

export interface CartItem extends PurchasableItem {
  quantity: number;
  addedAt: number;
}

export interface CheckoutMetadata {
  creatorId: string;
  micrositeId?: string;
  successUrl?: string;
  cancelUrl?: string;
  customerEmail?: string;
  customerName?: string;
  
  // For appointments
  appointmentDate?: string;
  appointmentTime?: string;
  
  // For artwork
  artworkId?: string;
  artistName?: string;
}

interface PaymentContextValue {
  // Cart state
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  
  // Cart actions
  addToCart: (item: PurchasableItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Checkout
  initiateCheckout: (metadata: CheckoutMetadata) => Promise<void>;
  quickPurchase: (item: PurchasableItem, metadata: CheckoutMetadata) => Promise<void>;
  
  // State
  isCheckoutLoading: boolean;
  checkoutError: string | null;
  isCheckoutOpen: boolean;
  closeCheckout: () => void;
  
  // Stripe instance
  stripe: Stripe | null;
  clientSecret: string | null;
}

const PaymentContext = createContext<PaymentContextValue | undefined>(undefined);

// Stripe configuration
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

interface PaymentProviderProps {
  children: ReactNode;
}

export function PaymentProvider({ children }: PaymentProviderProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Initialize Stripe
  React.useEffect(() => {
    if (STRIPE_PUBLISHABLE_KEY) {
      loadStripe(STRIPE_PUBLISHABLE_KEY).then((stripeInstance) => {
        setStripe(stripeInstance);
      });
    } else {
      console.error('❌ Missing VITE_STRIPE_PUBLISHABLE_KEY in environment');
    }
  }, []);

  // Computed values
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Add item to cart
  const addToCart = useCallback((item: PurchasableItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        // Update quantity if item already in cart
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + (item.quantity || 1) }
            : cartItem
        );
      } else {
        // Add new item
        return [...prevCart, {
          ...item,
          quantity: item.quantity || 1,
          addedAt: Date.now(),
        }];
      }
    });
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  // Clear cart
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Create Stripe checkout session (returns client secret for embedded checkout)
  const createCheckoutSession = async (
    items: PurchasableItem[],
    metadata: CheckoutMetadata
  ): Promise<string> => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3014';
    const checkoutUrl = `${apiUrl}/stripe/checkout/create`;
    
    const response = await fetch(checkoutUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: items.map(item => ({
          name: item.name,
          description: item.description,
          price: item.price,
          quantity: item.quantity || 1,
          currency: item.currency || 'USD',
          image: item.image,
          metadata: item.metadata,
          stripeProductId: item.stripeProductId,
          stripePriceId: item.stripePriceId,
        })),
        metadata: {
          ...metadata,
          cartItems: JSON.stringify(items.map(i => i.id)),
        },
        uiMode: 'embedded', // Request embedded checkout
        returnUrl: metadata.successUrl || `${window.location.origin}/payment/success`,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Checkout session creation failed:', error);
      throw new Error(error.message || 'Failed to create checkout session');
    }

    const { clientSecret } = await response.json();
    return clientSecret;
  };

  // Close checkout modal
  const closeCheckout = useCallback(() => {
    setIsCheckoutOpen(false);
    setClientSecret(null);
    setIsCheckoutLoading(false);
  }, []);

  // Initiate checkout with current cart
  const initiateCheckout = useCallback(async (metadata: CheckoutMetadata) => {
    if (cart.length === 0) {
      setCheckoutError('Cart is empty');
      return;
    }

    if (!stripe) {
      setCheckoutError('Stripe not initialized');
      return;
    }

    setIsCheckoutLoading(true);
    setCheckoutError(null);

    try {
      const secret = await createCheckoutSession(cart, metadata);
      
      // Open embedded checkout modal
      setClientSecret(secret);
      setIsCheckoutOpen(true);
      setIsCheckoutLoading(false);
    } catch (error) {
      console.error('Checkout error:', error);
      setCheckoutError(error instanceof Error ? error.message : 'Checkout failed');
      setIsCheckoutLoading(false);
    }
  }, [cart, stripe]);

  // Quick purchase for single items (bypass cart)
  const quickPurchase = useCallback(async (
    item: PurchasableItem,
    metadata: CheckoutMetadata
  ) => {
    if (!stripe) {
      console.error('Stripe not initialized');
      setCheckoutError('Stripe not initialized');
      return;
    }

    setIsCheckoutLoading(true);
    setCheckoutError(null);

    try {
      const secret = await createCheckoutSession([item], metadata);
      
      // Open embedded checkout modal
      setClientSecret(secret);
      setIsCheckoutOpen(true);
      setIsCheckoutLoading(false);
    } catch (error) {
      console.error('Purchase error:', error);
      setCheckoutError(error instanceof Error ? error.message : 'Purchase failed');
      setIsCheckoutLoading(false);
    }
  }, [stripe]);

  const value: PaymentContextValue = {
    cart,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    initiateCheckout,
    quickPurchase,
    isCheckoutLoading,
    checkoutError,
    isCheckoutOpen,
    closeCheckout,
    stripe,
    clientSecret,
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
      
      {/* Embedded Checkout Modal */}
      {isCheckoutOpen && clientSecret && stripe && (
        <EmbeddedCheckoutProvider
          stripe={stripe}
          options={{
            clientSecret,
          }}
        >
          <CheckoutModal onClose={closeCheckout} />
        </EmbeddedCheckoutProvider>
      )}
    </PaymentContext.Provider>
  );
}

// Checkout Modal Component
function CheckoutModal({ onClose }: { onClose: () => void }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  // Listen for Stripe errors and events
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'stripe-error') {
        setError(event.data.message);
        setIsLoading(false);
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    // Hide loading after timeout
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // Increased to 5 seconds
    
    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(timer);
    };
  }, []);
  
  return (
    <div className="fixed inset-0 z-[9999] bg-white dark:bg-gray-900 md:bg-black/80 md:backdrop-blur-sm">
      {/* Mobile: Full screen app-like, Desktop: Centered modal */}
      <div className="h-full md:flex md:items-center md:justify-center md:p-4">
        {/* Modal Container */}
        <div className="relative h-full w-full md:max-w-md md:max-h-[85vh] bg-white dark:bg-gray-900 md:rounded-3xl md:shadow-2xl flex flex-col overflow-hidden md:border md:border-gray-200 md:dark:border-gray-800">
          {/* Header - Mobile optimized */}
          <div className="flex items-center justify-between px-4 py-3 md:py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex-shrink-0 safe-area-top">
            <div className="flex-1">
              <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">Checkout</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <StripeIcon className="w-10 h-4" style={{ color: BrandColors.stripe }} />
                <span className="text-xs text-gray-500 dark:text-gray-400">Secure payment</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation"
              aria-label="Close checkout"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          
          {/* Error State */}
          {error && (
            <div className="px-4 py-6 md:py-8">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Loading State - Mobile optimized */}
          {isLoading && !error && (
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
              <div className="relative mb-6">
                {/* Outer ring */}
                <div className="w-16 h-16 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
                {/* Spinning ring */}
                <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-base font-medium text-gray-900 dark:text-white">Loading checkout</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Setting up secure payment...</p>
              </div>
            </div>
          )}
          
          {/* Embedded Checkout - Optimized scrolling for mobile */}
          <div className={`flex-1 overflow-y-auto overscroll-contain ${isLoading ? 'hidden' : 'block'}`}>
            <div className="min-h-full pb-safe">
              <EmbeddedCheckout />
            </div>
          </div>

          {/* Footer - Trust badges (only on desktop or when loaded) */}
          {!isLoading && !error && (
            <div className="hidden md:flex border-t border-gray-200 dark:border-gray-700 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
              <div className="flex items-center justify-center gap-4 w-full text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-green-600" />
                  <span>256-bit SSL</span>
                </div>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-green-600" />
                  <span>PCI Compliant</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Hook to use payment context
export function usePayment() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
}
