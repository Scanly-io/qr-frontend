/* eslint-disable react-refresh/only-export-components */
import { Check } from 'lucide-react';

export interface Theme {
  id: string;
  name: string;
  preview: {
    background: string;
    buttonColor: string;
    textColor: string;
  };
  styles: {
    backgroundColor: string;
    backgroundImage?: string;
    textColor: string;
    buttonStyle: {
      backgroundColor: string;
      textColor: string;
      borderRadius: string;
      variant: 'fill' | 'outline' | 'soft' | 'shadow';
    };
    fontFamily: string;
  };
}

export const THEME_PRESETS: Theme[] = [
  {
    id: 'classic',
    name: 'Classic',
    preview: {
      background: '#ffffff',
      buttonColor: '#3b82f6',
      textColor: '#1f2937',
    },
    styles: {
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      buttonStyle: {
        backgroundColor: '#3b82f6',
        textColor: '#ffffff',
        borderRadius: 'rounded-xl',
        variant: 'fill',
      },
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    preview: {
      background: '#0f172a',
      buttonColor: '#8b5cf6',
      textColor: '#f8fafc',
    },
    styles: {
      backgroundColor: '#0f172a',
      textColor: '#f8fafc',
      buttonStyle: {
        backgroundColor: '#8b5cf6',
        textColor: '#ffffff',
        borderRadius: 'rounded-xl',
        variant: 'fill',
      },
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
  },
  {
    id: 'gradient',
    name: 'Gradient Dream',
    preview: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      buttonColor: '#ffffff',
      textColor: '#ffffff',
    },
    styles: {
      backgroundColor: '#667eea',
      backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      textColor: '#ffffff',
      buttonStyle: {
        backgroundColor: '#ffffff',
        textColor: '#667eea',
        borderRadius: 'rounded-full',
        variant: 'fill',
      },
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    preview: {
      background: '#fafafa',
      buttonColor: '#000000',
      textColor: '#000000',
    },
    styles: {
      backgroundColor: '#fafafa',
      textColor: '#000000',
      buttonStyle: {
        backgroundColor: '#000000',
        textColor: '#ffffff',
        borderRadius: 'rounded-lg',
        variant: 'fill',
      },
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    preview: {
      background: 'linear-gradient(180deg, #0ea5e9 0%, #06b6d4 100%)',
      buttonColor: '#ffffff',
      textColor: '#ffffff',
    },
    styles: {
      backgroundColor: '#0ea5e9',
      backgroundImage: 'linear-gradient(180deg, #0ea5e9 0%, #06b6d4 100%)',
      textColor: '#ffffff',
      buttonStyle: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        textColor: '#ffffff',
        borderRadius: 'rounded-2xl',
        variant: 'soft',
      },
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    preview: {
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      buttonColor: '#ffffff',
      textColor: '#ffffff',
    },
    styles: {
      backgroundColor: '#f093fb',
      backgroundImage: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      textColor: '#ffffff',
      buttonStyle: {
        backgroundColor: '#ffffff',
        textColor: '#f5576c',
        borderRadius: 'rounded-full',
        variant: 'shadow',
      },
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
  },
  {
    id: 'neon',
    name: 'Neon',
    preview: {
      background: '#000000',
      buttonColor: '#00ff88',
      textColor: '#00ff88',
    },
    styles: {
      backgroundColor: '#000000',
      textColor: '#00ff88',
      buttonStyle: {
        backgroundColor: '#00ff88',
        textColor: '#000000',
        borderRadius: 'rounded-lg',
        variant: 'shadow',
      },
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
  },
  {
    id: 'earth',
    name: 'Earth',
    preview: {
      background: '#f5f5dc',
      buttonColor: '#8b7355',
      textColor: '#3e2723',
    },
    styles: {
      backgroundColor: '#f5f5dc',
      textColor: '#3e2723',
      buttonStyle: {
        backgroundColor: '#8b7355',
        textColor: '#ffffff',
        borderRadius: 'rounded-xl',
        variant: 'fill',
      },
      fontFamily: '"Georgia", serif',
    },
  },
];

interface ThemePresetsProps {
  selectedThemeId: string;
  onSelectTheme: (theme: Theme) => void;
}

export default function ThemePresets({ selectedThemeId, onSelectTheme }: ThemePresetsProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">Theme Presets</h3>
      <div className="grid grid-cols-2 gap-3">
        {THEME_PRESETS.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onSelectTheme(theme)}
            className={`relative group rounded-xl overflow-hidden transition-all duration-200 ${
              selectedThemeId === theme.id
                ? 'ring-2 ring-blue-500 ring-offset-2'
                : 'hover:scale-105'
            }`}
          >
            {/* Theme Preview */}
            <div
              className="aspect-[3/4] p-3 flex flex-col items-center justify-center gap-2"
              style={{
                background: theme.preview.background,
                color: theme.preview.textColor,
              }}
            >
              {/* Mini profile */}
              <div
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: theme.preview.textColor, opacity: 0.3 }}
              />
              
              {/* Mini buttons */}
              <div className="w-full space-y-1.5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-4 rounded-md"
                    style={{
                      backgroundColor: theme.preview.buttonColor,
                      opacity: 0.9,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Theme Name */}
            <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm px-2 py-1.5 text-xs font-medium text-gray-800 text-center">
              {theme.name}
            </div>

            {/* Selected Indicator */}
            {selectedThemeId === theme.id && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
