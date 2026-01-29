/**
 * AI Assistant API (Agentic Optimizer)
 * Handles AI-powered conversion optimization and recommendations
 */

import { api } from './client';

export interface AIRecommendation {
  id: string;
  micrositeId: string;
  type: 'cta_text' | 'add_video' | 'button_position' | 'headline_change' | 'remove_element';
  title: string;
  description: string;
  reasoning: string;
  expectedImpact: string;
  confidence: number;
  changes: Record<string, unknown>;
  status: 'pending' | 'applied' | 'dismissed';
  createdAt: string;
}

export interface AIInsights {
  bounceRate: number;
  conversionRate: number;
  avgTimeOnPage: number;
  benchmarks: {
    bounceRate: number;
    conversionRate: number;
    avgTimeOnPage: number;
  };
}

export const aiAssistantApi = {
  /**
   * Get AI recommendations for a microsite
   * GET /api/ml/agentic/recommendations/:micrositeId
   */
  getRecommendations: async (micrositeId: string): Promise<AIRecommendation[]> => {
    return api.get<AIRecommendation[]>(`/ml/agentic/recommendations/${micrositeId}`);
  },

  /**
   * Auto-apply AI recommendations
   * POST /api/ml/agentic/recommendations/:micrositeId/auto-apply
   */
  autoApply: async (micrositeId: string): Promise<{
    appliedCount: number;
    recommendations: AIRecommendation[];
  }> => {
    return api.post(`/ml/agentic/recommendations/${micrositeId}/auto-apply`);
  },

  /**
   * Apply a specific recommendation
   * POST /api/ml/agentic/recommendations/:recommendationId/apply
   */
  applyRecommendation: async (recommendationId: string): Promise<{
    message: string;
    recommendation: AIRecommendation;
  }> => {
    return api.post(`/ml/agentic/recommendations/${recommendationId}/apply`);
  },

  /**
   * Dismiss a recommendation
   * POST /api/ml/agentic/recommendations/:recommendationId/dismiss
   */
  dismissRecommendation: async (recommendationId: string): Promise<{
    message: string;
  }> => {
    return api.post(`/ml/agentic/recommendations/${recommendationId}/dismiss`);
  },

  /**
   * Get AI insights and benchmarks
   * GET /api/ml/agentic/insights/:micrositeId
   */
  getInsights: async (micrositeId: string): Promise<AIInsights> => {
    return api.get<AIInsights>(`/ml/agentic/insights/${micrositeId}`);
  },
};
