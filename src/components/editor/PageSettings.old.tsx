import { useState } from 'react';
import { Palette, Type, Square, ChevronDown, ChevronUp, Image, Upload, X, Paintbrush, Layout, Settings, Sparkles } from 'lucide-react';
import { BackgroundPicker } from './BackgroundPicker';
import { TypographySettings } from './TypographySettings';
import type { PageTheme, ButtonStyle } from '../../types/theme';
import { THEME_PRESETS } from '@/config/themePresets';

interface PageSettingsProps {
  theme: PageTheme;
  onChange: (theme: PageTheme) => void;
}

type TabType = 'design' | 'branding' | 'content' | 'advanced';

export function PageSettings({ theme, onChange }: PageSettingsProps) {
  // Track active tab
  const [activeTab, setActiveTab] = useState<TabType>('design');
  
  // Track which sections are expanded (all expanded by default for easy access)
  const [expandedSections, setExpandedSections] = useState({
    background: true,
    typography: true, // Typography expanded by default
    buttons: true, // Buttons expanded by default
    branding: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateTheme = (updates: Partial<PageTheme>) => {
    console.log('📝 Page theme update:', updates);
    onChange({ ...theme, ...updates });
  };

  const updateButton = (updates: Partial<ButtonStyle>) => {
    console.log('🔘 Button style update:', updates);
    updateTheme({ button: { ...theme.button, ...updates } });
  };

  const tabs = [
    { id: 'design' as TabType, label: 'Design', icon: Paintbrush },
    { id: 'branding' as TabType, label: 'Branding', icon: Image },
    { id: 'content' as TabType, label: 'Content', icon: Layout },
    { id: 'advanced' as TabType, label: 'Advanced', icon: Settings },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Quick Theme Switcher */}
      <div className="p-3 border-b border-border bg-card">
        <label className="block text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Quick Theme
        </label>
        <select
          value={theme.id || 'custom'}
          onChange={(e) => {
            if (e.target.value === 'custom') {
              // User selected "Custom Theme" - don't change anything
              return;
            }
            
            const selectedPreset = THEME_PRESETS.find(p => p.id === e.target.value);
            if (selectedPreset) {
              console.log('🎨 Applying preset theme:', selectedPreset.name);
              // Merge preset with current theme to ensure all required fields are present
              onChange({
                ...theme, // Start with current theme as base
                ...selectedPreset.theme, // Apply preset changes
                id: selectedPreset.id,
                name: selectedPreset.name,
                category: selectedPreset.category,
              });
            }
          }}
          className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background hover:bg-muted/30 transition-colors"
        >
          <option value="custom">Custom Theme</option>
          <optgroup label="Minimal">
            {THEME_PRESETS.filter(p => p.category === 'minimal').map(preset => (
              <option key={preset.id} value={preset.id}>{preset.name}</option>
            ))}
          </optgroup>
          <optgroup label="Vibrant">
            {THEME_PRESETS.filter(p => p.category === 'vibrant').map(preset => (
              <option key={preset.id} value={preset.id}>{preset.name}</option>
            ))}
          </optgroup>
          <optgroup label="Professional">
            {THEME_PRESETS.filter(p => p.category === 'professional').map(preset => (
              <option key={preset.id} value={preset.id}>{preset.name}</option>
            ))}
          </optgroup>
          <optgroup label="Creative">
            {THEME_PRESETS.filter(p => p.category === 'creative').map(preset => (
              <option key={preset.id} value={preset.id}>{preset.name}</option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border bg-card">
        <div className="grid grid-cols-4 gap-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex flex-col items-center gap-1 py-3 px-2 text-xs font-medium transition-colors
                  ${isActive 
                    ? 'text-primary border-b-2 border-primary bg-primary/5' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {activeTab === 'design' && (
          <>
            {/* Background Section - Collapsible */}
            <div className="border border-border rounded-lg overflow-hidden bg-card">
              <button
                onClick={() => toggleSection('background')}
                className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-sm">Background</span>
                </div>
                {expandedSections.background ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              {expandedSections.background && (
                <div className="p-3 pt-0 border-t border-border">
                  <BackgroundPicker
                    value={theme.background}
                    onChange={(background) => updateTheme({ background })}
                  />
                </div>
              )}
            </div>

            {/* Typography Section - Collapsible */}
            <div className="border border-border rounded-lg overflow-hidden bg-card">
              <button
                onClick={() => toggleSection('typography')}
                className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-sm">Typography</span>
                </div>
                {expandedSections.typography ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              {expandedSections.typography && (
          <div className="p-3 pt-0 border-t border-border">
            <TypographySettings
              value={theme.typography}
              onChange={(typography) => updateTheme({ typography })}
            />
          </div>
        )}
      </div>

      {/* Buttons Section - Collapsible & Compact */}
      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <button
          onClick={() => toggleSection('buttons')}
          className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Square className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">Buttons</span>
          </div>
          {expandedSections.buttons ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        {expandedSections.buttons && (
          <div className="p-3 pt-0 border-t border-border space-y-3">
            {/* Compact 2-column grid for button settings */}
            <div className="grid grid-cols-2 gap-3">
              {/* Size */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-muted-foreground">Size</label>
                <select
                  value={theme.button.size || 'medium'}
                  onChange={(e) => updateButton({ size: e.target.value as ButtonStyle['size'] })}
                  className="w-full px-2 py-1.5 text-sm border border-border rounded bg-background"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              {/* Variant */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-muted-foreground">Style</label>
                <select
                  value={theme.button.variant || 'fill'}
                  onChange={(e) => updateButton({ variant: e.target.value as ButtonStyle['variant'] })}
                  className="w-full px-2 py-1.5 text-sm border border-border rounded bg-background"
                >
                  <option value="fill">Filled</option>
                  <option value="outline">Outline</option>
                  <option value="soft">Soft</option>
                  <option value="shadow">Shadow</option>
                </select>
              </div>

              {/* Background Color */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-muted-foreground">BG Color</label>
                <div className="flex gap-1.5">
                  <input
                    type="color"
                    value={theme.button.backgroundColor || '#3b82f6'}
                    onChange={(e) => updateButton({ backgroundColor: e.target.value })}
                    className="w-10 h-8 rounded border border-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.button.backgroundColor || '#3b82f6'}
                    onChange={(e) => updateButton({ backgroundColor: e.target.value })}
                    className="flex-1 px-2 py-1 text-xs border border-border rounded bg-background font-mono"
                    placeholder="#3b82f6"
                  />
                </div>
              </div>

              {/* Text Color */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-muted-foreground">Text Color</label>
                <div className="flex gap-1.5">
                  <input
                    type="color"
                    value={theme.button.textColor || '#ffffff'}
                    onChange={(e) => updateButton({ textColor: e.target.value })}
                    className="w-10 h-8 rounded border border-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.button.textColor || '#ffffff'}
                    onChange={(e) => updateButton({ textColor: e.target.value })}
                    className="flex-1 px-2 py-1 text-xs border border-border rounded bg-background font-mono"
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              {/* Border Radius */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-muted-foreground">Corners</label>
                <select
                  value={theme.button.borderRadius || 'md'}
                  onChange={(e) => updateButton({ borderRadius: e.target.value as ButtonStyle['borderRadius'] })}
                  className="w-full px-2 py-1.5 text-sm border border-border rounded bg-background"
                >
                  <option value="none">Square</option>
                  <option value="sm">Small</option>
                  <option value="md">Medium</option>
                  <option value="lg">Large</option>
                  <option value="xl">XL</option>
                  <option value="full">Pill</option>
                </select>
              </div>

              {/* Hover Effect */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-muted-foreground">Hover</label>
                <select
                  value={theme.button.hoverEffect || 'lift'}
                  onChange={(e) => updateButton({ hoverEffect: e.target.value as ButtonStyle['hoverEffect'] })}
                  className="w-full px-2 py-1.5 text-sm border border-border rounded bg-background"
                >
                  <option value="none">None</option>
                  <option value="lift">Lift</option>
                  <option value="grow">Grow</option>
                  <option value="glow">Glow</option>
                  <option value="pulse">Pulse</option>
                </select>
              </div>
            </div>

            {/* Compact Button Preview */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide mb-2">Preview</p>
              <div className="flex justify-center">
                <button
                  className="px-4 py-2 text-sm font-semibold transition-all duration-200"
                  style={{
                    backgroundColor: theme.button.variant === 'outline' ? 'transparent' : theme.button.backgroundColor,
                    color: theme.button.textColor,
                    borderRadius: 
                      theme.button.borderRadius === 'none' ? '0' :
                      theme.button.borderRadius === 'sm' ? '0.25rem' :
                      theme.button.borderRadius === 'md' ? '0.5rem' :
                      theme.button.borderRadius === 'lg' ? '0.75rem' :
                      theme.button.borderRadius === 'xl' ? '1rem' :
                      '9999px',
                    border: theme.button.variant === 'outline' ? `2px solid ${theme.button.backgroundColor}` : 'none',
                    boxShadow: theme.button.variant === 'shadow' ? '0 10px 25px -5px rgba(0, 0, 0, 0.1)' : 'none',
                  }}
                >
                  Click Me
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </>
    )}

    {activeTab === 'branding' && (
      <>
      {/* Branding */}
      <div className="border-b border-gray-100">
        <button
          onClick={() => toggleSection('branding')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
        >
          <span className="font-medium flex items-center gap-2">
            <Image className="w-4 h-4" />
            Branding
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.branding ? 'rotate-180' : ''}`} />
        </button>
        {expandedSections.branding && (
          <div className="p-4 space-y-4 bg-gray-50">
            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Logo</label>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Logo URL"
                  value={theme.branding?.logoUrl || ''}
                  onChange={(e) => updateTheme({
                    branding: {
                      ...theme.branding,
                      logoUrl: e.target.value
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                    <Upload className="w-4 h-4" />
                    Upload Logo
                  </button>
                  {theme.branding?.logoUrl && (
                    <button
                      onClick={() => updateTheme({
                        branding: {
                          ...theme.branding,
                          logoUrl: undefined
                        }
                      })}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {theme.branding?.logoUrl && (
                  <div className="p-3 bg-white border border-gray-200 rounded-lg">
                    <img
                      src={theme.branding.logoUrl}
                      alt="Logo preview"
                      className="max-h-16 max-w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Logo Position */}
            <div>
              <label className="block text-sm font-medium mb-2">Logo Position</label>
              <select
                value={theme.branding?.logoPosition || 'header'}
                onChange={(e) => updateTheme({
                  branding: {
                    ...theme.branding,
                    logoPosition: e.target.value as 'header' | 'footer' | 'both' | 'none'
                  }
                })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="header">Header</option>
                <option value="footer">Footer</option>
                <option value="both">Both</option>
                <option value="none">None</option>
              </select>
            </div>

            {/* Logo Size */}
            <div>
              <label className="block text-sm font-medium mb-2">Logo Size</label>
              <select
                value={theme.branding?.logoSize || 'medium'}
                onChange={(e) => updateTheme({
                  branding: {
                    ...theme.branding,
                    logoSize: e.target.value as 'small' | 'medium' | 'large'
                  }
                })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            {/* Logo Link */}
            <div>
              <label className="block text-sm font-medium mb-2">Logo Link (Optional)</label>
              <input
                type="url"
                placeholder="https://example.com"
                value={theme.branding?.logoLink || ''}
                onChange={(e) => updateTheme({
                  branding: {
                    ...theme.branding,
                    logoLink: e.target.value
                  }
                })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>

            {/* Favicon */}
            <div className="pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium mb-2">Favicon</label>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Favicon URL (16x16 or 32x32)"
                  value={theme.branding?.faviconUrl || ''}
                  onChange={(e) => updateTheme({
                    branding: {
                      ...theme.branding,
                      faviconUrl: e.target.value
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                    <Upload className="w-4 h-4" />
                    Upload Favicon
                  </button>
                  {theme.branding?.faviconUrl && (
                    <button
                      onClick={() => updateTheme({
                        branding: {
                          ...theme.branding,
                          faviconUrl: undefined
                        }
                      })}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {theme.branding?.faviconUrl && (
                  <div className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg">
                    <img
                      src={theme.branding.faviconUrl}
                      alt="Favicon preview"
                      className="w-4 h-4"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <span className="text-xs text-gray-500">Preview in browser tab</span>
                  </div>
                )}
              </div>
            </div>

            {/* Brand Colors */}
            <div className="pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium mb-3">Brand Colors</label>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Primary Color</label>
                  <input
                    type="color"
                    value={theme.branding?.primaryColor || '#000000'}
                    onChange={(e) => updateTheme({
                      branding: {
                        ...theme.branding,
                        primaryColor: e.target.value
                      }
                    })}
                    className="w-full h-10 rounded border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Secondary Color</label>
                  <input
                    type="color"
                    value={theme.branding?.secondaryColor || '#666666'}
                    onChange={(e) => updateTheme({
                      branding: {
                        ...theme.branding,
                        secondaryColor: e.target.value
                      }
                    })}
                    className="w-full h-10 rounded border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Accent Color</label>
                  <input
                    type="color"
                    value={theme.branding?.accentColor || '#0066FF'}
                    onChange={(e) => updateTheme({
                      branding: {
                        ...theme.branding,
                        accentColor: e.target.value
                      }
                    })}
                    className="w-full h-10 rounded border border-gray-200"
                  />
                </div>
              </div>
            </div>

            {/* Site Info */}
            <div className="pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium mb-3">Site Information</label>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Site Name</label>
                  <input
                    type="text"
                    placeholder="My Awesome Site"
                    value={theme.branding?.siteName || ''}
                    onChange={(e) => updateTheme({
                      branding: {
                        ...theme.branding,
                        siteName: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Tagline</label>
                  <input
                    type="text"
                    placeholder="A brief description"
                    value={theme.branding?.tagline || ''}
                    onChange={(e) => updateTheme({
                      branding: {
                        ...theme.branding,
                        tagline: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Copyright Text</label>
                  <input
                    type="text"
                    placeholder="© 2024 Your Name"
                    value={theme.branding?.copyrightText || ''}
                    onChange={(e) => updateTheme({
                      branding: {
                        ...theme.branding,
                        copyrightText: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      </>
    )}

    {activeTab === 'content' && (
      <div className="text-center py-8 text-muted-foreground">
        <Layout className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm font-medium">Header/Footer Coming Soon</p>
        <p className="text-xs mt-1">Add custom headers and footers to your page</p>
      </div>
    )}

    {activeTab === 'advanced' && (
      <div className="text-center py-8 text-muted-foreground">
        <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm font-medium">Advanced Settings Coming Soon</p>
        <p className="text-xs mt-1">Custom CSS, HTML, and more</p>
      </div>
    )}
      </div>
    </div>
  );
}
