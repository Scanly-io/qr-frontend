import type { Block } from '@/types';
import type { PageTheme } from '@/types/theme';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Minus, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { FONT_FAMILY_MAP } from '@/lib/fonts';
import { 
  spacing, 
  typography, 
  borders, 
  animations, 
  getCardStyles 
} from '@/utils/designSystem';

interface FAQBlockProps {
  block: Block;
  theme?: PageTheme;
}

interface FAQItem {
  question: string;
  answer: string;
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

export default function FAQBlock({ block, theme }: FAQBlockProps) {
  const items = (block.content.items as FAQItem[]) || [
    {
      question: 'How does this work?',
      answer: 'Our platform provides an intuitive way to create and manage your content with powerful features.',
    },
  ];

  const [openIndexes, setOpenIndexes] = useState<number[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // Configuration
  const style = (block.content.style as 'elegant' | 'bordered' | 'cards' | 'minimal' | 'glass' | 'gradient') || 'elegant';
  const iconStyle = (block.content.iconStyle as 'chevron' | 'plus' | 'none') || 'chevron';
  const allowMultiple = (block.content.allowMultiple as boolean) ?? false;

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

  const toggleItem = (index: number) => {
    if (allowMultiple) {
      setOpenIndexes((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else {
      setOpenIndexes((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  const isOpen = (index: number) => openIndexes.includes(index);

  // Render icon based on style
  const renderIcon = (index: number) => {
    if (iconStyle === 'none') return null;
    
    const open = isOpen(index);
    
    if (iconStyle === 'plus') {
      return (
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: open ? primaryColor : `${primaryColor}20` }}
        >
          {open ? (
            <Minus className="w-3.5 h-3.5" style={{ color: open ? '#ffffff' : primaryColor }} />
          ) : (
            <Plus className="w-3.5 h-3.5" style={{ color: primaryColor }} />
          )}
        </motion.div>
      );
    }
    
    // Default chevron
    return (
      <motion.div
        animate={{ rotate: open ? 180 : 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <ChevronDown 
          className="w-5 h-5 transition-colors" 
          style={{ color: open ? primaryColor : bodyColor }} 
        />
      </motion.div>
    );
  };

  // Render FAQ item based on style
  const renderFAQItem = (item: FAQItem, index: number) => {
    const open = isOpen(index);
    const hovered = hoveredIndex === index;

    // ===== ELEGANT STYLE =====
    if (style === 'elegant') {
      return (
        <motion.div
          key={index}
          initial={animations.fadeIn.initial}
          animate={animations.fadeIn.animate}
          transition={{ ...animations.spring.gentle, delay: index * 0.05 }}
          whileHover={{
            scale: 1.01,
            transition: animations.spring.snappy
          }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="overflow-hidden"
        >
          <div 
            style={{
              ...getCardStyles(isDark, open || hovered, primaryColor),
              borderRadius: borders.radius.lg,
              backgroundColor: open || hovered ? cardBg : 'transparent',
              transition: `all ${animations.duration.moderate}ms ${animations.easing.smooth}`,
            }}
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full flex items-center justify-between text-left"
              style={{ padding: spacing[4] }}
            >
              <span 
                className="font-medium pr-4"
                style={{ 
                  fontFamily: titleFontFamily, 
                  color: open ? primaryColor : titleColor,
                  fontSize: typography.body.fontSize,
                  fontWeight: typography.body.fontWeight,
                }}
              >
                {item.question}
              </span>
              {renderIcon(index)}
            </button>
            
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ 
                    duration: animations.duration.moderate / 1000,
                    ease: 'easeOut'
                  }}
                >
                  <div 
                    className="leading-relaxed"
                    style={{ 
                      fontFamily: bodyFontFamily, 
                      color: bodyColor,
                      paddingLeft: spacing[4],
                      paddingRight: spacing[4],
                      paddingBottom: spacing[4],
                    }}
                  >
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      );
    }

    // ===== BORDERED STYLE =====
    if (style === 'bordered') {
      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="border-b transition-colors"
          style={{ borderColor: cardBorder }}
        >
          <button
            onClick={() => toggleItem(index)}
            className="w-full flex items-center justify-between py-5 text-left group"
          >
            <div className="flex items-center gap-3">
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: open ? primaryColor : (hovered ? primaryColor : bodyColor + '40') }}
                animate={{ scale: open || hovered ? 1.2 : 1 }}
              />
              <span 
                className="font-medium"
                style={{ 
                  fontFamily: titleFontFamily, 
                  color: open ? primaryColor : titleColor 
                }}
              >
                {item.question}
              </span>
            </div>
            {renderIcon(index)}
          </button>
          
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <div 
                  className="pb-5 pl-5 leading-relaxed"
                  style={{ fontFamily: bodyFontFamily, color: bodyColor }}
                >
                  {item.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      );
    }

    // ===== CARDS STYLE =====
    if (style === 'cards') {
      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ y: -2 }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="overflow-hidden"
        >
          <div 
            className="rounded-2xl transition-all duration-300 overflow-hidden"
            style={{
              background: isDark 
                ? `linear-gradient(135deg, ${primaryColor}10, ${primaryColor}05)`
                : `linear-gradient(135deg, ${primaryColor}08, ${primaryColor}02)`,
              border: `1px solid ${open ? primaryColor + '40' : primaryColor + '15'}`,
              boxShadow: open || hovered ? `0 15px 40px ${primaryColor}15` : 'none',
            }}
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${primaryColor}20` }}
                  animate={{ rotate: hovered && !open ? 5 : 0 }}
                >
                  <HelpCircle className="w-4 h-4" style={{ color: primaryColor }} />
                </motion.div>
                <span 
                  className="font-medium"
                  style={{ 
                    fontFamily: titleFontFamily, 
                    color: open ? primaryColor : titleColor 
                  }}
                >
                  {item.question}
                </span>
              </div>
              {renderIcon(index)}
            </button>
            
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <div 
                    className="px-5 pb-5 pl-16 leading-relaxed"
                    style={{ fontFamily: bodyFontFamily, color: bodyColor }}
                  >
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      );
    }

    // ===== GLASS STYLE =====
    if (style === 'glass') {
      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="overflow-hidden"
        >
          <div 
            className="rounded-xl backdrop-blur-xl transition-all duration-300 overflow-hidden"
            style={{
              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.7)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.5)'}`,
              boxShadow: open ? '0 15px 35px rgba(0,0,0,0.1)' : '0 4px 15px rgba(0,0,0,0.05)',
            }}
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full flex items-center justify-between p-4 text-left relative overflow-hidden"
            >
              {/* Shimmer effect */}
              {hovered && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                  }}
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 0.6 }}
                />
              )}
              
