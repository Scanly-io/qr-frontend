# Theme Categories & Use Cases

## 🎨 Theme Categorization System

### **Core Categories:**

#### 1. **E-Commerce & Shops** 🛍️
**Use Cases:**
- Product catalogs
- Online stores
- Menu cards (restaurants, cafes)
- Service listings
- Pricing pages

**Theme Characteristics:**
- Clean product grids
- Prominent CTA buttons ("Buy Now", "Order", "Book")
- Trust badges & reviews
- Price display optimization
- Cart/checkout integration

**Examples:**
- `modern-shop` - Minimalist product showcase
- `boutique` - Elegant retail
- `restaurant-menu` - Food & beverage
- `services-pro` - Professional services

---

#### 2. **Artists & Creators** 🎨
**Use Cases:**
- Portfolio showcases
- Music artists (Spotify, Apple Music links)
- Visual artists
- Content creators (YouTube, TikTok)
- Photographers

**Theme Characteristics:**
- Bold visuals
- Gallery/grid layouts
- Social media integration
- Media embeds (videos, audio)
- Creative typography

**Examples:**
- `creative-portfolio` - Visual-first
- `music-artist` - Album/single showcase
- `photographer` - Image gallery focus
- `content-creator` - Video thumbnails

---

#### 3. **Education & Courses** 📚
**Use Cases:**
- Online course creators
- Tutors & coaches
- Workshops & webinars
- Educational institutions
- Training programs

**Theme Characteristics:**
- Course module layouts
- Learning path visualization
- Testimonials & credentials
- Video lesson embeds
- Enrollment CTAs

**Examples:**
- `course-academy` - Professional learning
- `workshop-host` - Event-based
- `tutor-profile` - Personal teaching
- `masterclass` - Premium education

---

#### 4. **Personal Branding & Influencers** 👤
**Use Cases:**
- Social media influencers
- Personal websites
- Digital business cards
- Brand ambassadors
- Public figures

**Theme Characteristics:**
- Profile-centric design
- Social media link trees
- Stats & achievements
- Media mentions
- Collaboration CTAs

**Examples:**
- `influencer-hub` - Social-first
- `personal-brand` - Professional
- `link-tree-pro` - Link aggregator
- `digital-card` - vCard style

---

#### 5. **Events & Networking** 🎪
**Use Cases:**
- Event registration
- Conference schedules
- Meetup groups
- Networking events
- Webinar landing pages

**Theme Characteristics:**
- Date/time prominence
- RSVP buttons
- Location maps
- Agenda/schedule
- Speaker bios

**Examples:**
- `event-landing` - Single event
- `conference-hub` - Multi-day
- `meetup-group` - Recurring events
- `webinar-register` - Online events

---

#### 6. **Real Estate & Properties** 🏠
**Use Cases:**
- Property listings
- Real estate agents
- Vacation rentals
- Co-working spaces
- Virtual tours

**Theme Characteristics:**
- Image galleries
- Property details
- Map integration
- Contact forms
- Virtual tour embeds

**Examples:**
- `property-showcase` - Listings
- `agent-profile` - Personal brand
- `rental-property` - Short-term
- `commercial-space` - B2B

---

#### 7. **Professional Services** 💼
**Use Cases:**
- Consultants
- Lawyers & accountants
- Healthcare providers
- Financial advisors
- B2B services

**Theme Characteristics:**
- Trust signals
- Credentials & certifications
- Case studies
- Appointment booking
- Professional color schemes

**Examples:**
- `consultant-pro` - Corporate
- `healthcare-provider` - Medical
- `legal-services` - Law firms
- `financial-advisor` - Finance

---

#### 8. **Non-Profit & Causes** 🌍
**Use Cases:**
- Charities
- Fundraising campaigns
- Community groups
- Social causes
- Volunteer recruitment

**Theme Characteristics:**
- Impact stories
- Donation buttons
- Progress indicators
- Mission statements
- Volunteer CTAs

