import type { Block } from '@/types';
import type { PageTheme } from '@/types/theme';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { FONT_FAMILY_MAP } from '@/lib/fonts';
import { 
  spacing, 
  borders, 
  animations, 
  getCardStyles
} from '@/utils/designSystem';

interface TestimonialBlockProps {
  block: Block;
  theme?: PageTheme;
}

interface TestimonialItem {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  avatar?: string;
  rating?: number;
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

export default function TestimonialBlock({ block, theme }: TestimonialBlockProps) {
  const items = (block.content.items as TestimonialItem[]) || [
    {
      quote: 'This product has completely transformed how we work. The attention to detail and user experience is absolutely amazing!',
      author: 'Sarah Johnson',
      role: 'CEO',
      company: 'TechCorp',
      rating: 5,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [autoPlay, setAutoPlay] = useState(true);
  
  // Configuration
  const layout = (block.content.layout as 'single' | 'grid' | 'carousel' | 'masonry' | 'stack') || 'single';
  const columns = (block.content.columns as 1 | 2 | 3) || 2;
  const style = (block.content.style as 'elegant' | 'cards' | 'minimal' | 'quote' | 'glass' | 'gradient') || 'elegant';
  const showRating = (block.content.showRating as boolean) ?? true;
  const showAvatar = (block.content.showAvatar as boolean) ?? true;
  const showCompany = (block.content.showCompany as boolean) ?? true;

  // Theme integration
  const primaryColor = theme?.branding?.primaryColor || theme?.button?.backgroundColor || '#6366f1';
  const titleFont = theme?.typography?.titleFont || 'inter';
  const bodyFont = theme?.typography?.bodyFont || 'inter';
  const titleFontFamily = FONT_FAMILY_MAP[titleFont] || "'Inter', sans-serif";
  const bodyFontFamily = FONT_FAMILY_MAP[bodyFont] || "'Inter', sans-serif";
  
  const isDark = isDarkBackground(theme);
  const titleColor = theme?.typography?.titleColor || (isDark ? '#ffffff' : '#18181b');
  const bodyColor = theme?.typography?.bodyColor || (isDark ? '#a1a1aa' : '#71717a');
  const cardBg = isDark ? 'rgba(255,255,255,0.06)' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)';

  // Auto-play carousel
  useEffect(() => {
    if (layout === 'carousel' && autoPlay && items.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [layout, autoPlay, items.length]);

  // Navigation
  const nextSlide = () => {
    setAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };
  const prevSlide = () => {
    setAutoPlay(false);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  // Grid columns mapping
  const gridColsMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  };

  // Render star rating with animation
  const renderRating = (rating: number = 5) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Star 
              className={`w-4 h-4 ${i < rating ? 'fill-amber-400 text-amber-400' : ''}`}
              style={{ color: i < rating ? '#fbbf24' : isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }}
            />
          </motion.div>
        ))}
      </div>
    );
  };

  // Render avatar with gradient fallback
  const renderAvatar = (item: TestimonialItem, size: 'sm' | 'md' | 'lg' = 'md') => {
    if (!showAvatar) return null;
    
    const sizeMap = { sm: 'w-10 h-10', md: 'w-12 h-12', lg: 'w-16 h-16' };
    const textSizeMap = { sm: 'text-sm', md: 'text-lg', lg: 'text-xl' };
    
    if (item.avatar) {
      return (
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`${sizeMap[size]} rounded-full overflow-hidden ring-2 shadow-lg`}
          style={{ 
            '--tw-ring-color': `${primaryColor}40`,
            boxShadow: `0 4px 15px ${primaryColor}20`
          } as React.CSSProperties}
        >
          <img
            src={item.avatar}
            alt={item.author}
            className="w-full h-full object-cover"
          />
        </motion.div>
      );
    }
    
    return (
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className={`${sizeMap[size]} rounded-full flex items-center justify-center text-white font-bold ${textSizeMap[size]} shadow-lg`}
        style={{ 
          background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
          boxShadow: `0 4px 15px ${primaryColor}40`
        }}
      >
        {item.author.charAt(0).toUpperCase()}
      </motion.div>
    );
  };

  // Render testimonial card based on style
  const renderTestimonialCard = (item: TestimonialItem, idx: number) => {
    const isHovered = hoveredIndex === idx;

    // ===== ELEGANT STYLE =====
    if (style === 'elegant') {
      return (
        <motion.div
          key={idx}
          initial={animations.fadeIn.initial}
          animate={animations.fadeIn.animate}
          transition={{ ...animations.spring.gentle, delay: idx * 0.1 }}
          whileHover={{ 
            y: -8,
            transition: animations.spring.bouncy 
          }}
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="h-full"
        >
          <div 
            className="relative h-full overflow-hidden"
            style={{
              ...getCardStyles(isDark, isHovered, primaryColor),
              borderRadius: borders.radius.xl,
              padding: spacing[6],
              transition: `all ${animations.duration.moderate}ms ${animations.easing.smooth}`,
            }}
          >
            {/* Gradient hover effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(600px circle at 50% 0%, ${primaryColor}10, transparent 40%)`,
              }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: animations.duration.moderate }}
            />

            <div className="relative flex flex-col h-full">
              {/* Rating */}
              {showRating && item.rating && (
                <div className="mb-4">{renderRating(item.rating)}</div>
              )}
              
              {/* Quote */}
              <blockquote 
                className="text-base leading-relaxed flex-grow mb-6"
                style={{ fontFamily: bodyFontFamily, color: bodyColor }}
              >
                "{item.quote}"
              </blockquote>
              
              {/* Author */}
              <div 
                className="flex items-center gap-3 pt-4"
                style={{ borderTop: `1px solid ${cardBorder}` }}
              >
                {renderAvatar(item)}
                <div>
                  <p 
                    className="font-semibold"
                    style={{ fontFamily: titleFontFamily, color: titleColor }}
                  >
                    {item.author}
                  </p>
                  {(item.role || item.company) && (
                    <p 
                      className="text-sm"
                      style={{ color: bodyColor }}
                    >
                      {item.role}{item.role && showCompany && item.company && ' at '}{showCompany && item.company}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    // ===== CARDS STYLE =====
    if (style === 'cards') {
      return (
        <motion.div
          key={idx}
          initial={animations.fadeIn.initial}
          animate={animations.fadeIn.animate}
          transition={{ ...animations.spring.gentle, delay: idx * 0.1 }}
          whileHover={{ 
            y: -8, 
            scale: 1.01,
            transition: animations.spring.bouncy
          }}
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="h-full"
        >
          <div 
            className="relative h-full overflow-hidden"
            style={{
              ...getCardStyles(isDark, isHovered, primaryColor),
              borderRadius: borders.radius.xl,
              padding: spacing[6],
              background: isDark 
                ? `linear-gradient(135deg, ${primaryColor}15, ${primaryColor}08)` 
                : `linear-gradient(135deg, ${primaryColor}08, ${primaryColor}03)`,
            }}
          >
            {/* Quote Icon */}
            <motion.div 
              className="flex items-center justify-center mb-4"
              style={{ 
                width: '40px',
                height: '40px',
                borderRadius: borders.radius.lg,
                backgroundColor: `${primaryColor}20`,
              }}
              animate={{ rotate: isHovered ? 5 : 0 }}
              transition={animations.spring.snappy}
            >
              <Quote className="w-5 h-5" style={{ color: primaryColor }} />
            </motion.div>
            
            {/* Rating */}
            {showRating && item.rating && (
              <div className="mb-3">{renderRating(item.rating)}</div>
            )}
            
            {/* Quote */}
            <blockquote 
              className="text-base leading-relaxed flex-grow mb-6 italic"
              style={{ fontFamily: bodyFontFamily, color: bodyColor }}
            >
              {item.quote}
            </blockquote>
            
            {/* Author */}
            <div className="flex items-center gap-3">
              {renderAvatar(item)}
              <div>
                <p 
                  className="font-semibold"
                  style={{ fontFamily: titleFontFamily, color: titleColor }}
                >
                  {item.author}
                </p>
                {(item.role || item.company) && (
                  <p 
                    className="text-sm"
                    style={{ color: bodyColor }}
                  >
                    {item.role}{item.role && showCompany && item.company && ', '}{showCompany && item.company}
                  </p>
                )}
              </div>
            </div>

            {/* Decorative sparkle */}
            <motion.div
              className="absolute top-4 right-4"
              animate={{ 
                rotate: isHovered ? 180 : 0,
                scale: isHovered ? 1 : 0.8,
                opacity: isHovered ? 1 : 0.3
              }}
            >
              <Sparkles className="w-5 h-5" style={{ color: primaryColor }} />
            </motion.div>
          </div>
        </motion.div>
      );
    }

    // ===== GLASS STYLE =====
    if (style === 'glass') {
      return (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          whileHover={{ y: -4 }}
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="h-full"
        >
          <div 
            className="relative h-full rounded-2xl p-6 backdrop-blur-xl transition-all duration-300 overflow-hidden"
            style={{
              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.7)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.5)'}`,
              boxShadow: isHovered 
                ? `0 25px 50px ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.15)'}` 
                : '0 8px 32px rgba(0,0,0,0.08)',
            }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 -translate-x-full pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
              }}
              animate={isHovered ? { x: '200%' } : { x: '-100%' }}
              transition={{ duration: 0.8 }}
            />

            <div className="relative flex flex-col h-full">
              {/* Rating */}
              {showRating && item.rating && (
                <div className="mb-4">{renderRating(item.rating)}</div>
              )}
              
              {/* Quote */}
              <blockquote 
                className="text-base leading-relaxed flex-grow mb-6"
                style={{ fontFamily: bodyFontFamily, color: bodyColor }}
              >
                "{item.quote}"
              </blockquote>
              
              {/* Author */}
              <div className="flex items-center gap-3">
                {renderAvatar(item)}
                <div>
                  <p 
                    className="font-semibold"
                    style={{ fontFamily: titleFontFamily, color: titleColor }}
                  >
                    {item.author}
                  </p>
                  {(item.role || item.company) && (
                    <p className="text-sm" style={{ color: bodyColor }}>
                      {item.role}{item.role && showCompany && item.company && ' · '}{showCompany && item.company}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom glow line */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5"
              style={{ backgroundColor: primaryColor }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      );
    }

    // ===== GRADIENT STYLE =====
    if (style === 'gradient') {
      const gradients = [
        { from: '#8B5CF6', to: '#6366F1' },
        { from: '#3B82F6', to: '#06B6D4' },
        { from: '#10B981', to: '#14B8A6' },
        { from: '#F59E0B', to: '#F97316' },
        { from: '#EF4444', to: '#EC4899' },
      ];
      const gradient = gradients[idx % gradients.length];

      return (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          whileHover={{ scale: 1.02, y: -4 }}
          className="h-full"
        >
          <div 
            className="relative h-full rounded-2xl p-6 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${gradient.from}20, ${gradient.to}10)`,
              border: `1px solid ${gradient.from}30`,
            }}
          >
            <div className="relative flex flex-col h-full">
              {/* Rating */}
              {showRating && item.rating && (
                <div className="mb-4">{renderRating(item.rating)}</div>
              )}
              
              {/* Quote */}
              <blockquote 
                className="text-base leading-relaxed flex-grow mb-6"
                style={{ fontFamily: bodyFontFamily, color: titleColor }}
              >
                "{item.quote}"
              </blockquote>
              
              {/* Author */}
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
                >
                  {item.avatar ? (
                    <img src={item.avatar} alt={item.author} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    item.author.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <p className="font-semibold" style={{ fontFamily: titleFontFamily, color: titleColor }}>
                    {item.author}
                  </p>
                  {(item.role || item.company) && (
                    <p className="text-sm" style={{ color: bodyColor }}>
                      {item.role}{item.role && showCompany && item.company && ', '}{showCompany && item.company}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Decorative corner */}
            <div 
              className="absolute top-0 right-0 w-20 h-20 opacity-30"
              style={{ background: `radial-gradient(circle at top right, ${gradient.from}, transparent 70%)` }}
            />
          </div>
        </motion.div>
      );
    }

    // ===== MINIMAL STYLE =====
    if (style === 'minimal') {
      return (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="h-full p-4"
        >
          <div className="flex flex-col h-full">
            {/* Rating */}
            {showRating && item.rating && (
              <div className="mb-3">{renderRating(item.rating)}</div>
            )}
            
            {/* Quote */}
            <blockquote 
              className="text-base leading-relaxed flex-grow mb-4"
              style={{ fontFamily: bodyFontFamily, color: bodyColor }}
            >
              {item.quote}
            </blockquote>
            
            {/* Author */}
            <div className="flex items-center gap-3">
              {renderAvatar(item, 'sm')}
              <div>
                <p className="font-medium text-sm" style={{ fontFamily: titleFontFamily, color: titleColor }}>
                  {item.author}
                </p>
                {(item.role || item.company) && (
                  <p className="text-xs" style={{ color: bodyColor }}>
                    {item.role}{item.role && showCompany && item.company && ' · '}{showCompany && item.company}
                  </p>
                )}
              </div>
            </div>

            {/* Animated underline */}
            <motion.div
              className="h-0.5 mt-4 rounded-full"
              style={{ backgroundColor: primaryColor }}
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      );
    }

    // ===== QUOTE STYLE (Large centered) =====
    return (
      <motion.div
        key={idx}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: idx * 0.1 }}
        className="text-center p-8 h-full flex flex-col items-center"
      >
        {/* Large Quote Icon */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Quote 
            className="w-12 h-12 mb-6" 
            style={{ color: primaryColor, opacity: 0.3 }}
          />
        </motion.div>
        
        {/* Quote */}
        <blockquote 
          className="text-xl md:text-2xl leading-relaxed flex-grow mb-8 font-light italic max-w-2xl"
          style={{ fontFamily: bodyFontFamily, color: titleColor }}
        >
          "{item.quote}"
        </blockquote>
        
        {/* Rating */}
        {showRating && item.rating && (
          <div className="mb-4">{renderRating(item.rating)}</div>
        )}
        
        {/* Author */}
        <div className="flex flex-col items-center gap-2">
          {renderAvatar(item, 'lg')}
          <div className="text-center mt-2">
            <p className="font-semibold" style={{ fontFamily: titleFontFamily, color: titleColor }}>
              {item.author}
            </p>
            {(item.role || item.company) && (
              <p className="text-sm" style={{ color: bodyColor }}>
                {item.role}{item.role && showCompany && item.company && ', '}{showCompany && item.company}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // ===== CAROUSEL LAYOUT =====
  if (layout === 'carousel') {
    return (
      <div className="py-6 relative">
        <div className="overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              {renderTestimonialCard(items[currentIndex], currentIndex)}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        {items.length > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <motion.button
              onClick={prevSlide}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-full transition-all"
              style={{
                backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : cardBg,
                border: `1px solid ${cardBorder}`,
              }}
            >
              <ChevronLeft className="w-5 h-5" style={{ color: bodyColor }} />
            </motion.button>
            
            {/* Dots */}
            <div className="flex gap-2">
              {items.map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => { setAutoPlay(false); setCurrentIndex(idx); }}
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: idx === currentIndex ? 24 : 8,
                    backgroundColor: idx === currentIndex ? primaryColor : (isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.15)'),
                  }}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>
            
            <motion.button
              onClick={nextSlide}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-full transition-all"
              style={{
                backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : cardBg,
                border: `1px solid ${cardBorder}`,
              }}
            >
              <ChevronRight className="w-5 h-5" style={{ color: bodyColor }} />
            </motion.button>
          </div>
        )}
      </div>
    );
  }

  // ===== STACK LAYOUT (New) =====
  if (layout === 'stack') {
    return (
      <div className="py-6 relative">
        <div className="relative h-[400px]">
          {items.slice(0, 3).map((item, idx) => (
            <motion.div
              key={idx}
              className="absolute inset-x-0"
              style={{
                top: idx * 12,
                zIndex: items.length - idx,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1 - idx * 0.2, 
                y: 0,
                scale: 1 - idx * 0.05,
              }}
              whileHover={idx === 0 ? { y: -8 } : {}}
            >
              {renderTestimonialCard(item, idx)}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // ===== SINGLE LAYOUT =====
  if (layout === 'single') {
    return (
      <div className="py-6">
        {renderTestimonialCard(items[0], 0)}
      </div>
    );
  }

  // ===== GRID LAYOUT =====
  if (layout === 'grid') {
    return (
      <div className="py-6">
        <div className={`grid ${gridColsMap[columns]} gap-4 md:gap-6`}>
          {items.map((item, idx) => renderTestimonialCard(item, idx))}
        </div>
      </div>
    );
  }

  // ===== MASONRY LAYOUT =====
  if (layout === 'masonry') {
    const columnClass = columns === 1 ? 'columns-1' :
                        columns === 2 ? 'columns-1 md:columns-2' :
                        'columns-1 md:columns-2 lg:columns-3';
    
    return (
      <div className="py-6">
        <div className={columnClass} style={{ columnGap: '1.5rem' }}>
          {items.map((item, idx) => (
            <div key={idx} className="break-inside-avoid mb-6">
              {renderTestimonialCard(item, idx)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="py-6">
      {renderTestimonialCard(items[0], 0)}
    </div>
  );
}
