import type { Block } from '@/types';
import type { PageTheme } from '@/types/theme';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, Percent, Tag, Flame, Zap, Gift, Copy, Check,
  ArrowRight, Star, Sparkles, AlertCircle, Timer, Ticket, ShoppingCart
} from 'lucide-react';
import { useState, useEffect, memo } from 'react';
import { FONT_FAMILY_MAP } from '@/lib/fonts';
import { usePayment } from '@/contexts/PaymentContext';
import { 
  spacing, 
  typography, 
  shadows, 
  borders, 
  animations, 
  colors,
  getCardStyles,
  getTextColor,
  getPrimaryShadow,
  staggerContainer,
  staggerItem
} from '../../utils/designSystem';

interface DealsBlockProps {
  block: Block;
  theme?: PageTheme;
}

interface Deal {
  id?: string;
  title: string;
  description?: string;
  originalPrice?: number;
  discountedPrice?: number;
  discountPercent?: number;
  code?: string;
  image?: string;
  expiresAt?: string;
  limited?: boolean;
  remaining?: number;
  featured?: boolean;
  category?: string;
  url?: string;
  badge?: string;
}

// Helper to determine if background is dark
function isDarkBackground(theme?: PageTheme): boolean {
  const bgColor = theme?.background?.color || theme?.background?.gradientFrom || '#ffffff';
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) || 255;
  const g = parseInt(hex.substr(2, 2), 16) || 255;
  const b = parseInt(hex.substr(4, 2), 16) || 255;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}

// Countdown hook
function useCountdown(targetDate: string | undefined) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });
  
  useEffect(() => {
    if (!targetDate) return;
    
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - Date.now();
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
      }
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        expired: false,
      };
    };
    
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);
  
  return timeLeft;
}

