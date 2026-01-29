/**
 * Experiments API Client
 * A/B Testing and Multivariate Experiments Service
 * 
 * Backend: experiments-service (Port 3013)
 */

import { api } from './client';

// ============================================
// TYPES
// ============================================

export interface ExperimentVariant {
  id?: string;
  experimentId?: string;
  name: string;
  description?: string;
  isControl: boolean;
  trafficWeight: number;
  targetUrl?: string;
  changes?: Record<string, unknown>;
  visitors?: number;
  conversions?: number;
  conversionRate?: number;
  createdAt?: string;
}

export interface Experiment {
  id: string;
  userId: string;
  qrId?: string;
  name: string;
  description?: string;
  type: 'ab' | 'multivariate' | 'split_url';
  status: 'draft' | 'running' | 'paused' | 'completed' | 'archived';
  goalType: 'click' | 'conversion' | 'engagement' | 'revenue';
  goalUrl?: string;
  goalEventName?: string;
  trafficAllocation: number;
  autoSelectWinner: boolean;
  minSampleSize: number;
  confidenceLevel: string;
  winningVariantId?: string;
  scheduledEndAt?: string;
  startedAt?: string;
  endedAt?: string;
  tags: string[];
  variants?: ExperimentVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateExperimentInput {
  name: string;
  description?: string;
  type?: 'ab' | 'multivariate' | 'split_url';
  qrId?: string;
  goalType?: 'click' | 'conversion' | 'engagement' | 'revenue';
  goalUrl?: string;
  goalEventName?: string;
  trafficAllocation?: number;
  autoSelectWinner?: boolean;
  minSampleSize?: number;
  confidenceLevel?: number;
  scheduledEndAt?: string;
  tags?: string[];
  variants: Array<{
    name: string;
    description?: string;
    isControl: boolean;
    trafficWeight: number;
    targetUrl?: string;
    changes?: Record<string, unknown>;
  }>;
}

export interface UpdateExperimentInput {
  name?: string;
  description?: string;
  goalType?: 'click' | 'conversion' | 'engagement' | 'revenue';
  goalUrl?: string;
  goalEventName?: string;
  trafficAllocation?: number;
  autoSelectWinner?: boolean;
  minSampleSize?: number;
  confidenceLevel?: number;
  scheduledEndAt?: string;
  tags?: string[];
}

export interface ExperimentResults {
  experimentId: string;
  status: string;
  totalVisitors: number;
  totalConversions: number;
  overallConversionRate: number;
  isStatisticallySignificant: boolean;
  winningVariant?: ExperimentVariant;
  variants: Array<ExperimentVariant & {
    visitors: number;
    conversions: number;
    conversionRate: number;
    improvement: number;
    confidenceInterval: { lower: number; upper: number };
    pValue?: number;
  }>;
  runDuration: number;
  lastUpdated: string;
}

export interface VariantAssignment {
  experimentId: string;
  variantId: string;
  variantName: string;
  targetUrl?: string;
}

// ============================================
// API FUNCTIONS
// ============================================

export const experimentsApi = {
  /**
   * List all experiments for the current user
   */
  list: async (params?: {
    qrId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ experiments: Experiment[]; total: number }> => {
    const searchParams = new URLSearchParams();
    if (params?.qrId) searchParams.append('qrId', params.qrId);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const query = searchParams.toString();
    return api.get(`/experiments${query ? `?${query}` : ''}`);
  },

  /**
   * Get a single experiment by ID
   */
  get: async (experimentId: string): Promise<Experiment> => {
    return api.get(`/experiments/${experimentId}`);
  },

  /**
   * Create a new experiment
   */
  create: async (data: CreateExperimentInput): Promise<Experiment> => {
    return api.post('/experiments', data);
  },

  /**
   * Update an experiment (draft only)
   */
  update: async (experimentId: string, data: UpdateExperimentInput): Promise<Experiment> => {
    return api.patch(`/experiments/${experimentId}`, data);
  },

  /**
   * Delete an experiment
   */
  delete: async (experimentId: string): Promise<void> => {
    return api.delete(`/experiments/${experimentId}`);
  },

  /**
   * Start an experiment (change status to running)
   */
  start: async (experimentId: string): Promise<Experiment> => {
    return api.post(`/experiments/${experimentId}/start`);
  },

  /**
   * Pause a running experiment
   */
  pause: async (experimentId: string): Promise<Experiment> => {
    return api.post(`/experiments/${experimentId}/pause`);
  },

  /**
   * Stop an experiment and optionally select winner
   */
  stop: async (experimentId: string, winningVariantId?: string): Promise<Experiment> => {
    return api.post(`/experiments/${experimentId}/stop`, { winningVariantId });
  },

  /**
   * Get experiment results and statistics
   */
  getResults: async (experimentId: string): Promise<ExperimentResults> => {
    return api.get(`/experiments/${experimentId}/results`);
  },

  /**
   * Get detailed analysis with statistical significance
   */
  analyze: async (experimentId: string): Promise<{
    isSignificant: boolean;
    confidence: number;
    recommendation: string;
    analysis: Record<string, unknown>;
  }> => {
    return api.get(`/experiments/${experimentId}/analyze`);
  },

  // ============================================
  // VARIANT MANAGEMENT
  // ============================================

  /**
   * Add a variant to an experiment
   */
  addVariant: async (experimentId: string, variant: {
    name: string;
    description?: string;
    isControl?: boolean;
    trafficWeight: number;
    targetUrl?: string;
    changes?: Record<string, unknown>;
  }): Promise<ExperimentVariant> => {
    return api.post(`/experiments/${experimentId}/variants`, variant);
  },

  /**
   * Update a variant
   */
  updateVariant: async (experimentId: string, variantId: string, data: {
    name?: string;
    description?: string;
    trafficWeight?: number;
    targetUrl?: string;
    changes?: Record<string, unknown>;
  }): Promise<ExperimentVariant> => {
    return api.patch(`/experiments/${experimentId}/variants/${variantId}`, data);
  },

  /**
   * Delete a variant
   */
  deleteVariant: async (experimentId: string, variantId: string): Promise<void> => {
    return api.delete(`/experiments/${experimentId}/variants/${variantId}`);
  },

  // ============================================
  // VISITOR ASSIGNMENT & TRACKING
  // ============================================

  /**
   * Assign a visitor to a variant (called during QR scan)
   */
  assignVariant: async (experimentId: string, visitorId: string): Promise<VariantAssignment> => {
    return api.post(`/experiments/${experimentId}/assign`, { visitorId });
  },

  /**
   * Track a conversion for an experiment
   */
  trackConversion: async (experimentId: string, data: {
    variantId: string;
    visitorId: string;
    eventName?: string;
    revenue?: number;
    metadata?: Record<string, unknown>;
  }): Promise<void> => {
    return api.post(`/experiments/${experimentId}/conversions`, data);
  },

  // ============================================
  // ML-ENHANCED BANDIT ALGORITHMS
  // ============================================

  /**
   * Assign variant using multi-armed bandit algorithm
   * Dynamically allocates traffic to better-performing variants
   */
  banditAssign: async (experimentId: string, data: {
    sessionId: string;
    userId?: string;
    algorithm?: 'thompson' | 'ucb' | 'epsilon_greedy';
    epsilon?: number;
  }): Promise<VariantAssignment & { algorithm: string }> => {
    return api.post(`/experiments/${experimentId}/bandit/assign`, data);
  },

  /**
   * Get ML recommendations for the experiment
   * Includes winner probabilities, optimal traffic allocation, and auto-stop recommendation
   */
  getBanditRecommendations: async (experimentId: string): Promise<{
    experimentId: string;
    experimentStatus: string;
    recommendations: {
      algorithm: string;
      nextVariant: string;
      trafficAllocation: Record<string, number>;
      winnerProbabilities: Record<string, number>;
      expectedLosses: Record<string, number>;
      autoStop: {
        shouldStop: boolean;
        reason: string;
        recommendedWinner: string | null;
        winnerProbability: number;
        expectedLoss: number;
      };
    };
    variants: Array<{
      id: string;
      name: string;
      isControl: boolean;
      totalAssignments: number;
      totalConversions: number;
      conversionRate: string;
      winProbability: string;
      recommendedTraffic: string;
    }>;
  }> => {
    return api.get(`/experiments/${experimentId}/bandit/recommendations`);
  },

  /**
   * Check if experiment should auto-stop based on ML analysis
   */
  checkAutoStop: async (experimentId: string, options?: {
    minSampleSize?: number;
    winProbabilityThreshold?: number;
    expectedLossThreshold?: number;
  }): Promise<{
    experimentId: string;
    currentStatus: string;
    shouldStop: boolean;
    reason: string;
    recommendedWinner: string | null;
    winnerProbability: number;
    expectedLoss: number;
    actionRequired: boolean;
    recommendation: string;
  }> => {
    return api.post(`/experiments/${experimentId}/bandit/auto-stop-check`, options || {});
  },

  /**
   * Get Bayesian winner probabilities for each variant
   * Uses Monte Carlo simulation to estimate probability each variant is the best
   */
  getWinnerProbabilities: async (experimentId: string): Promise<{
    experimentId: string;
    probabilities: Array<{
      variantId: string;
      variantName: string;
      isControl: boolean;
      probability: number;
      probabilityPercent: string;
      expectedLoss: number;
      expectedLossPercent: string;
    }>;
    likelyWinner: {
      id: string;
      name: string;
      probability: number;
      probabilityPercent: string;
    } | null;
    confidence: 'high' | 'medium' | 'low';
  }> => {
    return api.get(`/experiments/${experimentId}/bandit/probabilities`);
  },

  /**
   * Get optimal traffic allocation based on Thompson Sampling
   * Balances exploration (trying underexplored variants) with exploitation (favoring better performers)
   */
  getOptimalAllocation: async (experimentId: string): Promise<{
    experimentId: string;
    allocation: Array<{
      variantId: string;
      variantName: string;
      isControl: boolean;
      currentTrafficWeight: number;
      recommendedAllocation: number;
      recommendedPercent: string;
      currentStats: {
        assignments: number;
        conversions: number;
        conversionRate: string;
      };
    }>;
    note: string;
  }> => {
    return api.get(`/experiments/${experimentId}/bandit/allocation`);
  },
};
