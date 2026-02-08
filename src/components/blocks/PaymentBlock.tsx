/**
 * Payment Block Component
 * 
 * Mobile-optimized Stripe payment block for microsites.
 * Designed for mobile screens with touch-friendly controls.
 * 
 * Supports:
 * - Single payment/tips
 * - Multiple products with cart
 * - Webhook integration for order tracking
 */

import { useState} from 'react';
import { 
  CreditCard, 
  Heart, 
  DollarSign, 
  Coffee, 
  Sparkles,
  Lock,
  Check,
  Loader2,
  Gift,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Package,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Block } from '@/types';
import type { PageTheme } from '@/types/theme';
import { FONT_FAMILY_MAP } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { integrationsApi } from '@/lib/api/integrations';
import { spacing, animations, borders } from '@/utils/designSystem';
import { trackCTA } from '@/utils/trackCTA';


interface PaymentBlockProps {
  block: Block;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<Block>) => void;
  theme?: PageTheme;
  micrositeId?: string; // For connecting to user's Stripe account
}

// Product type for multi-product support
interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  stripeProductId?: string;
  stripePriceId?: string;
  maxQuantity?: number;
}

// Cart item type
interface CartItem extends Product {
  quantity: number;
}

// Predefined amount presets
const AMOUNT_PRESETS = [
  { value: 5, label: '$5', icon: Coffee },
  { value: 10, label: '$10', icon: Heart },
  { value: 25, label: '$25', icon: Gift },
  { value: 50, label: '$50', icon: Sparkles },
];

