import { useState } from 'react';
import { Check } from 'lucide-react';
import { PRESET_THEMES, type PageTheme } from '../../types/theme';
import { getBackgroundStyle } from '../../utils/patterns';

interface ThemeGalleryProps {
  currentTheme: PageTheme;
  onSelectTheme: (theme: PageTheme) => void;
  selectedFilter?: string; // Filter from parent (EditorLayout)
}

// Map EditorLayout filters to theme selection logic
const FILTER_CATEGORY_MAP: Record<string, string[]> = {
  'All': ['minimal', 'vibrant', 'professional', 'creative', 'business', 'events', 'ecommerce', 'custom'],
  'Popular': ['minimal', 'vibrant', 'professional'], // Most popular categories
  'Minimal': ['minimal'],
  'Bold': ['vibrant'],
  'Gradient': ['vibrant', 'creative'],
  'Dark': [], // Will be handled separately by theme ID
  'Light': ['minimal'],
  'Colorful': ['creative', 'vibrant'],
};

// Dark theme IDs (themes with dark backgrounds)
const DARK_THEME_IDS = [
  'midnight-slate',
  'carbon-fiber', 
  'deep-ocean',
  'neon-cyberpunk',
  'music-artist',
];

export function ThemeGallery({ currentTheme, onSelectTheme, selectedFilter = 'All' }: ThemeGalleryProps) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const handleSelectTheme = (theme: PageTheme) => {
    setSelectedPreset(theme.name);
    onSelectTheme(theme);
  };

  // Filter themes by selected filter from parent
  const filteredThemes = PRESET_THEMES.filter(theme => {
    // Special handling for Dark filter
    if (selectedFilter === 'Dark') {
      return DARK_THEME_IDS.includes(theme.id);
    }
    
    // For other filters, use category mapping
    const allowedCategories = FILTER_CATEGORY_MAP[selectedFilter] || FILTER_CATEGORY_MAP['All'];
    return !theme.category || allowedCategories.includes(theme.category);
  });

  return (
    <div className="space-y-3">
      {/* Live region for filter announcements */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {selectedFilter === 'All' 
          ? `Showing all ${filteredThemes.length} themes` 
          : `Filtered to ${filteredThemes.length} ${selectedFilter.toLowerCase()} ${filteredThemes.length === 1 ? 'theme' : 'themes'}`}
      </div>

      {/* Theme Grid - No redundant header or filters */}
      <div 
        id="theme-list"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
        role="region"
        aria-label="Available themes"
      >
        {filteredThemes.map((theme) => {
          const isSelected = selectedPreset === theme.name || 
                           (currentTheme.name === theme.name && !selectedPreset);
          const backgroundStyle = getBackgroundStyle(theme.background);

          return (
            <button
              key={theme.name}
              onClick={() => handleSelectTheme(theme)}
              aria-label={`Select ${theme.name.replace(/-/g, ' ')} theme`}
              aria-pressed={isSelected}
              aria-current={isSelected ? "true" : undefined}
              tabIndex={0}
              className={`relative group overflow-hidden rounded-lg border-2 transition-all bg-background
                focus:outline-none focus:ring-2 focus:ring-primary/30
                ${
                isSelected
                  ? 'border-primary ring-2 ring-primary/20 shadow-lg'
                  : 'border-border hover:border-primary/50 hover:shadow-md'
              }`}
            >
              {/* Theme Preview - More Compact */}
              <div className="aspect-[9/14] relative overflow-hidden">
                {/* Background Preview */}
                <div
                  className="absolute inset-0"
                  style={backgroundStyle}
                />

                {/* Content Preview - Simplified */}
                <div className="absolute inset-0 p-2 flex flex-col items-center">
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 bg-white/30 ${
                      theme.header.avatarShape === 'square' ? 'rounded-sm' : 
                      theme.header.avatarShape === 'rounded' ? 'rounded-lg' : 'rounded-full'
                    }`}
                  />
                  
                  {/* Buttons Preview */}
                  <div className="w-full space-y-1.5 mt-3">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-full h-6"
                        style={{
                          backgroundColor: theme.button.backgroundColor,
                          borderRadius: theme.button.borderRadius === 'full' ? '9999px' : '6px',
                          opacity: 0.8,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-md">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
              </div>

              {/* Theme Name - Very Compact */}
              <div className="p-2 bg-background border-t border-border">
                <p className="text-xs font-semibold text-center truncate">
                  {theme.name.replace(/-/g, ' ')}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* No results message */}
      {filteredThemes.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">No themes found in this category</p>
        </div>
      )}
    </div>
  );
}
