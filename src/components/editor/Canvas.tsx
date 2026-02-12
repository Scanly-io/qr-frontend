import { useSortable } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { 
  GripVertical, 
  Trash2,
} from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import type { Block } from '@/types';
import type { PageTheme } from '@/types/theme';
import { PRESET_THEMES } from '@/types/theme';
import { getBackgroundStyle } from '@/utils/patterns';
import { Suspense, lazy } from 'react';

// Dynamic block imports
const ProfileBlock = lazy(() => import('@/components/blocks/ProfileBlock'));
const LinkButtonBlock = lazy(() => import('@/components/blocks/LinkButtonBlock'));
const SocialLinksBlock = lazy(() => import('@/components/blocks/SocialLinksBlock'));
const HeaderBlock = lazy(() => import('@/components/blocks/HeaderBlock'));
const FooterBlock = lazy(() => import('@/components/blocks/FooterBlock'));
const HeroBlockComponent = lazy(() => import('@/components/blocks/HeroBlock'));
const StatsBlockComponent = lazy(() => import('@/components/blocks/StatsBlock'));
const FeaturesBlockComponent = lazy(() => import('@/components/blocks/FeaturesBlock'));
const FAQBlockComponent = lazy(() => import('@/components/blocks/FAQBlock'));
const TestimonialBlockComponent = lazy(() => import('@/components/blocks/TestimonialBlock'));
const CountdownBlockComponent = lazy(() => import('@/components/blocks/CountdownBlock'));
const EventsBlockComponent = lazy(() => import('@/components/blocks/EventsBlock'));
const PaymentBlockComponent = lazy(() => import('@/components/blocks/PaymentBlock'));
const ProductBlockComponent = lazy(() => import('@/components/blocks/ProductBlock'));
const ShopBlockComponent = lazy(() => import('@/components/blocks/ShopBlock'));
const RealEstateBlockComponent = lazy(() => import('@/components/blocks/RealEstateBlock'));
const MenuBlockComponent = lazy(() => import('@/components/blocks/MenuBlock'));
const ArtistBlockComponent = lazy(() => import('@/components/blocks/ArtistBlock'));
const DealsBlockComponent = lazy(() => import('@/components/blocks/DealsBlock'));
const ScheduleBlockComponent = lazy(() => import('@/components/blocks/ScheduleBlock'));
const MapBlockComponent = lazy(() => import('@/components/blocks/MapBlock'));
const PricingBlockComponent = lazy(() => import('@/components/blocks/PricingBlock'));
import { CartSystem } from '@/components/cart';
import { FONT_FAMILY_MAP } from '@/lib/fonts';
import { getBlockColorPalette, getLightTint, createGradient } from '@/lib/utils';
import { getBorderRadius, getButtonBackground, getButtonTextColor } from '@/lib/themeHelpers';

