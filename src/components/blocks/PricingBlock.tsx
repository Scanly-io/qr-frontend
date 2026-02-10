import type { Block } from '@/types';
import type { PageTheme } from '@/types/theme';
import { motion } from 'framer-motion';
import { Check, X, Sparkles, Zap, Crown, Star, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { FONT_FAMILY_MAP } from '@/lib/fonts';
import { 
  spacing, 
  borders, 
  animations, 
  getCardStyles, 
  getPrimaryShadow 
} from '@/utils/designSystem';

interface PricingBlockProps {
  block: Block;
  theme?: PageTheme;
}

interface PricingTier {
  name: string;
  monthlyPrice?: string | number;
  yearlyPrice?: string | number;
  price?: string | number;
  description?: string;
  features?: string[];
  notIncluded?: string[];
  buttonText?: string;
  buttonUrl?: string;
  highlighted?: boolean;
  badge?: string;
  icon?: 'sparkles' | 'zap' | 'crown' | 'star';
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

// Format price display
function formatPrice(price: string | number | undefined): { amount: string; cents: string; currency: string } {
  if (price === undefined) return { amount: '0', cents: '', currency: '$' };
  
  const priceStr = String(price).replace(/[^0-9.]/g, '');
  const num = parseFloat(priceStr) || 0;
  const [whole, decimal] = num.toFixed(2).split('.');
  
  return {
    amount: whole,
    cents: decimal === '00' ? '' : decimal,
    currency: '$',
  };
}

export default function PricingBlock({ block, theme }: PricingBlockProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  
  // Content
  const tiers = (block.content.tiers as PricingTier[]) || [];
  const title = (block.content.title as string) || '';
  const subtitle = (block.content.subtitle as string) || '';
  const enableToggle = (block.content.enableToggle as boolean) ?? true;
  const showYearlySavings = (block.content.showYearlySavings as boolean) ?? true;
  const yearlyDiscount = (block.content.yearlyDiscount as number) || 20;
  
  // Style
  const style = (block.content.style as 'modern' | 'classic' | 'minimal' | 'gradient' | 'compact') || 'modern';
  
  // Default sample tiers
  const sampleTiers: PricingTier[] = tiers.length > 0 ? tiers : [
    {
      name: 'Starter',
      monthlyPrice: 9,
      yearlyPrice: 86,
      description: 'Perfect for individuals and small projects',
      features: ['Up to 5 projects', '10GB storage', 'Basic analytics', 'Email support'],
      notIncluded: ['Custom domain', 'API access', 'Priority support'],
      buttonText: 'Start Free Trial',
      icon: 'sparkles',
    },
    {
      name: 'Pro',
      monthlyPrice: 29,
      yearlyPrice: 278,
      description: 'Best for growing businesses and teams',
      features: ['Unlimited projects', '100GB storage', 'Advanced analytics', 'Priority support', 'Custom domain', 'API access'],
      notIncluded: ['White-label', 'Dedicated manager'],
      buttonText: 'Get Started',
      highlighted: true,
      badge: 'Most Popular',
      icon: 'zap',
    },
    {
      name: 'Enterprise',
      monthlyPrice: 99,
      yearlyPrice: 950,
      description: 'For large organizations with custom needs',
      features: ['Everything in Pro', 'Unlimited storage', 'White-label option', 'Dedicated account manager', '24/7 phone support', 'Custom integrations', 'SLA guarantee'],
      buttonText: 'Contact Sales',
      icon: 'crown',
    },
  ];

  const displayTiers = sampleTiers;

  // Theme integration
  const primaryColor = theme?.branding?.primaryColor || theme?.button?.backgroundColor || '#6366f1';
  const titleFont = theme?.typography?.titleFont || 'inter';
  const bodyFont = theme?.typography?.bodyFont || 'inter';
  const titleFontFamily = FONT_FAMILY_MAP[titleFont] || "'Inter', sans-serif";
  const bodyFontFamily = FONT_FAMILY_MAP[bodyFont] || "'Inter', sans-serif";
  
  const isDark = isDarkBackground(theme);
  const titleColor = theme?.typography?.titleColor || (isDark ? '#ffffff' : '#18181b');
  const bodyColor = theme?.typography?.bodyColor || (isDark ? '#a1a1aa' : '#71717a');
  const cardBg = isDark ? 'rgba(255,255,255,0.06)' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';

  const getIcon = (icon?: string) => {
    switch (icon) {
      case 'sparkles': return <Sparkles className="w-5 h-5" />;
      case 'zap': return <Zap className="w-5 h-5" />;
      case 'crown': return <Crown className="w-5 h-5" />;
      case 'star': return <Star className="w-5 h-5" />;
      default: return null;
    }
  };

  // Billing toggle render function (not a component to avoid recreation during render)
  const renderBillingToggle = () => (
    <div className="flex justify-center mb-8">
      <div 
        className="inline-flex p-1.5 rounded-full gap-1"
        style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
      >
        <button
          onClick={() => setBillingPeriod('monthly')}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
            billingPeriod === 'monthly'
              ? 'bg-white text-zinc-900 shadow-md'
              : ''
          }`}
          style={billingPeriod !== 'monthly' ? { color: bodyColor } : {}}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingPeriod('yearly')}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
            billingPeriod === 'yearly'
              ? 'bg-white text-zinc-900 shadow-md'
              : ''
          }`}
          style={billingPeriod !== 'yearly' ? { color: bodyColor } : {}}
        >
          Yearly
          {showYearlySavings && (
            <span 
              className="text-xs px-2 py-0.5 rounded-full font-bold"
              style={{ 
                backgroundColor: `${primaryColor}20`,
                color: primaryColor,
              }}
            >
              -{yearlyDiscount}%
            </span>
          )}
        </button>
      </div>
    </div>
  );

  // ===== MODERN STYLE (Default) =====
  if (style === 'modern') {
    return (
      <div className="py-8 w-full">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-10">
            {title && (
              <h2 
                className="text-2xl md:text-3xl font-bold mb-3"
                style={{ fontFamily: titleFontFamily, color: titleColor }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p 
                className="text-base max-w-2xl mx-auto"
                style={{ fontFamily: bodyFontFamily, color: bodyColor }}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}
        
        {/* Billing Toggle */}
        {enableToggle && renderBillingToggle()}
        
        {/* Pricing Cards - Always vertical stack */}
        <div className="w-full flex flex-col gap-4">
          {displayTiers.map((tier, idx) => {
            const price = formatPrice(
              enableToggle 
                ? (billingPeriod === 'yearly' ? tier.yearlyPrice : tier.monthlyPrice)
                : tier.monthlyPrice || tier.price
            );
            
            return (
              <motion.div
                key={idx}
                initial={animations.fadeIn.initial}
                animate={animations.fadeIn.animate}
                transition={{ ...animations.spring.gentle, delay: idx * 0.1 }}
                whileHover={{
                  y: tier.highlighted ? -12 : -8,
                  transition: animations.spring.bouncy
                }}
                className="w-full relative overflow-hidden"
                style={{
                  ...getCardStyles(isDark, tier.highlighted || false, primaryColor),
                  borderRadius: borders.radius.xl,
                  backgroundColor: tier.highlighted ? `${primaryColor}08` : undefined,
                }}
              >
                {/* Badge */}
                {tier.badge && (
                  <div 
                    className="absolute top-0 right-0 px-4 py-1.5 text-xs font-bold text-white rounded-bl-xl"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {tier.badge}
                  </div>
                )}
                
                <div className="p-6 md:p-8">
                  {/* Plan header */}
                  <div className="flex items-center gap-3 mb-4">
                    {tier.icon && (
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ 
                          backgroundColor: tier.highlighted ? primaryColor : `${primaryColor}15`,
                          color: tier.highlighted ? '#ffffff' : primaryColor,
                        }}
                      >
                        {getIcon(tier.icon)}
                      </div>
                    )}
                    <div>
                      <h3 
                        className="text-lg font-bold"
                        style={{ fontFamily: titleFontFamily, color: titleColor }}
                      >
                        {tier.name}
                      </h3>
                    </div>
                  </div>
                  
                  {tier.description && (
                    <p 
                      className="text-sm mb-6"
                      style={{ fontFamily: bodyFontFamily, color: bodyColor }}
                    >
                      {tier.description}
                    </p>
                  )}
                  
                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm" style={{ color: bodyColor }}>{price.currency}</span>
                      <span 
                        className="text-4xl md:text-5xl font-bold tracking-tight"
                        style={{ color: tier.highlighted ? primaryColor : titleColor }}
                      >
                        {price.amount}
                      </span>
                      {price.cents && (
                        <span className="text-xl font-semibold" style={{ color: bodyColor }}>
                          .{price.cents}
                        </span>
                      )}
                    </div>
                    {enableToggle && (
                      <p className="text-sm mt-1" style={{ color: bodyColor }}>
                        per {billingPeriod === 'yearly' ? 'year' : 'month'}
                        {billingPeriod === 'yearly' && (
                          <span className="ml-2 text-green-500 font-medium">
                            Save {yearlyDiscount}%
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                  
                  {/* CTA Button */}
                  {tier.buttonText && (
                    <motion.button
                      className="w-full font-semibold text-sm mb-6"
                      style={{
                        backgroundColor: tier.highlighted ? primaryColor : 'transparent',
                        color: tier.highlighted ? '#ffffff' : primaryColor,
                        border: tier.highlighted ? 'none' : `2px solid ${primaryColor}`,
                        borderRadius: borders.radius.lg,
                        padding: `${spacing[3]}px ${spacing[6]}px`,
                      }}
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: tier.highlighted ? getPrimaryShadow(primaryColor, 'hover') : 'none',
                        transition: animations.spring.snappy,
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {tier.buttonText}
                    </motion.button>
                  )}
                  
                  {/* Features */}
                  {tier.features && tier.features.length > 0 && (
                    <div className="space-y-3">
                      {tier.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-3">
                          <div 
                            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ backgroundColor: `${primaryColor}15` }}
                          >
                            <Check className="w-3 h-3" style={{ color: primaryColor }} />
                          </div>
                          <span className="text-sm" style={{ color: titleColor }}>
                            {feature}
                          </span>
                        </div>
                      ))}
                      
                      {/* Not included features */}
                      {tier.notIncluded?.map((feature, fIdx) => (
                        <div key={`not-${fIdx}`} className="flex items-start gap-3 opacity-50">
                          <div 
                            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
                          >
                            <X className="w-3 h-3" style={{ color: bodyColor }} />
                          </div>
                          <span className="text-sm line-through" style={{ color: bodyColor }}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Mobile scroll indicator */}
        {displayTiers.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-4 md:hidden">
            {displayTiers.map((_, idx) => (
              <div 
                key={idx}
                className="w-2 h-2 rounded-full"
                style={{ 
                  backgroundColor: idx === 0 ? primaryColor : `${primaryColor}30`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ===== GRADIENT STYLE =====
  if (style === 'gradient') {
    return (
      <div className="py-8">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-10">
            {title && (
              <h2 
                className="text-2xl md:text-3xl font-bold mb-3"
                style={{ fontFamily: titleFontFamily, color: titleColor }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p 
                className="text-base max-w-2xl mx-auto"
                style={{ fontFamily: bodyFontFamily, color: bodyColor }}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}
        
        {enableToggle && renderBillingToggle()}
        
        {/* Pricing Cards - Always vertical stack */}
        <div className="w-full flex flex-col gap-4">
          {displayTiers.map((tier, idx) => {
            const price = formatPrice(
              enableToggle 
                ? (billingPeriod === 'yearly' ? tier.yearlyPrice : tier.monthlyPrice)
                : tier.monthlyPrice || tier.price
            );
            
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="w-full relative rounded-3xl overflow-hidden"
                style={{
                  background: tier.highlighted 
                    ? `linear-gradient(135deg, ${primaryColor}, ${primaryColor}CC)` 
                    : cardBg,
                  border: tier.highlighted ? 'none' : `1px solid ${cardBorder}`,
                }}
              >
                {tier.highlighted && (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div 
                      className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20"
                      style={{ backgroundColor: '#ffffff' }}
                    />
                    <div 
                      className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full opacity-10"
                      style={{ backgroundColor: '#ffffff' }}
                    />
                  </div>
                )}
                
                <div className="relative p-6 md:p-8">
                  {tier.badge && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white mb-4">
                      <Sparkles className="w-3 h-3" />
                      {tier.badge}
                    </div>
                  )}
                  
                  <h3 
                    className="text-xl font-bold mb-2"
                    style={{ 
                      fontFamily: titleFontFamily, 
                      color: tier.highlighted ? '#ffffff' : titleColor 
                    }}
                  >
                    {tier.name}
                  </h3>
                  
                  {tier.description && (
                    <p 
                      className="text-sm mb-6"
                      style={{ color: tier.highlighted ? 'rgba(255,255,255,0.8)' : bodyColor }}
                    >
                      {tier.description}
                    </p>
                  )}
                  
                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span 
                        className="text-5xl font-bold"
                        style={{ color: tier.highlighted ? '#ffffff' : titleColor }}
                      >
                        {price.currency}{price.amount}
                      </span>
                      <span style={{ color: tier.highlighted ? 'rgba(255,255,255,0.7)' : bodyColor }}>
                        /{billingPeriod === 'yearly' ? 'yr' : 'mo'}
                      </span>
                    </div>
                  </div>
                  
                  {tier.buttonText && (
                    <motion.button
                      className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition-all mb-6"
                      style={{
                        backgroundColor: tier.highlighted ? '#ffffff' : primaryColor,
                        color: tier.highlighted ? primaryColor : '#ffffff',
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {tier.buttonText}
                    </motion.button>
                  )}
                  
                  {tier.features && (
                    <div className="space-y-3">
                      {tier.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-3">
                          <Check 
                            className="w-5 h-5 flex-shrink-0" 
                            style={{ color: tier.highlighted ? '#ffffff' : primaryColor }}
                          />
                          <span 
                            className="text-sm"
                            style={{ color: tier.highlighted ? '#ffffff' : titleColor }}
                          >
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Mobile scroll indicator */}
        {displayTiers.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-4 md:hidden">
            {displayTiers.map((_, idx) => (
              <div 
                key={idx}
                className="w-2 h-2 rounded-full"
                style={{ 
                  backgroundColor: idx === 0 ? primaryColor : `${primaryColor}30`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ===== MINIMAL STYLE =====
  if (style === 'minimal') {
    return (
      <div className="py-8">
        {(title || subtitle) && (
          <div className="text-center mb-10">
            {title && (
              <h2 
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: titleFontFamily, color: titleColor }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p style={{ color: bodyColor }}>{subtitle}</p>
            )}
          </div>
        )}
        
        {enableToggle && renderBillingToggle()}
        
        <div className="space-y-4 max-w-2xl mx-auto">
          {displayTiers.map((tier, idx) => {
            const price = formatPrice(
              enableToggle 
                ? (billingPeriod === 'yearly' ? tier.yearlyPrice : tier.monthlyPrice)
                : tier.monthlyPrice || tier.price
            );
            
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="w-full flex flex-col gap-4 p-4 rounded-2xl transition-all"
                style={{
                  backgroundColor: tier.highlighted ? `${primaryColor}10` : cardBg,
                  border: `1px solid ${tier.highlighted ? primaryColor : cardBorder}`,
                }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 
                      className="text-lg font-bold"
                      style={{ color: titleColor }}
                    >
                      {tier.name}
                    </h3>
                    {tier.badge && (
                      <span 
                        className="px-2 py-0.5 text-xs font-bold rounded-full text-white"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {tier.badge}
                      </span>
                    )}
                  </div>
                  {tier.description && (
                    <p className="text-sm" style={{ color: bodyColor }}>
                      {tier.description}
                    </p>
                  )}
                </div>
                
                <div className="w-full">
                  <div className="text-2xl font-bold mb-1" style={{ color: titleColor }}>
                    {price.currency}{price.amount}
                  </div>
                  <div className="text-xs mb-3" style={{ color: bodyColor }}>
                    per {billingPeriod === 'yearly' ? 'year' : 'month'}
                  </div>
                  
                  <motion.button
                    className="w-full px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: tier.highlighted ? primaryColor : 'transparent',
                      color: tier.highlighted ? '#ffffff' : primaryColor,
                      border: tier.highlighted ? 'none' : `1.5px solid ${primaryColor}`,
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tier.buttonText || 'Select'}
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // ===== COMPACT STYLE =====
  if (style === 'compact') {
    return (
      <div className="py-6">
        {enableToggle && renderBillingToggle()}
        
        <div 
          className="rounded-2xl overflow-hidden"
          style={{ 
            backgroundColor: cardBg,
            border: `1px solid ${cardBorder}`,
          }}
        >
          {displayTiers.map((tier, idx) => {
            const price = formatPrice(
              enableToggle 
                ? (billingPeriod === 'yearly' ? tier.yearlyPrice : tier.monthlyPrice)
                : tier.monthlyPrice || tier.price
            );
            
            return (
              <div
                key={idx}
                className="w-full flex flex-col gap-3 p-4 rounded-2xl transition-all"
                style={{ 
                  borderColor: cardBorder,
                  backgroundColor: tier.highlighted ? `${primaryColor}08` : 'transparent',
                }}
              >
                <div className="flex items-center gap-4">
                  {tier.highlighted && (
                    <div 
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: primaryColor }}
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold" style={{ color: titleColor }}>
                        {tier.name}
                      </span>
                      {tier.badge && (
                        <span 
                          className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                          style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                        >
                          {tier.badge}
                        </span>
                      )}
                    </div>
                    {tier.features && tier.features.length > 0 && (
                      <p className="text-xs mt-0.5" style={{ color: bodyColor }}>
                        {tier.features.slice(0, 2).join(' • ')}
                        {tier.features.length > 2 && ` +${tier.features.length - 2} more`}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="w-full">
                  <div className="text-lg font-bold mb-3" style={{ color: titleColor }}>
                    {price.currency}{price.amount}
                    <span className="text-xs font-normal" style={{ color: bodyColor }}>
                      /{billingPeriod === 'yearly' ? 'yr' : 'mo'}
                    </span>
                  </div>
                  
                  <motion.button
                    className="w-full px-4 py-2 rounded-lg text-sm font-medium"
                    style={{
                      backgroundColor: tier.highlighted ? primaryColor : `${primaryColor}15`,
                      color: tier.highlighted ? '#ffffff' : primaryColor,
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Select
                  </motion.button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ===== CLASSIC STYLE (Comparison Table) =====
  return (
    <div className="py-8">
      {(title || subtitle) && (
        <div className="text-center mb-10">
          {title && (
            <h2 
              className="text-2xl md:text-3xl font-bold mb-3"
              style={{ fontFamily: titleFontFamily, color: titleColor }}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p style={{ fontFamily: bodyFontFamily, color: bodyColor }}>{subtitle}</p>
          )}
        </div>
      )}
      
      {enableToggle && renderBillingToggle()}
      
      {/* Mobile: Card view, Desktop: Comparison Table */}
      <div className="block md:hidden">
        <div className="flex flex-col gap-4">
          {displayTiers.map((tier, idx) => {
            const price = formatPrice(
              enableToggle 
                ? (billingPeriod === 'yearly' ? tier.yearlyPrice : tier.monthlyPrice)
                : tier.monthlyPrice || tier.price
            );
            
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative rounded-2xl overflow-hidden"
                style={{
                  backgroundColor: tier.highlighted ? `${primaryColor}08` : cardBg,
                  border: `1px solid ${tier.highlighted ? primaryColor : cardBorder}`,
                }}
              >
                {tier.badge && (
                  <div 
                    className="absolute top-0 right-0 px-4 py-1.5 text-xs font-bold text-white rounded-bl-xl"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {tier.badge}
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2" style={{ color: titleColor }}>{tier.name}</h3>
                  <div className="text-3xl font-bold mb-4" style={{ color: tier.highlighted ? primaryColor : titleColor }}>
                    {price.currency}{price.amount}
                    <span className="text-sm font-normal ml-1" style={{ color: bodyColor }}>
                      /{billingPeriod === 'yearly' ? 'yr' : 'mo'}
                    </span>
                  </div>
                  
                  <motion.button
                    className="w-full py-3 rounded-lg text-sm font-semibold mb-4"
                    style={{
                      backgroundColor: tier.highlighted ? primaryColor : 'transparent',
                      color: tier.highlighted ? '#ffffff' : primaryColor,
                      border: tier.highlighted ? 'none' : `1.5px solid ${primaryColor}`,
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {tier.buttonText || 'Select'}
                  </motion.button>
                  
                  {tier.features && tier.features.length > 0 && (
                    <div className="space-y-2">
                      {tier.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2">
                          <Check className="w-4 h-4 flex-shrink-0" style={{ color: primaryColor }} />
                          <span className="text-sm" style={{ color: titleColor }}>{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Desktop: Comparison Table */}
      <div className="hidden md:block overflow-x-auto -mx-4 px-4">
        <div 
          className="rounded-2xl overflow-hidden min-w-[600px]"
          style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
        >
          {/* Header row */}
          <div 
            className="grid border-b"
            style={{ 
              gridTemplateColumns: `200px repeat(${displayTiers.length}, 1fr)`,
              borderColor: cardBorder,
            }}
          >
            <div className="p-4"></div>
            {displayTiers.map((tier, idx) => {
              const price = formatPrice(
                enableToggle 
                  ? (billingPeriod === 'yearly' ? tier.yearlyPrice : tier.monthlyPrice)
                  : tier.monthlyPrice || tier.price
              );
              
              return (
                <div 
                  key={idx} 
                  className="p-4 text-center"
                  style={{ backgroundColor: tier.highlighted ? `${primaryColor}10` : 'transparent' }}
                >
                  {tier.badge && (
                    <div 
                      className="inline-block px-2 py-0.5 rounded-full text-xs font-bold text-white mb-2"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {tier.badge}
                    </div>
                  )}
                  <h3 className="font-bold text-lg" style={{ color: titleColor }}>{tier.name}</h3>
                  <div className="text-3xl font-bold my-2" style={{ color: tier.highlighted ? primaryColor : titleColor }}>
                    {price.currency}{price.amount}
                  </div>
                  <p className="text-xs mb-3" style={{ color: bodyColor }}>
                    per {billingPeriod === 'yearly' ? 'year' : 'month'}
                  </p>
                  <motion.button
                    className="w-full py-2 rounded-lg text-sm font-semibold"
                    style={{
                      backgroundColor: tier.highlighted ? primaryColor : 'transparent',
                      color: tier.highlighted ? '#ffffff' : primaryColor,
                      border: tier.highlighted ? 'none' : `1.5px solid ${primaryColor}`,
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {tier.buttonText || 'Select'}
                  </motion.button>
                </div>
              );
            })}
          </div>
          
          {/* Feature rows */}
          {(() => {
            // Collect all unique features
            const allFeatures = new Set<string>();
            displayTiers.forEach(tier => {
              tier.features?.forEach(f => allFeatures.add(f));
              tier.notIncluded?.forEach(f => allFeatures.add(f));
            });
            
            return Array.from(allFeatures).map((feature, fIdx) => (
              <div 
                key={fIdx}
                className="grid border-b last:border-b-0"
                style={{ 
                  gridTemplateColumns: `200px repeat(${displayTiers.length}, 1fr)`,
                  borderColor: cardBorder,
                }}
              >
                <div className="p-3 flex items-center text-sm" style={{ color: titleColor }}>
                  {feature}
                </div>
                {displayTiers.map((tier, tIdx) => {
                  const hasFeature = tier.features?.includes(feature);
                  return (
                    <div 
                      key={tIdx}
                      className="p-3 flex items-center justify-center"
                      style={{ backgroundColor: tier.highlighted ? `${primaryColor}05` : 'transparent' }}
                    >
                      {hasFeature ? (
                        <Check className="w-5 h-5" style={{ color: primaryColor }} />
                      ) : (
                        <X className="w-5 h-5" style={{ color: bodyColor, opacity: 0.3 }} />
                      )}
                    </div>
                  );
                })}
              </div>
            ));
          })()}
        </div>
      </div>
    </div>
  );
}
