# Theme Color System

## Overview
The QR Frontend now features an intelligent color system that automatically generates **coordinated but contrasting colors** for different blocks based on your theme's primary color.

## How It Works

### 1. Color Palette Generation
When you set a primary color in **Page Settings > Branding**, the system automatically generates a harmonious color palette using color theory:

```typescript
const colorPalette = getBlockColorPalette(theme.branding.primaryColor);
```

### 2. Block-Specific Colors
Each block type gets its own coordinated color using different color harmony rules:

| Block Type | Color Strategy | Hue Shift | Use Case |
|------------|---------------|-----------|----------|
| **Hero** | Primary | 0° | Main headline, primary CTA |
| **Button** | Primary | 0° | Interactive elements |
| **Features** | Complementary | 180° | Opposite color for contrast |
| **Pricing** | Analogous | 30° | Adjacent color for harmony |
| **Testimonial** | Triadic | 120° | Bold contrast |
| **FAQ** | Split Complementary | 150° | Balanced contrast |
| **Stats** | Analogous Opposite | -30° | Subtle variation |
| **Form** | Near Primary | 10° | Slightly shifted |
| **CTA** | High Contrast | 45° | Attention-grabbing |
| **Gallery** | Neutral Shift | -15° | Subtle differentiation |

### 3. Color Utility Functions

#### `getBlockColorPalette(primaryColor)`
Generates the complete color palette for all blocks.

```typescript
const palette = getBlockColorPalette('#7c3aed');
// Returns:
{
  hero: { primary, secondary, background, text },
  button: { fill, outline, soft },
  features: { accent, background },
  pricing: { accent, background, highlight },
  // ... etc
}
```

#### `getLightTint(color, opacity)`
Creates a light/pastel version for backgrounds.

```typescript
const lightBg = getLightTint('#7c3aed', 0.1);
// Returns: 'rgba(124, 58, 237, 0.1)'
```

#### `createGradient(color1, color2, direction)`
Creates gradient strings from theme colors.

```typescript
const gradient = createGradient('#7c3aed', '#9333ea', 'to right');
// Returns: 'linear-gradient(to right, #7c3aed, #9333ea)'
```

## Color Theory Applied

### Hue Shifting
The system uses the HSL color model to shift hues while maintaining saturation and lightness:
- **Analogous**: ±30° (harmonious, similar colors)
- **Complementary**: 180° (maximum contrast)
- **Triadic**: 120° (balanced, vibrant)
- **Split Complementary**: 150° (softer contrast)

### Lightness Adjustment
Backgrounds use +45% lightness to create subtle, non-overwhelming tints:
```typescript
adjustLightness(baseColor, 45) // Very light pastel
adjustLightness(baseColor, -20) // Darker shade
```

## Button Variants with Theme Colors

All button variants now use theme colors:

### Fill
```css
background: theme.button.backgroundColor
color: theme.button.textColor
```

### Outline
```css
background: transparent
color: theme.button.backgroundColor
border: theme.button.backgroundColor
```

### Soft
```css
background: rgba(theme-color, 0.15)
color: theme.button.backgroundColor
border: rgba(theme-color, 0.3)
```

### Gradient
```css
background: linear-gradient(primary, secondary)
color: white
```

## Hero Block Theme Integration

The Hero block now fully respects theme colors:

### Without Background Image/Video
- **Headline**: Gradient from primary to title color
- **Subheadline**: Body color from typography
- **Background**: Light tint of primary color
- **Button**: Theme button colors

### With Background Image/Video
- **Headline**: White with drop shadow
- **Subheadline**: White 90% opacity
- **Overlay**: Configurable opacity black gradient
- **Button**: Theme button colors

## Theme Hierarchy

Colors are applied in this priority order:

1. **Block-specific custom color** (if set in block settings)
2. **Theme button colors** (from Page Settings > Button)
3. **Generated palette color** (from color palette system)
4. **Default fallback** (violet-600 / #7c3aed)

## Example: Changing Primary Color

When you change the primary color from **Violet (#7c3aed)** to **Blue (#2563eb)**:

| Block | Old Color | New Color | Shift |
|-------|-----------|-----------|-------|
| Hero | #7c3aed (Violet) | #2563eb (Blue) | Same |
| Features | #eab308 (Yellow) | #dc2626 (Red) | 180° from new primary |
| Pricing | #a855f7 (Purple) | #7c3aed (Violet) | 30° from new primary |
| Testimonial | #10b981 (Green) | #ea580c (Orange) | 120° from new primary |

## Benefits

✅ **Automatic Coordination**: All blocks harmonize with your brand color  
✅ **Visual Hierarchy**: Different blocks use contrasting colors for clarity  
✅ **Professional Design**: Based on color theory principles  
✅ **Accessibility**: Maintains contrast ratios for readability  
✅ **Customizable**: Can override with block-specific colors  
✅ **Consistent Branding**: Single source of truth (primary color)  

## Testing the System

1. Go to **Page Settings > Branding**
2. Change the **Primary Color** (try: violet, blue, green, red, orange)
3. Observe how all blocks automatically update with coordinated colors
4. Each block will have a different but harmonious accent color

## Technical Implementation

### Files Modified
- `/src/lib/utils.ts` - Color utility functions
- `/src/components/editor/Canvas.tsx` - Block rendering with theme colors

### Dependencies
- HSL color model for hue shifting
- RGB/Hex conversion for CSS compatibility
- React inline styles for dynamic colors
