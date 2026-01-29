import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Palette, 
  Type, 
  Box, 
  Layers,
  Sparkles,
  Play,
  Pause,
  Code,
  Copy,
  Check
} from 'lucide-react';
import { spacing, typography, shadows, borders, animations, colors } from '@/utils/designSystem';
import { Skeleton, SkeletonCard, SkeletonAvatar, SkeletonButton, SkeletonTestimonial } from '@/components/ui/skeleton';

export default function ShowcasePage() {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [animationPaused, setAnimationPaused] = useState(false);

  const copyToClipboard = (text: string, token: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ 
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  boxShadow: shadows.colored('#8b5cf6', 3)
                }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 
                  className="font-bold text-slate-900"
                  style={{ fontSize: typography.h2.fontSize }}
                >
                  Design System Showcase
                </h1>
                <p 
                  className="text-slate-600"
                  style={{ fontSize: typography.caption.fontSize }}
                >
                  Interactive demo of all design tokens & components
                </p>
              </div>
            </div>
            <button
              onClick={() => setAnimationPaused(!animationPaused)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              {animationPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              <span className="text-sm font-medium">
                {animationPaused ? 'Resume' : 'Pause'} Animations
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* Spacing */}
        <Section 
          icon={Box} 
          title="Spacing Scale" 
          description="4px rhythm system for consistent layouts"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Object.entries(spacing).map(([key, value]) => (
              <TokenCard
                key={key}
                label={`spacing[${key}]`}
                value={value}
                preview={
                  <div 
                    className="bg-violet-500 rounded"
                    style={{ width: value, height: value }}
                  />
                }
                onCopy={copyToClipboard}
                isCopied={copiedToken === `spacing-${key}`}
                tokenKey={`spacing-${key}`}
              />
            ))}
          </div>
        </Section>

        {/* Typography */}
        <Section 
          icon={Type} 
          title="Typography" 
          description="9-level type scale from display to caption"
        >
          <div className="space-y-6">
            {Object.entries(typography).map(([key, style]) => (
              <div key={key} className="group">
                <div className="flex items-baseline gap-4 mb-2">
                  <span 
                    className="font-semibold text-slate-900"
                    style={style}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                  <button
                    onClick={() => copyToClipboard(
                      `typography.${key}`,
                      `typography-${key}`
                    )}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-xs flex items-center gap-1 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
                  >
                    {copiedToken === `typography-${key}` ? (
                      <><Check className="w-3 h-3" /> Copied</>
                    ) : (
                      <><Copy className="w-3 h-3" /> Copy</>
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-500 font-mono">
                  fontSize: {style.fontSize} | fontWeight: {style.fontWeight} | lineHeight: {style.lineHeight}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Shadows */}
        <Section 
          icon={Layers} 
          title="Shadows & Elevation" 
          description="7 levels + colored shadows for depth"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {['xs', 'sm', 'base', 'md', 'lg', 'xl', '2xl'].map((size) => (
              <div key={size} className="space-y-3">
                <div 
                  className="bg-white rounded-xl p-6 text-center"
                  style={{ 
                    boxShadow: shadows[size as keyof typeof shadows] as string 
                  }}
                >
                  <p className="text-sm font-semibold text-slate-900">{size}</p>
                  <p className="text-xs text-slate-500 mt-1">Standard</p>
                </div>
                <div 
                  className="bg-white rounded-xl p-6 text-center"
                  style={{ 
                    boxShadow: `${shadows[size as keyof typeof shadows]}, ${shadows.colored('#8b5cf6', size === 'xs' ? 1 : size === 'sm' ? 2 : size === 'base' ? 3 : size === 'md' ? 4 : size === 'lg' ? 5 : 6)}`
                  }}
                >
                  <p className="text-sm font-semibold text-slate-900">{size}</p>
                  <p className="text-xs text-violet-600 mt-1">+ Colored</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Animations */}
        <Section 
          icon={Sparkles} 
          title="Animations" 
          description="16 animation presets with spring physics"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { name: 'fadeIn', label: 'Fade In' },
              { name: 'slideUp', label: 'Slide Up' },
              { name: 'slideDown', label: 'Slide Down' },
              { name: 'slideLeft', label: 'Slide Left' },
              { name: 'slideRight', label: 'Slide Right' },
              { name: 'scaleIn', label: 'Scale In' },
            ].map(({ name, label }) => (
              <div
                key={name}
                className="bg-white rounded-xl p-6 text-center border-2 border-slate-200 hover:border-violet-400 transition-colors cursor-pointer"
              >
                <div 
                  className="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-semibold text-slate-900">{label}</p>
                <code className="text-xs text-slate-500 mt-1 block">animations.{name}</code>
              </div>
            ))}
          </div>

          {/* Spring Physics */}
          <div className="mt-8 p-6 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-200">
            <h4 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
              <Code className="w-5 h-5 text-violet-600" />
              Spring Physics Presets
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <p className="font-semibold text-sm text-slate-900 mb-2">gentle</p>
                <pre className="text-xs text-slate-600 font-mono">
                  {`stiffness: 120\ndamping: 14`}
                </pre>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-semibold text-sm text-slate-900 mb-2">bouncy</p>
                <pre className="text-xs text-slate-600 font-mono">
                  {`stiffness: 300\ndamping: 10`}
                </pre>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-semibold text-sm text-slate-900 mb-2">snappy</p>
                <pre className="text-xs text-slate-600 font-mono">
                  {`stiffness: 400\ndamping: 25`}
                </pre>
              </div>
            </div>
          </div>
        </Section>

        {/* Borders */}
        <Section 
          icon={Box} 
          title="Borders & Radius" 
          description="Consistent border widths and radius values"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(borders.radius).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div 
                  className="bg-white border-2 border-violet-400 p-8 flex items-center justify-center"
                  style={{ borderRadius: value }}
                >
                  <p className="text-sm font-semibold text-slate-900">{key}</p>
                </div>
                <p className="text-xs text-slate-600 text-center font-mono">{value}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Loading Skeletons */}
        <Section 
          icon={Layers} 
          title="Loading Skeletons" 
          description="Pre-built skeleton components for loading states"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-slate-900">Basic Skeleton</h4>
              <Skeleton width="100%" height={20} />
              <Skeleton width="80%" height={20} />
              <Skeleton width="60%" height={20} />
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-slate-900">Avatar</h4>
              <div className="flex items-center gap-3">
                <SkeletonAvatar size={48} />
                <div className="flex-1 space-y-2">
                  <Skeleton width="60%" />
                  <Skeleton width="40%" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-slate-900">Button</h4>
              <SkeletonButton width={120} height={40} />
            </div>

            <div className="space-y-3 md:col-span-2">
              <h4 className="font-semibold text-sm text-slate-900">Card</h4>
              <SkeletonCard lines={3} />
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-slate-900">Testimonial</h4>
              <SkeletonTestimonial />
            </div>
          </div>
        </Section>

        {/* Colors */}
        <Section 
          icon={Palette} 
          title="Colors & Gradients" 
          description="Semantic colors and branded gradients"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(colors).filter(([key]) => !key.includes('gradient')).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div 
                  className="h-24 rounded-xl border-2 border-slate-200"
                  style={{ backgroundColor: value as string }}
                />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{key}</p>
                  <p className="text-xs text-slate-500 font-mono">{value as string}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <h4 className="font-semibold text-lg text-slate-900">Gradients</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(colors.gradients).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div 
                    className="h-24 rounded-xl"
                    style={{ background: value }}
                  />
                  <p className="text-sm font-semibold text-slate-900">{key}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-xl mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-sm text-slate-600">
            Built with ❤️ using our unified design system
          </p>
        </div>
      </footer>
    </div>
  );
}

// Section component
function Section({ 
  icon: Icon, 
  title, 
  description, 
  children 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ 
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            boxShadow: shadows.colored('#8b5cf6', 3)
          }}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 
            className="font-bold text-slate-900"
            style={{ fontSize: typography.h3.fontSize }}
          >
            {title}
          </h2>
          <p 
            className="text-slate-600"
            style={{ fontSize: typography.bodySmall.fontSize }}
          >
            {description}
          </p>
        </div>
      </div>
      <div>{children}</div>
    </motion.section>
  );
}

// Token card component
function TokenCard({ 
  label, 
  value, 
  preview, 
  onCopy, 
  isCopied, 
  tokenKey 
}: { 
  label: string; 
  value: string; 
  preview: React.ReactNode; 
  onCopy: (text: string, key: string) => void;
  isCopied: boolean;
  tokenKey: string;
}) {
  return (
    <div className="group bg-white rounded-lg p-4 border-2 border-slate-200 hover:border-violet-400 transition-colors">
      <div className="flex items-center justify-center h-16 mb-3">
        {preview}
      </div>
      <p className="text-xs font-semibold text-slate-900 mb-1">{label}</p>
      <p className="text-xs text-slate-500 font-mono mb-2">{value}</p>
      <button
        onClick={() => onCopy(label, tokenKey)}
        className="w-full text-xs flex items-center justify-center gap-1 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition-colors opacity-0 group-hover:opacity-100"
      >
        {isCopied ? (
          <><Check className="w-3 h-3" /> Copied!</>
        ) : (
          <><Copy className="w-3 h-3" /> Copy</>
        )}
      </button>
    </div>
  );
}
