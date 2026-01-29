/**
 * UTM Link Builder Component
 * 
 * Visual tool for creating UTM-tagged URLs for marketing campaigns.
 * Supports all standard UTM parameters with presets for common sources.
 */

import { useState, useMemo } from 'react';
import { 
  Link2, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles,
  RotateCcw,
  QrCode,
  ChevronDown,
  Globe,
  Target,
  Megaphone,
  Search,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Common UTM source presets
const SOURCE_PRESETS = [
  { value: 'facebook', label: 'Facebook', icon: '📘', color: 'bg-blue-100 text-blue-700' },
  { value: 'instagram', label: 'Instagram', icon: '📸', color: 'bg-pink-100 text-pink-700' },
  { value: 'twitter', label: 'Twitter/X', icon: '🐦', color: 'bg-sky-100 text-sky-700' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼', color: 'bg-blue-100 text-blue-700' },
  { value: 'tiktok', label: 'TikTok', icon: '🎵', color: 'bg-gray-100 text-gray-700' },
  { value: 'youtube', label: 'YouTube', icon: '▶️', color: 'bg-red-100 text-red-700' },
  { value: 'email', label: 'Email', icon: '📧', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'google', label: 'Google', icon: '🔍', color: 'bg-green-100 text-green-700' },
  { value: 'newsletter', label: 'Newsletter', icon: '📰', color: 'bg-purple-100 text-purple-700' },
  { value: 'qr_code', label: 'QR Code', icon: '📱', color: 'bg-indigo-100 text-indigo-700' },
];

// Common UTM medium presets
const MEDIUM_PRESETS = [
  { value: 'social', label: 'Social' },
  { value: 'cpc', label: 'CPC (Paid)' },
  { value: 'email', label: 'Email' },
  { value: 'organic', label: 'Organic' },
  { value: 'referral', label: 'Referral' },
  { value: 'display', label: 'Display' },
  { value: 'affiliate', label: 'Affiliate' },
  { value: 'qr', label: 'QR Code' },
];

interface UTMParams {
  url: string;
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
}

export function UTMBuilder() {
  const [params, setParams] = useState<UTMParams>({
    url: '',
    source: '',
    medium: '',
    campaign: '',
    term: '',
    content: '',
  });
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Generate the final URL with UTM parameters
  const generatedUrl = useMemo(() => {
    if (!params.url) return '';
    
    try {
      // Validate and normalize URL
      let baseUrl = params.url;
      if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
        baseUrl = 'https://' + baseUrl;
      }
      
      const url = new URL(baseUrl);
      
      // Add UTM parameters
      if (params.source) url.searchParams.set('utm_source', params.source);
      if (params.medium) url.searchParams.set('utm_medium', params.medium);
      if (params.campaign) url.searchParams.set('utm_campaign', params.campaign);
      if (params.term) url.searchParams.set('utm_term', params.term);
      if (params.content) url.searchParams.set('utm_content', params.content);
      
      return url.toString();
    } catch {
      return '';
    }
  }, [params]);

  // Check if URL is valid
  const isValidUrl = useMemo(() => {
    if (!params.url) return false;
    try {
      let testUrl = params.url;
      if (!testUrl.startsWith('http://') && !testUrl.startsWith('https://')) {
        testUrl = 'https://' + testUrl;
      }
      new URL(testUrl);
      return true;
    } catch {
      return false;
    }
  }, [params.url]);

  // Copy to clipboard
  const handleCopy = async () => {
    if (!generatedUrl) return;
    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Reset form
  const handleReset = () => {
    setParams({
      url: '',
      source: '',
      medium: '',
      campaign: '',
      term: '',
      content: '',
    });
  };

  // Update a single param
  const updateParam = (key: keyof UTMParams, value: string) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  // Generate campaign suggestion based on source
  const suggestCampaign = () => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const source = params.source || 'campaign';
    return `${source}_${date}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Link2 className="w-6 h-6 text-indigo-600" />
            UTM Link Builder
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Create trackable URLs for your marketing campaigns
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Campaign Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Destination URL */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                <ExternalLink className="w-4 h-4" />
                Destination URL *
              </label>
              <Input
                placeholder="https://example.com/landing-page"
                value={params.url}
                onChange={(e) => updateParam('url', e.target.value)}
                className={!isValidUrl && params.url ? 'border-red-300' : ''}
              />
              {!isValidUrl && params.url && (
                <p className="text-xs text-red-500 mt-1">Please enter a valid URL</p>
              )}
            </div>

            {/* Source */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                <Target className="w-4 h-4" />
                Campaign Source (utm_source) *
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {SOURCE_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => updateParam('source', preset.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      params.source === preset.value
                        ? 'bg-indigo-600 text-white'
                        : preset.color + ' hover:opacity-80'
                    }`}
                  >
                    <span className="mr-1">{preset.icon}</span>
                    {preset.label}
                  </button>
                ))}
              </div>
              <Input
                placeholder="e.g., facebook, newsletter, partner_site"
                value={params.source}
                onChange={(e) => updateParam('source', e.target.value)}
              />
            </div>

            {/* Medium */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                <Megaphone className="w-4 h-4" />
                Campaign Medium (utm_medium) *
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {MEDIUM_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => updateParam('medium', preset.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      params.medium === preset.value
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <Input
                placeholder="e.g., social, cpc, email, banner"
                value={params.medium}
                onChange={(e) => updateParam('medium', e.target.value)}
              />
            </div>

            {/* Campaign Name */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4" />
                Campaign Name (utm_campaign) *
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., summer_sale, product_launch"
                  value={params.campaign}
                  onChange={(e) => updateParam('campaign', e.target.value)}
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => updateParam('campaign', suggestCampaign())}
                  className="shrink-0"
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  Suggest
                </Button>
              </div>
            </div>

            {/* Advanced Fields Toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
              {showAdvanced ? 'Hide' : 'Show'} Advanced Options
            </button>

            {/* Advanced Fields */}
            {showAdvanced && (
              <div className="space-y-4 pt-2 border-t border-gray-100">
                {/* Term */}
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                    <Search className="w-4 h-4" />
                    Campaign Term (utm_term)
                    <Badge variant="outline" className="text-xs">Optional</Badge>
                  </label>
                  <Input
                    placeholder="e.g., running+shoes (for paid search keywords)"
                    value={params.term}
                    onChange={(e) => updateParam('term', e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use for paid search to identify keywords
                  </p>
                </div>

                {/* Content */}
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4" />
                    Campaign Content (utm_content)
                    <Badge variant="outline" className="text-xs">Optional</Badge>
                  </label>
                  <Input
                    placeholder="e.g., header_banner, sidebar_cta, variant_a"
                    value={params.content}
                    onChange={(e) => updateParam('content', e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use for A/B testing or differentiating similar links
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Generated URL Preview */}
        <div className="space-y-4">
          <Card className={generatedUrl ? 'border-indigo-200 bg-indigo-50/50' : ''}>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Link2 className="w-5 h-5" />
                Generated URL
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedUrl ? (
                <div className="space-y-4">
                  {/* URL Preview */}
                  <div className="p-4 bg-white rounded-lg border border-indigo-200 break-all font-mono text-sm">
                    {generatedUrl}
                  </div>

                  {/* Copy Button */}
                  <div className="flex gap-2">
                    <Button onClick={handleCopy} className="flex-1">
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy URL
                        </>
                      )}
                    </Button>
                    <Button variant="outline" asChild>
                      <a href={generatedUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Test
                      </a>
                    </Button>
                  </div>

                  {/* URL Breakdown */}
                  <div className="pt-4 border-t border-indigo-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Parameter Breakdown</h4>
                    <div className="space-y-2">
                      {params.source && (
                        <div className="flex items-center gap-2 text-sm">
                          <Badge className="bg-blue-100 text-blue-700">utm_source</Badge>
                          <span className="text-gray-600">{params.source}</span>
                        </div>
                      )}
                      {params.medium && (
                        <div className="flex items-center gap-2 text-sm">
                          <Badge className="bg-green-100 text-green-700">utm_medium</Badge>
                          <span className="text-gray-600">{params.medium}</span>
                        </div>
                      )}
                      {params.campaign && (
                        <div className="flex items-center gap-2 text-sm">
                          <Badge className="bg-purple-100 text-purple-700">utm_campaign</Badge>
                          <span className="text-gray-600">{params.campaign}</span>
                        </div>
                      )}
                      {params.term && (
                        <div className="flex items-center gap-2 text-sm">
                          <Badge className="bg-yellow-100 text-yellow-700">utm_term</Badge>
                          <span className="text-gray-600">{params.term}</span>
                        </div>
                      )}
                      {params.content && (
                        <div className="flex items-center gap-2 text-sm">
                          <Badge className="bg-pink-100 text-pink-700">utm_content</Badge>
                          <span className="text-gray-600">{params.content}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Link2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">Enter a URL and parameters</p>
                  <p className="text-sm mt-1">Your trackable link will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Pro Tips
              </h4>
              <ul className="text-sm text-indigo-800 space-y-2">
                <li>• Use lowercase and underscores for consistency</li>
                <li>• Include dates in campaign names for easy tracking</li>
                <li>• Use <code className="bg-indigo-100 px-1 rounded">utm_content</code> for A/B test variants</li>
                <li>• Combine with QR codes for offline → online tracking</li>
              </ul>
            </CardContent>
          </Card>

          {/* QR Code CTA */}
          <Card className="border-dashed border-2 border-gray-200 hover:border-indigo-300 transition-colors cursor-pointer">
            <CardContent className="pt-6 text-center">
              <QrCode className="w-10 h-10 mx-auto mb-3 text-gray-400" />
              <p className="font-medium text-gray-700">Generate QR Code</p>
              <p className="text-sm text-gray-500 mt-1">
                Turn this URL into a scannable QR code
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default UTMBuilder;
