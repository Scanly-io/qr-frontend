# Linktree Visual Design Reference

## 📱 Mobile Layout (Primary View)

```
┌─────────────────────────┐
│                         │
│     ┌─────────────┐     │  ← Profile Section
│     │   Avatar    │     │    • Circular image (96px)
│     │   Image     │     │    • Centered
│     └─────────────┘     │
│                         │
│    Your Display Name    │    • Large, bold text (text-2xl)
│                         │    • Centered
│   Bio text goes here    │    • Gray text (text-base)
│   Content creator & ...  │    • 1-2 lines max
│                         │
│   📍 San Francisco, CA  │    • Location (optional)
│   🔗 yourwebsite.com    │    • Website link (optional)
│                         │
├─────────────────────────┤
│                         │
│  ┌──────────────────┐  │  ← Link Button 1
│  │  Visit Website  →│  │    • Full width
│  └──────────────────┘  │    • Rounded corners
│                         │    • Color customizable
│  ┌──────────────────┐  │  ← Link Button 2
│  │   Latest Video  →│  │    • Stacked vertically
│  └──────────────────┘  │    • Touch-friendly spacing
│                         │
│  ┌──────────────────┐  │  ← Link Button 3
│  │   Shop Merch    →│  │    • Icon on right
│  └──────────────────┘  │    • Hover animations
│                         │
├─────────────────────────┤
│                         │
│    ⓘ  ⓣ  ⓨ  ⓣⓘ       │  ← Social Icons
│                         │    • Grid layout
│                         │    • Circular icons
│                         │    • 4-5 per row
│                         │
└─────────────────────────┘
  iPhone 12/13/14 (390px)
```

## 🎨 Button Style Variants

### 1. Fill (Default)
```
┌─────────────────────────────┐
│   Visit My Website      →   │  Background: Solid color
└─────────────────────────────┘  Text: White/contrasting
```

### 2. Outline
```
┌─────────────────────────────┐
│   Visit My Website      →   │  Background: Transparent
└─────────────────────────────┘  Border: 2px colored
                                 Text: Same as border
```

### 3. Soft (Glass-morphism)
```
┌─────────────────────────────┐
│   Visit My Website      →   │  Background: 10% opacity
└─────────────────────────────┘  Border: 1px colored
                                 Text: Same as border
```

### 4. Shadow
```
┌─────────────────────────────┐
│   Visit My Website      →   │  Background: Solid color
└─────────────────────────────┘  Shadow: Large, prominent
    ▼ ▼ ▼ (shadow)              Lifts on hover
```

## 🎨 Color Schemes

### Classic (Default)
```
Background:  #ffffff (white)
Text:        #1f2937 (dark gray)
Button BG:   #3b82f6 (blue)
Button Text: #ffffff (white)
```

### Dark Mode
```
Background:  #0f172a (dark navy)
Text:        #f8fafc (light gray)
Button BG:   #8b5cf6 (purple)
Button Text: #ffffff (white)
```

### Gradient Dream
```
Background:  linear-gradient(135deg, #667eea, #764ba2)
Text:        #ffffff (white)
Button BG:   #ffffff (white)
Button Text: #667eea (purple)
```

### Minimal
```
Background:  #fafafa (off-white)
Text:        #000000 (black)
Button BG:   #000000 (black)
Button Text: #ffffff (white)
```

## 📐 Spacing & Sizing

### Profile Section
```
Avatar Size:    96px (diameter)
Name Size:      text-2xl (24px)
Bio Size:       text-base (16px)
Vertical Gap:   16px between elements
```

### Link Buttons
```
Height (Small):   40px (py-2.5)
Height (Medium):  48px (py-3.5)
Height (Large):   56px (py-4)

Width:           Full width - 32px (px-4 padding)
Gap Between:     12px (space-y-3)

Border Radius:
  - rounded-lg:   8px
  - rounded-xl:   12px
  - rounded-2xl:  16px
  - rounded-full: 9999px (pill shape)
```

### Social Icons
```
Icon Size (Small):   36px
Icon Size (Medium):  44px
Icon Size (Large):   52px

Gap (Tight):    8px
Gap (Normal):   12px
Gap (Loose):    16px

Layout Grid:    4-5 icons per row
```

## 🎯 Typography

### Font Families
```css
Default:  system-ui, -apple-system, sans-serif
Inter:    'Inter', system-ui, sans-serif
Georgia:  'Georgia', serif
```

### Text Hierarchy
```
Profile Name:    text-2xl font-bold (24px)
Button Label:    text-base font-semibold (16px)
Button Desc:     text-xs opacity-70 (12px)
Bio Text:        text-base text-gray-600 (16px)
Location:        text-sm text-gray-500 (14px)
```

## 🎨 Icon Reference

