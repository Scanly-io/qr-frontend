import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Store, Calendar, User, Rocket, Heart, ShoppingBag, Music, Camera, 
  Briefcase, Coffee, Gift, Star, Building, Scissors, Dumbbell, Home, 
  X, Check, Layers, ArrowRight, Zap, Search
} from 'lucide-react';
import type { Block, BlockType } from '@/types';
import type { PageTheme } from '@/types/theme';
import { INDUSTRY_TEMPLATES } from '@/data/industry-templates';
import { animations } from '@/utils/designSystem';

interface Template {
  id: string;
  name: string;
  description: string;
  icon: typeof Sparkles;
  gradient: string;
  blocks: BlockType[];
  category: 'starter' | 'business' | 'creator' | 'ecommerce';
  isPremium?: boolean;
}

const templates: Template[] = [
  // === STARTER TEMPLATES ===
  {
    id: 'landing-page',
    name: 'Landing Page',
    description: 'Product launches & marketing',
    icon: Rocket,
    gradient: 'from-purple-500 to-pink-600',
    blocks: ['hero', 'features', 'testimonial', 'pricing', 'button'],
    category: 'starter',
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Showcase your work',
    icon: User,
    gradient: 'from-blue-500 to-cyan-600',
    blocks: ['heading', 'text', 'gallery', 'divider', 'social'],
    category: 'starter',
  },
  {
    id: 'event',
    name: 'Event Page',
    description: 'Promote events & webinars',
    icon: Calendar,
    gradient: 'from-green-500 to-teal-600',
    blocks: ['hero', 'countdown', 'text', 'map', 'button'],
    category: 'starter',
  },
  
  // === BUSINESS TEMPLATES ===
  {
    id: 'business-card',
    name: 'Business Card',
    description: 'Digital contact card',
    icon: Briefcase,
    gradient: 'from-slate-600 to-slate-800',
    blocks: ['profile', 'linkButton', 'linkButton', 'linkButton', 'social', 'divider'],
    category: 'business',
  },
  {
    id: 'restaurant-pro',
    name: 'Restaurant',
    description: 'Menu & reservations',
    icon: Coffee,
    gradient: 'from-amber-500 to-red-500',
    blocks: ['profile', 'linkButton', 'linkButton', 'gallery', 'divider', 'linkButton', 'map', 'social'],
    category: 'business',
    isPremium: true,
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    description: 'Showcase listings',
    icon: Store,
    gradient: 'from-emerald-500 to-cyan-500',
    blocks: ['profile', 'stats', 'gallery', 'linkButton', 'linkButton', 'testimonial', 'social'],
    category: 'business',
    isPremium: true,
  },
  
  // === CREATOR TEMPLATES ===
  {
    id: 'influencer-pro',
    name: 'Link in Bio',
    description: 'All links in one place',
    icon: Star,
    gradient: 'from-pink-500 to-red-500',
    blocks: ['profile', 'social', 'linkButton', 'linkButton', 'linkButton', 'linkButton', 'divider', 'video'],
    category: 'creator',
  },
  {
    id: 'music-artist',
    name: 'Music Artist',
    description: 'Promote your music',
    icon: Music,
    gradient: 'from-violet-500 to-fuchsia-500',
    blocks: ['profile', 'video', 'linkButton', 'linkButton', 'linkButton', 'countdown', 'social'],
    category: 'creator',
    isPremium: true,
  },
  {
    id: 'photographer',
    name: 'Photographer',
    description: 'Portfolio & booking',
    icon: Camera,
    gradient: 'from-gray-700 to-black',
    blocks: ['profile', 'gallery', 'linkButton', 'linkButton', 'testimonial', 'payment', 'social'],
    category: 'creator',
    isPremium: true,
  },
  
  // === E-COMMERCE TEMPLATES ===
  {
    id: 'ecommerce-shop',
    name: 'Online Shop',
    description: 'Sell products',
    icon: ShoppingBag,
    gradient: 'from-indigo-500 to-cyan-500',
    blocks: ['profile', 'linkButton', 'gallery', 'payment', 'divider', 'linkButton', 'social'],
    category: 'ecommerce',
    isPremium: true,
  },
  {
    id: 'digital-products',
    name: 'Digital Products',
    description: 'Courses & downloads',
    icon: Gift,
    gradient: 'from-teal-500 to-green-500',
    blocks: ['profile', 'linkButton', 'linkButton', 'payment', 'testimonial', 'faq', 'social'],
    category: 'ecommerce',
    isPremium: true,
  },
  {
    id: 'tip-jar',
    name: 'Tip Jar',
    description: 'Accept tips from fans',
    icon: Heart,
    gradient: 'from-rose-400 to-red-500',
    blocks: ['profile', 'text', 'payment', 'social', 'linkButton'],
    category: 'ecommerce',
  },
];

