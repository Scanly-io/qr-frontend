import { useState } from 'react';
import { Image, Video, Palette, Grid } from 'lucide-react';
import type { BackgroundStyle, BackgroundType, PatternType, GradientDirection } from '../../types/theme';
import type { LucideIcon } from 'lucide-react';

interface BackgroundPickerProps {
  value: BackgroundStyle;
  onChange: (background: BackgroundStyle) => void;
}

export function BackgroundPicker({ value, onChange }: BackgroundPickerProps) {
  const [activeTab, setActiveTab] = useState<BackgroundType>(value.type || 'solid');

  const tabs: Array<{ type: BackgroundType; icon: LucideIcon; label: string }> = [
    { type: 'solid', icon: Palette, label: 'Solid' },
    { type: 'gradient', icon: Palette, label: 'Gradient' },
    { type: 'pattern', icon: Grid, label: 'Pattern' },
    { type: 'image', icon: Image, label: 'Image' },
    { type: 'video', icon: Video, label: 'Video' },
  ];

  const updateBackground = (updates: Partial<BackgroundStyle>) => {
    onChange({ ...value, ...updates, type: activeTab });
  };

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-zinc-800 rounded-lg border border-zinc-700">
        {tabs.map((tab) => (
          <button
            key={tab.type}
            onClick={() => setActiveTab(tab.type)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold transition-all ${
              activeTab === tab.type
                ? 'bg-violet-600 text-white shadow'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-700'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Solid Color */}
      {activeTab === 'solid' && (
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide">Background Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={value.color || '#ffffff'}
              onChange={(e) => updateBackground({ color: e.target.value })}
              className="w-16 h-12 rounded-lg border-2 border-zinc-600 cursor-pointer bg-zinc-800"
            />
            <input
              type="text"
              value={value.color || '#ffffff'}
              onChange={(e) => updateBackground({ color: e.target.value })}
              className="flex-1 px-4 py-2 text-white bg-zinc-800 border-2 border-zinc-600 rounded-lg placeholder:text-zinc-500 focus:border-violet-500 focus:outline-none"
              placeholder="#ffffff"
            />
          </div>
        </div>
      )}

      {/* Gradient */}
      {activeTab === 'gradient' && (
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide">From Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={value.gradientFrom || '#667eea'}
                onChange={(e) => updateBackground({ gradientFrom: e.target.value })}
                className="w-16 h-12 rounded-lg border-2 border-zinc-600 cursor-pointer bg-zinc-800"
              />
              <input
                type="text"
                value={value.gradientFrom || '#667eea'}
                onChange={(e) => updateBackground({ gradientFrom: e.target.value })}
                className="flex-1 px-4 py-2 text-white bg-zinc-800 border-2 border-zinc-600 rounded-lg placeholder:text-zinc-500 focus:border-violet-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide">To Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={value.gradientTo || '#764ba2'}
                onChange={(e) => updateBackground({ gradientTo: e.target.value })}
                className="w-16 h-12 rounded-lg border-2 border-zinc-600 cursor-pointer bg-zinc-800"
              />
              <input
                type="text"
                value={value.gradientTo || '#764ba2'}
                onChange={(e) => updateBackground({ gradientTo: e.target.value })}
                className="flex-1 px-4 py-2 text-white bg-zinc-800 border-2 border-zinc-600 rounded-lg placeholder:text-zinc-500 focus:border-violet-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide">Via Color (Optional)</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={value.gradientVia || '#f093fb'}
                onChange={(e) => updateBackground({ gradientVia: e.target.value })}
                className="w-16 h-12 rounded-lg border-2 border-zinc-600 cursor-pointer bg-zinc-800"
              />
              <input
                type="text"
                value={value.gradientVia || ''}
                onChange={(e) => updateBackground({ gradientVia: e.target.value })}
                className="flex-1 px-4 py-2 text-white bg-zinc-800 border-2 border-zinc-600 rounded-lg placeholder:text-zinc-500 focus:border-violet-500 focus:outline-none"
                placeholder="Optional middle color"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide">Direction</label>
            <select
              value={value.gradientDirection || 'to-br'}
              onChange={(e) => updateBackground({ gradientDirection: e.target.value as GradientDirection })}
              className="w-full px-4 py-2.5 text-white bg-zinc-800 border-2 border-zinc-600 rounded-lg focus:border-violet-500 focus:outline-none"
            >
              <option value="to-t" className="bg-zinc-800">Top</option>
              <option value="to-b" className="bg-zinc-800">Bottom</option>
              <option value="to-l" className="bg-zinc-800">Left</option>
              <option value="to-r" className="bg-zinc-800">Right</option>
              <option value="to-br" className="bg-zinc-800">Bottom Right</option>
              <option value="to-tr" className="bg-zinc-800">Top Right</option>
              <option value="to-bl" className="bg-zinc-800">Bottom Left</option>
              <option value="to-tl" className="bg-zinc-800">Top Left</option>
            </select>
          </div>

          {/* Gradient Preview */}
          <div
            className="w-full h-24 rounded-lg border-2 border-zinc-600"
            style={{
              background: `linear-gradient(${value.gradientDirection || 'to-br'}, ${value.gradientFrom || '#667eea'}${value.gradientVia ? `, ${value.gradientVia}` : ''}, ${value.gradientTo || '#764ba2'})`,
            }}
          />
        </div>
      )}

      {/* Pattern */}
      {activeTab === 'pattern' && (
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide">Base Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={value.color || '#f9fafb'}
                onChange={(e) => updateBackground({ color: e.target.value })}
                className="w-16 h-12 rounded-lg border-2 border-zinc-600 cursor-pointer bg-zinc-800"
              />
              <input
                type="text"
                value={value.color || '#f9fafb'}
                onChange={(e) => updateBackground({ color: e.target.value })}
                className="flex-1 px-4 py-2 text-white bg-zinc-800 border-2 border-zinc-600 rounded-lg placeholder:text-zinc-500 focus:border-violet-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide">Pattern Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(['grid', 'dots', 'diagonal', 'waves', 'morph', 'organic'] as PatternType[]).map((pattern) => (
                <button
                  key={pattern}
                  onClick={() => updateBackground({ pattern })}
                  className={`px-4 py-3 border-2 rounded-lg capitalize transition-all text-sm ${
                    value.pattern === pattern
                      ? 'border-violet-500 bg-violet-900/30 text-violet-300 font-semibold'
                      : 'border-zinc-600 bg-zinc-800 text-zinc-300 hover:border-violet-500/50'
                  }`}
                >
                  {pattern}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide">Pattern Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={value.patternColor || '#e5e7eb'}
                onChange={(e) => updateBackground({ patternColor: e.target.value })}
                className="w-16 h-12 rounded-lg border-2 border-zinc-600 cursor-pointer bg-zinc-800"
              />
              <input
                type="text"
                value={value.patternColor || '#e5e7eb'}
                onChange={(e) => updateBackground({ patternColor: e.target.value })}
                className="flex-1 px-4 py-2 text-white bg-zinc-800 border-2 border-zinc-600 rounded-lg placeholder:text-zinc-500 focus:border-violet-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide">Pattern Opacity</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={value.patternOpacity || 0.5}
                onChange={(e) => updateBackground({ patternOpacity: parseFloat(e.target.value) })}
                className="flex-1 accent-violet-500"
              />
              <span className="text-sm font-semibold text-zinc-200 w-12 text-right">
                {((value.patternOpacity || 0.5) * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide">Pattern Size</label>
            <div className="grid grid-cols-3 gap-2">
              {['small', 'medium', 'large'].map((size) => (
                <button
                  key={size}
                  onClick={() => updateBackground({ patternSize: size as 'small' | 'medium' | 'large' })}
                  className={`px-4 py-3 border-2 rounded-lg capitalize transition-all text-sm ${
                    value.patternSize === size
                      ? 'border-violet-500 bg-violet-900/30 text-violet-300 font-semibold'
                      : 'border-zinc-600 bg-zinc-800 text-zinc-300 hover:border-violet-500/50'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Image */}
      {activeTab === 'image' && (
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide">Image URL</label>
            <input
              type="url"
              value={value.imageUrl || ''}
              onChange={(e) => updateBackground({ imageUrl: e.target.value })}
              className="w-full px-4 py-2.5 text-white bg-zinc-800 border-2 border-zinc-600 rounded-lg placeholder:text-zinc-500 focus:border-violet-500 focus:outline-none"
              placeholder="https://example.com/background.jpg"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide">Image Position</label>
            <select
              value={value.imagePosition || 'center'}
              onChange={(e) => updateBackground({ imagePosition: e.target.value as 'center' | 'top' | 'bottom' | 'left' | 'right' })}
              className="w-full px-4 py-2.5 text-white bg-zinc-800 border-2 border-zinc-600 rounded-lg focus:border-violet-500 focus:outline-none"
            >
              <option value="center" className="bg-zinc-800">Center</option>
              <option value="top" className="bg-zinc-800">Top</option>
              <option value="bottom" className="bg-zinc-800">Bottom</option>
              <option value="left" className="bg-zinc-800">Left</option>
              <option value="right" className="bg-zinc-800">Right</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide">Image Fit</label>
            <select
              value={value.imageFit || 'cover'}
              onChange={(e) => updateBackground({ imageFit: e.target.value as 'cover' | 'contain' | 'fill' })}
              className="w-full px-4 py-2.5 text-white bg-zinc-800 border-2 border-zinc-600 rounded-lg focus:border-violet-500 focus:outline-none"
            >
              <option value="cover" className="bg-zinc-800">Cover (Fill)</option>
              <option value="contain" className="bg-zinc-800">Contain (Fit)</option>
              <option value="fill" className="bg-zinc-800">Fill (Stretch)</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide">Image Opacity</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={value.imageOpacity || 1}
                onChange={(e) => updateBackground({ imageOpacity: parseFloat(e.target.value) })}
                className="flex-1 accent-violet-500"
              />
              <span className="text-sm font-semibold text-zinc-200 w-12 text-right">
                {((value.imageOpacity || 1) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Video */}
      {activeTab === 'video' && (
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide">Video URL</label>
            <input
              type="url"
              value={value.videoUrl || ''}
              onChange={(e) => updateBackground({ videoUrl: e.target.value })}
              className="w-full px-4 py-2.5 text-white bg-zinc-800 border-2 border-zinc-600 rounded-lg placeholder:text-zinc-500 focus:border-violet-500 focus:outline-none"
              placeholder="https://example.com/background.mp4"
            />
            <p className="text-xs text-zinc-500">
              Use a short, looping video (MP4 format recommended)
            </p>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide">Video Opacity</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={value.videoOpacity || 0.5}
                onChange={(e) => updateBackground({ videoOpacity: parseFloat(e.target.value) })}
                className="flex-1 accent-violet-500"
              />
              <span className="text-sm font-semibold text-zinc-200 w-12 text-right">
                {((value.videoOpacity || 0.5) * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex-shrink-0">
                <input
                  type="checkbox"
                  checked={value.videoLoop !== false}
                  onChange={(e) => updateBackground({ videoLoop: e.target.checked })}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 rounded-full transition-all duration-200 ${
                  value.videoLoop !== false
                    ? 'bg-violet-600 shadow-[0_0_0_1px_rgba(139,92,246,0.3)]' 
                    : 'bg-zinc-600 border border-zinc-500'
                }`} />
                <div className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full shadow-md transition-all duration-200 ${
                  value.videoLoop !== false
                    ? 'translate-x-5 bg-white' 
                    : 'translate-x-0 bg-zinc-300'
                }`} />
              </div>
              <span className="text-sm font-semibold text-zinc-200 group-hover:text-violet-300 transition-colors">Loop Video</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex-shrink-0">
                <input
                  type="checkbox"
                  checked={value.videoMuted !== false}
                  onChange={(e) => updateBackground({ videoMuted: e.target.checked })}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 rounded-full transition-all duration-200 ${
                  value.videoMuted !== false
                    ? 'bg-violet-600 shadow-[0_0_0_1px_rgba(139,92,246,0.3)]' 
                    : 'bg-zinc-600 border border-zinc-500'
                }`} />
                <div className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full shadow-md transition-all duration-200 ${
                  value.videoMuted !== false
                    ? 'translate-x-5 bg-white' 
                    : 'translate-x-0 bg-zinc-300'
                }`} />
              </div>
              <span className="text-sm font-semibold text-zinc-200 group-hover:text-violet-300 transition-colors">Mute Audio</span>
            </label>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide">Fallback Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={value.color || '#000000'}
                onChange={(e) => updateBackground({ color: e.target.value })}
                className="w-16 h-12 rounded-lg border-2 border-zinc-600 cursor-pointer bg-zinc-800"
              />
              <input
                type="text"
                value={value.color || '#000000'}
                onChange={(e) => updateBackground({ color: e.target.value })}
                className="flex-1 px-4 py-2.5 text-white bg-zinc-800 border-2 border-zinc-600 rounded-lg placeholder:text-zinc-500 focus:border-violet-500 focus:outline-none"
                placeholder="Fallback color while loading"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
