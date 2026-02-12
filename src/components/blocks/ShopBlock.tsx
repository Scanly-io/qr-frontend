/**
 * Shop Block Component
 * 
 * E-commerce shop with multi-product cart and Stripe checkout.
 * For selling products/services with cart functionality.
 * 
 * Separate from PaymentBlock (tips/donations) for cleaner UX.
 */

import { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Lock, 
  Loader2, 
  Package,
  X,
  ChevronRight,
  Check,
  Sparkles,
  Heart,
  Star,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Block } from '@/types';
import type { PageTheme } from '@/types/theme';
import { FONT_FAMILY_MAP } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { integrationsApi } from '@/lib/api/integrations';
import { 
  borders, 
  animations, 
  getCardStyles,
  getPrimaryShadow
} from '../../utils/designSystem';
import { trackCTA } from '@/utils/trackCTA';

interface ShopBlockProps {
  block: Block;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<Block>) => void;
  theme?: PageTheme;
  micrositeId?: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  comparePrice?: number; // Original price for showing discounts
  image?: string;
  badge?: string; // "NEW", "SALE", "POPULAR"
  category?: string;
  stripePriceId?: string;
  maxQuantity?: number;
  inStock?: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

export default function ShopBlock({ 
  block, 
  isEditing = false, 
  theme,
  micrositeId,
}: ShopBlockProps) {
  const content = block.content as Record<string, unknown>;
  const style = (block as unknown as Record<string, unknown>).style as Record<string, unknown> | undefined;

  // Content fields
  const title = (content?.title as string) || 'Our Products';
  const description = (content?.description as string) || 'Check out our latest items';
  const currency = (content?.currency as string) || 'USD';
  const rawProducts = (content?.products as Product[]) || [];
  // Ensure all products have IDs (fallback for templates without IDs)
  const products = rawProducts.map((p, idx) => ({
    ...p,
    id: p.id || `product-${idx}-${p.name?.replace(/\s+/g, '-').toLowerCase() || idx}`,
  }));
  const showCategories = (content?.showCategories as boolean) ?? false;
  const layout = (content?.layout as 'grid' | 'list') || 'grid';
  
  // Style fields
  const backgroundColor = (style?.backgroundColor as string) || '#ffffff';
  const accentColor = (style?.accentColor as string) || '#8b5cf6';
  const textColor = (style?.textColor as string) || '#1f2937';
  const borderRadius = (style?.borderRadius as string) || 'rounded-2xl';

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Theme
  const titleFont = theme?.typography?.titleFont || 'inter';
  const bodyFont = theme?.typography?.bodyFont || 'inter';
  const titleFontFamily = FONT_FAMILY_MAP[titleFont] || "'Inter', sans-serif";
  const bodyFontFamily = FONT_FAMILY_MAP[bodyFont] || "'Inter', sans-serif";
  const primaryColor = theme?.branding?.primaryColor || accentColor;
  
  // Determine if background is dark
  const isDark = (() => {
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  })();

  // Check for success return from checkout
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('purchase') === 'success') {
      // Use queueMicrotask to defer state updates and avoid cascading renders
      queueMicrotask(() => {
        setCheckoutSuccess(true);
        setCart([]);
      });
      // Clear query param
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Get unique categories
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  // Filter products by category
  const filteredProducts = selectedCategory 
    ? products.filter(p => p.category === selectedCategory)
    : products;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Cart functions
  const addToCart = (product: Product) => {
    if (isEditing) return;
    if (product.inStock === false) return;
    trackCTA(block.id, product.name, `shop-item-${product.id}`, 'shop');
    
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

  const getItemInCart = (productId: string) => {
    return cart.find(item => item.id === productId);
  };

  const handleCheckout = async () => {
    if (isEditing || cart.length === 0) return;
    
    trackCTA(block.id, `Checkout ($${cartTotal.toFixed(2)}, ${cart.length} items)`, '', 'shop-checkout');
    setIsProcessing(true);
    
    try {
      const currentUrl = window.location.href;
      const baseUrl = currentUrl.split('?')[0];
      
      // Format items for the new Stripe checkout API
      const items = cart.map(item => ({
        name: item.name,
        description: item.description || '',
        price: item.price,
        quantity: item.quantity,
        currency: currency || 'USD',
        image: item.image,
        metadata: {
          productId: item.id,
          stripePriceId: item.stripePriceId || '',
        },
      }));
      
      const response = await integrationsApi.createStripeCheckout({
        lineItems: items, // API still expects 'lineItems' key
        currency: currency.toLowerCase(),
        successUrl: `${baseUrl}?purchase=success`,
        cancelUrl: `${baseUrl}?purchase=cancelled`,
        blockId: block.id,
        micrositeId: micrositeId || 'demo-creator', // Provide fallback
        metadata: {
          orderType: 'shop',
          itemCount: cart.length.toString(),
          creatorId: micrositeId || 'demo-creator', // Add creatorId to metadata
        },
      });
      
      if (response.checkoutUrl) {
        window.location.assign(response.checkoutUrl);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setIsProcessing(false);
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge?.toUpperCase()) {
      case 'NEW': return 'bg-gradient-to-r from-green-400 to-emerald-500';
      case 'SALE': return 'bg-gradient-to-r from-red-500 to-rose-500';
      case 'POPULAR': return 'bg-gradient-to-r from-orange-400 to-amber-500';
      case 'LIMITED': return 'bg-gradient-to-r from-purple-500 to-violet-500';
      case 'HOT': return 'bg-gradient-to-r from-red-500 to-orange-500';
      case 'BEST': return 'bg-gradient-to-r from-yellow-400 to-amber-500';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge?.toUpperCase()) {
      case 'NEW': return <Sparkles className="w-3 h-3" />;
      case 'POPULAR': return <Star className="w-3 h-3" />;
      case 'HOT': return <Zap className="w-3 h-3" />;
      case 'BEST': return <Heart className="w-3 h-3" />;
      default: return null;
    }
  };

  // Success State with celebration
  if (checkoutSuccess) {
    // Pre-computed particle positions for deterministic rendering
    const particleOffsets = [25, 38, 42, 31, 47, 28, 35, 44, 29, 40, 33, 45];
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn('overflow-hidden text-center p-8 relative', borderRadius)}
        style={{ backgroundColor }}
      >
        {/* Confetti-like particles */}
        {particleOffsets.map((offset, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{ 
              backgroundColor: i % 3 === 0 ? primaryColor : i % 3 === 1 ? '#fbbf24' : '#34d399',
              left: `${10 + (i * 7)}%`,
              top: '-10px',
            }}
            initial={{ y: 0, opacity: 1, scale: 1 }}
            animate={{ 
              y: 200, 
              opacity: 0,
              scale: 0,
              x: (i % 2 === 0 ? 1 : -1) * offset,
            }}
            transition={{ 
              duration: 1.5,
              delay: i * 0.08,
              ease: 'easeOut',
            }}
          />
        ))}
        
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 relative"
          style={{ backgroundColor: `${primaryColor}20` }}
        >
          {/* Pulse rings */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: `2px solid ${primaryColor}` }}
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            <Check className="w-12 h-12" style={{ color: primaryColor }} />
          </motion.div>
        </motion.div>
        
        <motion.h3 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: titleFontFamily, color: textColor }}
        >
          Thank You! 🎉
        </motion.h3>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm opacity-70"
          style={{ fontFamily: bodyFontFamily, color: textColor }}
        >
          Your order has been placed successfully.
        </motion.p>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs opacity-50 mt-2"
          style={{ fontFamily: bodyFontFamily, color: textColor }}
        >
          Check your email for confirmation.
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('overflow-hidden', borderRadius)}
      style={{ backgroundColor }}
    >
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 
              className="text-xl font-bold"
              style={{ fontFamily: titleFontFamily, color: textColor }}
            >
              {title}
            </h3>
            {description && (
              <p 
                className="text-sm opacity-70 mt-1"
                style={{ fontFamily: bodyFontFamily, color: textColor }}
              >
                {description}
              </p>
            )}
          </div>
          
          {/* Cart Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCart(true)}
            className="relative p-3 rounded-full transition-colors"
            style={{ backgroundColor: `${primaryColor}15` }}
            disabled={isEditing}
          >
            <ShoppingCart className="w-6 h-6" style={{ color: primaryColor }} />
            {cartItemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center"
                style={{ backgroundColor: primaryColor }}
              >
                {cartItemCount}
              </motion.span>
            )}
          </motion.button>
        </div>
        
        {/* Category Filter */}
        {showCategories && categories.length > 0 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap',
                !selectedCategory 
                  ? 'text-white' 
                  : 'bg-muted hover:bg-muted/80'
              )}
              style={!selectedCategory ? { backgroundColor: primaryColor } : { color: textColor }}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat as string)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap',
                  selectedCategory === cat 
                    ? 'text-white' 
                    : 'bg-muted hover:bg-muted/80'
                )}
                style={selectedCategory === cat ? { backgroundColor: primaryColor } : { color: textColor }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className={cn(
        'p-4',
        layout === 'grid' 
          ? 'grid gap-3 grid-cols-1'
          : 'space-y-3'
      )}>
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: textColor }} />
            <p className="text-sm opacity-50" style={{ color: textColor }}>
              No products available
            </p>
          </div>
        ) : (
          filteredProducts.map((product, index) => {
            const inCart = getItemInCart(product.id);
            const isOutOfStock = product.inStock === false;
            const cardStyles = getCardStyles(isDark, !isOutOfStock, primaryColor);
            
            return (
              <motion.div
                key={product.id}
                initial={animations.slideUp.initial}
                animate={animations.slideUp.animate}
                transition={{ delay: index * 0.08, ...animations.spring.gentle }}
                whileHover={!isEditing && !isOutOfStock ? { 
                  y: -8,
                  boxShadow: getPrimaryShadow(primaryColor, 'hover'),
                  transition: { duration: animations.duration.base / 1000 }
                } : undefined}
                className={cn(
                  'overflow-hidden relative group',
                  isOutOfStock && 'opacity-60'
                )}
                style={{
                  ...cardStyles,
                  borderRadius: borders.radius.xl,
                }}
              >
                {/* Hover Glow Effect */}
                <motion.div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ 
                    background: `radial-gradient(circle at 50% 0%, ${primaryColor}20 0%, transparent 70%)`,
                  }}
                />
                
                {/* Badge with icon */}
                {product.badge && (
                  <motion.div 
                    initial={{ scale: 0, rotate: -12 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 500, delay: index * 0.05 + 0.2 }}
                    className={cn(
                      'absolute top-2 left-2 z-10 px-2 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1 shadow-lg',
                      getBadgeColor(product.badge)
                    )}
                  >
                    {getBadgeIcon(product.badge)}
                    {product.badge}
                  </motion.div>
                )}
                
                {/* Image with zoom effect */}
                {product.image ? (
                  <div className="relative aspect-square overflow-hidden">
                    <motion.img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                    />
                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                        <span className="text-white text-sm font-bold px-3 py-1 bg-black/50 rounded-full">Out of Stock</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div 
                    className="aspect-square flex items-center justify-center"
                    style={{ backgroundColor: `${primaryColor}10` }}
                  >
                    <Package className="w-12 h-12 opacity-30" style={{ color: primaryColor }} />
                  </div>
                )}
                
                {/* Info */}
                <div className="p-3">
                  <h4 
                    className="font-semibold text-sm line-clamp-1"
                    style={{ fontFamily: titleFontFamily, color: textColor }}
                  >
                    {product.name}
                  </h4>
                  
                  {product.description && (
                    <p 
                      className="text-xs opacity-60 line-clamp-2 mt-1"
                      style={{ fontFamily: bodyFontFamily, color: textColor }}
                    >
                      {product.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <span 
                        className="font-bold text-lg"
                        style={{ color: primaryColor }}
                      >
                        {formatCurrency(product.price)}
                      </span>
                      {product.comparePrice && product.comparePrice > product.price && (
                        <span 
                          className="ml-2 text-sm line-through opacity-50"
                          style={{ color: textColor }}
                        >
                          {formatCurrency(product.comparePrice)}
                        </span>
                      )}
                    </div>
                    
                    {/* Add to Cart / Quantity */}
                    {!isOutOfStock && (
                      <div>
                        <AnimatePresence mode="wait">
                          {inCart ? (
                            <motion.div 
                              key="quantity"
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              className="flex items-center gap-1 rounded-full"
                              style={{ backgroundColor: `${primaryColor}15` }}
                            >
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => updateQuantity(product.id, inCart.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-muted-foreground/10 rounded-full transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </motion.button>
                              <motion.span 
                                key={inCart.quantity}
                                initial={{ scale: 1.3 }}
                                animate={{ scale: 1 }}
                                className="w-6 text-center text-sm font-bold"
                                style={{ color: primaryColor }}
                              >
                                {inCart.quantity}
                              </motion.span>
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => updateQuantity(product.id, inCart.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-muted-foreground/10 rounded-full transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </motion.button>
                            </motion.div>
                          ) : (
                            <motion.button
                              key="add"
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              whileHover={{ scale: 1.15, rotate: 5 }}
                              whileTap={{ scale: 0.9, rotate: -5 }}
                              onClick={() => addToCart(product)}
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg relative overflow-hidden"
                              style={{ backgroundColor: primaryColor }}
                              disabled={isEditing}
                            >
                              {/* Ripple effect */}
                              <span className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-150 rounded-full transition-transform duration-500" />
                              <Plus className="w-5 h-5 relative z-10" />
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Floating Cart Summary */}
      <AnimatePresence>
        {cartItemCount > 0 && !showCart && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="sticky bottom-4 mx-4 mb-4"
          >
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCart(true)}
              className="w-full py-4 px-5 rounded-2xl text-white font-semibold flex items-center justify-between shadow-2xl relative overflow-hidden"
              style={{ backgroundColor: primaryColor }}
            >
              {/* Animated shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" 
                style={{ animationDuration: '2s', animationIterationCount: 'infinite' }} 
              />
              <div className="flex items-center gap-3 relative z-10">
                <motion.div
                  key={cartItemCount}
                  initial={{ rotate: -20, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                >
                  <ShoppingCart className="w-6 h-6" />
                </motion.div>
                <span className="text-base">{cartItemCount} item{cartItemCount > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2 relative z-10">
                <motion.span 
                  key={cartTotal}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="text-lg font-bold"
                >
                  {formatCurrency(cartTotal)}
                </motion.span>
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.div>
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {showCart && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="fixed inset-0 bg-black/50 z-[100]"
            />
            
            {/* Drawer - Full screen on mobile, slide from right on desktop */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-full shadow-2xl z-[101] flex flex-col safe-area-inset"
              style={{ 
                maxHeight: '100dvh',
                backgroundColor: backgroundColor,
                color: textColor
              }}
            >
              {/* Header */}
              <div className="p-4 flex items-center justify-between flex-shrink-0" style={{ borderBottom: `1px solid ${textColor}20` }}>
                <h3 
                  className="text-lg font-bold flex items-center gap-2"
                  style={{ fontFamily: titleFontFamily }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Your Cart ({cartItemCount})
                </h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 rounded-full transition-colors"
                  style={{ backgroundColor: `${textColor}10` }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <ShoppingCart className="w-16 h-16 mx-auto mb-4" style={{ opacity: 0.2, color: textColor }} />
                    </motion.div>
                    <p className="text-sm" style={{ opacity: 0.5, color: textColor }}>Your cart is empty</p>
                    <p className="text-xs mt-1" style={{ opacity: 0.3, color: textColor }}>Add some items to get started</p>
                  </motion.div>
                ) : (
                  <AnimatePresence>
                    {cart.map((item, index) => (
                      <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50, height: 0 }}
                        transition={{ delay: index * 0.05 }}
                        layout
                        className="flex gap-3 p-3 rounded-xl relative overflow-hidden group"
                        style={{ backgroundColor: `${textColor}08` }}
                      >
                        {/* Hover highlight */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(to right, transparent, ${primaryColor}10, transparent)` }} />
                        
                        {item.image ? (
                          <motion.img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-16 h-16 object-cover rounded-lg shadow-sm"
                            whileHover={{ scale: 1.05 }}
                          />
                        ) : (
                          <div 
                            className="w-16 h-16 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${primaryColor}20` }}
                          >
                            <Package className="w-6 h-6" style={{ opacity: 0.4, color: primaryColor }} />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0 relative z-10">
                          <h4 className="font-medium text-sm truncate" style={{ color: textColor }}>{item.name}</h4>
                          <motion.p 
                            key={item.price * item.quantity}
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            className="text-sm font-bold mt-1" 
                            style={{ color: primaryColor }}
                          >
                            {formatCurrency(item.price * item.quantity)}
                          </motion.p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div 
                              className="flex items-center gap-1 rounded-full"
                              style={{ backgroundColor: `${primaryColor}10` }}
                            >
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-full transition-colors"
                                style={{ backgroundColor: 'transparent', color: textColor }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${textColor}10`}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <Minus className="w-3 h-3" />
                              </motion.button>
                              <motion.span 
                                key={item.quantity}
                                initial={{ scale: 1.3 }}
                                animate={{ scale: 1 }}
                                className="w-6 text-center text-sm font-bold"
                                style={{ color: textColor }}
                              >
                                {item.quantity}
                              </motion.span>
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-full transition-colors"
                                style={{ backgroundColor: 'transparent', color: textColor }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${textColor}10`}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <Plus className="w-3 h-3" />
                              </motion.button>
                            </div>
                            
                            <motion.button
                              whileHover={{ scale: 1.1, rotate: 10 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeFromCart(item.id)}
                              className="p-1.5 text-destructive hover:bg-destructive/10 rounded-full"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
              
              {/* Footer */}
              {cart.length > 0 && (
                <motion.div 
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  className="p-4 space-y-4"
                  style={{ 
                    borderTop: `1px solid ${textColor}20`,
                    background: `linear-gradient(to top, ${backgroundColor}, transparent)`
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium" style={{ color: textColor }}>Subtotal</span>
                    <motion.span 
                      key={cartTotal}
                      initial={{ scale: 1.2, color: primaryColor }}
                      animate={{ scale: 1 }}
                      className="text-xl font-bold"
                      style={{ color: primaryColor }}
                    >
                      {formatCurrency(cartTotal)}
                    </motion.span>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: `0 10px 40px -10px ${primaryColor}80` }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50 relative overflow-hidden shadow-lg"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
                    
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Checkout</span>
                        <span className="font-normal opacity-80">•</span>
                        <span>{formatCurrency(cartTotal)}</span>
                      </>
                    )}
                  </motion.button>
                  
                  <p className="text-center text-xs flex items-center justify-center gap-1" style={{ color: `${textColor}60` }}>
                    <Lock className="w-3 h-3" />
                    Secure checkout powered by Stripe
                  </p>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