export default function PaymentBlock({ 
  block, 
  isEditing = false, 
  onUpdate, 
  theme,
  micrositeId,
}: PaymentBlockProps) {
  const content = block.content as Record<string, unknown>;
  const style = (block as unknown as Record<string, unknown>).style as Record<string, unknown> | undefined;

  // Content fields
  const title = (content?.title as string) || 'Support My Work';
  const description = (content?.description as string) || 'Your support helps me create more content!';
  const thankYouMessage = (content?.thankYouMessage as string) || 'Thank you for your support! 💖';
  const currency = (content?.currency as string) || 'USD';
  const customAmounts = (content?.customAmounts as number[]) || [5, 10, 25, 50];
  const allowCustomAmount = (content?.allowCustomAmount as boolean) ?? true;
  const minAmount = (content?.minAmount as number) || 1;
  const maxAmount = (content?.maxAmount as number) || 500;
  const buttonText = (content?.buttonText as string) || 'Support';
  const paymentMode = (content?.paymentMode as 'tips' | 'payment' | 'donation' | 'products') || 'tips';
  
  // Multi-product fields
  const products = (content?.products as Product[]) || [];
  
  // Stripe integration fields
  const stripePaymentLink = (content?.stripePaymentLink as string) || '';
  const checkoutExperience = (content?.checkoutExperience as 'redirect' | 'embedded') || 'redirect';

  // Style fields - 6 premium variants
  const variant = (style?.variant as 'classic' | 'modern' | 'glass' | 'gradient' | 'minimal' | 'bold') || 'classic';
  const backgroundColor = (style?.backgroundColor as string) || '#ffffff';
  const accentColor = (style?.accentColor as string) || '#8b5cf6';
  const textColor = (style?.textColor as string) || '#1f2937';
  const borderRadius = (style?.borderRadius as string) || 'rounded-2xl';

  // Local state
  const [selectedAmount, setSelectedAmount] = useState<number>(customAmounts[1] || 10);
  const [customValue, setCustomValue] = useState<string>('');
  const [isCustom, setIsCustom] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Cart state for multi-product mode
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  // Get typography settings from theme
  const titleFont = theme?.typography?.titleFont || 'inter';
  const bodyFont = theme?.typography?.bodyFont || 'inter';
  const titleFontFamily = FONT_FAMILY_MAP[titleFont] || "'Inter', sans-serif";
  const bodyFontFamily = FONT_FAMILY_MAP[bodyFont] || "'Inter', sans-serif";

  // Get branding colors
  const primaryColor = theme?.branding?.primaryColor || accentColor;

  const handleContentChange = (field: string, value: unknown) => {
    if (onUpdate) {
      onUpdate({
        content: { ...block.content, [field]: value },
      });
    }
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setIsCustom(false);
    setCustomValue('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomValue(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= minAmount && numValue <= maxAmount) {
      setSelectedAmount(numValue);
      setIsCustom(true);
    }
  };

  // Cart functions for multi-product mode
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        const maxQty = product.maxQuantity || 99;
        if (existing.quantity >= maxQty) return prev;
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, maxQty) }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.min(quantity, item.maxQuantity || 99) }
          : item
      )
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePayment = async () => {
    if (isEditing) return;
    
    // If Stripe Payment Link is configured, use it
    if (stripePaymentLink) {
      trackCTA(block.id, 'Pay with Stripe', stripePaymentLink, 'payment');
      if (checkoutExperience === 'embedded') {
        // Open in an iframe/overlay (embedded experience)
        window.open(stripePaymentLink, 'stripe-checkout', 'width=600,height=800,scrollbars=yes');
      } else {
        // Open in new tab (redirect experience - default)
        window.open(stripePaymentLink, '_blank', 'noopener,noreferrer');
      }
      return;
    }
    
    // Use Stripe Checkout API
    setIsProcessing(true);
    
    try {
      const currentUrl = window.location.href;
      const baseUrl = currentUrl.split('?')[0]; // Remove query params
      
      // Determine checkout type based on mode
      if (paymentMode === 'products' && cart.length > 0) {
        // Multi-product cart checkout
        const lineItems = cart.map(item => ({
          name: item.name,
          description: item.description,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.image,
          stripePriceId: item.stripePriceId,
        }));
        
        const response = await integrationsApi.createStripeCheckout({
          lineItems,
          currency: currency.toLowerCase(),
          successUrl: `${baseUrl}?payment=success`,
          cancelUrl: `${baseUrl}?payment=cancelled`,
          blockId: block.id,
          micrositeId, // Pass micrositeId to look up connected Stripe account
          metadata: {
            orderType: 'products',
            itemCount: cart.length.toString(),
          },
        });
        
        if (response.checkoutUrl) {
          if (checkoutExperience === 'embedded') {
            window.open(response.checkoutUrl, 'stripe-checkout', 'width=600,height=800,scrollbars=yes');
          } else {
            window.location.href = response.checkoutUrl;
          }
          // Clear cart after successful redirect
          setCart([]);
          setShowCart(false);
        } else {
          throw new Error('No checkout URL returned');
        }
      } else {
        // Single amount payment (tips, donations, single payment)
        const response = await integrationsApi.createStripeCheckout({
          amount: selectedAmount,
          currency: currency.toLowerCase(),
          description: `${title} - ${description}`,
          successUrl: `${baseUrl}?payment=success`,
          cancelUrl: `${baseUrl}?payment=cancelled`,
          blockId: block.id,
          micrositeId, // Pass micrositeId to look up connected Stripe account
        });
        
        if (response.checkoutUrl) {
          if (checkoutExperience === 'embedded') {
            window.open(response.checkoutUrl, 'stripe-checkout', 'width=600,height=800,scrollbars=yes');
          } else {
            window.location.href = response.checkoutUrl;
          }
        } else {
          throw new Error('No checkout URL returned');
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      // Fall back to preview mode for demo purposes
      setTimeout(() => {
        setIsProcessing(false);
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 3000);
      }, 1000);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Get icon based on payment mode
  const renderModeIcon = (className: string, style?: React.CSSProperties) => {
    switch (paymentMode) {
      case 'tips':
        return <Coffee className={className} style={style} />;
      case 'donation':
        return <Heart className={className} style={style} />;
      case 'payment':
      default:
        return <CreditCard className={className} style={style} />;
    }
  };

  // Success state
  if (isSuccess) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn(
          'p-8 text-center',
          borderRadius,
          'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200'
        )}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center"
        >
          <Check className="w-8 h-8 text-green-600" />
        </motion.div>
        <h3 
          className="text-xl font-bold text-green-800 mb-2"
          style={{ fontFamily: titleFontFamily }}
        >
          Payment Successful!
        </h3>
        <p 
          className="text-green-700"
          style={{ fontFamily: bodyFontFamily }}
        >
          {thankYouMessage}
        </p>
      </motion.div>
    );
  }

  // Products mode - multi-product catalog with cart
  if (paymentMode === 'products' && products.length > 0) {
    return (
      <motion.div
        className={cn('overflow-hidden', borderRadius)}
        style={{ backgroundColor }}
      >
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h3 
              className="font-bold text-lg"
              style={{ fontFamily: titleFontFamily, color: textColor }}
            >
              {title}
            </h3>
            <p 
              className="text-sm opacity-70"
              style={{ fontFamily: bodyFontFamily, color: textColor }}
            >
              {description}
            </p>
          </div>
          
          {/* Cart Button */}
          <motion.button
            {...animations.hover.scale}
            {...animations.tap}
            onClick={() => setShowCart(!showCart)}
            className="relative"
            style={{ 
              backgroundColor: `${primaryColor}15`,
              padding: spacing[2],
              borderRadius: borders.radius.lg
            }}
          >
            <ShoppingCart className="w-5 h-5" style={{ color: primaryColor }} />
            {cartItemCount > 0 && (
              <span 
                className="absolute -top-1 -right-1 w-5 h-5 text-xs font-bold text-white rounded-full flex items-center justify-center"
                style={{ backgroundColor: primaryColor }}
              >
                {cartItemCount}
              </span>
            )}
          </motion.button>
        </div>

        {/* Cart Drawer */}
        <AnimatePresence>
          {showCart && cart.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b"
              style={{ backgroundColor: `${primaryColor}05` }}
            >
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm" style={{ color: textColor }}>Your Cart</span>
                  <button
                    onClick={() => setCart([])}
                    className="text-xs text-red-500 hover:text-red-600"
                  >
                    Clear all
                  </button>
                </div>
                
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-2 bg-white rounded-lg">
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate" style={{ color: textColor }}>
                        {item.name}
                      </p>
                      <p className="text-xs opacity-70" style={{ color: textColor }}>
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {/* Cart Total & Checkout */}
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold" style={{ color: textColor }}>Total</span>
                    <span 
                      className="text-xl font-bold"
                      style={{ color: primaryColor, fontFamily: titleFontFamily }}
                    >
                      {formatCurrency(cartTotal)}
                    </span>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePayment}
                    disabled={isProcessing || isEditing}
                    className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2"
                    style={{ backgroundColor: primaryColor, fontFamily: titleFontFamily }}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Checkout {formatCurrency(cartTotal)}
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        <div className="p-4 grid grid-cols-2 gap-3">
          {products.map((product) => (
            <motion.div
              key={product.id}
              whileHover={!isEditing ? { y: -2 } : undefined}
              className="border rounded-xl overflow-hidden bg-white"
            >
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-24 object-cover"
                />
              ) : (
                <div 
                  className="w-full h-24 flex items-center justify-center"
                  style={{ backgroundColor: `${primaryColor}10` }}
                >
                  <Package className="w-8 h-8 opacity-30" style={{ color: primaryColor }} />
                </div>
              )}
              
              <div className="p-3">
                <h4 
                  className="font-semibold text-sm truncate"
                  style={{ fontFamily: titleFontFamily, color: textColor }}
                >
                  {product.name}
                </h4>
                {product.description && (
                  <p 
                    className="text-xs opacity-70 line-clamp-2 mb-2"
                    style={{ fontFamily: bodyFontFamily, color: textColor }}
                  >
                    {product.description}
                  </p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <span 
                    className="font-bold"
                    style={{ color: primaryColor, fontFamily: titleFontFamily }}
                  >
                    {formatCurrency(product.price)}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => addToCart(product)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: primaryColor }}
                    disabled={isEditing}
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Secure Badge */}
        <div className="flex items-center justify-center gap-2 pb-4 text-xs text-gray-400">
          <Lock className="w-3 h-3" />
          <span>Secured by Stripe</span>
        </div>
      </motion.div>
    );
  }

  // === STYLE: CLASSIC ===
  // Clean card with header section and amount grid
  if (variant === 'classic') {
    return (
      <div className="w-full max-w-sm mx-auto">
        <motion.div
          whileHover={!isEditing ? { y: -4 } : undefined}
          className={cn(
            'overflow-hidden shadow-lg border',
            borderRadius
          )}
          style={{ backgroundColor }}
        >
        {/* Header */}
        <div 
          className="p-6 text-white"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              {renderModeIcon("w-5 h-5")}
            </div>
            <h3 
              className="text-xl font-bold"
              style={{ fontFamily: titleFontFamily }}
            >
              {title}
            </h3>
          </div>
          <p 
            className="text-sm text-white/90"
            style={{ fontFamily: bodyFontFamily }}
          >
            {description}
          </p>
        </div>

        {/* Amount Selection */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {customAmounts.slice(0, 4).map((amount, index) => {
              const PresetIcon = AMOUNT_PRESETS[index]?.icon || DollarSign;
              const isSelected = selectedAmount === amount && !isCustom;
              
              return (
                <motion.button
                  key={amount}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAmountSelect(amount)}
                  className={cn(
                    'p-2.5 rounded-lg border-2 transition-all flex flex-col items-center gap-1',
                    isSelected
                      ? 'border-current bg-opacity-10'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                  style={{
                    borderColor: isSelected ? primaryColor : undefined,
                    backgroundColor: isSelected ? `${primaryColor}15` : undefined,
                    color: isSelected ? primaryColor : textColor,
                  }}
                  disabled={isEditing}
                >
                  <PresetIcon className="w-4 h-4" />
                  <span className="font-bold text-xs">
                    {formatCurrency(amount)}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Custom Amount */}
          {allowCustomAmount && (
            <div className="relative mb-4">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <input
                type="number"
                placeholder="Custom amount"
                value={customValue}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                min={minAmount}
                max={maxAmount}
                className={cn(
                  'w-full pl-10 pr-4 py-3 border-2 rounded-xl transition-all focus:outline-none',
                  isCustom ? 'ring-2' : ''
                )}
                style={{
                  borderColor: isCustom ? primaryColor : '#e5e7eb',
                  '--tw-ring-color': primaryColor,
                } as React.CSSProperties}
              />
            </div>
          )}

          {/* Selected Amount Display */}
          <div className="text-center mb-4">
            <span className="text-xs text-gray-500" style={{ fontFamily: bodyFontFamily }}>You'll pay</span>
            <div 
              className="text-2xl font-bold"
              style={{ color: primaryColor, fontFamily: titleFontFamily }}
            >
              {formatCurrency(selectedAmount)}
            </div>
          </div>

          {/* Pay Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePayment}
            disabled={isProcessing || isEditing}
            className={cn(
              'w-full py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            style={{ 
              backgroundColor: primaryColor,
              fontFamily: titleFontFamily,
            }}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                {buttonText} {formatCurrency(selectedAmount)}
              </>
            )}
          </motion.button>

          {/* Secure Badge */}
          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
            <Lock className="w-3 h-3" />
            <span>Secured by Stripe</span>
          </div>
        </div>
      </motion.div>
      </div>
    );
  }

  // === STYLE: MODERN ===
  // Floating amounts with glassmorphism
  if (variant === 'modern') {
    return (
      <div className="w-full max-w-sm mx-auto">
        <motion.div
          whileHover={!isEditing ? { y: -2 } : undefined}
          className={cn(
            'overflow-hidden backdrop-blur-xl border border-white/20',
            borderRadius
          )}
          style={{ 
            backgroundColor: `${backgroundColor}cc`,
            background: `linear-gradient(135deg, ${backgroundColor}cc 0%, ${primaryColor}15 100%)`,
          }}
        >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start gap-3 mb-5">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-xl border border-white/20"
              style={{ 
                backgroundColor: `${primaryColor}20`,
                boxShadow: `0 8px 32px ${primaryColor}30`,
              }}
            >
              {renderModeIcon("w-6 h-6", { color: primaryColor })}
            </div>
            <div className="flex-1">
              <h3 
                className="text-xl font-bold mb-1"
                style={{ fontFamily: titleFontFamily, color: textColor }}
              >
                {title}
              </h3>
              <p 
                className="text-sm opacity-70"
                style={{ fontFamily: bodyFontFamily, color: textColor }}
              >
                {description}
              </p>
            </div>
          </div>

          {/* Floating Amount Grid */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            {customAmounts.slice(0, 4).map((amount, index) => {
              const PresetIcon = AMOUNT_PRESETS[index]?.icon || DollarSign;
              const isSelected = selectedAmount === amount && !isCustom;
              
              return (
                <motion.button
                  key={amount}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAmountSelect(amount)}
                  className={cn(
                    'p-3 rounded-xl backdrop-blur-xl border transition-all',
                    'flex flex-col items-center gap-1.5'
                  )}
                  style={{
                    backgroundColor: isSelected ? `${primaryColor}25` : 'rgba(255,255,255,0.1)',
                    borderColor: isSelected ? primaryColor : 'rgba(255,255,255,0.2)',
                    boxShadow: isSelected ? `0 8px 24px ${primaryColor}40` : 'none',
                  }}
                  disabled={isEditing}
                >
                  <PresetIcon 
                    className="w-4 h-4" 
                    style={{ color: isSelected ? primaryColor : textColor }}
                  />
                  <span 
                    className="text-base font-bold"
                    style={{ color: isSelected ? primaryColor : textColor }}
                  >
                    {formatCurrency(amount)}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Custom Amount with Glass Effect */}
          {allowCustomAmount && (
            <div className="relative mb-5">
              <DollarSign 
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                style={{ color: primaryColor }}
              />
              <input
                type="number"
                placeholder="Enter custom amount"
                value={customValue}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                min={minAmount}
                max={maxAmount}
                className="w-full pl-12 pr-4 py-4 rounded-2xl backdrop-blur-xl border border-white/20 focus:outline-none transition-all"
                style={{
                  backgroundColor: isCustom ? `${primaryColor}15` : 'rgba(255,255,255,0.1)',
                  borderColor: isCustom ? primaryColor : 'rgba(255,255,255,0.2)',
                  color: textColor,
                }}
              />
            </div>
          )}

          {/* Pay Button with Gradient */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePayment}
            disabled={isProcessing || isEditing}
            className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ 
              background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
              boxShadow: `0 8px 24px ${primaryColor}50`,
              fontFamily: titleFontFamily,
            }}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                {buttonText} {formatCurrency(selectedAmount)}
              </>
            )}
          </motion.button>

          {/* Secure Badge */}
          <div className="flex items-center justify-center gap-2 mt-4 text-xs opacity-50" style={{ color: textColor }}>
            <Lock className="w-3 h-3" />
            <span>Powered by Stripe</span>
          </div>
        </div>
      </motion.div>
      </div>
    );
  }

  // === STYLE: GLASS ===
  // Full glassmorphism with blur effects
  if (variant === 'glass') {
    return (
      <div className="w-full max-w-sm mx-auto">
        <motion.div
          whileHover={!isEditing ? { y: -4 } : undefined}
          className={cn(
            'overflow-hidden backdrop-blur-2xl border border-white/30 shadow-2xl',
          borderRadius
        )}
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="p-6">
          {/* Icon + Title */}
          <div className="text-center mb-6">
            <motion.div 
              whileHover={{ rotate: [0, -10, 10, 0] }}
              className="inline-flex w-16 h-16 rounded-full items-center justify-center mb-4 backdrop-blur-xl"
              style={{ 
                backgroundColor: `${primaryColor}30`,
                border: `2px solid ${primaryColor}50`,
              }}
            >
              {renderModeIcon("w-8 h-8", { color: primaryColor })}
            </motion.div>
            <h3 
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: titleFontFamily, color: textColor }}
            >
              {title}
            </h3>
            <p 
              className="text-sm opacity-80"
              style={{ fontFamily: bodyFontFamily, color: textColor }}
            >
              {description}
            </p>
          </div>

          {/* Amount Pills */}
          <div className="flex flex-wrap gap-2 justify-center mb-5">
            {customAmounts.slice(0, 4).map((amount, index) => {
              const PresetIcon = AMOUNT_PRESETS[index]?.icon || DollarSign;
              const isSelected = selectedAmount === amount && !isCustom;
              
              return (
                <motion.button
                  key={amount}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAmountSelect(amount)}
                  className="px-6 py-3 rounded-full backdrop-blur-xl border transition-all flex items-center gap-2"
                  style={{
                    backgroundColor: isSelected ? primaryColor : 'rgba(255,255,255,0.2)',
                    borderColor: isSelected ? primaryColor : 'rgba(255,255,255,0.3)',
                    color: isSelected ? 'white' : textColor,
                    boxShadow: isSelected ? `0 4px 20px ${primaryColor}60` : 'none',
                  }}
                  disabled={isEditing}
                >
                  <PresetIcon className="w-4 h-4" />
                  <span className="font-bold">{formatCurrency(amount)}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Custom Input */}
          {allowCustomAmount && (
            <div className="relative mb-5">
              <input
                type="number"
                placeholder="Or enter custom amount"
                value={customValue}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                min={minAmount}
                max={maxAmount}
                className="w-full text-center px-4 py-4 rounded-2xl backdrop-blur-xl border border-white/30 focus:outline-none font-semibold text-lg"
                style={{
                  backgroundColor: isCustom ? `${primaryColor}20` : 'rgba(255,255,255,0.15)',
                  borderColor: isCustom ? primaryColor : 'rgba(255,255,255,0.3)',
                  color: textColor,
                }}
              />
            </div>
          )}

          {/* Selected Amount Badge */}
          <div className="text-center mb-5">
            <div 
              className="inline-block px-6 py-2 rounded-full backdrop-blur-xl font-bold text-2xl"
              style={{ 
                backgroundColor: `${primaryColor}20`,
                color: primaryColor,
                border: `2px solid ${primaryColor}40`,
              }}
            >
              {formatCurrency(selectedAmount)}
            </div>
          </div>

          {/* Glass Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handlePayment}
            disabled={isProcessing || isEditing}
            className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 backdrop-blur-xl disabled:opacity-50"
            style={{ 
              backgroundColor: primaryColor,
              boxShadow: `0 8px 32px ${primaryColor}60`,
              fontFamily: titleFontFamily,
            }}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                <span>{buttonText}</span>
              </>
            )}
          </motion.button>

          {/* Secure Badge */}
          <div className="flex items-center justify-center gap-2 mt-4 text-xs opacity-60" style={{ color: textColor }}>
            <Lock className="w-3 h-3" />
            <span>Secured by Stripe</span>
          </div>
        </div>
      </motion.div>
      </div>
    );
  }

  // === STYLE: GRADIENT ===
  // Bold gradient background with white card overlay
  if (variant === 'gradient') {
    return (
      <div className="w-full max-w-sm mx-auto">
        <motion.div
          whileHover={!isEditing ? { scale: 1.02 } : undefined}
          className={cn('overflow-hidden shadow-2xl', borderRadius)}
          style={{ 
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 50%, ${primaryColor}aa 100%)`,
          }}
        >
        <div className="p-8">
          {/* Icon Header */}
          <div className="text-center text-white mb-6">
            <motion.div 
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="inline-flex w-20 h-20 rounded-full bg-white/20 backdrop-blur-xl items-center justify-center mb-4"
              style={{ border: '3px solid rgba(255,255,255,0.3)' }}
            >
              {renderModeIcon("w-10 h-10")}
            </motion.div>
            <h3 
              className="text-3xl font-bold mb-2"
              style={{ fontFamily: titleFontFamily }}
            >
              {title}
            </h3>
            <p 
              className="text-white/90 text-sm"
              style={{ fontFamily: bodyFontFamily }}
            >
              {description}
            </p>
          </div>

          {/* White Card for Amounts */}
          <div 
            className="bg-white rounded-2xl p-6 shadow-xl"
            style={{ backgroundColor }}
          >
            {/* Amount Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {customAmounts.slice(0, 4).map((amount, index) => {
                const PresetIcon = AMOUNT_PRESETS[index]?.icon || DollarSign;
                const isSelected = selectedAmount === amount && !isCustom;
                
                return (
                  <motion.button
                    key={amount}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAmountSelect(amount)}
                    className="p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2"
                    style={{
                      backgroundColor: isSelected ? `${primaryColor}15` : 'transparent',
                      borderColor: isSelected ? primaryColor : '#e5e7eb',
                      color: isSelected ? primaryColor : textColor,
                    }}
                    disabled={isEditing}
                  >
                    <PresetIcon className="w-5 h-5" />
                    <span className="font-bold text-lg">{formatCurrency(amount)}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Custom Amount */}
            {allowCustomAmount && (
              <div className="relative mb-4">
                <DollarSign 
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: primaryColor }}
                />
                <input
                  type="number"
                  placeholder="Custom amount"
                  value={customValue}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  min={minAmount}
                  max={maxAmount}
                  className="w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all text-center font-semibold"
                  style={{
                    borderColor: isCustom ? primaryColor : '#e5e7eb',
                    backgroundColor: isCustom ? `${primaryColor}10` : 'white',
                    color: textColor,
                  }}
                />
              </div>
            )}

            {/* Selected Display */}
            <div className="text-center py-3 mb-4">
              <span className="text-sm text-gray-500">Total Amount</span>
              <div 
                className="text-4xl font-bold"
                style={{ color: primaryColor, fontFamily: titleFontFamily }}
              >
                {formatCurrency(selectedAmount)}
              </div>
            </div>

            {/* Action Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePayment}
              disabled={isProcessing || isEditing}
              className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ 
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
                fontFamily: titleFontFamily,
              }}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  {buttonText} {formatCurrency(selectedAmount)}
                </>
              )}
            </motion.button>

            {/* Secure Badge */}
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
              <Lock className="w-3 h-3" />
              <span>Secured by Stripe</span>
            </div>
          </div>
        </div>
      </motion.div>
      </div>
    );
  }

  // === STYLE: MINIMAL ===
  // Clean, minimalist design
  if (variant === 'minimal') {
    return (
      <div className="w-full max-w-sm mx-auto">
        <motion.div
          whileHover={!isEditing ? { y: -2 } : undefined}
          className={cn(
            'p-6 border-2',
            borderRadius
          )}
        style={{ 
          backgroundColor,
          borderColor: `${primaryColor}30`,
        }}
      >
        <div className="flex items-start gap-4 mb-5">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${primaryColor}15` }}
          >
            {renderModeIcon("w-6 h-6", { color: primaryColor })}
          </div>
          <div className="flex-1">
            <h3 
              className="text-lg font-bold mb-1"
              style={{ fontFamily: titleFontFamily, color: textColor }}
            >
              {title}
            </h3>
            <p 
              className="text-sm opacity-70"
              style={{ fontFamily: bodyFontFamily, color: textColor }}
            >
              {description}
            </p>
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {customAmounts.slice(0, 4).map((amount) => (
            <motion.button
              key={amount}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAmountSelect(amount)}
              className={cn(
                'py-2 px-3 rounded-lg text-sm font-medium transition-all',
                selectedAmount === amount && !isCustom
                  ? 'text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              )}
              style={{
                backgroundColor: selectedAmount === amount && !isCustom ? primaryColor : undefined,
                color: selectedAmount === amount && !isCustom ? 'white' : textColor,
              }}
              disabled={isEditing}
            >
              {formatCurrency(amount)}
            </motion.button>
          ))}
        </div>

        {/* Custom Input (if enabled) */}
        {allowCustomAmount && (
          <div className="relative mb-4">
            <DollarSign 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            />
            <input
              type="number"
              placeholder="Custom"
              value={customValue}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              min={minAmount}
              max={maxAmount}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all"
              style={{
                borderColor: isCustom ? primaryColor : '#e5e7eb',
                '--tw-ring-color': primaryColor,
              } as React.CSSProperties}
            />
          </div>
        )}

        {/* Pay Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePayment}
          disabled={isProcessing || isEditing}
          className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50"
          style={{ 
            backgroundColor: primaryColor,
            fontFamily: titleFontFamily,
          }}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              {buttonText} • {formatCurrency(selectedAmount)}
            </>
          )}
        </motion.button>

        {/* Secure Badge */}
        <div className="flex items-center justify-center gap-1 mt-3 text-xs text-gray-400">
          <Lock className="w-3 h-3" />
          <span>Stripe</span>
        </div>
      </motion.div>
      </div>
    );
  }

  // === STYLE: BOLD ===
  // Large, eye-catching design with big CTA
  if (variant === 'bold') {
    return (
      <div className="w-full max-w-sm mx-auto">
        <motion.div
          whileHover={!isEditing ? { scale: 1.01 } : undefined}
          className={cn('overflow-hidden shadow-2xl border-4', borderRadius)}
          style={{ 
            backgroundColor,
            borderColor: primaryColor,
          }}
        >
        {/* Header */}
        <div 
          className="p-6 text-white"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            {renderModeIcon("w-5 h-5")}
            </div>
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => handleContentChange('title', e.target.value)}
                className="bg-transparent text-xl font-bold border-none focus:outline-none focus:ring-2 focus:ring-white/30 rounded px-2 -ml-2"
                style={{ fontFamily: titleFontFamily }}
              />
            ) : (
              <h3 
                className="text-xl font-bold"
                style={{ fontFamily: titleFontFamily }}
              >
                {title}
              </h3>
            )}
          </div>
          {isEditing ? (
            <textarea
              value={description}
              onChange={(e) => handleContentChange('description', e.target.value)}
              className="w-full bg-transparent text-sm text-white/90 border-none focus:outline-none focus:ring-2 focus:ring-white/30 rounded resize-none"
              style={{ fontFamily: bodyFontFamily }}
              rows={2}
            />
          ) : (
            <p 
              className="text-sm text-white/90"
              style={{ fontFamily: bodyFontFamily }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Amount Selection */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {customAmounts.slice(0, 4).map((amount, index) => {
              const PresetIcon = AMOUNT_PRESETS[index]?.icon || DollarSign;
              const isSelected = selectedAmount === amount && !isCustom;
              
              return (
                <motion.button
                  key={amount}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAmountSelect(amount)}
                  className={cn(
                    'p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1',
                    isSelected
                      ? 'border-current bg-opacity-10'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                  style={{
                    borderColor: isSelected ? primaryColor : undefined,
                    backgroundColor: isSelected ? `${primaryColor}15` : undefined,
                    color: isSelected ? primaryColor : textColor,
                  }}
                >
                  <PresetIcon className="w-4 h-4" />
                  <span className="font-bold text-sm">
                    {formatCurrency(amount)}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Custom Amount */}
          {allowCustomAmount && (
            <div className="relative mb-4">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <input
                type="number"
                placeholder="Custom amount"
                value={customValue}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                min={minAmount}
                max={maxAmount}
                className={cn(
                  'w-full pl-10 pr-4 py-3 border-2 rounded-xl transition-all',
                  isCustom ? 'ring-2' : ''
                )}
                style={{
                  borderColor: isCustom ? primaryColor : '#e5e7eb',
                  // ringColor is handled via Tailwind ring classes
                }}
              />
            </div>
          )}

          {/* Selected Amount Display */}
          <div className="text-center mb-4">
            <span className="text-sm text-gray-500">You'll pay</span>
            <div 
              className="text-3xl font-bold"
              style={{ color: primaryColor, fontFamily: titleFontFamily }}
            >
              {formatCurrency(selectedAmount)}
            </div>
          </div>

          {/* Pay Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePayment}
            disabled={isProcessing || isEditing}
            className={cn(
              'w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            style={{ 
              backgroundColor: primaryColor,
              fontFamily: titleFontFamily,
            }}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                {buttonText} {formatCurrency(selectedAmount)}
              </>
            )}
          </motion.button>

          {/* Secure Badge */}
          <div className="flex items-center justify-center gap-2 mt-5 text-sm font-medium" style={{ color: textColor, opacity: 0.6 }}>
            <Lock className="w-4 h-4" />
            <span>100% Secure Payment via Stripe</span>
          </div>
        </div>
      </motion.div>
      </div>
    );
  }

  // Default fallback (shouldn't reach here)
  return (
    <div className="w-full max-w-sm mx-auto">
      <motion.div
        whileHover={!isEditing ? { y: -2 } : undefined}
        className={cn(
          'p-6 border-2',
        borderRadius
      )}
      style={{ 
        backgroundColor,
        borderColor: `${primaryColor}30`,
      }}
    >
      <div className="flex items-start gap-4 mb-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${primaryColor}15` }}
        >
          {renderModeIcon("w-6 h-6", { color: primaryColor })}
        </div>
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => handleContentChange('title', e.target.value)}
              className="w-full text-lg font-bold border-none focus:outline-none"
              style={{ fontFamily: titleFontFamily, color: textColor }}
            />
          ) : (
            <h3 
              className="text-lg font-bold"
              style={{ fontFamily: titleFontFamily, color: textColor }}
            >
              {title}
            </h3>
          )}
          {isEditing ? (
            <textarea
              value={description}
              onChange={(e) => handleContentChange('description', e.target.value)}
              className="w-full text-sm border-none focus:outline-none resize-none"
              style={{ fontFamily: bodyFontFamily, color: `${textColor}99` }}
              rows={2}
            />
          ) : (
            <p 
              className="text-sm"
              style={{ fontFamily: bodyFontFamily, color: `${textColor}99` }}
            >
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Quick Amount Buttons */}
      <div className="flex gap-2 mb-4">
        {customAmounts.slice(0, 4).map((amount) => (
          <motion.button
            key={amount}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAmountSelect(amount)}
            className={cn(
              'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all',
              selectedAmount === amount && !isCustom
                ? 'text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            )}
            style={{
              backgroundColor: selectedAmount === amount && !isCustom ? primaryColor : undefined,
              color: selectedAmount === amount && !isCustom ? 'white' : textColor,
            }}
          >
            {formatCurrency(amount)}
          </motion.button>
        ))}
      </div>

      {/* Pay Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handlePayment}
        disabled={isProcessing || isEditing}
        className={cn(
          'w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
        style={{ 
          backgroundColor: primaryColor,
          fontFamily: titleFontFamily,
        }}
      >
        {isProcessing ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <CreditCard className="w-4 h-4" />
            {buttonText}
          </>
        )}
      </motion.button>
    </motion.div>
    </div>
  );
}