**Examples:**
- `charity-campaign` - Fundraising
- `social-cause` - Awareness
- `community-group` - Local
- `volunteer-hub` - Recruitment

---

#### 9. **Tech & SaaS** 💻
**Use Cases:**
- Software products
- Mobile apps
- Tech startups
- Developer portfolios
- API documentation

**Theme Characteristics:**
- Feature highlights
- Screenshots/demos
- Integrations showcase
- Pricing tiers
- Developer-friendly

**Examples:**
- `saas-product` - Software
- `mobile-app` - App landing
- `dev-portfolio` - Developer
- `tech-startup` - Startup

---

#### 10. **Wellness & Lifestyle** 🧘
**Use Cases:**
- Fitness trainers
- Yoga instructors
- Life coaches
- Nutritionists
- Spa & wellness centers

**Theme Characteristics:**
- Calming aesthetics
- Class schedules
- Before/after galleries
- Testimonials
- Booking systems

**Examples:**
- `fitness-trainer` - Gym/personal
- `wellness-center` - Spa/yoga
- `life-coach` - Coaching
- `nutrition-guide` - Health

---

## 🔌 Social Media & Integration Categories

### **Must-Have Integrations:**

#### **Social Media Platforms:**
1. **Instagram** 📸
   - Feed embeds
   - Story highlights
   - Shop integration
   - Profile link

2. **Facebook** 📘
   - Page links
   - Event integration
   - Messenger button
   - Facebook Shop

3. **TikTok** 🎵
   - Video embeds
   - Profile link
   - Trending content

4. **LinkedIn** 💼
   - Profile link
   - Company page
   - Articles/posts

5. **YouTube** 📹
   - Channel link
   - Video embeds
   - Playlist integration

6. **Twitter/X** 🐦
   - Tweet embeds
   - Timeline widget
   - Profile link

7. **Pinterest** 📌
   - Board embeds
   - Pin it button
   - Shop integration

8. **Snapchat** 👻
   - Snapcode
   - Profile link
   - Lens integration

9. **WhatsApp** 💬
   - Click to chat
   - Business messaging
   - Group links

10. **Telegram** ✈️
    - Channel links
    - Group invites
    - Bot integration

#### **E-Commerce & Payments:**
- Shopify
- WooCommerce
- Stripe
- PayPal
- Square
- Apple Pay / Google Pay

#### **Content Platforms:**
- Medium
- Substack
- Patreon
- Gumroad
- Etsy

#### **Music Platforms:**
- Spotify
- Apple Music
- SoundCloud
- Bandcamp

#### **Professional:**
- Calendly (booking)
- Linktree (alternative)
- Mailchimp (newsletters)
- Google Maps (location)

---

## 🎯 Theme Selector Design

### **Recommended Approach:**

```tsx
// Theme selector with category filtering
<div className="theme-selector">
  {/* Category Pills */}
  <div className="category-pills">
    <button>All</button>
    <button>🛍️ E-Commerce</button>
    <button>🎨 Artists</button>
    <button>📚 Education</button>
    <button>👤 Personal</button>
    <button>🎪 Events</button>
    <button>🏠 Real Estate</button>
    <button>💼 Professional</button>
    <button>🌍 Non-Profit</button>
    <button>💻 Tech</button>
    <button>🧘 Wellness</button>
  </div>

  {/* Search */}
  <input type="search" placeholder="Search themes..." />

  {/* Theme Grid */}
  <div className="theme-grid">
    {filteredThemes.map(theme => (
      <ThemeCard 
        theme={theme}
        category={theme.category}
        tags={theme.tags}
        preview={theme.preview}
      />
    ))}
  </div>
</div>
```

### **Best UI Pattern:**

**Option A: Sidebar Filter + Grid** (Recommended)
```
┌──────────────┬────────────────────────────┐
│  Filters     │   Theme Grid (3 cols)      │
│              │                            │
│ Categories   │  [Theme] [Theme] [Theme]   │
│ ☐ E-Commerce │  [Theme] [Theme] [Theme]   │
│ ☐ Artists    │  [Theme] [Theme] [Theme]   │
│ ☐ Education  │                            │
│              │  Load More...              │
│ Style        │                            │
│ ☐ Minimal    │                            │
│ ☐ Bold       │                            │
│ ☐ Elegant    │                            │
└──────────────┴────────────────────────────┘
```

