import { 
  Mail,
  Globe,
  Smartphone,
  type LucideIcon,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Block } from '@/types';
import { cn } from '@/lib/utils';
import { shadows, animations } from '@/utils/designSystem';
import { trackCTA } from '@/utils/trackCTA';

// Import modern brand icons
import {
  InstagramIcon,
  XIcon,
  TikTokIcon,
  SpotifyIcon,
  YouTubeIcon,
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
  BrandColors,
} from '@/components/icons/BrandIcons';

// Type for icon component
type IconComponent = LucideIcon | React.ComponentType<{ className?: string }>;

// Enhanced social platforms with modern icons and branding
const SOCIAL_PLATFORMS: Array<{
  id: string;
  label: string;
  icon: IconComponent;
  color: string;
  gradient: string;
  glowColor: string;
  placeholder: string;
  getUrl: (value: string) => string;
  getDeepLink: (value: string) => string;
}> = [
  { 
    id: 'instagram', 
    label: 'Instagram', 
    icon: InstagramIcon,  // ✅ Using real brand icon
    color: BrandColors.instagram,
    gradient: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
    glowColor: BrandColors.instagram,
    placeholder: 'username',
    getUrl: (value: string) => `https://instagram.com/${value.replace('@', '')}`,
    getDeepLink: (value: string) => `instagram://user?username=${value.replace('@', '')}`,
  },
  { 
    id: 'tiktok', 
    label: 'TikTok', 
    icon: TikTokIcon,  // ✅ Using real brand icon
    color: BrandColors.tiktok,
    gradient: 'linear-gradient(135deg, #00f2ea 0%, #ff0050 100%)',
    glowColor: '#ff0050',
    placeholder: '@username',
    getUrl: (value: string) => `https://tiktok.com/@${value.replace('@', '')}`,
    getDeepLink: (value: string) => `tiktok://user?username=${value.replace('@', '')}`,
  },
  { 
    id: 'youtube', 
    label: 'YouTube', 
    icon: YouTubeIcon,  // ✅ Using real brand icon
    color: BrandColors.youtube,
    gradient: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)',
    glowColor: BrandColors.youtube,
    placeholder: '@channel',
    getUrl: (value: string) => `https://youtube.com/@${value.replace('@', '')}`,
    getDeepLink: (value: string) => `youtube://user/${value.replace('@', '')}`,
  },
  { 
    id: 'x', 
    label: 'X', 
    icon: XIcon,  // ✅ Using real brand icon
    color: BrandColors.x,
    gradient: 'linear-gradient(135deg, #000000 0%, #14171A 100%)',
    glowColor: '#1DA1F2',
    placeholder: '@handle',
    getUrl: (value: string) => `https://x.com/${value.replace('@', '')}`,
    getDeepLink: (value: string) => `twitter://user?screen_name=${value.replace('@', '')}`,
  },
  { 
    id: 'threads', 
    label: 'Threads', 
    icon: ThreadsIcon,  // ✅ Using real brand icon
    color: BrandColors.threads,
    gradient: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
    glowColor: BrandColors.threads,
    placeholder: '@username',
    getUrl: (value: string) => `https://threads.net/@${value.replace('@', '')}`,
    getDeepLink: (value: string) => `threads://user?username=${value.replace('@', '')}`,
  },
  { 
    id: 'facebook', 
    label: 'Facebook', 
    icon: FacebookIcon,  // ✅ Using real brand icon
    color: BrandColors.facebook,
    gradient: 'linear-gradient(135deg, #1877F2 0%, #0C5ECF 100%)',
    glowColor: BrandColors.facebook,
    placeholder: 'username',
    getUrl: (value: string) => `https://facebook.com/${value}`,
    getDeepLink: (value: string) => `fb://profile/${value}`,
  },
  { 
    id: 'linkedin', 
    label: 'LinkedIn', 
    icon: LinkedInIcon,  // ✅ Using real brand icon
    color: BrandColors.linkedin,
    gradient: 'linear-gradient(135deg, #0A66C2 0%, #004182 100%)',
    glowColor: BrandColors.linkedin,
    placeholder: 'username',
    getUrl: (value: string) => `https://linkedin.com/in/${value}`,
    getDeepLink: (value: string) => `linkedin://profile/${value}`,
  },
  { 
    id: 'whatsapp', 
    label: 'WhatsApp', 
    icon: WhatsAppIcon,  // ✅ Using real brand icon
    color: BrandColors.whatsapp,
    gradient: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
    glowColor: BrandColors.whatsapp,
    placeholder: '+1234567890',
    getUrl: (value: string) => `https://wa.me/${value.replace(/[^0-9]/g, '')}`,
    getDeepLink: (value: string) => `whatsapp://send?phone=${value.replace(/[^0-9]/g, '')}`,
  },
  { 
    id: 'telegram', 
    label: 'Telegram', 
    icon: TelegramIcon,  // ✅ Using real brand icon
    color: BrandColors.telegram,
    gradient: 'linear-gradient(135deg, #26A5E4 0%, #0088cc 100%)',
    glowColor: BrandColors.telegram,
    placeholder: 'username',
    getUrl: (value: string) => `https://t.me/${value}`,
    getDeepLink: (value: string) => `tg://resolve?domain=${value}`,
  },
  { 
    id: 'discord', 
    label: 'Discord', 
    icon: DiscordIcon,  // ✅ Using real brand icon
    color: BrandColors.discord,
    gradient: 'linear-gradient(135deg, #5865F2 0%, #7289DA 100%)',
    glowColor: BrandColors.discord,
    placeholder: 'invite code',
    getUrl: (value: string) => `https://discord.gg/${value}`,
    getDeepLink: (value: string) => `discord://invite/${value}`,
  },
  { 
    id: 'twitch', 
    label: 'Twitch', 
    icon: TwitchIcon,  // ✅ Using real brand icon
    color: BrandColors.twitch,
    gradient: 'linear-gradient(135deg, #9146FF 0%, #6441A5 100%)',
    glowColor: BrandColors.twitch,
    placeholder: 'channel',
    getUrl: (value: string) => `https://twitch.tv/${value}`,
    getDeepLink: (value: string) => `twitch://stream/${value}`,
  },
  { 
    id: 'snapchat', 
    label: 'Snapchat', 
    icon: SnapchatIcon,  // ✅ Using real brand icon
    color: BrandColors.snapchat,
    gradient: 'linear-gradient(135deg, #FFFC00 0%, #FFE600 100%)',
    glowColor: BrandColors.snapchat,
    placeholder: 'username',
    getUrl: (value: string) => `https://snapchat.com/add/${value}`,
    getDeepLink: (value: string) => `snapchat://add/${value}`,
  },
  { 
    id: 'pinterest', 
    label: 'Pinterest', 
    icon: PinterestIcon,  // ✅ Using real brand icon
    color: BrandColors.pinterest,
    gradient: 'linear-gradient(135deg, #E60023 0%, #BD081C 100%)',
    glowColor: BrandColors.pinterest,
    placeholder: 'username',
    getUrl: (value: string) => `https://pinterest.com/${value}`,
    getDeepLink: (value: string) => `pinterest://user/${value}`,
  },
  { 
    id: 'spotify', 
    label: 'Spotify', 
    icon: SpotifyIcon,  // ✅ Using real brand icon
    color: BrandColors.spotify,
    gradient: 'linear-gradient(135deg, #1DB954 0%, #1ed760 100%)',
    glowColor: BrandColors.spotify,
    placeholder: 'artist/playlist',
    getUrl: (value: string) => value.startsWith('http') ? value : `https://open.spotify.com/artist/${value}`,
    getDeepLink: (value: string) => value.replace('https://open.spotify.com', 'spotify://'),
  },
  { 
    id: 'github', 
    label: 'GitHub', 
    icon: GitHubIcon,  // ✅ Using real brand icon
    color: BrandColors.github,
    gradient: 'linear-gradient(135deg, #181717 0%, #333333 100%)',
    glowColor: '#6e5494',
    placeholder: 'username',
    getUrl: (value: string) => `https://github.com/${value}`,
    getDeepLink: (value: string) => `github://user?username=${value}`,
  },
  { 
    id: 'phone', 
    label: 'Phone', 
    icon: Smartphone, 
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    glowColor: '#10B981',
    placeholder: '+1234567890',
    getUrl: (value: string) => `tel:${value}`,
    getDeepLink: (value: string) => `tel:${value}`,
  },
  { 
    id: 'email', 
    label: 'Email', 
    icon: Mail, 
    color: '#EA4335',
    gradient: 'linear-gradient(135deg, #EA4335 0%, #FBBC04 50%, #34A853 100%)',
    glowColor: '#EA4335',
    placeholder: 'email@example.com',
    getUrl: (value: string) => `mailto:${value}`,
    getDeepLink: (value: string) => `mailto:${value}`,
  },
  { 
    id: 'website', 
    label: 'Website', 
    icon: Globe, 
    color: '#6366F1',
    gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    glowColor: '#6366F1',
    placeholder: 'https://...',
    getUrl: (value: string) => value.startsWith('http') ? value : `https://${value}`,
    getDeepLink: (value: string) => value.startsWith('http') ? value : `https://${value}`,
  },
];

