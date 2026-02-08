import type { Block } from '@/types';
import type { PageTheme } from '@/types/theme';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Music, Disc3, Heart, ExternalLink,
  Headphones, ChevronLeft, ChevronRight, Shuffle
} from 'lucide-react';
import { useState } from 'react';
import { FONT_FAMILY_MAP } from '@/lib/fonts';
import { 
  spacing, 
  borders, 
  animations, 
  getCardStyles
} from '../../utils/designSystem';
import { usePayment } from '@/contexts/PaymentContext';
import { useAuthStore } from '@/store/authStore';

interface ArtistBlockProps {
  block: Block;
  theme?: PageTheme;
  micrositeId?: string;
}

interface Track {
  id?: string;
  title: string;
  artist?: string;
  album?: string;
  duration?: string;
  coverArt?: string;
  previewUrl?: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  plays?: number;
  explicit?: boolean;
  featured?: boolean;
}

interface ArtworkItem {
  id?: string;
  title: string;
  image: string;
  description?: string;
  price?: number | string;
  forSale?: boolean;
  medium?: string;
  dimensions?: string;
  year?: number;
}

// Helper to determine if background is dark
function isDarkBackground(theme?: PageTheme): boolean {
  const bgColor = theme?.background?.color || theme?.background?.gradientFrom || '#ffffff';
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) || 255;
  const g = parseInt(hex.substr(2, 2), 16) || 255;
  const b = parseInt(hex.substr(4, 2), 16) || 255;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}