interface TemplatesSidebarProps {
  onApplyTemplate: (blockTypes: BlockType[]) => void;
  onApplyRichTemplate?: (blocks: Block[], theme?: Partial<PageTheme>) => void;
  onClose: () => void;
}

// Icon mapping for industry templates
const industryIconMap: Record<string, typeof Coffee> = {
  restaurant: Coffee,
  artist: Music,
  music: Music,
  'real-estate': Home,
  fitness: Dumbbell,
  salon: Scissors,
  photographer: Camera,
  shop: ShoppingBag,
  professional: Briefcase,
  default: Building,
};

// Category labels and icons for filter chips
const industryCategories = [
  { id: 'all', label: 'All', icon: Layers },
  { id: 'restaurant', label: 'Restaurant', icon: Coffee },
  { id: 'artist', label: 'Artist', icon: Music },
  { id: 'real-estate', label: 'Real Estate', icon: Home },
  { id: 'shop', label: 'Shop', icon: ShoppingBag },
  { id: 'salon', label: 'Salon', icon: Scissors },
  { id: 'fitness', label: 'Fitness', icon: Dumbbell },
  { id: 'professional', label: 'Professional', icon: Briefcase },
];

type TabType = 'quick' | 'industry';

export default function TemplatesSidebar({ onApplyTemplate, onApplyRichTemplate, onClose }: TemplatesSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>('industry');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIndustryCategory, setSelectedIndustryCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All', icon: Layers },
    { id: 'starter', label: 'Starter', icon: Rocket },
    { id: 'business', label: 'Business', icon: Briefcase },
    { id: 'creator', label: 'Creator', icon: Star },
    { id: 'ecommerce', label: 'Shop', icon: ShoppingBag },
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <>
      {/* Backdrop - doesn't block clicks, just dims background */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 pointer-events-none"
      />
      
      {/* Sidebar */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-zinc-900 z-50 shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex-shrink-0 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Templates</h2>
                <p className="text-xs text-zinc-500">Choose a starting point</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-zinc-500" />
            </button>
          </div>
          
          {/* Main Tabs */}
          <div className="flex px-4 pb-3 gap-2">
            <button
              onClick={() => setActiveTab('industry')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'industry'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              <Zap className="w-4 h-4" />
              Ready-to-Use
            </button>
            <button
              onClick={() => setActiveTab('quick')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'quick'
                  ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/25'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              <Layers className="w-4 h-4" />
              Quick Start
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'industry' ? (
              /* Industry Templates - Pre-filled */
              <motion.div
                key="industry"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4"
              >
                {/* Search Bar */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search templates..."
                    className="w-full pl-9 pr-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all"
                  />
                </div>

                {/* Industry Category Filter */}
                <div className="flex gap-1.5 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                  {industryCategories.map((cat) => {
                    const CatIcon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedIndustryCategory(cat.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${
                          selectedIndustryCategory === cat.id
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-300 dark:ring-emerald-700'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                        }`}
                      >
                        <CatIcon className="w-3 h-3" />
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                {/* Info Banner */}
                <div className="mb-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-emerald-800 dark:text-emerald-300">
                      <strong>Complete templates</strong> with real content, images & styling. Just customize and publish!
                    </p>
                  </div>
                </div>

                {/* Industry Template Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {onApplyRichTemplate && INDUSTRY_TEMPLATES
                    .filter((template) => {
                      const matchesCategory = selectedIndustryCategory === 'all' || template.category === selectedIndustryCategory;
                      const matchesSearch = !searchQuery || 
                        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
                      return matchesCategory && matchesSearch;
                    })
                    .map((template) => {
                    const Icon = industryIconMap[template.category] || industryIconMap.default;
                    const isHovered = hoveredTemplate === template.id;
                    
                    return (
                      <motion.div
                        key={template.id}
                        onMouseEnter={() => setHoveredTemplate(template.id)}
                        onMouseLeave={() => setHoveredTemplate(null)}
                        {...animations.hover.scaleSmall}
                        {...animations.tap}
                        onClick={() => {
                          // Pass template directly - EditorLayout handles cloning
                          onApplyRichTemplate(template.blocks, template.theme);
                        }}
                        className={`relative group cursor-pointer rounded-2xl overflow-hidden bg-gradient-to-br ${template.gradient || 'from-zinc-600 to-zinc-800'} p-4 min-h-[140px] flex flex-col justify-between transition-all ${
                          isHovered ? 'shadow-xl ring-2 ring-white/30' : 'shadow-md'
                        }`}
                      >
                        {/* Overlay pattern */}
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
                        
                        {/* Content */}
                        <div className="relative z-10">
                          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="font-bold text-white text-sm mb-1">{template.name}</h3>
                          <p className="text-white/70 text-xs leading-relaxed line-clamp-2">
                            {template.description}
                          </p>
                        </div>

                        {/* Footer */}
                        <div className="relative z-10 flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 bg-white/20 backdrop-blur-sm rounded text-white/80 text-[9px] font-medium capitalize">
                              {template.category.replace('-', ' ')}
                            </span>
                            <span className="text-white/50 text-[10px] font-medium">
                              {template.blocks.length} blocks
                            </span>
                          </div>
                          <motion.div
                            animate={{ x: isHovered ? 0 : -5, opacity: isHovered ? 1 : 0 }}
                            className="flex items-center gap-1 text-white text-xs font-medium"
                          >
                            Apply <ArrowRight className="w-3 h-3" />
                          </motion.div>
                        </div>

                        {/* Hover glow */}
                        <motion.div
                          animate={{ opacity: isHovered ? 0.2 : 0 }}
                          className="absolute inset-0 bg-white pointer-events-none"
                        />
                      </motion.div>
                    );
                  })}
                </div>

                {/* Empty state */}
                {INDUSTRY_TEMPLATES.filter((t) => {
                  const matchesCategory = selectedIndustryCategory === 'all' || t.category === selectedIndustryCategory;
                  const matchesSearch = !searchQuery || 
                    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
                  return matchesCategory && matchesSearch;
                }).length === 0 && (
                  <div className="text-center py-8">
                    <Search className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                    <p className="text-sm text-zinc-500">No templates found</p>
                    <p className="text-xs text-zinc-400 mt-1">Try a different category or search term</p>
                  </div>
                )}
              </motion.div>
            ) : (
              /* Quick Start Templates - Basic structure */
              <motion.div
                key="quick"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4"
              >
                {/* Category Filter */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                          selectedCategory === cat.id
                            ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                {/* Template List */}
                <div className="space-y-2">
                  {filteredTemplates.map((template) => {
                    const Icon = template.icon;
                    const isHovered = hoveredTemplate === template.id;
                    
                    return (
                      <motion.div
                        key={template.id}
                        onMouseEnter={() => setHoveredTemplate(template.id)}
                        onMouseLeave={() => setHoveredTemplate(null)}
                        {...animations.hover.scaleSmall}
                        {...animations.tap}
                        onClick={() => {
                          onApplyTemplate(template.blocks);
                          // Don't close - let user try multiple templates
                        }}
                        className={`relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                          isHovered 
                            ? 'bg-zinc-100 dark:bg-zinc-800' 
                            : 'bg-zinc-50 dark:bg-zinc-800/50'
                        }`}
                      >
                        {/* Icon */}
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${template.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm text-zinc-900 dark:text-white">{template.name}</h3>
                            {template.isPremium && (
                              <span className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[9px] font-bold rounded uppercase">
                                Pro
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                            {template.description}
                          </p>
                        </div>
                        
                        {/* Block count & Arrow */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[10px] text-zinc-400 font-medium">
                            {template.blocks.length} blocks
                          </span>
                          <motion.div
                            animate={{ x: isHovered ? 0 : -5, opacity: isHovered ? 1 : 0.3 }}
                          >
                            <ArrowRight className="w-4 h-4 text-zinc-400" />
                          </motion.div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-zinc-200 dark:border-zinc-800 p-4">
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-zinc-600 dark:text-zinc-300">
                <strong className="text-violet-700 dark:text-violet-400">Note:</strong> Templates replace your current design. You can customize everything after.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
