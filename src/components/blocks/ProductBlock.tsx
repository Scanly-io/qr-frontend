/**
 * Product Block Component
 * 
 * Premium e-commerce product card with 6 visual styles.
 * Supports Stripe checkout integration and external product links.
 * Includes image gallery, ratings, inventory tracking, and smooth animations.
 */

import { useState } from 'react';
import { 
  ShoppingBag, 
  Star, 
  Check, 
  Loader2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShoppingCart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Block } from '@/types';
import type { PageTheme } from '@/types/theme';
import { FONT_FAMILY_MAP } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { usePayment } from '@/contexts/PaymentContext';
import {shadows, animations} from '@/utils/designSystem';

interface ProductBlockProps {
  block: Block;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<Block>) => void;
  theme?: PageTheme;
  micrositeId?: string; // For connecting to user's Stripe account (Direct Charges)
}

export default function ProductBlock({ 
  block, 
  isEditing = false, 
  // onUpdate - reserved for inline editing
  theme,
  micrositeId,
}: ProductBlockProps) {
  const content = block.content as Record<string, unknown>;
  const style = (block as unknown as Record<string, unknown>).style as Record<string, unknown> | undefined;

  // Content fields
  const name = (content?.name as string) || 'Product Name';
  const description = (content?.description as string) || 'A short product description that highlights key benefits.';
  const price = (content?.price as number) || 29.99;
  const originalPrice = (content?.originalPrice as number) || undefined;
  const currency = (content?.currency as string) || 'USD';
  const imageUrl = (content?.imageUrl as string) || '';
  const imageUrls = (content?.imageUrls as string[]) || [];
  const buttonText = (content?.buttonText as string) || 'Buy Now';
  const buttonUrl = (content?.buttonUrl as string) || '';
  const useStripeCheckout = (content?.useStripeCheckout as boolean) ?? false;
  const badge = (content?.badge as string) || '';
  const rating = (content?.rating as number) || undefined;
  const reviewCount = (content?.reviewCount as number) || undefined;
  const features = (content?.features as string[]) || [];
  const inventory = content?.inventory as { available?: boolean; quantity?: number; showQuantity?: boolean } | undefined;

  // Style fields
  const variant = (style?.variant as 'card' | 'modern' | 'minimal' | 'bold' | 'glass' | 'gradient') || 'card';
  const backgroundColor = (style?.backgroundColor as string) || '#ffffff';
  const accentColor = (style?.accentColor as string) || '#8b5cf6';
  const textColor = (style?.textColor as string) || '#1f2937';
  const borderRadius = (style?.borderRadius as string) || 'rounded-2xl';
  const imageAspect = (style?.imageAspect as string) || '4:3';

  // Local state
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Payment context
  const { addToCart, quickPurchase } = usePayment();

  // Get typography settings from theme
  const titleFont = theme?.typography?.titleFont || 'inter';
  const bodyFont = theme?.typography?.bodyFont || 'inter';
  const titleFontFamily = FONT_FAMILY_MAP[titleFont] || "'Inter', sans-serif";
  const bodyFontFamily = FONT_FAMILY_MAP[bodyFont] || "'Inter', sans-serif";

  // Get branding colors
  const primaryColor = theme?.branding?.primaryColor || accentColor;

  // All images (single + gallery)
  const allImages = imageUrl ? [imageUrl, ...imageUrls] : imageUrls;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Add to cart function
  const handleAddToCart = () => {
    if (isEditing) return;
    
    addToCart({
      id: `product-${block.id}`,
      type: 'product',
      name,
      price,
      description,
      image: allImages[0],
      quantity: 1,
      metadata: {
        blockId: block.id,
        originalPrice,
        rating,
        reviewCount,
        badge,
      }
    });
  };

  // Buy now (quick purchase) function
  const handleBuy = async () => {
    if (isEditing) return;
    
    // If external URL is set, navigate there
    if (buttonUrl && !useStripeCheckout) {
      window.open(buttonUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    
    // Use PaymentContext for Stripe Checkout
    if (useStripeCheckout) {
      setIsProcessing(true);
      
      try {
        await quickPurchase(
          {
            id: `product-${block.id}`,
            type: 'product',
            name,
            price,
            description,
            image: allImages[0],
            quantity: 1,
            metadata: {
              blockId: block.id,
              originalPrice,
              rating,
              reviewCount,
              badge,
            }
          },
          {
            creatorId: micrositeId || '',
            micrositeId: micrositeId || '',
          }
        );
      } catch (error) {
        console.error('Checkout error:', error);
        setIsProcessing(false);
      }
      return;
    }
    
    // Default: just show processing animation
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 1500);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              'w-4 h-4',
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            )}
          />
        ))}
      </div>
    );
  };

  // Get aspect ratio style
  const getAspectRatio = () => {
    switch (imageAspect) {
      case '1:1': return 'aspect-square';
      case '16:9': return 'aspect-video';
      case '3:2': return 'aspect-[3/2]';
      case '4:3':
      default: return 'aspect-[4/3]';
    }
  };

  // Calculate sale percentage
  const salePercent = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0;

  // **CARD VARIANT** - Classic product card
  if (variant === 'card') {
    return (
      <motion.div
        {...animations.fadeIn}
        {...animations.hover.lift}
        className={cn(
          'overflow-hidden transition-all duration-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 group',
          borderRadius
        )}
        style={{ 
          backgroundColor,
          fontFamily: bodyFontFamily,
          boxShadow: shadows.sm
        }}
        whileHover={{ boxShadow: shadows.lg }}
      >
        {/* Product Image */}
        <div className={cn('relative overflow-hidden bg-gray-100 dark:bg-gray-800', getAspectRatio())}>
          {allImages.length > 0 ? (
            <>
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={allImages[currentImageIndex]}
                  alt={name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </AnimatePresence>
              
              {/* Image Navigation */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  
                  {/* Image Dots */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {allImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={cn(
                          'rounded-full transition-all',
                          idx === currentImageIndex
                            ? 'bg-white w-6 h-2'
                            : 'bg-white/60 hover:bg-white/80 w-2 h-2'
                        )}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-gray-300" />
            </div>
          )}
          
          {/* Badge */}
          {badge && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 left-3 px-3 py-1.5 text-xs font-bold rounded-full text-white backdrop-blur-sm shadow-lg"
              style={{ backgroundColor: primaryColor }}
            >
              {badge}
            </motion.div>
          )}
          
          {/* Sale Badge */}
          {originalPrice && salePercent > 0 && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 right-3 px-3 py-1.5 text-xs font-bold rounded-full bg-red-500 text-white shadow-lg"
            >
              -{salePercent}% OFF
            </motion.div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="p-5 space-y-3">
          {/* Name & Rating */}
          <div>
            <h3 
              className="font-bold text-lg line-clamp-2 mb-1" 
              style={{ fontFamily: titleFontFamily, color: textColor }}
            >
              {name}
            </h3>
            
            {rating !== undefined && (
              <div className="flex items-center gap-2">
                {renderStars(rating)}
                {reviewCount !== undefined && (
                  <span className="text-xs text-gray-500">({reviewCount} reviews)</span>
                )}
              </div>
            )}
          </div>
          
          {/* Description */}
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {description}
            </p>
          )}
          
          {/* Features */}
          {features.length > 0 && (
            <ul className="space-y-1.5">
              {features.slice(0, 3).map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{feature}</span>
                </li>
              ))}
            </ul>
          )}
          
          {/* Price & Inventory */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-baseline gap-2">
              <span 
                className="text-2xl font-bold"
                style={{ color: primaryColor }}
              >
                {formatCurrency(price)}
              </span>
              {originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {formatCurrency(originalPrice)}
                </span>
              )}
            </div>
            
            {inventory?.showQuantity && inventory.quantity !== undefined && (
              <span className={cn(
                'text-xs font-semibold px-2.5 py-1 rounded-full',
                inventory.quantity > 5 
                  ? 'bg-green-100 text-green-700' 
                  : inventory.quantity > 0
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-red-100 text-red-700'
              )}>
                {inventory.quantity > 0 ? `${inventory.quantity} left` : 'Sold out'}
              </span>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            {/* Add to Cart Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={isProcessing || (inventory?.available === false) || isEditing}
              className={cn(
                'flex-1 py-3.5 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md border-2',
                (isProcessing || inventory?.available === false) && 'opacity-60 cursor-not-allowed'
              )}
              style={{ 
                borderColor: primaryColor,
                color: primaryColor,
                backgroundColor: 'transparent'
              }}
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </motion.button>

            {/* Buy Now Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBuy}
              disabled={isProcessing || (inventory?.available === false) || isEditing}
              className={cn(
                'flex-1 py-3.5 px-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md',
                (isProcessing || inventory?.available === false) && 'opacity-60 cursor-not-allowed'
              )}
              style={{ backgroundColor: primaryColor }}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : inventory?.available === false ? (
                'Sold Out'
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  Buy Now
                  {buttonUrl && !useStripeCheckout && <ExternalLink className="w-4 h-4" />}
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  // **MODERN VARIANT** - Glassmorphism with floating elements
  if (variant === 'modern') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -6 }}
        className={cn(
          'overflow-hidden backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-white/20 shadow-xl group relative',
          borderRadius
        )}
        style={{ fontFamily: bodyFontFamily }}
      >
        {/* Gradient Overlay */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${primaryColor} 0%, transparent 100%)`
          }}
        />

        {/* Product Image */}
        <div className={cn('relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900', getAspectRatio())}>
          {allImages.length > 0 ? (
            <>
              <motion.img
                key={currentImageIndex}
                src={allImages[currentImageIndex]}
                alt={name}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full h-full object-cover"
              />
              
              {allImages.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 backdrop-blur-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 backdrop-blur-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/30 backdrop-blur-md px-3 py-2 rounded-full">
                    {allImages.map((_, idx) => (
                      <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={cn('w-2 h-2 rounded-full transition-all', idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50')} />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="w-20 h-20 text-gray-300" />
            </div>
          )}
          
          {badge && (
            <div className="absolute top-4 left-4 px-4 py-2 text-sm font-bold rounded-full text-white backdrop-blur-md shadow-xl" style={{ backgroundColor: `${primaryColor}E6` }}>
              {badge}
            </div>
          )}
          
          {originalPrice && salePercent > 0 && (
            <div className="absolute top-4 right-4 px-4 py-2 text-sm font-bold rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-xl">
              SAVE {salePercent}%
            </div>
          )}
        </div>
        
        <div className="p-6 space-y-4 relative z-10">
          <div>
            <h3 className="font-bold text-xl mb-2" style={{ fontFamily: titleFontFamily, color: textColor }}>
              {name}
            </h3>
            {rating !== undefined && (
              <div className="flex items-center gap-2">
                {renderStars(rating)}
                {reviewCount !== undefined && <span className="text-sm text-gray-500 ml-1">({reviewCount})</span>}
              </div>
            )}
          </div>
          
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
              {description}
            </p>
          )}
          
          {features.length > 0 && (
            <div className="space-y-2">
              {features.slice(0, 4).map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-sm">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}20` }}>
                    <Check className="w-3 h-3" style={{ color: primaryColor }} />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex items-end justify-between pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
            <div>
              <div className="text-xs text-gray-500 mb-1">Price</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold" style={{ color: primaryColor }}>
                  {formatCurrency(price)}
                </span>
                {originalPrice && (
                  <span className="text-base text-gray-400 line-through">
                    {formatCurrency(originalPrice)}
                  </span>
                )}
              </div>
            </div>
            
            {inventory?.showQuantity && inventory.quantity !== undefined && (
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-1">Stock</div>
                <div className={cn('text-sm font-bold', inventory.quantity > 5 ? 'text-green-600' : inventory.quantity > 0 ? 'text-orange-600' : 'text-red-600')}>
                  {inventory.quantity > 0 ? `${inventory.quantity} left` : 'Out of stock'}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            {/* Add to Cart */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleAddToCart}
              disabled={isProcessing || (inventory?.available === false) || isEditing}
              className={cn(
                'flex-1 py-4 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg border-2',
                (isProcessing || inventory?.available === false) && 'opacity-50 cursor-not-allowed'
              )}
              style={{ 
                borderColor: primaryColor,
                color: primaryColor
              }}
            >
              <ShoppingCart className="w-5 h-5" />
              Add
            </motion.button>

            {/* Buy Now */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleBuy}
              disabled={isProcessing || (inventory?.available === false) || isEditing}
              className={cn(
                'flex-[2] py-4 px-6 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2.5 shadow-lg hover:shadow-xl',
                (isProcessing || inventory?.available === false) && 'opacity-50 cursor-not-allowed'
              )}
              style={{ 
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}CC 100%)`,
              }}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : inventory?.available === false ? (
                'Sold Out'
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  Buy Now
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  // **MINIMAL VARIANT** - Clean and simple
  if (variant === 'minimal') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          'overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors group',
          borderRadius
        )}
        style={{ backgroundColor, fontFamily: bodyFontFamily }}
      >
        <div className={cn('relative overflow-hidden bg-gray-50 dark:bg-gray-800', getAspectRatio())}>
          {allImages.length > 0 ? (
            <>
              <img
                src={allImages[currentImageIndex]}
                alt={name}
                className="w-full h-full object-cover"
              />
              {allImages.length > 1 && (
                <div className="absolute bottom-3 right-3 flex gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                  {allImages.map((_, idx) => (
                    <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={cn('w-1.5 h-1.5 rounded-full', idx === currentImageIndex ? 'bg-gray-900 w-3' : 'bg-gray-400')} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="w-14 h-14 text-gray-300" />
            </div>
          )}
          
          {badge && (
            <div className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-md" style={{ backgroundColor: primaryColor, color: 'white' }}>
              {badge}
            </div>
          )}
          
          {originalPrice && salePercent > 0 && (
            <div className="absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold rounded-md bg-red-500 text-white">
              -{salePercent}%
            </div>
          )}
        </div>
        
        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-lg line-clamp-2" style={{ fontFamily: titleFontFamily, color: textColor }}>
                {name}
              </h3>
              {rating !== undefined && (
                <div className="flex items-center gap-1.5 mt-1">
                  {renderStars(rating)}
                  {reviewCount !== undefined && <span className="text-xs text-gray-500">({reviewCount})</span>}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-xl font-bold" style={{ color: primaryColor }}>
                {formatCurrency(price)}
              </div>
              {originalPrice && (
                <div className="text-xs text-gray-400 line-through">
                  {formatCurrency(originalPrice)}
                </div>
              )}
            </div>
          </div>
          
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {description}
            </p>
          )}
          
          {features.length > 0 && (
            <ul className="space-y-1">
              {features.slice(0, 3).map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                  <Check className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
                  <span className="line-clamp-1">{feature}</span>
                </li>
              ))}
            </ul>
          )}
          
          {inventory?.showQuantity && inventory.quantity !== undefined && (
            <div className={cn('text-xs font-medium', inventory.quantity > 5 ? 'text-green-600' : inventory.quantity > 0 ? 'text-orange-600' : 'text-red-600')}>
              {inventory.quantity > 0 ? `Only ${inventory.quantity} left in stock` : 'Out of stock'}
            </div>
          )}
          
          <button
            onClick={handleBuy}
            disabled={isProcessing || (inventory?.available === false) || isEditing}
            className={cn(
              'w-full py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 border-2',
              (isProcessing || inventory?.available === false) && 'opacity-50 cursor-not-allowed'
            )}
            style={{ 
              borderColor: primaryColor,
              color: primaryColor,
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              if (!isProcessing && inventory?.available !== false && !isEditing) {
                e.currentTarget.style.backgroundColor = primaryColor;
                e.currentTarget.style.color = 'white';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = primaryColor;
            }}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : inventory?.available === false ? (
              'Sold Out'
            ) : (
              <>
                {buttonText}
                {buttonUrl && !useStripeCheckout && <ExternalLink className="w-4 h-4" />}
              </>
            )}
          </button>
        </div>
      </motion.div>
    );
  }

  // **BOLD VARIANT** - High contrast with large elements
  if (variant === 'bold') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        className={cn(
          'overflow-hidden border-4 shadow-2xl group relative',
          borderRadius
        )}
        style={{ 
          backgroundColor,
          borderColor: primaryColor,
          fontFamily: bodyFontFamily 
        }}
      >
        <div className={cn('relative overflow-hidden', getAspectRatio())} style={{ background: `linear-gradient(135deg, ${primaryColor}15 0%, ${primaryColor}05 100%)` }}>
          {allImages.length > 0 ? (
            <>
              <img
                src={allImages[currentImageIndex]}
                alt={name}
                className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal"
              />
              {allImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {allImages.map((_, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setCurrentImageIndex(idx)} 
                      className={cn('w-3 h-3 rounded-full border-2 border-white transition-all', idx === currentImageIndex ? 'scale-125' : 'opacity-60')}
                      style={{ backgroundColor: idx === currentImageIndex ? primaryColor : 'transparent' }}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="w-24 h-24 text-gray-300" />
            </div>
          )}
          
          {badge && (
            <div className="absolute top-4 left-4 px-4 py-2 text-sm font-black rounded-lg bg-black text-white shadow-xl transform -rotate-2">
              {badge}
            </div>
          )}
          
          {originalPrice && salePercent > 0 && (
            <div className="absolute top-4 right-4 px-4 py-2 text-lg font-black rounded-lg bg-red-600 text-white shadow-xl transform rotate-2">
              -{salePercent}%
            </div>
          )}
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-black text-2xl mb-2 line-clamp-2" style={{ fontFamily: titleFontFamily, color: textColor }}>
              {name.toUpperCase()}
            </h3>
            {rating !== undefined && (
              <div className="flex items-center gap-2">
                {renderStars(rating)}
                {reviewCount !== undefined && <span className="text-sm font-bold text-gray-600">({reviewCount} REVIEWS)</span>}
              </div>
            )}
          </div>
          
          {description && (
            <p className="text-base font-medium text-gray-700 dark:text-gray-300 line-clamp-3">
              {description}
            </p>
          )}
          
          {features.length > 0 && (
            <div className="grid grid-cols-1 gap-2">
              {features.slice(0, 3).map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 rounded-lg" style={{ backgroundColor: `${primaryColor}10` }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">{feature}</span>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: `${primaryColor}10` }}>
            <div>
              <div className="text-xs font-bold text-gray-600 mb-1">PRICE</div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black" style={{ color: primaryColor }}>
                  {formatCurrency(price)}
                </span>
                {originalPrice && (
                  <span className="text-lg text-gray-500 line-through font-bold">
                    {formatCurrency(originalPrice)}
                  </span>
                )}
              </div>
            </div>
            
            {inventory?.showQuantity && inventory.quantity !== undefined && (
              <div className="text-right">
                <div className="text-xs font-bold text-gray-600 mb-1">STOCK</div>
                <div className={cn('text-lg font-black', inventory.quantity > 5 ? 'text-green-600' : inventory.quantity > 0 ? 'text-orange-600' : 'text-red-600')}>
                  {inventory.quantity > 0 ? inventory.quantity : 'OUT'}
                </div>
              </div>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBuy}
            disabled={isProcessing || (inventory?.available === false) || isEditing}
            className={cn(
              'w-full py-5 px-6 rounded-xl font-black text-lg text-white transition-all flex items-center justify-center gap-3 shadow-xl uppercase tracking-wide',
              (isProcessing || inventory?.available === false) && 'opacity-50 cursor-not-allowed'
            )}
            style={{ backgroundColor: primaryColor }}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Processing...
              </>
            ) : inventory?.available === false ? (
              'Sold Out'
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                {buttonText}
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // **GLASS VARIANT** - Full glassmorphism
  if (variant === 'glass') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        className={cn(
          'overflow-hidden backdrop-blur-2xl bg-white/30 dark:bg-gray-900/30 border border-white/40 shadow-2xl group relative',
          borderRadius
        )}
        style={{ fontFamily: bodyFontFamily }}
      >
        {/* Gradient background */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            background: `radial-gradient(circle at top right, ${primaryColor}, transparent 70%)`
          }}
        />

        <div className={cn('relative overflow-hidden', getAspectRatio())} style={{ background: `linear-gradient(to bottom, ${primaryColor}08, transparent)` }}>
          {allImages.length > 0 ? (
            <>
              <motion.img
                key={currentImageIndex}
                src={allImages[currentImageIndex]}
                alt={name}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full object-cover"
              />
              {allImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 backdrop-blur-md bg-white/20 px-3 py-2 rounded-full border border-white/30">
                  {allImages.map((_, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setCurrentImageIndex(idx)} 
                      className={cn('rounded-full transition-all', idx === currentImageIndex ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/60')} 
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center backdrop-blur-sm">
              <ShoppingBag className="w-20 h-20 text-white/40" />
            </div>
          )}
          
          {badge && (
            <div className="absolute top-4 left-4 px-4 py-2 text-sm font-bold rounded-full backdrop-blur-md bg-white/90 shadow-lg" style={{ color: primaryColor }}>
              {badge}
            </div>
          )}
          
          {originalPrice && salePercent > 0 && (
            <div className="absolute top-4 right-4 px-4 py-2 text-sm font-bold rounded-full backdrop-blur-md bg-red-500/90 text-white shadow-lg">
              {salePercent}% OFF
            </div>
          )}
        </div>
        
        <div className="p-6 space-y-4 relative z-10 backdrop-blur-sm">
          <div>
            <h3 className="font-bold text-xl mb-2 line-clamp-2" style={{ fontFamily: titleFontFamily, color: textColor }}>
              {name}
            </h3>
            {rating !== undefined && (
              <div className="flex items-center gap-2">
                {renderStars(rating)}
                {reviewCount !== undefined && <span className="text-sm text-gray-600 dark:text-gray-400">({reviewCount})</span>}
              </div>
            )}
          </div>
          
          {description && (
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
              {description}
            </p>
          )}
          
          {features.length > 0 && (
            <div className="space-y-2">
              {features.slice(0, 3).map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-sm backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 px-3 py-2 rounded-lg">
                  <Check className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
                  <span className="text-gray-800 dark:text-gray-200">{feature}</span>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between pt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold" style={{ color: primaryColor }}>
                {formatCurrency(price)}
              </span>
              {originalPrice && (
                <span className="text-base text-gray-500 line-through">
                  {formatCurrency(originalPrice)}
                </span>
              )}
            </div>
            
            {inventory?.showQuantity && inventory.quantity !== undefined && (
              <span className={cn('text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md', inventory.quantity > 5 ? 'bg-green-500/20 text-green-700' : inventory.quantity > 0 ? 'bg-orange-500/20 text-orange-700' : 'bg-red-500/20 text-red-700')}>
                {inventory.quantity > 0 ? `${inventory.quantity} left` : 'Out'}
              </span>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleBuy}
            disabled={isProcessing || (inventory?.available === false) || isEditing}
            className={cn(
              'w-full py-4 px-6 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2.5 backdrop-blur-md shadow-xl',
              (isProcessing || inventory?.available === false) && 'opacity-50 cursor-not-allowed'
            )}
            style={{ 
              backgroundColor: `${primaryColor}E6`,
            }}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : inventory?.available === false ? (
              'Sold Out'
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                {buttonText}
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // **GRADIENT VARIANT** - Bold gradient backgrounds
  if (variant === 'gradient') {
    return (
      <motion.div
        initial={{ opacity: 0, rotate: -1 }}
        animate={{ opacity: 1, rotate: 0 }}
        whileHover={{ rotate: 0, y: -4 }}
        className={cn(
          'overflow-hidden shadow-2xl group relative',
          borderRadius
        )}
        style={{ 
          background: `linear-gradient(135deg, ${primaryColor}15 0%, ${primaryColor}05 50%, ${backgroundColor} 100%)`,
          fontFamily: bodyFontFamily 
        }}
      >
        <div className={cn('relative overflow-hidden bg-white/50 dark:bg-gray-900/50', getAspectRatio())}>
          {allImages.length > 0 ? (
            <>
              <img
                src={allImages[currentImageIndex]}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              {allImages.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-white shadow-xl" style={{ backgroundColor: `${primaryColor}CC` }}>
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-white shadow-xl" style={{ backgroundColor: `${primaryColor}CC` }}>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {allImages.map((_, idx) => (
                      <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={cn('h-2 rounded-full transition-all', idx === currentImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/60')} />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${primaryColor}20, ${primaryColor}05)` }}>
              <ShoppingBag className="w-20 h-20 text-gray-400" />
            </div>
          )}
          
          {badge && (
            <div className="absolute top-4 left-4 px-3 py-1.5 text-sm font-bold rounded-lg text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}DD)` }}>
              {badge}
            </div>
          )}
          
          {originalPrice && salePercent > 0 && (
            <div className="absolute top-4 right-4 px-3 py-1.5 text-sm font-bold rounded-lg bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg">
              SAVE {salePercent}%
            </div>
          )}
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="font-bold text-xl line-clamp-2 mb-2" style={{ fontFamily: titleFontFamily, color: textColor }}>
                {name}
              </h3>
              {rating !== undefined && (
                <div className="flex items-center gap-2">
                  {renderStars(rating)}
                  {reviewCount !== undefined && <span className="text-sm text-gray-600">({reviewCount})</span>}
                </div>
              )}
            </div>
            <div className="px-4 py-2 rounded-xl text-right" style={{ background: `linear-gradient(135deg, ${primaryColor}15, ${primaryColor}05)` }}>
              <div className="text-2xl font-bold" style={{ color: primaryColor }}>
                {formatCurrency(price)}
              </div>
              {originalPrice && (
                <div className="text-xs text-gray-500 line-through">
                  {formatCurrency(originalPrice)}
                </div>
              )}
            </div>
          </div>
          
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
              {description}
            </p>
          )}
          
          {features.length > 0 && (
            <div className="grid grid-cols-1 gap-2">
              {features.slice(0, 4).map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-sm p-2 rounded-lg" style={{ background: `linear-gradient(90deg, ${primaryColor}10, transparent)` }}>
                  <Check className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          )}
          
          {inventory?.showQuantity && inventory.quantity !== undefined && (
            <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: `${primaryColor}08` }}>
              <span className="text-sm font-semibold text-gray-700">Availability</span>
              <span className={cn('text-sm font-bold', inventory.quantity > 5 ? 'text-green-600' : inventory.quantity > 0 ? 'text-orange-600' : 'text-red-600')}>
                {inventory.quantity > 0 ? `${inventory.quantity} in stock` : 'Out of stock'}
              </span>
            </div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleBuy}
            disabled={isProcessing || (inventory?.available === false) || isEditing}
            className={cn(
              'w-full py-4 px-6 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2.5 shadow-lg hover:shadow-2xl',
              (isProcessing || inventory?.available === false) && 'opacity-50 cursor-not-allowed'
            )}
            style={{ 
              background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}DD 100%)`,
            }}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : inventory?.available === false ? (
              'Sold Out'
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                {buttonText}
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // Default fallback (card variant)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'overflow-hidden transition-all duration-300 hover:shadow-lg group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm',
        borderRadius
      )}
      style={{ 
        backgroundColor,
        fontFamily: bodyFontFamily 
      }}
    >
      {/* Product Image */}
      <div className={cn('relative overflow-hidden bg-gray-100 dark:bg-gray-800', getAspectRatio())}>
        {allImages.length > 0 ? (
          <>
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={allImages[currentImageIndex]}
                alt={name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
            
            {/* Image Navigation */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                
                {/* Image Dots */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {allImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={cn(
                        'w-1.5 h-1.5 rounded-full transition-all',
                        idx === currentImageIndex
                          ? 'bg-white w-3'
                          : 'bg-white/50 hover:bg-white/75'
                      )}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-gray-300" />
          </div>
        )}
        
        {/* Badge */}
        {badge && (
          <div 
            className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full text-white"
            style={{ backgroundColor: primaryColor }}
          >
            {badge}
          </div>
        )}
        
        {/* Sale Badge */}
        {originalPrice && salePercent > 0 && (
          <div className="absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold rounded-full bg-red-500 text-white">
            -{salePercent}%
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Name & Rating */}
        <div>
          <h3 
            className="font-semibold text-lg line-clamp-2" 
            style={{ fontFamily: titleFontFamily, color: textColor }}
          >
            {name}
          </h3>
          
          {rating !== undefined && (
            <div className="flex items-center gap-2 mt-1">
              {renderStars(rating)}
              {reviewCount !== undefined && (
                <span className="text-xs text-gray-500">({reviewCount})</span>
              )}
            </div>
          )}
        </div>
        
        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {description}
          </p>
        )}
        
        {/* Features */}
        {features.length > 0 && (
          <ul className="space-y-1">
            {features.slice(0, 3).map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 shrink-0" />
                <span className="line-clamp-1">{feature}</span>
              </li>
            ))}
          </ul>
        )}
        
        {/* Price & Inventory */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-2">
            <span 
              className="text-xl font-bold"
              style={{ color: primaryColor }}
            >
              {formatCurrency(price)}
            </span>
            {originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                {formatCurrency(originalPrice)}
              </span>
            )}
          </div>
          
          {inventory?.showQuantity && inventory.quantity !== undefined && (
            <span className={cn(
              'text-xs font-medium px-2 py-1 rounded-full',
              inventory.quantity > 5 
                ? 'bg-green-100 text-green-700' 
                : inventory.quantity > 0
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-red-100 text-red-700'
            )}>
              {inventory.quantity > 0 ? `${inventory.quantity} left` : 'Sold out'}
            </span>
          )}
        </div>
        
        {/* Buy Button */}
        <button
          onClick={handleBuy}
          disabled={isProcessing || (inventory?.available === false) || isEditing}
          className={cn(
            'w-full py-3 px-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2',
            'hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]',
            (isProcessing || inventory?.available === false) && 'opacity-60 cursor-not-allowed'
          )}
          style={{ backgroundColor: primaryColor }}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : inventory?.available === false ? (
            'Sold Out'
          ) : (
            <>
              {buttonUrl && !useStripeCheckout && <ExternalLink className="w-4 h-4" />}
              {buttonText}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
