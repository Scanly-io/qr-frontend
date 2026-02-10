import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, BadgeCheck, MapPin } from 'lucide-react';
import type { Block } from '@/types';
import type { PageTheme } from '@/types/theme';
import { FONT_FAMILY_MAP } from '@/lib/fonts';
import { spacing, animations } from '@/utils/designSystem';

interface ProfileBlockProps {
  block: Block;
  isEditing?: boolean;
  theme?: PageTheme;
}

export default function ProfileBlock({ block, theme }: ProfileBlockProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const content = block.content || {};
  
  // Content with type assertions
  const name = (content.name as string) || (content.displayName as string) || 'Your Name';
  const bio = content.bio as string;
  const avatarUrl = content.avatarUrl as string;
  const verified = content.verified as boolean;
  const pronouns = content.pronouns as string;
  const location = content.location as string;
  
  // Settings from block.style or defaults
  const blockStyle = block.style || {};
  const avatarSize = (blockStyle.avatarSize as string) || 'large';
  const alignment = (blockStyle.alignment as string) || 'center';
  const showBorder = (blockStyle.showBorder as boolean) !== false;
  const borderAnimation = (blockStyle.borderAnimation as string) || 'glow';
  
  // Theme-based styling
  const textColor = theme?.typography?.titleColor || '#000000';
  const secondaryTextColor = theme?.typography?.bodyColor || '#6b7280';
  const accentColor = theme?.branding?.primaryColor || theme?.button?.backgroundColor || '#8b5cf6';
  
  // Get theme font or default
  const titleFontId = theme?.typography?.titleFont || 'inter';
  const titleFontFamily = FONT_FAMILY_MAP[titleFontId] || FONT_FAMILY_MAP['inter'];
  const bodyFontId = theme?.typography?.bodyFont || 'inter';
  const bodyFontFamily = FONT_FAMILY_MAP[bodyFontId] || FONT_FAMILY_MAP['inter'];
  
  // Avatar sizes - larger and more prominent
  const sizeMap: Record<string, { container: number; text: string }> = {
    small: { container: 80, text: 'text-xl' },
    medium: { container: 104, text: 'text-2xl' },
    large: { container: 128, text: 'text-3xl' },
    xlarge: { container: 160, text: 'text-4xl' },
  };
  
  const size = sizeMap[avatarSize] || sizeMap.large;
  
  // Alignment classes
  const alignmentClasses: Record<string, string> = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  };

  const getBorderStyle = (): React.CSSProperties => {
    if (!showBorder) return {};
    
    switch (borderAnimation) {
      case 'glow':
        return {
          boxShadow: isHovered 
            ? `0 0 0 4px ${accentColor}30, 0 0 32px ${accentColor}60, 0 0 64px ${accentColor}40`
            : `0 0 0 3px ${accentColor}25, 0 0 24px ${accentColor}40`,
          transition: 'box-shadow 0.3s ease',
        };
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
          padding: '4px',
        };
      case 'double':
        return {
          boxShadow: `0 0 0 3px white, 0 0 0 5px ${accentColor}`,
        };
      default:
        return {
          boxShadow: `0 0 0 4px ${accentColor}`,
        };
    }
  };

  return (
    <motion.div
      className={'flex flex-col py-8 px-4 ' + (alignmentClasses[alignment] || alignmentClasses.center)}
      {...animations.fadeIn}
      style={{ gap: spacing[4] }}
    >
      {/* Avatar with enhanced styling */}
      <motion.div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...animations.hover.lift}
      >
        <div
          className="rounded-full overflow-hidden flex items-center justify-center relative"
          style={{
            width: size.container,
            height: size.container,
            backgroundColor: imageError || !avatarUrl ? `${accentColor}15` : 'transparent',
            ...getBorderStyle(),
          }}
        >
          {/* Glassmorphic overlay on hover */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
          
          {avatarUrl && !imageError ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <User 
              className="opacity-30" 
              style={{ 
                width: size.container * 0.45, 
                height: size.container * 0.45,
                color: textColor,
              }} 
            />
          )}
        </div>
        
        {/* Verified badge with gradient */}
        {verified && (
          <motion.div
            className="absolute -bottom-2 -right-2 rounded-full p-1 shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.1, rotate: 10 }}
          >
            <BadgeCheck 
              className="w-7 h-7 sm:w-8 sm:h-8" 
              style={{ color: 'white' }}
              fill="white"
              stroke="#3b82f6"
              strokeWidth={1.5}
            />
          </motion.div>
        )}
        
        {/* Animated ring on hover */}
        {isHovered && showBorder && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: 1.15, opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{
              border: `2px solid ${accentColor}`,
            }}
          />
        )}
      </motion.div>
      
      {/* Name with gradient effect option */}
      <motion.div
        className="flex items-center gap-2 flex-wrap justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <h1 
          className={'font-bold ' + size.text + ' leading-tight bg-clip-text'}
          style={{ 
            color: textColor,
            fontFamily: titleFontFamily,
          }}
        >
          {name}
        </h1>
        {pronouns && (
          <motion.span 
            className="text-sm px-3 py-1.5 rounded-full font-medium shadow-md"
            style={{ 
              background: `${accentColor}15`,
              color: secondaryTextColor,
              border: `1px solid ${accentColor}20`,
            }}
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            {pronouns}
          </motion.span>
        )}
      </motion.div>
      
      {/* Location with icon */}
      {location && (
        <motion.div
          className="flex items-center gap-2 text-sm font-medium"
          style={{ color: secondaryTextColor }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            className="flex items-center justify-center w-6 h-6 rounded-lg"
            style={{ background: `${accentColor}15` }}
            whileHover={{ rotate: 10, scale: 1.1 }}
          >
            <MapPin className="w-4 h-4" style={{ color: accentColor }} />
          </motion.div>
          {location}
        </motion.div>
      )}
      
      {/* Bio with better typography */}
      {bio && (
        <motion.p
          className="text-sm sm:text-base max-w-md leading-relaxed font-normal"
          style={{ 
            color: secondaryTextColor,
            fontFamily: bodyFontFamily,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          {bio}
        </motion.p>
      )}
    </motion.div>
  );
}
