import type { PageTheme } from '@/types/theme';

export interface ThemePreset {
  id: string;
  name: string;
  category: PageTheme['category'];
  description: string;
  theme: Partial<PageTheme>;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'minimal-light',
    name: 'Minimal Light',
    category: 'minimal',
    description: 'Clean and simple light theme',
    theme: {
      id: 'minimal-light',
      name: 'Minimal Light',
      category: 'minimal',
      background: {
        type: 'solid',
        color: '#FFFFFF',
      },
      typography: {
        titleColor: '#1F2937',
        bodyColor: '#6B7280',
        titleFont: 'inter',
        bodyFont: 'inter',
      },
      button: {
        size: 'medium',
        variant: 'fill',
        backgroundColor: '#000000',
        textColor: '#FFFFFF',
        borderRadius: 'md',
        hoverEffect: 'lift',
      },
    },
  },
  {
    id: 'minimal-dark',
    name: 'Minimal Dark',
    category: 'minimal',
    description: 'Sleek dark mode theme',
    theme: {
      id: 'minimal-dark',
      name: 'Minimal Dark',
      category: 'minimal',
      background: {
        type: 'solid',
        color: '#0F172A',
      },
      typography: {
        titleColor: '#F1F5F9',
        bodyColor: '#94A3B8',
        titleFont: 'inter',
        bodyFont: 'inter',
      },
      button: {
        size: 'medium',
        variant: 'fill',
        backgroundColor: '#FFFFFF',
        textColor: '#000000',
        borderRadius: 'md',
        hoverEffect: 'lift',
      },
    },
  },
  {
    id: 'vibrant-gradient',
    name: 'Vibrant Gradient',
    category: 'vibrant',
    description: 'Colorful gradient background',
    theme: {
      id: 'vibrant-gradient',
      name: 'Vibrant Gradient',
      category: 'vibrant',
      background: {
        type: 'gradient',
        gradientFrom: '#667eea',
        gradientTo: '#764ba2',
        gradientDirection: 'to-br',
      },
      typography: {
        titleColor: '#FFFFFF',
        bodyColor: '#F3F4F6',
        titleFont: 'inter',
        bodyFont: 'inter',
      },
      button: {
        size: 'medium',
        variant: 'soft',
        backgroundColor: '#FFFFFF',
        textColor: '#667eea',
        borderRadius: 'full',
        hoverEffect: 'grow',
      },
    },
  },
  {
    id: 'sunset-gradient',
    name: 'Sunset Glow',
    category: 'vibrant',
    description: 'Warm sunset gradient',
    theme: {
      id: 'sunset-gradient',
      name: 'Sunset Glow',
      category: 'vibrant',
      background: {
        type: 'gradient',
        gradientFrom: '#ff6b6b',
        gradientTo: '#ee5a6f',
        gradientVia: '#feca57',
        gradientDirection: 'to-br',
      },
      typography: {
        titleColor: '#FFFFFF',
        bodyColor: '#FEF3C7',
        titleFont: 'poppins',
        bodyFont: 'inter',
      },
      button: {
        size: 'large',
        variant: 'shadow',
        backgroundColor: '#FFFFFF',
        textColor: '#DC2626',
        borderRadius: 'xl',
        hoverEffect: 'lift',
      },
    },
  },
  {
    id: 'ocean-wave',
    name: 'Ocean Wave',
    category: 'vibrant',
    description: 'Cool ocean-inspired gradient',
    theme: {
      id: 'ocean-wave',
      name: 'Ocean Wave',
      category: 'vibrant',
      background: {
        type: 'gradient',
        gradientFrom: '#0EA5E9',
        gradientTo: '#2563EB',
        gradientDirection: 'to-br',
      },
      typography: {
        titleColor: '#FFFFFF',
        bodyColor: '#DBEAFE',
        titleFont: 'inter',
        bodyFont: 'inter',
      },
      button: {
        size: 'medium',
        variant: 'fill',
        backgroundColor: '#FFFFFF',
        textColor: '#0EA5E9',
        borderRadius: 'full',
        hoverEffect: 'glow',
      },
    },
  },
  {
    id: 'business-professional',
    name: 'Business Pro',
    category: 'professional',
    description: 'Professional corporate theme',
    theme: {
      id: 'business-professional',
      name: 'Business Pro',
      category: 'professional',
      background: {
        type: 'solid',
        color: '#F9FAFB',
      },
      typography: {
        titleColor: '#111827',
        bodyColor: '#4B5563',
        titleFont: 'montserrat',
        bodyFont: 'inter',
      },
      button: {
        size: 'medium',
        variant: 'fill',
        backgroundColor: '#2563EB',
        textColor: '#FFFFFF',
        borderRadius: 'md',
        hoverEffect: 'lift',
      },
    },
  },
  {
    id: 'creative-bold',
    name: 'Creative Bold',
    category: 'creative',
    description: 'Bold and expressive design',
    theme: {
      id: 'creative-bold',
      name: 'Creative Bold',
      category: 'creative',
      background: {
        type: 'solid',
        color: '#FBBF24',
      },
      typography: {
        titleColor: '#1F2937',
        bodyColor: '#374151',
        titleFont: 'poppins',
        bodyFont: 'inter',
        titleWeight: '800',
      },
      button: {
        size: 'large',
        variant: 'fill',
        backgroundColor: '#1F2937',
        textColor: '#FBBF24',
        borderRadius: 'none',
        hoverEffect: 'grow',
      },
    },
  },
  {
    id: 'pastel-dreams',
    name: 'Pastel Dreams',
    category: 'creative',
    description: 'Soft pastel aesthetic',
    theme: {
      id: 'pastel-dreams',
      name: 'Pastel Dreams',
      category: 'creative',
      background: {
        type: 'gradient',
        gradientFrom: '#ffecd2',
        gradientTo: '#fcb69f',
        gradientDirection: 'to-br',
      },
      typography: {
        titleColor: '#92400E',
        bodyColor: '#78350F',
        titleFont: 'playfair',
        bodyFont: 'lora',
      },
      button: {
        size: 'medium',
        variant: 'soft',
        backgroundColor: '#FFFFFF',
        textColor: '#DC2626',
        borderRadius: 'full',
        hoverEffect: 'pulse',
      },
    },
  },
  {
    id: 'neon-cyber',
    name: 'Neon Cyber',
    category: 'creative',
    description: 'Futuristic neon theme',
    theme: {
      id: 'neon-cyber',
      name: 'Neon Cyber',
      category: 'creative',
      background: {
        type: 'solid',
        color: '#0F0F23',
      },
      typography: {
        titleColor: '#00FF9F',
        bodyColor: '#A0AEC0',
        titleFont: 'inter',
        bodyFont: 'inter',
      },
      button: {
        size: 'medium',
        variant: 'outline',
        backgroundColor: '#00FF9F',
        textColor: '#00FF9F',
        borderRadius: 'none',
        hoverEffect: 'glow',
      },
    },
  },
  {
    id: 'forest-nature',
    name: 'Forest Nature',
    category: 'creative',
    description: 'Earthy and natural',
    theme: {
      id: 'forest-nature',
      name: 'Forest Nature',
      category: 'creative',
      background: {
        type: 'gradient',
        gradientFrom: '#2d5016',
        gradientTo: '#4a7c59',
        gradientDirection: 'to-b',
      },
      typography: {
        titleColor: '#ECFDF5',
        bodyColor: '#D1FAE5',
        titleFont: 'playfair',
        bodyFont: 'lora',
      },
      button: {
        size: 'medium',
        variant: 'fill',
        backgroundColor: '#ECFDF5',
        textColor: '#065F46',
        borderRadius: 'xl',
        hoverEffect: 'lift',
      },
    },
  },
];

// Helper to get preset by ID
export function getPresetById(id: string): ThemePreset | undefined {
  return THEME_PRESETS.find(preset => preset.id === id);
}

// Get presets by category
export function getPresetsByCategory(category: PageTheme['category']): ThemePreset[] {
  return THEME_PRESETS.filter(preset => preset.category === category);
}
