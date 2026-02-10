import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Block } from '@/types';
import type { PageTheme } from '@/types/theme';
import { FONT_FAMILY_MAP } from '@/lib/fonts';
import { Clock, Calendar, Timer, Sparkles, PartyPopper, Flame, Zap } from 'lucide-react';

interface CountdownBlockProps {
  block: Block;
  theme?: PageTheme;
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

// Pre-computed confetti particles
const CONFETTI_PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: (i * 17) % 100,
  delay: (i * 0.1) % 2,
  duration: 2 + (i % 3),
  color: ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'][i % 6],
}));

export default function CountdownBlock({ block, theme }: CountdownBlockProps) {
  const calculateTimeLeft = () => {
    const targetDate = new Date(block.content.targetDate as string);
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true, total: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false,
      total: difference,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [prevTimeLeft, setPrevTimeLeft] = useState(timeLeft);
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = calculateTimeLeft();
      setPrevTimeLeft(timeLeft);
      setTimeLeft(newTime);
      // Urgent mode when less than 1 hour
      setIsUrgent(newTime.total > 0 && newTime.total < 60 * 60 * 1000);
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [block.content.targetDate, timeLeft]);

  // Content options
  const title = (block.content.title as string) || '';
  const subtitle = (block.content.subtitle as string) || '';
  const expiredMessage = (block.content.expiredMessage as string) || '🎉 The wait is over!';
  const showDays = (block.content.showDays as boolean) ?? true;
  const showHours = (block.content.showHours as boolean) ?? true;
  const showMinutes = (block.content.showMinutes as boolean) ?? true;
  const showSeconds = (block.content.showSeconds as boolean) ?? true;
  const style = (block.content.style as 'elegant' | 'minimal' | 'glass' | 'gradient' | 'flip' | 'circular' | 'neon') || 'elegant';
  const showLabels = (block.content.showLabels as boolean) ?? true;
  const compactMode = (block.content.compactMode as boolean) ?? false;

  // Theme integration
  const primaryColor = theme?.branding?.primaryColor || theme?.button?.backgroundColor || '#6366f1';
  const titleFont = theme?.typography?.titleFont || 'inter';
  const bodyFont = theme?.typography?.bodyFont || 'inter';
  const titleFontFamily = FONT_FAMILY_MAP[titleFont] || "'Inter', sans-serif";
  const bodyFontFamily = FONT_FAMILY_MAP[bodyFont] || "'Inter', sans-serif";
  
  const isDark = isDarkBackground(theme);
  const titleColor = theme?.typography?.titleColor || (isDark ? '#ffffff' : '#18181b');
  const bodyColor = theme?.typography?.bodyColor || (isDark ? '#a1a1aa' : '#71717a');

  // Build units array
  const units = useMemo(() => [
    { value: timeLeft.days, prevValue: prevTimeLeft.days, label: 'Days', shortLabel: 'D', icon: Calendar, show: showDays },
    { value: timeLeft.hours, prevValue: prevTimeLeft.hours, label: 'Hours', shortLabel: 'H', icon: Clock, show: showHours },
    { value: timeLeft.minutes, prevValue: prevTimeLeft.minutes, label: 'Min', shortLabel: 'M', icon: Timer, show: showMinutes },
    { value: timeLeft.seconds, prevValue: prevTimeLeft.seconds, label: 'Sec', shortLabel: 'S', icon: Zap, show: showSeconds },
  ].filter((unit) => unit.show), [timeLeft, prevTimeLeft, showDays, showHours, showMinutes, showSeconds]);

  // Title section component
  const TitleSection = () => (
    <>
      {title && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 mb-2">
            {isUrgent && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <Flame className="w-5 h-5 text-orange-500" />
              </motion.div>
            )}
            <h3 
              className="text-xl font-bold"
              style={{ fontFamily: titleFontFamily, color: titleColor }}
            >
              {title}
            </h3>
            {isUrgent && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0.25 }}
              >
                <Flame className="w-5 h-5 text-orange-500" />
              </motion.div>
            )}
          </div>
          {subtitle && (
            <p 
              className="text-sm"
              style={{ fontFamily: bodyFontFamily, color: bodyColor }}
            >
              {subtitle}
            </p>
          )}
        </motion.div>
      )}
    </>
  );

  // ===== EXPIRED STATE with confetti =====
  if (timeLeft.expired) {
    return (
      <div className="w-full py-8 relative overflow-hidden">
        {/* Confetti */}
        <div className="absolute inset-0 pointer-events-none">
          {CONFETTI_PARTICLES.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-2 h-2 rounded-sm"
              style={{
                left: `${particle.x}%`,
                backgroundColor: particle.color,
              }}
              initial={{ y: -20, opacity: 0, rotate: 0 }}
              animate={{
                y: ['0%', '100%'],
                opacity: [0, 1, 1, 0],
                rotate: [0, 360],
                x: [0, (particle.id % 2 === 0 ? 20 : -20)],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className={`relative p-8 rounded-3xl text-center ${
            isDark 
              ? 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-400/30' 
              : 'bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200'
          }`}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <PartyPopper className="w-12 h-12 text-emerald-500" />
          </motion.div>
          <p 
            className="text-2xl font-bold"
            style={{ fontFamily: titleFontFamily, color: titleColor }}
          >
            {expiredMessage}
          </p>
          <motion.div
            className="flex justify-center gap-1 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 text-yellow-500" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // ===== ELEGANT STYLE - Premium flip cards =====
  if (style === 'elegant') {
    return (
      <div className="w-full py-6 sm:py-8">
        <TitleSection />
        <div className={`flex flex-wrap justify-center ${compactMode ? 'gap-2' : 'gap-3 sm:gap-4'}`}>
          {units.map((unit, idx) => {
            const hasChanged = unit.value !== unit.prevValue;
            return (
              <motion.div
                key={unit.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  className={`relative ${compactMode ? 'w-16 h-20' : 'w-20 h-24 sm:w-24 sm:h-28'} rounded-2xl overflow-hidden ${
                    isDark 
                      ? 'bg-gradient-to-b from-white/15 to-white/5 border border-white/20 shadow-2xl shadow-black/40' 
                      : 'bg-gradient-to-b from-white to-stone-50 border-2 border-stone-200 shadow-2xl shadow-stone-300/60'
                  } ${isUrgent && unit.label === 'Sec' ? 'ring-2 ring-orange-500/50' : ''}`}
                  animate={hasChanged ? { scale: [1, 1.03, 1] } : {}}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  {/* Top reflection */}
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                  
                  {/* Center divider line */}
                  <div className={`absolute top-1/2 left-2 right-2 h-[1.5px] rounded-full ${isDark ? 'bg-white/10' : 'bg-stone-300/50'}`} />
                  
                  {/* Number */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={unit.value}
                        initial={hasChanged ? { y: -30, opacity: 0, rotateX: -90 } : false}
                        animate={{ y: 0, opacity: 1, rotateX: 0 }}
                        exit={{ y: 30, opacity: 0, rotateX: 90 }}
                        transition={{ duration: 0.4, type: 'spring', stiffness: 300 }}
                        className={`${compactMode ? 'text-3xl' : 'text-4xl sm:text-5xl'} font-bold tabular-nums`}
                        style={{ 
                          fontFamily: titleFontFamily, 
                          color: isUrgent && unit.label === 'Sec' ? '#f97316' : titleColor,
                          textShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 1px 2px rgba(0,0,0,0.05)',
                        }}
                      >
                        {String(unit.value).padStart(2, '0')}
                      </motion.span>
                    </AnimatePresence>
                  </div>

                  {/* Shimmer on change */}
                  {hasChanged && (
                    <motion.div
                      className="absolute inset-0 -translate-x-full"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
                      }}
                      animate={{ x: '200%' }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </motion.div>
                
                {showLabels && (
                  <span 
                    className={`${compactMode ? 'text-[10px] mt-1.5' : 'text-xs mt-2 sm:mt-3'} uppercase tracking-wider font-semibold`}
                    style={{ fontFamily: bodyFontFamily, color: bodyColor }}
                  >
                    {compactMode ? unit.shortLabel : unit.label}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // ===== MINIMAL STYLE - Clean inline =====
  if (style === 'minimal') {
    return (
      <div className="w-full py-6 sm:py-8">
        <TitleSection />
        <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
          {units.map((unit, idx) => {
            const hasChanged = unit.value !== unit.prevValue;
            return (
              <div key={unit.label} className="flex items-center">
                <motion.div
                  className="flex items-baseline gap-0.5 sm:gap-1"
                  animate={hasChanged ? { scale: [1, 1.06, 1] } : {}}
                  whileHover={{ scale: 1.03 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={unit.value}
                      initial={hasChanged ? { y: -12, opacity: 0 } : false}
                      animate={{ y: 0, opacity: 1 }}
                      className={`${compactMode ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl md:text-6xl'} font-bold tabular-nums`}
                      style={{ 
                        fontFamily: titleFontFamily, 
                        color: titleColor,
                        textShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.08)',
                      }}
                    >
                      {String(unit.value).padStart(2, '0')}
                    </motion.span>
                  </AnimatePresence>
                  {showLabels && (
                    <span 
                      className={`${compactMode ? 'text-xs' : 'text-xs sm:text-sm'} uppercase font-medium`}
                      style={{ fontFamily: bodyFontFamily, color: bodyColor }}
                    >
                      {unit.shortLabel}
                    </span>
                  )}
                </motion.div>
                {idx < units.length - 1 && (
                  <motion.span 
                    className={`${compactMode ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl md:text-5xl'} font-light mx-1.5 sm:mx-2.5`}
                    style={{ color: bodyColor }}
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    :
                  </motion.span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ===== GLASS STYLE - Frosted glass cards =====
  if (style === 'glass') {
    return (
      <div className="w-full py-6 sm:py-8">
        <TitleSection />
        <div className={`flex flex-wrap justify-center ${compactMode ? 'gap-2' : 'gap-3 sm:gap-4'}`}>
          {units.map((unit, idx) => {
            const hasChanged = unit.value !== unit.prevValue;
            const IconComponent = unit.icon;
            return (
              <motion.div
                key={unit.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1, type: 'spring' }}
                whileHover={{ y: -6, scale: 1.05 }}
                className={`relative ${compactMode ? 'p-3 min-w-[70px]' : 'p-4 sm:p-5 min-w-[90px] sm:min-w-[110px]'} rounded-2xl backdrop-blur-xl transition-all duration-300 ${
                  isDark 
                    ? 'bg-white/[0.08] border border-white/20 hover:bg-white/[0.14] hover:shadow-2xl hover:shadow-white/10' 
                    : 'bg-white/70 border border-white/50 hover:bg-white/90 hover:shadow-2xl hover:shadow-stone-300/40'
                }`}
              >
                {/* Icon */}
                <div className="flex justify-center mb-2">
                  <motion.div 
                    className={`${compactMode ? 'w-8 h-8' : 'w-10 h-10 sm:w-12 sm:h-12'} rounded-xl flex items-center justify-center transition-colors`}
                    style={{ backgroundColor: `${primaryColor}20` }}
                    whileHover={{ backgroundColor: `${primaryColor}30` }}
                  >
                    <IconComponent className={`${compactMode ? 'w-4 h-4' : 'w-5 h-5 sm:w-6 sm:h-6'}`} style={{ color: primaryColor }} />
                  </motion.div>
                </div>

                {/* Number */}
                <div className="text-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={unit.value}
                      initial={hasChanged ? { rotateX: -90, opacity: 0 } : false}
                      animate={{ rotateX: 0, opacity: 1 }}
                      transition={{ duration: 0.4, type: 'spring' }}
                      className={`${compactMode ? 'text-2xl' : 'text-3xl sm:text-4xl'} font-bold tabular-nums`}
                      style={{ 
                        fontFamily: titleFontFamily, 
                        color: titleColor,
                        textShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 1px 2px rgba(0,0,0,0.05)',
                      }}
                    >
                      {String(unit.value).padStart(2, '0')}
                    </motion.div>
                  </AnimatePresence>
                  {showLabels && (
                    <p 
                      className={`${compactMode ? 'text-[10px]' : 'text-xs'} uppercase tracking-wider mt-1 font-medium`}
                      style={{ fontFamily: bodyFontFamily, color: bodyColor }}
                    >
                      {unit.label}
                    </p>
                  )}
                </div>

                {/* Bottom glow on change */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl"
                  style={{ backgroundColor: primaryColor }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: hasChanged ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // ===== GRADIENT STYLE - Vibrant gradient cards =====

  // ===== GRADIENT STYLE - Vibrant gradient cards =====
  if (style === 'gradient') {
    const gradientColors = [
      { from: '#8B5CF6', to: '#6366F1' },
      { from: '#3B82F6', to: '#06B6D4' },
      { from: '#10B981', to: '#14B8A6' },
      { from: '#F59E0B', to: '#EF4444' },
    ];

    return (
      <div className="w-full py-6 sm:py-8">
        <TitleSection />
        <div className={`flex flex-wrap justify-center ${compactMode ? 'gap-2' : 'gap-3 sm:gap-4'}`}>
          {units.map((unit, idx) => {
            const hasChanged = unit.value !== unit.prevValue;
            const gradient = gradientColors[idx % gradientColors.length];
            return (
              <motion.div
                key={unit.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={`relative ${compactMode ? 'p-3 min-w-[70px]' : 'p-4 sm:p-5 min-w-[90px] sm:min-w-[110px]'} rounded-2xl overflow-hidden cursor-pointer shadow-lg`}
                style={{
                  background: `linear-gradient(135deg, ${gradient.from}${isDark ? '40' : '20'}, ${gradient.to}${isDark ? '30' : '15'})`,
                  border: `1px solid ${gradient.from}${isDark ? '50' : '30'}`,
                }}
              >
                {/* Animated gradient overlay */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${gradient.from}${isDark ? '60' : '40'}, ${gradient.to}${isDark ? '50' : '30'})`,
                  }}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Number */}
                <div className="relative text-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={unit.value}
                      initial={hasChanged ? { scale: 1.3, opacity: 0 } : false}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3, type: 'spring' }}
                      className={`${compactMode ? 'text-3xl' : 'text-4xl sm:text-5xl'} font-bold tabular-nums`}
                      style={{ fontFamily: titleFontFamily, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
                    >
                      {String(unit.value).padStart(2, '0')}
                    </motion.div>
                  </AnimatePresence>
                  {showLabels && (
                    <p className={`${compactMode ? 'text-[10px]' : 'text-xs'} uppercase tracking-wider mt-1 text-white/90 font-medium`}>
                      {unit.label}
                    </p>
                  )}
                </div>

                {/* Sparkle effect */}
                {hasChanged && (
                  <motion.div
                    className="absolute top-2 right-2"
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{ scale: [0, 1, 0], rotate: 180 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Sparkles className="w-4 h-4 text-white/80" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // ===== CIRCULAR STYLE - Ring progress =====
  if (style === 'circular') {
    const maxValues = { days: 365, hours: 24, minutes: 60, seconds: 60 };
    
    return (
      <div className="w-full py-6 sm:py-8">
        <TitleSection />
        <div className={`flex flex-wrap justify-center ${compactMode ? 'gap-3 sm:gap-4' : 'gap-4 sm:gap-6 md:gap-8'}`}>
          {units.map((unit, idx) => {
            const hasChanged = unit.value !== unit.prevValue;
            const maxVal = maxValues[unit.label.toLowerCase() as keyof typeof maxValues] || 60;
            const progress = (unit.value / maxVal) * 100;
            const circumference = 2 * Math.PI * 40;
            const strokeDashoffset = circumference - (progress / 100) * circumference;
            
            return (
              <motion.div
                key={unit.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1, type: 'spring' }}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center"
              >
                <div className={`relative ${compactMode ? 'w-16 h-16 sm:w-18 sm:h-18' : 'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28'}`}>
                  {/* Background circle */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="40%"
                      fill="none"
                      stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}
                      strokeWidth={compactMode ? '5' : '6'}
                    />
                    {/* Progress circle */}
                    <motion.circle
                      cx="50%"
                      cy="50%"
                      r="40%"
                      fill="none"
                      stroke={primaryColor}
                      strokeWidth={compactMode ? '5' : '6'}
                      strokeLinecap="round"
                      style={{
                        strokeDasharray: circumference,
                        filter: `drop-shadow(0 0 6px ${primaryColor}60)`,
                      }}
                      animate={{ strokeDashoffset }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </svg>
                  
                  {/* Number in center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={unit.value}
                        initial={hasChanged ? { scale: 1.2, opacity: 0 } : false}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`${compactMode ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl md:text-3xl'} font-bold tabular-nums`}
                        style={{ 
                          fontFamily: titleFontFamily, 
                          color: titleColor,
                          textShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 1px 2px rgba(0,0,0,0.05)',
                        }}
                      >
                        {String(unit.value).padStart(2, '0')}
                      </motion.span>
                    </AnimatePresence>
                  </div>

                  {/* Glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{ boxShadow: `0 0 20px ${primaryColor}40` }}
                    animate={{ opacity: hasChanged ? [0, 1, 0] : 0 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                
                {showLabels && (
                  <span 
                    className={`${compactMode ? 'text-[10px] mt-1.5' : 'text-xs mt-2 sm:mt-3'} uppercase tracking-wider font-medium`}
                    style={{ fontFamily: bodyFontFamily, color: bodyColor }}
                  >
                    {unit.label}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // ===== NEON STYLE - Glowing neon effect =====
  if (style === 'neon') {
    return (
      <div className="w-full py-6">
        <TitleSection />
        <div 
          className={`flex justify-center items-center ${compactMode ? 'gap-2 p-4' : 'gap-3 sm:gap-4 p-6'} rounded-2xl`}
          style={{
            background: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.9)',
          }}
        >
          {units.map((unit, idx) => {
            const hasChanged = unit.value !== unit.prevValue;
            return (
              <div key={unit.label} className="flex items-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={unit.value}
                      initial={hasChanged ? { scale: 1.2, opacity: 0 } : false}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`${compactMode ? 'text-3xl' : 'text-4xl sm:text-6xl'} font-bold tabular-nums`}
                      style={{ 
                        fontFamily: titleFontFamily,
                        color: primaryColor,
                        textShadow: `0 0 10px ${primaryColor}, 0 0 20px ${primaryColor}, 0 0 40px ${primaryColor}80, 0 0 60px ${primaryColor}40`,
                      }}
                    >
                      {String(unit.value).padStart(2, '0')}
                    </motion.div>
                  </AnimatePresence>
                  {showLabels && (
                    <p 
                      className={`${compactMode ? 'text-[10px] mt-1' : 'text-xs mt-2'} uppercase tracking-[0.2em]`}
                      style={{ 
                        color: primaryColor,
                        textShadow: `0 0 5px ${primaryColor}`,
                      }}
                    >
                      {unit.label}
                    </p>
                  )}
                </motion.div>
                
                {/* Separator with pulsing colon */}
                {idx < units.length - 1 && (
                  <motion.div
                    className={`${compactMode ? 'text-2xl mx-1' : 'text-4xl sm:text-5xl mx-2'} font-bold`}
                    style={{ 
                      color: primaryColor,
                      textShadow: `0 0 10px ${primaryColor}`,
                    }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    :
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Neon border glow */}
        <motion.div
          className="h-1 rounded-full mt-4 mx-auto"
          style={{ 
            backgroundColor: primaryColor,
            boxShadow: `0 0 10px ${primaryColor}, 0 0 20px ${primaryColor}`,
            width: '60%',
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    );
  }

  // ===== FLIP STYLE - 3D flip animation cards =====
  if (style === 'flip') {
    return (
      <div className="w-full py-6">
        <TitleSection />
        <div className={`flex justify-center ${compactMode ? 'gap-2' : 'gap-3 sm:gap-4'}`}>
          {units.map((unit, idx) => {
            const hasChanged = unit.value !== unit.prevValue;
            return (
              <motion.div
                key={unit.label}
                initial={{ opacity: 0, rotateY: -180 }}
                animate={{ opacity: 1, rotateY: 0 }}
                transition={{ delay: idx * 0.15, type: 'spring', stiffness: 100 }}
                className="flex flex-col items-center"
                style={{ perspective: '1000px' }}
              >
                <div className={`relative ${compactMode ? 'w-16 h-20' : 'w-20 h-24 sm:w-24 sm:h-28'}`}>
                  {/* Flip card container */}
                  <motion.div
                    className="w-full h-full"
                    style={{ 
                      transformStyle: 'preserve-3d',
                      position: 'relative',
                    }}
                    animate={hasChanged ? { rotateX: [0, 90, 0] } : {}}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                  >
                    {/* Card face */}
                    <div
                      className={`absolute inset-0 rounded-2xl flex items-center justify-center ${
                        isDark 
                          ? 'bg-gradient-to-b from-violet-600/30 to-purple-600/20 border border-violet-400/30 shadow-lg shadow-violet-500/20' 
                          : 'bg-gradient-to-b from-violet-100 to-purple-100 border-2 border-violet-300 shadow-xl shadow-violet-200/50'
                      }`}
                      style={{ 
                        backfaceVisibility: 'hidden',
                      }}
                    >
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={unit.value}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className={`${compactMode ? 'text-3xl' : 'text-4xl sm:text-5xl'} font-bold tabular-nums`}
                          style={{ 
                            fontFamily: titleFontFamily,
                            color: isDark ? '#a78bfa' : '#7c3aed',
                            textShadow: isDark ? '0 2px 10px rgba(139, 92, 246, 0.5)' : '0 2px 4px rgba(124, 58, 237, 0.1)',
                          }}
                        >
                          {String(unit.value).padStart(2, '0')}
                        </motion.span>
                      </AnimatePresence>
                    </div>

                    {/* Top/bottom split line effect */}
                    <div className={`absolute top-1/2 left-0 right-0 h-px ${isDark ? 'bg-violet-400/20' : 'bg-violet-400/30'}`} />
                    
                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)',
                      }}
                      animate={{ opacity: hasChanged ? [0, 0.8, 0] : 0 }}
                      transition={{ duration: 0.6 }}
                    />
                  </motion.div>
                </div>
                
                {showLabels && (
                  <span 
                    className={`${compactMode ? 'text-[10px] mt-1' : 'text-xs mt-2'} uppercase tracking-wider font-semibold`}
                    style={{ 
                      fontFamily: bodyFontFamily, 
                      color: isDark ? '#a78bfa' : '#7c3aed',
                    }}
                  >
                    {compactMode ? unit.shortLabel : unit.label}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // ===== DEFAULT FALLBACK =====
  return (
    <div className="w-full py-6 sm:py-8">
      <TitleSection />
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {units.map((unit, idx) => {
          const hasChanged = unit.value !== unit.prevValue;
          return (
            <motion.div 
              key={unit.label} 
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={unit.value}
                  initial={hasChanged ? { y: -10, opacity: 0 } : false}
                  animate={{ y: 0, opacity: 1 }}
                  className={`${compactMode ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl'} font-bold tabular-nums`}
                  style={{ 
                    fontFamily: titleFontFamily, 
                    color: titleColor,
                    textShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 1px 2px rgba(0,0,0,0.05)',
                  }}
                >
                  {String(unit.value).padStart(2, '0')}
                </motion.div>
              </AnimatePresence>
              {showLabels && (
                <p 
                  className={`${compactMode ? 'text-[10px] mt-1' : 'text-xs mt-2'} uppercase tracking-wider font-medium`}
                  style={{ fontFamily: bodyFontFamily, color: bodyColor }}
                >
                  {unit.label}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
