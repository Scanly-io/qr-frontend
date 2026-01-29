import type { Block } from '@/types';
import type { PageTheme } from '@/types/theme';
import { FONT_FAMILY_MAP } from '@/lib/fonts';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Check, ArrowRight, Sparkles, Star, Zap, Shield, Rocket, Heart, Gift, Crown, Target, Gem, Award } from 'lucide-react';
import { spacing, typography, shadows, borders, animations } from '@/utils/designSystem';

interface FeaturesBlockProps {
  block: Block;
  theme?: PageTheme;
}

interface Feature {
  icon?: string;
  title: string;
  description: string;
  link?: string;
  color?: string;
  highlight?: boolean;
}

// Icon mapping for lucide icons
const ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  check: Check,
  sparkles: Sparkles,
  star: Star,
  zap: Zap,
  shield: Shield,
  rocket: Rocket,
  heart: Heart,
  gift: Gift,
  crown: Crown,
  target: Target,
  gem: Gem,
  award: Award,
};

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

export default function FeaturesBlock({ block, theme }: FeaturesBlockProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const features = (block.content.features as Feature[]) || [
    { icon: 'sparkles', title: 'Beautiful Design', description: 'Crafted with attention to every detail', highlight: true },
    { icon: 'rocket', title: 'Lightning Fast', description: 'Optimized for the best performance' },
    { icon: 'shield', title: 'Secure & Private', description: 'Your data is always protected' },
    { icon: 'gem', title: 'Premium Quality', description: 'Built to the highest standards' },
  ];

  const style = (block.content.style as 'elegant' | 'minimal' | 'glass' | 'gradient' | 'cards' | 'spotlight') || 'elegant';
  const layout = (block.content.layout as 'list' | 'grid' | 'compact') || 'list';
  const showNumbers = (block.content.showNumbers as boolean) ?? false;

  // Theme integration
  const primaryColor = theme?.branding?.primaryColor || theme?.button?.backgroundColor || '#6366f1';
  const titleFont = theme?.typography?.titleFont || 'inter';
  const bodyFont = theme?.typography?.bodyFont || 'inter';
  const titleFontFamily = FONT_FAMILY_MAP[titleFont] || "'Inter', sans-serif";
  const bodyFontFamily = FONT_FAMILY_MAP[bodyFont] || "'Inter', sans-serif";
  
  const isDark = isDarkBackground(theme);
  const titleColor = theme?.typography?.titleColor || (isDark ? '#ffffff' : '#18181b');
  const bodyColor = theme?.typography?.bodyColor || (isDark ? '#a1a1aa' : '#71717a');

  // Render icon (emoji or lucide)
  const renderIcon = (icon: string | undefined, color: string, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeMap = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };
    
    // Auto-convert common emojis to Lucide icon names
    const emojiToLucide: Record<string, string> = {
      '✨': 'sparkles',
      '🚀': 'rocket',
      '🔒': 'shield',
      '💎': 'gem',
      '⚡': 'zap',
      '🎯': 'target',
      '❤️': 'heart',
      '🎁': 'gift',
      '👑': 'crown',
      '⭐': 'star',
      '✅': 'check',
      '🏆': 'award',
    };
    
    // Convert emoji to Lucide name if it's a known emoji
    const convertedIcon = icon && emojiToLucide[icon] ? emojiToLucide[icon] : icon;
    const iconKey = convertedIcon?.toLowerCase()?.trim();
    const LucideIcon = iconKey && ICON_MAP[iconKey];
    
    console.log('FeaturesBlock renderIcon:', { icon, iconKey, hasLucideIcon: !!LucideIcon, availableIcons: Object.keys(ICON_MAP) });
    
    if (LucideIcon) {
      return <LucideIcon className={sizeMap[size]} style={{ color }} />;
    }
    
    // Fallback to emoji or placeholder
    return <span className={size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-xl' : 'text-lg'}>{icon || '✨'}</span>;
  };

  // Staggered animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // ===== ELEGANT STYLE - Premium cards with hover glow =====
  if (style === 'elegant') {
    return (
      <motion.div 
        className="w-full py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className={layout === 'grid' ? 'w-full grid grid-cols-2 gap-3' : 'w-full flex flex-col gap-3'}>
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`group relative overflow-hidden rounded-2xl p-5 transition-all duration-500 cursor-pointer ${
                isDark 
                  ? 'bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] hover:border-white/20' 
                  : 'bg-white border border-zinc-100 hover:border-zinc-200 hover:shadow-xl hover:shadow-black/5'
              } ${feature.highlight ? 'ring-2 ring-offset-2 ' + (isDark ? 'ring-white/20 ring-offset-transparent' : 'ring-zinc-200 ring-offset-white') : ''}`}
            >
              {/* Animated gradient background */}
              <motion.div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(600px circle at ${hoveredIndex === idx ? '50%' : '0%'} 50%, ${feature.color || primaryColor}15, transparent 40%)`
                }}
              />

              {/* Highlight badge */}
              {feature.highlight && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="absolute -top-1 -right-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full"
                  style={{ 
                    backgroundColor: primaryColor,
                    color: '#fff',
                  }}
                >
                  Popular
                </motion.div>
              )}

              <div className="relative flex items-start gap-4">
                {/* Animated icon container */}
                <motion.div 
                  className="relative flex-shrink-0"
                  animate={{ 
                    scale: hoveredIndex === idx ? 1.1 : 1,
                    rotate: hoveredIndex === idx ? 5 : 0 
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${feature.color || primaryColor}25, ${feature.color || primaryColor}10)`,
                      boxShadow: hoveredIndex === idx ? `0 8px 20px ${feature.color || primaryColor}30` : 'none'
                    }}
                  >
                    {renderIcon(feature.icon, feature.color || primaryColor, 'lg')}
                  </div>
                  
                  {/* Pulsing ring on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    style={{ border: `2px solid ${feature.color || primaryColor}40` }}
                    initial={{ scale: 1, opacity: 0 }}
                    animate={hoveredIndex === idx ? {
                      scale: [1, 1.3, 1.3],
                      opacity: [0.5, 0, 0],
                    } : { scale: 1, opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </motion.div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {showNumbers && (
                      <span 
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ 
                          backgroundColor: `${primaryColor}15`,
                          color: primaryColor 
                        }}
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    )}
                    <h3 
                      className="text-base font-semibold transition-colors duration-300"
                      style={{ fontFamily: titleFontFamily, color: titleColor }}
                    >
                      {feature.title}
                    </h3>
                  </div>
                  <p 
                    className="text-sm leading-relaxed mt-1 transition-colors duration-300"
                    style={{ fontFamily: bodyFontFamily, color: bodyColor }}
                  >
                    {feature.description}
                  </p>
                </div>

                {/* Arrow indicator */}
                {feature.link && (
                  <motion.div 
                    className="flex-shrink-0 self-center"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: hoveredIndex === idx ? 1 : 0, x: hoveredIndex === idx ? 0 : -10 }}
                  >
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${primaryColor}15` }}
                    >
                      <ArrowRight className="w-4 h-4" style={{ color: primaryColor }} />
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  // ===== MINIMAL STYLE - Ultra-clean Apple-inspired =====
  if (style === 'minimal') {
    return (
      <motion.div 
        className="w-full py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className={layout === 'grid' ? 'w-full grid grid-cols-2 gap-3' : 'w-full flex flex-col gap-1'}>
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`group flex items-center gap-4 p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                isDark ? 'hover:bg-white/5' : 'hover:bg-zinc-50'
              }`}
            >
              {/* Simple animated icon */}
              <motion.div 
                className="text-2xl"
                animate={{ 
                  scale: hoveredIndex === idx ? 1.2 : 1,
                  rotate: hoveredIndex === idx ? 10 : 0 
                }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                {feature.icon || '✨'}
              </motion.div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 
                  className="text-[15px] font-medium"
                  style={{ fontFamily: titleFontFamily, color: titleColor }}
                >
                  {feature.title}
                </h3>
                <motion.p 
                  className="text-[13px] mt-0.5 overflow-hidden"
                  style={{ fontFamily: bodyFontFamily, color: bodyColor }}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ 
                    height: hoveredIndex === idx ? 'auto' : 0,
                    opacity: hoveredIndex === idx ? 1 : 0 
                  }}
                >
                  {feature.description}
                </motion.p>
              </div>

              {/* Animated check */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: hoveredIndex === idx ? 1 : 0,
                  opacity: hoveredIndex === idx ? 1 : 0 
                }}
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${primaryColor}15` }}
              >
                <Check className="w-3 h-3" style={{ color: primaryColor }} />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  // ===== GLASS STYLE - Glassmorphic cards =====
  if (style === 'glass') {
    return (
      <motion.div 
        className="w-full py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className={layout === 'grid' ? 'w-full grid grid-cols-2 gap-3' : 'w-full flex flex-col gap-3'}>
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              {...animations.hover.lift}
              className={`group relative overflow-hidden rounded-2xl backdrop-blur-xl transition-all duration-300 cursor-pointer ${
                isDark 
                  ? 'bg-white/[0.08] border border-white/20 hover:bg-white/[0.12]' 
                  : 'bg-white/70 border border-white/50 hover:bg-white/90'
              }`}
              style={{ 
                padding: spacing[5],
                boxShadow: hoveredIndex === idx ? shadows.xl : shadows.md
              }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 -translate-x-full"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                }}
                animate={hoveredIndex === idx ? { x: '200%' } : { x: '-100%' }}
                transition={{ duration: 0.8 }}
              />

              <div className="relative flex items-center gap-4">
                {/* Glowing icon */}
                <motion.div 
                  className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 ${
                    isDark ? 'bg-white/20 shadow-lg shadow-white/5' : 'bg-white shadow-lg shadow-black/5'
                  }`}
                  animate={{ 
                    boxShadow: hoveredIndex === idx 
                      ? `0 10px 30px ${feature.color || primaryColor}40` 
                      : isDark ? '0 4px 15px rgba(255,255,255,0.05)' : '0 4px 15px rgba(0,0,0,0.05)'
                  }}
                >
                  {renderIcon(feature.icon, feature.color || primaryColor, 'lg')}
                </motion.div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 
                    className="text-base font-semibold mb-0.5"
                    style={{ fontFamily: titleFontFamily, color: titleColor }}
                  >
                    {feature.title}
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ fontFamily: bodyFontFamily, color: bodyColor }}
                  >
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* Bottom glow line */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: feature.color || primaryColor }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: hoveredIndex === idx ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  // ===== GRADIENT STYLE - Vibrant colored cards =====
  if (style === 'gradient') {
    const gradientColors = [
      { from: '#8B5CF6', to: '#6366F1' },
      { from: '#3B82F6', to: '#06B6D4' },
      { from: '#10B981', to: '#14B8A6' },
      { from: '#F59E0B', to: '#F97316' },
      { from: '#EF4444', to: '#EC4899' },
    ];

    return (
      <motion.div 
        className="w-full py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className={layout === 'grid' ? 'w-full grid grid-cols-2 gap-3' : 'w-full flex flex-col gap-3'}>
          {features.map((feature, idx) => {
            const gradient = gradientColors[idx % gradientColors.length];
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden rounded-2xl p-5 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${gradient.from}${isDark ? '30' : '15'}, ${gradient.to}${isDark ? '20' : '10'})`,
                  border: `1px solid ${gradient.from}${isDark ? '40' : '20'}`,
                }}
              >
                {/* Animated background gradient */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${gradient.from}${isDark ? '40' : '25'}, ${gradient.to}${isDark ? '30' : '15'})`,
                  }}
                />

                <div className="relative flex items-center gap-4">
                  {/* Icon with gradient border */}
                  <motion.div 
                    className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                    style={{
                      background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.8)',
                      boxShadow: `0 4px 15px ${gradient.from}30`,
                    }}
                    animate={{ rotate: hoveredIndex === idx ? 5 : 0 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {feature.icon || '✨'}
                  </motion.div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 
                      className="text-base font-semibold mb-0.5"
                      style={{ fontFamily: titleFontFamily, color: titleColor }}
                    >
                      {feature.title}
                    </h3>
                    <p 
                      className="text-sm"
                      style={{ fontFamily: bodyFontFamily, color: bodyColor }}
                    >
                      {feature.description}
                    </p>
                  </div>

                  {/* Floating sparkle on hover */}
                  <motion.div
                    className="absolute top-3 right-3"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: hoveredIndex === idx ? 1 : 0,
                      scale: hoveredIndex === idx ? 1 : 0,
                      rotate: hoveredIndex === idx ? 180 : 0
                    }}
                  >
                    <Sparkles className="w-4 h-4" style={{ color: gradient.from }} />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // ===== CARDS STYLE - Interactive expanding cards =====
  if (style === 'cards') {
    return (
      <motion.div 
        className="w-full py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className={layout === 'grid' ? 'w-full grid grid-cols-2 gap-3' : 'w-full flex flex-col gap-3'}>
          {features.map((feature, idx) => {
            const isLarge = idx === 0 || (features.length > 4 && idx === 3);
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                whileHover={{ scale: 1.02 }}
                className={`group relative overflow-hidden rounded-2xl p-5 cursor-pointer transition-all duration-300 ${
                  isLarge ? 'col-span-2' : ''
                } ${
                  isDark 
                    ? 'bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/10 hover:border-white/20' 
                    : 'bg-gradient-to-br from-white to-zinc-50 border border-zinc-100 hover:border-zinc-200 hover:shadow-xl'
                }`}
              >
                {/* Decorative corner */}
                <div 
                  className="absolute top-0 right-0 w-20 h-20 opacity-20 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at top right, ${feature.color || primaryColor}, transparent 70%)`
                  }}
                />

                <div className={`relative ${isLarge ? 'flex items-center gap-6' : ''}`}>
                  {/* Large animated icon */}
                  <motion.div 
                    className={`${isLarge ? 'w-16 h-16' : 'w-12 h-12 mb-3'} rounded-2xl flex items-center justify-center`}
                    style={{
                      background: `linear-gradient(135deg, ${feature.color || primaryColor}20, ${feature.color || primaryColor}10)`,
                    }}
                    animate={{ 
                      scale: hoveredIndex === idx ? 1.1 : 1,
                      rotate: hoveredIndex === idx ? 5 : 0 
                    }}
                  >
                    <span className={isLarge ? 'text-3xl' : 'text-2xl'}>
                      {feature.icon || '✨'}
                    </span>
                  </motion.div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h3 
                      className={`font-semibold mb-1 ${isLarge ? 'text-lg' : 'text-base'}`}
                      style={{ fontFamily: titleFontFamily, color: titleColor }}
                    >
                      {feature.title}
                    </h3>
                    <p 
                      className={`${isLarge ? 'text-sm' : 'text-xs'} leading-relaxed`}
                      style={{ fontFamily: bodyFontFamily, color: bodyColor }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* Expand indicator */}
                <motion.div
                  className="absolute bottom-3 right-3"
                  animate={{ rotate: expandedIndex === idx ? 180 : 0 }}
                >
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: `${primaryColor}15` }}
                  >
                    <ArrowRight className="w-3 h-3" style={{ color: primaryColor }} />
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // ===== SPOTLIGHT STYLE - Featured highlight design =====
  if (style === 'spotlight') {
    return (
      <motion.div 
        className="w-full py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className={layout === 'grid' ? 'w-full grid grid-cols-2 gap-3' : 'w-full flex flex-col gap-2'}>
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`group relative overflow-hidden rounded-xl transition-all duration-500 cursor-pointer ${
                hoveredIndex === idx 
                  ? isDark ? 'bg-white/[0.1]' : 'bg-zinc-50'
                  : isDark ? 'bg-white/[0.03]' : 'bg-transparent'
              }`}
            >
              {/* Spotlight beam */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(90deg, transparent, ${feature.color || primaryColor}20, transparent)`,
                }}
                initial={{ x: '-100%' }}
                animate={{ x: hoveredIndex === idx ? '100%' : '-100%' }}
                transition={{ duration: 0.6 }}
              />

              <div className="relative flex items-center gap-4 p-4">
                {/* Number or icon */}
                <motion.div 
                  className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg"
                  style={{
                    backgroundColor: hoveredIndex === idx ? `${feature.color || primaryColor}20` : 'transparent',
                    color: hoveredIndex === idx ? (feature.color || primaryColor) : bodyColor,
                  }}
                  animate={{ scale: hoveredIndex === idx ? 1.1 : 1 }}
                >
                  {showNumbers ? String(idx + 1).padStart(2, '0') : feature.icon || '•'}
                </motion.div>
                
                {/* Content with animated underline */}
                <div className="flex-1 min-w-0">
                  <h3 
                    className="text-base font-medium relative inline-block"
                    style={{ fontFamily: titleFontFamily, color: titleColor }}
                  >
                    {feature.title}
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 rounded-full"
                      style={{ backgroundColor: feature.color || primaryColor }}
                      initial={{ width: 0 }}
                      animate={{ width: hoveredIndex === idx ? '100%' : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </h3>
                  <AnimatePresence>
                    {hoveredIndex === idx && (
                      <motion.p 
                        className="text-sm mt-1"
                        style={{ fontFamily: bodyFontFamily, color: bodyColor }}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        {feature.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Arrow */}
                <motion.div
                  animate={{ 
                    x: hoveredIndex === idx ? 0 : -10,
                    opacity: hoveredIndex === idx ? 1 : 0
                  }}
                >
                  <ArrowRight className="w-4 h-4" style={{ color: feature.color || primaryColor }} />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  // ===== DEFAULT FALLBACK =====
  return (
    <motion.div 
      className="w-full py-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="space-y-3">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            className={`flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 ${
              isDark 
                ? 'bg-white/[0.06] border-white/10 hover:bg-white/[0.1]' 
                : 'bg-white border-zinc-100 hover:border-zinc-200 hover:shadow-lg'
            }`}
          >
            <div className="flex-shrink-0 text-2xl">{feature.icon || '✨'}</div>
            <div className="flex-1">
              <h3 
                className="text-base font-semibold"
                style={{ fontFamily: titleFontFamily, color: titleColor }}
              >
                {feature.title}
              </h3>
              <p 
                className="text-sm mt-0.5"
                style={{ fontFamily: bodyFontFamily, color: bodyColor }}
              >
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
