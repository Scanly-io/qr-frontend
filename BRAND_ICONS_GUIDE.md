# 🎨 Modern Brand Icons Guide

## Overview
We use **high-quality SVG icons** sourced from official brand guidelines, just like Stan, Linktree, and other competitors.

## ✅ Available Icons

### 🎵 Music & Entertainment
- **Spotify** - `<SpotifyIcon />` - #1DB954
- **Apple Music** - `<AppleMusicIcon />` - #FA243C
- **SoundCloud** - `<SoundCloudIcon />` - #FF5500

### 💳 Payments & Commerce
- **Stripe** - `<StripeIcon />` - #635BFF
- **PayPal** - `<PayPalIcon />` - #00457C
- **Venmo** - `<VenmoIcon />` - #008CFF
- **Shopify** - `<ShopifyIcon />` - #96BF48

### 📱 Social Media
- **Instagram** - `<InstagramIcon />` - #E4405F
- **X (Twitter)** - `<XIcon />` - #000000
- **TikTok** - `<TikTokIcon />` - #000000

### 🛠️ Productivity & Tools
- **Notion** - `<NotionIcon />` - #000000
- **Slack** - `<SlackIcon />` - #4A154B
- **Mailchimp** - `<MailchimpIcon />` - #FFE01B

### 🔗 Links & Utilities
- **Linktree** - `<LinktreeIcon />` - #43E55E
- **Calendly** - `<CalendlyIcon />` - #006BFF

---

## 📖 Usage Examples

### Basic Usage
```tsx
import { SpotifyIcon, StripeIcon } from '@/components/icons/BrandIcons';

// Simple icon with custom size
<SpotifyIcon className="w-6 h-6 text-green-500" />

// Icon with brand color
<StripeIcon className="w-8 h-8" style={{ color: '#635BFF' }} />
```

### With Brand Colors
```tsx
import { InstagramIcon, BrandColors } from '@/components/icons/BrandIcons';

<InstagramIcon 
  className="w-10 h-10" 
  style={{ color: BrandColors.instagram }}
/>
```

### Integration Cards (Like Stan)
```tsx
function IntegrationCard({ name, icon: Icon, color, description }) {
  return (
    <div className="p-6 bg-white rounded-xl border border-stone-200 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-4">
        {/* Icon with brand color background */}
        <div 
          className="w-14 h-14 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-7 h-7" style={{ color }} />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-stone-900">{name}</h3>
          <p className="text-sm text-stone-600">{description}</p>
        </div>
        
        <button className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700">
          Connect
        </button>
      </div>
    </div>
  );
}

// Usage
<IntegrationCard
  name="Spotify"
  icon={SpotifyIcon}
  color={BrandColors.spotify}
  description="Share your music and playlists"
/>
```

### Social Links Grid
```tsx
import { 
  SpotifyIcon, 
  InstagramIcon, 
  TikTokIcon,
  BrandColors 
} from '@/components/icons/BrandIcons';

const socialLinks = [
  { icon: SpotifyIcon, color: BrandColors.spotify, label: 'Spotify' },
  { icon: InstagramIcon, color: BrandColors.instagram, label: 'Instagram' },
  { icon: TikTokIcon, color: BrandColors.tiktok, label: 'TikTok' },
];

function SocialLinksGrid() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {socialLinks.map(({ icon: Icon, color, label }) => (
        <button
          key={label}
          className="p-4 bg-white rounded-xl border border-stone-200 hover:shadow-md transition-all group"
        >
          <Icon 
            className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" 
            style={{ color }}
          />
          <p className="text-xs text-stone-600 font-medium">{label}</p>
        </button>
      ))}
    </div>
  );
}
```

### Payment Options (Like Stripe Integration)
```tsx
import { StripeIcon, PayPalIcon, VenmoIcon } from '@/components/icons/BrandIcons';

function PaymentOptions() {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-stone-700">Payment Methods</h3>
      
      <div className="flex items-center gap-3 p-4 bg-violet-50 rounded-lg border border-violet-200">
        <StripeIcon className="w-6 h-6 text-violet-600" />
        <div className="flex-1">
          <p className="font-medium text-violet-900">Stripe</p>
          <p className="text-xs text-violet-600">Credit cards, Apple Pay, Google Pay</p>
        </div>
        <span className="px-2 py-1 bg-violet-600 text-white text-xs rounded-full">Active</span>
      </div>
      
      <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-stone-200">
        <PayPalIcon className="w-6 h-6" style={{ color: '#00457C' }} />
        <div className="flex-1">
          <p className="font-medium text-stone-900">PayPal</p>
          <p className="text-xs text-stone-600">PayPal account or credit card</p>
        </div>
        <button className="text-violet-600 text-sm font-medium">Connect</button>
      </div>
    </div>
  );
}
```

---

## 🎨 Design Patterns (Like Competitors)

### 1. **Gradient Backgrounds** (Stan Style)
```tsx
<div 
  className="w-16 h-16 rounded-2xl flex items-center justify-center"
  style={{
    background: 'linear-gradient(135deg, #1DB954 0%, #1AA34A 100%)'
  }}
>
  <SpotifyIcon className="w-8 h-8 text-white" />
</div>
```

### 2. **Glassmorphism** (Modern Style)
```tsx
<div className="backdrop-blur-lg bg-white/30 p-6 rounded-2xl border border-white/20">
  <InstagramIcon className="w-10 h-10" style={{ color: BrandColors.instagram }} />
</div>
```

### 3. **Glow Effects** (Premium Style)
```tsx
<div 
  className="p-4 rounded-xl transition-all hover:scale-105"
  style={{
    backgroundColor: '#1DB95410',
    boxShadow: '0 0 0 1px #1DB95420, 0 4px 16px #1DB95430'
  }}
>
  <SpotifyIcon className="w-6 h-6" style={{ color: BrandColors.spotify }} />
</div>
```

---

## 🚀 Next Steps

### Want More Icons?
Add icons from these sources:

1. **Simple Icons** (3000+ brands)
   ```bash
   npm install simple-icons
   ```

2. **React Icons** (comprehensive)
   ```bash
   npm install react-icons
   ```

3. **Custom SVGs**
   - Get official brand assets from brand guidelines
   - Copy SVG path data
   - Add to `BrandIcons.tsx`

### Custom Icon Template
```tsx
export const YourBrandIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="YOUR_SVG_PATH_DATA_HERE" />
  </svg>
);
```

---

## 📚 Resources

- [Lucide Icons](https://lucide.dev) - Already using for generic icons
- [Simple Icons](https://simpleicons.org) - 3000+ brand SVGs
- [Brand Guidelines](https://brandguidelines.com) - Official brand assets
- [SVG Repo](https://www.svgrepo.com) - Free SVG icons

---

## 💡 Tips

1. **Always use official brand colors** - Don't customize brand colors
2. **Maintain aspect ratio** - Use square containers (w-6 h-6, w-8 h-8)
3. **Test on dark backgrounds** - Some icons (X, TikTok) are black
4. **Add hover states** - Makes UI feel premium
5. **Use consistent sizing** - Stick to w-6, w-8, w-10 for harmony

---

**Current Status**: ✅ Ready to use in production  
**Location**: `/src/components/icons/BrandIcons.tsx`  
**Total Icons**: 15+ premium brand icons
