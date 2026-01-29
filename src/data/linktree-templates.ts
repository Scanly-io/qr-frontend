import { nanoid } from 'nanoid';
import type { Block } from '@/types';

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'Linktree' | 'Business' | 'Personal' | 'Event' | 'E-commerce';
  thumbnail: string;
  blocks: Block[];
  theme?: {
    backgroundColor: string;
    backgroundImage?: string;
    textColor: string;
    buttonColor: string;
  };
}

export const LINKTREE_TEMPLATES: Template[] = [
  // ===== CREATOR PRO - Modern, Vibrant, Instagram-Worthy =====
  {
    id: 'creator-pro-2026',
    name: '✨ Creator Pro',
    description: 'Stunning gradient design perfect for influencers and content creators',
    category: 'Linktree',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=600&fit=crop', // Gradient background
    blocks: [
      {
        id: nanoid(),
        type: 'profile',
        content: {
          displayName: '@yourname',
          bio: '🎨 Content Creator • 🎥 Lifestyle & Travel\n✨ Sharing my journey with 500K+ of you',
          location: '🌍 Based in LA',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
        },
        style: {
          avatarSize: 120,
          textAlign: 'center',
          showLocation: true,
          bioSize: 'large',
        },
        order: 0,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: '🎥 NEW VIDEO: My Morning Routine',
          url: 'https://youtube.com/watch',
          description: '5M views • Posted 2 days ago',
          icon: 'youtube',
        },
        style: {
          variant: 'gradient',
          backgroundColor: '#FF0000',
          gradientFrom: '#FF0000',
          gradientTo: '#CC0000',
          textColor: '#ffffff',
          borderRadius: 'rounded-2xl',
          size: 'large',
          shadow: 'lg',
          hoverEffect: 'lift',
          animation: 'pulse',
        },
        order: 1,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: '🛍️ Shop My Favorites',
          url: 'https://shop.example.com',
          description: 'Curated products I actually use',
          icon: 'shopping-bag',
        },
        style: {
          variant: 'glass',
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          textColor: '#ffffff',
          borderRadius: 'rounded-2xl',
          size: 'large',
          shadow: 'md',
          hoverEffect: 'glow',
        },
        order: 2,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: '📸 Instagram',
          url: 'https://instagram.com/yourname',
          description: '500K followers',
          icon: 'instagram',
        },
        style: {
          variant: 'gradient',
          gradientFrom: '#f09433',
          gradientVia: '#e6683c',
          gradientTo: '#dc2743',
          textColor: '#ffffff',
          borderRadius: 'rounded-2xl',
          size: 'medium',
          shadow: 'md',
          hoverEffect: 'lift',
        },
        order: 3,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: '🎵 TikTok',
          url: 'https://tiktok.com/@yourname',
          description: '2M followers',
          icon: 'tiktok',
        },
        style: {
          variant: 'fill',
          backgroundColor: '#000000',
          textColor: '#00f2ea',
          borderRadius: 'rounded-2xl',
          size: 'medium',
          shadow: 'md',
          hoverEffect: 'lift',
        },
        order: 4,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: '💼 Work With Me',
          url: 'https://example.com/collab',
          description: 'Brand partnerships & sponsorships',
        },
        style: {
          variant: 'outline',
          backgroundColor: 'transparent',
          textColor: '#ffffff',
          borderColor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: 'rounded-2xl',
          size: 'medium',
          hoverEffect: 'fill',
        },
        order: 5,
      },
      {
        id: nanoid(),
        type: 'social',
        content: {
          links: {
            youtube: 'yourchannel',
            instagram: 'yourname',
            tiktok: '@yourname',
            twitter: 'yourname',
            spotify: 'yourname',
          },
        },
        style: {
          iconSize: 48,
          spacing: 'relaxed',
          style: 'filled',
          layout: 'grid',
          iconColor: '#ffffff',
        },
        order: 6,
      },
    ],
    theme: {
      backgroundColor: 'transparent',
      backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      textColor: '#ffffff',
      buttonColor: 'rgba(255, 255, 255, 0.15)',
    },
  },
  {
    id: 'linktree-influencer',
    name: 'Influencer Profile',
    description: 'Bold design for content creators',
    category: 'Linktree',
    thumbnail: '',
    blocks: [
      {
        id: nanoid(),
        type: 'profile',
        content: {
          displayName: '@yourusername',
          bio: '1M+ followers | Brand partnerships | Lifestyle & Fashion',
          location: 'Los Angeles, CA',
        },
        style: {
          avatarSize: 112,
          textAlign: 'center',
        },
        order: 0,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: 'NEW VIDEO 🎥',
          url: 'https://youtube.com/your-latest',
          description: 'My morning routine vlog',
        },
        style: {
          variant: 'shadow',
          backgroundColor: '#ff0000',
          textColor: '#ffffff',
          borderRadius: 'rounded-2xl',
          size: 'large',
        },
        order: 1,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: 'Shop My Amazon Favorites',
          url: 'https://amazon.com/your-storefront',
          description: 'My must-have products',
        },
        style: {
          variant: 'fill',
          backgroundColor: '#ff9900',
          textColor: '#000000',
          borderRadius: 'rounded-2xl',
          size: 'medium',
        },
        order: 2,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: 'Book a Collaboration',
          url: 'https://youremail.com/contact',
          description: 'Brands & partnerships',
        },
        style: {
          variant: 'outline',
          backgroundColor: '#000000',
          textColor: '#ffffff',
          borderRadius: 'rounded-2xl',
          size: 'medium',
        },
        order: 3,
      },
      {
        id: nanoid(),
        type: 'social',
        content: {
          links: {
            instagram: 'yourusername',
            tiktok: '@yourusername',
            youtube: 'yourchannel',
            twitter: 'yourusername',
          },
        },
        style: {
          iconSize: 48,
          spacing: 'loose',
          style: 'filled',
          layout: 'grid',
        },
        order: 4,
      },
    ],
    theme: {
      backgroundColor: '#000000',
      textColor: '#ffffff',
      buttonColor: '#ff0000',
    },
  },
  {
    id: 'linktree-business',
    name: 'Business Professional',
    description: 'Clean and professional layout',
    category: 'Business',
    thumbnail: '',
    blocks: [
      {
        id: nanoid(),
        type: 'profile',
        content: {
          displayName: 'John Smith',
          bio: 'Founder & CEO | Digital Marketing Expert',
          location: 'New York, NY',
          website: 'yourcompany.com',
        },
        style: {
          avatarSize: 96,
          textAlign: 'center',
        },
        order: 0,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: 'Book a Free Consultation',
          url: 'https://calendly.com/yourname',
          icon: 'arrow',
        },
        style: {
          variant: 'fill',
          backgroundColor: '#3b82f6',
          textColor: '#ffffff',
          borderRadius: 'rounded-lg',
          size: 'large',
        },
        order: 1,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: 'Our Services',
          url: 'https://yourcompany.com/services',
          icon: 'arrow',
        },
        style: {
          variant: 'outline',
          backgroundColor: '#3b82f6',
          textColor: '#ffffff',
          borderRadius: 'rounded-lg',
          size: 'medium',
        },
        order: 2,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: 'Case Studies',
          url: 'https://yourcompany.com/case-studies',
          icon: 'arrow',
        },
        style: {
          variant: 'outline',
          backgroundColor: '#3b82f6',
          textColor: '#ffffff',
          borderRadius: 'rounded-lg',
          size: 'medium',
        },
        order: 3,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: 'Contact Us',
          url: 'https://yourcompany.com/contact',
          icon: 'external',
        },
        style: {
          variant: 'soft',
          backgroundColor: '#3b82f6',
          textColor: '#ffffff',
          borderRadius: 'rounded-lg',
          size: 'medium',
        },
        order: 4,
      },
      {
        id: nanoid(),
        type: 'social',
        content: {
          links: {
            linkedin: 'your-profile',
            twitter: 'yourcompany',
            facebook: 'yourcompany',
          },
        },
        style: {
          iconSize: 40,
          spacing: 'normal',
          style: 'outline',
          layout: 'row',
        },
        order: 5,
      },
    ],
    theme: {
      backgroundColor: '#f9fafb',
      textColor: '#111827',
      buttonColor: '#3b82f6',
    },
  },
  {
    id: 'linktree-minimal',
    name: 'Minimalist',
    description: 'Clean and simple monochrome design',
    category: 'Personal',
    thumbnail: '',
    blocks: [
      {
        id: nanoid(),
        type: 'profile',
        content: {
          displayName: 'Alex Johnson',
          bio: 'Designer & Developer',
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
          label: 'Portfolio',
          url: 'https://yourportfolio.com',
          icon: 'arrow',
        },
        style: {
          variant: 'fill',
          backgroundColor: '#000000',
          textColor: '#ffffff',
          borderRadius: 'rounded-lg',
          size: 'medium',
        },
        order: 1,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: 'Blog',
          url: 'https://yourblog.com',
          icon: 'arrow',
        },
        style: {
          variant: 'outline',
          backgroundColor: '#000000',
          textColor: '#ffffff',
          borderRadius: 'rounded-lg',
          size: 'medium',
        },
        order: 2,
      },
      {
        id: nanoid(),
        type: 'linkButton',
        content: {
          label: 'Contact',
          url: 'mailto:you@email.com',
          icon: 'external',
        },
        style: {
          variant: 'outline',
          backgroundColor: '#000000',
          textColor: '#ffffff',
          borderRadius: 'rounded-lg',
          size: 'medium',
        },
        order: 3,
      },
      {
        id: nanoid(),
        type: 'social',
        content: {
          links: {
            github: 'yourusername',
            linkedin: 'your-profile',
            twitter: 'yourusername',
          },
        },
        style: {
          iconSize: 36,
          spacing: 'tight',
          style: 'minimal',
          layout: 'row',
        },
        order: 4,
      },
    ],
    theme: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      buttonColor: '#000000',
    },
  },
];
