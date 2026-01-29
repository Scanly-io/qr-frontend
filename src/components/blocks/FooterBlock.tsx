import type { Block } from '@/types';
import type { PageTheme } from '@/types/theme';
import { Heart, Mail, Phone, MapPin, Send } from 'lucide-react';
import { FONT_FAMILY_MAP } from '@/lib/fonts';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { spacing, shadows, animations, borders } from '@/utils/designSystem';

interface FooterBlockProps {
  block: Block;
  theme?: PageTheme;
}

interface FooterLink {
  label: string;
  url: string;
}

interface SocialLink {
  platform: string;
  url: string;
}

// Social icons as SVG paths
const socialIcons: Record<string, string> = {
  twitter: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  youtube: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  tiktok: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  github: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  discord: 'M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z',
};

export default function FooterBlock({ block, theme }: FooterBlockProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  
  // Content from block
  const text = (block.content.text as string) || '';
  const style = (block.content.style as 'simple' | 'minimal' | 'centered' | 'columns') || 'simple';
  const showBorder = (block.content.showBorder as boolean) ?? true;
  const showBranding = (block.content.showBranding as boolean) ?? true;
  
  // Links
  const links = (block.content.links as FooterLink[]) || [];
  const socialLinks = (block.content.socialLinks as SocialLink[]) || [];
  
  // Contact
  const contactEmail = (block.content.email as string) || '';
  const phone = (block.content.phone as string) || '';
  const address = (block.content.address as string) || '';
  
  // Newsletter
  const showNewsletter = (block.content.showNewsletter as boolean) ?? false;
  const newsletterTitle = (block.content.newsletterTitle as string) || 'Subscribe to updates';
  const newsletterSubtitle = (block.content.newsletterSubtitle as string) || '';
  
  // App badges
  const showAppBadges = (block.content.showAppBadges as boolean) ?? false;
  const appStoreUrl = (block.content.appStoreUrl as string) || '';
  const playStoreUrl = (block.content.playStoreUrl as string) || '';
  
  // Theme
  const siteName = theme?.branding?.siteName || 'Your Brand';
  const accentColor = theme?.button?.backgroundColor || '#8b5cf6';
  const bodyFont = theme?.typography?.bodyFont || 'inter';
  const bodyFontFamily = FONT_FAMILY_MAP[bodyFont] || "'Inter', sans-serif";
  
  const currentYear = new Date().getFullYear();
  const copyrightText = text || theme?.branding?.copyrightText || `© ${currentYear} ${siteName}. All rights reserved.`;

  // Style configurations - VISUALLY DISTINCT with proper mobile support
  const getStyleClasses = () => {
    switch (style) {
      case 'minimal':
        return {
          wrapper: 'bg-slate-50 py-6 sm:py-8',
          text: 'text-slate-500',
          heading: 'text-slate-700',
          border: showBorder ? 'border-t border-slate-200' : '',
          linkHover: 'hover:text-slate-800',
          socialBg: 'bg-white hover:bg-slate-100',
          inputBg: 'bg-white border-slate-200',
        };
      case 'centered':
        return {
          wrapper: 'bg-gradient-to-b from-slate-50 to-slate-100 py-10 sm:py-14',
          text: 'text-slate-600',
          heading: 'text-slate-800',
          border: showBorder ? 'border-t border-slate-200' : '',
          linkHover: 'hover:text-slate-900',
          socialBg: 'bg-white hover:bg-slate-50 shadow-sm',
          inputBg: 'bg-white border-slate-300',
        };
      case 'columns':
        return {
          wrapper: 'bg-slate-900 py-10 sm:py-14',
          text: 'text-slate-400',
          heading: 'text-white',
          border: '',
          linkHover: 'hover:text-white',
          socialBg: 'bg-slate-800 hover:bg-slate-700',
          inputBg: 'bg-slate-800 border-slate-700',
        };
      default: // simple
        return {
          wrapper: 'bg-white py-6 sm:py-10',
          text: 'text-slate-500',
          heading: 'text-slate-800',
          border: showBorder ? 'border-t border-slate-200' : '',
          linkHover: 'hover:text-slate-800',
          socialBg: 'bg-slate-100 hover:bg-slate-200',
          inputBg: 'bg-slate-50 border-slate-200',
        };
    }
  };

  const styles = getStyleClasses();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const renderSocialIcon = (platform: string) => {
    const path = socialIcons[platform];
    if (!path) return null;
    return (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d={path} />
      </svg>
    );
  };

  // Simple Layout - Clean responsive design
  if (style === 'simple') {
    return (
      <footer className={`w-full ${styles.wrapper} ${styles.border}`} style={{ fontFamily: bodyFontFamily }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          {/* Newsletter - Full width at top if present */}
          {showNewsletter && (
            <div className="pb-6 mb-6 border-b border-slate-200">
              <div className="max-w-md">
                <h3 className={`text-base font-semibold mb-2 ${styles.heading}`}>{newsletterTitle}</h3>
                {newsletterSubtitle && <p className={`text-sm mb-3 ${styles.text}`}>{newsletterSubtitle}</p>}
                {subscribed ? (
                  <p className="text-green-600 text-sm font-medium">✓ Subscribed successfully!</p>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 min-w-0 text-sm border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-300"
                      style={{
                        padding: `${spacing[3]} ${spacing[4]}`,
                        borderRadius: borders.radius.lg
                      }}
                      required
                    />
                    <motion.button
                      {...animations.hover.scaleSmall}
                      {...animations.tap}
                      type="submit"
                      className="text-white font-medium hover:opacity-90 whitespace-nowrap"
                      style={{ 
                        backgroundColor: accentColor,
                        padding: `${spacing[3]} ${spacing[5]}`,
                        borderRadius: borders.radius.lg,
                        boxShadow: shadows.md
                      }}
                    >
                      Subscribe
                    </motion.button>
                  </form>
                )}
              </div>
            </div>
          )}
          
          {/* Links - Wrapping grid for many links */}
          {links.length > 0 && (
            <div className="pb-5 mb-5 border-b border-slate-100">
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    className={`text-sm py-1 ${styles.linkHover} ${styles.text}`}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}
          
          {/* Social Links - Wrapping for many icons */}
          {socialLinks.length > 0 && (
            <div className="pb-5 mb-5 border-b border-slate-100">
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((social, idx) => (
                  <motion.a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`transition-all ${styles.socialBg} ${styles.text}`}
                    style={{
                      padding: spacing[3],
                      borderRadius: borders.radius.lg,
                      boxShadow: shadows.sm
                    }}
                    {...animations.hover.lift}
                  >
                    {renderSocialIcon(social.platform)}
                  </motion.a>
                ))}
              </div>
            </div>
          )}
          
          {/* App Badges */}
          {showAppBadges && (appStoreUrl || playStoreUrl) && (
            <div className="pb-5 mb-5 border-b border-slate-100">
              <div className="flex flex-wrap gap-3">
                {appStoreUrl && (
                  <a href={appStoreUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                    <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" className="h-10" />
                  </a>
                )}
                {playStoreUrl && (
                  <a href={playStoreUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" className="h-10" />
                  </a>
                )}
              </div>
            </div>
          )}
          
          {/* Bottom - Copyright & Branding */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className={`text-sm ${styles.text}`}>{copyrightText}</p>
            {showBranding && (
              <p className={`text-xs flex items-center gap-1 ${styles.text}`}>
                Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> using Scanly
              </p>
            )}
          </div>
        </div>
      </footer>
    );
  }

  // Minimal Layout - Compact responsive
  if (style === 'minimal') {
    return (
      <footer className={`w-full ${styles.wrapper} ${styles.border}`} style={{ fontFamily: bodyFontFamily }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          {/* Links row - wraps naturally */}
          {links.length > 0 && (
            <div className="pb-4 mb-4 border-b border-slate-200">
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    className={`text-sm ${styles.linkHover} ${styles.text}`}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}
          
          {/* Bottom row - stacks on mobile */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className={`text-sm ${styles.text}`}>{copyrightText}</p>
            
            {/* Social icons - wrap if many */}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-1.5 rounded transition-colors ${styles.text} ${styles.linkHover}`}
                  >
                    {renderSocialIcon(social.platform)}
                  </a>
                ))}
              </div>
            )}
          </div>
          
          {showBranding && (
            <p className={`text-xs mt-3 flex items-center gap-1 ${styles.text}`}>
              Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> using Scanly
            </p>
          )}
        </div>
      </footer>
    );
  }

  // Centered Layout - Stacked and centered, handles overflow
  if (style === 'centered') {
    return (
      <footer className={`w-full ${styles.wrapper} ${styles.border}`} style={{ fontFamily: bodyFontFamily }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          
          {/* Newsletter */}
          {showNewsletter && (
            <div className="mb-8 pb-8 border-b border-slate-200">
              <h3 className={`text-lg font-semibold mb-2 ${styles.heading}`}>{newsletterTitle}</h3>
              {newsletterSubtitle && <p className={`text-sm mb-4 ${styles.text}`}>{newsletterSubtitle}</p>}
              {subscribed ? (
                <p className="text-green-600 font-medium">✓ Subscribed successfully!</p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 min-w-0 px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400"
                    required
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-white rounded-lg font-medium hover:opacity-90 flex items-center justify-center gap-2"
                    style={{ backgroundColor: accentColor }}
                  >
                    <span>Subscribe</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}
          
          {/* Links - Grid layout for many links */}
          {links.length > 0 && (
            <div className="mb-6 pb-6 border-b border-slate-200">
              <div className={`flex flex-wrap justify-center gap-x-6 gap-y-3 ${links.length > 8 ? 'max-h-32 overflow-y-auto py-2' : ''}`}>
                {links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    className={`text-sm font-medium ${styles.linkHover} ${styles.text}`}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}
          
          {/* Social Links - Grid for many icons */}
          {socialLinks.length > 0 && (
            <div className="mb-6 pb-6 border-b border-slate-200">
              <div className={`flex flex-wrap justify-center gap-2 ${socialLinks.length > 12 ? 'max-h-24 overflow-y-auto py-2' : ''}`}>
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2.5 rounded-full ${styles.socialBg} ${styles.text} transition-all hover:scale-110`}
                  >
                    {renderSocialIcon(social.platform)}
                  </a>
                ))}
              </div>
            </div>
          )}
          
          {/* App Badges */}
          {showAppBadges && (appStoreUrl || playStoreUrl) && (
            <div className="flex flex-wrap justify-center gap-3 mb-6 pb-6 border-b border-slate-200">
              {appStoreUrl && (
                <a href={appStoreUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                  <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" className="h-10" />
                </a>
              )}
              {playStoreUrl && (
                <a href={playStoreUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" className="h-10" />
                </a>
              )}
            </div>
          )}
          
          {/* Copyright */}
          <p className={`text-sm ${styles.text}`}>{copyrightText}</p>
          
          {showBranding && (
            <p className={`text-xs mt-2 flex items-center justify-center gap-1 ${styles.text}`}>
              Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> using Scanly
            </p>
          )}
        </div>
      </footer>
    );
  }

  // Columns Layout (Dark) - Full featured with overflow handling
  return (
    <footer className={`w-full ${styles.wrapper}`} style={{ fontFamily: bodyFontFamily }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Top Section - Brand & Newsletter */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-12 pb-8 sm:pb-10 border-b border-slate-700/50">
          
          {/* Brand Section */}
          <div className="flex-shrink-0 max-w-sm">
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                style={{ backgroundColor: accentColor }}
              >
                {siteName.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-white text-xl font-bold">{siteName}</h3>
            </div>
            <p className={`text-sm ${styles.text}`}>
              Building amazing digital experiences for modern businesses.
            </p>
            
            {/* Social Links - Wrapping grid for many icons */}
            {socialLinks.length > 0 && (
              <div className={`flex flex-wrap gap-2 mt-4 ${socialLinks.length > 8 ? 'max-h-24 overflow-y-auto' : ''}`}>
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition-all text-slate-400 hover:text-white hover:scale-105"
                  >
                    {renderSocialIcon(social.platform)}
                  </a>
                ))}
              </div>
            )}
          </div>
          
          {/* Newsletter Section */}
          {showNewsletter && (
            <div className="lg:max-w-sm w-full">
              <h4 className="text-white text-base font-semibold mb-2">{newsletterTitle}</h4>
              {newsletterSubtitle && <p className={`text-sm mb-3 ${styles.text}`}>{newsletterSubtitle}</p>}
              {subscribed ? (
                <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-4 py-3 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium">Successfully subscribed!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 min-w-0 px-4 py-2.5 text-sm rounded-lg bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent"
                    required
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-sm font-semibold text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 whitespace-nowrap"
                    style={{ backgroundColor: accentColor }}
                  >
                    <span>Subscribe</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
        
        {/* Middle Section - Links & Contact */}
        {(links.length > 0 || contactEmail || phone || address) && (
          <div className="py-8 sm:py-10 border-b border-slate-700/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Quick Links - Scrollable if many */}
              {links.length > 0 && (
                <div>
                  <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h4>
                  <ul className={`space-y-2.5 ${links.length > 10 ? 'max-h-48 overflow-y-auto pr-2' : ''}`}>
                    {links.map((link, idx) => (
                      <li key={idx}>
                        <a 
                          href={link.url} 
                          className={`text-sm transition-colors inline-flex items-center gap-1.5 group ${styles.text} ${styles.linkHover}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-violet-500 transition-colors flex-shrink-0" />
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Contact Info */}
              {(contactEmail || phone || address) && (
                <div>
                  <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Get in Touch</h4>
                  <ul className="space-y-3">
                    {contactEmail && (
                      <li>
                        <a 
                          href={`mailto:${contactEmail}`} 
                          className={`text-sm flex items-center gap-3 group ${styles.text} ${styles.linkHover}`}
                        >
                          <span className="p-2 rounded-lg bg-slate-800 group-hover:bg-slate-700 transition-colors flex-shrink-0">
                            <Mail className="w-4 h-4" />
                          </span>
                          <span className="break-all">{contactEmail}</span>
                        </a>
                      </li>
                    )}
                    {phone && (
                      <li>
                        <a 
                          href={`tel:${phone}`} 
                          className={`text-sm flex items-center gap-3 group ${styles.text} ${styles.linkHover}`}
                        >
                          <span className="p-2 rounded-lg bg-slate-800 group-hover:bg-slate-700 transition-colors flex-shrink-0">
                            <Phone className="w-4 h-4" />
                          </span>
                          {phone}
                        </a>
                      </li>
                    )}
                    {address && (
                      <li className={`text-sm flex items-start gap-3 ${styles.text}`}>
                        <span className="p-2 rounded-lg bg-slate-800 flex-shrink-0">
                          <MapPin className="w-4 h-4" />
                        </span>
                        <span className="pt-1.5">{address}</span>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* App Badges */}
        {(showAppBadges && (appStoreUrl || playStoreUrl)) && (
          <div className="py-6 sm:py-8 border-b border-slate-700/50 flex flex-wrap gap-3">
            {appStoreUrl && (
              <a href={appStoreUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <img 
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
                  alt="App Store" 
                  className="h-10 sm:h-11" 
                />
              </a>
            )}
            {playStoreUrl && (
              <a href={playStoreUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                  alt="Play Store" 
                  className="h-10 sm:h-11" 
                />
              </a>
            )}
          </div>
        )}
        
        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className={`text-sm text-center sm:text-left ${styles.text}`}>{copyrightText}</p>
          
          {showBranding && (
            <p className={`text-xs flex items-center gap-1.5 ${styles.text}`}>
              Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> using Scanly
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}