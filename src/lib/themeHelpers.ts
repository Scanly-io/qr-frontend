/**
 * Theme Helper Utilities
 * 
 * Centralized functions for applying theme settings consistently across all blocks
 */

import { FONT_FAMILY_MAP } from './fonts';
import type { PageTheme } from '@/types/theme';

/**
 * Convert font ID to CSS font-family string
 * Handles both new font IDs (e.g., 'playfair') and legacy CSS strings
 */
export function getFontFamily(fontId: string | undefined, fallback: string = 'inter'): string {
  if (!fontId) {
    return FONT_FAMILY_MAP[fallback] || "'Inter', sans-serif";
  }
  
  // If it's a font ID (exists in map), convert it
  if (FONT_FAMILY_MAP[fontId]) {
    return FONT_FAMILY_MAP[fontId];
  }
  
  // It's already a CSS font-family string, use it as-is
  return fontId;
}

/**
 * Get title font from theme
 */
export function getTitleFont(theme?: PageTheme): string {
  const fontId = theme?.typography?.titleFont || 'inter';
  return getFontFamily(fontId);
}

/**
 * Get body font from theme
 */
export function getBodyFont(theme?: PageTheme): string {
  const fontId = theme?.typography?.bodyFont || 'inter';
  return getFontFamily(fontId);
}

/**
 * Convert border radius preset to pixel value
 */
export function getBorderRadius(radius: string | number | undefined, fallback: number = 8): number {
  if (typeof radius === 'number') {
    return radius;
  }
  
  const radiusMap: Record<string, number> = {
    'none': 0,
    'sm': 4,
    'md': 8,
    'lg': 12,
    'xl': 16,
    'full': 9999,
  };
  
  if (radius && radiusMap[radius] !== undefined) {
    return radiusMap[radius];
  }
  
  return fallback;
}

/**
 * Get button background color from theme or custom
 */
export function getButtonBackground(
  useThemeColors: boolean,
  customColor: string | undefined,
  theme?: PageTheme,
  fallback: string = '#8b5cf6'
): string {
  if (!useThemeColors && customColor) {
    return customColor;
  }
  return theme?.button?.backgroundColor || fallback;
}

/**
 * Get button text color from theme or custom
 */
export function getButtonTextColor(
  useThemeColors: boolean,
  customColor: string | undefined,
  theme?: PageTheme,
  fallback: string = '#ffffff'
): string {
  if (!useThemeColors && customColor) {
    return customColor;
  }
  return theme?.button?.textColor || fallback;
}

/**
 * Get button border radius from theme
 */
export function getButtonBorderRadius(theme?: PageTheme): number {
  const radius = theme?.button?.borderRadius;
  return getBorderRadius(radius, 8);
}

/**
 * Get button variant from theme
 */
export function getButtonVariant(theme?: PageTheme): string {
  return theme?.button?.style || theme?.button?.variant || 'fill';
}

/**
 * Apply theme typography to element styles
 */
export function getTypographyStyles(
  type: 'title' | 'body',
  theme?: PageTheme,
  customColor?: string
): React.CSSProperties {
  const isTitle = type === 'title';
  const fontFamily = isTitle ? getTitleFont(theme) : getBodyFont(theme);
  const color = customColor || (isTitle ? theme?.typography?.titleColor : theme?.typography?.bodyColor);
  
  return {
    fontFamily,
    color,
  };
}
