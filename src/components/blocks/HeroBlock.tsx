import type { Block } from '@/types';
import type { PageTheme } from '@/types/theme';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Play, ArrowRight, Sparkles, Star, Zap, ChevronDown, MousePointer2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  spacing, 
  borders, 
  animations, 
  getPrimaryShadow 
} from '@/utils/designSystem';
import { getTitleFont, getBodyFont } from '@/lib/themeHelpers';

interface HeroBlockProps {
  block: Block;
  theme?: PageTheme;
  colorPalette?: {
    button: { fill: string };
  };
}

// Pre-computed floating particles for performance
const generateParticles = () => {
  return Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: (i * 5) % 100,
    top: (i * 7 + 10) % 100,
    size: 2 + (i % 3) * 2,
    duration: 3 + (i % 4) * 2,
    delay: (i % 5) * 0.5,
  }));
};

const PARTICLES = generateParticles();

export default function HeroBlock({ block, theme, colorPalette }: HeroBlockProps) {
  const headline = (block.content.headline as string) || 'Welcome to Our Platform';
  const subheadline = (block.content.subheadline as string) || 'Create stunning experiences that captivate your audience';
  const backgroundImage = (block.content.backgroundImage as string) || '';
  const backgroundVideo = (block.content.backgroundVideo as string) || '';
  const buttonText = (block.content.buttonText as string) || 'Get Started';
  const buttonUrl = (block.content.buttonUrl as string) || '#';
  const secondaryButtonText = (block.content.secondaryButtonText as string) || '';
  const secondaryButtonUrl = (block.content.secondaryButtonUrl as string) || '#';
  const alignment = (block.content.alignment as 'left' | 'center' | 'right') || 'center';
  const height = (block.content.height as 'small' | 'medium' | 'large' | 'full') || 'large';
  const overlay = (block.content.overlay as boolean) ?? true;
  const overlayOpacity = (block.content.overlayOpacity as number) ?? 0.4;
  const overlayColor = (block.content.overlayColor as string) || '#000000';
  const headlineSize = (block.content.headlineSize as 'small' | 'medium' | 'large' | 'xlarge') || 'large';
  const fontWeight = (block.content.fontWeight as 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold') || 'bold';
  const showBadge = (block.content.showBadge as boolean) ?? false;
  const badgeText = (block.content.badgeText as string) || '✨ New Feature';
  const pattern = (block.content.pattern as 'none' | 'dots' | 'grid' | 'gradient' | 'particles' | 'waves') || 'none';
  const buttonColor = colorPalette?.button?.fill || '#6366f1';
  const buttonTextColor = '#ffffff';
  const showScrollIndicator = (block.content.showScrollIndicator as boolean) ?? false;

  // Theme fonts
  const titleFontFamily = getTitleFont(theme);
  const bodyFontFamily = getBodyFont(theme);

  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const backgroundX = useTransform(mouseX, [-0.5, 0.5], [-20, 20]);
  const backgroundY = useTransform(mouseY, [-0.5, 0.5], [-20, 20]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const heightMap = {
    small: 'min-h-[320px]',
    medium: 'min-h-[420px]',
    large: 'min-h-[520px]',
    full: 'min-h-[640px]',
  };

  const alignmentMap = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  };

  const contentAlignmentMap = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  };

  const justifyMap = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  const headlineSizeMap = {
    small: 'text-2xl sm:text-3xl md:text-4xl',
    medium: 'text-3xl sm:text-4xl md:text-5xl',
    large: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl',
    xlarge: 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl',
  };

  const fontWeightMap = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
  };

  // Animated text characters
  const headlineWords = headline.split(' ');

  const getPatternOverlay = () => {
    switch (pattern) {
      case 'dots':
        return (
          <div 
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
        );
      case 'grid':
        return (
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          />
        );
      case 'gradient':
        return (
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: [
                'radial-gradient(ellipse at 0% 0%, rgba(139,92,246,0.4) 0%, transparent 50%)',
                'radial-gradient(ellipse at 100% 100%, rgba(139,92,246,0.4) 0%, transparent 50%)',
                'radial-gradient(ellipse at 0% 100%, rgba(59,130,246,0.4) 0%, transparent 50%)',
                'radial-gradient(ellipse at 100% 0%, rgba(59,130,246,0.4) 0%, transparent 50%)',
                'radial-gradient(ellipse at 0% 0%, rgba(139,92,246,0.4) 0%, transparent 50%)',
              ]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          />
        );
      case 'particles':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {PARTICLES.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full bg-white/40"
                style={{
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                  width: particle.size,
                  height: particle.size,
                }}
                animate={{
                  y: [-20, 20, -20],
                  x: [-10, 10, -10],
                  opacity: [0.2, 0.6, 0.2],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        );
      case 'waves':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <motion.path
                fill="rgba(255,255,255,0.1)"
                animate={{
                  d: [
                    "M0,160L48,176C96,192,192,224,288,229.3C384,235,480,213,576,181.3C672,149,768,107,864,112C960,117,1056,171,1152,181.3C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                    "M0,192L48,208C96,224,192,256,288,245.3C384,235,480,181,576,160C672,139,768,149,864,165.3C960,181,1056,203,1152,208C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                  ]
                }}
                transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
              />
            </svg>
            <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <motion.path
                fill="rgba(255,255,255,0.05)"
                animate={{
                  d: [
                    "M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,234.7C672,245,768,235,864,208C960,181,1056,139,1152,128C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                    "M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,197.3C672,213,768,235,864,229.3C960,224,1056,192,1152,176C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                  ]
                }}
                transition={{ duration: 7, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
              />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const hasBackground = backgroundImage || backgroundVideo;
  
  // Check if headline should use gradient (when no custom background)
  const useGradientText = !hasBackground;

  // Cursor glow effect position
  const glowStyle = isHovered ? {
    background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1), transparent 40%)`,
  } : {};

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative ${heightMap[height]} rounded-2xl overflow-hidden flex ${alignmentMap[alignment]} ${justifyMap[alignment]} p-6 sm:p-8 md:p-12 transition-all group`}
      style={!hasBackground ? {
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4c1d95 60%, #581c87 100%)',
      } : backgroundImage && !backgroundVideo ? { 
        backgroundImage: `url(${backgroundImage})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      } : undefined}
    >
      {/* Vibrant gradient background with animation */}
      {!hasBackground && (
        <>
          {/* Base gradient layer */}
          <motion.div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 25%, #a855f7 50%, #d946ef 75%, #c026d3 100%)',
              backgroundSize: '200% 200%',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          {/* Animated gradient orbs overlay */}
          <motion.div 
            className="absolute inset-0 opacity-40"
            animate={{
              background: [
                'radial-gradient(ellipse at 20% 30%, rgba(168,85,247,0.6) 0%, transparent 50%)',
                'radial-gradient(ellipse at 80% 70%, rgba(217,70,239,0.6) 0%, transparent 50%)',
                'radial-gradient(ellipse at 50% 50%, rgba(192,38,211,0.6) 0%, transparent 50%)',
                'radial-gradient(ellipse at 20% 30%, rgba(168,85,247,0.6) 0%, transparent 50%)',
              ]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      {/* Parallax Background Image */}
      {backgroundImage && !backgroundVideo && (
        <motion.div 
          className="absolute inset-[-20px]"
          style={{ 
            backgroundImage: `url(${backgroundImage})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            x: backgroundX,
            y: backgroundY,
          }}
        />
      )}

      {/* Background Video with overlay */}
      {backgroundVideo && (
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover scale-105"
          >
            <source src={backgroundVideo} type="video/mp4" />
          </video>
          {/* Video vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        </div>
      )}

      {/* Overlay */}
      {overlay && (
        <motion.div 
          className="absolute inset-0 transition-opacity duration-500" 
          style={{ 
            backgroundColor: overlayColor,
            opacity: overlayOpacity 
          }}
          animate={{ opacity: isHovered ? overlayOpacity * 0.8 : overlayOpacity }}
        />
      )}

      {/* Mouse follow glow */}
      <div className="absolute inset-0 pointer-events-none transition-opacity duration-300" style={glowStyle} />

      {/* Pattern Overlay */}
      {getPatternOverlay()}

      {/* Decorative floating elements */}
      <motion.div 
        className="absolute top-[10%] right-[10%] w-20 h-20 rounded-full pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
          backdropFilter: 'blur(10px)',
        }}
        animate={{
          y: [0, -20, 0],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div 
        className="absolute bottom-[15%] left-[5%] w-12 h-12 rounded-full pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(59,130,246,0.2))',
        }}
        animate={{
          y: [0, 15, 0],
          x: [0, 10, 0],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div 
        className="absolute top-[30%] left-[15%] w-8 h-8 pointer-events-none"
        animate={{
          y: [0, -10, 0],
          rotate: [0, -10, 10, 0],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Star className="w-full h-full text-white/20" />
      </motion.div>
      <motion.div 
        className="absolute bottom-[25%] right-[12%] w-6 h-6 pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Zap className="w-full h-full text-yellow-300/40" />
      </motion.div>

      {/* Ambient glow blobs - vibrant violet/fuchsia */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-fuchsia-500/15 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Content */}
      <div className={`relative z-10 max-w-4xl ${contentAlignmentMap[alignment]} flex flex-col ${alignmentMap[alignment]} gap-5 sm:gap-6`}>
        {/* Badge with vibrant gradient glow */}
        <AnimatePresence>
          {showBadge && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="relative inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-semibold overflow-hidden shadow-lg"
              style={{
                background: hasBackground 
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))' 
                  : 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(168,85,247,0.2))',
                backdropFilter: 'blur(12px)',
                border: '2px solid rgba(255,255,255,0.3)',
              }}
            >
              {/* Badge shimmer */}
              <motion.div
                className="absolute inset-0 -translate-x-full"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                }}
                animate={{ x: ['0%', '200%'] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
              />
              {/* Gradient glow pulse */}
              <motion.div
                className="absolute inset-0 rounded-full opacity-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(139,92,246,0.4), rgba(217,70,239,0.3))',
                  filter: 'blur(8px)',
                }}
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 text-yellow-300 drop-shadow-glow" />
              </motion.div>
              <span className="relative drop-shadow-sm">{badgeText}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animated Headline with optional gradient */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            headlineSizeMap[headlineSize],
            fontWeightMap[fontWeight],
            "leading-[1.1] tracking-tight",
            useGradientText 
              ? "bg-gradient-to-r from-white via-violet-100 to-fuchsia-100 bg-clip-text text-transparent"
              : "text-white"
          )}
          style={{ fontFamily: titleFontFamily }}
        >
          {headlineWords.map((word, wordIdx) => (
            <motion.span
              key={wordIdx}
              className="inline-block mr-[0.25em]"
              initial={{ opacity: 0, y: 40, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                delay: 0.3 + wordIdx * 0.08,
                duration: 0.6,
                ease: [0.215, 0.61, 0.355, 1],
              }}
              style={{
                textShadow: hasBackground ? '0 4px 30px rgba(0,0,0,0.5)' : '0 8px 40px rgba(139,92,246,0.4)',
                filter: useGradientText ? 'drop-shadow(0 4px 20px rgba(139,92,246,0.3))' : 'none',
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subheadline with fade and enhanced readability */}
        {subheadline && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className={cn(
              "text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed",
              hasBackground ? "text-white/90" : "text-white/95",
            )}
            style={{
              fontFamily: bodyFontFamily,
              textShadow: hasBackground ? '0 2px 20px rgba(0,0,0,0.3)' : '0 2px 15px rgba(139,92,246,0.2)',
            }}
          >
            {subheadline}
          </motion.p>
        )}

        {/* Premium Buttons using our Button component */}
        {(buttonText || secondaryButtonText) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 ${
              alignment === 'left' ? 'justify-start' : 
              alignment === 'right' ? 'justify-end' : 
              'justify-center'
            }`}
          >
            {buttonText && (
              <motion.div
                whileHover={{ 
                  scale: 1.05, 
                  y: -4,
                  transition: animations.spring.bouncy 
                }}
                whileTap={{ 
                  scale: 0.95,
                  transition: animations.spring.snappy
                }}
              >
                <Button
                  asChild
                  size="lg"
                  className="group relative px-7 sm:px-9 py-6 sm:py-7 font-semibold text-sm sm:text-base overflow-hidden"
                  style={{
                    backgroundColor: buttonColor,
                    color: buttonTextColor,
                    borderRadius: borders.radius.lg,
                    boxShadow: getPrimaryShadow(buttonColor, 'normal'),
                  }}
                >
                  <a href={buttonUrl} className="inline-flex items-center gap-2">
                    <span className="relative z-10 drop-shadow-sm">{buttonText}</span>
                    <motion.span
                      className="relative z-10"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow-sm" />
                    </motion.span>
                  </a>
                </Button>
              </motion.div>
            )}
            
            {secondaryButtonText && (
              <motion.div
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  transition: animations.spring.bouncy
                }}
                whileTap={{ 
                  scale: 0.98,
                  transition: animations.spring.snappy
                }}
              >
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="group relative px-7 sm:px-9 py-6 sm:py-7 font-semibold text-sm sm:text-base text-white overflow-hidden border-2"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.08))',
                    backdropFilter: 'blur(12px)',
                    borderColor: 'rgba(255,255,255,0.3)',
                    borderRadius: borders.radius.lg,
                    boxShadow: 'rgba(255,255,255,0.1) 0px 8px 24px',
                  }}
                >
                  <a href={secondaryButtonUrl} className="inline-flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Play className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow-sm" />
                    </motion.div>
                    <span className="drop-shadow-sm">{secondaryButtonText}</span>
                    {/* Hover border glow */}
                    <motion.div
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        border: '2px solid rgba(255,255,255,0.5)',
                        boxShadow: '0 0 20px rgba(255,255,255,0.2)',
                      }}
                    />
                  </a>
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Enhanced scroll indicator with glow */}
        {showScrollIndicator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="relative flex flex-col items-center gap-1"
            >
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 rounded-full blur-lg opacity-0"
                style={{
                  background: 'radial-gradient(circle, rgba(139,92,246,0.6), transparent)',
                }}
                animate={{ opacity: [0, 0.8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="relative flex flex-col items-center gap-1 px-4 py-2.5 rounded-full backdrop-blur-sm"
                   style={{
                     background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
                     border: '1px solid rgba(255,255,255,0.2)',
                   }}>
                <MousePointer2 className="w-5 h-5 text-white/90 drop-shadow-glow" />
                <ChevronDown className="w-4 h-4 text-white/80 drop-shadow-glow" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/30 via-black/10 to-transparent pointer-events-none" />
      
      {/* Top subtle vignette */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />

      {/* Corner accents */}
      <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-white/10 rounded-tl-lg pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-white/10 rounded-br-lg pointer-events-none" />
    </motion.div>
  );
}
