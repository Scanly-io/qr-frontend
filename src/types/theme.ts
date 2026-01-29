// Advanced Theme System Types
// Supports backgrounds, typography, buttons, headers, footers

export type BackgroundType = 'solid' | 'gradient' | 'pattern' | 'image' | 'video';
export type PatternType = 'grid' | 'dots' | 'diagonal' | 'waves' | 'morph' | 'organic';
export type GradientDirection = 'to-t' | 'to-b' | 'to-l' | 'to-r' | 'to-br' | 'to-tr' | 'to-bl' | 'to-tl';
export type ButtonSize = 'small' | 'medium' | 'large';
export type FontFamily = 
  // Google Fonts - Modern
  | 'inter' 
  | 'poppins' 
  | 'playfair' 
  | 'montserrat' 
  | 'lora' 
  | 'raleway' 
  | 'opensans'
  | 'roboto'
  | 'nunito'
  | 'merriweather'
  | 'sourcecodepro'
  | 'ubuntu'
  | 'outfit'
  | 'workSans'
  | 'dmSans'
  | 'spacegrotesk'
  | 'manrope'
  | 'plusjakarta'
  | 'bevietnampro'
  | 'sora'
  // System Fonts - Classic
  | 'arial'
  | 'helvetica'
  | 'timesnewroman'
  | 'georgia'
  | 'garamond'
  | 'calibri'
  | 'verdana'
  | 'tahoma'
  | 'trebuchet'
  | 'comicsans'
  | 'couriernew';

export interface BackgroundStyle {
  type: BackgroundType;
  
  // Solid color
  color?: string;
  
  // Gradient
  gradientFrom?: string;
  gradientTo?: string;
  gradientVia?: string; // Optional middle color
  gradientDirection?: GradientDirection;
  
  // Pattern
  pattern?: PatternType;
  patternColor?: string;
  patternOpacity?: number; // 0-1
  patternSize?: 'small' | 'medium' | 'large';
  
  // Image
  imageUrl?: string;
  imageOpacity?: number; // 0-1
  imagePosition?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  imageFit?: 'cover' | 'contain' | 'fill';
  
  // Video
  videoUrl?: string;
  videoOpacity?: number; // 0-1
  videoLoop?: boolean;
  videoMuted?: boolean;
}

export interface TypographyStyle {
  // Title (Profile name, headings)
  titleFont?: FontFamily;
  titleColor?: string;
  titleSize?: 'small' | 'medium' | 'large' | 'xl' | '2xl';
  titleWeight?: '400' | '500' | '600' | '700' | '800';
  titleAlign?: 'left' | 'center' | 'right';
  
  // Body text (Bio, descriptions)
  bodyFont?: FontFamily;
  bodyColor?: string;
  bodySize?: 'xs' | 'small' | 'medium' | 'large';
  bodyWeight?: '400' | '500' | '600';
  bodyAlign?: 'left' | 'center' | 'right';
  
  // Link/Button text
  linkColor?: string;
  linkHoverColor?: string;
}

export interface ButtonStyle {
  size?: ButtonSize;
  style?: 'solid' | 'outline' | 'soft' | 'shadow';
  variant?: 'fill' | 'outline' | 'soft' | 'shadow'; // Deprecated, use style
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  borderWidth?: '0' | '1' | '2' | '3';
  borderColor?: string;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hoverEffect?: 'none' | 'lift' | 'grow' | 'glow' | 'pulse' | 'scale';
}

export interface HeaderTheme {
  style?: 'minimal' | 'classic' | 'modern' | 'bold' | 'gradient' | 'centered';
  backgroundColor?: string;
  textColor?: string;
  showAvatar?: boolean;
  showName?: boolean;
  showBio?: boolean;
  avatarSize?: 'small' | 'medium' | 'large' | 'xl' | '2xl';
  avatarShape?: 'circle' | 'square' | 'rounded';
  showLocation?: boolean;
  showWebsite?: boolean;
  alignment?: 'left' | 'center' | 'right';
  spacing?: 'compact' | 'normal' | 'relaxed' | 'tight';
}

export interface FooterTheme {
  style?: 'minimal' | 'branded' | 'social' | 'detailed' | 'none';
  backgroundColor?: string;
  textColor?: string;
  showBranding?: boolean; // "Powered by [App Name]"
  showSocialLinks?: boolean;
  customText?: string;
  alignment?: 'left' | 'center' | 'right';
  borderTop?: boolean;
}

export interface BrandingSettings {
  // Logo
  logoUrl?: string;
  logoPosition?: 'header' | 'footer' | 'both' | 'none';
  logoSize?: 'small' | 'medium' | 'large';
  logoLink?: string; // URL when logo is clicked
  logoAlt?: string; // Alt text for accessibility
  
  // Favicon
  faviconUrl?: string;
  
  // Brand colors (for quick access)
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  
  // Company/Site info
  siteName?: string;
  tagline?: string;
  copyrightText?: string;
}

export interface PageTheme {
  id: string;
  name: string;
  category?: 'minimal' | 'vibrant' | 'professional' | 'creative' | 'custom' | 'business' | 'events' | 'ecommerce';
  
  // Branding
  branding?: BrandingSettings;
  
  // Background
  background: BackgroundStyle;
  
  // Typography
  typography: TypographyStyle;
  
  // Buttons (default for all buttons)
  button: ButtonStyle;
  
  // Header
  header: HeaderTheme;
  
  // Footer
  footer: FooterTheme;
  
  // Page layout
  maxWidth?: '560' | '640' | '680' | '720' | '768' | '800' | '1024';
  padding?: 'tight' | 'compact' | 'normal' | 'relaxed';
  spacing?: 'tight' | 'compact' | 'normal' | 'relaxed'; // Space between blocks
}