// Format number with K/M suffix
function formatPlays(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export default function ArtistBlock({ block, theme, micrositeId }: ArtistBlockProps) {
  // Get user ID from auth store for creator identification
  const user = useAuthStore((state) => state.user);
  const creatorId = user?.id || 'anonymous';
  
  // Content
  const type = (block.content.type as 'music' | 'visual-art' | 'mixed') || 'music';
  const tracks = (block.content.tracks as Track[]) || [];
  const artworks = (block.content.artworks as ArtworkItem[]) || [];
  const artistName = (block.content.artistName as string) || 'Artist Name';
  const genre = (block.content.genre as string) || '';
  
  // Default sample data
  const sampleTracks: Track[] = tracks.length > 0 ? tracks : [
    { title: 'Midnight Dreams', duration: '3:45', plays: 1250000, featured: true, coverArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400' },
    { title: 'Electric Soul', duration: '4:12', plays: 890000, coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400' },
    { title: 'Neon Lights', duration: '3:28', plays: 654000, explicit: true, coverArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400' },
    { title: 'Echoes of Time', duration: '5:01', plays: 445000, coverArt: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400' },
  ];

  const sampleArtworks: ArtworkItem[] = artworks.length > 0 ? artworks : [
    { title: 'Abstract Dreams', image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600', medium: 'Oil on Canvas', price: 2500, forSale: true, dimensions: '24" x 36"' },
    { title: 'Urban Flow', image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600', medium: 'Digital Art', price: 800, forSale: true },
    { title: 'Serenity', image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=600', medium: 'Watercolor', year: 2023 },
    { title: 'Momentum', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600', medium: 'Acrylic', price: 1800, forSale: true },
  ];

  const displayTracks = sampleTracks;
  const displayArtworks = sampleArtworks;

  // Payment integration
  const { quickPurchase, isCheckoutLoading } = usePayment();

  // Handle artwork purchase
  const handlePurchaseArtwork = async (artwork: ArtworkItem) => {
    if (!artwork.price || !artwork.forSale) return;

    const price = typeof artwork.price === 'number' 
      ? artwork.price 
      : parseFloat(String(artwork.price).replace(/[^0-9.]/g, ''));

    if (isNaN(price) || price <= 0) {
      console.error('Invalid price:', artwork.price);
      return;
    }

    await quickPurchase(
      {
        id: artwork.id || `artwork-${artwork.title}`,
        type: 'artwork',
        name: artwork.title,
        price,
        currency: 'USD',
        description: artwork.description || `${artwork.medium}${artwork.dimensions ? ` • ${artwork.dimensions}` : ''}`,
        image: artwork.image,
        metadata: {
          creatorId,
          micrositeId: micrositeId || 'unknown',
          artistName,
          medium: artwork.medium,
          dimensions: artwork.dimensions,
          year: artwork.year,
        },
      },
      {
        creatorId,
        micrositeId: micrositeId || 'unknown',
        artistName,
      }
    );
  };

  // State
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [likedTracks, setLikedTracks] = useState<Set<number>>(new Set());
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [hoveredTrack, setHoveredTrack] = useState<number | null>(null);

  // Configuration
  const style = (block.content.style as 'spotify' | 'vinyl' | 'minimal' | 'gallery' | 'compact') || 'spotify';
  const showPlays = (block.content.showPlays as boolean) ?? true;

  // Theme integration
  const primaryColor = theme?.branding?.primaryColor || theme?.button?.backgroundColor || '#1DB954'; // Spotify green default
  const titleFont = theme?.typography?.titleFont || 'inter';
  const titleFontFamily = FONT_FAMILY_MAP[titleFont] || "'Inter', sans-serif";
  
  const isDark = isDarkBackground(theme);
  // Enhanced contrast for better readability
  const titleColor = theme?.typography?.titleColor || (isDark ? '#ffffff' : '#09090b');
  const bodyColor = theme?.typography?.bodyColor || (isDark ? '#d4d4d8' : '#52525b');
  const cardBg = isDark ? 'rgba(255,255,255,0.1)' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';

  const toggleLike = (index: number) => {
    setLikedTracks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) newSet.delete(index);
      else newSet.add(index);
      return newSet;
    });
  };

  // ===== SPOTIFY STYLE =====
  if (style === 'spotify') {
    const cardStyles = getCardStyles(isDark);
    
    return (
      <div style={{ paddingTop: spacing[6], paddingBottom: spacing[6] }}>
        {/* Now Playing Card */}
        <motion.div
          initial={animations.slideUp.initial}
          animate={animations.slideUp.animate}
          transition={animations.spring.gentle}
          className="overflow-hidden"
          style={{
            ...cardStyles,
            borderRadius: borders.radius['2xl'],
            marginBottom: spacing[6],
          }}
        >
          <div className="flex flex-col">
            {/* Album Art */}
            <div className="w-full aspect-square relative">
              <img 
                src={displayTracks[currentTrack]?.coverArt || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400'} 
                alt={displayTracks[currentTrack]?.title}
                className="w-full h-full object-cover"
              />
              <motion.button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: primaryColor }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white fill-white" />
                ) : (
                  <Play className="w-6 h-6 text-white fill-white ml-1" />
                )}
              </motion.button>
            </div>
            
            {/* Track Info */}
            <div className="flex-1 p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs font-medium mb-1" style={{ color: primaryColor }}>
                    NOW PLAYING
                  </p>
                  <h3 
                    className="text-xl font-bold"
                    style={{ fontFamily: titleFontFamily, color: titleColor }}
                  >
                    {displayTracks[currentTrack]?.title}
                  </h3>
                  <p className="text-sm" style={{ color: bodyColor }}>
                    {artistName} {displayTracks[currentTrack]?.album && `• ${displayTracks[currentTrack]?.album}`}
                  </p>
                </div>
                <motion.button
                  onClick={() => toggleLike(currentTrack)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart 
                    className={`w-6 h-6 ${likedTracks.has(currentTrack) ? 'fill-red-500 text-red-500' : ''}`}
                    style={{ color: likedTracks.has(currentTrack) ? '#EF4444' : bodyColor }}
                  />
                </motion.button>
              </div>
              
              {/* Progress bar */}
              <div className="mt-4">
                <div 
                  className="h-1 rounded-full overflow-hidden"
                  style={{ backgroundColor: cardBorder }}
                >
                  <motion.div 
                    className="h-full rounded-full"
                    style={{ backgroundColor: primaryColor }}
                    initial={{ width: '0%' }}
                    animate={{ width: isPlaying ? '65%' : '35%' }}
                    transition={{ duration: isPlaying ? 60 : 0.5 }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs" style={{ color: bodyColor }}>
                  <span>1:23</span>
                  <span>{displayTracks[currentTrack]?.duration || '3:45'}</span>
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex items-center justify-center gap-4 mt-4">
                <motion.button
                  className="p-2"
                  style={{ color: bodyColor }}
                  whileHover={{ scale: 1.1, color: titleColor }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Shuffle className="w-5 h-5" />
                </motion.button>
                <motion.button
                  onClick={() => setCurrentTrack(Math.max(0, currentTrack - 1))}
                  className="p-2"
                  style={{ color: titleColor }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SkipBack className="w-6 h-6 fill-current" />
                </motion.button>
                <motion.button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: primaryColor }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white fill-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white fill-white ml-1" />
                  )}
                </motion.button>
                <motion.button
                  onClick={() => setCurrentTrack(Math.min(displayTracks.length - 1, currentTrack + 1))}
                  className="p-2"
                  style={{ color: titleColor }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SkipForward className="w-6 h-6 fill-current" />
                </motion.button>
                <motion.button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2"
                  style={{ color: bodyColor }}
                  whileHover={{ scale: 1.1, color: titleColor }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Track List */}
        <div className="space-y-1">
          {displayTracks.map((track, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              onMouseEnter={() => setHoveredTrack(idx)}
              onMouseLeave={() => setHoveredTrack(null)}
              onClick={() => { setCurrentTrack(idx); setIsPlaying(true); }}
              className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all ${
                currentTrack === idx ? 'ring-1' : ''
              }`}
              style={{
                backgroundColor: hoveredTrack === idx || currentTrack === idx ? cardBg : 'transparent',
                borderColor: primaryColor,
              }}
            >
              {/* Track number / Play icon */}
              <div className="w-8 text-center">
                {hoveredTrack === idx || currentTrack === idx ? (
                  currentTrack === idx && isPlaying ? (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 0.5 }}
                    >
                      <Disc3 className="w-5 h-5 animate-spin" style={{ color: primaryColor }} />
                    </motion.div>
                  ) : (
                    <Play className="w-5 h-5 mx-auto" style={{ color: primaryColor }} />
                  )
                ) : (
                  <span className="text-sm" style={{ color: bodyColor }}>{idx + 1}</span>
                )}
              </div>
              
              {/* Cover art */}
              <img 
                src={track.coverArt || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100'}
                alt={track.title}
                className="w-10 h-10 rounded object-cover"
              />
              
              {/* Track info */}
              <div className="flex-1 min-w-0">
                <h4 
                  className={`font-medium line-clamp-1 ${currentTrack === idx ? '' : ''}`}
                  style={{ 
                    fontFamily: titleFontFamily, 
                    color: currentTrack === idx ? primaryColor : titleColor 
                  }}
                >
                  {track.title}
                  {track.explicit && (
                    <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold bg-zinc-700 text-zinc-300 rounded">
                      E
                    </span>
                  )}
                </h4>
                <p className="text-xs line-clamp-1" style={{ color: bodyColor }}>
                  {artistName}
                </p>
              </div>
              
              {/* Plays */}
              {showPlays && track.plays && (
                <span className="text-sm" style={{ color: bodyColor }}>
                  {formatPlays(track.plays)}
                </span>
              )}
              
              {/* Like button */}
              <motion.button
                onClick={(e) => { e.stopPropagation(); toggleLike(idx); }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart 
                  className={`w-4 h-4 ${likedTracks.has(idx) ? 'fill-red-500 text-red-500' : ''}`}
                  style={{ color: likedTracks.has(idx) ? '#EF4444' : bodyColor }}
                />
              </motion.button>
              
              {/* Duration */}
              <span className="text-sm w-12 text-right" style={{ color: bodyColor }}>
                {track.duration}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // ===== VINYL STYLE =====
  if (style === 'vinyl') {
    return (
      <div className="py-6">
        <div className="flex flex-col items-center mb-8">
          {/* Vinyl record animation */}
          <div className="relative w-64 h-64">
            {/* Record disc */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900"
              style={{
                boxShadow: 'inset 0 0 60px rgba(0,0,0,0.5), 0 0 20px rgba(0,0,0,0.3)',
              }}
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              {/* Grooves */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full border border-zinc-700/30"
                  style={{
                    inset: `${20 + i * 8}px`,
                  }}
                />
              ))}
              
              {/* Center label */}
              <div 
                className="absolute inset-1/4 rounded-full flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: primaryColor }}
              >
                <img 
                  src={displayTracks[currentTrack]?.coverArt || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200'}
                  alt=""
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-zinc-900" />
                </div>
              </div>
            </motion.div>
            
            {/* Tone arm */}
            <motion.div
              className="absolute -right-4 -top-2 w-24 h-2 origin-right"
              style={{ backgroundColor: '#71717a' }}
              animate={{ rotate: isPlaying ? -25 : -45 }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute left-0 w-4 h-4 -mt-1 rounded-full bg-zinc-500" />
              <div className="absolute right-0 w-1 h-4 -mt-1 bg-zinc-400" />
            </motion.div>
          </div>
          
          {/* Now playing info */}
          <div className="mt-8 text-center">
            <h3 
              className="text-2xl font-bold mb-1"
              style={{ fontFamily: titleFontFamily, color: titleColor }}
            >
              {displayTracks[currentTrack]?.title}
            </h3>
            <p style={{ color: bodyColor }}>{artistName}</p>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-6 mt-6">
            <motion.button
              onClick={() => setCurrentTrack(Math.max(0, currentTrack - 1))}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <SkipBack className="w-8 h-8" style={{ color: titleColor }} />
            </motion.button>
            <motion.button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: primaryColor }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-white fill-white" />
              ) : (
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              )}
            </motion.button>
            <motion.button
              onClick={() => setCurrentTrack(Math.min(displayTracks.length - 1, currentTrack + 1))}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <SkipForward className="w-8 h-8" style={{ color: titleColor }} />
            </motion.button>
          </div>
        </div>
        
        {/* Track list - horizontal scroll */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {displayTracks.map((track, idx) => (
            <motion.div
              key={idx}
              onClick={() => { setCurrentTrack(idx); setIsPlaying(true); }}
              className={`flex-shrink-0 w-32 cursor-pointer ${currentTrack === idx ? 'scale-105' : ''}`}
              whileHover={{ scale: 1.05 }}
            >
              <div 
                className="aspect-square rounded-lg overflow-hidden mb-2"
                style={{ 
                  boxShadow: currentTrack === idx ? `0 4px 20px ${primaryColor}40` : '0 4px 10px rgba(0,0,0,0.1)',
                }}
              >
                <img 
                  src={track.coverArt || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200'}
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 
                className="font-medium text-sm line-clamp-1"
                style={{ color: currentTrack === idx ? primaryColor : titleColor }}
              >
                {track.title}
              </h4>
              <p className="text-xs line-clamp-1" style={{ color: bodyColor }}>
                {track.duration}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // ===== GALLERY STYLE (Visual Art) =====
  if (style === 'gallery' || type === 'visual-art') {
    return (
      <div className="py-6">
        {/* Gallery grid */}
        <div className="grid grid-cols-1 gap-4">
          {displayArtworks.map((artwork, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              onClick={() => setLightboxIndex(idx)}
              className="cursor-pointer group"
            >
              <div 
                className="aspect-[4/5] rounded-xl overflow-hidden relative"
                style={{
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                }}
              >
                <img 
                  src={artwork.image}
                  alt={artwork.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <h4 className="font-semibold text-white">{artwork.title}</h4>
                  {artwork.medium && (
                    <p className="text-sm text-white/70">{artwork.medium}</p>
                  )}
                  {artwork.forSale && artwork.price && (
                    <p className="text-sm font-bold mt-1" style={{ color: primaryColor }}>
                      ${typeof artwork.price === 'number' ? artwork.price.toLocaleString() : artwork.price}
                    </p>
                  )}
                </div>
                
                {/* For sale badge */}
                {artwork.forSale && (
                  <div 
                    className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    For Sale
                  </div>
                )}
              </div>
              
              <div className="mt-3">
                <h4 
                  className="font-medium"
                  style={{ fontFamily: titleFontFamily, color: titleColor }}
                >
                  {artwork.title}
                </h4>
                <p className="text-sm" style={{ color: bodyColor }}>
                  {artwork.medium} {artwork.year && `• ${artwork.year}`}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Lightbox */}
        <AnimatePresence>
          {lightboxIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              onClick={() => setLightboxIndex(null)}
            >
              <motion.button
                onClick={() => setLightboxIndex(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10"
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <span className="text-white text-2xl">×</span>
              </motion.button>
              
              <motion.button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(Math.max(0, lightboxIndex - 1)); }}
                className="absolute left-4 p-3 rounded-full bg-white/10"
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </motion.button>
              
              <motion.button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(Math.min(displayArtworks.length - 1, lightboxIndex + 1)); }}
                className="absolute right-4 p-3 rounded-full bg-white/10"
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </motion.button>
              
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="max-w-4xl max-h-[80vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <img 
                  src={displayArtworks[lightboxIndex].image}
                  alt={displayArtworks[lightboxIndex].title}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                />
                <div className="mt-4 text-center">
                  <h3 className="text-xl font-bold text-white">
                    {displayArtworks[lightboxIndex].title}
                  </h3>
                  <p className="text-white/70">
                    {displayArtworks[lightboxIndex].medium}
                    {displayArtworks[lightboxIndex].dimensions && ` • ${displayArtworks[lightboxIndex].dimensions}`}
                  </p>
                  {displayArtworks[lightboxIndex].forSale && displayArtworks[lightboxIndex].price && (
                    <motion.button
                      onClick={() => handlePurchaseArtwork(displayArtworks[lightboxIndex])}
                      disabled={isCheckoutLoading}
                      className="mt-4 px-6 py-2 rounded-full text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: primaryColor }}
                      whileHover={{ scale: isCheckoutLoading ? 1 : 1.05 }}
                      whileTap={{ scale: isCheckoutLoading ? 1 : 0.95 }}
                    >
                      {isCheckoutLoading ? (
                        <span className="flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          />
                          Processing...
                        </span>
                      ) : (
                        <>
                          Purchase • ${typeof displayArtworks[lightboxIndex].price === 'number' 
                            ? displayArtworks[lightboxIndex].price.toLocaleString() 
                            : displayArtworks[lightboxIndex].price}
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ===== MINIMAL STYLE =====
  if (style === 'minimal') {
    return (
      <div className="py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${primaryColor}20` }}
          >
            <Music className="w-8 h-8" style={{ color: primaryColor }} />
          </div>
          <div>
            <h3 
              className="text-xl font-bold"
              style={{ fontFamily: titleFontFamily, color: titleColor }}
            >
              {artistName || 'My Music'}
            </h3>
            {genre && (
              <p className="text-sm" style={{ color: bodyColor }}>{genre}</p>
            )}
          </div>
        </div>
        
        {/* Simple list */}
        <div className="space-y-2">
          {displayTracks.map((track, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => { setCurrentTrack(idx); setIsPlaying(true); }}
              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
              style={{
                backgroundColor: currentTrack === idx ? `${primaryColor}15` : 'transparent',
              }}
              whileHover={{ backgroundColor: `${primaryColor}10` }}
            >
              <div className="w-8 text-center">
                {currentTrack === idx && isPlaying ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                  >
                    <Headphones className="w-5 h-5" style={{ color: primaryColor }} />
                  </motion.div>
                ) : (
                  <span className="text-sm" style={{ color: bodyColor }}>{idx + 1}</span>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 
                  className="font-medium line-clamp-1"
                  style={{ color: currentTrack === idx ? primaryColor : titleColor }}
                >
                  {track.title}
                </h4>
              </div>
              
              <span className="text-sm" style={{ color: bodyColor }}>{track.duration}</span>
              
              {track.spotifyUrl && (
                <motion.a
                  href={track.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1"
                  whileHover={{ scale: 1.1 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-4 h-4" style={{ color: bodyColor }} />
                </motion.a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // ===== COMPACT STYLE =====
  return (
    <div className="py-6">
      {/* Horizontal scroll of album covers */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {displayTracks.map((track, idx) => (
          <motion.div
            key={idx}
            onClick={() => { setCurrentTrack(idx); setIsPlaying(!isPlaying || currentTrack !== idx); }}
            className="flex-shrink-0 w-28 cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <div 
              className="aspect-square rounded-xl overflow-hidden relative"
              style={{
                boxShadow: currentTrack === idx ? `0 4px 20px ${primaryColor}50` : '0 4px 15px rgba(0,0,0,0.1)',
                border: currentTrack === idx ? `2px solid ${primaryColor}` : 'none',
              }}
            >
              <img 
                src={track.coverArt || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200'}
                alt={track.title}
                className="w-full h-full object-cover"
              />
              
              {/* Play overlay */}
              {currentTrack === idx && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-white fill-white" />
                  ) : (
                    <Play className="w-8 h-8 text-white fill-white" />
                  )}
                </div>
              )}
            </div>
            
            <h4 
              className="mt-2 text-sm font-medium line-clamp-1"
              style={{ color: currentTrack === idx ? primaryColor : titleColor }}
            >
              {track.title}
            </h4>
            <p className="text-xs line-clamp-1" style={{ color: bodyColor }}>
              {track.duration}
            </p>
          </motion.div>
        ))}
      </div>
      
      {/* Mini player */}
      {currentTrack !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-3 rounded-xl mt-4"
          style={{
            backgroundColor: cardBg,
            border: `1px solid ${cardBorder}`,
          }}
        >
          <img 
            src={displayTracks[currentTrack]?.coverArt || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100'}
            alt={displayTracks[currentTrack]?.title}
            className="w-12 h-12 rounded-lg object-cover"
          />
          
          <div className="flex-1 min-w-0">
            <h4 
              className="font-medium text-sm line-clamp-1"
              style={{ color: titleColor }}
            >
              {displayTracks[currentTrack]?.title}
            </h4>
            <p className="text-xs" style={{ color: bodyColor }}>{artistName}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => toggleLike(currentTrack)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart 
                className={`w-5 h-5 ${likedTracks.has(currentTrack) ? 'fill-red-500 text-red-500' : ''}`}
                style={{ color: likedTracks.has(currentTrack) ? '#EF4444' : bodyColor }}
              />
            </motion.button>
            <motion.button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: primaryColor }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white fill-white" />
              ) : (
                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
              )}
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

