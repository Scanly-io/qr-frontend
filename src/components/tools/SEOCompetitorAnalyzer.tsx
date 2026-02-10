/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Search, ExternalLink, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

interface SEOAnalysisResult {
  url: string;
  seo: {
    score: number;
    grade: string;
    title: { value: string; length: number; optimal: boolean };
    description: { value: string; length: number; optimal: boolean };
    keywords: string[] | null;
    issues: string[];
    suggestions: string[];
  };
  content: {
    h1: { count: number; text: string; optimal: boolean };
    images: { total: number; missingAlt: number };
    links: { internal: number; external: number };
    wordCount: number;
  };
  social: {
    hasOpenGraph: boolean;
    hasTwitterCard: boolean;
  };
  technical: {
    hasStructuredData: boolean;
  };
}

export function SEOCompetitorAnalyzer() {
  const [url, setUrl] = useState('');
  const [competitorUrls, setCompetitorUrls] = useState<string[]>(['', '']);
  const [result, setResult] = useState<SEOAnalysisResult | null>(null);
  const [comparison, setComparison] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'analyze' | 'compare'>('analyze');

  const analyzeSingleURL = async () => {
    if (!url) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3016/seo/analyze-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Failed to analyze URL:', error);
    } finally {
      setLoading(false);
    }
  };

  const compareCompetitors = async () => {
    const validUrls = competitorUrls.filter((u) => u.trim().length > 0);
    if (validUrls.length < 2) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3016/seo/compare-competitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: validUrls }),
      });

      const data = await response.json();
      setComparison(data);
    } catch (error) {
      console.error('Failed to compare competitors:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SEO Competitor Analyzer</h1>
        <p className="text-gray-600">Analyze the SEO performance of any live microsite or compare competitors</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('analyze')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'analyze'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Search className="w-4 h-4 inline mr-2" />
          Analyze URL
        </button>
        <button
          onClick={() => setActiveTab('compare')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'compare'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <TrendingUp className="w-4 h-4 inline mr-2" />
          Compare Competitors
        </button>
      </div>

      {/* Analyze Single URL Tab */}
      {activeTab === 'analyze' && (
        <div className="space-y-6">
          <div className="flex gap-3">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://linktr.ee/username"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={analyzeSingleURL}
              disabled={!url || loading}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Analyze
                </>
              )}
            </button>
          </div>

          {result && (
            <div className="space-y-4">
              {/* Score Card */}
              <div className={`p-6 rounded-lg border-2 ${getScoreColor(result.seo.score)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">SEO Score</h3>
                    <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-sm flex items-center gap-1 hover:underline">
                      {result.url}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold">{result.seo.score}</div>
                    <div className="text-lg">Grade: {result.seo.grade}</div>
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">Title Tag</h4>
                    {result.seo.title.optimal ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{result.seo.title.value}</p>
                  <p className="text-xs text-gray-500">{result.seo.title.length} characters (optimal: 30-60)</p>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">Meta Description</h4>
                    {result.seo.description.optimal ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{result.seo.description.value || 'Not found'}</p>
                  <p className="text-xs text-gray-500">{result.seo.description.length} characters (optimal: 120-155)</p>
                </div>
              </div>

              {/* Content Stats */}
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Content Analysis</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">H1 Headings</p>
                    <p className={`text-lg font-semibold ${result.content.h1.optimal ? 'text-green-600' : 'text-red-600'}`}>
                      {result.content.h1.count}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Images</p>
                    <p className="text-lg font-semibold text-gray-900">{result.content.images.total}</p>
                    {result.content.images.missingAlt > 0 && (
                      <p className="text-xs text-red-600">{result.content.images.missingAlt} missing alt</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Word Count</p>
                    <p className="text-lg font-semibold text-gray-900">{result.content.wordCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Links</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {result.content.links.internal + result.content.links.external}
                    </p>
                  </div>
                </div>
              </div>

              {/* Issues */}
              {result.seo.issues.length > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Issues Found ({result.seo.issues.length})
                  </h4>
                  <ul className="space-y-1">
                    {result.seo.issues.map((issue, idx) => (
                      <li key={idx} className="text-sm text-red-700">
                        • {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggestions */}
              {result.seo.suggestions.length > 0 && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Recommendations</h4>
                  <ul className="space-y-1">
                    {result.seo.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="text-sm text-blue-700">
                        • {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Compare Competitors Tab */}
      {activeTab === 'compare' && (
        <div className="space-y-6">
          <div className="space-y-3">
            {competitorUrls.map((url, idx) => (
              <input
                key={idx}
                type="url"
                value={url}
                onChange={(e) => {
                  const newUrls = [...competitorUrls];
                  newUrls[idx] = e.target.value;
                  setCompetitorUrls(newUrls);
                }}
                placeholder={`Competitor ${idx + 1} URL (e.g., https://linktr.ee/)`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            ))}
            <button
              onClick={() => setCompetitorUrls([...competitorUrls, ''])}
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              + Add another competitor (max 5)
            </button>
          </div>

          <button
            onClick={compareCompetitors}
            disabled={competitorUrls.filter((u) => u.trim()).length < 2 || loading}
            className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Comparing...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4" />
                Compare SEO Performance
              </>
            )}
          </button>

          {comparison && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">Comparison Results</h3>
                <p className="text-sm text-purple-700">
                  Winner: <span className="font-semibold">{comparison.winner}</span>
                </p>
                <p className="text-sm text-purple-700">Average Score: {comparison.avgScore.toFixed(1)}/100</p>
              </div>

              {comparison.comparison.map((comp: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border-2 ${
                    comp.url === comparison.winner ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <a
                        href={comp.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium flex items-center gap-1 hover:underline mb-1"
                      >
                        {comp.url}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <p className="text-xs text-gray-600">{comp.title}</p>
                      {comp.hasIssues && <p className="text-xs text-red-600 mt-1">Has SEO issues</p>}
                    </div>
                    <div className="text-right ml-4">
                      <div className={`text-2xl font-bold ${getScoreColor(comp.score).split(' ')[0]}`}>{comp.score}</div>
                      <div className="text-sm text-gray-600">Grade: {comp.grade}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
