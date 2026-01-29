import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, 
  Type, 
  MousePointer2, 
  Sparkles,
  ChevronRight,
  Circle,
  Square,
  RectangleHorizontal,
  Blend,
  Moon,
  Leaf,
  Flame,
  Snowflake,
  Crown,
  Upload,
  X,
  Link,
  Globe
} from 'lucide-react';
import type { PageTheme, BackgroundStyle, ButtonStyle, TypographyStyle } from '../../types/theme';
import { BackgroundPicker } from './BackgroundPicker';
import { animations } from '@/utils/designSystem';

// Section Card component - defined outside to prevent recreation during render
interface SectionCardProps {
  id: string;
  activeSection: string | null;
  setActiveSection: (id: string | null) => void;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  color: string;
  children: React.ReactNode;
}

function SectionCard({ 
  id, 
  activeSection,
  setActiveSection,
  icon: Icon, 
  title, 
  subtitle,
  color,
  children 
}: SectionCardProps) {
  const isOpen = activeSection === id;
  
  return (
    <motion.div 
      className="glass-card rounded-2xl border-2 border-violet-200/50 overflow-hidden shadow-lg hover:shadow-glow-violet transition-all duration-300"
      initial={false}
      {...animations.hover.scaleSmall}
    >
      {/* Header - Premium gradient with glass effect */}
      <div
        onClick={() => setActiveSection(isOpen ? null : id)}
        className={`w-full p-5 flex items-center gap-4 transition-all duration-300 cursor-pointer relative overflow-hidden ${
          isOpen 
            ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600' 
            : 'bg-gradient-to-r from-white via-violet-50/30 to-purple-50/30 hover:from-violet-50 hover:to-purple-50'
        }`}
      >
        {/* Animated background shimmer */}
        {isOpen && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        )}
        
        <motion.div 
          className={`w-12 h-12 rounded-xl ${isOpen ? 'bg-white/20 shadow-lg' : color} flex items-center justify-center backdrop-blur-sm`}
          animate={{ rotate: isOpen ? 360 : 0 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <Icon className={`w-6 h-6 ${isOpen ? 'text-white' : 'text-white'}`} />
        </motion.div>
        
        <div className="flex-1 text-left relative z-10">
          <div className={`font-bold text-base ${isOpen ? 'text-white' : 'text-stone-800'}`}>{title}</div>
          <div className={`text-xs font-medium ${isOpen ? 'text-white/90' : 'text-stone-500'}`}>{subtitle}</div>
        </div>
        
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.3, type: "spring" }}
        >
          <ChevronRight className={`w-6 h-6 ${isOpen ? 'text-white' : 'text-violet-600'}`} />
        </motion.div>
      </div>

      {/* Content - Modern spacing and styling */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 border-t-2 border-violet-200/30 bg-gradient-to-br from-white via-violet-50/20 to-purple-50/20" onClick={(e) => e.stopPropagation()}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface PageSettingsProps {
  theme: PageTheme;
  onChange: (theme: PageTheme) => void;
}

// Quick theme presets with icons
const THEME_PRESETS = [
  { 
    id: 'minimal', 
    name: 'Minimal', 
    icon: Circle,
    colors: ['#ffffff', '#f5f5f5'],
    theme: {
      background: { type: 'solid' as const, color: '#ffffff' },
      typography: { titleFont: 'inter' as const, titleColor: '#1a1a1a', bodyColor: '#4a4a4a' },
      button: { style: 'outline' as const, borderRadius: 'md' as const, backgroundColor: '#1a1a1a', textColor: '#ffffff' },
      branding: { primaryColor: '#1a1a1a', secondaryColor: '#4a4a4a', accentColor: '#3B82F6' }
    }
  },
  { 
    id: 'dark', 
    name: 'Dark', 
    icon: Moon,
    colors: ['#1a1a2e', '#16213e'],
    theme: {
      background: { type: 'gradient' as const, gradientFrom: '#1a1a2e', gradientTo: '#16213e', gradientDirection: 'to-br' as const },
      typography: { titleFont: 'inter' as const, titleColor: '#ffffff', bodyColor: '#a0a0a0' },
      button: { style: 'solid' as const, borderRadius: 'lg' as const, backgroundColor: '#3B82F6', textColor: '#ffffff' },
      branding: { primaryColor: '#3B82F6', secondaryColor: '#60A5FA', accentColor: '#93C5FD' }
    }
  },
  { 
    id: 'sunset', 
    name: 'Sunset', 
    icon: Flame,
    colors: ['#ff6b6b', '#feca57'],
    theme: {
      background: { type: 'gradient' as const, gradientFrom: '#ff6b6b', gradientTo: '#feca57', gradientDirection: 'to-br' as const },
      typography: { titleFont: 'poppins' as const, titleColor: '#ffffff', bodyColor: '#fff5f5' },
      button: { style: 'solid' as const, borderRadius: 'full' as const, backgroundColor: '#ffffff', textColor: '#ff6b6b' },
      branding: { primaryColor: '#ff6b6b', secondaryColor: '#feca57', accentColor: '#ffffff' }
    }
  },
  { 
    id: 'ocean', 
    name: 'Ocean', 
    icon: Snowflake,
    colors: ['#667eea', '#764ba2'],
    theme: {
      background: { type: 'gradient' as const, gradientFrom: '#667eea', gradientTo: '#764ba2', gradientDirection: 'to-br' as const },
      typography: { titleFont: 'inter' as const, titleColor: '#ffffff', bodyColor: '#e0e0ff' },
      button: { style: 'solid' as const, borderRadius: 'xl' as const, backgroundColor: '#ffffff', textColor: '#667eea' },
      branding: { primaryColor: '#667eea', secondaryColor: '#764ba2', accentColor: '#ffffff' }
    }
  },
  { 
    id: 'forest', 
    name: 'Forest', 
    icon: Leaf,
    colors: ['#134e5e', '#71b280'],
    theme: {
      background: { type: 'gradient' as const, gradientFrom: '#134e5e', gradientTo: '#71b280', gradientDirection: 'to-br' as const },
      typography: { titleFont: 'merriweather' as const, titleColor: '#ffffff', bodyColor: '#d4edda' },
      button: { style: 'solid' as const, borderRadius: 'md' as const, backgroundColor: '#2d6a4f', textColor: '#ffffff' },
      branding: { primaryColor: '#2d6a4f', secondaryColor: '#71b280', accentColor: '#d4edda' }
    }
  },
  { 
    id: 'royal', 
    name: 'Royal', 
    icon: Crown,
    colors: ['#141e30', '#243b55'],
    theme: {
      background: { type: 'gradient' as const, gradientFrom: '#141e30', gradientTo: '#243b55', gradientDirection: 'to-br' as const },
      typography: { titleFont: 'playfair' as const, titleColor: '#ffd700', bodyColor: '#c0c0c0' },
      button: { style: 'solid' as const, borderRadius: 'sm' as const, backgroundColor: '#ffd700', textColor: '#141e30' },
      branding: { primaryColor: '#ffd700', secondaryColor: '#c0c0c0', accentColor: '#243b55' }
    }
  }
];

// Font options with preview
const FONT_OPTIONS = [
  { id: 'inter', name: 'Inter', style: 'Modern Sans' },
  { id: 'poppins', name: 'Poppins', style: 'Friendly' },
  { id: 'playfair', name: 'Playfair', style: 'Elegant Serif' },
  { id: 'merriweather', name: 'Merriweather', style: 'Classic Serif' },
  { id: 'spacegrotesk', name: 'Space Grotesk', style: 'Tech' },
  { id: 'dmSans', name: 'DM Sans', style: 'Clean' }
] as const;

// Button style options
const BUTTON_STYLES = [
  { id: 'solid', name: 'Filled', icon: Square },
  { id: 'outline', name: 'Outline', icon: RectangleHorizontal },
  { id: 'soft', name: 'Soft', icon: Blend }
] as const;

// Border radius presets - aligned with ButtonStyle type
const RADIUS_OPTIONS = [
  { value: 'none', label: 'Sharp' },
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'full', label: 'Pill' }
] as const;

