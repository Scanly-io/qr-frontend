/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { PageTheme } from '@/types/theme';
import { PRESET_THEMES } from '@/types/theme';

export interface ThemeContextType {
  pageTheme: PageTheme;
  setPageTheme: (theme: PageTheme | ((prev: PageTheme) => PageTheme)) => void;
  updateTheme: (updates: Partial<PageTheme>) => void;
  resetTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: PageTheme;
}

export function ThemeProvider({ children, initialTheme }: ThemeProviderProps) {
  const [pageTheme, setPageTheme] = useState<PageTheme>(
    initialTheme || PRESET_THEMES[1] // Default to ocean-gradient
  );

  const updateTheme = (updates: Partial<PageTheme>) => {
    setPageTheme((prev) => ({
      ...prev,
      ...updates,
      // Mark as custom when user makes changes
      id: updates.id || prev.id,
      name: updates.name || prev.name,
      category: updates.category || 'custom',
    }));
  };

  const resetTheme = () => {
    setPageTheme(PRESET_THEMES[1]);
  };

  return (
    <ThemeContext.Provider value={{ pageTheme, setPageTheme, updateTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

