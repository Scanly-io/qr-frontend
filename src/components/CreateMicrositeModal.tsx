import { useState } from 'react';
import { 
  X, Sparkles, User, Heart, 
  ShoppingBag, Music, Camera, Briefcase, Gift, Star,
  ChevronRight, Utensils, Home, PartyPopper,
  GraduationCap, Dumbbell, Stethoscope, FileText
} from 'lucide-react';
import { PRESET_THEMES, type PageTheme } from '@/types/theme';
import type { BlockType } from '@/types';

// Industry categories with predefined themes and blocks
interface IndustryTemplate {
  id: string;
  name: string;
  description: string;
  icon: typeof Sparkles;
  gradient: string;
  blocks: BlockType[];
  theme: string; // Reference to PRESET_THEMES id
  isPro?: boolean;
}

interface IndustryCategory {
  id: string;
  name: string;
  emoji: string;
  description: string;
  templates: IndustryTemplate[];
}

const INDUSTRY_CATEGORIES: IndustryCategory[] = [
  {
    id: 'creator',
    name: 'Creator & Influencer',
    emoji: '✨',
    description: 'Link-in-bio pages for content creators',
    templates: [
      {
        id: 'linktree-style',
        name: 'Link-in-Bio',
        description: 'Classic Linktree-style with all your links',
        icon: Star,
        gradient: 'from-pink-500 to-rose-500',
        blocks: ['profile', 'social', 'linkButton', 'linkButton', 'linkButton', 'linkButton', 'divider'],
        theme: 'soft-pink',
      },
      {
        id: 'music-artist',
        name: 'Music Artist',
        description: 'Promote your music and shows',
        icon: Music,
        gradient: 'from-violet-500 to-purple-500',
        blocks: ['profile', 'video', 'linkButton', 'linkButton', 'linkButton', 'countdown', 'social'],
        theme: 'neon-cyberpunk',
        isPro: true,
      },
      {
        id: 'photographer',
        name: 'Photographer',
        description: 'Portfolio with booking',
        icon: Camera,
        gradient: 'from-gray-600 to-gray-800',
        blocks: ['profile', 'gallery', 'linkButton', 'linkButton', 'testimonial', 'social'],
        theme: 'midnight-slate',
        isPro: true,
      },
    ],
  },
  {
    id: 'business',
    name: 'Small Business',
    emoji: '💼',
    description: 'Digital presence for local businesses',
    templates: [
      {
        id: 'business-card',
        name: 'Digital Business Card',
        description: 'Modern contact card with links',
        icon: Briefcase,
        gradient: 'from-slate-600 to-slate-800',
        blocks: ['profile', 'linkButton', 'linkButton', 'linkButton', 'social', 'divider'],
        theme: 'classic-white',
      },
      {
        id: 'restaurant',
        name: 'Restaurant',
        description: 'Menu, reservations & location',
        icon: Utensils,
        gradient: 'from-amber-500 to-orange-500',
        blocks: ['profile', 'linkButton', 'linkButton', 'gallery', 'map', 'social'],
        theme: 'warm-amber',
        isPro: true,
      },
      {
        id: 'real-estate',
        name: 'Real Estate Agent',
        description: 'Listings and contact info',
        icon: Home,
        gradient: 'from-emerald-500 to-teal-500',
        blocks: ['profile', 'stats', 'gallery', 'linkButton', 'testimonial', 'social'],
        theme: 'nature-green',
        isPro: true,
      },
    ],
  },
  {
    id: 'services',
    name: 'Professional Services',
    emoji: '🛠️',
    description: 'Service providers & consultants',
    templates: [
      {
        id: 'consultant',
        name: 'Consultant',
        description: 'Book calls and showcase expertise',
        icon: Briefcase,
        gradient: 'from-blue-500 to-cyan-500',
        blocks: ['profile', 'linkButton', 'linkButton', 'stats', 'testimonial', 'faq', 'social'],
        theme: 'ocean-gradient',
      },
      {
        id: 'fitness-trainer',
        name: 'Fitness Trainer',
        description: 'Programs and booking',
        icon: Dumbbell,
        gradient: 'from-red-500 to-orange-500',
        blocks: ['profile', 'video', 'linkButton', 'linkButton', 'testimonial', 'social'],
        theme: 'sunset-vibes',
        isPro: true,
      },
      {
        id: 'healthcare',
        name: 'Healthcare Provider',
        description: 'Appointments and information',
        icon: Stethoscope,
        gradient: 'from-teal-500 to-cyan-500',
        blocks: ['profile', 'linkButton', 'linkButton', 'faq', 'map', 'social'],
        theme: 'soft-mint',
        isPro: true,
      },
    ],
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    emoji: '🛍️',
    description: 'Sell products and accept payments',
    templates: [
      {
        id: 'product-page',
        name: 'Product Page',
        description: 'Single product with checkout',
        icon: ShoppingBag,
        gradient: 'from-indigo-500 to-purple-500',
        blocks: ['profile', 'linkButton', 'gallery', 'payment', 'testimonial', 'social'],
        theme: 'royal-purple',
        isPro: true,
      },
      {
        id: 'digital-products',
        name: 'Digital Products',
        description: 'Courses, ebooks, downloads',
        icon: Gift,
        gradient: 'from-teal-500 to-green-500',
        blocks: ['profile', 'linkButton', 'linkButton', 'payment', 'faq', 'social'],
        theme: 'nature-green',
        isPro: true,
      },
      {
        id: 'tip-jar',
        name: 'Creator Tip Jar',
        description: 'Accept support from fans',
        icon: Heart,
        gradient: 'from-rose-400 to-pink-500',
        blocks: ['profile', 'text', 'payment', 'social'],
        theme: 'soft-pink',
      },
    ],
  },
  {
    id: 'events',
    name: 'Events',
    emoji: '🎉',
    description: 'Event pages and registrations',
    templates: [
      {
        id: 'event-page',
        name: 'Event Page',
        description: 'Promote events with countdown',
        icon: PartyPopper,
        gradient: 'from-purple-500 to-pink-500',
        blocks: ['hero', 'countdown', 'text', 'linkButton', 'map', 'social'],
        theme: 'ocean-gradient',
      },
      {
        id: 'webinar',
        name: 'Webinar',
        description: 'Online event registration',
        icon: GraduationCap,
        gradient: 'from-blue-500 to-indigo-500',
        blocks: ['hero', 'countdown', 'features', 'linkButton', 'faq'],
        theme: 'classic-white',
      },
    ],
  },
];

