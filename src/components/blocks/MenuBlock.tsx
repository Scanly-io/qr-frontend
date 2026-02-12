import type { Block } from '@/types';
import type { PageTheme } from '@/types/theme';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Leaf, Flame, Star, Clock, 
  Sparkles, Heart, Plus, Minus,
  UtensilsCrossed, Coffee, Wine, Salad, Cake, Pizza
} from 'lucide-react';
import { useState } from 'react';
import { 
  spacing, 
  typography, 
  shadows, 
  borders, 
  animations, 
  getCardStyles,
  getPrimaryShadow,
} from '../../utils/designSystem';
import { FONT_FAMILY_MAP } from '@/lib/fonts';
import { usePayment } from '@/contexts/PaymentContext';
import { trackCTA } from '@/utils/trackCTA';

interface MenuBlockProps {
  block: Block;
  theme?: PageTheme;
}

interface MenuItem {
  id?: string;
  name: string;
  description?: string;
  price: number | string;
  originalPrice?: number | string;
  image?: string;
  category?: string;
  badges?: ('popular' | 'new' | 'spicy' | 'vegetarian' | 'vegan' | 'gluten-free' | 'chef-special')[];
  available?: boolean;
  prepTime?: string;
  calories?: number;
  allergens?: string[];
}

interface MenuCategory {
  name: string;
  icon?: string;
  items: MenuItem[];
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

// Currency symbols map
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  AUD: 'A$',
  CAD: 'C$',
  JPY: '¥',
  CNY: '¥',
  KRW: '₩',
  MXN: 'MX$',
  BRL: 'R$',
  AED: 'د.إ',
  SAR: '﷼',
  CHF: 'CHF',
  SGD: 'S$',
  HKD: 'HK$',
};

// Format price with currency
function formatPrice(price: number | string, currency: string = 'USD'): string {
  if (typeof price === 'string') return price;
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  return `${symbol}${price.toFixed(2)}`;
}

// Category icons
const categoryIcons: Record<string, typeof UtensilsCrossed> = {
  'appetizers': Salad,
  'starters': Salad,
  'mains': UtensilsCrossed,
  'entrees': UtensilsCrossed,
  'pizza': Pizza,
  'desserts': Cake,
  'drinks': Coffee,
  'beverages': Coffee,
  'wine': Wine,
  'default': UtensilsCrossed,
};

