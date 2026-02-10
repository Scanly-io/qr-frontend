import type { Block } from '@/types';
import type { PageTheme } from '@/types/theme';
import { FONT_FAMILY_MAP } from '@/lib/fonts';
import * as LucideIcons from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  spacing, 
  typography, 
  shadows, 
  borders, 
  animations, 
  getCardStyles
} from '../../utils/designSystem';

interface StatsBlockProps {
  block: Block;
  theme?: PageTheme;
}

interface Stat {
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
  icon?: string;
  color?: string;
}

// Lucide icon renderer
function StatIcon({ iconName, className = '', color }: { iconName?: string; className?: string; color?: string }) {
  if (!iconName) {
    const TrendingUp = LucideIcons.TrendingUp;
    return <TrendingUp className={className} style={{ color }} />;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (LucideIcons as any)[iconName];
  
  if (!IconComponent) {
    const TrendingUp = LucideIcons.TrendingUp;
    return <TrendingUp className={className} style={{ color }} />;
  }

  return <IconComponent className={className} style={{ color }} />;
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

export default function StatsBlock({ block, theme }: StatsBlockProps) {
  const stats = (block.content.stats as Stat[]) || [
    { value: '10K', label: 'Happy Customers', icon: 'Users', color: '#3B82F6' },
    { value: '99%', label: 'Satisfaction Rate', icon: 'Star', color: '#F59E0B' },
    { value: '24/7', label: 'Always Available', icon: 'Clock', color: '#10B981' },
    { value: '50+', label: 'Countries Served', icon: 'Globe', color: '#8B5CF6' },
  ];

  const style = (block.content.style as 'elegant' | 'minimal' | 'glass' | 'gradient' | 'modern' | 'bold') || 'elegant';
  const layout = (block.content.layout as 'grid-2' | 'grid-3' | 'list') || 'list';

  // Theme integration
  const primaryColor = theme?.branding?.primaryColor || theme?.button?.backgroundColor || '#3B82F6';
  const titleFont = theme?.typography?.titleFont || 'inter';
  const bodyFont = theme?.typography?.bodyFont || 'inter';
  const titleFontFamily = FONT_FAMILY_MAP[titleFont] || "'Inter', sans-serif";
  const bodyFontFamily = FONT_FAMILY_MAP[bodyFont] || "'Inter', sans-serif";
  
  // Detect dark theme and adapt colors
  const isDark = isDarkBackground(theme);
  const titleColor = theme?.typography?.titleColor || (isDark ? '#ffffff' : '#18181b');
  const bodyColor = theme?.typography?.bodyColor || (isDark ? '#e4e4e7' : '#71717a');
  
  // Layout classes
  const layoutClasses = {
    'grid-2': 'grid grid-cols-2 gap-3',
    'grid-3': 'grid grid-cols-3 gap-3',
    'list': 'space-y-3',
  };

  // Elegant Style - Premium cards with subtle gradients
  if (style === 'elegant') {
    return (
      <div className="w-full" style={{ paddingTop: spacing[8], paddingBottom: spacing[8] }}>
        <div className={layoutClasses[layout]}>
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={animations.fadeIn.initial}
              animate={animations.fadeIn.animate}
              transition={{ ...animations.spring.gentle, delay: idx * 0.05 }}
              whileHover={{ 
                y: -6,
                transition: animations.spring.bouncy
              }}
              className="group relative overflow-hidden"
              style={{
                ...getCardStyles(isDark, true, stat.color || primaryColor),
                borderRadius: borders.radius.xl,
                padding: spacing[5],
              }}
            >
              {/* Gradient overlay on hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(135deg, ${stat.color || primaryColor}${isDark ? '15' : '05'} 0%, transparent 50%)`,
                  transition: `opacity ${animations.duration.moderate}ms ${animations.easing.smooth}`,
                }}
              />
              
              <div className="relative flex flex-col" style={{ gap: spacing[3] }}>
                {/* Icon with gradient background */}
                <motion.div 
                  className="flex items-center justify-center"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: borders.radius.lg,
                    background: `linear-gradient(135deg, ${stat.color || primaryColor}${isDark ? '30' : '15'}, ${stat.color || primaryColor}${isDark ? '15' : '08'})`,
                  }}
                  whileHover={{ scale: 1.1, transition: animations.spring.snappy }}
                >
                  <StatIcon 
                    iconName={stat.icon} 
                    className="w-5 h-5" 
                    color={stat.color || primaryColor}
                  />
                </motion.div>
                
                {/* Content */}
                <div>
                  <div 
                    className="tracking-tight"
                    style={{ 
                      fontFamily: titleFontFamily, 
                      color: titleColor,
                      fontSize: typography.h1.fontSize,
                      fontWeight: typography.h1.fontWeight,
                      lineHeight: typography.h1.lineHeight,
                    }}
                  >
                    {stat.prefix}{stat.value}{stat.suffix}
                  </div>
                  <p 
                    style={{ 
                      fontFamily: bodyFontFamily, 
                      color: bodyColor,
                      fontSize: typography.bodySmall.fontSize,
                      marginTop: spacing[1],
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Minimal Style - Clean and modern
  if (style === 'minimal') {
    return (
      <div className="w-full" style={{ paddingTop: spacing[8], paddingBottom: spacing[8] }}>
        <div className={layoutClasses[layout]}>
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={animations.fadeIn.initial}
              animate={animations.fadeIn.animate}
              transition={{ ...animations.spring.gentle, delay: idx * 0.05 }}
              whileHover={{ 
                scale: 1.02,
                transition: animations.spring.snappy
              }}
              className={`group transition-all ${
                isDark ? 'hover:bg-white/5' : 'hover:bg-zinc-50'
              }`}
              style={{
                padding: spacing[5],
                borderRadius: borders.radius.lg,
                transition: `all ${animations.duration.base}ms ${animations.easing.smooth}`,
              }}
            >
              <div className="flex flex-col" style={{ gap: spacing[3] }}>
                {/* Icon */}
                <motion.div 
                  whileHover={{ scale: 1.1, transition: animations.spring.bouncy }}
                >
                  <StatIcon 
                    iconName={stat.icon} 
                    className="w-6 h-6" 
                    color={stat.color || primaryColor}
                  />
                </motion.div>
                
                {/* Content */}
                <div>
                  <div 
                    className="tracking-tight"
                    style={{ 
                      fontFamily: titleFontFamily, 
                      color: titleColor,
                      fontSize: typography.h1.fontSize,
                      fontWeight: typography.h1.fontWeight,
                      lineHeight: typography.h1.lineHeight,
                    }}
                  >
                    {stat.prefix}{stat.value}{stat.suffix}
                  </div>
                  <p 
                    className="font-medium"
                    style={{ 
                      fontFamily: bodyFontFamily, 
                      color: bodyColor,
                      fontSize: typography.bodySmall.fontSize,
                      marginTop: spacing[1],
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Glass Style - Modern glassmorphism
  if (style === 'glass') {
    return (
      <div className="w-full" style={{ paddingTop: spacing[8], paddingBottom: spacing[8] }}>
        <div className={layoutClasses[layout]}>
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={animations.fadeIn.initial}
              animate={animations.fadeIn.animate}
              transition={{ ...animations.spring.gentle, delay: idx * 0.05 }}
              whileHover={{ 
                y: -6,
                transition: animations.spring.bouncy
              }}
              className={`group relative overflow-hidden backdrop-blur-xl ${
                isDark 
                  ? 'bg-white/10 border border-white/20 hover:bg-white/15' 
                  : 'bg-white/60 border border-white/20 hover:bg-white/80'
              }`}
              style={{
                borderRadius: borders.radius.xl,
                padding: spacing[5],
                boxShadow: isDark ? shadows.lg : shadows.base,
                transition: `all ${animations.duration.moderate}ms ${animations.easing.smooth}`,
              }}
            >
              <div className="flex flex-col" style={{ gap: spacing[3] }}>
                {/* Glowing icon */}
                <motion.div 
                  className={`flex items-center justify-center ${
                    isDark ? 'bg-white/20 shadow-lg shadow-white/5' : 'bg-white/80 shadow-lg shadow-black/5'
                  }`}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: borders.radius.lg,
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: shadows.xl,
                    transition: animations.spring.snappy
                  }}
                >
                  <StatIcon 
                    iconName={stat.icon} 
                    className="w-5 h-5" 
                    color={stat.color || primaryColor}
                  />
                </motion.div>
                
                {/* Content */}
                <div>
                  <div 
                    className="tracking-tight"
                    style={{ 
                      fontFamily: titleFontFamily, 
                      color: titleColor,
                      fontSize: typography.h1.fontSize,
                      fontWeight: typography.h1.fontWeight,
                      lineHeight: typography.h1.lineHeight,
                    }}
                  >
                    {stat.prefix}{stat.value}{stat.suffix}
                  </div>
                  <p 
                    style={{ 
                      fontFamily: bodyFontFamily, 
                      color: bodyColor,
                      fontSize: typography.bodySmall.fontSize,
                      marginTop: spacing[1],
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Gradient Style - Vibrant colorful cards
  if (style === 'gradient') {
    const gradients = isDark ? [
      'from-violet-500/20 to-purple-500/10',
      'from-blue-500/20 to-cyan-500/10',
      'from-emerald-500/20 to-teal-500/10',
      'from-amber-500/20 to-orange-500/10',
    ] : [
      'from-violet-500/10 to-purple-500/5',
      'from-blue-500/10 to-cyan-500/5',
      'from-emerald-500/10 to-teal-500/5',
      'from-amber-500/10 to-orange-500/5',
    ];

    return (
      <div className="w-full" style={{ paddingTop: spacing[8], paddingBottom: spacing[8] }}>
        <div className={layoutClasses[layout]}>
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={animations.fadeIn.initial}
              animate={animations.fadeIn.animate}
              transition={{ ...animations.spring.gentle, delay: idx * 0.05 }}
              whileHover={{ 
                y: -6,
                scale: 1.02,
                transition: animations.spring.bouncy
              }}
              className={`group relative overflow-hidden bg-gradient-to-br ${gradients[idx % gradients.length]} border ${isDark ? 'border-white/20' : 'border-white/50'}`}
              style={{
                borderRadius: borders.radius.xl,
                padding: spacing[5],
                boxShadow: shadows.base,
                transition: `all ${animations.duration.moderate}ms ${animations.easing.smooth}`,
              }}
            >
              <div className="flex flex-col" style={{ gap: spacing[3] }}>
                {/* Icon */}
                <motion.div 
                  className={`backdrop-blur flex items-center justify-center shadow-sm ${
                    isDark ? 'bg-white/20' : 'bg-white/80'
                  }`}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: borders.radius.lg,
                  }}
                  whileHover={{ scale: 1.1, transition: animations.spring.snappy }}
                >
                  <StatIcon 
                    iconName={stat.icon} 
                    className="w-5 h-5" 
                    color={stat.color || primaryColor}
                  />
                </motion.div>
                
                {/* Content */}
                <div>
                  <div 
                    className="tracking-tight"
                    style={{ 
                      fontFamily: titleFontFamily, 
                      color: titleColor,
                      fontSize: typography.h1.fontSize,
                      fontWeight: typography.h1.fontWeight,
                      lineHeight: typography.h1.lineHeight,
                    }}
                  >
                    {stat.prefix}{stat.value}{stat.suffix}
                  </div>
                  <p 
                    style={{ 
                      fontFamily: bodyFontFamily, 
                      color: bodyColor,
                      fontSize: typography.bodySmall.fontSize,
                      marginTop: spacing[1],
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Modern Style - Clean with accent border
  if (style === 'modern') {
    return (
      <div className="w-full" style={{ paddingTop: spacing[8], paddingBottom: spacing[8] }}>
        <div className={layoutClasses[layout]}>
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={animations.fadeIn.initial}
              animate={animations.fadeIn.animate}
              transition={{ ...animations.spring.gentle, delay: idx * 0.05 }}
              whileHover={{ 
                scale: 1.02,
                transition: animations.spring.snappy
              }}
              className={`group relative overflow-hidden border-2 ${
                isDark 
                  ? 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10' 
                  : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300 hover:bg-white'
              }`}
              style={{
                borderRadius: borders.radius.xl,
                padding: spacing[5],
                transition: `all ${animations.duration.base}ms ${animations.easing.smooth}`,
              }}
            >
              {/* Accent bar */}
              <motion.div 
                className="absolute top-0 left-0 h-full"
                style={{ 
                  backgroundColor: stat.color || primaryColor,
                  width: '4px',
                }}
                whileHover={{ width: '8px' }}
                transition={animations.spring.snappy}
              />
              
              <div className="flex flex-col" style={{ gap: spacing[3], paddingLeft: spacing[3] }}>
                {/* Icon */}
                <div 
                  className="flex items-center justify-center"
                  style={{ 
                    width: '40px',
                    height: '40px',
                    borderRadius: borders.radius.md,
                    backgroundColor: `${stat.color || primaryColor}15`,
                  }}
                >
                  <StatIcon 
                    iconName={stat.icon} 
                    className="w-5 h-5" 
                    color={stat.color || primaryColor}
                  />
                </div>
                
                {/* Content */}
                <div>
                  <div 
                    className="tracking-tight"
                    style={{ 
                      fontFamily: titleFontFamily, 
                      color: titleColor,
                      fontSize: typography.h1.fontSize,
                      fontWeight: typography.h1.fontWeight,
                      lineHeight: typography.h1.lineHeight,
                    }}
                  >
                    {stat.prefix}{stat.value}{stat.suffix}
                  </div>
                  <p 
                    className="font-medium"
                    style={{ 
                      fontFamily: bodyFontFamily, 
                      color: bodyColor,
                      fontSize: typography.bodySmall.fontSize,
                      marginTop: spacing[1],
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Bold Style - Large numbers with colored backgrounds
  if (style === 'bold') {
    return (
      <div className="w-full" style={{ paddingTop: spacing[8], paddingBottom: spacing[8] }}>
        <div className={layoutClasses[layout]}>
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={animations.fadeIn.initial}
              animate={animations.fadeIn.animate}
              transition={{ ...animations.spring.gentle, delay: idx * 0.05 }}
              whileHover={{ 
                y: -8,
                scale: 1.02,
                transition: animations.spring.bouncy
              }}
              className={`group relative overflow-hidden ${
                isDark 
                  ? 'bg-gradient-to-br from-white/15 to-white/5 hover:from-white/20 hover:to-white/10' 
                  : 'bg-gradient-to-br from-zinc-100 to-white hover:from-zinc-200 hover:to-zinc-50'
              }`}
              style={{
                borderRadius: borders.radius.xl,
                padding: spacing[6],
                transition: `all ${animations.duration.moderate}ms ${animations.easing.smooth}`,
              }}
            >
              <div className="flex flex-col" style={{ gap: spacing[2] }}>
                {/* Icon */}
                <motion.div 
                  className="flex items-center justify-center"
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: borders.radius.xl,
                    backgroundColor: stat.color || primaryColor,
                    marginBottom: spacing[2],
                  }}
                  whileHover={{ scale: 1.1, transition: animations.spring.snappy }}
                >
                  <StatIcon 
                    iconName={stat.icon} 
                    className="w-7 h-7" 
                    color="#ffffff"
                  />
                </motion.div>
                
                {/* Content */}
                <div>
                  <div 
                    className="tracking-tight"
                    style={{ 
                      fontFamily: titleFontFamily, 
                      color: titleColor,
                      fontSize: typography.display.fontSize,
                      fontWeight: typography.display.fontWeight,
                      lineHeight: typography.display.lineHeight,
                    }}
                  >
                    {stat.prefix}{stat.value}{stat.suffix}
                  </div>
                  <p 
                    className="font-semibold"
                    style={{ 
                      fontFamily: bodyFontFamily, 
                      color: bodyColor,
                      fontSize: typography.body.fontSize,
                      marginTop: spacing[1],
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="w-full py-8">
      <div className={layoutClasses[layout]}>
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl border transition-all duration-300 ${
              isDark 
                ? 'bg-white/10 backdrop-blur-sm border-white/20 hover:border-white/30 hover:shadow-lg' 
                : 'bg-white border-zinc-100 hover:border-zinc-200 hover:shadow-lg'
            }`}
          >
            <div className="flex flex-col gap-3">
              <StatIcon 
                iconName={stat.icon} 
                className="w-6 h-6" 
                color={stat.color || primaryColor}
              />
              <div>
                <div 
                  className="text-2xl font-bold"
                  style={{ fontFamily: titleFontFamily, color: titleColor }}
                >
                  {stat.prefix}{stat.value}{stat.suffix}
                </div>
                <p 
                  className="text-sm mt-0.5"
                  style={{ fontFamily: bodyFontFamily, color: bodyColor }}
                >
                  {stat.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}