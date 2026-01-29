/**
 * Experiments Settings Component (A/B Testing)
 * Create and manage experiments for optimization
 * Enhanced with results visualization and statistical analysis
 */

import { useState, useEffect } from 'react';
import { 
  FlaskConical, 
  Plus, 
  Trash2, 
  Play,
  Pause,
  Square,
  BarChart3,
  Loader2,
  TrendingUp,
  TrendingDown,
  Trophy,
  X,
  CheckCircle,
  AlertCircle,
  Users,
  Target,
  Percent,
  Clock
} from 'lucide-react';
import { experimentsApi } from '../../lib/api';
import type { Experiment, ExperimentResults } from '../../lib/api';

// Variant type for results display
interface ResultVariant {
  id?: string;
  name: string;
  isControl: boolean;
  visitors: number;
  conversions: number;
  conversionRate: number;
  improvement: number;
  confidenceInterval?: { lower: number; upper: number };
  pValue?: number;
}

// Results Modal Component
function ResultsModal({ 
  experiment, 
  onClose 
}: { 
  experiment: Experiment; 
  onClose: () => void;
}) {
  const [results, setResults] = useState<ExperimentResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const data = await experimentsApi.getResults(experiment.id);
        setResults(data);
      } catch (err) {
        console.error('Failed to load results:', err);
        setError('Failed to load experiment results');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [experiment.id]);

  // Calculate the max conversion rate for bar scaling
  const maxConversionRate = results?.variants.reduce(
    (max: number, v: ResultVariant) => Math.max(max, v.conversionRate || 0), 
    0
  ) || 1;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h2 className="text-xl font-bold">{experiment.name}</h2>
              <p className="text-indigo-100 text-sm mt-1">Experiment Results & Analysis</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-gray-600">{error}</p>
            </div>
          ) : results ? (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Users className="w-6 h-6 mx-auto text-indigo-600 mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {results.totalVisitors.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Total Visitors</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Target className="w-6 h-6 mx-auto text-green-600 mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {results.totalConversions.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Conversions</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Percent className="w-6 h-6 mx-auto text-purple-600 mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {(results.overallConversionRate * 100).toFixed(2)}%
                  </div>
                  <div className="text-xs text-gray-500">Overall Rate</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Clock className="w-6 h-6 mx-auto text-orange-600 mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.floor(results.runDuration / 86400)}d
                  </div>
                  <div className="text-xs text-gray-500">Run Duration</div>
                </div>
              </div>

              {/* Statistical Significance */}
              <div className={`p-4 rounded-xl flex items-center gap-4 ${
                results.isStatisticallySignificant 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-yellow-50 border border-yellow-200'
              }`}>
                {results.isStatisticallySignificant ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <div className="font-semibold text-green-800">Statistically Significant</div>
                      <div className="text-sm text-green-700">
                        Results have reached 95% confidence level. You can trust these findings.
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                    <div>
                      <div className="font-semibold text-yellow-800">More Data Needed</div>
                      <div className="text-sm text-yellow-700">
                        Results haven't reached statistical significance yet. Keep the test running.
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Winner Badge */}
              {results.winningVariant && (
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-amber-900">
                      🎉 Winner: {results.winningVariant.name}
                    </div>
                    <div className="text-sm text-amber-700">
                      This variant outperformed others with {((results.winningVariant.conversionRate || 0) * 100).toFixed(2)}% conversion rate
                    </div>
                  </div>
                </div>
              )}

              {/* Variants Comparison */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Variants Performance</h3>
                <div className="space-y-4">
                  {results.variants.map((variant: ResultVariant, index: number) => {
                    const isWinner = results.winningVariant?.id === variant.id;
                    const improvement = variant.improvement || 0;
                    const barWidth = maxConversionRate > 0 
                      ? ((variant.conversionRate || 0) / maxConversionRate) * 100 
                      : 0;

                    return (
                      <div
                        key={variant.id || index}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          isWinner 
                            ? 'border-amber-300 bg-amber-50' 
                            : variant.isControl 
                              ? 'border-blue-200 bg-blue-50/50' 
                              : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {variant.name}
                            </span>
                            {variant.isControl && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                Control
                              </span>
                            )}
                            {isWinner && (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full flex items-center gap-1">
                                <Trophy className="w-3 h-3" />
                                Winner
                              </span>
                            )}
                          </div>
                          {!variant.isControl && (
                            <div className={`flex items-center gap-1 text-sm font-medium ${
                              improvement > 0 ? 'text-green-600' : improvement < 0 ? 'text-red-600' : 'text-gray-500'
                            }`}>
                              {improvement > 0 ? (
                                <TrendingUp className="w-4 h-4" />
                              ) : improvement < 0 ? (
                                <TrendingDown className="w-4 h-4" />
                              ) : null}
                              {improvement > 0 ? '+' : ''}{(improvement * 100).toFixed(1)}%
                            </div>
                          )}
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                            <div 
                              className={`h-full transition-all duration-500 ${
                                isWinner 
                                  ? 'bg-gradient-to-r from-amber-400 to-yellow-400' 
                                  : variant.isControl
                                    ? 'bg-gradient-to-r from-blue-400 to-indigo-400'
                                    : 'bg-gradient-to-r from-indigo-400 to-purple-400'
                              }`}
                              style={{ width: `${barWidth}%` }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-sm font-bold text-gray-900">
                                {((variant.conversionRate || 0) * 100).toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-lg font-semibold text-gray-900">
                              {(variant.visitors || 0).toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">Visitors</div>
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-gray-900">
                              {(variant.conversions || 0).toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">Conversions</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">95% CI</div>
                            <div className="text-sm font-medium text-gray-700">
                              {variant.confidenceInterval ? (
                                `${(variant.confidenceInterval.lower * 100).toFixed(1)}% - ${(variant.confidenceInterval.upper * 100).toFixed(1)}%`
                              ) : (
                                'N/A'
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

type GoalType = 'click' | 'conversion' | 'engagement' | 'revenue';

export function ExperimentsSettings() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);
  const [newExperiment, setNewExperiment] = useState({
    name: '',
    description: '',
    qrId: '',
    goalType: 'click' as GoalType,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadExperiments();
  }, []);

  const loadExperiments = async () => {
    try {
      setLoading(true);
      const res = await experimentsApi.list();
      setExperiments(res.experiments);
    } catch (error) {
      console.error('Failed to load experiments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExperiment = async () => {
    if (!newExperiment.name) return;
    
    try {
      setIsSubmitting(true);
      const experiment = await experimentsApi.create({
        name: newExperiment.name,
        description: newExperiment.description || undefined,
        qrId: newExperiment.qrId || undefined,
        goalType: newExperiment.goalType,
        variants: [
          { name: 'Control', description: 'Original version', isControl: true, trafficWeight: 50 },
          { name: 'Variant A', description: 'Test version', isControl: false, trafficWeight: 50 },
        ],
      });
      setExperiments(prev => [...prev, experiment]);
      setNewExperiment({ name: '', description: '', qrId: '', goalType: 'click' });
      setShowCreate(false);
    } catch (error) {
      console.error('Failed to create experiment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExperiment = async (experimentId: string) => {
    if (!confirm('Are you sure you want to delete this experiment?')) return;
    
    try {
      await experimentsApi.delete(experimentId);
      setExperiments(prev => prev.filter(e => e.id !== experimentId));
    } catch (error) {
      console.error('Failed to delete experiment:', error);
    }
  };

  const handleControlExperiment = async (experimentId: string, action: 'start' | 'pause' | 'stop') => {
    try {
      let updated: Experiment;
      switch (action) {
        case 'start':
          updated = await experimentsApi.start(experimentId);
          break;
        case 'pause':
          updated = await experimentsApi.pause(experimentId);
          break;
        case 'stop':
          updated = await experimentsApi.stop(experimentId);
          break;
      }
      setExperiments(prev => prev.map(e => e.id === updated.id ? updated : e));
    } catch (error) {
      console.error(`Failed to ${action} experiment:`, error);
    }
  };

  const getStatusBadge = (status: Experiment['status']) => {
    switch (status) {
      case 'draft':
        return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Draft</span>;
      case 'running':
        return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Running</span>;
      case 'paused':
        return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Paused</span>;
      case 'completed':
        return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">Completed</span>;
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
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-white/20 rounded-lg">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">A/B Testing</h2>
            <p className="text-emerald-100 mt-1">
              Run experiments to optimize your QR codes and microsites. Test different variants and see which performs better.
            </p>
          </div>
        </div>
      </div>

      {/* Experiments List */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Your Experiments</h2>
            <p className="text-sm text-gray-500 mt-1">
              {experiments.filter(e => e.status === 'running').length} running, {experiments.length} total
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Experiment
          </button>
        </div>

        {/* Create Form */}
        {showCreate && (
          <div className="p-6 border-b bg-gray-50">
            <h4 className="font-medium text-gray-900 mb-4">Create New Experiment</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newExperiment.name}
                  onChange={(e) => setNewExperiment(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Homepage Button Color Test"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
                <select
                  value={newExperiment.goalType}
                  onChange={(e) => setNewExperiment(prev => ({ ...prev, goalType: e.target.value as GoalType }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="click">Click Rate</option>
                  <option value="conversion">Conversions</option>
                  <option value="engagement">Engagement</option>
                  <option value="revenue">Revenue</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">QR Code ID (optional)</label>
                <input
                  type="text"
                  value={newExperiment.qrId}
                  onChange={(e) => setNewExperiment(prev => ({ ...prev, qrId: e.target.value }))}
                  placeholder="Leave empty for all QR codes"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                <input
                  type="text"
                  value={newExperiment.description}
                  onChange={(e) => setNewExperiment(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Testing red vs blue CTA buttons"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleCreateExperiment}
                disabled={!newExperiment.name || isSubmitting}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Experiment'}
              </button>
              <button
                onClick={() => {
                  setShowCreate(false);
                  setNewExperiment({ name: '', description: '', qrId: '', goalType: 'click' });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Experiments Grid */}
        <div className="p-6">
          {experiments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FlaskConical className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No experiments yet</h3>
              <p className="text-gray-500 mb-4">Create your first A/B test to start optimizing</p>
              <button
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Your First Experiment
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {experiments.map((experiment) => (
                <div key={experiment.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        experiment.status === 'running' ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <FlaskConical className={`w-5 h-5 ${
                          experiment.status === 'running' ? 'text-green-600' : 'text-gray-400'
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">{experiment.name}</h4>
                          {getStatusBadge(experiment.status)}
                        </div>
                        {experiment.description && (
                          <p className="text-sm text-gray-500 mt-1">{experiment.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>{experiment.variants?.length || 0} variants</span>
                          <span>Goal: {experiment.goalType?.replace('_', ' ') || 'click'}</span>
                          {experiment.status === 'running' && (
                            <span className="flex items-center gap-1 text-green-600">
                              <TrendingUp className="w-3 h-3" />
                              Active
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {experiment.status === 'draft' && (
                        <button
                          onClick={() => handleControlExperiment(experiment.id, 'start')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Start experiment"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                      {experiment.status === 'running' && (
                        <>
                          <button
                            onClick={() => handleControlExperiment(experiment.id, 'pause')}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                            title="Pause experiment"
                          >
                            <Pause className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleControlExperiment(experiment.id, 'stop')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Stop experiment"
                          >
                            <Square className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {experiment.status === 'paused' && (
                        <button
                          onClick={() => handleControlExperiment(experiment.id, 'start')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Resume experiment"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedExperiment(experiment)}
                        className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                        title="View results"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteExperiment(experiment.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results Modal */}
      {selectedExperiment && (
        <ResultsModal
          experiment={selectedExperiment}
          onClose={() => setSelectedExperiment(null)}
        />
      )}
    </div>
  );
}
