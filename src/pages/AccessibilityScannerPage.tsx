import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { accessibilityApi, type AccessibilityScanResult, type AccessibilityIssue } from '@/lib/api/ml';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  Code, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Info,
  Shield,
  Zap,
  Copy,
  ArrowLeft,
  Download,
  ChevronDown,
  ChevronUp,
  Eye,
  Lightbulb,
  FileCode,
  RefreshCw,
  Sparkles
} from 'lucide-react';

type InputMode = 'url' | 'html';

const impactConfig = {
  critical: { 
    color: 'bg-red-500', 
    lightBg: 'bg-red-50 dark:bg-red-950',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-700 dark:text-red-300',
    icon: XCircle,
    label: 'Critical'
  },
  serious: { 
    color: 'bg-orange-500', 
    lightBg: 'bg-orange-50 dark:bg-orange-950',
    border: 'border-orange-200 dark:border-orange-800',
    text: 'text-orange-700 dark:text-orange-300',
    icon: AlertTriangle,
    label: 'Serious'
  },
  moderate: { 
    color: 'bg-yellow-500', 
    lightBg: 'bg-yellow-50 dark:bg-yellow-950',
    border: 'border-yellow-200 dark:border-yellow-800',
    text: 'text-yellow-700 dark:text-yellow-300',
    icon: Info,
    label: 'Moderate'
  },
  minor: { 
    color: 'bg-blue-500', 
    lightBg: 'bg-blue-50 dark:bg-blue-950',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-700 dark:text-blue-300',
    icon: CheckCircle2,
    label: 'Minor'
  },
};

