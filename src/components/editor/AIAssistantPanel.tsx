import { useState, useEffect, useCallback } from 'react';
import { aiAssistantApi, type AIRecommendation, type AIInsights } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';

interface AIAssistantPanelProps {
  micrositeId: string;
  onApplyRecommendation?: () => void;
}

export function AIAssistantPanel({ micrositeId, onApplyRecommendation }: AIAssistantPanelProps) {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [insights, setInsights] = useState<AIInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [recs, ins] = await Promise.all([
        aiAssistantApi.getRecommendations(micrositeId),
        aiAssistantApi.getInsights(micrositeId),
      ]);

      setRecommendations(recs);
      setInsights(ins);
    } catch (error) {
      console.error('Failed to load AI data:', error);
    } finally {
      setLoading(false);
    }
  }, [micrositeId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAutoApply = async () => {
    try {
      setApplying('all');
      await aiAssistantApi.autoApply(micrositeId);
      await loadData();
      onApplyRecommendation?.();
      alert('AI recommendations applied successfully!');
    } catch (error) {
      console.error('Failed to auto-apply:', error);
      alert('Failed to apply recommendations');
    } finally {
      setApplying(null);
    }
  };

  const handleApplyOne = async (recommendationId: string) => {
    try {
      setApplying(recommendationId);
      await aiAssistantApi.applyRecommendation(recommendationId);
      await loadData();
      onApplyRecommendation?.();
    } catch (error) {
      console.error('Failed to apply recommendation:', error);
    } finally {
      setApplying(null);
    }
  };

  const handleDismiss = async (recommendationId: string) => {
    try {
      await aiAssistantApi.dismissRecommendation(recommendationId);
      await loadData();
    } catch (error) {
      console.error('Failed to dismiss recommendation:', error);
    }
  };

  const getRecommendationIcon = (type: AIRecommendation['type']) => {
    switch (type) {
      case 'cta_text':
        return <Target className="w-5 h-5" />;
      case 'add_video':
        return <Sparkles className="w-5 h-5" />;
      case 'button_position':
        return <AlertCircle className="w-5 h-5" />;
      case 'headline_change':
        return <Zap className="w-5 h-5" />;
      case 'remove_element':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-orange-600';
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Card>
    );
  }

  const pendingRecommendations = recommendations.filter((r) => r.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Insights Card */}
      {insights && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Performance Insights
          </h3>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Bounce Rate</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold">
                  {Math.round(insights.bounceRate)}%
                </p>
                <span className={`text-sm ${
                  insights.bounceRate > insights.benchmarks.bounceRate
                    ? 'text-red-600 flex items-center gap-1'
                    : 'text-green-600 flex items-center gap-1'
                }`}>
                  {insights.bounceRate > insights.benchmarks.bounceRate ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  vs {Math.round(insights.benchmarks.bounceRate)}%
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold">
                  {Math.round(insights.conversionRate * 100) / 100}%
                </p>
                <span className={`text-sm ${
                  insights.conversionRate < insights.benchmarks.conversionRate
                    ? 'text-red-600 flex items-center gap-1'
                    : 'text-green-600 flex items-center gap-1'
                }`}>
                  {insights.conversionRate < insights.benchmarks.conversionRate ? (
                    <TrendingDown className="w-3 h-3" />
                  ) : (
                    <TrendingUp className="w-3 h-3" />
                  )}
                  vs {Math.round(insights.benchmarks.conversionRate * 100) / 100}%
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Avg. Time</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold">{insights.avgTimeOnPage}s</p>
                <span className={`text-sm ${
                  insights.avgTimeOnPage < insights.benchmarks.avgTimeOnPage
                    ? 'text-red-600'
                    : 'text-green-600'
                }`}>
                  vs {insights.benchmarks.avgTimeOnPage}s
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Recommendations */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI Recommendations ({pendingRecommendations.length})
          </h3>
          {pendingRecommendations.length > 0 && (
            <Button
              size="sm"
              onClick={handleAutoApply}
              disabled={applying === 'all'}
            >
              <Zap className="w-4 h-4 mr-2" />
              Auto-Apply All
            </Button>
          )}
        </div>

        {pendingRecommendations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-500" />
            <p>No recommendations at this time</p>
            <p className="text-sm">Your microsite is performing well!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRecommendations.map((rec) => (
              <div
                key={rec.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg bg-purple-50 text-purple-600`}>
                    {getRecommendationIcon(rec.type)}
                  </div>

                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{rec.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                    <p className="text-sm text-gray-500 italic mb-3">{rec.reasoning}</p>

                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-green-600">
                        {rec.expectedImpact}
                      </span>
                      <span className={`text-sm font-medium ${getConfidenceColor(rec.confidence)}`}>
                        {Math.round(rec.confidence * 100)}% confidence
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApplyOne(rec.id)}
                      disabled={applying === rec.id}
                    >
                      Apply
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDismiss(rec.id)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
