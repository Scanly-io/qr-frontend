import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heading, Type, MousePointerClick, Image, Mail, Minus, Video,
  MinusCircle, Share2, Clock, MessageSquareQuote, HelpCircle, ImageIcon,
  DollarSign, Grid3x3, TrendingUp, MapPin, Sparkles, User, Link2, Search,
  Layers, Calendar, LayoutPanelTop, AlignJustify, Plus, Star, CreditCard,
  ShoppingBag, ShoppingCart, ChevronRight, Zap, X, Home, UtensilsCrossed,
  Music, Percent, CalendarDays, ArrowLeft,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { BlockType } from '@/types';
import { animations } from '@/utils/designSystem';

interface BlockDefinition {
  type: BlockType;
  label: string;
  icon: typeof Heading;
  description: string;
  category: string;
  featured?: boolean;
  popular?: boolean;
  keywords: string[];
  gradient: string;
}

const blockTypes: BlockDefinition[] = [
  // === LINKTREE BLOCKS ===
  { type: 'profile', label: 'Profile', icon: User, description: 'Avatar, name & bio', category: 'Linktree', featured: true, popular: true, keywords: ['avatar', 'bio', 'name', 'about'], gradient: 'from-violet-500 to-purple-600' },
  { type: 'linkButton', label: 'Link Button', icon: Link2, description: 'Styled link button', category: 'Linktree', featured: true, popular: true, keywords: ['link', 'button', 'cta'], gradient: 'from-slate-700 to-slate-900' },
  { type: 'header', label: 'Header', icon: LayoutPanelTop, description: 'Navigation header', category: 'Linktree', featured: true, keywords: ['navigation', 'nav', 'menu'], gradient: 'from-gray-700 to-gray-900' },
  { type: 'footer', label: 'Footer', icon: AlignJustify, description: 'Page footer', category: 'Linktree', keywords: ['bottom', 'copyright'], gradient: 'from-gray-500 to-gray-700' },
  
  // === BASIC BLOCKS ===
  { type: 'heading', label: 'Heading', icon: Heading, description: 'Section title', category: 'Basic', popular: true, keywords: ['title', 'h1', 'h2'], gradient: 'from-blue-500 to-blue-700' },
  { type: 'text', label: 'Text', icon: Type, description: 'Paragraph text', category: 'Basic', popular: true, keywords: ['paragraph', 'body'], gradient: 'from-sky-500 to-sky-700' },
  { type: 'button', label: 'Button', icon: MousePointerClick, description: 'CTA button', category: 'Basic', keywords: ['cta', 'action'], gradient: 'from-indigo-500 to-indigo-700' },
  { type: 'image', label: 'Image', icon: Image, description: 'Photo or graphic', category: 'Basic', popular: true, keywords: ['photo', 'picture'], gradient: 'from-pink-500 to-rose-600' },
  { type: 'spacer', label: 'Spacer', icon: Minus, description: 'Vertical space', category: 'Basic', keywords: ['space', 'gap'], gradient: 'from-gray-400 to-gray-600' },
  { type: 'divider', label: 'Divider', icon: MinusCircle, description: 'Line separator', category: 'Basic', keywords: ['line', 'separator'], gradient: 'from-gray-400 to-gray-600' },
  
  // === MEDIA BLOCKS ===
  { type: 'video', label: 'Video', icon: Video, description: 'YouTube, TikTok & more', category: 'Media', popular: true, keywords: ['youtube', 'tiktok'], gradient: 'from-red-500 to-red-700' },
  { type: 'gallery', label: 'Gallery', icon: ImageIcon, description: 'Image carousel', category: 'Media', keywords: ['carousel', 'slider'], gradient: 'from-fuchsia-500 to-purple-600' },
  { type: 'hero', label: 'Hero', icon: Sparkles, description: 'Large banner', category: 'Media', keywords: ['banner', 'header'], gradient: 'from-violet-600 to-indigo-700' },
  
  // === INTERACTIVE BLOCKS ===
  { type: 'form', label: 'Form', icon: Mail, description: 'Email signup', category: 'Interactive', popular: true, keywords: ['email', 'signup'], gradient: 'from-emerald-500 to-emerald-700' },
  { type: 'social', label: 'Social Links', icon: Share2, description: 'Social icons', category: 'Interactive', popular: true, keywords: ['instagram', 'twitter'], gradient: 'from-pink-500 to-violet-600' },
  { type: 'countdown', label: 'Countdown', icon: Clock, description: 'Event timer', category: 'Interactive', keywords: ['timer', 'launch'], gradient: 'from-amber-500 to-orange-600' },
  { type: 'calendar', label: 'Events', icon: Calendar, description: 'Event calendar', category: 'Interactive', keywords: ['events', 'schedule'], gradient: 'from-blue-500 to-blue-700' },
  { type: 'pricing', label: 'Pricing', icon: DollarSign, description: 'Price plans', category: 'Interactive', keywords: ['plans', 'price'], gradient: 'from-green-500 to-green-700' },
  { type: 'features', label: 'Features', icon: Grid3x3, description: 'Feature grid', category: 'Interactive', keywords: ['benefits', 'list'], gradient: 'from-indigo-500 to-indigo-700' },
  { type: 'stats', label: 'Stats', icon: TrendingUp, description: 'Number counters', category: 'Interactive', keywords: ['numbers', 'metrics'], gradient: 'from-teal-500 to-teal-700' },
  { type: 'map', label: 'Map', icon: MapPin, description: 'Google Maps', category: 'Interactive', keywords: ['location', 'address'], gradient: 'from-rose-500 to-rose-700' },
  
  // === MONETIZATION BLOCKS ===
  { type: 'payment', label: 'Tip Jar', icon: CreditCard, description: 'Accept payments', category: 'Monetization', featured: true, popular: true, keywords: ['tips', 'payment'], gradient: 'from-emerald-500 to-cyan-600' },
  { type: 'product', label: 'Product', icon: ShoppingBag, description: 'Sell products', category: 'Monetization', featured: true, keywords: ['sell', 'shop'], gradient: 'from-orange-500 to-pink-600' },
  { type: 'shop', label: 'Shop', icon: ShoppingCart, description: 'Store with cart', category: 'Monetization', featured: true, popular: true, keywords: ['shop', 'store'], gradient: 'from-violet-500 to-purple-600' },
  { type: 'real-estate', label: 'Real Estate', icon: Home, description: 'Property listings', category: 'Monetization', featured: true, keywords: ['property', 'house'], gradient: 'from-emerald-500 to-teal-600' },
  { type: 'menu', label: 'Food Menu', icon: UtensilsCrossed, description: 'Restaurant menu', category: 'Monetization', featured: true, keywords: ['menu', 'food'], gradient: 'from-orange-500 to-red-600' },
  { type: 'artist', label: 'Artist', icon: Music, description: 'Music & art portfolio', category: 'Monetization', featured: true, keywords: ['music', 'artist'], gradient: 'from-green-500 to-emerald-600' },
  { type: 'deals', label: 'Deals', icon: Percent, description: 'Discounts & promos', category: 'Monetization', featured: true, keywords: ['deal', 'discount'], gradient: 'from-red-500 to-orange-600' },
  { type: 'schedule', label: 'Booking', icon: CalendarDays, description: 'Appointments', category: 'Monetization', featured: true, keywords: ['schedule', 'booking'], gradient: 'from-indigo-500 to-purple-600' },
  
  // === CONTENT BLOCKS ===
  { type: 'testimonial', label: 'Testimonial', icon: MessageSquareQuote, description: 'Review card', category: 'Content', keywords: ['review', 'quote'], gradient: 'from-slate-600 to-slate-800' },
  { type: 'faq', label: 'FAQ', icon: HelpCircle, description: 'Q&A section', category: 'Content', keywords: ['questions', 'answers'], gradient: 'from-yellow-500 to-amber-600' },
];