// Quick start options (skip template selection)
const QUICK_START_OPTIONS = [
  {
    id: 'blank',
    name: 'Blank Page',
    description: 'Start fresh with an empty canvas',
    icon: FileText,
    gradient: 'from-gray-400 to-gray-500',
    blocks: [] as BlockType[],
    theme: 'classic-white',
  },
  {
    id: 'basic-linktree',
    name: 'Basic Link-in-Bio',
    description: 'Simple profile with links',
    icon: User,
    gradient: 'from-blue-500 to-purple-500',
    blocks: ['profile', 'linkButton', 'linkButton', 'linkButton', 'social'] as BlockType[],
    theme: 'classic-white',
  },
];

interface CreateMicrositeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (template: { blocks: BlockType[]; theme: PageTheme; name: string }) => void;
  isCreating?: boolean;
}

export function CreateMicrositeModal({ isOpen, onClose, onCreate, isCreating = false }: CreateMicrositeModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [step, setStep] = useState<'category' | 'template'>('category');

  if (!isOpen) return null;

  const handleSelectTemplate = (template: IndustryTemplate | typeof QUICK_START_OPTIONS[0]) => {
    const themeObj = PRESET_THEMES.find(t => t.id === template.theme) || PRESET_THEMES[0];
    onCreate({
      blocks: template.blocks,
      theme: themeObj,
      name: template.name,
    });
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setStep('template');
  };

  const handleBack = () => {
    setStep('category');
    setSelectedCategory(null);
  };

  const currentCategory = INDUSTRY_CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-5 border-b border-gray-200 dark:border-zinc-700 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-zinc-800 dark:to-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {step === 'template' && (
                <button
                  onClick={handleBack}
                  className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
              )}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {step === 'category' ? 'Create New Microsite' : currentCategory?.name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {step === 'category' 
                    ? 'Choose your industry or start from scratch' 
                    : currentCategory?.description}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'category' ? (
            <div className="space-y-6">
              {/* Quick Start */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Quick Start
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {QUICK_START_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleSelectTemplate(option)}
                        disabled={isCreating}
                        className="group flex items-center gap-4 p-4 bg-gray-50 dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-xl hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-zinc-700 transition-all disabled:opacity-50"
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{option.name}</h4>
                          <p className="text-sm text-gray-500">{option.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Industry Categories */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Choose Your Industry
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {INDUSTRY_CATEGORIES.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleSelectCategory(category.id)}
                      className="group flex flex-col items-center gap-2 p-5 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-xl hover:border-violet-400 hover:shadow-lg transition-all"
                    >
                      <span className="text-3xl">{category.emoji}</span>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-center">{category.name}</h4>
                      <p className="text-xs text-gray-500 text-center">{category.templates.length} templates</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Template Selection */
            <div className="grid gap-4">
              {currentCategory?.templates.map((template) => {
                const Icon = template.icon;
                const themePreview = PRESET_THEMES.find(t => t.id === template.theme);
                
                return (
                  <button
                    key={template.id}
                    onClick={() => handleSelectTemplate(template)}
                    disabled={isCreating}
                    className="group relative flex items-start gap-4 p-5 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-xl hover:border-violet-400 hover:shadow-lg transition-all disabled:opacity-50 text-left"
                  >
                    {/* Pro Badge */}
                    {template.isPro && (
                      <div className="absolute top-3 right-3 px-2 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                        Pro
                      </div>
                    )}

                    {/* Icon */}
                    <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${template.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white">{template.name}</h4>
                      <p className="text-sm text-gray-500 mb-3">{template.description}</p>
                      
                      {/* Block Pills */}
                      <div className="flex flex-wrap gap-1.5">
                        {template.blocks.slice(0, 5).map((blockType, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 dark:bg-zinc-700 text-[10px] font-medium rounded-md capitalize text-gray-600 dark:text-gray-300"
                          >
                            {blockType}
                          </span>
                        ))}
                        {template.blocks.length > 5 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-zinc-700 text-[10px] font-medium rounded-md text-gray-600 dark:text-gray-300">
                            +{template.blocks.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Theme Preview */}
                    {themePreview && (
                      <div className="flex-shrink-0 w-16 h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-600">
                        <div 
                          className="w-full h-full flex flex-col items-center justify-center p-2"
                          style={{
                            backgroundColor: themePreview.background.type === 'solid' 
                              ? themePreview.background.color 
                              : undefined,
                            backgroundImage: themePreview.background.type === 'gradient'
                              ? `linear-gradient(${themePreview.background.gradientDirection || 'to-br'}, ${themePreview.background.gradientFrom}, ${themePreview.background.gradientTo})`
                              : undefined,
                          }}
                        >
                          <div className="w-6 h-6 bg-white/30 rounded-full mb-1" />
                          <div 
                            className="w-full h-3 rounded-full"
                            style={{ backgroundColor: themePreview.button.backgroundColor }}
                          />
                          <div 
                            className="w-full h-3 rounded-full mt-1"
                            style={{ backgroundColor: themePreview.button.backgroundColor, opacity: 0.7 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Arrow */}
                    <ChevronRight className="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-violet-500 group-hover:translate-x-1 transition-all" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {step === 'category' 
                ? `${INDUSTRY_CATEGORIES.reduce((sum, c) => sum + c.templates.length, 0)} templates available`
                : 'Select a template to continue'}
            </p>
            {isCreating && (
              <div className="flex items-center gap-2 text-violet-600">
                <div className="w-4 h-4 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium">Creating...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
