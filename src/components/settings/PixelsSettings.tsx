/**
 * Pixels Settings Component
 * Manage retargeting pixels for ad platforms
 */

import { useState, useEffect } from 'react';
import { 
  Target, 
  Plus, 
  Trash2, 
  Loader2,
  Info
} from 'lucide-react';
import { pixelsApi } from '../../lib/api';
import type { Pixel, PixelPlatform } from '../../lib/api';

const platformConfig: Record<PixelPlatform, {
  name: string;
  bg: string;
  icon: string;
  placeholder: string;
  helpUrl: string;
}> = {
  facebook: { 
    name: 'Facebook Pixel', 
    bg: 'bg-blue-100', 
    icon: '📘', 
    placeholder: 'Enter Facebook Pixel ID',
    helpUrl: 'https://www.facebook.com/business/help/952192354843755'
  },
  google_ads: { 
    name: 'Google Ads', 
    bg: 'bg-yellow-100', 
    icon: '📊', 
    placeholder: 'Enter Google Ads Conversion ID',
    helpUrl: 'https://support.google.com/google-ads/answer/7548399'
  },
  google_analytics: { 
    name: 'Google Analytics', 
    bg: 'bg-orange-100', 
    icon: '📈', 
    placeholder: 'Enter GA4 Measurement ID (G-XXXXX)',
    helpUrl: 'https://support.google.com/analytics/answer/9539598'
  },
  tiktok: { 
    name: 'TikTok Pixel', 
    bg: 'bg-black', 
    icon: '🎵', 
    placeholder: 'Enter TikTok Pixel ID',
    helpUrl: 'https://ads.tiktok.com/help/article?aid=10021'
  },
  linkedin: { 
    name: 'LinkedIn Insight Tag', 
    bg: 'bg-blue-100', 
    icon: '💼', 
    placeholder: 'Enter LinkedIn Partner ID',
    helpUrl: 'https://www.linkedin.com/help/lms/answer/a418880'
  },
  twitter: { 
    name: 'Twitter Pixel', 
    bg: 'bg-sky-100', 
    icon: '🐦', 
    placeholder: 'Enter Twitter Pixel ID',
    helpUrl: 'https://business.twitter.com/en/help/campaign-measurement-and-analytics/conversion-tracking-for-websites.html'
  },
  snapchat: { 
    name: 'Snapchat Pixel', 
    bg: 'bg-yellow-100', 
    icon: '👻', 
    placeholder: 'Enter Snap Pixel ID',
    helpUrl: 'https://businesshelp.snapchat.com/s/article/snap-pixel-about'
  },
  pinterest: { 
    name: 'Pinterest Tag', 
    bg: 'bg-red-100', 
    icon: '📌', 
    placeholder: 'Enter Pinterest Tag ID',
    helpUrl: 'https://help.pinterest.com/en/business/article/install-the-pinterest-tag'
  },
  custom: { 
    name: 'Custom Pixel', 
    bg: 'bg-gray-100', 
    icon: '🔧', 
    placeholder: 'Enter Custom Pixel ID',
    helpUrl: ''
  },
};

