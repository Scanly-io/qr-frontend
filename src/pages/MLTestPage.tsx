import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Shield, AlertCircle } from 'lucide-react';

interface AIResult {
  success: boolean;
  generationId?: string;
  preview?: { html: string; css: string };
  components?: unknown[];
  brandAesthetic?: unknown;
  error?: string;
}

interface AccessibilityIssue {
  rule: string;
  description: string;
  impact: string;
  element: string;
  suggestion: string;
  autoFixable: boolean;
}

interface ScanResult {
  success: boolean;
  score?: number;
  wcagAA?: boolean;
  wcagAAA?: boolean;
  issues?: AccessibilityIssue[];
  error?: string;
}

export default function MLTestPage() {
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  
  const [scanHtml, setScanHtml] = useState('<html><body><img src="test.jpg"><button>Click</button></body></html>');
  const [scanLoading, setScanLoading] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  const testAIGeneration = async () => {
    setAiLoading(true);
    setAiResult(null);
    try {
      const response = await fetch('http://localhost/api/ml/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': '550e8400-e29b-41d4-a716-446655440000',
        },
        body: JSON.stringify({
          prompt: aiPrompt || 'Create a modern landing page for a tech startup',
        }),
      });
      const data = await response.json();
      setAiResult(data);
    } catch (error) {
      setAiResult({ success: false, error: String(error) });
    } finally {
      setAiLoading(false);
    }
  };

  const testAccessibilityScan = async () => {
    setScanLoading(true);
    setScanResult(null);
    try {
      const response = await fetch('http://localhost/api/ml/accessibility/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': '550e8400-e29b-41d4-a716-446655440000',
        },
        body: JSON.stringify({
          micrositeId: '550e8400-e29b-41d4-a716-446655440001',
          html: scanHtml,
        }),
      });
      const data = await response.json();
      setScanResult(data);
    } catch (error) {
      setScanResult({ success: false, error: String(error) });
    } finally {
      setScanLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">ML Service Testing</h1>
        <p className="text-muted-foreground">Test the AI Generation and Accessibility features</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* AI Generation Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              AI Generation
            </CardTitle>
            <CardDescription>
              Generate microsite designs with GPT-4
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Prompt</label>
              <textarea
                placeholder="Describe the website you want to generate..."
                value={aiPrompt}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAiPrompt(e.target.value)}
                rows={3}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            
            <Button 
              onClick={testAIGeneration} 
              disabled={aiLoading}
              className="w-full"
            >
              {aiLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate with AI
                </>
              )}
            </Button>

            {aiResult && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    aiResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {aiResult.success ? 'Success' : 'Error'}
                  </span>
                </div>
                <pre className="text-xs overflow-auto max-h-60">
                  {JSON.stringify(aiResult, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Accessibility Scan Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Accessibility Scanner
            </CardTitle>
            <CardDescription>
              Scan HTML for WCAG compliance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">HTML to Scan</label>
              <textarea
                placeholder="<html>...</html>"
                value={scanHtml}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setScanHtml(e.target.value)}
                rows={3}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono text-xs"
              />
            </div>
            
            <Button 
              onClick={testAccessibilityScan} 
              disabled={scanLoading}
              className="w-full"
            >
              {scanLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Scan Accessibility
                </>
              )}
            </Button>

            {scanResult && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    scanResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {scanResult.success ? 'Success' : 'Error'}
                  </span>
                  {scanResult.success && (
                    <>
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                        Score: {scanResult.score}/100
                      </span>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        scanResult.wcagAA ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {scanResult.wcagAA ? 'WCAG AA ✓' : 'WCAG AA ✗'}
                      </span>
                    </>
                  )}
                </div>

                {scanResult.success && scanResult.issues && (
                  <div className="space-y-2 mt-3">
                    <p className="text-sm font-medium">{scanResult.issues.length} Issues Found:</p>
                    {scanResult.issues.slice(0, 3).map((issue: AccessibilityIssue, i: number) => (
                      <div key={i} className="text-xs p-2 bg-background rounded border">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-3 w-3 mt-0.5 text-orange-500" />
                          <div>
                            <p className="font-medium">{issue.rule}</p>
                            <p className="text-muted-foreground">{issue.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <details className="mt-3">
                  <summary className="text-xs cursor-pointer text-muted-foreground">
                    View full response
                  </summary>
                  <pre className="text-xs overflow-auto max-h-60 mt-2">
                    {JSON.stringify(scanResult, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Service Status */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Service Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm">ML Service: Running</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm">Nginx Gateway: Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-yellow-500" />
              <span className="text-sm">OpenAI: Quota Exceeded</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
