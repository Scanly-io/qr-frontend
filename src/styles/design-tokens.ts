/**
 * Apple-Inspired Design System Tokens
 * 
 * Premium design tokens for QR microsite builder
 * Target: Small businesses with physical touchpoints
 * Inspiration: Apple Human Interface Guidelines
 */

// ========================================
// TYPOGRAPHY
// ========================================

export const typography = {
  // Font Families
  fonts: {
    display: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Inter", system-ui, sans-serif',
    text: '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Inter", system-ui, sans-serif',
    mono: '"SF Mono", ui-monospace, "Fira Code", "Cascadia Code", Consolas, monospace',
  },

  // Font Sizes (Apple iOS/macOS scale)
  sizes: {
    '11': '0.6875rem',   // 11px - Caption 2
    '12': '0.75rem',      // 12px - Caption 1
    '13': '0.8125rem',    // 13px - Footnote
    '15': '0.9375rem',    // 15px - Subheadline
    '17': '1.0625rem',    // 17px - Body (Apple's default iOS)
    '20': '1.25rem',      // 20px - Title 3
    '22': '1.375rem',     // 22px - Title 2
    '28': '1.75rem',      // 28px - Title 1
    '34': '2.125rem',     // 34px - Large Title
    '48': '3rem',         // 48px - Display
  },

  // Font Weights
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Line Heights (Apple's relaxed spacing)
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-0.02em',
    tight: '-0.01em',
    normal: '0',
    wide: '0.01em',
    wider: '0.02em',
  },
} as const;

// ========================================
// COLORS
// ========================================

export const colors = {
  // Apple System Colors
  apple: {
    blue: '#0071E3',        // Apple primary blue
    darkBlue: '#0051A3',    // Hover state
    lightBlue: '#2997FF',   // iOS accent
    
    gray: {
      50: '#FAFAFA',
      100: '#F5F5F7',       // Apple light gray background
      200: '#E8E8ED',
      300: '#D2D2D7',
      400: '#AEAEB2',
      500: '#86868B',
      600: '#6E6E73',       // Apple text gray
      700: '#515154',
      800: '#3A3A3C',
      900: '#1D1D1F',       // Apple dark text
    },

    green: '#34C759',       // Success
    orange: '#FF9500',      // Warning
    red: '#FF3B30',         // Error
    purple: '#AF52DE',      // Premium accent
  },

  // Social Media Brand Colors
  social: {
    instagram: '#E4405F',
    twitter: '#1DA1F2',
    facebook: '#1877F2',
    linkedin: '#0A66C2',
    youtube: '#FF0000',
    tiktok: '#000000',
    whatsapp: '#25D366',
    telegram: '#0088CC',
    spotify: '#1DB954',
    pinterest: '#E60023',
    snapchat: '#FFFC00',
  },

  // Semantic Colors
  semantic: {
    background: {
      primary: '#FFFFFF',
      secondary: '#F5F5F7',
      tertiary: '#FAFAFA',
      elevated: '#FFFFFF',
    },
    text: {
      primary: '#1D1D1F',
      secondary: '#6E6E73',
      tertiary: '#86868B',
      inverse: '#FFFFFF',
    },
    border: {
      light: '#E8E8ED',
      medium: '#D2D2D7',
      dark: '#AEAEB2',
    },
    interactive: {
      default: '#0071E3',
      hover: '#0051A3',
      active: '#003D7A',
      disabled: '#D2D2D7',
    },
  },
} as const;

// ========================================
// SPACING
// ========================================

export const spacing = {
  // Base unit: 4px (Apple's 4pt grid)
  0: '0',
  1: '0.25rem',    // 4px
  2: '0.5rem',     // 8px
  3: '0.75rem',    // 12px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  8: '2rem',       // 32px
  10: '2.5rem',    // 40px
  12: '3rem',      // 48px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  32: '8rem',      // 128px
} as const;

// ========================================
// BORDER RADIUS
// ========================================

export const radius = {
  none: '0',
  sm: '0.375rem',    // 6px - Small elements
  md: '0.5rem',      // 8px - Buttons, inputs
  lg: '0.75rem',     // 12px - Cards
  xl: '1rem',        // 16px - Large cards
  '2xl': '1.25rem',  // 20px - Modal corners (Apple style)
  '3xl': '1.5rem',   // 24px - Very large cards
  full: '9999px',    // Pill buttons
} as const;

// ========================================
// SHADOWS
// ========================================