**Option B: Top Pills + Masonry Grid**
```
┌──────────────────────────────────────────┐
│ [All] [E-Commerce] [Artists] [Education] │
│                                          │
│ [Theme]    [Theme]         [Theme]       │
│            [Theme]  [Theme]              │
│ [Theme]            [Theme]  [Theme]      │
│ [Theme]    [Theme]                       │
└──────────────────────────────────────────┘
```

---

## 📱 Mobile Scroll Behavior

### **Current Issue:**
When page content exceeds viewport height, users need to scroll.

### **Solution:**

```tsx
// In DeviceFrame.tsx or Canvas.tsx
<div className="device-frame">
  <div className="device-screen">
    {/* Device header (fixed) */}
    <div className="device-header">
      <span>9:41</span>
      <span>📶 🔋</span>
    </div>
    
    {/* Scrollable content area */}
    <div className="device-content overflow-y-auto max-h-[calc(100vh-200px)]">
      {/* User's microsite content */}
      {blocks.map(block => <Block {...block} />)}
    </div>
    
    {/* Device footer (fixed) - iOS home indicator */}
    <div className="device-footer">
      <div className="home-indicator" />
    </div>
  </div>
</div>
```

### **CSS for Smooth Scrolling:**

```css
.device-content {
  /* Enable smooth scrolling */
  scroll-behavior: smooth;
  
  /* iOS momentum scrolling */
  -webkit-overflow-scrolling: touch;
  
  /* Hide scrollbar but keep functionality */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.device-content::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

/* Optional: Show scroll indicator */
.device-content.has-scroll::after {
  content: '';
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 4px;
  height: 40px;
  background: rgba(0,0,0,0.2);
  border-radius: 2px;
}
```

---

## 🍎 Premium "Apple-like" Design Principles

### **Core Principles:**

#### 1. **Whitespace & Breathing Room**
```tsx
// Instead of cramped spacing
<div className="space-y-2"> ❌

// Apple-style generous spacing
<div className="space-y-8 md:space-y-12"> ✅
```

#### 2. **Typography Hierarchy**
```tsx
// Apple uses SF Pro Display/Text
// For web, use Inter or SF Pro (if licensed)

const typography = {
  hero: 'text-5xl md:text-7xl font-semibold tracking-tight',
  heading: 'text-3xl md:text-4xl font-semibold tracking-tight',
  subheading: 'text-xl md:text-2xl font-medium text-gray-600',
  body: 'text-base md:text-lg leading-relaxed',
  caption: 'text-sm text-gray-500 tracking-wide'
};
```

#### 3. **Subtle Animations**
```tsx
// Smooth, purposeful animations (not bouncy)
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ 
    duration: 0.6,
    ease: [0.25, 0.1, 0.25, 1] // Apple's easing
  }}
>
```

#### 4. **Color System**
```tsx
const appleColors = {
  // Light mode
  background: '#FFFFFF',
  surface: '#F5F5F7', // Apple's gray
  text: '#1D1D1F',
  textSecondary: '#6E6E73',
  accent: '#0071E3', // Apple blue
  
  // Dark mode
  backgroundDark: '#000000',
  surfaceDark: '#1D1D1F',
  textDark: '#F5F5F7',
  textSecondaryDark: '#86868B',
  accentDark: '#2997FF'
};
```

#### 5. **Glassmorphism & Blur Effects**
```tsx
<div className="
  bg-white/80 
  backdrop-blur-xl 
  border border-gray-200/50
  shadow-lg shadow-black/5
  dark:bg-black/80 
  dark:border-white/10
">
```