              <span 
                className="font-medium relative"
                style={{ 
                  fontFamily: titleFontFamily, 
                  color: open ? primaryColor : titleColor 
                }}
              >
                {item.question}
              </span>
              {renderIcon(index)}
            </button>
            
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <div 
                    className="px-4 pb-4 leading-relaxed"
                    style={{ fontFamily: bodyFontFamily, color: bodyColor }}
                  >
                    {item.answer}
                  </div>
                  
                  {/* Bottom accent line */}
                  <motion.div
                    className="h-0.5 mx-4 mb-4 rounded-full"
                    style={{ backgroundColor: primaryColor }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
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
      const gradient = gradients[index % gradients.length];

      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.01 }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="overflow-hidden"
        >
          <div 
            className="rounded-xl transition-all duration-300 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${gradient.from}15, ${gradient.to}08)`,
              border: `1px solid ${open ? gradient.from + '50' : gradient.from + '20'}`,
            }}
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-1.5 h-8 rounded-full"
                  style={{ background: `linear-gradient(180deg, ${gradient.from}, ${gradient.to})` }}
                />
                <span 
                  className="font-medium"
                  style={{ 
                    fontFamily: titleFontFamily, 
                    color: open ? gradient.from : titleColor 
                  }}
                >
                  {item.question}
                </span>
              </div>
              <motion.div
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown 
                  className="w-5 h-5" 
                  style={{ color: open ? gradient.from : bodyColor }} 
                />
              </motion.div>
            </button>
            
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <div 
                    className="px-4 pb-4 pl-9 leading-relaxed"
                    style={{ fontFamily: bodyFontFamily, color: bodyColor }}
                  >
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      );
    }

    // ===== MINIMAL STYLE =====
    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <button
          onClick={() => toggleItem(index)}
          className="w-full flex items-center justify-between py-4 text-left"
        >
          <span 
            className="font-medium transition-colors"
            style={{ 
              fontFamily: titleFontFamily, 
              color: open || hovered ? primaryColor : titleColor 
            }}
          >
            {item.question}
          </span>
          {renderIcon(index)}
        </button>
        
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div 
                className="pb-4 leading-relaxed"
                style={{ fontFamily: bodyFontFamily, color: bodyColor }}
              >
                {item.answer}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Divider line with animation */}
        <motion.div
          className="h-px"
          style={{ 
            backgroundColor: hovered || open ? primaryColor + '40' : cardBorder 
          }}
          animate={{ scaleX: hovered ? 1 : 0.95, opacity: hovered ? 1 : 0.5 }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
    );
  };

  return (
    <div className="py-6">
      <div className="space-y-3">
        {items.map((item, index) => renderFAQItem(item, index))}
      </div>
    </div>
  );
}