// Preset themes with proper category mapping
// Categories: 'popular', 'minimal', 'bold', 'gradient', 'dark', 'light', 'colorful'
export const PRESET_THEMES: PageTheme[] = [
  // ===== POPULAR THEMES =====
  {
    id: 'classic-white',
    name: 'Classic White',
    category: 'minimal',
    background: {
      type: 'solid',
      color: '#ffffff',
    },
    typography: {
      titleFont: 'inter',
      titleColor: '#1f2937',
      titleSize: 'large',
      titleWeight: '700',
      titleAlign: 'center',
      bodyFont: 'inter',
      bodyColor: '#6b7280',
      bodySize: 'medium',
      bodyAlign: 'center',
      linkColor: '#6366f1',
    },
    button: {
      size: 'medium',
      variant: 'fill',
      backgroundColor: '#000000',
      textColor: '#ffffff',
      borderRadius: 'full',
      shadow: 'sm',
      hoverEffect: 'lift',
    },
    header: {
      style: 'classic',
      showAvatar: true,
      avatarSize: 'large',
      avatarShape: 'circle',
      showBio: true,
      alignment: 'center',
      spacing: 'normal',
    },
    footer: {
      style: 'minimal',
      alignment: 'center',
      showBranding: true,
      borderTop: true,
    },
    maxWidth: '680',
    padding: 'normal',
    spacing: 'normal',
  },
  
  {
    id: 'ocean-gradient',
    name: 'Ocean Gradient',
    category: 'vibrant',
    background: {
      type: 'gradient',
      gradientFrom: '#667eea',
      gradientVia: '#764ba2',
      gradientTo: '#f093fb',
      gradientDirection: 'to-br',
    },
    typography: {
      titleFont: 'poppins',
      titleColor: '#ffffff',
      titleSize: 'xl',
      titleWeight: '700',
      titleAlign: 'center',
      bodyFont: 'poppins',
      bodyColor: '#f3f4f6',
      bodySize: 'medium',
      bodyAlign: 'center',
      linkColor: '#ffffff',
    },
    button: {
      size: 'large',
      variant: 'soft',
      backgroundColor: '#ffffff',
      textColor: '#667eea',
      borderRadius: 'xl',
      shadow: 'lg',
      hoverEffect: 'grow',
    },
    header: {
      style: 'gradient',
      showAvatar: true,
      avatarSize: 'xl',
      avatarShape: 'circle',
      showBio: true,
      alignment: 'center',
      spacing: 'relaxed',
    },
    footer: {
      style: 'minimal',
      textColor: '#ffffff',
      alignment: 'center',
      showBranding: false,
    },
    maxWidth: '680',
    padding: 'relaxed',
    spacing: 'relaxed',
  },
  
  {
    id: 'grid-pattern',
    name: 'Grid Pattern',
    category: 'professional',
    background: {
      type: 'pattern',
      color: '#f9fafb',
      pattern: 'grid',
      patternColor: '#e5e7eb',
      patternOpacity: 0.5,
      patternSize: 'medium',
    },
    typography: {
      titleFont: 'montserrat',
      titleColor: '#111827',
      titleSize: 'large',
      titleWeight: '700',
      titleAlign: 'left',
      bodyFont: 'inter',
      bodyColor: '#4b5563',
      bodySize: 'medium',
      bodyAlign: 'left',
      linkColor: '#2563eb',
    },
    button: {
      size: 'medium',
      variant: 'outline',
      backgroundColor: 'transparent',
      textColor: '#2563eb',
      borderRadius: 'md',
      borderWidth: '2',
      shadow: 'none',
      hoverEffect: 'glow',
    },
    header: {
      style: 'modern',
      showAvatar: true,
      avatarSize: 'medium',
      avatarShape: 'rounded',
      showBio: true,
      showLocation: true,
      alignment: 'left',
      spacing: 'normal',
    },
    footer: {
      style: 'detailed',
      backgroundColor: '#f9fafb',
      textColor: '#6b7280',
      alignment: 'left',
      showBranding: true,
      showSocialLinks: true,
      borderTop: true,
    },
    maxWidth: '768',
    padding: 'normal',
    spacing: 'normal',
  },
  
  {
    id: 'organic-morph',
    name: 'Organic Morph',
    category: 'creative',
    background: {
      type: 'pattern',
      color: '#fef3c7',
      pattern: 'morph',
      patternColor: '#fbbf24',
      patternOpacity: 0.3,
      patternSize: 'large',
    },
    typography: {
      titleFont: 'playfair',
      titleColor: '#78350f',
      titleSize: '2xl',
      titleWeight: '700',
      titleAlign: 'center',
      bodyFont: 'lora',
      bodyColor: '#92400e',
      bodySize: 'medium',
      bodyAlign: 'center',
      linkColor: '#d97706',
    },
    button: {
      size: 'large',
      variant: 'shadow',
      backgroundColor: '#fbbf24',
      textColor: '#78350f',
      borderRadius: 'full',
      shadow: 'xl',
      hoverEffect: 'pulse',
    },
    header: {
      style: 'bold',
      showAvatar: true,
      avatarSize: 'xl',
      avatarShape: 'rounded',
      showBio: true,
      alignment: 'center',
      spacing: 'relaxed',
    },
    footer: {
      style: 'branded',
      backgroundColor: '#fef3c7',
      textColor: '#92400e',
      alignment: 'center',
      showBranding: true,
      customText: '✨ Handcrafted with love',
    },
    maxWidth: '680',
    padding: 'relaxed',
    spacing: 'relaxed',
  },
  
  {
    id: 'video-background',
    name: 'Video Background',
    category: 'creative',
    background: {
      type: 'video',
      videoUrl: 'https://example.com/background.mp4', // Placeholder
      videoOpacity: 0.3,
      videoLoop: true,
      videoMuted: true,
      color: '#000000', // Fallback
    },
    typography: {
      titleFont: 'poppins',
      titleColor: '#ffffff',
      titleSize: 'xl',
      titleWeight: '800',
      titleAlign: 'center',
      bodyFont: 'inter',
      bodyColor: '#e5e7eb',
      bodySize: 'medium',
      bodyAlign: 'center',
      linkColor: '#ffffff',
    },
    button: {
      size: 'large',
      variant: 'fill',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderRadius: 'lg',
      shadow: 'xl',
      hoverEffect: 'grow',
    },
    header: {
      style: 'bold',
      showAvatar: true,
      avatarSize: 'xl',
      avatarShape: 'circle',
      showBio: true,
      alignment: 'center',
      spacing: 'relaxed',
    },
    footer: {
      style: 'minimal',
      textColor: '#ffffff',
      alignment: 'center',
      showBranding: false,
    },
    maxWidth: '680',
    padding: 'relaxed',
    spacing: 'relaxed',
  },
  
  {
    id: 'waves-pattern',
    name: 'Waves Pattern',
    category: 'vibrant',
    background: {
      type: 'pattern',
      color: '#dbeafe',
      pattern: 'waves',
      patternColor: '#3b82f6',
      patternOpacity: 0.2,
      patternSize: 'large',
    },
    typography: {
      titleFont: 'raleway',
      titleColor: '#1e40af',
      titleSize: 'large',
      titleWeight: '700',
      titleAlign: 'center',
      bodyFont: 'inter',
      bodyColor: '#1e3a8a',
      bodySize: 'medium',
      bodyAlign: 'center',
      linkColor: '#2563eb',
    },
    button: {
      size: 'medium',
      variant: 'fill',
      backgroundColor: '#3b82f6',
      textColor: '#ffffff',
      borderRadius: 'full',
      shadow: 'md',
      hoverEffect: 'lift',
    },
    header: {
      style: 'modern',
      showAvatar: true,
      avatarSize: 'large',
      avatarShape: 'circle',
      showBio: true,
      alignment: 'center',
      spacing: 'normal',
    },
    footer: {
      style: 'social',
      backgroundColor: '#dbeafe',
      textColor: '#1e40af',
      alignment: 'center',
      showSocialLinks: true,
    },
    maxWidth: '680',
    padding: 'normal',
    spacing: 'normal',
  },

  // Apple Premium Theme - Inspired by Apple's design language
  {
    id: 'apple-premium',
    name: 'Apple Premium',
    category: 'professional',
    background: {
      type: 'gradient',
      gradientFrom: '#FFFFFF',
      gradientVia: '#F5F5F7',
      gradientTo: '#F5F5F7',
      gradientDirection: 'to-b',
    },
    typography: {
      titleFont: 'inter', // Closest to SF Pro Display
      titleColor: '#1D1D1F', // Apple's dark text
      titleSize: 'xl',
      titleWeight: '600', // Semibold
      titleAlign: 'center',
      bodyFont: 'inter', // Closest to SF Pro Text
      bodyColor: '#1D1D1F',
      bodySize: 'medium',
      bodyAlign: 'center',
      linkColor: '#0071E3', // Apple blue
    },
    button: {
      size: 'large',
      variant: 'fill',
      backgroundColor: '#0071E3', // Apple blue
      textColor: '#FFFFFF',
      borderRadius: 'full', // Pill shape
      shadow: 'lg',
      hoverEffect: 'lift',
    },
    header: {
      style: 'minimal',
      showAvatar: true,
      avatarSize: 'xl',
      avatarShape: 'circle',
      showBio: true,
      alignment: 'center',
      spacing: 'relaxed', // Generous whitespace
    },
    footer: {
      style: 'minimal',
      backgroundColor: '#F5F5F7',
      textColor: '#6E6E73', // Apple's gray text
      alignment: 'center',
      showBranding: false,
      borderTop: false,
    },
    maxWidth: '680',
    padding: 'relaxed', // More generous padding
    spacing: 'relaxed', // More generous spacing between blocks
  },

  // 🍕 Restaurant Menu Theme - Warm, inviting, food-focused
  {
    id: 'restaurant-menu',
    name: 'Restaurant Menu',
    category: 'business',
    background: {
      type: 'gradient',
      gradientFrom: '#FFF8F0',
      gradientVia: '#FFFAF5',
      gradientTo: '#FFFFFF',
      gradientDirection: 'to-b',
    },
    typography: {
      titleFont: 'playfair',
      titleColor: '#2C1810',
      titleSize: '2xl',
      titleWeight: '700',
      titleAlign: 'center',
      bodyFont: 'inter',
      bodyColor: '#4A3428',
      bodySize: 'medium',
      bodyAlign: 'left',
      linkColor: '#D97706',
    },
    button: {
      style: 'solid',
      backgroundColor: '#D97706',
      textColor: '#FFFFFF',
      borderRadius: 'full',
      borderWidth: '0',
      borderColor: '',
      hoverEffect: 'lift',
      shadow: 'lg',
    },
    header: {
      avatarSize: '2xl',
      avatarShape: 'circle',
      showName: true,
      showBio: true,
      style: 'centered',
      spacing: 'relaxed',
    },
    footer: {
      backgroundColor: '#FFF8F0',
      textColor: '#6B5744',
      alignment: 'center',
      showBranding: false,
      borderTop: true,
    },
    maxWidth: '720',
    padding: 'relaxed',
    spacing: 'normal',
  },

  // 🎪 Conference Badge Theme - Professional, clean, trustworthy
  {
    id: 'conference-badge',
    name: 'Conference Badge',
    category: 'events',
    background: {
      type: 'gradient',
      gradientFrom: '#F0F9FF',
      gradientVia: '#E0F2FE',
      gradientTo: '#FFFFFF',
      gradientDirection: 'to-br',
    },
    typography: {
      titleFont: 'montserrat',
      titleColor: '#0C4A6E',
      titleSize: 'xl',
      titleWeight: '700',
      titleAlign: 'center',
      bodyFont: 'inter',
      bodyColor: '#075985',
      bodySize: 'medium',
      bodyAlign: 'center',
      linkColor: '#0284C7',
    },
    button: {
      style: 'solid',
      backgroundColor: '#0284C7',
      textColor: '#FFFFFF',
      borderRadius: 'lg',
      borderWidth: '0',
      borderColor: '',
      hoverEffect: 'lift',
      shadow: 'md',
    },
    header: {
      avatarSize: 'xl',
      avatarShape: 'square',
      showName: true,
      showBio: true,
      style: 'minimal',
      spacing: 'normal',
    },
    footer: {
      backgroundColor: '#F0F9FF',
      textColor: '#0369A1',
      alignment: 'center',
      showBranding: false,
      borderTop: true,
    },
    maxWidth: '640',
    padding: 'normal',
    spacing: 'tight',
  },

  // 💼 Digital Business Card Theme - Minimal, elegant, professional
  {
    id: 'business-card',
    name: 'Digital Business Card',
    category: 'professional',
    background: {
      type: 'solid',
      color: '#FFFFFF',
    },
    typography: {
      titleFont: 'inter',
      titleColor: '#000000',
      titleSize: 'xl',
      titleWeight: '700',
      titleAlign: 'center',
      bodyFont: 'inter',
      bodyColor: '#404040',
      bodySize: 'small',
      bodyAlign: 'center',
      linkColor: '#000000',
    },
    button: {
      style: 'outline',
      backgroundColor: '',
      textColor: '#000000',
      borderRadius: 'md',
      borderWidth: '2',
      borderColor: '#000000',
      hoverEffect: 'scale',
      shadow: 'none',
    },
    header: {
      avatarSize: 'large',
      avatarShape: 'circle',
      showName: true,
      showBio: true,
      style: 'minimal',
      spacing: 'tight',
    },
    footer: {
      backgroundColor: '#FAFAFA',
      textColor: '#737373',
      alignment: 'center',
      showBranding: false,
      borderTop: true,
    },
    maxWidth: '560',
    padding: 'tight',
    spacing: 'tight',
  },

  // 🎵 Music Artist Theme - Vibrant, creative, eye-catching
  {
    id: 'music-artist',
    name: 'Music Artist',
    category: 'creative',
    background: {
      type: 'gradient',
      gradientFrom: '#1E1B4B',
      gradientVia: '#7C3AED',
      gradientTo: '#DB2777',
      gradientDirection: 'to-br',
    },
    typography: {
      titleFont: 'montserrat',
      titleColor: '#FFFFFF',
      titleSize: '2xl',
      titleWeight: '800',
      titleAlign: 'center',
      bodyFont: 'inter',
      bodyColor: '#F3E8FF',
      bodySize: 'medium',
      bodyAlign: 'center',
      linkColor: '#FBBF24',
    },
    button: {
      style: 'solid',
      backgroundColor: '#FBBF24',
      textColor: '#1E1B4B',
      borderRadius: 'full',
      borderWidth: '0',
      borderColor: '',
      hoverEffect: 'glow',
      shadow: 'xl',
    },
    header: {
      avatarSize: '2xl',
      avatarShape: 'circle',
      showName: true,
      showBio: true,
      style: 'centered',
      spacing: 'relaxed',
    },
    footer: {
      backgroundColor: '#1E1B4B',
      textColor: '#C4B5FD',
      alignment: 'center',
      showBranding: false,
      borderTop: false,
    },
    maxWidth: '680',
    padding: 'relaxed',
    spacing: 'normal',
  },

  // 📦 Product Showcase Theme - Clean, modern, product-first
  {
    id: 'product-showcase',
    name: 'Product Showcase',
    category: 'ecommerce',
    background: {
      type: 'solid',
      color: '#FAFAFA',
    },
    typography: {
      titleFont: 'inter',
      titleColor: '#111827',
      titleSize: 'xl',
      titleWeight: '700',
      titleAlign: 'left',
      bodyFont: 'inter',
      bodyColor: '#4B5563',
      bodySize: 'medium',
      bodyAlign: 'left',
      linkColor: '#10B981',
    },
    button: {
      style: 'solid',
      backgroundColor: '#10B981',
      textColor: '#FFFFFF',
      borderRadius: 'lg',
      borderWidth: '0',
      borderColor: '',
      hoverEffect: 'lift',
      shadow: 'lg',
    },
    header: {
      avatarSize: 'xl',
      avatarShape: 'square',
      showName: true,
      showBio: true,
      style: 'minimal',
      spacing: 'normal',
    },
    footer: {
      backgroundColor: '#F3F4F6',
      textColor: '#6B7280',
      alignment: 'center',
      showBranding: false,
      borderTop: true,
    },
    maxWidth: '800',
    padding: 'normal',
    spacing: 'normal',
  },

  // ===== MINIMAL THEMES =====
  {
    id: 'snow-minimal',
    name: 'Snow Minimal',
    category: 'minimal',
    background: {
      type: 'solid',
      color: '#FAFAFA',
    },
    typography: {
      titleFont: 'inter',
      titleColor: '#18181B',
      titleSize: 'large',
      titleWeight: '600',
      titleAlign: 'center',
      bodyFont: 'inter',
      bodyColor: '#71717A',
      bodySize: 'medium',
      bodyAlign: 'center',
      linkColor: '#09090B',
    },
    button: {
      size: 'medium',
      style: 'outline',
      backgroundColor: 'transparent',
      textColor: '#09090B',
      borderRadius: 'full',
      borderWidth: '1',
      borderColor: '#D4D4D8',
      shadow: 'none',
      hoverEffect: 'lift',
    },
    header: {
      style: 'minimal',
      showAvatar: true,
      avatarSize: 'large',
      avatarShape: 'circle',
      showBio: true,
      alignment: 'center',
      spacing: 'normal',
    },
    footer: {
      style: 'minimal',
      textColor: '#A1A1AA',
      alignment: 'center',
      showBranding: false,
    },
    maxWidth: '640',
    padding: 'normal',
    spacing: 'normal',
  },

  {
    id: 'monochrome',
    name: 'Monochrome',
    category: 'minimal',
    background: {
      type: 'solid',
      color: '#FFFFFF',
    },
    typography: {
      titleFont: 'inter',
      titleColor: '#000000',
      titleSize: 'xl',
      titleWeight: '700',
      titleAlign: 'left',
      bodyFont: 'inter',
      bodyColor: '#525252',
      bodySize: 'medium',
      bodyAlign: 'left',
      linkColor: '#000000',
    },
    button: {
      size: 'medium',
      style: 'solid',
      backgroundColor: '#000000',
      textColor: '#FFFFFF',
      borderRadius: 'none',
      shadow: 'none',
      hoverEffect: 'scale',
    },
    header: {
      style: 'modern',
      showAvatar: true,
      avatarSize: 'medium',
      avatarShape: 'square',
      showBio: true,
      alignment: 'left',
      spacing: 'compact',
    },
    footer: {
      style: 'minimal',
      textColor: '#737373',
      alignment: 'left',
      borderTop: true,
    },
    maxWidth: '768',
    padding: 'normal',
    spacing: 'compact',
  },

  {
    id: 'zen-garden',
    name: 'Zen Garden',
    category: 'minimal',
    background: {
      type: 'gradient',
      gradientFrom: '#F8FAFC',
      gradientTo: '#F1F5F9',
      gradientDirection: 'to-b',
    },
    typography: {
      titleFont: 'playfair',
      titleColor: '#1E293B',
      titleSize: 'xl',
      titleWeight: '600',
      titleAlign: 'center',
      bodyFont: 'lora',
      bodyColor: '#475569',
      bodySize: 'medium',
      bodyAlign: 'center',
      linkColor: '#334155',
    },
    button: {
      size: 'medium',
      style: 'soft',
      backgroundColor: '#E2E8F0',
      textColor: '#1E293B',
      borderRadius: 'lg',
      shadow: 'sm',
      hoverEffect: 'lift',
    },
    header: {
      style: 'classic',
      showAvatar: true,
      avatarSize: 'large',
      avatarShape: 'rounded',
      showBio: true,
      alignment: 'center',
      spacing: 'relaxed',
    },
    footer: {
      style: 'minimal',
      textColor: '#64748B',
      alignment: 'center',
      showBranding: false,
    },
    maxWidth: '680',
    padding: 'relaxed',
    spacing: 'relaxed',
  },

  // ===== BOLD THEMES =====
  {
    id: 'neon-cyberpunk',
    name: 'Neon Cyberpunk',
    category: 'vibrant',
    background: {
      type: 'gradient',
      gradientFrom: '#0F0F23',
      gradientVia: '#1A1A3E',
      gradientTo: '#0F0F23',
      gradientDirection: 'to-br',
    },
    typography: {
      titleFont: 'montserrat',
      titleColor: '#00FFF5',
      titleSize: '2xl',
      titleWeight: '800',
      titleAlign: 'center',
      bodyFont: 'inter',
      bodyColor: '#B4FFE4',
      bodySize: 'medium',
      bodyAlign: 'center',
      linkColor: '#FF006E',
    },
    button: {
      size: 'large',
      style: 'solid',
      backgroundColor: '#FF006E',
      textColor: '#FFFFFF',
      borderRadius: 'full',
      shadow: 'xl',
      hoverEffect: 'glow',
    },
    header: {
      style: 'bold',
      showAvatar: true,
      avatarSize: 'xl',
      avatarShape: 'circle',
      showBio: true,
      alignment: 'center',
      spacing: 'relaxed',
    },
    footer: {
      style: 'minimal',
      textColor: '#00FFF5',
      alignment: 'center',
      showBranding: false,
    },
    maxWidth: '720',
    padding: 'relaxed',
    spacing: 'relaxed',
  },

  {
    id: 'electric-purple',
    name: 'Electric Purple',
    category: 'vibrant',
    background: {
      type: 'gradient',
      gradientFrom: '#5B21B6',
      gradientVia: '#7C3AED',
      gradientTo: '#A855F7',
      gradientDirection: 'to-br',
    },
    typography: {
      titleFont: 'poppins',
      titleColor: '#FFFFFF',
      titleSize: '2xl',
      titleWeight: '800',
      titleAlign: 'center',
      bodyFont: 'inter',
      bodyColor: '#F3E8FF',
      bodySize: 'medium',
      bodyAlign: 'center',
      linkColor: '#FDE047',
    },
    button: {
      size: 'large',
      style: 'solid',
      backgroundColor: '#FFFFFF',
      textColor: '#5B21B6',
      borderRadius: 'xl',
      shadow: 'xl',
      hoverEffect: 'grow',
    },
    header: {
      style: 'gradient',
      showAvatar: true,
      avatarSize: '2xl',
      avatarShape: 'circle',
      showBio: true,
      alignment: 'center',
      spacing: 'relaxed',
    },
    footer: {
      style: 'minimal',
      textColor: '#E9D5FF',
      alignment: 'center',
      showBranding: false,
    },
    maxWidth: '680',
    padding: 'relaxed',
    spacing: 'relaxed',
  },

  {
    id: 'sunset-fire',
    name: 'Sunset Fire',
    category: 'vibrant',
    background: {
      type: 'gradient',
      gradientFrom: '#DC2626',
      gradientVia: '#F97316',
      gradientTo: '#FACC15',
      gradientDirection: 'to-br',
    },
    typography: {
      titleFont: 'montserrat',
      titleColor: '#FFFFFF',
      titleSize: '2xl',
      titleWeight: '800',
      titleAlign: 'center',
      bodyFont: 'inter',
      bodyColor: '#FEF9C3',
      bodySize: 'large',
      bodyAlign: 'center',
      linkColor: '#FFFFFF',
    },
    button: {
      size: 'large',
      style: 'solid',
      backgroundColor: '#FFFFFF',
      textColor: '#DC2626',
      borderRadius: 'full',
      shadow: 'xl',
      hoverEffect: 'pulse',
    },
    header: {
      style: 'bold',
      showAvatar: true,
      avatarSize: '2xl',
      avatarShape: 'circle',
      showBio: true,
      alignment: 'center',
      spacing: 'relaxed',
    },
    footer: {
      style: 'minimal',
      textColor: '#FEF9C3',
      alignment: 'center',
      showBranding: false,
    },
    maxWidth: '720',
    padding: 'relaxed',
    spacing: 'relaxed',
  },

  // ===== GRADIENT THEMES =====
  {
    id: 'aurora-borealis',
    name: 'Aurora Borealis',
    category: 'vibrant',
    background: {
      type: 'gradient',
      gradientFrom: '#134E4A',
      gradientVia: '#14B8A6',
      gradientTo: '#5EEAD4',
      gradientDirection: 'to-br',
    },
    typography: {
      titleFont: 'poppins',
      titleColor: '#FFFFFF',
      titleSize: 'xl',
      titleWeight: '700',
      titleAlign: 'center',
      bodyFont: 'inter',
      bodyColor: '#CCFBF1',
      bodySize: 'medium',
      bodyAlign: 'center',
      linkColor: '#F0FDFA',
    },
    button: {
      size: 'large',
      style: 'solid',
      backgroundColor: '#FFFFFF',
      textColor: '#134E4A',
      borderRadius: 'xl',
      shadow: 'lg',
      hoverEffect: 'lift',
    },
    header: {
      style: 'modern',
      showAvatar: true,
      avatarSize: 'xl',
      avatarShape: 'circle',
      showBio: true,
      alignment: 'center',
      spacing: 'normal',
    },
    footer: {
      style: 'minimal',
      textColor: '#CCFBF1',
      alignment: 'center',
      showBranding: false,
    },
    maxWidth: '680',
    padding: 'normal',
    spacing: 'normal',
  },

  {
    id: 'peachy-keen',
    name: 'Peachy Keen',
    category: 'vibrant',
    background: {
      type: 'gradient',
      gradientFrom: '#FFF7ED',
      gradientVia: '#FFEDD5',
      gradientTo: '#FED7AA',
      gradientDirection: 'to-br',
    },
    typography: {
      titleFont: 'poppins',
      titleColor: '#7C2D12',
      titleSize: 'xl',
      titleWeight: '700',
      titleAlign: 'center',
      bodyFont: 'inter',
      bodyColor: '#9A3412',
      bodySize: 'medium',
      bodyAlign: 'center',
      linkColor: '#EA580C',
    },
    button: {
      size: 'medium',
      style: 'solid',
      backgroundColor: '#F97316',
      textColor: '#FFFFFF',
      borderRadius: 'full',
      shadow: 'lg',
      hoverEffect: 'grow',
    },
    header: {
      style: 'modern',
      showAvatar: true,
      avatarSize: 'large',
      avatarShape: 'circle',
      showBio: true,
      alignment: 'center',
      spacing: 'normal',
    },
    footer: {
      style: 'minimal',
      textColor: '#C2410C',
      alignment: 'center',
      showBranding: false,
    },
    maxWidth: '680',
    padding: 'normal',
    spacing: 'normal',
  },

  {
    id: 'lavender-dreams',
    name: 'Lavender Dreams',
    category: 'vibrant',
    background: {
      type: 'gradient',
      gradientFrom: '#F5F3FF',
      gradientVia: '#EDE9FE',
      gradientTo: '#DDD6FE',
      gradientDirection: 'to-br',
    },
    typography: {
      titleFont: 'playfair',
      titleColor: '#5B21B6',
      titleSize: 'xl',
      titleWeight: '700',
      titleAlign: 'center',
      bodyFont: 'lora',
      bodyColor: '#6B21A8',
      bodySize: 'medium',
      bodyAlign: 'center',
      linkColor: '#7C3AED',
    },
    button: {
      size: 'medium',
      style: 'solid',
      backgroundColor: '#7C3AED',
      textColor: '#FFFFFF',
      borderRadius: 'xl',
      shadow: 'md',
      hoverEffect: 'lift',
    },
    header: {
      style: 'classic',
      showAvatar: true,
      avatarSize: 'large',
      avatarShape: 'rounded',
      showBio: true,
      alignment: 'center',
      spacing: 'normal',
    },
    footer: {
      style: 'minimal',
      textColor: '#7C3AED',
      alignment: 'center',
      showBranding: false,
    },
    maxWidth: '680',
    padding: 'normal',
    spacing: 'normal',
  },

  // ===== DARK THEMES =====
  {
    id: 'midnight-slate',
    name: 'Midnight Slate',
    category: 'professional',
    background: {
      type: 'gradient',
      gradientFrom: '#0F172A',
      gradientVia: '#1E293B',
      gradientTo: '#334155',
      gradientDirection: 'to-br',
    },
    typography: {
      titleFont: 'inter',
      titleColor: '#F1F5F9',
      titleSize: 'xl',
      titleWeight: '700',
      titleAlign: 'center',
      bodyFont: 'inter',
      bodyColor: '#CBD5E1',
      bodySize: 'medium',
      bodyAlign: 'center',
      linkColor: '#60A5FA',
    },
    button: {
      size: 'medium',
      style: 'solid',
      backgroundColor: '#3B82F6',
      textColor: '#FFFFFF',
      borderRadius: 'lg',
      shadow: 'lg',
      hoverEffect: 'lift',
    },
    header: {
      style: 'modern',
      showAvatar: true,
      avatarSize: 'large',
      avatarShape: 'circle',
      showBio: true,
      alignment: 'center',
      spacing: 'normal',
    },
    footer: {
      style: 'minimal',
      textColor: '#94A3B8',
      alignment: 'center',
      showBranding: false,
    },
    maxWidth: '720',
    padding: 'normal',
    spacing: 'normal',
  },

  {
    id: 'carbon-fiber',
    name: 'Carbon Fiber',
    category: 'professional',
    background: {
      type: 'pattern',
      color: '#18181B',
      pattern: 'diagonal',
      patternColor: '#27272A',
      patternOpacity: 0.5,
      patternSize: 'small',
    },
    typography: {
      titleFont: 'montserrat',
      titleColor: '#FAFAFA',
      titleSize: 'xl',
      titleWeight: '700',
      titleAlign: 'center',
      bodyFont: 'inter',
      bodyColor: '#D4D4D8',
      bodySize: 'medium',
      bodyAlign: 'center',
      linkColor: '#A1A1AA',
    },
    button: {
      size: 'medium',
      style: 'outline',
      backgroundColor: 'transparent',
      textColor: '#FAFAFA',
      borderRadius: 'md',
      borderWidth: '2',
      borderColor: '#52525B',
      shadow: 'none',
      hoverEffect: 'glow',
    },
    header: {
      style: 'modern',
      showAvatar: true,
      avatarSize: 'large',
      avatarShape: 'rounded',
      showBio: true,
      alignment: 'center',
      spacing: 'normal',
    },
    footer: {
      style: 'minimal',
      textColor: '#71717A',
      alignment: 'center',
      showBranding: false,
    },
    maxWidth: '680',
    padding: 'normal',
    spacing: 'normal',
  },

  {
    id: 'deep-ocean',
    name: 'Deep Ocean',
    category: 'professional',
    background: {
      type: 'gradient',
      gradientFrom: '#082F49',
      gradientVia: '#0C4A6E',
      gradientTo: '#075985',
      gradientDirection: 'to-br',
    },
    typography: {
      titleFont: 'poppins',
      titleColor: '#E0F2FE',
      titleSize: 'xl',
      titleWeight: '700',
      titleAlign: 'center',
      bodyFont: 'inter',
      bodyColor: '#BAE6FD',
      bodySize: 'medium',
      bodyAlign: 'center',
      linkColor: '#7DD3FC',
    },
    button: {
      size: 'large',
      style: 'solid',
      backgroundColor: '#0EA5E9',
      textColor: '#FFFFFF',
      borderRadius: 'full',
      shadow: 'xl',
      hoverEffect: 'lift',
    },
    header: {
      style: 'modern',
      showAvatar: true,
      avatarSize: 'xl',
      avatarShape: 'circle',
      showBio: true,
      alignment: 'center',
      spacing: 'normal',
    },
    footer: {
      style: 'minimal',
      textColor: '#7DD3FC',
      alignment: 'center',
      showBranding: false,
    },
    maxWidth: '720',
    padding: 'normal',
    spacing: 'normal',
  },

  // ===== LIGHT & AIRY THEMES =====
  {
    id: 'soft-pink-blush',
    name: 'Soft Pink Blush',
    category: 'minimal',
    background: {
      type: 'gradient',
      gradientFrom: '#FFF1F2',
      gradientVia: '#FFE4E6',
      gradientTo: '#FECDD3',
      gradientDirection: 'to-br',
    },
    typography: {
      titleFont: 'poppins',
      titleColor: '#881337',
      titleSize: 'xl',
      titleWeight: '600',
      titleAlign: 'center',
      bodyFont: 'inter',
      bodyColor: '#9F1239',
      bodySize: 'medium',
      bodyAlign: 'center',
      linkColor: '#E11D48',
    },
    button: {
      size: 'medium',
      style: 'solid',
      backgroundColor: '#F43F5E',
      textColor: '#FFFFFF',
      borderRadius: 'full',
      shadow: 'md',
      hoverEffect: 'lift',
    },
    header: {
      style: 'classic',
      showAvatar: true,
      avatarSize: 'large',
      avatarShape: 'circle',
      showBio: true,
      alignment: 'center',
      spacing: 'normal',
    },
    footer: {
      style: 'minimal',
      textColor: '#BE123C',
      alignment: 'center',
      showBranding: false,
    },
    maxWidth: '640',
    padding: 'normal',
    spacing: 'normal',
  },

  {
    id: 'mint-cream',
    name: 'Mint Cream',
    category: 'minimal',
    background: {
      type: 'gradient',
      gradientFrom: '#F0FDF4',
      gradientVia: '#DCFCE7',
      gradientTo: '#BBF7D0',
      gradientDirection: 'to-br',
    },
    typography: {
      titleFont: 'inter',
      titleColor: '#14532D',
      titleSize: 'xl',
      titleWeight: '600',
      titleAlign: 'center',
      bodyFont: 'inter',
      bodyColor: '#166534',
      bodySize: 'medium',
      bodyAlign: 'center',
      linkColor: '#16A34A',
    },
    button: {
      size: 'medium',
      style: 'solid',
      backgroundColor: '#22C55E',
      textColor: '#FFFFFF',
      borderRadius: 'xl',
      shadow: 'md',
      hoverEffect: 'grow',
    },
    header: {
      style: 'minimal',
      showAvatar: true,
      avatarSize: 'large',
      avatarShape: 'circle',
      showBio: true,
      alignment: 'center',
      spacing: 'normal',
    },
    footer: {
      style: 'minimal',
      textColor: '#15803D',
      alignment: 'center',
      showBranding: false,
    },
    maxWidth: '680',
    padding: 'normal',
    spacing: 'normal',
  },

  {
    id: 'sky-blue',
    name: 'Sky Blue',
    category: 'minimal',
    background: {
      type: 'gradient',
      gradientFrom: '#F0F9FF',
      gradientVia: '#E0F2FE',
      gradientTo: '#BAE6FD',
      gradientDirection: 'to-br',
    },
    typography: {
      titleFont: 'poppins',
      titleColor: '#0C4A6E',
      titleSize: 'xl',
      titleWeight: '600',
      titleAlign: 'center',
      bodyFont: 'inter',
      bodyColor: '#075985',
      bodySize: 'medium',
      bodyAlign: 'center',
      linkColor: '#0284C7',
    },
    button: {
      size: 'medium',
      style: 'solid',
      backgroundColor: '#0EA5E9',
      textColor: '#FFFFFF',
      borderRadius: 'full',
      shadow: 'md',
      hoverEffect: 'lift',
    },
    header: {
      style: 'minimal',
      showAvatar: true,
      avatarSize: 'large',
      avatarShape: 'circle',
      showBio: true,
      alignment: 'center',
      spacing: 'normal',
    },
    footer: {
      style: 'minimal',
      textColor: '#0369A1',
      alignment: 'center',
      showBranding: false,
    },
    maxWidth: '680',
    padding: 'normal',
    spacing: 'normal',
  },

  // ===== COLORFUL/CREATIVE THEMES =====
  {
    id: 'rainbow-gradient',
    name: 'Rainbow Gradient',
    category: 'creative',
    background: {
      type: 'gradient',
      gradientFrom: '#F87171',
      gradientVia: '#FBBF24',
      gradientTo: '#34D399',
      gradientDirection: 'to-br',
    },
    typography: {
      titleFont: 'poppins',
      titleColor: '#FFFFFF',
      titleSize: '2xl',
      titleWeight: '800',
      titleAlign: 'center',
      bodyFont: 'inter',
      bodyColor: '#FFFFFF',
      bodySize: 'large',
      bodyAlign: 'center',
      linkColor: '#FEF3C7',
    },
    button: {
      size: 'large',
      style: 'solid',
      backgroundColor: '#FFFFFF',
      textColor: '#EF4444',
      borderRadius: 'full',
      shadow: 'xl',
      hoverEffect: 'pulse',
    },
    header: {
      style: 'bold',
      showAvatar: true,
      avatarSize: '2xl',
      avatarShape: 'circle',
      showBio: true,
      alignment: 'center',
      spacing: 'relaxed',
    },
    footer: {
      style: 'minimal',
      textColor: '#FEF3C7',
      alignment: 'center',
      showBranding: false,
    },
    maxWidth: '720',
    padding: 'relaxed',
    spacing: 'relaxed',
  },

  {
    id: 'candy-pop',
    name: 'Candy Pop',
    category: 'creative',
    background: {
      type: 'gradient',
      gradientFrom: '#FDF4FF',
      gradientVia: '#F5D0FE',
      gradientTo: '#E879F9',
      gradientDirection: 'to-br',
    },
    typography: {
      titleFont: 'poppins',
      titleColor: '#701A75',
      titleSize: '2xl',
      titleWeight: '800',
      titleAlign: 'center',
      bodyFont: 'inter',
      bodyColor: '#86198F',
      bodySize: 'large',
      bodyAlign: 'center',
      linkColor: '#A21CAF',
    },
    button: {
      size: 'large',
      style: 'solid',
      backgroundColor: '#D946EF',
      textColor: '#FFFFFF',
      borderRadius: 'full',
      shadow: 'xl',
      hoverEffect: 'grow',
    },
    header: {
      style: 'modern',
      showAvatar: true,
      avatarSize: 'xl',
      avatarShape: 'circle',
      showBio: true,
      alignment: 'center',
      spacing: 'normal',
    },
    footer: {
      style: 'minimal',
      textColor: '#A21CAF',
      alignment: 'center',
      showBranding: false,
    },
    maxWidth: '680',
    padding: 'normal',
    spacing: 'normal',
  },

  {
    id: 'tropical-sunset',
    name: 'Tropical Sunset',
    category: 'creative',
    background: {
      type: 'gradient',
      gradientFrom: '#FEF3C7',
      gradientVia: '#FDBA74',
      gradientTo: '#FB923C',
      gradientDirection: 'to-br',
    },
    typography: {
      titleFont: 'montserrat',
      titleColor: '#7C2D12',
      titleSize: 'xl',
      titleWeight: '800',
      titleAlign: 'center',
      bodyFont: 'inter',
      bodyColor: '#9A3412',
      bodySize: 'medium',
      bodyAlign: 'center',
      linkColor: '#C2410C',
    },
    button: {
      size: 'large',
      style: 'solid',
      backgroundColor: '#DC2626',
      textColor: '#FFFFFF',
      borderRadius: 'full',
      shadow: 'xl',
      hoverEffect: 'lift',
    },
    header: {
      style: 'modern',
      showAvatar: true,
      avatarSize: 'xl',
      avatarShape: 'circle',
      showBio: true,
      alignment: 'center',
      spacing: 'normal',
    },
    footer: {
      style: 'minimal',
      textColor: '#EA580C',
      alignment: 'center',
      showBranding: false,
    },
    maxWidth: '720',
    padding: 'normal',
    spacing: 'normal',
  },

  // ===== PROFESSIONAL/BUSINESS THEMES =====
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    category: 'professional',
    background: {
      type: 'gradient',
      gradientFrom: '#F0F9FF',
      gradientTo: '#DBEAFE',
      gradientDirection: 'to-b',
    },
    typography: {
      titleFont: 'inter',
      titleColor: '#1E3A8A',
      titleSize: 'xl',
      titleWeight: '700',
      titleAlign: 'left',
      bodyFont: 'inter',
      bodyColor: '#1E40AF',
      bodySize: 'medium',
      bodyAlign: 'left',
      linkColor: '#2563EB',
    },
    button: {
      size: 'medium',
      style: 'solid',
      backgroundColor: '#2563EB',
      textColor: '#FFFFFF',
      borderRadius: 'md',
      shadow: 'md',
      hoverEffect: 'lift',
    },
    header: {
      style: 'minimal',
      showAvatar: true,
      avatarSize: 'large',
      avatarShape: 'square',
      showBio: true,
      alignment: 'left',
      spacing: 'compact',
    },
    footer: {
      style: 'detailed',
      textColor: '#1E40AF',
      alignment: 'left',
      showBranding: true,
      borderTop: true,
    },
    maxWidth: '800',
    padding: 'normal',
    spacing: 'compact',
  },

  {
    id: 'tech-startup',
    name: 'Tech Startup',
    category: 'professional',
    background: {
      type: 'pattern',
      color: '#FAFAFA',
      pattern: 'dots',
      patternColor: '#3B82F6',
      patternOpacity: 0.1,
      patternSize: 'small',
    },
    typography: {
      titleFont: 'inter',
      titleColor: '#111827',
      titleSize: 'xl',
      titleWeight: '700',
      titleAlign: 'center',
      bodyFont: 'inter',
      bodyColor: '#4B5563',
      bodySize: 'medium',
      bodyAlign: 'center',
      linkColor: '#3B82F6',
    },
    button: {
      size: 'medium',
      style: 'solid',
      backgroundColor: '#3B82F6',
      textColor: '#FFFFFF',
      borderRadius: 'lg',
      shadow: 'lg',
      hoverEffect: 'lift',
    },
    header: {
      style: 'modern',
      showAvatar: true,
      avatarSize: 'large',
      avatarShape: 'rounded',
      showBio: true,
      alignment: 'center',
      spacing: 'normal',
    },
    footer: {
      style: 'minimal',
      textColor: '#6B7280',
      alignment: 'center',
      showBranding: false,
    },
    maxWidth: '720',
    padding: 'normal',
    spacing: 'normal',
  },

  {
    id: 'elegant-gold',
    name: 'Elegant Gold',
    category: 'professional',
    background: {
      type: 'gradient',
      gradientFrom: '#FFFBEB',
      gradientVia: '#FEF3C7',
      gradientTo: '#FDE68A',
      gradientDirection: 'to-br',
    },
    typography: {
      titleFont: 'playfair',
      titleColor: '#78350F',
      titleSize: 'xl',
      titleWeight: '700',
      titleAlign: 'center',
      bodyFont: 'lora',
      bodyColor: '#92400E',
      bodySize: 'medium',
      bodyAlign: 'center',
      linkColor: '#B45309',
    },
    button: {
      size: 'medium',
      style: 'solid',
      backgroundColor: '#D97706',
      textColor: '#FFFFFF',
      borderRadius: 'full',
      shadow: 'lg',
      hoverEffect: 'lift',
    },
    header: {
      style: 'classic',
      showAvatar: true,
      avatarSize: 'large',
      avatarShape: 'circle',
      showBio: true,
      alignment: 'center',
      spacing: 'normal',
    },
    footer: {
      style: 'minimal',
      textColor: '#92400E',
      alignment: 'center',
      showBranding: false,
    },
    maxWidth: '680',
    padding: 'normal',
    spacing: 'normal',
  },

  // ===== PREMIUM LINKTREE-COMPETITIVE THEMES =====

  // 🌟 Glassmorphism - Frosted glass effect with blur
  {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    category: 'creative',
    background: {
      type: 'gradient',
      gradientFrom: '#667eea',
      gradientVia: '#764ba2',
      gradientTo: '#f093fb',
      gradientDirection: 'to-br',
    },
    typography: {
      titleFont: 'inter',
      titleColor: '#ffffff',
      titleSize: 'xl',
      titleWeight: '600',
      titleAlign: 'center',
      bodyFont: 'inter',
      bodyColor: 'rgba(255, 255, 255, 0.9)',
      bodySize: 'medium',
      bodyAlign: 'center',
      linkColor: '#ffffff',
    },
    button: {
      size: 'large',
      style: 'soft',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      textColor: '#ffffff',
      borderRadius: 'xl',
      borderWidth: '1',
      borderColor: 'rgba(255, 255, 255, 0.3)',
      shadow: 'lg',
      hoverEffect: 'glow',
    },
    header: {
      style: 'modern',
      showAvatar: true,
      avatarSize: 'xl',
      avatarShape: 'circle',
      showBio: true,
      alignment: 'center',
      spacing: 'relaxed',
    },
    footer: {
      style: 'minimal',
      textColor: 'rgba(255, 255, 255, 0.7)',
      alignment: 'center',
      showBranding: false,
    },
    maxWidth: '680',
    padding: 'relaxed',
    spacing: 'normal',
  },

  // 🎨 Neo-Brutalism - Bold, raw, anti-design
  {
    id: 'neo-brutalism',
    name: 'Neo Brutalism',
    category: 'creative',
    background: {
      type: 'solid',
      color: '#F4F1E8',
    },
    typography: {
      titleFont: 'spacegrotesk',
      titleColor: '#000000',
      titleSize: '2xl',
      titleWeight: '700',
      titleAlign: 'center',
      bodyFont: 'spacegrotesk',
      bodyColor: '#1a1a1a',
      bodySize: 'medium',
      bodyAlign: 'center',
      linkColor: '#000000',
    },
    button: {
      size: 'large',
      style: 'solid',
      backgroundColor: '#FF6B35',
      textColor: '#000000',
      borderRadius: 'none',
      borderWidth: '3',
      borderColor: '#000000',
      shadow: 'none',
      hoverEffect: 'none',
    },
    header: {
      style: 'bold',
      showAvatar: true,
      avatarSize: 'xl',
      avatarShape: 'square',
      showBio: true,
      alignment: 'center',
      spacing: 'relaxed',
    },
    footer: {
      style: 'minimal',
      textColor: '#666666',
      alignment: 'center',
      showBranding: false,
      borderTop: true,
    },
    maxWidth: '640',
    padding: 'relaxed',
    spacing: 'relaxed',
  },

  // 🌅 Sunset Vibes - Warm orange-pink gradient
  {
    id: 'sunset-vibes',
    name: 'Sunset Vibes',
    category: 'vibrant',
    background: {
      type: 'gradient',
      gradientFrom: '#FF6B6B',
      gradientVia: '#FF8E53',
      gradientTo: '#FFD93D',
      gradientDirection: 'to-br',
    },
    typography: {
      titleFont: 'poppins',
      titleColor: '#ffffff',
      titleSize: 'xl',
      titleWeight: '700',
      titleAlign: 'center',
      bodyFont: 'poppins',
      bodyColor: 'rgba(255, 255, 255, 0.95)',
      bodySize: 'medium',
      bodyAlign: 'center',
      linkColor: '#ffffff',
    },
    button: {
      size: 'large',
      style: 'solid',
      backgroundColor: '#ffffff',
      textColor: '#FF6B6B',
      borderRadius: 'full',
      shadow: 'xl',
      hoverEffect: 'grow',
    },
    header: {
      style: 'bold',
      showAvatar: true,
      avatarSize: 'xl',
      avatarShape: 'circle',
      showBio: true,
      alignment: 'center',
      spacing: 'relaxed',
    },
    footer: {
      style: 'minimal',
      textColor: 'rgba(255, 255, 255, 0.8)',
      alignment: 'center',
      showBranding: false,
    },
    maxWidth: '680',
    padding: 'relaxed',
    spacing: 'normal',
  },

  // 🌙 Cosmic Night - Deep purple space theme
  {
    id: 'cosmic-night',
    name: 'Cosmic Night',
    category: 'creative',
    background: {
      type: 'gradient',
      gradientFrom: '#0f0c29',
      gradientVia: '#302b63',
      gradientTo: '#24243e',
      gradientDirection: 'to-b',
    },
    typography: {
      titleFont: 'sora',
      titleColor: '#ffffff',
      titleSize: 'xl',
      titleWeight: '600',
      titleAlign: 'center',
      bodyFont: 'inter',
      bodyColor: '#a0a0b0',
      bodySize: 'medium',
      bodyAlign: 'center',
      linkColor: '#8b5cf6',
    },
    button: {
      size: 'large',
      style: 'outline',
      backgroundColor: 'transparent',
      textColor: '#ffffff',
      borderRadius: 'lg',
      borderWidth: '2',
      borderColor: '#8b5cf6',
      shadow: 'lg',
      hoverEffect: 'glow',
    },
    header: {
      style: 'modern',
      showAvatar: true,
      avatarSize: 'large',
      avatarShape: 'circle',
      showBio: true,
      alignment: 'center',
      spacing: 'normal',
    },
    footer: {
      style: 'minimal',
      textColor: '#6b6b7b',
      alignment: 'center',
      showBranding: false,
    },
    maxWidth: '680',
    padding: 'normal',
    spacing: 'normal',
  },

  // 🌿 Forest Green - Nature-inspired calm
  {
    id: 'forest-green',
    name: 'Forest Green',
    category: 'minimal',
    background: {
      type: 'gradient',
      gradientFrom: '#134E5E',
      gradientTo: '#71B280',
      gradientDirection: 'to-br',
    },
    typography: {
      titleFont: 'playfair',
      titleColor: '#ffffff',
      titleSize: 'xl',
      titleWeight: '700',
      titleAlign: 'center',
      bodyFont: 'lora',
      bodyColor: 'rgba(255, 255, 255, 0.9)',
      bodySize: 'medium',
      bodyAlign: 'center',
      linkColor: '#ffffff',
    },
    button: {
      size: 'medium',
      style: 'solid',
      backgroundColor: '#ffffff',
      textColor: '#134E5E',
      borderRadius: 'lg',
      shadow: 'md',
      hoverEffect: 'lift',
    },
    header: {
      style: 'classic',
      showAvatar: true,
      avatarSize: 'large',
      avatarShape: 'circle',
      showBio: true,
      alignment: 'center',
      spacing: 'normal',
    },
    footer: {
      style: 'minimal',
      textColor: 'rgba(255, 255, 255, 0.7)',
      alignment: 'center',
      showBranding: false,
    },
    maxWidth: '680',
    padding: 'normal',
    spacing: 'normal',
  },

  // 🪸 Coral Reef - Soft coral pink
  {
    id: 'coral-reef',
    name: 'Coral Reef',
    category: 'vibrant',
    background: {
      type: 'solid',
      color: '#FFF5F5',
    },
    typography: {
      titleFont: 'dmSans',
      titleColor: '#E53E3E',
      titleSize: 'xl',
      titleWeight: '700',
      titleAlign: 'center',
      bodyFont: 'dmSans',
      bodyColor: '#742A2A',
      bodySize: 'medium',
      bodyAlign: 'center',
      linkColor: '#E53E3E',
    },
    button: {
      size: 'large',
      style: 'solid',
      backgroundColor: '#E53E3E',
      textColor: '#ffffff',
      borderRadius: 'full',
      shadow: 'lg',
      hoverEffect: 'grow',
    },
    header: {
      style: 'modern',
      showAvatar: true,
      avatarSize: 'xl',
      avatarShape: 'circle',
      showBio: true,
      alignment: 'center',
      spacing: 'relaxed',
    },
    footer: {
      style: 'minimal',
      textColor: '#C53030',
      alignment: 'center',
      showBranding: false,
    },
    maxWidth: '680',
    padding: 'relaxed',
    spacing: 'normal',
  },

  // ⚫ Monochrome Pro - Pure black & white elegance
  {
    id: 'monochrome-pro',
    name: 'Monochrome Pro',
    category: 'minimal',
    background: {
      type: 'solid',
      color: '#ffffff',
    },
    typography: {
      titleFont: 'inter',
      titleColor: '#000000',
      titleSize: 'large',
      titleWeight: '700',
      titleAlign: 'center',
      bodyFont: 'inter',
      bodyColor: '#404040',
      bodySize: 'medium',
      bodyAlign: 'center',
      linkColor: '#000000',
    },
    button: {
      size: 'medium',
      style: 'solid',
      backgroundColor: '#000000',
      textColor: '#ffffff',
      borderRadius: 'none',
      shadow: 'none',
      hoverEffect: 'scale',
    },
    header: {
      style: 'minimal',
      showAvatar: true,
      avatarSize: 'large',
      avatarShape: 'circle',
      showBio: true,
      alignment: 'center',
      spacing: 'compact',
    },
    footer: {
      style: 'minimal',
      textColor: '#666666',
      alignment: 'center',
      showBranding: false,
      borderTop: true,
    },
    maxWidth: '560',
    padding: 'compact',
    spacing: 'tight',
  },

  // 🍬 Pastel Dream - Soft pastel gradient
  {
    id: 'pastel-dream',
    name: 'Pastel Dream',
    category: 'creative',
    background: {
      type: 'gradient',
      gradientFrom: '#FDF2F8',
      gradientVia: '#FCE7F3',
      gradientTo: '#F3E8FF',
      gradientDirection: 'to-br',
    },
    typography: {
      titleFont: 'poppins',
      titleColor: '#831843',
      titleSize: 'xl',
      titleWeight: '600',
      titleAlign: 'center',
      bodyFont: 'inter',
      bodyColor: '#9D174D',
      bodySize: 'medium',
      bodyAlign: 'center',
      linkColor: '#BE185D',
    },
    button: {
      size: 'large',
      style: 'solid',
      backgroundColor: '#EC4899',
      textColor: '#ffffff',
      borderRadius: 'full',
      shadow: 'lg',
      hoverEffect: 'lift',
    },
    header: {
      style: 'modern',
      showAvatar: true,
      avatarSize: 'xl',
      avatarShape: 'circle',
      showBio: true,
      alignment: 'center',
      spacing: 'relaxed',
    },
    footer: {
      style: 'minimal',
      textColor: '#9D174D',
      alignment: 'center',
      showBranding: false,
    },
    maxWidth: '680',
    padding: 'relaxed',
    spacing: 'normal',
  },

  // 🖤 Dark Luxury - Premium dark with gold accents
  {
    id: 'dark-luxury',
    name: 'Dark Luxury',
    category: 'professional',
    background: {
      type: 'solid',
      color: '#0a0a0a',
    },
    typography: {
      titleFont: 'playfair',
      titleColor: '#D4AF37',
      titleSize: 'xl',
      titleWeight: '700',
      titleAlign: 'center',
      bodyFont: 'inter',
      bodyColor: '#a0a0a0',
      bodySize: 'medium',
      bodyAlign: 'center',
      linkColor: '#D4AF37',
    },
    button: {
      size: 'large',
      style: 'outline',
      backgroundColor: 'transparent',
      textColor: '#D4AF37',
      borderRadius: 'none',
      borderWidth: '2',
      borderColor: '#D4AF37',
      shadow: 'none',
      hoverEffect: 'glow',
    },
    header: {
      style: 'classic',
      showAvatar: true,
      avatarSize: 'xl',
      avatarShape: 'circle',
      showBio: true,
      alignment: 'center',
      spacing: 'relaxed',
    },
    footer: {
      style: 'minimal',
      textColor: '#666666',
      alignment: 'center',
      showBranding: false,
    },
    maxWidth: '640',
    padding: 'relaxed',
    spacing: 'relaxed',
  },

  // 🌊 Ocean Breeze - Calming blue tones
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    category: 'minimal',
    background: {
      type: 'gradient',
      gradientFrom: '#E0F7FA',
      gradientVia: '#B2EBF2',
      gradientTo: '#80DEEA',
      gradientDirection: 'to-b',
    },
    typography: {
      titleFont: 'nunito',
      titleColor: '#00695C',
      titleSize: 'xl',
      titleWeight: '700',
      titleAlign: 'center',
      bodyFont: 'nunito',
      bodyColor: '#004D40',
      bodySize: 'medium',
      bodyAlign: 'center',
      linkColor: '#00796B',
    },
    button: {
      size: 'medium',
      style: 'solid',
      backgroundColor: '#00897B',
      textColor: '#ffffff',
      borderRadius: 'full',
      shadow: 'md',
      hoverEffect: 'lift',
    },
    header: {
      style: 'modern',
      showAvatar: true,
      avatarSize: 'large',
      avatarShape: 'circle',
      showBio: true,
      alignment: 'center',
      spacing: 'normal',
    },
    footer: {
      style: 'minimal',
      textColor: '#00695C',
      alignment: 'center',
      showBranding: false,
    },
    maxWidth: '680',
    padding: 'normal',
    spacing: 'normal',
  },
];