export default function DealsBlock({ block, theme }: DealsBlockProps) {
  // Content
  const deals = (block.content.deals as Deal[]) || [];
  const title = (block.content.title as string) || '';
  
  // Default sample deals
  const sampleDeals: Deal[] = deals.length > 0 ? deals : [
    { 
      title: '50% Off First Order', 
      description: 'New customers get half off their first purchase', 
      discountPercent: 50, 
      code: 'WELCOME50',
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      featured: true,
      badge: 'Best Deal',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400'
    },
    { 
      title: 'Free Shipping Weekend', 
      description: 'No minimum purchase required', 
      code: 'FREESHIP',
      expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      limited: true,
      remaining: 47,
    },
    { 
      title: 'Bundle & Save', 
      description: 'Buy 2 items, get 3rd for free', 
      originalPrice: 89.99,
      discountedPrice: 59.99,
      discountPercent: 33,
    },
    { 
      title: 'VIP Early Access', 
      description: 'Exclusive pre-sale for members', 
      discountPercent: 20,
      code: 'VIP20',
      badge: 'Members Only',
    },
  ];

  const displayDeals = sampleDeals;
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [expandedDeal, setExpandedDeal] = useState<number | null>(null);
  const [currentBanner, setCurrentBanner] = useState(0);

  // Configuration
  const style = (block.content.style as 'cards' | 'banner' | 'compact' | 'coupons' | 'flash') || 'cards';
  const showCountdown = (block.content.showCountdown as boolean) ?? true;
  const showRemaining = (block.content.showRemaining as boolean) ?? true;

  // Banner rotation effect - runs always but only used in banner style
  useEffect(() => {
    if (style !== 'banner' || displayDeals.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % displayDeals.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [style, displayDeals.length]);

  // Get countdown for the current deal (always call hook, used conditionally)
  const currentDeal = displayDeals[currentBanner] || displayDeals[0];
  const bannerCountdown = useCountdown(currentDeal?.expiresAt);

  // Theme integration
  const primaryColor = theme?.branding?.primaryColor || theme?.button?.backgroundColor || '#EF4444';
  const titleFont = theme?.typography?.titleFont || 'inter';
  const bodyFont = theme?.typography?.bodyFont || 'inter';
  const titleFontFamily = FONT_FAMILY_MAP[titleFont] || "'Inter', sans-serif";
  const bodyFontFamily = FONT_FAMILY_MAP[bodyFont] || "'Inter', sans-serif";
  
  const isDark = isDarkBackground(theme);
  // Enhanced contrast for better readability
  const titleColor = theme?.typography?.titleColor || (isDark ? '#ffffff' : '#09090b');
  const bodyColor = theme?.typography?.bodyColor || (isDark ? '#d4d4d8' : '#52525b');
  const cardBg = isDark ? 'rgba(255,255,255,0.1)' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';

  // Payment context
  const { addToCart } = usePayment();

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleBuyDeal = (deal: Deal, index: number) => {
    if (!deal.discountedPrice && !deal.originalPrice) return;
    
    const price = deal.discountedPrice || deal.originalPrice || 0;
    const savings = deal.originalPrice && deal.discountedPrice 
      ? deal.originalPrice - deal.discountedPrice 
      : 0;
    
    addToCart({
      id: `deal-${block.id}-${index}`,
      type: 'product',
      name: deal.title,
      price,
      description: deal.description,
      image: deal.image,
      quantity: 1,
      metadata: {
        blockId: block.id,
        originalPrice: deal.originalPrice,
        savings,
        discountPercent: deal.discountPercent,
        code: deal.code,
        dealType: 'special-offer',
      }
    });
  };

  // Mini countdown display
  const MiniCountdown = memo(({ expiresAt }: { expiresAt: string }) => {
    const { days, hours, minutes, seconds, expired } = useCountdown(expiresAt);
    
    if (expired) return <span className="text-red-500 text-xs font-medium">Expired</span>;
    
    if (days > 0) {
      return (
        <span className="text-xs flex items-center gap-1" style={{ color: primaryColor }}>
          <Clock className="w-3 h-3" />
          {days}d {hours}h left
        </span>
      );
    }
    
    return (
      <span className="text-xs flex items-center gap-1 font-medium tabular-nums" style={{ color: '#EF4444' }}>
        <Timer className="w-3 h-3" />
        <span className="inline-block w-[70px]">
          {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </span>
      </span>
    );
  });

  // ===== CARDS STYLE =====
  if (style === 'cards') {
    return (
      <div style={{ paddingTop: spacing[6], paddingBottom: spacing[6] }}>
        {title && (
          <div className="flex items-center mb-6" style={{ gap: spacing[2] }}>
            <Flame className="w-6 h-6" style={{ color: primaryColor }} />
            <h2 
              style={{ 
                fontFamily: titleFontFamily, 
                color: titleColor,
                fontSize: typography.h2.fontSize,
                lineHeight: typography.h2.lineHeight,
                fontWeight: typography.h2.fontWeight,
              }}
            >
              {title}
            </h2>
          </div>
        )}
        
        <div className="grid grid-cols-1" style={{ gap: spacing[5] }}>
          {displayDeals.map((deal, idx) => {
            const cardStyles = deal.featured 
              ? getCardStyles(isDark, true, primaryColor)
              : getCardStyles(isDark);
            
            return (
              <motion.div
                key={idx}
                initial={animations.slideUp.initial}
                animate={animations.slideUp.animate}
                transition={{ delay: idx * 0.1, ...animations.spring.gentle }}
                whileHover={{ 
                  y: -8, 
                  boxShadow: deal.featured 
                    ? getPrimaryShadow(primaryColor, 'hover')
                    : shadows.xl,
                }}
                className="overflow-hidden relative"
                style={{
                  ...cardStyles,
                  borderRadius: borders.radius['2xl'],
                }}
              >
              {/* Featured badge */}
              {deal.badge && (
                <div 
                  className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white z-10"
                  style={{ backgroundColor: primaryColor }}
                >
                  {deal.badge}
                </div>
              )}
              
              <div className="flex flex-col">
                {/* Image */}
                {deal.image && (
                  <div className="aspect-video relative">
                    <img 
                      src={deal.image} 
                      alt={deal.title}
                      className="w-full h-full object-cover"
                    />
                    {deal.discountPercent && (
                      <div 
                        className="absolute bottom-4 right-4 w-16 h-16 rounded-full flex flex-col items-center justify-center text-white font-bold"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <span className="text-xl">{deal.discountPercent}%</span>
                        <span className="text-xs">OFF</span>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Content */}
                <div className="p-5">
                  <h3 
                    className="text-lg font-bold mb-2"
                    style={{ fontFamily: titleFontFamily, color: titleColor }}
                  >
                    {deal.title}
                  </h3>
                  
                  {deal.description && (
                    <p 
                      className="text-sm mb-3"
                      style={{ fontFamily: bodyFontFamily, color: bodyColor }}
                    >
                      {deal.description}
                    </p>
                  )}
                  
                  {/* Price */}
                  {(deal.originalPrice || deal.discountedPrice) && (
                    <div className="flex items-baseline gap-2 mb-3">
                      {deal.originalPrice && (
                        <span className="line-through text-sm" style={{ color: bodyColor }}>
                          ${deal.originalPrice}
                        </span>
                      )}
                      {deal.discountedPrice && (
                        <span className="text-xl font-bold" style={{ color: primaryColor }}>
                          ${deal.discountedPrice}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Code */}
                  {deal.code && (
                    <motion.button
                      onClick={() => copyCode(deal.code!)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed mb-3 w-fit"
                      style={{ borderColor: primaryColor }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Ticket className="w-4 h-4" style={{ color: primaryColor }} />
                      <span className="font-mono font-bold tracking-wider" style={{ color: primaryColor }}>
                        {deal.code}
                      </span>
                      {copiedCode === deal.code ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" style={{ color: bodyColor }} />
                      )}
                    </motion.button>
                  )}
                  
                  {/* Urgency indicators */}
                  <div className="flex items-center gap-3 flex-wrap mb-3">
                    {showCountdown && deal.expiresAt && (
                      <MiniCountdown expiresAt={deal.expiresAt} />
                    )}
                    
                    {showRemaining && deal.limited && deal.remaining && (
                      <span className="text-xs flex items-center gap-1 font-medium text-amber-500">
                        <AlertCircle className="w-3 h-3" />
                        Only {deal.remaining} left!
                      </span>
                    )}
                  </div>

                  {/* Buy button for deals with prices */}
                  {(deal.discountedPrice || deal.originalPrice) && (
                    <motion.button
                      onClick={() => handleBuyDeal(deal, idx)}
                      className="w-full py-3 px-4 rounded-xl font-bold text-white flex items-center justify-center gap-2"
                      style={{ 
                        backgroundColor: primaryColor,
                        boxShadow: getPrimaryShadow(primaryColor),
                      }}
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: getPrimaryShadow(primaryColor, 'hover'),
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                      {deal.discountedPrice && (
                        <span className="font-normal opacity-90">
                          • ${deal.discountedPrice}
                        </span>
                      )}
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // ===== BANNER STYLE =====
  if (style === 'banner') {
    const deal = displayDeals[currentBanner];
    const { days, hours, minutes, seconds, expired } = bannerCountdown;
    
    return (
      <div className="py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBanner}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-2xl overflow-hidden relative"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}CC)`,
            }}
          >
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20"
                style={{ backgroundColor: '#ffffff' }}
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                transition={{ duration: 10, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full opacity-10"
                style={{ backgroundColor: '#ffffff' }}
                animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
                transition={{ duration: 8, repeat: Infinity }}
              />
            </div>
            
            <div className="relative p-8 text-center text-white">
              {deal.discountPercent && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1 mb-4"
                >
                  <Zap className="w-5 h-5" />
                  <span className="text-2xl font-black">{deal.discountPercent}% OFF</span>
                </motion.div>
              )}
              
              <h2 className="text-2xl font-bold mb-2">{deal.title}</h2>
              
              {deal.description && (
                <p className="text-white/80 mb-4">{deal.description}</p>
              )}
              
              {/* Countdown */}
              {showCountdown && deal.expiresAt && !expired && (
                <div className="flex justify-center gap-3 mb-6">
                  {[
                    { value: days, label: 'Days' },
                    { value: hours, label: 'Hours' },
                    { value: minutes, label: 'Mins' },
                    { value: seconds, label: 'Secs' },
                  ].map((unit, i) => (
                    <div 
                      key={i}
                      className="w-16 py-2 rounded-lg bg-white/20 backdrop-blur-sm"
                    >
                      <div className="text-2xl font-bold">{unit.value.toString().padStart(2, '0')}</div>
                      <div className="text-xs text-white/70">{unit.label}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Code */}
              {deal.code && (
                <motion.button
                  onClick={() => copyCode(deal.code!)}
                  className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold mb-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Use Code: {deal.code}</span>
                  {copiedCode === deal.code ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </motion.button>
              )}

              {/* Buy button for deals with prices */}
              {(deal.discountedPrice || deal.originalPrice) && (
                <motion.button
                  onClick={() => handleBuyDeal(deal, currentBanner)}
                  className="inline-flex items-center gap-2 bg-white px-8 py-4 rounded-full font-bold shadow-lg"
                  style={{ color: primaryColor }}
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Get This Deal</span>
                  {deal.discountedPrice && (
                    <span className="font-black">
                      ${deal.discountedPrice}
                    </span>
                  )}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              )}
            </div>
            
            {/* Pagination dots */}
            {displayDeals.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {displayDeals.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentBanner(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentBanner ? 'w-6 bg-white' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // ===== COUPONS STYLE =====
  if (style === 'coupons') {
    return (
      <div className="py-6 space-y-4">
        {displayDeals.map((deal, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex rounded-xl overflow-hidden"
            style={{
              backgroundColor: cardBg,
              border: `1px solid ${cardBorder}`,
            }}
          >
            {/* Left portion - discount */}
            <div 
              className="w-28 flex flex-col items-center justify-center p-4 relative"
              style={{ backgroundColor: primaryColor }}
            >
              <Percent className="w-6 h-6 text-white/50 absolute top-2 right-2" />
              {deal.discountPercent ? (
                <>
                  <span className="text-3xl font-black text-white">{deal.discountPercent}</span>
                  <span className="text-sm font-bold text-white/90">% OFF</span>
                </>
              ) : deal.code ? (
                <Gift className="w-8 h-8 text-white" />
              ) : (
                <Tag className="w-8 h-8 text-white" />
              )}
              
              {/* Dashed separator */}
              <div 
                className="absolute right-0 top-0 bottom-0 w-px"
                style={{
                  backgroundImage: `repeating-linear-gradient(to bottom, transparent, transparent 5px, ${cardBg} 5px, ${cardBg} 10px)`,
                }}
              />
              
              {/* Cutouts */}
              <div 
                className="absolute -top-3 right-0 translate-x-1/2 w-6 h-6 rounded-full"
                style={{ backgroundColor: isDark ? '#18181b' : '#f4f4f5' }}
              />
              <div 
                className="absolute -bottom-3 right-0 translate-x-1/2 w-6 h-6 rounded-full"
                style={{ backgroundColor: isDark ? '#18181b' : '#f4f4f5' }}
              />
            </div>
            
            {/* Right portion - details */}
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 
                    className="font-bold"
                    style={{ fontFamily: titleFontFamily, color: titleColor }}
                  >
                    {deal.title}
                  </h3>
                  {deal.description && (
                    <p className="text-sm mt-1" style={{ color: bodyColor }}>
                      {deal.description}
                    </p>
                  )}
                </div>
                
                {deal.expiresAt && showCountdown && (
                  <MiniCountdown expiresAt={deal.expiresAt} />
                )}
              </div>
              
              {/* Code copy button */}
              {deal.code && (
                <motion.button
                  onClick={() => copyCode(deal.code!)}
                  className="mt-3 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                  style={{ 
                    backgroundColor: `${primaryColor}15`,
                    color: primaryColor,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="font-mono tracking-wider">{deal.code}</span>
                  {copiedCode === deal.code ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </motion.button>
              )}

              {/* Buy button for deals with prices */}
              {(deal.discountedPrice || deal.originalPrice) && (
                <motion.button
                  onClick={() => handleBuyDeal(deal, idx)}
                  className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold text-white"
                  style={{ backgroundColor: primaryColor }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                  {deal.discountedPrice && (
                    <span className="opacity-90">• ${deal.discountedPrice}</span>
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // ===== FLASH SALE STYLE =====
  if (style === 'flash') {
    return (
      <div className="py-6">
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 rounded-t-xl"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="flex items-center gap-3 text-white">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
            >
              <Zap className="w-6 h-6" />
            </motion.div>
            <span className="text-lg font-bold">FLASH SALE</span>
          </div>
          
          {displayDeals[0]?.expiresAt && (
            <div className="flex items-center gap-2 text-white">
              <span className="text-sm">Ends in:</span>
              <MiniCountdown expiresAt={displayDeals[0].expiresAt} />
            </div>
          )}
        </div>
        
        {/* Deals grid */}
        <div 
          className="grid grid-cols-2 gap-px rounded-b-xl overflow-hidden"
          style={{ backgroundColor: cardBorder }}
        >
          {displayDeals.slice(0, 4).map((deal, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4"
              style={{ backgroundColor: cardBg }}
            >
              {deal.image && (
                <div className="aspect-square rounded-lg overflow-hidden mb-3 relative">
                  <img 
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-full object-cover"
                  />
                  {deal.discountPercent && (
                    <div 
                      className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold text-white"
                      style={{ backgroundColor: primaryColor }}
                    >
                      -{deal.discountPercent}%
                    </div>
                  )}
                </div>
              )}
              
              <h4 
                className="font-medium text-sm line-clamp-2 mb-2"
                style={{ color: titleColor }}
              >
                {deal.title}
              </h4>
              
              {(deal.originalPrice || deal.discountedPrice) && (
                <div className="flex items-baseline gap-2">
                  {deal.discountedPrice && (
                    <span className="font-bold" style={{ color: primaryColor }}>
                      ${deal.discountedPrice}
                    </span>
                  )}
                  {deal.originalPrice && (
                    <span className="text-sm line-through" style={{ color: bodyColor }}>
                      ${deal.originalPrice}
                    </span>
                  )}
                </div>
              )}
              
              {deal.limited && deal.remaining && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1" style={{ color: bodyColor }}>
                    <span>Remaining</span>
                    <span>{deal.remaining}</span>
                  </div>
                  <div 
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ backgroundColor: cardBorder }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: primaryColor }}
                      initial={{ width: '100%' }}
                      animate={{ width: `${Math.min((deal.remaining / 100) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Buy button for deals with prices */}
              {(deal.discountedPrice || deal.originalPrice) && (
                <motion.button
                  onClick={() => handleBuyDeal(deal, idx)}
                  className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-white"
                  style={{ backgroundColor: primaryColor }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Buy Now</span>
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // ===== COMPACT STYLE (Default) =====
  return (
    <div className="py-6 space-y-3">
      {displayDeals.map((deal, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          onClick={() => setExpandedDeal(expandedDeal === idx ? null : idx)}
          className="p-4 rounded-xl cursor-pointer transition-all"
          style={{
            backgroundColor: expandedDeal === idx ? `${primaryColor}10` : cardBg,
            border: `1px solid ${expandedDeal === idx ? primaryColor + '40' : cardBorder}`,
          }}
        >
          <div className="flex items-center gap-4">
            {/* Discount badge */}
            {deal.discountPercent && (
              <div 
                className="w-14 h-14 rounded-lg flex flex-col items-center justify-center text-white flex-shrink-0"
                style={{ backgroundColor: primaryColor }}
              >
                <span className="text-lg font-bold">{deal.discountPercent}%</span>
                <span className="text-[10px]">OFF</span>
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <h4 
                className="font-semibold line-clamp-1"
                style={{ fontFamily: titleFontFamily, color: titleColor }}
              >
                {deal.title}
              </h4>
              
              <div className="flex items-center gap-3 mt-1">
                {deal.code && (
                  <span 
                    className="text-xs font-mono px-2 py-0.5 rounded"
                    style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                  >
                    {deal.code}
                  </span>
                )}
                
                {deal.expiresAt && showCountdown && (
                  <MiniCountdown expiresAt={deal.expiresAt} />
                )}
              </div>
            </div>
            
            <ArrowRight 
              className={`w-5 h-5 transition-transform ${expandedDeal === idx ? 'rotate-90' : ''}`}
              style={{ color: bodyColor }}
            />
          </div>
          
          {/* Expanded content */}
          <AnimatePresence>
            {expandedDeal === idx && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t" style={{ borderColor: cardBorder }}>
                  {deal.description && (
                    <p className="text-sm mb-3" style={{ color: bodyColor }}>
                      {deal.description}
                    </p>
                  )}
                  
                  {deal.code && (
                    <motion.button
                      onClick={(e) => { e.stopPropagation(); copyCode(deal.code!); }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium mb-2"
                      style={{ backgroundColor: primaryColor }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {copiedCode === deal.code ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Code
                        </>
                      )}
                    </motion.button>
                  )}

                  {/* Buy button for deals with prices */}
                  {(deal.discountedPrice || deal.originalPrice) && (
                    <motion.button
                      onClick={(e) => { e.stopPropagation(); handleBuyDeal(deal, idx); }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-bold"
                      style={{ backgroundColor: primaryColor }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                      {deal.discountedPrice && (
                        <span className="opacity-90">• ${deal.discountedPrice}</span>
                      )}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
