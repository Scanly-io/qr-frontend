/**
 * Events Block Component
 * 
 * A visually stunning events/calendar block with multiple layout options
 * and beautiful animations.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ExternalLink, 
  ChevronRight,
  Ticket,
  Users,
  Sparkles,
  CalendarDays,
  ArrowRight,
  Star,
} from 'lucide-react';
import type { Block } from '@/types';
import type { PageTheme } from '@/types/theme';
import { FONT_FAMILY_MAP } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { 
  borders, 
  animations, 
  getCardStyles
} from '@/utils/designSystem';
import { trackCTA } from '@/utils/trackCTA';

interface EventsBlockProps {
  block: Block;
  theme?: PageTheme;
}

interface CalendarEvent {
  title: string;
  date: string;
  time?: string;
  endTime?: string;
  location?: string;
  description?: string;
  link?: string;
  image?: string;
  category?: string;
  isFeatured?: boolean;
  ticketPrice?: string;
  attendees?: number;
}

function isDarkBackground(theme?: PageTheme): boolean {
  const bgColor = theme?.background?.color || theme?.background?.gradientFrom || '#ffffff';
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) || 255;
  const g = parseInt(hex.substr(2, 2), 16) || 255;
  const b = parseInt(hex.substr(4, 2), 16) || 255;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  'Music': { bg: 'from-purple-500 to-pink-500', text: 'text-white', border: 'border-purple-400' },
  'Tech': { bg: 'from-blue-500 to-cyan-500', text: 'text-white', border: 'border-blue-400' },
  'Art': { bg: 'from-orange-500 to-red-500', text: 'text-white', border: 'border-orange-400' },
  'Sports': { bg: 'from-green-500 to-emerald-500', text: 'text-white', border: 'border-green-400' },
  'Food': { bg: 'from-yellow-500 to-orange-500', text: 'text-white', border: 'border-yellow-400' },
  'Business': { bg: 'from-slate-600 to-slate-800', text: 'text-white', border: 'border-slate-400' },
  'Workshop': { bg: 'from-indigo-500 to-purple-500', text: 'text-white', border: 'border-indigo-400' },
  'Party': { bg: 'from-pink-500 to-rose-500', text: 'text-white', border: 'border-pink-400' },
  'default': { bg: 'from-gray-500 to-gray-600', text: 'text-white', border: 'border-gray-400' },
};

export default function EventsBlock({ block, theme }: EventsBlockProps) {
  const [hoveredEvent, setHoveredEvent] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const title = (block.content.title as string) || '';
  const subtitle = (block.content.subtitle as string) || '';
  const events = Array.isArray(block.content.events) ? (block.content.events as CalendarEvent[]) : [];
  const layout = (block.content.layout as 'cards' | 'list' | 'timeline' | 'compact' | 'featured') || 'cards';
  const showPastEvents = (block.content.showPastEvents as boolean) ?? false;
  const showTime = (block.content.showTime as boolean) ?? true;
  const showLocation = (block.content.showLocation as boolean) ?? true;
  const showDescription = (block.content.showDescription as boolean) ?? true;
  const showCategories = (block.content.showCategories as boolean) ?? true;

  const primaryColor = theme?.branding?.primaryColor || theme?.button?.backgroundColor || '#8b5cf6';
  const titleFont = theme?.typography?.titleFont || 'inter';
  const bodyFont = theme?.typography?.bodyFont || 'inter';
  const titleFontFamily = FONT_FAMILY_MAP[titleFont] || "'Inter', sans-serif";
  const bodyFontFamily = FONT_FAMILY_MAP[bodyFont] || "'Inter', sans-serif";
  
  const isDark = isDarkBackground(theme);
  const titleColor = theme?.typography?.titleColor || (isDark ? '#ffffff' : '#18181b');
  const bodyColor = theme?.typography?.bodyColor || (isDark ? '#a1a1aa' : '#71717a');
  const cardBg = isDark ? 'bg-white/5' : 'bg-white';
  const cardBorder = isDark ? 'border-white/10' : 'border-gray-100';

  const now = new Date();
  const filteredEvents = showPastEvents 
    ? events 
    : events.filter((event) => new Date(event.date) >= now);

  const categories = [...new Set(filteredEvents.map(e => e.category).filter(Boolean))];

  const displayEvents = selectedCategory 
    ? filteredEvents.filter(e => e.category === selectedCategory)
    : filteredEvents;

  const sortedEvents = [...displayEvents].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: date.getDate(),
      weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
      year: date.getFullYear(),
      full: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    };
  };

  const isToday = (dateStr: string) => {
    const eventDate = new Date(dateStr).toDateString();
    return eventDate === now.toDateString();
  };

  const isThisWeek = (dateStr: string) => {
    const eventDate = new Date(dateStr);
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return eventDate >= now && eventDate <= weekFromNow;
  };

  const openLocation = (location: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const query = encodeURIComponent(location);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const getCategoryStyle = (category?: string) => {
    return categoryColors[category || ''] || categoryColors['default'];
  };

  if (sortedEvents.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full py-8"
      >
        <div className={cn(
          'text-center p-12 rounded-3xl border-2 border-dashed',
          isDark ? 'bg-white/5 border-white/20' : 'bg-gray-50 border-gray-200'
        )}>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <CalendarDays className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: primaryColor }} />
          </motion.div>
          <p 
            className="text-xl font-bold mb-2"
            style={{ fontFamily: titleFontFamily, color: titleColor }}
          >
            No Upcoming Events
          </p>
          <p 
            className="text-sm"
            style={{ fontFamily: bodyFontFamily, color: bodyColor }}
          >
            Check back soon for exciting events!
          </p>
        </div>
      </motion.div>
    );
  }

  const FeaturedEventCard = ({ event, idx }: { event: CalendarEvent; idx: number }) => {
    const dateInfo = formatDate(event.date);
    const catStyle = getCategoryStyle(event.category);
    const isHovered = hoveredEvent === idx;
    
    return (
      <motion.div
        initial={animations.fadeIn.initial}
        animate={animations.fadeIn.animate}
        transition={{ ...animations.spring.gentle, delay: idx * 0.1 }}
        whileHover={{
          y: -8,
          transition: animations.spring.bouncy
        }}
        onHoverStart={() => setHoveredEvent(idx)}
        onHoverEnd={() => setHoveredEvent(null)}
        className={cn(
          'group relative overflow-hidden cursor-pointer',
          event.isFeatured ? 'col-span-full md:col-span-2' : ''
        )}
        style={{
          ...getCardStyles(isDark, isHovered, primaryColor),
          borderRadius: borders.radius['2xl'],
        }}
      >
        <div className="absolute inset-0">
          {event.image ? (
            <>
              <motion.img 
                src={event.image} 
                alt={event.title}
                className="w-full h-full object-cover"
                animate={{ scale: hoveredEvent === idx ? 1.1 : 1 }}
                transition={{ duration: 0.6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
            </>
          ) : (
            <div className={cn('w-full h-full bg-gradient-to-br', catStyle.bg)} />
          )}
        </div>

        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
          animate={{ opacity: hoveredEvent === idx ? 0.8 : 0.4 }}
        />

        {event.isFeatured && (
          <motion.div
            className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-yellow-500/90 text-black text-xs font-bold"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Star className="w-3 h-3 fill-current" />
            FEATURED
          </motion.div>
        )}

        <div className={cn(
          'relative p-6 h-full flex flex-col justify-end',
          event.isFeatured ? 'min-h-[320px]' : 'min-h-[260px]'
        )}>
          {event.category && (
            <motion.span
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 + 0.2 }}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold mb-3 w-fit bg-white/20 backdrop-blur-sm text-white border border-white/30"
            >
              <Sparkles className="w-3 h-3" />
              {event.category}
            </motion.span>
          )}

          <motion.div
            className="absolute top-4 left-4 bg-white rounded-2xl p-3 text-center shadow-xl"
            whileHover={{ scale: 1.1, rotate: -5 }}
          >
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {dateInfo.month}
            </div>
            <div className="text-3xl font-black text-gray-900 leading-none">
              {dateInfo.day}
            </div>
            {isToday(event.date) && (
              <div className="text-[10px] font-bold text-green-600 uppercase mt-1">
                Today!
              </div>
            )}
          </motion.div>

          <motion.h3
            className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight"
            style={{ fontFamily: titleFontFamily }}
            animate={{ x: hoveredEvent === idx ? 5 : 0 }}
          >
            {event.title}
          </motion.h3>

          <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm mb-4">
            {showTime && event.time && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {event.time}{event.endTime && ` - ${event.endTime}`}
              </span>
            )}
            {showLocation && event.location && (
              <button
                onClick={(e) => openLocation(event.location!, e)}
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <MapPin className="w-4 h-4" />
                {event.location}
              </button>
            )}
            {event.attendees && (
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                {event.attendees}+ attending
              </span>
            )}
          </div>

          {showDescription && event.description && (
            <p className="text-white/70 text-sm line-clamp-2 mb-4" style={{ fontFamily: bodyFontFamily }}>
              {event.description}
            </p>
          )}

          <div className="flex items-center gap-3">
            {event.link && (
              <motion.a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 rounded-xl font-bold text-sm hover:bg-white/90 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.stopPropagation(); trackCTA(block.id, event.ticketPrice ? `Get Tickets • ${event.ticketPrice}` : 'Learn More', event.link!, 'events'); }}
              >
                {event.ticketPrice ? (
                  <>
                    <Ticket className="w-4 h-4" />
                    Get Tickets • {event.ticketPrice}
                  </>
                ) : (
                  <>
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.a>
            )}
          </div>
        </div>

        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 100%, ${primaryColor}40, transparent 70%)`,
          }}
          animate={{ opacity: hoveredEvent === idx ? 1 : 0 }}
        />
      </motion.div>
    );
  };

  const CompactEventItem = ({ event, idx }: { event: CalendarEvent; idx: number }) => {
    const dateInfo = formatDate(event.date);
    const catStyle = getCategoryStyle(event.category);
    
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: idx * 0.05 }}
        whileHover={{ x: 8, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}
        onHoverStart={() => setHoveredEvent(idx)}
        onHoverEnd={() => setHoveredEvent(null)}
        className={cn(
          'group flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer',
          cardBg, cardBorder
        )}
      >
        <div 
          className={cn(
            'flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center text-white font-bold bg-gradient-to-br',
            catStyle.bg
          )}
        >
          <span className="text-[10px] uppercase tracking-wider opacity-80">{dateInfo.month}</span>
          <span className="text-xl leading-none">{dateInfo.day}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 
              className="font-bold truncate"
              style={{ fontFamily: titleFontFamily, color: titleColor }}
            >
              {event.title}
            </h4>
            {isToday(event.date) && (
              <span className="flex-shrink-0 px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full">
                TODAY
              </span>
            )}
            {isThisWeek(event.date) && !isToday(event.date) && (
              <span className="flex-shrink-0 px-2 py-0.5 bg-blue-500 text-white text-[10px] font-bold rounded-full">
                THIS WEEK
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 text-sm" style={{ color: bodyColor }}>
            {showTime && event.time && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {event.time}
              </span>
            )}
            {showLocation && event.location && (
              <span className="flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3" />
                {event.location}
              </span>
            )}
          </div>
        </div>

        <motion.div
          className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          animate={{ x: hoveredEvent === idx ? 5 : 0 }}
        >
          <ChevronRight className="w-5 h-5" style={{ color: primaryColor }} />
        </motion.div>
      </motion.div>
    );
  };

  const TimelineEventItem = ({ event, idx, isLast }: { event: CalendarEvent; idx: number; isLast: boolean }) => {
    const dateInfo = formatDate(event.date);
    const catStyle = getCategoryStyle(event.category);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.1 }}
        className="relative flex gap-6"
      >
        <div className="flex flex-col items-center">
          <motion.div
            className={cn(
              'w-4 h-4 rounded-full border-4 z-10',
              isToday(event.date) ? 'bg-green-500 border-green-200' : 'border-current'
            )}
            style={{ borderColor: isToday(event.date) ? undefined : primaryColor, backgroundColor: isToday(event.date) ? undefined : primaryColor }}
            whileHover={{ scale: 1.3 }}
          />
          {!isLast && (
            <div 
              className="w-0.5 flex-1 min-h-[60px]"
              style={{ backgroundColor: `${primaryColor}30` }}
            />
          )}
        </div>

        <motion.div
          whileHover={{ x: 5 }}
          className="flex-1 pb-8 group cursor-pointer"
          onMouseEnter={() => setHoveredEvent(idx)}
          onMouseLeave={() => setHoveredEvent(null)}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-bold" style={{ color: primaryColor }}>
              {dateInfo.full}
            </span>
            {isToday(event.date) && (
              <span className="px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full animate-pulse">
                HAPPENING NOW
              </span>
            )}
          </div>

          <div 
            className={cn(
              'p-5 rounded-2xl border transition-all group-hover:shadow-lg',
              cardBg, cardBorder,
              'group-hover:border-opacity-50'
            )}
            style={{ borderColor: hoveredEvent === idx ? primaryColor : undefined }}
          >
            {event.category && (
              <span className={cn(
                'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold mb-3 text-white bg-gradient-to-r',
                catStyle.bg
              )}>
                {event.category}
              </span>
            )}
            
            <h4 
              className="text-lg font-bold mb-2"
              style={{ fontFamily: titleFontFamily, color: titleColor }}
            >
              {event.title}
            </h4>

            <div className="flex flex-wrap items-center gap-3 text-sm mb-3" style={{ color: bodyColor }}>
              {showTime && event.time && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {event.time}
                </span>
              )}
              {showLocation && event.location && (
                <button
                  onClick={(e) => openLocation(event.location!, e)}
                  className="flex items-center gap-1.5 hover:underline"
                >
                  <MapPin className="w-4 h-4" />
                  {event.location}
                </button>
              )}
            </div>

            {showDescription && event.description && (
              <p 
                className="text-sm line-clamp-2 mb-3"
                style={{ fontFamily: bodyFontFamily, color: bodyColor }}
              >
                {event.description}
              </p>
            )}

            {event.link && (
              <motion.a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold"
                style={{ color: primaryColor }}
                whileHover={{ x: 5 }}
                onClick={() => trackCTA(block.id, event.ticketPrice ? `Get Tickets • ${event.ticketPrice}` : 'Learn More', event.link!, 'events')}
              >
                {event.ticketPrice ? `Get Tickets • ${event.ticketPrice}` : 'Learn More'}
                <ExternalLink className="w-4 h-4" />
              </motion.a>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="w-full py-6">
      {(title || subtitle) && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          {title && (
            <h2 
              className="text-2xl md:text-3xl font-black flex items-center gap-3"
              style={{ fontFamily: titleFontFamily, color: titleColor }}
            >
              <Calendar className="w-7 h-7" style={{ color: primaryColor }} />
              {title}
            </h2>
          )}
          {subtitle && (
            <p 
              className="text-base mt-1 ml-10"
              style={{ fontFamily: bodyFontFamily, color: bodyColor }}
            >
              {subtitle}
            </p>
          )}
        </motion.div>
      )}

      {showCategories && categories.length > 1 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(null)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-bold transition-all',
              !selectedCategory 
                ? 'text-white shadow-lg' 
                : isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'
            )}
            style={!selectedCategory ? { backgroundColor: primaryColor } : { color: bodyColor }}
          >
            All Events
          </motion.button>
          {categories.map((cat) => {
            const catStyle = getCategoryStyle(cat);
            return (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat as string)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-bold transition-all',
                  selectedCategory === cat 
                    ? `bg-gradient-to-r ${catStyle.bg} text-white shadow-lg` 
                    : isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'
                )}
                style={selectedCategory !== cat ? { color: bodyColor } : undefined}
              >
                {cat}
              </motion.button>
            );
          })}
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory || 'all'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {layout === 'cards' || layout === 'featured' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedEvents.map((event, idx) => (
                <FeaturedEventCard key={idx} event={event} idx={idx} />
              ))}
            </div>
          ) : layout === 'timeline' ? (
            <div className="max-w-2xl">
              {sortedEvents.map((event, idx) => (
                <TimelineEventItem 
                  key={idx} 
                  event={event} 
                  idx={idx} 
                  isLast={idx === sortedEvents.length - 1} 
                />
              ))}
            </div>
          ) : layout === 'compact' ? (
            <div className="space-y-2">
              {sortedEvents.map((event, idx) => (
                <CompactEventItem key={idx} event={event} idx={idx} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedEvents.map((event, idx) => (
                <FeaturedEventCard key={idx} event={event} idx={idx} />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