export function PixelsSettings() {
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPixel, setShowAddPixel] = useState(false);
  const [newPixel, setNewPixel] = useState<{
    platform: PixelPlatform;
    name: string;
    pixelId: string;
  }>({ platform: 'facebook', name: '', pixelId: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadPixels();
  }, []);

  const loadPixels = async () => {
    try {
      setLoading(true);
      const res = await pixelsApi.listPixels();
      setPixels(res.pixels);
    } catch (error) {
      console.error('Failed to load pixels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePixel = async () => {
    if (!newPixel.name || !newPixel.pixelId) return;
    
    try {
      setIsSubmitting(true);
      const pixel = await pixelsApi.createPixel({
        platform: newPixel.platform,
        name: newPixel.name,
        pixelId: newPixel.pixelId,
      });
      setPixels(prev => [...prev, pixel]);
      setNewPixel({ platform: 'facebook', name: '', pixelId: '' });
      setShowAddPixel(false);
    } catch (error) {
      console.error('Failed to create pixel:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePixel = async (pixelId: string) => {
    if (!confirm('Are you sure you want to delete this pixel?')) return;
    
    try {
      await pixelsApi.deletePixel(pixelId);
      setPixels(prev => prev.filter(p => p.id !== pixelId));
    } catch (error) {
      console.error('Failed to delete pixel:', error);
    }
  };

  const handleTogglePixel = async (pixel: Pixel) => {
    try {
      const updated = await pixelsApi.togglePixel(pixel.id, !pixel.isActive);
      setPixels(prev => prev.map(p => p.id === updated.id ? updated : p));
    } catch (error) {
      console.error('Failed to toggle pixel:', error);
    }
  };

  const handleTestPixel = async (pixelId: string) => {
    try {
      const result = await pixelsApi.testPixel(pixelId);
      alert(result.success ? 'Pixel test successful!' : `Pixel test failed: ${result.message}`);
    } catch (error) {
      console.error('Failed to test pixel:', error);
      alert('Failed to test pixel');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border shadow-sm p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-white/20 rounded-lg">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Retargeting Pixels</h2>
            <p className="text-purple-100 mt-1">
              Add tracking pixels to retarget visitors who scan your QR codes across Facebook, Google, TikTok, and more.
            </p>
          </div>
        </div>
      </div>

      {/* Pixels List */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Your Pixels</h2>
            <p className="text-sm text-gray-500 mt-1">
              {pixels.length} pixel{pixels.length !== 1 ? 's' : ''} configured
            </p>
          </div>
          <button
            onClick={() => setShowAddPixel(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Pixel
          </button>
        </div>

        {/* Add Pixel Form */}
        {showAddPixel && (
          <div className="p-6 border-b bg-gray-50">
            <h4 className="font-medium text-gray-900 mb-4">Add New Pixel</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                <select
                  value={newPixel.platform}
                  onChange={(e) => setNewPixel(prev => ({ ...prev, platform: e.target.value as PixelPlatform }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {Object.entries(platformConfig).map(([key, config]) => (
                    <option key={key} value={key}>{config.icon} {config.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newPixel.name}
                  onChange={(e) => setNewPixel(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="My Facebook Pixel"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Pixel ID</label>
                <input
                  type="text"
                  value={newPixel.pixelId}
                  onChange={(e) => setNewPixel(prev => ({ ...prev, pixelId: e.target.value }))}
                  placeholder={platformConfig[newPixel.platform].placeholder}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                {platformConfig[newPixel.platform].helpUrl && (
                  <a 
                    href={platformConfig[newPixel.platform].helpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 mt-1"
                  >
                    <Info className="w-3 h-3" />
                    How to find your {platformConfig[newPixel.platform].name}
                  </a>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleCreatePixel}
                disabled={!newPixel.name || !newPixel.pixelId || isSubmitting}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Add Pixel'}
              </button>
              <button
                onClick={() => {
                  setShowAddPixel(false);
                  setNewPixel({ platform: 'facebook', name: '', pixelId: '' });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Pixels Grid */}
        <div className="p-6">
          {pixels.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pixels configured</h3>
              <p className="text-gray-500 mb-4">Add your first tracking pixel to start retargeting visitors</p>
              <button
                onClick={() => setShowAddPixel(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Your First Pixel
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {pixels.map((pixel) => {
                const config = platformConfig[pixel.platform];
                return (
                  <div 
                    key={pixel.id}
                    className={`p-4 border rounded-lg ${pixel.isActive ? 'border-green-200 bg-green-50/50' : 'border-gray-200'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center text-xl`}>
                          {config.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900">{pixel.name}</h4>
                            <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                              pixel.isActive 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {pixel.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">{config.name}</p>
                          <p className="text-xs font-mono text-gray-400 mt-1">{pixel.pixelId}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                      <button
                        onClick={() => handleTestPixel(pixel.id)}
                        className="flex-1 px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        Test
                      </button>
                      <button
                        onClick={() => handleTogglePixel(pixel)}
                        className={`flex-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                          pixel.isActive 
                            ? 'text-yellow-600 hover:bg-yellow-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                      >
                        {pixel.isActive ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        onClick={() => handleDeletePixel(pixel.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
