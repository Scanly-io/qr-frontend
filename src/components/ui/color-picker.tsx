import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HexColorPicker } from 'react-colorful';
import { Pipette, Palette, Copy, Check } from 'lucide-react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  onClose?: () => void;
  label?: string;
}

// Color presets organized by category - simplified to reduce scrolling
const COLOR_PRESETS = {
  'Popular': ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#EF4444', '#06B6D4', '#F97316'],
  'Neutrals': ['#000000', '#1F2937', '#6B7280', '#9CA3AF', '#D1D5DB', '#F3F4F6', '#F9FAFB', '#FFFFFF'],
  'Vibrant': ['#DC2626', '#F97316', '#FACC15', '#22C55E', '#14B8A6', '#3B82F6', '#A855F7', '#F43F5E'],
  'Light': ['#FEF2F2', '#FFF7ED', '#FEFCE8', '#F0FDF4', '#F0FDFA', '#EFF6FF', '#FAF5FF', '#FFF1F2'],
};

export function ColorPicker({ color, onChange, onClose, label }: ColorPickerProps) {
  const [localColor, setLocalColor] = useState(color);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'picker' | 'presets'>('picker');
  const pickerRef = useRef<HTMLDivElement>(null);

  // Update local color when prop changes
  useEffect(() => {
    setLocalColor(color);
  }, [color]);

  // Handle color change
  const handleColorChange = (newColor: string) => {
    setLocalColor(newColor);
    onChange(newColor);
  };

  // Copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(localColor.toUpperCase());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgb = hexToRgb(localColor);

  return (
    <div 
      ref={pickerRef}
      data-color-picker
      className="w-80 glass-card rounded-2xl shadow-glow-violet overflow-hidden animate-slide-up"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-violet-50 to-purple-50 border-b border-stone-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl shadow-md border-2 border-white ring-1 ring-violet-200" style={{ backgroundColor: localColor }} />
            <div>
              <p className="text-sm font-bold text-stone-900">{label || 'Color Picker'}</p>
              <p className="text-xs text-stone-600 font-mono">{localColor.toUpperCase()}</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl hover:bg-stone-200 flex items-center justify-center transition-all hover:scale-110"
            >
              <span className="text-stone-500 text-xl">×</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 bg-stone-50">
        <button
          onClick={() => setActiveTab('picker')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold transition-all ${
            activeTab === 'picker'
              ? 'bg-white text-violet-600 border-b-2 border-violet-600 shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
          }`}
        >
          <Pipette className="w-4 h-4" />
          <span>Picker</span>
        </button>
        <button
          onClick={() => setActiveTab('presets')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold transition-all ${
            activeTab === 'presets'
              ? 'bg-white text-violet-600 border-b-2 border-violet-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Presets</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        {activeTab === 'picker' ? (
          <div className="space-y-3">
            {/* Color Picker */}
            <div className="border-2 border-slate-200 rounded-lg overflow-hidden">
              <HexColorPicker 
                color={localColor} 
                onChange={handleColorChange}
                style={{ width: '100%', height: '160px' }}
              />
            </div>

            {/* Color Input */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">HEX</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={localColor.toUpperCase()}
                  onChange={(e) => {
                    const hex = e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`;
                    if (/^#[0-9A-F]{6}$/i.test(hex)) {
                      handleColorChange(hex);
                    }
                  }}
                  className="flex-1 px-3 py-2 border-2 border-slate-200 rounded-lg text-sm font-mono uppercase focus:border-violet-500 focus:outline-none"
                  maxLength={7}
                />
                <button
                  onClick={copyToClipboard}
                  className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
                </button>
              </div>
            </div>

            {/* RGB Values */}
            {rgb && (
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-50 rounded-lg p-2 text-center">
                  <p className="text-[10px] font-semibold text-slate-500 mb-1">RED</p>
                  <p className="text-sm font-bold text-slate-900">{rgb.r}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2 text-center">
                  <p className="text-[10px] font-semibold text-slate-500 mb-1">GREEN</p>
                  <p className="text-sm font-bold text-slate-900">{rgb.g}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2 text-center">
                  <p className="text-[10px] font-semibold text-slate-500 mb-1">BLUE</p>
                  <p className="text-sm font-bold text-slate-900">{rgb.b}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2.5 max-h-60 overflow-y-auto px-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 hover:scrollbar-thumb-slate-400">
            {Object.entries(COLOR_PRESETS).map(([category, colors]) => (
              colors.length > 0 && (
                <div key={category}>
                  <p className="text-xs font-semibold text-slate-600 mb-1.5">{category}</p>
                  <div className="grid grid-cols-8 gap-1.5">
                    {colors.map((presetColor) => (
                      <button
                        key={presetColor}
                        onClick={() => handleColorChange(presetColor)}
                        className={`w-8 h-8 rounded-lg border-2 transition-all hover:shadow-md ${
                          presetColor.toLowerCase() === localColor.toLowerCase()
                            ? 'border-violet-500 ring-2 ring-violet-200 shadow-md'
                            : 'border-slate-200 hover:border-violet-400'
                        }`}
                        style={{ backgroundColor: presetColor }}
                        title={presetColor}
                      />
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Simpler color input field with inline picker
interface ColorInputProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  description?: string;
}

export function ColorInput({ label, value, onChange, description }: ColorInputProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Calculate position when button is clicked
  const handleTogglePicker = () => {
    if (!showPicker && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const pickerHeight = 500; // Approximate picker height
      const pickerWidth = 320; // ColorPicker width (w-80 = 320px)
      
      let top = rect.bottom + 8; // 8px gap below button
      let left = rect.left;
      
      // If picker would go off bottom, show above instead
      if (top + pickerHeight > viewportHeight) {
        top = rect.top - pickerHeight - 8;
      }
      
      // If picker would go off right, align to right edge
      if (left + pickerWidth > viewportWidth) {
        left = viewportWidth - pickerWidth - 16; // 16px margin from edge
      }
      
      // Don't go off left edge
      if (left < 16) {
        left = 16;
      }
      
      setPickerPosition({ top, left });
    }
    setShowPicker(!showPicker);
  };

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Don't close if clicking inside the color picker container
      if (containerRef.current && containerRef.current.contains(target)) {
        return;
      }
      
      // Don't close if clicking inside the portal-rendered picker
      const pickerElement = document.querySelector('[data-color-picker]');
      if (pickerElement && pickerElement.contains(target)) {
        return;
      }
      
      // Close if clicking anywhere else
      setShowPicker(false);
    };

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showPicker]);

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-semibold text-slate-900 mb-2">
        {label}
      </label>
      {description && (
        <p className="text-xs text-slate-500 mb-2">{description}</p>
      )}
      <div className="flex gap-2">
        <button
          ref={buttonRef}
          onClick={handleTogglePicker}
          className="w-12 h-12 rounded-lg border-2 border-slate-200 hover:border-violet-400 transition-all shadow-sm hover:shadow-md"
          style={{ backgroundColor: value }}
          title="Click to change color"
        />
        <input
          type="text"
          value={value.toUpperCase()}
          onChange={(e) => {
            const hex = e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`;
            if (/^#[0-9A-F]{6}$/i.test(hex)) {
              onChange(hex);
            }
          }}
          className="flex-1 px-3 py-2 border-2 border-slate-200 rounded-lg text-sm font-mono uppercase focus:border-violet-500 focus:outline-none"
          placeholder="#000000"
          maxLength={7}
        />
      </div>

      {/* Color Picker Popover - Fixed positioning to avoid clipping */}
      {showPicker && createPortal(
        <div 
          className="fixed z-[10000]"
          style={{
            top: `${pickerPosition.top}px`,
            left: `${pickerPosition.left}px`,
          }}
        >
          <ColorPicker
            color={value}
            onChange={onChange}
            onClose={() => setShowPicker(false)}
            label={label}
          />
        </div>,
        document.body
      )}
    </div>
  );
}
