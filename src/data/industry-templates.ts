import { nanoid } from 'nanoid';
import type { Block } from '@/types';
import type { PageTheme } from '@/types/theme';

export interface IndustryTemplate {
  id: string;
  name: string;
  description: string;
  category: 'restaurant' | 'artist' | 'real-estate' | 'shop' | 'salon' | 'fitness' | 'professional';
  gradient: string;
  thumbnail?: string;
  blocks: Block[];
  theme: Partial<PageTheme>;
  tags: string[];
}

// ============================================
// 🍽️ RESTAURANT TEMPLATES
// ============================================

export const RESTAURANT_TEMPLATES: IndustryTemplate[] = [
  {
    id: 'restaurant-modern-bistro',
    name: 'Modern Bistro',
    description: 'Elegant casual dining with sophisticated menu presentation',
    category: 'restaurant',
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    tags: ['bistro', 'fine dining', 'modern', 'elegant'],
    blocks: [
      {
        id: nanoid(),
        type: 'profile',
        content: {
          displayName: 'La Belle Cuisine',
          bio: 'Contemporary French-American fusion • Est. 2018\n📍 123 Culinary Ave, Downtown',
          avatarUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200',
        },
        style: {
          avatarSize: 88,
          textAlign: 'center',
        },
        order: 0,
      },
      {
        id: nanoid(),
        type: 'hero',
        content: {
          headline: 'Experience Culinary Excellence',
          subheadline: 'Where every dish tells a story',
          backgroundImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200',
          overlayOpacity: 0.5,
          buttonText: 'Reserve a Table',
          buttonUrl: '#',
          height: 'medium',
        },
        style: {},
        order: 1,
      },
      {
        id: nanoid(),
        type: 'menu',
        content: {
          style: 'elegant',
          title: 'Our Menu',
          showImages: true,
          showDescriptions: true,
          showBadges: true,
          enableCart: false,
          currency: 'USD',
          categories: [
            {
              name: 'Appetizers',
              icon: '🥗',
              items: [
                { 
                  id: '1',
                  name: 'French Onion Soup', 
                  description: 'Caramelized onions, gruyère crouton', 
                  price: 14, 
                  image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
                  badges: ['vegetarian'],
                  available: true,
                },
                { 
                  id: '2',
                  name: 'Tuna Tartare', 
                  description: 'Sushi-grade tuna, avocado, sesame', 
                  price: 18,
                  image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400',
                  badges: ['popular'],
                  available: true,
                },
                { 
                  id: '3',
                  name: 'Burrata Salad', 
                  description: 'Heirloom tomatoes, basil, balsamic', 
                  price: 16, 
                  image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400',
                  badges: ['vegetarian', 'gluten-free'],
                  available: true,
                },
              ],
            },
            {
              name: 'Entrées',
              icon: '🍽️',
              items: [
                { 
                  id: '4',
                  name: 'Filet Mignon', 
                  description: '8oz prime beef, truffle butter, potato gratin', 
                  price: 48, 
                  image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400',
                  badges: ['chef-special', 'popular'],
                  prepTime: '25 min',
                  available: true,
                },
                { 
                  id: '5',
                  name: 'Pan-Seared Salmon', 
                  description: 'Atlantic salmon, lemon caper sauce', 
                  price: 36, 
                  image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
                  badges: ['gluten-free'],
                  prepTime: '20 min',
                  available: true,
                },
                { 
                  id: '6',
                  name: 'Mushroom Risotto', 
                  description: 'Arborio rice, wild mushrooms, parmesan', 
                  price: 28, 
                  image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400',
                  badges: ['vegetarian'],
                  prepTime: '30 min',
                  available: true,
                },
              ],
            },
            {
              name: 'Desserts',
              icon: '🍰',
              items: [
                { 
                  id: '7',
                  name: 'Crème Brûlée', 
                  description: 'Vanilla bean custard, caramelized sugar', 
                  price: 12,
                  image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400',
                  badges: ['popular'],
                  available: true,
                },
                { 
                  id: '8',
                  name: 'Chocolate Fondant', 
                  description: 'Warm chocolate cake, vanilla ice cream', 
                  price: 14,
                  image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400',
                  badges: ['new'],
                  available: true,
                },
              ],
            },
          ],
        },
        style: {},
        order: 2,
      },
      {
        id: nanoid(),
        type: 'gallery',
        content: {
          images: [
            { url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600', alt: 'Signature dish' },
            { url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600', alt: 'Fresh ingredients' },
            { url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600', alt: 'Wood-fired pizza' },
            { url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600', alt: 'Restaurant ambiance' },
          ],
          layout: 'grid',
          columns: 2,
        },
        style: {},
        order: 3,
      },
      {
        id: nanoid(),
        type: 'schedule',
        content: {
          title: 'Make a Reservation',
          subtitle: 'Book your table online',
          style: 'calendar',
        },
        style: {},
        order: 4,
      },
      {
        id: nanoid(),
        type: 'map',
        content: {
          address: '123 Culinary Avenue, Downtown',
          title: 'Find Us',
          zoom: 15,
        },
        style: {},
        order: 5,
      },
      {
        id: nanoid(),
        type: 'social',
        content: {
          links: {
            instagram: 'labellecuisine',
            facebook: 'labellecuisine',
            yelp: 'la-belle-cuisine',
          },
        },
        style: {
          iconSize: 40,
          style: 'filled',
          layout: 'horizontal',
        },
        order: 6,
      },
    ],
    theme: {
      background: {
        type: 'solid',
        color: '#fdf8f6',
      },
      typography: {
        titleFont: 'playfair',
        bodyFont: 'inter',
        titleColor: '#3d2c2e',
        bodyColor: '#6b5a5c',
      },
      button: {
        backgroundColor: '#8b4513',
        textColor: '#ffffff',
        borderRadius: 'md',
        variant: 'fill',
      },
      branding: {
        primaryColor: '#8b4513',
      },
    },
  },
  {
    id: 'restaurant-casual-cafe',
    name: 'Casual Café',
    description: 'Friendly neighborhood café with cozy vibes',
    category: 'restaurant',
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    tags: ['cafe', 'casual', 'coffee', 'brunch'],
    blocks: [
      {
        id: nanoid(),
        type: 'profile',
        content: {
          displayName: 'Morning Brew Café',
          bio: '☕ Coffee • Brunch • Good Vibes\nOpen Daily 7AM - 4PM',
        },
        style: {
          avatarSize: 80,
          textAlign: 'center',
        },
        order: 0,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: '📱 Order Ahead',
          url: '#',
          description: 'Skip the line',
        },
        style: {
          variant: 'fill',
          size: 'large',
        },
        order: 1,
      },
      {
        id: nanoid(),
        type: 'menu',
        content: {
          style: 'cards',
          title: 'Today\'s Specials',
          showImages: true,
          showDescriptions: true,
          showBadges: true,
          enableCart: false,
          currency: 'USD',
          categories: [
            {
              name: 'Coffee & Drinks',
              items: [
                { 
                  id: 'c1',
                  name: 'House Latte', 
                  price: 5.5, 
                  description: 'Our signature espresso blend',
                  image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
                  badges: ['popular'],
                  available: true,
                },
                { 
                  id: 'c2',
                  name: 'Matcha Latte', 
                  price: 6, 
                  description: 'Organic ceremonial grade',
                  image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400',
                  badges: ['new'],
                  available: true,
                },
                { 
                  id: 'c3',
                  name: 'Cold Brew', 
                  price: 4.5, 
                  description: '24-hour steeped',
                  image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400',
                  available: true,
                },
              ],
            },
            {
              name: 'Breakfast',
              items: [
                { 
                  id: 'b1',
                  name: 'Avocado Toast', 
                  price: 12, 
                  description: 'Sourdough, poached eggs, everything seasoning', 
                  image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400',
                  badges: ['popular'],
                  available: true,
                },
                { 
                  id: 'b2',
                  name: 'Açaí Bowl', 
                  price: 14, 
                  description: 'Granola, fresh berries, honey drizzle', 
                  image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400',
                  badges: ['vegan', 'gluten-free'],
                  available: true,
                },
              ],
            },
          ],
        },
        style: {},
        order: 2,
      },
      {
        id: nanoid(),
        type: 'deals',
        content: {
          style: 'compact',
          deals: [
            { title: 'Happy Hour', description: '$1 off all drinks 2-4PM', discountPercent: 20 },
            { title: 'Loyalty Rewards', description: '10th drink free!', code: 'LOYALBEAN' },
          ],
        },
        style: {},
        order: 3,
      },
      {
        id: nanoid(),
        type: 'social',
        content: {
          links: {
            instagram: 'morningbrewcafe',
            tiktok: '@morningbrewcafe',
          },
        },
        style: {
          iconSize: 36,
          style: 'outline',
        },
        order: 4,
      },
    ],
    theme: {
      background: {
        type: 'solid',
        color: '#fffbf5',
      },
      typography: {
        titleFont: 'poppins',
        bodyFont: 'inter',
        titleColor: '#2d2a26',
        bodyColor: '#5c5650',
      },
      button: {
        backgroundColor: '#d97706',
        textColor: '#ffffff',
        borderRadius: 'lg',
        variant: 'fill',
      },
      branding: {
        primaryColor: '#d97706',
      },
    },
  },
];

// ============================================
// 🎵 ARTIST TEMPLATES
// ============================================

export const ARTIST_TEMPLATES: IndustryTemplate[] = [
  {
    id: 'artist-musician',
    name: 'Indie Musician',
    description: 'Showcase your music with a Spotify-style layout',
    category: 'artist',
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
    tags: ['musician', 'spotify', 'music', 'band', 'indie'],
    blocks: [
      {
        id: nanoid(),
        type: 'profile',
        content: {
          displayName: 'Luna Rivers',
          bio: '🎵 Singer-Songwriter | Indie Folk\n1.2M Monthly Listeners on Spotify',
          avatarUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200',
        },
        style: {
          avatarSize: 100,
          textAlign: 'center',
        },
        order: 0,
      },
      {
        id: nanoid(),
        type: 'artist',
        content: {
          style: 'spotify',
          artistName: 'Luna Rivers',
          genre: 'Indie Folk',
          monthlyListeners: 1200000,
          tracks: [
            { title: 'Midnight Dreams', duration: '3:42', plays: 4500000, isPlaying: true },
            { title: 'Golden Hour', duration: '4:15', plays: 3200000 },
            { title: 'River Song', duration: '3:28', plays: 2800000 },
            { title: 'Wildflower', duration: '3:55', plays: 2100000 },
          ],
          showPlays: true,
        },
        style: {},
        order: 1,
      },
      {
        id: nanoid(),
        type: 'video',
        content: {
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          title: 'Official Music Video - Midnight Dreams',
          autoplay: false,
        },
        style: {},
        order: 2,
      },
      {
        id: nanoid(),
        type: 'countdown',
        content: {
          title: '🎤 New Album Drop',
          subtitle: 'Pre-save now!',
          targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          style: 'elegant',
        },
        style: {},
        order: 3,
      },
      {
        id: nanoid(),
        type: 'deals',
        content: {
          style: 'cards',
          title: 'Merch Store',
          deals: [
            { title: 'Tour T-Shirt', description: 'Limited edition 2024 tour merch', originalPrice: 35, discountedPrice: 28, discountPercent: 20, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300' },
            { title: 'Vinyl Record', description: 'Signed limited pressing', originalPrice: 45, discountedPrice: 45 },
          ],
        },
        style: {},
        order: 4,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: '🎧 Listen on Spotify',
          url: 'https://spotify.com',
        },
        style: {
          variant: 'fill',
          backgroundColor: '#1DB954',
        },
        order: 5,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: '🍎 Apple Music',
          url: 'https://music.apple.com',
        },
        style: {
          variant: 'fill',
          backgroundColor: '#FA243C',
        },
        order: 6,
      },
      {
        id: nanoid(),
        type: 'social',
        content: {
          links: {
            instagram: 'lunarivers',
            tiktok: '@lunarivers',
            youtube: 'LunaRiversMusic',
            twitter: 'lunarivers',
          },
        },
        style: {
          iconSize: 44,
          style: 'filled',
          layout: 'grid',
        },
        order: 7,
      },
    ],
    theme: {
      background: {
        type: 'gradient',
        gradientFrom: '#1a1a2e',
        gradientTo: '#16213e',
        gradientDirection: 'to-b',
      },
      typography: {
        titleFont: 'poppins',
        bodyFont: 'inter',
        titleColor: '#ffffff',
        bodyColor: '#a0a0b0',
      },
      button: {
        backgroundColor: '#1DB954',
        textColor: '#ffffff',
        borderRadius: 'full',
        variant: 'fill',
      },
      branding: {
        primaryColor: '#1DB954',
      },
    },
  },
  {
    id: 'artist-visual',
    name: 'Visual Artist',
    description: 'Portfolio showcase for painters, illustrators, photographers',
    category: 'artist',
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
    tags: ['artist', 'visual', 'gallery', 'painter', 'photographer'],
    blocks: [
      {
        id: nanoid(),
        type: 'profile',
        content: {
          displayName: 'Mia Chen',
          bio: '🎨 Contemporary Abstract Artist\nBased in Brooklyn, NY | Exhibited Worldwide',
          avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
        },
        style: {
          avatarSize: 100,
          textAlign: 'center',
        },
        order: 0,
      },
      {
        id: nanoid(),
        type: 'hero',
        content: {
          headline: 'Where Color Meets Emotion',
          subheadline: 'Exploring the boundaries of abstract expressionism through bold palettes and dynamic compositions',
          backgroundImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200',
          overlayOpacity: 0.5,
          height: 'medium',
        },
        style: {},
        order: 1,
      },
      {
        id: nanoid(),
        type: 'artist',
        content: {
          style: 'gallery',
          title: 'Featured Works',
          artworks: [
            { title: 'Ethereal Dreams', medium: 'Oil on Canvas', year: 2024, dimensions: '48" × 60"', price: 4500, forSale: true, image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600', description: 'A dreamlike exploration of light and shadow' },
            { title: 'Urban Pulse', medium: 'Acrylic', year: 2024, dimensions: '36" × 48"', price: 3200, forSale: true, image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=600', description: 'Capturing the energy of city life' },
            { title: 'Serenity', medium: 'Mixed Media', year: 2023, dimensions: '40" × 52"', forSale: false, image: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=600', description: 'Private Collection' },
            { title: 'Chromatic Flow', medium: 'Digital Print', year: 2024, dimensions: '24" × 30"', price: 800, forSale: true, image: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=600', description: 'Limited edition of 25' },
            { title: 'Midnight Reverie', medium: 'Oil on Canvas', year: 2023, dimensions: '44" × 56"', price: 5200, forSale: true, image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=600', description: 'Part of the Night Series collection' },
            { title: 'Golden Hour', medium: 'Acrylic & Gold Leaf', year: 2024, dimensions: '30" × 40"', price: 3800, forSale: true, image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600', description: 'Warm tones with metallic accents' },
          ],
        },
        style: {},
        order: 2,
      },
      {
        id: nanoid(),
        type: 'stats',
        content: {
          stats: [
            { label: 'Artworks Sold', value: '200+' },
            { label: 'Exhibitions', value: '35' },
            { label: 'Years Active', value: '12' },
            { label: 'Countries', value: '18' },
          ],
          style: 'minimal',
        },
        style: {},
        order: 3,
      },
      {
        id: nanoid(),
        type: 'testimonial',
        content: {
          quotes: [
            { quote: 'Mia Chen\'s work transcends traditional boundaries, capturing raw emotion through bold color choices and fearless composition.', author: 'Art Forum Magazine', role: 'Featured Review, 2024' },
            { quote: 'One of the most exciting voices in contemporary abstract art. Her pieces command attention and provoke deep reflection.', author: 'Sarah Johnson', role: 'Chief Curator, MoMA' },
          ],
          style: 'card',
        },
        style: {},
        order: 4,
      },
      {
        id: nanoid(),
        type: 'features',
        content: {
          features: [
            { title: 'Commission Work', description: 'Custom pieces tailored to your vision', icon: 'palette' },
            { title: 'Art Consultation', description: 'Personal guidance for collectors', icon: 'message-circle' },
            { title: 'Worldwide Shipping', description: 'Secure delivery anywhere', icon: 'truck' },
            { title: 'Authentication', description: 'Signed certificates included', icon: 'check-circle' },
          ],
          style: 'grid',
        },
        style: {},
        order: 5,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: '🖼️ Commission Original Artwork',
          url: '#',
        },
        style: {
          variant: 'fill',
        },
        order: 6,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: '📧 Inquire About Exhibitions',
          url: 'mailto:studio@miachen.art',
        },
        style: {
          variant: 'outline',
        },
        order: 7,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: '📅 Schedule Studio Visit',
          url: '#',
        },
        style: {
          variant: 'soft',
        },
        order: 8,
      },
      {
        id: nanoid(),
        type: 'social',
        content: {
          links: {
            instagram: 'miachen.art',
            website: 'https://miachen.art',
            pinterest: 'miachen_art',
          },
        },
        style: {
          iconSize: 44,
          style: 'filled',
        },
        order: 9,
      },
    ],
    theme: {
      background: {
        type: 'gradient',
        gradientFrom: '#fdfbfb',
        gradientTo: '#faf8fc',
        gradientVia: '#f7f4f9',
        gradientDirection: 'to-br',
      },
      typography: {
        titleFont: 'playfair',
        bodyFont: 'inter',
        titleColor: '#1a1a1a',
        bodyColor: '#4a4a4a',
      },
      button: {
        backgroundColor: '#2d2d2d',
        textColor: '#ffffff',
        borderRadius: 'sm',
        variant: 'fill',
        shadow: 'md',
      },
      branding: {
        primaryColor: '#2d2d2d',
        accentColor: '#8b5cf6',
      },
    },
  },
];

// ============================================
// 🏠 REAL ESTATE TEMPLATES  
// ============================================

export const REAL_ESTATE_TEMPLATES: IndustryTemplate[] = [
  // 1. LUXURY AGENT PROFILE
  {
    id: 'real-estate-luxury-agent',
    name: 'Luxury Real Estate Agent',
    description: 'Premium agent profile with featured listings and client testimonials',
    category: 'real-estate',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    tags: ['realtor', 'agent', 'luxury', 'properties', 'high-end'],
    blocks: [
      {
        id: nanoid(),
        type: 'profile',
        content: {
          displayName: 'Sarah Mitchell',
          bio: '🏆 Top 1% Luxury Real Estate Specialist\n📍 Beverly Hills • Malibu • Bel Air',
          avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
        },
        style: {
          avatarSize: 110,
          textAlign: 'center',
        },
        order: 0,
      },
      {
        id: nanoid(),
        type: 'hero',
        content: {
          headline: 'Experience Matters in Luxury Real Estate',
          subheadline: 'Helping discerning clients find their dream homes for 15+ years. Specializing in architectural estates, oceanfront properties, and exclusive listings.',
          backgroundImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
          overlayOpacity: 0.6,
          height: 'medium',
        },
        style: {},
        order: 1,
      },
      {
        id: nanoid(),
        type: 'stats',
        content: {
          stats: [
            { value: '$250M+', label: 'Career Sales' },
            { value: '150+', label: 'Homes Sold' },
            { value: '15', label: 'Years Expert' },
            { value: '4.9★', label: 'Client Rating' },
          ],
          style: 'cards',
        },
        style: {},
        order: 2,
      },
      {
        id: nanoid(),
        type: 'features',
        content: {
          features: [
            { title: 'White-Glove Service', description: 'Personalized attention from first showing to closing', icon: 'sparkles' },
            { title: 'Global Network', description: 'International buyer & investor connections', icon: 'globe' },
            { title: 'Market Expertise', description: 'Deep knowledge of luxury LA markets', icon: 'trending-up' },
            { title: 'Off-Market Access', description: 'Exclusive pocket listings not on MLS', icon: 'key' },
          ],
          style: 'grid',
        },
        style: {},
        order: 3,
      },
      {
        id: nanoid(),
        type: 'heading',
        content: {
          text: '✨ Featured Luxury Listings',
          level: 2,
        },
        style: {
          textAlign: 'center',
        },
        order: 4,
      },
      {
        id: nanoid(),
        type: 'real-estate',
        content: {
          layout: 'featured',
          showAgent: false,
          currency: 'USD',
          properties: [
            {
              id: '1',
              title: 'Modern Hillside Estate',
              address: '1200 Sunset Plaza Dr, Beverly Hills, CA 90210',
              price: 8500000,
              priceLabel: 'For Sale',
              status: 'available',
              type: 'house',
              images: [
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
                'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
                'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
              ],
              bedrooms: 5,
              bathrooms: 6,
              sqft: 7200,
              parking: 4,
              yearBuilt: 2021,
              description: 'Architectural masterpiece with panoramic city views, infinity pool, and state-of-the-art smart home technology. Designed by renowned architect Richard Meier.',
              features: ['Infinity Pool', 'Panoramic Views', 'Home Theater', 'Wine Cellar', 'Smart Home', 'Elevator', 'Gym', 'Spa'],
              featured: true,
            },
            {
              id: '2',
              title: 'Beachfront Malibu Estate',
              address: '22456 Pacific Coast Hwy, Malibu, CA 90265',
              price: 15900000,
              priceLabel: 'For Sale',
              status: 'available',
              type: 'house',
              images: [
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
                'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
              ],
              bedrooms: 6,
              bathrooms: 8,
              sqft: 9500,
              parking: 6,
              yearBuilt: 2019,
              description: 'Rare oceanfront estate with 100ft of beach frontage, guest house, and world-class amenities. Direct sand access and stunning sunset views.',
              features: ['Private Beach', 'Guest House', 'Pool & Spa', 'Ocean Views', 'Gym', 'Sauna', 'Chef\'s Kitchen', 'Media Room'],
              featured: true,
            },
            {
              id: '3',
              title: 'Contemporary Penthouse',
              address: '10000 Wilshire Blvd PH, Los Angeles, CA 90024',
              price: 6200000,
              priceLabel: 'For Sale',
              status: 'pending',
              type: 'condo',
              images: [
                'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800',
                'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800',
              ],
              bedrooms: 4,
              bathrooms: 5,
              sqft: 5200,
              parking: 3,
              yearBuilt: 2020,
              description: 'Full-floor penthouse with 360° views, private rooftop terrace with kitchen, and designer finishes throughout. Located in prestigious Wilshire corridor.',
              features: ['Rooftop Terrace', '360° Views', '24/7 Concierge', 'Fitness Center', 'Valet Parking', 'Wine Storage'],
              featured: true,
            },
            {
              id: '4',
              title: 'Bel Air Mediterranean Villa',
              address: '750 Bel Air Rd, Bel Air, CA 90077',
              price: 12500000,
              priceLabel: 'For Sale',
              status: 'available',
              type: 'house',
              images: [
                'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
              ],
              bedrooms: 7,
              bathrooms: 9,
              sqft: 11200,
              parking: 8,
              yearBuilt: 2018,
              description: 'Mediterranean masterpiece on 2.5 acres with resort-style grounds, tennis court, and stunning canyon views. Recently renovated with luxury finishes.',
              features: ['Tennis Court', 'Pool House', 'Wine Room', 'Library', 'Canyon Views', 'Gated', 'Guest Quarters'],
            },
          ],
        },
        style: {},
        order: 5,
      },
      {
        id: nanoid(),
        type: 'testimonial',
        content: {
          quotes: [
            { 
              quote: 'Sarah found us our dream home when we thought it was impossible. Her market knowledge and negotiation skills saved us over $500K. She\'s simply the best in the business.', 
              author: 'The Johnson Family', 
              role: 'Beverly Hills Buyers',
              rating: 5,
            },
            { 
              quote: 'Sold our Malibu oceanfront property $2M above asking in just 5 days. Sarah\'s marketing strategy, staging expertise, and professional network are unmatched.', 
              author: 'Michael & Jennifer R.', 
              role: 'Malibu Sellers',
              rating: 5,
            },
            { 
              quote: 'As an international buyer from Europe, Sarah made the entire process seamless. True white-glove service with attention to every detail. Highly recommend.', 
              author: 'Alessandro B.', 
              role: 'Bel Air Buyer',
              rating: 5,
            },
          ],
          style: 'carousel',
        },
        style: {},
        order: 6,
      },
      {
        id: nanoid(),
        type: 'heading',
        content: {
          text: '🎯 My Specialized Services',
          level: 2,
        },
        style: {
          textAlign: 'center',
        },
        order: 7,
      },
      {
        id: nanoid(),
        type: 'schedule',
        content: {
          title: '',
          subtitle: 'Complimentary consultation & property evaluation',
          style: 'cards',
          services: [
            { id: '1', name: 'Buyer Consultation', duration: 30, price: 0, description: 'Discuss your dream home criteria & budget', icon: 'video' },
            { id: '2', name: 'Private Showing', duration: 60, price: 0, description: 'Exclusive property tour with expert insights', icon: 'home' },
            { id: '3', name: 'Seller\'s Presentation', duration: 45, price: 0, description: 'Pricing strategy & luxury marketing plan', icon: 'presentation' },
            { id: '4', name: 'Investment Analysis', duration: 45, price: 0, description: 'ROI analysis & market opportunities', icon: 'trending-up' },
            { id: '5', name: 'Portfolio Review', duration: 60, price: 0, description: 'Real estate portfolio optimization', icon: 'briefcase' },
          ],
        },
        style: {},
        order: 8,
      },
      {
        id: nanoid(),
        type: 'deals',
        content: {
          style: 'banner',
          deals: [
            { 
              title: 'New Listing Alert', 
              description: 'Join my VIP list for exclusive off-market properties before they hit the MLS', 
              code: 'VIP ACCESS',
            },
          ],
        },
        style: {},
        order: 9,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: '📞 Call Me Directly',
          url: 'tel:+13105551234',
        },
        style: {
          variant: 'fill',
        },
        order: 10,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: '📧 Email for Private Listings',
          url: 'mailto:sarah@luxuryestates.com',
        },
        style: {
          variant: 'outline',
        },
        order: 11,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: '🎥 Watch Property Tours',
          url: 'https://youtube.com/@sarahmitchellrealty',
        },
        style: {
          variant: 'soft',
        },
        order: 12,
      },
      {
        id: nanoid(),
        type: 'social',
        content: {
          links: {
            instagram: 'sarahmitchellrealty',
            linkedin: 'sarahmitchell',
            youtube: 'sarahmitchellrealty',
            facebook: 'sarahmitchellrealty',
          },
        },
        style: {
          iconSize: 48,
          style: 'filled',
        },
        order: 13,
      },
      {
        id: nanoid(),
        type: 'footer',
        content: {
          text: '© 2025 Sarah Mitchell Real Estate | DRE# 01234567 | Serving Beverly Hills, Malibu, Bel Air & Beyond',
          showPoweredBy: false,
        },
        style: {},
        order: 14,
      },
    ],
    theme: {
      background: {
        type: 'gradient',
        gradientFrom: '#fafafa',
        gradientTo: '#f5f5f5',
        gradientVia: '#ffffff',
        gradientDirection: 'to-b',
      },
      typography: {
        titleFont: 'playfair',
        bodyFont: 'inter',
        titleColor: '#1a1a1a',
        bodyColor: '#525252',
      },
      button: {
        backgroundColor: '#18181b',
        textColor: '#ffffff',
        borderRadius: 'lg',
        variant: 'fill',
        shadow: 'lg',
      },
      branding: {
        primaryColor: '#18181b',
        secondaryColor: '#3f3f46',
        accentColor: '#71717a',
      },
    },
  },

  // 2. PROPERTY LISTING PAGE
  {
    id: 'real-estate-single-property',
    name: 'Single Property Showcase',
    description: 'Dedicated page for showcasing a specific property listing',
    category: 'real-estate',
    gradient: 'from-slate-600 via-zinc-700 to-stone-800',
    tags: ['listing', 'property', 'showcase', 'single'],
    blocks: [
      {
        id: nanoid(),
        type: 'hero',
        content: {
          headline: 'Modern Architectural Estate',
          subheadline: '1847 Blue Jay Way, Los Angeles, CA 90069',
          backgroundImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
          overlayOpacity: 0.4,
          buttonText: 'Schedule Private Tour',
          buttonUrl: '#schedule',
          height: 'large',
        },
        style: {},
        order: 0,
      },
      {
        id: nanoid(),
        type: 'stats',
        content: {
          stats: [
            { value: '$12.5M', label: 'Asking Price' },
            { value: '6', label: 'Bedrooms' },
            { value: '8', label: 'Bathrooms' },
            { value: '8,500', label: 'Sq Ft' },
          ],
          style: 'minimal',
        },
        style: {},
        order: 1,
      },
      {
        id: nanoid(),
        type: 'gallery',
        content: {
          images: [
            { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', caption: 'Living Room' },
            { url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800', caption: 'Kitchen' },
            { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', caption: 'Master Suite' },
            { url: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800', caption: 'Pool Area' },
            { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', caption: 'Exterior' },
          ],
          layout: 'masonry',
          showCaptions: true,
        },
        style: {},
        order: 2,
      },
      {
        id: nanoid(),
        type: 'text',
        content: {
          text: 'This architectural masterpiece offers unparalleled luxury living in the prestigious Bird Streets. Designed by renowned architect John Lautner, the home seamlessly blends indoor-outdoor living with floor-to-ceiling glass walls, capturing breathtaking city and ocean views.\n\nThe property features a chef\'s kitchen with Miele appliances, a temperature-controlled wine room, home theater, wellness center with gym and spa, and a stunning infinity pool that appears to merge with the horizon.',
        },
        style: {
          textAlign: 'left',
        },
        order: 3,
      },
      {
        id: nanoid(),
        type: 'features',
        content: {
          title: 'Property Features',
          features: [
            { title: 'Infinity Pool & Spa', description: 'Heated pool with panoramic views', icon: 'waves' },
            { title: 'Smart Home', description: 'Crestron automation throughout', icon: 'zap' },
            { title: 'Home Theater', description: '14-seat cinema with Dolby Atmos', icon: 'film' },
            { title: 'Wine Cellar', description: '500+ bottle capacity', icon: 'wine' },
            { title: 'Outdoor Kitchen', description: 'Professional-grade with pizza oven', icon: 'utensils' },
            { title: 'Private Gym', description: 'Fully equipped fitness center', icon: 'dumbbell' },
            { title: '4-Car Garage', description: 'Climate-controlled with EV charging', icon: 'car' },
            { title: 'Security', description: '24/7 surveillance & panic room', icon: 'shield' },
          ],
          layout: 'grid',
          style: 'cards',
        },
        style: {},
        order: 4,
      },
      {
        id: nanoid(),
        type: 'map',
        content: {
          address: '1847 Blue Jay Way, Los Angeles, CA 90069',
          zoom: 15,
          showMarker: true,
          title: 'Location',
        },
        style: {},
        order: 5,
      },
      {
        id: nanoid(),
        type: 'profile',
        content: {
          displayName: 'Listed by David Chen',
          bio: 'The Agency | DRE# 01987654\n📱 (310) 555-0100 | david@theagency.com',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        },
        style: {
          avatarSize: 80,
          textAlign: 'center',
        },
        order: 6,
      },
      {
        id: nanoid(),
        type: 'schedule',
        content: {
          title: 'Schedule a Private Tour',
          subtitle: 'By appointment only',
          style: 'cards',
          services: [
            { id: '1', name: 'Private Showing', duration: 60, description: 'In-person property tour', icon: 'location' },
            { id: '2', name: 'Virtual Tour', duration: 30, description: 'Live video walkthrough', icon: 'video' },
          ],
        },
        style: {},
        order: 7,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: '📞 Call Agent',
          url: 'tel:+13105550100',
        },
        style: {
          variant: 'fill',
        },
        order: 8,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: '🎥 Watch Virtual Tour',
          url: 'https://youtube.com/watch?v=example',
        },
        style: {
          variant: 'outline',
        },
        order: 9,
      },
    ],
    theme: {
      background: {
        type: 'solid',
        color: '#ffffff',
      },
      typography: {
        titleFont: 'playfair',
        bodyFont: 'inter',
        titleColor: '#0f172a',
        bodyColor: '#475569',
      },
      button: {
        backgroundColor: '#0f172a',
        textColor: '#ffffff',
        borderRadius: 'lg',
        style: 'solid',
        hoverEffect: 'scale',
      },
      branding: {
        primaryColor: '#0f172a',
        secondaryColor: '#64748b',
        accentColor: '#d4af37',
      },
    },
  },

  // 3. REAL ESTATE TEAM/BROKERAGE
  {
    id: 'real-estate-team',
    name: 'Real Estate Team',
    description: 'Professional team page for brokerages and real estate groups',
    category: 'real-estate',
    gradient: 'from-blue-600 via-indigo-600 to-violet-600',
    tags: ['team', 'brokerage', 'agency', 'group'],
    blocks: [
      {
        id: nanoid(),
        type: 'hero',
        content: {
          headline: 'The Morrison Group',
          subheadline: 'Silicon Valley\'s Premier Real Estate Team',
          backgroundImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200',
          overlayOpacity: 0.6,
          height: 'medium',
        },
        style: {},
        order: 0,
      },
      {
        id: nanoid(),
        type: 'stats',
        content: {
          stats: [
            { value: '#1', label: 'In Silicon Valley' },
            { value: '$1.2B', label: 'Total Sales' },
            { value: '500+', label: 'Happy Clients' },
            { value: '12', label: 'Team Members' },
          ],
          style: 'cards',
        },
        style: {},
        order: 1,
      },
      {
        id: nanoid(),
        type: 'text',
        content: {
          text: 'Since 2008, The Morrison Group has been helping families in the Bay Area find their perfect homes. Our team of dedicated professionals combines local expertise with innovative marketing strategies to deliver exceptional results for buyers and sellers alike.',
        },
        style: {
          textAlign: 'center',
        },
        order: 2,
      },
      {
        id: nanoid(),
        type: 'heading',
        content: {
          text: 'Our Services',
          level: 2,
        },
        style: {
          textAlign: 'center',
        },
        order: 3,
      },
      {
        id: nanoid(),
        type: 'features',
        content: {
          features: [
            { title: 'Residential Sales', description: 'Expert guidance for buying or selling your home', icon: 'home' },
            { title: 'Luxury Properties', description: 'Specialized service for high-end estates', icon: 'star' },
            { title: 'Investment Properties', description: 'Strategic acquisitions for maximum ROI', icon: 'trending-up' },
            { title: 'Relocation Services', description: 'Seamless transitions for corporate moves', icon: 'map-pin' },
            { title: 'Property Management', description: 'Full-service rental management', icon: 'settings' },
            { title: 'Market Analysis', description: 'Data-driven insights and valuations', icon: 'bar-chart' },
          ],
          layout: 'grid',
          style: 'cards',
        },
        style: {},
        order: 4,
      },
      {
        id: nanoid(),
        type: 'heading',
        content: {
          text: 'Current Listings',
          level: 2,
        },
        style: {
          textAlign: 'center',
        },
        order: 5,
      },
      {
        id: nanoid(),
        type: 'real-estate',
        content: {
          layout: 'grid',
          showAgent: false,
          properties: [
            {
              id: '1',
              title: 'Palo Alto Contemporary',
              address: '850 University Ave, Palo Alto',
              price: 4850000,
              status: 'available',
              type: 'house',
              images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
              bedrooms: 4,
              bathrooms: 3,
              sqft: 3200,
            },
            {
              id: '2',
              title: 'Los Altos Hills Estate',
              address: '12500 Foothill Lane, Los Altos Hills',
              price: 8200000,
              status: 'available',
              type: 'house',
              images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
              bedrooms: 6,
              bathrooms: 5,
              sqft: 6800,
              featured: true,
            },
            {
              id: '3',
              title: 'Menlo Park Modern',
              address: '320 Oak Grove Ave, Menlo Park',
              price: 3950000,
              status: 'pending',
              type: 'house',
              images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'],
              bedrooms: 4,
              bathrooms: 4,
              sqft: 2800,
            },
          ],
        },
        style: {},
        order: 6,
      },
      {
        id: nanoid(),
        type: 'testimonial',
        content: {
          quotes: [
            { quote: 'The Morrison Group sold our home in 2 weeks, well above asking. Their marketing was incredible!', author: 'Robert & Lisa K.', role: 'Palo Alto Sellers', rating: 5 },
            { quote: 'Found our forever home thanks to their deep knowledge of the local market.', author: 'The Chen Family', role: 'Los Altos Buyers', rating: 5 },
          ],
          style: 'cards',
        },
        style: {},
        order: 7,
      },
      {
        id: nanoid(),
        type: 'schedule',
        content: {
          title: 'Connect With Our Team',
          style: 'list',
          services: [
            { id: '1', name: 'Free Home Valuation', duration: 30, price: 0, icon: 'home' },
            { id: '2', name: 'Buyer Consultation', duration: 45, price: 0, icon: 'users' },
            { id: '3', name: 'Investment Strategy Session', duration: 60, price: 0, icon: 'chart' },
          ],
        },
        style: {},
        order: 8,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: '📞 (650) 555-1234',
          url: 'tel:+16505551234',
        },
        style: { variant: 'fill' },
        order: 9,
      },
      {
        id: nanoid(),
        type: 'social',
        content: {
          links: {
            instagram: 'themorrisongroup',
            linkedin: 'morrison-group-realty',
            facebook: 'themorrisongroup',
            youtube: 'morrisongroup',
          },
        },
        style: { iconSize: 40, style: 'filled' },
        order: 10,
      },
      {
        id: nanoid(),
        type: 'footer',
        content: {
          text: 'The Morrison Group | Compass Real Estate\n123 Main Street, Palo Alto, CA 94301',
          showPoweredBy: false,
        },
        style: {},
        order: 11,
      },
    ],
    theme: {
      background: {
        type: 'solid',
        color: '#f8fafc',
      },
      typography: {
        titleFont: 'inter',
        bodyFont: 'inter',
        titleColor: '#1e293b',
        bodyColor: '#64748b',
      },
      button: {
        backgroundColor: '#1e40af',
        textColor: '#ffffff',
        borderRadius: 'lg',
        style: 'solid',
        hoverEffect: 'scale',
      },
      branding: {
        primaryColor: '#1e40af',
        secondaryColor: '#3b82f6',
        accentColor: '#f59e0b',
      },
    },
  },

  // 4. OPEN HOUSE / PROPERTY EVENT
  {
    id: 'real-estate-open-house',
    name: 'Open House Event',
    description: 'Dedicated page for open house events and property showings',
    category: 'real-estate',
    gradient: 'from-amber-500 via-orange-500 to-rose-500',
    tags: ['open house', 'event', 'showing', 'tour'],
    blocks: [
      {
        id: nanoid(),
        type: 'hero',
        content: {
          headline: 'OPEN HOUSE',
          subheadline: 'Sunday, February 2nd | 1PM - 4PM\n123 Maple Street, Beverly Hills',
          backgroundImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
          overlayOpacity: 0.5,
          buttonText: 'RSVP Now',
          buttonUrl: '#rsvp',
          height: 'full',
        },
        style: {},
        order: 0,
      },
      {
        id: nanoid(),
        type: 'countdown',
        content: {
          targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          title: 'Open House Starts In',
          expiredMessage: 'Open House is Live!',
          style: 'cards',
        },
        style: {},
        order: 1,
      },
      {
        id: nanoid(),
        type: 'stats',
        content: {
          stats: [
            { value: '$3.2M', label: 'Asking Price' },
            { value: '4', label: 'Beds' },
            { value: '4.5', label: 'Baths' },
            { value: '3,800', label: 'Sq Ft' },
          ],
          style: 'minimal',
        },
        style: {},
        order: 2,
      },
      {
        id: nanoid(),
        type: 'gallery',
        content: {
          images: [
            { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', caption: 'Grand Living Room' },
            { url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800', caption: 'Gourmet Kitchen' },
            { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', caption: 'Primary Suite' },
            { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', caption: 'Backyard Oasis' },
          ],
          layout: 'carousel',
        },
        style: {},
        order: 3,
      },
      {
        id: nanoid(),
        type: 'features',
        content: {
          title: 'Property Highlights',
          features: [
            { title: 'Renovated 2024', description: 'Completely updated', icon: 'sparkles' },
            { title: 'Pool & Spa', description: 'Heated year-round', icon: 'waves' },
            { title: 'Chef\'s Kitchen', description: 'Viking appliances', icon: 'utensils' },
            { title: 'Smart Home', description: 'Full automation', icon: 'zap' },
          ],
          layout: 'grid',
          style: 'minimal',
        },
        style: {},
        order: 4,
      },
      {
        id: nanoid(),
        type: 'map',
        content: {
          address: '123 Maple Street, Beverly Hills, CA 90210',
          zoom: 16,
          showMarker: true,
          title: 'Open House Location',
        },
        style: {},
        order: 5,
      },
      {
        id: nanoid(),
        type: 'form',
        content: {
          title: 'RSVP for Open House',
          submitLabel: 'Reserve My Spot',
          fields: [
            { id: 'name', type: 'text', label: 'Full Name', required: true, placeholder: 'Your name' },
            { id: 'email', type: 'email', label: 'Email', required: true, placeholder: 'your@email.com' },
            { id: 'phone', type: 'tel', label: 'Phone', required: true, placeholder: '(555) 123-4567' },
            { id: 'preapproved', type: 'checkbox', label: 'I am pre-approved for financing' },
            { id: 'agent', type: 'checkbox', label: 'I am working with an agent' },
          ],
        },
        style: {},
        order: 6,
      },
      {
        id: nanoid(),
        type: 'profile',
        content: {
          displayName: 'Hosted by Jennifer Walsh',
          bio: 'Coldwell Banker | (310) 555-7890\njennifer@cbcalifornia.com',
          avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
        },
        style: { avatarSize: 80, textAlign: 'center' },
        order: 7,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: '📞 Questions? Call Me',
          url: 'tel:+13105557890',
        },
        style: { variant: 'fill' },
        order: 8,
      },
    ],
    theme: {
      background: {
        type: 'solid',
        color: '#fefce8',
      },
      typography: {
        titleFont: 'playfair',
        bodyFont: 'inter',
        titleColor: '#1c1917',
        bodyColor: '#57534e',
      },
      button: {
        backgroundColor: '#b45309',
        textColor: '#ffffff',
        borderRadius: 'lg',
        style: 'solid',
        hoverEffect: 'lift',
      },
      branding: {
        primaryColor: '#b45309',
        secondaryColor: '#d97706',
        accentColor: '#fbbf24',
      },
    },
  },

  // 5. NEW CONSTRUCTION / DEVELOPMENT
  {
    id: 'real-estate-new-development',
    name: 'New Development',
    description: 'Marketing page for new construction and development projects',
    category: 'real-estate',
    gradient: 'from-cyan-500 via-blue-500 to-indigo-600',
    tags: ['new construction', 'development', 'builder', 'pre-sale'],
    blocks: [
      {
        id: nanoid(),
        type: 'hero',
        content: {
          headline: 'The Residences at Marina Bay',
          subheadline: 'Waterfront Luxury Living | Now Pre-Selling',
          backgroundImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200',
          overlayOpacity: 0.4,
          buttonText: 'View Floor Plans',
          buttonUrl: '#floorplans',
          height: 'full',
        },
        style: {},
        order: 0,
      },
      {
        id: nanoid(),
        type: 'text',
        content: {
          text: 'Introducing Marina Bay\'s most anticipated address. 42 exclusive residences featuring panoramic water views, world-class amenities, and uncompromising quality. Priced from $1.2M to $4.5M.',
        },
        style: { textAlign: 'center' },
        order: 1,
      },
      {
        id: nanoid(),
        type: 'stats',
        content: {
          stats: [
            { value: '42', label: 'Residences' },
            { value: '1-4', label: 'Bedrooms' },
            { value: '2026', label: 'Completion' },
            { value: '85%', label: 'Pre-Sold' },
          ],
          style: 'cards',
        },
        style: {},
        order: 2,
      },
      {
        id: nanoid(),
        type: 'gallery',
        content: {
          images: [
            { url: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800', caption: 'Lobby & Reception' },
            { url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800', caption: 'Model Kitchen' },
            { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', caption: 'Primary Suite' },
            { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', caption: 'Rooftop Pool' },
            { url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800', caption: 'Fitness Center' },
          ],
          layout: 'masonry',
          showCaptions: true,
        },
        style: {},
        order: 3,
      },
      {
        id: nanoid(),
        type: 'heading',
        content: { text: 'Available Floor Plans', level: 2 },
        style: { textAlign: 'center' },
        order: 4,
      },
      {
        id: nanoid(),
        type: 'pricing',
        content: {
          tiers: [
            {
              name: 'The Studio',
              price: '$1,200,000',
              period: 'Starting From',
              features: ['660 Sq Ft', '1 Bath', 'City Views', 'Balcony', '1 Parking'],
              highlighted: false,
              buttonText: 'Inquire',
              buttonUrl: '#contact',
            },
            {
              name: 'The Marina',
              price: '$1,850,000',
              period: 'Starting From',
              features: ['1,100 Sq Ft', '2 Bed / 2 Bath', 'Water Views', 'Large Balcony', '1 Parking'],
              highlighted: true,
              buttonText: 'Inquire',
              buttonUrl: '#contact',
            },
            {
              name: 'The Penthouse',
              price: '$4,500,000',
              period: 'Starting From',
              features: ['2,800 Sq Ft', '4 Bed / 3.5 Bath', 'Panoramic Views', 'Private Terrace', '2 Parking'],
              highlighted: false,
              buttonText: 'Inquire',
              buttonUrl: '#contact',
            },
          ],
          style: 'cards',
        },
        style: {},
        order: 5,
      },
      {
        id: nanoid(),
        type: 'features',
        content: {
          title: 'Building Amenities',
          features: [
            { title: 'Rooftop Pool & Lounge', icon: 'waves' },
            { title: '24/7 Concierge', icon: 'users' },
            { title: 'State-of-Art Fitness', icon: 'dumbbell' },
            { title: 'Private Wine Storage', icon: 'wine' },
            { title: 'EV Charging', icon: 'zap' },
            { title: 'Pet Spa', icon: 'heart' },
            { title: 'Business Center', icon: 'briefcase' },
            { title: 'Guest Suites', icon: 'bed' },
          ],
          layout: 'grid',
          style: 'minimal',
        },
        style: {},
        order: 6,
      },
      {
        id: nanoid(),
        type: 'map',
        content: {
          address: 'Marina Bay, San Francisco, CA',
          zoom: 14,
          title: 'Prime Location',
        },
        style: {},
        order: 7,
      },
      {
        id: nanoid(),
        type: 'form',
        content: {
          title: 'Request Information',
          subtitle: 'Be the first to receive updates and exclusive previews',
          submitLabel: 'Send My Info',
          fields: [
            { id: 'name', type: 'text', label: 'Name', required: true },
            { id: 'email', type: 'email', label: 'Email', required: true },
            { id: 'phone', type: 'tel', label: 'Phone', required: true },
            { id: 'budget', type: 'select', label: 'Budget Range', options: ['$1-2M', '$2-3M', '$3-4M', '$4M+'] },
            { id: 'timeline', type: 'select', label: 'Purchase Timeline', options: ['Immediately', '3-6 months', '6-12 months', 'Just exploring'] },
          ],
        },
        style: {},
        order: 8,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: '📞 Sales Gallery: (415) 555-9000',
          url: 'tel:+14155559000',
        },
        style: { variant: 'fill' },
        order: 9,
      },
      {
        id: nanoid(),
        type: 'footer',
        content: {
          text: 'The Residences at Marina Bay\nSales Gallery: 500 Marina Blvd, San Francisco\nOpen Daily 10AM - 6PM',
          showPoweredBy: false,
        },
        style: {},
        order: 10,
      },
    ],
    theme: {
      background: {
        type: 'gradient',
        gradientFrom: '#0f172a',
        gradientTo: '#1e3a5f',
        gradientDirection: 'to-br',
      },
      typography: {
        titleFont: 'inter',
        bodyFont: 'inter',
        titleColor: '#ffffff',
        bodyColor: '#94a3b8',
      },
      button: {
        backgroundColor: '#0ea5e9',
        textColor: '#ffffff',
        borderRadius: 'lg',
        style: 'solid',
        hoverEffect: 'glow',
      },
      branding: {
        primaryColor: '#0ea5e9',
        secondaryColor: '#38bdf8',
        accentColor: '#f0f9ff',
      },
    },
  },
];

// ============================================
// 🛍️ SHOP TEMPLATES
// ============================================

export const SHOP_TEMPLATES: IndustryTemplate[] = [
  {
    id: 'shop-fashion',
    name: 'Fashion Boutique',
    description: 'Stylish e-commerce for clothing and accessories',
    category: 'shop',
    gradient: 'from-indigo-500 via-blue-500 to-cyan-500',
    tags: ['fashion', 'boutique', 'clothing', 'ecommerce'],
    blocks: [
      {
        id: nanoid(),
        type: 'profile',
        content: {
          displayName: 'NOVA',
          bio: '✨ Sustainable Fashion | Made in LA\nFree shipping on orders $75+',
        },
        style: {
          avatarSize: 80,
          textAlign: 'center',
        },
        order: 0,
      },
      {
        id: nanoid(),
        type: 'hero',
        content: {
          headline: 'New Season, New Style',
          subheadline: 'Spring Collection Now Live',
          backgroundImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200',
          overlayOpacity: 0.4,
          buttonText: 'Shop Now',
          buttonUrl: '#',
          height: 'medium',
        },
        style: {},
        order: 1,
      },
      {
        id: nanoid(),
        type: 'deals',
        content: {
          style: 'banner',
          deals: [
            { title: 'Spring Sale', description: 'Up to 40% off select styles', discountPercent: 40, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() },
          ],
        },
        style: {},
        order: 2,
      },
      {
        id: nanoid(),
        type: 'shop',
        content: {
          style: 'grid',
          title: 'Featured Products',
          products: [
            { id: nanoid(), name: 'Linen Wrap Dress', price: 128, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', category: 'Dresses', description: 'Elegant wrap dress in breathable linen' },
            { id: nanoid(), name: 'Oversized Blazer', price: 185, originalPrice: 245, image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400', category: 'Outerwear', badge: 'Sale', description: 'Classic tailored blazer with modern fit' },
            { id: nanoid(), name: 'Silk Cami Top', price: 78, image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400', category: 'Tops', description: 'Luxurious silk camisole' },
            { id: nanoid(), name: 'High-Rise Jeans', price: 145, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400', category: 'Bottoms', description: 'Flattering high-waisted denim' },
            { id: nanoid(), name: 'Leather Crossbody', price: 95, image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400', category: 'Accessories', badge: 'New', description: 'Compact genuine leather bag' },
            { id: nanoid(), name: 'Cashmere Sweater', price: 210, image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400', category: 'Sweaters', description: 'Ultra-soft 100% cashmere' },
            { id: nanoid(), name: 'Ankle Boots', price: 165, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400', category: 'Shoes', description: 'Versatile leather ankle boots' },
            { id: nanoid(), name: 'Wide-Leg Trousers', price: 118, originalPrice: 158, image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400', category: 'Bottoms', badge: 'Sale', description: 'Flowy palazzo pants' },
          ],
          showPrices: true,
          currency: 'USD',
          enableCart: true,
        },
        style: {},
        order: 3,
      },
      {
        id: nanoid(),
        type: 'features',
        content: {
          features: [
            { title: 'Free Shipping', description: 'On orders over $75', icon: 'truck' },
            { title: 'Easy Returns', description: '30-day return policy', icon: 'refresh' },
            { title: 'Sustainable', description: 'Eco-friendly materials', icon: 'leaf' },
          ],
          style: 'minimal',
        },
        style: {},
        order: 4,
      },
      {
        id: nanoid(),
        type: 'social',
        content: {
          links: {
            instagram: 'shopnova',
            tiktok: '@shopnova',
            pinterest: 'shopnova',
          },
        },
        style: {
          iconSize: 40,
          style: 'filled',
        },
        order: 5,
      },
    ],
    theme: {
      background: {
        type: 'solid',
        color: '#ffffff',
      },
      typography: {
        titleFont: 'montserrat',
        bodyFont: 'inter',
        titleColor: '#111111',
        bodyColor: '#666666',
      },
      button: {
        backgroundColor: '#111111',
        textColor: '#ffffff',
        borderRadius: 'none',
        variant: 'fill',
      },
      branding: {
        primaryColor: '#111111',
      },
    },
  },
];

// ============================================
// 💇 SALON TEMPLATES
// ============================================

export const SALON_TEMPLATES: IndustryTemplate[] = [
  {
    id: 'salon-hair',
    name: 'Hair Salon',
    description: 'Modern salon with online booking',
    category: 'salon',
    gradient: 'from-pink-500 via-rose-500 to-red-500',
    tags: ['salon', 'hair', 'beauty', 'spa'],
    blocks: [
      {
        id: nanoid(),
        type: 'profile',
        content: {
          displayName: 'Luxe Hair Studio',
          bio: '💇‍♀️ Premium Hair Services\n📍 Chelsea, NYC\n⭐ 4.9 Rating (500+ reviews)',
          avatarUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200',
        },
        style: {
          avatarSize: 90,
          textAlign: 'center',
        },
        order: 0,
      },
      {
        id: nanoid(),
        type: 'gallery',
        content: {
          images: [
            { url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400', alt: 'Hair styling' },
            { url: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400', alt: 'Color treatment' },
            { url: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=400', alt: 'Salon interior' },
          ],
          layout: 'carousel',
        },
        style: {},
        order: 1,
      },
      {
        id: nanoid(),
        type: 'pricing',
        content: {
          style: 'modern',
          title: 'Our Services',
          tiers: [
            {
              name: 'Haircut & Style',
              price: 75,
              description: 'Includes wash, cut, and blowout',
              features: ['Consultation', 'Precision cut', 'Styling', 'Product recommendations'],
              buttonText: 'Book Now',
            },
            {
              name: 'Color Services',
              price: 150,
              description: 'Full color or highlights',
              features: ['Color consultation', 'Application', 'Processing', 'Toner & gloss', 'Style finish'],
              highlighted: true,
              badge: 'Popular',
              buttonText: 'Book Now',
            },
            {
              name: 'Luxury Treatment',
              price: 200,
              description: 'The complete experience',
              features: ['Deep conditioning', 'Scalp massage', 'Cut & color', 'Style finish', 'Take-home products'],
              buttonText: 'Book Now',
            },
          ],
          enableToggle: false,
        },
        style: {},
        order: 2,
      },
      {
        id: nanoid(),
        type: 'schedule',
        content: {
          title: 'Book Your Appointment',
          subtitle: 'Select a service and time',
          style: 'list',
        },
        style: {},
        order: 3,
      },
      {
        id: nanoid(),
        type: 'testimonial',
        content: {
          quotes: [
            { quote: 'Best salon in NYC! My hair has never looked better.', author: 'Jessica M.', rating: 5 },
            { quote: 'Amazing colorist. They really listen to what you want.', author: 'Amanda K.', rating: 5 },
          ],
          style: 'cards',
        },
        style: {},
        order: 4,
      },
      {
        id: nanoid(),
        type: 'map',
        content: {
          address: '234 W 23rd St, New York, NY',
          title: 'Visit Our Studio',
        },
        style: {},
        order: 5,
      },
      {
        id: nanoid(),
        type: 'social',
        content: {
          links: {
            instagram: 'luxehairstudio',
            yelp: 'luxe-hair-studio-nyc',
          },
        },
        style: {
          iconSize: 40,
          style: 'filled',
        },
        order: 6,
      },
    ],
    theme: {
      background: {
        type: 'solid',
        color: '#fdf6f3',
      },
      typography: {
        titleFont: 'playfair',
        bodyFont: 'inter',
        titleColor: '#2d2a26',
        bodyColor: '#6b6560',
      },
      button: {
        backgroundColor: '#c9a87c',
        textColor: '#ffffff',
        borderRadius: 'md',
        variant: 'fill',
      },
      branding: {
        primaryColor: '#c9a87c',
      },
    },
  },
];

// ============================================
// 🏋️ FITNESS TEMPLATES
// ============================================

export const FITNESS_TEMPLATES: IndustryTemplate[] = [
  {
    id: 'fitness-trainer',
    name: 'Personal Trainer',
    description: 'Fitness coach with programs and booking',
    category: 'fitness',
    gradient: 'from-green-500 via-emerald-600 to-teal-600',
    tags: ['fitness', 'trainer', 'gym', 'workout', 'coach'],
    blocks: [
      {
        id: nanoid(),
        type: 'profile',
        content: {
          displayName: 'Coach Marcus',
          bio: '💪 Certified Personal Trainer\n🏆 10+ Years Experience\n📍 Online & In-Person Training',
          avatarUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200',
        },
        style: {
          avatarSize: 100,
          textAlign: 'center',
        },
        order: 0,
      },
      {
        id: nanoid(),
        type: 'stats',
        content: {
          stats: [
            { value: '500+', label: 'Clients Trained' },
            { value: '10K+', label: 'Sessions' },
            { value: '98%', label: 'Success Rate' },
          ],
          style: 'minimal',
        },
        style: {},
        order: 1,
      },
      {
        id: nanoid(),
        type: 'hero',
        content: {
          headline: 'Transform Your Body',
          subheadline: 'Custom programs for real results',
          backgroundImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200',
          overlayOpacity: 0.6,
          buttonText: 'Start Your Journey',
          buttonUrl: '#',
          height: 'medium',
        },
        style: {},
        order: 2,
      },
      {
        id: nanoid(),
        type: 'pricing',
        content: {
          style: 'modern',
          title: 'Training Programs',
          tiers: [
            {
              name: 'Starter',
              monthlyPrice: 99,
              description: 'Perfect for beginners',
              features: ['Custom workout plan', 'Weekly check-ins', 'Nutrition guide', 'App access'],
              buttonText: 'Get Started',
            },
            {
              name: 'Premium',
              monthlyPrice: 199,
              description: 'Most popular choice',
              features: ['Everything in Starter', '1-on-1 video calls', 'Daily accountability', 'Priority support', 'Progress tracking'],
              highlighted: true,
              badge: 'Best Value',
              buttonText: 'Join Now',
            },
            {
              name: 'Elite',
              monthlyPrice: 399,
              description: 'Maximum transformation',
              features: ['Everything in Premium', 'In-person sessions', 'Meal prep guidance', '24/7 messaging', 'Competition prep'],
              buttonText: 'Apply Now',
            },
          ],
          enableToggle: false,
        },
        style: {},
        order: 3,
      },
      {
        id: nanoid(),
        type: 'testimonial',
        content: {
          quotes: [
            { quote: 'Lost 30lbs in 3 months. Marcus is the real deal!', author: 'Mike T.', role: 'Lost 30lbs' },
            { quote: 'Finally achieved my fitness goals after years of trying.', author: 'Sarah L.', role: 'Transformation Client' },
          ],
          style: 'cards',
        },
        style: {},
        order: 4,
      },
      {
        id: nanoid(),
        type: 'schedule',
        content: {
          title: 'Book a Free Consultation',
          subtitle: '15-minute intro call',
          style: 'minimal',
        },
        style: {},
        order: 5,
      },
      {
        id: nanoid(),
        type: 'social',
        content: {
          links: {
            instagram: 'coachmarcus',
            youtube: 'CoachMarcusFitness',
            tiktok: '@coachmarcus',
          },
        },
        style: {
          iconSize: 44,
          style: 'filled',
        },
        order: 6,
      },
    ],
    theme: {
      background: {
        type: 'solid',
        color: '#0f0f0f',
      },
      typography: {
        titleFont: 'montserrat',
        bodyFont: 'inter',
        titleColor: '#ffffff',
        bodyColor: '#a0a0a0',
      },
      button: {
        backgroundColor: '#ef4444',
        textColor: '#ffffff',
        borderRadius: 'md',
        variant: 'fill',
      },
      branding: {
        primaryColor: '#ef4444',
      },
    },
  },
];

// ============================================
// 💼 PROFESSIONAL TEMPLATES
// ============================================

export const PROFESSIONAL_TEMPLATES: IndustryTemplate[] = [
  // 1. BUSINESS CONSULTANT
  {
    id: 'professional-consultant',
    name: 'Business Consultant',
    description: 'Professional consultant profile with services and booking',
    category: 'professional',
    gradient: 'from-slate-700 via-slate-800 to-zinc-900',
    tags: ['consultant', 'business', 'strategy', 'advisor', 'coaching'],
    blocks: [
      {
        id: nanoid(),
        type: 'profile',
        content: {
          displayName: 'Marcus Chen',
          bio: '📈 Business Growth Strategist\n Former McKinsey Senior Consultant • Harvard MBA\n💼 Helping entrepreneurs scale from 6 to 7 figures',
          avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
        },
        style: {
          avatarSize: 120,
          textAlign: 'center',
        },
        order: 0,
      },
      {
        id: nanoid(),
        type: 'stats',
        content: {
          stats: [
            { value: '200+', label: 'Clients Served' },
            { value: '$50M+', label: 'Revenue Generated' },
            { value: '15', label: 'Years Experience' },
            { value: '4.9★', label: 'Client Rating' },
          ],
          style: 'cards',
        },
        style: {},
        order: 1,
      },
      {
        id: nanoid(),
        type: 'text',
        content: {
          html: '<div style="background: linear-gradient(135deg, #f4f4f5 0%, #e4e4e7 100%); padding: 2rem; border-radius: 12px; border-left: 4px solid #18181b; margin: 2rem 0;"><p style="font-style: italic; font-size: 1.125rem; line-height: 1.75; margin: 0; color: #18181b;">"Most businesses fail not from lack of effort, but from lack of strategy. With the right roadmap, scaling becomes inevitable—not accidental."</p><p style="margin-top: 1rem; font-weight: 600; color: #3f3f46;">— Marcus Chen</p></div>',
        },
        style: {},
        order: 2,
      },
      {
        id: nanoid(),
        type: 'heading',
        content: {
          text: 'How I Help You Grow',
          level: 2,
        },
        style: { textAlign: 'center' },
        order: 3,
      },
      {
        id: nanoid(),
        type: 'features',
        content: {
          features: [
            { icon: '🎯', title: 'Strategic Planning', description: 'Define vision, identify growth levers, build 12-month roadmap' },
            { icon: '📊', title: 'Revenue Optimization', description: 'Pricing strategy, customer segmentation, conversion optimization' },
            { icon: '⚙️', title: 'Operations & Systems', description: 'Streamline workflows, eliminate bottlenecks, scale processes' },
            { icon: '👥', title: 'Team & Leadership', description: 'Hire right people, delegate effectively, build high-performing teams' },
          ],
          style: 'cards',
          layout: 'grid',
        },
        style: {},
        order: 4,
      },
      {
        id: nanoid(),
        type: 'heading',
        content: {
          text: 'Client Success Stories',
          level: 2,
        },
        style: { textAlign: 'center' },
        order: 5,
      },
      {
        id: nanoid(),
        type: 'testimonial',
        content: {
          quotes: [
            { quote: 'Marcus helped us 3x our revenue in 18 months—from $800K to $2.4M ARR. His strategic frameworks completely transformed how we think about growth.', author: 'Sarah Kim', role: 'CEO, TechStart Inc.', rating: 5 },
            { quote: 'The best investment I made in my business. His pricing strategy alone increased our margins by 40%. Clear, actionable advice that works.', author: 'David Miller', role: 'Founder, GrowthLab', rating: 5 },
          ],
          style: 'cards',
        },
        style: {},
        order: 6,
      },
      {
        id: nanoid(),
        type: 'heading',
        content: {
          text: 'Consulting Packages',
          level: 2,
        },
        style: { textAlign: 'center' },
        order: 7,
      },
      {
        id: nanoid(),
        type: 'pricing',
        content: {
          tiers: [
            {
              name: 'Strategy Session',
              price: '500',
              interval: 'one-time',
              description: 'Perfect for quick wins',
              features: ['90-minute deep dive', 'Business model audit', 'Prioritized action plan', 'Session recording'],
              buttonText: 'Book Now',
              buttonUrl: '#schedule',
            },
            {
              name: 'Growth Program',
              price: '2,500',
              interval: 'per month',
              description: '3-month minimum',
              features: ['Weekly 1:1 strategy calls', 'Direct Slack access', 'Custom growth frameworks', 'Unlimited email support'],
              highlighted: true,
              badge: 'Most Popular',
              buttonText: 'Apply Now',
              buttonUrl: '#contact',
            },
          ],
          style: 'modern',
        },
        style: {},
        order: 8,
      },
      {
        id: nanoid(),
        type: 'schedule',
        content: {
          title: 'Book Your Free Discovery Call',
          subtitle: 'No pressure, no sales pitch—just honest advice on whether we\'re a fit',
          style: 'cards',
          services: [
            { id: '1', name: 'Free Discovery Call', duration: 30, price: 0, description: 'Get clarity on your next steps', icon: 'video' },
            { id: '2', name: 'Strategy Session', duration: 90, price: 500, description: 'Deep dive with action plan', icon: 'presentation' },
          ],
        },
        style: {},
        order: 9,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: '📞 Schedule Free Call',
          url: '#schedule',
        },
        style: { variant: 'fill' },
        order: 10,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: '📧 Email Me',
          url: 'mailto:marcus@growthstrategy.com',
        },
        style: { variant: 'outline' },
        order: 11,
      },
      {
        id: nanoid(),
        type: 'social',
        content: {
          platforms: [
            { platform: 'linkedin', url: 'https://linkedin.com/in/marcuschen' },
            { platform: 'twitter', url: 'https://twitter.com/marcuschen' },
            { platform: 'youtube', url: 'https://youtube.com/@marcuschenbiz' },
          ],
        },
        style: { alignment: 'center' },
        order: 12,
      },
      {
        id: nanoid(),
        type: 'footer',
        content: {
          text: '© 2026 Marcus Chen Consulting\nFormer McKinsey & Company • Harvard Business School MBA\n\nResults may vary. Past performance does not guarantee future results.',
          showPoweredBy: false,
        },
        style: {},
        order: 13,
      },
    ],
    theme: {
      background: {
        type: 'gradient',
        gradientFrom: '#fafafa',
        gradientTo: '#f4f4f5',
        gradientVia: '#ffffff',
        gradientDirection: 'to-br',
      },
      typography: {
        titleFont: 'spacegrotesk',
        bodyFont: 'inter',
        titleColor: '#18181b',
        bodyColor: '#52525b',
      },
      button: {
        backgroundColor: '#18181b',
        textColor: '#ffffff',
        borderRadius: 'lg',
        style: 'solid',
        hoverEffect: 'lift',
      },
      branding: {
        primaryColor: '#18181b',
        secondaryColor: '#3f3f46',
        accentColor: '#71717a',
      },
    },
  },

  // 2. LIFE COACH
  {
    id: 'professional-life-coach',
    name: 'Life & Wellness Coach',
    description: 'Empowering coach profile with programs and testimonials',
    category: 'professional',
    gradient: 'from-rose-400 via-fuchsia-500 to-indigo-500',
    tags: ['coach', 'life coach', 'wellness', 'mindset', 'transformation'],
    blocks: [
      {
        id: nanoid(),
        type: 'hero',
        content: {
          headline: 'Transform Your Life',
          subheadline: 'Break through limitations and create the life you deserve',
          backgroundImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200',
          overlayOpacity: 0.5,
          buttonText: 'Start Your Journey',
          buttonUrl: '#programs',
          height: 'large',
        },
        style: {},
        order: 0,
      },
      {
        id: nanoid(),
        type: 'profile',
        content: {
          displayName: 'Dr. Amanda Rivers',
          bio: '✨ Certified Life & Transformation Coach\n🧠 PhD Psychology | ICF Master Certified\n\nHelping high-achievers find balance, purpose, and fulfillment',
          avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
        },
        style: {
          avatarSize: 100,
          textAlign: 'center',
        },
        order: 1,
      },
      {
        id: nanoid(),
        type: 'text',
        content: {
          html: '<p style="text-align: center; font-size: 1.1em;">I believe everyone has unlimited potential within them. My mission is to help you unlock it, overcome the blocks holding you back, and design a life aligned with your deepest values.</p>',
        },
        style: {},
        order: 2,
      },
      {
        id: nanoid(),
        type: 'heading',
        content: {
          text: '🌟 Areas of Focus',
          level: 2,
        },
        style: { textAlign: 'center' },
        order: 3,
      },
      {
        id: nanoid(),
        type: 'features',
        content: {
          features: [
            { icon: '🎯', title: 'Clarity & Purpose', description: 'Discover your true calling and life mission' },
            { icon: '💪', title: 'Confidence Building', description: 'Overcome self-doubt and limiting beliefs' },
            { icon: '⚖️', title: 'Work-Life Balance', description: 'Create harmony between career and personal life' },
            { icon: '❤️', title: 'Relationships', description: 'Build deeper connections with yourself and others' },
            { icon: '🧘', title: 'Stress & Anxiety', description: 'Develop resilience and inner peace' },
            { icon: '🚀', title: 'Goal Achievement', description: 'Turn dreams into actionable plans' },
          ],
          style: 'elegant',
          layout: 'grid',
        },
        style: {},
        order: 4,
      },
      {
        id: nanoid(),
        type: 'testimonial',
        content: {
          quotes: [
            { quote: 'Amanda helped me find myself again. After burnout, I thought I\'d lost everything. Now I\'m thriving.', author: 'Michelle T.', role: 'Executive', rating: 5 },
            { quote: 'Life-changing is an understatement. The clarity I gained has transformed every area of my life.', author: 'James K.', role: 'Entrepreneur', rating: 5 },
          ],
          style: 'cards',
        },
        style: {},
        order: 5,
      },
      {
        id: nanoid(),
        type: 'pricing',
        content: {
          title: 'Coaching Programs',
          tiers: [
            {
              name: 'Breakthrough Session',
              price: '297',
              description: 'Single session',
              features: ['75-minute deep dive', 'Clarity roadmap', 'Action steps', 'Email follow-up'],
              buttonText: 'Book Session',
              buttonUrl: '#schedule',
            },
            {
              name: '12-Week Transformation',
              price: '3,500',
              description: 'Most popular',
              features: ['Weekly 60-min sessions', 'Unlimited messaging', 'Personalized toolkit', 'Progress tracking', 'Bonus: Meditation library'],
              highlighted: true,
              badge: 'Best Value',
              buttonText: 'Apply Now',
              buttonUrl: '#contact',
            },
            {
              name: 'VIP Intensive',
              price: '8,000',
              description: 'Premium',
              features: ['Full day retreat', '6-month support', 'Custom protocols', 'Emergency access', 'Partner session included'],
              buttonText: 'Learn More',
              buttonUrl: '#contact',
            },
          ],
          style: 'modern',
        },
        style: {},
        order: 6,
      },
      {
        id: nanoid(),
        type: 'schedule',
        content: {
          title: 'Free Discovery Call',
          subtitle: 'Let\'s explore how I can support your journey',
          style: 'cards',
          services: [
            { id: '1', name: 'Discovery Call', duration: 30, price: 0, description: 'Free consultation', icon: 'video' },
          ],
        },
        style: {},
        order: 7,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: '🎙️ Listen to My Podcast',
          url: 'https://spotify.com',
        },
        style: { variant: 'outline' },
        order: 8,
      },
      {
        id: nanoid(),
        type: 'social',
        content: {
          links: {
            instagram: 'dramandarivers',
            youtube: 'dramandarivers',
            tiktok: 'dramandarivers',
            linkedin: 'amandarivers',
          },
        },
        style: { iconSize: 44, style: 'filled' },
        order: 9,
      },
    ],
    theme: {
      background: {
        type: 'gradient',
        gradientFrom: '#fdf2f8',
        gradientTo: '#faf5ff',
        gradientDirection: 'to-br',
      },
      typography: {
        titleFont: 'playfair',
        bodyFont: 'inter',
        titleColor: '#1e1b4b',
        bodyColor: '#4c1d95',
      },
      button: {
        backgroundColor: '#7c3aed',
        textColor: '#ffffff',
        borderRadius: 'lg',
        style: 'solid',
        hoverEffect: 'glow',
      },
      branding: {
        primaryColor: '#7c3aed',
        secondaryColor: '#ec4899',
        accentColor: '#f472b6',
      },
    },
  },

  // 3. LAWYER / ATTORNEY
  {
    id: 'professional-lawyer',
    name: 'Attorney at Law',
    description: 'Professional law firm profile with practice areas and consultations',
    category: 'professional',
    gradient: 'from-amber-600 via-yellow-700 to-amber-800',
    tags: ['lawyer', 'attorney', 'law firm', 'legal', 'counsel'],
    blocks: [
      {
        id: nanoid(),
        type: 'profile',
        content: {
          displayName: 'Richardson & Associates',
          bio: '⚖️ Trusted Legal Counsel Since 1985\n🏆 AV-Rated by Martindale-Hubbell\n📍 New York • Los Angeles • Chicago\n\nProtecting your rights with integrity, expertise, and proven results',
          avatarUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400',
        },
        style: {
          avatarSize: 100,
          textAlign: 'center',
        },
        order: 0,
      },
      {
        id: nanoid(),
        type: 'stats',
        content: {
          stats: [
            { value: '40+', label: 'Years Experience' },
            { value: '5,000+', label: 'Cases Won' },
            { value: '$500M+', label: 'Recovered' },
            { value: '98%', label: 'Success Rate' },
          ],
          style: 'minimal',
        },
        style: {},
        order: 1,
      },
      {
        id: nanoid(),
        type: 'text',
        content: {
          html: '<div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 2rem; border-radius: 12px; border-left: 4px solid #d97706; margin: 2rem 0;"><p style="font-style: italic; font-size: 1.125rem; line-height: 1.75; margin: 0; color: #78350f;">"Justice delayed is justice denied. We fight tirelessly to ensure every client receives the representation they deserve."</p><p style="margin-top: 1rem; font-weight: 600; color: #92400e;">— Michael Richardson, Senior Partner</p></div>',
        },
        style: {},
        order: 2,
      },
      {
        id: nanoid(),
        type: 'features',
        content: {
          features: [
            { icon: '⚖️', title: 'Board Certified', description: 'Recognized specialists in our practice areas' },
            { icon: '🏆', title: 'AV-Rated Firm', description: 'Highest peer review rating for ethics & skill' },
            { icon: '💯', title: 'No Win, No Fee', description: 'Personal injury cases on contingency basis' },
            { icon: '🕐', title: '24/7 Availability', description: 'Emergency legal support when you need it' },
          ],
          style: 'cards',
          layout: 'grid',
        },
        style: {},
        order: 3,
      },
      {
        id: nanoid(),
        type: 'features',
        content: {
          features: [
            { icon: '⚖️', title: 'Personal Injury', description: 'Car accidents, medical malpractice, wrongful death. Maximum compensation.' },
            { icon: '🏛️', title: 'Criminal Defense', description: 'DUI/DWI, drug charges, assault. Protecting your freedom and reputation.' },
            { icon: '👨‍👩‍👧‍👦', title: 'Family Law', description: 'Divorce, custody, support. Compassionate guidance through difficult times.' },
            { icon: '🏢', title: 'Business Law', description: 'Contracts, mergers, disputes. Strategic counsel for businesses.' },
          ],
          style: 'cards',
          layout: 'grid',
        },
        style: {},
        order: 4,
      },
      {
        id: nanoid(),
        type: 'testimonial',
        content: {
          quotes: [
            { quote: 'After a devastating car accident, Richardson & Associates secured a $2.3M settlement. They fought for me every step of the way.', author: 'Robert M.', role: 'Personal Injury Client', rating: 5 },
            { quote: 'Facing felony charges was terrifying, but they got the charges reduced to a misdemeanor. I kept my job and my freedom.', author: 'James T.', role: 'Criminal Defense Client', rating: 5 },
          ],
          style: 'cards',
        },
        style: {},
        order: 5,
      },
      {
        id: nanoid(),
        type: 'schedule',
        content: {
          title: 'Free Case Evaluation',
          subtitle: 'Confidential review with no obligation. Available 24/7 for emergencies.',
          style: 'cards',
          services: [
            { id: '1', name: 'Phone Consultation', duration: 30, price: 0, description: 'Quick case assessment by phone', icon: 'phone' },
            { id: '2', name: 'In-Person Meeting', duration: 60, price: 0, description: 'Detailed strategy session at our office', icon: 'location' },
            { id: '3', name: 'Video Conference', duration: 45, price: 0, description: 'Secure virtual consultation', icon: 'video' },
          ],
        },
        style: {},
        order: 6,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: '📞 Call 24/7: (800) 555-LAW1',
          url: 'tel:+18005555291',
        },
        style: { variant: 'fill' },
        order: 7,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: '📧 Free Case Review',
          url: 'mailto:contact@richardsonlaw.com',
        },
        style: { variant: 'fill' },
        order: 8,
      },
      {
        id: nanoid(),
        type: 'social',
        content: {
          platforms: [
            { platform: 'linkedin', url: 'https://linkedin.com/company/richardsonlaw' },
            { platform: 'facebook', url: 'https://facebook.com/richardsonlawfirm' },
            { platform: 'twitter', url: 'https://twitter.com/richardsonlaw' },
          ],
        },
        style: { alignment: 'center' },
        order: 9,
      },
      {
        id: nanoid(),
        type: 'footer',
        content: {
          text: 'Richardson & Associates, LLP\nLicensed in New York, California, and Illinois\n\nAttorney Advertising. Prior results do not guarantee a similar outcome.',
          showPoweredBy: false,
        },
        style: {},
        order: 10,
      },
    ],
    theme: {
      background: {
        type: 'gradient',
        gradientFrom: '#fffbeb',
        gradientTo: '#fde68a',
        gradientVia: '#fef3c7',
        gradientDirection: 'to-br',
      },
      typography: {
        titleFont: 'playfair',
        bodyFont: 'inter',
        titleColor: '#78350f',
        bodyColor: '#92400e',
      },
      button: {
        backgroundColor: '#92400e',
        textColor: '#ffffff',
        borderRadius: 'md',
        style: 'solid',
        hoverEffect: 'lift',
      },
      branding: {
        primaryColor: '#92400e',
        secondaryColor: '#b45309',
        accentColor: '#d97706',
      },
    },
  },
  // 4. FINANCIAL ADVISOR
  {
    id: 'professional-financial-advisor',
    name: 'Financial Advisor',
    description: 'Wealth management professional with services and credentials',
    category: 'professional',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
    tags: ['finance', 'wealth', 'investment', 'advisor', 'retirement'],
    blocks: [
      {
        id: nanoid(),
        type: 'profile',
        content: {
          displayName: 'Jonathan Blake, CFP®',
          bio: '💰 Certified Financial Planner | Fiduciary Advisor\n📊 Wealth Management & Retirement Specialist',
          avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
        },
        style: {
          avatarSize: 110,
          textAlign: 'center',
        },
        order: 0,
      },
      {
        id: nanoid(),
        type: 'hero',
        content: {
          headline: 'Build Wealth with Confidence',
          subheadline: 'Fee-only fiduciary financial planning for families who want to retire with peace of mind. 20+ years helping clients achieve their financial dreams.',
          backgroundImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200',
          overlayOpacity: 0.7,
          height: 'medium',
        },
        style: {},
        order: 1,
      },
      {
        id: nanoid(),
        type: 'stats',
        content: {
          stats: [
            { value: '$150M+', label: 'Assets Under Management' },
            { value: '500+', label: 'Families Served' },
            { value: '20', label: 'Years Experience' },
            { value: '4.9★', label: 'Client Rating' },
          ],
          style: 'cards',
        },
        style: {},
        order: 2,
      },
      {
        id: nanoid(),
        type: 'features',
        content: {
          features: [
            { title: 'Fiduciary Standard', description: 'Always acting in your best interest', icon: 'shield-check' },
            { title: 'Fee-Only', description: 'No commissions, no conflicts', icon: 'dollar-sign' },
            { title: 'Personalized Plans', description: 'Customized to your unique goals', icon: 'target' },
            { title: 'Ongoing Support', description: 'Quarterly reviews & adjustments', icon: 'users' },
          ],
          style: 'grid',
        },
        style: {},
        order: 3,
      },
      {
        id: nanoid(),
        type: 'heading',
        content: {
          text: '💼 Comprehensive Financial Services',
          level: 2,
        },
        style: { textAlign: 'center' },
        order: 4,
      },
      {
        id: nanoid(),
        type: 'features',
        content: {
          features: [
            { title: 'Investment Management', description: 'Tax-efficient portfolios tailored to your risk tolerance and timeline', icon: 'trending-up' },
            { title: 'Retirement Planning', description: '401(k) optimization, IRA strategies, Social Security maximization', icon: 'calendar' },
            { title: 'Estate Planning', description: 'Protect and transfer wealth to future generations efficiently', icon: 'home' },
            { title: 'Tax Strategy', description: 'Minimize tax burden through strategic planning and timing', icon: 'file-text' },
            { title: 'Education Funding', description: '529 plans, Coverdell ESAs, and scholarship strategies', icon: 'graduation-cap' },
            { title: 'Risk Management', description: 'Life insurance, disability, and long-term care analysis', icon: 'shield' },
          ],
          style: 'elegant',
          layout: 'grid',
        },
        style: {},
        order: 5,
      },
      {
        id: nanoid(),
        type: 'text',
        content: {
          html: '<div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); padding: 2rem; border-radius: 16px; border: 2px solid #10b981; margin: 1rem 0;"><p style="margin: 0 0 1rem 0; font-size: 1.1rem; font-style: italic; color: #065f46;">"My philosophy is simple: understand your goals deeply, create a comprehensive plan that fits your life, and adapt as circumstances evolve. Your financial success is my mission."</p><p style="margin: 0; font-weight: 700; color: #047857; font-size: 1rem;">— Jonathan Blake, CFP®</p></div>',
        },
        style: {},
        order: 6,
      },
      {
        id: nanoid(),
        type: 'testimonial',
        content: {
          quotes: [
            { quote: 'Jonathan helped us retire 5 years early with complete confidence and financial security. His comprehensive planning literally changed our lives.', author: 'The Martinez Family', role: 'Clients since 2015', rating: 5 },
            { quote: 'Finally, an advisor who truly listens and explains complex concepts clearly. No jargon, just actionable strategies and measurable results.', author: 'Dr. Patricia Chen', role: 'Client since 2018', rating: 5 },
            { quote: 'Best decision we ever made. Jonathan\'s proactive approach and fee-only structure gives us total peace of mind.', author: 'Robert & Susan K.', role: 'Clients since 2017', rating: 5 },
          ],
          style: 'carousel',
        },
        style: {},
        order: 7,
      },
      {
        id: nanoid(),
        type: 'pricing',
        content: {
          title: 'Transparent Pricing',
          subtitle: 'Fee-only, no commissions or hidden costs',
          plans: [
            {
              id: '1',
              name: 'Financial Planning',
              description: 'One-time comprehensive plan',
              price: 2500,
              interval: 'one-time',
              features: [
                'Complete financial analysis',
                'Personalized written plan',
                'Investment recommendations',
                'Tax strategy review',
                '90-day implementation support',
              ],
              highlighted: false,
            },
            {
              id: '2',
              name: 'Wealth Management',
              description: 'Ongoing portfolio management',
              price: 1.0,
              interval: 'AUM/year',
              features: [
                'Everything in Financial Planning',
                'Ongoing investment management',
                'Quarterly portfolio reviews',
                'Tax-loss harvesting',
                'Unlimited consultations',
                'Annual plan updates',
              ],
              highlighted: true,
              badge: 'Most Popular',
            },
            {
              id: '3',
              name: 'Hourly Consultation',
              description: 'For specific questions',
              price: 350,
              interval: 'per hour',
              features: [
                'Flexible scheduling',
                'Second opinion reviews',
                'Project-based work',
                'No minimum commitment',
              ],
              highlighted: false,
            },
          ],
        },
        style: {},
        order: 8,
      },
      {
        id: nanoid(),
        type: 'heading',
        content: {
          text: '📅 Schedule Your Free Consultation',
          level: 2,
        },
        style: { textAlign: 'center' },
        order: 9,
      },
      {
        id: nanoid(),
        type: 'schedule',
        content: {
          title: '',
          subtitle: 'No obligation 60-minute discovery meeting',
          style: 'cards',
          services: [
            { id: '1', name: 'Initial Discovery Call', duration: 60, price: 0, description: 'Review your goals and current situation', icon: 'video' },
            { id: '2', name: 'Portfolio Analysis', duration: 45, price: 0, description: 'Free investment review & recommendations', icon: 'chart' },
            { id: '3', name: 'Retirement Checkup', duration: 45, price: 0, description: 'Assess your retirement readiness', icon: 'calendar' },
          ],
        },
        style: {},
        order: 10,
      },
      {
        id: nanoid(),
        type: 'deals',
        content: {
          style: 'banner',
          deals: [
            { 
              title: 'New Client Offer', 
              description: 'First financial plan includes free portfolio review ($500 value)', 
              expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            },
          ],
        },
        style: {},
        order: 11,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: '📞 Call: (555) 123-WEALTH',
          url: 'tel:+15551239325',
        },
        style: { variant: 'fill' },
        order: 12,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: '📧 Email for Private Consultation',
          url: 'mailto:jonathan@blakewealth.com',
        },
        style: { variant: 'outline' },
        order: 13,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: '📄 Download Free Retirement Guide',
          url: '#',
        },
        style: { variant: 'soft' },
        order: 14,
      },
      {
        id: nanoid(),
        type: 'social',
        content: {
          links: {
            linkedin: 'jonathanblakecfp',
            youtube: 'blakewealthtv',
          },
        },
        style: { iconSize: 48, style: 'filled' },
        order: 15,
      },
      {
        id: nanoid(),
        type: 'footer',
        content: {
          text: '© 2025 Blake Wealth Management | Jonathan Blake, CFP®, ChFC®\nSecurities offered through ABC Securities, Member FINRA/SIPC\nAdvisory services through Blake Wealth Management, a Registered Investment Advisor',
          showPoweredBy: false,
        },
        style: {},
        order: 16,
      },
    ],
    theme: {
      background: {
        type: 'gradient',
        gradientFrom: '#f0fdf4',
        gradientTo: '#ecfdf5',
        gradientVia: '#d1fae5',
        gradientDirection: 'to-br',
      },
      typography: {
        titleFont: 'inter',
        bodyFont: 'inter',
        titleColor: '#064e3b',
        bodyColor: '#065f46',
      },
      button: {
        backgroundColor: '#059669',
        textColor: '#ffffff',
        borderRadius: 'lg',
        variant: 'fill',
        shadow: 'md',
      },
      branding: {
        primaryColor: '#059669',
        secondaryColor: '#10b981',
        accentColor: '#34d399',
      },
    },
  },

  // 5. FREELANCER / CREATIVE PROFESSIONAL
  {
    id: 'professional-freelancer',
    name: 'Creative Freelancer',
    description: 'Modern freelancer portfolio with services and contact',
    category: 'professional',
    gradient: 'from-violet-500 via-purple-600 to-indigo-700',
    tags: ['freelancer', 'designer', 'developer', 'creative', 'portfolio'],
    blocks: [
      {
        id: nanoid(),
        type: 'profile',
        content: {
          displayName: 'Alex Rivera',
          bio: '🎨 Brand Designer & Creative Director\n💻 UI/UX • Branding • Web Design',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        },
        style: {
          avatarSize: 110,
          textAlign: 'center',
        },
        order: 0,
      },
      {
        id: nanoid(),
        type: 'hero',
        content: {
          headline: 'Crafting Visual Stories That Convert',
          subheadline: 'Award-winning designer specializing in bold brand identities and intuitive digital experiences. Let\'s bring your vision to life.',
          backgroundImage: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200',
          overlayOpacity: 0.65,
          height: 'medium',
        },
        style: {},
        order: 1,
      },
      {
        id: nanoid(),
        type: 'stats',
        content: {
          stats: [
            { value: '150+', label: 'Projects Completed' },
            { value: '50+', label: 'Happy Clients' },
            { value: '8', label: 'Years Experience' },
            { value: '98%', label: 'Client Satisfaction' },
          ],
          style: 'minimal',
        },
        style: {},
        order: 2,
      },
      {
        id: nanoid(),
        type: 'heading',
        content: {
          text: '🎨 Featured Work',
          level: 2,
        },
        style: { textAlign: 'center' },
        order: 3,
      },
      {
        id: nanoid(),
        type: 'gallery',
        content: {
          images: [
            { url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600', caption: 'TechFlow - Complete Brand Identity & Website' },
            { url: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600', caption: 'Artisan Coffee - E-commerce Website Design' },
            { url: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600', caption: 'FitTrack - Mobile App UI/UX Design' },
            { url: 'https://images.unsplash.com/photo-1523726491678-bf852e717f6a?w=600', caption: 'Bloom Beauty - Packaging & Print Design' },
            { url: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600', caption: 'Urban Threads - Fashion Brand Identity' },
            { url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600', caption: 'Digital Dashboard - SaaS Product Design' },
          ],
          layout: 'masonry',
          columns: 2,
          showCaptions: true,
        },
        style: {},
        order: 4,
      },
      {
        id: nanoid(),
        type: 'features',
        content: {
          features: [
            { title: 'Brand Strategy First', description: 'Every design starts with understanding your audience and goals', icon: 'target' },
            { title: 'Fast Turnaround', description: 'Most projects delivered within 2-4 weeks', icon: 'zap' },
            { title: 'Unlimited Revisions', description: 'We refine until you\'re 100% satisfied', icon: 'refresh-cw' },
            { title: 'Ongoing Support', description: '30 days of post-launch support included', icon: 'shield-check' },
          ],
          style: 'grid',
        },
        style: {},
        order: 5,
      },
      {
        id: nanoid(),
        type: 'heading',
        content: {
          text: '💼 Services & Pricing',
          level: 2,
        },
        style: { textAlign: 'center' },
        order: 6,
      },
      {
        id: nanoid(),
        type: 'pricing',
        content: {
          title: '',
          subtitle: 'Transparent, project-based pricing',
          plans: [
            {
              id: '1',
              name: 'Logo & Brand Identity',
              price: 2500,
              interval: 'project',
              description: 'Perfect for startups & rebrand',
              features: [
                'Custom logo design (3 concepts)',
                'Color palette & typography',
                'Brand style guide PDF',
                'Social media templates',
                'Unlimited revisions',
                'All source files included',
              ],
              highlighted: false,
            },
            {
              id: '2',
              name: 'Website Design',
              price: 5000,
              interval: 'project',
              description: 'Most popular package',
              features: [
                'Custom responsive design',
                'Up to 10 pages/sections',
                'Mobile & tablet optimized',
                'SEO-friendly structure',
                'CMS integration (Webflow/WordPress)',
                'Content migration support',
                '2 weeks of post-launch support',
              ],
              highlighted: true,
              badge: 'Popular',
            },
            {
              id: '3',
              name: 'Complete Brand Package',
              price: 12000,
              interval: 'project',
              description: 'Full brand transformation',
              features: [
                'Everything in Brand Identity',
                'Everything in Website Design',
                'Social media strategy & templates',
                'Print collateral design',
                'Email templates',
                'Brand messaging framework',
                'Priority support for 60 days',
              ],
              highlighted: false,
            },
          ],
        },
        style: {},
        order: 7,
      },
      {
        id: nanoid(),
        type: 'testimonial',
        content: {
          quotes: [
            { quote: 'Alex transformed our entire brand identity. The new website tripled our conversion rate in just 2 months. Absolutely worth every penny!', author: 'Emma Chen', role: 'CEO, TechFlow', rating: 5 },
            { quote: 'Working with Alex was seamless. Creative, professional, responsive, and the designs were stunning. Our customers love the new look!', author: 'Mark Torres', role: 'Founder, Bloom Beauty', rating: 5 },
            { quote: 'Best designer I\'ve worked with. Alex really took the time to understand our brand and delivered beyond expectations.', author: 'Sarah Kim', role: 'Marketing Director, FitTrack', rating: 5 },
          ],
          style: 'carousel',
        },
        style: {},
        order: 8,
      },
      {
        id: nanoid(),
        type: 'heading',
        content: {
          text: '🚀 My Process',
          level: 2,
        },
        style: { textAlign: 'center' },
        order: 9,
      },
      {
        id: nanoid(),
        type: 'features',
        content: {
          features: [
            { title: '1. Discovery', description: 'Deep dive into your brand, goals, and target audience', icon: 'search' },
            { title: '2. Strategy', description: 'Research competitors and define visual direction', icon: 'compass' },
            { title: '3. Design', description: 'Create initial concepts and gather your feedback', icon: 'palette' },
            { title: '4. Refine', description: 'Iterate until every detail is perfect', icon: 'sliders' },
            { title: '5. Deliver', description: 'Hand off all files with usage guidelines', icon: 'package' },
            { title: '6. Support', description: 'Ongoing assistance for smooth implementation', icon: 'headphones' },
          ],
          style: 'minimal',
          layout: 'grid',
        },
        style: {},
        order: 10,
      },
      {
        id: nanoid(),
        type: 'deals',
        content: {
          style: 'banner',
          deals: [
            { 
              title: 'Limited Availability', 
              description: 'Only taking 2 new clients this month. Book your discovery call today!',
              code: 'BOOK NOW',
            },
          ],
        },
        style: {},
        order: 11,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: '📧 Start Your Project',
          url: 'mailto:hello@alexrivera.design',
        },
        style: { variant: 'fill' },
        order: 12,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: '📅 Schedule Free Consultation',
          url: '#',
        },
        style: { variant: 'outline' },
        order: 13,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: '📁 Download Full Portfolio',
          url: '#portfolio',
        },
        style: { variant: 'soft' },
        order: 14,
      },
      {
        id: nanoid(),
        type: 'social',
        content: {
          links: {
            instagram: 'alexrivera.design',
            dribbble: 'alexrivera',
            behance: 'alexrivera',
            linkedin: 'alexriveradesign',
          },
        },
        style: { iconSize: 48, style: 'filled' },
        order: 15,
      },
      {
        id: nanoid(),
        type: 'footer',
        content: {
          text: '© 2025 Alex Rivera Design Studio | Available for select projects worldwide',
          showPoweredBy: false,
        },
        style: {},
        order: 16,
      },
    ],
    theme: {
      background: {
        type: 'gradient',
        gradientFrom: '#faf5ff',
        gradientTo: '#f3e8ff',
        gradientVia: '#f5f3ff',
        gradientDirection: 'to-br',
      },
      typography: {
        titleFont: 'spacegrotesk',
        bodyFont: 'inter',
        titleColor: '#2e1065',
        bodyColor: '#581c87',
      },
      button: {
        backgroundColor: '#7c3aed',
        textColor: '#ffffff',
        borderRadius: 'lg',
        variant: 'fill',
        shadow: 'lg',
      },
      branding: {
        primaryColor: '#7c3aed',
        secondaryColor: '#a855f7',
        accentColor: '#c084fc',
      },
    },
  },
];

// ============================================
// ALL TEMPLATES COMBINED
// ============================================

export const INDUSTRY_TEMPLATES: IndustryTemplate[] = [
  ...RESTAURANT_TEMPLATES,
  ...ARTIST_TEMPLATES,
  ...REAL_ESTATE_TEMPLATES,
  ...SHOP_TEMPLATES,
  ...SALON_TEMPLATES,
  ...FITNESS_TEMPLATES,
  ...PROFESSIONAL_TEMPLATES,
];

// Get templates by category
export function getTemplatesByCategory(category: IndustryTemplate['category']): IndustryTemplate[] {
  return INDUSTRY_TEMPLATES.filter(t => t.category === category);
}

// Search templates by tags
export function searchTemplates(query: string): IndustryTemplate[] {
  const lowerQuery = query.toLowerCase();
  return INDUSTRY_TEMPLATES.filter(t => 
    t.name.toLowerCase().includes(lowerQuery) ||
    t.description.toLowerCase().includes(lowerQuery) ||
    t.tags.some(tag => tag.includes(lowerQuery))
  );
}
