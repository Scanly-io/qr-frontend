import type { Block } from '@/types';
import type { PageTheme } from '@/types/theme';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { spacing, shadows, animations, borders } from '@/utils/designSystem';
import { getTitleFont, getBodyFont } from '@/lib/themeHelpers';
import { trackCTA } from '@/utils/trackCTA';

interface MapBlockProps {
  block: Block;
  theme?: PageTheme;
}

export default function MapBlock({ block, theme }: MapBlockProps) {
  const {
    address = '1600 Amphitheatre Parkway, Mountain View, CA',
    latitude,
    longitude,
    zoom = 15,
    mapType = 'roadmap',
  } = block.content;

  const style = (block.content.style as 'classic' | 'card' | 'minimal' | 'modern' | 'split' | 'bold') || 'classic';

  // Theme integration
  const primaryColor = theme?.branding?.primaryColor || theme?.button?.backgroundColor || '#3B82F6';
  const titleFontFamily = getTitleFont(theme);
  const bodyFontFamily = getBodyFont(theme);

  // Build Google Maps embed URL
  const getMapUrl = () => {
    const baseUrl = 'https://www.google.com/maps/embed/v1/place';
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8';
    
    let location = address as string;
    if (latitude && longitude) {
      location = `${latitude},${longitude}`;
    }
    
    const params = new URLSearchParams({
      key: apiKey,
      q: location,
      zoom: String(zoom),
      maptype: mapType as string,
    });

    return `${baseUrl}?${params.toString()}`;
  };

  // Get directions URL
  const getDirectionsUrl = () => {
    let destination = address as string;
    if (latitude && longitude) {
      destination = `${latitude},${longitude}`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
  };

  const mapUrl = getMapUrl();

  // Classic Style - Standard embedded map
  if (style === 'classic') {
    return (
      <div className="w-full py-8">
        <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-lg">
          <iframe
            src={mapUrl}
            className="w-full h-[400px]"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map of ${address}`}
          />
          
          {/* Directions button overlay */}
          <div className="absolute bottom-4 right-4">
            <motion.a
              {...animations.hover.scale}
              {...animations.tap}
              href={getDirectionsUrl()}
              onClick={() => trackCTA(block.id, 'Get Directions', getDirectionsUrl(), 'map')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-semibold text-white transition-all"
              style={{ 
                backgroundColor: primaryColor,
                padding: `${spacing[2]} ${spacing[4]}`,
                borderRadius: borders.radius.xl,
                boxShadow: shadows.lg
              }}
            >
              <Navigation className="w-4 h-4" />
              Directions
            </motion.a>
          </div>
        </div>
      </div>
    );
  }

  // Card Style - Map with info card overlay
  if (style === 'card') {
    return (
      <div className="w-full py-8">
        <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-xl">
          <iframe
            src={mapUrl}
            className="w-full h-[450px]"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map of ${address}`}
          />
          
          {/* Info card overlay */}
          <div className="absolute top-4 left-4 right-4 bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-2xl border border-zinc-200 dark:border-zinc-700 backdrop-blur-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${primaryColor}15` }}
                  >
                    <MapPin className="w-4 h-4" style={{ color: primaryColor }} />
                  </div>
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100" style={{ fontFamily: titleFontFamily }}>Location</h3>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400" style={{ fontFamily: bodyFontFamily }}>{String(address)}</p>
              </div>
              
              <a
                href={getDirectionsUrl()}
                onClick={() => trackCTA(block.id, 'Get Directions', getDirectionsUrl(), 'map')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title="Get directions"
              >
                <Navigation className="w-5 h-5" style={{ color: primaryColor }} />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Minimal Style - Clean with subtle border
  if (style === 'minimal') {
    return (
      <div className="w-full py-8">
        <div className="relative rounded-xl overflow-hidden border-2 border-zinc-200 dark:border-zinc-700">
          <iframe
            src={mapUrl}
            className="w-full h-[350px]"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map of ${address}`}
          />
        </div>
        
        {/* Address below map */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <MapPin className="w-4 h-4" />
            <span>{String(address)}</span>
          </div>
          <a
            href={getDirectionsUrl()}
            onClick={() => trackCTA(block.id, 'Get Directions', getDirectionsUrl(), 'map')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium hover:underline"
            style={{ color: primaryColor }}
          >
            Get directions →
          </a>
        </div>
      </div>
    );
  }

  // Modern Style - Glassmorphic overlay
  if (style === 'modern') {
    return (
      <div className="w-full py-8">
        <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-xl">
          <iframe
            src={mapUrl}
            className="w-full h-[400px]"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map of ${address}`}
          />
          
          {/* Glassmorphic bottom overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-700 p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: primaryColor }}
                >
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400" style={{ fontFamily: bodyFontFamily }}>Location</p>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100" style={{ fontFamily: titleFontFamily }}>{String(address)}</p>
                </div>
              </div>
              
              <a
                href={getDirectionsUrl()}
                onClick={() => trackCTA(block.id, 'Get Directions', getDirectionsUrl(), 'map')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: primaryColor }}
              >
                <Navigation className="w-4 h-4" />
                Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Split Style - Map on left, info on right (mobile stacks)
  if (style === 'split') {
    return (
      <div className="w-full py-8">
        <div className="grid md:grid-cols-2 gap-4 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-xl">
          <div className="relative h-[300px] md:h-full min-h-[400px]">
            <iframe
              src={mapUrl}
              className="w-full h-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map of ${address}`}
            />
          </div>
          
          <div className="bg-white dark:bg-zinc-900 p-8 flex flex-col justify-center">
            <div className="space-y-6">
              <div>
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${primaryColor}15` }}
                >
                  <MapPin className="w-6 h-6" style={{ color: primaryColor }} />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2" style={{ fontFamily: titleFontFamily }}>Visit Us</h3>
                <p className="text-zinc-600 dark:text-zinc-400" style={{ fontFamily: bodyFontFamily }}>{String(address)}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={getDirectionsUrl()}
                  onClick={() => trackCTA(block.id, 'Get Directions', getDirectionsUrl(), 'map')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </a>
                
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(String(address))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border-2 transition-all duration-200 hover:scale-105"
                  style={{ 
                    borderColor: primaryColor,
                    color: primaryColor 
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Bold Style - Large map with floating action buttons
  if (style === 'bold') {
    return (
      <div className="w-full py-8">
        <div className="relative rounded-3xl overflow-hidden border-2 shadow-2xl" style={{ borderColor: primaryColor }}>
          <iframe
            src={mapUrl}
            className="w-full h-[500px]"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map of ${address}`}
          />
          
          {/* Floating action buttons */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <a
              href={getDirectionsUrl()}
              onClick={() => trackCTA(block.id, 'Get Directions', getDirectionsUrl(), 'map')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-200 hover:scale-110"
              style={{ backgroundColor: primaryColor }}
              title="Get directions"
            >
              <Navigation className="w-5 h-5" />
            </a>
            
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(String(address))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center shadow-2xl transition-all duration-200 hover:scale-110 border-2"
              style={{ borderColor: primaryColor }}
              title="Open in Google Maps"
            >
              <ExternalLink className="w-5 h-5" style={{ color: primaryColor }} />
            </a>
          </div>
          
          {/* Bottom label */}
          <div 
            className="absolute bottom-0 left-0 right-0 py-4 px-6"
            style={{ 
              background: `linear-gradient(to top, ${primaryColor}ee, ${primaryColor}99, transparent)` 
            }}
          >
            <div className="flex items-center gap-3 text-white">
              <MapPin className="w-5 h-5" />
              <p className="font-semibold">{String(address)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="w-full py-8">
      <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-lg">
        <iframe
          src={mapUrl}
          className="w-full h-[400px]"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Map of ${address}`}
        />
      </div>
    </div>
  );
}
