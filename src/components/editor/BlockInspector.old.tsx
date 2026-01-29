import { useState } from 'react';
import { Upload, Sliders, Palette } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { RichTextEditor } from './RichTextEditor';
import { PageSettings } from './PageSettings';
import type { Block } from '@/types';
import type { PageTheme } from '@/types/theme';

// Props for BlockInspector component
interface BlockInspectorProps {
  block?: Block; // Currently selected block (undefined if nothing selected)
  onUpdate: (block: Block) => void; // Callback to update block in parent state
  pageTheme?: PageTheme; // Current page theme (for design tab)
  onThemeUpdate?: (theme: PageTheme) => void; // Callback to update theme
}

// Available Google Fonts for typography customization
const GOOGLE_FONTS = [
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Roboto', value: 'Roboto, sans-serif' },
  { name: 'Poppins', value: 'Poppins, sans-serif' },
  { name: 'Playfair Display', value: '"Playfair Display", serif' },
  { name: 'Montserrat', value: 'Montserrat, sans-serif' },
  { name: 'Open Sans', value: '"Open Sans", sans-serif' },
  { name: 'Lato', value: 'Lato, sans-serif' },
  { name: 'Source Sans Pro', value: '"Source Sans Pro", sans-serif' },
];

// Props for reusable ColorPickerField component
interface ColorPickerFieldProps {
  label: string; // Label text shown above the color picker
  value?: string; // Current hex color value
  onChange: (color: string | undefined) => void; // Callback when color changes (undefined = clear)
  showColorPicker: string | null; // Which color picker is currently open (by label)
  setShowColorPicker: (label: string | null) => void; // Toggle color picker visibility
}

// 90 preset colors organized into 10 color families
// Each family has 9-10 shades from dark to light
const COLOR_PRESETS = [
  // Grayscale
  '#000000', '#1F2937', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB', '#F3F4F6', '#F9FAFB', '#FFFFFF',
  // Reds
  '#7F1D1D', '#991B1B', '#B91C1C', '#DC2626', '#EF4444', '#F87171', '#FCA5A5', '#FECACA', '#FEE2E2', '#FEF2F2',
  // Oranges
  '#7C2D12', '#9A3412', '#C2410C', '#EA580C', '#F97316', '#FB923C', '#FDBA74', '#FED7AA', '#FFEDD5', '#FFF7ED',
  // Yellows
  '#713F12', '#854D0E', '#A16207', '#CA8A04', '#EAB308', '#FACC15', '#FDE047', '#FEF08A', '#FEF9C3', '#FEFCE8',
  // Greens
  '#14532D', '#166534', '#15803D', '#16A34A', '#22C55E', '#4ADE80', '#86EFAC', '#BBF7D0', '#DCFCE7', '#F0FDF4',
  // Teals
  '#134E4A', '#115E59', '#0F766E', '#0D9488', '#14B8A6', '#2DD4BF', '#5EEAD4', '#99F6E4', '#CCFBF1', '#F0FDFA',
  // Blues
  '#1E3A8A', '#1E40AF', '#1D4ED8', '#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE', '#EFF6FF',
  // Purples
  '#581C87', '#6B21A8', '#7E22CE', '#9333EA', '#A855F7', '#C084FC', '#D8B4FE', '#E9D5FF', '#F3E8FF', '#FAF5FF',
  // Pinks
  '#831843', '#9F1239', '#BE123C', '#E11D48', '#F43F5E', '#FB7185', '#FDA4AF', '#FECDD3', '#FFE4E6', '#FFF1F2',
];