// Hover effect options
const HOVER_EFFECTS = [
  { value: 'none', label: 'None' },
  { value: 'scale', label: 'Scale' },
  { value: 'lift', label: 'Lift' },
  { value: 'glow', label: 'Glow' }
] as const;

export function PageSettings({ theme, onChange }: PageSettingsProps) {
  const [activeSection, setActiveSection] = useState<string | null>('themes');

  const updateTheme = (updates: Partial<PageTheme>) => {
    onChange({ ...theme, ...updates });
  };

  const applyPreset = (preset: typeof THEME_PRESETS[0]) => {
    onChange({
      ...theme,
      background: preset.theme.background as BackgroundStyle,
      typography: { ...theme.typography, ...preset.theme.typography } as TypographyStyle,
      button: { ...theme.button, ...preset.theme.button } as ButtonStyle,
      branding: { ...theme.branding, ...preset.theme.branding }
    });
  };

  return (
    <div className="space-y-3 p-4 bg-gradient-to-b from-white via-violet-50/30 to-purple-50/30 pattern-dots">
      {/* Quick Themes Section */}
      <SectionCard
        id="themes"
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        icon={Sparkles}
        title="Quick Themes"
        subtitle="One-tap style presets"
        color="bg-gradient-to-br from-violet-500 to-purple-600"
      >
        <div className="grid grid-cols-2 gap-4 pt-2">
          {THEME_PRESETS.map((preset) => {
            const PresetIcon = preset.icon;
            return (
              <motion.button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-violet-200/50 hover:border-violet-400 transition-all shadow-lg hover:shadow-glow-violet"
                {...animations.hover.liftMore}
                {...animations.tap}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: THEME_PRESETS.indexOf(preset) * 0.05 }}
              >
                {/* Premium gradient background with shimmer */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${preset.colors[0]}, ${preset.colors[1]})`
                  }}
                />
                
                {/* Shimmer overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                  style={{ animation: 'shimmer 2s infinite' }} 
                />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                  {/* Icon with backdrop */}
                  <div className="mb-2 w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <PresetIcon className="w-7 h-7 text-white drop-shadow-lg" />
                  </div>
                  
                  {/* Name badge */}
                  <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-lg">
                    <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r" 
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${preset.colors[0]}, ${preset.colors[1]})`
                      }}
                    >
                      {preset.name}
                    </span>
                  </div>
                </div>
                
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />
                
                {/* Checkmark when selected (optional future feature) */}
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </motion.button>
            );
          })}
        </div>
      </SectionCard>

      {/* Background Section */}
      <SectionCard
        id="background"
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        icon={Palette}
        title="Background"
        subtitle="Colors, gradients & images"
        color="bg-gradient-to-br from-pink-500 to-rose-500"
      >
        <div className="pt-4">
          <BackgroundPicker
            value={theme.background}
            onChange={(background) => updateTheme({ background })}
          />
        </div>
      </SectionCard>

      {/* Typography Section */}
      <SectionCard
        id="typography"
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        icon={Type}
        title="Typography"
        subtitle="Fonts & text styling"
        color="bg-gradient-to-br from-blue-500 to-cyan-500"
      >
        <div className="space-y-6">
          {/* Font Family Quick Select */}
          <div>
            <label className="text-sm font-bold text-stone-700 mb-3 block flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
              Font Family
            </label>
            <div className="grid grid-cols-2 gap-3">
              {FONT_OPTIONS.map((font) => (
                <motion.button
                  key={font.id}
                  onClick={() => updateTheme({
                    typography: { ...theme.typography, titleFont: font.id as TypographyStyle['titleFont'], bodyFont: font.id as TypographyStyle['bodyFont'] }
                  })}
                  className={`p-4 rounded-xl border-2 text-left transition-all shadow-md ${
                    theme.typography?.titleFont === font.id
                      ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-glow-violet'
                      : 'border-stone-200 bg-white hover:border-blue-300 hover:shadow-lg'
                  }`}
                  {...animations.hover.scaleSmall}
                  {...animations.tap}
                >
                  <div 
                    className={`font-semibold text-base truncate mb-1 ${
                      theme.typography?.titleFont === font.id ? 'text-blue-600' : 'text-stone-800'
                    }`}
                    style={{ fontFamily: font.name }}
                  >
                    {font.name}
                  </div>
                  <div className="text-xs text-stone-500">{font.style}</div>
                  {theme.typography?.titleFont === font.id && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-blue-600 font-medium">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Active
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Text Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-stone-700 mb-3 block flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-500" />
                Title Color
              </label>
              <div className="relative group">
                <input
                  type="color"
                  value={theme.typography?.titleColor || '#1a1a1a'}
                  onChange={(e) => updateTheme({
                    typography: { ...theme.typography, titleColor: e.target.value }
                  })}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <motion.div 
                  className="h-14 rounded-xl border-2 border-violet-200 flex items-center justify-center gap-3 cursor-pointer hover:border-violet-400 transition-all shadow-md hover:shadow-glow-violet bg-white overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div 
                    className="w-8 h-8 rounded-lg border-2 border-stone-200 shadow-lg group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: theme.typography?.titleColor || '#1a1a1a' }}
                  />
                  <span className="text-sm font-semibold text-stone-700">Title</span>
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                    style={{ animation: 'shimmer 2s infinite' }}
                  />
                </motion.div>
              </div>
            </div>
            <div>
              <label className="text-sm font-bold text-stone-700 mb-3 block flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
                Body Color
              </label>
              <div className="relative group">
                <input
                  type="color"
                  value={theme.typography?.bodyColor || '#4a4a4a'}
                  onChange={(e) => updateTheme({
                    typography: { ...theme.typography, bodyColor: e.target.value }
                  })}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <motion.div 
                  className="h-14 rounded-xl border-2 border-blue-200 flex items-center justify-center gap-3 cursor-pointer hover:border-blue-400 transition-all shadow-md hover:shadow-glow-violet bg-white overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div 
                    className="w-8 h-8 rounded-lg border-2 border-stone-200 shadow-lg group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: theme.typography?.bodyColor || '#4a4a4a' }}
                  />
                  <span className="text-sm font-semibold text-stone-700">Body</span>
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                    style={{ animation: 'shimmer 2s infinite' }}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Buttons Section */}
      <SectionCard
        id="buttons"
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        icon={MousePointer2}
        title="Buttons"
        subtitle="Style & appearance"
        color="bg-gradient-to-br from-amber-500 to-orange-500"
      >
        <div className="space-y-6">
          {/* Button Style */}
          <div>
            <label className="text-sm font-bold text-stone-700 mb-3 block flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
              Button Style
            </label>
            <div className="grid grid-cols-3 gap-3">
              {BUTTON_STYLES.map((style) => {
                const StyleIcon = style.icon;
                return (
                  <motion.button
                    key={style.id}
                    onClick={() => updateTheme({
                      button: { ...theme.button, style: style.id }
                    })}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all shadow-md ${
                      theme.button?.style === style.id
                        ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 shadow-glow-violet'
                        : 'border-stone-200 bg-white hover:border-amber-300 hover:shadow-lg'
                    }`}
                    {...animations.hover.scale}
                    {...animations.tap}
                  >
                    <StyleIcon className={`w-6 h-6 ${theme.button?.style === style.id ? 'text-amber-600' : 'text-stone-500'}`} />
                    <span className={`text-xs font-semibold ${theme.button?.style === style.id ? 'text-amber-700' : 'text-stone-600'}`}>
                      {style.name}
                    </span>
                    {theme.button?.style === style.id && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Border Radius */}
          <div>
            <label className="text-sm font-bold text-stone-700 mb-3 block flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-500" />
              Corner Radius
            </label>
            <div className="grid grid-cols-3 gap-2">
              {RADIUS_OPTIONS.map((radius) => (
                <motion.button
                  key={radius.value}
                  onClick={() => updateTheme({
                    button: { ...theme.button, borderRadius: radius.value }
                  })}
                  className={`py-3 px-3 rounded-xl border-2 text-sm font-semibold transition-all shadow-md ${
                    theme.button?.borderRadius === radius.value
                      ? 'border-violet-400 bg-gradient-to-br from-violet-50 to-purple-50 text-violet-700 shadow-glow-violet'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-violet-300 hover:shadow-lg'
                  }`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {radius.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Button Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-stone-700 mb-3 block flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500" />
                Background
              </label>
              <div className="relative group">
                <input
                  type="color"
                  value={theme.button?.backgroundColor || '#000000'}
                  onChange={(e) => updateTheme({
                    button: { ...theme.button, backgroundColor: e.target.value }
                  })}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <motion.div 
                  className="h-14 rounded-xl border-2 border-pink-200 flex items-center justify-center gap-3 cursor-pointer hover:border-pink-400 transition-all shadow-md hover:shadow-glow-violet bg-white overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div 
                    className="w-8 h-8 rounded-lg border-2 border-stone-200 shadow-lg group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: theme.button?.backgroundColor || '#000000' }}
                  />
                  <span className="text-sm font-semibold text-stone-700">Background</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                    style={{ animation: 'shimmer 2s infinite' }}
                  />
                </motion.div>
              </div>
            </div>
            <div>
              <label className="text-sm font-bold text-stone-700 mb-3 block flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                Text Color
              </label>
              <div className="relative group">
                <input
                  type="color"
                  value={theme.button?.textColor || '#ffffff'}
                  onChange={(e) => updateTheme({
                    button: { ...theme.button, textColor: e.target.value }
                  })}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <motion.div 
                  className="h-14 rounded-xl border-2 border-emerald-200 flex items-center justify-center gap-3 cursor-pointer hover:border-emerald-400 transition-all shadow-md hover:shadow-glow-violet bg-white overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div 
                    className="w-8 h-8 rounded-lg border-2 border-stone-200 shadow-lg group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: theme.button?.textColor || '#ffffff' }}
                  />
                  <span className="text-sm font-semibold text-stone-700">Text</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                    style={{ animation: 'shimmer 2s infinite' }}
                  />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Hover Effect */}
          <div>
            <label className="text-sm font-bold text-stone-700 mb-3 block flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
              Hover Effect
            </label>
            <div className="grid grid-cols-3 gap-2">
              {HOVER_EFFECTS.map((effect) => (
                <motion.button
                  key={effect.value}
                  onClick={() => updateTheme({
                    button: { ...theme.button, hoverEffect: effect.value }
                  })}
                  className={`py-3 px-3 rounded-xl border-2 text-sm font-semibold transition-all shadow-md ${
                    theme.button?.hoverEffect === effect.value
                      ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-700 shadow-glow-violet'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-blue-300 hover:shadow-lg'
                  }`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {effect.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Live Preview */}
          <div>
            <label className="text-sm font-bold text-stone-700 mb-3 block flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500" />
              Live Preview
            </label>
            <motion.div 
              className="p-6 bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl flex justify-center border-2 border-stone-200 shadow-inner"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.button
                className="px-8 py-3.5 font-semibold shadow-lg"
                style={{
                  backgroundColor: theme.button?.style === 'solid' ? theme.button?.backgroundColor : 'transparent',
                  color: theme.button?.style === 'solid' ? (theme.button?.textColor || '#ffffff') : theme.button?.backgroundColor,
                  border: theme.button?.style === 'outline' ? `2px solid ${theme.button?.backgroundColor}` : 'none',
                  borderRadius: theme.button?.borderRadius === 'none' ? 0 : 
                               theme.button?.borderRadius === 'sm' ? 4 :
                               theme.button?.borderRadius === 'md' ? 8 :
                               theme.button?.borderRadius === 'lg' ? 12 :
                               theme.button?.borderRadius === 'xl' ? 16 :
                               theme.button?.borderRadius === 'full' ? 9999 : 8,
                  ...(theme.button?.style === 'soft' && {
                    backgroundColor: (theme.button?.backgroundColor || '#000000') + '20',
                    color: theme.button?.backgroundColor
                  })
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Click Me!
              </motion.button>
            </motion.div>
          </div>
        </div>
      </SectionCard>

      {/* Branding Section */}
      <SectionCard
        id="branding"
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        icon={Crown}
        title="Branding"
        subtitle="Logo, favicon & identity"
        color="bg-gradient-to-br from-emerald-500 to-teal-500"
      >
        <div className="pt-4 space-y-5">
          {/* Logo Upload */}
          <div>
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2 block">Logo</label>
            <div className="border-2 border-dashed border-stone-300 rounded-xl p-4 hover:border-emerald-500 transition-colors bg-white">
              {theme.branding?.logoUrl ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="relative group">
                    <img 
                      src={theme.branding.logoUrl} 
                      alt="Logo" 
                      className="max-h-20 max-w-full object-contain rounded-lg"
                    />
                    <button 
                      onClick={() => updateTheme({
                        branding: { ...theme.branding, logoUrl: undefined }
                      })}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="text-xs text-stone-500">Click × to remove</span>
                </div>
              ) : (
                <label className="flex flex-col items-center gap-2 cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-emerald-900/30 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-stone-700">Upload Logo</div>
                    <div className="text-xs text-stone-500">PNG, JPG, SVG up to 2MB</div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          updateTheme({
                            branding: { ...theme.branding, logoUrl: reader.result as string }
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              )}
              {/* URL Input - Always visible */}
              <div className="mt-3 pt-3 border-t border-zinc-700">
                <div className="flex items-center gap-2 mb-2">
                  <Link className="w-3 h-3 text-stone-500" />
                  <span className="text-xs text-stone-500">Or use image URL</span>
                </div>
                <input
                  type="url"
                  placeholder="https://example.com/logo.png"
                  value={theme.branding?.logoUrl || ''}
                  className="w-full px-3 py-2.5 text-xs text-white bg-zinc-700 border border-stone-300 rounded-lg placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  onChange={(e) => updateTheme({
                    branding: { ...theme.branding, logoUrl: e.target.value }
                  })}
                />
              </div>
            </div>
          </div>

          {/* Favicon */}
          <div>
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2 block">Favicon</label>
            <div className="border border-stone-300 rounded-xl p-3 hover:border-emerald-500 transition-colors bg-white">
              <div className="flex items-center gap-3">
                {theme.branding?.faviconUrl ? (
                  <div className="relative group">
                    <div className="w-10 h-10 rounded-lg bg-zinc-700 flex items-center justify-center overflow-hidden">
                      <img 
                        src={theme.branding.faviconUrl} 
                        alt="Favicon" 
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <button 
                      onClick={() => updateTheme({
                        branding: { ...theme.branding, faviconUrl: undefined }
                      })}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X className="w-2 h-2" />
                    </button>
                  </div>
                ) : (
                  <label className="w-10 h-10 rounded-lg bg-zinc-700 flex items-center justify-center cursor-pointer hover:bg-emerald-900/30 transition-colors">
                    <Globe className="w-5 h-5 text-stone-500" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            updateTheme({
                              branding: { ...theme.branding, faviconUrl: reader.result as string }
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                )}
                <div className="flex-1">
                  <input
                    type="url"
                    placeholder="https://example.com/favicon.ico"
                    value={theme.branding?.faviconUrl || ''}
                    className="w-full px-3 py-2.5 text-xs text-white bg-zinc-700 border border-stone-300 rounded-lg placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    onChange={(e) => updateTheme({
                      branding: { ...theme.branding, faviconUrl: e.target.value }
                    })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Site Info */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2 block">Site Title</label>
              <input
                type="text"
                value={theme.branding?.siteName || ''}
                onChange={(e) => updateTheme({
                  branding: { ...theme.branding, siteName: e.target.value }
                })}
                placeholder="My Awesome Page"
                className="w-full px-3 py-2.5 text-sm text-white bg-white border border-stone-300 rounded-lg placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2 block">Tagline</label>
              <input
                type="text"
                value={theme.branding?.tagline || ''}
                onChange={(e) => updateTheme({
                  branding: { ...theme.branding, tagline: e.target.value }
                })}
                placeholder="Your catchy tagline here"
                className="w-full px-3 py-2.5 text-sm text-white bg-white border border-stone-300 rounded-lg placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2 block">Copyright Text</label>
              <input
                type="text"
                value={theme.branding?.copyrightText || ''}
                onChange={(e) => updateTheme({
                  branding: { ...theme.branding, copyrightText: e.target.value }
                })}
                placeholder="© 2025 Your Company. All rights reserved."
                className="w-full px-3 py-2.5 text-sm text-white bg-white border border-stone-300 rounded-lg placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Brand Colors */}
          <div>
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2 block">Brand Colors</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'primaryColor', label: 'Primary', default: '#3B82F6' },
                { key: 'secondaryColor', label: 'Secondary', default: '#8b5cf6' },
                { key: 'accentColor', label: 'Accent', default: '#ec4899' }
              ].map((color) => (
                <div key={color.key} className="relative">
                  <input
                    type="color"
                    value={(theme.branding as Record<string, string | undefined>)?.[color.key] || color.default}
                    onChange={(e) => updateTheme({
                      branding: { ...theme.branding, [color.key]: e.target.value }
                    })}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="p-2 rounded-xl border-2 border-stone-300 bg-white flex flex-col items-center gap-1 cursor-pointer hover:border-emerald-500 transition-colors">
                    <div 
                      className="w-8 h-8 rounded-lg shadow-sm ring-2 ring-zinc-600"
                      style={{ backgroundColor: (theme.branding as Record<string, string | undefined>)?.[color.key] || color.default }}
                    />
                    <span className="text-[10px] font-medium text-zinc-300">{color.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Preview */}
          <div className="pt-2">
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2 block">Preview</label>
            <div className="p-4 bg-white border border-zinc-700 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                {theme.branding?.logoUrl && (
                  <img 
                    src={theme.branding.logoUrl} 
                    alt="Logo preview" 
                    className="h-8 object-contain"
                  />
                )}
                <div>
                  <div className="font-semibold text-white text-sm">
                    {theme.branding?.siteName || 'Your Site Name'}
                  </div>
                  {theme.branding?.tagline && (
                    <div className="text-xs text-stone-500">{theme.branding.tagline}</div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: theme.branding?.primaryColor || '#3B82F6' }}
                  title="Primary"
                />
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: theme.branding?.secondaryColor || '#8b5cf6' }}
                  title="Secondary"
                />
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: theme.branding?.accentColor || '#ec4899' }}
                  title="Accent"
                />
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
