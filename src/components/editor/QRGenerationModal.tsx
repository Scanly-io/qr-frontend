/**
 * QR Generation Modal - Enhanced with Styling Options
 * 
 * Features:
 * - Generate new QR code with custom styling
 * - Customize colors (foreground, background)
 * - Adjust size and error correction level
 * - Add logo/image to center (future)
 * - Download in multiple formats (PNG, SVG)
 * - Live preview
 */

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, Copy, Check, Loader2, QrCode, ExternalLink, Palette, Sliders } from 'lucide-react';
import { micrositeApi } from '@/lib/api';

interface QRGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  micrositeId: string;
  micrositeName: string;
  existingQrId?: string;
  onQRGenerated?: (qrId: string, qrUrl: string) => void;
}

// QR Style Options
interface QRStyle {
  fgColor: string; // Foreground color (QR code dots)
  bgColor: string; // Background color
  size: number; // QR code size in pixels
  level: 'L' | 'M' | 'Q' | 'H'; // Error correction level
}

const DEFAULT_STYLE: QRStyle = {
  fgColor: '#000000',
  bgColor: '#FFFFFF',
  size: 256,
  level: 'H'
};

const ERROR_CORRECTION_LEVELS = [
  { value: 'L', label: 'Low', description: '~7% correction' },
  { value: 'M', label: 'Medium', description: '~15% correction' },
  { value: 'Q', label: 'Quartile', description: '~25% correction' },
  { value: 'H', label: 'High', description: '~30% correction' }
];

const PRESET_COLORS = [
  { name: 'Classic', fg: '#000000', bg: '#FFFFFF' },
  { name: 'Violet', fg: '#7C3AED', bg: '#F5F3FF' },
  { name: 'Blue', fg: '#2563EB', bg: '#EFF6FF' },
  { name: 'Green', fg: '#059669', bg: '#ECFDF5' },
  { name: 'Red', fg: '#DC2626', bg: '#FEF2F2' },
  { name: 'Orange', fg: '#EA580C', bg: '#FFF7ED' },
];

