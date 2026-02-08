import { useState } from 'react';
import { Palette, Type, Layout, Sparkles, Image, Code, Info, Upload, X, Square, Droplet, Grid3x3, RotateCcw, Eye, Lightbulb } from 'lucide-react';
import type { PageTheme } from '../../types/theme';
import { THEME_PRESETS } from '@/config/themePresets';
import { ColorInput } from '@/components/ui/color-picker';
import { Tooltip } from '@/components/ui/tooltip';

interface PageSettingsProps {
  theme: PageTheme;
  onChange: (theme: PageTheme) => void;
}

type SectionType = 'quick' | 'background' | 'typography' | 'branding' | 'layout' | 'advanced';

export function PageSettings({ theme, onChange }: PageSettingsProps) {
  const [activeSection, setActiveSection] = useState<SectionType>('quick');
  const [customCSS, setCustomCSS] = useState<string>('');
  const [customHTML, setCustomHTML] = useState<string>('');
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);

  const updateTheme = (updates: Partial<PageTheme>) => {
    const newTheme = { 
      ...theme, 
      ...updates,
      // Deep merge for nested objects
      background: updates.background ? { ...theme.background, ...updates.background } : theme.background,
      typography: updates.typography ? { ...theme.typography, ...updates.typography } : theme.typography,
      branding: updates.branding ? { ...theme.branding, ...updates.branding } : theme.branding,
      button: updates.button ? { ...theme.button, ...updates.button } : theme.button,
      header: updates.header ? { ...theme.header, ...updates.header } : theme.header,
      footer: updates.footer ? { ...theme.footer, ...updates.footer } : theme.footer,
    };
    onChange(newTheme);
  };

  // Handle logo upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploadingLogo(true);
    try {
      // TODO: Upload to your backend/cloud storage
      // For now, just use a data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        updateTheme({
          branding: {
            ...theme.branding,
            logoUrl: dataUrl
          }
        });
        setIsUploadingLogo(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Logo upload failed:', error);
      setIsUploadingLogo(false);
    }
  };

  // Handle favicon upload
  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploadingFavicon(true);
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        updateTheme({
          branding: {
            ...theme.branding,
            faviconUrl: dataUrl
          }
        });
        setIsUploadingFavicon(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Favicon upload failed:', error);
      setIsUploadingFavicon(false);
    }
  };

  // Section options for dropdown
  const sections: Array<{ id: SectionType; label: string; icon: typeof Sparkles }> = [
    { id: 'quick', label: 'Quick Themes', icon: Sparkles },
    { id: 'background', label: 'Background', icon: Palette },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'branding', label: 'Branding', icon: Image },
    { id: 'layout', label: 'Layout', icon: Layout },
    { id: 'advanced', label: 'Advanced', icon: Code },
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-slate-50">
      {/* Beautiful Header with Gradient - Compact */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-slate-200 bg-gradient-to-r from-violet-50 to-purple-50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
            <Palette className="w-3.5 h-3.5 text-white" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Page Design</h2>
          <Tooltip content="Customize your page appearance with themes, colors, fonts, and more">
            <Info className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-help transition-colors" />
          </Tooltip>
        </div>
      </div>

      {/* Tab Navigation - Fixed Grid, No Scroll */}
      <div className="flex-shrink-0 px-3 py-2 border-b border-slate-200 bg-white">
        <div className="grid grid-cols-3 gap-1.5">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            // Tooltip descriptions for each section
            const tooltips = {
              quick: 'Browse and apply pre-designed themes instantly',
              background: 'Customize background colors, gradients, and patterns',
              typography: 'Set fonts, sizes, and colors for text',
              branding: 'Add your logo and favicon',
              layout: 'Adjust spacing, alignment, and structure',
              advanced: 'Custom CSS and HTML for developers'
            };
            
            return (
              <Tooltip key={section.id} content={tooltips[section.id] || section.label}>
                <button
                  onClick={() => setActiveSection(section.id)}
                  className={`flex flex-col items-center justify-center gap-1 py-2.5 px-1 rounded-lg text-[10px] font-semibold transition-all min-h-[60px] ${
                    isActive
                      ? 'bg-violet-600 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-center leading-tight">{section.label}</span>
                </button>
              </Tooltip>
            );
          })}
        </div>
      </div>

      {/* Content with Custom Scrollbar */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {activeSection === 'quick' && (
          <div className="p-3 space-y-3">
            {/* Current Theme Card - Beautiful */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 p-0.5 shadow-lg">
              <div className="bg-white rounded-[11px] p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-violet-600" />
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Current Theme</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">{theme.name || 'Custom Theme'}</h3>
                    {theme.category && (
                      <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold bg-violet-100 text-violet-700 rounded-full capitalize">
                        {theme.category}
                      </span>
                    )}
                  </div>
                  {/* Color Preview */}
                  <div className="flex gap-1.5">
                    {theme.background?.color && (
                      <div 
                        className="w-8 h-8 rounded-lg shadow-md border-2 border-white"
                        style={{ backgroundColor: theme.background.color }}
                        title="Background"
                      />
                    )}
                    {theme.typography?.titleColor && (
                      <div 
                        className="w-8 h-8 rounded-lg shadow-md border-2 border-white"
                        style={{ backgroundColor: theme.typography.titleColor }}
                        title="Title Color"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Info Card - Helpful Tips */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-3 flex gap-2">
              <div className="flex-shrink-0 w-6 h-6 rounded-md bg-blue-500 flex items-center justify-center">
                <Lightbulb className="w-3 h-3 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-blue-900 mb-0.5">Quick Start Tip</p>
                <p className="text-[10px] text-blue-700 leading-relaxed">
                  Start with a preset theme, then customize colors, fonts, and layout in other tabs. Hit the reset button anytime to start fresh!
                </p>
              </div>
            </div>

            {/* Theme Presets Grid - Beautiful Cards */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-violet-600" />
                  Browse Themes
                </label>
                <Tooltip content="Apply first theme preset">
                  <button
                    onClick={() => {
                      const defaultPreset = THEME_PRESETS[0];
                      if (defaultPreset) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onChange(defaultPreset as any);
                      }
                    }}
                    className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-slate-600 hover:text-violet-600 hover:bg-violet-50 rounded-md transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                </Tooltip>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {THEME_PRESETS.map((preset) => {
                  const isActive = theme.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => {
                        updateTheme({
                          ...theme,
                          ...preset.theme,
                          id: preset.id,
                          name: preset.name,
                          category: preset.category,
                        });
                      }}
                      className={`
                        group relative text-left p-4 rounded-xl transition-all duration-200
                        ${isActive
                          ? 'bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-500 shadow-lg shadow-violet-200/50 scale-[1.02]'
                          : 'bg-white border-2 border-slate-200 hover:border-violet-300 hover:shadow-md'
                        }
                      `}
                    >
                      {/* Active Indicator */}
                      {isActive && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg ring-4 ring-white">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      
                      <div className="flex items-start gap-2">
                        {/* Color Preview Stack */}
                        <div className="flex-shrink-0">
                          <div className="flex gap-1">
                            {preset.theme.background && (
                              <div 
                                className="w-10 h-10 rounded-lg shadow-md border-2 border-white ring-1 ring-slate-200"
                                style={{ 
                                  backgroundColor: preset.theme.background.type === 'solid' 
                                    ? preset.theme.background.color 
                                    : preset.theme.background.gradientFrom 
                                }}
                                title="Background"
                              />
                            )}
                          </div>
                          <div className="flex gap-1 mt-1.5">
                            {preset.theme.typography?.titleColor && (
                              <div 
                                className="w-4 h-4 rounded border border-slate-200"
                                style={{ backgroundColor: preset.theme.typography.titleColor }}
                                title="Text"
                              />
                            )}
                            {preset.theme.button?.backgroundColor && (
                              <div 
                                className="w-4 h-4 rounded border border-slate-200"
                                style={{ backgroundColor: preset.theme.button.backgroundColor }}
                                title="Button"
                              />
                            )}
                          </div>
                        </div>
                        
                        {/* Theme Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-xs font-bold mb-1 ${isActive ? 'text-violet-900' : 'text-slate-900 group-hover:text-violet-600'}`}>
                            {preset.name}
                          </h4>
                          <p className={`text-xs leading-relaxed line-clamp-2 ${isActive ? 'text-violet-700' : 'text-slate-600'}`}>
                            {preset.description}
                          </p>
                          {preset.category && (
                            <span className={`inline-block mt-2 px-2 py-0.5 text-[10px] font-semibold rounded-full uppercase tracking-wide ${
                              isActive 
                                ? 'bg-violet-200 text-violet-800' 
                                : 'bg-slate-100 text-slate-600 group-hover:bg-violet-100 group-hover:text-violet-700'
                            }`}>
                              {preset.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'background' && (
          <div className="p-3 space-y-3">
            {/* Background Type - Beautiful Visual Selector */}
            <div className="bg-white rounded-lg border-2 border-slate-200 overflow-hidden shadow-sm">
              <div className="px-3 py-2 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
                    <Palette className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">Background Style</span>
                </div>
              </div>
              <div className="p-3">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { type: 'solid', label: 'Solid', Icon: Square, desc: 'Single color' },
                    { type: 'gradient', label: 'Gradient', Icon: Droplet, desc: 'Color blend' },
                    { type: 'pattern', label: 'Pattern', Icon: Grid3x3, desc: 'Repeating' },
                  ].map((option) => {
                    const isActive = theme.background.type === option.type;
                    return (
                      <button
                        key={option.type}
                        onClick={() => updateTheme({ 
                          background: { ...theme.background, type: option.type as 'solid' | 'gradient' | 'pattern' }
                        })}
                        className={`relative p-3 border-2 rounded-xl text-center transition-all duration-200 group ${
                          isActive
                            ? 'border-violet-500 bg-gradient-to-br from-violet-50 to-purple-50 shadow-md scale-105'
                            : 'border-slate-200 hover:border-violet-300 hover:shadow-sm'
                        }`}
                      >
                        {isActive && (
                          <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center shadow-md">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                        <option.Icon className={`w-5 h-5 mx-auto mb-2 ${isActive ? 'text-violet-600' : 'text-slate-600 group-hover:text-violet-500'}`} />
                        <p className={`text-xs font-bold mb-0.5 ${isActive ? 'text-violet-900' : 'text-slate-900'}`}>{option.label}</p>
                        <p className={`text-[10px] ${isActive ? 'text-violet-600' : 'text-slate-500'}`}>{option.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Solid Color */}
            {theme.background.type === 'solid' && (
              <div className="bg-white rounded-lg border-2 border-slate-200 overflow-hidden shadow-sm">
                <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Solid Color</span>
                  <Tooltip content="Choose a single color for your background">
                    <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-help" />
                  </Tooltip>
                </div>
                <div className="p-3 space-y-3">
                  {/* Quick Color Presets */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[10px] font-semibold text-slate-600 flex items-center gap-1">
                        <Lightbulb className="w-3 h-3" />
                        Quick Pick
                      </label>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {['#FFFFFF', '#F9FAFB', '#F3F4F6', '#E5E7EB', '#1F2937', '#111827'].map((color) => (
                        <Tooltip key={color} content={color === '#FFFFFF' ? 'White' : color === '#F9FAFB' ? 'Light Gray' : color === '#F3F4F6' ? 'Gray 100' : color === '#E5E7EB' ? 'Gray 200' : color === '#1F2937' ? 'Dark Gray' : 'Black'}>
                          <button
                            onClick={() => updateTheme({ background: { ...theme.background, color } })}
                            className={`w-8 h-8 rounded-md border-2 transition-all hover:scale-110 ${
                              theme.background.color === color 
                                ? 'border-violet-500 ring-2 ring-violet-200 scale-110' 
                                : 'border-slate-300 hover:border-slate-400'
                            }`}
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                  
                  {/* Custom Color Picker */}
                  <ColorInput
                    label="Custom Color"
                    value={theme.background.color || '#FFFFFF'}
                    onChange={(color) => updateTheme({ background: { ...theme.background, color } })}
                    description="Or pick any color you like"
                  />
                </div>
              </div>
            )}

            {/* Gradient */}
            {theme.background.type === 'gradient' && (
              <div className="bg-white rounded-lg border-2 border-slate-200 overflow-hidden shadow-sm">
                <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Gradient Colors</span>
                  <Tooltip content="Blend two colors for a beautiful gradient effect">
                    <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-help" />
                  </Tooltip>
                </div>
                <div className="p-3 space-y-3">
                  {/* Popular Gradient Presets */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[10px] font-semibold text-slate-600 flex items-center gap-1">
                        <Lightbulb className="w-3 h-3" />
                        Popular Gradients
                      </label>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { from: '#667eea', to: '#764ba2', name: 'Purple Dream' },
                        { from: '#f093fb', to: '#f5576c', name: 'Pink Sunset' },
                        { from: '#4facfe', to: '#00f2fe', name: 'Ocean Blue' },
                        { from: '#43e97b', to: '#38f9d7', name: 'Fresh Mint' },
                        { from: '#fa709a', to: '#fee140', name: 'Peachy' },
                        { from: '#30cfd0', to: '#330867', name: 'Deep Ocean' },
                        { from: '#a8edea', to: '#fed6e3', name: 'Soft Pastels' },
                        { from: '#ff9a9e', to: '#fecfef', name: 'Rose Gold' },
                      ].map((preset) => (
                        <Tooltip key={preset.name} content={preset.name}>
                          <button
                            onClick={() => updateTheme({ 
                              background: { 
                                ...theme.background, 
                                gradientFrom: preset.from,
                                gradientTo: preset.to 
                              } 
                            })}
                            className={`h-10 rounded-md border-2 transition-all hover:scale-105 ${
                              theme.background.gradientFrom === preset.from && theme.background.gradientTo === preset.to
                                ? 'border-violet-500 ring-2 ring-violet-200 scale-105'
                                : 'border-slate-300 hover:border-slate-400'
                            }`}
                            style={{ 
                              background: `linear-gradient(135deg, ${preset.from}, ${preset.to})`
                            }}
                            title={preset.name}
                          />
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                  
                  {/* Custom Gradient Colors */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <ColorInput
                      label="From Color"
                      value={theme.background.gradientFrom || '#667eea'}
                      onChange={(color) => updateTheme({ background: { ...theme.background, gradientFrom: color } })}
                      description="Starting color"
                    />
                    <ColorInput
                      label="To Color"
                      value={theme.background.gradientTo || '#764ba2'}
                      onChange={(color) => updateTheme({ background: { ...theme.background, gradientTo: color } })}
                      description="Ending color"
                    />
                  </div>
                  
                  {/* Live Gradient Preview */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-slate-900 flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        Live Preview
                      </label>
                    </div>
                    <div 
                      className="h-20 rounded-lg border-2 border-slate-200 shadow-sm relative overflow-hidden group"
                      style={{ 
                        background: `linear-gradient(to bottom right, ${theme.background.gradientFrom || '#667eea'}, ${theme.background.gradientTo || '#764ba2'})`
                      }}
                    >
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all flex items-center justify-center">
                        <span className="text-white text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 bg-black bg-opacity-50 rounded">
                          {theme.background.gradientFrom} → {theme.background.gradientTo}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pattern */}
            {theme.background.type === 'pattern' && (
              <div className="border-2 border-border rounded-lg overflow-hidden bg-card">
                <div className="px-4 py-3 bg-accent/50">
                  <span className="text-xs font-semibold text-foreground">Pattern Style</span>
                </div>
                <div className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    {['grid', 'dots', 'waves'].map((pattern) => (
                      <button
                        key={pattern}
                        onClick={() => updateTheme({ 
                          background: { ...theme.background, pattern: pattern as 'grid' | 'dots' | 'waves' }
                        })}
                        className={`p-3 border-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                          theme.background.pattern === pattern
                            ? 'border-violet-600 bg-violet-50 dark:bg-violet-950/20'
                            : 'border-border hover:border-violet-400'
                        }`}
                      >
                        {pattern}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeSection === 'typography' && (
          <div className="p-3 space-y-3">
            {/* Live Preview Card - Enhanced */}
            <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 rounded-lg p-3 border-2 border-violet-200 relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <Tooltip content="Live preview of your typography">
                  <Eye className="w-3.5 h-3.5 text-violet-600" />
                </Tooltip>
              </div>
              <h1 
                className="text-xl font-bold mb-1 transition-all"
                style={{ 
                  fontFamily: theme.typography.titleFont || 'Inter',
                  color: theme.typography.titleColor || '#1F2937',
                  fontSize: `${theme.typography.titleSize || 36}px`
                }}
              >
                Your Headline
              </h1>
              <p 
                className="text-sm transition-all"
                style={{ 
                  fontFamily: theme.typography.bodyFont || 'Inter',
                  color: theme.typography.bodyColor || '#6B7280',
                  fontSize: `${theme.typography.bodySize || 16}px`
                }}
              >
                This is how your content will look. Changes apply instantly.
              </p>
            </div>

            {/* Title Typography */}
            <div className="bg-white rounded-lg border-2 border-slate-200 overflow-hidden shadow-sm">
              <div className="px-3 py-2 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
                      <Type className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-xs font-bold text-slate-900">Heading Style</span>
                  </div>
                  <Tooltip content="Customize your main headline typography">
                    <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-help" />
                  </Tooltip>
                </div>
              </div>
              <div className="p-3 space-y-2">
                {/* Font */}
                <div>
                  <label className="block text-xs text-muted-foreground mb-2">Font</label>
                  <select
                    value={theme.typography.titleFont || 'inter'}
                    onChange={(e) => updateTheme({ 
                      typography: { ...theme.typography, titleFont: e.target.value as PageTheme['typography']['titleFont'] }
                    })}
                    className="w-full px-3 py-2 border-2 border-border rounded-lg text-sm"
                  >
                    <optgroup label="📦 Google Fonts - Modern">
                      <option value="inter">Inter</option>
                      <option value="poppins">Poppins</option>
                      <option value="montserrat">Montserrat</option>
                      <option value="raleway">Raleway</option>
                      <option value="opensans">Open Sans</option>
                      <option value="roboto">Roboto</option>
                      <option value="nunito">Nunito</option>
                      <option value="ubuntu">Ubuntu</option>
                      <option value="outfit">Outfit</option>
                      <option value="workSans">Work Sans</option>
                      <option value="dmSans">DM Sans</option>
                      <option value="spacegrotesk">Space Grotesk</option>
                      <option value="manrope">Manrope</option>
                      <option value="plusjakarta">Plus Jakarta Sans</option>
                      <option value="bevietnampro">Be Vietnam Pro</option>
                      <option value="sora">Sora</option>
                    </optgroup>
                    <optgroup label="📦 Google Fonts - Elegant">
                      <option value="playfair">Playfair Display</option>
                      <option value="lora">Lora</option>
                      <option value="merriweather">Merriweather</option>
                    </optgroup>
                    <optgroup label="📦 Google Fonts - Technical">
                      <option value="sourcecodepro">Source Code Pro</option>
                    </optgroup>
                    <optgroup label="💻 System Fonts - Sans-serif">
                      <option value="arial">Arial</option>
                      <option value="helvetica">Helvetica</option>
                      <option value="calibri">Calibri</option>
                      <option value="verdana">Verdana</option>
                      <option value="tahoma">Tahoma</option>
                      <option value="trebuchet">Trebuchet MS</option>
                    </optgroup>
                    <optgroup label="💻 System Fonts - Serif">
                      <option value="timesnewroman">Times New Roman</option>
                      <option value="georgia">Georgia</option>
                      <option value="garamond">Garamond</option>
                    </optgroup>
                    <optgroup label="💻 System Fonts - Fun & Mono">
                      <option value="couriernew">Courier New</option>
                      <option value="comicsans">Comic Sans MS</option>
                    </optgroup>
                  </select>
                </div>

                {/* Size - S/M/L */}
                <div>
                  <label className="block text-xs text-muted-foreground mb-2">Size</label>
                  <div className="grid grid-cols-5 gap-2">
                    {['small', 'medium', 'large', 'xl', '2xl'].map((size) => (
                      <button
                        key={size}
                        onClick={() => updateTheme({ 
                          typography: { ...theme.typography, titleSize: size as 'small' | 'medium' | 'large' | 'xl' | '2xl' }
                        })}
                        className={`px-2 py-2 border-2 rounded-lg text-xs font-bold uppercase transition-all ${
                          theme.typography.titleSize === size
                            ? 'border-violet-600 bg-violet-50 dark:bg-violet-950/20'
                            : 'border-border hover:border-violet-400'
                        }`}
                      >
                        {size === 'small' ? 'S' : size === 'medium' ? 'M' : size === 'large' ? 'L' : size === 'xl' ? 'XL' : 'XXL'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color - Beautiful Color Picker */}
                <ColorInput
                  label="Title Color"
                  value={theme.typography.titleColor || '#1F2937'}
                  onChange={(color) => updateTheme({ typography: { ...theme.typography, titleColor: color } })}
                  description="Choose the color for your headings"
                />
              </div>
            </div>

            {/* Body Font & Color */}
            <div className="border-2 border-border rounded-lg overflow-hidden bg-card">
              <div className="px-4 py-3 bg-accent/50">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-foreground">Body Style</span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {/* Font */}
                <div>
                  <label className="block text-xs text-muted-foreground mb-2">Font</label>
                  <select
                    value={theme.typography.bodyFont || 'inter'}
                    onChange={(e) => updateTheme({ 
                      typography: { ...theme.typography, bodyFont: e.target.value as PageTheme['typography']['bodyFont'] }
                    })}
                    className="w-full px-3 py-2 border-2 border-border rounded-lg text-sm"
                  >
                    <optgroup label="📦 Google Fonts - Modern">
                      <option value="inter">Inter</option>
                      <option value="poppins">Poppins</option>
                      <option value="montserrat">Montserrat</option>
                      <option value="raleway">Raleway</option>
                      <option value="opensans">Open Sans</option>
                      <option value="roboto">Roboto</option>
                      <option value="nunito">Nunito</option>
                      <option value="ubuntu">Ubuntu</option>
                      <option value="outfit">Outfit</option>
                      <option value="workSans">Work Sans</option>
                      <option value="dmSans">DM Sans</option>
                      <option value="spacegrotesk">Space Grotesk</option>
                      <option value="manrope">Manrope</option>
                      <option value="plusjakarta">Plus Jakarta Sans</option>
                      <option value="bevietnampro">Be Vietnam Pro</option>
                      <option value="sora">Sora</option>
                    </optgroup>
                    <optgroup label="📦 Google Fonts - Elegant">
                      <option value="playfair">Playfair Display</option>
                      <option value="lora">Lora</option>
                      <option value="merriweather">Merriweather</option>
                    </optgroup>
                    <optgroup label="📦 Google Fonts - Technical">
                      <option value="sourcecodepro">Source Code Pro</option>
                    </optgroup>
                    <optgroup label="💻 System Fonts - Sans-serif">
                      <option value="arial">Arial</option>
                      <option value="helvetica">Helvetica</option>
                      <option value="calibri">Calibri</option>
                      <option value="verdana">Verdana</option>
                      <option value="tahoma">Tahoma</option>
                      <option value="trebuchet">Trebuchet MS</option>
                    </optgroup>
                    <optgroup label="💻 System Fonts - Serif">
                      <option value="timesnewroman">Times New Roman</option>
                      <option value="georgia">Georgia</option>
                      <option value="garamond">Garamond</option>
                    </optgroup>
                    <optgroup label="💻 System Fonts - Fun & Mono">
                      <option value="couriernew">Courier New</option>
                      <option value="comicsans">Comic Sans MS</option>
                    </optgroup>
                  </select>
                </div>

                {/* Size - S/M/L */}
                <div>
                  <label className="block text-xs text-muted-foreground mb-2">Size</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['xs', 'small', 'medium', 'large'].map((size) => (
                      <button
                        key={size}
                        onClick={() => updateTheme({ 
                          typography: { ...theme.typography, bodySize: size as 'xs' | 'small' | 'medium' | 'large' }
                        })}
                        className={`px-2 py-2 border-2 rounded-lg text-xs font-bold uppercase transition-all ${
                          theme.typography.bodySize === size
                            ? 'border-violet-600 bg-violet-50 dark:bg-violet-950/20'
                            : 'border-border hover:border-violet-400'
                        }`}
                      >
                        {size === 'xs' ? 'XS' : size === 'small' ? 'S' : size === 'medium' ? 'M' : 'L'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color - Beautiful Color Picker */}
                <ColorInput
                  label="Body Text Color"
                  value={theme.typography.bodyColor || '#6B7280'}
                  onChange={(color) => updateTheme({ typography: { ...theme.typography, bodyColor: color } })}
                  description="Choose the color for body text"
                />
              </div>
            </div>

            {/* Google Fonts - Coming Soon */}
            <div className="border-2 border-dashed border-violet-300 rounded-lg overflow-hidden bg-gradient-to-br from-violet-50/50 to-purple-50/50">
              <div className="px-4 py-3 bg-violet-100/50">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-600" />
                  <span className="text-xs font-semibold text-violet-900">Google Fonts</span>
                  <span className="ml-auto px-2 py-0.5 text-xs font-bold bg-violet-600 text-white rounded-full">Coming Soon</span>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs text-violet-700 leading-relaxed">
                  🎨 Browse and apply over 1,000 Google Fonts with live preview. Search by name, category, or style. Coming in the next update!
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'branding' && (
          <div className="p-3 space-y-3">
            {/* Logo Upload - Modern Design */}
            <div className="bg-white rounded-lg border-2 border-slate-200 overflow-hidden shadow-sm">
              <div className="px-3 py-2 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
                    <Image className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900">Brand Logo</span>
                    <p className="text-xs text-slate-500">Appears in header and footer</p>
                  </div>
                </div>
              </div>
              <div className="p-3 space-y-2">
                {/* Logo Preview */}
                {theme.branding?.logoUrl && (
                  <div className="relative p-6 bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 border-2 border-violet-200 rounded-xl">
                    <button
                      onClick={() => updateTheme({
                        branding: { ...theme.branding, logoUrl: undefined }
                      })}
                      className="absolute top-3 right-3 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors flex items-center justify-center shadow-md"
                      title="Remove logo"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <img
                      src={theme.branding.logoUrl}
                      alt="Logo"
                      className="max-h-24 max-w-full object-contain mx-auto"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Upload Button */}
                <label className="block cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-[1.02]">
                    <Upload className="w-4 h-4" />
                    <span>{isUploadingLogo ? 'Uploading...' : 'Upload Logo Image'}</span>
                  </div>
                </label>

                {/* Or URL Input */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-300"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 py-1 bg-white text-xs font-semibold text-slate-500 rounded-full">OR</span>
                  </div>
                </div>

                <input
                  type="url"
                  placeholder="https://example.com/logo.png"
                  value={theme.branding?.logoUrl || ''}
                  onChange={(e) => updateTheme({
                    branding: { ...theme.branding, logoUrl: e.target.value || undefined }
                  })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
                />
              </div>
            </div>

            {/* Favicon Upload - Modern Design */}
            <div className="bg-white rounded-lg border-2 border-slate-200 overflow-hidden shadow-sm">
              <div className="px-3 py-2 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900">Favicon</span>
                    <p className="text-xs text-slate-500">Browser tab icon (16x16 or 32x32px)</p>
                  </div>
                </div>
              </div>
              <div className="p-3 space-y-2">
                {/* Favicon Preview */}
                {theme.branding?.faviconUrl && (
                  <div className="relative inline-flex p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
                    <button
                      onClick={() => updateTheme({
                        branding: { ...theme.branding, faviconUrl: undefined }
                      })}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors flex items-center justify-center shadow-md"
                      title="Remove favicon"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <img
                      src={theme.branding.faviconUrl}
                      alt="Favicon"
                      className="w-10 h-10 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Upload Button */}
                <label className="block cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,.ico"
                    onChange={handleFaviconUpload}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-[1.02]">
                    <Upload className="w-4 h-4" />
                    <span>{isUploadingFavicon ? 'Uploading...' : 'Upload Favicon'}</span>
                  </div>
                </label>

                {/* Or URL Input */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-300"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 py-1 bg-white text-xs font-semibold text-slate-500 rounded-full">OR</span>
                  </div>
                </div>

                <input
                  type="url"
                  placeholder="https://example.com/favicon.ico"
                  value={theme.branding?.faviconUrl || ''}
                  onChange={(e) => updateTheme({
                    branding: { ...theme.branding, faviconUrl: e.target.value || undefined }
                  })}
                  className="w-full px-3 py-2 border-2 border-border rounded-lg text-sm focus:border-violet-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Brand Color - Visual Picker */}
            <div className="border-2 border-border rounded-lg overflow-hidden bg-card">
              <div className="px-4 py-3 bg-accent/50">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-foreground">Primary Color</span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <p className="text-xs text-muted-foreground">
                  Main brand color used for accents and highlights
                </p>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={theme.branding?.primaryColor || '#000000'}
                    onChange={(e) => updateTheme({
                      branding: { ...theme.branding, primaryColor: e.target.value }
                    })}
                    className="w-16 h-16 rounded-lg border-2 border-border cursor-pointer"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={theme.branding?.primaryColor || '#000000'}
                      onChange={(e) => updateTheme({
                        branding: { ...theme.branding, primaryColor: e.target.value }
                      })}
                      className="w-full px-3 py-2 border-2 border-border rounded-lg text-sm font-mono uppercase"
                      placeholder="#000000"
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                      {['#000000', '#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'].map((color) => (
                        <button
                          key={color}
                          onClick={() => updateTheme({
                            branding: { ...theme.branding, primaryColor: color }
                          })}
                          className="w-8 h-8 rounded border-2 border-border hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Site Name */}
            <div className="border-2 border-border rounded-lg overflow-hidden bg-card">
              <div className="px-4 py-3 bg-accent/50">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-foreground">Site Name</span>
                </div>
              </div>
              <div className="p-3">
                <input
                  type="text"
                  placeholder="My Awesome Site"
                  value={theme.branding?.siteName || ''}
                  onChange={(e) => updateTheme({
                    branding: { ...theme.branding, siteName: e.target.value || undefined }
                  })}
                  className="w-full px-3 py-2 border-2 border-border rounded-lg text-sm focus:border-violet-600 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeSection === 'layout' && (
          <div className="p-3 space-y-2">
            {/* Max Width - Visual Size Buttons */}
            <div className="border-2 border-border rounded-lg overflow-hidden bg-card">
              <div className="px-4 py-3 bg-accent/50">
                <div className="flex items-center gap-2">
                  <Layout className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-foreground">Maximum Width</span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <p className="text-xs text-muted-foreground">
                  Content container width (narrower = better for mobile)
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: '560', label: 'S', desc: '560px' },
                    { value: '640', label: 'M', desc: '640px' },
                    { value: '680', label: 'M+', desc: '680px' },
                    { value: '720', label: 'L', desc: '720px' },
                    { value: '768', label: 'L+', desc: '768px' },
                    { value: '800', label: 'XL', desc: '800px' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateTheme({ maxWidth: option.value as PageTheme['maxWidth'] })}
                      className={`p-3 border-2 rounded-lg text-center transition-all ${
                        theme.maxWidth === option.value
                          ? 'border-violet-600 bg-violet-50 dark:bg-violet-950/20'
                          : 'border-border hover:border-violet-400'
                      }`}
                    >
                      <p className="text-base font-bold text-foreground">{option.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{option.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Padding - Visual Size Buttons */}
            <div className="border-2 border-border rounded-lg overflow-hidden bg-card">
              <div className="px-4 py-3 bg-accent/50">
                <div className="flex items-center gap-2">
                  <Layout className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-foreground">Page Padding</span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <p className="text-xs text-muted-foreground">
                  Space around the edges of your page
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'tight', label: 'S', icon: '⬜', desc: 'Minimal' },
                    { value: 'compact', label: 'M', icon: '⬜', desc: 'Small' },
                    { value: 'normal', label: 'L', icon: '⬜', desc: 'Standard' },
                    { value: 'relaxed', label: 'XL', icon: '⬜', desc: 'Large' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateTheme({ padding: option.value as PageTheme['padding'] })}
                      className={`p-3 border-2 rounded-lg transition-all ${
                        theme.padding === option.value
                          ? 'border-violet-600 bg-violet-50 dark:bg-violet-950/20'
                          : 'border-border hover:border-violet-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{option.icon}</span>
                        <div className="text-left">
                          <p className="text-xs font-bold text-foreground">{option.label}</p>
                          <p className="text-xs text-muted-foreground">{option.desc}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Block Spacing - Visual Size Buttons */}
            <div className="border-2 border-border rounded-lg overflow-hidden bg-card">
              <div className="px-4 py-3 bg-accent/50">
                <div className="flex items-center gap-2">
                  <Layout className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-foreground">Block Spacing</span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <p className="text-xs text-muted-foreground">
                  Vertical gaps between blocks (profile, links, etc.)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'tight', label: 'S', icon: '▬', desc: 'Minimal gaps' },
                    { value: 'compact', label: 'M', icon: '▬', desc: 'Small gaps' },
                    { value: 'normal', label: 'L', icon: '▬', desc: 'Standard gaps' },
                    { value: 'relaxed', label: 'XL', icon: '▬', desc: 'Large gaps' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateTheme({ spacing: option.value as PageTheme['spacing'] })}
                      className={`p-3 border-2 rounded-lg transition-all ${
                        theme.spacing === option.value
                          ? 'border-violet-600 bg-violet-50 dark:bg-violet-950/20'
                          : 'border-border hover:border-violet-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{option.icon}</span>
                        <div className="text-left">
                          <p className="text-xs font-bold text-foreground">{option.label}</p>
                          <p className="text-xs text-muted-foreground">{option.desc}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'advanced' && (
          <div className="p-3 space-y-2">
            {/* Info Card */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
              <Info className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-red-900 mb-1">⚡ Advanced Settings</p>
                <p className="text-xs text-red-700 leading-relaxed">
                  For power users. Add custom CSS or HTML to fully customize your page. <strong>Use with caution!</strong>
                </p>
              </div>
            </div>

            {/* Custom CSS */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-foreground flex items-center gap-2">
                <Code className="w-4 h-4" />
                Custom CSS
              </label>
              <p className="text-xs text-muted-foreground -mt-2 mb-2">
                Add your own CSS styles. Example: <code className="bg-muted px-1 rounded">.my-class {"{ color: red; }"}</code>
              </p>
              <textarea
                value={customCSS}
                onChange={(e) => setCustomCSS(e.target.value)}
                placeholder={`/* Your custom CSS here */\n.my-custom-class {\n  color: #3b82f6;\n  font-weight: bold;\n}`}
                className="w-full px-3 py-2 border-2 border-border rounded-lg text-xs font-mono focus:border-violet-600 focus:outline-none bg-gray-900 text-green-400"
                rows={10}
                spellCheck={false}
              />
              <div className="flex items-start gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
                <p>Custom CSS will be injected into a {`<style>`} tag in your page's {`<head>`}.</p>
              </div>
            </div>

            {/* Custom HTML (Head) */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-foreground flex items-center gap-2">
                <Code className="w-4 h-4" />
                Custom HTML (Head)
              </label>
              <p className="text-xs text-muted-foreground -mt-2 mb-2">
                Add custom scripts, meta tags, or analytics. Example: Google Analytics, Facebook Pixel.
              </p>
              <textarea
                value={customHTML}
                onChange={(e) => setCustomHTML(e.target.value)}
                placeholder={`<!-- Your custom HTML here -->\n<script>\n  // Google Analytics\n  console.log('Custom script loaded!');\n</script>`}
                className="w-full px-3 py-2 border-2 border-border rounded-lg text-xs font-mono focus:border-violet-600 focus:outline-none bg-gray-900 text-green-400"
                rows={10}
                spellCheck={false}
              />
              <div className="flex items-start gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
                <p>Custom HTML will be injected into your page's {`<head>`} section.</p>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-3">
              <p className="text-xs font-bold text-orange-900 mb-2">⚠️ Safety Warning</p>
              <ul className="text-xs text-orange-800 space-y-1 list-disc list-inside">
                <li>Only add code from trusted sources</li>
                <li>Malicious code can break your page or steal data</li>
                <li>Test thoroughly before publishing</li>
                <li>If unsure, ask a developer for help</li>
              </ul>
            </div>

            {/* Save Button */}
            <button
              onClick={() => {
                // TODO: Save to theme or microsite metadata
                alert('Custom code saved! (Feature in progress)');
              }}
              className="w-full px-3 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              Save Custom Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
