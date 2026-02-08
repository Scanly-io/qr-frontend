import type { Block } from '@/types';
import type { PageTheme } from '@/types/theme';
import { Menu, X } from 'lucide-react';
import { FONT_FAMILY_MAP } from '@/lib/fonts';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { shadows, animations, borders } from '@/utils/designSystem';
import { trackCTA } from '@/utils/trackCTA';

interface HeaderBlockProps {
  block: Block;
  theme?: PageTheme;
}

interface NavLink {
  label: string;
  url: string;
}

export default function HeaderBlock({ block, theme }: HeaderBlockProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Content from block
  const siteName = (block.content.siteName as string) || theme?.branding?.siteName || 'Brand';
  const logoUrl = (block.content.logoUrl as string) || theme?.branding?.logoUrl || '';
  const navLinks = (block.content.navLinks as NavLink[]) || [];
  const style = (block.content.style as 'default' | 'minimal' | 'gradient' | 'glass' | 'transparent') || 'default';
  
  // Features
  const showAnnouncement = (block.content.showAnnouncement as boolean) ?? false;
  const announcementText = (block.content.announcementText as string) || '🎉 Special offer - 20% off today!';
  const showCta = (block.content.showCta as boolean) ?? false;
  const ctaLabel = (block.content.ctaLabel as string) || 'Get Started';
  const ctaUrl = (block.content.ctaUrl as string) || '#';
  const showSecondaryCta = (block.content.showSecondaryCta as boolean) ?? false;
  const secondaryCtaLabel = (block.content.secondaryCtaLabel as string) || 'Learn More';
  const secondaryCtaUrl = (block.content.secondaryCtaUrl as string) || '#';
  
  // Theme
  const accentColor = theme?.button?.backgroundColor || '#8b5cf6';
  const titleFont = theme?.typography?.titleFont || 'inter';
  const titleFontFamily = FONT_FAMILY_MAP[titleFont] || "'Inter', sans-serif";

  // Style configurations - VISUALLY DISTINCT
  const getStyleClasses = () => {
    switch (style) {
      case 'minimal':
        return {
          wrapper: 'bg-slate-50',
          text: 'text-slate-700',
          border: '',
          linkHover: 'hover:text-slate-900',
          mobileBg: 'bg-slate-50',
          announcementBg: 'bg-slate-800',
          announcementText: 'text-white',
        };
      case 'gradient':
        return {
          wrapper: 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600',
          text: 'text-white',
          border: '',
          linkHover: 'hover:text-white/80',
          mobileBg: 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600',
          announcementBg: 'bg-black/20',
          announcementText: 'text-white',
        };
      case 'glass':
        return {
          wrapper: 'bg-white/80 backdrop-blur-xl',
          text: 'text-slate-800',
          border: 'border-b border-slate-200/50',
          linkHover: 'hover:text-violet-600',
          mobileBg: 'bg-white/95 backdrop-blur-xl',
          announcementBg: 'bg-violet-600',
          announcementText: 'text-white',
        };
      case 'transparent':
        return {
          wrapper: 'bg-transparent',
          text: 'text-slate-800',
          border: '',
          linkHover: 'hover:text-violet-600',
          mobileBg: 'bg-white',
          announcementBg: 'bg-slate-900',
          announcementText: 'text-white',
        };
      default:
        return {
          wrapper: 'bg-white shadow-sm',
          text: 'text-slate-900',
          border: 'border-b border-slate-200',
          linkHover: 'hover:text-violet-600',
          mobileBg: 'bg-white',
          announcementBg: 'bg-slate-900',
          announcementText: 'text-white',
        };
    }
  };

  const styles = getStyleClasses();
  const isGradient = style === 'gradient';
  
  // Determine if we have too many nav links for desktop display
  const maxDesktopLinks = 6;
  const hasOverflow = navLinks.length > maxDesktopLinks;
  const visibleDesktopLinks = hasOverflow ? navLinks.slice(0, maxDesktopLinks - 1) : navLinks;
  const overflowLinks = hasOverflow ? navLinks.slice(maxDesktopLinks - 1) : [];

  return (
    <div className="w-full">
      {/* Announcement Bar */}
      {showAnnouncement && announcementText && (
        <div 
          className={`py-2 px-4 text-center text-xs sm:text-sm font-medium ${styles.announcementBg} ${styles.announcementText}`}
        >
          <span className="line-clamp-1">{announcementText}</span>
        </div>
      )}
      
      {/* Main Header */}
      <header className={`w-full ${styles.wrapper} ${styles.border}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            
            {/* Logo & Brand */}
            <a href="#" className="flex items-center gap-2 flex-shrink-0">
              {logoUrl ? (
                <img src={logoUrl} alt={siteName} className="h-7 sm:h-8 w-auto object-contain" />
              ) : (
                <div 
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: accentColor }}
                >
                  {siteName.charAt(0).toUpperCase()}
                </div>
              )}
              <span 
                className={`text-base sm:text-lg font-bold ${styles.text} hidden xs:block`}
                style={{ fontFamily: titleFontFamily }}
              >
                {siteName}
              </span>
            </a>

            {/* Desktop Navigation - Hidden on mobile, shows up to maxDesktopLinks */}
            <nav className="hidden lg:flex items-center gap-1">
              {visibleDesktopLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${styles.text} ${styles.linkHover}`}
                >
                  {link.label}
                </a>
              ))}
              
              {/* More dropdown for overflow links */}
              {hasOverflow && (
                <div className="relative group">
                  <button className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 ${styles.text} ${styles.linkHover}`}>
                    More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={`absolute right-0 top-full mt-1 py-2 w-48 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 ${
                    isGradient ? 'bg-white' : 'bg-white border border-slate-200'
                  }`}>
                    {overflowLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              
              {/* CTA Buttons */}
              {(showCta || showSecondaryCta) && (
                <div className="flex items-center gap-2 ml-3">
                  {showSecondaryCta && secondaryCtaLabel && (
                    <motion.a
                      {...animations.hover.scaleSmall}
                      {...animations.tap}
                      href={secondaryCtaUrl}
                      onClick={() => trackCTA(block.id, secondaryCtaLabel, secondaryCtaUrl, 'header')}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg border-2 transition-all ${
                        isGradient 
                          ? 'border-white/60 text-white hover:bg-white/10' 
                          : 'hover:bg-slate-50'
                      }`}
                      style={{ 
                        borderColor: isGradient ? undefined : accentColor,
                        color: isGradient ? undefined : accentColor,
                        borderRadius: borders.radius.lg
                      }}
                    >
                      {secondaryCtaLabel}
                    </motion.a>
                  )}
                  {showCta && ctaLabel && (
                    <motion.a
                      {...animations.hover.scaleSmall}
                      {...animations.tap}
                      href={ctaUrl}
                      onClick={() => trackCTA(block.id, ctaLabel, ctaUrl, 'header')}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                        isGradient 
                          ? 'bg-white text-violet-600 hover:bg-slate-50' 
                          : 'text-white hover:opacity-90'
                      }`}
                      style={{ 
                        backgroundColor: isGradient ? undefined : accentColor,
                        borderRadius: borders.radius.lg,
                        boxShadow: shadows.md
                      }}
                    >
                      {ctaLabel}
                    </motion.a>
                  )}
                </div>
              )}
            </nav>

            {/* Mobile Menu Button - Always visible on mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${styles.text}`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Full screen overlay style */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              {...animations.slideDown}
              exit={{ opacity: 0, height: 0 }}
              className={`lg:hidden overflow-hidden ${styles.mobileBg}`}
            >
              <div className={`px-4 py-4 ${isGradient ? 'border-t border-white/10' : 'border-t border-slate-100'}`}>
                
                {/* Scrollable nav links container */}
                <div className="max-h-[60vh] overflow-y-auto space-y-1 -mx-1 px-1">
                  {navLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-3 text-base font-medium rounded-xl transition-colors ${styles.text} ${
                        isGradient ? 'hover:bg-white/10 active:bg-white/20' : 'hover:bg-slate-100 active:bg-slate-200'
                      }`}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
                
                {/* CTA Buttons - Sticky at bottom */}
                {(showCta || showSecondaryCta) && (
                  <div className="pt-4 mt-4 border-t border-slate-200/20 space-y-2">
                    {showSecondaryCta && secondaryCtaLabel && (
                      <a
                        href={secondaryCtaUrl}
                        onClick={() => { trackCTA(block.id, secondaryCtaLabel, secondaryCtaUrl, 'header'); setMobileMenuOpen(false); }}
                        className={`block w-full py-3 text-center text-base font-semibold rounded-xl border-2 transition-colors ${
                          isGradient 
                            ? 'border-white/60 text-white active:bg-white/10' 
                            : 'active:bg-slate-50'
                        }`}
                        style={{ 
                          borderColor: isGradient ? undefined : accentColor,
                          color: isGradient ? undefined : accentColor 
                        }}
                      >
                        {secondaryCtaLabel}
                      </a>
                    )}
                    {showCta && ctaLabel && (
                      <a
                        href={ctaUrl}
                        onClick={() => { trackCTA(block.id, ctaLabel, ctaUrl, 'header'); setMobileMenuOpen(false); }}
                        className={`block w-full py-3 text-center text-base font-semibold rounded-xl transition-colors ${
                          isGradient 
                            ? 'bg-white text-violet-600 active:bg-slate-100' 
                            : 'text-white active:opacity-80'
                        }`}
                        style={{ backgroundColor: isGradient ? undefined : accentColor }}
                      >
                        {ctaLabel}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
}