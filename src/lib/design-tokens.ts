/**
 * Design System Tokens
 * Professional design values for consistent UI
 */

// ═══════════════════════════════════════════════════════════
// BRAND GRADIENTS (Never use Tailwind defaults)
// ═══════════════════════════════════════════════════════════

export const brandGradients = {
  // Primary brand gradients
  primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  primarySoft: 'linear-gradient(135deg, #a8c0ff 0%, #c5a3ff 100%)',
  
  // Accent gradients
  sunset: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  ocean: 'linear-gradient(135deg, #2e3192 0%, #1bffff 100%)',
  forest: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
  fire: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
  twilight: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)',
  aurora: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  
  // Social media platform gradients
  instagram: 'linear-gradient(135deg, #f58529 0%, #dd2a7b 50%, #8134af 100%)',
  facebook: 'linear-gradient(135deg, #3b5998 0%, #2d4373 100%)',
  twitter: 'linear-gradient(135deg, #1da1f2 0%, #0c85d0 100%)',
  linkedin: 'linear-gradient(135deg, #0077b5 0%, #00669c 100%)',
  youtube: 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)',
  tiktok: 'linear-gradient(135deg, #000000 0%, #ee1d52 50%, #69c9d0 100%)',
  spotify: 'linear-gradient(135deg, #1db954 0%, #1aa34a 100%)',
  
  // Glassmorphism effects
  glass: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
  glassDark: 'linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 100%)',
  
  // Mesh gradients (modern backgrounds)
  mesh1: 'radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%)',
  mesh2: 'radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%)',
} as const;

// ═══════════════════════════════════════════════════════════
// SHADOW TOKENS (Professional depth system)
// ═══════════════════════════════════════════════════════════

export const shadows = {
  // Soft elevation shadows
  soft: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.08)',
    md: '0 4px 12px rgba(0, 0, 0, 0.08)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.1)',
    xl: '0 12px 32px rgba(0, 0, 0, 0.12)',
    '2xl': '0 20px 48px rgba(0, 0, 0, 0.14)',
  },
  
  // Colored glow shadows
  glow: {
    primary: '0 0 20px rgba(99, 102, 241, 0.4)',
    primaryLg: '0 0 32px rgba(99, 102, 241, 0.5)',
    purple: '0 0 20px rgba(139, 92, 246, 0.4)',
    pink: '0 0 20px rgba(236, 72, 153, 0.4)',
    green: '0 0 20px rgba(16, 185, 129, 0.4)',
    blue: '0 0 20px rgba(59, 130, 246, 0.4)',
  },
  
  // Button shadows (colored)
  button: {
    primary: '0 4px 14px 0 rgba(99, 102, 241, 0.39)',
    primaryHover: '0 6px 20px rgba(99, 102, 241, 0.23)',
    success: '0 4px 14px 0 rgba(16, 185, 129, 0.39)',
    successHover: '0 6px 20px rgba(16, 185, 129, 0.23)',
    danger: '0 4px 14px 0 rgba(239, 68, 68, 0.39)',
    dangerHover: '0 6px 20px rgba(239, 68, 68, 0.23)',
  },
  
  // Layered shadows (Linktree style)
  layered: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24), 0 0 0 1px rgba(0,0,0,0.05)',
  layeredLg: '0 10px 40px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
} as const;

// ═══════════════════════════════════════════════════════════
// SPACING TOKENS (Consistent 4px base system)
// ═══════════════════════════════════════════════════════════

export const spacing = {
  xs: '0.5rem',   // 8px  - Inline elements (icon + text gap)
  sm: '1rem',     // 16px - Form fields, small padding
  md: '1.5rem',   // 24px - Section spacing
  lg: '2rem',     // 32px - Major sections
  xl: '3rem',     // 48px - Hero padding
  '2xl': '4rem',  // 64px - Page sections
  '3xl': '6rem',  // 96px - Major page divisions
} as const;

// ═══════════════════════════════════════════════════════════
// ANIMATION DURATIONS (Consistent timing)
// ═══════════════════════════════════════════════════════════

export const duration = {
  fast: '150ms',
  normal: '250ms',
  slow: '350ms',
  slower: '500ms',
} as const;

// ═══════════════════════════════════════════════════════════
// EASING CURVES (Professional motion)
// ═══════════════════════════════════════════════════════════

export const easing = {
  // Standard easings
  linear: [0, 0, 1, 1],
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  
  // Custom easings
  spring: [0.34, 1.56, 0.64, 1],      // Bouncy spring
  smooth: [0.25, 0.46, 0.45, 0.94],   // Smooth ease
  snappy: [0.5, 0, 0.5, 1],           // Quick snap
} as const;

// ═══════════════════════════════════════════════════════════
// BORDER RADIUS (Consistent rounding)
// ═══════════════════════════════════════════════════════════

export const borderRadius = {
  sm: '0.375rem',  // 6px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',  // Perfect circle
} as const;

// ═══════════════════════════════════════════════════════════
// TYPOGRAPHY SCALE (Harmonious sizing)
// ═══════════════════════════════════════════════════════════

export const fontSize = {
  xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
  sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
  base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
  lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
  xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
  '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
  '5xl': ['3rem', { lineHeight: '1' }],         // 48px
} as const;

// ═══════════════════════════════════════════════════════════
// FONT WEIGHTS (Semantic naming)
// ═══════════════════════════════════════════════════════════

export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

// ═══════════════════════════════════════════════════════════
// Z-INDEX SCALE (Layering system)
// ═══════════════════════════════════════════════════════════

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
} as const;

// ═══════════════════════════════════════════════════════════
// GLASSMORPHISM PRESETS
// ═══════════════════════════════════════════════════════════

export const glassmorphism = {
  light: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
  },
  medium: {
    background: 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  },
  dark: {
    background: 'rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
  },
} as const;

// ═══════════════════════════════════════════════════════════
// SOCIAL PLATFORM COLORS
// ═══════════════════════════════════════════════════════════

export const socialColors = {
  instagram: '#E4405F',
  facebook: '#1877F2',
  twitter: '#1DA1F2',
  linkedin: '#0A66C2',
  youtube: '#FF0000',
  tiktok: '#000000',
  snapchat: '#FFFC00',
  pinterest: '#E60023',
  whatsapp: '#25D366',
  telegram: '#0088CC',
  spotify: '#1DB954',
  appleMusic: '#FA243C',
  github: '#333333',
} as const;

// ═══════════════════════════════════════════════════════════
// EXPORT ALL TOKENS
// ═══════════════════════════════════════════════════════════

export const designTokens = {
  brandGradients,
  shadows,
  spacing,
  duration,
  easing,
  borderRadius,
  fontSize,
  fontWeight,
  zIndex,
  glassmorphism,
  socialColors,
} as const;

export default designTokens;