const categories = [
  { id: 'Linktree', label: 'Link in Bio', icon: Link2, color: 'emerald' },
  { id: 'Basic', label: 'Basic', icon: Type, color: 'blue' },
  { id: 'Media', label: 'Media', icon: Video, color: 'pink' },
  { id: 'Interactive', label: 'Interactive', icon: Zap, color: 'orange' },
  { id: 'Monetization', label: 'Monetize', icon: CreditCard, color: 'green' },
  { id: 'Content', label: 'Content', icon: MessageSquareQuote, color: 'purple' },
];

interface BlockPaletteProps {
  onAddBlock: (type: BlockType) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function BlockPalette({ onAddBlock }: BlockPaletteProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);

  const { filteredBlocks, popularBlocks } = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    if (query) {
      const results = blockTypes.filter(block => 
        block.label.toLowerCase().includes(query) ||
        block.description.toLowerCase().includes(query) ||
        block.keywords.some(k => k.includes(query))
      );
      return { filteredBlocks: results, popularBlocks: [] };
    }
    
    if (selectedCategory) {
      const results = blockTypes.filter(b => b.category === selectedCategory);
      return { filteredBlocks: results, popularBlocks: [] };
    }
    
    const popular = blockTypes.filter(b => b.popular);
    return { filteredBlocks: [], popularBlocks: popular };
  }, [searchQuery, selectedCategory]);
  
  const isFiltered = searchQuery || selectedCategory;

  const BlockCard = ({ block, size = 'medium' }: { block: BlockDefinition; size?: 'small' | 'medium' | 'large' }) => {
    const Icon = block.icon;
    const isHovered = hoveredBlock === block.type;
    
    if (size === 'large') {
      return (
        <motion.button
          {...animations.hover.lift}
          {...animations.tap}
          onMouseEnter={() => setHoveredBlock(block.type)}
          onMouseLeave={() => setHoveredBlock(null)}
          onClick={() => onAddBlock(block.type)}
          className="group relative w-full flex items-center gap-3.5 p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/50 hover:border-violet-400 hover:shadow-lg hover:shadow-violet-500/20 transition-all duration-200 text-left"
        >
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${block.gradient} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl transition-all duration-200`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-slate-800 group-hover:text-violet-600 transition-colors">
                {block.label}
              </span>
              {block.featured && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
            </div>
            <p className="text-xs text-slate-500 truncate mt-0.5">{block.description}</p>
          </div>
          <motion.div 
            animate={{ scale: isHovered ? 1.1 : 1, opacity: isHovered ? 1 : 0.7 }}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg"
          >
            <Plus className="w-5 h-5 text-white" />
          </motion.div>
        </motion.button>
      );
    }
    
    return (
      <motion.button
        {...animations.hover.liftMore}
        {...animations.tap}
        onMouseEnter={() => setHoveredBlock(block.type)}
        onMouseLeave={() => setHoveredBlock(null)}
        onClick={() => onAddBlock(block.type)}
        className="group relative flex flex-col items-center gap-2.5 p-3.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/50 hover:border-violet-400 hover:shadow-lg hover:shadow-violet-500/20 transition-all duration-200 animate-fade-in"
      >
        <motion.div 
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${block.gradient} flex items-center justify-center shadow-lg transition-all duration-200`}
          {...animations.hover.scaleLarge}
        >
          <Icon className="w-5 h-5 text-white" />
        </motion.div>
        <span className="text-[11px] font-bold text-slate-700 text-center leading-tight group-hover:text-violet-600 transition-colors">
          {block.label}
        </span>
        
        {block.featured && (
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
            <Star className="w-2.5 h-2.5 text-white fill-white" />
          </div>
        )}
        
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl backdrop-blur-sm shadow-xl"
            >
              <Plus className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    );
  };
  
  return (
    <div className="h-full flex flex-col -m-4 bg-gradient-to-b from-slate-50/50 to-white">
      {/* Search */}
      <div className="flex-shrink-0 p-4 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search blocks..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setSelectedCategory(null); }}
            className="w-full pl-10 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-800 placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 focus:outline-none transition-all shadow-sm"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-all duration-200"
            >
              <X className="w-3 h-3 text-slate-500" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <AnimatePresence mode="wait">
          {isFiltered ? (
            <motion.div
              key="filtered"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3"
            >
              {/* Back button when in category */}
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm text-violet-600 hover:bg-violet-50 hover:text-violet-700 font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to all
                </button>
              )}
              
              {/* Category header */}
              {selectedCategory && (
                <div className="mb-4 px-3">
                  <h3 className="text-lg font-bold text-stone-800">
                    {categories.find(c => c.id === selectedCategory)?.label}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">{filteredBlocks.length} blocks available</p>
                </div>
              )}
              
              {/* Search results count */}
              {searchQuery && (
                <p className="text-xs text-stone-500 mb-3 px-3">
                  {filteredBlocks.length} result{filteredBlocks.length !== 1 ? 's' : ''} for "<span className="font-medium">{searchQuery}</span>"
                </p>
              )}
              
              {filteredBlocks.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 px-3">
                  {filteredBlocks.map(block => <BlockCard key={block.type} block={block} />)}
                </div>
              ) : (
                <div className="text-center py-12 px-3">
                  <div className="w-16 h-16 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center mx-auto mb-4">
                    <Search className="w-7 h-7 text-stone-400" />
                  </div>
                  <p className="text-sm font-semibold text-stone-700">No blocks found</p>
                  <p className="text-xs text-stone-500 mt-1">Try different keywords</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 space-y-6"
            >
              {/* Popular Blocks */}
              <section>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <Zap className="w-4.5 h-4.5 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">Popular</h3>
                </div>
                <div className="space-y-2.5">
                  {popularBlocks.slice(0, 5).map(block => (
                    <BlockCard key={block.type} block={block} size="large" />
                  ))}
                </div>
              </section>
              
              <Separator className="my-1" />
              
              {/* Categories */}
              <section>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                    <Layers className="w-4.5 h-4.5 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">Categories</h3>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {categories.map(cat => {
                    const CatIcon = cat.icon;
                    const count = blockTypes.filter(b => b.category === cat.id).length;
                    return (
                      <motion.button
                        key={cat.id}
                        {...animations.hover.lift}
                        {...animations.tap}
                        onClick={() => setSelectedCategory(cat.id)}
                        className="group flex items-center gap-2.5 p-3.5 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/50 hover:border-violet-400 hover:shadow-lg hover:shadow-violet-500/20 transition-all duration-200 text-left"
                      >
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-${cat.color}-400 to-${cat.color}-600 flex items-center justify-center flex-shrink-0 shadow-md`}>
                          <CatIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 group-hover:text-violet-600 transition-colors">{cat.label}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{count} blocks</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-violet-400 transition-colors" />
                      </motion.button>
                    );
                  })}
                </div>
              </section>

              <Separator className="my-1" />

              {/* All Blocks Preview */}
              <section>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                    <Star className="w-4.5 h-4.5 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">Featured</h3>
                </div>
                <div className="grid grid-cols-4 gap-2.5">
                  {blockTypes.filter(b => b.featured).slice(0, 8).map(block => {
                    const Icon = block.icon;
                    return (
                      <motion.button
                        key={block.type}
                        {...animations.hover.scale}
                        {...animations.tap}
                        onClick={() => onAddBlock(block.type)}
                        className={`aspect-square rounded-xl bg-gradient-to-br ${block.gradient} flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200`}
                        title={block.label}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </motion.button>
                    );
                  })}
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollArea>

      {/* Footer tip */}
      <div className="flex-shrink-0 p-4 bg-white/80 backdrop-blur-xl border-t border-slate-200/50 shadow-sm">
        <div className="flex items-center gap-3 p-3.5 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-200/50">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            <strong className="text-violet-700 font-bold">Click</strong> to add blocks • <strong className="text-violet-700 font-bold">Drag</strong> to reorder
          </p>
        </div>
      </div>
    </div>
  );
}