// Reusable color picker component with custom color and preset palette
// Shows a color swatch, hex input field, and Clear button
// Clicking swatch opens picker with HexColorPicker and 90 preset colors
function ColorPickerField({ label, value, onChange, showColorPicker, setShowColorPicker }: ColorPickerFieldProps) {
  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex gap-2">
        {/* Color swatch button - shows current color */}
        <div
          className="w-10 h-10 rounded border-2 border-border cursor-pointer hover:border-primary transition-colors"
          style={{ backgroundColor: value || 'transparent' }}
          onClick={() => setShowColorPicker(showColorPicker === label ? null : label)}
          title="Click to pick color"
        />
        {/* Hex color input field */}
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 px-3 py-2 border border-border rounded bg-background text-sm"
        />
        {/* Clear button - removes color by setting to undefined */}
        {value && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="px-2 py-1 text-xs border border-border rounded hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
            title="Clear color"
          >
            Clear
          </button>
        )}
      </div>
      {/* Color picker dropdown (only shown when showColorPicker === label) */}
      {showColorPicker === label && (
        <>
          {/* Backdrop - clicking it closes the picker */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowColorPicker(null)}
          />
          {/* Picker container with HexColorPicker and preset palette */}
          <div className="absolute z-50 mt-2 bg-background border-2 border-primary/20 rounded-lg shadow-2xl p-4 left-0 max-w-xs">
            <div className="space-y-3">
              <div className="border border-border rounded-lg overflow-hidden">
                <HexColorPicker color={value || '#000000'} onChange={onChange} style={{ width: '100%' }} />
              </div>
              <div>
                <p className="text-xs font-semibold mb-2 text-foreground">Color Palette</p>
                <div className="grid grid-cols-10 gap-1.5 max-h-48 overflow-y-auto">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      className="w-6 h-6 rounded border border-border hover:scale-125 hover:z-10 transition-transform shadow-sm relative group"
                      style={{ backgroundColor: preset }}
                      onClick={() => {
                        onChange(preset);
                        setShowColorPicker(null);
                      }}
                      title={preset}
                    >
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {preset}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Main BlockInspector component
// Displays properties editor for the currently selected block
// Shows different fields based on block type (heading, text, button, image, form, spacer)
export default function BlockInspector({ block, onUpdate, pageTheme, onThemeUpdate }: BlockInspectorProps) {
  // isUploading: Loading state for image uploads
  const [isUploading, setIsUploading] = useState(false);
  // showColorPicker: Tracks which color picker is currently open (by label name)
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);

  // If no block is selected, show Page Design settings
  if (!block) {
    if (pageTheme && onThemeUpdate) {
      return (
        <div className="h-full overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold">Page Design</h2>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Customize colors, fonts, and backgrounds
            </p>
          </div>
          
          {/* Page Settings Component */}
          <PageSettings theme={pageTheme} onChange={onThemeUpdate} />
        </div>
      );
    }
    
    // Fallback if theme props not provided
    return (
      <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-8 sm:py-12 px-4">
        <div className="relative animate-in fade-in zoom-in duration-500">
          {/* Glow effect with animation */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s' }} />
          
          {/* Icon container with gradient border */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-background via-background to-background border-2 border-primary/30 flex items-center justify-center shadow-xl backdrop-blur-sm">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-purple-500/5 to-blue-500/10" />
            <Sliders className="relative w-10 h-10 sm:w-12 sm:h-12 text-primary animate-pulse" style={{ animationDuration: '2s' }} />
          </div>
        </div>
        
        <div className="space-y-3 max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            No Block Selected
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed px-4">
            Click on any block in the canvas to edit its properties and customize its appearance
          </p>
        </div>
        
        <div className="p-4 sm:p-5 bg-gradient-to-br from-primary/5 via-purple-500/5 to-blue-500/5 border-2 border-primary/10 rounded-xl sm:rounded-2xl max-w-sm backdrop-blur-sm shadow-lg hover:shadow-xl hover:border-primary/20 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-sm">
              <span className="text-xl">💡</span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-xs sm:text-sm font-bold text-foreground mb-1.5 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Quick Tip
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Try clicking on a heading, image, button, or any other block to see all editable properties
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Helper function to update block content properties
  // Content properties are specific to each block type (e.g., text, url, label, etc.)
  const updateContent = (key: string, value: unknown) => {
    console.log('🔄 BlockInspector updateContent called:', { key, value, blockId: block.id });
    onUpdate({
      ...block,
      content: {
        ...block.content,
        [key]: value,
      },
    });
  };

  // Helper function to update block styles
  // If value is undefined, removes the style property entirely
  // This ensures background colors and other styles can be cleared
  const updateStyles = (key: string, value: unknown) => {
    // Start with existing styles or empty object if no styles exist yet
    const newStyles = { ...(block.styles || {}) };
    
    // Remove the property if value is undefined, otherwise set it
    if (value === undefined) {
      delete newStyles[key as keyof typeof newStyles];
    } else {
      newStyles[key as keyof typeof newStyles] = value as never;
    }
    
    onUpdate({
      ...block,
      styles: newStyles,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      updateContent('url', reader.result as string);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Figma-style Compact Header */}
      <div className="space-y-3">
        {/* Block Type Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg border border-border/50">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{block.type}</span>
        </div>
        
        {/* Block Name/Title - Large and Bold */}
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
          {block.type === 'heading' && (block.content.text as string || 'Heading')}
          {block.type === 'button' && (block.content.label as string || 'Button')}
          {block.type === 'image' && 'Image'}
          {block.type === 'text' && 'Text Block'}
          {block.type === 'form' && 'Form'}
          {block.type === 'spacer' && 'Spacer'}
          {block.type === 'video' && 'Video'}
          {block.type === 'divider' && 'Divider'}
          {block.type === 'social' && 'Social Links'}
          {block.type === 'countdown' && 'Countdown'}
          {block.type === 'calendar' && (block.content.title as string || 'Events Calendar')}
          {block.type === 'testimonial' && 'Testimonial'}
          {block.type === 'faq' && 'FAQ'}
          {block.type === 'gallery' && 'Gallery'}
          {block.type === 'pricing' && 'Pricing Table'}
          {block.type === 'features' && 'Features Grid'}
          {block.type === 'stats' && 'Stats Counter'}
          {block.type === 'map' && 'Map'}
          {block.type === 'hero' && (block.content.headline as string || 'Hero Section')}
          {block.type === 'profile' && (block.content.displayName as string || 'Profile')}
          {block.type === 'linkButton' && (block.content.label as string || 'Link Button')}
          {block.type === 'header' && (block.content.siteName as string || 'Header')}
          {block.type === 'footer' && 'Footer'}
          {block.type === 'payment' && (block.content.title as string || 'Payment')}
          {block.type === 'product' && (block.content.name as string || 'Product')}
        </h2>
      </div>

      {/* Content Fields - Figma-style Sections */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-0.5 w-10 sm:w-12 bg-gradient-to-r from-purple-500 via-blue-500 to-transparent rounded-full animate-pulse" style={{ animationDuration: '3s' }} />
          <h4 className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider">Content</h4>
          <div className="h-0.5 flex-1 bg-gradient-to-r from-border/50 to-transparent rounded-full" />
        </div>
        
        {block.type === 'heading' && (
          <>
            <div className="group">
              <label className="block text-base font-semibold mb-2.5 text-foreground group-hover:text-primary transition-colors duration-200">
                Heading Level
              </label>
              <select
                value={block.content.level as number}
                onChange={(e) => updateContent('level', parseInt(e.target.value))}
                className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 hover:shadow-md focus:border-primary focus:ring-4 focus:ring-primary/10 focus:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <option value={1}>H1 - Largest</option>
                <option value={2}>H2 - Medium</option>
                <option value={3}>H3 - Small</option>
              </select>
            </div>
            <div className="group">
              <label className="block text-base font-semibold mb-2.5 text-foreground group-hover:text-primary transition-colors duration-200">
                Text
              </label>
              <input
                type="text"
                value={(block.content.text as string) || ''}
                onChange={(e) => updateContent('text', e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 hover:shadow-md focus:border-primary focus:ring-4 focus:ring-primary/10 focus:shadow-lg transition-all duration-200"
                placeholder="Enter heading text"
              />
            </div>
          </>
        )}

        {block.type === 'text' && (
          <div className="space-y-6">
            {/* Text Content */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="text-lg">✍️</span>
                <span className="font-semibold text-foreground">Content</span>
              </div>
              <RichTextEditor
                content={(block.content.html as string) || ''}
                onChange={(html) => updateContent('html', html)}
                placeholder="Enter your text..."
              />
            </div>

            {/* Typography */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="text-lg">🔤</span>
                <span className="font-semibold text-foreground">Typography</span>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Font Size</label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { value: 'sm', label: 'S' },
                    { value: 'base', label: 'M' },
                    { value: 'lg', label: 'L' },
                    { value: 'xl', label: 'XL' },
                    { value: '2xl', label: '2XL' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateContent('fontSize', opt.value)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                        (block.content.fontSize || 'base') === opt.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Font Weight</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: 'normal', label: 'Normal' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'semibold', label: 'Semi' },
                    { value: 'bold', label: 'Bold' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateContent('fontWeight', opt.value)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                        (block.content.fontWeight || 'normal') === opt.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Line Height</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: 'tight', label: 'Tight' },
                    { value: 'normal', label: 'Normal' },
                    { value: 'relaxed', label: 'Relaxed' },
                    { value: 'loose', label: 'Loose' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateContent('lineHeight', opt.value)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                        (block.content.lineHeight || 'normal') === opt.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Alignment & Spacing */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="text-lg">📐</span>
                <span className="font-semibold text-foreground">Layout</span>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Text Alignment</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: 'left', label: '⬅️', title: 'Left' },
                    { value: 'center', label: '↔️', title: 'Center' },
                    { value: 'right', label: '➡️', title: 'Right' },
                    { value: 'justify', label: '☰', title: 'Justify' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateContent('textAlign', opt.value)}
                      title={opt.title}
                      className={`px-3 py-2 text-lg font-medium rounded-lg border-2 transition-all ${
                        (block.content.textAlign || 'left') === opt.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Max Width</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: 'full', label: 'Full' },
                    { value: '4xl', label: 'Large' },
                    { value: '2xl', label: 'Medium' },
                    { value: 'xl', label: 'Small' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateContent('maxWidth', opt.value)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                        (block.content.maxWidth || 'full') === opt.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Styling */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="text-lg">🎨</span>
                <span className="font-semibold text-foreground">Styling</span>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Text Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'normal', label: 'Normal', desc: 'Standard paragraph' },
                    { value: 'lead', label: 'Lead', desc: 'Larger intro text' },
                    { value: 'muted', label: 'Muted', desc: 'Subdued color' },
                    { value: 'highlight', label: 'Highlight', desc: 'Emphasized text' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateContent('textStyle', opt.value)}
                      className={`p-3 rounded-xl border-2 transition-all text-left ${
                        (block.content.textStyle || 'normal') === opt.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="font-semibold text-sm">{opt.label}</span>
                      <p className="text-xs text-muted-foreground">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-secondary/30 rounded-xl p-4 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(block.content.dropCap as boolean) || false}
                    onChange={(e) => updateContent('dropCap', e.target.checked)}
                    className="w-5 h-5 rounded border-border accent-primary"
                  />
                  <div>
                    <span className="text-sm font-medium">Drop Cap</span>
                    <p className="text-xs text-muted-foreground">Large first letter</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(block.content.columns as boolean) || false}
                    onChange={(e) => updateContent('columns', e.target.checked)}
                    className="w-5 h-5 rounded border-border accent-primary"
                  />
                  <div>
                    <span className="text-sm font-medium">Two Columns</span>
                    <p className="text-xs text-muted-foreground">Split text into columns</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Background */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="text-lg">🖼️</span>
                <span className="font-semibold text-foreground">Background</span>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Background Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'none', label: 'None' },
                    { value: 'subtle', label: 'Subtle' },
                    { value: 'card', label: 'Card' },
                    { value: 'highlight', label: 'Highlight' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateContent('bgStyle', opt.value)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                        (block.content.bgStyle || 'none') === opt.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {block.type === 'button' && (
          <div className="space-y-6">
            {/* Basic Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="text-lg">🔘</span>
                <span className="font-semibold text-foreground">Button Content</span>
              </div>
              
              <div className="group">
                <label className="block text-sm font-medium mb-2">Button Label</label>
                <input
                  type="text"
                  value={(block.content.label as string) || ''}
                  onChange={(e) => updateContent('label', e.target.value)}
                  className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  placeholder="Click me"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Action Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'url', label: '🔗 Link', desc: 'Website URL' },
                    { value: 'email', label: '📧 Email', desc: 'Send email' },
                    { value: 'phone', label: '📞 Phone', desc: 'Call number' },
                    { value: 'download', label: '📥 Download', desc: 'Download file' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateContent('actionType', opt.value)}
                      className={`p-3 rounded-xl border-2 transition-all text-left ${
                        (block.content.actionType || 'url') === opt.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="font-semibold text-sm">{opt.label}</span>
                      <p className="text-xs text-muted-foreground">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="group">
                <label className="block text-sm font-medium mb-2">
                  {(block.content.actionType as string) === 'email' ? 'Email Address' :
                   (block.content.actionType as string) === 'phone' ? 'Phone Number' :
                   (block.content.actionType as string) === 'download' ? 'Download URL' : 'Link URL'}
                </label>
                <input
                  type={((block.content.actionType as string) === 'email') ? 'email' : 'text'}
                  value={(block.content.url as string) || ''}
                  onChange={(e) => updateContent('url', e.target.value)}
                  className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  placeholder={
                    (block.content.actionType as string) === 'email' ? 'hello@example.com' :
                    (block.content.actionType as string) === 'phone' ? '+1 234 567 8900' :
                    (block.content.actionType as string) === 'download' ? 'https://example.com/file.pdf' :
                    'https://example.com'
                  }
                />
              </div>

              <div className="group">
                <label className="block text-sm font-medium mb-2">Helper Text <span className="text-muted-foreground">(optional)</span></label>
                <input
                  type="text"
                  value={(block.content.helperText as string) || ''}
                  onChange={(e) => updateContent('helperText', e.target.value)}
                  className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  placeholder="Small text below button"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(block.content.openInNewTab as boolean) ?? false}
                  onChange={(e) => updateContent('openInNewTab', e.target.checked)}
                  className="w-5 h-5 rounded border-border accent-primary"
                />
                <span className="text-sm font-medium">Open in new tab</span>
              </label>
            </div>

            {/* Button Style */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="text-lg">🎨</span>
                <span className="font-semibold text-foreground">Button Style</span>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Style Variant</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'fill', label: 'Solid', desc: 'Filled background' },
                    { value: 'outline', label: 'Outline', desc: 'Border only' },
                    { value: 'soft', label: 'Soft', desc: 'Light tinted' },
                    { value: 'gradient', label: 'Gradient', desc: 'Color gradient' },
                    { value: 'glass', label: 'Glass', desc: 'Frosted glass' },
                    { value: 'shadow', label: 'Shadow', desc: 'Elevated card' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateContent('variant', opt.value)}
                      className={`p-3 rounded-xl border-2 transition-all text-left ${
                        (block.content.variant || 'fill') === opt.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="font-semibold text-sm">{opt.label}</span>
                      <p className="text-xs text-muted-foreground">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Size</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'small', label: 'Small' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'large', label: 'Large' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateContent('size', opt.value)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                        (block.content.size || 'medium') === opt.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Width</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'auto', label: 'Auto' },
                    { value: 'full', label: 'Full Width' },
                    { value: '75%', label: '75%' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateContent('width', opt.value)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                        (block.content.width || 'full') === opt.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Border Radius</label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={(block.content.borderRadius as number) ?? 8}
                  onChange={(e) => updateContent('borderRadius', parseInt(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Square</span>
                  <span>{(block.content.borderRadius as number) ?? 8}px</span>
                  <span>Pill</span>
                </div>
              </div>
            </div>

            {/* Icon */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="text-lg">⭐</span>
                <span className="font-semibold text-foreground">Icon</span>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Button Icon</label>
                <input
                  type="text"
                  value={(block.content.icon as string) || ''}
                  onChange={(e) => updateContent('icon', e.target.value)}
                  className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  placeholder="🚀 or paste emoji"
                />
                <p className="text-xs text-muted-foreground mt-1">Use an emoji as icon</p>
              </div>

              {(block.content.icon as string) && (
                <div>
                  <label className="block text-sm font-medium mb-2">Icon Position</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'left', label: '⬅️ Left' },
                      { value: 'right', label: '➡️ Right' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => updateContent('iconPosition', opt.value)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                          (block.content.iconPosition || 'left') === opt.value
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Effects */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="text-lg">✨</span>
                <span className="font-semibold text-foreground">Effects</span>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Hover Effect</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'none', label: 'None', desc: 'No animation' },
                    { value: 'lift', label: 'Lift', desc: 'Rise up on hover' },
                    { value: 'scale', label: 'Scale', desc: 'Grow on hover' },
                    { value: 'glow', label: 'Glow', desc: 'Glowing effect' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateContent('hoverEffect', opt.value)}
                      className={`p-3 rounded-xl border-2 transition-all text-left ${
                        (block.content.hoverEffect || 'lift') === opt.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="font-semibold text-sm">{opt.label}</span>
                      <p className="text-xs text-muted-foreground">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Shadow</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: 'none', label: 'None' },
                    { value: 'sm', label: 'Small' },
                    { value: 'md', label: 'Medium' },
                    { value: 'lg', label: 'Large' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateContent('shadow', opt.value)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                        (block.content.shadow || 'none') === opt.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Animation</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'none', label: 'None' },
                    { value: 'fadeIn', label: 'Fade In' },
                    { value: 'slideUp', label: 'Slide Up' },
                    { value: 'bounce', label: 'Bounce' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateContent('animation', opt.value)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                        (block.content.animation || 'none') === opt.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Alignment */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="text-lg">📍</span>
                <span className="font-semibold text-foreground">Alignment</span>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Button Alignment</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'left', label: '⬅️ Left' },
                    { value: 'center', label: '↔️ Center' },
                    { value: 'right', label: '➡️ Right' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateContent('alignment', opt.value)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                        (block.content.alignment || 'center') === opt.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {block.type === 'image' && (
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/20 rounded-xl p-4 border border-violet-200/50 dark:border-violet-800/50">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <Upload className="w-4 h-4 text-violet-600" />
                </div>
                <span className="font-semibold text-foreground">Image Source</span>
              </div>
              <label className="flex items-center justify-center gap-3 px-5 py-4 border-2 border-dashed border-violet-300 dark:border-violet-700 rounded-xl cursor-pointer hover:border-violet-500 hover:bg-violet-500/5 hover:shadow-md transition-all duration-300">
                <Upload className="w-5 h-5 text-violet-600" />
                <span className="text-base font-medium">
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/20 text-muted-foreground">or paste URL</span>
                </div>
              </div>
              <input
                type="url"
                value={(block.content.url as string) || ''}
                onChange={(e) => updateContent('url', e.target.value)}
                className="w-full px-4 py-3 text-sm border-2 border-border rounded-xl bg-background hover:border-violet-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-200"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Preview */}
            {(block.content.url as string) && (
              <div className="rounded-xl overflow-hidden border-2 border-border bg-muted/30">
                <img 
                  src={block.content.url as string} 
                  alt="Preview" 
                  className="w-full h-32 object-cover"
                />
              </div>
            )}

            {/* Size & Layout */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="text-lg">📐</span>
                <span className="font-semibold text-foreground">Size & Layout</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Width</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: '25%', label: '25%' },
                    { value: '50%', label: '50%' },
                    { value: '75%', label: '75%' },
                    { value: '100%', label: 'Full' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateContent('width', opt.value)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                        (block.content.width || '100%') === opt.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Alignment</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'left', icon: '◀️', label: 'Left' },
                    { value: 'center', icon: '⬛', label: 'Center' },
                    { value: 'right', icon: '▶️', label: 'Right' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateContent('alignment', opt.value)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                        (block.content.alignment || 'center') === opt.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span>{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Height Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateContent('heightMode', 'auto')}
                    className={`px-3 py-2.5 text-sm font-medium rounded-lg border-2 transition-all ${
                      (block.content.heightMode || 'auto') === 'auto'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    Auto Height
                  </button>
                  <button
                    onClick={() => updateContent('heightMode', 'fixed')}
                    className={`px-3 py-2.5 text-sm font-medium rounded-lg border-2 transition-all ${
                      (block.content.heightMode || 'auto') === 'fixed'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    Fixed Height
                  </button>
                </div>
                {(block.content.heightMode === 'fixed') && (
                  <div className="mt-3">
                    <input
                      type="range"
                      min="100"
                      max="600"
                      value={(block.content.fixedHeight as number) || 300}
                      onChange={(e) => updateContent('fixedHeight', Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>100px</span>
                      <span className="font-medium text-foreground">{(block.content.fixedHeight as number) || 300}px</span>
                      <span>600px</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Border Radius</label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { value: '0', label: 'None' },
                    { value: '8', label: 'SM' },
                    { value: '16', label: 'MD' },
                    { value: '24', label: 'LG' },
                    { value: '9999', label: 'Full' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateContent('borderRadius', Number(opt.value))}
                      className={`px-2 py-2 text-xs font-medium rounded-lg border-2 transition-all ${
                        String((block.content.borderRadius as number) || 8) === opt.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Effects */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="text-lg">✨</span>
                <span className="font-semibold text-foreground">Effects</span>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Shadow</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'none', label: 'None' },
                    { value: 'sm', label: 'Small' },
                    { value: 'md', label: 'Medium' },
                    { value: 'lg', label: 'Large' },
                    { value: 'xl', label: 'XL' },
                    { value: 'glow', label: '✨ Glow' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateContent('shadow', opt.value)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                        (block.content.shadow || 'none') === opt.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Hover Effect</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'none', label: 'None', icon: '🚫' },
                    { value: 'zoom', label: 'Zoom In', icon: '🔍' },
                    { value: 'lift', label: 'Lift Up', icon: '⬆️' },
                    { value: 'brightness', label: 'Brighten', icon: '☀️' },
                    { value: 'grayscale', label: 'Color Pop', icon: '🎨' },
                    { value: 'blur', label: 'Blur', icon: '🌫️' },
                    { value: 'tilt', label: 'Tilt 3D', icon: '🎯' },
                    { value: 'shine', label: 'Shine', icon: '✨' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateContent('hoverEffect', opt.value)}
                      className={`px-3 py-2.5 text-sm font-medium rounded-lg border-2 transition-all flex items-center gap-2 ${
                        (block.content.hoverEffect || 'none') === opt.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span>{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Filter Preset</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'none', label: 'None' },
                    { value: 'grayscale', label: 'B&W' },
                    { value: 'sepia', label: 'Sepia' },
                    { value: 'vintage', label: 'Vintage' },
                    { value: 'dramatic', label: 'Dramatic' },
                    { value: 'warm', label: 'Warm' },
                    { value: 'cool', label: 'Cool' },
                    { value: 'vivid', label: 'Vivid' },
                    { value: 'muted', label: 'Muted' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateContent('filter', opt.value)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                        (block.content.filter || 'none') === opt.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Opacity: {(block.content.opacity as number) ?? 100}%</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={(block.content.opacity as number) ?? 100}
                  onChange={(e) => updateContent('opacity', Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </div>

            {/* Frame & Decoration */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="text-lg">🖼️</span>
                <span className="font-semibold text-foreground">Frame & Decoration</span>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Frame Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'none', label: 'None', desc: 'No frame' },
                    { value: 'simple', label: 'Simple', desc: 'Clean border' },
                    { value: 'polaroid', label: 'Polaroid', desc: 'Classic photo' },
                    { value: 'shadow-box', label: 'Shadow Box', desc: '3D depth' },
                    { value: 'film', label: 'Film Strip', desc: 'Retro style' },
                    { value: 'torn', label: 'Torn Edge', desc: 'Paper effect' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateContent('frameStyle', opt.value)}
                      className={`p-3 rounded-xl border-2 transition-all text-left ${
                        (block.content.frameStyle || 'none') === opt.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="font-semibold text-sm">{opt.label}</span>
                      <p className="text-xs text-muted-foreground">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {(block.content.frameStyle === 'polaroid') && (
                <div>
                  <label className="block text-sm font-medium mb-2">Polaroid Caption</label>
                  <input
                    type="text"
                    value={(block.content.polaroidCaption as string) || ''}
                    onChange={(e) => updateContent('polaroidCaption', e.target.value)}
                    className="w-full px-4 py-3 text-sm border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    placeholder="Write on the polaroid..."
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Overlay</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'none', label: 'None' },
                    { value: 'gradient-dark', label: 'Dark Fade' },
                    { value: 'gradient-light', label: 'Light Fade' },
                    { value: 'duotone', label: 'Duotone' },
                    { value: 'color', label: 'Color Wash' },
                    { value: 'vignette', label: 'Vignette' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateContent('overlay', opt.value)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                        (block.content.overlay || 'none') === opt.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {((block.content.overlay === 'color') || (block.content.overlay === 'duotone')) && (
                <div>
                  <label className="block text-sm font-medium mb-2">Overlay Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={(block.content.overlayColor as string) || '#8b5cf6'}
                      onChange={(e) => updateContent('overlayColor', e.target.value)}
                      className="w-12 h-10 rounded-lg border-2 border-border cursor-pointer"
                    />
                    <input
                      type="text"
                      value={(block.content.overlayColor as string) || '#8b5cf6'}
                      onChange={(e) => updateContent('overlayColor', e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border-2 border-border rounded-lg bg-background"
                      placeholder="#8b5cf6"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Crop & Aspect Ratio */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="text-lg">✂️</span>
                <span className="font-semibold text-foreground">Crop & Aspect Ratio</span>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Aspect Ratio</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: 'auto', label: 'Auto' },
                    { value: '1:1', label: '1:1' },
                    { value: '4:3', label: '4:3' },
                    { value: '16:9', label: '16:9' },
                    { value: '3:4', label: '3:4' },
                    { value: '9:16', label: '9:16' },
                    { value: '2:1', label: '2:1' },
                    { value: '1:2', label: '1:2' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateContent('aspectRatio', opt.value)}
                      className={`px-2 py-2 text-xs font-medium rounded-lg border-2 transition-all ${
                        (block.content.aspectRatio || 'auto') === opt.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Object Position</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'top', label: '⬆️ Top' },
                    { value: 'center', label: '⬛ Center' },
                    { value: 'bottom', label: '⬇️ Bottom' },
                    { value: 'left', label: '⬅️ Left' },
                    { value: 'right', label: '➡️ Right' },
                    { value: 'top-left', label: '↖️ T-Left' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateContent('objectPosition', opt.value)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                        (block.content.objectPosition || 'center') === opt.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Animation */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="text-lg">🎬</span>
                <span className="font-semibold text-foreground">Animation</span>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Entrance Animation</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'none', label: 'None' },
                    { value: 'fadeIn', label: 'Fade In' },
                    { value: 'slideUp', label: 'Slide Up' },
                    { value: 'slideLeft', label: 'Slide Left' },
                    { value: 'zoomIn', label: 'Zoom In' },
                    { value: 'flip', label: 'Flip' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateContent('animation', opt.value)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                        (block.content.animation || 'none') === opt.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Animation Delay: {((block.content.animationDelay as number) || 0) / 1000}s</label>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="100"
                  value={(block.content.animationDelay as number) || 0}
                  onChange={(e) => updateContent('animationDelay', Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </div>

            {/* Border */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="text-lg">🔲</span>
                <span className="font-semibold text-foreground">Border</span>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Border Style</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: 'none', label: 'None' },
                    { value: 'solid', label: 'Solid' },
                    { value: 'dashed', label: 'Dashed' },
                    { value: 'dotted', label: 'Dotted' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateContent('borderStyle', opt.value)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                        (block.content.borderStyle || 'none') === opt.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {((block.content.borderStyle as string) && (block.content.borderStyle as string) !== 'none') && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Border Width: {(block.content.borderWidth as number) || 2}px</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={(block.content.borderWidth as number) || 2}
                      onChange={(e) => updateContent('borderWidth', Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Border Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={(block.content.borderColor as string) || '#000000'}
                        onChange={(e) => updateContent('borderColor', e.target.value)}
                        className="w-12 h-10 rounded-lg border-2 border-border cursor-pointer"
                      />
                      <input
                        type="text"
                        value={(block.content.borderColor as string) || '#000000'}
                        onChange={(e) => updateContent('borderColor', e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border-2 border-border rounded-lg bg-background"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Caption & Accessibility */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="text-lg">📝</span>
                <span className="font-semibold text-foreground">Caption & Accessibility</span>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Alt Text (for SEO & accessibility)</label>
                <input
                  type="text"
                  value={(block.content.alt as string) || ''}
                  onChange={(e) => updateContent('alt', e.target.value)}
                  className="w-full px-4 py-3 text-sm border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  placeholder="Describe the image..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Caption (optional)</label>
                <input
                  type="text"
                  value={(block.content.caption as string) || ''}
                  onChange={(e) => updateContent('caption', e.target.value)}
                  className="w-full px-4 py-3 text-sm border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  placeholder="Image caption..."
                />
              </div>
            </div>

            {/* Link & Interaction */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="text-lg">🔗</span>
                <span className="font-semibold text-foreground">Link & Interaction</span>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Link URL (optional)</label>
                <input
                  type="url"
                  value={(block.content.link as string) || ''}
                  onChange={(e) => updateContent('link', e.target.value)}
                  className="w-full px-4 py-3 text-sm border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  placeholder="https://..."
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(block.content.openInNewTab as boolean) || false}
                    onChange={(e) => updateContent('openInNewTab', e.target.checked)}
                    className="w-5 h-5 rounded border-border accent-primary"
                  />
                  <span className="text-sm font-medium">Open link in new tab</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(block.content.lightbox as boolean) || false}
                    onChange={(e) => updateContent('lightbox', e.target.checked)}
                    className="w-5 h-5 rounded border-border accent-primary"
                  />
                  <span className="text-sm font-medium">Enable lightbox (click to enlarge)</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(block.content.lazyLoad as boolean) ?? true}
                    onChange={(e) => updateContent('lazyLoad', e.target.checked)}
                    className="w-5 h-5 rounded border-border accent-primary"
                  />
                  <span className="text-sm font-medium">Lazy load (better performance)</span>
                </label>
              </div>
            </div>

            {/* Spacing */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="text-lg">↕️</span>
                <span className="font-semibold text-foreground">Spacing</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Top: {(block.content.marginTop as number) || 0}px</label>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    value={(block.content.marginTop as number) || 0}
                    onChange={(e) => updateContent('marginTop', Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bottom: {(block.content.marginBottom as number) || 0}px</label>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    value={(block.content.marginBottom as number) || 0}
                    onChange={(e) => updateContent('marginBottom', Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {block.type === 'spacer' && (
          <div className="group">
            <label className="block text-base font-semibold mb-2.5">Height</label>
            <select
              value={(block.content.height as string) || '20px'}
              onChange={(e) => updateContent('height', e.target.value)}
              className="w-full px-4 py-3 text-base border border-border rounded-lg bg-background hover:border-primary/50 transition-colors cursor-pointer"
            >
              <option value="10px">Extra Small (10px)</option>
              <option value="20px">Small (20px)</option>
              <option value="40px">Medium (40px)</option>
              <option value="60px">Large (60px)</option>
              <option value="80px">Extra Large (80px)</option>
              <option value="120px">Huge (120px)</option>
            </select>
          </div>
        )}

        {block.type === 'form' && (
          <div className="space-y-6">
            {/* Form Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="text-lg">📝</span>
                <span className="font-semibold text-foreground">Form Settings</span>
              </div>

              <div className="group">
                <label className="block text-sm font-medium mb-2">Form Title</label>
                <input
                  type="text"
                  value={(block.content.title as string) || ''}
                  onChange={(e) => updateContent('title', e.target.value)}
                  className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  placeholder="Contact Us"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-medium mb-2">Description <span className="text-muted-foreground">(optional)</span></label>
                <textarea
                  value={(block.content.description as string) || ''}
                  onChange={(e) => updateContent('description', e.target.value)}
                  className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                  placeholder="Fill out the form below and we'll get back to you."
                  rows={2}
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📋</span>
                  <span className="font-semibold text-foreground">Form Fields</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const fields = (block.content.fields as Array<{
                      id: string;
                      type: string;
                      label: string;
                      placeholder?: string;
                      required?: boolean;
                      options?: string[];
                    }>) || [];
                    updateContent('fields', [
                      ...fields,
                      { 
                        id: `field_${Date.now()}`,
                        type: 'text',
                        label: 'New Field',
                        placeholder: '',
                        required: false
                      }
                    ]);
                  }}
                  className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  + Add Field
                </button>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {((block.content.fields as Array<{
                  id: string;
                  type: string;
                  label: string;
                  placeholder?: string;
                  required?: boolean;
                  options?: string[];
                }>) || [
                  { id: 'name', type: 'text', label: 'Name', placeholder: 'Your name', required: true },
                  { id: 'email', type: 'email', label: 'Email', placeholder: 'your@email.com', required: true },
                  { id: 'message', type: 'textarea', label: 'Message', placeholder: 'Your message...', required: false },
                ]).map((field, index) => (
                  <div 
                    key={field.id || index}
                    className="border-2 border-border rounded-xl p-4 space-y-3 bg-muted/20 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-primary flex items-center gap-2">
                        {field.type === 'text' && '📝'}
                        {field.type === 'email' && '📧'}
                        {field.type === 'phone' && '📞'}
                        {field.type === 'textarea' && '📄'}
                        {field.type === 'select' && '📋'}
                        {field.type === 'checkbox' && '☑️'}
                        {field.type === 'number' && '🔢'}
                        {field.type === 'date' && '📅'}
                        {field.type === 'url' && '🔗'}
                        Field {index + 1}
                      </span>
                      {((block.content.fields as Array<unknown>) || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const fields = (block.content.fields as Array<unknown>) || [];
                            updateContent('fields', fields.filter((_, i) => i !== index));
                          }}
                          className="text-xs text-red-500 hover:text-red-700 font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1.5">Field Type</label>
                        <select
                          value={field.type}
                          onChange={(e) => {
                            const fields = (block.content.fields as Array<{
                              id: string;
                              type: string;
                              label: string;
                              placeholder?: string;
                              required?: boolean;
                              options?: string[];
                            }>) || [];
                            const updated = [...fields];
                            updated[index] = { ...updated[index], type: e.target.value };
                            updateContent('fields', updated);
                          }}
                          className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background cursor-pointer"
                        >
                          <option value="text">Text</option>
                          <option value="email">Email</option>
                          <option value="phone">Phone</option>
                          <option value="number">Number</option>
                          <option value="url">URL</option>
                          <option value="date">Date</option>
                          <option value="textarea">Text Area</option>
                          <option value="select">Dropdown</option>
                          <option value="checkbox">Checkbox</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1.5">Label</label>
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => {
                            const fields = (block.content.fields as Array<{
                              id: string;
                              type: string;
                              label: string;
                              placeholder?: string;
                              required?: boolean;
                              options?: string[];
                            }>) || [];
                            const updated = [...fields];
                            updated[index] = { ...updated[index], label: e.target.value };
                            updateContent('fields', updated);
                          }}
                          className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background"
                          placeholder="Field label"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1.5">Placeholder</label>
                      <input
                        type="text"
                        value={field.placeholder || ''}
                        onChange={(e) => {
                          const fields = (block.content.fields as Array<{
                            id: string;
                            type: string;
                            label: string;
                            placeholder?: string;
                            required?: boolean;
                            options?: string[];
                          }>) || [];
                          const updated = [...fields];
                          updated[index] = { ...updated[index], placeholder: e.target.value };
                          updateContent('fields', updated);
                        }}
                        className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background"
                        placeholder="Placeholder text..."
                      />
                    </div>

                    {field.type === 'select' && (
                      <div>
                        <label className="block text-xs font-medium mb-1.5">Options (one per line)</label>
                        <textarea
                          value={(field.options || []).join('\n')}
                          onChange={(e) => {
                            const fields = (block.content.fields as Array<{
                              id: string;
                              type: string;
                              label: string;
                              placeholder?: string;
                              required?: boolean;
                              options?: string[];
                            }>) || [];
                            const updated = [...fields];
                            updated[index] = { ...updated[index], options: e.target.value.split('\n').filter(o => o.trim()) };
                            updateContent('fields', updated);
                          }}
                          className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background resize-none"
                          placeholder="Option 1&#10;Option 2&#10;Option 3"
                          rows={3}
                        />
                      </div>
                    )}

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.required ?? false}
                        onChange={(e) => {
                          const fields = (block.content.fields as Array<{
                            id: string;
                            type: string;
                            label: string;
                            placeholder?: string;
                            required?: boolean;
                            options?: string[];
                          }>) || [];
                          const updated = [...fields];
                          updated[index] = { ...updated[index], required: e.target.checked };
                          updateContent('fields', updated);
                        }}
                        className="w-4 h-4 rounded border-border accent-primary"
                      />
                      <span className="text-xs font-medium">Required field</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="text-lg">🔘</span>
                <span className="font-semibold text-foreground">Submit Button</span>
              </div>

              <div className="group">
                <label className="block text-sm font-medium mb-2">Button Text</label>
                <input
                  type="text"
                  value={(block.content.submitLabel as string) || 'Submit'}
                  onChange={(e) => updateContent('submitLabel', e.target.value)}
                  className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  placeholder="Submit"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Button Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'solid', label: 'Solid' },
                    { value: 'outline', label: 'Outline' },
                    { value: 'gradient', label: 'Gradient' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateContent('buttonStyle', opt.value)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                        (block.content.buttonStyle || 'solid') === opt.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="text-lg">✅</span>
                <span className="font-semibold text-foreground">After Submission</span>
              </div>

              <div className="group">
                <label className="block text-sm font-medium mb-2">Success Message</label>
                <textarea
                  value={(block.content.successMessage as string) || ''}
                  onChange={(e) => updateContent('successMessage', e.target.value)}
                  className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                  placeholder="Thank you! We'll be in touch soon."
                  rows={2}
                />
              </div>

              <div className="group">
                <label className="block text-sm font-medium mb-2">Redirect URL <span className="text-muted-foreground">(optional)</span></label>
                <input
                  type="url"
                  value={(block.content.redirectUrl as string) || ''}
                  onChange={(e) => updateContent('redirectUrl', e.target.value)}
                  className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  placeholder="https://example.com/thank-you"
                />
                <p className="text-xs text-muted-foreground mt-1">Redirect user after form submission</p>
              </div>
            </div>

            {/* Style */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="text-lg">🎨</span>
                <span className="font-semibold text-foreground">Form Style</span>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Layout</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'stacked', label: 'Stacked', desc: 'Labels above fields' },
                    { value: 'inline', label: 'Inline', desc: 'Labels beside fields' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateContent('layout', opt.value)}
                      className={`p-3 rounded-xl border-2 transition-all text-left ${
                        (block.content.layout || 'stacked') === opt.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="font-semibold text-sm">{opt.label}</span>
                      <p className="text-xs text-muted-foreground">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Field Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'default', label: 'Default' },
                    { value: 'outlined', label: 'Outlined' },
                    { value: 'filled', label: 'Filled' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateContent('fieldStyle', opt.value)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                        (block.content.fieldStyle || 'default') === opt.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(block.content.showLabels as boolean) ?? true}
                    onChange={(e) => updateContent('showLabels', e.target.checked)}
                    className="w-5 h-5 rounded border-border accent-primary"
                  />
                  <div>
                    <span className="text-sm font-medium">Show Field Labels</span>
                    <p className="text-xs text-muted-foreground">Display labels above fields</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(block.content.showRequiredAsterisk as boolean) ?? true}
                    onChange={(e) => updateContent('showRequiredAsterisk', e.target.checked)}
                    className="w-5 h-5 rounded border-border accent-primary"
                  />
                  <div>
                    <span className="text-sm font-medium">Show Required Asterisk</span>
                    <p className="text-xs text-muted-foreground">Mark required fields with *</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Video Block Editor */}
        {block.type === 'video' && (
          <div className="space-y-6">
            {/* Video URL Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="text-lg">🎬</span>
                <span className="font-semibold text-foreground">Video Source</span>
              </div>
              
              <div className="group">
                <label className="block text-sm font-medium mb-2">Video URL</label>
                <input
                  type="url"
                  value={(block.content.url as string) || ''}
                  onChange={(e) => updateContent('url', e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                />
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
                  <span>📺</span> YouTube, Vimeo, TikTok, Instagram Reels, Loom, Wistia
                </p>
              </div>

              {/* Video Preview */}
              {(block.content.url as string) && (
                <div className="bg-secondary/30 rounded-xl p-3 border border-border">
                  <div className="aspect-video bg-black/20 rounded-lg flex items-center justify-center">
                    <span className="text-4xl">▶️</span>
                  </div>
                  <p className="text-xs text-center text-muted-foreground mt-2">Video preview will appear on page</p>
                </div>
              )}
            </div>

            {/* Sizing & Layout */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="text-lg">📐</span>
                <span className="font-semibold text-foreground">Size & Layout</span>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Aspect Ratio</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: '56.25%', label: '16:9', desc: 'Widescreen' },
                    { value: '75%', label: '4:3', desc: 'Standard' },
                    { value: '100%', label: '1:1', desc: 'Square' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateContent('aspectRatio', opt.value)}
                      className={`p-3 rounded-xl border-2 transition-all text-center ${
                        (block.content.aspectRatio || '56.25%') === opt.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="font-semibold text-sm">{opt.label}</span>
                      <p className="text-xs text-muted-foreground">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Width</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: '100%', label: 'Full' },
                    { value: '80%', label: 'Large' },
                    { value: '60%', label: 'Medium' },
                    { value: '50%', label: 'Half' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateContent('width', opt.value)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                        (block.content.width || '100%') === opt.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Alignment</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'left', label: '⬅️ Left' },
                    { value: 'center', label: '↔️ Center' },
                    { value: 'right', label: '➡️ Right' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateContent('alignment', opt.value)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                        (block.content.alignment || 'center') === opt.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Playback Options */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="text-lg">▶️</span>
                <span className="font-semibold text-foreground">Playback Options</span>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border-2 border-border hover:border-primary/30 transition-all">
                  <input
                    type="checkbox"
                    checked={(block.content.autoplay as boolean) || false}
                    onChange={(e) => updateContent('autoplay', e.target.checked)}
                    className="w-5 h-5 rounded border-border accent-primary"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium">Autoplay</span>
                    <p className="text-xs text-muted-foreground">Start playing automatically (requires muted)</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border-2 border-border hover:border-primary/30 transition-all">
                  <input
                    type="checkbox"
                    checked={(block.content.loop as boolean) || false}
                    onChange={(e) => updateContent('loop', e.target.checked)}
                    className="w-5 h-5 rounded border-border accent-primary"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium">Loop</span>
                    <p className="text-xs text-muted-foreground">Repeat video continuously</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border-2 border-border hover:border-primary/30 transition-all">
                  <input
                    type="checkbox"
                    checked={(block.content.muted as boolean) || false}
                    onChange={(e) => updateContent('muted', e.target.checked)}
                    className="w-5 h-5 rounded border-border accent-primary"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium">Muted</span>
                    <p className="text-xs text-muted-foreground">Start with sound off</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border-2 border-border hover:border-primary/30 transition-all">
                  <input
                    type="checkbox"
                    checked={(block.content.hideControls as boolean) || false}
                    onChange={(e) => updateContent('hideControls', e.target.checked)}
                    className="w-5 h-5 rounded border-border accent-primary"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium">Hide Controls</span>
                    <p className="text-xs text-muted-foreground">Remove player controls</p>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Start Time (seconds)</label>
                <input
                  type="number"
                  min="0"
                  value={(block.content.startTime as number) || 0}
                  onChange={(e) => updateContent('startTime', Number(e.target.value))}
                  placeholder="0"
                  className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                />
                <p className="text-xs text-muted-foreground mt-1">Skip to specific time in video</p>
              </div>
            </div>

            {/* Styling Options */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="text-lg">✨</span>
                <span className="font-semibold text-foreground">Styling</span>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Border Radius</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: '0', label: 'None' },
                    { value: '8', label: 'Small' },
                    { value: '16', label: 'Medium' },
                    { value: '24', label: 'Large' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateContent('borderRadius', Number(opt.value))}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                        String((block.content.borderRadius as number) ?? 8) === opt.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Shadow</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: 'none', label: 'None' },
                    { value: 'sm', label: 'Small' },
                    { value: 'md', label: 'Medium' },
                    { value: 'lg', label: 'Large' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateContent('shadow', opt.value)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                        (block.content.shadow || 'none') === opt.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Caption</label>
                <input
                  type="text"
                  value={(block.content.caption as string) || ''}
                  onChange={(e) => updateContent('caption', e.target.value)}
                  placeholder="Add a caption for this video..."
                  className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>

            {/* Privacy & Performance */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="text-lg">🔒</span>
                <span className="font-semibold text-foreground">Privacy & Performance</span>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border-2 border-border hover:border-primary/30 transition-all">
                  <input
                    type="checkbox"
                    checked={(block.content.privacyMode as boolean) || false}
                    onChange={(e) => updateContent('privacyMode', e.target.checked)}
                    className="w-5 h-5 rounded border-border accent-primary"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium">Privacy Enhanced Mode</span>
                    <p className="text-xs text-muted-foreground">YouTube won't store visitor info (YouTube only)</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border-2 border-border hover:border-primary/30 transition-all">
                  <input
                    type="checkbox"
                    checked={(block.content.lazyLoad as boolean) ?? true}
                    onChange={(e) => updateContent('lazyLoad', e.target.checked)}
                    className="w-5 h-5 rounded border-border accent-primary"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium">Lazy Loading</span>
                    <p className="text-xs text-muted-foreground">Load video only when visible</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border-2 border-border hover:border-primary/30 transition-all">
                  <input
                    type="checkbox"
                    checked={(block.content.noRelated as boolean) || false}
                    onChange={(e) => updateContent('noRelated', e.target.checked)}
                    className="w-5 h-5 rounded border-border accent-primary"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium">Hide Related Videos</span>
                    <p className="text-xs text-muted-foreground">Don't show suggestions at end (YouTube only)</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Help Tips */}
            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                <span>💡</span> Tips
              </h4>
              <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                <li>• Autoplay requires the video to be muted</li>
                <li>• Use privacy mode for GDPR compliance</li>
                <li>• Lazy loading improves page performance</li>
              </ul>
            </div>
          </div>
        )}
      
      {/* Social Links Block Editor - Moved to bottom with other Linktree blocks */}
      
      {/* Countdown Timer Block Editor */}
      {block.type === 'countdown' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={(block.content.title as string) || ''}
              onChange={(e) => updateContent('title', e.target.value)}
              placeholder="Event Starts In"
              className="w-full px-3 py-2 border border-border rounded bg-background"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Target Date & Time</label>
            <input
              type="datetime-local"
              value={
                (block.content.targetDate as string)
                  ? new Date(block.content.targetDate as string).toISOString().slice(0, 16)
                  : ''
              }
              onChange={(e) => updateContent('targetDate', new Date(e.target.value).toISOString())}
              className="w-full px-3 py-2 border border-border rounded bg-background"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Expired Message</label>
            <input
              type="text"
              value={(block.content.expiredMessage as string) || ''}
              onChange={(e) => updateContent('expiredMessage', e.target.value)}
              placeholder="Event has started!"
              className="w-full px-3 py-2 border border-border rounded bg-background"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Display Options</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={(block.content.showDays as boolean) ?? true}
                  onChange={(e) => updateContent('showDays', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Show Days</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={(block.content.showHours as boolean) ?? true}
                  onChange={(e) => updateContent('showHours', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Show Hours</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={(block.content.showMinutes as boolean) ?? true}
                  onChange={(e) => updateContent('showMinutes', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Show Minutes</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={(block.content.showSeconds as boolean) ?? true}
                  onChange={(e) => updateContent('showSeconds', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Show Seconds</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Calendar/Events Block Editor */}
      {block.type === 'calendar' && (
        <div className="space-y-4">
          {/* Title */}
          <div className="group">
            <label className="block text-base font-semibold mb-2.5 text-foreground group-hover:text-primary transition-colors duration-200">
              Calendar Title
            </label>
            <input
              type="text"
              value={(block.content.title as string) || ''}
              onChange={(e) => updateContent('title', e.target.value)}
              placeholder="Upcoming Events"
              className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 hover:shadow-md focus:border-primary focus:ring-4 focus:ring-primary/10 focus:shadow-lg transition-all duration-200"
            />
          </div>

          {/* Layout Style */}
          <div className="group">
            <label className="block text-base font-semibold mb-2.5 text-foreground">Layout Style</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'list', label: '📋 List', desc: 'Vertical list view' },
                { value: 'cards', label: '🃏 Cards', desc: 'Grid card layout' },
                { value: 'timeline', label: '📅 Timeline', desc: 'Timeline with dates' },
                { value: 'calendar', label: '🗓️ Calendar', desc: 'Calendar style' }
              ].map((layoutOpt) => (
                <button
                  key={layoutOpt.value}
                  onClick={() => updateContent('layout', layoutOpt.value)}
                  className={`px-3 py-3 border-2 rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                    (block.content.layout || 'list') === layoutOpt.value
                      ? 'border-primary bg-primary/10 text-primary shadow-md'
                      : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                  }`}
                >
                  <span className="text-lg">{layoutOpt.label.split(' ')[0]}</span>
                  <span>{layoutOpt.label.split(' ')[1]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Visual Style */}
          <div className="group">
            <label className="block text-base font-semibold mb-2.5 text-foreground">Visual Style</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'elegant', label: 'Elegant', desc: 'Clean with gradients' },
                { value: 'minimal', label: 'Minimal', desc: 'Simple & clean' },
                { value: 'glass', label: 'Glass', desc: 'Glassmorphism' },
                { value: 'gradient', label: 'Gradient', desc: 'Colorful gradients' }
              ].map((styleOpt) => (
                <button
                  key={styleOpt.value}
                  onClick={() => updateContent('style', styleOpt.value)}
                  className={`px-3 py-2.5 border-2 rounded-xl text-sm font-medium transition-all ${
                    (block.content.style || 'elegant') === styleOpt.value
                      ? 'border-primary bg-primary/10 text-primary shadow-md'
                      : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                  }`}
                >
                  {styleOpt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Display Options */}
          <div className="space-y-3 pt-3 border-t border-border">
            <label className="block text-base font-semibold text-foreground">Display Options</label>
            <div className="space-y-3">
              <label className="flex items-center justify-between gap-2 cursor-pointer group">
                <span className="text-sm font-medium group-hover:text-primary transition-colors">Show Time</span>
                <input
                  type="checkbox"
                  checked={(block.content.showTime as boolean) ?? true}
                  onChange={(e) => updateContent('showTime', e.target.checked)}
                  className="rounded w-5 h-5 text-primary focus:ring-primary"
                />
              </label>
              <label className="flex items-center justify-between gap-2 cursor-pointer group">
                <span className="text-sm font-medium group-hover:text-primary transition-colors">Show Location</span>
                <input
                  type="checkbox"
                  checked={(block.content.showLocation as boolean) ?? true}
                  onChange={(e) => updateContent('showLocation', e.target.checked)}
                  className="rounded w-5 h-5 text-primary focus:ring-primary"
                />
              </label>
              <label className="flex items-center justify-between gap-2 cursor-pointer group">
                <span className="text-sm font-medium group-hover:text-primary transition-colors">Show Description</span>
                <input
                  type="checkbox"
                  checked={(block.content.showDescription as boolean) ?? true}
                  onChange={(e) => updateContent('showDescription', e.target.checked)}
                  className="rounded w-5 h-5 text-primary focus:ring-primary"
                />
              </label>
              <label className="flex items-center justify-between gap-2 cursor-pointer group">
                <span className="text-sm font-medium group-hover:text-primary transition-colors">Show Past Events</span>
                <input
                  type="checkbox"
                  checked={(block.content.showPastEvents as boolean) ?? false}
                  onChange={(e) => updateContent('showPastEvents', e.target.checked)}
                  className="rounded w-5 h-5 text-primary focus:ring-primary"
                />
              </label>
            </div>
          </div>

          {/* Events List */}
          <div className="space-y-3 pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <label className="block text-base font-semibold text-foreground">Events</label>
              <button
                type="button"
                onClick={() => {
                  const events = (block.content.events as Array<{ title: string; date: string; time?: string; location?: string; description?: string; link?: string }>) || [];
                  const newDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
                  updateContent('events', [
                    ...events,
                    { 
                      title: 'New Event', 
                      date: newDate.toISOString(),
                      time: '2:00 PM',
                      location: '',
                      description: '',
                      link: ''
                    }
                  ]);
                }}
                className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                + Add Event
              </button>
            </div>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {((block.content.events as Array<{ title: string; date: string; time?: string; location?: string; description?: string; link?: string }>) || []).map((event, index) => (
                <div key={index} className="border-2 border-border rounded-xl p-4 space-y-3 bg-secondary/20 hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-primary">Event {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const events = (block.content.events as Array<{ title: string; date: string; time?: string; location?: string; description?: string; link?: string }>) || [];
                        updateContent('events', events.filter((_, i) => i !== index));
                      }}
                      className="text-destructive hover:text-destructive/80 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <input
                    type="text"
                    value={event.title || ''}
                    onChange={(e) => {
                      const events = (block.content.events as Array<{ title: string; date: string; time?: string; location?: string; description?: string; link?: string }>) || [];
                      const updated = [...events];
                      updated[index] = { ...updated[index], title: e.target.value };
                      updateContent('events', updated);
                    }}
                    placeholder="Event Title"
                    className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary transition-all"
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={event.date ? new Date(event.date).toISOString().split('T')[0] : ''}
                      onChange={(e) => {
                        const events = (block.content.events as Array<{ title: string; date: string; time?: string; location?: string; description?: string; link?: string }>) || [];
                        const updated = [...events];
                        updated[index] = { ...updated[index], date: new Date(e.target.value).toISOString() };
                        updateContent('events', updated);
                      }}
                      className="px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary transition-all"
                    />
                    <input
                      type="text"
                      value={event.time || ''}
                      onChange={(e) => {
                        const events = (block.content.events as Array<{ title: string; date: string; time?: string; location?: string; description?: string; link?: string }>) || [];
                        const updated = [...events];
                        updated[index] = { ...updated[index], time: e.target.value };
                        updateContent('events', updated);
                      }}
                      placeholder="Time (e.g., 2:00 PM)"
                      className="px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary transition-all"
                    />
                  </div>
                  
                  <input
                    type="text"
                    value={event.location || ''}
                    onChange={(e) => {
                      const events = (block.content.events as Array<{ title: string; date: string; time?: string; location?: string; description?: string; link?: string }>) || [];
                      const updated = [...events];
                      updated[index] = { ...updated[index], location: e.target.value };
                      updateContent('events', updated);
                    }}
                    placeholder="Location"
                    className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary transition-all"
                  />
                  
                  <textarea
                    value={event.description || ''}
                    onChange={(e) => {
                      const events = (block.content.events as Array<{ title: string; date: string; time?: string; location?: string; description?: string; link?: string }>) || [];
                      const updated = [...events];
                      updated[index] = { ...updated[index], description: e.target.value };
                      updateContent('events', updated);
                    }}
                    placeholder="Description"
                    rows={2}
                    className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary transition-all resize-none"
                  />
                  
                  <input
                    type="url"
                    value={event.link || ''}
                    onChange={(e) => {
                      const events = (block.content.events as Array<{ title: string; date: string; time?: string; location?: string; description?: string; link?: string }>) || [];
                      const updated = [...events];
                      updated[index] = { ...updated[index], link: e.target.value };
                      updateContent('events', updated);
                    }}
                    placeholder="Event Link (optional)"
                    className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary transition-all"
                  />
                </div>
              ))}
              
              {((block.content.events as Array<unknown>) || []).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="text-4xl mb-2">📅</div>
                  <p className="text-sm">No events yet. Click "Add Event" to create one.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Testimonial Block Editor */}
      {block.type === 'testimonial' && (
        <div className="space-y-6">
          {/* Layout Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">📐</span>
              <span className="font-semibold text-foreground">Layout</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Display Layout</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'single', label: 'Single', desc: 'One testimonial' },
                  { value: 'grid', label: 'Grid', desc: 'Multiple in grid' },
                  { value: 'carousel', label: 'Carousel', desc: 'Swipeable slider' },
                  { value: 'masonry', label: 'Masonry', desc: 'Pinterest style' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateContent('layout', opt.value)}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      (block.content.layout || 'single') === opt.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="font-semibold text-sm">{opt.label}</span>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {((block.content.layout as string) === 'grid' || (block.content.layout as string) === 'masonry') && (
              <div>
                <label className="block text-sm font-medium mb-2">Columns</label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      onClick={() => updateContent('columns', num)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                        (block.content.columns || 2) === num
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {num} {num === 1 ? 'Column' : 'Columns'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Style Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">🎨</span>
              <span className="font-semibold text-foreground">Style</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Card Style</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'default', label: 'Default', desc: 'Clean white card' },
                  { value: 'cards', label: 'Gradient', desc: 'Purple tinted' },
                  { value: 'minimal', label: 'Minimal', desc: 'No background' },
                  { value: 'quote', label: 'Quote', desc: 'Large centered' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateContent('style', opt.value)}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      (block.content.style || 'default') === opt.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="font-semibold text-sm">{opt.label}</span>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Accent Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={(block.content.accentColor as string) || '#8b5cf6'}
                  onChange={(e) => updateContent('accentColor', e.target.value)}
                  className="w-12 h-10 rounded-lg border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={(block.content.accentColor as string) || '#8b5cf6'}
                  onChange={(e) => updateContent('accentColor', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border-2 border-border rounded-lg bg-background"
                  placeholder="#8b5cf6"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={(block.content.backgroundColor as string) || '#ffffff'}
                  onChange={(e) => updateContent('backgroundColor', e.target.value)}
                  className="w-12 h-10 rounded-lg border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={(block.content.backgroundColor as string) || 'transparent'}
                  onChange={(e) => updateContent('backgroundColor', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border-2 border-border rounded-lg bg-background"
                  placeholder="transparent"
                />
              </div>
            </div>
          </div>

          {/* Display Options */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">👁️</span>
              <span className="font-semibold text-foreground">Display Options</span>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(block.content.showRating as boolean) ?? true}
                  onChange={(e) => updateContent('showRating', e.target.checked)}
                  className="w-5 h-5 rounded border-border accent-primary"
                />
                <div>
                  <span className="text-sm font-medium">Show Star Rating</span>
                  <p className="text-xs text-muted-foreground">Display rating stars</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(block.content.showAvatar as boolean) ?? true}
                  onChange={(e) => updateContent('showAvatar', e.target.checked)}
                  className="w-5 h-5 rounded border-border accent-primary"
                />
                <div>
                  <span className="text-sm font-medium">Show Avatar</span>
                  <p className="text-xs text-muted-foreground">Display author photo or initials</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(block.content.showCompany as boolean) ?? true}
                  onChange={(e) => updateContent('showCompany', e.target.checked)}
                  className="w-5 h-5 rounded border-border accent-primary"
                />
                <div>
                  <span className="text-sm font-medium">Show Company</span>
                  <p className="text-xs text-muted-foreground">Display company name</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(block.content.animated as boolean) ?? true}
                  onChange={(e) => updateContent('animated', e.target.checked)}
                  className="w-5 h-5 rounded border-border accent-primary"
                />
                <div>
                  <span className="text-sm font-medium">Enable Animation</span>
                  <p className="text-xs text-muted-foreground">Animate cards on load</p>
                </div>
              </label>
            </div>
          </div>

          {/* Testimonials Management */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="text-lg">💬</span>
                <span className="font-semibold text-foreground">Testimonials</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const items = (block.content.items as Array<{
                    quote: string;
                    author: string;
                    role?: string;
                    company?: string;
                    avatar?: string;
                    rating?: number;
                  }>) || [];
                  updateContent('items', [
                    ...items,
                    { 
                      quote: 'Amazing experience! Highly recommend.', 
                      author: 'New Customer',
                      role: 'Customer',
                      company: 'Company',
                      rating: 5
                    }
                  ]);
                }}
                className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                + Add Testimonial
              </button>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
              {((block.content.items as Array<{
                quote: string;
                author: string;
                role?: string;
                company?: string;
                avatar?: string;
                rating?: number;
              }>) || [{ quote: '', author: '', role: '', company: '', rating: 5 }]).map((item, index) => (
                <div 
                  key={index} 
                  className="border-2 border-border rounded-xl p-4 space-y-3 bg-muted/20 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary">
                      Testimonial {index + 1}
                    </span>
                    {((block.content.items as Array<unknown>) || []).length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const items = (block.content.items as Array<unknown>) || [];
                          updateContent('items', items.filter((_, i) => i !== index));
                        }}
                        className="text-xs text-red-500 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5">Quote</label>
                    <textarea
                      value={item.quote || ''}
                      onChange={(e) => {
                        const items = (block.content.items as Array<{
                          quote: string;
                          author: string;
                          role?: string;
                          company?: string;
                          avatar?: string;
                          rating?: number;
                        }>) || [];
                        const updated = [...items];
                        updated[index] = { ...updated[index], quote: e.target.value };
                        updateContent('items', updated);
                      }}
                      placeholder="This product changed my life..."
                      rows={3}
                      className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background resize-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1.5">Author Name</label>
                      <input
                        type="text"
                        value={item.author || ''}
                        onChange={(e) => {
                          const items = (block.content.items as Array<{
                            quote: string;
                            author: string;
                            role?: string;
                            company?: string;
                            avatar?: string;
                            rating?: number;
                          }>) || [];
                          const updated = [...items];
                          updated[index] = { ...updated[index], author: e.target.value };
                          updateContent('items', updated);
                        }}
                        placeholder="John Doe"
                        className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5">Role/Title</label>
                      <input
                        type="text"
                        value={item.role || ''}
                        onChange={(e) => {
                          const items = (block.content.items as Array<{
                            quote: string;
                            author: string;
                            role?: string;
                            company?: string;
                            avatar?: string;
                            rating?: number;
                          }>) || [];
                          const updated = [...items];
                          updated[index] = { ...updated[index], role: e.target.value };
                          updateContent('items', updated);
                        }}
                        placeholder="CEO"
                        className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1.5">Company</label>
                      <input
                        type="text"
                        value={item.company || ''}
                        onChange={(e) => {
                          const items = (block.content.items as Array<{
                            quote: string;
                            author: string;
                            role?: string;
                            company?: string;
                            avatar?: string;
                            rating?: number;
                          }>) || [];
                          const updated = [...items];
                          updated[index] = { ...updated[index], company: e.target.value };
                          updateContent('items', updated);
                        }}
                        placeholder="TechCorp"
                        className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5">Avatar URL</label>
                      <input
                        type="url"
                        value={item.avatar || ''}
                        onChange={(e) => {
                          const items = (block.content.items as Array<{
                            quote: string;
                            author: string;
                            role?: string;
                            company?: string;
                            avatar?: string;
                            rating?: number;
                          }>) || [];
                          const updated = [...items];
                          updated[index] = { ...updated[index], avatar: e.target.value };
                          updateContent('items', updated);
                        }}
                        placeholder="https://..."
                        className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5">Rating</label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => {
                            const items = (block.content.items as Array<{
                              quote: string;
                              author: string;
                              role?: string;
                              company?: string;
                              avatar?: string;
                              rating?: number;
                            }>) || [];
                            const updated = [...items];
                            updated[index] = { ...updated[index], rating: star };
                            updateContent('items', updated);
                          }}
                          className="text-2xl hover:scale-110 transition-transform"
                        >
                          <span className={star <= (item.rating || 5) ? 'text-amber-400' : 'text-slate-300'}>
                            ★
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FAQ Block Editor */}
      {block.type === 'faq' && (
        <div className="space-y-6">
          {/* Style Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">🎨</span>
              <span className="font-semibold text-foreground">Style</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Accordion Style</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'default', label: 'Default', desc: 'Simple dividers' },
                  { value: 'bordered', label: 'Bordered', desc: 'Outlined container' },
                  { value: 'cards', label: 'Cards', desc: 'Separate cards' },
                  { value: 'minimal', label: 'Minimal', desc: 'Ultra clean' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateContent('style', opt.value)}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      (block.content.style || 'default') === opt.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="font-semibold text-sm">{opt.label}</span>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Icon Style</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'chevron', label: '▼ Arrow' },
                  { value: 'plus', label: '+ / −' },
                  { value: 'none', label: 'None' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateContent('iconStyle', opt.value)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                      (block.content.iconStyle || 'chevron') === opt.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">📝</span>
              <span className="font-semibold text-foreground">Typography</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Question Size</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'sm', label: 'Small' },
                  { value: 'base', label: 'Medium' },
                  { value: 'lg', label: 'Large' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateContent('questionSize', opt.value)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                      (block.content.questionSize || 'base') === opt.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Answer Size</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'sm', label: 'Small' },
                  { value: 'base', label: 'Normal' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateContent('answerSize', opt.value)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                      (block.content.answerSize || 'sm') === opt.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">🎨</span>
              <span className="font-semibold text-foreground">Colors</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Accent Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={(block.content.accentColor as string) || '#8b5cf6'}
                  onChange={(e) => updateContent('accentColor', e.target.value)}
                  className="w-12 h-10 rounded-lg border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={(block.content.accentColor as string) || '#8b5cf6'}
                  onChange={(e) => updateContent('accentColor', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border-2 border-border rounded-lg bg-background"
                  placeholder="#8b5cf6"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={(block.content.backgroundColor as string) || '#ffffff'}
                  onChange={(e) => updateContent('backgroundColor', e.target.value)}
                  className="w-12 h-10 rounded-lg border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={(block.content.backgroundColor as string) || 'transparent'}
                  onChange={(e) => updateContent('backgroundColor', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border-2 border-border rounded-lg bg-background"
                  placeholder="transparent"
                />
              </div>
            </div>
          </div>

          {/* Behavior Options */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">⚙️</span>
              <span className="font-semibold text-foreground">Behavior</span>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(block.content.allowMultiple as boolean) ?? false}
                  onChange={(e) => updateContent('allowMultiple', e.target.checked)}
                  className="w-5 h-5 rounded border-border accent-primary"
                />
                <div>
                  <span className="text-sm font-medium">Allow Multiple Open</span>
                  <p className="text-xs text-muted-foreground">Open multiple items at once</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(block.content.animated as boolean) ?? true}
                  onChange={(e) => updateContent('animated', e.target.checked)}
                  className="w-5 h-5 rounded border-border accent-primary"
                />
                <div>
                  <span className="text-sm font-medium">Enable Animation</span>
                  <p className="text-xs text-muted-foreground">Smooth expand/collapse</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(block.content.showIcon as boolean) ?? true}
                  onChange={(e) => updateContent('showIcon', e.target.checked)}
                  className="w-5 h-5 rounded border-border accent-primary"
                />
                <div>
                  <span className="text-sm font-medium">Show Question Icons</span>
                  <p className="text-xs text-muted-foreground">Display emoji or icon per item</p>
                </div>
              </label>
            </div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="text-lg">❓</span>
                <span className="font-semibold text-foreground">FAQ Items</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const items = (block.content.items as Array<{ question: string; answer: string; icon?: string }>) || [];
                  updateContent('items', [
                    ...items,
                    { question: 'New Question', answer: 'Add your answer here...', icon: '' }
                  ]);
                }}
                className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                + Add FAQ
              </button>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
              {((block.content.items as Array<{ question: string; answer: string; icon?: string }>) || []).map((item, index) => (
                <div 
                  key={index} 
                  className="border-2 border-border rounded-xl p-4 space-y-3 bg-muted/20 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary">
                      FAQ {index + 1}
                    </span>
                    {((block.content.items as Array<unknown>) || []).length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const items = (block.content.items as Array<unknown>) || [];
                          updateContent('items', items.filter((_, i) => i !== index));
                        }}
                        className="text-xs text-red-500 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-[1fr,auto] gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1.5">Question</label>
                      <input
                        type="text"
                        value={item.question || ''}
                        onChange={(e) => {
                          const items = (block.content.items as Array<{ question: string; answer: string; icon?: string }>) || [];
                          const updated = [...items];
                          updated[index] = { ...updated[index], question: e.target.value };
                          updateContent('items', updated);
                        }}
                        placeholder="What is your question?"
                        className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5">Icon</label>
                      <input
                        type="text"
                        value={item.icon || ''}
                        onChange={(e) => {
                          const items = (block.content.items as Array<{ question: string; answer: string; icon?: string }>) || [];
                          const updated = [...items];
                          updated[index] = { ...updated[index], icon: e.target.value };
                          updateContent('items', updated);
                        }}
                        placeholder="❓"
                        className="w-16 px-3 py-2 text-sm border-2 border-border rounded-lg bg-background text-center focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5">Answer</label>
                    <textarea
                      value={item.answer || ''}
                      onChange={(e) => {
                        const items = (block.content.items as Array<{ question: string; answer: string; icon?: string }>) || [];
                        const updated = [...items];
                        updated[index] = { ...updated[index], answer: e.target.value };
                        updateContent('items', updated);
                      }}
                      placeholder="Provide a helpful answer..."
                      rows={3}
                      className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background resize-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>
                </div>
              ))}

              {((block.content.items as Array<{ question: string; answer: string; icon?: string }>) || []).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <span className="text-4xl mb-2 block">❓</span>
                  <p className="text-sm">No FAQ items yet</p>
                  <p className="text-xs">Click "+ Add FAQ" to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

        {/* Divider Block Editor */}
        {block.type === 'divider' && (
          <>
            <div>
              <label className="block text-base font-semibold mb-2.5">Style</label>
              <select
                value={(block.content.style as string) || 'solid'}
                onChange={(e) => updateContent('style', e.target.value)}
                className="w-full px-4 py-3 text-base border border-border rounded-lg bg-background hover:border-primary/50 transition-colors cursor-pointer"
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
              </select>
            </div>
            
            <div>
              <label className="block text-base font-semibold mb-2.5">
                Thickness: {(block.content.thickness as number) || 2}px
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={(block.content.thickness as number) || 2}
                onChange={(e) => updateContent('thickness', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1px</span>
                <span>10px</span>
              </div>
            </div>
            
            <div>
              <label className="block text-base font-semibold mb-2.5">
                Width: {(block.content.width as string) || '100%'}
              </label>
              <select
                value={(block.content.width as string) || '100%'}
                onChange={(e) => updateContent('width', e.target.value)}
                className="w-full px-4 py-3 text-base border border-border rounded-lg bg-background hover:border-primary/50 transition-colors cursor-pointer"
              >
                <option value="25%">25% - Narrow</option>
                <option value="50%">50% - Half</option>
                <option value="75%">75% - Wide</option>
                <option value="100%">100% - Full Width</option>
              </select>
            </div>
            
            <ColorPickerField
              label="Color"
              value={block.content.color as string}
              onChange={(color) => updateContent('color', color)}
              showColorPicker={showColorPicker}
              setShowColorPicker={setShowColorPicker}
            />
          </>
        )}

      {/* === NEW INTERACTIVE BLOCK EDITORS === */}

      {/* Gallery Block Editor */}
      {block.type === 'gallery' && (
        <div className="space-y-6">
          {/* Layout Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">📐</span>
              <span className="font-semibold text-foreground">Layout</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'grid', label: 'Grid', icon: '⊞', desc: 'Classic grid layout' },
                { value: 'masonry', label: 'Masonry', icon: '⊟', desc: 'Pinterest-style' },
                { value: 'carousel', label: 'Carousel', icon: '⟲', desc: 'Sliding gallery' },
                { value: 'single', label: 'Single', icon: '⬜', desc: 'One at a time' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateContent('layout', opt.value)}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    (block.content.layout || 'grid') === opt.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{opt.icon}</span>
                    <span className="font-semibold text-sm">{opt.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Grid Settings - only show for grid/masonry layouts */}
          {((block.content.layout || 'grid') === 'grid' || (block.content.layout) === 'masonry') && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="text-lg">⊞</span>
                <span className="font-semibold text-foreground">Grid Settings</span>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Desktop Columns</label>
                <div className="grid grid-cols-4 gap-2">
                  {[2, 3, 4, 5].map((cols) => (
                    <button
                      key={cols}
                      onClick={() => updateContent('columns', cols)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                        (block.content.columns || 3) === cols
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {cols}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tablet Columns</label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((cols) => (
                    <button
                      key={cols}
                      onClick={() => updateContent('tabletColumns', cols)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                        (block.content.tabletColumns || 2) === cols
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {cols}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Mobile Columns</label>
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2].map((cols) => (
                    <button
                      key={cols}
                      onClick={() => updateContent('mobileColumns', cols)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                        (block.content.mobileColumns || 1) === cols
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {cols}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Gap Size</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'tight', label: 'Tight' },
                    { value: 'normal', label: 'Normal' },
                    { value: 'loose', label: 'Loose' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateContent('gap', opt.value)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                        (block.content.gap || 'normal') === opt.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Carousel Settings - only show for carousel layout */}
          {(block.content.layout === 'carousel') && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="text-lg">⟲</span>
                <span className="font-semibold text-foreground">Carousel Settings</span>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(block.content.carouselAutoPlay as boolean) || false}
                  onChange={(e) => updateContent('carouselAutoPlay', e.target.checked)}
                  className="w-5 h-5 rounded border-border accent-primary"
                />
                <span className="text-sm font-medium">Auto-play slides</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(block.content.showDots as boolean) ?? true}
                  onChange={(e) => updateContent('showDots', e.target.checked)}
                  className="w-5 h-5 rounded border-border accent-primary"
                />
                <span className="text-sm font-medium">Show navigation dots</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(block.content.showArrows as boolean) ?? true}
                  onChange={(e) => updateContent('showArrows', e.target.checked)}
                  className="w-5 h-5 rounded border-border accent-primary"
                />
                <span className="text-sm font-medium">Show navigation arrows</span>
              </label>
            </div>
          )}

          {/* Image Appearance */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">🖼️</span>
              <span className="font-semibold text-foreground">Image Appearance</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Aspect Ratio</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: 'square', label: '1:1', icon: '⬜' },
                  { value: 'landscape', label: '16:9', icon: '▬' },
                  { value: 'portrait', label: '3:4', icon: '▮' },
                  { value: 'auto', label: 'Auto', icon: '⊡' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateContent('aspectRatio', opt.value)}
                    className={`px-2 py-2 text-xs font-medium rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                      (block.content.aspectRatio || 'square') === opt.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="text-base">{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Border Radius: {(block.content.borderRadius as number) || 8}px</label>
              <input
                type="range"
                min="0"
                max="32"
                value={(block.content.borderRadius as number) || 8}
                onChange={(e) => updateContent('borderRadius', Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Square</span>
                <span>Rounded</span>
              </div>
            </div>
          </div>

          {/* Effects */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">✨</span>
              <span className="font-semibold text-foreground">Effects</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Hover Effect</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'none', label: 'None', icon: '🚫' },
                  { value: 'zoom', label: 'Zoom In', icon: '🔍' },
                  { value: 'lift', label: 'Lift Up', icon: '⬆️' },
                  { value: 'brightness', label: 'Brighten', icon: '☀️' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateContent('hoverEffect', opt.value)}
                    className={`px-3 py-2.5 text-sm font-medium rounded-lg border-2 transition-all flex items-center gap-2 ${
                      (block.content.hoverEffect || 'zoom') === opt.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Image Filter</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'none', label: 'None' },
                  { value: 'grayscale', label: 'B&W' },
                  { value: 'sepia', label: 'Sepia' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateContent('imageFilter', opt.value)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                      (block.content.imageFilter || 'none') === opt.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {((block.content.imageFilter as string) && (block.content.imageFilter as string) !== 'none') && (
                <label className="flex items-center gap-3 cursor-pointer mt-3">
                  <input
                    type="checkbox"
                    checked={(block.content.removeFilterOnHover as boolean) ?? true}
                    onChange={(e) => updateContent('removeFilterOnHover', e.target.checked)}
                    className="w-5 h-5 rounded border-border accent-primary"
                  />
                  <span className="text-sm font-medium">Remove filter on hover</span>
                </label>
              )}
            </div>

            {/* Color Overlay */}
            <div className="bg-secondary/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Color Overlay</span>
                <span className="text-xs text-muted-foreground">{(block.content.overlayOpacity as number) ?? 0}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={(block.content.overlayOpacity as number) ?? 0}
                onChange={(e) => updateContent('overlayOpacity', Number(e.target.value))}
                className="w-full accent-primary"
              />
              {((block.content.overlayOpacity as number) ?? 0) > 0 && (
                <>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={(block.content.overlayColor as string) || '#000000'}
                      onChange={(e) => updateContent('overlayColor', e.target.value)}
                      className="w-12 h-10 rounded-lg border-2 border-border cursor-pointer"
                    />
                    <input
                      type="text"
                      value={(block.content.overlayColor as string) || '#000000'}
                      onChange={(e) => updateContent('overlayColor', e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border-2 border-border rounded-lg bg-background"
                      placeholder="#000000"
                    />
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(block.content.removeOverlayOnHover as boolean) ?? true}
                      onChange={(e) => updateContent('removeOverlayOnHover', e.target.checked)}
                      className="w-5 h-5 rounded border-border accent-primary"
                    />
                    <span className="text-sm font-medium">Remove overlay on hover</span>
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Interaction Options */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">👆</span>
              <span className="font-semibold text-foreground">Interaction</span>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={(block.content.enableLightbox as boolean) ?? true}
                onChange={(e) => updateContent('enableLightbox', e.target.checked)}
                className="w-5 h-5 rounded border-border accent-primary"
              />
              <div>
                <span className="text-sm font-medium">Enable Lightbox</span>
                <p className="text-xs text-muted-foreground">Click to view full-size image</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={(block.content.showCaptions as boolean) || false}
                onChange={(e) => updateContent('showCaptions', e.target.checked)}
                className="w-5 h-5 rounded border-border accent-primary"
              />
              <div>
                <span className="text-sm font-medium">Show Captions</span>
                <p className="text-xs text-muted-foreground">Display image captions on hover</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={(block.content.lazyLoad as boolean) ?? true}
                onChange={(e) => updateContent('lazyLoad', e.target.checked)}
                className="w-5 h-5 rounded border-border accent-primary"
              />
              <div>
                <span className="text-sm font-medium">Lazy Loading</span>
                <p className="text-xs text-muted-foreground">Better page performance</p>
              </div>
            </label>
          </div>

          {/* Images List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="text-lg">🖼️</span>
                <span className="font-semibold text-foreground">Images</span>
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                  {((block.content.images as Array<{ url: string; alt?: string; caption?: string; title?: string; badge?: string; link?: string }>) || []).length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const images = (block.content.images as Array<{ url: string; alt?: string; caption?: string; title?: string; badge?: string; link?: string }>) || [];
                  updateContent('images', [...images, { url: '', alt: '', caption: '', title: '', badge: '', link: '' }]);
                }}
                className="px-3 py-1.5 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                + Add Image
              </button>
            </div>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {((block.content.images as Array<{ url: string; alt?: string; caption?: string; title?: string; badge?: string; link?: string }>) || []).map((img, index) => (
                <div key={index} className="border-2 border-border rounded-xl overflow-hidden bg-secondary/20 hover:border-primary/30 transition-colors">
                  {/* Image Preview */}
                  {img.url && (
                    <div className="h-24 bg-muted/50 relative">
                      <img 
                        src={img.url} 
                        alt={img.alt || `Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-0.5 rounded text-xs font-bold">
                        #{index + 1}
                      </div>
                    </div>
                  )}
                  
                  <div className="p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-primary">Image {index + 1}</span>
                      <button
                        onClick={() => {
                          const images = (block.content.images as Array<{ url: string; alt?: string; caption?: string; title?: string; badge?: string; link?: string }>) || [];
                          updateContent('images', images.filter((_, i) => i !== index));
                        }}
                        className="text-xs text-destructive hover:text-destructive/80 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <input
                      type="url"
                      value={img.url || ''}
                      onChange={(e) => {
                        const images = (block.content.images as Array<{ url: string; alt?: string; caption?: string; title?: string; badge?: string; link?: string }>) || [];
                        const updated = [...images];
                        updated[index] = { ...updated[index], url: e.target.value };
                        updateContent('images', updated);
                      }}
                      placeholder="Image URL"
                      className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={img.title || ''}
                        onChange={(e) => {
                          const images = (block.content.images as Array<{ url: string; alt?: string; caption?: string; title?: string; badge?: string; link?: string }>) || [];
                          const updated = [...images];
                          updated[index] = { ...updated[index], title: e.target.value };
                          updateContent('images', updated);
                        }}
                        placeholder="Title"
                        className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                      <select
                        value={img.badge || ''}
                        onChange={(e) => {
                          const images = (block.content.images as Array<{ url: string; alt?: string; caption?: string; title?: string; badge?: string; link?: string }>) || [];
                          const updated = [...images];
                          updated[index] = { ...updated[index], badge: e.target.value };
                          updateContent('images', updated);
                        }}
                        className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary cursor-pointer"
                      >
                        <option value="">No Badge</option>
                        <option value="NEW">🆕 NEW</option>
                        <option value="FEATURED">⭐ FEATURED</option>
                        <option value="SALE">🏷️ SALE</option>
                        <option value="HOT">🔥 HOT</option>
                      </select>
                    </div>
                    
                    <input
                      type="text"
                      value={img.alt || ''}
                      onChange={(e) => {
                        const images = (block.content.images as Array<{ url: string; alt?: string; caption?: string; title?: string; badge?: string; link?: string }>) || [];
                        const updated = [...images];
                        updated[index] = { ...updated[index], alt: e.target.value };
                        updateContent('images', updated);
                      }}
                      placeholder="Alt text (accessibility)"
                      className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    
                    <input
                      type="text"
                      value={img.caption || ''}
                      onChange={(e) => {
                        const images = (block.content.images as Array<{ url: string; alt?: string; caption?: string; title?: string; badge?: string; link?: string }>) || [];
                        const updated = [...images];
                        updated[index] = { ...updated[index], caption: e.target.value };
                        updateContent('images', updated);
                      }}
                      placeholder="Caption (optional)"
                      className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    
                    <input
                      type="url"
                      value={img.link || ''}
                      onChange={(e) => {
                        const images = (block.content.images as Array<{ url: string; alt?: string; caption?: string; title?: string; badge?: string; link?: string }>) || [];
                        const updated = [...images];
                        updated[index] = { ...updated[index], link: e.target.value };
                        updateContent('images', updated);
                      }}
                      placeholder="Link URL (optional)"
                      className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              ))}

              {((block.content.images as Array<{ url: string }>) || []).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="w-12 h-12 mx-auto rounded-full bg-secondary flex items-center justify-center mb-3">
                    <span className="text-2xl">🖼️</span>
                  </div>
                  <p className="text-sm font-medium">No images yet</p>
                  <p className="text-xs">Click "Add Image" to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pricing Block Editor */}
      {block.type === 'pricing' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Billing Period</label>
            <select
              value={(block.content.billingPeriod as string) || 'monthly'}
              onChange={(e) => updateContent('billingPeriod', e.target.value)}
              className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="lifetime">Lifetime</option>
            </select>
          </div>

          <div className="space-y-3 border-t border-border pt-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">Pricing Tiers</label>
              <button
                type="button"
                onClick={() => {
                  const tiers = (block.content.tiers as Array<{ name: string; price: string; description: string; features: string[]; buttonText: string; buttonUrl: string; highlighted?: boolean }>) || [];
                  updateContent('tiers', [...tiers, {
                    name: 'New Tier',
                    price: '0',
                    description: 'Perfect for getting started',
                    features: ['Feature 1', 'Feature 2', 'Feature 3'],
                    buttonText: 'Get Started',
                    buttonUrl: '',
                    highlighted: false
                  }]);
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                + Add Tier
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {((block.content.tiers as Array<{ name: string; price: string; description: string; features: string[]; buttonText: string; buttonUrl: string; highlighted?: boolean }>) || []).map((tier, tierIndex) => (
                <div key={tierIndex} className="border-2 border-border rounded-xl p-4 space-y-3 bg-secondary/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">Tier {tierIndex + 1}</span>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1 text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tier.highlighted || false}
                          onChange={(e) => {
                            const tiers = (block.content.tiers as Array<{ name: string; price: string; description: string; features: string[]; buttonText: string; buttonUrl: string; highlighted?: boolean }>) || [];
                            const updated = [...tiers];
                            updated[tierIndex] = { ...updated[tierIndex], highlighted: e.target.checked };
                            updateContent('tiers', updated);
                          }}
                          className="w-3 h-3 rounded border-border"
                        />
                        Highlight
                      </label>
                      <button
                        onClick={() => {
                          const tiers = (block.content.tiers as Array<{ name: string; price: string; description: string; features: string[]; buttonText: string; buttonUrl: string; highlighted?: boolean }>) || [];
                          updateContent('tiers', tiers.filter((_, i) => i !== tierIndex));
                        }}
                        className="text-xs text-red-500 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={tier.name}
                      onChange={(e) => {
                        const tiers = (block.content.tiers as Array<{ name: string; price: string; description: string; features: string[]; buttonText: string; buttonUrl: string; highlighted?: boolean }>) || [];
                        const updated = [...tiers];
                        updated[tierIndex] = { ...updated[tierIndex], name: e.target.value };
                        updateContent('tiers', updated);
                      }}
                      placeholder="Tier name"
                      className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <input
                      type="text"
                      value={tier.price}
                      onChange={(e) => {
                        const tiers = (block.content.tiers as Array<{ name: string; price: string; description: string; features: string[]; buttonText: string; buttonUrl: string; highlighted?: boolean }>) || [];
                        const updated = [...tiers];
                        updated[tierIndex] = { ...updated[tierIndex], price: e.target.value };
                        updateContent('tiers', updated);
                      }}
                      placeholder="Price"
                      className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <input
                    type="text"
                    value={tier.description}
                    onChange={(e) => {
                      const tiers = (block.content.tiers as Array<{ name: string; price: string; description: string; features: string[]; buttonText: string; buttonUrl: string; highlighted?: boolean }>) || [];
                      const updated = [...tiers];
                      updated[tierIndex] = { ...updated[tierIndex], description: e.target.value };
                      updateContent('tiers', updated);
                    }}
                    placeholder="Description"
                    className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={tier.buttonText}
                      onChange={(e) => {
                        const tiers = (block.content.tiers as Array<{ name: string; price: string; description: string; features: string[]; buttonText: string; buttonUrl: string; highlighted?: boolean }>) || [];
                        const updated = [...tiers];
                        updated[tierIndex] = { ...updated[tierIndex], buttonText: e.target.value };
                        updateContent('tiers', updated);
                      }}
                      placeholder="Button text"
                      className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <input
                      type="url"
                      value={tier.buttonUrl}
                      onChange={(e) => {
                        const tiers = (block.content.tiers as Array<{ name: string; price: string; description: string; features: string[]; buttonText: string; buttonUrl: string; highlighted?: boolean }>) || [];
                        const updated = [...tiers];
                        updated[tierIndex] = { ...updated[tierIndex], buttonUrl: e.target.value };
                        updateContent('tiers', updated);
                      }}
                      placeholder="Button URL"
                      className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium">Features</label>
                      <button
                        type="button"
                        onClick={() => {
                          const tiers = (block.content.tiers as Array<{ name: string; price: string; description: string; features: string[]; buttonText: string; buttonUrl: string; highlighted?: boolean }>) || [];
                          const updated = [...tiers];
                          updated[tierIndex] = { ...updated[tierIndex], features: [...(tier.features || []), 'New feature'] };
                          updateContent('tiers', updated);
                        }}
                        className="text-xs text-primary hover:text-primary/80"
                      >
                        + Add
                      </button>
                    </div>
                    <div className="space-y-1">
                      {(tier.features || []).map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => {
                              const tiers = (block.content.tiers as Array<{ name: string; price: string; description: string; features: string[]; buttonText: string; buttonUrl: string; highlighted?: boolean }>) || [];
                              const updated = [...tiers];
                              const updatedFeatures = [...(tier.features || [])];
                              updatedFeatures[featureIndex] = e.target.value;
                              updated[tierIndex] = { ...updated[tierIndex], features: updatedFeatures };
                              updateContent('tiers', updated);
                            }}
                            placeholder="Feature"
                            className="flex-1 px-2 py-1 text-xs border border-border rounded bg-background focus:border-primary focus:ring-1 focus:ring-primary/20"
                          />
                          <button
                            onClick={() => {
                              const tiers = (block.content.tiers as Array<{ name: string; price: string; description: string; features: string[]; buttonText: string; buttonUrl: string; highlighted?: boolean }>) || [];
                              const updated = [...tiers];
                              const updatedFeatures = (tier.features || []).filter((_, i) => i !== featureIndex);
                              updated[tierIndex] = { ...updated[tierIndex], features: updatedFeatures };
                              updateContent('tiers', updated);
                            }}
                            className="text-xs text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Features Block Editor */}
      {block.type === 'features' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Layout</label>
            <div className="grid grid-cols-2 gap-2">
              {['grid', 'list'].map((layout) => (
                <button
                  key={layout}
                  onClick={() => updateContent('layout', layout)}
                  className={`px-4 py-3 border-2 rounded-xl capitalize text-base font-medium transition-all ${
                    block.content.layout === layout
                      ? 'border-primary bg-gradient-to-br from-primary/15 to-primary/5 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {layout}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Columns</label>
            <div className="grid grid-cols-3 gap-2">
              {[2, 3, 4].map((cols) => (
                <button
                  key={cols}
                  onClick={() => updateContent('columns', cols)}
                  className={`px-4 py-3 border-2 rounded-xl text-base font-medium transition-all ${
                    block.content.columns === cols
                      ? 'border-primary bg-gradient-to-br from-primary/15 to-primary/5 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {cols}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 border-t border-border pt-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">Feature Items</label>
              <button
                type="button"
                onClick={() => {
                  const features = (block.content.features as Array<{ icon?: string; title: string; description: string }>) || [];
                  updateContent('features', [...features, {
                    icon: '✨',
                    title: 'New Feature',
                    description: 'Feature description goes here'
                  }]);
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                + Add Feature
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {((block.content.features as Array<{ icon?: string; title: string; description: string }>) || []).map((item, index) => (
                <div key={index} className="border-2 border-border rounded-xl p-3 space-y-2 bg-secondary/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">Feature {index + 1}</span>
                    <button
                      onClick={() => {
                        const features = (block.content.features as Array<{ icon?: string; title: string; description: string }>) || [];
                        updateContent('features', features.filter((_, i) => i !== index));
                      }}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    value={item.icon || ''}
                    onChange={(e) => {
                      const features = (block.content.features as Array<{ icon?: string; title: string; description: string }>) || [];
                      const updated = [...features];
                      updated[index] = { ...updated[index], icon: e.target.value };
                      updateContent('features', updated);
                    }}
                    placeholder="Icon (emoji or text)"
                    className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                    maxLength={4}
                  />
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const features = (block.content.features as Array<{ icon?: string; title: string; description: string }>) || [];
                      const updated = [...features];
                      updated[index] = { ...updated[index], title: e.target.value };
                      updateContent('features', updated);
                    }}
                    placeholder="Feature title"
                    className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <textarea
                    value={item.description}
                    onChange={(e) => {
                      const features = (block.content.features as Array<{ icon?: string; title: string; description: string }>) || [];
                      const updated = [...features];
                      updated[index] = { ...updated[index], description: e.target.value };
                      updateContent('features', updated);
                    }}
                    placeholder="Feature description"
                    rows={2}
                    className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats Block Editor */}
      {block.type === 'stats' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Columns</label>
            <div className="grid grid-cols-3 gap-2">
              {[2, 3, 4].map((cols) => (
                <button
                  key={cols}
                  onClick={() => updateContent('columns', cols)}
                  className={`px-4 py-3 border-2 rounded-xl text-base font-medium transition-all ${
                    block.content.columns === cols
                      ? 'border-primary bg-gradient-to-br from-primary/15 to-primary/5 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {cols}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={(block.content.animated as boolean) ?? true}
                onChange={(e) => updateContent('animated', e.target.checked)}
                className="w-4 h-4 rounded border-border"
              />
              Animated Count-Up
            </label>
          </div>

          <div className="space-y-3 border-t border-border pt-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">Stat Items</label>
              <button
                type="button"
                onClick={() => {
                  const stats = (block.content.stats as Array<{ value: string; label: string; suffix?: string; prefix?: string }>) || [];
                  updateContent('stats', [...stats, {
                    value: '100',
                    label: 'New Stat',
                    suffix: '+',
                    prefix: ''
                  }]);
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                + Add Stat
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {((block.content.stats as Array<{ value: string; label: string; suffix?: string; prefix?: string }>) || []).map((stat, index) => (
                <div key={index} className="border-2 border-border rounded-xl p-3 space-y-2 bg-secondary/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">Stat {index + 1}</span>
                    <button
                      onClick={() => {
                        const stats = (block.content.stats as Array<{ value: string; label: string; suffix?: string; prefix?: string }>) || [];
                        updateContent('stats', stats.filter((_, i) => i !== index));
                      }}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={stat.prefix || ''}
                      onChange={(e) => {
                        const stats = (block.content.stats as Array<{ value: string; label: string; suffix?: string; prefix?: string }>) || [];
                        const updated = [...stats];
                        updated[index] = { ...updated[index], prefix: e.target.value };
                        updateContent('stats', updated);
                      }}
                      placeholder="Prefix ($)"
                      className="w-full px-2 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                      maxLength={3}
                    />
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => {
                        const stats = (block.content.stats as Array<{ value: string; label: string; suffix?: string; prefix?: string }>) || [];
                        const updated = [...stats];
                        updated[index] = { ...updated[index], value: e.target.value };
                        updateContent('stats', updated);
                      }}
                      placeholder="Value"
                      className="w-full px-2 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <input
                      type="text"
                      value={stat.suffix || ''}
                      onChange={(e) => {
                        const stats = (block.content.stats as Array<{ value: string; label: string; suffix?: string; prefix?: string }>) || [];
                        const updated = [...stats];
                        updated[index] = { ...updated[index], suffix: e.target.value };
                        updateContent('stats', updated);
                      }}
                      placeholder="Suffix (+)"
                      className="w-full px-2 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                      maxLength={3}
                    />
                  </div>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => {
                      const stats = (block.content.stats as Array<{ value: string; label: string; suffix?: string; prefix?: string }>) || [];
                      const updated = [...stats];
                      updated[index] = { ...updated[index], label: e.target.value };
                      updateContent('stats', updated);
                    }}
                    placeholder="Label"
                    className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Map Block Editor */}
      {block.type === 'map' && (
        <div className="space-y-4">
          <div>
            <label className="block text-base font-semibold mb-2.5">Address</label>
            <input
              type="text"
              value={(block.content.address as string) || ''}
              onChange={(e) => updateContent('address', e.target.value)}
              placeholder="123 Main St, San Francisco, CA"
              className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-2">Latitude</label>
              <input
                type="number"
                step="0.0001"
                value={(block.content.latitude as number) || 0}
                onChange={(e) => updateContent('latitude', Number(e.target.value))}
                placeholder="37.7749"
                className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Longitude</label>
              <input
                type="number"
                step="0.0001"
                value={(block.content.longitude as number) || 0}
                onChange={(e) => updateContent('longitude', Number(e.target.value))}
                placeholder="-122.4194"
                className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-2">Zoom Level (1-20)</label>
              <input
                type="number"
                min="1"
                max="20"
                value={(block.content.zoom as number) || 12}
                onChange={(e) => updateContent('zoom', Number(e.target.value))}
                className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Map Type</label>
              <select
                value={(block.content.mapType as string) || 'roadmap'}
                onChange={(e) => updateContent('mapType', e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="roadmap">Roadmap</option>
                <option value="satellite">Satellite</option>
                <option value="hybrid">Hybrid</option>
                <option value="terrain">Terrain</option>
              </select>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={(block.content.showMarker as boolean) ?? true}
                onChange={(e) => updateContent('showMarker', e.target.checked)}
                className="w-4 h-4 rounded border-border"
              />
              Show Location Marker
            </label>
          </div>
        </div>
      )}

      {/* Hero Block Editor */}
      {block.type === 'hero' && (
        <div className="space-y-4">
          <div>
            <label className="block text-base font-semibold mb-2.5">Headline</label>
            <input
              type="text"
              value={(block.content.headline as string) || ''}
              onChange={(e) => updateContent('headline', e.target.value)}
              placeholder="Welcome to Our Website"
              className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>
          
          <div>
            <label className="block text-base font-semibold mb-2.5">Subheadline</label>
            <input
              type="text"
              value={(block.content.subheadline as string) || ''}
              onChange={(e) => updateContent('subheadline', e.target.value)}
              placeholder="Build amazing microsites with ease"
              className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>
          
          <div>
            <label className="block text-base font-semibold mb-2.5">Background Image URL</label>
            <input
              type="url"
              value={(block.content.backgroundImage as string) || ''}
              onChange={(e) => updateContent('backgroundImage', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-2">Button Text</label>
              <input
                type="text"
                value={(block.content.buttonText as string) || ''}
                onChange={(e) => updateContent('buttonText', e.target.value)}
                placeholder="Get Started"
                className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Button URL</label>
              <input
                type="url"
                value={(block.content.buttonUrl as string) || ''}
                onChange={(e) => updateContent('buttonUrl', e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Height</label>
            <select
              value={(block.content.height as string) || 'large'}
              onChange={(e) => updateContent('height', e.target.value)}
              className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="small">Small (300px)</option>
              <option value="medium">Medium (500px)</option>
              <option value="large">Large (700px)</option>
              <option value="full">Full Screen</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Text Alignment</label>
            <div className="grid grid-cols-3 gap-2">
              {['left', 'center', 'right'].map((align) => (
                <button
                  key={align}
                  onClick={() => updateContent('alignment', align)}
                  className={`px-4 py-3 border-2 rounded-xl capitalize text-base font-medium transition-all ${
                    block.content.alignment === align
                      ? 'border-primary bg-gradient-to-br from-primary/15 to-primary/5 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {align}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">Background Overlay</label>
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={(block.content.overlay as boolean) ?? true}
                  onChange={(e) => updateContent('overlay', e.target.checked)}
                  className="w-3 h-3 rounded border-border"
                />
                Enable
              </label>
            </div>
            {(block.content.overlay as boolean) !== false && (
              <div>
                <label className="block text-xs text-muted-foreground mb-2">
                  Overlay Opacity: {Math.round(((block.content.overlayOpacity as number) || 0.5) * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={(block.content.overlayOpacity as number) || 0.5}
                  onChange={(e) => updateContent('overlayOpacity', Number(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>
      )}
      </div>

      {/* Styling Fields */}
      {(block.type === 'heading' || block.type === 'text') && (
        <div className="space-y-5 sm:space-y-6 pt-6 border-t-2 border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-0.5 w-10 sm:w-12 bg-gradient-to-r from-green-500 via-emerald-500 to-transparent rounded-full animate-pulse" style={{ animationDuration: '3s' }} />
            <h4 className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider">Styling</h4>
            <div className="h-0.5 flex-1 bg-gradient-to-r from-border/50 to-transparent rounded-full" />
          </div>
          
          {/* Colors first - most important */}
          <ColorPickerField
            label="Text Color"
            value={block.styles?.color}
            onChange={(color) => updateStyles('color', color)}
            showColorPicker={showColorPicker}
            setShowColorPicker={setShowColorPicker}
          />

          <ColorPickerField
            label="Background Color"
            value={block.styles?.backgroundColor}
            onChange={(color) => updateStyles('backgroundColor', color)}
            showColorPicker={showColorPicker}
            setShowColorPicker={setShowColorPicker}
          />

          <div className="border-t border-border/30 pt-6 mt-2">
            <div className="flex items-center gap-2 mb-4 group">
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary to-purple-500 group-hover:scale-125 transition-transform duration-300" />
              <h4 className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors duration-300">Typography</h4>
            </div>
            
            <div className="space-y-4 sm:space-y-5">
              <div className="group">
                <label className="block text-base font-semibold mb-2.5 text-foreground group-hover:text-primary transition-colors duration-200">
                  Font Family
                </label>
                <select
                  value={block.styles?.fontFamily || ''}
                  onChange={(e) => updateStyles('fontFamily', e.target.value)}
                  className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 hover:shadow-md focus:border-primary focus:ring-4 focus:ring-primary/10 focus:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <option value="">Default</option>
                  {GOOGLE_FONTS.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="group">
                <label className="block text-base font-semibold mb-2.5 text-foreground group-hover:text-primary transition-colors duration-200">
                  Text Alignment
                </label>
                <div className="flex gap-2">
                  {['left', 'center', 'right'].map((align) => (
                    <button
                      key={align}
                      onClick={() => updateStyles('alignment', align)}
                      className={`flex-1 px-4 py-3 border-2 rounded-xl capitalize text-base font-medium transition-all duration-200 hover:shadow-md ${
                        block.styles?.alignment === align
                          ? 'border-primary bg-gradient-to-br from-primary/15 to-primary/5 text-primary shadow-sm'
                          : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                      }`}
                    >
                      {align}
                    </button>
                  ))}
                </div>
              </div>

              <div className="group">
                <label className="block text-base font-semibold mb-2.5 text-foreground group-hover:text-primary transition-colors duration-200">
                  Font Size
                </label>
                <select
                  value={block.styles?.fontSize || ''}
                  onChange={(e) => updateStyles('fontSize', e.target.value)}
                  className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 hover:shadow-md focus:border-primary focus:ring-4 focus:ring-primary/10 focus:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <option value="">Default</option>
                  <option value="0.75rem">Extra Small (12px)</option>
                  <option value="0.875rem">Small (14px)</option>
                  <option value="1rem">Medium (16px)</option>
                  <option value="1.125rem">Large (18px)</option>
                  <option value="1.25rem">Extra Large (20px)</option>
                  <option value="1.5rem">2XL (24px)</option>
                  <option value="1.875rem">3XL (30px)</option>
                  <option value="2.25rem">4XL (36px)</option>
                </select>
              </div>

              <div className="group">
                <label className="block text-base font-semibold mb-2.5 text-foreground group-hover:text-primary transition-colors duration-200">
                  Font Weight
                </label>
                <select
                  value={block.styles?.fontWeight || ''}
                  onChange={(e) => updateStyles('fontWeight', e.target.value)}
                  className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 hover:shadow-md focus:border-primary focus:ring-4 focus:ring-primary/10 focus:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <option value="">Default</option>
                  <option value="300">Light (300)</option>
                  <option value="400">Regular (400)</option>
                  <option value="500">Medium (500)</option>
                  <option value="600">Semibold (600)</option>
                  <option value="700">Bold (700)</option>
                  <option value="800">Extra Bold (800)</option>
                </select>
              </div>

              <div className="group">
                <label className="block text-base font-semibold mb-2.5 text-foreground group-hover:text-primary transition-colors duration-200">
                  Line Height
                </label>
                <select
                  value={block.styles?.lineHeight || ''}
                  onChange={(e) => updateStyles('lineHeight', e.target.value)}
                  className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 hover:shadow-md focus:border-primary focus:ring-4 focus:ring-primary/10 focus:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <option value="">Default</option>
                  <option value="1">Tight (1)</option>
                  <option value="1.25">Snug (1.25)</option>
                  <option value="1.5">Normal (1.5)</option>
                  <option value="1.75">Relaxed (1.75)</option>
                  <option value="2">Loose (2)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {block.type === 'button' && (
        <div className="space-y-5 sm:space-y-6 pt-6 border-t-2 border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-0.5 w-10 sm:w-12 bg-gradient-to-r from-green-500 via-emerald-500 to-transparent rounded-full animate-pulse" style={{ animationDuration: '3s' }} />
            <h4 className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider">Button Style</h4>
            <div className="h-0.5 flex-1 bg-gradient-to-r from-border/50 to-transparent rounded-full" />
          </div>
          
          <div className="group">
            <label className="block text-base font-semibold mb-2.5 text-foreground group-hover:text-primary transition-colors duration-200">
              Variant
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['solid', 'outline', 'ghost'].map((variant) => (
                <button
                  key={variant}
                  onClick={() => updateStyles('buttonVariant', variant)}
                  className={`px-4 py-3 border-2 rounded-xl capitalize text-base font-medium transition-all duration-200 hover:shadow-md ${
                    block.styles?.buttonVariant === variant
                      ? 'border-primary bg-gradient-to-br from-primary/15 to-primary/5 text-primary shadow-sm'
                      : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                  }`}
                >
                  {variant}
                </button>
              ))}
            </div>
          </div>

          <ColorPickerField
            label="Button Color"
            value={block.styles?.buttonColor}
            onChange={(color) => updateStyles('buttonColor', color)}
            showColorPicker={showColorPicker}
            setShowColorPicker={setShowColorPicker}
          />

          <div className="group">
            <label className="block text-base font-semibold mb-2.5 text-foreground group-hover:text-primary transition-colors duration-200">
              Border Radius
            </label>
            <select
              value={block.styles?.borderRadius || '0.5rem'}
              onChange={(e) => updateStyles('borderRadius', e.target.value)}
              className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 hover:shadow-md focus:border-primary focus:ring-4 focus:ring-primary/10 focus:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <option value="0">None (Square)</option>
              <option value="0.25rem">Small (4px)</option>
              <option value="0.5rem">Medium (8px)</option>
              <option value="0.75rem">Large (12px)</option>
              <option value="9999px">Full (Pill)</option>
            </select>
          </div>
        </div>
      )}

      {block.type === 'image' && (
        <div className="space-y-5 sm:space-y-6 pt-6 border-t-2 border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-0.5 w-10 sm:w-12 bg-gradient-to-r from-green-500 via-emerald-500 to-transparent rounded-full animate-pulse" style={{ animationDuration: '3s' }} />
            <h4 className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider">Image Style</h4>
            <div className="h-0.5 flex-1 bg-gradient-to-r from-border/50 to-transparent rounded-full" />
          </div>
          
          <div className="group">
            <label className="block text-base font-semibold mb-2.5 text-foreground group-hover:text-primary transition-colors duration-200">
              Object Fit
            </label>
            <select
              value={block.styles?.objectFit || 'cover'}
              onChange={(e) => updateStyles('objectFit', e.target.value)}
              className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 hover:shadow-md focus:border-primary focus:ring-4 focus:ring-primary/10 focus:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <option value="cover">Cover (fill frame)</option>
              <option value="contain">Contain (fit inside)</option>
              <option value="fill">Fill (stretch)</option>
              <option value="none">None (original size)</option>
            </select>
          </div>

          <div className="group">
            <label className="block text-base font-semibold mb-2.5 text-foreground group-hover:text-primary transition-colors duration-200">
              Border Radius
            </label>
            <select
              value={block.styles?.borderRadius || '0.5rem'}
              onChange={(e) => updateStyles('borderRadius', e.target.value)}
              className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 hover:shadow-md focus:border-primary focus:ring-4 focus:ring-primary/10 focus:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <option value="0">None (Square)</option>
              <option value="0.25rem">Small (4px)</option>
              <option value="0.5rem">Medium (8px)</option>
              <option value="0.75rem">Large (12px)</option>
              <option value="9999px">Full Circle</option>
            </select>
          </div>
        </div>
      )}

      {/* LINKTREE BLOCKS - Profile Block Inspector */}
      {block.type === 'profile' && (
        <div className="space-y-6">
          {/* Profile Content */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">👤</span>
              <span className="font-semibold text-foreground">Profile Info</span>
            </div>

            <div className="group">
              <label className="block text-sm font-medium mb-2">Display Name</label>
              <input
                type="text"
                value={(block.content.displayName as string) || ''}
                onChange={(e) => updateContent('displayName', e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                placeholder="Your Name"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                value={(block.content.bio as string) || ''}
                onChange={(e) => updateContent('bio', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                placeholder="Tell visitors about yourself..."
              />
              <p className="text-xs text-muted-foreground mt-1">{((block.content.bio as string) || '').length}/160 characters</p>
            </div>

            <div className="group">
              <label className="block text-sm font-medium mb-2">Avatar URL</label>
              <input
                type="url"
                value={(block.content.avatarUrl as string) || ''}
                onChange={(e) => updateContent('avatarUrl', e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                placeholder="https://example.com/avatar.jpg"
              />
              {(block.content.avatarUrl as string) && (
                <div className="mt-2 flex justify-center">
                  <img 
                    src={(block.content.avatarUrl as string)} 
                    alt="Avatar preview" 
                    className="w-16 h-16 rounded-full object-cover border-2 border-border"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="group">
                <label className="block text-sm font-medium mb-2">📍 Location</label>
                <input
                  type="text"
                  value={(block.content.location as string) || ''}
                  onChange={(e) => updateContent('location', e.target.value)}
                  className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  placeholder="City, Country"
                />
              </div>
              <div className="group">
                <label className="block text-sm font-medium mb-2">🔗 Website</label>
                <input
                  type="url"
                  value={(block.content.website as string) || ''}
                  onChange={(e) => updateContent('website', e.target.value)}
                  className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  placeholder="yoursite.com"
                />
              </div>
            </div>
          </div>

          {/* Avatar Style */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">🖼️</span>
              <span className="font-semibold text-foreground">Avatar Style</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Shape</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'circle', label: '⭕ Circle' },
                  { value: 'square', label: '⬜ Rounded Square' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      const currentStyle = (block as unknown as Record<string, unknown>).style as Record<string, unknown> || {};
                      onUpdate({ ...block, style: { ...currentStyle, avatarShape: opt.value } } as Block);
                    }}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                      (((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.avatarShape || 'circle') === opt.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Size: {String(((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.avatarSize || 96)}px</label>
              <input
                type="range"
                min="64"
                max="200"
                value={(((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.avatarSize as number) || 96}
                onChange={(e) => {
                  const currentStyle = (block as unknown as Record<string, unknown>).style as Record<string, unknown> || {};
                  onUpdate({ ...block, style: { ...currentStyle, avatarSize: parseInt(e.target.value) } } as Block);
                }}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Small</span>
                <span>Large</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.glowEnabled as boolean) ?? true}
                  onChange={(e) => {
                    const currentStyle = (block as unknown as Record<string, unknown>).style as Record<string, unknown> || {};
                    onUpdate({ ...block, style: { ...currentStyle, glowEnabled: e.target.checked } } as Block);
                  }}
                  className="w-5 h-5 rounded border-border accent-primary"
                />
                <div>
                  <span className="text-sm font-medium">Glow Effect</span>
                  <p className="text-xs text-muted-foreground">Animated ring around avatar</p>
                </div>
              </label>

              {(((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.glowEnabled as boolean) !== false && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Glow Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={(((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.glowColor as string) || '#667eea'}
                        onChange={(e) => {
                          const currentStyle = (block as unknown as Record<string, unknown>).style as Record<string, unknown> || {};
                          onUpdate({ ...block, style: { ...currentStyle, glowColor: e.target.value } } as Block);
                        }}
                        className="w-12 h-10 rounded-lg border border-border cursor-pointer"
                      />
                      <input
                        type="text"
                        value={(((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.glowColor as string) || '#667eea'}
                        onChange={(e) => {
                          const currentStyle = (block as unknown as Record<string, unknown>).style as Record<string, unknown> || {};
                          onUpdate({ ...block, style: { ...currentStyle, glowColor: e.target.value } } as Block);
                        }}
                        className="flex-1 px-3 py-2 text-sm border-2 border-border rounded-lg bg-background"
                        placeholder="#667eea"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Glow Intensity</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={((((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.glowIntensity as number) ?? 0.5) * 100}
                      onChange={(e) => {
                        const currentStyle = (block as unknown as Record<string, unknown>).style as Record<string, unknown> || {};
                        onUpdate({ ...block, style: { ...currentStyle, glowIntensity: parseInt(e.target.value) / 100 } } as Block);
                      }}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">📝</span>
              <span className="font-semibold text-foreground">Typography</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Name Size</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'text-xl', label: 'Small' },
                  { value: 'text-2xl', label: 'Medium' },
                  { value: 'text-3xl', label: 'Large' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      const currentStyle = (block as unknown as Record<string, unknown>).style as Record<string, unknown> || {};
                      onUpdate({ ...block, style: { ...currentStyle, nameSize: opt.value } } as Block);
                    }}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                      (((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.nameSize || 'text-2xl') === opt.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bio Size</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'text-sm', label: 'Small' },
                  { value: 'text-base', label: 'Medium' },
                  { value: 'text-lg', label: 'Large' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      const currentStyle = (block as unknown as Record<string, unknown>).style as Record<string, unknown> || {};
                      onUpdate({ ...block, style: { ...currentStyle, bioSize: opt.value } } as Block);
                    }}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                      (((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.bioSize || 'text-base') === opt.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Text Alignment</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'left', label: '⬅️ Left' },
                  { value: 'center', label: '↔️ Center' },
                  { value: 'right', label: '➡️ Right' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      const currentStyle = (block as unknown as Record<string, unknown>).style as Record<string, unknown> || {};
                      onUpdate({ ...block, style: { ...currentStyle, textAlign: opt.value } } as Block);
                    }}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                      (((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.textAlign || 'center') === opt.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Display Options */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">👁️</span>
              <span className="font-semibold text-foreground">Display Options</span>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.showLocation as boolean) ?? true}
                  onChange={(e) => {
                    const currentStyle = (block as unknown as Record<string, unknown>).style as Record<string, unknown> || {};
                    onUpdate({ ...block, style: { ...currentStyle, showLocation: e.target.checked } } as Block);
                  }}
                  className="w-5 h-5 rounded border-border accent-primary"
                />
                <div>
                  <span className="text-sm font-medium">Show Location</span>
                  <p className="text-xs text-muted-foreground">Display location badge</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.showWebsite as boolean) ?? true}
                  onChange={(e) => {
                    const currentStyle = (block as unknown as Record<string, unknown>).style as Record<string, unknown> || {};
                    onUpdate({ ...block, style: { ...currentStyle, showWebsite: e.target.checked } } as Block);
                  }}
                  className="w-5 h-5 rounded border-border accent-primary"
                />
                <div>
                  <span className="text-sm font-medium">Show Website</span>
                  <p className="text-xs text-muted-foreground">Display website link</p>
                </div>
              </label>
            </div>
          </div>

          {/* Animation */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">✨</span>
              <span className="font-semibold text-foreground">Animation</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Hover Scale: {(((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.hoverScale as number) || 1.05}x</label>
              <input
                type="range"
                min="100"
                max="120"
                value={((((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.hoverScale as number) || 1.05) * 100}
                onChange={(e) => {
                  const currentStyle = (block as unknown as Record<string, unknown>).style as Record<string, unknown> || {};
                  onUpdate({ ...block, style: { ...currentStyle, hoverScale: parseInt(e.target.value) / 100 } } as Block);
                }}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>None</span>
                <span>Large</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LINKTREE BLOCKS - Link Button Inspector */}
      {block.type === 'linkButton' && (
        <div className="space-y-6">
          {/* Content */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">🔗</span>
              <span className="font-semibold text-foreground">Link Content</span>
            </div>

            <div className="group">
              <label className="block text-sm font-medium mb-2">Button Label</label>
              <input
                type="text"
                value={(block.content.label as string) || ''}
                onChange={(e) => updateContent('label', e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                placeholder="My Awesome Link"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium mb-2">Link URL</label>
              <input
                type="url"
                value={(block.content.url as string) || ''}
                onChange={(e) => updateContent('url', e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                placeholder="https://example.com"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium mb-2">Description <span className="text-muted-foreground">(optional)</span></label>
              <input
                type="text"
                value={(block.content.description as string) || ''}
                onChange={(e) => updateContent('description', e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                placeholder="Brief description of this link..."
              />
            </div>
          </div>

          {/* Media */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">🖼️</span>
              <span className="font-semibold text-foreground">Media</span>
            </div>

            <div className="group">
              <label className="block text-sm font-medium mb-2">Thumbnail URL</label>
              <input
                type="url"
                value={(block.content.thumbnail as string) || ''}
                onChange={(e) => updateContent('thumbnail', e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                placeholder="https://example.com/image.jpg"
              />
              {(block.content.thumbnail as string) && (
                <div className="mt-2 flex justify-center">
                  <img 
                    src={(block.content.thumbnail as string)} 
                    alt="Thumbnail preview" 
                    className="w-16 h-16 rounded-lg object-cover border-2 border-border"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              )}
            </div>

            <div className="group">
              <label className="block text-sm font-medium mb-2">Icon/Emoji</label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={(block.content.emoji as string) || ''}
                  onChange={(e) => updateContent('emoji', e.target.value)}
                  className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-center text-2xl"
                  placeholder="🚀"
                  maxLength={2}
                />
                <select
                  value={(block.content.icon as string) || 'none'}
                  onChange={(e) => updateContent('icon', e.target.value === 'none' ? undefined : e.target.value)}
                  className="w-full px-3 py-3 text-sm border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary transition-all cursor-pointer"
                >
                  <option value="none">No Icon</option>
                  <option value="arrow">Arrow →</option>
                  <option value="chevron">Chevron ›</option>
                  <option value="external">External ↗</option>
                  <option value="play">Play ▶</option>
                  <option value="download">Download ↓</option>
                </select>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Use emoji OR icon (emoji takes priority)</p>
            </div>
          </div>

          {/* Style */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">🎨</span>
              <span className="font-semibold text-foreground">Button Style</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Variant</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'fill', label: 'Solid', desc: 'Filled background' },
                  { value: 'outline', label: 'Outline', desc: 'Border only' },
                  { value: 'soft', label: 'Soft', desc: 'Tinted background' },
                  { value: 'shadow', label: 'Shadow', desc: 'Elevated style' },
                  { value: 'glass', label: 'Glass', desc: 'Frosted glass' },
                  { value: 'gradient', label: 'Gradient', desc: 'Color gradient' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      const currentStyle = (block as unknown as Record<string, unknown>).style as Record<string, unknown> || {};
                      onUpdate({ ...block, style: { ...currentStyle, variant: opt.value } } as Block);
                    }}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      (((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.variant || 'fill') === opt.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="font-semibold text-sm">{opt.label}</span>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Size</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'small', label: 'Small' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'large', label: 'Large' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      const currentStyle = (block as unknown as Record<string, unknown>).style as Record<string, unknown> || {};
                      onUpdate({ ...block, style: { ...currentStyle, size: opt.value } } as Block);
                    }}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                      (((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.size || 'medium') === opt.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Border Radius</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'none', label: 'Square' },
                  { value: 'md', label: 'Rounded' },
                  { value: 'full', label: 'Pill' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      const currentStyle = (block as unknown as Record<string, unknown>).style as Record<string, unknown> || {};
                      onUpdate({ ...block, style: { ...currentStyle, borderRadius: opt.value } } as Block);
                    }}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                      (((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.borderRadius || 'full') === opt.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">🎨</span>
              <span className="font-semibold text-foreground">Colors</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={(((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.backgroundColor as string) || '#000000'}
                  onChange={(e) => {
                    const currentStyle = (block as unknown as Record<string, unknown>).style as Record<string, unknown> || {};
                    onUpdate({ ...block, style: { ...currentStyle, backgroundColor: e.target.value } } as Block);
                  }}
                  className="w-12 h-10 rounded-lg border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={(((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.backgroundColor as string) || '#000000'}
                  onChange={(e) => {
                    const currentStyle = (block as unknown as Record<string, unknown>).style as Record<string, unknown> || {};
                    onUpdate({ ...block, style: { ...currentStyle, backgroundColor: e.target.value } } as Block);
                  }}
                  className="flex-1 px-3 py-2 text-sm border-2 border-border rounded-lg bg-background"
                  placeholder="#000000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Text Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={(((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.textColor as string) || '#FFFFFF'}
                  onChange={(e) => {
                    const currentStyle = (block as unknown as Record<string, unknown>).style as Record<string, unknown> || {};
                    onUpdate({ ...block, style: { ...currentStyle, textColor: e.target.value } } as Block);
                  }}
                  className="w-12 h-10 rounded-lg border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={(((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.textColor as string) || '#FFFFFF'}
                  onChange={(e) => {
                    const currentStyle = (block as unknown as Record<string, unknown>).style as Record<string, unknown> || {};
                    onUpdate({ ...block, style: { ...currentStyle, textColor: e.target.value } } as Block);
                  }}
                  className="flex-1 px-3 py-2 text-sm border-2 border-border rounded-lg bg-background"
                  placeholder="#FFFFFF"
                />
              </div>
            </div>
          </div>

          {/* Animation */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">✨</span>
              <span className="font-semibold text-foreground">Effects</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Hover Effect</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'none', label: 'None' },
                  { value: 'lift', label: 'Lift Up' },
                  { value: 'scale', label: 'Scale' },
                  { value: 'glow', label: 'Glow' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      const currentStyle = (block as unknown as Record<string, unknown>).style as Record<string, unknown> || {};
                      onUpdate({ ...block, style: { ...currentStyle, hoverEffect: opt.value } } as Block);
                    }}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                      (((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.hoverEffect || 'lift') === opt.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Shadow</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: 'none', label: 'None' },
                  { value: 'sm', label: 'S' },
                  { value: 'md', label: 'M' },
                  { value: 'lg', label: 'L' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      const currentStyle = (block as unknown as Record<string, unknown>).style as Record<string, unknown> || {};
                      onUpdate({ ...block, style: { ...currentStyle, shadow: opt.value } } as Block);
                    }}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                      (((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.shadow || 'none') === opt.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">⚙️</span>
              <span className="font-semibold text-foreground">Options</span>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(block.content.openInNewTab as boolean) ?? true}
                  onChange={(e) => updateContent('openInNewTab', e.target.checked)}
                  className="w-5 h-5 rounded border-border accent-primary"
                />
                <div>
                  <span className="text-sm font-medium">Open in New Tab</span>
                  <p className="text-xs text-muted-foreground">Link opens in new window</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(block.content.showDescription as boolean) ?? true}
                  onChange={(e) => updateContent('showDescription', e.target.checked)}
                  className="w-5 h-5 rounded border-border accent-primary"
                />
                <div>
                  <span className="text-sm font-medium">Show Description</span>
                  <p className="text-xs text-muted-foreground">Display subtitle text</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.showThumbnail as boolean) ?? true}
                  onChange={(e) => {
                    const currentStyle = (block as unknown as Record<string, unknown>).style as Record<string, unknown> || {};
                    onUpdate({ ...block, style: { ...currentStyle, showThumbnail: e.target.checked } } as Block);
                  }}
                  className="w-5 h-5 rounded border-border accent-primary"
                />
                <div>
                  <span className="text-sm font-medium">Show Thumbnail</span>
                  <p className="text-xs text-muted-foreground">Display image on button</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* LINKTREE BLOCKS - Social Links Inspector */}
      {block.type === 'social' && (
        <div className="space-y-6">
          {/* Info Banner */}
          <div className="p-3 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/30 dark:to-purple-950/30 rounded-xl border border-pink-200 dark:border-pink-800">
            <p className="text-sm text-pink-700 dark:text-pink-300 font-medium flex items-center gap-2">
              <span>✨</span>
              Click the block on canvas to add your social links
            </p>
          </div>

          {/* Layout */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">📐</span>
              <span className="font-semibold text-foreground">Layout</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Display Mode</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'row', label: 'Row', icon: '→' },
                  { value: 'grid', label: 'Grid', icon: '⊞' },
                  { value: 'list', label: 'List', icon: '☰' }
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => {
                      const currentStyle = (block as unknown as Record<string, unknown>).style as Record<string, unknown> || {};
                      onUpdate({ ...block, style: { ...currentStyle, layout: item.value } } as Block);
                    }}
                    className={`flex flex-col items-center gap-1 px-3 py-2.5 border-2 rounded-xl text-sm font-medium transition-all ${
                      (((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.layout || 'row') === item.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-xs">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Alignment</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'left', label: '⬅️ Left' },
                  { value: 'center', label: '↔️ Center' },
                  { value: 'right', label: '➡️ Right' }
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => {
                      const currentStyle = (block as unknown as Record<string, unknown>).style as Record<string, unknown> || {};
                      onUpdate({ ...block, style: { ...currentStyle, alignment: item.value } } as Block);
                    }}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                      (((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.alignment || 'center') === item.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Icon Style */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">🎨</span>
              <span className="font-semibold text-foreground">Icon Style</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Style</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'filled', label: 'Filled', desc: 'Solid background' },
                  { value: 'outline', label: 'Outline', desc: 'Border only' },
                  { value: 'minimal', label: 'Minimal', desc: 'Icon only' },
                  { value: 'glass', label: 'Glass', desc: 'Frosted glass' }
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => {
                      const currentStyle = (block as unknown as Record<string, unknown>).style as Record<string, unknown> || {};
                      onUpdate({ ...block, style: { ...currentStyle, style: item.value } } as Block);
                    }}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      (((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.style || 'filled') === item.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="font-semibold text-sm">{item.label}</span>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Shape</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: 'circle', label: '⭕' },
                  { value: 'square', label: '⬜' },
                  { value: 'rounded', label: '▢' },
                  { value: 'pill', label: '💊' }
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => {
                      const currentStyle = (block as unknown as Record<string, unknown>).style as Record<string, unknown> || {};
                      onUpdate({ ...block, style: { ...currentStyle, shape: item.value } } as Block);
                    }}
                    className={`px-3 py-2 text-lg rounded-lg border-2 transition-all ${
                      (((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.shape || 'circle') === item.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Size</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: 28, label: 'XS' },
                  { value: 36, label: 'S' },
                  { value: 44, label: 'M' },
                  { value: 52, label: 'L' }
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => {
                      const currentStyle = (block as unknown as Record<string, unknown>).style as Record<string, unknown> || {};
                      onUpdate({ ...block, style: { ...currentStyle, iconSize: item.value } } as Block);
                    }}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                      (((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.iconSize || 44) === item.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Spacing</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'tight', label: 'Tight' },
                  { value: 'normal', label: 'Normal' },
                  { value: 'loose', label: 'Loose' }
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => {
                      const currentStyle = (block as unknown as Record<string, unknown>).style as Record<string, unknown> || {};
                      onUpdate({ ...block, style: { ...currentStyle, spacing: item.value } } as Block);
                    }}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                      (((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.spacing || 'normal') === item.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Effects */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">✨</span>
              <span className="font-semibold text-foreground">Effects</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Hover Effect</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'none', label: 'None' },
                  { value: 'lift', label: 'Lift Up' },
                  { value: 'scale', label: 'Scale' },
                  { value: 'glow', label: 'Glow' },
                  { value: 'bounce', label: 'Bounce' },
                  { value: 'shake', label: 'Shake' }
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => {
                      const currentStyle = (block as unknown as Record<string, unknown>).style as Record<string, unknown> || {};
                      onUpdate({ ...block, style: { ...currentStyle, hoverEffect: item.value } } as Block);
                    }}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                      (((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.hoverEffect || 'scale') === item.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Animation</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'none', label: 'None' },
                  { value: 'fadeIn', label: 'Fade In' },
                  { value: 'slideUp', label: 'Slide Up' },
                  { value: 'stagger', label: 'Stagger' }
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => {
                      const currentStyle = (block as unknown as Record<string, unknown>).style as Record<string, unknown> || {};
                      onUpdate({ ...block, style: { ...currentStyle, animation: item.value } } as Block);
                    }}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                      (((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.animation || 'none') === item.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Display Options */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">👁️</span>
              <span className="font-semibold text-foreground">Display Options</span>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.showLabels as boolean) ?? false}
                  onChange={(e) => {
                    const currentStyle = (block as unknown as Record<string, unknown>).style as Record<string, unknown> || {};
                    onUpdate({ ...block, style: { ...currentStyle, showLabels: e.target.checked } } as Block);
                  }}
                  className="w-5 h-5 rounded border-border accent-primary"
                />
                <div>
                  <span className="text-sm font-medium">Show Labels</span>
                  <p className="text-xs text-muted-foreground">Display platform names</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.useBrandColors as boolean) ?? true}
                  onChange={(e) => {
                    const currentStyle = (block as unknown as Record<string, unknown>).style as Record<string, unknown> || {};
                    onUpdate({ ...block, style: { ...currentStyle, useBrandColors: e.target.checked } } as Block);
                  }}
                  className="w-5 h-5 rounded border-border accent-primary"
                />
                <div>
                  <span className="text-sm font-medium">Brand Colors</span>
                  <p className="text-xs text-muted-foreground">Use platform's official colors</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.useDeepLinking as boolean) ?? true}
                  onChange={(e) => {
                    const currentStyle = (block as unknown as Record<string, unknown>).style as Record<string, unknown> || {};
                    onUpdate({ ...block, style: { ...currentStyle, useDeepLinking: e.target.checked } } as Block);
                  }}
                  className="w-5 h-5 rounded border-border accent-primary"
                />
                <div>
                  <span className="text-sm font-medium">Deep Linking</span>
                  <p className="text-xs text-muted-foreground">Open native apps on mobile</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.showFollowerCount as boolean) ?? false}
                  onChange={(e) => {
                    const currentStyle = (block as unknown as Record<string, unknown>).style as Record<string, unknown> || {};
                    onUpdate({ ...block, style: { ...currentStyle, showFollowerCount: e.target.checked } } as Block);
                  }}
                  className="w-5 h-5 rounded border-border accent-primary"
                />
                <div>
                  <span className="text-sm font-medium">Show Follower Count</span>
                  <p className="text-xs text-muted-foreground">Display your follower numbers</p>
                </div>
              </label>
            </div>
          </div>

          {/* Custom Color (when brand colors disabled) */}
          {!(((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.useBrandColors as boolean) && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="text-lg">🎨</span>
                <span className="font-semibold text-foreground">Custom Color</span>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Icon Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={(((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.customColor as string) || '#8b5cf6'}
                    onChange={(e) => {
                      const currentStyle = (block as unknown as Record<string, unknown>).style as Record<string, unknown> || {};
                      onUpdate({ ...block, style: { ...currentStyle, customColor: e.target.value } } as Block);
                    }}
                    className="w-12 h-10 rounded-lg border border-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={(((block as unknown as Record<string, unknown>).style as Record<string, unknown>)?.customColor as string) || '#8b5cf6'}
                    onChange={(e) => {
                      const currentStyle = (block as unknown as Record<string, unknown>).style as Record<string, unknown> || {};
                      onUpdate({ ...block, style: { ...currentStyle, customColor: e.target.value } } as Block);
                    }}
                    className="flex-1 px-3 py-2 text-sm border-2 border-border rounded-lg bg-background"
                    placeholder="#8b5cf6"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================
          HEADER BLOCK SETTINGS
          ============================================ */}
      {block.type === 'header' && (
        <div className="space-y-6">
          {/* Site Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">🏷️</span>
              <span className="font-semibold text-foreground">Site Identity</span>
            </div>

            <div className="group">
              <label className="block text-sm font-medium mb-2">Site Name</label>
              <input
                type="text"
                value={(block.content.siteName as string) || ''}
                onChange={(e) => updateContent('siteName', e.target.value)}
                placeholder="Your Brand"
                className="w-full px-4 py-3 border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium mb-2">Logo URL</label>
              <input
                type="text"
                value={(block.content.logoUrl as string) || ''}
                onChange={(e) => updateContent('logoUrl', e.target.value)}
                placeholder="https://example.com/logo.png"
                className="w-full px-4 py-3 border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Logo Size</label>
              <input
                type="range"
                min="24"
                max="80"
                value={(block.content.logoSize as number) || 40}
                onChange={(e) => updateContent('logoSize', Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Small</span>
                <span className="font-medium text-foreground">{(block.content.logoSize as number) || 40}px</span>
                <span>Large</span>
              </div>
            </div>
          </div>

          {/* Header Style */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">🎨</span>
              <span className="font-semibold text-foreground">Header Style</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Style Preset</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'default', label: 'Default', desc: 'Clean solid' },
                  { value: 'minimal', label: 'Minimal', desc: 'Simple & light' },
                  { value: 'gradient', label: 'Gradient', desc: 'Color flow' },
                  { value: 'glass', label: 'Glass', desc: 'Frosted blur' },
                  { value: 'transparent', label: 'Transparent', desc: 'See-through' },
                  { value: 'bordered', label: 'Bordered', desc: 'Bottom line' },
                ].map((style) => (
                  <button
                    key={style.value}
                    onClick={() => updateContent('style', style.value)}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      (block.content.style || 'default') === style.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="font-semibold text-sm">{style.label}</span>
                    <p className="text-xs text-muted-foreground">{style.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Header Height</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'compact', label: 'Compact' },
                  { value: 'default', label: 'Default' },
                  { value: 'tall', label: 'Tall' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateContent('headerHeight', opt.value)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                      (block.content.headerHeight || 'default') === opt.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Background Blur</label>
              <input
                type="range"
                min="0"
                max="20"
                value={(block.content.backgroundBlur as number) || 0}
                onChange={(e) => updateContent('backgroundBlur', Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>None</span>
                <span className="font-medium text-foreground">{(block.content.backgroundBlur as number) || 0}px</span>
                <span>Max</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">🧭</span>
              <span className="font-semibold text-foreground">Navigation</span>
            </div>

            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Navigation Links</label>
              <button
                onClick={() => {
                  const currentLinks = (block.content.navLinks as Array<{label: string; url: string}>) || [];
                  updateContent('navLinks', [...currentLinks, { label: 'New Link', url: '#' }]);
                }}
                className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
              >
                + Add Link
              </button>
            </div>
            <div className="space-y-2">
              {((block.content.navLinks as Array<{label: string; url: string}>) || []).map((link, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => {
                      const links = [...((block.content.navLinks as Array<{label: string; url: string}>) || [])];
                      links[idx] = { ...links[idx], label: e.target.value };
                      updateContent('navLinks', links);
                    }}
                    placeholder="Label"
                    className="flex-1 px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary transition-all"
                  />
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => {
                      const links = [...((block.content.navLinks as Array<{label: string; url: string}>) || [])];
                      links[idx] = { ...links[idx], url: e.target.value };
                      updateContent('navLinks', links);
                    }}
                    placeholder="URL"
                    className="flex-1 px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary transition-all"
                  />
                  <button
                    onClick={() => {
                      const links = ((block.content.navLinks as Array<{label: string; url: string}>) || []).filter((_, i) => i !== idx);
                      updateContent('navLinks', links);
                    }}
                    className="px-2 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Nav Style</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'links', label: 'Links' },
                  { value: 'pills', label: 'Pills' },
                  { value: 'underline', label: 'Underline' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateContent('navStyle', opt.value)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                      (block.content.navStyle || 'links') === opt.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mobile Menu Style</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'hamburger', label: '☰ Hamburger' },
                  { value: 'slide', label: '◀️ Slide In' },
                  { value: 'fullscreen', label: '⬛ Fullscreen' },
                  { value: 'dropdown', label: '⬇️ Dropdown' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateContent('mobileMenuStyle', opt.value)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                      (block.content.mobileMenuStyle || 'hamburger') === opt.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Announcement Bar */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">📢</span>
              <span className="font-semibold text-foreground">Announcement Bar</span>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={(block.content.showAnnouncement as boolean) || false}
                onChange={(e) => updateContent('showAnnouncement', e.target.checked)}
                className="w-5 h-5 rounded border-border accent-primary"
              />
              <div>
                <span className="text-sm font-medium">Show Announcement Bar</span>
                <p className="text-xs text-muted-foreground">Display message above header</p>
              </div>
            </label>
            
            {(block.content.showAnnouncement as boolean) && (
              <>
                <input
                  type="text"
                  value={(block.content.announcementText as string) || ''}
                  onChange={(e) => updateContent('announcementText', e.target.value)}
                  placeholder="🎉 Special announcement here!"
                  className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary transition-all"
                />
                <div>
                  <label className="block text-sm font-medium mb-2">Announcement Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'info', label: 'ℹ️ Info' },
                      { value: 'success', label: '✅ Success' },
                      { value: 'warning', label: '⚠️ Warning' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => updateContent('announcementStyle', opt.value)}
                        className={`px-2 py-2 text-xs font-medium rounded-lg border-2 transition-all ${
                          (block.content.announcementStyle || 'info') === opt.value
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(block.content.announcementDismissible as boolean) ?? true}
                    onChange={(e) => updateContent('announcementDismissible', e.target.checked)}
                    className="w-5 h-5 rounded border-border accent-primary"
                  />
                  <span className="text-sm font-medium">Allow dismiss</span>
                </label>
              </>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">🔘</span>
              <span className="font-semibold text-foreground">Call to Action</span>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={(block.content.showCta as boolean) || false}
                onChange={(e) => updateContent('showCta', e.target.checked)}
                className="w-5 h-5 rounded border-border accent-primary"
              />
              <div>
                <span className="text-sm font-medium">Show Primary CTA</span>
                <p className="text-xs text-muted-foreground">Main action button</p>
              </div>
            </label>

            {(block.content.showCta as boolean) && (
              <div className="space-y-3 pl-4 border-l-2 border-primary/30">
                <input
                  type="text"
                  value={(block.content.ctaLabel as string) || ''}
                  onChange={(e) => updateContent('ctaLabel', e.target.value)}
                  placeholder="Get Started"
                  className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary transition-all"
                />
                <input
                  type="text"
                  value={(block.content.ctaUrl as string) || ''}
                  onChange={(e) => updateContent('ctaUrl', e.target.value)}
                  placeholder="https://example.com/signup"
                  className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary transition-all"
                />
                <div>
                  <label className="block text-xs font-medium mb-2">Button Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['solid', 'outline', 'gradient'].map((style) => (
                      <button
                        key={style}
                        onClick={() => updateContent('ctaStyle', style)}
                        className={`px-2 py-2 text-xs font-medium rounded-lg border-2 capitalize transition-all ${
                          (block.content.ctaStyle || 'solid') === style
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={(block.content.showSecondaryCta as boolean) || false}
                onChange={(e) => updateContent('showSecondaryCta', e.target.checked)}
                className="w-5 h-5 rounded border-border accent-primary"
              />
              <div>
                <span className="text-sm font-medium">Show Secondary CTA</span>
                <p className="text-xs text-muted-foreground">Additional action</p>
              </div>
            </label>

            {(block.content.showSecondaryCta as boolean) && (
              <div className="space-y-3 pl-4 border-l-2 border-border">
                <input
                  type="text"
                  value={(block.content.secondaryCtaLabel as string) || ''}
                  onChange={(e) => updateContent('secondaryCtaLabel', e.target.value)}
                  placeholder="Learn More"
                  className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary transition-all"
                />
                <input
                  type="text"
                  value={(block.content.secondaryCtaUrl as string) || ''}
                  onChange={(e) => updateContent('secondaryCtaUrl', e.target.value)}
                  placeholder="https://example.com/about"
                  className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary transition-all"
                />
              </div>
            )}
          </div>

          {/* Behavior */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">⚙️</span>
              <span className="font-semibold text-foreground">Behavior</span>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(block.content.sticky as boolean) ?? true}
                  onChange={(e) => updateContent('sticky', e.target.checked)}
                  className="w-5 h-5 rounded border-border accent-primary"
                />
                <div>
                  <span className="text-sm font-medium">Sticky Header</span>
                  <p className="text-xs text-muted-foreground">Stay visible while scrolling</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(block.content.hideOnScroll as boolean) || false}
                  onChange={(e) => updateContent('hideOnScroll', e.target.checked)}
                  className="w-5 h-5 rounded border-border accent-primary"
                />
                <div>
                  <span className="text-sm font-medium">Hide on Scroll Down</span>
                  <p className="text-xs text-muted-foreground">Appear when scrolling up</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(block.content.showSearch as boolean) || false}
                  onChange={(e) => updateContent('showSearch', e.target.checked)}
                  className="w-5 h-5 rounded border-border accent-primary"
                />
                <div>
                  <span className="text-sm font-medium">Show Search Icon</span>
                  <p className="text-xs text-muted-foreground">Enable search functionality</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          PAYMENT BLOCK SETTINGS
          ============================================ */}
      {block.type === 'payment' && (
        <div className="space-y-6">
          {/* Payment Mode */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">💳</span>
              <span className="font-semibold text-foreground">Payment Type</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Payment Mode</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'tips', label: '💰 Tips', desc: 'Tip jar' },
                  { value: 'payment', label: '💳 Payment', desc: 'One-time' },
                  { value: 'donation', label: '❤️ Donation', desc: 'Support' },
                ].map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() => updateContent('paymentMode', mode.value)}
                    className={`p-3 rounded-xl border-2 transition-all text-center ${
                      (block.content.paymentMode || 'tips') === mode.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="font-semibold text-sm">{mode.label}</div>
                    <p className="text-xs text-muted-foreground">{mode.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Content */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">✏️</span>
              <span className="font-semibold text-foreground">Content</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={(block.content.title as string) || ''}
                onChange={(e) => updateContent('title', e.target.value)}
                placeholder="Support My Work"
                className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={(block.content.description as string) || ''}
                onChange={(e) => updateContent('description', e.target.value)}
                placeholder="Your support helps me create more content!"
                rows={3}
                className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Button Text</label>
              <input
                type="text"
                value={(block.content.buttonText as string) || ''}
                onChange={(e) => updateContent('buttonText', e.target.value)}
                placeholder="Support"
                className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Thank You Message</label>
              <input
                type="text"
                value={(block.content.thankYouMessage as string) || ''}
                onChange={(e) => updateContent('thankYouMessage', e.target.value)}
                placeholder="Thank you for your support! 💖"
                className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          {/* Amount Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">💵</span>
              <span className="font-semibold text-foreground">Amount Options</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Currency</label>
              <select
                value={(block.content.currency as string) || 'USD'}
                onChange={(e) => updateContent('currency', e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer"
              >
                <option value="USD">💵 USD - US Dollar</option>
                <option value="EUR">💶 EUR - Euro</option>
                <option value="GBP">💷 GBP - British Pound</option>
                <option value="CAD">🍁 CAD - Canadian Dollar</option>
                <option value="AUD">🦘 AUD - Australian Dollar</option>
                <option value="JPY">💴 JPY - Japanese Yen</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Preset Amounts</label>
              <p className="text-xs text-muted-foreground mb-2">Comma-separated values (e.g., 5,10,25,50)</p>
              <input
                type="text"
                value={((block.content.customAmounts as number[]) || [5, 10, 25, 50]).join(',')}
                onChange={(e) => {
                  const amounts = e.target.value.split(',').map(v => parseInt(v.trim())).filter(n => !isNaN(n));
                  updateContent('customAmounts', amounts);
                }}
                placeholder="5,10,25,50"
                className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(block.content.allowCustomAmount as boolean) ?? true}
                  onChange={(e) => updateContent('allowCustomAmount', e.target.checked)}
                  className="w-5 h-5 rounded border-border accent-primary"
                />
                <div>
                  <span className="text-sm font-medium">Allow Custom Amount</span>
                  <p className="text-xs text-muted-foreground">Let users enter their own amount</p>
                </div>
              </label>
            </div>

            {(block.content.allowCustomAmount as boolean) !== false && (
              <div className="grid grid-cols-2 gap-3 pl-4 border-l-2 border-primary/30">
                <div>
                  <label className="block text-xs font-medium mb-1">Min Amount</label>
                  <input
                    type="number"
                    value={(block.content.minAmount as number) || 1}
                    onChange={(e) => updateContent('minAmount', parseInt(e.target.value) || 1)}
                    min="1"
                    className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Max Amount</label>
                  <input
                    type="number"
                    value={(block.content.maxAmount as number) || 500}
                    onChange={(e) => updateContent('maxAmount', parseInt(e.target.value) || 500)}
                    min="1"
                    className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary transition-all"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Visual Style */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">🎨</span>
              <span className="font-semibold text-foreground">Visual Style</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Layout Variant</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'card', label: '🃏 Card', desc: 'Boxed layout' },
                  { value: 'inline', label: '➡️ Inline', desc: 'Compact style' },
                ].map((variant) => (
                  <button
                    key={variant.value}
                    onClick={() => updateStyles('variant', variant.value)}
                    className={`p-3 rounded-xl border-2 transition-all text-center ${
                      (block.styles?.variant || 'card') === variant.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="font-semibold text-sm">{variant.label}</div>
                    <p className="text-xs text-muted-foreground">{variant.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <ColorPickerField
              label="Background Color"
              value={(block.styles?.backgroundColor as string) || '#ffffff'}
              onChange={(color) => updateStyles('backgroundColor', color)}
              showColorPicker={showColorPicker}
              setShowColorPicker={setShowColorPicker}
            />

            <ColorPickerField
              label="Accent Color"
              value={(block.styles?.accentColor as string) || '#8b5cf6'}
              onChange={(color) => updateStyles('accentColor', color)}
              showColorPicker={showColorPicker}
              setShowColorPicker={setShowColorPicker}
            />

            <ColorPickerField
              label="Text Color"
              value={(block.styles?.textColor as string) || '#1f2937'}
              onChange={(color) => updateStyles('textColor', color)}
              showColorPicker={showColorPicker}
              setShowColorPicker={setShowColorPicker}
            />

            <div>
              <label className="block text-sm font-medium mb-2">Border Radius</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: 'rounded-none', label: 'None' },
                  { value: 'rounded-lg', label: 'Small' },
                  { value: 'rounded-xl', label: 'Medium' },
                  { value: 'rounded-2xl', label: 'Large' },
                ].map((radius) => (
                  <button
                    key={radius.value}
                    onClick={() => updateStyles('borderRadius', radius.value)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                      (block.styles?.borderRadius || 'rounded-2xl') === radius.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {radius.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stripe Integration */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">🔗</span>
              <span className="font-semibold text-foreground">Stripe Integration</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Integration Method</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { value: 'payment-link', label: '🔗 Payment Link', desc: 'Use Stripe Payment Link URL' },
                  { value: 'checkout', label: '💳 Checkout', desc: 'Stripe Checkout Session' },
                  { value: 'connect', label: '⚡ Connect', desc: 'Full Stripe Connect integration' },
                ].map((method) => (
                  <button
                    key={method.value}
                    onClick={() => updateContent('stripeIntegration', method.value)}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      (block.content.stripeIntegration || 'payment-link') === method.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="font-semibold text-sm">{method.label}</div>
                    <p className="text-xs text-muted-foreground">{method.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {(block.content.stripeIntegration === 'payment-link' || !block.content.stripeIntegration) && (
              <div className="space-y-3 pl-4 border-l-2 border-primary/30">
                <div>
                  <label className="block text-sm font-medium mb-2">Stripe Payment Link</label>
                  <input
                    type="url"
                    value={(block.content.stripePaymentLink as string) || ''}
                    onChange={(e) => updateContent('stripePaymentLink', e.target.value)}
                    placeholder="https://buy.stripe.com/..."
                    className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    📝 Create a Payment Link in your Stripe Dashboard → Payment Links
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Checkout Experience</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'redirect', label: '🔗 Redirect', desc: 'Opens in new tab' },
                      { value: 'embedded', label: '📱 Embedded', desc: 'Opens in overlay' },
                    ].map((exp) => (
                      <button
                        key={exp.value}
                        onClick={() => updateContent('checkoutExperience', exp.value)}
                        className={`p-3 rounded-xl border-2 transition-all text-center ${
                          (block.content.checkoutExperience || 'redirect') === exp.value
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="font-semibold text-sm">{exp.label}</div>
                        <p className="text-xs text-muted-foreground">{exp.desc}</p>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    💡 Embedded keeps users on your page, Redirect opens Stripe in new tab
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">✨</span>
                    <div className="flex-1">
                      <h5 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">Quick Setup</h5>
                      <ol className="text-xs text-green-700 dark:text-green-300 space-y-1 list-decimal list-inside">
                        <li>Go to Stripe Dashboard</li>
                        <li>Click "Payment Links" → "Create Payment Link"</li>
                        <li>Set up your product/amount</li>
                        <li>Copy the link and paste above</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {block.content.stripeIntegration === 'checkout' && (
              <div className="space-y-3 pl-4 border-l-2 border-primary/30">
                <div>
                  <label className="block text-sm font-medium mb-2">Stripe Publishable Key</label>
                  <input
                    type="text"
                    value={(block.content.stripePublishableKey as string) || ''}
                    onChange={(e) => updateContent('stripePublishableKey', e.target.value)}
                    placeholder="pk_live_..."
                    className="w-full px-4 py-3 text-sm font-mono border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Product/Price ID</label>
                  <input
                    type="text"
                    value={(block.content.stripePriceId as string) || ''}
                    onChange={(e) => updateContent('stripePriceId', e.target.value)}
                    placeholder="price_..."
                    className="w-full px-4 py-3 text-sm font-mono border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary transition-all"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    💡 Found in Stripe Dashboard → Products
                  </p>
                </div>
              </div>
            )}

            {block.content.stripeIntegration === 'connect' && (
              <div className="bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚡</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Stripe Connect</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                      Connect your Stripe account in <strong>Settings → Integrations</strong> to enable full payment processing.
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      💡 This option requires backend integration and OAuth setup.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!block.content.stripePaymentLink && !block.content.stripePublishableKey && (
              <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <span className="text-lg">⚠️</span>
                  <div className="flex-1">
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                      <strong>Preview Mode:</strong> Payments are simulated until you configure Stripe above.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================
          PRODUCT BLOCK SETTINGS
          ============================================ */}
      {block.type === 'product' && (
        <div className="space-y-6">
          {/* Product Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">🛍️</span>
              <span className="font-semibold text-foreground">Product Info</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Product Name</label>
              <input
                type="text"
                value={(block.content.name as string) || ''}
                onChange={(e) => updateContent('name', e.target.value)}
                placeholder="Amazing Product"
                className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={(block.content.description as string) || ''}
                onChange={(e) => updateContent('description', e.target.value)}
                placeholder="A short product description..."
                rows={3}
                className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Product Image URL</label>
              <input
                type="url"
                value={(block.content.imageUrl as string) || ''}
                onChange={(e) => updateContent('imageUrl', e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
              <p className="text-xs text-muted-foreground mt-2">📷 Use a high-quality square or 4:3 ratio image</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Badge (Optional)</label>
              <input
                type="text"
                value={(block.content.badge as string) || ''}
                onChange={(e) => updateContent('badge', e.target.value)}
                placeholder="New, Sale, Limited..."
                className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">💰</span>
              <span className="font-semibold text-foreground">Pricing</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2">Price</label>
                <input
                  type="number"
                  value={(block.content.price as number) || 0}
                  onChange={(e) => updateContent('price', parseFloat(e.target.value) || 0)}
                  step="0.01"
                  min="0"
                  placeholder="29.99"
                  className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Original Price</label>
                <input
                  type="number"
                  value={(block.content.originalPrice as number) || ''}
                  onChange={(e) => updateContent('originalPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                  step="0.01"
                  min="0"
                  placeholder="49.99 (for sales)"
                  className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Currency</label>
              <select
                value={(block.content.currency as string) || 'USD'}
                onChange={(e) => updateContent('currency', e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer"
              >
                <option value="USD">💵 USD - US Dollar</option>
                <option value="EUR">💶 EUR - Euro</option>
                <option value="GBP">💷 GBP - British Pound</option>
                <option value="CAD">🍁 CAD - Canadian Dollar</option>
                <option value="AUD">🦘 AUD - Australian Dollar</option>
                <option value="INR">🇮🇳 INR - Indian Rupee</option>
              </select>
            </div>
          </div>

          {/* Buy Button */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">🛒</span>
              <span className="font-semibold text-foreground">Buy Button</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Button Text</label>
              <input
                type="text"
                value={(block.content.buttonText as string) || ''}
                onChange={(e) => updateContent('buttonText', e.target.value)}
                placeholder="Buy Now"
                className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(block.content.useStripeCheckout as boolean) || false}
                  onChange={(e) => updateContent('useStripeCheckout', e.target.checked)}
                  className="w-5 h-5 rounded border-border accent-primary"
                />
                <div>
                  <span className="text-sm font-medium">Use Stripe Checkout</span>
                  <p className="text-xs text-muted-foreground">Process payments directly with Stripe</p>
                </div>
              </label>
            </div>

            {!(block.content.useStripeCheckout as boolean) && (
              <div>
                <label className="block text-sm font-medium mb-2">External Product URL</label>
                <input
                  type="url"
                  value={(block.content.buttonUrl as string) || ''}
                  onChange={(e) => updateContent('buttonUrl', e.target.value)}
                  placeholder="https://your-store.com/product"
                  className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                />
                <p className="text-xs text-muted-foreground mt-2">Link to your external store page (Shopify, Gumroad, etc.)</p>
              </div>
            )}
          </div>

          {/* Rating & Reviews */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">⭐</span>
              <span className="font-semibold text-foreground">Rating (Optional)</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2">Star Rating</label>
                <select
                  value={(block.content.rating as number) || ''}
                  onChange={(e) => updateContent('rating', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer"
                >
                  <option value="">No rating</option>
                  <option value="5">⭐⭐⭐⭐⭐ 5 stars</option>
                  <option value="4.5">⭐⭐⭐⭐½ 4.5 stars</option>
                  <option value="4">⭐⭐⭐⭐ 4 stars</option>
                  <option value="3.5">⭐⭐⭐½ 3.5 stars</option>
                  <option value="3">⭐⭐⭐ 3 stars</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Review Count</label>
                <input
                  type="number"
                  value={(block.content.reviewCount as number) || ''}
                  onChange={(e) => updateContent('reviewCount', e.target.value ? parseInt(e.target.value) : undefined)}
                  min="0"
                  placeholder="42"
                  className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">📦</span>
              <span className="font-semibold text-foreground">Inventory</span>
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={((block.content.inventory as Record<string, unknown>)?.showQuantity as boolean) || false}
                  onChange={(e) => updateContent('inventory', { 
                    ...((block.content.inventory as Record<string, unknown>) || {}), 
                    showQuantity: e.target.checked 
                  })}
                  className="w-5 h-5 rounded border-border accent-primary"
                />
                <div>
                  <span className="text-sm font-medium">Show Stock Quantity</span>
                  <p className="text-xs text-muted-foreground">Display "X left in stock"</p>
                </div>
              </label>
            </div>

            {((block.content.inventory as Record<string, unknown>)?.showQuantity as boolean) && (
              <div className="pl-4 border-l-2 border-primary/30">
                <label className="block text-sm font-medium mb-2">Quantity Available</label>
                <input
                  type="number"
                  value={((block.content.inventory as Record<string, unknown>)?.quantity as number) || ''}
                  onChange={(e) => updateContent('inventory', { 
                    ...((block.content.inventory as Record<string, unknown>) || {}), 
                    quantity: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                  min="0"
                  placeholder="10"
                  className="w-full px-4 py-3 text-base border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================
          FOOTER BLOCK SETTINGS
          ============================================ */}
      {block.type === 'footer' && (
        <div className="space-y-6">
          {/* Footer Style */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">🎨</span>
              <span className="font-semibold text-foreground">Footer Style</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Layout Preset</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'simple', label: 'Simple', desc: 'Clean single row' },
                  { value: 'minimal', label: 'Minimal', desc: 'Basic info only' },
                  { value: 'centered', label: 'Centered', desc: 'Stacked center' },
                  { value: 'columns', label: 'Columns', desc: 'Multi-column' },
                  { value: 'mega', label: 'Mega', desc: 'Full featured' },
                  { value: 'branded', label: 'Branded', desc: 'Logo focus' },
                ].map((style) => (
                  <button
                    key={style.value}
                    onClick={() => updateContent('style', style.value)}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      (block.content.style || 'simple') === style.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="font-semibold text-sm">{style.label}</span>
                    <p className="text-xs text-muted-foreground">{style.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Background Style</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'default', label: 'Default' },
                  { value: 'dark', label: 'Dark' },
                  { value: 'gradient', label: 'Gradient' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateContent('backgroundStyle', opt.value)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                      (block.content.backgroundStyle || 'default') === opt.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">🏢</span>
              <span className="font-semibold text-foreground">Company Info</span>
            </div>

            <div className="group">
              <label className="block text-sm font-medium mb-2">Copyright Text</label>
              <input
                type="text"
                value={(block.content.text as string) || ''}
                onChange={(e) => updateContent('text', e.target.value)}
                placeholder="© 2025 Your Company. All rights reserved."
                className="w-full px-4 py-3 border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium mb-2">Tagline (optional)</label>
              <input
                type="text"
                value={(block.content.tagline as string) || ''}
                onChange={(e) => updateContent('tagline', e.target.value)}
                placeholder="Building the future, together"
                className="w-full px-4 py-3 border-2 border-border rounded-xl bg-background hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          {/* Footer Links */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔗</span>
                <span className="font-semibold text-foreground">Footer Links</span>
              </div>
              <button
                onClick={() => {
                  const currentLinks = (block.content.links as Array<{label: string; url: string}>) || [];
                  updateContent('links', [...currentLinks, { label: 'New Link', url: '#' }]);
                }}
                className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
              >
                + Add Link
              </button>
            </div>

            <div className="space-y-2">
              {((block.content.links as Array<{label: string; url: string}>) || []).map((link, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => {
                      const links = [...((block.content.links as Array<{label: string; url: string}>) || [])];
                      links[idx] = { ...links[idx], label: e.target.value };
                      updateContent('links', links);
                    }}
                    placeholder="Label"
                    className="flex-1 px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary transition-all"
                  />
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => {
                      const links = [...((block.content.links as Array<{label: string; url: string}>) || [])];
                      links[idx] = { ...links[idx], url: e.target.value };
                      updateContent('links', links);
                    }}
                    placeholder="URL"
                    className="flex-1 px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary transition-all"
                  />
                  <button
                    onClick={() => {
                      const links = ((block.content.links as Array<{label: string; url: string}>) || []).filter((_, i) => i !== idx);
                      updateContent('links', links);
                    }}
                    className="px-2 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {((block.content.links as Array<{label: string; url: string}>) || []).length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-2">No links yet. Add privacy, terms, etc.</p>
            )}
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="text-lg">📱</span>
                <span className="font-semibold text-foreground">Social Links</span>
              </div>
              <button
                onClick={() => {
                  const currentLinks = (block.content.socialLinks as Array<{platform: string; url: string}>) || [];
                  updateContent('socialLinks', [...currentLinks, { platform: 'twitter', url: '' }]);
                }}
                className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
              >
                + Add Social
              </button>
            </div>

            <div className="space-y-2">
              {((block.content.socialLinks as Array<{platform: string; url: string}>) || []).map((social, idx) => (
                <div key={idx} className="flex gap-2">
                  <select
                    value={social.platform}
                    onChange={(e) => {
                      const links = [...((block.content.socialLinks as Array<{platform: string; url: string}>) || [])];
                      links[idx] = { ...links[idx], platform: e.target.value };
                      updateContent('socialLinks', links);
                    }}
                    className="w-32 px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary transition-all"
                  >
                    <option value="twitter">𝕏 Twitter</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="youtube">YouTube</option>
                    <option value="tiktok">TikTok</option>
                    <option value="github">GitHub</option>
                    <option value="discord">Discord</option>
                    <option value="threads">Threads</option>
                    <option value="mastodon">Mastodon</option>
                  </select>
                  <input
                    type="text"
                    value={social.url}
                    onChange={(e) => {
                      const links = [...((block.content.socialLinks as Array<{platform: string; url: string}>) || [])];
                      links[idx] = { ...links[idx], url: e.target.value };
                      updateContent('socialLinks', links);
                    }}
                    placeholder="https://twitter.com/username"
                    className="flex-1 px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary transition-all"
                  />
                  <button
                    onClick={() => {
                      const links = ((block.content.socialLinks as Array<{platform: string; url: string}>) || []).filter((_, i) => i !== idx);
                      updateContent('socialLinks', links);
                    }}
                    className="px-2 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">📞</span>
              <span className="font-semibold text-foreground">Contact Information</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1 text-muted-foreground">📧 Email</label>
                <input
                  type="email"
                  value={(block.content.email as string) || ''}
                  onChange={(e) => updateContent('email', e.target.value)}
                  placeholder="hello@company.com"
                  className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-muted-foreground">📱 Phone</label>
                <input
                  type="tel"
                  value={(block.content.phone as string) || ''}
                  onChange={(e) => updateContent('phone', e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary transition-all"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium mb-1 text-muted-foreground">📍 Address</label>
              <input
                type="text"
                value={(block.content.address as string) || ''}
                onChange={(e) => updateContent('address', e.target.value)}
                placeholder="123 Main St, City, Country"
                className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">📬</span>
              <span className="font-semibold text-foreground">Newsletter</span>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={(block.content.showNewsletter as boolean) || false}
                onChange={(e) => updateContent('showNewsletter', e.target.checked)}
                className="w-5 h-5 rounded border-border accent-primary"
              />
              <div>
                <span className="text-sm font-medium">Show Newsletter Signup</span>
                <p className="text-xs text-muted-foreground">Collect email subscribers</p>
              </div>
            </label>
            
            {(block.content.showNewsletter as boolean) && (
              <div className="space-y-3 pl-4 border-l-2 border-primary/30">
                <input
                  type="text"
                  value={(block.content.newsletterTitle as string) || ''}
                  onChange={(e) => updateContent('newsletterTitle', e.target.value)}
                  placeholder="Subscribe to our newsletter"
                  className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary transition-all"
                />
                <input
                  type="text"
                  value={(block.content.newsletterSubtitle as string) || ''}
                  onChange={(e) => updateContent('newsletterSubtitle', e.target.value)}
                  placeholder="Get the latest updates"
                  className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary transition-all"
                />
                <div>
                  <label className="block text-xs font-medium mb-2">Button Text</label>
                  <input
                    type="text"
                    value={(block.content.newsletterButtonText as string) || ''}
                    onChange={(e) => updateContent('newsletterButtonText', e.target.value)}
                    placeholder="Subscribe"
                    className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary transition-all"
                  />
                </div>
              </div>
            )}
          </div>

          {/* App Badges */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">📲</span>
              <span className="font-semibold text-foreground">App Downloads</span>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={(block.content.showAppBadges as boolean) || false}
                onChange={(e) => updateContent('showAppBadges', e.target.checked)}
                className="w-5 h-5 rounded border-border accent-primary"
              />
              <div>
                <span className="text-sm font-medium">Show App Store Badges</span>
                <p className="text-xs text-muted-foreground">iOS & Android download links</p>
              </div>
            </label>
            
            {(block.content.showAppBadges as boolean) && (
              <div className="space-y-3 pl-4 border-l-2 border-primary/30">
                <div>
                  <label className="block text-xs font-medium mb-1">🍎 App Store URL</label>
                  <input
                    type="text"
                    value={(block.content.appStoreUrl as string) || ''}
                    onChange={(e) => updateContent('appStoreUrl', e.target.value)}
                    placeholder="https://apps.apple.com/..."
                    className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">🤖 Play Store URL</label>
                  <input
                    type="text"
                    value={(block.content.playStoreUrl as string) || ''}
                    onChange={(e) => updateContent('playStoreUrl', e.target.value)}
                    placeholder="https://play.google.com/..."
                    className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg bg-background focus:border-primary transition-all"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Display Options */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <span className="text-lg">⚙️</span>
              <span className="font-semibold text-foreground">Display Options</span>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(block.content.showBorder as boolean) ?? true}
                  onChange={(e) => updateContent('showBorder', e.target.checked)}
                  className="w-5 h-5 rounded border-border accent-primary"
                />
                <span className="text-sm font-medium">Show Top Border</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(block.content.showBranding as boolean) ?? true}
                  onChange={(e) => updateContent('showBranding', e.target.checked)}
                  className="w-5 h-5 rounded border-border accent-primary"
                />
                <span className="text-sm font-medium">Show "Powered by" Branding</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(block.content.showBackToTop as boolean) || false}
                  onChange={(e) => updateContent('showBackToTop', e.target.checked)}
                  className="w-5 h-5 rounded border-border accent-primary"
                />
                <span className="text-sm font-medium">Show "Back to Top" Button</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Text Alignment</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'left', label: '⬅️ Left' },
                  { value: 'center', label: '↔️ Center' },
                  { value: 'right', label: '➡️ Right' },
                ].map((align) => (
                  <button
                    key={align.value}
                    onClick={() => updateContent('alignment', align.value)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                      (block.content.alignment || 'center') === align.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {align.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Padding</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'compact', label: 'Compact' },
                  { value: 'default', label: 'Default' },
                  { value: 'spacious', label: 'Spacious' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateContent('padding', opt.value)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                      (block.content.padding || 'default') === opt.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Bottom spacer to ensure content isn't cut off */}
      <div className="h-12" />
    </div>
  );
}