### Social Platform Icons

```
Instagram:  ⓘ  #E4405F (pink)
Twitter:    ⓣ  #1DA1F2 (blue)
Facebook:   ⓕ  #1877F2 (blue)
LinkedIn:   ⓛ  #0A66C2 (blue)
YouTube:    ⓨ  #FF0000 (red)
GitHub:     ⓖ  #333333 (dark gray)
TikTok:     ⓣⓣ #000000 (black)
WhatsApp:   ⓦ  #25D366 (green)
Email:      ⓔ  #EA4335 (red)
Website:    ⓦ  #6366F1 (indigo)
```

### Button Action Icons
```
Arrow Right:    →  (default)
Chevron Right:  ›  (minimal)
External Link:  ↗  (opens new tab)
```

## 🎨 Animation Examples

### Scale (Default)
```
Hover:   scale(1.02)
Active:  scale(0.98)
```

### Slide
```
Hover:   translateX(4px)
```

### Bounce
```
Hover:   animate-bounce
```

## 📱 Device Previews

### iPhone SE (375px)
```
┌───────────┐
│  Avatar   │
│   Name    │
│   Bio     │
│ [Button]  │
│ [Button]  │
│ [Button]  │
│  Icons    │
└───────────┘
Narrow, constrained
```

### iPhone 14 Pro Max (430px)
```
┌─────────────┐
│   Avatar    │
│    Name     │
│    Bio      │
│  [Button]   │
│  [Button]   │
│  [Button]   │
│   Icons     │
└─────────────┘
Slightly wider
```

### iPad Mini (768px)
```
┌───────────────────┐
│      Avatar       │
│       Name        │
│       Bio         │
│    [Button]       │
│    [Button]       │
│    [Button]       │
│      Icons        │
└───────────────────┘
Centered, max-width 600px
```

## 🎨 Theme Preview Grid

```
┌─────────┬─────────┬─────────┐
│ Classic │  Dark   │Gradient │
│         │         │         │
│  [○]    │  [○]    │  [○]    │
│  ───    │  ───    │  ───    │
│  ───    │  ───    │  ───    │
│  ───    │  ───    │  ───    │
│         │         │         │
├─────────┼─────────┼─────────┤
│ Minimal │  Ocean  │ Sunset  │
│         │         │         │
│  [○]    │  [○]    │  [○]    │
│  ───    │  ───    │  ───    │
│  ───    │  ───    │  ───    │
│  ───    │  ───    │  ───    │
│         │         │         │
└─────────┴─────────┴─────────┘
2x3 grid, click to apply
```

## 🎯 Editor Interface Layout

```
┌─────────────────────────────────────────────────────────┐
│  QR Microsite Editor                    [Save] [Publish] │
├────────┬──────────────────────────┬─────────────────────┤
│        │                          │                     │
│ Blocks │    Live Preview          │   Inspector         │
│        │                          │                     │
│ [+]    │  ┌──────────────────┐    │  Selected:          │
│ Profile│  │    [Avatar]      │    │  Link Button        │
│        │  │     Name         │    │                     │
│ [+]    │  │     Bio          │    │  Label:             │
│ Link   │  │                  │    │  [___________]      │
│ Button │  │  [Button 1]   →  │◄───┼──URL:               │
│        │  │  [Button 2]   →  │    │  [___________]      │
│ [+]    │  │  [Button 3]   →  │    │                     │
│ Social │  │                  │    │  Style:             │
│ Links  │  │  ⓘ ⓣ ⓨ ⓣⓣ       │    │  ○ Fill             │
│        │  │                  │    │  ○ Outline          │
│ More   │  └──────────────────┘    │  ○ Soft             │
│ Blocks │   iPhone 14 (390px)      │  ○ Shadow           │
│ ⌄      │                          │                     │
│        │  [< ] [390px] [ >]       │  Color:             │
│        │                          │  [🎨]               │
│        │                          │                     │
├────────┴──────────────────────────┴─────────────────────┤
│  💡 Tip: Drag blocks to reorder • Click to edit          │
└─────────────────────────────────────────────────────────┘
```

## 🎯 Interaction States

### Button States
```
Default:     Solid color, normal size
Hover:       Slightly larger (scale 1.02), shadow increases
Active:      Slightly smaller (scale 0.98)
Focus:       Blue outline (accessibility)
Disabled:    50% opacity, no interaction
```

### Icon States
```
Default:     Colored background/border
Hover:       Scale 1.1, shadow appears
Active:      Scale 0.95
```

### Edit Mode
```
Default:     Normal rendering
Edit Mode:   Dashed border, input fields visible
Selected:    Blue ring (ring-2 ring-blue-500)
```

---

**Visual Design Guide** - Use this as reference when implementing the UI