// Gallery Block Component with Lightbox
function GalleryBlock({ block }: { block: Block }) {
  const images = (block.content.images as Array<{ url: string; alt?: string; caption?: string; link?: string; title?: string; badge?: string }>) || [];
  const layout = (block.content.layout as string) || 'grid';
  const columns = (block.content.columns as number) || 3;
  const mobileColumns = (block.content.mobileColumns as number) || 1;
  const tabletColumns = (block.content.tabletColumns as number) || 2;
  const gap = (block.content.gap as string) || 'normal';
  const aspectRatio = (block.content.aspectRatio as string) || 'square';
  const hoverEffect = (block.content.hoverEffect as string) || 'zoom';
  const borderRadius = (block.content.borderRadius as number) || 8;
  const enableLightbox = (block.content.enableLightbox as boolean) ?? true;
  const lazyLoad = (block.content.lazyLoad as boolean) ?? true;
  const showCaptions = (block.content.showCaptions as boolean) ?? false;
  const imageFilter = (block.content.imageFilter as string) || 'none';
  const removeFilterOnHover = (block.content.removeFilterOnHover as boolean) ?? true;
  const overlayColor = (block.content.overlayColor as string) || '#000000';
  const overlayOpacity = (block.content.overlayOpacity as number) ?? 0;
  const removeOverlayOnHover = (block.content.removeOverlayOnHover as boolean) ?? true;
  const carouselAutoPlay = (block.content.carouselAutoPlay as boolean) ?? false;
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const openLightbox = (index: number) => {
    if (enableLightbox) {
      setCurrentIndex(index);
      setLightboxOpen(true);
    }
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);
  
  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'Escape') {
        closeLightbox();
      }
    };
    
    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [lightboxOpen, goToNext, goToPrevious, closeLightbox]);

  const carouselNext = useCallback(() => {
    setCarouselIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const carouselPrevious = useCallback(() => {
    setCarouselIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);
  
  // Carousel auto-play
  useEffect(() => {
    if (carouselAutoPlay && layout === 'carousel' && images.length > 1) {
      const interval = setInterval(() => {
        carouselNext();
      }, 5000); // 5 seconds
      
      return () => clearInterval(interval);
    }
  }, [carouselAutoPlay, layout, images.length, carouselNext]);

  const gapClass = gap === 'tight' ? 'gap-1' : gap === 'loose' ? 'gap-4 sm:gap-6' : 'gap-2 sm:gap-3';
  
  // Responsive column classes
  const getResponsiveColsClass = () => {
    const mobileClass = mobileColumns === 2 ? 'grid-cols-2' : 'grid-cols-1';
    const tabletClass = tabletColumns === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2';
    const desktopClass = columns === 2 ? 'md:grid-cols-2' : columns === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3';
    return `${mobileClass} ${tabletClass} ${desktopClass}`;
  };
  
  const colsClass = getResponsiveColsClass();
  
  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'square': return 'aspect-square';
      case 'landscape': return 'aspect-video';
      case 'portrait': return 'aspect-[3/4]';
      case 'auto': return '';
      default: return 'aspect-square';
    }
  };
  
  const getHoverClass = () => {
    switch (hoverEffect) {
      case 'zoom': return 'group-hover:scale-110';
      case 'lift': return 'group-hover:scale-105 group-hover:shadow-xl';
      case 'brightness': return 'group-hover:brightness-110';
      case 'none': return '';
      default: return 'group-hover:scale-105';
    }
  };
  
  const getFilterClass = () => {
    let filterClass = '';
    switch (imageFilter) {
      case 'grayscale': 
        filterClass = 'grayscale';
        if (removeFilterOnHover) filterClass += ' group-hover:grayscale-0';
        break;
      case 'sepia': 
        filterClass = 'sepia';
        if (removeFilterOnHover) filterClass += ' group-hover:sepia-0';
        break;
      case 'blur': 
        filterClass = 'blur-sm';
        if (removeFilterOnHover) filterClass += ' group-hover:blur-0';
        break;
    }
    return filterClass;
  };
  
  const getOverlayStyle = () => {
    if (overlayOpacity === 0) return {};
    const opacity = overlayOpacity / 100;
    return {
      backgroundColor: `${overlayColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`
    };
  };
  
  const getBadgeClass = (badge: string) => {
    switch (badge) {
      case 'NEW': return 'bg-green-500 text-white';
      case 'FEATURED': return 'bg-violet-600 text-white';
      case 'SALE': return 'bg-red-500 text-white';
      case 'HOT': return 'bg-orange-500 text-white';
      default: return '';
    }
  };

  if (images.length === 0) {
    return (
      <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-xl border-2 border-dashed border-border flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-violet-500/10 flex items-center justify-center mb-3">
            <svg className="w-8 h-8 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-foreground mb-1">Gallery Block</p>
          <p className="text-xs text-muted-foreground">Add images to create your gallery</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Grid Layout */}
      {layout === 'grid' && (
        <div className={`grid ${colsClass} ${gapClass}`} data-gallery>
          {images.map((img, idx) => {
            const ImageWrapper = img.link ? 'a' : 'div';
            const wrapperProps = img.link ? { href: img.link, target: '_blank', rel: 'noopener noreferrer' } : {};
            
            return (
              <ImageWrapper
                key={idx}
                {...wrapperProps}
                className={`group relative bg-gradient-to-br from-muted to-muted/50 overflow-hidden transition-all duration-300 ${getAspectClass()} ${enableLightbox || img.link ? 'cursor-pointer' : ''}`}
                style={{ borderRadius: `${borderRadius}px` }}
                onClick={(e) => {
                  if (!img.link && enableLightbox) {
                    e.preventDefault();
                    openLightbox(idx);
                  }
                }}
              >
                {img.url ? (
                  <>
                    <img
                      src={img.url}
                      alt={img.alt || `Gallery image ${idx + 1}`}
                      title={img.title || img.alt || `Gallery image ${idx + 1}`}
                      loading={lazyLoad ? 'lazy' : 'eager'}
                      className={`w-full h-full ${aspectRatio === 'auto' ? 'object-contain' : 'object-cover'} transition-all duration-500 ${getHoverClass()} ${getFilterClass()}`}
                    />
                    
                    {/* Color Overlay */}
                    {overlayOpacity > 0 && (
                      <div 
                        className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${removeOverlayOnHover ? 'group-hover:opacity-0' : ''}`}
                        style={getOverlayStyle()}
                      />
                    )}
                    
                    {/* Badge (top-left corner) */}
                    {img.badge && (
                      <div className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold rounded-md shadow-lg z-10 ${getBadgeClass(img.badge)}`}>
                        {img.badge}
                      </div>
                    )}
                    
                    {/* Title Overlay on Hover */}
                    {img.title && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <div className="text-white">
                          <h3 className="text-sm font-bold mb-0.5">{img.title}</h3>
                          {img.caption && <p className="text-xs opacity-90">{img.caption}</p>}
                        </div>
                      </div>
                    )}
                    
                    {/* Lightbox Icon (only if no link and lightbox enabled) */}
                    {enableLightbox && !img.link && (
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Link Icon (if link exists) */}
                    {img.link && (
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                          <svg className="w-4 h-4 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                      </div>
                    )}
                    
                    {/* Caption (only show if no title, or if title doesn't exist) */}
                    {showCaptions && img.caption && !img.title && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <p className="text-xs text-white">{img.caption}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">Image {idx + 1}</span>
                  </div>
                )}
              </ImageWrapper>
            );
          })}
        </div>
      )}

      {/* Masonry Layout */}
      {layout === 'masonry' && (
        <div className={`columns-${mobileColumns} sm:columns-${tabletColumns} md:columns-${columns} ${gapClass} space-y-${gap === 'tight' ? '1' : gap === 'loose' ? '6' : '3'}`}>
          {images.map((img, idx) => {
            const ImageWrapper = img.link ? 'a' : 'div';
            const wrapperProps = img.link ? { href: img.link, target: '_blank', rel: 'noopener noreferrer' } : {};
            
            return (
              <ImageWrapper
                key={idx}
                {...wrapperProps}
                className={`group relative overflow-hidden transition-all duration-300 break-inside-avoid mb-${gap === 'tight' ? '1' : gap === 'loose' ? '6' : '3'} ${enableLightbox || img.link ? 'cursor-pointer' : ''}`}
                style={{ borderRadius: `${borderRadius}px` }}
                onClick={(e) => {
                  if (!img.link && enableLightbox) {
                    e.preventDefault();
                    openLightbox(idx);
                  }
                }}
              >
                {img.url ? (
                  <>
                    <img
                      src={img.url}
                      alt={img.alt || `Gallery image ${idx + 1}`}
                      title={img.title || img.alt || `Gallery image ${idx + 1}`}
                      loading={lazyLoad ? 'lazy' : 'eager'}
                      className={`w-full transition-all duration-500 ${getHoverClass()} ${getFilterClass()}`}
                    />
                    
                    {/* Color Overlay */}
                    {overlayOpacity > 0 && (
                      <div 
                        className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${removeOverlayOnHover ? 'group-hover:opacity-0' : ''}`}
                        style={getOverlayStyle()}
                      />
                    )}
                    
                    {/* Badge (top-left corner) */}
                    {img.badge && (
                      <div className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold rounded-md shadow-lg z-10 ${getBadgeClass(img.badge)}`}>
                        {img.badge}
                      </div>
                    )}
                    
                    {/* Title Overlay on Hover */}
                    {img.title && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <div className="text-white">
                          <h3 className="text-sm font-bold mb-0.5">{img.title}</h3>
                          {img.caption && <p className="text-xs opacity-90">{img.caption}</p>}
                        </div>
                      </div>
                    )}
                    
                    {/* Lightbox Icon */}
                    {enableLightbox && !img.link && (
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Link Icon */}
                    {img.link && (
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                          <svg className="w-4 h-4 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                      </div>
                    )}
                    
                    {/* Caption */}
                    {showCaptions && img.caption && !img.title && (
                      <div className="bg-gradient-to-t from-black/70 to-transparent p-2">
                        <p className="text-xs text-white">{img.caption}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 flex flex-col items-center justify-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">Image {idx + 1}</span>
                  </div>
                )}
              </ImageWrapper>
            );
          })}
        </div>
      )}

      {/* Carousel Layout */}
      {layout === 'carousel' && images.filter(img => img.url).length > 0 && (
        <div className="relative">
          {/* Main Image */}
          <div 
            className="relative aspect-video bg-gradient-to-br from-muted to-muted/50 overflow-hidden group"
            style={{ borderRadius: `${borderRadius}px` }}
          >
            {images[carouselIndex]?.url ? (
              <>
                {images[carouselIndex].link ? (
                  <a href={images[carouselIndex].link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                    <img
                      src={images[carouselIndex].url}
                      alt={images[carouselIndex].alt || `Slide ${carouselIndex + 1}`}
                      title={images[carouselIndex].title || images[carouselIndex].alt || `Slide ${carouselIndex + 1}`}
                      className={`w-full h-full object-cover transition-all duration-500 ${getFilterClass()}`}
                    />
                  </a>
                ) : (
                  <img
                    src={images[carouselIndex].url}
                    alt={images[carouselIndex].alt || `Slide ${carouselIndex + 1}`}
                    title={images[carouselIndex].title || images[carouselIndex].alt || `Slide ${carouselIndex + 1}`}
                    className={`w-full h-full object-cover transition-all duration-500 ${getFilterClass()}`}
                  />
                )}
                
                {/* Color Overlay */}
                {overlayOpacity > 0 && (
                  <div 
                    className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${removeOverlayOnHover ? 'group-hover:opacity-0' : ''}`}
                    style={getOverlayStyle()}
                  />
                )}
                
                {/* Badge (top-left corner) */}
                {images[carouselIndex].badge && (
                  <div className={`absolute top-4 left-4 px-2 py-1 text-xs font-bold rounded-md shadow-lg z-10 ${getBadgeClass(images[carouselIndex].badge)}`}>
                    {images[carouselIndex].badge}
                  </div>
                )}
                
                {/* Title Overlay on Hover */}
                {images[carouselIndex].title && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 pointer-events-none">
                    <div className="text-white">
                      <h3 className="text-lg font-bold mb-1">{images[carouselIndex].title}</h3>
                      {images[carouselIndex].caption && <p className="text-sm opacity-90">{images[carouselIndex].caption}</p>}
                    </div>
                  </div>
                )}
                
                {/* Link Icon */}
                {images[carouselIndex].link && (
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </div>
                )}
                
                {/* Caption (only if no title) */}
                {showCaptions && images[carouselIndex].caption && !images[carouselIndex].title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="text-sm text-white text-center">{images[carouselIndex].caption}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-violet-500/10 flex items-center justify-center mb-3">
                    <svg className="w-8 h-8 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-foreground">No image</p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Arrows */}
          {images.filter(img => img.url).length > 1 && (
            <>
              <button
                onClick={carouselPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all group"
              >
                <svg className="w-5 h-5 text-gray-900 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={carouselNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all group"
              >
                <svg className="w-5 h-5 text-gray-900 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {images.filter(img => img.url).length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {images.map((img, idx) => (
                img.url && (
                  <button
                    key={idx}
                    onClick={() => setCarouselIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === carouselIndex 
                        ? 'w-8 bg-violet-600' 
                        : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                )
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lightbox Modal */}
      {enableLightbox && lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-in fade-in duration-300"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors group"
          >
            <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
            <p className="text-white text-sm font-medium">{currentIndex + 1} / {images.length}</p>
          </div>

          {/* Previous Button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors group"
            >
              <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Next Button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors group"
            >
              <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Current Image */}
          <div
            className="relative max-w-7xl max-h-[90vh] animate-in zoom-in-50 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[currentIndex].url}
              alt={images[currentIndex].alt || `Image ${currentIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            {images[currentIndex].caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
                <p className="text-white text-center">{images[currentIndex].caption}</p>
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-xl overflow-x-auto px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    idx === currentIndex ? 'border-white scale-110' : 'border-white/30 hover:border-white/60'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

// Props for main Canvas component
interface CanvasProps {
  blocks: Block[]; // Array of all blocks in the microsite
  setBlocks: (blocks: Block[]) => void; // Function to update blocks array
  selectedBlockId: string | null; // ID of currently selected block
  onSelectBlock: (id: string | null) => void; // Function to select/deselect blocks
  theme?: PageTheme; // Optional theme for styling the canvas
  onThemeClick?: () => void; // Optional function to open theme gallery
  isPreview?: boolean; // If true, render blocks in read-only preview mode
  micrositeId?: string; // ID of the microsite (for payment processing)
}

// Individual sortable block wrapper component
// Handles drag & drop, selection, and deletion for a single block
function SortableBlock({
  block,
  isSelected,
  onSelect,
  onDelete,
  onBlockUpdate,
  theme,
  isPreview = false,
  micrositeId,
}: {
  block: Block; // The block data to render
  isSelected: boolean; // Whether this block is currently selected
  onSelect: () => void; // Callback when block is clicked
  onDelete: () => void; // Callback when delete button is clicked
  onBlockUpdate?: (blockId: string, updates: Partial<Block>) => void; // Callback when block content changes
  theme?: PageTheme; // Theme settings to pass to block components
  isPreview?: boolean; // If true, render without editing controls
  micrositeId?: string; // ID of the microsite (for payment processing)
}) {
  // useSortable hook provides drag & drop functionality for this block
  const {
    attributes, // Accessibility attributes for dragging
    listeners, // Event listeners for drag interactions
    setNodeRef, // Ref to attach to the DOM element
    transform, // Current drag transform (x, y translation)
    transition, // CSS transition for smooth animations
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Function to render block content based on its type
  // Each block type has different rendering logic and applies different styles
  const renderBlockContent = () => {
    // Get theme typography settings to apply to all text blocks
    const titleFont = theme?.typography?.titleFont || 'inter';
    const bodyFont = theme?.typography?.bodyFont || 'inter';
    const titleFontFamily = FONT_FAMILY_MAP[titleFont] || "'Inter', sans-serif";
    const bodyFontFamily = FONT_FAMILY_MAP[bodyFont] || "'Inter', sans-serif";
    const titleColor = theme?.typography?.titleColor;
    const bodyColor = theme?.typography?.bodyColor;
    
    // Generate coordinated color palette for different blocks
    const colorPalette = getBlockColorPalette(theme?.branding?.primaryColor);
    
    switch (block.type) {
      case 'profile': {
        return (
          <Suspense fallback={<div style={{ minHeight: 60 }}>Loading...</div>}>
            <ProfileBlock block={block} isEditing={false} theme={theme} />
          </Suspense>
        );
      }
      case 'linkButton': {
        return (
          <Suspense fallback={<div style={{ minHeight: 40 }}>Loading...</div>}>
            <LinkButtonBlock block={block} isEditing={false} theme={theme} />
          </Suspense>
        );
      }
      case 'header': {
        return (
          <Suspense fallback={<div style={{ minHeight: 40 }}>Loading...</div>}>
            <HeaderBlock block={block} theme={theme} />
          </Suspense>
        );
      }
      case 'footer': {
        return (
          <Suspense fallback={<div style={{ minHeight: 40 }}>Loading...</div>}>
            <FooterBlock block={block} theme={theme} />
          </Suspense>
        );
      }
      case 'social': {
        const handleSocialUpdate = (updates: Partial<Block>) => {
          if (onBlockUpdate) {
            onBlockUpdate(block.id, updates);
          }
        };
        return (
          <Suspense fallback={<div style={{ minHeight: 40 }}>Loading...</div>}>
            <SocialLinksBlock block={block} isEditing={isSelected} onUpdate={handleSocialUpdate} theme={theme} />
          </Suspense>
        );
      }
      
      case 'heading': {
        // Enhanced Heading block with gradients, icons, shadows, and animations
        const level = (block.content.level as number) || 1;
        const HeadingTag = `h${level}` as 'h1' | 'h2' | 'h3';
        const text = (block.content.text as string) || 'Heading';
        const icon = block.content.icon as string;
        const iconPosition = (block.content.iconPosition as string) || 'left';
        const gradient = (block.content.gradient as string) || 'none';
        const textShadow = (block.content.textShadow as string) || 'none';
        const decoration = (block.content.decoration as string) || 'none';
        const animation = (block.content.animation as string) || 'none';
        const marginTop = (block.content.marginTop as number) || 0;
        const marginBottom = (block.content.marginBottom as number) || 0;
        const lineHeight = (block.content.lineHeight as number) || 1.2;
        
        // Convert font ID to CSS - handle both old CSS strings and new font IDs
        const blockFontId = block.styles?.fontFamily as string;
        let computedFontFamily = titleFontFamily;
        if (blockFontId) {
          // If it's a font ID (short string without quotes/commas), convert it
          if (FONT_FAMILY_MAP[blockFontId]) {
            computedFontFamily = FONT_FAMILY_MAP[blockFontId];
          } else {
            // It's already a CSS font-family string, use it as-is
            computedFontFamily = blockFontId;
          }
        }
        
        // Default size classes
        const baseClasses = {
          1: 'text-3xl sm:text-4xl md:text-5xl font-bold',
          2: 'text-2xl sm:text-3xl md:text-4xl font-semibold',
          3: 'text-xl sm:text-2xl md:text-3xl font-medium',
        };

        // Gradient classes
        const gradientClasses: Record<string, string> = {
          none: '',
          primary: 'bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent',
          rainbow: 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent',
          sunset: 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent',
          ocean: 'bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent',
          forest: 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent',
        };

        // Text shadow styles
        const shadowStyles: Record<string, string> = {
          none: 'none',
          sm: '0 1px 2px rgba(0,0,0,0.1)',
          md: '0 2px 4px rgba(0,0,0,0.2)',
          lg: '0 4px 8px rgba(0,0,0,0.3)',
          glow: '0 0 10px rgba(139, 92, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3)',
          neon: '0 0 5px rgba(139, 92, 246, 0.8), 0 0 10px rgba(139, 92, 246, 0.6), 0 0 20px rgba(139, 92, 246, 0.4)',
        };

        // Decoration classes
        const decorationClasses: Record<string, string> = {
          none: '',
          underline: 'underline underline-offset-4 decoration-2 decoration-primary',
          wavy: 'underline underline-offset-4 decoration-wavy decoration-primary',
          highlight: 'bg-yellow-200/50 px-2 py-1 rounded',
        };

        // Animation classes
        const animationClasses: Record<string, string> = {
          none: '',
          fadeIn: 'animate-in fade-in duration-1000',
          slideLeft: 'animate-in slide-in-from-left duration-700',
          slideRight: 'animate-in slide-in-from-right duration-700',
          bounce: 'animate-bounce',
          pulse: 'animate-pulse',
        };

        const headingContent = (
          <>
            {icon && (iconPosition === 'above' || iconPosition === 'left') && (
              <span className={`inline-block ${iconPosition === 'above' ? 'block mb-2' : 'mr-2'}`}>
                {icon}
              </span>
            )}
            {text}
            {icon && (iconPosition === 'below' || iconPosition === 'right') && (
              <span className={`inline-block ${iconPosition === 'below' ? 'block mt-2' : 'ml-2'}`}>
                {icon}
              </span>
            )}
          </>
        );

        return (
          <HeadingTag 
            className={`
              ${baseClasses[level as 1 | 2 | 3]}
              ${gradientClasses[gradient]}
              ${decorationClasses[decoration]}
              ${animationClasses[animation]}
              ${iconPosition === 'above' || iconPosition === 'below' ? 'flex flex-col items-center' : ''}
            `.trim()}
            style={{
              textAlign: block.styles?.alignment || 'left',
              color: gradient === 'none' ? (titleColor || block.styles?.color) : undefined,
              fontFamily: computedFontFamily,
              fontSize: block.styles?.fontSize,
              fontWeight: block.styles?.fontWeight,
              lineHeight: lineHeight,
              letterSpacing: block.styles?.letterSpacing,
              textShadow: shadowStyles[textShadow],
              marginTop: `${marginTop}px`,
              marginBottom: `${marginBottom}px`,
            }}
          >
            {headingContent}
          </HeadingTag>
        );
      }
      
      case 'text': {
        // Text block - renders rich text HTML with advanced features
        const html = (block.content.html as string) || '<p>Your text here...</p>';
        const hasBackground = block.styles?.backgroundColor;
        const textStyleOption = (block.content.textStyle as string) || 'normal';
        const dropCap = block.content.dropCap as boolean;
        const columnsEnabled = block.content.columns as boolean;
        const icon = block.content.icon as string;
        const iconPosition = (block.content.iconPosition as string) || 'left';
        const textShadow = block.content.textShadow as string;
        const borderStyle = block.content.borderStyle as string;
        const borderColor = (block.content.borderColor as string) || '#8b5cf6';
        const containerPadding = (block.content.containerPadding as string) || '1rem';
        const authorName = block.content.authorName as string;
        const authorTitle = block.content.authorTitle as string;
        
        // New typography options
        const fontSize = (block.content.fontSize as string) || 'base';
        const fontWeight = (block.content.fontWeight as string) || 'normal';
        const lineHeight = (block.content.lineHeight as string) || 'normal';
        const textAlign = (block.content.textAlign as string) || 'left';
        const maxWidth = (block.content.maxWidth as string) || 'full';
        const bgStyle = (block.content.bgStyle as string) || 'none';
        
        // Font size classes
        const fontSizeClasses: Record<string, string> = {
          sm: 'text-sm',
          base: 'text-base',
          lg: 'text-lg',
          xl: 'text-xl',
          '2xl': 'text-2xl',
        };
        
        // Font weight classes
        const fontWeightClasses: Record<string, string> = {
          normal: 'font-normal',
          medium: 'font-medium',
          semibold: 'font-semibold',
          bold: 'font-bold',
        };
        
        // Line height classes
        const lineHeightClasses: Record<string, string> = {
          tight: 'leading-tight',
          normal: 'leading-normal',
          relaxed: 'leading-relaxed',
          loose: 'leading-loose',
        };
        
        // Text alignment classes
        const textAlignClasses: Record<string, string> = {
          left: 'text-left',
          center: 'text-center',
          right: 'text-right',
          justify: 'text-justify',
        };
        
        // Max width classes
        const maxWidthClasses: Record<string, string> = {
          full: 'max-w-none',
          '4xl': 'max-w-4xl mx-auto',
          '2xl': 'max-w-2xl mx-auto',
          xl: 'max-w-xl mx-auto',
        };
        
        // Text style classes
        const textStyleClasses: Record<string, string> = {
          normal: '',
          lead: 'text-lg text-muted-foreground',
          muted: 'text-muted-foreground',
          highlight: 'bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded',
        };
        
        // Background style classes
        const bgStyleClasses: Record<string, string> = {
          none: '',
          subtle: 'bg-secondary/30 p-4 rounded-lg',
          card: 'bg-card p-6 rounded-xl border shadow-sm',
          highlight: 'bg-primary/5 border-l-4 border-primary p-4',
        };
        
        // Text shadow styles
        const shadowStyles: Record<string, string> = {
          none: 'none',
          sm: '0 1px 2px rgba(0,0,0,0.1)',
          md: '0 2px 4px rgba(0,0,0,0.2)',
        };
        
        // Border classes
        const borderClasses: Record<string, string> = {
          none: '',
          left: 'border-l-4',
          full: 'border-2',
          dashed: 'border-2 border-dashed',
        };
        
        // Build container classes
        const containerClass = [
          'prose prose-sm',
          fontSizeClasses[fontSize],
          fontWeightClasses[fontWeight],
          lineHeightClasses[lineHeight],
          textAlignClasses[textAlign],
          maxWidthClasses[maxWidth],
          textStyleClasses[textStyleOption],
          bgStyleClasses[bgStyle],
          columnsEnabled ? 'sm:columns-2 gap-6' : '',
          borderStyle && borderStyle !== 'none' ? borderClasses[borderStyle] : '',
          dropCap ? '[&>p:first-child::first-letter]:text-5xl [&>p:first-child::first-letter]:font-bold [&>p:first-child::first-letter]:float-left [&>p:first-child::first-letter]:mr-3 [&>p:first-child::first-letter]:leading-none [&>p:first-child::first-letter]:text-primary' : '',
        ].filter(Boolean).join(' ');
        
        // Convert font ID to CSS font-family for text blocks
        const blockTextFontId = block.styles?.fontFamily as string;
        let textFontFamily = bodyFontFamily;
        if (blockTextFontId) {
          // If it's a font ID (exists in map), convert it
          if (FONT_FAMILY_MAP[blockTextFontId]) {
            textFontFamily = FONT_FAMILY_MAP[blockTextFontId];
          } else {
            // It's already a CSS font-family string, use it as-is
            textFontFamily = blockTextFontId;
          }
        }
        
        // Container styles
        const containerStyles: React.CSSProperties = {
          color: bodyColor || block.styles?.color,
          fontFamily: textFontFamily,
          textShadow: textShadow ? shadowStyles[textShadow] : undefined,
          backgroundColor: hasBackground,
          padding: hasBackground || borderStyle !== 'none' ? containerPadding : undefined,
          borderRadius: hasBackground || borderStyle !== 'none' ? '0.5rem' : undefined,
          borderColor: borderStyle && borderStyle !== 'none' ? borderColor : undefined,
        };
        
        return (
          <div className="relative">
            {/* Icon rendering */}
            {icon && iconPosition === 'float' && (
              <span className="absolute -left-8 top-0 text-3xl opacity-30">
                {icon}
              </span>
            )}
            
            {icon && iconPosition === 'top' && (
              <div className="text-center mb-3">
                <span className="text-4xl inline-block">{icon}</span>
              </div>
            )}
            
            <div className="flex items-start gap-3">
              {icon && iconPosition === 'left' && (
                <span className="text-2xl flex-shrink-0 mt-1">{icon}</span>
              )}
              
              <div className="flex-1">
                <div
                  className={containerClass}
                  dangerouslySetInnerHTML={{ __html: html }}
                  style={containerStyles}
                />
                
                {/* Quote Attribution */}
                {textStyleOption === 'quote' && (authorName || authorTitle) && (
                  <div className="mt-4 flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {authorName ? authorName.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div>
                      {authorName && (
                        <div className="font-semibold text-foreground">{authorName}</div>
                      )}
                      {authorTitle && (
                        <div className="text-xs text-muted-foreground">{authorTitle}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }
      
      case 'button': {
        const url = block.content.url as string;
        const label = (block.content.label as string) || 'Click me';
        const variant = (block.content.variant as string) || theme?.button?.style || 'fill';
        const size = (block.content.size as string) || 'medium';
        const icon = block.content.icon as string;
        const iconPosition = (block.content.iconPosition as string) || 'left';
        
        // Use centralized border radius helper
        const themeBorderRadius = getBorderRadius(theme?.button?.borderRadius, 8);
        const borderRadius = (block.content.borderRadius as number) ?? themeBorderRadius;
        
        const width = (block.content.width as string) || 'full';
        const shadow = (block.content.shadow as string) || theme?.button?.shadow || 'none';
        
        const hoverEffect = (block.content.hoverEffect as string) || 'lift';
        const openInNewTab = (block.content.openInNewTab as boolean) ?? false;
        const actionType = (block.content.actionType as string) || 'url';
        const alignment = (block.content.alignment as string) || 'center';
        const animation = (block.content.animation as string) || 'none';
        const helperText = block.content.helperText as string;
        const useThemeColors = (block.content.useThemeColors as boolean) ?? true;
        
        // Use theme or custom colors
        const customBgColor = !useThemeColors ? (block.content.customBgColor as string) : undefined;
        const customTextColor = !useThemeColors ? (block.content.customTextColor as string) : undefined;
        
        // Build the href based on action type
        let href = url || '#';
        if (url) {
          if (actionType === 'phone') {
            href = `tel:${url.replace(/\s/g, '')}`;
          } else if (actionType === 'email') {
            href = `mailto:${url}`;
          } else if (actionType === 'download') {
            href = url;
          }
        }
        
        // Alignment classes
        const alignmentClasses = {
          left: 'justify-start',
          center: 'justify-center',
          right: 'justify-end',
        };
        
        // Size classes
        const sizeClasses = {
          small: 'px-4 py-2 text-sm',
          medium: 'px-6 py-3 text-base',
          large: 'px-8 py-4 text-lg',
        };
        
        // Use centralized button color helpers
        const buttonBg = getButtonBackground(useThemeColors, customBgColor, theme, colorPalette.button.fill);
        const buttonText = getButtonTextColor(useThemeColors, customTextColor, theme, '#ffffff');
        
        const variantStyles: Record<string, React.CSSProperties> = {
          fill: {
            backgroundColor: buttonBg,
            color: buttonText,
            borderColor: buttonBg,
          },
          outline: {
            backgroundColor: 'transparent',
            color: buttonBg,
            borderColor: buttonBg,
          },
          soft: {
            backgroundColor: getLightTint(buttonBg, 0.15),
            color: buttonBg,
            borderColor: getLightTint(buttonBg, 0.3),
          },
          gradient: {
            background: createGradient(buttonBg, colorPalette.hero.secondary),
            color: buttonText,
            borderColor: 'transparent',
          },
          glass: {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px)',
            color: '#1f2937',
            borderColor: 'rgba(255, 255, 255, 0.2)',
          },
          shadow: {
            backgroundColor: '#ffffff',
            color: '#1f2937',
            borderColor: '#e5e7eb',
          },
        };
        
        // Shadow classes
        const shadowClasses = {
          none: '',
          sm: 'shadow-sm',
          md: 'shadow-md',
          lg: 'shadow-lg',
        };
        
        // Width classes
        const widthClasses = {
          auto: 'w-auto inline-block',
          full: 'w-full block',
          '75%': 'w-3/4 block mx-auto',
        };
        
        // Hover effect classes
        const hoverEffectClasses = {
          none: '',
          lift: 'hover:-translate-y-1 hover:shadow-xl',
          glow: 'hover:shadow-2xl',
          scale: 'hover:scale-105',
        };

        // Animation classes
        const animationClasses = {
          none: '',
          fadeIn: 'animate-in fade-in duration-1000',
          slideUp: 'animate-in slide-in-from-bottom-4 duration-700',
          bounce: 'animate-bounce',
        };

        // Create unique class name for this button to add hover styles
        const buttonId = `btn-${block.id}`;
        
        // Combined styles - use theme colors and ensure they override Tailwind
        const buttonStyle: React.CSSProperties = {
          borderRadius: `${borderRadius}px`,
          ...(variantStyles[variant as keyof typeof variantStyles] || variantStyles.fill),
          // Force color application
          transition: 'all 0.3s ease',
        };
        
        // Generate hover styles based on variant
        const getHoverStyles = () => {
          switch (variant) {
            case 'outline':
              return `
                .${buttonId}:hover {
                  background-color: ${buttonBg} !important;
                  color: ${buttonText} !important;
                }
              `;
            case 'soft':
              return `
                .${buttonId}:hover {
                  background-color: ${buttonBg} !important;
                  color: ${buttonText} !important;
                }
              `;
            case 'fill':
              return `
                .${buttonId}:hover {
                  opacity: 0.9;
                  filter: brightness(1.1);
                }
              `;
            case 'gradient':
              return `
                .${buttonId}:hover {
                  filter: brightness(1.1);
                }
              `;
            case 'glass':
              return `
                .${buttonId}:hover {
                  background-color: rgba(255, 255, 255, 0.2) !important;
                }
              `;
            case 'shadow':
              return `
                .${buttonId}:hover {
                  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                }
              `;
            default:
              return `
                .${buttonId}:hover {
                  opacity: 0.9;
                }
              `;
          }
        };

        return (
          <div className={`flex ${alignmentClasses[alignment as keyof typeof alignmentClasses]} w-full`}>
            <style>{getHoverStyles()}</style>
            <div className={widthClasses[width as keyof typeof widthClasses] || widthClasses.full}>
              <a
                href={href}
                target={openInNewTab ? '_blank' : undefined}
                rel={openInNewTab ? 'noopener noreferrer' : undefined}
                download={actionType === 'download' ? true : undefined}
                className={`
                  ${buttonId}
                  ${sizeClasses[size as keyof typeof sizeClasses]}
                  ${shadowClasses[shadow as keyof typeof shadowClasses]}
                  ${hoverEffectClasses[hoverEffect as keyof typeof hoverEffectClasses]}
                  ${animationClasses[animation as keyof typeof animationClasses]}
                  font-semibold flex items-center justify-center gap-2 border-2
                  ${width === 'auto' ? '' : 'text-center'}
                  no-underline cursor-pointer
                `}
                style={buttonStyle}
              >
                {icon && iconPosition === 'left' && <span className="text-lg">{icon}</span>}
                <span>{label}</span>
                {icon && iconPosition === 'right' && <span className="text-lg">{icon}</span>}
              </a>
              
              {/* Helper Text */}
              {helperText && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  {helperText}
                </p>
              )}
              
              {/* URL Preview (only in editor) */}
              {url && (
                <p className="text-xs text-muted-foreground mt-2 truncate flex items-center gap-1 justify-center">
                  <span>→</span>
                  <span className="flex-1 truncate">{href}</span>
                  {openInNewTab && <span className="text-violet-600 font-medium">↗ New tab</span>}
                </p>
              )}
            </div>
          </div>
        );
      }
      
      case 'image': {
        const url = block.content.url as string;
        const objectFit = block.styles?.objectFit || 'cover';
        const width = (block.content.width as string) === 'custom' 
          ? `${(block.content.customWidth as number) || 100}%` 
          : (block.content.width as string) || '100%';
        const alignment = (block.content.alignment as string) || 'center';
        const heightMode = (block.content.heightMode as string) || 'auto';
        const fixedHeight = (block.content.fixedHeight as number) || 300;
        const shadow = (block.content.shadow as string) || 'none';
        const hoverEffect = (block.content.hoverEffect as string) || 'none';
        const filter = (block.content.filter as string) || 'none';
        const borderStyle = (block.content.borderStyle as string) || 'none';
        const borderWidth = (block.content.borderWidth as number) || 2;
        const borderColor = (block.content.borderColor as string) || '#000000';
        const opacity = (block.content.opacity as number) ?? 100;
        const caption = block.content.caption as string;
        const link = block.content.link as string;
        const openInNewTab = block.content.openInNewTab as boolean;
        const lightbox = block.content.lightbox as boolean;
        const marginTop = (block.content.marginTop as number) || 0;
        const marginBottom = (block.content.marginBottom as number) || 0;

        // Shadow styles
        const shadowStyles: Record<string, string> = {
          none: 'shadow-none',
          sm: 'shadow-sm',
          md: 'shadow-md',
          lg: 'shadow-lg',
          xl: 'shadow-xl',
          glow: 'shadow-[0_0_20px_rgba(139,92,246,0.5)]'
        };

        // Hover effect styles
        const hoverEffectStyles: Record<string, string> = {
          none: '',
          zoom: 'hover:scale-105',
          lift: 'hover:-translate-y-2 hover:shadow-xl',
          brightness: 'hover:brightness-110',
          grayscale: 'grayscale hover:grayscale-0',
          blur: 'hover:blur-sm'
        };

        // Filter styles
        const filterStyles: Record<string, string> = {
          none: '',
          grayscale: 'grayscale',
          sepia: 'sepia',
          blur: 'blur-sm',
          brightness: 'brightness-110',
          contrast: 'contrast-125'
        };

        // Border radius from content
        const imgBorderRadius = (block.content.borderRadius as number) ?? 8;

        const imageElement = url ? (
          <img 
            src={url} 
            alt={(block.content.alt as string) || ''} 
            loading={(block.content.lazyLoad ?? true) ? 'lazy' : 'eager'}
            className={`max-w-full transition-all duration-300 ${shadowStyles[shadow]} ${hoverEffectStyles[hoverEffect]} ${filterStyles[filter]}`}
            style={{
              objectFit: (block.content.aspectRatioLock ?? true) ? objectFit : 'fill',
              height: heightMode === 'fixed' ? `${fixedHeight}px` : 'auto',
              width: '100%',
              borderRadius: `${imgBorderRadius}px`,
              border: borderStyle !== 'none' ? `${borderWidth}px ${borderStyle} ${borderColor}` : 'none',
              opacity: opacity / 100,
            }}
          />
        ) : (
          <div className="bg-secondary border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground">
            <p>No image URL set</p>
            <p className="text-xs mt-1">Add URL in the inspector →</p>
          </div>
        );

        const wrapWithLink = (element: React.ReactNode) => {
          if (link && !lightbox) {
            return (
              <a
                href={link}
                target={openInNewTab ? '_blank' : '_self'}
                rel={openInNewTab ? 'noopener noreferrer' : undefined}
                className="inline-block cursor-pointer hover:opacity-90 transition-opacity"
              >
                {element}
              </a>
            );
          }
          if (lightbox) {
            return (
              <button
                onClick={() => {
                  // Simple lightbox implementation - open in new window
                  window.open(url, '_blank', 'width=1200,height=800');
                }}
                className="inline-block cursor-pointer hover:opacity-90 transition-opacity"
              >
                {element}
              </button>
            );
          }
          return element;
        };

        const alignmentStyles: Record<string, string> = {
          left: 'justify-start',
          center: 'justify-center',
          right: 'justify-end'
        };

        return (
          <div 
            className={`flex ${alignmentStyles[alignment]}`}
            style={{
              marginTop: `${marginTop}px`,
              marginBottom: `${marginBottom}px`
            }}
          >
            <div style={{ width: width }}>
              {wrapWithLink(imageElement)}
              {caption && (
                <p className="text-sm text-muted-foreground mt-2 text-center italic">
                  {caption}
                </p>
              )}
            </div>
          </div>
        );
      }
      
      case 'spacer': {
        const height = (block.content.height as number) || 40;
        const mobileHeight = (block.content.mobileHeight as number) || 20;
        const mobileHeightEnabled = block.content.mobileHeightEnabled as boolean;
        const dividerStyle = (block.content.dividerStyle as string) || 'none';
        const dividerThickness = (block.content.dividerThickness as number) || 1;
        const dividerWidth = (block.content.dividerWidth as string) || '100%';
        const dividerAlignment = (block.content.dividerAlignment as string) || 'center';
        const dividerColor = (block.content.dividerColor as string) || '#e5e7eb';
        const icon = block.content.icon as string;
        const backgroundEnabled = block.content.backgroundEnabled as boolean;
        const backgroundColor = (block.content.backgroundColor as string) || '#f3f4f6';
        const backgroundPattern = (block.content.backgroundPattern as string) || 'none';
        const animation = (block.content.animation as string) || 'none';
        const hideOnMobile = block.content.hideOnMobile as boolean;
        const hideOnDesktop = block.content.hideOnDesktop as boolean;

        return (
          <div
            style={{
              height: `${height}px`,
              backgroundColor: backgroundEnabled ? backgroundColor : 'transparent',
              backgroundImage: backgroundEnabled && backgroundPattern === 'dots'
                ? 'radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)'
                : backgroundEnabled && backgroundPattern === 'lines'
                ? 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px)'
                : backgroundEnabled && backgroundPattern === 'gradient'
                ? 'linear-gradient(to right, transparent, rgba(0,0,0,0.05), transparent)'
                : undefined,
              backgroundSize: backgroundPattern === 'dots' ? '20px 20px' : undefined,
            }}
            className={`w-full flex items-center justify-center relative ${
              animation === 'fadeIn' ? 'animate-fadeIn' : ''
            } ${
              animation === 'slideUp' ? 'animate-slideUp' : ''
            } ${
              animation === 'scale' ? 'animate-scale' : ''
            } ${
              hideOnMobile ? 'hidden md:flex' : ''
            } ${
              hideOnDesktop ? 'flex md:hidden' : ''
            }`}
          >
            {/* Divider line */}
            {dividerStyle !== 'none' && (
              <div
                className="absolute top-1/2 -translate-y-1/2"
                style={{
                  width: dividerWidth,
                  left: dividerAlignment === 'left' ? '0' 
                    : dividerAlignment === 'right' ? 'auto'
                    : '50%',
                  right: dividerAlignment === 'right' ? '0' : 'auto',
                  transform: dividerAlignment === 'center' 
                    ? 'translateX(-50%) translateY(-50%)' 
                    : 'translateY(-50%)',
                  height: `${dividerThickness}px`,
                  borderTop: dividerStyle === 'gradient' 
                    ? undefined
                    : `${dividerThickness}px ${dividerStyle} ${dividerColor}`,
                  background: dividerStyle === 'gradient'
                    ? 'linear-gradient(to right, transparent, #9333ea, transparent)'
                    : undefined,
                }}
              />
            )}

            {/* Icon/Symbol */}
            {icon && (
              <div 
                className="relative z-10 bg-background px-3 text-2xl"
                style={{
                  color: dividerColor,
                }}
              >
                {icon}
              </div>
            )}

            {/* Editor label */}
            <span className="bg-background/80 px-2 py-1 rounded text-xs text-muted-foreground border border-border">
              Spacer ({height}px{mobileHeightEnabled && ` / ${mobileHeight}px mobile`})
            </span>
          </div>
        );
      }
      
      case 'form': {
        const title = block.content.title as string;
        const submitLabel = (block.content.submitLabel as string) || 'Submit';
        
        // Styling options
        const backgroundColor = (block.content.backgroundColor as string);
        const formBgColor = backgroundColor || (block.content.formBgColor as string) || '#ffffff';
        const formBorderStyle = (block.content.formBorderStyle as string) || 'solid';
        const formBorderColor = (block.content.formBorderColor as string) || '#e5e7eb';
        const formBorderRadius = (block.content.formBorderRadius as number) || 12;
        const inputStyle = (block.content.inputStyle as string) || 'rounded';
        const accentColor = (block.content.accentColor as string) || '#8b5cf6';
        const fieldSpacing = (block.content.fieldSpacing as number) || 20;
        
        // Get fields array or use default fields
        let fields = (block.content.fields as Array<{
          type: string;
          label: string;
          placeholder?: string;
          required?: boolean;
          options?: string;
          rows?: number;
        }>) || [];
        
        // If no fields defined, use default template
        if (!fields || fields.length === 0) {
          fields = [
            { type: 'text', label: 'Name', placeholder: 'Your name', required: true },
            { type: 'email', label: 'Email', placeholder: 'your@email.com', required: true },
            { type: 'textarea', label: 'Message', placeholder: 'Your message...', required: false, rows: 3 }
          ];
        }

        // Determine input field border radius based on style
        const inputBorderRadius = inputStyle === 'rounded' ? '0.75rem' : 
                                 inputStyle === 'pill' ? '9999px' : 
                                 '0.25rem'; // square

        // Form container styles
        const formStyles: React.CSSProperties = {
          backgroundColor: formBgColor,
          borderStyle: formBorderStyle,
          borderColor: formBorderStyle !== 'none' ? formBorderColor : 'transparent',
          borderRadius: `${formBorderRadius}px`,
          borderWidth: formBorderStyle !== 'none' ? '2px' : '0',
        };

        return (
          <div className="p-8 space-y-6 shadow-sm hover:shadow-md transition-shadow" style={formStyles}>
            {title && (
              <h3 className="text-2xl font-bold text-foreground bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {title}
              </h3>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: `${fieldSpacing}px` }}>
              {fields.map((field, idx) => (
                <div key={`field-${idx}-${field.type}-${field.label}`} className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">
                    {field.label || 'Field'}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {field.type === 'textarea' ? (
                    <textarea
                      placeholder={field.placeholder}
                      rows={field.rows || 3}
                      style={{ borderRadius: inputBorderRadius }}
                      className="w-full px-4 py-3 text-base border-2 border-border bg-background text-foreground placeholder:text-muted-foreground hover:border-primary/50 transition-all resize-none pointer-events-none"
                      disabled
                      tabIndex={-1}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      style={{
                        borderRadius: inputBorderRadius,
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '2.5rem'
                      }}
                      className="w-full px-4 py-3 text-base border-2 border-border bg-background text-foreground hover:border-primary/50 transition-all cursor-pointer appearance-none pointer-events-none"
                      disabled
                      tabIndex={-1}
                    >
                      <option value="">Select an option...</option>
                      {(Array.isArray(field.options) ? field.options : (field.options || '').split('\n')).filter((opt: string) => opt.trim()).map((opt: string, i: number) => (
                        <option key={`opt-${idx}-${i}`} value={opt.trim()}>{opt.trim()}</option>
                      ))}
                    </select>
                  ) : field.type === 'radio' ? (
                    <div className="space-y-3 pl-1">
                      {(Array.isArray(field.options) ? field.options : (field.options || 'Option 1\nOption 2\nOption 3').split('\n')).filter((opt: string) => opt.trim()).map((opt: string, i: number) => (
                        <label key={`radio-${idx}-${i}-${opt}`} className="flex items-center gap-3 pointer-events-none">
                          <div className="relative flex items-center justify-center">
                            <input
                              type="radio"
                              name={`radio-${block.id}-${idx}`}
                              style={{
                                accentColor: accentColor
                              }}
                              className="w-5 h-5 border-2 transition-all"
                              defaultChecked={i === 0}
                              disabled
                              tabIndex={-1}
                            />
                          </div>
                          <span className="text-sm text-foreground">
                            {opt.trim()}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : field.type === 'checkbox' ? (
                    <div className="space-y-3 pl-1">
                      {(Array.isArray(field.options) ? field.options : (field.options || 'Option 1\nOption 2\nOption 3').split('\n')).filter((opt: string) => opt.trim()).map((opt: string, i: number) => (
                        <label key={`checkbox-${idx}-${i}-${opt}`} className="flex items-center gap-3 pointer-events-none">
                          <div className="relative flex items-center justify-center">
                            <input
                              type="checkbox"
                              style={{
                                accentColor: accentColor
                              }}
                              className="w-5 h-5 border-2 rounded transition-all"
                              defaultChecked={i === 0}
                              disabled
                              tabIndex={-1}
                            />
                          </div>
                          <span className="text-sm text-foreground">
                            {opt.trim()}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type={field.type || 'text'}
                        placeholder={field.placeholder || `Enter ${(field.label || 'value').toLowerCase()}`}
                        style={{ borderRadius: inputBorderRadius }}
                        className="w-full px-4 py-3 text-base border-2 border-border bg-background text-foreground placeholder:text-muted-foreground hover:border-primary/50 transition-all pointer-events-none"
                        disabled
                        tabIndex={-1}
                      />
                      {/* Type indicator badge */}
                      {field.type && field.type !== 'text' && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 text-[10px] font-semibold bg-primary/10 text-primary rounded-full pointer-events-none">
                          {field.type}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button 
              style={{ borderRadius: inputBorderRadius }}
              className="w-full px-6 py-3.5 bg-gradient-to-r from-primary to-purple-600 text-white font-semibold hover:shadow-xl hover:scale-[1.02] transition-all shadow-lg shadow-primary/25 pointer-events-none"
              disabled
            >
              {submitLabel}
            </button>
          </div>
        );
      }
      
      // === NEW BLOCK TYPES ===
      
      case 'video': {
        // Video block - YouTube/Vimeo embed with all options
        const url = (block.content.url as string) || '';
        const aspectRatioSetting = (block.content.aspectRatio as string) || '16:9';
        const width = (block.content.width as string) || '100%';
        const alignment = (block.content.alignment as string) || 'center';
        const caption = (block.content.caption as string) || '';
        const autoplay = (block.content.autoplay as boolean) || false;
        const loop = (block.content.loop as boolean) || false;
        const muted = (block.content.muted as boolean) || false;
        const hideControls = !(block.content.showControls as boolean ?? true);
        const startTime = (block.content.startTime as number) || 0;
        const privacyMode = (block.content.privacyMode as boolean) || false;
        const lazyLoad = (block.content.lazyLoad as boolean) ?? true;
        const noRelated = (block.content.noRelated as boolean) || false;
        
        // Convert aspect ratio string to padding percentage
        const getAspectRatioPadding = (ratio: string): string => {
          const ratioMap: Record<string, string> = {
            '16:9': '56.25%',    // Standard landscape
            '9:16': '177.78%',   // Portrait/TikTok/Reels
            '4:3': '75%',        // Classic TV
            '1:1': '100%',       // Square
            '21:9': '42.86%',    // Ultrawide
          };
          // If it's already a percentage (legacy), use it
          if (ratio.includes('%')) return ratio;
          return ratioMap[ratio] || '56.25%';
        };
        
        const aspectRatioPadding = getAspectRatioPadding(aspectRatioSetting);
        
        // Function to extract video ID and create embed URL with options
        const getEmbedUrl = (videoUrl: string): string => {
          if (!videoUrl) return '';
          
          try {
            // YouTube patterns (including Shorts)
            if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
              let videoId = '';
              
              if (videoUrl.includes('youtu.be/')) {
                videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0] || '';
              } else if (videoUrl.includes('youtube.com/embed/')) {
                videoId = videoUrl.split('embed/')[1]?.split('?')[0]?.split('&')[0] || '';
              } else if (videoUrl.includes('youtube.com/shorts/')) {
                // YouTube Shorts support
                videoId = videoUrl.split('shorts/')[1]?.split('?')[0]?.split('&')[0] || '';
              } else if (videoUrl.includes('v=')) {
                videoId = videoUrl.split('v=')[1]?.split('&')[0] || '';
              }
              
              if (videoId) {
                const domain = privacyMode ? 'youtube-nocookie.com' : 'youtube.com';
                const params = new URLSearchParams();
                
                if (autoplay) params.append('autoplay', '1');
                if (loop) {
                  params.append('loop', '1');
                  params.append('playlist', videoId);
                }
                if (muted) params.append('mute', '1');
                if (hideControls) params.append('controls', '0');
                if (startTime > 0) params.append('start', startTime.toString());
                if (noRelated) params.append('rel', '0');
                
                const queryString = params.toString();
                return `https://www.${domain}/embed/${videoId}${queryString ? '?' + queryString : ''}`;
              }
            }
            
            // Vimeo patterns
            if (videoUrl.includes('vimeo.com')) {
              let videoId = '';
              
              if (videoUrl.includes('player.vimeo.com/video/')) {
                videoId = videoUrl.split('video/')[1]?.split('?')[0] || '';
              } else {
                videoId = videoUrl.split('vimeo.com/')[1]?.split('?')[0]?.split('/')[0] || '';
              }
              
              if (videoId) {
                const params = new URLSearchParams();
                
                if (autoplay) params.append('autoplay', '1');
                if (loop) params.append('loop', '1');
                if (muted) params.append('muted', '1');
                if (hideControls) params.append('controls', '0');
                
                const queryString = params.toString();
                let vimeoUrl = `https://player.vimeo.com/video/${videoId}${queryString ? '?' + queryString : ''}`;
                
                if (startTime > 0) {
                  vimeoUrl += `#t=${startTime}s`;
                }
                
                return vimeoUrl;
              }
            }
            
            // TikTok patterns - e.g., https://www.tiktok.com/@username/video/1234567890
            if (videoUrl.includes('tiktok.com')) {
              // Extract video ID from various TikTok URL formats
              const tiktokMatch = videoUrl.match(/video\/(\d+)/);
              if (tiktokMatch && tiktokMatch[1]) {
                return `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`;
              }
            }
            
            // Instagram Reels - e.g., https://www.instagram.com/reel/ABC123/
            if (videoUrl.includes('instagram.com')) {
              const reelMatch = videoUrl.match(/\/(reel|reels|p)\/([A-Za-z0-9_-]+)/);
              if (reelMatch && reelMatch[2]) {
                return `https://www.instagram.com/p/${reelMatch[2]}/embed`;
              }
            }
            
            // Loom patterns - e.g., https://www.loom.com/share/abc123
            if (videoUrl.includes('loom.com')) {
              const loomMatch = videoUrl.match(/\/share\/([a-zA-Z0-9]+)/);
              if (loomMatch && loomMatch[1]) {
                return `https://www.loom.com/embed/${loomMatch[1]}`;
              }
            }
            
            // Wistia patterns - e.g., https://company.wistia.com/medias/abc123
            if (videoUrl.includes('wistia.com')) {
              const wistiaMatch = videoUrl.match(/\/medias\/([a-zA-Z0-9]+)/);
              if (wistiaMatch && wistiaMatch[1]) {
                return `https://fast.wistia.net/embed/iframe/${wistiaMatch[1]}`;
              }
            }
          } catch (error) {
            console.error('Error parsing video URL:', error);
          }
          
          return '';
        };
        
        const embedUrl = getEmbedUrl(url);
        
        // Alignment styles
        const alignmentStyle = alignment === 'left' ? 'mr-auto' : alignment === 'right' ? 'ml-auto' : 'mx-auto';
        
        // Border radius
        const videoBorderRadius = (block.content.borderRadius as number) ?? 8;
        
        // Shadow styles
        const shadowStyles: Record<string, string> = {
          none: '',
          sm: 'shadow-sm',
          md: 'shadow-md',
          lg: 'shadow-lg',
          xl: 'shadow-xl',
        };
        const videoShadow = (block.content.shadow as string) || 'none';
        
        return (
          <div className={`${alignmentStyle}`} style={{ maxWidth: width }}>
            <div 
              className={`relative w-full bg-secondary/30 overflow-hidden border border-border ${shadowStyles[videoShadow]} transition-shadow duration-300 hover:shadow-lg`}
              style={{ 
                paddingTop: aspectRatioPadding,
                borderRadius: `${videoBorderRadius}px`
              }}
            >
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading={lazyLoad ? 'lazy' : 'eager'}
                  title={caption || 'Embedded video'}
                  style={{ borderRadius: `${videoBorderRadius}px` }}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-sm text-muted-foreground p-4 text-center bg-gradient-to-br from-secondary/50 to-secondary/30">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <svg className="w-8 h-8 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="font-medium mb-1">Add a Video</p>
                  <p className="text-xs text-muted-foreground/80">
                    {url ? 'Invalid video URL format' : 'Paste a YouTube, Vimeo, or TikTok link'}
                  </p>
                  {url && (
                    <p className="text-xs text-amber-600 mt-2 bg-amber-50 px-3 py-1 rounded-full">
                      Check the URL and try again
                    </p>
                  )}
                </div>
              )}
            </div>
            {caption && (
              <p className="text-sm text-muted-foreground mt-3 text-center italic">
                {caption}
              </p>
            )}
          </div>
        );
      }
      
      case 'divider': {
        const style = (block.content.style as string) || 'solid';
        const thickness = (block.content.thickness as number) || 2;
        const width = (block.content.width as string) || '100%';
        const color = (block.content.color as string) || '#e5e7eb';
        const alignment = (block.content.alignment as string) || 'center';
        
        return (
          <div 
            className="py-4"
            style={{
              display: 'flex',
              justifyContent: alignment === 'left' ? 'flex-start' : alignment === 'right' ? 'flex-end' : 'center'
            }}
          >
            {style === 'gradient' ? (
              <div
                style={{
                  width,
                  height: `${thickness}px`,
                  background: 'linear-gradient(to right, transparent, #9333ea, transparent)',
                }}
              />
            ) : style === 'double' ? (
              <div style={{ width }}>
                <hr 
                  style={{
                    borderStyle: 'solid',
                    borderWidth: `${thickness}px 0 0 0`,
                    borderColor: color,
                    margin: 0,
                  }}
                />
                <hr 
                  style={{
                    borderStyle: 'solid',
                    borderWidth: `${thickness}px 0 0 0`,
                    borderColor: color,
                    marginTop: `${thickness * 2}px`,
                  }}
                />
              </div>
            ) : (
              <hr 
                style={{
                  width,
                  borderStyle: style,
                  borderWidth: `${thickness}px 0 0 0`,
                  borderColor: color,
                }}
              />
            )}
          </div>
        );
      }
      
      case 'countdown': {
        // Countdown timer block - live updating timer
        if (!block.content.targetDate) {
          return (
            <div className="text-center p-6 bg-yellow-50 border-2 border-yellow-300 rounded-lg cursor-pointer">
              <p className="text-lg font-semibold text-yellow-800">⏰ Countdown Timer</p>
              <p className="text-sm text-yellow-700 mt-2">
                Click here to set a target date →
              </p>
            </div>
          );
        }
        return (
          <Suspense fallback={<div style={{ minHeight: 40 }}>Loading...</div>}>
            <CountdownBlockComponent block={block} theme={theme} />
          </Suspense>
        );
      }

      case 'calendar': {
        // Events Calendar block
        return (
          <Suspense fallback={<div style={{ minHeight: 40 }}>Loading...</div>}>
            <EventsBlockComponent block={block} theme={theme} />
          </Suspense>
        );
      }
      
      case 'testimonial': {
        return (
          <Suspense fallback={<div style={{ minHeight: 40 }}>Loading...</div>}>
            <TestimonialBlockComponent block={block} theme={theme} />
          </Suspense>
        );
      }
      
      case 'faq': {
        // FAQ block - using imported component
        return (
          <Suspense fallback={<div style={{ minHeight: 40 }}>Loading...</div>}>
            <FAQBlockComponent block={block} theme={theme} />
          </Suspense>
        );
      }
      
      case 'gallery': {
        // Gallery block with lightbox & animations
        return (
          <Suspense fallback={<div style={{ minHeight: 40 }}>Loading...</div>}>
            <GalleryBlock block={block} />
          </Suspense>
        );
      }
      
      case 'pricing': {
        // Pricing table block with toggle
        return (
          <Suspense fallback={<div style={{ minHeight: 40 }}>Loading...</div>}>
            <PricingBlockComponent block={block} theme={theme} />
          </Suspense>
        );
      }
      
      case 'features': {
        return (
          <Suspense fallback={<div style={{ minHeight: 40 }}>Loading...</div>}>
            <FeaturesBlockComponent block={block} theme={theme} />
          </Suspense>
        );
      }
      
      case 'stats': {
        return (
          <Suspense fallback={<div style={{ minHeight: 40 }}>Loading...</div>}>
            <StatsBlockComponent block={block} theme={theme} />
          </Suspense>
        );
      }
      
      case 'map': {
        return (
          <Suspense fallback={<div style={{ minHeight: 40 }}>Loading...</div>}>
            <MapBlockComponent block={block} theme={theme} />
          </Suspense>
        );
      }
      
      case 'hero': {
        return (
          <Suspense fallback={<div style={{ minHeight: 40 }}>Loading...</div>}>
            <HeroBlockComponent block={block} theme={theme} />
          </Suspense>
        );
      }
      
      case 'payment': {
        return (
          <Suspense fallback={<div style={{ minHeight: 40 }}>Loading...</div>}>
            <PaymentBlockComponent block={block} isEditing={!isPreview} theme={theme} micrositeId={micrositeId} />
          </Suspense>
        );
      }
      
      case 'product': {
        return (
          <Suspense fallback={<div style={{ minHeight: 40 }}>Loading...</div>}>
            <ProductBlockComponent block={block} isEditing={!isPreview} theme={theme} micrositeId={micrositeId} />
          </Suspense>
        );
      }
      
      case 'shop': {
        return (
          <Suspense fallback={<div style={{ minHeight: 40 }}>Loading...</div>}>
            <ShopBlockComponent block={block} isEditing={!isPreview} theme={theme} micrositeId={micrositeId} />
          </Suspense>
        );
      }
      
      case 'real-estate': {
        return (
          <Suspense fallback={<div style={{ minHeight: 40 }}>Loading...</div>}>
            <RealEstateBlockComponent block={block} theme={theme} />
          </Suspense>
        );
      }
      
      case 'menu': {
        return (
          <Suspense fallback={<div style={{ minHeight: 40 }}>Loading...</div>}>
            <MenuBlockComponent block={block} theme={theme} />
          </Suspense>
        );
      }
      
      case 'artist': {
        return (
          <Suspense fallback={<div style={{ minHeight: 40 }}>Loading...</div>}>
            <ArtistBlockComponent block={block} theme={theme} micrositeId={micrositeId} />
          </Suspense>
        );
      }
      
      case 'deals': {
        return (
          <Suspense fallback={<div style={{ minHeight: 40 }}>Loading...</div>}>
            <DealsBlockComponent block={block} theme={theme} />
          </Suspense>
        );
      }
      
      case 'schedule': {
        return (
          <Suspense fallback={<div style={{ minHeight: 40 }}>Loading...</div>}>
            <ScheduleBlockComponent block={block} theme={theme} />
          </Suspense>
        );
      }
      
      default:
        return <div>Unknown block type</div>;
    }
  };

  // If in preview mode, render without editor controls
  if (isPreview) {
    return (
      <div className="mb-4">
        {renderBlockContent()}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-2xl transition-all duration-200 overflow-hidden ${
        isDragging ? 'opacity-40 z-50 scale-[0.98] shadow-2xl' : ''
      } ${
        isSelected
          ? 'ring-2 ring-primary shadow-lg shadow-primary/20 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent border-2 border-primary'
          : 'bg-card border border-border/60 hover:border-primary/40 hover:shadow-md hover:shadow-primary/10'
      }`}
      onClick={onSelect}
    >
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-purple-500/0 group-hover:from-primary/[0.02] group-hover:to-purple-500/[0.02] transition-all duration-300 pointer-events-none" />
      
      {/* Block type badge - shows on hover */}
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
        <div className="px-2.5 py-1 bg-gradient-to-r from-primary to-purple-600 text-white text-[10px] font-bold rounded-full shadow-lg uppercase tracking-wider backdrop-blur-sm">
          {block.type}
        </div>
      </div>

      <div className="relative flex items-start gap-2 p-3 sm:p-4">
        {/* Drag handle - appears on hover */}
        <button
          {...attributes}
          {...listeners}
          className="opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-grab active:cursor-grabbing hover:scale-110 shrink-0 p-1 hover:bg-primary/10 rounded-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
        </button>

        {/* Block content */}
        <div className="flex-1 min-w-0">
          {renderBlockContent()}
        </div>

        {/* Delete button - appears on hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 p-1.5 rounded-lg shrink-0 hover:scale-110"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-primary animate-pulse" />
      )}
    </div>
  );
}

// Helper function to get platform icon and colors from the centralized config
// Removed - getPlatformInfo function no longer needed
// Social blocks now use the dedicated SocialLinksBlock component

export default function Canvas({ blocks, setBlocks, selectedBlockId, onSelectBlock, theme, onThemeClick, isPreview = false }: CanvasProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-droppable',
  });

  // Helper function to determine if background is dark
  const isDarkBackground = () => {
    if (!theme?.background) return false;
    
    const bg = theme.background;
    
    // Check for dark color values
    if (bg.type === 'solid' && bg.color) {
      const color = bg.color.toLowerCase();
      // Check for hex dark colors
      if (color.includes('#0') || 
          color.includes('#1') || 
          color.includes('#2') || 
          color.includes('#3') ||
          color.includes('#4') ||
          color.includes('#5')) {
        return true;
      }
      // Check for dark RGB values
      if (color.includes('rgb')) {
        const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (rgbMatch) {
          const r = parseInt(rgbMatch[1]);
          const g = parseInt(rgbMatch[2]);
          const b = parseInt(rgbMatch[3]);
          const brightness = (r + g + b) / 3;
          return brightness < 128; // Dark if average is below 128
        }
      }
      // Check for named dark colors
      if (color.includes('black') || 
          color.includes('navy') || 
          color.includes('dark') ||
          color.includes('slate-8') ||
          color.includes('slate-9') ||
          color.includes('gray-8') ||
          color.includes('gray-9')) {
        return true;
      }
    }
    
    if (bg.type === 'gradient') {
      const gradientFrom = (bg.gradientFrom || '').toLowerCase();
      const gradientTo = (bg.gradientTo || '').toLowerCase();
      
      // Check if either gradient color is dark
      const checkDarkColor = (color: string) => {
        return color.includes('#0') || 
               color.includes('#1') || 
               color.includes('#2') || 
               color.includes('#3') ||
               color.includes('#4') ||
               color.includes('#5') ||
               color.includes('black') ||
               color.includes('navy') ||
               color.includes('dark') ||
               color.includes('slate-8') ||
               color.includes('slate-9') ||
               color.includes('gray-8') ||
               color.includes('gray-9');
      };
      
      return checkDarkColor(gradientFrom) || checkDarkColor(gradientTo);
    }
    
    // If background has image or video, assume it might be dark
    if (bg.type === 'image' || bg.type === 'video' || bg.type === 'pattern') {
      return true;
    }
    
    return false;
  };

  const isThemeDark = isDarkBackground();
  
  // Dynamic text colors based on theme with shadows for better readability
  const headlineColor = isThemeDark ? 'text-white drop-shadow-lg' : 'text-gray-900';
  const descriptionColor = isThemeDark ? 'text-white drop-shadow-md' : 'text-gray-700';
  const cardBg = isThemeDark ? 'bg-white/95 backdrop-blur-sm' : 'bg-white';
  const cardBorder = isThemeDark ? 'border-white/30' : 'border-gray-300';
  const cardTitleColor = 'text-gray-900'; // Always dark on light cards
  const cardDescColor = 'text-gray-700'; // Always dark on light cards
  const arrowColor = 'text-gray-400 group-hover:text-violet-600'; // Always dark on light cards
  const linkColor = isThemeDark ? 'text-white hover:text-gray-100 drop-shadow-md' : 'text-gray-700 hover:text-violet-700';

  // Load Google Fonts dynamically based on theme typography
  useEffect(() => {
    const fontsToLoad = new Set<string>();
    
    // Add title font
    if (theme?.typography?.titleFont) {
      fontsToLoad.add(theme.typography.titleFont);
    }
    
    // Add body font
    if (theme?.typography?.bodyFont) {
      fontsToLoad.add(theme.typography.bodyFont);
    }
    
    // Map font names to Google Fonts API names (system fonts don't need loading)
    const googleFontsMap: Record<string, string> = {
      inter: 'Inter:wght@400;500;600;700;800',
      poppins: 'Poppins:wght@400;500;600;700;800',
      playfair: 'Playfair+Display:wght@400;700;900',
      montserrat: 'Montserrat:wght@400;500;600;700;800',
      raleway: 'Raleway:wght@300;400;500;600;700',
      lora: 'Lora:wght@400;500;600;700',
      opensans: 'Open+Sans:wght@400;500;600;700;800',
      roboto: 'Roboto:wght@300;400;500;700;900',
      nunito: 'Nunito:wght@400;500;600;700;800',
      ubuntu: 'Ubuntu:wght@300;400;500;700',
      outfit: 'Outfit:wght@400;500;600;700;800',
      workSans: 'Work+Sans:wght@400;500;600;700;800',
      dmSans: 'DM+Sans:wght@400;500;700',
      spacegrotesk: 'Space+Grotesk:wght@400;500;600;700',
      manrope: 'Manrope:wght@400;500;600;700;800',
      plusjakarta: 'Plus+Jakarta+Sans:wght@400;500;600;700;800',
      bevietnampro: 'Be+Vietnam+Pro:wght@400;500;600;700',
      sora: 'Sora:wght@400;500;600;700;800',
      merriweather: 'Merriweather:wght@300;400;700;900',
      sourcecodepro: 'Source+Code+Pro:wght@400;500;600;700',
      // System fonts below don't need Google Fonts loading
      // arial, helvetica, timesnewroman, georgia, garamond, calibri, 
      // verdana, tahoma, trebuchet, comicsans, couriernew
    };

    fontsToLoad.forEach(fontName => {
      const googleFontName = googleFontsMap[fontName];
      if (!googleFontName) return;

      // Check if font is already loaded
      const fontId = `google-font-${fontName}`;
      if (document.getElementById(fontId)) return;

      // Create and inject font link
      const link = document.createElement('link');
      link.id = fontId;
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${googleFontName}&display=swap`;
      document.head.appendChild(link);
    });

    // Cleanup: remove fonts when component unmounts
    return () => {
      fontsToLoad.forEach(fontName => {
        const fontId = `google-font-${fontName}`;
        const existingLink = document.getElementById(fontId);
        if (existingLink) {
          // Don't remove immediately to avoid flicker
          // existingLink.remove();
        }
      });
    };
  }, [theme?.typography?.titleFont, theme?.typography?.bodyFont]);

  // Update document title and favicon from theme branding
  useEffect(() => {
    if (theme?.branding?.siteName) {
      document.title = theme.branding.siteName;
    }

    if (theme?.branding?.faviconUrl) {
      // Remove existing favicon
      const existingFavicons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
      existingFavicons.forEach(favicon => favicon.remove());

      // Add new favicon
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = theme.branding.faviconUrl;
      document.head.appendChild(link);
    }
  }, [theme?.branding?.siteName, theme?.branding?.faviconUrl]);

  const handleDeleteBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
    if (selectedBlockId === id) {
      onSelectBlock(null);
    }
  };

  // Handle block updates (for inline editing in blocks like SocialLinksBlock)
  const handleBlockUpdate = (blockId: string, updates: Partial<Block>) => {
    setBlocks(blocks.map((b: Block) => 
      b.id === blockId 
        ? { ...b, ...updates, content: { ...b.content, ...updates.content } }
        : b
    ));
  };

  // Get background style from theme
  const backgroundStyle = theme ? getBackgroundStyle(theme.background) : { backgroundColor: '#ffffff' };

  // Apply theme layout settings
  const maxWidthMap: Record<string, string> = {
    '560': 'max-w-[560px]',
    '640': 'max-w-[640px]',
    '680': 'max-w-[680px]',
    '720': 'max-w-[720px]',
    '768': 'max-w-[768px]',
    '800': 'max-w-[800px]',
    '1024': 'max-w-[1024px]',
  };

  const paddingMap: Record<string, string> = {
    tight: 'p-3 sm:p-4',
    compact: 'p-4 sm:p-5',
    normal: 'p-6 sm:p-8',
    relaxed: 'p-8 sm:p-10',
  };

  const spacingMap: Record<string, string> = {
    tight: 'space-y-2',
    compact: 'space-y-3',
    normal: 'space-y-4',
    relaxed: 'space-y-6',
  };

  const maxWidthClass = maxWidthMap[theme?.maxWidth || '680'] || 'max-w-[680px]';
  const paddingClass = paddingMap[theme?.padding || 'normal'] || 'p-6 sm:p-8';
  const spacingClass = spacingMap[theme?.spacing || 'normal'] || 'space-y-4';

  return (
    <div 
      ref={setNodeRef}
      className={`min-h-full w-full transition-all duration-300 ${
        isOver ? 'ring-2 ring-primary/50 ring-inset bg-primary/5' : ''
      }`}
      style={backgroundStyle}
    >
      {/* Video background if theme uses video */}
      {theme?.background.type === 'video' && theme.background.videoUrl && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop={theme.background.videoLoop ?? true}
            muted={theme.background.videoMuted ?? true}
            playsInline
            className="w-full h-full object-cover"
            style={{ opacity: theme.background.videoOpacity ?? 1 }}
          >
            <source src={theme.background.videoUrl} type="video/mp4" />
          </video>
        </div>
      )}

      {/* Content container with theme-aware styling */}
      <div className={`h-full ${maxWidthClass} mx-auto ${paddingClass} overflow-y-auto relative z-10`}>
        {blocks.length === 0 ? (
          <div className="flex items-center justify-center min-h-[600px] px-4">
            <div className="text-center max-w-xl">
              {/* Animated stacked blocks icon */}
              <div className="relative inline-flex items-center justify-center mb-8 animate-in fade-in zoom-in duration-700">
                {/* Background glow */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-400 to-blue-500 opacity-20 blur-2xl animate-pulse" />
                
                {/* Stacked blocks illustration */}
                <div className="relative">
                  <div className="absolute -left-6 -top-2 w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 opacity-60 rotate-12 shadow-lg" />
                  <div className="absolute -right-6 -top-2 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-violet-500 opacity-60 -rotate-12 shadow-lg" />
                  <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-blue-600 shadow-2xl flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Main headline */}
              <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${headlineColor}`}>
                Get Started
              </h2>
              
              {/* Simple description - WCAG AA compliant */}
              <p className={`text-xl ${descriptionColor} mb-12 font-medium`}>
                Drag blocks from the left to build your page
              </p>

              {/* Visual block guide */}
              <div className="max-w-md mx-auto space-y-4 mb-10">
                {/* Profile hint */}
                <div className={`flex items-center gap-4 p-5 ${cardBg} rounded-xl border-2 border-dashed ${cardBorder} hover:border-violet-400 hover:bg-violet-50 transition-all group`}>
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`text-lg font-bold ${cardTitleColor}`}>Profile Block</p>
                    <p className={`text-base ${cardDescColor} font-medium`}>Add your photo, name & bio</p>
                  </div>
                  <svg className={`w-6 h-6 ${arrowColor} transition-colors`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Link Button hint */}
                <div className={`flex items-center gap-4 p-5 ${cardBg} rounded-xl border-2 border-dashed ${cardBorder} hover:border-blue-400 hover:bg-blue-50 transition-all group`}>
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`text-lg font-bold ${cardTitleColor}`}>Link Button Block</p>
                    <p className={`text-base ${cardDescColor} font-medium`}>Connect to social media & more</p>
                  </div>
                  <svg className={`w-6 h-6 ${arrowColor} transition-colors`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* More blocks hint */}
                <div className={`flex items-center gap-4 p-5 ${cardBg} rounded-xl border-2 border-dashed ${cardBorder} hover:border-purple-400 hover:bg-purple-50 transition-all group`}>
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-pink-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`text-lg font-bold ${cardTitleColor}`}>More Blocks</p>
                    <p className={`text-base ${cardDescColor} font-medium`}>Text, images, videos & more</p>
                  </div>
                  <svg className={`w-6 h-6 ${arrowColor} transition-colors`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Optional: Browse themes */}
              {onThemeClick && (
                <button 
                  onClick={onThemeClick}
                  className={`text-base ${linkColor} font-bold underline underline-offset-4 transition-colors`}
                  aria-label="Browse 33 available themes"
                >
                  or browse {PRESET_THEMES.length} themes →
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className={`${spacingClass} pb-20`}>
            {blocks.map((block) => (
              <SortableBlock
                key={block.id}
                block={block}
                isSelected={isPreview ? false : selectedBlockId === block.id}
                onSelect={isPreview ? () => {} : () => onSelectBlock(block.id)}
                onDelete={isPreview ? () => {} : () => handleDeleteBlock(block.id)}
                theme={theme}
                isPreview={isPreview}
                onBlockUpdate={isPreview ? undefined : handleBlockUpdate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Global Cart System - Fixed position, won't affect layout */}
      <div className="fixed inset-0 pointer-events-none z-40">
        <div className="pointer-events-auto">
          <CartSystem 
            creatorId="demo-creator"
            micrositeId="demo-microsite"
            theme={{
              primaryColor: theme?.branding?.primaryColor || '#3b82f6',
              isDark: isDarkBackground()
            }}
          />
        </div>
      </div>
    </div>
  );
}