export default function AccessibilityScannerPage() {
  const navigate = useNavigate();
  const [inputMode, setInputMode] = useState<InputMode>('url');
  const [url, setUrl] = useState('');
  const [html, setHtml] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<AccessibilityScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedIssues, setExpandedIssues] = useState<Set<number>>(new Set());
  const [filterImpact, setFilterImpact] = useState<string | null>(null);

  const handleScan = async () => {
    setError(null);
    setResult(null);
    setIsScanning(true);
    setExpandedIssues(new Set());

    try {
      const input = inputMode === 'url' ? { url } : { html };
      const scanResult = await accessibilityApi.scanFree(input, { autoFix: true });
      setResult(scanResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scan failed. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const toggleIssue = (index: number) => {
    setExpandedIssues(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const getScoreRing = (score: number) => {
    const circumference = 2 * Math.PI * 54;
    const progress = (score / 100) * circumference;
    const color = score >= 90 ? '#22c55e' : score >= 70 ? '#eab308' : score >= 50 ? '#f97316' : '#ef4444';
    return { progress, circumference, color };
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const resetScan = () => {
    setResult(null);
    setError(null);
    setUrl('');
    setHtml('');
  };

  const groupedIssues = result?.issues.reduce<Record<string, AccessibilityIssue[]>>((acc, issue) => {
    const impact = issue.impact;
    if (!acc[impact]) acc[impact] = [];
    acc[impact].push(issue);
    return acc;
  }, {}) || {};

  const filteredIssues = filterImpact 
    ? result?.issues.filter(i => i.impact === filterImpact) || []
    : result?.issues || [];

  // Scanning animation component
  const ScanningAnimation = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="w-32 h-32 rounded-full border-4 border-indigo-100 dark:border-indigo-900"></div>
        <div className="absolute inset-0 w-32 h-32 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Shield className="w-12 h-12 text-indigo-600 animate-pulse" />
        </div>
      </div>
      <p className="mt-6 text-lg font-medium text-gray-700 dark:text-gray-300">Scanning for accessibility issues...</p>
      <p className="mt-2 text-sm text-gray-500">This may take a few seconds</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold">Accessibility Scanner</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">WCAG 2.1 • ADA • Section 508</p>
                </div>
              </div>
            </div>
            {result && (
              <Button variant="outline" size="sm" onClick={resetScan}>
                <RefreshCw className="w-4 h-4 mr-2" />
                New Scan
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Input Section - Show when no result */}
        {!result && !isScanning && (
          <div className="max-w-3xl mx-auto">
            {/* Hero */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Free Tool - No signup required
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent mb-4">
                Check Your Website's Accessibility
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                Scan any website or HTML code for accessibility issues. Get detailed reports with actionable fixes.
              </p>
            </div>

            {/* Input Card */}
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardContent className="p-6">
                {/* Mode Toggle */}
                <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6">
                  <button
                    onClick={() => setInputMode('url')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      inputMode === 'url'
                        ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    Website URL
                  </button>
                  <button
                    onClick={() => setInputMode('html')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      inputMode === 'html'
                        ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Code className="w-4 h-4" />
                    HTML Code
                  </button>
                </div>

                {/* Input */}
                {inputMode === 'url' ? (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enter website URL
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="url"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="pl-12 h-14 text-lg border-2 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Paste your HTML code
                    </label>
                    <Textarea
                      placeholder="<html>&#10;  <head>&#10;    <title>My Page</title>&#10;  </head>&#10;  <body>&#10;    <!-- Paste your HTML here -->&#10;  </body>&#10;</html>"
                      value={html}
                      onChange={(e) => setHtml(e.target.value)}
                      className="min-h-[200px] font-mono text-sm border-2 focus:border-indigo-500"
                    />
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm">
                    <div className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Scan failed</p>
                        <p className="mt-1 opacity-80">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Scan Button */}
                <Button 
                  onClick={handleScan} 
                  disabled={isScanning || (inputMode === 'url' ? !url : !html)}
                  className="w-full mt-6 h-14 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Scan for Accessibility Issues
                </Button>

                {/* Standards Badges */}
                <div className="flex flex-wrap items-center justify-center gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Badge variant="outline" className="px-3 py-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-green-500" />
                    WCAG 2.1 AA/AAA
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1.5">
                    <Shield className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                    ADA Compliant
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1.5">
                    <FileCode className="w-3.5 h-3.5 mr-1.5 text-purple-500" />
                    Section 508
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-4 mt-8">
              {[
                { icon: Eye, title: 'Visual Analysis', desc: 'Color contrast, alt text, focus indicators' },
                { icon: Code, title: 'Semantic HTML', desc: 'Proper headings, landmarks, ARIA' },
                { icon: Lightbulb, title: 'Smart Fixes', desc: 'Auto-generated code suggestions' },
              ].map((feature, i) => (
                <div key={i} className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700">
                  <feature.icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-3" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scanning State */}
        {isScanning && <ScanningAnimation />}

        {/* Results Section */}
        {result && !isScanning && (
          <div className="space-y-6">
            {/* Score Overview */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Score Card */}
              <Card className="lg:col-span-1 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-0 shadow-xl">
                <CardContent className="p-6 flex flex-col items-center">
                  {/* Score Ring */}
                  <div className="relative w-36 h-36 mb-4">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="72"
                        cy="72"
                        r="54"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="12"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <circle
                        cx="72"
                        cy="72"
                        r="54"
                        fill="none"
                        stroke={getScoreRing(result.score).color}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={getScoreRing(result.score).circumference}
                        strokeDashoffset={getScoreRing(result.score).circumference - getScoreRing(result.score).progress}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold">{result.score}</span>
                      <span className="text-sm text-gray-500">/ 100</span>
                    </div>
                  </div>

                  {/* Compliance Badges */}
                  <div className="w-full space-y-2">
                    <div className={`flex items-center justify-between p-3 rounded-lg ${result.wcagAA ? 'bg-green-50 dark:bg-green-950' : 'bg-red-50 dark:bg-red-950'}`}>
                      <span className="text-sm font-medium">WCAG 2.1 AA</span>
                      {result.wcagAA ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div className={`flex items-center justify-between p-3 rounded-lg ${result.wcagAAA ? 'bg-green-50 dark:bg-green-950' : 'bg-gray-50 dark:bg-gray-800'}`}>
                      <span className="text-sm font-medium">WCAG 2.1 AAA</span>
                      {result.wcagAAA ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <span className="text-xs text-gray-500">Not met</span>
                      )}
                    </div>
                    <div className={`flex items-center justify-between p-3 rounded-lg ${result.adaCompliant ? 'bg-green-50 dark:bg-green-950' : 'bg-red-50 dark:bg-red-950'}`}>
                      <span className="text-sm font-medium">ADA Compliant</span>
                      {result.adaCompliant ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Issues Summary */}
              <Card className="lg:col-span-2 border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Issues Found</h3>
                    <span className="text-2xl font-bold">{result.issues.length}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {(['critical', 'serious', 'moderate', 'minor'] as const).map((impact) => {
                      const config = impactConfig[impact];
                      const count = groupedIssues[impact]?.length || 0;
                      const Icon = config.icon;
                      return (
                        <button
                          key={impact}
                          onClick={() => setFilterImpact(filterImpact === impact ? null : impact)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            filterImpact === impact 
                              ? `${config.border} ${config.lightBg}` 
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-full ${config.color} flex items-center justify-center mb-3`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <p className="text-2xl font-bold">{count}</p>
                          <p className="text-sm text-gray-500 capitalize">{impact}</p>
                        </button>
                      );
                    })}
                  </div>

                  {/* ML Insights */}
                  {result.mlPrediction && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">AI Insights</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {result.mlPrediction.riskScore !== undefined && (
                          <span>Risk Score: <span className="font-semibold">{result.mlPrediction.riskScore}%</span></span>
                        )}
                        {result.mlPrediction.confidence !== undefined && (
                          <span>Confidence: <span className="font-semibold">{(result.mlPrediction.confidence * 100).toFixed(0)}%</span></span>
                        )}
                        {result.mlPrediction.risk_level && (
                          <span> • Risk Level: <span className="font-semibold capitalize">{result.mlPrediction.risk_level}</span></span>
                        )}
                        {result.mlPrediction.likelyIssues && result.mlPrediction.likelyIssues.length > 0 && (
                          <span> • {result.mlPrediction.likelyIssues.length} potential issues identified</span>
                        )}
                      </p>
                      {result.mlPrediction.recommendations && result.mlPrediction.recommendations.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {result.mlPrediction.recommendations.slice(0, 3).map((rec, i) => (
                            <li key={i} className="text-xs text-gray-500 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-green-500" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Issues List */}
            <Card className="border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">Detailed Issues</h3>
                    <p className="text-sm text-gray-500">
                      {filterImpact ? `Showing ${filterImpact} issues` : 'All accessibility issues found'}
                    </p>
                  </div>
                  {filterImpact && (
                    <Button variant="ghost" size="sm" onClick={() => setFilterImpact(null)}>
                      Clear filter
                    </Button>
                  )}
                </div>

                {filteredIssues.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="w-16 h-16 mx-auto text-green-500 mb-4" />
                    <h4 className="text-xl font-semibold text-green-700 dark:text-green-400">
                      {filterImpact ? `No ${filterImpact} issues found!` : 'No issues found!'}
                    </h4>
                    <p className="text-gray-500 mt-2">
                      {filterImpact ? 'Try selecting a different severity level.' : 'Your content meets accessibility standards.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredIssues.map((issue: AccessibilityIssue, index: number) => {
                      const config = impactConfig[issue.impact as keyof typeof impactConfig];
                      const Icon = config.icon;
                      const isExpanded = expandedIssues.has(index);
                      
                      return (
                        <div 
                          key={index}
                          className={`border rounded-xl overflow-hidden transition-all ${config.border}`}
                        >
                          <button
                            onClick={() => toggleIssue(index)}
                            className={`w-full p-4 flex items-start gap-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors`}
                          >
                            <div className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center shrink-0`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className={`${config.text} ${config.border}`}>
                                  {config.label}
                                </Badge>
                                <span className="text-xs text-gray-500 font-mono">{issue.rule}</span>
                                {issue.autoFixable && (
                                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                    <Zap className="w-3 h-3 mr-1" />
                                    Auto-fixable
                                  </Badge>
                                )}
                              </div>
                              <p className="font-medium mt-2 text-gray-900 dark:text-gray-100">
                                {issue.description}
                              </p>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                            )}
                          </button>
                          
                          {isExpanded && (
                            <div className={`px-4 pb-4 pt-0 border-t ${config.border} ${config.lightBg}`}>
                              {/* Element */}
                              {issue.element && (
                                <div className="mt-4">
                                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    Affected Element
                                  </p>
                                  <div className="relative">
                                    <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-xs overflow-x-auto">
                                      <code>{issue.element}</code>
                                    </pre>
                                    <button
                                      onClick={() => copyToClipboard(issue.element)}
                                      className="absolute top-2 right-2 p-1.5 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                                    >
                                      <Copy className="w-3.5 h-3.5 text-gray-400" />
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Suggestion */}
                              <div className="mt-4">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                  How to Fix
                                </p>
                                <div className="flex items-start gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                  <Lightbulb className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                                  <p className="text-sm text-gray-700 dark:text-gray-300">{issue.suggestion}</p>
                                </div>
                              </div>

                              {/* Auto-fix code */}
                              {issue.autoFixable && issue.autoFix && (
                                <div className="mt-4">
                                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    Suggested Fix
                                  </p>
                                  <div className="relative">
                                    <pre className="bg-green-950 text-green-100 p-3 rounded-lg text-xs overflow-x-auto">
                                      <code>{issue.autoFix}</code>
                                    </pre>
                                    <button
                                      onClick={() => copyToClipboard(issue.autoFix || '')}
                                      className="absolute top-2 right-2 p-1.5 bg-green-900 hover:bg-green-800 rounded transition-colors"
                                    >
                                      <Copy className="w-3.5 h-3.5 text-green-400" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button variant="outline" onClick={() => window.print()}>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              {result.shareUrl && (
                <Button variant="outline" onClick={() => copyToClipboard(result.shareUrl || '')}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Share Link
                </Button>
              )}
              <Button onClick={resetScan}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Scan Another Site
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>Free accessibility scanner powered by AI. Checks for WCAG 2.1, ADA, and Section 508 compliance.</p>
        </div>
      </footer>
    </div>
  );
}
