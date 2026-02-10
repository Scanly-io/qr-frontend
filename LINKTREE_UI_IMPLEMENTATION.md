# Linktree-Inspired UI Implementation

## 🎯 Overview

This project implements a **Linktree-inspired** UI for the QR code microsite builder. The design philosophy centers on:

- **Mobile-first**: Optimized for QR code scans on mobile devices
- **Simplicity**: Clean, uncluttered interface focused on content
- **Visual hierarchy**: Clear profile section with stacked action buttons
- **Easy customization**: Simple theming and styling controls
- **Preview-first**: WYSIWYG editor with real-time updates

## 📐 Architecture

### Core Components

```
src/components/
├── blocks/
│   ├── ProfileBlock.tsx        # Linktree-style profile header
│   ├── LinkButtonBlock.tsx     # Action button with customizable styles
│   └── SocialLinksBlock.tsx    # Social media icon grid
├── themes/
│   └── ThemePresets.tsx        # Pre-built theme templates
└── editor/
    ├── EditorLayout.tsx        # Main editor layout
    ├── BlockPalette.tsx        # Drag-and-drop block library
    └── Canvas.tsx              # Live preview canvas
```

### Data Structure

```
src/data/
└── linktree-templates.ts      # Pre-built Linktree templates
```

## 🎨 Components

### 1. ProfileBlock

**Purpose**: Linktree-style header with avatar, name, and bio

**Props**:
- `block`: Block data object
- `isEditing`: Whether in edit mode
- `onUpdate`: Callback for content updates

**Content Schema**:
```typescript
{
  avatarUrl?: string;
  displayName: string;
  bio?: string;
  location?: string;
  website?: string;
}
```

**Style Options**:
```typescript
{
  avatarSize: number;           // Avatar diameter (px)
  textAlign: 'left' | 'center' | 'right';
  nameSize: string;             // Tailwind text size class
  bioSize: string;              // Tailwind text size class
  showLocation: boolean;
  showWebsite: boolean;
}
```

**Usage**:
```tsx
<ProfileBlock
  block={profileBlock}
  isEditing={true}
  onUpdate={(updates) => handleBlockUpdate(updates)}
/>
```

### 2. LinkButtonBlock

