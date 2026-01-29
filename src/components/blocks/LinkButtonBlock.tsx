import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Loader2, ChevronRight, Globe, Mail } from 'lucide-react';
import type { Block } from '@/types';
import type { PageTheme } from '@/types/theme';
import { animations } from '@/utils/designSystem';
import { getBorderRadius } from '@/lib/themeHelpers';

// Import brand icons
import {
  SpotifyIcon,
  AppleMusicIcon,
  YouTubeIcon,
  InstagramIcon,
  XIcon,
  TikTokIcon,
  FacebookIcon,
  LinkedInIcon,
  GitHubIcon,
  WhatsAppIcon,
  TelegramIcon,
  DiscordIcon,
  TwitchIcon,
  SnapchatIcon,
  PinterestIcon,
  ThreadsIcon,
  StripeIcon,
  PayPalIcon,
  ShopifyIcon,
  BrandColors,
} from '@/components/icons/BrandIcons';

interface LinkButtonBlockProps {
  block: Block;
  isEditing?: boolean;
  theme?: PageTheme;
}

// Platform configuration with icons and gradients
interface PlatformConfig {
  name: string;
  color: string;
  gradient?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const PLATFORMS: Record<string, PlatformConfig> = {
  // Video & Entertainment
  'youtube.com': { name: 'YouTube', color: BrandColors.youtube, gradient: 'linear-gradient(135deg, #FF0000, #CC0000)', icon: YouTubeIcon },
  'youtu.be': { name: 'YouTube', color: BrandColors.youtube, gradient: 'linear-gradient(135deg, #FF0000, #CC0000)', icon: YouTubeIcon },
  'twitch.tv': { name: 'Twitch', color: BrandColors.twitch, gradient: 'linear-gradient(135deg, #9146FF, #6441A5)', icon: TwitchIcon },
  'tiktok.com': { name: 'TikTok', color: BrandColors.tiktok, gradient: 'linear-gradient(135deg, #00F2EA, #FF0050)', icon: TikTokIcon },
  
  // Music
  'spotify.com': { name: 'Spotify', color: BrandColors.spotify, gradient: 'linear-gradient(135deg, #1DB954, #169544)', icon: SpotifyIcon },
  'open.spotify.com': { name: 'Spotify', color: BrandColors.spotify, gradient: 'linear-gradient(135deg, #1DB954, #169544)', icon: SpotifyIcon },
  'music.apple.com': { name: 'Apple Music', color: BrandColors.appleMusic, gradient: 'linear-gradient(135deg, #FA243C, #d91e34)', icon: AppleMusicIcon },
  'apple.com': { name: 'Apple Music', color: BrandColors.appleMusic, gradient: 'linear-gradient(135deg, #FA243C, #d91e34)', icon: AppleMusicIcon },
  
  // Social Media
  'instagram.com': { name: 'Instagram', color: BrandColors.instagram, gradient: 'linear-gradient(135deg, #F58529, #DD2A7B, #8134AF)', icon: InstagramIcon },
  'twitter.com': { name: 'X', color: BrandColors.x, gradient: 'linear-gradient(135deg, #000000, #333333)', icon: XIcon },
  'x.com': { name: 'X', color: BrandColors.x, gradient: 'linear-gradient(135deg, #000000, #333333)', icon: XIcon },
  'threads.net': { name: 'Threads', color: BrandColors.threads, gradient: 'linear-gradient(135deg, #000000, #333333)', icon: ThreadsIcon },
  'facebook.com': { name: 'Facebook', color: BrandColors.facebook, gradient: 'linear-gradient(135deg, #1877F2, #0A59DA)', icon: FacebookIcon },
  'linkedin.com': { name: 'LinkedIn', color: BrandColors.linkedin, gradient: 'linear-gradient(135deg, #0A66C2, #004182)', icon: LinkedInIcon },
  'snapchat.com': { name: 'Snapchat', color: BrandColors.snapchat, gradient: 'linear-gradient(135deg, #FFFC00, #F7F300)', icon: SnapchatIcon },
  'pinterest.com': { name: 'Pinterest', color: BrandColors.pinterest, gradient: 'linear-gradient(135deg, #E60023, #BD081C)', icon: PinterestIcon },
  
  // Messaging
  'wa.me': { name: 'WhatsApp', color: BrandColors.whatsapp, gradient: 'linear-gradient(135deg, #25D366, #128C7E)', icon: WhatsAppIcon },
  'whatsapp.com': { name: 'WhatsApp', color: BrandColors.whatsapp, gradient: 'linear-gradient(135deg, #25D366, #128C7E)', icon: WhatsAppIcon },
  't.me': { name: 'Telegram', color: BrandColors.telegram, gradient: 'linear-gradient(135deg, #26A5E4, #0088cc)', icon: TelegramIcon },
  'telegram.me': { name: 'Telegram', color: BrandColors.telegram, gradient: 'linear-gradient(135deg, #26A5E4, #0088cc)', icon: TelegramIcon },
  'discord.com': { name: 'Discord', color: BrandColors.discord, gradient: 'linear-gradient(135deg, #5865F2, #404EED)', icon: DiscordIcon },
  'discord.gg': { name: 'Discord', color: BrandColors.discord, gradient: 'linear-gradient(135deg, #5865F2, #404EED)', icon: DiscordIcon },
  
  // Professional
  'github.com': { name: 'GitHub', color: BrandColors.github, gradient: 'linear-gradient(135deg, #333333, #181717)', icon: GitHubIcon },
  
  // E-commerce & Payments
  'shopify.com': { name: 'Shopify', color: BrandColors.shopify, gradient: 'linear-gradient(135deg, #96BF48, #7AB02E)', icon: ShopifyIcon },
  'stripe.com': { name: 'Stripe', color: BrandColors.stripe, gradient: 'linear-gradient(135deg, #635BFF, #5548E5)', icon: StripeIcon },
  'paypal.com': { name: 'PayPal', color: BrandColors.paypal, gradient: 'linear-gradient(135deg, #00457C, #003366)', icon: PayPalIcon },
  
  // Email (using Mail icon from lucide)
  'mailto:': { name: 'Email', color: '#EA4335', gradient: 'linear-gradient(135deg, #EA4335, #C5221F)', icon: Mail as React.ComponentType<{ className?: string }> },
};

// Utility to get favicon from URL with caching
const getFaviconUrl = (url: string): string | null => {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return null;
  }
};