export const shadows = {
  // Apple-style subtle shadows (never harsh black)
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.03)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
  
  // Colored shadows for interactive elements
  blue: '0 4px 12px 0 rgba(0, 113, 227, 0.2)',
  green: '0 4px 12px 0 rgba(52, 199, 89, 0.2)',
  red: '0 4px 12px 0 rgba(255, 59, 48, 0.2)',
  
  // Inner shadow for inputs
  inner: 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  
  // No shadow
  none: 'none',
} as const;

// ========================================
// TRANSITIONS
// ========================================

export const transitions = {
  // Durations
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },

  // Timing Functions (Apple's preferred easing)
  easing: {
    // Default smooth ease
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    
    // Ease in
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    
    // Ease out (Apple's favorite for UI interactions)
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    
    // Ease in-out
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    
    // Spring-like (for interactive elements)
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    
    // Sharp (for instant feedback)
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },

  // Predefined transition strings
  all: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  colors: 'background-color 200ms cubic-bezier(0.4, 0, 0.2, 1), border-color 200ms cubic-bezier(0.4, 0, 0.2, 1), color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  transform: 'transform 200ms cubic-bezier(0, 0, 0.2, 1)',
  opacity: 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// ========================================
// Z-INDEX LAYERS
// ========================================

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  notification: 1080,
} as const;

// ========================================
// BREAKPOINTS
// ========================================

export const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px', // Extra large
} as const;

// ========================================
// COMPONENT-SPECIFIC TOKENS
// ========================================

export const components = {
  // Button styles
  button: {
    height: {
      sm: '2rem',      // 32px
      md: '2.5rem',    // 40px
      lg: '3rem',      // 48px
    },
    padding: {
      sm: '0 0.75rem',
      md: '0 1rem',
      lg: '0 1.5rem',
    },
  },

  // Input styles
  input: {
    height: {
      sm: '2rem',      // 32px
      md: '2.5rem',    // 40px
      lg: '3rem',      // 48px
    },
    padding: {
      sm: '0 0.75rem',
      md: '0 1rem',
      lg: '0 1.25rem',
    },
  },

  // Card styles
  card: {
    padding: {
      sm: '1rem',      // 16px
      md: '1.5rem',    // 24px
      lg: '2rem',      // 32px
    },
  },

  // Device Frame (for preview)
  deviceFrame: {
    iphone: {
      width: '390px',
      height: '844px',
      radius: '3rem',
    },
    ipad: {
      width: '768px',
      height: '1024px',
      radius: '1.5rem',
    },
  },
} as const;

// ========================================
// ANIMATION PRESETS
// ========================================

export const animations = {
  // Fade animations
  fadeIn: {
    animation: 'fadeIn 300ms cubic-bezier(0, 0, 0.2, 1)',
    '@keyframes fadeIn': {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
  },

  // Slide animations
  slideUp: {
    animation: 'slideUp 300ms cubic-bezier(0, 0, 0.2, 1)',
    '@keyframes slideUp': {
      from: { transform: 'translateY(10px)', opacity: 0 },
      to: { transform: 'translateY(0)', opacity: 1 },
    },
  },

  // Scale animations
  scaleIn: {
    animation: 'scaleIn 200ms cubic-bezier(0, 0, 0.2, 1)',
    '@keyframes scaleIn': {
      from: { transform: 'scale(0.95)', opacity: 0 },
      to: { transform: 'scale(1)', opacity: 1 },
    },
  },

  // Bounce (for success states)
  bounce: {
    animation: 'bounce 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    '@keyframes bounce': {
      '0%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.05)' },
      '100%': { transform: 'scale(1)' },
    },
  },
} as const;

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Get responsive spacing value
 * @param mobile - Mobile spacing
 * @param desktop - Desktop spacing
 */
export const responsiveSpacing = (mobile: keyof typeof spacing, desktop: keyof typeof spacing) => ({
  mobile: spacing[mobile],
  desktop: spacing[desktop],
});

/**
 * Create box shadow with custom color
 * @param color - Shadow color
 * @param opacity - Shadow opacity (0-1)
 */
export const createShadow = (color: string, opacity: number = 0.1) => 
  `0 4px 12px 0 ${color}${Math.round(opacity * 255).toString(16)}`;

/**
 * Create transition string
 * @param properties - CSS properties to transition
 * @param duration - Duration in ms
 */
export const createTransition = (properties: string[], duration: keyof typeof transitions.duration = 'normal') =>
  properties.map(prop => `${prop} ${transitions.duration[duration]} ${transitions.easing.default}`).join(', ');

// ========================================
// EXPORT DEFAULT
// ========================================

export default {
  typography,
  colors,
  spacing,
  radius,
  shadows,
  transitions,
  zIndex,
  breakpoints,
  components,
  animations,
} as const;
