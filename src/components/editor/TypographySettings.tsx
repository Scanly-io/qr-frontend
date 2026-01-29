import { useState } from 'react';
import { Type, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import type { TypographyStyle, FontFamily } from '../../types/theme';
import { GOOGLE_FONTS, loadGoogleFont } from '../../types/theme';

interface TypographySettingsProps {
  value: TypographyStyle;
  onChange: (typography: TypographyStyle) => void;
}

export function TypographySettings({ value, onChange }: TypographySettingsProps) {
  const [section, setSection] = useState<'title' | 'body' | 'links'>('title');

  const updateTypography = (updates: Partial<TypographyStyle>) => {
    onChange({ ...value, ...updates });
  };

  const handleFontChange = (fontKey: 'titleFont' | 'bodyFont', font: FontFamily) => {
    loadGoogleFont(font);
    updateTypography({ [fontKey]: font });
  };

  return (
    <div className="space-y-4">
      {/* Section Tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        {[
          { key: 'title', label: 'Title', icon: Type },
          { key: 'body', label: 'Body', icon: Type },
          { key: 'links', label: 'Links', icon: Type },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSection(tab.key as 'title' | 'body' | 'links')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-foreground transition-colors ${
              section === tab.key
                ? 'bg-primary text-white'
                : 'bg-secondary hover:bg-secondary/80'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Title Settings */}
      {section === 'title' && (
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-foreground">Title Font</label>
            <select
              value={value.titleFont || 'inter'}
              onChange={(e) => handleFontChange('titleFont', e.target.value as FontFamily)}
              className="w-full px-4 py-2 border-2 border-border rounded-lg"
              style={{ fontFamily: value.titleFont ? GOOGLE_FONTS[value.titleFont].name : 'Inter' }}
            >
              {Object.entries(GOOGLE_FONTS).map(([key, font]) => (
                <option key={key} value={key} style={{ fontFamily: font.name }}>
                  {font.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-foreground">Title Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={value.titleColor || '#1f2937'}
                onChange={(e) => updateTypography({ titleColor: e.target.value })}
                className="w-16 h-12 rounded-lg border-2 border-border cursor-pointer"
              />
              <input
                type="text"
                value={value.titleColor || '#1f2937'}
                onChange={(e) => updateTypography({ titleColor: e.target.value })}
                className="flex-1 px-4 py-2 border-2 border-border rounded-lg"
                placeholder="#1f2937"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-foreground">Title Size</label>
            <div className="grid grid-cols-5 gap-2">
              {['small', 'medium', 'large', 'xl', '2xl'].map((size) => (
                <button
                  key={size}
                  onClick={() => updateTypography({ titleSize: size as 'small' | 'medium' | 'large' | 'xl' | '2xl' })}
                  className={`px-3 py-2 border-2 rounded-lg text-xs font-medium transition-all ${
                    value.titleSize === size
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {size.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-foreground">Title Weight</label>
            <div className="grid grid-cols-5 gap-2">
              {['400', '500', '600', '700', '800'].map((weight) => (
                <button
                  key={weight}
                  onClick={() => updateTypography({ titleWeight: weight as '400' | '500' | '600' | '700' | '800' })}
                  className={`px-3 py-2 border-2 rounded-lg text-xs font-medium transition-all ${
                    value.titleWeight === weight
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                  style={{ fontWeight: weight }}
                >
                  {weight}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-foreground">Title Alignment</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'left', icon: AlignLeft },
                { value: 'center', icon: AlignCenter },
                { value: 'right', icon: AlignRight },
              ].map((align) => (
                <button
                  key={align.value}
                  onClick={() => updateTypography({ titleAlign: align.value as 'left' | 'center' | 'right' })}
                  className={`flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg transition-all ${
                    value.titleAlign === align.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <align.icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Body Settings */}
      {section === 'body' && (
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-foreground">Body Font</label>
            <select
              value={value.bodyFont || 'inter'}
              onChange={(e) => handleFontChange('bodyFont', e.target.value as FontFamily)}
              className="w-full px-4 py-2 border-2 border-border rounded-lg"
              style={{ fontFamily: value.bodyFont ? GOOGLE_FONTS[value.bodyFont].name : 'Inter' }}
            >
              {Object.entries(GOOGLE_FONTS).map(([key, font]) => (
                <option key={key} value={key} style={{ fontFamily: font.name }}>
                  {font.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-foreground">Body Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={value.bodyColor || '#6b7280'}
                onChange={(e) => updateTypography({ bodyColor: e.target.value })}
                className="w-16 h-12 rounded-lg border-2 border-border cursor-pointer"
              />
              <input
                type="text"
                value={value.bodyColor || '#6b7280'}
                onChange={(e) => updateTypography({ bodyColor: e.target.value })}
                className="flex-1 px-4 py-2 border-2 border-border rounded-lg"
                placeholder="#6b7280"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-foreground">Body Size</label>
            <div className="grid grid-cols-4 gap-2">
              {['xs', 'small', 'medium', 'large'].map((size) => (
                <button
                  key={size}
                  onClick={() => updateTypography({ bodySize: size as 'xs' | 'small' | 'medium' | 'large' })}
                  className={`px-3 py-2 border-2 rounded-lg text-xs font-medium capitalize transition-all ${
                    value.bodySize === size
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-foreground">Body Weight</label>
            <div className="grid grid-cols-3 gap-2">
              {['400', '500', '600'].map((weight) => (
                <button
                  key={weight}
                  onClick={() => updateTypography({ bodyWeight: weight as '400' | '500' | '600' })}
                  className={`px-3 py-2 border-2 rounded-lg text-xs font-medium transition-all ${
                    value.bodyWeight === weight
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                  style={{ fontWeight: weight }}
                >
                  {weight}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-foreground">Body Alignment</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'left', icon: AlignLeft },
                { value: 'center', icon: AlignCenter },
                { value: 'right', icon: AlignRight },
              ].map((align) => (
                <button
                  key={align.value}
                  onClick={() => updateTypography({ bodyAlign: align.value as 'left' | 'center' | 'right' })}
                  className={`flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg transition-all ${
                    value.bodyAlign === align.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <align.icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Link Settings */}
      {section === 'links' && (
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-foreground">Link Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={value.linkColor || '#3B82F6'}
                onChange={(e) => updateTypography({ linkColor: e.target.value })}
                className="w-16 h-12 rounded-lg border-2 border-border cursor-pointer"
              />
              <input
                type="text"
                value={value.linkColor || '#3B82F6'}
                onChange={(e) => updateTypography({ linkColor: e.target.value })}
                className="flex-1 px-4 py-2 border-2 border-border rounded-lg"
                placeholder="#3B82F6"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-foreground">Link Hover Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={value.linkHoverColor || '#2563EB'}
                onChange={(e) => updateTypography({ linkHoverColor: e.target.value })}
                className="w-16 h-12 rounded-lg border-2 border-border cursor-pointer"
              />
              <input
                type="text"
                value={value.linkHoverColor || '#2563EB'}
                onChange={(e) => updateTypography({ linkHoverColor: e.target.value })}
                className="flex-1 px-4 py-2 border-2 border-border rounded-lg"
                placeholder="#2563EB"
              />
            </div>
          </div>

          {/* Link Preview */}
          <div className="p-4 bg-secondary rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Preview:</p>
            <a
              href="#"
              className="text-base font-medium transition-colors"
              style={{
                color: value.linkColor || '#3B82F6',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = value.linkHoverColor || '#2563EB';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = value.linkColor || '#3B82F6';
              }}
            >
              Sample Link Text
            </a>
          </div>
        </div>
      )}

      {/* Live Preview */}
      <div className="p-6 bg-secondary rounded-lg space-y-3">
        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Live Preview</p>
        <h2
          className="transition-all"
          style={{
            fontFamily: value.titleFont ? GOOGLE_FONTS[value.titleFont].name : 'Inter',
            color: value.titleColor || '#1f2937',
            fontSize: value.titleSize === 'small' ? '1.25rem' : value.titleSize === 'medium' ? '1.5rem' : value.titleSize === 'large' ? '1.875rem' : value.titleSize === 'xl' ? '2.25rem' : '3rem',
            fontWeight: value.titleWeight || '700',
            textAlign: value.titleAlign || 'center',
          }}
        >
          Your Page Title
        </h2>
        <p
          className="transition-all"
          style={{
            fontFamily: value.bodyFont ? GOOGLE_FONTS[value.bodyFont].name : 'Inter',
            color: value.bodyColor || '#6b7280',
            fontSize: value.bodySize === 'xs' ? '0.75rem' : value.bodySize === 'small' ? '0.875rem' : value.bodySize === 'medium' ? '1rem' : '1.125rem',
            fontWeight: value.bodyWeight || '400',
            textAlign: value.bodyAlign || 'center',
          }}
        >
          This is how your body text will look. You can customize the font, color, size, and weight to match your brand.
        </p>
      </div>
    </div>
  );
}
