# Theme Categories Implementation Plan

## 🎯 Quick Wins (Can Implement Now)

### 1. Add Category Filtering to ThemeGallery
**File:** `src/components/editor/ThemeGallery.tsx`

```tsx
const categories = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'ecommerce', label: 'E-Commerce', icon: '🛍️' },
  { id: 'artist', label: 'Artists', icon: '🎨' },
  { id: 'education', label: 'Education', icon: '📚' },
  { id: 'personal', label: 'Personal', icon: '👤' },
  { id: 'events', label: 'Events', icon: '🎪' },
  { id: 'professional', label: 'Professional', icon: '💼' },
];

// Add category pills above theme grid
<div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
  {categories.map(cat => (
    <button
      key={cat.id}
      onClick={() => setSelectedCategory(cat.id)}
      className={`
        px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap
        ${selected === cat.id 
          ? 'bg-primary text-white' 
          : 'bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200'
        }
      `}
    >
      <span className="mr-1">{cat.icon}</span>
      {cat.label}
    </button>
  ))}
</div>
```

---

### 2. Fix Mobile Preview Scrolling
**File:** `src/components/editor/DeviceFrame.tsx`

```tsx
export function DeviceFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-[375px] h-[812px] mx-auto">
      {/* Device bezel */}
      <div className="absolute inset-0 rounded-[3rem] border-[14px] border-black shadow-2xl pointer-events-none z-10">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl" />
      </div>
      
      {/* Screen area with scrolling */}
      <div className="absolute inset-[14px] rounded-[2.5rem] overflow-hidden bg-white">
        {/* Status bar - Fixed */}
        <div className="sticky top-0 h-11 bg-white/95 backdrop-blur-md z-20 flex items-center justify-between px-6 text-xs">
          <span className="font-semibold">9:41</span>
          <div className="flex gap-1 items-center">
            <span>📶</span>
            <span>📡</span>
            <span>🔋</span>
          </div>
        </div>
        
        {/* Scrollable content */}
        <div className="overflow-y-auto h-[calc(100%-44px-34px)] scroll-smooth">
          {/* Enable iOS momentum scrolling */}
          <style>{`
            .overflow-y-auto {
              -webkit-overflow-scrolling: touch;
              scrollbar-width: none;
            }
            .overflow-y-auto::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {children}
        </div>
        
        {/* Home indicator - Fixed */}
        <div className="sticky bottom-0 h-[34px] bg-white/95 backdrop-blur-md z-20 flex items-center justify-center">
          <div className="w-32 h-1 bg-black/30 rounded-full" />
        </div>
      </div>
    </div>
  );
}
```

---

### 3. Create Premium "Apple-like" Theme
**File:** `src/types/theme.ts` - Add to PRESET_THEMES

```tsx
export const applePremiumTheme: PageTheme = {
  id: 'apple-premium',
  name: 'Apple Premium',
  category: 'premium',
  description: 'Inspired by Apple\'s design language',
  
  background: {
    type: 'gradient',
    gradient: {
      type: 'linear',
      angle: 180,
      colors: [
        { color: '#FFFFFF', position: 0 },
        { color: '#F5F5F7', position: 100 }
      ]
    }
  },
  
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", Inter, sans-serif',
    headingFont: 'SF Pro Display, Inter',
    bodyFont: 'SF Pro Text, Inter',
    headingSize: '2.5rem',      // 40px
    bodySize: '1.0625rem',       // 17px (Apple's default)
    headingWeight: '600',        // Semibold
    bodyWeight: '400',           // Regular
    headingColor: '#1D1D1F',     // Apple's text color
    bodyColor: '#1D1D1F',
    lineHeight: '1.47059',       // Apple's line height
    letterSpacing: '-0.022em'    // Apple's tracking
  },
  
  button: {
    variant: 'fill',
    size: 'large',
    backgroundColor: '#0071E3',  // Apple blue
    textColor: '#FFFFFF',
    borderRadius: 'full',        // Pill shape
    hoverEffect: 'lift',
    fontSize: '1.0625rem',       // 17px
    fontWeight: '500',           // Medium
    padding: {
      x: '1.5rem',
      y: '0.875rem'
    },
    shadow: '0 4px 16px rgba(0, 113, 227, 0.3)'
  },
  
  spacing: {
    container: '1.5rem',  // 24px horizontal padding
    section: '5rem',      // 80px between sections
    element: '2rem',      // 32px between elements
    compact: '1rem'       // 16px tight spacing
  },
  
  borderRadius: {
    card: '1.25rem',     // 20px
    button: '9999px',    // Full rounded
    image: '0.75rem',    // 12px
    input: '0.625rem'    // 10px
  },
  
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.04)',
    md: '0 4px 16px rgba(0, 0, 0, 0.08)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.12)',
    xl: '0 20px 60px rgba(0, 0, 0, 0.16)'
  }
};
```

---

### 4. Add Social Media Integration Block
**File:** `src/types/block.ts` - Add new block type

```tsx
export interface SocialLinksBlock extends BaseBlock {
  type: 'social-links';
  content: {
    platforms: Array<{
      id: string;
      name: 'instagram' | 'facebook' | 'tiktok' | 'linkedin' | 'youtube' | 
            'twitter' | 'pinterest' | 'whatsapp' | 'telegram' | 'snapchat' |
            'spotify' | 'apple-music' | 'soundcloud';
      url: string;
      username?: string;
      customLabel?: string;
    }>;
    layout: 'icons' | 'buttons' | 'cards';
    iconSize: 'sm' | 'md' | 'lg';
    showLabels: boolean;
    style: {
      iconColor?: string;
      backgroundColor?: string;
      borderRadius?: string;
    };
  };
}
```

**Component:** `src/components/blocks/SocialLinksBlock.tsx`

```tsx
import { 
  Instagram, Facebook, Music, Linkedin, Youtube, 
  Twitter, MessageCircle, Send 
} from 'lucide-react';

