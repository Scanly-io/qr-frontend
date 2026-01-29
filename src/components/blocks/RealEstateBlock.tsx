import type { Block } from '@/types';
import type { PageTheme } from '@/types/theme';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, MapPin, Bed, Bath, Square, Car, Heart, Share2, 
  Phone, Mail, ChevronLeft, ChevronRight, 
  Building2, Trees, Landmark, Store, CheckCircle2, Clock, 
  XCircle, Sparkles, Star, Maximize2, ExternalLink, type LucideIcon
} from 'lucide-react';
import { useState } from 'react';
import { FONT_FAMILY_MAP } from '@/lib/fonts';
import { 
  spacing, 
  typography, 
  shadows, 
  borders, 
  animations, 
  colors,
  getCardStyles,
  getTextColor,
  getPrimaryShadow,
  staggerContainer,
  staggerItem
} from '../../utils/designSystem';

interface RealEstateBlockProps {
  block: Block;
  theme?: PageTheme;
}

interface PropertyItem {
  id?: string;
  title: string;
  address?: string;
  price: string | number;
  priceLabel?: string; // "For Sale", "For Rent", "/month"
  status?: 'available' | 'sold' | 'pending' | 'rented';
  type?: 'house' | 'apartment' | 'condo' | 'land' | 'commercial';
  images: string[];
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  parking?: number;
  yearBuilt?: number;
  description?: string;
  features?: string[];
  agent?: {
    name: string;
    phone?: string;
    email?: string;
    photo?: string;
  };
  virtualTourUrl?: string;
  featured?: boolean;
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

// Format price
function formatPrice(price: string | number): string {
  if (typeof price === 'string') return price;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

export default function RealEstateBlock({ block, theme }: RealEstateBlockProps) {
  const properties = (block.content.properties as PropertyItem[]) || [
    {
      title: 'Modern Luxury Villa',
      address: '123 Palm Beach Drive, Miami, FL',
      price: 2500000,
      priceLabel: 'For Sale',
      status: 'available',
      type: 'house',
      images: [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      ],
      bedrooms: 5,
      bathrooms: 4,
      sqft: 4500,
      parking: 3,
      yearBuilt: 2022,
      description: 'Stunning modern villa with ocean views, featuring an infinity pool, smart home technology, and premium finishes throughout.',
      features: ['Pool', 'Ocean View', 'Smart Home', 'Wine Cellar', 'Home Theater'],
      agent: {
        name: 'Sarah Johnson',
        phone: '+1 (555) 123-4567',
        email: 'sarah@realestate.com',
      },
      featured: true,
    },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState<Record<number, number>>({});
  const [likedProperties, setLikedProperties] = useState<Set<number>>(new Set());
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [hoveredProperty, setHoveredProperty] = useState<number | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0); // Moved to top level to follow React hooks rules

  // Configuration
  const layout = (block.content.layout as 'grid' | 'list' | 'carousel' | 'featured' | 'showcase') || 'grid';
  const style = (block.content.style as 'elegant' | 'modern' | 'minimal' | 'cards' | 'magazine') || 'elegant';
  const columns = (block.content.columns as 1 | 2 | 3) || 2;
  const showAgent = (block.content.showAgent as boolean) ?? true;
  const showFeatures = (block.content.showFeatures as boolean) ?? true;

  // Theme integration
  const primaryColor = theme?.branding?.primaryColor || theme?.button?.backgroundColor || '#6366f1';
  const titleFont = theme?.typography?.titleFont || 'inter';
  const bodyFont = theme?.typography?.bodyFont || 'inter';
  const titleFontFamily = FONT_FAMILY_MAP[titleFont] || "'Inter', sans-serif";
  const bodyFontFamily = FONT_FAMILY_MAP[bodyFont] || "'Inter', sans-serif";
  
  const isDark = isDarkBackground(theme);
  // Enhanced contrast for much better readability
  const titleColor = theme?.typography?.titleColor || (isDark ? '#ffffff' : '#0a0a0a');
  const bodyColor = theme?.typography?.bodyColor || (isDark ? '#e4e4e7' : '#3f3f46');
  // Improved card backgrounds with better contrast
  const cardBg = isDark ? 'rgba(255,255,255,0.12)' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)';

  // Image navigation
  const nextImage = (propIndex: number, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [propIndex]: ((prev[propIndex] || 0) + 1) % totalImages
    }));
  };

  const prevImage = (propIndex: number, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [propIndex]: ((prev[propIndex] || 0) - 1 + totalImages) % totalImages
    }));
  };

  // Toggle like
  const toggleLike = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedProperties(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Status badge with icon
  const getStatusConfig = (status?: string) => {
    switch (status) {
      case 'available': 
        return { bg: '#10B981', text: '#ffffff', icon: CheckCircle2, label: 'Available' };
      case 'sold': 
        return { bg: '#EF4444', text: '#ffffff', icon: XCircle, label: 'Sold' };
      case 'pending': 
        return { bg: '#F59E0B', text: '#ffffff', icon: Clock, label: 'Pending' };
      case 'rented': 
        return { bg: '#6366F1', text: '#ffffff', icon: CheckCircle2, label: 'Rented' };
      default: 
        return { bg: primaryColor, text: '#ffffff', icon: CheckCircle2, label: status || 'Available' };
    }
  };

  // Property type icon
  const getTypeConfig = (type?: string) => {
    switch (type) {
      case 'house': return { icon: Home, label: 'House' };
      case 'apartment': return { icon: Building2, label: 'Apartment' };
      case 'condo': return { icon: Landmark, label: 'Condo' };
      case 'land': return { icon: Trees, label: 'Land' };
      case 'commercial': return { icon: Store, label: 'Commercial' };
      default: return { icon: Home, label: 'Property' };
    }
  };

  // Grid columns - Mobile first (single column only)
  const gridColsMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-1',
    3: 'grid-cols-1',
  };

  // Render property card
  const renderPropertyCard = (property: PropertyItem, index: number) => {
    const isHovered = hoveredProperty === index;
    const isLiked = likedProperties.has(index);
    const currentImg = currentImageIndex[index] || 0;
    const statusConfig = getStatusConfig(property.status);
    const typeConfig = getTypeConfig(property.type);
    const StatusIcon = statusConfig.icon;
    const TypeIcon = typeConfig.icon;

    // ===== ELEGANT STYLE =====
    if (style === 'elegant') {
      return (
        <motion.div
          key={index}
          initial={animations.fadeIn.initial}
          animate={animations.fadeIn.animate}
          transition={{ ...animations.spring.gentle, delay: index * 0.1 }}
          whileHover={{ 
            y: -8,
            transition: animations.spring.snappy 
          }}
          onMouseEnter={() => setHoveredProperty(index)}
          onMouseLeave={() => setHoveredProperty(null)}
          onClick={() => setSelectedProperty(index)}
          className="cursor-pointer group"
        >
          <div 
            className="overflow-hidden"
            style={{
              ...getCardStyles(isDark, isHovered, primaryColor),
              borderRadius: borders.radius['2xl'],
              transition: `all ${animations.duration.base}ms ${animations.easing.smooth}`,
            }}
          >
            {/* Image Gallery */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <motion.img
                key={currentImg}
                src={property.images[currentImg]}
                alt={property.title}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Image navigation */}
              {property.images.length > 1 && (
                <>
                  <motion.button
                    onClick={(e) => { e.stopPropagation(); prevImage(index, property.images.length); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full backdrop-blur-xl shadow-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronLeft className="w-6 h-6 text-zinc-800" />
                  </motion.button>
                  <motion.button
                    onClick={(e) => { e.stopPropagation(); nextImage(index, property.images.length); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full backdrop-blur-xl shadow-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronRight className="w-6 h-6 text-zinc-800" />
                  </motion.button>
                  
                  {/* Image dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 backdrop-blur-xl rounded-full px-3 py-2" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    {property.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => ({ ...prev, [index]: i })); }}
                        className={`rounded-full transition-all ${i === currentImg ? 'w-6 h-2' : 'w-2 h-2'}`}
                        style={{ backgroundColor: i === currentImg ? '#ffffff' : 'rgba(255,255,255,0.5)' }}
                      />
                    ))}
                  </div>
                </>
              )}
              
              {/* Top badges */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                <div className="flex flex-wrap gap-2">
                  {property.featured && (
                    <span 
                      className="px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 backdrop-blur-xl shadow-lg"
                      style={{ backgroundColor: primaryColor, color: '#fff' }}
                    >
                      <Star className="w-4 h-4 fill-current" /> Featured
                    </span>
                  )}
                  {property.type && (
                    <span 
                      className="px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 backdrop-blur-xl shadow-lg"
                      style={{ backgroundColor: 'rgba(255,255,255,0.95)', color: '#1f2937' }}
                    >
                      <TypeIcon className="w-4 h-4" /> {typeConfig.label}
                    </span>
                  )}
                  {property.status && (
                    <span 
                      className="px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 backdrop-blur-xl shadow-lg"
                      style={{ backgroundColor: statusConfig.bg, color: statusConfig.text }}
                    >
                      <StatusIcon className="w-4 h-4" /> {statusConfig.label}
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <motion.button
                    onClick={(e) => toggleLike(index, e)}
                    className="w-10 h-10 rounded-full backdrop-blur-xl shadow-lg flex items-center justify-center"
                    style={{ backgroundColor: isLiked ? '#ef4444' : 'rgba(255,255,255,0.95)' }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Heart 
                      className={`w-5 h-5 transition-colors ${isLiked ? 'fill-white text-white' : 'text-zinc-700'}`} 
                    />
                  </motion.button>
                  <motion.button
                    onClick={(e) => e.stopPropagation()}
                    className="w-10 h-10 rounded-full backdrop-blur-xl shadow-lg flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Share2 className="w-5 h-5 text-zinc-700" />
                  </motion.button>
                </div>
              </div>
              
              {/* Price overlay */}
              <div className="absolute bottom-4 left-4">
                <div className="flex items-baseline gap-2 backdrop-blur-xl rounded-2xl px-4 py-2.5 shadow-2xl" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                  <span className="text-3xl font-black text-white" style={{ fontFamily: titleFontFamily }}>
                    {formatPrice(property.price)}
                  </span>
                  {property.priceLabel && (
                    <span className="text-base text-white/90 font-semibold">{property.priceLabel}</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <h3 
                className="font-bold text-xl mb-2 line-clamp-2"
                style={{ fontFamily: titleFontFamily, color: titleColor }}
              >
                {property.title}
              </h3>
              
              {property.address && (
                <div className="flex items-center gap-2 mb-5" style={{ color: bodyColor }}>
                  <MapPin className="w-5 h-5 flex-shrink-0" style={{ color: primaryColor }} />
                  <span className="text-base line-clamp-1 font-medium">{property.address}</span>
                </div>
              )}
              
              {/* Property specs */}
              <div 
                className="grid grid-cols-2 gap-3 py-3 border-t border-b mb-4"
                style={{ borderColor: cardBorder }}
              >
                {property.bedrooms !== undefined && (
                  <div className="flex items-center gap-1.5">
                    <Bed className="w-4 h-4 flex-shrink-0" style={{ color: primaryColor }} />
                    <span className="text-sm font-medium truncate" style={{ color: bodyColor }}>{property.bedrooms} Beds</span>
                  </div>
                )}
                {property.bathrooms !== undefined && (
                  <div className="flex items-center gap-1.5">
                    <Bath className="w-4 h-4 flex-shrink-0" style={{ color: primaryColor }} />
                    <span className="text-sm font-medium truncate" style={{ color: bodyColor }}>{property.bathrooms} Baths</span>
                  </div>
                )}
                {property.sqft !== undefined && (
                  <div className="flex items-center gap-1.5">
                    <Square className="w-4 h-4 flex-shrink-0" style={{ color: primaryColor }} />
                    <span className="text-sm font-medium truncate" style={{ color: bodyColor }}>{property.sqft.toLocaleString()} sqft</span>
                  </div>
                )}
                {property.parking !== undefined && (
                  <div className="flex items-center gap-1.5">
                    <Car className="w-4 h-4 flex-shrink-0" style={{ color: primaryColor }} />
                    <span className="text-sm font-medium truncate" style={{ color: bodyColor }}>{property.parking} Cars</span>
                  </div>
                )}
              </div>
              
              {/* Features pills */}
              {showFeatures && property.features && property.features.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {property.features.slice(0, 4).map((feature, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1.5 rounded-full text-sm font-semibold"
                      style={{ 
                        backgroundColor: `${primaryColor}20`,
                        color: primaryColor 
                      }}
                    >
                      {feature}
                    </span>
                  ))}
                  {property.features.length > 4 && (
                    <span 
                      className="px-3 py-1.5 rounded-full text-sm font-semibold"
                      style={{ 
                        backgroundColor: `${bodyColor}15`,
                        color: bodyColor 
                      }}
                    >
                      +{property.features.length - 4} more
                    </span>
                  )}
                </div>
              )}
              
              {/* Agent info */}
              {showAgent && property.agent && (
                <div 
                  className="flex items-center justify-between pt-5"
                  style={{ borderTop: `2px solid ${cardBorder}` }}
                >
                  <div className="flex items-center gap-3">
                    {property.agent.photo ? (
                      <img 
                        src={property.agent.photo} 
                        alt={property.agent.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-offset-2"
                        style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                      />
                    ) : (
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {property.agent.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-base font-bold" style={{ color: titleColor }}>
                        {property.agent.name}
                      </p>
                      <p className="text-sm font-medium" style={{ color: bodyColor }}>Agent</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {property.agent.phone && (
                      <motion.a
                        href={`tel:${property.agent.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="w-11 h-11 rounded-full flex items-center justify-center shadow-md"
                        style={{ backgroundColor: `${primaryColor}20` }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Phone className="w-5 h-5" style={{ color: primaryColor }} />
                      </motion.a>
                    )}
                    {property.agent.email && (
                      <motion.a
                        href={`mailto:${property.agent.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="w-11 h-11 rounded-full flex items-center justify-center shadow-md"
                        style={{ backgroundColor: `${primaryColor}20` }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Mail className="w-5 h-5" style={{ color: primaryColor }} />
                      </motion.a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      );
    }

    // ===== MODERN STYLE =====
    if (style === 'modern') {
      return (
        <motion.div
          key={index}
          initial={animations.fadeIn.initial}
          animate={animations.fadeIn.animate}
          transition={{ ...animations.spring.gentle, delay: index * 0.1 }}
          whileHover={{ 
            y: -8,
            transition: animations.spring.snappy 
          }}
          onMouseEnter={() => setHoveredProperty(index)}
          onMouseLeave={() => setHoveredProperty(null)}
          className="cursor-pointer group"
        >
          <div 
            className="relative overflow-hidden"
            style={{
              ...getCardStyles(isDark, true, primaryColor),
              borderRadius: borders.radius['2xl'],
            }}
          >
            {/* Full image background */}
            <div className="aspect-[3/4] relative">
              <img
                src={property.images[currentImg]}
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              
              {/* Top actions */}
              <div className="absolute top-4 left-4 right-4 flex justify-between">
                <div className="flex gap-2">
                  {property.featured && (
                    <motion.span 
                      className="px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md"
                      style={{ backgroundColor: `${primaryColor}cc`, color: '#fff' }}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      ✨ Featured
                    </motion.span>
                  )}
                </div>
                <motion.button
                  onClick={(e) => toggleLike(index, e)}
                  className="w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center"
                  style={{ backgroundColor: isLiked ? '#EF4444' : 'rgba(255,255,255,0.2)' }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-white text-white' : 'text-white'}`} />
                </motion.button>
              </div>
              
              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                {/* Price tag */}
                <div className="inline-block mb-3">
                  <span 
                    className="text-3xl font-bold text-white"
                    style={{ fontFamily: titleFontFamily }}
                  >
                    {formatPrice(property.price)}
                  </span>
                  {property.priceLabel && (
                    <span className="text-white/70 text-sm ml-2">{property.priceLabel}</span>
                  )}
                </div>
                
                <h3 
                  className="font-bold text-xl text-white mb-2"
                  style={{ fontFamily: titleFontFamily }}
                >
                  {property.title}
                </h3>
                
                {property.address && (
                  <div className="flex items-center gap-2 text-white/80 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{property.address}</span>
                  </div>
                )}
                
                {/* Specs bar */}
                <div className="flex gap-6 text-white/90">
                  {property.bedrooms !== undefined && (
                    <div className="flex items-center gap-2">
                      <Bed className="w-5 h-5" />
                      <span className="text-sm font-medium">{property.bedrooms}</span>
                    </div>
                  )}
                  {property.bathrooms !== undefined && (
                    <div className="flex items-center gap-2">
                      <Bath className="w-5 h-5" />
                      <span className="text-sm font-medium">{property.bathrooms}</span>
                    </div>
                  )}
                  {property.sqft !== undefined && (
                    <div className="flex items-center gap-2">
                      <Maximize2 className="w-5 h-5" />
                      <span className="text-sm font-medium">{property.sqft.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    // ===== MINIMAL STYLE =====
    if (style === 'minimal') {
      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onMouseEnter={() => setHoveredProperty(index)}
          onMouseLeave={() => setHoveredProperty(null)}
          className="cursor-pointer group"
        >
          {/* Clean image */}
          <div className="aspect-[16/10] rounded-xl overflow-hidden mb-4">
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          
          {/* Minimal content */}
          <div className="flex justify-between items-start">
            <div>
              <h3 
                className="font-semibold mb-1"
                style={{ fontFamily: titleFontFamily, color: titleColor }}
              >
                {property.title}
              </h3>
              {property.address && (
                <p className="text-sm" style={{ color: bodyColor }}>{property.address}</p>
              )}
              <div className="flex gap-3 mt-2 text-sm" style={{ color: bodyColor }}>
                {property.bedrooms && <span>{property.bedrooms} bd</span>}
                {property.bathrooms && <span>{property.bathrooms} ba</span>}
                {property.sqft && <span>{property.sqft.toLocaleString()} sqft</span>}
              </div>
            </div>
            <div className="text-right">
              <p 
                className="font-bold text-lg"
                style={{ fontFamily: titleFontFamily, color: primaryColor }}
              >
                {formatPrice(property.price)}
              </p>
              {property.status && (
                <span 
                  className="text-xs flex items-center gap-1"
                  style={{ color: statusConfig.bg }}
                >
                  <StatusIcon className="w-3 h-3" />
                  {statusConfig.label}
                </span>
              )}
            </div>
          </div>
          
          {/* Hover underline */}
          <motion.div
            className="h-0.5 mt-4 rounded-full"
            style={{ backgroundColor: primaryColor }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      );
    }

    // ===== CARDS STYLE =====
    if (style === 'cards') {
      return (
        <motion.div
          key={index}
          initial={animations.fadeIn.initial}
          animate={animations.fadeIn.animate}
          transition={{ ...animations.spring.gentle, delay: index * 0.1 }}
          whileHover={{ 
            y: -8,
            scale: 1.01,
            transition: animations.spring.bouncy
          }}
          onMouseEnter={() => setHoveredProperty(index)}
          onMouseLeave={() => setHoveredProperty(null)}
          className="cursor-pointer"
        >
          <div 
            className="overflow-hidden"
            style={{
              ...getCardStyles(isDark, isHovered, primaryColor),
              borderRadius: borders.radius.xl,
            }}
          >
            {/* Image */}
            <div className="aspect-video relative overflow-hidden">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              {property.status && (
                <span 
                  className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 backdrop-blur-xl shadow-lg"
                  style={{ backgroundColor: statusConfig.bg, color: statusConfig.text }}
                >
                  <StatusIcon className="w-4 h-4" />
                  {statusConfig.label}
                </span>
              )}
              <motion.button
                onClick={(e) => toggleLike(index, e)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-zinc-600'}`} />
              </motion.button>
            </div>
            
            {/* Content */}
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 
                  className="font-semibold line-clamp-1"
                  style={{ fontFamily: titleFontFamily, color: titleColor }}
                >
                  {property.title}
                </h3>
                <span 
                  className="font-bold whitespace-nowrap"
                  style={{ color: primaryColor }}
                >
                  {formatPrice(property.price)}
                </span>
              </div>
              
              {property.address && (
                <div className="flex items-center gap-1.5 mb-3">
                  <MapPin className="w-4 h-4" style={{ color: primaryColor }} />
                  <span className="text-sm line-clamp-1" style={{ color: bodyColor }}>
                    {property.address}
                  </span>
                </div>
              )}
              
              <div className="flex gap-4 text-sm" style={{ color: bodyColor }}>
                {property.bedrooms !== undefined && (
                  <span className="flex items-center gap-1">
                    <Bed className="w-4 h-4" style={{ color: primaryColor }} />
                    {property.bedrooms}
                  </span>
                )}
                {property.bathrooms !== undefined && (
                  <span className="flex items-center gap-1">
                    <Bath className="w-4 h-4" style={{ color: primaryColor }} />
                    {property.bathrooms}
                  </span>
                )}
                {property.sqft !== undefined && (
                  <span className="flex items-center gap-1">
                    <Square className="w-4 h-4" style={{ color: primaryColor }} />
                    {property.sqft.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    // ===== MAGAZINE STYLE (List view) =====
    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        onMouseEnter={() => setHoveredProperty(index)}
        onMouseLeave={() => setHoveredProperty(null)}
        className="cursor-pointer group"
      >
        <div 
          className="flex gap-5 p-4 rounded-2xl transition-all duration-300"
          style={{
            backgroundColor: isHovered ? cardBg : 'transparent',
            border: `1px solid ${isHovered ? primaryColor + '30' : 'transparent'}`,
          }}
        >
          {/* Image */}
          <div className="w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 
                className="font-semibold text-lg line-clamp-1"
                style={{ fontFamily: titleFontFamily, color: titleColor }}
              >
                {property.title}
              </h3>
              <span 
                className="font-bold text-lg whitespace-nowrap"
                style={{ color: primaryColor }}
              >
                {formatPrice(property.price)}
              </span>
            </div>
            
            {property.address && (
              <div className="flex items-center gap-1.5 mb-3">
                <MapPin className="w-4 h-4" style={{ color: primaryColor }} />
                <span className="text-sm" style={{ color: bodyColor }}>{property.address}</span>
              </div>
            )}
            
            <div className="flex gap-5 text-sm" style={{ color: bodyColor }}>
              {property.bedrooms !== undefined && (
                <span className="flex items-center gap-1.5">
                  <Bed className="w-4 h-4" style={{ color: primaryColor }} />
                  {property.bedrooms} Beds
                </span>
              )}
              {property.bathrooms !== undefined && (
                <span className="flex items-center gap-1.5">
                  <Bath className="w-4 h-4" style={{ color: primaryColor }} />
                  {property.bathrooms} Baths
                </span>
              )}
              {property.sqft !== undefined && (
                <span className="flex items-center gap-1.5">
                  <Square className="w-4 h-4" style={{ color: primaryColor }} />
                  {property.sqft.toLocaleString()} sqft
                </span>
              )}
            </div>
          </div>
          
          {/* Action */}
          <motion.div 
            className="self-center"
            animate={{ x: isHovered ? 5 : 0 }}
          >
            <ExternalLink className="w-5 h-5" style={{ color: primaryColor }} />
          </motion.div>
        </div>
      </motion.div>
    );
  };

  // ===== GRID LAYOUT =====
  if (layout === 'grid') {
    return (
      <div className="py-6">
        <div className={`grid ${gridColsMap[columns]} gap-6`}>
          {properties.map((property, index) => renderPropertyCard(property, index))}
        </div>
      </div>
    );
  }

  // ===== LIST LAYOUT =====
  if (layout === 'list') {
    return (
      <div className="py-6">
        <div className="space-y-4">
          {properties.map((property, index) => renderPropertyCard(property, index))}
        </div>
      </div>
    );
  }

  // ===== CAROUSEL LAYOUT =====
  if (layout === 'carousel') {
    return (
      <div className="py-6 relative">
        <div className="overflow-hidden">
          <motion.div
            className="flex gap-6"
            animate={{ x: `-${carouselIndex * 100}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {properties.map((property, index) => (
              <div key={index} className="w-full flex-shrink-0">
                {renderPropertyCard(property, index)}
              </div>
            ))}
          </motion.div>
        </div>
        
        {properties.length > 1 && (
          <div className="flex justify-center gap-3 mt-6">
            <motion.button
              onClick={() => setCarouselIndex((prev) => (prev - 1 + properties.length) % properties.length)}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-5 h-5" style={{ color: bodyColor }} />
            </motion.button>
            
            <div className="flex items-center gap-2">
              {properties.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCarouselIndex(i)}
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: i === carouselIndex ? 24 : 8,
                    backgroundColor: i === carouselIndex ? primaryColor : (isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.15)'),
                  }}
                />
              ))}
            </div>
            
            <motion.button
              onClick={() => setCarouselIndex((prev) => (prev + 1) % properties.length)}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-5 h-5" style={{ color: bodyColor }} />
            </motion.button>
          </div>
        )}
      </div>
    );
  }

  // ===== FEATURED LAYOUT (Hero + Grid) =====
  if (layout === 'featured' && properties.length > 0) {
    const featuredProperty = properties.find(p => p.featured) || properties[0];
    const otherProperties = properties.filter(p => p !== featuredProperty);
    
    return (
      <div className="py-6 space-y-6">
        {/* Featured property - large */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="cursor-pointer group"
        >
          <div 
            className="rounded-3xl overflow-hidden"
            style={{
              backgroundColor: cardBg,
              border: `1px solid ${cardBorder}`,
            }}
          >
            <div className="grid grid-cols-1 gap-0">
              {/* Large image */}
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  src={featuredProperty.images[0]}
                  alt={featuredProperty.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span 
                    className="px-4 py-2 rounded-full text-base font-bold backdrop-blur-xl shadow-lg"
                    style={{ backgroundColor: primaryColor, color: '#fff' }}
                  >
                    ✨ Featured Listing
                  </span>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-8 flex flex-col justify-center">
                <span 
                  className="text-3xl font-bold mb-2"
                  style={{ fontFamily: titleFontFamily, color: primaryColor }}
                >
                  {formatPrice(featuredProperty.price)}
                </span>
                <h2 
                  className="text-2xl font-bold mb-3"
                  style={{ fontFamily: titleFontFamily, color: titleColor }}
                >
                  {featuredProperty.title}
                </h2>
                {featuredProperty.address && (
                  <div className="flex items-center gap-2 mb-4" style={{ color: bodyColor }}>
                    <MapPin className="w-5 h-5" style={{ color: primaryColor }} />
                    <span>{featuredProperty.address}</span>
                  </div>
                )}
                
                <div className="flex gap-6 mb-6">
                  {featuredProperty.bedrooms !== undefined && (
                    <div className="text-center">
                      <Bed className="w-6 h-6 mx-auto mb-1" style={{ color: primaryColor }} />
                      <span className="text-lg font-semibold" style={{ color: titleColor }}>{featuredProperty.bedrooms}</span>
                      <p className="text-xs" style={{ color: bodyColor }}>Beds</p>
                    </div>
                  )}
                  {featuredProperty.bathrooms !== undefined && (
                    <div className="text-center">
                      <Bath className="w-6 h-6 mx-auto mb-1" style={{ color: primaryColor }} />
                      <span className="text-lg font-semibold" style={{ color: titleColor }}>{featuredProperty.bathrooms}</span>
                      <p className="text-xs" style={{ color: bodyColor }}>Baths</p>
                    </div>
                  )}
                  {featuredProperty.sqft !== undefined && (
                    <div className="text-center">
                      <Square className="w-6 h-6 mx-auto mb-1" style={{ color: primaryColor }} />
                      <span className="text-lg font-semibold" style={{ color: titleColor }}>{featuredProperty.sqft.toLocaleString()}</span>
                      <p className="text-xs" style={{ color: bodyColor }}>Sq Ft</p>
                    </div>
                  )}
                </div>
                
                {featuredProperty.description && (
                  <p className="text-sm line-clamp-3 mb-6" style={{ color: bodyColor }}>
                    {featuredProperty.description}
                  </p>
                )}
                
                <motion.button
                  className="self-start px-6 py-3 rounded-full font-medium text-white"
                  style={{ backgroundColor: primaryColor }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Property
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Other properties - grid */}
        {otherProperties.length > 0 && (
          <div className={`grid ${gridColsMap[columns]} gap-6`}>
            {otherProperties.map((property, index) => renderPropertyCard(property, index + 1))}
          </div>
        )}
      </div>
    );
  }

  // Default
  return (
    <div className="py-6">
      <div className={`grid ${gridColsMap[columns]} gap-6`}>
        {properties.map((property, index) => renderPropertyCard(property, index))}
      </div>
    </div>
  );
}
