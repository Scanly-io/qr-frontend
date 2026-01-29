import { useState } from 'react';
import { Search, X, HelpCircle, Video, Keyboard, AlertCircle, ChevronDown, ChevronRight, ExternalLink, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HelpPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HelpItem {
  id: string;
  category: 'faq' | 'video' | 'shortcut' | 'troubleshooting';
  question: string;
  answer: string;
  videoUrl?: string;
  keywords: string[];
}

const HELP_ITEMS: HelpItem[] = [
  // FAQ
  {
    id: 'faq-1',
    category: 'faq',
    question: 'How do I add a new block to my page?',
    answer: 'Click or drag any block from the Block Palette on the left sidebar. You can add Profile, Links, Gallery, Text, Video, and many other block types. Simply click a block type to add it to your page, or drag it to a specific position.',
    keywords: ['add', 'block', 'create', 'new', 'palette', 'drag'],
  },
  {
    id: 'faq-2',
    category: 'faq',
    question: 'How do I reorder blocks on my page?',
    answer: 'Hover over any block and grab the grip handle (six dots icon) on the left side. Drag the block up or down to reposition it. The other blocks will automatically adjust to make room.',
    keywords: ['reorder', 'move', 'rearrange', 'drag', 'position'],
  },
  {
    id: 'faq-3',
    category: 'faq',
    question: 'Can I change the theme after creating my page?',
    answer: 'Absolutely! Use the Quick Theme dropdown at the top of the right sidebar to instantly switch between 10+ professional themes. You can also customize individual design elements in the Design and Branding tabs.',
    keywords: ['theme', 'change', 'switch', 'design', 'style', 'colors'],
  },
  {
    id: 'faq-4',
    category: 'faq',
    question: 'How do I add my logo and favicon?',
    answer: 'Go to the Branding tab in the right sidebar. You\'ll find Logo and Favicon sections where you can upload images or paste URLs. You can also set logo position (header/footer) and size (small/medium/large).',
    keywords: ['logo', 'favicon', 'brand', 'upload', 'image'],
  },
  {
    id: 'faq-5',
    category: 'faq',
    question: 'What social platforms are supported?',
    answer: 'We support 50+ social platforms including Instagram, TikTok, X/Twitter, LinkedIn, YouTube, GitHub, Discord, Spotify, Patreon, Behance, Dribbble, and many more. Each platform has its official brand colors and icons.',
    keywords: ['social', 'links', 'platforms', 'instagram', 'tiktok', 'twitter'],
  },
  {
    id: 'faq-6',
    category: 'faq',
    question: 'Can I save my work and come back later?',
    answer: 'Yes! Your microsite is automatically saved to your browser\'s local storage as you work. You can close the tab and return later to continue editing.',
    keywords: ['save', 'auto-save', 'storage', 'continue', 'later'],
  },

  // Video Tutorials
  {
    id: 'video-1',
    category: 'video',
    question: 'Getting Started: Building Your First Page',
    answer: 'Learn how to create a complete microsite from scratch in under 5 minutes. We\'ll cover adding blocks, customizing themes, and generating your QR code.',
    videoUrl: 'https://www.youtube.com/watch?v=example1',
    keywords: ['tutorial', 'getting started', 'beginner', 'first', 'start'],
  },
  {
    id: 'video-2',
    category: 'video',
    question: 'Design Masterclass: Creating Beautiful Themes',
    answer: 'Advanced design techniques for customizing backgrounds, typography, and buttons to match your brand perfectly.',
    videoUrl: 'https://www.youtube.com/watch?v=example2',
    keywords: ['design', 'theme', 'advanced', 'customize', 'brand'],
  },
  {
    id: 'video-3',
    category: 'video',
    question: 'Social Links: Best Practices',
    answer: 'How to effectively organize and style your social media links for maximum engagement.',
    videoUrl: 'https://www.youtube.com/watch?v=example3',
    keywords: ['social', 'links', 'best practices', 'engagement'],
  },

  // Keyboard Shortcuts
  {
    id: 'shortcut-1',
    category: 'shortcut',
    question: 'Cmd/Ctrl + Z',
    answer: 'Undo your last action',
    keywords: ['undo', 'keyboard', 'shortcut'],
  },
  {
    id: 'shortcut-2',
    category: 'shortcut',
    question: 'Cmd/Ctrl + Shift + Z',
    answer: 'Redo your last undone action',
    keywords: ['redo', 'keyboard', 'shortcut'],
  },
  {
    id: 'shortcut-3',
    category: 'shortcut',
    question: 'Cmd/Ctrl + S',
    answer: 'Manually save your work (auto-saves are also enabled)',
    keywords: ['save', 'keyboard', 'shortcut'],
  },
  {
    id: 'shortcut-4',
    category: 'shortcut',
    question: 'Escape',
    answer: 'Deselect currently selected block',
    keywords: ['deselect', 'escape', 'keyboard', 'shortcut'],
  },
  {
    id: 'shortcut-5',
    category: 'shortcut',
    question: 'Delete/Backspace',
    answer: 'Delete the currently selected block',
    keywords: ['delete', 'remove', 'keyboard', 'shortcut'],
  },

  // Troubleshooting
  {
    id: 'trouble-1',
    category: 'troubleshooting',
    question: 'QR code not scanning properly',
    answer: 'Make sure there\'s enough contrast between the QR code and background. Try using black on white or white on dark backgrounds. Also ensure the QR code is at least 2cm x 2cm when printed. Test with multiple QR scanner apps.',
    keywords: ['qr', 'code', 'scan', 'not working', 'problem'],
  },
  {
    id: 'trouble-2',
    category: 'troubleshooting',
    question: 'Images not loading or showing broken',
    answer: 'Verify that your image URLs are correct and publicly accessible. Images must be hosted on HTTPS URLs. Try using free image hosting services like Imgur or upload to cloud storage like Google Drive (with public sharing enabled).',
    keywords: ['images', 'broken', 'not loading', 'picture', 'photo'],
  },
  {
    id: 'trouble-3',
    category: 'troubleshooting',
    question: 'Custom fonts not applying',
    answer: 'Ensure you\'ve selected a font from the Typography settings. Some browsers may take a moment to load custom fonts. Try refreshing the page. If using custom font URLs, verify they\'re valid Google Fonts links.',
    keywords: ['fonts', 'typography', 'not working', 'text', 'style'],
  },
  {
    id: 'trouble-4',
    category: 'troubleshooting',
    question: 'Page layout looks wrong on mobile',
    answer: 'Use the device preview buttons (mobile/tablet/desktop) in the editor toolbar to test different screen sizes. Most blocks automatically adapt to mobile, but you can adjust mobile-specific settings in each block\'s inspector.',
    keywords: ['mobile', 'responsive', 'layout', 'phone', 'tablet'],
  },
  {
    id: 'trouble-5',
    category: 'troubleshooting',
    question: 'Changes not saving or being lost',
    answer: 'Check if browser cookies/local storage is enabled. Some privacy extensions may block local storage. Try disabling browser extensions temporarily. If the issue persists, try a different browser or use incognito mode.',
    keywords: ['save', 'lost', 'not saving', 'data', 'storage'],
  },
];

export function HelpPanel({ isOpen, onClose }: HelpPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const categories = [
    { id: 'faq', label: 'FAQ', icon: HelpCircle, color: 'violet' },
    { id: 'video', label: 'Video Tutorials', icon: Video, color: 'blue' },
    { id: 'shortcut', label: 'Shortcuts', icon: Keyboard, color: 'green' },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: AlertCircle, color: 'orange' },
  ];

  // Filter items based on search and category
  const filteredItems = HELP_ITEMS.filter(item => {
    const matchesCategory = !activeCategory || item.category === activeCategory;
    const matchesSearch = !searchQuery || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keywords.some(kw => kw.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const toggleItem = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.color || 'gray';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-4xl h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Lightbulb className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Help Center</h2>
                    <p className="text-violet-100 text-sm">Find answers and learn tips</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-300" />
                <input
                  type="text"
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-violet-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            </div>

            {/* Category Filters */}
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
              <div className="flex gap-2 overflow-x-auto">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
                    !activeCategory
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  All
                </button>
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
                        activeCategory === category.id
                          ? `bg-${category.color}-600 text-white shadow-lg`
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {category.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No results found</p>
                  <p className="text-gray-400 text-sm mt-1">Try different keywords</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredItems.map((item) => {
                    const isExpanded = expandedItems.has(item.id);
                    const colorClass = getCategoryColor(item.category);
                    
                    return (
                      <div
                        key={item.id}
                        className="border-2 border-gray-200 rounded-lg overflow-hidden hover:border-violet-300 transition-colors"
                      >
                        <button
                          onClick={() => toggleItem(item.id)}
                          className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3 flex-1 text-left">
                            <span className={`w-2 h-2 rounded-full bg-${colorClass}-500 flex-shrink-0`}></span>
                            <span className="text-sm font-semibold text-gray-900 group-hover:text-violet-600 transition-colors">
                              {item.question}
                            </span>
                          </div>
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                        </button>
                        
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="p-4 bg-white border-t border-gray-200">
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  {item.answer}
                                </p>
                                {item.videoUrl && (
                                  <a
                                    href={item.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors"
                                  >
                                    <Video className="w-4 h-4" />
                                    Watch Tutorial
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex items-center justify-between text-sm">
                <div className="text-gray-600">
                  <span className="font-semibold text-gray-900">{filteredItems.length}</span> results
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-500">Still need help?</span>
                  <a
                    href="mailto:support@example.com"
                    className="font-semibold text-violet-600 hover:text-violet-700 transition-colors"
                  >
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
