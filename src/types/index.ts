export interface Block {
  id: string;
  type: BlockType;
  content: BlockContent;
  styles?: BlockStyles;
  style?: Record<string, unknown>; // Additional inline styles for Linktree blocks
  order: number;
}

export type BlockType = 
  | 'profile'     // Linktree-style profile section (avatar + name + bio)
  | 'linkButton'  // Linktree-style link button
  | 'header'      // Page header section
  | 'footer'      // Page footer section
  | 'heading'
  | 'text'
  | 'button'
  | 'image'
  | 'form'
  | 'spacer'
  // New block types - Week 2+
  | 'video'       // YouTube/Vimeo embeds
  | 'divider'     // Horizontal line separators
  | 'social'      // Social media links
  | 'countdown'   // Event countdown timer
  | 'calendar'    // Events calendar
  | 'testimonial' // Quote with author
  | 'faq'         // FAQ/Accordion items
  // Interactive block types - Week 3+
  | 'gallery'     // Image carousel/slider
  | 'pricing'     // Pricing table comparison
  | 'features'    // Features grid with icons
  | 'stats'       // Animated statistics/counters
  | 'map'         // Google Maps embed
  | 'hero'        // Hero section with background
  // Monetization blocks
  | 'payment'     // Stripe payment/tip jar
  | 'product'     // Product card with buy button
  | 'shop'        // Multi-product store with cart
  | 'real-estate' // Real estate property listings
  | 'menu'        // Restaurant/food menu with categories
  | 'artist'      // Artist portfolio/music showcase
  | 'deals'       // Promotions, discounts, and coupons
  | 'schedule';   // Booking/scheduling calendar (Calendly-like)

export type BlockContent = Record<string, unknown>;

// === LINKTREE-STYLE BLOCK CONTENT TYPES ===

// Profile block - Linktree-style header
export interface ProfileContent {
  avatarUrl?: string;
  displayName: string;
  bio?: string;
  location?: string;
  website?: string;
}

// Link button block - Linktree-style action button
export interface LinkButtonContent {
  label: string;
  url: string;
  description?: string;
  icon?: 'arrow' | 'chevron' | 'external';
  thumbnail?: string;
}

// Specific content types for better type safety
export interface HeadingContent {
  text: string;
  level: 1 | 2 | 3;
}

export interface TextContent {
  html: string; // HTML from Tiptap editor
}

export interface ButtonContent {
  label: string;
  url: string;
}

export interface ImageContent {
  url: string;
  alt?: string;
}

export interface SpacerContent {
  height: string;
}

// === NEW BLOCK CONTENT TYPES ===

// Video block - supports YouTube and Vimeo embeds
export interface VideoContent {
  url: string;          // YouTube or Vimeo URL
  autoplay?: boolean;   // Auto-play on load
  loop?: boolean;       // Loop video
  muted?: boolean;      // Start muted
}

// Divider block - horizontal line separator
export interface DividerContent {
  style: 'solid' | 'dashed' | 'dotted';  // Line style
  thickness: number;                      // Line thickness in pixels
  width: string;                          // Width (e.g., '100%', '50%')
  color?: string;                         // Line color
}

// Social media links block
export interface SocialContent {
  platforms: {
    name: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'tiktok';
    url: string;
  }[];
  layout: 'horizontal' | 'vertical';     // Icon arrangement
  size: 'small' | 'medium' | 'large';    // Icon size
}

// Countdown timer block
export interface CountdownContent {
  targetDate: string;                     // ISO date string
  title?: string;                         // Timer title
  expiredMessage?: string;                // Message shown when expired
  showDays?: boolean;                     // Show days
  showHours?: boolean;                    // Show hours
  showMinutes?: boolean;                  // Show minutes
  showSeconds?: boolean;                  // Show seconds
}

// Testimonial block
export interface TestimonialContent {
  quote: string;                          // Testimonial text
  author: string;                         // Author name
  role?: string;                          // Author role/title
  avatar?: string;                        // Avatar image URL
  rating?: number;                        // Star rating (1-5)
}

// FAQ/Accordion block
export interface FAQContent {
  items: {
    question: string;
    answer: string;
    isOpen?: boolean;                     // Initially expanded
  }[];
}

// === INTERACTIVE BLOCK CONTENT TYPES ===

