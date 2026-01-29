import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
  FaGithub,
  FaDiscord,
  FaWhatsapp,
  FaSpotify,
  FaTwitch,
  FaSnapchat,
  FaPinterest,
  FaReddit,
  FaTelegram,
  FaMedium,
  FaBehance,
  FaDribbble,
  FaPatreon,
  FaSlack,
  FaVimeo,
  FaSoundcloud,
  FaFlickr,
  FaTumblr,
  FaEtsy,
  FaAmazon,
  FaApple,
  FaProductHunt,
  FaStackOverflow,
  FaCodepen,
  FaWeibo,
  FaVk,
  FaSteam,
  FaXbox,
  FaPlaystation,
  FaKickstarter,
  FaShopify,
  FaPaypal,
} from 'react-icons/fa';

import {
  FaXTwitter,
  FaThreads,
  FaBluesky,
  FaMastodon,
} from 'react-icons/fa6';

import {
  SiOnlyfans,
  SiSubstack,
  SiGumroad,
  SiKofi,
  SiBuymeacoffee,
  SiNotion,
  SiLinktree,
  SiCashapp,
  SiVenmo,
  SiZoom,
  SiGooglemeet,
  SiCalendly,
} from 'react-icons/si';

import { MdEmail, MdPhone, MdSms } from 'react-icons/md';
import { Globe } from 'lucide-react';
import type { IconType } from 'react-icons';

