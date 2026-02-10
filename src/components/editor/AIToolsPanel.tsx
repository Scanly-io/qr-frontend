/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Sparkles, Wand2, Search, Image, TestTube, MessageSquare } from 'lucide-react';

interface AIToolsPanelProps {
  micrositeId: string;
  onApplyChanges?: (changes: any) => void;
}

export function AIToolsPanel({ micrositeId, onApplyChanges }: AIToolsPanelProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'images' | 'analytics' | 'testing' | 'chat'>('content');
  const [loading, setLoading] = useState(false);

  const tools = [
    { id: 'content', label: 'Content Writer', icon: Wand2, description: 'Generate compelling copy' },
    { id: 'seo', label: 'SEO Optimizer', icon: Search, description: 'Optimize for search engines' },
    { id: 'images', label: 'Image Generator', icon: Image, description: 'Create AI images' },
    { id: 'analytics', label: 'Analytics Insights', icon: Sparkles, description: 'Explain your data' },
    { id: 'testing', label: 'A/B Testing', icon: TestTube, description: 'Auto-optimize variants' },
    { id: 'chat', label: 'AI Chat', icon: MessageSquare, description: 'Add chatbot to site' },
  ];

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold">AI Tools</h2>
        </div>
        <p className="text-sm text-gray-600 mt-1">Enhance your microsite with AI</p>
      </div>

      {/* Tool Tabs */}
      <div className="grid grid-cols-2 gap-2 p-4 border-b border-gray-200">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTab(tool.id as any)}
              className={`p-3 rounded-lg border-2 transition-all ${
                activeTab === tool.id
                  ? 'border-purple-600 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <Icon className="w-5 h-5 mx-auto mb-1" />
              <div className="text-xs font-medium">{tool.label}</div>
            </button>
          );
        })}
      </div>

      {/* Tool Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'content' && <ContentWriterTool micrositeId={micrositeId} />}
        {activeTab === 'seo' && <SEOOptimizerTool micrositeId={micrositeId} />}
        {activeTab === 'images' && <ImageGeneratorTool micrositeId={micrositeId} />}
        {activeTab === 'analytics' && <AnalyticsInsightsTool micrositeId={micrositeId} />}
        {activeTab === 'testing' && <ABTestingTool micrositeId={micrositeId} />}
        {activeTab === 'chat' && <AIChatTool micrositeId={micrositeId} />}
      </div>
    </div>
  );
}

// Content Writer Tool Component
function ContentWriterTool({ micrositeId }: { micrositeId: string }) {
  const [contentType, setContentType] = useState<'bio' | 'headline' | 'cta' | 'description'>('bio');
  const [input, setInput] = useState('');
  const [tone, setTone] = useState('professional');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generateContent = async () => {
    setLoading(true);
    try {
      let endpoint = '';
      const body: any = { tone };

      switch (contentType) {
        case 'bio':
          endpoint = '/content-writer/generate-bio';
          body.length = 'medium';
          break;
        case 'headline':
          endpoint = '/content-writer/generate-headline';
          body.topic = input;
          body.count = 5;
          break;
        case 'cta':
          endpoint = '/content-writer/generate-cta';
          body.action = input;
          body.count = 8;
          break;
        case 'description':
          endpoint = '/content-writer/generate-description';
          body.topic = input;
          body.length = 'medium';
          break;
      }

      const response = await fetch(`http://localhost:3016${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Failed to generate content:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
        <select
          value={contentType}
          onChange={(e) => setContentType(e.target.value as any)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="bio">Bio / About Text</option>
          <option value="headline">Headlines</option>
          <option value="cta">Call-to-Action Buttons</option>
          <option value="description">Descriptions</option>
        </select>
      </div>

      {contentType !== 'bio' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {contentType === 'headline' ? 'Topic' : contentType === 'cta' ? 'Action' : 'Topic'}
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={contentType === 'cta' ? 'e.g., sign up, buy now' : 'e.g., Product launch'}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="professional">Professional</option>
          <option value="casual">Casual</option>
          <option value="creative">Creative</option>
          <option value="friendly">Friendly</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <button
        onClick={generateContent}
        disabled={loading || (contentType !== 'bio' && !input)}
        className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            Generating...
          </>
        ) : (
          <>
            <Wand2 className="w-4 h-4" />
            Generate Content
          </>
        )}
      </button>

      {result && (
        <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h4 className="font-medium text-purple-900 mb-2">Generated Content:</h4>
          {contentType === 'bio' || contentType === 'description' ? (
            <p className="text-gray-700 text-sm leading-relaxed">{result.text}</p>
          ) : (
            <ul className="space-y-2">
              {(result.headlines || result.ctas || []).map((item: string, idx: number) => (
                <li
                  key={idx}
                  className="p-2 bg-white rounded border border-purple-200 text-sm cursor-pointer hover:bg-purple-100"
                  onClick={() => navigator.clipboard.writeText(item)}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

// SEO Optimizer Tool Component
function SEOOptimizerTool({ micrositeId }: { micrositeId: string }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const optimizeSEO = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3016/seo/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Failed to optimize SEO:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMetaDescription = async () => {
    if (!title) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3016/seo/generate-meta-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });

      const data = await response.json();
      setDescription(data.description);
    } catch (error) {
      console.error('Failed to generate description:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your page title"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">{title.length}/60 characters</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Meta Description</label>
          <button
            onClick={generateMetaDescription}
            disabled={!title || loading}
            className="text-xs text-purple-600 hover:text-purple-700 disabled:opacity-50"
          >
            ✨ AI Generate
          </button>
        </div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter meta description"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">{description.length}/155 characters</p>
      </div>

      <button
        onClick={optimizeSEO}
        disabled={loading}
        className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            Analyzing...
          </>
        ) : (
          <>
            <Search className="w-4 h-4" />
            Analyze SEO
          </>
        )}
      </button>

      {result && (
        <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-purple-900">SEO Score</h4>
            <div className="text-2xl font-bold text-purple-600">{result.score}/100</div>
          </div>

          {result.issues.length > 0 && (
            <div className="mb-3">
              <h5 className="text-sm font-medium text-red-700 mb-1">Issues:</h5>
              <ul className="space-y-1">
                {result.issues.map((issue: string, idx: number) => (
                  <li key={idx} className="text-xs text-red-600">
                    • {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.suggestions.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-green-700 mb-1">Suggestions:</h5>
              <ul className="space-y-1">
                {result.suggestions.map((suggestion: string, idx: number) => (
                  <li key={idx} className="text-xs text-green-600">
                    • {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Placeholder components for other tools
function ImageGeneratorTool({ micrositeId }: { micrositeId: string }) {
  return (
    <div className="text-center py-8">
      <Image className="w-12 h-12 mx-auto text-gray-400 mb-3" />
      <h3 className="font-medium text-gray-900 mb-1">AI Image Generator</h3>
      <p className="text-sm text-gray-600">Generate backgrounds, avatars, and graphics with DALL-E</p>
      <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
        Coming Soon
      </button>
    </div>
  );
}

function AnalyticsInsightsTool({ micrositeId }: { micrositeId: string }) {
  return (
    <div className="text-center py-8">
      <Sparkles className="w-12 h-12 mx-auto text-gray-400 mb-3" />
      <h3 className="font-medium text-gray-900 mb-1">Analytics Insights</h3>
      <p className="text-sm text-gray-600">Get plain-English explanations of your analytics data</p>
      <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
        View Insights
      </button>
    </div>
  );
}

function ABTestingTool({ micrositeId }: { micrositeId: string }) {
  return (
    <div className="text-center py-8">
      <TestTube className="w-12 h-12 mx-auto text-gray-400 mb-3" />
      <h3 className="font-medium text-gray-900 mb-1">A/B Testing</h3>
      <p className="text-sm text-gray-600">Automatically test variants and pick winners</p>
      <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
        Create Test
      </button>
    </div>
  );
}

function AIChatTool({ micrositeId }: { micrositeId: string }) {
  return (
    <div className="text-center py-8">
      <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-3" />
      <h3 className="font-medium text-gray-900 mb-1">AI Chat Widget</h3>
      <p className="text-sm text-gray-600">Add an intelligent chatbot to answer visitor questions</p>
      <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
        Configure Chat
      </button>
    </div>
  );
}