const SOCIAL_ICONS = {
  instagram: Instagram,
  facebook: Facebook,
  tiktok: Music,
  linkedin: Linkedin,
  youtube: Youtube,
  twitter: Twitter,
  whatsapp: MessageCircle,
  telegram: Send,
  // ... more
};

export function SocialLinksBlock({ content }: { content: SocialLinksBlock['content'] }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {content.platforms.map(platform => {
        const Icon = SOCIAL_ICONS[platform.name];
        
        return (
          <a
            key={platform.id}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center gap-2 px-4 py-2
              bg-white border-2 border-gray-200
              rounded-full hover:border-gray-400
              transition-all duration-200
              hover:scale-105
            "
          >
            <Icon className="w-5 h-5" />
            {content.showLabels && (
              <span className="font-medium">
                {platform.customLabel || platform.username || platform.name}
              </span>
            )}
          </a>
        );
      })}
    </div>
  );
}
```

---

## 📦 Database Schema Updates

### Add to Microsite Model

```typescript
// In qr-backend/services/microsite-service/src/models/microsite.ts

interface Microsite {
  // ... existing fields
  
  // NEW: Theme categorization
  themeCategory?: 
    | 'ecommerce'
    | 'artist'
    | 'education'
    | 'personal'
    | 'events'
    | 'real-estate'
    | 'professional'
    | 'nonprofit'
    | 'tech'
    | 'wellness';
  
