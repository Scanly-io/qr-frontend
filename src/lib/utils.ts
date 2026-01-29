import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Color utility functions for theme-aware block styling

/**
 * Convert hex color to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Convert RGB to HSL
 */
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Convert HSL to hex
 */
function hslToHex(h: number, s: number, l: number): string {
  h /= 360;
  s /= 100;
  l /= 100;
  
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Generate a contrasting color variant by shifting hue
 */
function shiftHue(baseColor: string, degrees: number): string {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return baseColor;
  
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.h = (hsl.h + degrees) % 360;
  
  return hslToHex(hsl.h, hsl.s, hsl.l);
}

/**
 * Adjust lightness of a color
 */
function adjustLightness(baseColor: string, amount: number): string {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return baseColor;
  
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.l = Math.max(0, Math.min(100, hsl.l + amount));
  
  return hslToHex(hsl.h, hsl.s, hsl.l);
}

/**
 * Generate theme-aware color palette for different blocks
 * Each block type gets a coordinated but distinct color
 */
export function getBlockColorPalette(primaryColor?: string) {
  const base = primaryColor || '#7c3aed'; // violet-600 default
  
  return {
    // Hero - Primary color with gradient
    hero: {
      primary: base,
      secondary: shiftHue(base, 15),
      background: adjustLightness(base, 45), // Very light tint
      text: base,
    },
    
    // Button - Primary color
    button: {
      fill: base,
      outline: base,
      soft: adjustLightness(base, 40),
    },
    
    // Features - Complementary color (opposite on color wheel)
    features: {
      accent: shiftHue(base, 180),
      background: adjustLightness(shiftHue(base, 180), 45),
    },
    
    // Pricing - Analogous color (adjacent on color wheel)
    pricing: {
      accent: shiftHue(base, 30),
      background: adjustLightness(shiftHue(base, 30), 45),
      highlight: base,
    },
    
    // Testimonial - Triadic color (120° on color wheel)
    testimonial: {
      accent: shiftHue(base, 120),
      background: adjustLightness(shiftHue(base, 120), 45),
    },
    
    // FAQ - Split complementary
    faq: {
      accent: shiftHue(base, 150),
      background: adjustLightness(shiftHue(base, 150), 45),
    },
    
    // Stats - Analogous opposite
    stats: {
      accent: shiftHue(base, -30),
      background: adjustLightness(shiftHue(base, -30), 45),
    },
    
    // Form - Primary with slight shift
    form: {
      accent: shiftHue(base, 10),
      background: adjustLightness(base, 47),
    },
    
    // CTA - High contrast
    cta: {
      accent: shiftHue(base, 45),
      background: adjustLightness(shiftHue(base, 45), 43),
    },
    
    // Gallery - Neutral shift
    gallery: {
      accent: shiftHue(base, -15),
      background: adjustLightness(shiftHue(base, -15), 45),
    },
  };
}

/**
 * Get light/pastel version for backgrounds
 */
export function getLightTint(color: string, opacity: number = 0.1): string {
  const rgb = hexToRgb(color);
  if (!rgb) return `rgba(124, 58, 237, ${opacity})`; // fallback
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

/**
 * Create gradient string from theme colors
 */
export function createGradient(color1: string, color2?: string, direction: string = 'to right'): string {
  const c2 = color2 || shiftHue(color1, 20);
  return `linear-gradient(${direction}, ${color1}, ${c2})`;
}