#### 6. **Rounded Corners (Consistent Radii)**
```tsx
const borderRadius = {
  sm: '8px',   // Small elements
  md: '12px',  // Cards
  lg: '20px',  // Modals
  xl: '28px',  // Large cards
  full: '9999px' // Pills
};
```

#### 7. **Shadows (Soft & Layered)**
```tsx
const shadows = {
  sm: '0 2px 8px rgba(0,0,0,0.04)',
  md: '0 4px 16px rgba(0,0,0,0.08)',
  lg: '0 8px 32px rgba(0,0,0,0.12)',
  xl: '0 20px 60px rgba(0,0,0,0.16)'
};
```

#### 8. **Minimal Icons (SF Symbols style)**
```tsx
// Use lightweight, consistent icon sets
import { 
  ChevronRight, // Navigation
  Plus,         // Actions
  X,            // Close
  Check         // Confirm
} from 'lucide-react';

// Consistent sizing
<Icon className="w-5 h-5" strokeWidth={1.5} />
```

#### 9. **Button Styles**
```tsx
// Primary (Apple's blue button)
<button className="
  px-6 py-3
  bg-blue-600 hover:bg-blue-700
  text-white font-medium
  rounded-full
  transition-all duration-200
  shadow-lg shadow-blue-500/30
">

// Secondary (outlined)
<button className="
  px-6 py-3
  bg-transparent
  border-2 border-gray-300
  text-gray-900
  font-medium
  rounded-full
  hover:border-gray-400
  transition-all duration-200
">

// Text button
<button className="
  text-blue-600
  font-medium
  hover:text-blue-700
  transition-colors
">
```

#### 10. **Grid Layouts (Precise Alignment)**
```tsx
<div className="
  grid 
  grid-cols-1 md:grid-cols-2 lg:grid-cols-3
  gap-8 md:gap-12
  max-w-7xl mx-auto
  px-6 md:px-12
">
```

---

## 🎨 Premium Theme Template

```tsx
export const applePremiumTheme: PageTheme = {
  name: 'Apple Premium',
  category: 'premium',
  
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
    fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, Inter, sans-serif',
    headingFont: 'SF Pro Display',
    bodyFont: 'SF Pro Text',
    headingSize: '2.5rem',
    bodySize: '1.0625rem', // 17px - Apple's body size
    headingWeight: '600',
    bodyWeight: '400',
    headingColor: '#1D1D1F',
    bodyColor: '#1D1D1F',
    lineHeight: '1.47059', // Apple's line height
    letterSpacing: '-0.022em' // Apple's tracking
  },
  
  button: {
    variant: 'fill',
    size: 'large',
    backgroundColor: '#0071E3',
    textColor: '#FFFFFF',
    borderRadius: 'full',
    hoverEffect: 'lift',
    padding: {
      x: '1.5rem',
      y: '0.875rem'
    },
    shadow: '0 4px 16px rgba(0, 113, 227, 0.3)'
  },
  
  spacing: {
    section: '5rem', // 80px
    element: '2rem', // 32px
    compact: '1rem'  // 16px
  },
  
  borderRadius: {
    card: '1.25rem', // 20px
    button: '9999px',
    image: '0.75rem' // 12px
  }
};
```

---

## 📊 Implementation Priority

### **Phase 1: Core Categories** (Week 1)
- E-Commerce
- Artists/Creators
- Personal Branding
- Education

### **Phase 2: Business Categories** (Week 2)
- Professional Services
- Real Estate
- Events
- Tech/SaaS

### **Phase 3: Specialized** (Week 3)
- Non-Profit
- Wellness
- Premium themes

### **Phase 4: Integrations** (Week 4)
- Instagram, Facebook, TikTok
- Payment processors
- Booking systems
- Analytics

---

## 🎯 Next Steps

1. **Create theme taxonomy** in database
2. **Design category selector UI** (sidebar filter + grid)
3. **Implement scroll behavior** in device preview
4. **Build premium theme templates** following Apple principles
5. **Add social media integration blocks**
6. **Create theme submission system** (for future marketplace)