export interface SocialPlatform {
  id: string;
  name: string;
  icon: IconType;
  brandColor: string;
  textColor: string;
  urlPlaceholder: string;
  urlPrefix?: string; // For building URLs (e.g., https://instagram.com/)
  category: 'social' | 'professional' | 'creative' | 'entertainment' | 'monetization' | 'communication' | 'other';
  popular?: boolean; // For featuring in UI
}

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  // SOCIAL MEDIA (Popular)
  {
    id: 'instagram',
    name: 'Instagram',
    icon: FaInstagram,
    brandColor: '#E4405F',
    textColor: '#FFFFFF',
    urlPlaceholder: 'yourusername',
    urlPrefix: 'https://instagram.com/',
    category: 'social',
    popular: true,
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: FaTiktok,
    brandColor: '#000000',
    textColor: '#FFFFFF',
    urlPlaceholder: '@yourusername',
    urlPrefix: 'https://tiktok.com/@',
    category: 'social',
    popular: true,
  },
  {
    id: 'x',
    name: 'X (Twitter)',
    icon: FaXTwitter,
    brandColor: '#000000',
    textColor: '#FFFFFF',
    urlPlaceholder: 'yourusername',
    urlPrefix: 'https://x.com/',
    category: 'social',
    popular: true,
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: FaTwitter,
    brandColor: '#1DA1F2',
    textColor: '#FFFFFF',
    urlPlaceholder: 'yourusername',
    urlPrefix: 'https://twitter.com/',
    category: 'social',
    popular: true,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: FaFacebook,
    brandColor: '#1877F2',
    textColor: '#FFFFFF',
    urlPlaceholder: 'yourpage',
    urlPrefix: 'https://facebook.com/',
    category: 'social',
    popular: true,
  },
  {
    id: 'threads',
    name: 'Threads',
    icon: FaThreads,
    brandColor: '#000000',
    textColor: '#FFFFFF',
    urlPlaceholder: '@yourusername',
    urlPrefix: 'https://threads.net/@',
    category: 'social',
    popular: true,
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    icon: FaSnapchat,
    brandColor: '#FFFC00',
    textColor: '#000000',
    urlPlaceholder: 'yourusername',
    urlPrefix: 'https://snapchat.com/add/',
    category: 'social',
    popular: true,
  },
  {
    id: 'reddit',
    name: 'Reddit',
    icon: FaReddit,
    brandColor: '#FF4500',
    textColor: '#FFFFFF',
    urlPlaceholder: 'u/yourusername',
    urlPrefix: 'https://reddit.com/',
    category: 'social',
    popular: true,
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    icon: FaPinterest,
    brandColor: '#E60023',
    textColor: '#FFFFFF',
    urlPlaceholder: 'yourusername',
    urlPrefix: 'https://pinterest.com/',
    category: 'social',
  },
  {
    id: 'bluesky',
    name: 'Bluesky',
    icon: FaBluesky,
    brandColor: '#0085ff',
    textColor: '#FFFFFF',
    urlPlaceholder: 'yourusername.bsky.social',
    urlPrefix: 'https://bsky.app/profile/',
    category: 'social',
  },
  {
    id: 'mastodon',
    name: 'Mastodon',
    icon: FaMastodon,
    brandColor: '#6364FF',
    textColor: '#FFFFFF',
    urlPlaceholder: '@yourusername@mastodon.social',
    category: 'social',
  },
  {
    id: 'tumblr',
    name: 'Tumblr',
    icon: FaTumblr,
    brandColor: '#35465C',
    textColor: '#FFFFFF',
    urlPlaceholder: 'yourblog',
    urlPrefix: 'https://',
    category: 'social',
  },
  {
    id: 'weibo',
    name: 'Weibo',
    icon: FaWeibo,
    brandColor: '#E6162D',
    textColor: '#FFFFFF',
    urlPlaceholder: 'yourusername',
    category: 'social',
  },
  {
    id: 'vk',
    name: 'VK',
    icon: FaVk,
    brandColor: '#4680C2',
    textColor: '#FFFFFF',
    urlPlaceholder: 'yourpage',
    category: 'social',
  },

  // PROFESSIONAL
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: FaLinkedin,
    brandColor: '#0A66C2',
    textColor: '#FFFFFF',
    urlPlaceholder: 'in/yourname',
    urlPrefix: 'https://linkedin.com/',
    category: 'professional',
    popular: true,
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: FaGithub,
    brandColor: '#181717',
    textColor: '#FFFFFF',
    urlPlaceholder: 'yourusername',
    urlPrefix: 'https://github.com/',
    category: 'professional',
    popular: true,
  },
  {
    id: 'stackoverflow',
    name: 'Stack Overflow',
    icon: FaStackOverflow,
    brandColor: '#F48024',
    textColor: '#FFFFFF',
    urlPlaceholder: 'users/yourprofile',
    urlPrefix: 'https://stackoverflow.com/',
    category: 'professional',
  },
  {
    id: 'producthunt',
    name: 'Product Hunt',
    icon: FaProductHunt,
    brandColor: '#DA552F',
    textColor: '#FFFFFF',
    urlPlaceholder: '@yourusername',
    urlPrefix: 'https://producthunt.com/@',
    category: 'professional',
  },

  // CREATIVE & DESIGN
  {
    id: 'behance',
    name: 'Behance',
    icon: FaBehance,
    brandColor: '#1769FF',
    textColor: '#FFFFFF',
    urlPlaceholder: 'yourportfolio',
    urlPrefix: 'https://behance.net/',
    category: 'creative',
    popular: true,
  },
  {
    id: 'dribbble',
    name: 'Dribbble',
    icon: FaDribbble,
    brandColor: '#EA4C89',
    textColor: '#FFFFFF',
    urlPlaceholder: 'yourusername',
    urlPrefix: 'https://dribbble.com/',
    category: 'creative',
    popular: true,
  },
  {
    id: 'codepen',
    name: 'CodePen',
    icon: FaCodepen,
    brandColor: '#000000',
    textColor: '#FFFFFF',
    urlPlaceholder: 'yourusername',
    urlPrefix: 'https://codepen.io/',
    category: 'creative',
  },
  {
    id: 'flickr',
    name: 'Flickr',
    icon: FaFlickr,
    brandColor: '#0063DC',
    textColor: '#FFFFFF',
    urlPlaceholder: 'photos/yourname',
    urlPrefix: 'https://flickr.com/',
    category: 'creative',
  },

  // ENTERTAINMENT & VIDEO
  {
    id: 'youtube',
    name: 'YouTube',
    icon: FaYoutube,
    brandColor: '#FF0000',
    textColor: '#FFFFFF',
    urlPlaceholder: '@yourchannel',
    urlPrefix: 'https://youtube.com/@',
    category: 'entertainment',
    popular: true,
  },
  {
    id: 'twitch',
    name: 'Twitch',
    icon: FaTwitch,
    brandColor: '#9146FF',
    textColor: '#FFFFFF',
    urlPlaceholder: 'yourchannel',
    urlPrefix: 'https://twitch.tv/',
    category: 'entertainment',
    popular: true,
  },
  {
    id: 'vimeo',
    name: 'Vimeo',
    icon: FaVimeo,
    brandColor: '#1AB7EA',
    textColor: '#FFFFFF',
    urlPlaceholder: 'yourchannel',
    urlPrefix: 'https://vimeo.com/',
    category: 'entertainment',
  },

  // MUSIC & AUDIO
  {
    id: 'spotify',
    name: 'Spotify',
    icon: FaSpotify,
    brandColor: '#1DB954',
    textColor: '#FFFFFF',
    urlPlaceholder: 'artist/yourprofile',
    urlPrefix: 'https://open.spotify.com/',
    category: 'entertainment',
    popular: true,
  },
  {
    id: 'soundcloud',
    name: 'SoundCloud',
    icon: FaSoundcloud,
    brandColor: '#FF5500',
    textColor: '#FFFFFF',
    urlPlaceholder: 'yourprofile',
    urlPrefix: 'https://soundcloud.com/',
    category: 'entertainment',
  },
  {
    id: 'applemusic',
    name: 'Apple Music',
    icon: FaApple,
    brandColor: '#FA243C',
    textColor: '#FFFFFF',
    urlPlaceholder: 'artist/yourprofile',
    category: 'entertainment',
  },

  // MONETIZATION & CREATOR ECONOMY
  {
    id: 'patreon',
    name: 'Patreon',
    icon: FaPatreon,
    brandColor: '#FF424D',
    textColor: '#FFFFFF',
    urlPlaceholder: 'yourpage',
    urlPrefix: 'https://patreon.com/',
    category: 'monetization',
    popular: true,
  },
  {
    id: 'onlyfans',
    name: 'OnlyFans',
    icon: SiOnlyfans,
    brandColor: '#00AFF0',
    textColor: '#FFFFFF',
    urlPlaceholder: 'yourprofile',
    urlPrefix: 'https://onlyfans.com/',
    category: 'monetization',
  },
  {
    id: 'substack',
    name: 'Substack',
    icon: SiSubstack,
    brandColor: '#FF6719',
    textColor: '#FFFFFF',
    urlPlaceholder: 'yoursubstack',
    category: 'monetization',
    popular: true,
  },
  {
    id: 'medium',
    name: 'Medium',
    icon: FaMedium,
    brandColor: '#000000',
    textColor: '#FFFFFF',
    urlPlaceholder: '@yourusername',
    urlPrefix: 'https://medium.com/@',
    category: 'monetization',
  },
  {
    id: 'gumroad',
    name: 'Gumroad',
    icon: SiGumroad,
    brandColor: '#FF90E8',
    textColor: '#000000',
    urlPlaceholder: 'yourstore',
    urlPrefix: 'https://gumroad.com/',
    category: 'monetization',
  },
  {
    id: 'kofi',
    name: 'Ko-fi',
    icon: SiKofi,
    brandColor: '#FF5E5B',
    textColor: '#FFFFFF',
    urlPlaceholder: 'yourpage',
    urlPrefix: 'https://ko-fi.com/',
    category: 'monetization',
  },
  {
    id: 'buymeacoffee',
    name: 'Buy Me a Coffee',
    icon: SiBuymeacoffee,
    brandColor: '#FFDD00',
    textColor: '#000000',
    urlPlaceholder: 'yourpage',
    urlPrefix: 'https://buymeacoffee.com/',
    category: 'monetization',
  },
  {
    id: 'kickstarter',
    name: 'Kickstarter',
    icon: FaKickstarter,
    brandColor: '#05CE78',
    textColor: '#FFFFFF',
    urlPlaceholder: 'projects/yourproject',
    urlPrefix: 'https://kickstarter.com/',
    category: 'monetization',
  },

  // E-COMMERCE
  {
    id: 'shopify',
    name: 'Shopify',
    icon: FaShopify,
    brandColor: '#96BF48',
    textColor: '#FFFFFF',
    urlPlaceholder: 'yourstore.myshopify.com',
    category: 'monetization',
  },
  {
    id: 'etsy',
    name: 'Etsy',
    icon: FaEtsy,
    brandColor: '#F45800',
    textColor: '#FFFFFF',
    urlPlaceholder: 'shop/yourshop',
    urlPrefix: 'https://etsy.com/',
    category: 'monetization',
  },
  {
    id: 'amazon',
    name: 'Amazon',
    icon: FaAmazon,
    brandColor: '#FF9900',
    textColor: '#000000',
    urlPlaceholder: 'yourstore',
    category: 'monetization',
  },

  // COMMUNICATION
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: FaWhatsapp,
    brandColor: '#25D366',
    textColor: '#FFFFFF',
    urlPlaceholder: '1234567890',
    urlPrefix: 'https://wa.me/',
    category: 'communication',
    popular: true,
  },
  {
    id: 'telegram',
    name: 'Telegram',
    icon: FaTelegram,
    brandColor: '#0088CC',
    textColor: '#FFFFFF',
    urlPlaceholder: 'yourusername',
    urlPrefix: 'https://t.me/',
    category: 'communication',
    popular: true,
  },
  {
    id: 'discord',
    name: 'Discord',
    icon: FaDiscord,
    brandColor: '#5865F2',
    textColor: '#FFFFFF',
    urlPlaceholder: 'invite/yourserver',
    urlPrefix: 'https://discord.gg/',
    category: 'communication',
    popular: true,
  },
  {
    id: 'slack',
    name: 'Slack',
    icon: FaSlack,
    brandColor: '#4A154B',
    textColor: '#FFFFFF',
    urlPlaceholder: 'yourworkspace',
    category: 'communication',
  },
  {
    id: 'zoom',
    name: 'Zoom',
    icon: SiZoom,
    brandColor: '#2D8CFF',
    textColor: '#FFFFFF',
    urlPlaceholder: 'j/meetingid',
    urlPrefix: 'https://zoom.us/',
    category: 'communication',
  },
  {
    id: 'googlemeet',
    name: 'Google Meet',
    icon: SiGooglemeet,
    brandColor: '#00897B',
    textColor: '#FFFFFF',
    urlPlaceholder: 'yourmeeting',
    category: 'communication',
  },
  {
    id: 'calendly',
    name: 'Calendly',
    icon: SiCalendly,
    brandColor: '#006BFF',
    textColor: '#FFFFFF',
    urlPlaceholder: 'yourname',
    urlPrefix: 'https://calendly.com/',
    category: 'communication',
  },
  {
    id: 'email',
    name: 'Email',
    icon: MdEmail,
    brandColor: '#EA4335',
    textColor: '#FFFFFF',
    urlPlaceholder: 'you@example.com',
    urlPrefix: 'mailto:',
    category: 'communication',
    popular: true,
  },
  {
    id: 'phone',
    name: 'Phone',
    icon: MdPhone,
    brandColor: '#34A853',
    textColor: '#FFFFFF',
    urlPlaceholder: '+1234567890',
    urlPrefix: 'tel:',
    category: 'communication',
  },
  {
    id: 'sms',
    name: 'SMS',
    icon: MdSms,
    brandColor: '#FBBC04',
    textColor: '#000000',
    urlPlaceholder: '+1234567890',
    urlPrefix: 'sms:',
    category: 'communication',
  },

  // PAYMENT
  {
    id: 'paypal',
    name: 'PayPal',
    icon: FaPaypal,
    brandColor: '#00457C',
    textColor: '#FFFFFF',
    urlPlaceholder: 'paypal.me/yourname',
    urlPrefix: 'https://paypal.me/',
    category: 'monetization',
  },
  {
    id: 'venmo',
    name: 'Venmo',
    icon: SiVenmo,
    brandColor: '#3D95CE',
    textColor: '#FFFFFF',
    urlPlaceholder: 'yourname',
    urlPrefix: 'https://venmo.com/',
    category: 'monetization',
  },
  {
    id: 'cashapp',
    name: 'Cash App',
    icon: SiCashapp,
    brandColor: '#00D64F',
    textColor: '#FFFFFF',
    urlPlaceholder: '$yourcashtag',
    category: 'monetization',
  },

  // GAMING
  {
    id: 'steam',
    name: 'Steam',
    icon: FaSteam,
    brandColor: '#000000',
    textColor: '#FFFFFF',
    urlPlaceholder: 'id/yourprofile',
    urlPrefix: 'https://steamcommunity.com/',
    category: 'entertainment',
  },
  {
    id: 'xbox',
    name: 'Xbox',
    icon: FaXbox,
    brandColor: '#107C10',
    textColor: '#FFFFFF',
    urlPlaceholder: 'gamertag',
    category: 'entertainment',
  },
  {
    id: 'playstation',
    name: 'PlayStation',
    icon: FaPlaystation,
    brandColor: '#003791',
    textColor: '#FFFFFF',
    urlPlaceholder: 'psn-id',
    category: 'entertainment',
  },

  // OTHER
  {
    id: 'notion',
    name: 'Notion',
    icon: SiNotion,
    brandColor: '#000000',
    textColor: '#FFFFFF',
    urlPlaceholder: 'yourpage',
    category: 'other',
  },
  {
    id: 'linktree',
    name: 'Linktree',
    icon: SiLinktree,
    brandColor: '#43E55E',
    textColor: '#000000',
    urlPlaceholder: 'yourname',
    urlPrefix: 'https://linktr.ee/',
    category: 'other',
  },
  {
    id: 'website',
    name: 'Website',
    icon: Globe,
    brandColor: '#6366F1',
    textColor: '#FFFFFF',
    urlPlaceholder: 'https://yourwebsite.com',
    category: 'other',
    popular: true,
  },
  {
    id: 'custom',
    name: 'Custom Link',
    icon: Globe,
    brandColor: '#8B5CF6',
    textColor: '#FFFFFF',
    urlPlaceholder: 'https://yourlink.com',
    category: 'other',
  },
];

// Helper functions
export const getPlatformById = (id: string): SocialPlatform | undefined => {
  return SOCIAL_PLATFORMS.find(p => p.id === id);
};

export const getPopularPlatforms = (): SocialPlatform[] => {
  return SOCIAL_PLATFORMS.filter(p => p.popular);
};

export const getPlatformsByCategory = (category: SocialPlatform['category']): SocialPlatform[] => {
  return SOCIAL_PLATFORMS.filter(p => p.category === category);
};

export const getPlatformIcon = (id: string): IconType => {
  const platform = getPlatformById(id);
  return platform?.icon || Globe;
};

export const getPlatformColors = (id: string): { bg: string; text: string } => {
  const platform = getPlatformById(id);
  return platform ? { bg: platform.brandColor, text: platform.textColor } : { bg: '#6366F1', text: '#FFFFFF' };
};

export const buildPlatformUrl = (id: string, username: string): string => {
  const platform = getPlatformById(id);
  if (!platform) return username;
  
  // If username already starts with http/https, return as is
  if (username.startsWith('http://') || username.startsWith('https://')) {
    return username;
  }
  
  // If platform has a URL prefix, use it
  if (platform.urlPrefix) {
    return platform.urlPrefix + username;
  }
  
  return username;
};