export default function MenuBlock({ block, theme }: MenuBlockProps) {
  // Support both flat items and categorized menu
  const categories = (block.content.categories as MenuCategory[]) || [];
  const flatItems = (block.content.items as MenuItem[]) || [];
  
  // If no categories, create one from flat items
  const menuCategories: MenuCategory[] = categories.length > 0 
    ? categories 
    : flatItems.length > 0 
      ? [{ name: 'Menu', items: flatItems }]
      : [{
          name: 'Starters',
          items: [
            { name: 'Crispy Calamari', description: 'Golden fried with lemon aioli', price: 14.99, badges: ['popular'], image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400' },
            { name: 'Bruschetta', description: 'Fresh tomatoes, basil, garlic on toasted bread', price: 9.99, badges: ['vegetarian', 'vegan'], image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400' },
          ]
        }, {
          name: 'Mains',
          items: [
            { name: 'Grilled Salmon', description: 'Atlantic salmon with seasonal vegetables', price: 28.99, badges: ['chef-special', 'gluten-free'], prepTime: '25 min', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400' },
            { name: 'Truffle Pasta', description: 'Fresh tagliatelle with black truffle cream', price: 24.99, badges: ['vegetarian', 'popular'], image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400' },
          ]
        }];

  const [activeCategory, setActiveCategory] = useState(0);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  
  // Use Payment Context for cart
  const { 
    addToCart: addToPaymentCart, 
    cart: paymentCart, 
    updateQuantity, 
  } = usePayment();

  // Configuration
  const style = (block.content.style as 'elegant' | 'modern' | 'minimal' | 'cards' | 'compact' | 'photo-grid') || 'elegant';
  const showImages = (block.content.showImages as boolean) ?? true;
  const showDescriptions = (block.content.showDescriptions as boolean) ?? true;
  const showBadges = (block.content.showBadges as boolean) ?? true;
  const enableCart = (block.content.enableCart as boolean) ?? false;
  const currency = (block.content.currency as string) || 'USD';

  // Theme integration
  const primaryColor = theme?.branding?.primaryColor || theme?.button?.backgroundColor || '#6366f1';
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

  // Badge rendering
  const renderBadge = (badge: string) => {
    const badgeConfig: Record<string, { icon: typeof Leaf; color: string; label: string }> = {
      'popular': { icon: Star, color: '#F59E0B', label: 'Popular' },
      'new': { icon: Sparkles, color: '#8B5CF6', label: 'New' },
      'spicy': { icon: Flame, color: '#EF4444', label: 'Spicy' },
      'vegetarian': { icon: Leaf, color: '#22C55E', label: 'Vegetarian' },
      'vegan': { icon: Leaf, color: '#10B981', label: 'Vegan' },
      'gluten-free': { icon: Salad, color: '#F97316', label: 'GF' },
      'chef-special': { icon: UtensilsCrossed, color: primaryColor, label: 'Chef\'s Special' },
    };
    
    const config = badgeConfig[badge];
    if (!config) return null;
    
    const Icon = config.icon;
    
    return (
      <span 
        key={badge}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-bold shadow-sm"
        style={{ backgroundColor: `${config.color}20`, color: config.color }}
      >
        <Icon className="w-4 h-4" />
        {config.label}
      </span>
    );
  };

  // Cart functions using PaymentContext
  const handleAddToCart = (item: MenuItem, categoryIndex: number, itemIndex: number) => {
    trackCTA(block.id, item.name, `menu-item-${categoryIndex}-${itemIndex}`, 'menu');
    addToPaymentCart({
      id: `menu-${block.id}-${categoryIndex}-${itemIndex}`,
      type: 'product',
      name: item.name,
      price: typeof item.price === 'number' ? item.price : parseFloat(String(item.price)),
      description: item.description,
      image: item.image,
      quantity: 1,
      metadata: {
        blockId: block.id,
        category: menuCategories[categoryIndex]?.name,
        allergens: item.allergens,
        prepTime: item.prepTime,
      }
    });
  };

  const getCartQuantity = (categoryIndex: number, itemIndex: number): number => {
    const itemId = `menu-${block.id}-${categoryIndex}-${itemIndex}`;
    const cartItem = paymentCart.find(item => item.id === itemId);
    return cartItem?.quantity || 0;
  };

  const toggleLike = (itemId: string) => {
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Render menu item based on style
  const renderMenuItem = (item: MenuItem, index: number, categoryIndex: number) => {
    // Always use consistent categoryIndex-index format for cart
    const itemId = `${categoryIndex}-${index}`;
    const isHovered = hoveredItem === itemId;
    const isLiked = likedItems.has(itemId);
    const cartQty = getCartQuantity(categoryIndex, index);
    const isUnavailable = item.available === false;

    // ===== ELEGANT STYLE =====
    if (style === 'elegant') {
      return (
        <motion.div
          key={itemId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onMouseEnter={() => setHoveredItem(itemId)}
          onMouseLeave={() => setHoveredItem(null)}
          className={`relative ${isUnavailable ? 'opacity-50' : ''}`}
        >
          <div 
            className="flex gap-4 p-5 rounded-2xl transition-all duration-300"
            style={{
              backgroundColor: isHovered ? cardBg : 'transparent',
              border: `2px solid ${isHovered ? primaryColor + '40' : 'transparent'}`,
              boxShadow: isHovered ? `0 8px 24px ${primaryColor}15` : 'none',
            }}
          >
            {/* Image */}
            {showImages && item.image && (
              <motion.div 
                className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 shadow-md"
                whileHover={{ scale: 1.05 }}
              >
                <img 
                  src={item.image}
                  srcSet={`
                    ${item.image}&fm=webp&w=200 200w,
                    ${item.image}&fm=webp&w=400 400w,
                    ${item.image}&fm=webp&w=800 800w
                  `}
                  sizes="(max-width: 600px) 200px, (max-width: 900px) 400px, 800px"
                  alt={item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
            )}
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 
                  className="font-bold text-lg line-clamp-2"
                  style={{ fontFamily: titleFontFamily, color: titleColor }}
                >
                  {item.name}
                </h4>
                <div className="flex items-baseline gap-2 flex-shrink-0">
                  {item.originalPrice && (
                    <span className="text-sm line-through font-medium" style={{ color: bodyColor }}>
                      {formatPrice(item.originalPrice, currency)}
                    </span>
                  )}
                  <span 
                    className="font-black text-lg"
                    style={{ fontFamily: titleFontFamily, color: item.originalPrice ? '#EF4444' : primaryColor }}
                  >
                    {formatPrice(item.price, currency)}
                  </span>
                </div>
              </div>
              
              {showDescriptions && item.description && (
                <p 
                  className="text-base line-clamp-2 mb-3 leading-relaxed"
                  style={{ fontFamily: bodyFontFamily, color: bodyColor }}
                >
                  {item.description}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                {/* Badges */}
                {showBadges && item.badges && item.badges.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {item.badges.map(badge => renderBadge(badge))}
                  </div>
                )}
                
                {/* Prep time */}
                {item.prepTime && (
                  <span className="text-sm font-semibold flex items-center gap-1.5" style={{ color: bodyColor }}>
                    <Clock className="w-4 h-4" />
                    {item.prepTime}
                  </span>
                )}
              </div>
            </div>
            
            {/* Actions - Modern floating buttons */}
            <div className="flex flex-col items-end gap-2">
              {/* Modern Heart Button */}
              <motion.button
                onClick={(e) => { e.stopPropagation(); toggleLike(itemId); }}
                className="relative w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden"
                style={{ 
                  backgroundColor: isLiked ? `${primaryColor}15` : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                  border: `1px solid ${isLiked ? primaryColor + '30' : 'transparent'}`,
                }}
                whileHover={{ scale: 1.08, backgroundColor: isLiked ? `${primaryColor}20` : isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <motion.div
                  animate={isLiked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Heart 
                    className="w-4 h-4 transition-colors duration-200"
                    style={{ 
                      color: isLiked ? primaryColor : bodyColor,
                      fill: isLiked ? primaryColor : 'transparent',
                    }}
                  />
                </motion.div>
                {/* Ripple effect on like */}
                <AnimatePresence>
                  {isLiked && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0.6 }}
                      animate={{ scale: 2.5, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: primaryColor }}
                    />
                  )}
                </AnimatePresence>
              </motion.button>
              
              {/* Modern Cart Controls */}
              {enableCart && !isUnavailable && (
                <div className="flex items-center gap-1">
                  {cartQty > 0 ? (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-1 rounded-xl px-1 py-1"
                      style={{ 
                        backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                        border: `1px solid ${primaryColor}20`,
                      }}
                    >
                      <motion.button
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          const qty = getCartQuantity(categoryIndex, index);
                          if (qty > 0) {
                            updateQuantity(`menu-${block.id}-${categoryIndex}-${index}`, qty - 1);
                          }
                        }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${primaryColor}15` }}
                        whileHover={{ scale: 1.1, backgroundColor: `${primaryColor}25` }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Minus className="w-3 h-3" style={{ color: primaryColor }} />
                      </motion.button>
                      <span className="w-6 text-center font-medium text-sm" style={{ color: titleColor }}>
                        {cartQty}
                      </span>
                      <motion.button
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(item, categoryIndex, index); }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: primaryColor }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Plus className="w-3 h-3 text-white" />
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.button
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(item, categoryIndex, index); }}
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ 
                        backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                        border: `1px solid ${primaryColor}20`,
                      }}
                      whileHover={{ scale: 1.08, backgroundColor: `${primaryColor}15` }}
                      whileTap={{ scale: 0.92 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    >
                      <Plus className="w-4 h-4" style={{ color: primaryColor }} />
                    </motion.button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Divider */}
          <div 
            className="h-px mx-4"
            style={{ backgroundColor: cardBorder }}
          />
        </motion.div>
      );
    }

    // ===== MODERN STYLE (Card-based) =====
    if (style === 'modern' || style === 'cards') {
      const cardStyles = getCardStyles(isDark, isHovered, isHovered ? primaryColor : undefined);
      
      return (
        <motion.div
          key={itemId}
          initial={animations.slideUp.initial}
          animate={animations.slideUp.animate}
          transition={{ delay: index * 0.08, ...animations.spring.gentle }}
          whileHover={{ 
            y: -8, 
            boxShadow: isHovered ? getPrimaryShadow(primaryColor, 'hover') : shadows.xl,
            transition: { duration: animations.duration.base / 1000 }
          }}
          onMouseEnter={() => setHoveredItem(itemId)}
          onMouseLeave={() => setHoveredItem(null)}
          className={`${isUnavailable ? 'opacity-50' : ''}`}
        >
          <div 
            className="overflow-hidden"
            style={{
              ...cardStyles,
              borderRadius: borders.radius['2xl'],
              transition: `all ${animations.duration.moderate}ms ${animations.easing.smooth}`,
            }}
          >
            {/* Image */}
            {showImages && item.image && (
              <div className="aspect-[4/3] relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Badges overlay */}
                {showBadges && item.badges && item.badges.length > 0 && (
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    {item.badges.slice(0, 2).map(badge => renderBadge(badge))}
                  </div>
                )}
                
                {/* Like button */}
                <motion.button
                  onClick={() => toggleLike(itemId)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart 
                    className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-zinc-600'}`}
                  />
                </motion.button>
                
                {/* Price tag */}
                <div className="absolute bottom-3 right-3">
                  <span 
                    className="px-3 py-1.5 rounded-full text-sm font-bold bg-white/90 backdrop-blur-sm"
                    style={{ color: primaryColor }}
                  >
                    {formatPrice(item.price, currency)}
                  </span>
                </div>
              </div>
            )}
            
            {/* Content */}
            <div style={{ padding: spacing[5] }}>
              <h4 
                className="font-semibold mb-1 line-clamp-1"
                style={{ 
                  fontFamily: titleFontFamily, 
                  color: titleColor,
                  fontSize: typography.h4.fontSize,
                  lineHeight: typography.h4.lineHeight,
                  fontWeight: typography.h4.fontWeight,
                }}
              >
                {item.name}
              </h4>
              
              {showDescriptions && item.description && (
                <p 
                  className="line-clamp-2"
                  style={{ 
                    fontFamily: bodyFontFamily, 
                    color: bodyColor,
                    fontSize: typography.bodySmall.fontSize,
                    lineHeight: typography.bodySmall.lineHeight,
                    marginBottom: spacing[3],
                  }}
                >
                  {item.description}
                </p>
              )}
              
              {/* Bottom row */}
              <div className="flex items-center justify-between">
                {item.prepTime && (
                  <span 
                    className="flex items-center"
                    style={{ 
                      color: bodyColor,
                      fontSize: typography.caption.fontSize,
                      gap: spacing[1],
                    }}
                  >
                    <Clock className="w-3 h-3" />
                    {item.prepTime}
                  </span>
                )}
                
                {!showImages && (
                  <span 
                    className="font-bold" 
                    style={{ 
                      color: primaryColor,
                      fontSize: typography.h4.fontSize,
                      fontWeight: typography.h4.fontWeight,
                    }}
                  >
                    {formatPrice(item.price, currency)}
                  </span>
                )}
                
                {enableCart && !isUnavailable && (
                  <motion.button
                    onClick={() => handleAddToCart(item, categoryIndex, index)}
                    className="text-sm font-medium text-white"
                    style={{ 
                      backgroundColor: primaryColor,
                      padding: `${spacing[2]} ${spacing[4]}`,
                      borderRadius: borders.radius.full,
                      fontSize: typography.bodySmall.fontSize,
                      fontWeight: '600',
                      boxShadow: getPrimaryShadow(primaryColor),
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: getPrimaryShadow(primaryColor, 'hover'),
                    }}
                    whileTap={animations.tap.shrink}
                  >
                    {cartQty > 0 ? `Add More (${cartQty})` : 'Add to Order'}
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    // ===== MINIMAL STYLE =====
    if (style === 'minimal') {
      return (
        <motion.div
          key={itemId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.03 }}
          onMouseEnter={() => setHoveredItem(itemId)}
          onMouseLeave={() => setHoveredItem(null)}
          className={`py-3 ${isUnavailable ? 'opacity-50' : ''}`}
        >
          <div className="flex items-baseline justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 
                  className="font-medium"
                  style={{ fontFamily: titleFontFamily, color: isHovered ? primaryColor : titleColor }}
                >
                  {item.name}
                </h4>
                {showBadges && item.badges?.includes('popular') && (
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                )}
              </div>
              {showDescriptions && item.description && (
                <p className="text-sm mt-0.5" style={{ color: bodyColor }}>
                  {item.description}
                </p>
              )}
            </div>
            
            {/* Dotted line */}
            <div 
              className="flex-1 border-b border-dotted mx-2"
              style={{ borderColor: cardBorder }}
            />
            
            <span className="font-semibold" style={{ color: primaryColor }}>
              {formatPrice(item.price, currency)}
            </span>
          </div>
        </motion.div>
      );
    }

    // ===== COMPACT STYLE =====
    if (style === 'compact') {
      return (
        <motion.div
          key={itemId}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.03 }}
          onMouseEnter={() => setHoveredItem(itemId)}
          onMouseLeave={() => setHoveredItem(null)}
          className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors ${isUnavailable ? 'opacity-50' : ''}`}
          style={{ backgroundColor: isHovered ? `${primaryColor}10` : 'transparent' }}
        >
          {showImages && item.image && (
            <img 
              src={item.image} 
              alt={item.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
          )}
          
          <div className="flex-1 min-w-0">
            <h4 
              className="font-medium text-sm line-clamp-1"
              style={{ fontFamily: titleFontFamily, color: titleColor }}
            >
              {item.name}
            </h4>
            {showBadges && item.badges && (
              <div className="flex gap-1 mt-0.5">
                {item.badges.slice(0, 2).map(badge => (
                  <span 
                    key={badge}
                    className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <span className="font-semibold text-sm" style={{ color: primaryColor }}>
            {formatPrice(item.price, currency)}
          </span>
          
          {enableCart && !isUnavailable && (
            <motion.button
              onClick={() => handleAddToCart(item, categoryIndex, index)}
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ backgroundColor: primaryColor }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-3 h-3 text-white" />
            </motion.button>
          )}
        </motion.div>
      );
    }

    // ===== PHOTO GRID STYLE =====
    return (
      <motion.div
        key={itemId}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ scale: 1.03 }}
        onMouseEnter={() => setHoveredItem(itemId)}
        onMouseLeave={() => setHoveredItem(null)}
        className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer ${isUnavailable ? 'opacity-50' : ''}`}
      >
        {item.image ? (
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: `${primaryColor}20` }}
          >
            <UtensilsCrossed className="w-12 h-12" style={{ color: primaryColor }} />
          </div>
        )}
        
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4"
        >
          <h4 className="font-semibold text-white line-clamp-1">
            {item.name}
          </h4>
          <div className="flex items-center justify-between mt-1">
            <span className="text-white/80 text-sm">
              {formatPrice(item.price, currency)}
            </span>
            {showBadges && item.badges?.includes('popular') && (
              <span className="flex items-center gap-1 text-amber-400 text-xs">
                <Star className="w-3 h-3 fill-current" /> Popular
              </span>
            )}
          </div>
        </div>
        
        {/* Quick add */}
        {enableCart && !isUnavailable && (
          <motion.button
            onClick={() => handleAddToCart(item, categoryIndex, index)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-white/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-4 h-4" style={{ color: primaryColor }} />
          </motion.button>
        )}
      </motion.div>
    );
  };

  // Get category icon
  const getCategoryIcon = (categoryName: string) => {
    const key = categoryName.toLowerCase();
    for (const [iconKey, Icon] of Object.entries(categoryIcons)) {
      if (key.includes(iconKey)) return Icon;
    }
    return categoryIcons.default;
  };

  return (
    <div className="py-6">
      {/* Category tabs - wrapped grid instead of horizontal scroll */}
      {menuCategories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {menuCategories.map((category, idx) => {
            const Icon = getCategoryIcon(category.name);
            const isActive = activeCategory === idx;
            
            return (
              <motion.button
                key={idx}
                onClick={() => setActiveCategory(idx)}
                className="flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all"
                style={{
                  backgroundColor: isActive ? primaryColor : `${primaryColor}10`,
                  color: isActive ? '#ffffff' : primaryColor,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium text-sm">{category.name}</span>
                <span 
                  className="text-xs px-1.5 py-0.5 rounded-full"
                  style={{ 
                    backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : `${primaryColor}20`,
                  }}
                >
                  {category.items.length}
                </span>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Menu items */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {style === 'modern' || style === 'cards' ? (
            <div className="grid grid-cols-1 gap-4">
              {menuCategories[activeCategory]?.items.map((item, idx) => 
                renderMenuItem(item, idx, activeCategory)
              )}
            </div>
          ) : style === 'photo-grid' ? (
            <div className="grid grid-cols-1 gap-3">
              {menuCategories[activeCategory]?.items.map((item, idx) => 
                renderMenuItem(item, idx, activeCategory)
              )}
            </div>
          ) : (
            <div className="space-y-1">
              {menuCategories[activeCategory]?.items.map((item, idx) => 
                renderMenuItem(item, idx, activeCategory)
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