  // NEW: Social media integrations
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    linkedin?: string;
    youtube?: string;
    twitter?: string;
    whatsapp?: string;
    // ... more platforms
  };
  
  // NEW: Premium features flag
  isPremium?: boolean;
  premiumFeatures?: {
    customDomain?: boolean;
    removeWatermark?: boolean;
    analytics?: boolean;
    customCSS?: boolean;
  };
}
```

---

## 🎨 Design System Tokens

**File:** `src/styles/design-tokens.ts`

```typescript
export const DESIGN_TOKENS = {
  // Apple-inspired spacing scale (4px base)
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
    '4xl': '5rem',    // 80px
  },
  
  // Apple-like typography scale
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.0625rem',    // 17px - Apple's body
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '2rem',      // 32px
    '4xl': '2.5rem',    // 40px
    '5xl': '3rem',      // 48px
    '6xl': '4rem',      // 64px
  },
  
  // Rounded corners
  borderRadius: {
    none: '0',
    sm: '0.5rem',      // 8px
    md: '0.75rem',     // 12px
    lg: '1rem',        // 16px
    xl: '1.25rem',     // 20px
    '2xl': '1.75rem',  // 28px
    full: '9999px',
  },
  
  // Subtle shadows
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.04)',
    md: '0 4px 16px rgba(0, 0, 0, 0.08)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.12)',
    xl: '0 20px 60px rgba(0, 0, 0, 0.16)',
  },
  
  // Easing curves
  easing: {
    apple: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    smooth: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
};
```

---

## 🚀 Where to Get Inspiration

### **Design Resources:**

1. **Apple's Design System**
   - https://developer.apple.com/design/human-interface-guidelines/
   - SF Symbols: https://developer.apple.com/sf-symbols/
   - Color palettes from apple.com

2. **Premium Design Inspiration:**
   - **Dribbble**: Search "link in bio", "microsite", "landing page"
   - **Behance**: Premium web design showcases
   - **Awwwards**: Award-winning websites
   - **Mobbin**: Mobile app design patterns

3. **Competitor Analysis:**
   - **Linktree**: https://linktr.ee/
   - **Beacons**: https://beacons.ai/
   - **Tap.bio**: https://tap.bio/
   - **Carrd**: https://carrd.co/
   - **Bio.fm**: https://bio.fm/

4. **Color Palettes:**
   - **Coolors**: https://coolors.co/
   - **Adobe Color**: https://color.adobe.com/
   - **Tailwind Colors**: https://tailwindcss.com/docs/customizing-colors

5. **Typography:**
   - **Google Fonts**: Inter, DM Sans, Plus Jakarta Sans
   - **Fontshare**: Free quality fonts
   - **Apple Fonts**: SF Pro (if licensed)

6. **Icons:**
   - **Lucide Icons**: https://lucide.dev/ (Currently using)
   - **Heroicons**: https://heroicons.com/
   - **Phosphor Icons**: https://phosphoricons.com/
   - **Iconoir**: https://iconoir.com/

---

## ✅ Implementation Checklist

### **Phase 1: Foundation** (This Week)
- [ ] Add category filter to ThemeGallery
- [ ] Fix mobile preview scrolling
- [ ] Create Apple Premium theme
- [ ] Add 3-5 themes per category (start with top 4 categories)

### **Phase 2: Social Integration** (Next Week)
- [ ] Create SocialLinksBlock component
- [ ] Add social media URL inputs
- [ ] Implement platform icons
- [ ] Add Instagram/Facebook embed support

### **Phase 3: Polish** (Week 3)
- [ ] Implement design tokens
- [ ] Add smooth animations
- [ ] Create premium theme templates
- [ ] Add theme preview improvements

### **Phase 4: Advanced** (Week 4)
- [ ] Theme marketplace preparation
- [ ] Custom theme builder
- [ ] Analytics integration
- [ ] A/B testing for themes

---

## 💡 Quick Tips

**For Premium Look:**
1. ✅ Use generous whitespace (2-3x more than you think)
2. ✅ Limit to 2-3 font weights
3. ✅ Subtle shadows (never harsh black shadows)
4. ✅ Smooth animations (300-600ms duration)
5. ✅ Consistent border radius throughout
6. ✅ Minimal color palette (2-3 colors max)

**For Mobile Scrolling:**
- Always test on actual iOS device (Safari handles scrolling differently)
- Use `-webkit-overflow-scrolling: touch` for momentum
- Keep fixed headers/footers minimal
- Test with long content (20+ blocks)

**For Social Integration:**
- Start with top 5: Instagram, Facebook, TikTok, LinkedIn, YouTube
- Use official brand colors for social icons
- Implement deep linking (instagram://user?username=...)
- Add fallback for web links