// Font loading utilities
export const GOOGLE_FONTS: Record<FontFamily, { name: string; weights: number[] }> = {
  // Sans-serif - Modern & Clean
  inter: { name: 'Inter', weights: [400, 500, 600, 700, 800] },
  poppins: { name: 'Poppins', weights: [400, 500, 600, 700, 800] },
  montserrat: { name: 'Montserrat', weights: [400, 500, 600, 700, 800] },
  raleway: { name: 'Raleway', weights: [300, 400, 500, 600, 700] },
  opensans: { name: 'Open Sans', weights: [400, 500, 600, 700, 800] },
  roboto: { name: 'Roboto', weights: [300, 400, 500, 700, 900] },
  nunito: { name: 'Nunito', weights: [400, 500, 600, 700, 800] },
  ubuntu: { name: 'Ubuntu', weights: [300, 400, 500, 700] },
  outfit: { name: 'Outfit', weights: [400, 500, 600, 700, 800] },
  workSans: { name: 'Work Sans', weights: [400, 500, 600, 700, 800] },
  dmSans: { name: 'DM Sans', weights: [400, 500, 700] },
  spacegrotesk: { name: 'Space Grotesk', weights: [400, 500, 600, 700] },
  manrope: { name: 'Manrope', weights: [400, 500, 600, 700, 800] },
  plusjakarta: { name: 'Plus Jakarta Sans', weights: [400, 500, 600, 700, 800] },
  bevietnampro: { name: 'Be Vietnam Pro', weights: [400, 500, 600, 700] },
  sora: { name: 'Sora', weights: [400, 500, 600, 700, 800] },
  
  // Serif - Elegant & Classic
  playfair: { name: 'Playfair Display', weights: [400, 700, 900] },
  lora: { name: 'Lora', weights: [400, 500, 600, 700] },
  merriweather: { name: 'Merriweather', weights: [300, 400, 700, 900] },
  
  // Monospace - Technical
  sourcecodepro: { name: 'Source Code Pro', weights: [400, 500, 600, 700] },
  
  // System fonts - No weights needed (already on system)
  arial: { name: 'Arial', weights: [] },
  helvetica: { name: 'Helvetica', weights: [] },
  timesnewroman: { name: 'Times New Roman', weights: [] },
  georgia: { name: 'Georgia', weights: [] },
  garamond: { name: 'Garamond', weights: [] },
  calibri: { name: 'Calibri', weights: [] },
  verdana: { name: 'Verdana', weights: [] },
  tahoma: { name: 'Tahoma', weights: [] },
  trebuchet: { name: 'Trebuchet MS', weights: [] },
  comicsans: { name: 'Comic Sans MS', weights: [] },
  couriernew: { name: 'Courier New', weights: [] },
};

export function loadGoogleFont(fontFamily: FontFamily) {
  const font = GOOGLE_FONTS[fontFamily];
  if (!font) return;
  
  const link = document.createElement('link');
  link.href = `https://fonts.googleapis.com/css2?family=${font.name.replace(' ', '+')}:wght@${font.weights.join(';')}&display=swap`;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}