// Gallery/Carousel block - image slider
export interface GalleryContent {
  images: {
    url: string;
    alt?: string;
    caption?: string;
  }[];
  autoplay?: boolean;                     // Auto-advance slides
  interval?: number;                      // Auto-advance interval (ms)
  showDots?: boolean;                     // Show navigation dots
  showArrows?: boolean;                   // Show prev/next arrows
  aspectRatio?: '16:9' | '4:3' | '1:1' | 'auto';
}

// Pricing table block - compare pricing tiers
export interface PricingContent {
  tiers: {
    name: string;                         // Plan name (e.g., "Basic", "Pro")
    price: string;                        // Price (e.g., "$9/mo")
    description?: string;                 // Short description
    features: string[];                   // List of features
    buttonText?: string;                  // CTA button text
    buttonUrl?: string;                   // CTA button URL
    highlighted?: boolean;                // Highlight this tier
  }[];
  billingPeriod?: 'monthly' | 'yearly' | 'lifetime';
}

// Features grid block - showcase features with icons
export interface FeaturesContent {
  features: {
    icon?: string;                        // Icon name or emoji
    title: string;                        // Feature title
    description: string;                  // Feature description
  }[];
  columns: 2 | 3 | 4;                    // Number of columns
  layout: 'grid' | 'list';               // Layout style
}

// Stats/Counter block - animated numbers
export interface StatsContent {
  stats: {
    value: string;                        // Number or text (e.g., "1000+")
    label: string;                        // Label (e.g., "Happy Customers")
    suffix?: string;                      // Suffix (e.g., "%", "+")
    prefix?: string;                      // Prefix (e.g., "$")
  }[];
  columns: 2 | 3 | 4;                    // Number of columns
  animated?: boolean;                     // Animate count-up
}

// Map block - Google Maps embed
export interface MapContent {
  address?: string;                       // Address to geocode
  latitude?: number;                      // Latitude coordinate
  longitude?: number;                     // Longitude coordinate
  zoom?: number;                          // Zoom level (1-20)
  mapType?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
  showMarker?: boolean;                   // Show location marker
}

// Hero section block - large banner with CTA
export interface HeroContent {
  headline: string;                       // Main headline
  subheadline?: string;                   // Supporting text
  backgroundImage?: string;               // Background image URL
  backgroundVideo?: string;               // Background video URL
  overlay?: boolean;                      // Dark overlay on background
  overlayOpacity?: number;                // Overlay opacity (0-1)
  buttonText?: string;                    // CTA button text
  buttonUrl?: string;                     // CTA button URL
  alignment?: 'left' | 'center' | 'right';
  height?: 'small' | 'medium' | 'large' | 'full';
}

// Product card block - e-commerce product display
export interface ProductContent {
  name: string;                           // Product name
  description?: string;                   // Product description
  price: number;                          // Price in cents or dollars
  originalPrice?: number;                 // Original price for sales
  currency?: string;                      // Currency code (USD, EUR, etc.)
  imageUrl?: string;                      // Product image URL
  imageUrls?: string[];                   // Multiple images for gallery
  buttonText?: string;                    // Buy button text
  buttonUrl?: string;                     // External product URL
  useStripeCheckout?: boolean;            // Use built-in Stripe checkout
  stripePriceId?: string;                 // Stripe Price ID for direct checkout
  inventory?: {                           // Inventory info
    available?: boolean;                  // Is product in stock
    quantity?: number;                    // Stock quantity
    showQuantity?: boolean;               // Show "X left in stock"
  };
  badge?: string;                         // Product badge (e.g., "New", "Sale")
  rating?: number;                        // Star rating (1-5)
  reviewCount?: number;                   // Number of reviews
  features?: string[];                    // Key features list
}

export interface BlockStyles {
  alignment?: 'left' | 'center' | 'right';
  textAlign?: 'left' | 'center' | 'right'; // Text alignment
  color?: string;
  backgroundColor?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string;
  // Button specific
  variant?: 'solid' | 'outline' | 'ghost'; // Button variant
  buttonVariant?: 'solid' | 'outline' | 'ghost';
  buttonColor?: string;
  // Payment/Product block specific
  accentColor?: string;
  textColor?: string;
  // Image specific
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  borderWidth?: string;
  borderColor?: string;
}

export interface Microsite {
  id: string;
  name: string;
  slug: string;
  theme: Theme;
  blocks: Block[];
  createdAt: string;
  updatedAt: string;
}

export interface Theme {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  isDark: boolean;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  blocks: Omit<Block, 'id'>[];
  theme: Theme;
}