**Purpose**: Customizable action button (Linktree's core element)

**Props**:
- `block`: Block data object
- `isEditing`: Whether in edit mode
- `onUpdate`: Callback for content updates

**Content Schema**:
```typescript
{
  label: string;                // Button text
  url: string;                  // Destination URL
  description?: string;         // Optional subtitle
  icon?: 'arrow' | 'chevron' | 'external';
  thumbnail?: string;           // Optional left image
}
```

**Style Options**:
```typescript
{
  variant: 'fill' | 'outline' | 'soft' | 'shadow';
  backgroundColor: string;      // Hex color
  textColor: string;            // Hex color
  borderRadius: string;         // Tailwind class (rounded-xl, etc.)
  size: 'small' | 'medium' | 'large';
  showIcon: boolean;
  iconPosition: 'left' | 'right';
  animation: 'none' | 'scale' | 'slide' | 'bounce';
}
```

**Variants**:
- **fill**: Solid background color
- **outline**: Transparent with colored border
- **soft**: Semi-transparent background (10% opacity)
- **shadow**: Solid with prominent shadow

**Usage**:
```tsx
<LinkButtonBlock
  block={linkBlock}
  isEditing={false}
  onUpdate={(updates) => handleBlockUpdate(updates)}
/>
```

### 3. SocialLinksBlock

**Purpose**: Grid of social media icons

**Props**:
- `block`: Block data object
- `isEditing`: Whether in edit mode
- `onUpdate`: Callback for content updates

**Content Schema**:
```typescript
{
  links: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    youtube?: string;
    github?: string;
    tiktok?: string;
    whatsapp?: string;
    email?: string;
    website?: string;
  }
}
```

**Style Options**:
```typescript
{
  iconSize: number;             // Icon diameter (px)
  spacing: 'tight' | 'normal' | 'loose';
  style: 'filled' | 'outline' | 'minimal';
  layout: 'grid' | 'row' | 'list';
  showLabels: boolean;
}
```

**Supported Platforms**:
- Instagram, Twitter/X, Facebook, LinkedIn
- YouTube, GitHub, TikTok, WhatsApp
- Email, Custom Website

**Usage**:
```tsx
<SocialLinksBlock
  block={socialBlock}
  isEditing={true}
  onUpdate={(updates) => handleBlockUpdate(updates)}
/>
```

### 4. ThemePresets

**Purpose**: Pre-configured visual themes

**Themes Available**:

1. **Classic** - White background, blue buttons
2. **Dark Mode** - Black background, purple accents
3. **Gradient Dream** - Purple gradient background
4. **Minimal** - Off-white, black buttons
5. **Ocean** - Blue gradient, glass-morphism buttons
6. **Sunset** - Pink/red gradient
7. **Neon** - Black background, neon green
8. **Earth** - Beige/brown, natural tones

**Theme Schema**:
```typescript
{
  id: string;
  name: string;
  preview: {
    background: string;
    buttonColor: string;
    textColor: string;
  };
  styles: {
    backgroundColor: string;
    backgroundImage?: string;    // CSS gradient
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
```

**Usage**:
```tsx
<ThemePresets
  selectedThemeId="classic"
  onSelectTheme={(theme) => applyTheme(theme)}
/>
```

## 🚀 Templates

### Pre-built Templates

**1. Classic Linktree**
- Simple profile + 3 link buttons + social icons
- White background, blue buttons
- Use case: General purpose, personal links

**2. Influencer Profile**
- Bold design with larger avatar
- Multiple button styles (shadow, fill, outline)
- Use case: Content creators, social media personalities

**3. Business Professional**
- Clean corporate design
- Call-to-action focused (book consultation)
- Use case: Consultants, service providers

**4. Minimalist**
- Monochrome black/white design
- Smaller avatar, minimal text
- Use case: Designers, developers, portfolios

### Using Templates

```typescript
import { LINKTREE_TEMPLATES } from '@/data/linktree-templates';

// Load a template
const template = LINKTREE_TEMPLATES.find(t => t.id === 'linktree-classic');
setBlocks(template.blocks);

// Apply theme
if (template.theme) {
  applyTheme(template.theme);
}
```

## 🎨 Theming System

### Global Theme Application

```typescript
// Apply theme to entire microsite
const applyTheme = (theme: Theme) => {
  // Set background
  document.body.style.backgroundColor = theme.styles.backgroundColor;
  if (theme.styles.backgroundImage) {
    document.body.style.backgroundImage = theme.styles.backgroundImage;
  }
  
  // Set text color
  document.body.style.color = theme.styles.textColor;
  
  // Update all link buttons
  blocks.forEach(block => {
    if (block.type === 'linkButton') {
      updateBlock(block.id, {
        style: {
          ...block.style,
          backgroundColor: theme.styles.buttonStyle.backgroundColor,
          textColor: theme.styles.buttonStyle.textColor,
          borderRadius: theme.styles.buttonStyle.borderRadius,
          variant: theme.styles.buttonStyle.variant,
        }
      });
    }
  });
};
```

### Custom Colors

Users can override theme colors:
- Background color picker
- Button color picker
- Text color picker
- Individual button customization

## 📱 Responsive Design

### Mobile (< 640px)
- Full-width buttons
- Touch-friendly spacing (min 44px tap targets)
- Stacked vertical layout

### Tablet (640-1024px)
- Constrained width (600px max)
- Centered layout
- Same vertical stacking

### Desktop (> 1024px)
- Constrained width (600px max)
- Centered with decorative background
- Maintains mobile-first layout

## 🔧 Editor Integration

### Block Palette

The Linktree blocks are featured at the top of the palette:

```typescript
const blockTypes = [
  // === LINKTREE BLOCKS (Featured) ===
  { 
    type: 'profile', 
    label: 'Profile', 
    description: 'Avatar + name + bio section',
    category: 'Linktree',
    featured: true 
  },
  { 
    type: 'linkButton', 
    label: 'Link Button',
    description: 'Linktree-style action button',
    category: 'Linktree',
    featured: true 
  },
  // ... other blocks
];
```

### Drag & Drop

Users can:
1. Drag blocks from palette to canvas
2. Reorder blocks by dragging
3. Click to select and edit
4. Delete with keyboard (Delete/Backspace)

### Live Preview

Changes update in real-time:
- Text edits
- Color changes
- Style updates
- Block reordering

## 📊 Analytics Integration

Link buttons track clicks via the analytics service:

```typescript
// When a link button is clicked
const handleClick = async (buttonId: string, url: string) => {
  // Track click event
  await analyticsApi.track({
    type: 'button.clicked',
    qrId: micrositeId,
    buttonId,
    url,
    timestamp: new Date().toISOString(),
  });
  
  // Redirect user
  window.open(url, '_blank');
};
```

## 🎯 Best Practices

### Content Guidelines

1. **Profile Section**
   - Use high-quality avatar (square, min 400x400px)
   - Keep display name short (1-25 characters)
   - Bio should be 1-2 sentences max

2. **Link Buttons**
   - Button labels: 3-5 words max
   - Descriptions: 5-10 words (optional)
   - Order by priority (most important at top)
   - Limit to 5-7 buttons for clarity

3. **Social Links**
   - Only add platforms you're active on
   - Use consistent usernames across platforms

### Design Guidelines

1. **Color Contrast**
   - Ensure WCAG AA compliance (4.5:1 ratio)
   - Test button text visibility on backgrounds

2. **Button Hierarchy**
   - Primary action: 'fill' variant, bold color
   - Secondary actions: 'outline' or 'soft' variants
   - Tertiary: 'minimal' social links

3. **Spacing**
   - Maintain consistent gaps between buttons
   - Add spacer blocks for visual breathing room

## 🐛 Troubleshooting

### Common Issues

**1. Avatar not displaying**
- Ensure image URL is publicly accessible
- Use HTTPS URLs only
- Recommended format: JPG or PNG
- Max file size: 2MB

**2. Button colors not applying**
- Check hex color format (#RRGGBB)
- Ensure variant is compatible with color scheme
- Try clearing browser cache

**3. Social icons missing**
- Verify username/URL format
- Some platforms require full URL, others just username
- Check that links object has correct platform IDs

**4. Theme not applying**
- Refresh preview after theme change
- Check for conflicting custom styles
- Ensure theme ID is valid

## 🚀 Future Enhancements

### Planned Features

1. **Advanced Button Styles**
   - Gradient backgrounds
   - Custom icons/emojis
   - Animated backgrounds
   - Border patterns

2. **Profile Enhancements**
   - Video avatar (animated GIF)
   - Multiple bio sections
   - Badges/verification marks
   - Custom fonts

3. **Layout Options**
   - Two-column button layout (desktop)
   - Card-style buttons with images
   - Sticky profile header

4. **Analytics Dashboard**
   - Click-through rates per button
   - Top-performing links
   - Geographic data
   - Time-based analytics

5. **A/B Testing**
   - Test different button labels
   - Compare color schemes
   - Optimize conversion rates

## 📚 References

- [Linktree Official](https://linktr.ee)
- [Tailwind CSS](https://tailwindcss.com)
- [React DnD Kit](https://dndkit.com)
- [Lucide Icons](https://lucide.dev)

---

**Last Updated**: December 2025
**Version**: 1.0.0
