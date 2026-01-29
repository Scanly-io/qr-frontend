// Design System - Comprehensive UI foundation
// Provides consistent spacing, typography, shadows, animations, and colors

// ===== SPACING SCALE =====
// 4px base unit for consistent rhythm
export const spacing = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
} as const;

// ===== TYPOGRAPHY SCALE =====
export const typography = {
  display: {
    fontSize: '2.25rem',    // 36px
    lineHeight: '2.5rem',   // 40px
    fontWeight: '800',
    letterSpacing: '-0.02em',
  },
  h1: {
    fontSize: '1.875rem',   // 30px
    lineHeight: '2.25rem',  // 36px
    fontWeight: '700',
    letterSpacing: '-0.01em',
  },
  h2: {
    fontSize: '1.5rem',     // 24px
    lineHeight: '2rem',     // 32px
    fontWeight: '700',
    letterSpacing: '-0.01em',
  },
  h3: {
    fontSize: '1.25rem',    // 20px
    lineHeight: '1.75rem',  // 28px
    fontWeight: '600',
    letterSpacing: '0',
  },
  h4: {
    fontSize: '1.125rem',   // 18px
    lineHeight: '1.5rem',   // 24px
    fontWeight: '600',
    letterSpacing: '0',
  },
  body: {
    fontSize: '1rem',       // 16px
    lineHeight: '1.5rem',   // 24px
    fontWeight: '400',
    letterSpacing: '0',
  },
  bodySmall: {
    fontSize: '0.875rem',   // 14px
    lineHeight: '1.25rem',  // 20px
    fontWeight: '400',
    letterSpacing: '0',
  },
  caption: {
    fontSize: '0.75rem',    // 12px
    lineHeight: '1rem',     // 16px
    fontWeight: '500',
    letterSpacing: '0.01em',
  },
  overline: {
    fontSize: '0.625rem',   // 10px
    lineHeight: '1rem',     // 16px
    fontWeight: '600',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
} as const;

// ===== SHADOW SYSTEM =====
// Elevation-based shadows for depth hierarchy
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  
  // Colored shadows for primary elements
  colored: (color: string, opacity = 0.2) => `0 8px 16px -4px ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
  coloredHover: (color: string, opacity = 0.3) => `0 12px 24px -6px ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
} as const;

// ===== BORDER SYSTEM =====
export const borders = {
  width: {
    none: '0',
    thin: '1px',
    base: '1.5px',
    thick: '2px',
    heavy: '3px',
  },
  radius: {
    none: '0',
    sm: '0.375rem',   // 6px
    base: '0.5rem',   // 8px
    md: '0.75rem',    // 12px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    '2xl': '2rem',    // 32px
    full: '9999px',
  },
  // Enhanced opacity for better visibility
  opacity: {
    light: 'rgba(0, 0, 0, 0.08)',
    base: 'rgba(0, 0, 0, 0.12)',
    strong: 'rgba(0, 0, 0, 0.18)',
    lightDark: 'rgba(255, 255, 255, 0.12)',
    baseDark: 'rgba(255, 255, 255, 0.18)',
    strongDark: 'rgba(255, 255, 255, 0.24)',
  },
} as const;

// ===== ANIMATION SYSTEM =====
export const animations = {
  // Duration scale
  duration: {
    instant: 0,
    fast: 150,
    base: 200,
    moderate: 300,
    slow: 400,
    slower: 600,
  },
  
  // Spring physics for natural motion
  spring: {
    gentle: {
      type: 'spring' as const,
      stiffness: 200,
      damping: 20,
    },
    bouncy: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 15,
    },
    snappy: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 25,
    },
  },
  
  // Easing curves
  easing: {
    easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
    easeIn: 'cubic-bezier(0.7, 0, 0.84, 0)',
    easeInOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // Hover effects
  hover: {
    lift: { y: -4, transition: { duration: 0.2 } },
    liftMore: { y: -8, transition: { duration: 0.2 } },
    scale: { scale: 1.02, transition: { duration: 0.2 } },
    scaleSmall: { scale: 1.05, transition: { duration: 0.2 } },
    scaleLarge: { scale: 1.1, transition: { duration: 0.2 } },
  },
  
  // Tap effects
  tap: {
    shrink: { scale: 0.95 },
    shrinkMore: { scale: 0.9 },
  },
  
  // Entrance animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
  
  // Slide variants
  slideLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  
  slideRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  
  // Micro-interactions
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },
  
  bounce: {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },
  
  shake: {
    animate: {
      x: [0, -10, 10, -10, 10, 0],
      transition: {
        duration: 0.5,
      },
    },
  },
  
  spin: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  },
  
  // Page transitions
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        duration: 0.3,
        ease: 'easeIn',
      },
    },
  },
} as const;

// ===== COLOR SYSTEM =====
export const colors = {
  // Semantic colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // Gray scale (enhanced)
  gray: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
    950: '#09090b',
  },
  
  // Background overlays
  overlay: {
    light: 'rgba(255, 255, 255, 0.95)',
    base: 'rgba(255, 255, 255, 0.85)',
    dark: 'rgba(0, 0, 0, 0.6)',
    darker: 'rgba(0, 0, 0, 0.8)',
  },
  
  // Gradients
  gradients: {
    shimmer: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
    fadeDown: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))',
    fadeUp: 'linear-gradient(to top, transparent, rgba(0,0,0,0.8))',
    radial: 'radial-gradient(circle at center, rgba(255,255,255,0.1), transparent)',
  },
} as const;

// ===== UTILITY FUNCTIONS =====

// Get shadow with primary color
export const getPrimaryShadow = (color: string, intensity: 'normal' | 'hover' = 'normal') => {
  return intensity === 'hover' 
    ? shadows.coloredHover(color, 0.25)
    : shadows.colored(color, 0.15);
};

// Get card styles based on theme
export const getCardStyles = (isDark: boolean, isPrimary = false, primaryColor?: string) => {
  const base = {
    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#ffffff',
    border: `${borders.width.base} solid ${isDark ? borders.opacity.baseDark : borders.opacity.base}`,
    borderRadius: borders.radius.xl,
    boxShadow: shadows.md,
  };
  
  if (isPrimary && primaryColor) {
    return {
      ...base,
      border: `${borders.width.thick} solid ${primaryColor}30`,
      boxShadow: getPrimaryShadow(primaryColor),
    };
  }
  
  return base;
};

// Get text color based on theme
export const getTextColor = (isDark: boolean, variant: 'title' | 'body' | 'muted' = 'body') => {
  if (variant === 'title') {
    return isDark ? '#ffffff' : colors.gray[950];
  }
  if (variant === 'body') {
    return isDark ? colors.gray[300] : colors.gray[600];
  }
  return isDark ? colors.gray[400] : colors.gray[500];
};

// Stagger children animation
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

// Stagger item animation
export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
};

export default {
  spacing,
  typography,
  shadows,
  borders,
  animations,
  colors,
  getPrimaryShadow,
  getCardStyles,
  getTextColor,
  staggerContainer,
  staggerItem,
};