export interface SocialLink {
  platformId: string;
  value: string;
  customLabel?: string;
  order: number;
}

interface SocialLinksBlockProps {
  block: Block;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<Block>) => void;
  theme?: {
    branding?: {
      primaryColor?: string;
      secondaryColor?: string;
    };
    button?: {
      backgroundColor?: string;
      textColor?: string;
    };
    typography?: {
      titleColor?: string;
      bodyColor?: string;
    };
  };
}

// Popular platforms to show by default
const POPULAR_PLATFORMS = ['instagram', 'tiktok', 'youtube', 'x', 'threads', 'facebook'];

export default function SocialLinksBlock({ block, isEditing = false, onUpdate, theme }: SocialLinksBlockProps) {
  const content = block.content as Record<string, unknown>;
  const style = (block as unknown as Record<string, unknown>).style as Record<string, unknown> | undefined;
  
  // Get the accent color from theme, falling back to style or a neutral default
  const accentColor = theme?.branding?.primaryColor || theme?.button?.backgroundColor || style?.iconColor as string || '#3B82F6';
  
  // Support both old format (links object) and new format (socialLinks array)
  const oldLinks = (content?.links as Record<string, string>) || {};
  const newLinks = (content?.socialLinks as SocialLink[]) || [];
  
  // Helper to compute initial links
  const computeLinks = (): SocialLink[] => {
    if (newLinks.length > 0) return newLinks;
    if (Object.keys(oldLinks).length > 0) {
      return Object.entries(oldLinks)
        .map(([platformId, value], index) => ({
          platformId: platformId === 'twitter' ? 'x' : platformId,
          value,
          order: index,
        }))
        .filter(link => link.value);
    }
    if (isEditing) {
      return POPULAR_PLATFORMS.map((platformId, index) => ({
        platformId,
        value: '',
        order: index,
      }));
    }
    return [];
  };
  
  const [links, setLinks] = useState<SocialLink[]>(computeLinks);

  // Sync links state when block.content.socialLinks changes (e.g. in preview mode)
  useEffect(() => {
    const currentLinks = computeLinks();
    // Only update if there are actual links in the source data
    if (newLinks.length > 0 || Object.keys(oldLinks).length > 0) {
      setLinks(currentLinks);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(newLinks), JSON.stringify(oldLinks)]);

  const [viewFilter, setViewFilter] = useState<'popular' | 'all'>('popular');
  const [editingPlatform, setEditingPlatform] = useState<string | null>(null);
  
  const iconSize = (style?.iconSize as number) || 40;
  const spacing = (style?.spacing as string) || 'normal';
  const layout = (style?.layout as string) || 'row';
  const styleVariant = (style?.style as string) || 'filled';
  const showLabels = (style?.showLabels as boolean) || false;
  const useBrandColors = (style?.useBrandColors as boolean) ?? true;
  const useDeepLinking = (style?.useDeepLinking as boolean) ?? true;

  useEffect(() => {
    if (onUpdate && isEditing) {
      onUpdate({
        content: {
          ...block.content,
          socialLinks: links,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [links]);

  const handleLinkChange = (platformId: string, value: string) => {
    setLinks(prev => {
      const existing = prev.find(l => l.platformId === platformId);
      if (existing) {
        return prev.map(l => l.platformId === platformId ? { ...l, value } : l);
      }
      return [...prev, { platformId, value, order: prev.length }];
    });
  };

  const getPlatform = (platformId: string) => 
    SOCIAL_PLATFORMS.find(p => p.id === platformId);

  const renderIcon = (_link: SocialLink, platform: typeof SOCIAL_PLATFORMS[number]) => {
    const Icon = platform.icon;
    const color = useBrandColors ? platform.color : accentColor;
    
    const iconSizeClass = iconSize <= 32 ? 'w-8 h-8' : iconSize <= 40 ? 'w-10 h-10' : 'w-12 h-12';
    const innerIconSize = iconSize <= 32 ? 'w-4 h-4' : iconSize <= 40 ? 'w-5 h-5' : 'w-6 h-6';
    
    if (styleVariant === 'filled') {
      return (
        <motion.div
          className={cn(
            "flex items-center justify-center rounded-full shadow-lg relative overflow-hidden",
            iconSizeClass
          )}
          style={{ background: platform.gradient, boxShadow: shadows.colored(platform.color, 4) }}
          {...animations.hover.scale}
          {...animations.tap}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent pointer-events-none" />
          <Icon className={cn(innerIconSize, "text-white relative z-10")} />
        </motion.div>
      );
    }

    if (styleVariant === 'outline') {
      return (
        <motion.div
          className={cn(
            "flex items-center justify-center rounded-full border-2",
            iconSizeClass
          )}
          style={{ borderColor: color, color: color }}
          {...animations.hover.scale}
          {...animations.tap}
        >
          <Icon className={innerIconSize} />
        </motion.div>
      );
    }

    return (
      <motion.div
        className={cn("flex items-center justify-center", iconSizeClass)}
        style={{ color: color }}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <Icon className={innerIconSize} />
      </motion.div>
    );
  };

  // EDITING MODE
  if (isEditing) {
    const activeLinks = links.filter(l => l.value && l.value.trim() !== '');
    const activeLinkCount = activeLinks.length;
    const platformsToShow = viewFilter === 'all' ? SOCIAL_PLATFORMS : SOCIAL_PLATFORMS.filter(p => POPULAR_PLATFORMS.includes(p.id));

    return (
      <div className="w-full p-3">
        {/* SIMPLE HEADER */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-gray-800">Social Links</h3>
            {activeLinkCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium">
                {activeLinkCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setViewFilter(viewFilter === 'all' ? 'popular' : 'all')}
            className="text-[10px] text-blue-600 hover:text-blue-700"
          >
            {viewFilter === 'all' ? 'Show less' : `+${SOCIAL_PLATFORMS.length - 6} more`}
          </button>
        </div>

        {/* TAP TO ADD - Icon Grid */}
        <div className="bg-gray-50 rounded-xl p-3 mb-3">
          <p className="text-[10px] text-gray-500 mb-2 text-center">Tap to add or remove</p>
          <div className="flex flex-wrap justify-center gap-2">
            {platformsToShow.map((platform) => {
              const link = links.find(l => l.platformId === platform.id);
              const isAdded = link?.value && link.value.trim() !== '';
              const isEditing = editingPlatform === platform.id;
              const Icon = platform.icon;

              return (
                <motion.button
                  key={platform.id}
                  onClick={() => {
                    if (isAdded && !isEditing) {
                      // Remove if already added and not editing
                      handleLinkChange(platform.id, '');
                    } else {
                      // Start editing
                      setEditingPlatform(platform.id);
                    }
                  }}
                  className={cn(
                    "relative w-11 h-11 rounded-xl flex items-center justify-center transition-all",
                    isAdded 
                      ? "shadow-lg ring-2 ring-white" 
                      : "bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm",
                    isEditing && "ring-2 ring-blue-400"
                  )}
                  style={isAdded ? { background: platform.gradient } : {}}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className={cn(
                    "w-5 h-5 transition-colors",
                    isAdded ? "text-white" : "text-gray-400"
                  )} />
                  
                  {/* Added indicator */}
                  {isAdded && !isEditing && (
                    <motion.div 
                      className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ACTIVE INPUT - Shows when editing a platform */}
        <AnimatePresence mode="wait">
          {editingPlatform && (
            <motion.div
              key={editingPlatform}
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mb-3"
            >
              {(() => {
                const platform = SOCIAL_PLATFORMS.find(p => p.id === editingPlatform);
                if (!platform) return null;
                const link = links.find(l => l.platformId === platform.id);
                const Icon = platform.icon;

                return (
                  <div 
                    className="rounded-xl overflow-hidden shadow-lg"
                    style={{ background: platform.gradient }}
                  >
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-5 h-5 text-white" />
                        <span className="text-sm font-semibold text-white">{platform.label}</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          autoFocus
                          type="text"
                          value={link?.value || ''}
                          onChange={(e) => handleLinkChange(platform.id, e.target.value)}
                          placeholder={platform.placeholder}
                          className="flex-1 px-3 py-2.5 text-sm rounded-lg bg-white/95 border-0 outline-none focus:ring-2 focus:ring-white/50 placeholder:text-gray-400"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === 'Escape') {
                              setEditingPlatform(null);
                            }
                          }}
                        />
                        <button
                          onClick={() => setEditingPlatform(null)}
                          className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          Done
                        </button>
                      </div>
                      {link?.value && (
                        <a 
                          href={platform.getUrl(link.value)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-white/80 hover:text-white mt-2 block truncate"
                        >
                          → {platform.getUrl(link.value)}
                        </a>
                      )}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* LIVE PREVIEW */}
        {activeLinkCount > 0 && (
          <div className="bg-gray-900 rounded-xl p-4">
            <div className="text-center mb-2">
              <span className="text-[9px] uppercase tracking-wider text-gray-500 font-medium">
                Preview
              </span>
            </div>
            <div className={cn(
              "flex justify-center py-1",
              layout === 'grid' ? 'flex-wrap gap-3' : layout === 'list' ? 'flex-col items-center gap-2' : 'flex-wrap gap-3'
            )}>
              {activeLinks.map((link) => {
                const platform = getPlatform(link.platformId);
                if (!platform) return null;
                return (
                  <motion.div 
                    key={link.platformId} 
                    className={cn(
                      "flex items-center",
                      layout === 'list' ? 'flex-row gap-2' : 'flex-col gap-1'
                    )}
                    layout
                  >
                    {renderIcon(link, platform)}
                    {showLabels && (
                      <span className="text-[9px] text-gray-400">{platform.label}</span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {activeLinkCount === 0 && !editingPlatform && (
          <motion.div 
            className="text-center py-6 px-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">Connect your socials</p>
            <p className="text-xs text-gray-400">Tap any icon above to add your social links</p>
          </motion.div>
        )}
      </div>
    );
  }

  // VIEW MODE
  const activeLinks = links.filter(link => link.value && link.value.trim() !== '');

  if (activeLinks.length === 0) {
    return null;
  }

  const spacingClasses = {
    tight: 'gap-2',
    normal: 'gap-3',
    loose: 'gap-4',
  };

  const layoutClasses = {
    row: 'flex flex-wrap justify-center',
    grid: 'grid grid-cols-4 sm:grid-cols-6 justify-items-center',
    list: 'flex flex-col items-center',
  };

  return (
    <div className="w-full px-4 py-3">
      <div className={cn(
        layoutClasses[layout as keyof typeof layoutClasses] || layoutClasses.row,
        spacingClasses[spacing as keyof typeof spacingClasses]
      )}>
        <AnimatePresence>
          {activeLinks.map((link, index) => {
            const platform = getPlatform(link.platformId);
            if (!platform) return null;

            const webUrl = platform.getUrl(link.value);
            const deepLinkUrl = useDeepLinking ? platform.getDeepLink(link.value) : webUrl;
            const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            const finalUrl = isMobile && useDeepLinking ? deepLinkUrl : webUrl;

            return (
              <motion.a
                key={link.platformId}
                href={finalUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCTA(block.id, link.customLabel || platform.label, finalUrl, 'social-links')}
                className={cn(
                  "flex items-center gap-2",
                  layout === 'list' ? 'flex-row' : 'flex-col'
                )}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
              >
                {renderIcon(link, platform)}
                {showLabels && (
                  <span className="text-[10px] sm:text-xs text-gray-600 font-medium">
                    {link.customLabel || platform.label}
                  </span>
                )}
              </motion.a>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
