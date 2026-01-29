/**
 * ML & AI Settings Component
 * Predictive Analytics, AI Generation, and Personalization settings
 * Includes DEMO MODE when backend is unavailable
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Sparkles, 
  Target, 
  Clock,
  RefreshCw,
  Loader2,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Zap,
  BarChart3,
  Activity,
  Wand2,
  Eye,
  TestTube2
} from 'lucide-react';
import { predictiveApi } from '../../lib/api';
import type { MLModel, OptimalTime } from '../../lib/api';

// Define color themes for each model type to avoid dynamic Tailwind classes
const modelThemes: Record<string, { border: string; bg: string; iconBg: string; iconText: string }> = {
  qr_performance: {
    border: 'border-blue-200',
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-600',
  },
  conversion_forecast: {
    border: 'border-emerald-200',
    bg: 'bg-emerald-50',
    iconBg: 'bg-emerald-100',
    iconText: 'text-emerald-600',
  },
  churn_prediction: {
    border: 'border-amber-200',
    bg: 'bg-amber-50',
    iconBg: 'bg-amber-100',
    iconText: 'text-amber-600',
  },
  optimal_time: {
    border: 'border-violet-200',
    bg: 'bg-violet-50',
    iconBg: 'bg-violet-100',
    iconText: 'text-violet-600',
  },
};

// Demo data for optimal times
const DEMO_OPTIMAL_TIMES: OptimalTime[] = [
  { dayOfWeek: 2, hour: 10, score: 0.94, formattedTime: 'Tuesday 10:00 AM' },
  { dayOfWeek: 4, hour: 14, score: 0.89, formattedTime: 'Thursday 2:00 PM' },
  { dayOfWeek: 3, hour: 11, score: 0.85, formattedTime: 'Wednesday 11:00 AM' },
  { dayOfWeek: 1, hour: 9, score: 0.82, formattedTime: 'Monday 9:00 AM' },
  { dayOfWeek: 5, hour: 15, score: 0.78, formattedTime: 'Friday 3:00 PM' },
  { dayOfWeek: 6, hour: 12, score: 0.71, formattedTime: 'Saturday 12:00 PM' },
];

export function MLSettings() {
  const navigate = useNavigate();
  const [models, setModels] = useState<MLModel[]>([]);
  const [optimalTimes, setOptimalTimes] = useState<OptimalTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [trainingModel, setTrainingModel] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [organizationId] = useState('00000000-0000-0000-0000-000000000001');

  useEffect(() => {
    loadModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadModels = async () => {
    try {
      setLoading(true);
      const res = await predictiveApi.getModels(organizationId);
      setModels(res.data);
      setDemoMode(false);
      
      // Try to load optimal times if model exists
      try {
        const timesRes = await predictiveApi.getOptimalTimes(organizationId);
        setOptimalTimes(timesRes.data.optimalTimes);
      } catch {
        // No optimal time model yet
      }
    } catch (error) {
      console.error('Failed to load ML models:', error);
      // Don't auto-enable demo mode, let user choose
    } finally {
      setLoading(false);
    }
  };

  const handleTrainModel = async (modelType: 'qr_performance' | 'conversion_forecast' | 'churn_prediction' | 'optimal_time') => {
    if (demoMode) {
      // Simulate training in demo mode
      setTrainingModel(modelType);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const existingIndex = models.findIndex(m => m.modelType === modelType);
      const newModel: MLModel = {
        id: `demo-${Date.now()}`,
        organizationId: 'demo',
        modelType,
        status: 'active',
        metrics: { 
          accuracy: 0.75 + Math.random() * 0.2, 
          precision: 0.7 + Math.random() * 0.25, 
          recall: 0.72 + Math.random() * 0.23 
        },
        trainingDataSize: Math.floor(5000 + Math.random() * 15000),
        version: existingIndex >= 0 ? (Number(models[existingIndex].version) || 0) + 1 : 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      if (existingIndex >= 0) {
        setModels(prev => prev.map((m, i) => i === existingIndex ? newModel : m));
      } else {
        setModels(prev => [...prev, newModel]);
      }
      
      if (modelType === 'optimal_time') {
        setOptimalTimes(DEMO_OPTIMAL_TIMES);
      }
      
      setTrainingModel(null);
      return;
    }

    try {
      setTrainingModel(modelType);
      await predictiveApi.trainModel(organizationId, modelType);
      await loadModels();
    } catch (error) {
      console.error('Failed to train model:', error);
      alert('Failed to train model. The ML service may not be running. Try enabling Demo Mode to see the UI in action.');
    } finally {
      setTrainingModel(null);
    }
  };

  const getModelIcon = (type: string) => {
    switch (type) {
      case 'qr_performance':
        return <BarChart3 className="w-5 h-5" />;
      case 'conversion_forecast':
        return <TrendingUp className="w-5 h-5" />;
      case 'churn_prediction':
        return <Activity className="w-5 h-5" />;
      case 'optimal_time':
        return <Clock className="w-5 h-5" />;
      default:
        return <Brain className="w-5 h-5" />;
    }
  };

  const getModelDescription = (type: string) => {
    switch (type) {
      case 'qr_performance':
        return 'Predict QR scan volume based on time, day, and historical patterns';
      case 'conversion_forecast':
        return 'Forecast CTA click-through rates and conversion probability';
      case 'churn_prediction':
        return 'Identify QR codes at risk of becoming inactive';
      case 'optimal_time':
        return 'Find the best times to launch campaigns for maximum engagement';
      default:
        return '';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
            <CheckCircle className="w-3.5 h-3.5" /> Active
          </span>
        );
      case 'training':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Training
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" /> Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border shadow-sm p-12">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
          <p className="text-sm text-gray-500 font-medium">Loading ML models...</p>
        </div>
      </div>
    );
  }

  const modelTypes = [
    { type: 'qr_performance' as const, name: 'QR Performance Predictor' },
    { type: 'conversion_forecast' as const, name: 'Conversion Forecast' },
    { type: 'churn_prediction' as const, name: 'Churn Predictor' },
    { type: 'optimal_time' as const, name: 'Optimal Time Finder' },
  ];

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-white/20 rounded-lg">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Machine Learning & AI</h2>
            <p className="text-purple-100 mt-1">
              Train ML models on your data to predict performance, forecast conversions, and find optimal timing for your campaigns.
            </p>
          </div>
        </div>
      </div>

      {/* ML Models */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Predictive Models</h2>
              <p className="text-sm text-gray-500 mt-1">
                Train neural networks on your historical data
              </p>
            </div>
            <button
              onClick={loadModels}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 grid gap-4 md:grid-cols-2">
          {modelTypes.map(({ type, name }) => {
            const existingModel = models.find(m => m.modelType === type);
            const isTraining = trainingModel === type;
            const theme = modelThemes[type];
            const isActive = existingModel?.status === 'active';
            
            return (
              <div 
                key={type}
                className={`p-5 rounded-2xl border-2 transition-all duration-200 hover:shadow-md ${
                  isActive 
                    ? `${theme.border} ${theme.bg}` 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                    isActive
                      ? `${theme.iconBg} ${theme.iconText}`
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {getModelIcon(type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-gray-900">{name}</h4>
                      {existingModel && getStatusBadge(existingModel.status)}
                    </div>
                    <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
                      {getModelDescription(type)}
                    </p>
                    
                    {existingModel && existingModel.status === 'active' && (
                      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-white/80 px-3 py-2 rounded-lg border shadow-sm">
                          <span className="text-gray-500 block">Accuracy</span>
                          <span className="font-bold text-lg text-gray-900">
                            {((existingModel.metrics?.accuracy || 0) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="bg-white/80 px-3 py-2 rounded-lg border shadow-sm">
                          <span className="text-gray-500 block">Samples</span>
                          <span className="font-bold text-lg text-gray-900">
                            {(existingModel.trainingDataSize || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <button
                      onClick={() => handleTrainModel(type)}
                      disabled={isTraining}
                      className={`mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? 'border-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'
                          : 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 shadow-md hover:shadow-lg'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isTraining ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Training...
                        </>
                      ) : existingModel?.status === 'active' ? (
                        <>
                          <RefreshCw className="w-4 h-4" />
                          Retrain Model
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Train Model
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Optimal Times */}
      {optimalTimes.length > 0 && (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="p-6 border-b bg-gradient-to-r from-violet-50 to-purple-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Optimal Campaign Times</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Best times to launch QR campaigns based on your historical data
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {optimalTimes.slice(0, 6).map((time, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    index === 0 
                      ? 'bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200 shadow-sm' 
                      : 'bg-gray-50 border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${
                    index === 0 
                      ? 'bg-gradient-to-br from-violet-600 to-purple-600 text-white' 
                      : 'bg-white text-gray-600 border border-gray-200'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{time.formattedTime}</p>
                    <p className="text-sm text-gray-500">
                      Engagement Score: <span className="font-medium text-gray-700">{(time.score * 100).toFixed(1)}%</span>
                    </p>
                  </div>
                  {index === 0 && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-semibold">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Best
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Features */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">AI-Powered Features</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Advanced AI capabilities for your microsites
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div 
            onClick={() => navigate('/ml-test')} 
            className="group p-5 rounded-xl border-2 border-gray-100 hover:border-violet-300 hover:bg-gradient-to-br hover:from-violet-50 hover:to-purple-50 transition-all duration-200 cursor-pointer"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900">AI Microsite Generator</h4>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Generate complete microsites from a text prompt or brand URL using GPT-4
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs text-violet-600 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              GPT-4 Powered
            </div>
          </div>
          
          <div 
            onClick={() => navigate('/ml-test?tab=personalization')} 
            className="group p-5 rounded-xl border-2 border-gray-100 hover:border-emerald-300 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-green-50 transition-all duration-200 cursor-pointer"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900">Personalized CTAs</h4>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Dynamic call-to-actions based on time, location, weather, and user behavior
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <Activity className="w-3.5 h-3.5" />
              Context Aware
            </div>
          </div>
          
          <div 
            onClick={() => navigate('/accessibility')} 
            className="group p-5 rounded-xl border-2 border-gray-100 hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 transition-all duration-200 cursor-pointer"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900">Accessibility Scanner</h4>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              WCAG 2.1 AA/AAA compliance checking with AI-powered auto-fix suggestions
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs text-blue-600 font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              WCAG 2.1 Compliant
            </div>
          </div>
          
          <div 
            onClick={() => navigate('/settings?tab=experiments')} 
            className="group p-5 rounded-xl border-2 border-gray-100 hover:border-amber-300 hover:bg-gradient-to-br hover:from-amber-50 hover:to-orange-50 transition-all duration-200 cursor-pointer"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
              <TestTube2 className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900">ML-Enhanced A/B Testing</h4>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Multi-armed bandit algorithms for intelligent traffic allocation
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs text-amber-600 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              Auto-Optimize
            </div>
          </div>
          
          <div 
            onClick={() => alert('Smart Micro-Interactions coming soon! This feature will generate AI-powered animations and hover effects.')} 
            className="group p-5 rounded-xl border-2 border-gray-100 hover:border-rose-300 hover:bg-gradient-to-br hover:from-rose-50 hover:to-pink-50 transition-all duration-200 cursor-pointer"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900">Smart Micro-Interactions</h4>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              AI-generated animations and hover effects to boost engagement
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs text-rose-600 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Coming Soon
            </div>
          </div>
          
          <div 
            onClick={() => navigate('/analytics')} 
            className="group p-5 rounded-xl border-2 border-gray-100 hover:border-indigo-300 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-violet-50 transition-all duration-200 cursor-pointer"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900">Predictive Analytics</h4>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Forecast performance and get data-driven recommendations
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs text-indigo-600 font-medium">
              <BarChart3 className="w-3.5 h-3.5" />
              Data-Driven
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