export default function QRGenerationModal({
  isOpen,
  onClose,
  micrositeId,
  micrositeName,
  existingQrId,
  onQRGenerated
}: QRGenerationModalProps) {
  const [qrId, setQrId] = useState<string>(existingQrId || '');
  const [qrUrl, setQrUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>('');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedQrId, setCopiedQrId] = useState(false);
  
  // QR Style State
  const [qrStyle, setQrStyle] = useState<QRStyle>(DEFAULT_STYLE);
  const [showStylePanel, setShowStylePanel] = useState(false);

  // Set URL when modal opens with existing QR
  useEffect(() => {
    if (existingQrId) {
      // Use the frontend URL (not the API URL) so the React-rendered
      // PublicMicrositePage handles the display — identical to preview.
      const baseUrl = window.location.origin;
      const targetUrl = `${baseUrl}/public/${existingQrId}`;
      setQrId(existingQrId);
      setQrUrl(targetUrl);
    }
  }, [existingQrId, micrositeId]);

  // Generate QR code
  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');

    try {
      console.log('🔵 Generating QR code...', {
        micrositeId,
        micrositeName,
        existingQrId
      });

      // Call microsite service to generate QR (uses pure JS qrcode library, no canvas needed)
      const result = await micrositeApi.generateQr(micrositeId);

      console.log('✅ QR code generated:', result);

      setQrId(result.qrId);
      setQrUrl(result.publicUrl);

      // Notify parent component
      if (onQRGenerated) {
        onQRGenerated(result.qrId, result.publicUrl);
      }
    } catch (err) {
      console.error('❌ Failed to generate QR:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate QR code');
    } finally {
      setIsGenerating(false);
    }
  };

  // Download QR code as PNG
  const handleDownload = () => {
    const svg = document.getElementById('qr-code-preview') as unknown as SVGElement;
    if (!svg) return;

    // Convert SVG to PNG using canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      // Download as PNG
      canvas.toBlob((blob) => {
        if (!blob) return;
        const link = document.createElement('a');
        link.download = `qr-${qrId || micrositeId}.png`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
      });
    };

    img.src = url;
  };

  // Clipboard fallback for non-HTTPS contexts
  const copyToClipboard = async (text: string): Promise<void> => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback: use a temporary textarea
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  };

  // Copy URL to clipboard
  const handleCopyUrl = async () => {
    try {
      await copyToClipboard(qrUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  // Copy QR ID to clipboard
  const handleCopyQrId = async () => {
    try {
      await copyToClipboard(qrId);
      setCopiedQrId(true);
      setTimeout(() => setCopiedQrId(false), 2000);
    } catch (err) {
      console.error('Failed to copy QR ID:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Generate QR Code</h2>
              <p className="text-sm text-gray-600">Create a scannable QR for your microsite</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Microsite Info */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shrink-0">
                <ExternalLink className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700">Microsite</p>
                <p className="text-base font-semibold text-gray-900 truncate">{micrositeName}</p>
                <p className="text-xs text-gray-600 mt-1">ID: {micrositeId}</p>
              </div>
            </div>
          </div>

          {/* Generate Button (if not generated yet) */}
          {!qrId && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-6">
                Generate a QR code for this microsite. Users can scan it to view your content.
              </p>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <QrCode className="w-5 h-5" />
                    Generate QR Code
                  </>
                )}
              </button>
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>
          )}

          {/* QR Code Preview */}
          {qrId && qrUrl && (
            <div className="space-y-4">
              {/* Style Customization Panel */}
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-200">
                <button
                  onClick={() => setShowStylePanel(!showStylePanel)}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <div className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-violet-600" />
                    <h3 className="font-semibold text-gray-900">Customize Style</h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-violet-600 transition-transform ${showStylePanel ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showStylePanel && (
                  <div className="space-y-4 pt-2">
                    {/* Color Presets */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Color Presets</label>
                      <div className="grid grid-cols-3 gap-2">
                        {PRESET_COLORS.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => setQrStyle({ ...qrStyle, fgColor: preset.fg, bgColor: preset.bg })}
                            className="flex items-center gap-2 p-2 border-2 border-gray-200 rounded-lg hover:border-violet-400 transition-colors"
                          >
                            <div className="flex gap-1">
                              <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.fg }} />
                              <div className="w-4 h-4 rounded border border-gray-300" style={{ backgroundColor: preset.bg }} />
                            </div>
                            <span className="text-xs font-medium text-gray-700">{preset.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Colors */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Foreground Color
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={qrStyle.fgColor}
                            onChange={(e) => setQrStyle({ ...qrStyle, fgColor: e.target.value })}
                            className="h-10 w-16 rounded border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={qrStyle.fgColor}
                            onChange={(e) => setQrStyle({ ...qrStyle, fgColor: e.target.value })}
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg font-mono"
                            placeholder="#000000"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Background Color
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={qrStyle.bgColor}
                            onChange={(e) => setQrStyle({ ...qrStyle, bgColor: e.target.value })}
                            className="h-10 w-16 rounded border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={qrStyle.bgColor}
                            onChange={(e) => setQrStyle({ ...qrStyle, bgColor: e.target.value })}
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg font-mono"
                            placeholder="#FFFFFF"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Size Slider */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Sliders className="w-4 h-4" />
                            Size
                          </span>
                          <span className="text-violet-600">{qrStyle.size}px</span>
                        </div>
                      </label>
                      <input
                        type="range"
                        min="128"
                        max="512"
                        step="32"
                        value={qrStyle.size}
                        onChange={(e) => setQrStyle({ ...qrStyle, size: parseInt(e.target.value) })}
                        className="w-full h-2 bg-violet-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>128px</span>
                        <span>512px</span>
                      </div>
                    </div>

                    {/* Error Correction */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Error Correction Level
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {ERROR_CORRECTION_LEVELS.map((level) => (
                          <button
                            key={level.value}
                            onClick={() => setQrStyle({ ...qrStyle, level: level.value as QRStyle['level'] })}
                            className={`p-2 border-2 rounded-lg text-center transition-all ${
                              qrStyle.level === level.value
                                ? 'border-violet-600 bg-violet-50 text-violet-900'
                                : 'border-gray-200 hover:border-gray-300 text-gray-700'
                            }`}
                          >
                            <div className="font-bold text-sm">{level.label}</div>
                            <div className="text-xs text-gray-500">{level.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* QR Code Display */}
              <div className="flex justify-center rounded-xl p-8" style={{ backgroundColor: qrStyle.bgColor }}>
                <QRCodeSVG
                  id="qr-code-preview"
                  value={qrUrl}
                  size={qrStyle.size}
                  level={qrStyle.level}
                  fgColor={qrStyle.fgColor}
                  bgColor={qrStyle.bgColor}
                  includeMargin={true}
                />
              </div>

              {/* QR Details */}
              <div className="space-y-3">
                {/* QR ID */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">QR Code ID</label>
                    <button
                      onClick={handleCopyQrId}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      {copiedQrId ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <code className="text-sm font-mono text-gray-900 break-all">{qrId}</code>
                </div>

                {/* Public URL */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Public URL</label>
                    <button
                      onClick={handleCopyUrl}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      {copiedUrl ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <code className="text-sm font-mono text-gray-900 break-all">{qrUrl}</code>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleDownload}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download PNG
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Regenerating...
                    </>
                  ) : (
                    <>
                      <QrCode className="w-5 h-5" />
                      Regenerate
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