// Detect platform from URL for special styling
const detectPlatform = (url: string): PlatformConfig | null => {
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    for (const [key, value] of Object.entries(PLATFORMS)) {
      if (domain.includes(key)) return value;
    }
  } catch {
    // Invalid URL
  }
  return null;
};

export default function LinkButtonBlock({ block, isEditing, theme }: LinkButtonBlockProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const content = block.content || {};
  const blockStyle = block.style || {};
  
  // Content with type assertions
  const url = (content.url as string) || '#';
  const title = (content.label as string) || (content.title as string) || 'Link';
  const subtitle = content.description as string;
  const thumbnailUrl = content.thumbnail as string;
  
  // Settings with defaults
  const variant = (blockStyle.variant as string) || theme?.button?.style || theme?.button?.variant || 'fill';
  const animation = (blockStyle.animation as string) || theme?.button?.hoverEffect || 'scale';
  const showIcon = (blockStyle.showIcon as boolean) !== false;
  const openInNewTab = (blockStyle.openInNewTab as boolean) !== false;
  const iconPosition = (blockStyle.iconPosition as string) || 'left';
  
  // Platform detection
  const platform = detectPlatform(url);
  const faviconUrl = getFaviconUrl(url);
  const PlatformIcon = platform?.icon;
  
  // Theme-based styling with enhanced mobile support
  const getButtonStyles = (): React.CSSProperties => {
    const bgColor = theme?.button?.backgroundColor || '#ffffff';
    const textColor = theme?.button?.textColor || '#000000';
    
    // Use centralized border radius helper
    const borderRadius = getBorderRadius(theme?.button?.borderRadius, 12);
    
    const baseStyles: React.CSSProperties = {
      borderRadius: borderRadius + 'px',
      color: textColor,
      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      WebkitTapHighlightColor: 'transparent',
    };
    
    switch (variant) {
      case 'fill':
      case 'solid':
        return {
          ...baseStyles,
          backgroundColor: bgColor,
          border: 'none',
          boxShadow: isPressed 
            ? '0 2px 8px -2px rgba(0,0,0,0.15)'
            : isHovered 
              ? '0 12px 32px -8px rgba(0,0,0,0.22), 0 4px 12px -4px rgba(0,0,0,0.12)' 
              : '0 4px 16px -4px rgba(0,0,0,0.12), 0 2px 4px -2px rgba(0,0,0,0.06)',
        };
      case 'outline':
        return {
          ...baseStyles,
          backgroundColor: isHovered ? bgColor + '10' : 'transparent',
          border: `2px solid ${bgColor}`,
          boxShadow: isHovered ? `0 0 0 4px ${bgColor}15` : 'none',
        };
      case 'soft':
        return {
          ...baseStyles,
          backgroundColor: bgColor + (isHovered ? '30' : '15'),
          border: 'none',
        };
      case 'shadow':
        return {
          ...baseStyles,
          backgroundColor: bgColor,
          border: 'none',
          boxShadow: isPressed
            ? '0 4px 12px -4px rgba(0,0,0,0.18)'
            : isHovered 
              ? '0 20px 40px -12px rgba(0,0,0,0.3), 0 8px 16px -8px rgba(0,0,0,0.2)' 
              : '0 8px 24px -6px rgba(0,0,0,0.2), 0 4px 8px -4px rgba(0,0,0,0.1)',
        };
      case 'glass':
        return {
          ...baseStyles,
          backgroundColor: isHovered ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.25)',
          boxShadow: '0 4px 24px -4px rgba(0,0,0,0.1)',
        };
      case 'gradient':
        return {
          ...baseStyles,
          background: platform?.gradient || `linear-gradient(135deg, ${bgColor}, ${bgColor}dd)`,
          border: 'none',
          boxShadow: isHovered 
            ? `0 12px 32px -8px ${bgColor}60` 
            : `0 4px 16px -4px ${bgColor}40`,
        };
      default:
        return baseStyles;
    }
  };

  // Enhanced animation variants for mobile
  const getMotionProps = () => {
    switch (animation) {
      case 'scale':
      case 'grow':
        return {
          ...animations.hover.scale,
          ...animations.tap,
        };
      case 'lift':
        return animations.hover.lift;
      case 'glow':
        return {
          whileHover: { 
            boxShadow: `0 0 40px ${platform?.color || theme?.button?.backgroundColor || '#000'}50`,
            scale: 1.01,
          },
          ...animations.tap,
        };
      case 'bounce':
        return {
          ...animations.hover.scaleSmall,
          whileTap: { scale: 0.94 },
        };
      case 'tilt':
        return {
          whileHover: { rotateX: -2, rotateY: 2, scale: 1.02 },
          ...animations.tap,
        };
      case 'none':
      default:
        return animations.tap;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isEditing) {
      e.preventDefault();
      return;
    }
    
    if (!url || url === '#') {
      e.preventDefault();
      return;
    }
    
    setIsLoading(true);
    // Track click analytics would go here
    setTimeout(() => setIsLoading(false), 600);
  };

  // Enhanced thumbnail rendering with platform-aware icons
  const renderThumbnail = () => {
    const containerClasses = "w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200";
    
    // Custom thumbnail image
    if (thumbnailUrl && !imageError) {
      return (
        <div 
          className={`${containerClasses} overflow-hidden`}
          style={{ 
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
        >
          <img 
            src={thumbnailUrl} 
            alt="" 
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        </div>
      );
    }
    
    // Platform-specific icon
    if (showIcon && platform && PlatformIcon) {
      return (
        <div 
          className={containerClasses}
          style={{ 
            background: platform.gradient || `${platform.color}20`,
            transform: isHovered ? 'scale(1.08)' : 'scale(1)',
            color: platform.color,
          }}
        >
          <PlatformIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      );
    }
    
    // Favicon fallback
    if (showIcon && faviconUrl) {
      return (
        <div 
          className={`${containerClasses} bg-black/5 dark:bg-white/10`}
          style={{ 
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
        >
          <img 
            src={faviconUrl} 
            alt="" 
            className="w-6 h-6 sm:w-7 sm:h-7 rounded"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
            loading="lazy"
          />
        </div>
      );
    }
    
    // Default globe icon
    if (showIcon) {
      return (
        <div 
          className={`${containerClasses} bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800`}
          style={{ 
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
        >
          <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
        </div>
      );
    }
    
    return null;
  };

  return (
    <motion.a
      href={url}
      target={openInNewTab ? '_blank' : '_self'}
      rel={openInNewTab ? 'noopener noreferrer' : undefined}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => { setIsHovered(true); setIsPressed(true); }}
      onTouchEnd={() => { setIsHovered(false); setIsPressed(false); }}
      className="block w-full no-underline select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-xl"
      style={{ 
        pointerEvents: isEditing ? 'none' : 'auto',
      }}
      {...getMotionProps()}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <div
        className="relative flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 sm:py-5 min-h-[64px] sm:min-h-[72px] cursor-pointer overflow-hidden"
        style={getButtonStyles()}
      >
        {/* Platform accent line (left edge) */}
        {platform && variant !== 'gradient' && (
          <div 
            className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full transition-opacity duration-300"
            style={{ 
              backgroundColor: platform.color,
              opacity: isHovered ? 0.9 : 0.6,
            }}
          />
        )}
        
        {/* Left thumbnail/icon */}
        {iconPosition === 'left' && renderThumbnail()}
        
        {/* Content */}
        <div className="flex-1 min-w-0 px-1">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            {isLoading ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <span className="font-semibold text-[15px] sm:text-base leading-tight truncate max-w-full">
                {title}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm opacity-60 mt-1 truncate text-center sm:text-left leading-tight">
              {subtitle}
            </p>
          )}
        </div>
        
        {/* Right thumbnail/icon */}
        {iconPosition === 'right' && renderThumbnail()}
        
        {/* Arrow indicator */}
        <motion.div 
          className="flex-shrink-0 opacity-50 ml-1"
          animate={{ 
            x: isHovered ? 4 : 0,
            opacity: isHovered ? 0.8 : 0.5,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          {openInNewTab ? (
            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </motion.div>
        
        {/* Hover ripple effect */}
        {isPressed && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.08 }}
            style={{ backgroundColor: 'currentColor' }}
          />
        )}
      </div>
      
      {/* Bottom platform indicator with animation */}
      {platform && variant !== 'gradient' && (
        <motion.div 
          className="h-0.5 rounded-full mx-auto -mt-0.5"
          initial={{ width: 0 }}
          animate={{ 
            width: isHovered ? '50%' : '0%',
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          style={{ backgroundColor: platform.color }}
        />
      )}
    </motion.a>
  );
}
