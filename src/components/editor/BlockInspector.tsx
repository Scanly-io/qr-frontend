/**
 * BlockInspector - Clean, intuitive block editor
 * 
 * Design principles:
 * 1. Clear visual hierarchy - know exactly what you can edit
 * 2. Consistent UI patterns - same controls everywhere
 * 3. Immediate feedback - see changes instantly
 * 4. Collapsible sections - hide what you don't need
 */

import { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { 
  ChevronDown, 
  ChevronRight,
  ChevronUp,
  Type, 
  Palette, 
  Layout, 
  Settings2,
  Settings,
  Image as ImageIcon,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Upload,
  X,
  Plus,
  Trash2,
  Sparkles,
  Package,
  DollarSign,
  Star,
  Eye,
  Heading as HeadingIcon,
  MousePointerClick,
  Video,
  User,
  Link2,
  Share2,
  CreditCard,
  ShoppingBag,
  ShoppingCart,
  Mail,
  Minus,
  MinusCircle,
  Clock,
  Calendar,
  MessageSquareQuote,
  HelpCircle,
  Briefcase,
  CheckCircle,
  Grid3x3,
  Grid2x2,
  List,
  TrendingUp,
  MapPin,
  Zap,
  LayoutPanelTop,
  AlignJustify,
  UtensilsCrossed,
  Home,
  Music,
  Percent,
  CalendarDays,
  Award,
  Square,
  Megaphone,
  Send,
  Download,
  AlertCircle,
  ArrowUpDown,
  Timer,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Github,
  Globe,
  Smartphone,
  Tag,
  FileText,
  ExternalLink,
  Users,
  Check,
  Crown,
  Shield,
  Rocket,
  Heart,
  Gift,
  Target,
  Gem,
  LayoutGrid,
  Layers,
  Mountain,
  Droplet,
  Flame,
  Circle,
  Coffee,
  Sparkles as SparklesIcon,
  Building2,
  Trees,
  Landmark,
  Store,
  CheckCircle2,
  XCircle,
  LayoutList,
  Grid,
  Minimize2,
  Leaf,
  Salad,
  Music as MusicIcon,
  Disc3,
  Ticket,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { HexColorPicker } from 'react-colorful';
import type { Block } from '@/types';
import type { PageTheme } from '@/types/theme';
import { PageSettings } from './PageSettings';
import { cn } from '@/lib/utils';
import { FONT_FAMILY_MAP } from '@/lib/fonts';
import { spacing, typography, shadows, animations, borders } from '@/utils/designSystem';
import { Button } from '@/components/ui/button';

// Import brand icons for link button platform detection
import {
  SpotifyIcon,
  AppleMusicIcon,
  YouTubeIcon,
  InstagramIcon,
  XIcon,
  TikTokIcon,
  FacebookIcon,
  LinkedInIcon,
  GitHubIcon,
  WhatsAppIcon,
  TelegramIcon,
  DiscordIcon,
  TwitchIcon,
  SnapchatIcon,
  PinterestIcon,
  ThreadsIcon,
  StripeIcon,
  PayPalIcon,
  ShopifyIcon,
  BrandColors,
} from '@/components/icons/BrandIcons';

// ============================================
// TYPES
// ============================================

interface BlockInspectorProps {
  block?: Block;
  onUpdate: (block: Block) => void;
  pageTheme?: PageTheme;
  onThemeUpdate?: (theme: PageTheme) => void;
}

// ============================================
// CONSTANTS
// ============================================

const COLOR_PRESETS = [
  '#000000', '#1F2937', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#F3F4F6', '#FFFFFF',
  '#DC2626', '#F97316', '#EAB308', '#22C55E', '#14B8A6', '#3B82F6', '#8B5CF6', '#EC4899',
];

// Font options - use IDs that match FONT_FAMILY_MAP
const FONT_OPTIONS = [
  { label: 'Inter', value: 'inter' },
  { label: 'Roboto', value: 'roboto' },
  { label: 'Poppins', value: 'poppins' },
  { label: 'Playfair Display', value: 'playfair' },
  { label: 'Montserrat', value: 'montserrat' },
  { label: 'Merriweather', value: 'merriweather' },
  { label: 'Space Grotesk', value: 'spacegrotesk' },
  { label: 'DM Sans', value: 'dmSans' },
];

// Block type metadata for display with Lucide icons
const BLOCK_META: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  heading: { icon: HeadingIcon, label: 'Heading', color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
  text: { icon: Type, label: 'Text', color: 'bg-gradient-to-br from-gray-500 to-gray-600' },
  button: { icon: MousePointerClick, label: 'Button', color: 'bg-gradient-to-br from-purple-500 to-purple-600' },
  image: { icon: ImageIcon, label: 'Image', color: 'bg-gradient-to-br from-green-500 to-green-600' },
  video: { icon: Video, label: 'Video', color: 'bg-gradient-to-br from-red-500 to-red-600' },
  profile: { icon: User, label: 'Profile', color: 'bg-gradient-to-br from-indigo-500 to-indigo-600' },
  linkButton: { icon: Link2, label: 'Link Button', color: 'bg-gradient-to-br from-emerald-500 to-emerald-600' },
  social: { icon: Share2, label: 'Social Links', color: 'bg-gradient-to-br from-pink-500 to-pink-600' },
  payment: { icon: CreditCard, label: 'Payment', color: 'bg-gradient-to-br from-green-600 to-green-700' },
  product: { icon: ShoppingBag, label: 'Product', color: 'bg-gradient-to-br from-orange-500 to-orange-600' },
  shop: { icon: ShoppingCart, label: 'Shop', color: 'bg-gradient-to-br from-violet-500 to-violet-600' },
  form: { icon: Mail, label: 'Form', color: 'bg-gradient-to-br from-cyan-500 to-cyan-600' },
  spacer: { icon: Minus, label: 'Spacer', color: 'bg-gradient-to-br from-gray-400 to-gray-500' },
  divider: { icon: MinusCircle, label: 'Divider', color: 'bg-gradient-to-br from-gray-400 to-gray-500' },
  countdown: { icon: Clock, label: 'Countdown', color: 'bg-gradient-to-br from-red-600 to-red-700' },
  calendar: { icon: Calendar, label: 'Events', color: 'bg-gradient-to-br from-blue-600 to-blue-700' },
  testimonial: { icon: MessageSquareQuote, label: 'Testimonial', color: 'bg-gradient-to-br from-yellow-500 to-yellow-600' },
  faq: { icon: HelpCircle, label: 'FAQ', color: 'bg-gradient-to-br from-purple-600 to-purple-700' },
  gallery: { icon: ImageIcon, label: 'Gallery', color: 'bg-gradient-to-br from-teal-500 to-teal-600' },
  pricing: { icon: DollarSign, label: 'Pricing', color: 'bg-gradient-to-br from-green-500 to-green-600' },
  features: { icon: Grid3x3, label: 'Features', color: 'bg-gradient-to-br from-indigo-600 to-indigo-700' },
  stats: { icon: TrendingUp, label: 'Stats', color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
  map: { icon: MapPin, label: 'Map', color: 'bg-gradient-to-br from-red-500 to-red-600' },
  hero: { icon: Zap, label: 'Hero', color: 'bg-gradient-to-r from-purple-500 via-pink-500 to-fuchsia-500' },
  header: { icon: LayoutPanelTop, label: 'Header', color: 'bg-gradient-to-br from-slate-600 to-slate-700' },
  footer: { icon: AlignJustify, label: 'Footer', color: 'bg-gradient-to-br from-slate-500 to-slate-600' },
  menu: { icon: UtensilsCrossed, label: 'Menu', color: 'bg-gradient-to-br from-amber-500 to-amber-600' },
  'real-estate': { icon: Home, label: 'Real Estate', color: 'bg-gradient-to-br from-emerald-500 to-emerald-600' },
  schedule: { icon: CalendarDays, label: 'Schedule', color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
  artist: { icon: Music, label: 'Artist', color: 'bg-gradient-to-br from-purple-500 to-purple-600' },
  deals: { icon: Percent, label: 'Deals', color: 'bg-gradient-to-br from-red-500 to-red-600' },
};

// ============================================
// REUSABLE COMPONENTS
// ============================================

// Collapsible Section - Premium glassmorphic design
function Section({ 
  title, 
  icon: Icon, 
  children, 
  defaultOpen = true,
  badge,
}: { 
  title: string; 
  icon?: React.ElementType; 
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <motion.div 
      className="bg-white/80 backdrop-blur-sm border-2 border-violet-200/50 rounded-2xl overflow-hidden"
      style={{ boxShadow: shadows.lg }}
      {...(isOpen ? {} : animations.hover.lift)}
    >
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center transition-all duration-300 ${
          isOpen 
            ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600' 
            : 'bg-gradient-to-br from-stone-50 to-stone-100 hover:from-violet-50 hover:to-purple-50'
        }`}
        style={{ 
          gap: spacing[3],
          padding: `${spacing[4]} ${spacing[5]}`
        }}
        whileTap={animations.tap.shrink}
      >
        {isOpen ? (
          <ChevronDown className="w-5 h-5 text-white" />
        ) : (
          <ChevronRight className="w-5 h-5 text-stone-600" />
        )}
        {Icon && <Icon className={`w-5 h-5 ${isOpen ? 'text-white' : 'text-violet-600'}`} />}
        <span 
          className={`font-bold flex-1 text-left ${isOpen ? 'text-white' : 'text-stone-800'}`}
          style={{ fontSize: typography.body.fontSize }}
        >
          {title}
        </span>
        {badge && (
          <span className={`text-xs font-bold rounded-full uppercase shadow-md ${
            isOpen 
              ? 'bg-white/25 text-white backdrop-blur-sm' 
              : 'bg-gradient-to-r from-violet-500 to-purple-500 text-white'
          }`}
          style={{ padding: `${spacing[1]} ${spacing[3]}` }}
          >
            {badge}
          </span>
        )}
      </motion.button>
      {isOpen && (
        <motion.div 
          className="bg-gradient-to-br from-white via-violet-50/20 to-purple-50/20"
          style={{ 
            padding: spacing[5],
            gap: spacing[5]
          }}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[5] }}>
            {children}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// Text Input Field - Premium design with our Input component
function TextField({ 
  label, 
  value, 
  onChange, 
  placeholder,
  type = 'text',
  multiline = false,
  icon,
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const Icon = icon;
  return (
    <div>
      <label 
        className="block font-bold text-stone-700 flex items-center"
        style={{ 
          fontSize: typography.bodySmall.fontSize,
          marginBottom: spacing[2],
          gap: spacing[2]
        }}
      >
        {Icon ? (
          <Icon className="w-3.5 h-3.5 text-violet-600" />
        ) : (
          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-500" />
        )}
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full text-stone-800 bg-white border-2 border-violet-200 placeholder:text-stone-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 focus:outline-none transition-all resize-none"
          style={{ 
            padding: `${spacing[3]} ${spacing[4]}`,
            fontSize: typography.bodySmall.fontSize,
            borderRadius: borders.radius.xl,
            boxShadow: shadows.md
          }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full text-stone-800 bg-white border-2 border-violet-200 placeholder:text-stone-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 focus:outline-none transition-all"
          style={{ 
            height: '44px',
            padding: `${spacing[3]} ${spacing[4]}`,
            fontSize: typography.bodySmall.fontSize,
            borderRadius: borders.radius.xl,
            boxShadow: shadows.md
          }}
        />
      )}
    </div>
  );
}

// Number Input Field - Premium design
function NumberField({ 
  label, 
  value, 
  onChange, 
  min,
  max,
  step = 1,
  suffix,
  icon,
}: { 
  label: string; 
  value: number; 
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const Icon = icon;
  return (
    <div>
      <label className="block text-sm font-bold text-stone-700 mb-2.5 flex items-center gap-2">
        {Icon ? (
          <Icon className="w-3.5 h-3.5 text-blue-600" />
        ) : (
          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
        )}
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          min={min}
          max={max}
          step={step}
          className="w-full px-3 py-2 text-sm text-stone-800 bg-white border-2 border-blue-200 rounded-xl placeholder:text-stone-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:shadow-glow-violet focus:outline-none transition-all shadow-sm hover:shadow-md"
        />
        {suffix && (
          <span className="px-3 py-2 text-sm font-semibold text-stone-600 bg-gradient-to-br from-stone-100 to-stone-200 rounded-lg border border-stone-300 shadow-sm whitespace-nowrap">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

// Select Field - Premium dropdown with gradient
function SelectField({ 
  label, 
  value, 
  onChange, 
  options,
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-stone-700 mb-2.5 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 px-4 py-2.5 text-sm font-medium text-stone-800 bg-white border-2 border-emerald-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:shadow-glow-violet focus:outline-none transition-all cursor-pointer shadow-md hover:shadow-lg appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzc4NzE2QyIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==')] bg-[length:12px] bg-[right_1rem_center] bg-no-repeat"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-white text-stone-800 py-2">{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

// Theme Badge - Shows when using theme default vs custom value
function ThemeBadge({ 
  isUsingTheme,
  tooltip
}: { 
  isUsingTheme: boolean;
  tooltip?: string;
}) {
  if (!isUsingTheme) return null;
  
  return (
    <span 
      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-violet-700 bg-violet-100 rounded-md border border-violet-200"
      title={tooltip || "Using theme default"}
    >
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
      </svg>
      Theme
    </span>
  );
}

// Info Tooltip - Educational helper
function InfoTooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  
  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="inline-flex items-center justify-center w-4 h-4 text-slate-400 hover:text-violet-600 transition-colors"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      </button>
      {show && (
        <div className="absolute z-50 left-6 top-0 w-64 p-3 bg-slate-900 text-white text-xs rounded-lg shadow-xl pointer-events-none">
          <div className="absolute -left-1 top-1.5 w-2 h-2 bg-slate-900 rotate-45" />
          {text}
        </div>
      )}
    </div>
  );
}

// Font Picker Field - Beautiful with Live Previews
function FontField({ 
  label, 
  value, 
  onChange, 
  options,
  showThemeBadge,
  isUsingTheme,
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  showThemeBadge?: boolean;
  isUsingTheme?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Convert font ID to CSS font-family for preview
  const getFontFamily = (fontId: string) => {
    return FONT_FAMILY_MAP[fontId] || FONT_FAMILY_MAP['inter'] || "'Inter', sans-serif";
  };
  
  return (
    <div className="relative">
      <label className="block text-xs font-bold text-slate-700 mb-2.5 uppercase tracking-wide flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
        {label}
        {showThemeBadge && <ThemeBadge isUsingTheme={isUsingTheme || false} tooltip="This font is set in the Design tab (applies to all blocks)" />}
      </label>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-violet-400 hover:shadow-lg hover:shadow-violet-500/20 transition-all duration-200 group text-left"
      >
        <div className="flex-1">
          <div 
            className="text-lg font-bold text-slate-800 mb-1"
            style={{ fontFamily: getFontFamily(value) }}
          >
            The quick brown fox
          </div>
          <div className="text-xs text-slate-500 font-medium">
            {options.find(opt => opt.value === value)?.label || value}
          </div>
        </div>
        <svg className="w-5 h-5 text-slate-400 group-hover:text-violet-600 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute z-50 mt-2 w-full p-3 bg-white border-2 border-slate-200 rounded-2xl shadow-2xl max-h-96 overflow-y-auto">
            <div className="space-y-2">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setIsOpen(false); }}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                    value === opt.value
                      ? 'bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-400 shadow-md'
                      : 'bg-white border-2 border-slate-100 hover:border-violet-300 hover:bg-violet-50/50'
                  }`}
                >
                  <div 
                    className="text-xl font-bold text-slate-800 mb-1"
                    style={{ fontFamily: getFontFamily(opt.value) }}
                  >
                    The quick brown fox
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {opt.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Toggle/Checkbox Field with premium gradient switch
function ToggleField({ 
  label, 
  description,
  checked, 
  onChange,
}: { 
  label: string; 
  description?: string;
  checked: boolean; 
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-4 cursor-pointer group p-4 rounded-xl bg-white hover:bg-gradient-to-br hover:from-violet-50 hover:to-purple-50 border-2 border-violet-200/50 hover:border-violet-300 transition-all duration-300 shadow-md hover:shadow-lg">
      <div className="relative mt-0.5 flex-shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        {/* Track - premium gradient when active */}
        <div 
          className={`
            w-12 h-7 rounded-full transition-all duration-300 shadow-inner
            ${checked 
              ? 'bg-gradient-to-r from-violet-500 to-purple-500 shadow-[0_0_0_2px_rgba(139,92,246,0.2)]' 
              : 'bg-stone-200 border-2 border-stone-300'
            }
          `}
        />
        {/* Thumb - white with shadow */}
        <div 
          className={`
            absolute top-[3px] left-[3px] w-[21px] h-[21px] rounded-full 
            shadow-lg transition-all duration-300 bg-white
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
        {/* Pulse effect when checked */}
        {checked && (
          <div className="absolute inset-0 rounded-full bg-violet-400 animate-ping opacity-20" />
        )}
      </div>
      <div className="min-w-0">
        <span className="text-sm font-bold text-stone-800 group-hover:text-violet-700 transition-colors">{label}</span>
        {description && <p className="text-xs text-stone-500 mt-1 leading-relaxed">{description}</p>}
      </div>
    </label>
  );
}

// Color Picker Field - Modern with Gradients & Presets
function ColorField({ 
  label, 
  value, 
  onChange,
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Enhanced color presets with gradients
  const colorSections = [
    {
      name: 'Brand Colors',
      colors: ['#8B5CF6', '#A855F7', '#C084FC', '#E879F9', '#EC4899', '#F43F5E']
    },
    {
      name: 'Neutrals',
      colors: ['#0F172A', '#1E293B', '#475569', '#64748B', '#94A3B8', '#CBD5E1', '#F1F5F9', '#FFFFFF']
    },
    {
      name: 'Vibrant',
      colors: ['#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E', '#10B981', '#14B8A6']
    },
    {
      name: 'Cool Tones',
      colors: ['#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF', '#E11D48']
    }
  ];
  
  return (
    <div className="relative">
      <label className="block text-xs font-bold text-slate-700 mb-2.5 uppercase tracking-wide flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-500" />
        {label}
      </label>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 p-3 bg-white border-2 border-slate-200 rounded-xl hover:border-violet-400 hover:shadow-lg hover:shadow-violet-500/20 transition-all duration-200 group"
      >
        <div
          className="w-12 h-12 rounded-xl border-2 border-white shadow-lg ring-2 ring-slate-200 group-hover:ring-violet-400 transition-all duration-200"
          style={{ backgroundColor: value || '#000000' }}
        />
        <div className="flex-1 text-left">
          <div className="text-sm font-bold text-slate-800 group-hover:text-violet-600 transition-colors">
            {value || '#000000'}
          </div>
          <div className="text-xs text-slate-500 font-medium">Click to change</div>
        </div>
        <svg className="w-5 h-5 text-slate-400 group-hover:text-violet-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute z-50 mt-2 p-5 bg-white border-2 border-slate-200 rounded-2xl shadow-2xl w-80 max-h-96 overflow-y-auto">
            {/* Hex Color Picker */}
            <div className="mb-5">
              <HexColorPicker color={value || '#000000'} onChange={onChange} className="!w-full" />
            </div>
            
            {/* Hex Input */}
            <div className="mb-5">
              <input
                type="text"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder="#000000"
                className="w-full px-4 py-2.5 text-sm font-mono font-semibold text-slate-800 bg-slate-50 border-2 border-slate-200 rounded-xl placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 focus:outline-none transition-all"
              />
            </div>
            
            {/* Color Presets by Section */}
            {colorSections.map((section) => (
              <div key={section.name} className="mb-4 last:mb-0">
                <div className="text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">
                  {section.name}
                </div>
                <div className="grid grid-cols-8 gap-2">
                  {section.colors.map((color) => (
                    <button
                      key={color}
                      className="w-full aspect-square rounded-lg border-2 border-white shadow-md hover:scale-110 hover:shadow-xl hover:border-violet-400 transition-all duration-200 ring-2 ring-slate-200 hover:ring-violet-400"
                      style={{ backgroundColor: color }}
                      onClick={() => { onChange(color); setIsOpen(false); }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Alignment Picker - Better contrast
function AlignmentField({ 
  label, 
  value, 
  onChange,
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide">{label}</label>
      <div className="flex gap-1 p-1.5 bg-white border border-stone-300 rounded-lg">
        {[
          { value: 'left', icon: AlignLeft },
          { value: 'center', icon: AlignCenter },
          { value: 'right', icon: AlignRight },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex-1 p-2.5 rounded-md transition-all',
              value === opt.value 
                ? 'bg-violet-600 text-stone-800 shadow' 
                : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
            )}
          >
            <opt.icon className="w-4 h-4 mx-auto" />
          </button>
        ))}
      </div>
    </div>
  );
}

// Button Group (for selecting from options) - Better contrast
function ButtonGroup({ 
  label, 
  value, 
  onChange,
  options,
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              'px-3 py-2 text-xs font-semibold rounded-lg border transition-all',
              value === opt.value 
                ? 'bg-violet-600 text-stone-800 border-violet-500' 
                : 'bg-white text-stone-600 border-stone-300 hover:border-violet-500 hover:text-stone-800'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// Image Upload Field - Better contrast
function ImageField({ 
  label, 
  value, 
  onChange,
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large (max 10MB)');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      // Try to upload via media service first
      const formData = new FormData();
      formData.append('file', file);
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost';
      const response = await fetch(`${apiUrl}/media/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        onChange(result.url);
      } else {
        // Fallback to base64 if media service unavailable
        const reader = new FileReader();
        reader.onloadend = () => {
          onChange(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    } catch {
      // Fallback to base64 on error
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div>
      <label className="block text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide">{label}</label>
      
      {error && (
        <div className="mb-2 text-xs text-red-400 bg-red-900/30 px-3 py-2 rounded-lg border border-red-700">{error}</div>
      )}
      
      {value ? (
        <div className="relative group">
          <img 
            src={value} 
            alt="Preview" 
            className="w-full h-32 object-cover rounded-lg border border-stone-300"
          />
          <button
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-stone-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-stone-300 rounded-lg cursor-pointer hover:border-violet-500 hover:bg-white/50 transition-all">
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          {isUploading ? (
            <div className="animate-spin w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full" />
          ) : (
            <>
              <Upload className="w-8 h-8 text-stone-500 mb-2" />
              <span className="text-xs text-stone-500 font-medium">Click to upload</span>
            </>
          )}
        </label>
      )}
      
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste image URL..."
        className="w-full mt-3 px-3 py-2.5 text-sm text-stone-800 bg-white border border-stone-300 rounded-lg placeholder:text-stone-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all"
      />
    </div>
  );
}

// ============================================
// BLOCK-SPECIFIC EDITORS
// ============================================

// Heading Block Editor
function HeadingEditor({ block, updateContent, updateStyles }: { 
  block: Block; 
  updateContent: (key: string, value: unknown) => void;
  updateStyles: (key: string, value: unknown) => void;
}) {
  return (
    <>
      <Section title="Content" icon={Type} defaultOpen={true}>
        <TextField
          label="Heading Text"
          value={(block.content.text as string) || ''}
          onChange={(v) => updateContent('text', v)}
          placeholder="Enter heading text..."
        />
        <SelectField
          label="Heading Level"
          value={String(block.content.level || 1)}
          onChange={(v) => updateContent('level', parseInt(v))}
          options={[
            { label: 'H1 - Largest', value: '1' },
            { label: 'H2 - Large', value: '2' },
            { label: 'H3 - Medium', value: '3' },
          ]}
        />
        <TextField
          label="Icon / Emoji"
          value={(block.content.icon as string) || ''}
          onChange={(v) => updateContent('icon', v)}
          placeholder="✨ (optional)"
        />
        {(block.content.icon as string) && (
          <SelectField
            label="Icon Position"
            value={(block.content.iconPosition as string) || 'left'}
            onChange={(v) => updateContent('iconPosition', v)}
            options={[
              { value: 'left', label: 'Left' },
              { value: 'right', label: 'Right' },
              { value: 'above', label: 'Above' },
              { value: 'below', label: 'Below' },
            ]}
          />
        )}
      </Section>
      
      <Section title="Visual Style" icon={Palette} defaultOpen={false}>
        <SelectField
          label="Text Gradient"
          value={(block.content.gradient as string) || 'none'}
          onChange={(v) => updateContent('gradient', v)}
          options={[
            { value: 'none', label: 'None (Solid Color)' },
            { value: 'primary', label: 'Primary Purple' },
            { value: 'rainbow', label: 'Rainbow' },
            { value: 'sunset', label: 'Sunset' },
            { value: 'ocean', label: 'Ocean' },
            { value: 'forest', label: 'Forest' },
          ]}
        />
        {(block.content.gradient as string) === 'none' && (
          <ColorField
            label="Text Color"
            value={(block.styles?.color as string) || ''}
            onChange={(v) => updateStyles('color', v)}
          />
        )}
        <SelectField
          label="Text Shadow"
          value={(block.content.textShadow as string) || 'none'}
          onChange={(v) => updateContent('textShadow', v)}
          options={[
            { value: 'none', label: 'None' },
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' },
            { value: 'lg', label: 'Large' },
            { value: 'glow', label: 'Glow Effect' },
            { value: 'neon', label: 'Neon Effect' },
          ]}
        />
        <SelectField
          label="Decoration"
          value={(block.content.decoration as string) || 'none'}
          onChange={(v) => updateContent('decoration', v)}
          options={[
            { value: 'none', label: 'None' },
            { value: 'underline', label: 'Underline' },
            { value: 'wavy', label: 'Wavy Underline' },
            { value: 'highlight', label: 'Highlight' },
          ]}
        />
      </Section>

      <Section title="Typography" icon={Type} defaultOpen={false}>
        <div className="mb-3 p-3 bg-violet-50 border border-violet-200 rounded-lg">
          <div className="flex items-start gap-2 text-xs text-violet-900">
            <InfoTooltip text="Typography settings from the Design tab apply to all blocks. You can override them here for this specific heading." />
            <p className="leading-relaxed">
              <strong>💡 Tip:</strong> Change fonts for your entire page in the <strong>Design</strong> tab. Override individual blocks here.
            </p>
          </div>
        </div>
        <FontField
          label="Font Family"
          value={(block.styles?.fontFamily as string) || 'inter'}
          onChange={(v) => {
            updateStyles('fontFamily', v);
          }}
          options={FONT_OPTIONS}
          showThemeBadge={false}
        />
        <NumberField
          label="Line Height"
          value={(block.content.lineHeight as number) ?? 1.2}
          onChange={(v) => updateContent('lineHeight', v)}
          min={0.8}
          max={2.5}
          step={0.1}
        />
      </Section>

      <Section title="Layout" icon={LayoutPanelTop} defaultOpen={false}>
        <AlignmentField
          label="Text Alignment"
          value={(block.styles?.textAlign as string) || 'left'}
          onChange={(v) => updateStyles('textAlign', v)}
        />
        <NumberField
          label="Margin Top"
          value={(block.content.marginTop as number) || 0}
          onChange={(v) => updateContent('marginTop', v)}
          min={0}
          max={100}
          step={4}
          suffix="px"
        />
        <NumberField
          label="Margin Bottom"
          value={(block.content.marginBottom as number) || 0}
          onChange={(v) => updateContent('marginBottom', v)}
          min={0}
          max={100}
          step={4}
          suffix="px"
        />
      </Section>

      <Section title="Animation" icon={Zap} defaultOpen={false}>
        <SelectField
          label="Entrance Animation"
          value={(block.content.animation as string) || 'none'}
          onChange={(v) => updateContent('animation', v)}
          options={[
            { value: 'none', label: 'None' },
            { value: 'fadeIn', label: 'Fade In' },
            { value: 'slideLeft', label: 'Slide from Left' },
            { value: 'slideRight', label: 'Slide from Right' },
            { value: 'bounce', label: 'Bounce' },
            { value: 'pulse', label: 'Pulse' },
          ]}
        />
      </Section>
    </>
  );
}

// Text Block Editor  
function TextEditor({ block, updateContent, updateStyles }: { 
  block: Block; 
  updateContent: (key: string, value: unknown) => void;
  updateStyles: (key: string, value: unknown) => void;
}) {
  // Strip HTML tags for simple editing
  const plainText = ((block.content.html as string) || '').replace(/<[^>]*>/g, '');
  
  return (
    <>
      <Section title="Content" icon={Type} defaultOpen={true}>
        <TextField
          label="Text Content"
          value={plainText}
          onChange={(v) => updateContent('html', `<p>${v}</p>`)}
          placeholder="Enter your text..."
          multiline
        />
        <SelectField
          label="Text Style"
          value={(block.content.textStyle as string) || 'normal'}
          onChange={(v) => updateContent('textStyle', v)}
          options={[
            { value: 'normal', label: 'Normal' },
            { value: 'lead', label: 'Lead (Larger)' },
            { value: 'muted', label: 'Muted' },
            { value: 'highlight', label: 'Highlight' },
          ]}
        />
      </Section>

      <Section title="Typography" icon={Type} defaultOpen={false}>
        <SelectField
          label="Font Size"
          value={(block.content.fontSize as string) || 'base'}
          onChange={(v) => updateContent('fontSize', v)}
          options={[
            { value: 'sm', label: 'Small' },
            { value: 'base', label: 'Base' },
            { value: 'lg', label: 'Large' },
            { value: 'xl', label: 'Extra Large' },
            { value: '2xl', label: '2X Large' },
          ]}
        />
        <SelectField
          label="Font Weight"
          value={(block.content.fontWeight as string) || 'normal'}
          onChange={(v) => updateContent('fontWeight', v)}
          options={[
            { value: 'normal', label: 'Normal' },
            { value: 'medium', label: 'Medium' },
            { value: 'semibold', label: 'Semi Bold' },
            { value: 'bold', label: 'Bold' },
          ]}
        />
        <SelectField
          label="Line Height"
          value={(block.content.lineHeight as string) || 'normal'}
          onChange={(v) => updateContent('lineHeight', v)}
          options={[
            { value: 'tight', label: 'Tight' },
            { value: 'normal', label: 'Normal' },
            { value: 'relaxed', label: 'Relaxed' },
            { value: 'loose', label: 'Loose' },
          ]}
        />
        <div className="mb-3 p-3 bg-violet-50 border border-violet-200 rounded-lg">
          <div className="flex items-start gap-2 text-xs text-violet-900">
            <InfoTooltip text="Typography settings from the Design tab apply to all blocks. You can override them here for this specific text block." />
            <p className="leading-relaxed">
              <strong>💡 Tip:</strong> Customize fonts globally in the <strong>Design</strong> tab.
            </p>
          </div>
        </div>
        <FontField
          label="Font Family"
          value={(block.styles?.fontFamily as string) || 'inter'}
          onChange={(v) => {
            updateStyles('fontFamily', v);
          }}
          options={FONT_OPTIONS}
          showThemeBadge={false}
        />
      </Section>

      <Section title="Layout" icon={LayoutPanelTop} defaultOpen={false}>
        <SelectField
          label="Text Alignment"
          value={(block.content.textAlign as string) || 'left'}
          onChange={(v) => updateContent('textAlign', v)}
          options={[
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
            { value: 'justify', label: 'Justify' },
          ]}
        />
        <SelectField
          label="Max Width"
          value={(block.content.maxWidth as string) || 'full'}
          onChange={(v) => updateContent('maxWidth', v)}
          options={[
            { value: 'full', label: 'Full Width' },
            { value: '4xl', label: 'Extra Wide' },
            { value: '2xl', label: 'Wide' },
            { value: 'xl', label: 'Narrow' },
          ]}
        />
        <ToggleField
          label="2-Column Layout"
          checked={(block.content.columns as boolean) ?? false}
          onChange={(v) => updateContent('columns', v)}
        />
        <ToggleField
          label="Drop Cap (First Letter)"
          checked={(block.content.dropCap as boolean) ?? false}
          onChange={(v) => updateContent('dropCap', v)}
        />
      </Section>
      
      <Section title="Visual Style" icon={Palette} defaultOpen={false}>
        <ColorField
          label="Text Color"
          value={(block.styles?.color as string) || ''}
          onChange={(v) => updateStyles('color', v)}
        />
        <SelectField
          label="Background Style"
          value={(block.content.bgStyle as string) || 'none'}
          onChange={(v) => updateContent('bgStyle', v)}
          options={[
            { value: 'none', label: 'None' },
            { value: 'subtle', label: 'Subtle' },
            { value: 'card', label: 'Card' },
            { value: 'highlight', label: 'Highlight' },
          ]}
        />
        <SelectField
          label="Text Shadow"
          value={(block.content.textShadow as string) || 'none'}
          onChange={(v) => updateContent('textShadow', v)}
          options={[
            { value: 'none', label: 'None' },
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' },
          ]}
        />
        <SelectField
          label="Border Style"
          value={(block.content.borderStyle as string) || 'none'}
          onChange={(v) => updateContent('borderStyle', v)}
          options={[
            { value: 'none', label: 'None' },
            { value: 'left', label: 'Left Accent' },
            { value: 'full', label: 'Full Border' },
            { value: 'dashed', label: 'Dashed Border' },
          ]}
        />
        {(block.content.borderStyle as string) && (block.content.borderStyle as string) !== 'none' && (
          <ColorField
            label="Border Color"
            value={(block.content.borderColor as string) || '#8b5cf6'}
            onChange={(v) => updateContent('borderColor', v)}
          />
        )}
      </Section>

      <Section title="Icon / Author" icon={User} defaultOpen={false}>
        <TextField
          label="Icon / Emoji"
          value={(block.content.icon as string) || ''}
          onChange={(v) => updateContent('icon', v)}
          placeholder="💡 (optional)"
        />
        {(block.content.icon as string) && (
          <SelectField
            label="Icon Position"
            value={(block.content.iconPosition as string) || 'left'}
            onChange={(v) => updateContent('iconPosition', v)}
            options={[
              { value: 'left', label: 'Left' },
              { value: 'above', label: 'Above' },
            ]}
          />
        )}
        <TextField
          label="Author Name"
          value={(block.content.authorName as string) || ''}
          onChange={(v) => updateContent('authorName', v)}
          placeholder="John Doe (optional)"
        />
        {(block.content.authorName as string) && (
          <TextField
            label="Author Title"
            value={(block.content.authorTitle as string) || ''}
            onChange={(v) => updateContent('authorTitle', v)}
            placeholder="CEO (optional)"
          />
        )}
      </Section>
    </>
  );
}

// Button Block Editor
function ButtonEditor({ block, updateContent, updateStyles }: { 
  block: Block; 
  updateContent: (key: string, value: unknown) => void;
  updateStyles: (key: string, value: unknown) => void;
}) {
  return (
    <>
      <Section title="Content" icon={Type} defaultOpen={true}>
        <TextField
          label="Button Text"
          value={(block.content.label as string) || ''}
          onChange={(v) => updateContent('label', v)}
          placeholder="Click me"
        />
        <TextField
          label="Link URL"
          value={(block.content.url as string) || ''}
          onChange={(v) => updateContent('url', v)}
          placeholder="https://..."
          type="url"
        />
      </Section>
      
      <Section title="Style" icon={Palette} defaultOpen={false}>
        <div className="mb-3 p-3 bg-violet-50 border border-violet-200 rounded-lg">
          <div className="flex items-start gap-2 text-xs text-violet-900">
            <InfoTooltip text="Button colors and styles can be set globally in the Design tab. Use 'Use Theme Colors' below to apply them, or customize this button individually." />
            <p className="leading-relaxed">
              <strong>💡 Tip:</strong> Set button colors for all buttons in <strong>Design → Buttons</strong>.
            </p>
          </div>
        </div>
        <ButtonGroup
          label="Button Style"
          value={(block.styles?.variant as string) || 'solid'}
          onChange={(v) => updateStyles('variant', v)}
          options={[
            { label: 'Solid', value: 'solid' },
            { label: 'Outline', value: 'outline' },
            { label: 'Ghost', value: 'ghost' },
          ]}
        />
        <ColorField
          label="Button Color"
          value={(block.styles?.backgroundColor as string) || '#8B5CF6'}
          onChange={(v) => updateStyles('backgroundColor', v)}
        />
        <AlignmentField
          label="Alignment"
          value={(block.styles?.alignment as string) || 'center'}
          onChange={(v) => updateStyles('alignment', v)}
        />
      </Section>
    </>
  );
}

// Image Block Editor
function ImageEditor({ block, updateContent, updateStyles }: { 
  block: Block; 
  updateContent: (key: string, value: unknown) => void;
  updateStyles: (key: string, value: unknown) => void;
}) {
  return (
    <>
      <Section title="Image" icon={ImageIcon} defaultOpen={true}>
        <ImageField
          label="Image URL"
          value={(block.content.url as string) || ''}
          onChange={(v) => updateContent('url', v)}
        />
        <TextField
          label="Alt Text"
          value={(block.content.alt as string) || ''}
          onChange={(v) => updateContent('alt', v)}
          placeholder="Describe the image..."
        />
        <TextField
          label="Caption"
          value={(block.content.caption as string) || ''}
          onChange={(v) => updateContent('caption', v)}
          placeholder="Optional caption below image"
        />
      </Section>

      <Section title="Link & Behavior" icon={Link2} defaultOpen={false}>
        <TextField
          label="Link URL"
          value={(block.content.link as string) || ''}
          onChange={(v) => updateContent('link', v)}
          placeholder="https://... (optional)"
          type="url"
        />
        {(block.content.link as string) && (
          <ToggleField
            label="Open in New Tab"
            checked={(block.content.openInNewTab as boolean) ?? true}
            onChange={(v) => updateContent('openInNewTab', v)}
          />
        )}
        <ToggleField
          label="Lightbox (Click to Expand)"
          checked={(block.content.lightbox as boolean) ?? false}
          onChange={(v) => updateContent('lightbox', v)}
        />
        <ToggleField
          label="Lazy Load"
          checked={(block.content.lazyLoad as boolean) ?? true}
          onChange={(v) => updateContent('lazyLoad', v)}
        />
      </Section>
      
      <Section title="Size & Fit" icon={ImageIcon} defaultOpen={false}>
        <SelectField
          label="Width"
          value={(block.content.width as string) || '100%'}
          onChange={(v) => updateContent('width', v)}
          options={[
            { value: '100%', label: 'Full Width' },
            { value: '75%', label: '75%' },
            { value: '50%', label: '50%' },
            { value: '33%', label: '33%' },
            { value: 'custom', label: 'Custom' },
          ]}
        />
        {(block.content.width as string) === 'custom' && (
          <NumberField
            label="Custom Width"
            value={(block.content.customWidth as number) || 100}
            onChange={(v) => updateContent('customWidth', v)}
            min={10}
            max={100}
            step={5}
            suffix="%"
          />
        )}
        <SelectField
          label="Height Mode"
          value={(block.content.heightMode as string) || 'auto'}
          onChange={(v) => updateContent('heightMode', v)}
          options={[
            { value: 'auto', label: 'Auto (Natural)' },
            { value: 'fixed', label: 'Fixed Height' },
          ]}
        />
        {(block.content.heightMode as string) === 'fixed' && (
          <NumberField
            label="Fixed Height"
            value={(block.content.fixedHeight as number) || 300}
            onChange={(v) => updateContent('fixedHeight', v)}
            min={50}
            max={1000}
            step={10}
            suffix="px"
          />
        )}
        <ButtonGroup
          label="Object Fit"
          value={(block.styles?.objectFit as string) || 'cover'}
          onChange={(v) => updateStyles('objectFit', v)}
          options={[
            { label: 'Cover', value: 'cover' },
            { label: 'Contain', value: 'contain' },
            { label: 'Fill', value: 'fill' },
          ]}
        />
        <ToggleField
          label="Lock Aspect Ratio"
          checked={(block.content.aspectRatioLock as boolean) ?? true}
          onChange={(v) => updateContent('aspectRatioLock', v)}
        />
      </Section>

      <Section title="Visual Style" icon={Palette} defaultOpen={false}>
        <NumberField
          label="Border Radius"
          value={(block.content.borderRadius as number) ?? 8}
          onChange={(v) => updateContent('borderRadius', v)}
          min={0}
          max={100}
          step={4}
          suffix="px"
        />
        <SelectField
          label="Shadow"
          value={(block.content.shadow as string) || 'none'}
          onChange={(v) => updateContent('shadow', v)}
          options={[
            { value: 'none', label: 'None' },
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' },
            { value: 'lg', label: 'Large' },
            { value: 'xl', label: 'Extra Large' },
            { value: 'glow', label: 'Glow Effect' },
          ]}
        />
        <SelectField
          label="Filter"
          value={(block.content.filter as string) || 'none'}
          onChange={(v) => updateContent('filter', v)}
          options={[
            { value: 'none', label: 'None' },
            { value: 'grayscale', label: 'Grayscale' },
            { value: 'sepia', label: 'Sepia' },
            { value: 'blur', label: 'Blur' },
            { value: 'brightness', label: 'Bright' },
            { value: 'contrast', label: 'High Contrast' },
          ]}
        />
        <NumberField
          label="Opacity"
          value={(block.content.opacity as number) ?? 100}
          onChange={(v) => updateContent('opacity', v)}
          min={0}
          max={100}
          step={5}
          suffix="%"
        />
      </Section>

      <Section title="Border" icon={Square} defaultOpen={false}>
        <SelectField
          label="Border Style"
          value={(block.content.borderStyle as string) || 'none'}
          onChange={(v) => updateContent('borderStyle', v)}
          options={[
            { value: 'none', label: 'None' },
            { value: 'solid', label: 'Solid' },
            { value: 'dashed', label: 'Dashed' },
            { value: 'dotted', label: 'Dotted' },
            { value: 'double', label: 'Double' },
          ]}
        />
        {(block.content.borderStyle as string) && (block.content.borderStyle as string) !== 'none' && (
          <>
            <NumberField
              label="Border Width"
              value={(block.content.borderWidth as number) || 2}
              onChange={(v) => updateContent('borderWidth', v)}
              min={1}
              max={20}
              step={1}
              suffix="px"
            />
            <ColorField
              label="Border Color"
              value={(block.content.borderColor as string) || '#000000'}
              onChange={(v) => updateContent('borderColor', v)}
            />
          </>
        )}
      </Section>

      <Section title="Hover Effect" icon={MousePointerClick} defaultOpen={false}>
        <SelectField
          label="Hover Animation"
          value={(block.content.hoverEffect as string) || 'none'}
          onChange={(v) => updateContent('hoverEffect', v)}
          options={[
            { value: 'none', label: 'None' },
            { value: 'zoom', label: 'Zoom In' },
            { value: 'lift', label: 'Lift Up' },
            { value: 'brightness', label: 'Brighten' },
            { value: 'grayscale', label: 'Remove Grayscale' },
            { value: 'blur', label: 'Blur' },
          ]}
        />
      </Section>

      <Section title="Layout" icon={LayoutPanelTop} defaultOpen={false}>
        <SelectField
          label="Alignment"
          value={(block.content.alignment as string) || 'center'}
          onChange={(v) => updateContent('alignment', v)}
          options={[
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
          ]}
        />
        <NumberField
          label="Margin Top"
          value={(block.content.marginTop as number) || 0}
          onChange={(v) => updateContent('marginTop', v)}
          min={0}
          max={100}
          step={4}
          suffix="px"
        />
        <NumberField
          label="Margin Bottom"
          value={(block.content.marginBottom as number) || 0}
          onChange={(v) => updateContent('marginBottom', v)}
          min={0}
          max={100}
          step={4}
          suffix="px"
        />
      </Section>
    </>
  );
}

// Video Block Editor
function VideoEditor({ block, updateContent }: { 
  block: Block; 
  updateContent: (key: string, value: unknown) => void;
}) {
  const url = (block.content.url as string) || '';
  
  // Extract video ID and platform for preview
  const getVideoPreview = () => {
    if (!url) return null;
    
    // YouTube
    const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch) {
      return {
        platform: 'YouTube',
        thumbnail: `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`,
        embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}`,
      };
    }
    
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return {
        platform: 'Vimeo',
        thumbnail: null, // Vimeo requires API call
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      };
    }
    
    // TikTok
    if (url.includes('tiktok.com')) {
      return {
        platform: 'TikTok',
        thumbnail: null,
        embedUrl: url,
      };
    }
    
    // Instagram
    if (url.includes('instagram.com')) {
      return {
        platform: 'Instagram',
        thumbnail: null,
        embedUrl: url,
      };
    }

    // Loom
    if (url.includes('loom.com')) {
      return {
        platform: 'Loom',
        thumbnail: null,
        embedUrl: url,
      };
    }

    // Wistia
    if (url.includes('wistia.com')) {
      return {
        platform: 'Wistia',
        thumbnail: null,
        embedUrl: url,
      };
    }
    
    return null;
  };
  
  const preview = getVideoPreview();
  
  return (
    <>
      <Section title="Video Source" icon={Video} defaultOpen={true}>
        <div className="space-y-3">
          <TextField
            label="Video URL"
            value={url}
            onChange={(v) => updateContent('url', v)}
            placeholder="Paste YouTube, Vimeo, TikTok, Instagram, Loom, or Wistia link..."
            type="url"
          />
          
          {/* Video Preview */}
          {preview ? (
            <div className="relative rounded-xl overflow-hidden border-2 border-violet-200/50 bg-black shadow-lg">
              {preview.thumbnail ? (
                <div className="relative aspect-video">
                  <img 
                    src={preview.thumbnail} 
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
                    <motion.div
                      {...animations.hover.scaleLarge}
                      className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-violet-500/50"
                    >
                      <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </motion.div>
                  </div>
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-violet-900 to-purple-900">
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-3 border border-white/30">
                      <svg className="w-7 h-7 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span className="text-sm text-white/90 font-medium">{preview.platform} video</span>
                  </div>
                </div>
              )}
              
              {/* Platform badge */}
              <div className="absolute top-3 left-3">
                <span className={cn(
                  "px-3 py-1.5 text-xs font-semibold rounded-lg shadow-lg backdrop-blur-sm",
                  preview.platform === 'YouTube' && "bg-red-500/90 text-white",
                  preview.platform === 'Vimeo' && "bg-blue-500/90 text-white",
                  preview.platform === 'TikTok' && "bg-black/90 text-white",
                  preview.platform === 'Instagram' && "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
                  preview.platform === 'Loom' && "bg-purple-600/90 text-white",
                  preview.platform === 'Wistia' && "bg-blue-600/90 text-white",
                )}>
                  {preview.platform}
                </span>
              </div>
            </div>
          ) : url && (
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300/50 rounded-xl">
              <p className="text-sm text-amber-900 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                Couldn't recognize video URL. Supported platforms: YouTube, Vimeo, TikTok, Instagram, Loom, Wistia.
              </p>
            </div>
          )}
          
          {!url && (
            <div className="p-6 border-2 border-dashed border-violet-200 rounded-xl text-center bg-gradient-to-br from-violet-50/50 to-purple-50/50">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-violet-900 font-medium mb-3">Paste a video URL above</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-2.5 py-1 text-xs bg-red-500 text-white rounded-lg font-medium shadow-sm">YouTube</span>
                <span className="px-2.5 py-1 text-xs bg-blue-500 text-white rounded-lg font-medium shadow-sm">Vimeo</span>
                <span className="px-2.5 py-1 text-xs bg-black text-white rounded-lg font-medium shadow-sm">TikTok</span>
                <span className="px-2.5 py-1 text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium shadow-sm">Instagram</span>
                <span className="px-2.5 py-1 text-xs bg-purple-600 text-white rounded-lg font-medium shadow-sm">Loom</span>
                <span className="px-2.5 py-1 text-xs bg-blue-600 text-white rounded-lg font-medium shadow-sm">Wistia</span>
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Caption Section */}
      <Section title="Caption" icon={Type} defaultOpen={false}>
        <TextField
          label="Video Caption"
          value={(block.content.caption as string) || ''}
          onChange={(v) => updateContent('caption', v)}
          placeholder="Add a caption for your video..."
          multiline
        />
      </Section>
      
      {/* Display Section */}
      <Section title="Size & Layout" icon={Layout} defaultOpen={false}>
        <SelectField
          label="Aspect Ratio"
          value={(block.content.aspectRatio as string) || '16:9'}
          onChange={(v) => updateContent('aspectRatio', v)}
          options={[
            { label: '16:9 (Landscape)', value: '16:9' },
            { label: '9:16 (Portrait/TikTok)', value: '9:16' },
            { label: '4:3 (Standard)', value: '4:3' },
            { label: '1:1 (Square)', value: '1:1' },
            { label: '21:9 (Ultrawide)', value: '21:9' },
          ]}
        />
        <SelectField
          label="Width"
          value={(block.content.width as string) || '100%'}
          onChange={(v) => updateContent('width', v)}
          options={[
            { label: 'Full Width', value: '100%' },
            { label: 'Large (900px)', value: '900px' },
            { label: 'Medium (700px)', value: '700px' },
            { label: 'Small (500px)', value: '500px' },
          ]}
        />
        <SelectField
          label="Alignment"
          value={(block.content.alignment as string) || 'center'}
          onChange={(v) => updateContent('alignment', v)}
          options={[
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ]}
        />
      </Section>

      {/* Visual Style Section */}
      <Section title="Visual Style" icon={Palette} defaultOpen={false}>
        <NumberField
          label="Border Radius"
          value={(block.content.borderRadius as number) ?? 8}
          onChange={(v) => updateContent('borderRadius', v)}
          min={0}
          max={50}
          suffix="px"
        />
        <SelectField
          label="Shadow"
          value={(block.content.shadow as string) || 'none'}
          onChange={(v) => updateContent('shadow', v)}
          options={[
            { label: 'None', value: 'none' },
            { label: 'Small', value: 'sm' },
            { label: 'Medium', value: 'md' },
            { label: 'Large', value: 'lg' },
            { label: 'Extra Large', value: 'xl' },
          ]}
        />
      </Section>
      
      {/* Playback Settings Section */}
      <Section title="Playback Settings" icon={Settings2} defaultOpen={false}>
        <ToggleField
          label="Autoplay"
          checked={(block.content.autoplay as boolean) || false}
          onChange={(v) => updateContent('autoplay', v)}
        />
        <ToggleField
          label="Loop Video"
          checked={(block.content.loop as boolean) || false}
          onChange={(v) => updateContent('loop', v)}
        />
        <ToggleField
          label="Muted by Default"
          checked={(block.content.muted as boolean) || false}
          onChange={(v) => updateContent('muted', v)}
        />
        <ToggleField
          label="Show Controls"
          checked={(block.content.showControls as boolean) ?? true}
          onChange={(v) => updateContent('showControls', v)}
        />
        <NumberField
          label="Start Time (seconds)"
          value={(block.content.startTime as number) || 0}
          onChange={(v) => updateContent('startTime', v)}
          min={0}
          suffix="s"
        />
      </Section>

      {/* Advanced Settings Section */}
      <Section title="Advanced Settings" icon={Settings} defaultOpen={false}>
        <ToggleField
          label="Privacy Mode (YouTube)"
          checked={(block.content.privacyMode as boolean) || false}
          onChange={(v) => updateContent('privacyMode', v)}
        />
        <ToggleField
          label="Hide Related Videos (YouTube)"
          checked={(block.content.noRelated as boolean) || false}
          onChange={(v) => updateContent('noRelated', v)}
        />
        <ToggleField
          label="Lazy Load"
          checked={(block.content.lazyLoad as boolean) ?? true}
          onChange={(v) => updateContent('lazyLoad', v)}
        />
      </Section>
    </>
  );
}

// Profile Block Editor
function ProfileEditor({ block, updateContent }: { 
  block: Block; 
  updateContent: (key: string, value: unknown) => void;
}) {
  return (
    <>
      <Section title="Profile Info" icon={Type} defaultOpen={true}>
        <ImageField
          label="Avatar"
          value={(block.content.avatarUrl as string) || ''}
          onChange={(v) => updateContent('avatarUrl', v)}
        />
        <TextField
          label="Display Name"
          value={(block.content.displayName as string) || ''}
          onChange={(v) => updateContent('displayName', v)}
          placeholder="Your Name"
        />
        <TextField
          label="Bio"
          value={(block.content.bio as string) || ''}
          onChange={(v) => updateContent('bio', v)}
          placeholder="Tell visitors about yourself..."
          multiline
        />
        <TextField
          label="Location"
          value={(block.content.location as string) || ''}
          onChange={(v) => updateContent('location', v)}
          placeholder="City, Country"
        />
      </Section>
    </>
  );
}

// Platform detection for link buttons
interface PlatformInfo {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const detectLinkPlatform = (url: string): PlatformInfo | null => {
  if (!url) return null;
  
  try {
    const urlLower = url.toLowerCase();
    
    // Music platforms
    if (urlLower.includes('spotify.com') || urlLower.includes('open.spotify')) {
      return { name: 'Spotify', icon: SpotifyIcon, color: BrandColors.spotify };
    }
    if (urlLower.includes('music.apple.com') || urlLower.includes('apple.com/music')) {
      return { name: 'Apple Music', icon: AppleMusicIcon, color: BrandColors.appleMusic };
    }
    
    // Video platforms
    if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
      return { name: 'YouTube', icon: YouTubeIcon, color: BrandColors.youtube };
    }
    if (urlLower.includes('twitch.tv')) {
      return { name: 'Twitch', icon: TwitchIcon, color: BrandColors.twitch };
    }
    if (urlLower.includes('tiktok.com')) {
      return { name: 'TikTok', icon: TikTokIcon, color: BrandColors.tiktok };
    }
    
    // Social media
    if (urlLower.includes('instagram.com')) {
      return { name: 'Instagram', icon: InstagramIcon, color: BrandColors.instagram };
    }
    if (urlLower.includes('x.com') || urlLower.includes('twitter.com')) {
      return { name: 'X', icon: XIcon, color: BrandColors.x };
    }
    if (urlLower.includes('threads.net')) {
      return { name: 'Threads', icon: ThreadsIcon, color: BrandColors.threads };
    }
    if (urlLower.includes('facebook.com')) {
      return { name: 'Facebook', icon: FacebookIcon, color: BrandColors.facebook };
    }
    if (urlLower.includes('linkedin.com')) {
      return { name: 'LinkedIn', icon: LinkedInIcon, color: BrandColors.linkedin };
    }
    if (urlLower.includes('snapchat.com')) {
      return { name: 'Snapchat', icon: SnapchatIcon, color: BrandColors.snapchat };
    }
    if (urlLower.includes('pinterest.com')) {
      return { name: 'Pinterest', icon: PinterestIcon, color: BrandColors.pinterest };
    }
    
    // Messaging
    if (urlLower.includes('wa.me') || urlLower.includes('whatsapp.com')) {
      return { name: 'WhatsApp', icon: WhatsAppIcon, color: BrandColors.whatsapp };
    }
    if (urlLower.includes('t.me') || urlLower.includes('telegram')) {
      return { name: 'Telegram', icon: TelegramIcon, color: BrandColors.telegram };
    }
    if (urlLower.includes('discord.com') || urlLower.includes('discord.gg')) {
      return { name: 'Discord', icon: DiscordIcon, color: BrandColors.discord };
    }
    
    // Professional
    if (urlLower.includes('github.com')) {
      return { name: 'GitHub', icon: GitHubIcon, color: BrandColors.github };
    }
    
    // E-commerce & Payments
    if (urlLower.includes('shopify.com')) {
      return { name: 'Shopify', icon: ShopifyIcon, color: BrandColors.shopify };
    }
    if (urlLower.includes('stripe.com')) {
      return { name: 'Stripe', icon: StripeIcon, color: BrandColors.stripe };
    }
    if (urlLower.includes('paypal.com')) {
      return { name: 'PayPal', icon: PayPalIcon, color: BrandColors.paypal };
    }
    
    // Email
    if (urlLower.startsWith('mailto:')) {
      return { name: 'Email', icon: Mail, color: '#EA4335' };
    }
    
    return null;
  } catch {
    return null;
  }
};

// Link Button Block Editor
function LinkButtonEditor({ block, updateContent, updateStyle: _updateStyle }: {
  block: Block;
  updateContent: (key: string, value: unknown) => void;
  updateStyle: (key: string, value: unknown) => void;
}) {
  const url = (block.content.url as string) || '';
  const detectedPlatform = detectLinkPlatform(url);
  
  return (
    <>
      {/* Content Section */}
      <Section title="Content" icon={Type} defaultOpen={true}>
        <TextField
          label="Button Label"
          value={(block.content.label as string) || ''}
          onChange={(v) => updateContent('label', v)}
          placeholder="Click me"
        />
        <TextField
          label="URL"
          value={url}
          onChange={(v) => updateContent('url', v)}
          placeholder="https://example.com"
          type="url"
        />
        
        {/* Platform Detection Preview */}
        {detectedPlatform && (
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: detectedPlatform.color + '15' }}
              >
                <detectedPlatform.icon 
                  className="w-6 h-6" 
                  style={{ color: detectedPlatform.color }}
                />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Detected Platform</div>
                <div className="text-sm font-semibold" style={{ color: detectedPlatform.color }}>
                  {detectedPlatform.name}
                </div>
              </div>
              <div className="ml-auto">
                <div className="px-2 py-1 rounded-md text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                  ✓ Auto-styled
                </div>
              </div>
            </div>
          </div>
        )}
        
        <SelectField
          label="Action Type"
          value={(block.content.actionType as string) || 'url'}
          onChange={(v) => updateContent('actionType', v)}
          options={[
            { value: 'url', label: 'Website Link' },
            { value: 'phone', label: 'Phone Call' },
            { value: 'email', label: 'Email' },
            { value: 'download', label: 'Download File' },
          ]}
        />
        <TextField
          label="Helper Text"
          value={(block.content.helperText as string) || ''}
          onChange={(v) => updateContent('helperText', v)}
          placeholder="Optional text below button"
        />
      </Section>

      {/* Button Style Section */}
      <Section title="Button Style" icon={Palette} defaultOpen={false}>
        <SelectField
          label="Variant"
          value={(block.content.variant as string) || 'fill'}
          onChange={(v) => updateContent('variant', v)}
          options={[
            { value: 'fill', label: 'Fill (Solid)' },
            { value: 'outline', label: 'Outline' },
            { value: 'soft', label: 'Soft (Tinted)' },
            { value: 'gradient', label: 'Gradient' },
            { value: 'glass', label: 'Glassmorphism' },
            { value: 'shadow', label: 'Shadow Card' },
          ]}
        />
        <SelectField
          label="Size"
          value={(block.content.size as string) || 'medium'}
          onChange={(v) => updateContent('size', v)}
          options={[
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' },
          ]}
        />
        <NumberField
          label="Border Radius"
          value={(block.content.borderRadius as number) ?? 8}
          onChange={(v) => updateContent('borderRadius', v)}
          min={0}
          max={50}
          suffix="px"
        />
        <SelectField
          label="Shadow"
          value={(block.content.shadow as string) || 'none'}
          onChange={(v) => updateContent('shadow', v)}
          options={[
            { value: 'none', label: 'None' },
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' },
            { value: 'lg', label: 'Large' },
          ]}
        />
      </Section>

      {/* Colors Section */}
      <Section title="Colors" icon={Palette} defaultOpen={false}>
        <ToggleField
          label="Use Theme Colors"
          checked={(block.content.useThemeColors as boolean) ?? true}
          onChange={(v) => updateContent('useThemeColors', v)}
        />
        {!(block.content.useThemeColors as boolean) && (
          <>
            <ColorField
              label="Background Color"
              value={(block.content.customBgColor as string) || '#8b5cf6'}
              onChange={(v) => updateContent('customBgColor', v)}
            />
            <ColorField
              label="Text Color"
              value={(block.content.customTextColor as string) || '#ffffff'}
              onChange={(v) => updateContent('customTextColor', v)}
            />
          </>
        )}
      </Section>

      {/* Icon Section */}
      <Section title="Icon" icon={Sparkles} defaultOpen={false}>
        <TextField
          label="Icon Emoji"
          value={(block.content.icon as string) || ''}
          onChange={(v) => updateContent('icon', v)}
          placeholder="🚀"
        />
        {(block.content.icon as string) && (
          <SelectField
            label="Icon Position"
            value={(block.content.iconPosition as string) || 'left'}
            onChange={(v) => updateContent('iconPosition', v)}
            options={[
              { value: 'left', label: 'Left' },
              { value: 'right', label: 'Right' },
            ]}
          />
        )}
      </Section>

      {/* Layout Section */}
      <Section title="Layout" icon={Layout} defaultOpen={false}>
        <SelectField
          label="Width"
          value={(block.content.width as string) || 'full'}
          onChange={(v) => updateContent('width', v)}
          options={[
            { value: 'full', label: 'Full Width' },
            { value: '75%', label: '75% Width' },
            { value: 'auto', label: 'Auto (Fit Content)' },
          ]}
        />
        <SelectField
          label="Alignment"
          value={(block.content.alignment as string) || 'center'}
          onChange={(v) => updateContent('alignment', v)}
          options={[
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
          ]}
        />
      </Section>

      {/* Hover Effects Section */}
      <Section title="Hover Effects" icon={MousePointerClick} defaultOpen={false}>
        <SelectField
          label="Hover Effect"
          value={(block.content.hoverEffect as string) || 'lift'}
          onChange={(v) => updateContent('hoverEffect', v)}
          options={[
            { value: 'none', label: 'None' },
            { value: 'lift', label: 'Lift Up' },
            { value: 'glow', label: 'Glow' },
            { value: 'scale', label: 'Scale' },
          ]}
        />
        <SelectField
          label="Animation"
          value={(block.content.animation as string) || 'none'}
          onChange={(v) => updateContent('animation', v)}
          options={[
            { value: 'none', label: 'None' },
            { value: 'fadeIn', label: 'Fade In' },
            { value: 'slideUp', label: 'Slide Up' },
            { value: 'bounce', label: 'Bounce' },
          ]}
        />
      </Section>

      {/* Behavior Section */}
      <Section title="Behavior" icon={Settings2} defaultOpen={false}>
        <ToggleField
          label="Open in New Tab"
          checked={(block.content.openInNewTab as boolean) ?? false}
          onChange={(v) => updateContent('openInNewTab', v)}
        />
      </Section>
    </>
  );
}

// Spacer Block Editor
function SpacerEditor({ block, updateContent }: { 
  block: Block; 
  updateContent: (key: string, value: unknown) => void;
}) {
  const height = (block.content.height as number) || 40;
  const mobileHeightEnabled = block.content.mobileHeightEnabled as boolean;
  const backgroundEnabled = block.content.backgroundEnabled as boolean;
  const dividerEnabled = (block.content.dividerStyle as string) !== 'none';
  
  return (
    <>
      {/* Height Section */}
      <Section title="Height" icon={ArrowUpDown} defaultOpen={true}>
        <NumberField
          label="Desktop Height"
          value={height}
          onChange={(v) => updateContent('height', v)}
          min={8}
          max={400}
          suffix="px"
        />
        <ToggleField
          label="Custom Mobile Height"
          checked={mobileHeightEnabled ?? false}
          onChange={(v) => updateContent('mobileHeightEnabled', v)}
        />
        {mobileHeightEnabled && (
          <NumberField
            label="Mobile Height"
            value={(block.content.mobileHeight as number) || 20}
            onChange={(v) => updateContent('mobileHeight', v)}
            min={4}
            max={200}
            suffix="px"
          />
        )}
        <ButtonGroup
          label="Quick Presets"
          value={String(height)}
          onChange={(v) => updateContent('height', Number(v))}
          options={[
            { label: 'XS', value: '8' },
            { label: 'S', value: '16' },
            { label: 'M', value: '32' },
            { label: 'L', value: '64' },
            { label: 'XL', value: '128' },
          ]}
        />
      </Section>

      {/* Divider Section */}
      <Section title="Divider Line" icon={Minus} defaultOpen={false}>
        <SelectField
          label="Line Style"
          value={(block.content.dividerStyle as string) || 'none'}
          onChange={(v) => updateContent('dividerStyle', v)}
          options={[
            { value: 'none', label: 'No Divider' },
            { value: 'solid', label: 'Solid' },
            { value: 'dashed', label: 'Dashed' },
            { value: 'dotted', label: 'Dotted' },
            { value: 'gradient', label: 'Gradient' },
          ]}
        />
        {dividerEnabled && (
          <>
            <NumberField
              label="Line Thickness"
              value={(block.content.dividerThickness as number) || 1}
              onChange={(v) => updateContent('dividerThickness', v)}
              min={1}
              max={10}
              suffix="px"
            />
            <SelectField
              label="Line Width"
              value={(block.content.dividerWidth as string) || '100%'}
              onChange={(v) => updateContent('dividerWidth', v)}
              options={[
                { value: '100%', label: 'Full Width' },
                { value: '75%', label: '75% Width' },
                { value: '50%', label: '50% Width' },
                { value: '25%', label: '25% Width' },
              ]}
            />
            <SelectField
              label="Line Alignment"
              value={(block.content.dividerAlignment as string) || 'center'}
              onChange={(v) => updateContent('dividerAlignment', v)}
              options={[
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' },
              ]}
            />
            {(block.content.dividerStyle as string) !== 'gradient' && (
              <ColorField
                label="Line Color"
                value={(block.content.dividerColor as string) || '#e5e7eb'}
                onChange={(v) => updateContent('dividerColor', v)}
              />
            )}
          </>
        )}
      </Section>

      {/* Icon/Symbol Section */}
      <Section title="Icon/Symbol" icon={Sparkles} defaultOpen={false}>
        <TextField
          label="Icon Emoji"
          value={(block.content.icon as string) || ''}
          onChange={(v) => updateContent('icon', v)}
          placeholder="✨ ⭐ 💎"
        />
      </Section>

      {/* Background Section */}
      <Section title="Background" icon={Palette} defaultOpen={false}>
        <ToggleField
          label="Enable Background"
          checked={backgroundEnabled ?? false}
          onChange={(v) => updateContent('backgroundEnabled', v)}
        />
        {backgroundEnabled && (
          <>
            <ColorField
              label="Background Color"
              value={(block.content.backgroundColor as string) || '#f3f4f6'}
              onChange={(v) => updateContent('backgroundColor', v)}
            />
            <SelectField
              label="Background Pattern"
              value={(block.content.backgroundPattern as string) || 'none'}
              onChange={(v) => updateContent('backgroundPattern', v)}
              options={[
                { value: 'none', label: 'None' },
                { value: 'dots', label: 'Dots' },
                { value: 'lines', label: 'Lines' },
                { value: 'gradient', label: 'Gradient' },
              ]}
            />
          </>
        )}
      </Section>

      {/* Animation & Visibility Section */}
      <Section title="Animation & Visibility" icon={Zap} defaultOpen={false}>
        <SelectField
          label="Animation"
          value={(block.content.animation as string) || 'none'}
          onChange={(v) => updateContent('animation', v)}
          options={[
            { value: 'none', label: 'None' },
            { value: 'fadeIn', label: 'Fade In' },
            { value: 'slideUp', label: 'Slide Up' },
            { value: 'scale', label: 'Scale' },
          ]}
        />
        <ToggleField
          label="Hide on Mobile"
          checked={(block.content.hideOnMobile as boolean) ?? false}
          onChange={(v) => updateContent('hideOnMobile', v)}
        />
        <ToggleField
          label="Hide on Desktop"
          checked={(block.content.hideOnDesktop as boolean) ?? false}
          onChange={(v) => updateContent('hideOnDesktop', v)}
        />
      </Section>
    </>
  );
}

// Divider Block Editor
function DividerEditor({ block, updateContent }: { 
  block: Block; 
  updateContent: (key: string, value: unknown) => void;
}) {
  const style = (block.content.style as string) || 'solid';
  
  return (
    <>
      {/* Divider Style Section */}
      <Section title="Divider Style" icon={Minus} defaultOpen={true}>
        <SelectField
          label="Line Style"
          value={style}
          onChange={(v) => updateContent('style', v)}
          options={[
            { value: 'solid', label: 'Solid' },
            { value: 'dashed', label: 'Dashed' },
            { value: 'dotted', label: 'Dotted' },
            { value: 'gradient', label: 'Gradient' },
            { value: 'double', label: 'Double Line' },
          ]}
        />
        <NumberField
          label="Thickness"
          value={(block.content.thickness as number) || 2}
          onChange={(v) => updateContent('thickness', v)}
          min={1}
          max={10}
          suffix="px"
        />
        {style !== 'gradient' && (
          <ColorField
            label="Color"
            value={(block.content.color as string) || '#e5e7eb'}
            onChange={(v) => updateContent('color', v)}
          />
        )}
      </Section>

      {/* Layout Section */}
      <Section title="Layout" icon={Layout} defaultOpen={false}>
        <SelectField
          label="Width"
          value={(block.content.width as string) || '100%'}
          onChange={(v) => updateContent('width', v)}
          options={[
            { value: '100%', label: 'Full Width' },
            { value: '90%', label: '90% Width' },
            { value: '75%', label: '75% Width' },
            { value: '50%', label: '50% Width' },
            { value: '25%', label: '25% Width' },
          ]}
        />
        <SelectField
          label="Alignment"
          value={(block.content.alignment as string) || 'center'}
          onChange={(v) => updateContent('alignment', v)}
          options={[
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
          ]}
        />
      </Section>
    </>
  );
}

// Payment Block Editor
function PaymentEditor({ block, updateContent, updateStyle, pageTheme }: { 
  block: Block; 
  updateContent: (key: string, value: unknown) => void;
  updateStyle: (key: string, value: unknown) => void;
  pageTheme?: PageTheme;
}) {
  const paymentMode = (block.content.paymentMode as string) || 'tips';
  const variant = ((block as unknown as { style?: Record<string, unknown> }).style?.variant as string) || 'classic';
  
  // Get theme color for card highlighting
  const themeColor = pageTheme?.branding?.primaryColor || '#8b5cf6';
  
  const products = (block.content.products as Array<{
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    maxQuantity?: number;
    stripePriceId?: string;
  }>) || [];
  
  const addProduct = () => {
    const newProduct = {
      id: `product-${Date.now()}`,
      name: 'New Product',
      description: '',
      price: 10,
      image: '',
    };
    updateContent('products', [...products, newProduct]);
  };
  
  const updateProduct = (index: number, field: string, value: unknown) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value };
    updateContent('products', updated);
  };
  
  const removeProduct = (index: number) => {
    updateContent('products', products.filter((_, i) => i !== index));
  };
  
  const moveProduct = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= products.length) return;
    const updated = [...products];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    updateContent('products', updated);
  };

  return (
    <>
      {/* Visual Style Selector */}
      <Section title="Style" icon={Palette} defaultOpen={true}>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'classic', label: 'Classic', desc: 'Clean card layout', icon: LayoutGrid },
            { value: 'modern', label: 'Modern', desc: 'Floating glass', icon: Sparkles },
            { value: 'glass', label: 'Glass', desc: 'Full glassmorphism', icon: Droplet },
            { value: 'gradient', label: 'Gradient', desc: 'Bold gradient', icon: Zap },
            { value: 'minimal', label: 'Minimal', desc: 'Simple & clean', icon: Circle },
            { value: 'bold', label: 'Bold', desc: 'Eye-catching', icon: Flame },
          ].map((style) => {
            const IconComponent = style.icon;
            const isSelected = variant === style.value;
            return (
              <button
                key={style.value}
                onClick={() => updateStyle('variant', style.value)}
                className={cn(
                  'p-3 rounded-lg border-2 transition-all text-left hover:shadow-md',
                  isSelected
                    ? 'shadow-sm'
                    : 'border-border hover:border-primary/50'
                )}
                style={isSelected ? {
                  borderColor: themeColor,
                  backgroundColor: `${themeColor}15`,
                } : {}}
              >
                <IconComponent 
                  className="w-5 h-5 mb-2"
                  style={isSelected ? { color: themeColor } : {}}
                />
                <div className="font-semibold text-sm">{style.label}</div>
                <div className="text-[10px] text-muted-foreground">{style.desc}</div>
              </button>
            );
          })}
        </div>
      </Section>
      
      <Section title="Payment Type" icon={CreditCard} defaultOpen={true}>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'tips', label: 'Tips', desc: 'Support & tips', icon: Coffee },
            { value: 'donation', label: 'Donation', desc: 'Charitable giving', icon: Heart },
            { value: 'payment', label: 'Payment', desc: 'Single payment', icon: CreditCard },
            { value: 'products', label: 'Products', desc: 'Multi-item cart', icon: ShoppingCart },
          ].map((mode) => {
            const IconComponent = mode.icon;
            const isSelected = paymentMode === mode.value;
            return (
              <button
                key={mode.value}
                onClick={() => updateContent('paymentMode', mode.value)}
                className={cn(
                  'p-3 rounded-lg border-2 transition-all text-left hover:shadow-md',
                  isSelected
                    ? 'shadow-sm'
                    : 'border-border hover:border-primary/50'
                )}
                style={isSelected ? {
                  borderColor: themeColor,
                  backgroundColor: `${themeColor}15`,
                } : {}}
              >
                <IconComponent 
                  className="w-5 h-5 mb-2"
                  style={isSelected ? { color: themeColor } : {}}
                />
                <div className="font-semibold text-sm">{mode.label}</div>
                <div className="text-[10px] text-muted-foreground">{mode.desc}</div>
              </button>
            );
          })}
        </div>
      </Section>
      
      <Section title="Payment Info" icon={Type} defaultOpen={true}>
        <TextField
          label="Title"
          value={(block.content.title as string) || ''}
          onChange={(v) => updateContent('title', v)}
          placeholder={paymentMode === 'products' ? 'Our Products' : 'Support My Work'}
        />
        <TextField
          label="Description"
          value={(block.content.description as string) || ''}
          onChange={(v) => updateContent('description', v)}
          placeholder={paymentMode === 'products' ? 'Check out our latest items' : 'Your support helps me create more...'}
          multiline
        />
        <TextField
          label="Button Text"
          value={(block.content.buttonText as string) || ''}
          onChange={(v) => updateContent('buttonText', v)}
          placeholder={paymentMode === 'products' ? 'Checkout' : 'Support'}
        />
      </Section>
      
      {/* Products Section - only for products mode */}
      {paymentMode === 'products' && (
        <Section title="Products" icon={Package} defaultOpen={true}>
          <div className="space-y-3">
            {products.length === 0 ? (
              <div className="text-center py-6 bg-muted/30 rounded-lg border border-dashed">
                <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm text-muted-foreground mb-2">No products yet</p>
                <Button size="sm" onClick={addProduct}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Product
                </Button>
              </div>
            ) : (
              <>
                {products.map((product, index) => (
                  <div key={product.id} className="border rounded-lg p-3 bg-background">
                    <div className="flex items-start gap-2 mb-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={product.name}
                          onChange={(e) => updateProduct(index, 'name', e.target.value)}
                          className="w-full text-sm font-medium bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary rounded px-1 -ml-1"
                          placeholder="Product name"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveProduct(index, 'up')}
                          disabled={index === 0}
                          className="p-1 hover:bg-muted rounded disabled:opacity-30"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => moveProduct(index, 'down')}
                          disabled={index === products.length - 1}
                          className="p-1 hover:bg-muted rounded disabled:opacity-30"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeProduct(index)}
                          className="p-1 text-destructive hover:bg-destructive/10 rounded"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <ImageField
                        label="Image"
                        value={product.image || ''}
                        onChange={(v) => updateProduct(index, 'image', v)}
                      />
                      <textarea
                        value={product.description || ''}
                        onChange={(e) => updateProduct(index, 'description', e.target.value)}
                        className="w-full text-xs bg-muted/30 border rounded px-2 py-1.5 resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Product description (optional)"
                        rows={2}
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Price:</span>
                        <div className="flex items-center gap-1 bg-muted/30 rounded px-2 py-1">
                          <span className="text-xs">$</span>
                          <input
                            type="number"
                            value={product.price}
                            onChange={(e) => updateProduct(index, 'price', parseFloat(e.target.value) || 0)}
                            className="w-16 text-sm font-medium bg-transparent border-none focus:outline-none"
                            min={0}
                            step={0.01}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">Max Qty:</span>
                        <input
                          type="number"
                          value={product.maxQuantity || 99}
                          onChange={(e) => updateProduct(index, 'maxQuantity', parseInt(e.target.value) || 99)}
                          className="w-12 text-sm bg-muted/30 rounded px-2 py-1 border-none focus:outline-none focus:ring-1 focus:ring-primary"
                          min={1}
                          max={999}
                        />
                      </div>
                      
                      {/* Stripe IDs (Advanced) */}
                      <details className="mt-2">
                        <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                          Advanced: Stripe IDs (optional)
                        </summary>
                        <div className="mt-2 space-y-2 pl-2 border-l-2 border-muted">
                          <input
                            type="text"
                            value={product.stripePriceId || ''}
                            onChange={(e) => updateProduct(index, 'stripePriceId', e.target.value)}
                            className="w-full text-xs bg-muted/30 border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Stripe Price ID (price_xxx)"
                          />
                          <p className="text-[10px] text-muted-foreground">
                            If set, uses existing Stripe price instead of creating one
                          </p>
                        </div>
                      </details>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" size="sm" className="w-full" onClick={addProduct}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Product
                </Button>
              </>
            )}
          </div>
        </Section>
      )}
      
      {/* Amount settings - only for non-products mode */}
      {paymentMode !== 'products' && (
        <Section title="Amount" icon={Settings2} defaultOpen={true}>
          <SelectField
            label="Currency"
            value={(block.content.currency as string) || 'USD'}
            onChange={(v) => updateContent('currency', v)}
            options={[
              { label: '💵 USD', value: 'USD' },
              { label: '💶 EUR', value: 'EUR' },
              { label: '💷 GBP', value: 'GBP' },
            ]}
          />
          <ToggleField
            label="Allow Custom Amount"
            checked={(block.content.allowCustomAmount as boolean) ?? true}
            onChange={(v) => updateContent('allowCustomAmount', v)}
          />
        </Section>
      )}
      
      <Section title="Stripe Setup" icon={Link} defaultOpen={false}>
        <div className="space-y-4">
          {/* Quick Option: Payment Link */}
          <div className="p-3 bg-muted/30 rounded-lg border border-dashed">
            <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
              <span className="text-lg">🔗</span> Option 1: Payment Link (Easiest)
            </h5>
            <TextField
              label="Stripe Payment Link"
              value={(block.content.stripePaymentLink as string) || ''}
              onChange={(v) => updateContent('stripePaymentLink', v)}
              placeholder="https://buy.stripe.com/..."
              type="url"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Create at: Stripe Dashboard → Payment Links → New
            </p>
          </div>
          
          {/* Stripe Connect Option */}
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <h5 className="text-sm font-medium text-purple-900 mb-2 flex items-center gap-2">
              <span className="text-lg">⚡</span> Option 2: Stripe Connect (Recommended)
            </h5>
            <p className="text-xs text-purple-700 mb-2">
              Connect your Stripe account in Settings → Integrations to enable:
            </p>
            <ul className="text-xs text-purple-600 space-y-1 ml-4 list-disc">
              <li>Dynamic checkout without payment links</li>
              <li>Multi-product cart checkout</li>
              <li>Automatic webhook handling for orders</li>
            </ul>
            <a 
              href="/settings?tab=integrations" 
              className="inline-flex items-center gap-1 mt-2 text-xs text-purple-700 hover:text-purple-900 font-medium"
            >
              Go to Settings →
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}

// Product Block Editor
function ProductEditor({ block, updateContent, updateStyle, pageTheme }: { 
  block: Block; 
  updateContent: (key: string, value: unknown) => void;
  updateStyle: (key: string, value: unknown) => void;
  pageTheme?: PageTheme;
}) {
  const blockStyle = (block as { style?: Record<string, unknown> }).style || {};
  const currentVariant = (blockStyle.variant as string) || 'card';
  const themeColor = pageTheme?.branding?.primaryColor || '#8b5cf6';

  const variants = [
    { value: 'card', label: 'Card', icon: LayoutGrid },
    { value: 'modern', label: 'Modern', icon: SparklesIcon },
    { value: 'minimal', label: 'Minimal', icon: Circle },
    { value: 'bold', label: 'Bold', icon: Flame },
    { value: 'glass', label: 'Glass', icon: Droplet },
    { value: 'gradient', label: 'Gradient', icon: Zap },
  ];

  return (
    <>
      <Section title="Visual Style" icon={Palette} defaultOpen={true}>
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Product Card Style
          </label>
          <div className="grid grid-cols-2 gap-2">
            {variants.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => updateStyle('variant', value)}
                className={cn(
                  'flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all hover:scale-105',
                  currentVariant === value
                    ? 'shadow-md'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                )}
                style={{
                  borderColor: currentVariant === value ? themeColor : undefined,
                  backgroundColor: currentVariant === value ? `${themeColor}15` : undefined,
                }}
              >
                <Icon 
                  className="w-5 h-5" 
                  style={{ color: currentVariant === value ? themeColor : undefined }}
                />
                <span 
                  className="text-xs font-medium"
                  style={{ color: currentVariant === value ? themeColor : undefined }}
                >
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Product Info" icon={Type} defaultOpen={true}>
        <TextField
          label="Product Name"
          value={(block.content.name as string) || ''}
          onChange={(v) => updateContent('name', v)}
          placeholder="Amazing Product"
        />
        <TextField
          label="Description"
          value={(block.content.description as string) || ''}
          onChange={(v) => updateContent('description', v)}
          placeholder="Product description..."
          multiline
        />
        <ImageField
          label="Product Image"
          value={(block.content.imageUrl as string) || ''}
          onChange={(v) => updateContent('imageUrl', v)}
        />
        <TextField
          label="Badge Text"
          value={(block.content.badge as string) || ''}
          onChange={(v) => updateContent('badge', v)}
          placeholder="NEW, SALE, LIMITED, etc."
        />
      </Section>

      <Section title="Rating & Reviews" icon={Star} defaultOpen={false}>
        <div className="grid grid-cols-2 gap-2">
          <NumberField
            label="Rating"
            value={(block.content.rating as number) || 0}
            onChange={(v) => updateContent('rating', v)}
            min={0}
            max={5}
            step={0.1}
          />
          <NumberField
            label="Review Count"
            value={(block.content.reviewCount as number) || 0}
            onChange={(v) => updateContent('reviewCount', v)}
            min={0}
            step={1}
          />
        </div>
      </Section>

      <Section title="Features" icon={List} defaultOpen={false}>
        <div className="space-y-2">
          {((block.content.features as string[]) || []).map((feature, index) => (
            <div key={index} className="flex gap-2">
              <TextField
                label=""
                value={feature}
                onChange={(v) => {
                  const features = [...((block.content.features as string[]) || [])];
                  features[index] = v;
                  updateContent('features', features);
                }}
                placeholder={`Feature ${index + 1}`}
              />
              <button
                onClick={() => {
                  const features = ((block.content.features as string[]) || []).filter((_, i) => i !== index);
                  updateContent('features', features);
                }}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const features = [...((block.content.features as string[]) || []), ''];
              updateContent('features', features);
            }}
            className="w-full px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            + Add Feature
          </button>
        </div>
      </Section>

      <Section title="Inventory" icon={Package} defaultOpen={false}>
        <ToggleField
          label="Show Stock Quantity"
          checked={((block.content.inventory as { showQuantity?: boolean })?.showQuantity) || false}
          onChange={(v) => {
            const inventory = (block.content.inventory as Record<string, unknown>) || {};
            updateContent('inventory', { ...inventory, showQuantity: v });
          }}
        />
        {((block.content.inventory as { showQuantity?: boolean })?.showQuantity) && (
          <NumberField
            label="Available Quantity"
            value={((block.content.inventory as { quantity?: number })?.quantity) || 0}
            onChange={(v) => {
              const inventory = (block.content.inventory as Record<string, unknown>) || {};
              updateContent('inventory', { ...inventory, quantity: v });
            }}
            min={0}
            step={1}
          />
        )}
        <ToggleField
          label="Product Available"
          checked={((block.content.inventory as { available?: boolean })?.available) !== false}
          onChange={(v) => {
            const inventory = (block.content.inventory as Record<string, unknown>) || {};
            updateContent('inventory', { ...inventory, available: v });
          }}
        />
      </Section>
      
      <Section title="Pricing" icon={DollarSign} defaultOpen={true}>
        <div className="grid grid-cols-2 gap-2">
          <NumberField
            label="Price"
            value={(block.content.price as number) || 0}
            onChange={(v) => updateContent('price', v)}
            min={0}
            step={0.01}
          />
          <NumberField
            label="Original Price"
            value={(block.content.originalPrice as number) || 0}
            onChange={(v) => updateContent('originalPrice', v || undefined)}
            min={0}
            step={0.01}
          />
        </div>
        <SelectField
          label="Currency"
          value={(block.content.currency as string) || 'USD'}
          onChange={(v) => updateContent('currency', v)}
          options={[
            { label: '💵 USD', value: 'USD' },
            { label: '💶 EUR', value: 'EUR' },
            { label: '💷 GBP', value: 'GBP' },
            { label: '🇮🇳 INR', value: 'INR' },
          ]}
        />
      </Section>
      
      <Section title="Buy Button" icon={Link} defaultOpen={false}>
        <TextField
          label="Button Text"
          value={(block.content.buttonText as string) || ''}
          onChange={(v) => updateContent('buttonText', v)}
          placeholder="Buy Now"
        />
        <ToggleField
          label="Use Stripe Checkout"
          description="Process payments directly"
          checked={(block.content.useStripeCheckout as boolean) || false}
          onChange={(v) => updateContent('useStripeCheckout', v)}
        />
        {!(block.content.useStripeCheckout as boolean) && (
          <TextField
            label="External Product URL"
            value={(block.content.buttonUrl as string) || ''}
            onChange={(v) => updateContent('buttonUrl', v)}
            placeholder="https://your-store.com/product"
            type="url"
          />
        )}
      </Section>
    </>
  );
}

// Shop Block Editor - Multi-product store with cart
function ShopEditor({ block, updateContent, updateStyle, pageTheme }: { 
  block: Block; 
  updateContent: (key: string, value: unknown) => void;
  updateStyle: (key: string, value: unknown) => void;
  pageTheme?: PageTheme;
}) {
  const blockStyle = (block as { style?: Record<string, unknown> }).style || {};
  const currentCardStyle = (blockStyle.cardStyle as string) || 'elevated';
  const themeColor = pageTheme?.branding?.primaryColor || '#8b5cf6';

  const cardStyles = [
    { value: 'elevated', label: 'Elevated', icon: Layers },
    { value: 'flat', label: 'Flat', icon: Square },
    { value: 'bordered', label: 'Bordered', icon: LayoutGrid },
  ];

  const products = (block.content.products as Array<{
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    badge?: string;
    maxQuantity?: number;
    stripePriceId?: string;
  }>) || [];
  
  const addProduct = () => {
    const newProduct = {
      id: `product-${Date.now()}`,
      name: 'New Product',
      description: '',
      price: 10,
      image: '',
      badge: '',
      maxQuantity: 99,
    };
    updateContent('products', [...products, newProduct]);
  };
  
  const updateProduct = (index: number, field: string, value: unknown) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value };
    updateContent('products', updated);
  };
  
  const removeProduct = (index: number) => {
    updateContent('products', products.filter((_, i) => i !== index));
  };
  
  const moveProduct = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= products.length) return;
    const updated = [...products];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    updateContent('products', updated);
  };

  return (
    <>
      <Section title="Card Style" icon={Palette} defaultOpen={true}>
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Product Card Style
          </label>
          <div className="grid grid-cols-3 gap-2">
            {cardStyles.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => updateStyle('cardStyle', value)}
                className={cn(
                  'flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all hover:scale-105',
                  currentCardStyle === value
                    ? 'shadow-md'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                )}
                style={{
                  borderColor: currentCardStyle === value ? themeColor : undefined,
                  backgroundColor: currentCardStyle === value ? `${themeColor}15` : undefined,
                }}
              >
                <Icon 
                  className="w-5 h-5" 
                  style={{ color: currentCardStyle === value ? themeColor : undefined }}
                />
                <span 
                  className="text-xs font-medium"
                  style={{ color: currentCardStyle === value ? themeColor : undefined }}
                >
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Shop Settings" icon={Settings2} defaultOpen={true}>
        <TextField
          label="Shop Title"
          value={(block.content.title as string) || ''}
          onChange={(v) => updateContent('title', v)}
          placeholder="Our Products"
        />
        <TextField
          label="Description"
          value={(block.content.description as string) || ''}
          onChange={(v) => updateContent('description', v)}
          placeholder="Browse our collection"
          multiline
        />
        
        {/* Layout Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Layout
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'grid', label: 'Grid', icon: Grid3x3 },
              { value: 'list', label: 'List', icon: List },
              { value: 'compact', label: 'Compact', icon: Grid2x2 },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => updateContent('layout', value)}
                className={cn(
                  'flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all hover:scale-105',
                  (block.content.layout as string) === value || (!block.content.layout && value === 'grid')
                    ? 'shadow-md'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                )}
                style={{
                  borderColor: ((block.content.layout as string) === value || (!block.content.layout && value === 'grid')) ? themeColor : undefined,
                  backgroundColor: ((block.content.layout as string) === value || (!block.content.layout && value === 'grid')) ? `${themeColor}15` : undefined,
                }}
              >
                <Icon 
                  className="w-5 h-5" 
                  style={{ color: ((block.content.layout as string) === value || (!block.content.layout && value === 'grid')) ? themeColor : undefined }}
                />
                <span 
                  className="text-xs font-medium"
                  style={{ color: ((block.content.layout as string) === value || (!block.content.layout && value === 'grid')) ? themeColor : undefined }}
                >
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Currency Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Currency
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'USD', label: 'USD', icon: DollarSign, desc: 'US Dollar' },
              { value: 'EUR', label: 'EUR', icon: DollarSign, desc: 'Euro' },
              { value: 'GBP', label: 'GBP', icon: DollarSign, desc: 'British Pound' },
              { value: 'INR', label: 'INR', icon: DollarSign, desc: 'Indian Rupee' },
            ].map(({ value, label, icon: Icon, desc }) => (
              <button
                key={value}
                onClick={() => updateContent('currency', value)}
                className={cn(
                  'flex items-center gap-2 p-3 rounded-xl border-2 transition-all hover:scale-105',
                  (block.content.currency as string) === value || (!block.content.currency && value === 'USD')
                    ? 'shadow-md'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                )}
                style={{
                  borderColor: ((block.content.currency as string) === value || (!block.content.currency && value === 'USD')) ? themeColor : undefined,
                  backgroundColor: ((block.content.currency as string) === value || (!block.content.currency && value === 'USD')) ? `${themeColor}15` : undefined,
                }}
              >
                <Icon 
                  className="w-5 h-5" 
                  style={{ color: ((block.content.currency as string) === value || (!block.content.currency && value === 'USD')) ? themeColor : undefined }}
                />
                <div className="flex-1 text-left">
                  <div 
                    className="text-sm font-medium"
                    style={{ color: ((block.content.currency as string) === value || (!block.content.currency && value === 'USD')) ? themeColor : undefined }}
                  >
                    {label}
                  </div>
                  <div className="text-xs text-gray-500">{desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <ToggleField
          label="Show Cart Button"
          description="Floating cart button with item count"
          checked={(block.content.showCartButton as boolean) ?? true}
          onChange={(v) => updateContent('showCartButton', v)}
        />
      </Section>
      
      <Section title="Products" icon={Package} defaultOpen={true}>
        <div className="space-y-3">
          {products.length === 0 ? (
            <div className="text-center py-6 bg-muted/30 rounded-lg border border-dashed">
              <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm text-muted-foreground mb-2">No products yet</p>
              <Button size="sm" onClick={addProduct}>
                <Plus className="w-4 h-4 mr-1" />
                Add Product
              </Button>
            </div>
          ) : (
            <>
              {products.map((product, index) => (
                <div key={product.id} className="border rounded-lg p-3 bg-background">
                  <div className="flex items-start gap-2 mb-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={product.name}
                        onChange={(e) => updateProduct(index, 'name', e.target.value)}
                        className="w-full text-sm font-medium bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary rounded px-1 -ml-1"
                        placeholder="Product name"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveProduct(index, 'up')}
                        disabled={index === 0}
                        className="p-1 hover:bg-muted rounded disabled:opacity-30"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => moveProduct(index, 'down')}
                        disabled={index === products.length - 1}
                        className="p-1 hover:bg-muted rounded disabled:opacity-30"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeProduct(index)}
                        className="p-1 text-destructive hover:bg-destructive/10 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <ImageField
                      label="Image"
                      value={product.image || ''}
                      onChange={(v) => updateProduct(index, 'image', v)}
                    />
                    <textarea
                      value={product.description || ''}
                      onChange={(e) => updateProduct(index, 'description', e.target.value)}
                      className="w-full text-xs bg-muted/30 border rounded px-2 py-1.5 resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Product description (optional)"
                      rows={2}
                    />
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">Price:</span>
                      <div className="flex items-center gap-1 bg-muted/30 rounded px-2 py-1">
                        <span className="text-xs">$</span>
                        <input
                          type="number"
                          value={product.price}
                          onChange={(e) => updateProduct(index, 'price', parseFloat(e.target.value) || 0)}
                          className="w-16 text-sm font-medium bg-transparent border-none focus:outline-none"
                          min={0}
                          step={0.01}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">Max:</span>
                      <input
                        type="number"
                        value={product.maxQuantity || 99}
                        onChange={(e) => updateProduct(index, 'maxQuantity', parseInt(e.target.value) || 99)}
                        className="w-12 text-sm bg-muted/30 rounded px-2 py-1 border-none focus:outline-none focus:ring-1 focus:ring-primary"
                        min={1}
                        max={999}
                      />
                    </div>
                    <input
                      type="text"
                      value={product.badge || ''}
                      onChange={(e) => updateProduct(index, 'badge', e.target.value)}
                      className="w-full text-xs bg-muted/30 border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Badge (e.g., 'New', 'Sale', 'Popular')"
                    />
                    
                    {/* Stripe IDs (Advanced) */}
                    <details className="mt-2">
                      <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                        Advanced: Stripe Price ID (optional)
                      </summary>
                      <div className="mt-2 space-y-2 pl-2 border-l-2 border-muted">
                        <input
                          type="text"
                          value={product.stripePriceId || ''}
                          onChange={(e) => updateProduct(index, 'stripePriceId', e.target.value)}
                          className="w-full text-xs bg-muted/30 border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                          placeholder="Stripe Price ID (price_xxx)"
                        />
                        <p className="text-[10px] text-muted-foreground">
                          If set, uses existing Stripe price instead of creating one
                        </p>
                      </div>
                    </details>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" size="sm" className="w-full" onClick={addProduct}>
                <Plus className="w-4 h-4 mr-1" />
                Add Product
              </Button>
            </>
          )}
        </div>
      </Section>
      
      <Section title="Stripe Setup" icon={Link} defaultOpen={false}>
        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
          <h5 className="text-sm font-medium text-purple-900 mb-2 flex items-center gap-2">
            <span className="text-lg">⚡</span> Stripe Connect Required
          </h5>
          <p className="text-xs text-purple-700 mb-2">
            Connect your Stripe account in Settings → Integrations to enable:
          </p>
          <ul className="text-xs text-purple-600 space-y-1 ml-4 list-disc">
            <li>Multi-product cart checkout</li>
            <li>Direct payments to your account</li>
            <li>Automatic order tracking</li>
          </ul>
          <a 
            href="/settings?tab=integrations" 
            className="inline-flex items-center gap-1 mt-2 text-xs text-purple-700 hover:text-purple-900 font-medium"
          >
            Go to Settings →
          </a>
        </div>
      </Section>
    </>
  );
}

// Form Block Editor
function FormEditor({ block, updateContent }: { 
  block: Block; 
  updateContent: (key: string, value: unknown) => void;
}) {
  const fields = (block.content.fields as Array<{
    type: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    options?: string;
    rows?: number;
  }>) || [];

  const addField = () => {
    const newField = {
      type: 'text',
      label: 'New Field',
      placeholder: '',
      required: false,
    };
    updateContent('fields', [...fields, newField]);
  };

  const removeField = (index: number) => {
    updateContent('fields', fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, key: string, value: unknown) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], [key]: value };
    updateContent('fields', newFields);
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === fields.length - 1)
    ) {
      return;
    }
    const newFields = [...fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
    updateContent('fields', newFields);
  };

  return (
    <>
      {/* Content Section */}
      <Section title="Content" icon={Type} defaultOpen={true}>
        <TextField
          label="Form Title"
          value={(block.content.title as string) || ''}
          onChange={(v) => updateContent('title', v)}
          placeholder="Contact Us"
        />
        <TextField
          label="Submit Button Text"
          value={(block.content.submitLabel as string) || ''}
          onChange={(v) => updateContent('submitLabel', v)}
          placeholder="Submit"
        />
        <TextField
          label="Success Message"
          value={(block.content.successMessage as string) || ''}
          onChange={(v) => updateContent('successMessage', v)}
          placeholder="Thank you for your submission!"
          multiline
        />
      </Section>

      {/* Form Fields Section */}
      <Section title="Form Fields" icon={AlignJustify} defaultOpen={true}>
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={index}
              className="p-4 bg-gradient-to-br from-violet-50/50 to-purple-50/50 border border-violet-200/50 rounded-xl space-y-3 relative group"
            >
              {/* Field Controls */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-violet-700 uppercase tracking-wide">
                  Field {index + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveField(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 text-violet-600 hover:bg-violet-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveField(index, 'down')}
                    disabled={index === fields.length - 1}
                    className="p-1.5 text-violet-600 hover:bg-violet-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeField(index)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove field"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Field Type */}
              <SelectField
                label="Field Type"
                value={field.type || 'text'}
                onChange={(v) => updateField(index, 'type', v)}
                options={[
                  { value: 'text', label: 'Text' },
                  { value: 'email', label: 'Email' },
                  { value: 'tel', label: 'Phone' },
                  { value: 'number', label: 'Number' },
                  { value: 'url', label: 'URL' },
                  { value: 'date', label: 'Date' },
                  { value: 'textarea', label: 'Text Area' },
                  { value: 'select', label: 'Dropdown' },
                  { value: 'radio', label: 'Radio Buttons' },
                  { value: 'checkbox', label: 'Checkboxes' },
                ]}
              />

              {/* Field Label */}
              <TextField
                label="Label"
                value={field.label || ''}
                onChange={(v) => updateField(index, 'label', v)}
                placeholder="Field name"
              />

              {/* Field Placeholder */}
              {!['radio', 'checkbox'].includes(field.type) && (
                <TextField
                  label="Placeholder"
                  value={field.placeholder || ''}
                  onChange={(v) => updateField(index, 'placeholder', v)}
                  placeholder="Enter placeholder text..."
                />
              )}

              {/* Options for select/radio/checkbox */}
              {['select', 'radio', 'checkbox'].includes(field.type) && (
                <TextField
                  label="Options (one per line)"
                  value={field.options || ''}
                  onChange={(v) => updateField(index, 'options', v)}
                  placeholder="Option 1&#10;Option 2&#10;Option 3"
                  multiline
                />
              )}

              {/* Rows for textarea */}
              {field.type === 'textarea' && (
                <NumberField
                  label="Rows"
                  value={field.rows || 3}
                  onChange={(v) => updateField(index, 'rows', v)}
                  min={1}
                  max={10}
                />
              )}

              {/* Required Toggle */}
              <ToggleField
                label="Required Field"
                checked={field.required ?? false}
                onChange={(v) => updateField(index, 'required', v)}
              />
            </div>
          ))}

          {/* Add Field Button */}
          <button
            onClick={addField}
            className="w-full py-3 border-2 border-dashed border-violet-300 rounded-xl text-sm font-semibold text-violet-600 hover:border-violet-500 hover:bg-violet-50/50 transition-all flex items-center justify-center gap-2 group"
          >
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Add Field
          </button>
        </div>
      </Section>

      {/* Form Styling Section */}
      <Section title="Form Styling" icon={Palette} defaultOpen={false}>
        <ColorField
          label="Background Color"
          value={(block.content.formBgColor as string) || (block.content.backgroundColor as string) || '#ffffff'}
          onChange={(v) => updateContent('formBgColor', v)}
        />
        <NumberField
          label="Border Radius"
          value={(block.content.formBorderRadius as number) || 12}
          onChange={(v) => updateContent('formBorderRadius', v)}
          min={0}
          max={50}
          suffix="px"
        />
        <SelectField
          label="Border Style"
          value={(block.content.formBorderStyle as string) || 'solid'}
          onChange={(v) => updateContent('formBorderStyle', v)}
          options={[
            { value: 'none', label: 'No Border' },
            { value: 'solid', label: 'Solid' },
            { value: 'dashed', label: 'Dashed' },
            { value: 'dotted', label: 'Dotted' },
          ]}
        />
        {(block.content.formBorderStyle as string) !== 'none' && (
          <ColorField
            label="Border Color"
            value={(block.content.formBorderColor as string) || '#e5e7eb'}
            onChange={(v) => updateContent('formBorderColor', v)}
          />
        )}
      </Section>

      {/* Input Styling Section */}
      <Section title="Input Styling" icon={Settings2} defaultOpen={false}>
        <SelectField
          label="Input Style"
          value={(block.content.inputStyle as string) || 'rounded'}
          onChange={(v) => updateContent('inputStyle', v)}
          options={[
            { value: 'rounded', label: 'Rounded' },
            { value: 'pill', label: 'Pill (Fully Rounded)' },
            { value: 'square', label: 'Square' },
          ]}
        />
        <ColorField
          label="Accent Color"
          value={(block.content.accentColor as string) || '#8b5cf6'}
          onChange={(v) => updateContent('accentColor', v)}
        />
        <NumberField
          label="Field Spacing"
          value={(block.content.fieldSpacing as number) || 20}
          onChange={(v) => updateContent('fieldSpacing', v)}
          min={8}
          max={48}
          suffix="px"
        />
      </Section>
    </>
  );
}

// Social Links Block Editor
function SocialEditor({ block, updateContent, updateStyle }: { 
  block: Block; 
  updateContent: (key: string, value: unknown) => void;
  updateStyle: (key: string, value: unknown) => void;
}) {
  const blockStyle = block.style || {};
  const links = (block.content.socialLinks as Array<{ platform: string; url: string }>) || [];
  
  // Platform icons mapping
  const getPlatformIcon = (platform: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      instagram: <Instagram className="w-4 h-4" />,
      tiktok: <Music className="w-4 h-4" />,
      youtube: <Youtube className="w-4 h-4" />,
      x: <Share2 className="w-4 h-4" />,
      threads: <Share2 className="w-4 h-4" />,
      facebook: <Facebook className="w-4 h-4" />,
      linkedin: <Linkedin className="w-4 h-4" />,
      whatsapp: <MessageSquareQuote className="w-4 h-4" />,
      telegram: <Send className="w-4 h-4" />,
      discord: <MessageSquareQuote className="w-4 h-4" />,
      twitch: <Video className="w-4 h-4" />,
      snapchat: <User className="w-4 h-4" />,
      pinterest: <Grid3x3 className="w-4 h-4" />,
      spotify: <Music className="w-4 h-4" />,
      github: <Github className="w-4 h-4" />,
      phone: <Smartphone className="w-4 h-4" />,
      email: <Mail className="w-4 h-4" />,
      website: <Globe className="w-4 h-4" />,
    };
    return iconMap[platform] || <Share2 className="w-4 h-4" />;
  };
  
  const platforms = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'x', label: 'X (Twitter)' },
    { value: 'threads', label: 'Threads' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'telegram', label: 'Telegram' },
    { value: 'discord', label: 'Discord' },
    { value: 'twitch', label: 'Twitch' },
    { value: 'snapchat', label: 'Snapchat' },
    { value: 'pinterest', label: 'Pinterest' },
    { value: 'spotify', label: 'Spotify' },
    { value: 'github', label: 'GitHub' },
    { value: 'phone', label: 'Phone' },
    { value: 'email', label: 'Email' },
    { value: 'website', label: 'Website' },
  ];
  
  const addLink = () => {
    updateContent('socialLinks', [...links, { platform: 'instagram', url: '' }]);
  };
  
  const removeLink = (index: number) => {
    updateContent('socialLinks', links.filter((_, i) => i !== index));
  };
  
  const updateLink = (index: number, field: string, value: string) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    updateContent('socialLinks', newLinks);
  };

  const moveLink = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === links.length - 1)
    ) {
      return;
    }
    const newLinks = [...links];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newLinks[index], newLinks[targetIndex]] = [newLinks[targetIndex], newLinks[index]];
    updateContent('socialLinks', newLinks);
  };
  
  return (
    <>
      {/* Social Links Section */}
      <Section title="Social Links" icon={Share2} defaultOpen={true}>
        <div className="space-y-3">
          {links.map((link, index) => (
            <div
              key={index}
              className="p-4 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border border-blue-200/50 rounded-xl space-y-3 relative group"
            >
              {/* Link Controls */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                  Link {index + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveLink(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveLink(index, 'down')}
                    disabled={index === links.length - 1}
                    className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeLink(index)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove link"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Platform Selector with Icon */}
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide">
                  Platform
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none">
                    {getPlatformIcon(link.platform)}
                  </div>
                  <select
                    value={link.platform}
                    onChange={(e) => updateLink(index, 'platform', e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 text-sm text-stone-800 bg-white border border-stone-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all appearance-none cursor-pointer"
                  >
                    {platforms.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                </div>
              </div>
              <TextField
                label="URL / Username"
                value={link.url}
                onChange={(v) => updateLink(index, 'url', v)}
                placeholder="@username or URL"
                type="text"
              />
            </div>
          ))}
          
          {/* Add Link Button */}
          <button
            onClick={addLink}
            className="w-full py-3 border-2 border-dashed border-blue-300 rounded-xl text-sm font-semibold text-blue-600 hover:border-blue-500 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 group"
          >
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Add Social Link
          </button>
        </div>
      </Section>

      {/* Icon Style Section */}
      <Section title="Icon Style" icon={Palette} defaultOpen={false}>
        <SelectField
          label="Style Variant"
          value={(blockStyle.style as string) || 'filled'}
          onChange={(v) => updateStyle('style', v)}
          options={[
            { value: 'filled', label: 'Filled (Brand Colors)' },
            { value: 'outline', label: 'Outline' },
            { value: 'minimal', label: 'Minimal (Icons Only)' },
          ]}
        />
        <NumberField
          label="Icon Size"
          value={(blockStyle.iconSize as number) || 40}
          onChange={(v) => updateStyle('iconSize', v)}
          min={24}
          max={80}
          suffix="px"
        />
        <ToggleField
          label="Use Brand Colors"
          checked={(blockStyle.useBrandColors as boolean) ?? true}
          onChange={(v) => updateStyle('useBrandColors', v)}
        />
        <ToggleField
          label="Show Labels"
          checked={(blockStyle.showLabels as boolean) ?? false}
          onChange={(v) => updateStyle('showLabels', v)}
        />
      </Section>

      {/* Layout Section */}
      <Section title="Layout" icon={Layout} defaultOpen={false}>
        <SelectField
          label="Layout"
          value={(blockStyle.layout as string) || 'row'}
          onChange={(v) => updateStyle('layout', v)}
          options={[
            { value: 'row', label: 'Row (Horizontal)' },
            { value: 'grid', label: 'Grid' },
          ]}
        />
        <SelectField
          label="Spacing"
          value={(blockStyle.spacing as string) || 'normal'}
          onChange={(v) => updateStyle('spacing', v)}
          options={[
            { value: 'compact', label: 'Compact' },
            { value: 'normal', label: 'Normal' },
            { value: 'relaxed', label: 'Relaxed' },
          ]}
        />
      </Section>

      {/* Advanced Section */}
      <Section title="Advanced" icon={Settings2} defaultOpen={false}>
        <ToggleField
          label="Use Deep Linking"
          checked={(blockStyle.useDeepLinking as boolean) ?? true}
          onChange={(v) => updateStyle('useDeepLinking', v)}
        />
        <div className="text-xs text-muted-foreground mt-2 p-3 bg-muted/30 rounded-lg">
          <p className="font-medium mb-1">💡 Deep Linking:</p>
          <p>When enabled, taps on mobile will open the native app instead of the website.</p>
        </div>
      </Section>
    </>
  );
}

// Countdown Block Editor
function CountdownEditor({ block, updateContent }: { 
  block: Block; 
  updateContent: (key: string, value: unknown) => void;
}) {
  const targetDate = block.content.targetDate as string;
  const hasTargetDate = targetDate && targetDate.trim() !== '';
  
  return (
    <>
      {/* Target Date Section */}
      <Section title="Target Date & Time" icon={Clock} defaultOpen={true}>
        <div>
          <label className="block text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide">
            Event Date & Time
          </label>
          <input
            type="datetime-local"
            value={targetDate?.slice(0, 16) || ''}
            onChange={(e) => updateContent('targetDate', new Date(e.target.value).toISOString())}
            className="w-full px-3 py-2.5 text-sm text-stone-800 bg-white border border-stone-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all"
          />
        </div>
        {hasTargetDate && (
          <div className="text-xs text-muted-foreground p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="font-medium text-green-800 mb-1">✓ Countdown Active</p>
            <p className="text-green-700">
              Target: {new Date(targetDate).toLocaleString()}
            </p>
          </div>
        )}
        {!hasTargetDate && (
          <div className="text-xs text-muted-foreground p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="font-medium text-yellow-800 mb-1">⚠️ Set Target Date</p>
            <p className="text-yellow-700">
              Select a date and time above to activate the countdown
            </p>
          </div>
        )}
      </Section>

      {/* Content Section */}
      <Section title="Content" icon={Type} defaultOpen={true}>
        <TextField
          label="Title"
          value={(block.content.title as string) || ''}
          onChange={(v) => updateContent('title', v)}
          placeholder="Event Starts In"
        />
        <TextField
          label="Subtitle"
          value={(block.content.subtitle as string) || ''}
          onChange={(v) => updateContent('subtitle', v)}
          placeholder="Don't miss out!"
        />
        <TextField
          label="Expired Message"
          value={(block.content.expiredMessage as string) || ''}
          onChange={(v) => updateContent('expiredMessage', v)}
          placeholder="🎉 The wait is over!"
        />
      </Section>

      {/* Display Style Section */}
      <Section title="Display Style" icon={Palette} defaultOpen={false}>
        <SelectField
          label="Countdown Style"
          value={(block.content.style as string) || 'elegant'}
          onChange={(v) => updateContent('style', v)}
          options={[
            { value: 'elegant', label: '✨ Elegant' },
            { value: 'minimal', label: '⚪ Minimal' },
            { value: 'glass', label: '🔮 Glassmorphism' },
            { value: 'gradient', label: '🌈 Gradient Cards' },
            { value: 'circular', label: '⭕ Circular Progress' },
            { value: 'neon', label: '💡 Neon Glow' },
            { value: 'flip', label: '🔄 Flip Cards' },
          ]}
        />
        <ToggleField
          label="Compact Mode"
          checked={(block.content.compactMode as boolean) ?? false}
          onChange={(v) => updateContent('compactMode', v)}
        />
        <div className="text-xs text-muted-foreground mt-2 p-3 bg-muted/30 rounded-lg">
          <p className="font-medium mb-1">💡 Compact Mode:</p>
          <p>Optimized layout for mobile devices with smaller numbers and tighter spacing.</p>
        </div>
      </Section>

      {/* Time Units Section */}
      <Section title="Time Units" icon={Timer} defaultOpen={false}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <ToggleField
              label="Days"
              checked={(block.content.showDays as boolean) ?? true}
              onChange={(v) => updateContent('showDays', v)}
            />
            <ToggleField
              label="Hours"
              checked={(block.content.showHours as boolean) ?? true}
              onChange={(v) => updateContent('showHours', v)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ToggleField
              label="Minutes"
              checked={(block.content.showMinutes as boolean) ?? true}
              onChange={(v) => updateContent('showMinutes', v)}
            />
            <ToggleField
              label="Seconds"
              checked={(block.content.showSeconds as boolean) ?? true}
              onChange={(v) => updateContent('showSeconds', v)}
            />
          </div>
        </div>
        <ToggleField
          label="Show Unit Labels"
          checked={(block.content.showLabels as boolean) ?? true}
          onChange={(v) => updateContent('showLabels', v)}
        />
        <div className="text-xs text-muted-foreground mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="font-medium text-blue-800 mb-1">ℹ️ Time Units:</p>
          <p className="text-blue-700">
            At least one unit should be enabled. Labels like "Days", "Hours", etc. can be toggled separately.
          </p>
        </div>
      </Section>
    </>
  );
}

// Testimonial Block Editor
function TestimonialEditor({ block, updateContent }: { 
  block: Block; 
  updateContent: (key: string, value: unknown) => void;
}) {
  const items = (block.content.items as Array<{ quote: string; author: string; role?: string; company?: string; avatar?: string; rating?: number }>) || [];

  const addItem = () => {
    updateContent('items', [...items, { 
      quote: 'Add your testimonial quote here...', 
      author: 'Customer Name', 
      role: 'Role',
      company: 'Company',
      rating: 5 
    }]);
  };

  const removeItem = (index: number) => {
    updateContent('items', items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    updateContent('items', newItems);
  };

  const layoutOptions = [
    { value: 'single', label: 'Single (Carousel)' },
    { value: 'grid', label: 'Grid' },
    { value: 'carousel', label: 'Auto Carousel' },
    { value: 'masonry', label: 'Masonry' },
    { value: 'stack', label: 'Stacked' },
  ];

  const styleOptions = [
    { value: 'elegant', label: 'Elegant' },
    { value: 'cards', label: 'Cards' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'quote', label: 'Quote Style' },
    { value: 'glass', label: 'Glass' },
    { value: 'gradient', label: 'Gradient' },
  ];

  return (
    <>
      <Section title="Display Options" icon={Palette} defaultOpen={true}>
        <SelectField
          label="Layout"
          value={(block.content.layout as string) || 'single'}
          options={layoutOptions}
          onChange={(v) => updateContent('layout', v)}
        />
        <SelectField
          label="Style"
          value={(block.content.style as string) || 'elegant'}
          options={styleOptions}
          onChange={(v) => updateContent('style', v)}
        />
        {((block.content.layout as string) === 'grid' || (block.content.layout as string) === 'masonry') && (
          <SelectField
            label="Columns"
            value={String(block.content.columns || 2)}
            options={[
              { value: '1', label: '1 Column' },
              { value: '2', label: '2 Columns' },
              { value: '3', label: '3 Columns' },
            ]}
            onChange={(v) => updateContent('columns', parseInt(v))}
          />
        )}
        <ToggleField
          label="Show Rating"
          checked={(block.content.showRating as boolean) ?? true}
          onChange={(v) => updateContent('showRating', v)}
        />
        <ToggleField
          label="Show Avatar"
          checked={(block.content.showAvatar as boolean) ?? true}
          onChange={(v) => updateContent('showAvatar', v)}
        />
        <ToggleField
          label="Show Company"
          checked={(block.content.showCompany as boolean) ?? true}
          onChange={(v) => updateContent('showCompany', v)}
        />
      </Section>
      
      <Section title="Testimonials" icon={Type} defaultOpen={true}>
        <div className="space-y-3">
          {items.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-2">
              No testimonials yet. Add one below.
            </p>
          )}
          {items.map((item, index) => (
            <div key={index} className="p-3 bg-muted/50 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Testimonial {index + 1}</span>
                <button
                  onClick={() => removeItem(index)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <TextField
                label="Quote"
                value={item.quote || ''}
                onChange={(v) => updateItem(index, 'quote', v)}
                placeholder="This product changed my life..."
                multiline
              />
              <TextField
                label="Author Name"
                value={item.author || ''}
                onChange={(v) => updateItem(index, 'author', v)}
                placeholder="John Doe"
              />
              <div className="grid grid-cols-2 gap-2">
                <TextField
                  label="Role"
                  value={item.role || ''}
                  onChange={(v) => updateItem(index, 'role', v)}
                  placeholder="CEO"
                />
                <TextField
                  label="Company"
                  value={item.company || ''}
                  onChange={(v) => updateItem(index, 'company', v)}
                  placeholder="TechCorp"
                />
              </div>
              <ImageField
                label="Avatar"
                value={item.avatar || ''}
                onChange={(v) => updateItem(index, 'avatar', v)}
              />
              <SelectField
                label="Rating"
                value={String(item.rating || 5)}
                onChange={(v) => updateItem(index, 'rating', parseInt(v))}
                options={[
                  { label: '⭐⭐⭐⭐⭐ 5 stars', value: '5' },
                  { label: '⭐⭐⭐⭐ 4 stars', value: '4' },
                  { label: '⭐⭐⭐ 3 stars', value: '3' },
                  { label: '⭐⭐ 2 stars', value: '2' },
                  { label: '⭐ 1 star', value: '1' },
                ]}
              />
            </div>
          ))}
          <button
            onClick={addItem}
            className="w-full py-2 px-3 border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:bg-muted/50 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Testimonial
          </button>
        </div>
      </Section>
    </>
  );
}

// Hero Block Editor
function HeroEditor({ block, updateContent }: { 
  block: Block; 
  updateContent: (key: string, value: unknown) => void;
}) {
  return (
    <>
      <Section title="Content" icon={Type} defaultOpen={true}>
        <TextField
          label="Headline"
          value={(block.content.headline as string) || ''}
          onChange={(v) => updateContent('headline', v)}
          placeholder="Welcome to Our Platform"
        />
        <SelectField
          label="Headline Size"
          value={(block.content.headlineSize as string) || 'medium'}
          onChange={(v) => updateContent('headlineSize', v)}
          options={[
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' },
            { value: 'xlarge', label: 'Extra Large' },
          ]}
        />
        <SelectField
          label="Font Weight"
          value={(block.content.fontWeight as string) || 'bold'}
          onChange={(v) => updateContent('fontWeight', v)}
          options={[
            { value: 'normal', label: 'Normal' },
            { value: 'medium', label: 'Medium' },
            { value: 'semibold', label: 'Semi Bold' },
            { value: 'bold', label: 'Bold' },
            { value: 'extrabold', label: 'Extra Bold' },
          ]}
        />
        <TextField
          label="Subheadline"
          value={(block.content.subheadline as string) || ''}
          onChange={(v) => updateContent('subheadline', v)}
          placeholder="Create stunning experiences that captivate your audience"
          multiline
        />
      </Section>

      <Section title="Badge" icon={Award} defaultOpen={false}>
        <ToggleField
          label="Show Badge"
          checked={(block.content.showBadge as boolean) ?? false}
          onChange={(v) => updateContent('showBadge', v)}
        />
        {(block.content.showBadge as boolean) && (
          <TextField
            label="Badge Text"
            value={(block.content.badgeText as string) || ''}
            onChange={(v) => updateContent('badgeText', v)}
            placeholder="✨ New Feature"
          />
        )}
      </Section>
      
      <Section title="Buttons" icon={MousePointerClick} defaultOpen={false}>
        <TextField
          label="Primary Button Text"
          value={(block.content.buttonText as string) || ''}
          onChange={(v) => updateContent('buttonText', v)}
          placeholder="Get Started"
        />
        <TextField
          label="Primary Button URL"
          value={(block.content.buttonUrl as string) || ''}
          onChange={(v) => updateContent('buttonUrl', v)}
          placeholder="https://..."
          type="url"
        />
        <TextField
          label="Secondary Button Text"
          value={(block.content.secondaryButtonText as string) || ''}
          onChange={(v) => updateContent('secondaryButtonText', v)}
          placeholder="Watch Demo"
        />
        <TextField
          label="Secondary Button URL"
          value={(block.content.secondaryButtonUrl as string) || ''}
          onChange={(v) => updateContent('secondaryButtonUrl', v)}
          placeholder="https://..."
          type="url"
        />
      </Section>
      
      <Section title="Background" icon={ImageIcon} defaultOpen={false}>
        <ImageField
          label="Background Image"
          value={(block.content.backgroundImage as string) || ''}
          onChange={(v) => updateContent('backgroundImage', v)}
        />
        <TextField
          label="Background Video URL"
          value={(block.content.backgroundVideo as string) || ''}
          onChange={(v) => updateContent('backgroundVideo', v)}
          placeholder="https://example.com/video.mp4"
          type="url"
        />
        <ToggleField
          label="Dark Overlay"
          checked={(block.content.overlay as boolean) ?? true}
          onChange={(v) => updateContent('overlay', v)}
        />
        {(block.content.overlay as boolean) && (
          <>
            <NumberField
              label="Overlay Opacity"
              value={(block.content.overlayOpacity as number) ?? 0.4}
              onChange={(v) => updateContent('overlayOpacity', v)}
              min={0}
              max={1}
              step={0.1}
            />
            <ColorField
              label="Overlay Color"
              value={(block.content.overlayColor as string) || '#000000'}
              onChange={(v: string) => updateContent('overlayColor', v)}
            />
          </>
        )}
        <SelectField
          label="Pattern Overlay"
          value={(block.content.pattern as string) || 'none'}
          onChange={(v) => updateContent('pattern', v)}
          options={[
            { value: 'none', label: 'None' },
            { value: 'dots', label: 'Dots' },
            { value: 'grid', label: 'Grid' },
            { value: 'gradient', label: 'Gradient' },
            { value: 'particles', label: 'Particles' },
            { value: 'waves', label: 'Waves' },
          ]}
        />
      </Section>

      <Section title="Layout" icon={LayoutPanelTop} defaultOpen={false}>
        <SelectField
          label="Text Alignment"
          value={(block.content.alignment as string) || 'center'}
          onChange={(v) => updateContent('alignment', v)}
          options={[
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
          ]}
        />
        <SelectField
          label="Section Height"
          value={(block.content.height as string) || 'medium'}
          onChange={(v) => updateContent('height', v)}
          options={[
            { value: 'small', label: 'Small (320px)' },
            { value: 'medium', label: 'Medium (420px)' },
            { value: 'large', label: 'Large (520px)' },
            { value: 'full', label: 'Full Screen (640px)' },
          ]}
        />
        <ToggleField
          label="Show Scroll Indicator"
          checked={(block.content.showScrollIndicator as boolean) ?? false}
          onChange={(v) => updateContent('showScrollIndicator', v)}
        />
      </Section>
    </>
  );
}

// FAQ Block Editor
function FAQEditor({ block, updateContent }: { 
  block: Block; 
  updateContent: (key: string, value: unknown) => void;
}) {
  const items = (block.content.items as Array<{ question: string; answer: string }>) || [];
  
  const addItem = () => {
    updateContent('items', [...items, { question: '', answer: '' }]);
  };
  
  const removeItem = (index: number) => {
    updateContent('items', items.filter((_, i) => i !== index));
  };
  
  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    updateContent('items', newItems);
  };
  
  return (
    <Section title="FAQ Items" icon={Type} defaultOpen={true}>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="p-3 bg-muted/50 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Item {index + 1}</span>
              <button
                onClick={() => removeItem(index)}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <TextField
              label="Question"
              value={item.question}
              onChange={(v) => updateItem(index, 'question', v)}
              placeholder="What is your question?"
            />
            <TextField
              label="Answer"
              value={item.answer}
              onChange={(v) => updateItem(index, 'answer', v)}
              placeholder="Your answer here..."
              multiline
            />
          </div>
        ))}
        
        <button
          onClick={addItem}
          className="w-full py-2 border-2 border-dashed border-border rounded-lg text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add FAQ Item
        </button>
      </div>
    </Section>
  );
}

// Gallery Block Editor
function GalleryEditor({ block, updateContent }: { 
  block: Block; 
  updateContent: (key: string, value: unknown) => void;
}) {
  const images = (block.content.images as Array<{ url: string; alt?: string; caption?: string }>) || [];
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  const removeImage = (index: number) => {
    updateContent('images', images.filter((_, i) => i !== index));
  };
  
  const updateImage = (index: number, field: string, value: string) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], [field]: value };
    updateContent('images', newImages);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newImages = [...images];
    const draggedItem = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedItem);
    updateContent('images', newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };
  
  return (
    <>
      <Section title="Images" icon={ImageIcon} defaultOpen={true}>
        {/* Quick add multiple images */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-muted-foreground mb-2">
            Add Images
          </label>
          <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group">
            <input 
              type="file" 
              accept="image/*" 
              multiple
              onChange={async (e) => {
                const files = e.target.files;
                if (!files) return;
                
                const newImages = [...images];
                for (let i = 0; i < files.length; i++) {
                  const file = files[i];
                  // Convert to base64 or upload
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    newImages.push({ url: reader.result as string, alt: file.name.split('.')[0], caption: '' });
                    if (i === files.length - 1) {
                      updateContent('images', newImages);
                    }
                  };
                  reader.readAsDataURL(file);
                }
                e.target.value = '';
              }}
              className="hidden" 
            />
            <div className="flex items-center gap-3 text-muted-foreground group-hover:text-primary transition-colors">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10">
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-sm font-medium block">Upload images</span>
                <span className="text-xs opacity-70">Drag & drop or click to browse</span>
              </div>
            </div>
          </label>
        </div>

        {/* Image list with drag to reorder */}
        <div className="space-y-2">
          {images.length > 0 && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">{images.length} image{images.length !== 1 ? 's' : ''}</span>
              <span className="text-xs text-muted-foreground">Drag to reorder</span>
            </div>
          )}
          
          {images.map((img, index) => (
            <div 
              key={index} 
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={cn(
                "flex items-start gap-3 p-3 bg-muted/50 rounded-xl border border-transparent transition-all cursor-move hover:border-border",
                draggedIndex === index && "opacity-50 border-primary"
              )}
            >
              {/* Thumbnail preview */}
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0 group">
                {img.url ? (
                  <>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label className="cursor-pointer">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              updateImage(index, 'url', reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }}
                          className="hidden" 
                        />
                        <Upload className="w-4 h-4 text-stone-800" />
                      </label>
                    </div>
                  </>
                ) : (
                  <label className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-muted/80">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          updateImage(index, 'url', reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }}
                      className="hidden" 
                    />
                    <ImageIcon className="w-5 h-5 text-muted-foreground" />
                  </label>
                )}
              </div>
              
              {/* Details */}
              <div className="flex-1 min-w-0 space-y-2">
                <input
                  type="text"
                  value={img.alt || ''}
                  onChange={(e) => updateImage(index, 'alt', e.target.value)}
                  placeholder="Image title"
                  className="w-full px-2 py-1.5 text-sm border border-border rounded-lg bg-background focus:border-primary transition-all"
                />
                <input
                  type="text"
                  value={img.caption || ''}
                  onChange={(e) => updateImage(index, 'caption', e.target.value)}
                  placeholder="Caption (optional)"
                  className="w-full px-2 py-1.5 text-xs border border-border rounded-lg bg-background focus:border-primary transition-all text-muted-foreground"
                />
              </div>
              
              {/* Delete */}
              <button
                onClick={() => removeImage(index)}
                className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          {images.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No images yet</p>
              <p className="text-xs">Upload images above to get started</p>
            </div>
          )}
        </div>
      </Section>
      
      <Section title="Layout" icon={Layout} defaultOpen={false}>
        <SelectField
          label="Display Style"
          value={(block.content.layout as string) || 'grid'}
          onChange={(v) => updateContent('layout', v)}
          options={[
            { label: 'Grid', value: 'grid' },
            { label: 'Carousel', value: 'carousel' },
            { label: 'Masonry', value: 'masonry' },
            { label: 'Stack', value: 'stack' },
          ]}
        />
        <NumberField
          label="Columns (Desktop)"
          value={(block.content.columns as number) || 3}
          onChange={(v) => updateContent('columns', v)}
          min={1}
          max={6}
        />
        <NumberField
          label="Columns (Tablet)"
          value={(block.content.tabletColumns as number) || 2}
          onChange={(v) => updateContent('tabletColumns', v)}
          min={1}
          max={4}
        />
        <NumberField
          label="Columns (Mobile)"
          value={(block.content.mobileColumns as number) || 1}
          onChange={(v) => updateContent('mobileColumns', v)}
          min={1}
          max={2}
        />
        <SelectField
          label="Aspect Ratio"
          value={(block.content.aspectRatio as string) || 'square'}
          onChange={(v) => updateContent('aspectRatio', v)}
          options={[
            { label: 'Square (1:1)', value: 'square' },
            { label: 'Landscape (16:9)', value: 'landscape' },
            { label: 'Portrait (3:4)', value: 'portrait' },
            { label: 'Auto (Original)', value: 'auto' },
          ]}
        />
        <SelectField
          label="Gap"
          value={(block.content.gap as string) || 'normal'}
          onChange={(v) => updateContent('gap', v)}
          options={[
            { label: 'Tight', value: 'tight' },
            { label: 'Normal', value: 'normal' },
            { label: 'Loose', value: 'loose' },
          ]}
        />
      </Section>

      {/* Visual Style Section */}
      <Section title="Visual Style" icon={Palette} defaultOpen={false}>
        <NumberField
          label="Border Radius"
          value={(block.content.borderRadius as number) || 8}
          onChange={(v) => updateContent('borderRadius', v)}
          min={0}
          max={50}
          suffix="px"
        />
        <SelectField
          label="Hover Effect"
          value={(block.content.hoverEffect as string) || 'zoom'}
          onChange={(v) => updateContent('hoverEffect', v)}
          options={[
            { label: 'Zoom In', value: 'zoom' },
            { label: 'Lift Up', value: 'lift' },
            { label: 'Brightness', value: 'brightness' },
            { label: 'None', value: 'none' },
          ]}
        />
        <SelectField
          label="Image Filter"
          value={(block.content.imageFilter as string) || 'none'}
          onChange={(v) => updateContent('imageFilter', v)}
          options={[
            { label: 'None', value: 'none' },
            { label: 'Grayscale', value: 'grayscale' },
            { label: 'Sepia', value: 'sepia' },
            { label: 'Blur', value: 'blur' },
          ]}
        />
        {(block.content.imageFilter as string) !== 'none' && (
          <ToggleField
            label="Remove Filter on Hover"
            checked={(block.content.removeFilterOnHover as boolean) ?? true}
            onChange={(v) => updateContent('removeFilterOnHover', v)}
          />
        )}
      </Section>

      {/* Color Overlay Section */}
      <Section title="Color Overlay" icon={Palette} defaultOpen={false}>
        <NumberField
          label="Overlay Opacity"
          value={(block.content.overlayOpacity as number) ?? 0}
          onChange={(v) => updateContent('overlayOpacity', v)}
          min={0}
          max={100}
          suffix="%"
        />
        {(block.content.overlayOpacity as number) > 0 && (
          <>
            <ColorField
              label="Overlay Color"
              value={(block.content.overlayColor as string) || '#000000'}
              onChange={(v) => updateContent('overlayColor', v)}
            />
            <ToggleField
              label="Remove Overlay on Hover"
              checked={(block.content.removeOverlayOnHover as boolean) ?? true}
              onChange={(v) => updateContent('removeOverlayOnHover', v)}
            />
          </>
        )}
      </Section>
      
      {/* Display Options Section */}
      <Section title="Display Options" icon={Eye} defaultOpen={false}>
        <ToggleField
          label="Enable Lightbox"
          checked={(block.content.enableLightbox as boolean) ?? true}
          onChange={(v) => updateContent('enableLightbox', v)}
        />
        <ToggleField
          label="Show Captions"
          checked={(block.content.showCaptions as boolean) ?? false}
          onChange={(v) => updateContent('showCaptions', v)}
        />
        <ToggleField
          label="Lazy Load Images"
          checked={(block.content.lazyLoad as boolean) ?? true}
          onChange={(v) => updateContent('lazyLoad', v)}
        />
      </Section>

      {/* Carousel Settings (conditional) */}
      {(block.content.layout === 'carousel') && (
        <Section title="Carousel Settings" icon={Settings2} defaultOpen={false}>
          <ToggleField
            label="Autoplay"
            checked={(block.content.carouselAutoPlay as boolean) || false}
            onChange={(v) => updateContent('carouselAutoPlay', v)}
          />
          <ToggleField
            label="Show Navigation Dots"
            checked={(block.content.showDots as boolean) ?? true}
            onChange={(v) => updateContent('showDots', v)}
          />
          <ToggleField
            label="Show Arrows"
            checked={(block.content.showArrows as boolean) ?? true}
            onChange={(v) => updateContent('showArrows', v)}
          />
        </Section>
      )}
    </>
  );
}

// Stats Block Editor
function StatsEditor({ block, updateContent }: { 
  block: Block; 
  updateContent: (key: string, value: unknown) => void;
}) {
  const stats = (block.content.stats as Array<{ 
    value: string; 
    label: string; 
    suffix?: string; 
    prefix?: string;
    icon?: string;
    color?: string;
  }>) || [];
  
  const addStat = () => {
    updateContent('stats', [...stats, { value: '100', label: 'New Stat', suffix: '+', icon: 'TrendingUp', color: '#3B82F6' }]);
  };
  
  const removeStat = (index: number) => {
    updateContent('stats', stats.filter((_, i) => i !== index));
  };
  
  const updateStat = (index: number, field: string, value: string) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [field]: value };
    updateContent('stats', newStats);
  };

  const movestat = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= stats.length) return;
    
    const updated = [...stats];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    updateContent('stats', updated);
  };

  // Popular stat icons
  const STAT_ICONS = [
    { name: 'TrendingUp', label: 'Trending' },
    { name: 'Users', label: 'Users' },
    { name: 'Star', label: 'Star' },
    { name: 'Award', label: 'Award' },
    { name: 'Globe', label: 'Globe' },
    { name: 'Clock', label: 'Clock' },
    { name: 'Zap', label: 'Zap' },
    { name: 'Heart', label: 'Heart' },
    { name: 'Target', label: 'Target' },
    { name: 'Rocket', label: 'Rocket' },
    { name: 'Crown', label: 'Crown' },
    { name: 'Trophy', label: 'Trophy' },
  ];

  // Preset colors
  const STAT_COLORS = [
    '#3B82F6', // Blue
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#F59E0B', // Amber
    '#10B981', // Emerald
    '#06B6D4', // Cyan
  ];
  
  return (
    <>
      <Section title="Style" icon={Palette} defaultOpen={true}>
        <div className="w-full flex flex-col gap-2">
          {[
            { value: 'elegant', label: 'Elegant', icon: Sparkles, desc: 'Premium cards with gradients' },
            { value: 'minimal', label: 'Minimal', icon: MinusCircle, desc: 'Clean and modern' },
            { value: 'glass', label: 'Glass', icon: Gem, desc: 'Glassmorphism effect' },
            { value: 'gradient', label: 'Gradient', icon: Palette, desc: 'Colorful backgrounds' },
            { value: 'modern', label: 'Modern', icon: Grid3x3, desc: 'Accent border design' },
            { value: 'bold', label: 'Bold', icon: Zap, desc: 'Large numbers, vibrant' },
          ].map((style) => {
            const Icon = style.icon;
            const isSelected = block.content.style === style.value;
            return (
              <button
                key={style.value}
                onClick={() => updateContent('style', style.value)}
                className={`w-full p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                  isSelected
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                    : 'border-zinc-200 dark:border-stone-300 hover:border-violet-300 dark:hover:border-violet-700 bg-white dark:bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isSelected 
                      ? 'bg-violet-500 text-white' 
                      : 'bg-zinc-100 dark:bg-zinc-200 text-zinc-600 dark:text-zinc-700'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-semibold ${
                      isSelected ? 'text-violet-900 dark:text-violet-100' : 'text-zinc-900 dark:text-zinc-800'
                    }`}>
                      {style.label}
                    </div>
                    <div className={`text-xs ${
                      isSelected ? 'text-violet-600 dark:text-violet-300' : 'text-zinc-500 dark:text-zinc-600'
                    }`}>
                      {style.desc}
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-5 h-5 text-violet-500" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Layout" icon={Layout} defaultOpen={true}>
        <div className="w-full flex flex-col gap-2">
          {[
            { value: 'list', label: 'List', icon: List, desc: 'Vertical stack' },
            { value: 'grid-2', label: 'Grid 2', icon: Grid2x2, desc: '2 columns' },
            { value: 'grid-3', label: 'Grid 3', icon: Grid3x3, desc: '3 columns' },
          ].map((layout) => {
            const Icon = layout.icon;
            const isSelected = (block.content.layout || 'list') === layout.value;
            return (
              <button
                key={layout.value}
                onClick={() => updateContent('layout', layout.value)}
                className={`w-full p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                  isSelected
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                    : 'border-zinc-200 dark:border-stone-300 hover:border-violet-300 dark:hover:border-violet-700 bg-white dark:bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    isSelected 
                      ? 'bg-violet-500 text-white' 
                      : 'bg-zinc-100 dark:bg-zinc-200 text-zinc-600 dark:text-zinc-700'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-semibold ${
                      isSelected ? 'text-violet-900 dark:text-violet-100' : 'text-zinc-900 dark:text-zinc-800'
                    }`}>
                      {layout.label}
                    </div>
                    <div className={`text-xs ${
                      isSelected ? 'text-violet-600 dark:text-violet-300' : 'text-zinc-500 dark:text-zinc-600'
                    }`}>
                      {layout.desc}
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-5 h-5 text-violet-500" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </Section>
      
      <Section title="Statistics" icon={Type} defaultOpen={true}>
        <div className="space-y-3">
          {stats.map((stat, index) => (
            <div key={index} className="p-4 bg-zinc-50 dark:bg-zinc-100 rounded-xl space-y-3 border-2 border-zinc-200 dark:border-stone-300">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-800">Stat {index + 1}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => movestat(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 text-zinc-600 dark:text-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-300 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => movestat(index, 'down')}
                    disabled={index === stats.length - 1}
                    className="p-1.5 text-zinc-600 dark:text-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-300 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeStat(index)}
                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-100 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Icon Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-800">Icon</label>
                <div className="grid grid-cols-6 gap-1.5">
                  {STAT_ICONS.map((iconOption) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const IconComponent = (LucideIcons as any)[iconOption.name];
                    const isSelected = stat.icon === iconOption.name;
                    return (
                      <button
                        key={iconOption.name}
                        onClick={() => updateStat(index, 'icon', iconOption.name)}
                        className={`p-2.5 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-violet-500 bg-violet-50 dark:bg-violet-100 text-violet-600'
                            : 'border-zinc-200 dark:border-stone-300 bg-white dark:bg-white hover:border-violet-300 dark:hover:border-violet-400 text-zinc-600 dark:text-zinc-700'
                        }`}
                        title={iconOption.label}
                      >
                        {IconComponent && <IconComponent className="w-4 h-4" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-800">Color</label>
                <div className="flex gap-2">
                  {STAT_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => updateStat(index, 'color', color)}
                      className={`w-10 h-10 rounded-lg border-2 transition-all ${
                        stat.color === color
                          ? 'border-zinc-900 dark:border-zinc-900 scale-110'
                          : 'border-zinc-200 dark:border-stone-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <TextField
                  label="Value"
                  value={stat.value}
                  onChange={(v) => updateStat(index, 'value', v)}
                  placeholder="100"
                />
                <TextField
                  label="Suffix"
                  value={stat.suffix || ''}
                  onChange={(v) => updateStat(index, 'suffix', v)}
                  placeholder="+, %, K"
                />
              </div>
              <TextField
                label="Label"
                value={stat.label}
                onChange={(v) => updateStat(index, 'label', v)}
                placeholder="Happy Customers"
              />
            </div>
          ))}
          
          <button
            onClick={addStat}
            className="w-full py-3 border-2 border-dashed border-zinc-300 dark:border-stone-400 rounded-xl text-sm font-semibold text-zinc-600 dark:text-zinc-700 hover:border-violet-400 dark:hover:border-violet-500 hover:text-violet-600 dark:hover:text-violet-700 hover:bg-violet-50 dark:hover:bg-violet-50 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Statistic
          </button>
        </div>
      </Section>
    </>
  );
}

// Features Block Editor
function FeaturesEditor({ block, updateContent }: { 
  block: Block; 
  updateContent: (key: string, value: unknown) => void;
}) {
  const features = (block.content.features as Array<{ icon?: string; title: string; description: string; link?: string; color?: string; highlight?: boolean }>) || [];
  
  const addFeature = () => {
    updateContent('features', [...features, { icon: 'zap', title: 'New Feature', description: 'Feature description', highlight: false }]);
  };
  
  const removeFeature = (index: number) => {
    updateContent('features', features.filter((_, i) => i !== index));
  };
  
  const updateFeature = (index: number, field: string, value: string | boolean) => {
    const newFeatures = [...features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    updateContent('features', newFeatures);
  };

  const moveFeature = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= features.length) return;
    
    const updated = [...features];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    updateContent('features', updated);
  };
  
  return (
    <>
      <Section title="Style" icon={Palette} defaultOpen={true}>
        <div className="w-full flex flex-col gap-2">
          {[
            { value: 'elegant', label: 'Elegant', icon: Sparkles },
            { value: 'minimal', label: 'Minimal', icon: MinusCircle },
            { value: 'glass', label: 'Glass', icon: Gem },
            { value: 'gradient', label: 'Gradient', icon: Palette },
            { value: 'cards', label: 'Cards', icon: Grid3x3 },
            { value: 'spotlight', label: 'Spotlight', icon: Star },
          ].map((style) => {
            const Icon = style.icon;
            const isActive = (block.content.style || 'elegant') === style.value;
            return (
              <button
                key={style.value}
                onClick={() => updateContent('style', style.value)}
                className={`w-full p-3 rounded-lg border-2 transition-all ${
                  isActive
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isActive ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <span className={`text-sm font-medium ${isActive ? 'text-blue-700' : 'text-gray-700'}`}>
                    {style.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Layout" icon={LayoutGrid} defaultOpen={true}>
        <div className="w-full flex flex-col gap-2">
          {[
            { value: 'list', label: 'List', icon: Type },
            { value: 'grid', label: 'Grid', icon: Grid3x3 },
            { value: 'compact', label: 'Compact', icon: MinusCircle },
          ].map((layout) => {
            const Icon = layout.icon;
            const isActive = (block.content.layout || 'list') === layout.value;
            return (
              <button
                key={layout.value}
                onClick={() => updateContent('layout', layout.value)}
                className={`w-full p-3 rounded-lg border-2 transition-all ${
                  isActive
                    ? 'border-teal-500 bg-gradient-to-br from-teal-50 to-emerald-50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isActive ? 'bg-gradient-to-br from-teal-500 to-emerald-500' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <span className={`text-sm font-medium ${isActive ? 'text-teal-700' : 'text-gray-700'}`}>
                    {layout.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Display Options" icon={MousePointerClick} defaultOpen={false}>
        <div className="flex items-center justify-between p-3 bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg border border-gray-200">
          <span className="text-sm font-medium text-gray-700">Show Numbers</span>
          <button
            onClick={() => updateContent('showNumbers', !block.content.showNumbers)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              block.content.showNumbers ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gray-300'
            }`}
          >
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
              block.content.showNumbers ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </Section>
      
      <Section title="Features" icon={Star} defaultOpen={true}>
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">Feature {index + 1}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveFeature(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 hover:bg-blue-100 rounded text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveFeature(index, 'down')}
                    disabled={index === features.length - 1}
                    className="p-1.5 hover:bg-blue-100 rounded text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFeature(index)}
                    className="p-1.5 hover:bg-red-100 rounded text-red-600 transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Icon Selector */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-blue-700">Icon</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: 'check', icon: Check },
                    { value: 'sparkles', icon: Sparkles },
                    { value: 'star', icon: Star },
                    { value: 'zap', icon: Zap },
                    { value: 'shield', icon: Shield },
                    { value: 'rocket', icon: Rocket },
                    { value: 'heart', icon: Heart },
                    { value: 'gift', icon: Gift },
                    { value: 'crown', icon: Crown },
                    { value: 'target', icon: Target },
                    { value: 'gem', icon: Gem },
                    { value: 'award', icon: Award },
                  ].map((iconOption) => {
                    const Icon = iconOption.icon;
                    const isActive = (feature.icon || 'zap') === iconOption.value;
                    return (
                      <button
                        key={iconOption.value}
                        onClick={() => updateFeature(index, 'icon', iconOption.value)}
                        className={`w-full aspect-square rounded-lg flex items-center justify-center transition-all ${
                          isActive
                            ? 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg scale-105'
                            : 'bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-md'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <TextField
                label="Title"
                value={feature.title}
                onChange={(v) => updateFeature(index, 'title', v)}
                placeholder="Feature Name"
                icon={Type}
              />

              <TextField
                label="Description"
                value={feature.description}
                onChange={(v) => updateFeature(index, 'description', v)}
                placeholder="Feature description..."
                multiline
                icon={FileText}
              />

              <TextField
                label="Link (optional)"
                value={feature.link || ''}
                onChange={(v) => updateFeature(index, 'link', v)}
                placeholder="https://example.com"
                icon={ExternalLink}
              />

              <TextField
                label="Color (optional)"
                value={feature.color || ''}
                onChange={(v) => updateFeature(index, 'color', v)}
                placeholder="#6366f1"
                icon={Palette}
              />

              {/* Highlight Toggle */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border-2 border-blue-100">
                <span className="text-sm font-medium text-blue-700">Highlight</span>
                <button
                  onClick={() => updateFeature(index, 'highlight', !feature.highlight)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    feature.highlight ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    feature.highlight ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          ))}
          
          <button
            onClick={addFeature}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Feature
          </button>
        </div>
      </Section>
      
      <Section title="Legacy Settings" icon={Layout} defaultOpen={false}>
        <SelectField
          label="Columns (Legacy)"
          value={String(block.content.columns || 2)}
          onChange={(v) => updateContent('columns', parseInt(v))}
          options={[
            { label: '2 Columns', value: '2' },
            { label: '3 Columns', value: '3' },
            { label: '4 Columns', value: '4' },
          ]}
        />
      </Section>
    </>
  );
}

// Map Block Editor
function MapEditor({ block, updateContent }: { 
  block: Block; 
  updateContent: (key: string, value: unknown) => void;
}) {
  const address = (block.content.address as string) || '';
  const zoom = (block.content.zoom as number) || 15;
  const mapType = (block.content.mapType as string) || 'roadmap';
  
  return (
    <>
      <Section title="Style" icon={Palette} defaultOpen={true}>
        <div className="w-full flex flex-col gap-2">
          {[
            { value: 'classic', label: 'Classic', icon: MapPin, desc: 'Standard map embed' },
            { value: 'card', label: 'Card', icon: LayoutGrid, desc: 'Map with info overlay' },
            { value: 'minimal', label: 'Minimal', icon: MinusCircle, desc: 'Clean and simple' },
            { value: 'modern', label: 'Modern', icon: Sparkles, desc: 'Glass bottom bar' },
            { value: 'split', label: 'Split', icon: Grid2x2, desc: 'Map + info panel' },
            { value: 'bold', label: 'Bold', icon: Zap, desc: 'Large with gradient' },
          ].map((style) => {
            const Icon = style.icon;
            const isSelected = (block.content.style || 'classic') === style.value;
            return (
              <button
                key={style.value}
                onClick={() => updateContent('style', style.value)}
                className={`w-full p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                  isSelected
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                    : 'border-zinc-200 dark:border-stone-300 hover:border-violet-300 dark:hover:border-violet-700 bg-white dark:bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isSelected 
                      ? 'bg-violet-500 text-white' 
                      : 'bg-zinc-100 dark:bg-zinc-200 text-zinc-600 dark:text-zinc-700'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-semibold ${
                      isSelected ? 'text-violet-900 dark:text-violet-100' : 'text-zinc-900 dark:text-zinc-800'
                    }`}>
                      {style.label}
                    </div>
                    <div className={`text-xs ${
                      isSelected ? 'text-violet-600 dark:text-violet-300' : 'text-zinc-500 dark:text-zinc-600'
                    }`}>
                      {style.desc}
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-5 h-5 text-violet-500" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Location" icon={MapPin} defaultOpen={true}>
        <div className="space-y-3">
          {/* Address input with icon */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Address or Place
            </label>
            <div className="relative">
              <input
                type="text"
                value={address}
                onChange={(e) => updateContent('address', e.target.value)}
                placeholder="Enter address, city, or place name..."
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Map Preview */}
          {address ? (
            <div className="relative rounded-xl overflow-hidden border border-border">
              {/* Fallback preview using colored placeholder */}
              <div className="aspect-video bg-gradient-to-br from-emerald-50 to-blue-50 relative">
                {/* Grid lines to simulate map */}
                <div className="absolute inset-0 opacity-20">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#888" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>
                
                {/* Center marker */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
                  <div className="relative">
                    <svg className="w-8 h-10 text-red-500 drop-shadow-lg" viewBox="0 0 24 30" fill="currentColor">
                      <path d="M12 0C5.4 0 0 5.4 0 12c0 7.2 12 18 12 18s12-10.8 12-18c0-6.6-5.4-12-12-12zm0 16c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"/>
                    </svg>
                  </div>
                </div>
                
                {/* Address badge */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                    <p className="text-xs text-gray-500">📍 Location</p>
                    <p className="text-sm font-medium text-gray-800 truncate">{address}</p>
                  </div>
                </div>
              </div>
              
              {/* Open in Google Maps link */}
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-xs font-medium text-blue-600 hover:bg-white transition-colors shadow-sm"
              >
                Open in Maps ↗
              </a>
            </div>
          ) : (
            <div className="aspect-video border-2 border-dashed border-border rounded-xl flex items-center justify-center bg-muted/30">
              <div className="text-center px-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground">Enter an address above</p>
                <p className="text-xs text-muted-foreground mt-1">to show a map preview</p>
              </div>
            </div>
          )}
          
          {/* Quick location examples */}
          {!address && (
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-muted-foreground">Try:</span>
              {['New York, NY', 'London, UK', 'Tokyo, Japan'].map((example) => (
                <button
                  key={example}
                  onClick={() => updateContent('address', example)}
                  className="px-2 py-1 text-xs bg-muted hover:bg-muted/80 rounded-md transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          )}
        </div>
      </Section>
      
      <Section title="Map Settings" icon={Settings2} defaultOpen={false}>
        <div className="space-y-4">
          {/* Zoom slider */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">
              Zoom Level: {zoom}
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={zoom}
              onChange={(e) => updateContent('zoom', parseInt(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>World</span>
              <span>Street</span>
            </div>
          </div>
          
          {/* Map Type - Visual Selector */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-800 mb-2">Map Type</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'roadmap', label: 'Roadmap', icon: MapPin },
                { value: 'satellite', label: 'Satellite', icon: Globe },
                { value: 'hybrid', label: 'Hybrid', icon: Layers },
                { value: 'terrain', label: 'Terrain', icon: Mountain },
              ].map((type) => {
                const Icon = type.icon;
                const isSelected = mapType === type.value;
                return (
                  <button
                    key={type.value}
                    onClick={() => updateContent('mapType', type.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-100 text-violet-700'
                        : 'border-zinc-200 dark:border-stone-300 bg-white dark:bg-white hover:border-violet-300 dark:hover:border-violet-400 text-zinc-600 dark:text-zinc-700'
                    }`}
                  >
                    <Icon className="w-5 h-5 mx-auto mb-1" />
                    <div className={`text-xs font-medium ${
                      isSelected ? 'text-violet-700' : 'text-zinc-600 dark:text-zinc-700'
                    }`}>
                      {type.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          
          <ToggleField
            label="Show Marker Pin"
            checked={(block.content.showMarker as boolean) ?? true}
            onChange={(v) => updateContent('showMarker', v)}
          />
          
          <SelectField
            label="Map Height"
            value={(block.content.height as string) || 'medium'}
            onChange={(v) => updateContent('height', v)}
            options={[
              { label: 'Small (200px)', value: 'small' },
              { label: 'Medium (300px)', value: 'medium' },
              { label: 'Large (400px)', value: 'large' },
              { label: 'Full Width', value: 'full' },
            ]}
          />
        </div>
      </Section>
      
      <Section title="Interaction" icon={Link} defaultOpen={false}>
        <ToggleField
          label="Allow zoom & pan"
          checked={(block.content.interactive as boolean) ?? true}
          onChange={(v) => updateContent('interactive', v)}
        />
        <ToggleField
          label="Show 'Get Directions' button"
          checked={(block.content.showDirections as boolean) ?? true}
          onChange={(v) => updateContent('showDirections', v)}
        />
        <TextField
          label="Custom Label"
          value={(block.content.markerLabel as string) || ''}
          onChange={(v) => updateContent('markerLabel', v)}
          placeholder="e.g., Our Office, Event Location"
        />
      </Section>
    </>
  );
}

// Header Block Editor
function HeaderEditor({ block, updateContent }: { 
  block: Block; 
  updateContent: (key: string, value: unknown) => void;
}) {
  const navLinks = (block.content.navLinks as Array<{ label: string; url: string }>) || [];
  
  const addNavLink = () => {
    updateContent('navLinks', [...navLinks, { label: 'New Link', url: '#' }]);
  };
  
  const removeNavLink = (index: number) => {
    updateContent('navLinks', navLinks.filter((_, i) => i !== index));
  };
  
  const updateNavLink = (index: number, field: 'label' | 'url', value: string) => {
    const newLinks = [...navLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    updateContent('navLinks', newLinks);
  };

  return (
    <>
      {/* Branding Section */}
      <Section title="Branding" icon={Sparkles} defaultOpen={true}>
        <TextField
          label="Site Name"
          value={(block.content.siteName as string) || ''}
          onChange={(v) => updateContent('siteName', v)}
          placeholder="My Brand"
        />
        <ImageField
          label="Logo URL"
          value={(block.content.logoUrl as string) || ''}
          onChange={(v) => updateContent('logoUrl', v)}
        />
      </Section>

      {/* Navigation Section */}
      <Section title="Navigation" icon={Link2} defaultOpen={true}>
        <div className="space-y-3">
          {navLinks.map((link, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="relative group"
            >
              <div className="glass-card p-3 space-y-2 border-2 border-violet-200/50 hover:border-violet-400/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-violet-600 flex items-center gap-1">
                    <Link2 className="w-3 h-3" />
                    Link {index + 1}
                  </span>
                  <motion.button
                    {...animations.hover.scaleLarge}
                    {...animations.tap}
                    onClick={() => removeNavLink(index)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
                <TextField
                  label="Label"
                  value={link.label}
                  onChange={(v) => updateNavLink(index, 'label', v)}
                  placeholder="Link Text"
                />
                <TextField
                  label="URL"
                  value={link.url}
                  onChange={(v) => updateNavLink(index, 'url', v)}
                  placeholder="https://..."
                />
              </div>
            </motion.div>
          ))}
          <motion.button
            {...animations.hover.scaleSmall}
            {...animations.tap}
            onClick={addNavLink}
            className="w-full py-2.5 px-3 rounded-xl border-2 border-dashed border-violet-300 text-violet-600 hover:border-violet-400 hover:bg-violet-50/50 transition-all duration-300 flex items-center justify-center gap-2 font-medium text-sm group"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            Add Navigation Link
          </motion.button>
        </div>
      </Section>

      {/* Announcement Bar Section */}
      <Section title="Announcement Bar" icon={Megaphone} defaultOpen={false}>
        <ToggleField
          label="Show Announcement"
          checked={(block.content.showAnnouncement as boolean) ?? false}
          onChange={(v) => updateContent('showAnnouncement', v)}
        />
        {(block.content.showAnnouncement as boolean) && (
          <TextField
            label="Announcement Text"
            value={(block.content.announcementText as string) || ''}
            onChange={(v) => updateContent('announcementText', v)}
            placeholder="🎉 Special offer - 20% off today!"
          />
        )}
      </Section>

      {/* Call-to-Action Section */}
      <Section title="Call-to-Action Buttons" icon={MousePointerClick} defaultOpen={false}>
        {/* Primary CTA */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-violet-200/50">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 shadow-glow-violet"></div>
            <span className="text-xs font-semibold text-violet-700">Primary Button</span>
          </div>
          <ToggleField
            label="Show Primary CTA"
            checked={(block.content.showCta as boolean) ?? false}
            onChange={(v) => updateContent('showCta', v)}
          />
          {(block.content.showCta as boolean) && (
            <>
              <TextField
                label="Button Text"
                value={(block.content.ctaLabel as string) || ''}
                onChange={(v) => updateContent('ctaLabel', v)}
                placeholder="Get Started"
              />
              <TextField
                label="Button URL"
                value={(block.content.ctaUrl as string) || ''}
                onChange={(v) => updateContent('ctaUrl', v)}
                placeholder="https://..."
              />
            </>
          )}
        </div>

        {/* Secondary CTA */}
        <div className="space-y-3 mt-4 pt-4 border-t border-violet-200/50">
          <div className="flex items-center gap-2 pb-2 border-b border-violet-200/50">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 shadow-glow-violet"></div>
            <span className="text-xs font-semibold text-purple-700">Secondary Button</span>
          </div>
          <ToggleField
            label="Show Secondary CTA"
            checked={(block.content.showSecondaryCta as boolean) ?? false}
            onChange={(v) => updateContent('showSecondaryCta', v)}
          />
          {(block.content.showSecondaryCta as boolean) && (
            <>
              <TextField
                label="Button Text"
                value={(block.content.secondaryCtaLabel as string) || ''}
                onChange={(v) => updateContent('secondaryCtaLabel', v)}
                placeholder="Learn More"
              />
              <TextField
                label="Button URL"
                value={(block.content.secondaryCtaUrl as string) || ''}
                onChange={(v) => updateContent('secondaryCtaUrl', v)}
                placeholder="https://..."
              />
            </>
          )}
        </div>
      </Section>

      {/* Style Section */}
      <Section title="Header Style" icon={Palette} defaultOpen={false}>
        <SelectField
          label="Style Variant"
          value={(block.content.style as string) || 'default'}
          onChange={(v) => updateContent('style', v)}
          options={[
            { value: 'default', label: 'Default (White + Shadow)' },
            { value: 'minimal', label: 'Minimal (Slate)' },
            { value: 'gradient', label: 'Gradient (Violet → Purple)' },
            { value: 'glass', label: 'Glassmorphism' },
            { value: 'transparent', label: 'Transparent' },
          ]}
        />
      </Section>
    </>
  );
}

// Footer Block Editor
function FooterEditor({ block, updateContent }: { 
  block: Block; 
  updateContent: (key: string, value: unknown) => void;
}) {
  const links = (block.content.links as Array<{ label: string; url: string }>) || [];
  const socialLinks = (block.content.socialLinks as Array<{ platform: string; url: string }>) || [];
  
  const addLink = () => {
    updateContent('links', [...links, { label: 'Link', url: '#' }]);
  };
  
  const removeLink = (index: number) => {
    updateContent('links', links.filter((_, i) => i !== index));
  };
  
  const updateLink = (index: number, field: 'label' | 'url', value: string) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    updateContent('links', newLinks);
  };

  const addSocialLink = () => {
    updateContent('socialLinks', [...socialLinks, { platform: 'twitter', url: '#' }]);
  };
  
  const removeSocialLink = (index: number) => {
    updateContent('socialLinks', socialLinks.filter((_, i) => i !== index));
  };
  
  const updateSocialLink = (index: number, field: 'platform' | 'url', value: string) => {
    const newSocialLinks = [...socialLinks];
    newSocialLinks[index] = { ...newSocialLinks[index], [field]: value };
    updateContent('socialLinks', newSocialLinks);
  };

  return (
    <>
      {/* Footer Style Section */}
      <Section title="Footer Style" icon={Palette} defaultOpen={true}>
        <SelectField
          label="Layout"
          value={(block.content.style as string) || 'simple'}
          onChange={(v) => updateContent('style', v)}
          options={[
            { value: 'simple', label: 'Simple (Light)' },
            { value: 'minimal', label: 'Minimal (Compact)' },
            { value: 'centered', label: 'Centered (Stacked)' },
            { value: 'columns', label: 'Columns (Dark)' },
          ]}
        />
        <ToggleField
          label="Show Border"
          checked={(block.content.showBorder as boolean) ?? true}
          onChange={(v) => updateContent('showBorder', v)}
        />
        <ToggleField
          label="Show Branding"
          checked={(block.content.showBranding as boolean) ?? true}
          onChange={(v) => updateContent('showBranding', v)}
        />
      </Section>

      {/* Content Section */}
      <Section title="Copyright & Text" icon={Type} defaultOpen={true}>
        <TextField
          label="Copyright Text"
          value={(block.content.text as string) || ''}
          onChange={(v) => updateContent('text', v)}
          placeholder="© 2024 All rights reserved"
        />
      </Section>

      {/* Links Section */}
      <Section title="Footer Links" icon={Link2} defaultOpen={false}>
        <div className="space-y-3">
          {links.map((link, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="relative group"
            >
              <div className="glass-card p-3 space-y-2 border-2 border-emerald-200/50 hover:border-emerald-400/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <Link2 className="w-3 h-3" />
                    Link {index + 1}
                  </span>
                  <motion.button
                    {...animations.hover.scaleLarge}
                    {...animations.tap}
                    onClick={() => removeLink(index)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
                <TextField
                  label="Label"
                  value={link.label}
                  onChange={(v) => updateLink(index, 'label', v)}
                  placeholder="About Us"
                />
                <TextField
                  label="URL"
                  value={link.url}
                  onChange={(v) => updateLink(index, 'url', v)}
                  placeholder="https://..."
                />
              </div>
            </motion.div>
          ))}
          <motion.button
            {...animations.hover.scaleSmall}
            {...animations.tap}
            onClick={addLink}
            className="w-full py-2.5 px-3 rounded-xl border-2 border-dashed border-emerald-300 text-emerald-600 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all duration-300 flex items-center justify-center gap-2 font-medium text-sm group"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            Add Footer Link
          </motion.button>
        </div>
      </Section>

      {/* Social Links Section */}
      <Section title="Social Links" icon={Share2} defaultOpen={false}>
        <div className="space-y-3">
          {socialLinks.map((social, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="relative group"
            >
              <div className="glass-card p-3 space-y-2 border-2 border-blue-200/50 hover:border-blue-400/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                    <Share2 className="w-3 h-3" />
                    Social {index + 1}
                  </span>
                  <motion.button
                    {...animations.hover.scaleLarge}
                    {...animations.tap}
                    onClick={() => removeSocialLink(index)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
                <SelectField
                  label="Platform"
                  value={social.platform}
                  onChange={(v) => updateSocialLink(index, 'platform', v)}
                  options={[
                    { value: 'twitter', label: 'Twitter / X' },
                    { value: 'facebook', label: 'Facebook' },
                    { value: 'instagram', label: 'Instagram' },
                    { value: 'linkedin', label: 'LinkedIn' },
                    { value: 'youtube', label: 'YouTube' },
                    { value: 'tiktok', label: 'TikTok' },
                    { value: 'github', label: 'GitHub' },
                    { value: 'discord', label: 'Discord' },
                  ]}
                />
                <TextField
                  label="URL"
                  value={social.url}
                  onChange={(v) => updateSocialLink(index, 'url', v)}
                  placeholder="https://..."
                />
              </div>
            </motion.div>
          ))}
          <motion.button
            {...animations.hover.scaleSmall}
            {...animations.tap}
            onClick={addSocialLink}
            className="w-full py-2.5 px-3 rounded-xl border-2 border-dashed border-blue-300 text-blue-600 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 flex items-center justify-center gap-2 font-medium text-sm group"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            Add Social Link
          </motion.button>
        </div>
      </Section>

      {/* Contact Info Section */}
      <Section title="Contact Information" icon={Mail} defaultOpen={false}>
        <TextField
          label="Email"
          value={(block.content.email as string) || ''}
          onChange={(v) => updateContent('email', v)}
          placeholder="hello@example.com"
        />
        <TextField
          label="Phone"
          value={(block.content.phone as string) || ''}
          onChange={(v) => updateContent('phone', v)}
          placeholder="+1 (555) 123-4567"
        />
        <TextField
          label="Address"
          value={(block.content.address as string) || ''}
          onChange={(v) => updateContent('address', v)}
          placeholder="123 Main St, City, Country"
        />
      </Section>

      {/* Newsletter Section */}
      <Section title="Newsletter Signup" icon={Send} defaultOpen={false}>
        <ToggleField
          label="Show Newsletter"
          checked={(block.content.showNewsletter as boolean) ?? false}
          onChange={(v) => updateContent('showNewsletter', v)}
        />
        {(block.content.showNewsletter as boolean) && (
          <>
            <TextField
              label="Newsletter Title"
              value={(block.content.newsletterTitle as string) || ''}
              onChange={(v) => updateContent('newsletterTitle', v)}
              placeholder="Subscribe to updates"
            />
            <TextField
              label="Newsletter Subtitle"
              value={(block.content.newsletterSubtitle as string) || ''}
              onChange={(v) => updateContent('newsletterSubtitle', v)}
              placeholder="Get the latest news and offers"
            />
          </>
        )}
      </Section>

      {/* App Badges Section */}
      <Section title="App Download Badges" icon={Download} defaultOpen={false}>
        <ToggleField
          label="Show App Badges"
          checked={(block.content.showAppBadges as boolean) ?? false}
          onChange={(v) => updateContent('showAppBadges', v)}
        />
        {(block.content.showAppBadges as boolean) && (
          <>
            <TextField
              label="App Store URL"
              value={(block.content.appStoreUrl as string) || ''}
              onChange={(v) => updateContent('appStoreUrl', v)}
              placeholder="https://apps.apple.com/..."
            />
            <TextField
              label="Play Store URL"
              value={(block.content.playStoreUrl as string) || ''}
              onChange={(v) => updateContent('playStoreUrl', v)}
              placeholder="https://play.google.com/..."
            />
          </>
        )}
      </Section>
    </>
  );
}

// Calendar/Events Block Editor
function CalendarEditor({ block, updateContent }: { 
  block: Block; 
  updateContent: (key: string, value: unknown) => void;
}) {
  const events = (block.content.events as Array<{ 
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
  }>) || [];
  
  const addEvent = () => {
    updateContent('events', [...events, { 
      title: 'New Event', 
      date: new Date().toISOString(),
      time: '12:00 PM',
      location: '',
      description: '',
      category: '',
      isFeatured: false,
    }]);
  };
  
  const removeEvent = (index: number) => {
    updateContent('events', events.filter((_, i) => i !== index));
  };
  
  const updateEvent = (index: number, field: string, value: unknown) => {
    const newEvents = [...events];
    newEvents[index] = { ...newEvents[index], [field]: value };
    updateContent('events', newEvents);
  };

  const moveEvent = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === events.length - 1)
    ) {
      return;
    }
    const newEvents = [...events];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newEvents[index], newEvents[targetIndex]] = [newEvents[targetIndex], newEvents[index]];
    updateContent('events', newEvents);
  };
  
  return (
    <>
      {/* Content Section */}
      <Section title="Content" icon={Type} defaultOpen={true}>
        <TextField
          label="Section Title"
          value={(block.content.title as string) || ''}
          onChange={(v) => updateContent('title', v)}
          placeholder="Upcoming Events"
        />
        <TextField
          label="Subtitle"
          value={(block.content.subtitle as string) || ''}
          onChange={(v) => updateContent('subtitle', v)}
          placeholder="Don't miss out!"
        />
      </Section>

      {/* Events Section */}
      <Section title="Events" icon={Calendar} defaultOpen={true}>
        <div className="space-y-4">
          {events.map((event, index) => (
            <div
              key={index}
              className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300 rounded-xl space-y-4 relative group hover:shadow-lg hover:shadow-purple-200 transition-all"
            >
              {/* Header - Event Number + Controls */}
              <div className="flex items-center justify-between pb-3 border-b border-purple-300/60">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
                    {index + 1}
                  </div>
                  {event.isFeatured && (
                    <span className="text-[10px] px-2 py-0.5 bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 rounded-full font-semibold flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-yellow-500" />
                      Featured
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveEvent(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 text-purple-600 hover:bg-white/80 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="Move up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveEvent(index, 'down')}
                    disabled={index === events.length - 1}
                    className="p-1.5 text-purple-600 hover:bg-white/80 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="Move down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeEvent(index)}
                    className="p-1.5 text-red-500 hover:bg-white/80 rounded-lg transition-all ml-1"
                    title="Remove event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-3">
                <TextField
                  label="Event Title"
                  value={event.title}
                  onChange={(v) => updateEvent(index, 'title', v)}
                  placeholder="Event Name"
                  icon={Type}
                />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2.5 flex items-center gap-2">
                      <CalendarDays className="w-3.5 h-3.5 text-violet-600" />
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={event.date?.slice(0, 16) || ''}
                      onChange={(e) => updateEvent(index, 'date', new Date(e.target.value).toISOString())}
                      className="w-full px-3 py-2 text-sm text-stone-800 bg-white border-2 border-violet-200 rounded-xl focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 focus:outline-none transition-all shadow-md hover:shadow-lg"
                    />
                  </div>
                  <TextField
                    label="End Time"
                    value={event.endTime || ''}
                    onChange={(v) => updateEvent(index, 'endTime', v)}
                    placeholder="3:00 PM"
                    icon={Clock}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <TextField
                    label="Location"
                    value={event.location || ''}
                    onChange={(v) => updateEvent(index, 'location', v)}
                    placeholder="Venue name"
                    icon={MapPin}
                  />
                  <TextField
                    label="Category"
                    value={event.category || ''}
                    onChange={(v) => updateEvent(index, 'category', v)}
                    placeholder="Music, Tech..."
                    icon={Tag}
                  />
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-3 pt-3 border-t border-purple-200/50">
                <TextField
                  label="Description"
                  value={event.description || ''}
                  onChange={(v) => updateEvent(index, 'description', v)}
                  placeholder="Event details..."
                  multiline
                  icon={FileText}
                />

                <div className="grid grid-cols-2 gap-3">
                  <TextField
                    label="Event Link"
                    value={event.link || ''}
                    onChange={(v) => updateEvent(index, 'link', v)}
                    placeholder="https://..."
                    type="url"
                    icon={ExternalLink}
                  />
                  <TextField
                    label="Image URL"
                    value={event.image || ''}
                    onChange={(v) => updateEvent(index, 'image', v)}
                    placeholder="Image URL"
                    type="url"
                    icon={ImageIcon}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <TextField
                    label="Ticket Price"
                    value={event.ticketPrice || ''}
                    onChange={(v) => updateEvent(index, 'ticketPrice', v)}
                    placeholder="$25 or Free"
                    icon={DollarSign}
                  />
                  <NumberField
                    label="Max Attendees"
                    value={event.attendees || 0}
                    onChange={(v) => updateEvent(index, 'attendees', v)}
                    min={0}
                    icon={Users}
                  />
                </div>

                <ToggleField
                  label="⭐ Featured Event"
                  checked={event.isFeatured || false}
                  onChange={(v) => updateEvent(index, 'isFeatured', v)}
                />
              </div>
            </div>
          ))}
          
          {/* Add Event Button */}
          <button
            onClick={addEvent}
            className="w-full py-3 border-2 border-dashed border-purple-300 rounded-xl text-sm font-semibold text-purple-600 hover:border-purple-500 hover:bg-purple-50/50 transition-all flex items-center justify-center gap-2 group"
          >
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Add Event
          </button>
        </div>
      </Section>

      {/* Layout Section */}
      <Section title="Layout" icon={Layout} defaultOpen={false}>
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-3 flex items-center gap-2">
            <Layout className="w-3.5 h-3.5 text-violet-600" />
            Layout Style
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { 
                value: 'cards', 
                label: 'Cards', 
                icon: Grid3x3,
                desc: 'Grid layout'
              },
              { 
                value: 'list', 
                label: 'List', 
                icon: AlignJustify,
                desc: 'Stacked rows'
              },
              { 
                value: 'timeline', 
                label: 'Timeline', 
                icon: Calendar,
                desc: 'Chronological'
              },
              { 
                value: 'compact', 
                label: 'Compact', 
                icon: MinusCircle,
                desc: 'Dense layout'
              },
              { 
                value: 'featured', 
                label: 'Featured', 
                icon: Star,
                desc: 'Hero style'
              },
            ].map((option) => {
              const LayoutIcon = option.icon;
              const isActive = ((block.content.layout as string) || 'cards') === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => updateContent('layout', option.value)}
                  className={`p-3 rounded-xl border-2 transition-all text-left group ${
                    isActive
                      ? 'border-violet-500 bg-gradient-to-br from-violet-50 to-purple-50 shadow-md'
                      : 'border-stone-200 bg-white hover:border-violet-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-2.5 mb-1.5">
                    <LayoutIcon className={`w-4 h-4 mt-0.5 ${
                      isActive ? 'text-violet-600' : 'text-stone-400 group-hover:text-violet-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-bold ${
                        isActive ? 'text-violet-900' : 'text-stone-700'
                      }`}>
                        {option.label}
                      </div>
                      <div className={`text-xs ${
                        isActive ? 'text-violet-600' : 'text-stone-500'
                      }`}>
                        {option.desc}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Display Options Section */}
      <Section title="Display Options" icon={Eye} defaultOpen={false}>
        <ToggleField
          label="Show Past Events"
          checked={(block.content.showPastEvents as boolean) ?? false}
          onChange={(v) => updateContent('showPastEvents', v)}
        />
        <ToggleField
          label="Show Time"
          checked={(block.content.showTime as boolean) ?? true}
          onChange={(v) => updateContent('showTime', v)}
        />
        <ToggleField
          label="Show Location"
          checked={(block.content.showLocation as boolean) ?? true}
          onChange={(v) => updateContent('showLocation', v)}
        />
        <ToggleField
          label="Show Description"
          checked={(block.content.showDescription as boolean) ?? true}
          onChange={(v) => updateContent('showDescription', v)}
        />
        <ToggleField
          label="Show Categories"
          checked={(block.content.showCategories as boolean) ?? true}
          onChange={(v) => updateContent('showCategories', v)}
        />
      </Section>
    </>
  );
}

// Pricing Block Editor
function PricingEditor({ block, updateContent }: { 
  block: Block; 
  updateContent: (key: string, value: unknown) => void;
}) {
  const tiers = (block.content.tiers as Array<{ 
    name: string; 
    monthlyPrice?: string | number;
    yearlyPrice?: string | number;
    price?: string; 
    description?: string; 
    features: string[]; 
    notIncluded?: string[];
    buttonText?: string; 
    buttonUrl?: string;
    highlighted?: boolean;
    badge?: string;
    icon?: 'sparkles' | 'zap' | 'crown' | 'star';
  }>) || [];
  
  const addTier = () => {
    updateContent('tiers', [...tiers, { 
      name: 'Plan', 
      monthlyPrice: 9,
      yearlyPrice: 86,
      description: 'Plan description',
      features: ['Feature 1', 'Feature 2'],
      notIncluded: [],
      buttonText: 'Get Started',
      buttonUrl: '',
      highlighted: false,
      badge: '',
      icon: 'sparkles'
    }]);
  };
  
  const removeTier = (index: number) => {
    updateContent('tiers', tiers.filter((_, i) => i !== index));
  };
  
  const updateTier = (index: number, field: string, value: unknown) => {
    const newTiers = [...tiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    updateContent('tiers', newTiers);
  };

  const moveTier = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === tiers.length - 1)
    ) {
      return;
    }
    const newTiers = [...tiers];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newTiers[index], newTiers[targetIndex]] = [newTiers[targetIndex], newTiers[index]];
    updateContent('tiers', newTiers);
  };
  
  return (
    <>
      {/* Content Section */}
      <Section title="Content" icon={Type} defaultOpen={true}>
        <TextField
          label="Section Title"
          value={(block.content.title as string) || ''}
          onChange={(v) => updateContent('title', v)}
          placeholder="Pricing Plans"
          icon={Type}
        />
        <TextField
          label="Subtitle"
          value={(block.content.subtitle as string) || ''}
          onChange={(v) => updateContent('subtitle', v)}
          placeholder="Choose the perfect plan for you"
          icon={FileText}
        />
      </Section>

      {/* Pricing Tiers Section */}
      <Section title="Pricing Tiers" icon={DollarSign} defaultOpen={true}>
        <div className="space-y-4">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className="p-4 bg-gradient-to-br from-blue-200 to-cyan-200 border-2 border-blue-400 rounded-xl space-y-4 relative group hover:shadow-lg hover:shadow-blue-300 transition-all"
            >
              {/* Header - Tier Number + Controls */}
              <div className="flex items-center justify-between pb-3 border-b border-blue-400/60">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs font-bold rounded-full">
                    {index + 1}
                  </div>
                  {tier.highlighted && (
                    <span className="text-[10px] px-2 py-0.5 bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 rounded-full font-semibold flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-yellow-500" />
                      Highlighted
                    </span>
                  )}
                  {tier.badge && (
                    <span className="text-[10px] px-2 py-0.5 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full font-semibold">
                      {tier.badge}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveTier(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 text-blue-600 hover:bg-white/80 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="Move up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveTier(index, 'down')}
                    disabled={index === tiers.length - 1}
                    className="p-1.5 text-blue-600 hover:bg-white/80 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="Move down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeTier(index)}
                    className="p-1.5 text-red-500 hover:bg-white/80 rounded-lg transition-all ml-1"
                    title="Remove tier"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-3">
                <TextField
                  label="Plan Name"
                  value={tier.name}
                  onChange={(v) => updateTier(index, 'name', v)}
                  placeholder="Pro"
                  icon={Type}
                />

                <div className="space-y-3">
                  <TextField
                    label="Monthly Price"
                    value={String(tier.monthlyPrice || '')}
                    onChange={(v) => updateTier(index, 'monthlyPrice', v)}
                    placeholder="29"
                    icon={DollarSign}
                  />
                  <TextField
                    label="Yearly Price"
                    value={String(tier.yearlyPrice || '')}
                    onChange={(v) => updateTier(index, 'yearlyPrice', v)}
                    placeholder="278"
                    icon={DollarSign}
                  />
                </div>

                <TextField
                  label="Description"
                  value={tier.description || ''}
                  onChange={(v) => updateTier(index, 'description', v)}
                  placeholder="Best for growing businesses"
                  icon={FileText}
                />
              </div>

              {/* Features */}
              <div className="space-y-3 pt-3 border-t border-blue-400/60">
                <TextField
                  label="Features (one per line)"
                  value={tier.features?.join('\n') || ''}
                  onChange={(v) => updateTier(index, 'features', v.split('\n').filter(f => f.trim()))}
                  placeholder="Unlimited projects&#10;100GB storage&#10;Priority support"
                  multiline
                  icon={Check}
                />

                <TextField
                  label="Not Included (one per line)"
                  value={tier.notIncluded?.join('\n') || ''}
                  onChange={(v) => updateTier(index, 'notIncluded', v.split('\n').filter(f => f.trim()))}
                  placeholder="White-label&#10;Dedicated manager"
                  multiline
                  icon={X}
                />
              </div>

              {/* Button & Badge */}
              <div className="space-y-3 pt-3 border-t border-blue-400/60">
                <TextField
                  label="Button Text"
                  value={tier.buttonText || ''}
                  onChange={(v) => updateTier(index, 'buttonText', v)}
                  placeholder="Get Started"
                  icon={MousePointerClick}
                />
                <TextField
                  label="Button URL"
                  value={tier.buttonUrl || ''}
                  onChange={(v) => updateTier(index, 'buttonUrl', v)}
                  placeholder="https://..."
                  type="url"
                  icon={ExternalLink}
                />

                <TextField
                  label="Badge Text"
                  value={tier.badge || ''}
                  onChange={(v) => updateTier(index, 'badge', v)}
                  placeholder="Most Popular"
                  icon={Award}
                />
                
                {/* Icon Selector */}
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2.5 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                    Plan Icon
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { value: 'sparkles', icon: Sparkles, label: 'Sparkles' },
                      { value: 'zap', icon: Zap, label: 'Zap' },
                      { value: 'crown', icon: Crown, label: 'Crown' },
                      { value: 'star', icon: Star, label: 'Star' },
                    ].map((option) => {
                      const IconComponent = option.icon;
                      const isActive = (tier.icon || 'sparkles') === option.value;
                      return (
                        <button
                          key={option.value}
                          onClick={() => updateTier(index, 'icon', option.value)}
                          className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1.5 group ${
                            isActive
                              ? 'border-violet-500 bg-gradient-to-br from-violet-50 to-purple-50 shadow-md'
                              : 'border-stone-200 bg-white hover:border-violet-300 hover:shadow-sm'
                          }`}
                          title={option.label}
                        >
                          <IconComponent className={`w-5 h-5 ${
                            isActive ? 'text-violet-600' : 'text-stone-400 group-hover:text-violet-500'
                          }`} />
                          <span className={`text-[10px] font-semibold ${
                            isActive ? 'text-violet-700' : 'text-stone-500'
                          }`}>
                            {option.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <ToggleField
                  label="Highlight this tier"
                  checked={tier.highlighted || false}
                  onChange={(v) => updateTier(index, 'highlighted', v)}
                />
              </div>
            </div>
          ))}
          
          <button
            onClick={addTier}
            className="w-full py-3 border-2 border-dashed border-blue-300 rounded-xl text-sm font-semibold text-blue-600 hover:border-blue-500 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 group"
          >
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Add Pricing Tier
          </button>
        </div>
      </Section>

      {/* Style Section */}
      <Section title="Style" icon={Palette} defaultOpen={false}>
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-3 flex items-center gap-2">
            <Layout className="w-3.5 h-3.5 text-violet-600" />
            Pricing Style
          </label>
          <div className="space-y-2">
            {[
              { value: 'modern', label: 'Modern', icon: Sparkles, desc: 'Clean cards' },
              { value: 'classic', label: 'Classic', icon: Package, desc: 'Traditional' },
              { value: 'minimal', label: 'Minimal', icon: MinusCircle, desc: 'Simple' },
              { value: 'gradient', label: 'Gradient', icon: Palette, desc: 'Colorful' },
              { value: 'compact', label: 'Compact', icon: Grid3x3, desc: 'Dense' },
            ].map((option) => {
              const StyleIcon = option.icon;
              const isActive = ((block.content.style as string) || 'modern') === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => updateContent('style', option.value)}
                  className={`w-full p-3 rounded-xl border-2 transition-all text-left group ${
                    isActive
                      ? 'border-violet-500 bg-gradient-to-br from-violet-50 to-purple-50 shadow-md'
                      : 'border-stone-200 bg-white hover:border-violet-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <StyleIcon className={`w-5 h-5 ${
                      isActive ? 'text-violet-600' : 'text-stone-400 group-hover:text-violet-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-bold ${
                        isActive ? 'text-violet-900' : 'text-stone-700'
                      }`}>
                        {option.label}
                      </div>
                      <div className={`text-xs ${
                        isActive ? 'text-violet-600' : 'text-stone-500'
                      }`}>
                        {option.desc}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Display Options Section */}
      <Section title="Display Options" icon={Eye} defaultOpen={false}>
        <ToggleField
          label="Enable Billing Toggle (Monthly/Yearly)"
          checked={(block.content.enableToggle as boolean) ?? true}
          onChange={(v) => updateContent('enableToggle', v)}
        />
        <ToggleField
          label="Show Yearly Savings Badge"
          checked={(block.content.showYearlySavings as boolean) ?? true}
          onChange={(v) => updateContent('showYearlySavings', v)}
        />
        <NumberField
          label="Yearly Discount Percentage"
          value={(block.content.yearlyDiscount as number) || 20}
          onChange={(v) => updateContent('yearlyDiscount', v)}
          min={0}
          max={100}
          suffix="%"
          icon={Percent}
        />
      </Section>
    </>
  );
}

// Menu Block Editor
function MenuEditor({ block, updateContent, pageTheme }: { 
  block: Block; 
  updateContent: (key: string, value: unknown) => void;
  pageTheme?: PageTheme;
}) {
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [selectedCategoryForNewItem, setSelectedCategoryForNewItem] = useState(0);
  
  // Visual style selector icons
  const styleIcons = [
    { value: 'elegant', icon: Sparkles, label: 'Elegant' },
    { value: 'modern', icon: Zap, label: 'Modern' },
    { value: 'minimal', icon: Minimize2, label: 'Minimal' },
    { value: 'cards', icon: Grid, label: 'Cards' },
    { value: 'compact', icon: LayoutList, label: 'Compact' },
    { value: 'photo-grid', icon: LayoutGrid, label: 'Photo Grid' },
  ];

  // Badge icons with colors matching MenuBlock
  const badgeIcons = [
    { value: 'popular', icon: Star, color: '#F59E0B', label: 'Popular' },
    { value: 'new', icon: SparklesIcon, color: '#8B5CF6', label: 'New' },
    { value: 'spicy', icon: Flame, color: '#EF4444', label: 'Spicy' },
    { value: 'vegetarian', icon: Leaf, color: '#22C55E', label: 'Vegetarian' },
    { value: 'vegan', icon: Leaf, color: '#10B981', label: 'Vegan' },
    { value: 'gluten-free', icon: Salad, color: '#F97316', label: 'GF' },
    { value: 'chef-special', icon: UtensilsCrossed, color: pageTheme?.branding?.primaryColor || '#3B82F6', label: 'Chef Special' },
  ];

  // Get categories from content
  const categories = (block.content.categories as { name: string; items: MenuItem[] }[]) || [];
  const flatItems = (block.content.items as MenuItem[]) || [];
  
  // Use flat items if no categories exist
  interface MenuItem {
    id?: string;
    name: string;
    description?: string;
    price: number | string;
    originalPrice?: number | string;
    image?: string;
    badges?: string[];
    prepTime?: string;
    available?: boolean;
  }

  const getItems = (): MenuItem[] => {
    if (categories.length > 0 && categories[0]?.items) {
      return categories.flatMap(cat => cat.items || []);
    }
    return flatItems;
  };

  const addMenuItem = () => {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: 'New Item',
      description: 'Delicious dish description',
      price: 9.99,
      image: '',
      badges: [],
      available: true,
    };
    
    if (categories.length > 0) {
      const updatedCategories = [...categories];
      const targetCategory = selectedCategoryForNewItem;
      if (!updatedCategories[targetCategory].items) updatedCategories[targetCategory].items = [];
      updatedCategories[targetCategory].items.push(newItem);
      updateContent('categories', updatedCategories);
    } else {
      updateContent('items', [...flatItems, newItem]);
    }
    setEditingItem(getItems().length);
  };

  const updateMenuItem = (index: number, updates: Partial<MenuItem>) => {
    if (categories.length > 0) {
      let itemCount = 0;
      const updatedCategories = categories.map(cat => ({
        ...cat,
        items: (cat.items || []).map(item => {
          if (itemCount === index) {
            itemCount++;
            return { ...item, ...updates };
          }
          itemCount++;
          return item;
        })
      }));
      updateContent('categories', updatedCategories);
    } else {
      const updatedItems = flatItems.map((item, i) => 
        i === index ? { ...item, ...updates } : item
      );
      updateContent('items', updatedItems);
    }
  };

  const deleteMenuItem = (index: number) => {
    if (categories.length > 0) {
      let itemCount = 0;
      const updatedCategories = categories.map(cat => ({
        ...cat,
        items: (cat.items || []).filter(() => {
          const keep = itemCount !== index;
          itemCount++;
          return keep;
        })
      }));
      updateContent('categories', updatedCategories);
    } else {
      updateContent('items', flatItems.filter((_, i) => i !== index));
    }
    setEditingItem(null);
  };

  const addCategory = () => {
    const newCategory = {
      name: 'New Category',
      items: [],
    };
    updateContent('categories', [...categories, newCategory]);
  };

  const updateCategory = (index: number, name: string) => {
    const updatedCategories = categories.map((cat, i) => 
      i === index ? { ...cat, name } : cat
    );
    updateContent('categories', updatedCategories);
  };

  // Move item to a different category
  const moveItemToCategory = (itemIndex: number, newCategoryIndex: number) => {
    if (categories.length === 0) return;
    
    let itemCount = 0;
    let itemToMove: MenuItem | null = null;
    let sourceCategoryIndex = -1;
    
    // Find the item and its current category
    for (let catIdx = 0; catIdx < categories.length; catIdx++) {
      const cat = categories[catIdx];
      for (let i = 0; i < (cat.items || []).length; i++) {
        if (itemCount === itemIndex) {
          itemToMove = cat.items[i];
          sourceCategoryIndex = catIdx;
          break;
        }
        itemCount++;
      }
      if (itemToMove) break;
    }
    
    if (!itemToMove || sourceCategoryIndex === -1 || sourceCategoryIndex === newCategoryIndex) return;
    
    // Remove from source category and add to target category
    const updatedCategories = categories.map((cat, idx) => {
      if (idx === sourceCategoryIndex) {
        return {
          ...cat,
          items: cat.items.filter(item => item !== itemToMove)
        };
      } else if (idx === newCategoryIndex) {
        return {
          ...cat,
          items: [...(cat.items || []), itemToMove]
        };
      }
      return cat;
    });
    
    updateContent('categories', updatedCategories);
  };

  // Get category index for a flat item index
  const getCategoryForItem = (itemIndex: number): number => {
    if (categories.length === 0) return 0;
    
    let itemCount = 0;
    for (let catIdx = 0; catIdx < categories.length; catIdx++) {
      const itemsInCategory = categories[catIdx].items?.length || 0;
      if (itemIndex < itemCount + itemsInCategory) {
        return catIdx;
      }
      itemCount += itemsInCategory;
    }
    return 0;
  };

  const items = getItems();

  return (
    <>
      <Section title="Menu Style" icon={Palette} defaultOpen={true}>
        <div className="space-y-3">
          <label className="text-xs font-medium text-muted-foreground">Style</label>
          <div className="grid grid-cols-3 gap-2">
            {styleIcons.map(({ value, icon: Icon, label }) => {
              const isSelected = (block.content.style as string || 'elegant') === value;
              const primaryColor = pageTheme?.branding?.primaryColor || '#3B82F6';
              
              return (
                <motion.button
                  key={value}
                  onClick={() => updateContent('style', value)}
                  {...animations.hover.scale}
                  {...animations.tap}
                  className={cn(
                    "relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all",
                    isSelected
                      ? "shadow-md"
                      : "border-border hover:border-muted-foreground"
                  )}
                  style={{
                    borderColor: isSelected ? primaryColor : undefined,
                    backgroundColor: isSelected ? `${primaryColor}10` : undefined,
                  }}
                >
                  <Icon 
                    className="w-5 h-5" 
                    style={{ color: isSelected ? primaryColor : undefined }}
                  />
                  <span 
                    className="text-xs font-medium"
                    style={{ color: isSelected ? primaryColor : undefined }}
                  >
                    {label}
                  </span>
                  {isSelected && (
                    <div 
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
        
        <ToggleField
          label="Show Images"
          checked={(block.content.showImages as boolean) ?? true}
          onChange={(v) => updateContent('showImages', v)}
        />
        <ToggleField
          label="Show Descriptions"
          checked={(block.content.showDescriptions as boolean) ?? true}
          onChange={(v) => updateContent('showDescriptions', v)}
        />
        <ToggleField
          label="Show Badges"
          checked={(block.content.showBadges as boolean) ?? true}
          onChange={(v) => updateContent('showBadges', v)}
        />
        <ToggleField
          label="Enable Cart"
          checked={(block.content.enableCart as boolean) ?? false}
          onChange={(v) => updateContent('enableCart', v)}
        />
      </Section>
      
      <Section title="Currency" icon={DollarSign} defaultOpen={false}>
        <SelectField
          label="Currency"
          value={(block.content.currency as string) || 'USD'}
          options={[
            { value: 'USD', label: 'USD ($)' },
            { value: 'EUR', label: 'EUR (€)' },
            { value: 'GBP', label: 'GBP (£)' },
            { value: 'INR', label: 'INR (₹)' },
            { value: 'AUD', label: 'AUD (A$)' },
            { value: 'CAD', label: 'CAD (C$)' },
            { value: 'JPY', label: 'JPY (¥)' },
            { value: 'AED', label: 'AED (د.إ)' },
            { value: 'SAR', label: 'SAR (﷼)' },
            { value: 'CHF', label: 'CHF' },
            { value: 'SGD', label: 'SGD (S$)' },
          ]}
          onChange={(v) => updateContent('currency', v)}
        />
      </Section>

      {/* Categories Section */}
      <Section title="Categories" icon={Layout} defaultOpen={false}>
        <div className="space-y-2">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex items-center gap-2">
              {editingCategory === idx ? (
                <input
                  type="text"
                  value={cat.name}
                  onChange={(e) => updateCategory(idx, e.target.value)}
                  onBlur={() => setEditingCategory(null)}
                  onKeyDown={(e) => e.key === 'Enter' && setEditingCategory(null)}
                  className="flex-1 px-3 py-2 text-sm border rounded-lg bg-background"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => setEditingCategory(idx)}
                  className="flex-1 text-left px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                >
                  {cat.name} <span className="text-muted-foreground">({cat.items?.length || 0} items)</span>
                </button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={addCategory}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>
      </Section>

      {/* Menu Items Section */}
      <Section title="Menu Items" icon={Package} defaultOpen={true}>
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div 
              key={item.id || idx}
              className={cn(
                "border rounded-xl overflow-hidden transition-all",
                editingItem === idx ? "ring-2 ring-primary" : ""
              )}
            >
              {/* Item Header */}
              <div 
                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50"
                onClick={() => setEditingItem(editingItem === idx ? null : idx)}
              >
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{item.name}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</span>
                    {categories.length > 1 && (
                      <>
                        <span>•</span>
                        <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                          {categories[getCategoryForItem(idx)]?.name || 'Unknown'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {editingItem === idx ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>

              {/* Expanded Edit Form */}
              {editingItem === idx && (
                <div className="p-3 pt-0 space-y-3 border-t bg-muted/30">
                  {/* Category selector for moving items */}
                  {categories.length > 1 && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-2 block">Category</label>
                      <div className="flex flex-wrap gap-1.5">
                        {categories.map((cat, catIdx) => {
                          const isCurrentCategory = getCategoryForItem(idx) === catIdx;
                          return (
                            <button
                              key={catIdx}
                              onClick={() => !isCurrentCategory && moveItemToCategory(idx, catIdx)}
                              className={cn(
                                "px-3 py-1.5 text-xs rounded-lg border transition-all",
                                isCurrentCategory
                                  ? "bg-primary text-primary-foreground border-primary cursor-default"
                                  : "bg-background hover:bg-muted border-border"
                              )}
                            >
                              {cat.name} {isCurrentCategory && '✓'}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <TextField
                    label="Item Name"
                    value={item.name}
                    onChange={(v) => updateMenuItem(idx, { name: v })}
                    placeholder="Delicious Dish"
                  />
                  
                  <TextField
                    label="Description"
                    value={item.description || ''}
                    onChange={(v) => updateMenuItem(idx, { description: v })}
                    placeholder="A wonderful description..."
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <NumberField
                      label="Price"
                      value={typeof item.price === 'number' ? item.price : parseFloat(item.price as string) || 0}
                      onChange={(v) => updateMenuItem(idx, { price: v })}
                      min={0}
                      step={0.01}
                    />
                    <NumberField
                      label="Original Price"
                      value={item.originalPrice ? (typeof item.originalPrice === 'number' ? item.originalPrice : parseFloat(item.originalPrice as string)) : 0}
                      onChange={(v) => updateMenuItem(idx, { originalPrice: v > 0 ? v : undefined })}
                      min={0}
                      step={0.01}
                    />
                  </div>

                  <TextField
                    label="Image URL"
                    value={item.image || ''}
                    onChange={(v) => updateMenuItem(idx, { image: v })}
                    placeholder="https://..."
                  />

                  <TextField
                    label="Prep Time"
                    value={item.prepTime || ''}
                    onChange={(v) => updateMenuItem(idx, { prepTime: v })}
                    placeholder="15 min"
                  />

                  {/* Badges */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">Badges</label>
                    <div className="grid grid-cols-2 gap-2">
                      {badgeIcons.map(({ value, icon: Icon, color, label }) => {
                        const isActive = item.badges?.includes(value);
                        return (
                          <motion.button
                            key={value}
                            onClick={() => {
                              const currentBadges = item.badges || [];
                              const newBadges = isActive
                                ? currentBadges.filter(b => b !== value)
                                : [...currentBadges, value];
                              updateMenuItem(idx, { badges: newBadges });
                            }}
                            {...animations.hover.scaleSmall}
                            {...animations.tap}
                            className={cn(
                              "relative flex items-center gap-2 p-2.5 rounded-lg border-2 transition-all",
                              isActive 
                                ? "shadow-sm" 
                                : "border-border hover:border-muted-foreground"
                            )}
                            style={{
                              borderColor: isActive ? color : undefined,
                              backgroundColor: isActive ? `${color}15` : undefined,
                            }}
                          >
                            <Icon 
                              className="w-4 h-4 flex-shrink-0" 
                              style={{ color }}
                            />
                            <span 
                              className="text-xs font-medium truncate"
                              style={{ color: isActive ? color : undefined }}
                            >
                              {label}
                            </span>
                            {isActive && (
                              <div 
                                className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: color }}
                              >
                                <Check className="w-2.5 h-2.5 text-white" />
                              </div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  <ToggleField
                    label="Available"
                    checked={item.available !== false}
                    onChange={(v) => updateMenuItem(idx, { available: v })}
                  />

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMenuItem(idx)}
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Item
                  </Button>
                </div>
              )}
            </div>
          ))}

          {/* Category selector for new items */}
          {categories.length > 1 && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Add new item to:</label>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedCategoryForNewItem(idx)}
                    className={cn(
                      "px-3 py-1.5 text-xs rounded-lg border transition-all",
                      selectedCategoryForNewItem === idx
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background hover:bg-muted border-border"
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={addMenuItem}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Menu Item
          </Button>
        </div>
      </Section>
    </>
  );
}

// Real Estate Block Editor
function RealEstateEditor({ block, updateContent, updateStyle: _updateStyle, pageTheme }: { 
  block: Block; 
  updateContent: (key: string, value: unknown) => void;
  updateStyle?: (key: string, value: unknown) => void;
  pageTheme?: PageTheme;
}) {
  const [editingProperty, setEditingProperty] = useState<number | null>(null);
  
  const primaryColor = pageTheme?.branding?.primaryColor || pageTheme?.button?.backgroundColor || '#6366f1';

  const layoutOptions = [
    { value: 'grid', label: 'Grid', icon: LayoutGrid },
    { value: 'list', label: 'List', icon: List },
    { value: 'carousel', label: 'Carousel', icon: ArrowUpDown },
    { value: 'featured', label: 'Featured', icon: Star },
    { value: 'showcase', label: 'Showcase', icon: Gem },
  ];

  const styleOptions = [
    { value: 'elegant', label: 'Elegant', icon: Sparkles },
    { value: 'modern', label: 'Modern', icon: Zap },
    { value: 'minimal', label: 'Minimal', icon: Circle },
    { value: 'cards', label: 'Cards', icon: Square },
    { value: 'magazine', label: 'Magazine', icon: FileText },
  ];

  const propertyTypeIcons = [
    { value: 'house', label: 'House', icon: Home },
    { value: 'apartment', label: 'Apartment', icon: Building2 },
    { value: 'condo', label: 'Condo', icon: Landmark },
    { value: 'land', label: 'Land', icon: Trees },
    { value: 'commercial', label: 'Commercial', icon: Store },
  ];

  const statusIcons = [
    { value: 'available', label: 'Available', icon: CheckCircle2, color: '#10B981' },
    { value: 'sold', label: 'Sold', icon: XCircle, color: '#EF4444' },
    { value: 'pending', label: 'Pending', icon: Clock, color: '#F59E0B' },
    { value: 'rented', label: 'Rented', icon: CheckCircle2, color: '#6366F1' },
  ];

  interface Property {
    id?: string;
    title: string;
    address?: string;
    price: number;
    priceLabel?: string;
    type?: string;
    status?: string;
    bedrooms?: number;
    bathrooms?: number;
    sqft?: number;
    parking?: number;
    images: string[];
    features?: string[];
    description?: string;
    featured?: boolean;
    agent?: {
      name: string;
      photo?: string;
      phone?: string;
      email?: string;
    };
  }

  const properties = (block.content.properties as Property[]) || [];

  const addProperty = () => {
    const newProperty: Property = {
      id: Date.now().toString(),
      title: 'New Property',
      address: '123 Main Street',
      price: 500000,
      priceLabel: '',
      type: 'house',
      status: 'for-sale',
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1500,
      parking: 2,
      images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
      features: ['Modern Kitchen', 'Garden', 'Garage'],
      description: 'Beautiful property with amazing views',
      featured: false,
    };
    updateContent('properties', [...properties, newProperty]);
    setEditingProperty(properties.length);
  };

  const updateProperty = (index: number, updates: Partial<Property>) => {
    const updatedProperties = properties.map((prop, i) => 
      i === index ? { ...prop, ...updates } : prop
    );
    updateContent('properties', updatedProperties);
  };

  const deleteProperty = (index: number) => {
    updateContent('properties', properties.filter((_, i) => i !== index));
    setEditingProperty(null);
  };

  const addPropertyImage = (index: number, url: string) => {
    if (!url) return;
    const property = properties[index];
    const images = [...(property.images || []), url];
    updateProperty(index, { images });
  };

  const removePropertyImage = (propertyIndex: number, imageIndex: number) => {
    const property = properties[propertyIndex];
    const images = property.images.filter((_, i) => i !== imageIndex);
    updateProperty(propertyIndex, { images });
  };

  return (
    <>
      <Section title="Layout & Style" icon={Palette} defaultOpen={true}>
        {/* Layout Visual Selector */}
        <div className="mb-4">
          <label className="text-sm font-medium mb-3 block">Layout</label>
          <div className="grid grid-cols-3 gap-2">
            {layoutOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = (block.content.layout as string || 'grid') === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => updateContent('layout', option.value)}
                  className={cn(
                    "relative p-3 rounded-xl border-2 transition-all hover:scale-105",
                    isSelected 
                      ? "border-current shadow-lg" 
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                  )}
                  style={{
                    color: isSelected ? primaryColor : undefined,
                    backgroundColor: isSelected ? `${primaryColor}10` : undefined
                  }}
                >
                  <Icon className="w-6 h-6 mx-auto mb-1.5" />
                  <div className="text-xs font-semibold text-center">{option.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Style Visual Selector */}
        <div className="mb-4">
          <label className="text-sm font-medium mb-3 block">Card Style</label>
          <div className="grid grid-cols-3 gap-2">
            {styleOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = (block.content.style as string || 'elegant') === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => updateContent('style', option.value)}
                  className={cn(
                    "relative p-3 rounded-xl border-2 transition-all hover:scale-105",
                    isSelected 
                      ? "border-current shadow-lg" 
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                  )}
                  style={{
                    color: isSelected ? primaryColor : undefined,
                    backgroundColor: isSelected ? `${primaryColor}10` : undefined
                  }}
                >
                  <Icon className="w-6 h-6 mx-auto mb-1.5" />
                  <div className="text-xs font-semibold text-center">{option.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        <SelectField
          label="Grid Columns"
          value={String((block.content.columns as number) || 2)}
          options={[
            { value: '1', label: '1 Column' },
            { value: '2', label: '2 Columns' },
            { value: '3', label: '3 Columns' },
          ]}
          onChange={(v) => updateContent('columns', parseInt(v))}
        />
      </Section>
      
      <Section title="Display Options" icon={Eye} defaultOpen={false}>
        <ToggleField
          label="Show Agent Info"
          checked={(block.content.showAgent as boolean) ?? true}
          onChange={(v) => updateContent('showAgent', v)}
        />
        <ToggleField
          label="Show Features"
          checked={(block.content.showFeatures as boolean) ?? true}
          onChange={(v) => updateContent('showFeatures', v)}
        />
      </Section>

      {/* Properties Section */}
      <Section title="Properties" icon={Package} defaultOpen={true}>
        <div className="space-y-3">
          {properties.map((property, idx) => (
            <div 
              key={property.id || idx}
              className={cn(
                "border rounded-xl overflow-hidden transition-all",
                editingProperty === idx ? "ring-2 ring-primary" : ""
              )}
            >
              {/* Property Header */}
              <div 
                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50"
                onClick={() => setEditingProperty(editingProperty === idx ? null : idx)}
              >
                {property.images?.[0] ? (
                  <img 
                    src={property.images[0]} 
                    alt={property.title}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{property.title}</div>
                  <div className="text-xs text-muted-foreground">
                    ${property.price?.toLocaleString()}
                  </div>
                </div>
                {property.featured && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-700">Featured</span>
                )}
                {editingProperty === idx ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>

              {/* Expanded Edit Form */}
              {editingProperty === idx && (
                <div className="p-3 pt-0 space-y-3 border-t bg-muted/30">
                  <TextField
                    label="Property Title"
                    value={property.title}
                    onChange={(v) => updateProperty(idx, { title: v })}
                    placeholder="Beautiful Family Home"
                  />
                  
                  <TextField
                    label="Address"
                    value={property.address || ''}
                    onChange={(v) => updateProperty(idx, { address: v })}
                    placeholder="123 Main Street, City"
                  />

                  <TextField
                    label="Description"
                    value={property.description || ''}
                    onChange={(v) => updateProperty(idx, { description: v })}
                    placeholder="Describe this property..."
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <NumberField
                      label="Price"
                      value={property.price || 0}
                      onChange={(v) => updateProperty(idx, { price: v })}
                      min={0}
                      step={1000}
                    />
                    <TextField
                      label="Price Label"
                      value={property.priceLabel || ''}
                      onChange={(v) => updateProperty(idx, { priceLabel: v })}
                      placeholder="/month"
                    />
                  </div>

                  {/* Property Type Visual Selector */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Property Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {propertyTypeIcons.map((option) => {
                        const Icon = option.icon;
                        const isSelected = (property.type || 'house') === option.value;
                        return (
                          <button
                            key={option.value}
                            onClick={() => updateProperty(idx, { type: option.value })}
                            className={cn(
                              "relative p-2.5 rounded-lg border-2 transition-all hover:scale-105",
                              isSelected 
                                ? "border-current shadow-md" 
                                : "border-gray-200 dark:border-gray-700"
                            )}
                            style={{
                              color: isSelected ? primaryColor : undefined,
                              backgroundColor: isSelected ? `${primaryColor}10` : undefined
                            }}
                          >
                            <Icon className="w-5 h-5 mx-auto mb-1" />
                            <div className="text-xs font-semibold text-center">{option.label}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Status Visual Selector */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Status</label>
                    <div className="grid grid-cols-2 gap-2">
                      {statusIcons.map((option) => {
                        const Icon = option.icon;
                        const isSelected = (property.status || 'available') === option.value;
                        return (
                          <button
                            key={option.value}
                            onClick={() => updateProperty(idx, { status: option.value })}
                            className={cn(
                              "relative p-2.5 rounded-lg border-2 transition-all hover:scale-105",
                              isSelected 
                                ? "border-current shadow-md" 
                                : "border-gray-200 dark:border-gray-700"
                            )}
                            style={{
                              color: isSelected ? option.color : undefined,
                              backgroundColor: isSelected ? `${option.color}15` : undefined,
                              borderColor: isSelected ? option.color : undefined
                            }}
                          >
                            <Icon className="w-5 h-5 mx-auto mb-1" />
                            <div className="text-xs font-bold text-center">{option.label}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    <NumberField
                      label="Beds"
                      value={property.bedrooms || 0}
                      onChange={(v) => updateProperty(idx, { bedrooms: v })}
                      min={0}
                      max={20}
                    />
                    <NumberField
                      label="Baths"
                      value={property.bathrooms || 0}
                      onChange={(v) => updateProperty(idx, { bathrooms: v })}
                      min={0}
                      max={20}
                    />
                    <NumberField
                      label="Sqft"
                      value={property.sqft || 0}
                      onChange={(v) => updateProperty(idx, { sqft: v })}
                      min={0}
                      step={100}
                    />
                    <NumberField
                      label="Parking"
                      value={property.parking || 0}
                      onChange={(v) => updateProperty(idx, { parking: v })}
                      min={0}
                      max={10}
                    />
                  </div>

                  {/* Images */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">Property Images</label>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {property.images?.map((img, imgIdx) => (
                        <div key={imgIdx} className="relative group">
                          <img src={img} alt="" className="w-full h-16 rounded-lg object-cover" />
                          <button
                            onClick={() => removePropertyImage(idx, imgIdx)}
                            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add image URL..."
                        className="flex-1 px-3 py-2 text-sm border rounded-lg bg-background"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            addPropertyImage(idx, (e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">Features</label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {property.features?.map((feature, fIdx) => (
                        <span 
                          key={fIdx}
                          className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary flex items-center gap-1"
                        >
                          {feature}
                          <button
                            onClick={() => {
                              const features = property.features?.filter((_, i) => i !== fIdx);
                              updateProperty(idx, { features });
                            }}
                            className="hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Add feature..."
                      className="w-full px-3 py-2 text-sm border rounded-lg bg-background"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const features = [...(property.features || []), (e.target as HTMLInputElement).value];
                          updateProperty(idx, { features });
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                  </div>

                  {/* Agent Info Section */}
                  <div className="space-y-3 p-3 rounded-lg border-2 border-dashed">
                    <label className="text-sm font-semibold flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Agent Information
                    </label>
                    <TextField
                      label="Agent Name"
                      value={property.agent?.name || ''}
                      onChange={(v) => updateProperty(idx, { 
                        agent: { name: v || 'Agent', ...(property.agent || {}) } 
                      })}
                      placeholder="John Smith"
                    />
                    <TextField
                      label="Agent Email"
                      value={property.agent?.email || ''}
                      onChange={(v) => updateProperty(idx, { 
                        agent: { ...property.agent, name: property.agent?.name || 'Agent', email: v } 
                      })}
                      placeholder="agent@realestate.com"
                      type="email"
                    />
                    <TextField
                      label="Agent Phone"
                      value={property.agent?.phone || ''}
                      onChange={(v) => updateProperty(idx, { 
                        agent: { ...property.agent, name: property.agent?.name || 'Agent', phone: v } 
                      })}
                      placeholder="+1 (555) 123-4567"
                      type="tel"
                    />
                    <TextField
                      label="Agent Photo URL"
                      value={property.agent?.photo || ''}
                      onChange={(v) => updateProperty(idx, { 
                        agent: { ...property.agent, name: property.agent?.name || 'Agent', photo: v } 
                      })}
                      placeholder="https://..."
                      type="url"
                    />
                    {property.agent?.photo && (
                      <div className="mt-2">
                        <img 
                          src={property.agent.photo} 
                          alt="Agent" 
                          className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/20"
                        />
                      </div>
                    )}
                  </div>

                  <ToggleField
                    label="Featured Property"
                    checked={property.featured === true}
                    onChange={(v) => updateProperty(idx, { featured: v })}
                  />

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteProperty(idx)}
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Property
                  </Button>
                </div>
              )}
            </div>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={addProperty}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </Button>
        </div>
      </Section>
    </>
  );
}

// Schedule Block Editor
function ScheduleEditor({ block, updateContent }: { 
  block: Block; 
  updateContent: (key: string, value: unknown) => void;
}) {
  const styleOptions = [
    { value: 'calendar', label: 'Calendar View' },
    { value: 'cards', label: 'Service Cards' },
    { value: 'list', label: 'Time Slot List' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'embedded', label: 'Embedded (Calendly)' },
  ];

  const services = (block.content.services as ServiceType[]) || [];

  return (
    <>
      <Section title="Display Style" icon={Palette} defaultOpen={true}>
        <SelectField
          label="Schedule Style"
          value={(block.content.style as string) || 'calendar'}
          options={styleOptions}
          onChange={(v) => updateContent('style', v)}
        />
        {block.content.style === 'embedded' && (
          <TextField
            label="Calendly URL"
            value={(block.content.calendlyUrl as string) || ''}
            onChange={(v) => updateContent('calendlyUrl', v)}
            placeholder="https://calendly.com/your-link"
            type="url"
          />
        )}
      </Section>
      
      <Section title="General Settings" icon={Settings} defaultOpen={true}>
        <TextField
          label="Title"
          value={(block.content.title as string) || ''}
          onChange={(v) => updateContent('title', v)}
          placeholder="Book a Session"
        />
        <TextField
          label="Subtitle"
          value={(block.content.subtitle as string) || ''}
          onChange={(v) => updateContent('subtitle', v)}
          placeholder="Select a time that works for you"
        />
        <NumberField
          label="Default Duration (minutes)"
          value={(block.content.duration as number) || 30}
          onChange={(v) => updateContent('duration', v)}
          min={15}
          max={240}
          step={15}
        />
        <TextField
          label="Timezone"
          value={(block.content.timezone as string) || ''}
          onChange={(v) => updateContent('timezone', v)}
          placeholder="America/New_York"
        />
      </Section>

      <Section title="Availability" icon={Clock} defaultOpen={false}>
        <SelectField
          label="Start Time"
          value={(block.content.startTime as string) || '09:00'}
          options={Array.from({ length: 24 }, (_, i) => ({
            value: `${i.toString().padStart(2, '0')}:00`,
            label: `${i}:00 ${i < 12 ? 'AM' : 'PM'}`,
          }))}
          onChange={(v) => updateContent('startTime', v)}
        />
        <SelectField
          label="End Time"
          value={(block.content.endTime as string) || '17:00'}
          options={Array.from({ length: 24 }, (_, i) => ({
            value: `${i.toString().padStart(2, '0')}:00`,
            label: `${i}:00 ${i < 12 ? 'AM' : 'PM'}`,
          }))}
          onChange={(v) => updateContent('endTime', v)}
        />
        <NumberField
          label="Buffer Time (minutes)"
          value={(block.content.bufferTime as number) || 0}
          onChange={(v) => updateContent('bufferTime', v)}
          min={0}
          max={60}
          step={5}
        />
        <NumberField
          label="Minimum Notice (hours)"
          value={(block.content.minNotice as number) || 2}
          onChange={(v) => updateContent('minNotice', v)}
          min={0}
          max={168}
        />
        <NumberField
          label="Max Advance Days"
          value={(block.content.maxAdvanceDays as number) || 30}
          onChange={(v) => updateContent('maxAdvanceDays', v)}
          min={1}
          max={365}
        />
      </Section>

      <Section title="Services" icon={Briefcase} defaultOpen={false}>
        <p className="text-xs text-muted-foreground mb-2">
          Add different service types with custom durations and pricing
        </p>
        {services.length === 0 ? (
          <button
            onClick={() => updateContent('services', [{
              id: '1',
              name: 'Consultation',
              duration: 30,
              price: 0,
              icon: 'video'
            }])}
            className="w-full py-2 px-3 text-sm border border-dashed border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            + Add Service Type
          </button>
        ) : (
          <div className="space-y-2">
            {services.map((service, index) => (
              <div key={service.id} className="p-3 border border-border rounded-lg space-y-2">
                <TextField
                  label="Service Name"
                  value={service.name}
                  onChange={(v) => {
                    const updated = [...services];
                    updated[index] = { ...service, name: v as string };
                    updateContent('services', updated);
                  }}
                  placeholder="e.g., 30min Call"
                />
                <div className="grid grid-cols-2 gap-2">
                  <NumberField
                    label="Duration (min)"
                    value={service.duration}
                    onChange={(v) => {
                      const updated = [...services];
                      updated[index] = { ...service, duration: v as number };
                      updateContent('services', updated);
                    }}
                    min={15}
                    max={240}
                    step={15}
                  />
                  <NumberField
                    label="Price ($)"
                    value={service.price || 0}
                    onChange={(v) => {
                      const updated = [...services];
                      updated[index] = { ...service, price: v as number };
                      updateContent('services', updated);
                    }}
                    min={0}
                  />
                </div>
                <button
                  onClick={() => {
                    const updated = services.filter((_, i) => i !== index);
                    updateContent('services', updated);
                  }}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  Remove Service
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const newService = {
                  id: Date.now().toString(),
                  name: 'New Service',
                  duration: 30,
                  price: 0,
                  icon: 'video'
                };
                updateContent('services', [...services, newService]);
              }}
              className="w-full py-2 px-3 text-sm border border-dashed border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              + Add Another Service
            </button>
          </div>
        )}
      </Section>

      <Section title="Form Fields" icon={FileText} defaultOpen={false}>
        <ToggleField
          label="Require Name"
          value={(block.content.requireName as boolean) ?? true}
          onChange={(v) => updateContent('requireName', v)}
        />
        <ToggleField
          label="Require Email"
          value={(block.content.requireEmail as boolean) ?? true}
          onChange={(v) => updateContent('requireEmail', v)}
        />
        <ToggleField
          label="Require Phone"
          value={(block.content.requirePhone as boolean) ?? false}
          onChange={(v) => updateContent('requirePhone', v)}
        />
        <ToggleField
          label="Show Notes Field"
          value={(block.content.showNotes as boolean) ?? true}
          onChange={(v) => updateContent('showNotes', v)}
        />
      </Section>

      <Section title="Confirmation" icon={CheckCircle} defaultOpen={false}>
        <TextField
          label="Success Message"
          value={(block.content.successMessage as string) || ''}
          onChange={(v) => updateContent('successMessage', v)}
          placeholder="Your appointment is confirmed!"
        />
        <ToggleField
          label="Send Email Confirmation"
          value={(block.content.sendConfirmation as boolean) ?? true}
          onChange={(v) => updateContent('sendConfirmation', v)}
        />
        <ToggleField
          label="Add to Calendar"
          value={(block.content.addToCalendar as boolean) ?? true}
          onChange={(v) => updateContent('addToCalendar', v)}
        />
      </Section>
    </>
  );
}

// Artist Block Editor
function ArtistEditor({ block, updateContent, pageTheme }: { 
  block: Block; 
  updateContent: (key: string, value: unknown) => void;
  pageTheme?: PageTheme;
}) {
  const [editingTrack, setEditingTrack] = useState<number | null>(null);
  const [editingArtwork, setEditingArtwork] = useState<number | null>(null);
  
  // Visual style selector icons
  const styleIcons = [
    { value: 'spotify', icon: MusicIcon, label: 'Spotify' },
    { value: 'vinyl', icon: Disc3, label: 'Vinyl' },
    { value: 'minimal', icon: Minimize2, label: 'Minimal' },
    { value: 'gallery', icon: LayoutGrid, label: 'Gallery' },
    { value: 'compact', icon: LayoutList, label: 'Compact' },
  ];

  const typeOptions = [
    { value: 'music', label: '🎵 Music Artist' },
    { value: 'visual-art', label: '🎨 Visual Artist' },
    { value: 'mixed', label: '✨ Mixed/Both' },
  ];

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

  const tracks = (block.content.tracks as Track[]) || [];
  const artworks = (block.content.artworks as ArtworkItem[]) || [];
  const artistType = (block.content.type as string) || 'music';

  const addTrack = () => {
    const newTrack: Track = {
      id: Date.now().toString(),
      title: 'New Track',
      duration: '3:30',
      plays: 0,
      coverArt: '',
      featured: false,
    };
    updateContent('tracks', [...tracks, newTrack]);
    setEditingTrack(tracks.length);
  };

  const updateTrack = (index: number, updates: Partial<Track>) => {
    const updatedTracks = tracks.map((track, i) => 
      i === index ? { ...track, ...updates } : track
    );
    updateContent('tracks', updatedTracks);
  };

  const deleteTrack = (index: number) => {
    updateContent('tracks', tracks.filter((_, i) => i !== index));
    setEditingTrack(null);
  };

  const addArtwork = () => {
    const newArtwork: ArtworkItem = {
      id: Date.now().toString(),
      title: 'New Artwork',
      image: '',
      description: '',
      forSale: true,
      medium: 'Mixed Media',
    };
    updateContent('artworks', [...artworks, newArtwork]);
    setEditingArtwork(artworks.length);
  };

  const updateArtwork = (index: number, updates: Partial<ArtworkItem>) => {
    const updatedArtworks = artworks.map((art, i) => 
      i === index ? { ...art, ...updates } : art
    );
    updateContent('artworks', updatedArtworks);
  };

  const deleteArtwork = (index: number) => {
    updateContent('artworks', artworks.filter((_, i) => i !== index));
    setEditingArtwork(null);
  };

  return (
    <>
      <Section title="Artist Info" icon={User} defaultOpen={true}>
        <SelectField
          label="Artist Type"
          value={(block.content.type as string) || 'music'}
          options={typeOptions}
          onChange={(v) => updateContent('type', v)}
        />
        
        {/* Visual Style Selector */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Display Style</label>
          <div className="grid grid-cols-3 gap-2">
            {styleIcons.map(({ value, icon: Icon, label }) => {
              const isSelected = (block.content.style as string || 'spotify') === value;
              const primaryColor = pageTheme?.branding?.primaryColor || '#3B82F6';
              
              return (
                <motion.button
                  key={value}
                  onClick={() => updateContent('style', value)}
                  {...animations.hover.scale}
                  {...animations.tap}
                  className={cn(
                    "relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all",
                    isSelected
                      ? "shadow-md"
                      : "border-border hover:border-muted-foreground"
                  )}
                  style={{
                    borderColor: isSelected ? primaryColor : undefined,
                    backgroundColor: isSelected ? `${primaryColor}10` : undefined,
                  }}
                >
                  <Icon 
                    className="w-5 h-5" 
                    style={{ color: isSelected ? primaryColor : undefined }}
                  />
                  <span 
                    className="text-xs font-medium text-center"
                    style={{ color: isSelected ? primaryColor : undefined }}
                  >
                    {label}
                  </span>
                  {isSelected && (
                    <div 
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        <TextField
          label="Artist Name"
          value={(block.content.artistName as string) || ''}
          onChange={(v) => updateContent('artistName', v)}
          placeholder="Your name or stage name"
        />
        <TextField
          label="Artist Image URL"
          value={(block.content.artistImage as string) || ''}
          onChange={(v) => updateContent('artistImage', v)}
          placeholder="https://..."
        />
        <TextField
          label="Bio"
          value={(block.content.bio as string) || ''}
          onChange={(v) => updateContent('bio', v)}
          placeholder="Tell your story..."
        />
        <TextField
          label="Genre"
          value={(block.content.genre as string) || ''}
          onChange={(v) => updateContent('genre', v)}
          placeholder="Pop, Hip Hop, Abstract..."
        />
      </Section>

      {/* Tracks Section - for music artists */}
      {(artistType === 'music' || artistType === 'mixed') && (
        <Section title="Tracks" icon={Package} defaultOpen={true}>
          <div className="space-y-3">
            {tracks.map((track, idx) => (
              <div 
                key={track.id || idx}
                className={cn(
                  "border rounded-xl overflow-hidden transition-all",
                  editingTrack === idx ? "ring-2 ring-primary" : ""
                )}
              >
                <div 
                  className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50"
                  onClick={() => setEditingTrack(editingTrack === idx ? null : idx)}
                >
                  {track.coverArt ? (
                    <img 
                      src={track.coverArt} 
                      alt={track.title}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{track.title}</div>
                    <div className="text-xs text-muted-foreground">{track.duration}</div>
                  </div>
                  {track.featured && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-700">Featured</span>
                  )}
                  {editingTrack === idx ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>

                {editingTrack === idx && (
                  <div className="p-3 pt-0 space-y-3 border-t bg-muted/30">
                    <TextField
                      label="Track Title"
                      value={track.title}
                      onChange={(v) => updateTrack(idx, { title: v })}
                      placeholder="Track name"
                    />
                    <TextField
                      label="Album"
                      value={track.album || ''}
                      onChange={(v) => updateTrack(idx, { album: v })}
                      placeholder="Album name"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <TextField
                        label="Duration"
                        value={track.duration || ''}
                        onChange={(v) => updateTrack(idx, { duration: v })}
                        placeholder="3:45"
                      />
                      <NumberField
                        label="Plays"
                        value={track.plays || 0}
                        onChange={(v) => updateTrack(idx, { plays: v })}
                        min={0}
                      />
                    </div>
                    <TextField
                      label="Cover Art URL"
                      value={track.coverArt || ''}
                      onChange={(v) => updateTrack(idx, { coverArt: v })}
                      placeholder="https://..."
                    />
                    <TextField
                      label="Spotify URL"
                      value={track.spotifyUrl || ''}
                      onChange={(v) => updateTrack(idx, { spotifyUrl: v })}
                      placeholder="https://open.spotify.com/..."
                    />
                    <TextField
                      label="Apple Music URL"
                      value={track.appleMusicUrl || ''}
                      onChange={(v) => updateTrack(idx, { appleMusicUrl: v })}
                      placeholder="https://music.apple.com/..."
                    />
                    <div className="flex gap-4">
                      <ToggleField
                        label="Featured"
                        checked={track.featured === true}
                        onChange={(v) => updateTrack(idx, { featured: v })}
                      />
                      <ToggleField
                        label="Explicit"
                        checked={track.explicit === true}
                        onChange={(v) => updateTrack(idx, { explicit: v })}
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteTrack(idx)}
                      className="w-full"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Track
                    </Button>
                  </div>
                )}
              </div>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={addTrack}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Track
            </Button>
          </div>
        </Section>
      )}

      {/* Artworks Section - for visual artists */}
      {(artistType === 'visual-art' || artistType === 'mixed') && (
        <Section title="Artworks" icon={ImageIcon} defaultOpen={artistType === 'visual-art'}>
          <div className="space-y-3">
            {artworks.map((artwork, idx) => (
              <div 
                key={artwork.id || idx}
                className={cn(
                  "border rounded-xl overflow-hidden transition-all",
                  editingArtwork === idx ? "ring-2 ring-primary" : ""
                )}
              >
                <div 
                  className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50"
                  onClick={() => setEditingArtwork(editingArtwork === idx ? null : idx)}
                >
                  {artwork.image ? (
                    <img 
                      src={artwork.image} 
                      alt={artwork.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{artwork.title}</div>
                    <div className="text-xs text-muted-foreground">{artwork.medium}</div>
                  </div>
                  {artwork.forSale && artwork.price && (
                    <span className="text-xs font-medium text-green-600">${artwork.price}</span>
                  )}
                  {editingArtwork === idx ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>

                {editingArtwork === idx && (
                  <div className="p-3 pt-0 space-y-3 border-t bg-muted/30">
                    <TextField
                      label="Artwork Title"
                      value={artwork.title}
                      onChange={(v) => updateArtwork(idx, { title: v })}
                      placeholder="Artwork name"
                    />
                    <TextField
                      label="Image URL"
                      value={artwork.image || ''}
                      onChange={(v) => updateArtwork(idx, { image: v })}
                      placeholder="https://..."
                    />
                    <TextField
                      label="Description"
                      value={artwork.description || ''}
                      onChange={(v) => updateArtwork(idx, { description: v })}
                      placeholder="About this piece..."
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <TextField
                        label="Medium"
                        value={artwork.medium || ''}
                        onChange={(v) => updateArtwork(idx, { medium: v })}
                        placeholder="Oil on Canvas"
                      />
                      <TextField
                        label="Dimensions"
                        value={artwork.dimensions || ''}
                        onChange={(v) => updateArtwork(idx, { dimensions: v })}
                        placeholder='24" x 36"'
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <NumberField
                        label="Price"
                        value={typeof artwork.price === 'number' ? artwork.price : 0}
                        onChange={(v) => updateArtwork(idx, { price: v > 0 ? v : undefined })}
                        min={0}
                      />
                      <NumberField
                        label="Year"
                        value={artwork.year || new Date().getFullYear()}
                        onChange={(v) => updateArtwork(idx, { year: v })}
                        min={1900}
                        max={new Date().getFullYear()}
                      />
                    </div>
                    <ToggleField
                      label="For Sale"
                      checked={artwork.forSale === true}
                      onChange={(v) => updateArtwork(idx, { forSale: v })}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteArtwork(idx)}
                      className="w-full"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Artwork
                    </Button>
                  </div>
                )}
              </div>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={addArtwork}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Artwork
            </Button>
          </div>
        </Section>
      )}
    </>
  );
}

// Generic/Default Block Editor
function DefaultEditor({ block }: { block: Block }) {
  return (
    <div className="p-4 bg-muted/50 rounded-lg text-center">
      <p className="text-sm text-muted-foreground">
        Editor for <strong>{block.type}</strong> blocks is coming soon.
      </p>
    </div>
  );
}

// Deals Block Editor
function DealsEditor({ block, updateContent, pageTheme }: { 
  block: Block; 
  updateContent: (key: string, value: unknown) => void;
  pageTheme?: PageTheme;
}) {
  const [editingDeal, setEditingDeal] = useState<number | null>(null);
  
  // Visual style selector icons
  const styleIcons = [
    { value: 'cards', icon: Grid, label: 'Cards' },
    { value: 'banner', icon: LayoutPanelTop, label: 'Banner' },
    { value: 'compact', icon: LayoutList, label: 'Compact' },
    { value: 'coupons', icon: Ticket, label: 'Coupons' },
    { value: 'flash', icon: Zap, label: 'Flash' },
  ];

  interface Deal {
    id?: string;
    title: string;
    description?: string;
    originalPrice?: number;
    discountedPrice?: number;
    discountPercent?: number;
    code?: string;
    image?: string;
    expiresAt?: string;
    limited?: boolean;
    remaining?: number;
    featured?: boolean;
    category?: string;
    url?: string;
    badge?: string;
  }

  const deals = (block.content.deals as Deal[]) || [];

  const addDeal = () => {
    const newDeal: Deal = {
      id: Date.now().toString(),
      title: 'New Deal',
      description: 'Amazing offer!',
      originalPrice: 99.99,
      discountedPrice: 49.99,
      discountPercent: 50,
      code: 'SAVE50',
      image: '',
      featured: false,
      limited: false,
    };
    updateContent('deals', [...deals, newDeal]);
    setEditingDeal(deals.length);
  };

  const updateDeal = (index: number, updates: Partial<Deal>) => {
    const updatedDeals = deals.map((deal, i) => 
      i === index ? { ...deal, ...updates } : deal
    );
    updateContent('deals', updatedDeals);
  };

  const deleteDeal = (index: number) => {
    updateContent('deals', deals.filter((_, i) => i !== index));
    setEditingDeal(null);
  };

  return (
    <>
      <Section title="Display Style" icon={Palette} defaultOpen={true}>
        {/* Visual Style Selector */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Style</label>
          <div className="grid grid-cols-3 gap-2">
            {styleIcons.map(({ value, icon: Icon, label }) => {
              const isSelected = (block.content.style as string || 'cards') === value;
              const primaryColor = pageTheme?.branding?.primaryColor || '#3B82F6';
              
              return (
                <motion.button
                  key={value}
                  onClick={() => updateContent('style', value)}
                  {...animations.hover.scale}
                  {...animations.tap}
                  className={cn(
                    "relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all",
                    isSelected
                      ? "shadow-md"
                      : "border-border hover:border-muted-foreground"
                  )}
                  style={{
                    borderColor: isSelected ? primaryColor : undefined,
                    backgroundColor: isSelected ? `${primaryColor}10` : undefined,
                  }}
                >
                  <Icon 
                    className="w-5 h-5" 
                    style={{ color: isSelected ? primaryColor : undefined }}
                  />
                  <span 
                    className="text-xs font-medium text-center"
                    style={{ color: isSelected ? primaryColor : undefined }}
                  >
                    {label}
                  </span>
                  {isSelected && (
                    <div 
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        <ToggleField
          label="Show Countdown"
          checked={(block.content.showCountdown as boolean) ?? true}
          onChange={(v) => updateContent('showCountdown', v)}
        />
        <ToggleField
          label="Show Remaining Stock"
          checked={(block.content.showRemaining as boolean) ?? true}
          onChange={(v) => updateContent('showRemaining', v)}
        />
      </Section>

      <Section title="Deals" icon={Tag} defaultOpen={true}>
        <div className="space-y-3">
          {deals.map((deal, idx) => (
            <div 
              key={deal.id || idx}
              className={cn(
                "border rounded-xl overflow-hidden transition-all",
                editingDeal === idx ? "ring-2 ring-primary" : ""
              )}
            >
              {/* Deal Header */}
              <div 
                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50"
                onClick={() => setEditingDeal(editingDeal === idx ? null : idx)}
              >
                {deal.image ? (
                  <img 
                    src={deal.image} 
                    alt={deal.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    <Tag className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{deal.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {deal.discountPercent}% OFF
                    {deal.code && ` • ${deal.code}`}
                  </div>
                </div>
                {editingDeal === idx ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>

              {/* Expanded Edit Form */}
              {editingDeal === idx && (
                <div className="p-3 pt-0 space-y-3 border-t bg-muted/30">
                  <TextField
                    label="Title"
                    value={deal.title}
                    onChange={(v) => updateDeal(idx, { title: v })}
                    placeholder="Amazing Deal"
                  />
                  
                  <TextField
                    label="Description"
                    value={deal.description || ''}
                    onChange={(v) => updateDeal(idx, { description: v })}
                    placeholder="Save big on this limited offer..."
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <NumberField
                      label="Original Price"
                      value={deal.originalPrice || 0}
                      onChange={(v) => updateDeal(idx, { originalPrice: v })}
                      min={0}
                      step={0.01}
                    />
                    <NumberField
                      label="Sale Price"
                      value={deal.discountedPrice || 0}
                      onChange={(v) => updateDeal(idx, { discountedPrice: v })}
                      min={0}
                      step={0.01}
                    />
                  </div>

                  <NumberField
                    label="Discount %"
                    value={deal.discountPercent || 0}
                    onChange={(v) => updateDeal(idx, { discountPercent: v })}
                    min={0}
                    max={100}
                  />

                  <TextField
                    label="Promo Code"
                    value={deal.code || ''}
                    onChange={(v) => updateDeal(idx, { code: v })}
                    placeholder="SAVE50"
                  />

                  <TextField
                    label="Image URL"
                    value={deal.image || ''}
                    onChange={(v) => updateDeal(idx, { image: v })}
                    placeholder="https://..."
                  />

                  <TextField
                    label="Expires At"
                    value={deal.expiresAt || ''}
                    onChange={(v) => updateDeal(idx, { expiresAt: v })}
                    placeholder="2024-12-31T23:59:59"
                  />

                  <TextField
                    label="Badge Text"
                    value={deal.badge || ''}
                    onChange={(v) => updateDeal(idx, { badge: v })}
                    placeholder="Best Deal"
                  />

                  <TextField
                    label="Link URL"
                    value={deal.url || ''}
                    onChange={(v) => updateDeal(idx, { url: v })}
                    placeholder="https://..."
                  />

                  <ToggleField
                    label="Featured Deal"
                    checked={deal.featured || false}
                    onChange={(v) => updateDeal(idx, { featured: v })}
                  />

                  <ToggleField
                    label="Limited Stock"
                    checked={deal.limited || false}
                    onChange={(v) => updateDeal(idx, { limited: v })}
                  />

                  {deal.limited && (
                    <NumberField
                      label="Remaining Stock"
                      value={deal.remaining || 0}
                      onChange={(v) => updateDeal(idx, { remaining: v })}
                      min={0}
                    />
                  )}

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteDeal(idx)}
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Deal
                  </Button>
                </div>
              )}
            </div>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={addDeal}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Deal
          </Button>
        </div>
      </Section>
    </>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function BlockInspector({ block, onUpdate, pageTheme, onThemeUpdate }: BlockInspectorProps) {
  // If no block is selected, show Page Design settings
  if (!block) {
    if (pageTheme && onThemeUpdate) {
      return (
        <div className="h-full overflow-y-auto bg-stone-50">
          <div 
            className="sticky top-0 z-10 bg-white border-b border-stone-200"
            style={{ 
              padding: spacing[4],
              boxShadow: shadows.sm
            }}
          >
            <div className="flex items-center" style={{ gap: spacing[3] }}>
              <motion.div 
                className="rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center"
                style={{ 
                  width: '44px', 
                  height: '44px',
                  boxShadow: shadows.lg
                }}
                {...animations.hover.scale}
              >
                <Palette className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h2 
                  className="font-bold text-stone-800"
                  style={{ fontSize: typography.h4.fontSize }}
                >
                  Page Design
                </h2>
                <p 
                  className="text-stone-500"
                  style={{ fontSize: typography.caption.fontSize }}
                >
                  Colors, fonts & backgrounds
                </p>
              </div>
            </div>
          </div>
          <PageSettings theme={pageTheme} onChange={onThemeUpdate} />
        </div>
      );
    }
    
    return (
      <div className="h-full flex flex-col items-center justify-center text-center bg-stone-50" style={{ padding: spacing[6] }}>
        <motion.div 
          className="rounded-2xl bg-gradient-to-br from-violet-600/30 to-purple-600/30 flex items-center justify-center border border-violet-700/50"
          style={{ 
            width: '80px', 
            height: '80px',
            marginBottom: spacing[4],
            boxShadow: shadows.lg
          }}
          {...animations.scaleIn}
        >
          <Sparkles className="w-10 h-10 text-violet-400" />
        </motion.div>
        <h3 
          className="font-bold text-stone-800"
          style={{ 
            fontSize: typography.h3.fontSize,
            marginBottom: spacing[2]
          }}
        >
          No Block Selected
        </h3>
        <p 
          className="text-stone-500 max-w-xs leading-relaxed"
          style={{ fontSize: typography.bodySmall.fontSize }}
        >
          Click on any block in the canvas to customize it, or add new blocks from the Blocks tab
        </p>
      </div>
    );
  }

  // Update helpers
  const updateContent = (key: string, value: unknown) => {
    onUpdate({
      ...block,
      content: { ...block.content, [key]: value },
    });
  };

  const updateStyles = (key: string, value: unknown) => {
    const newStyles = { ...(block.styles || {}) };
    if (value === undefined) {
      delete newStyles[key as keyof typeof newStyles];
    } else {
      newStyles[key as keyof typeof newStyles] = value as never;
    }
    onUpdate({ ...block, styles: newStyles });
  };

  const updateStyle = (key: string, value: unknown) => {
    const newStyle = { ...(block.style || {}) };
    if (value === undefined) {
      delete newStyle[key as keyof typeof newStyle];
    } else {
      newStyle[key as keyof typeof newStyle] = value as never;
    }
    onUpdate({ ...block, style: newStyle });
  };

  const meta = BLOCK_META[block.type] || { 
    icon: Package, 
    label: block.type, 
    color: 'bg-gradient-to-br from-gray-500 to-gray-600' 
  };
  
  const IconComponent = meta.icon;

  // Render the appropriate editor based on block type
  const renderEditor = () => {
    switch (block.type) {
      case 'heading':
        return <HeadingEditor block={block} updateContent={updateContent} updateStyles={updateStyles} />;
      case 'text':
        return <TextEditor block={block} updateContent={updateContent} updateStyles={updateStyles} />;
      case 'button':
        return <ButtonEditor block={block} updateContent={updateContent} updateStyles={updateStyles} />;
      case 'image':
        return <ImageEditor block={block} updateContent={updateContent} updateStyles={updateStyles} />;
      case 'video':
        return <VideoEditor block={block} updateContent={updateContent} />;
      case 'profile':
        return <ProfileEditor block={block} updateContent={updateContent} />;
      case 'linkButton':
        return <LinkButtonEditor block={block} updateContent={updateContent} updateStyle={updateStyle} />;
      case 'spacer':
        return <SpacerEditor block={block} updateContent={updateContent} />;
      case 'divider':
        return <DividerEditor block={block} updateContent={updateContent} />;
      case 'payment':
        return <PaymentEditor block={block} updateContent={updateContent} updateStyle={updateStyle} pageTheme={pageTheme} />;
      case 'product':
        return <ProductEditor block={block} updateContent={updateContent} updateStyle={updateStyle} pageTheme={pageTheme} />;
      case 'shop':
        return <ShopEditor block={block} updateContent={updateContent} updateStyle={updateStyle} pageTheme={pageTheme} />;
      case 'form':
        return <FormEditor block={block} updateContent={updateContent} />;
      case 'social':
        return <SocialEditor block={block} updateContent={updateContent} updateStyle={updateStyle} />;
      case 'countdown':
        return <CountdownEditor block={block} updateContent={updateContent} />;
      case 'testimonial':
        return <TestimonialEditor block={block} updateContent={updateContent} />;
      case 'hero':
        return <HeroEditor block={block} updateContent={updateContent} />;
      case 'faq':
        return <FAQEditor block={block} updateContent={updateContent} />;
      case 'gallery':
        return <GalleryEditor block={block} updateContent={updateContent} />;
      case 'stats':
        return <StatsEditor block={block} updateContent={updateContent} />;
      case 'features':
        return <FeaturesEditor block={block} updateContent={updateContent} />;
      case 'map':
        return <MapEditor block={block} updateContent={updateContent} />;
      case 'header':
        return <HeaderEditor block={block} updateContent={updateContent} />;
      case 'footer':
        return <FooterEditor block={block} updateContent={updateContent} />;
      case 'calendar':
        return <CalendarEditor block={block} updateContent={updateContent} />;
      case 'pricing':
        return <PricingEditor block={block} updateContent={updateContent} />;
      case 'menu':
        return <MenuEditor block={block} updateContent={updateContent} pageTheme={pageTheme} />;
      case 'real-estate':
        return <RealEstateEditor block={block} updateContent={updateContent} updateStyle={updateStyle} pageTheme={pageTheme} />;
      case 'schedule':
        return <ScheduleEditor block={block} updateContent={updateContent} />;
      case 'artist':
        return <ArtistEditor block={block} updateContent={updateContent} pageTheme={pageTheme} />;
      case 'deals':
        return <DealsEditor block={block} updateContent={updateContent} pageTheme={pageTheme} />;
      default:
        return <DefaultEditor block={block} />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-white via-violet-50/20 to-purple-50/20">
      {/* Header - Premium gradient design */}
      <div 
        className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b-2 border-violet-200/50"
        style={{ 
          boxShadow: `${shadows.md}, ${shadows.colored('#8b5cf6', 2)}`
        }}
      >
        <div style={{ padding: spacing[5] }}>
          <div className="flex items-center" style={{ gap: spacing[4] }}>
            <motion.div 
              className={cn('rounded-2xl flex items-center justify-center', meta.color)}
              style={{ 
                width: '56px', 
                height: '56px',
                boxShadow: shadows.xl
              }}
              {...animations.hover.lift}
            >
              <IconComponent className="w-7 h-7 text-white" strokeWidth={2.5} />
            </motion.div>
            <div className="flex-1 min-w-0">
              <h2 
                className="font-bold text-stone-800 mb-1"
                style={{ fontSize: typography.h3.fontSize }}
              >
                {meta.label}
              </h2>
              <p 
                className="text-stone-600 font-medium"
                style={{ fontSize: typography.bodySmall.fontSize }}
              >
                Customize this block
              </p>
            </div>
          </div>
        </div>
        {/* Quick tip with gradient */}
        <div style={{ paddingLeft: spacing[5], paddingRight: spacing[5], paddingBottom: spacing[4] }}>
          <motion.div 
            className="flex items-center bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl"
            style={{ 
              gap: spacing[3],
              padding: `${spacing[3]} ${spacing[4]}`,
              boxShadow: shadows.lg
            }}
            {...animations.fadeIn}
          >
            <Sparkles className="w-4 h-4 text-white flex-shrink-0 animate-pulse" />
            <p 
              className="text-white font-semibold"
              style={{ fontSize: typography.bodySmall.fontSize }}
            >
              Changes save automatically ✨
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Editor Content with improved spacing */}
      <div 
        className="flex-1 overflow-y-auto"
        style={{ padding: spacing[5], gap: spacing[4] }}
      >
        {renderEditor()}
      </div>
    </div>
  );
}
