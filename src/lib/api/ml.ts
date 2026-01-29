/**
 * ML Service API Client
 * AI Generation, Personalization, Accessibility, and Predictive Analytics
 * 
 * Backend: ml-service (Port 3016)
 * 
 * Features:
 * - AI Microsite Generation (GPT-4 powered)
 * - Personalized CTAs (6 personalization types)
 * - Accessibility Scanning (WCAG 2.1, ADA compliance)
 * - Predictive Analytics (ML models for QR performance)
 */

import { api } from './client';

// ============================================
// AI GENERATION TYPES
// ============================================

export interface AIGenerationInput {
  prompt?: string;
  brandUrl?: string;
  brandName?: string;
  industry?: string;
  mobileFirst?: boolean;
}

export interface AIGeneration {
  generationId: string;
  preview: {
    html: string;
    css: string;
  };
  components: AIComponent[];
  brandAesthetic: BrandAesthetic;
}

export interface AIComponent {
  type: string;
  html: string;
  css: string;
  props?: Record<string, unknown>;
}

export interface BrandAesthetic {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontPrimary: string;
  fontSecondary: string;
  style: 'minimal' | 'bold' | 'elegant' | 'playful' | 'corporate';
}

export interface GenerationRecord {
  id: string;
  userId: string;
  prompt?: string;
  brandUrl?: string;
  html: string;
  css: string;
  components: AIComponent[];
  brandAesthetic: BrandAesthetic;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// PERSONALIZATION TYPES
// ============================================

export type PersonalizationType = 
  | 'time_of_day'
  | 'location'
  | 'weather'
  | 'device'
  | 'behavior'
  | 'demographic';

export interface PersonalizedCTA {
  id: string;
  micrositeId: string;
  name: string;
  defaultText: string;
  defaultUrl: string;
  rules: PersonalizationRule[];
  abTestEnabled: boolean;
  abVariants?: ABVariant[];
  createdAt: string;
}

export interface PersonalizationRule {
  id: string;
  type: PersonalizationType;
  condition: Record<string, unknown>;
  text: string;
  url: string;
  priority: number;
}

export interface ABVariant {
  id: string;
  name: string;
  text: string;
  url: string;
  weight: number;
}

export interface CTAResponse {
  text: string;
  url: string;
  variant?: string;
  impressionId: string;
  personalizationType?: PersonalizationType;
}

export interface CTAAnalytics {
  cta: PersonalizedCTA;
  analytics: {
    impressions: number;
    clicks: number;
    conversionRate: string;
    interactions: Array<{
      eventType: 'impression' | 'click';
      timestamp: string;
      variant?: string;
    }>;
  };
}

// ============================================
// ACCESSIBILITY TYPES
// ============================================

export type AccessibilityImpact = 'critical' | 'serious' | 'moderate' | 'minor';

export interface AccessibilityIssue {
  id: string;
  rule: string;
  description: string;
  impact: AccessibilityImpact;
  element: string;
  selector: string;
  suggestion: string;
  autoFixable: boolean;
  autoFix?: string;
  fixApplied?: boolean;
}

export interface AccessibilityScanResult {
  scanId: string;
  score: number;
  issues: AccessibilityIssue[];
  wcagAA: boolean;
  wcagAAA: boolean;
  adaCompliant: boolean;
  autoFixesApplied: number;
  shareUrl?: string;
  mlPrediction?: MLCompliancePrediction;
}

export interface MLCompliancePrediction {
  likelyIssues?: string[];
  riskScore?: number;
  recommendations?: string[];
  // Backend response properties
  wcagAA_compliance?: number;
  ada_compliance?: number;
  predicted_score?: number;
  confidence?: number;
  risk_level?: string;
}

export interface ComplianceRule {
  id: string;
  standard: 'wcag' | 'ada' | 'aoda' | 'en301549';
  level: 'A' | 'AA' | 'AAA';
  criterion: string;
  description: string;
  testProcedure: string;
}

// ============================================
// PREDICTIVE ANALYTICS TYPES
// ============================================

export type MLModelType = 
  | 'qr_performance'
  | 'conversion_forecast'
  | 'churn_prediction'
  | 'optimal_time';

export type MLModelStatus = 'training' | 'active' | 'failed' | 'archived';

export interface MLModel {
  id: string;
  organizationId: string;
  modelType: MLModelType;
  modelName?: string;
  algorithm?: string;
  version?: number | string;
  trainingDataSize?: number;
  features?: string[];
  hyperparameters?: Record<string, unknown>;
  metrics?: MLModelMetrics;
  status: MLModelStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MLModelMetrics {
  accuracy?: number;
  precision?: number;
  recall?: number;
  f1Score?: number;
  mse?: number;
  rmse?: number;
  mae?: number;
  r2Score?: number;
}

export interface MLPrediction {
  id: string;
  modelId: string;
  features: Record<string, unknown>;
  prediction: number | number[];
  confidence?: number;
  createdAt: string;
}

export interface OptimalTime {
  day?: string;
  dayOfWeek: number;
  hour: number;
  time?: string;
  score: number;
  formattedTime: string;
}

// ============================================
// AI GENERATION API
// ============================================

export const aiGeneratorApi = {
  /**
   * Generate a new microsite using AI
   */
  generate: async (input: AIGenerationInput): Promise<AIGeneration> => {
    return api.post<AIGeneration>('/ai/generate', input);
  },

  /**
   * Get generation by ID
   */
  getGeneration: async (generationId: string): Promise<{ generation: GenerationRecord }> => {
    return api.get(`/ai/generation/${generationId}`);
  },

  /**
   * Regenerate a specific section
   */
  regenerateSection: async (
    generationId: string,
    sectionType: string,
    instructions: string
  ): Promise<{ updatedSection: AIComponent }> => {
    return api.post('/ai/regenerate', { generationId, sectionType, instructions });
  },

  /**
   * List user's AI generations
   */
  listGenerations: async (): Promise<{ generations: GenerationRecord[] }> => {
    return api.get('/ai/generations');
  },
};

// ============================================
// PERSONALIZATION API
// ============================================

export const personalizationApi = {
  /**
   * Get personalized CTA for a visitor
   */
  getCTA: async (ctaId: string, visitorId?: string, sessionId?: string): Promise<{ cta: CTAResponse }> => {
    return api.post('/personalization/cta', { ctaId, visitorId, sessionId });
  },

  /**
   * Track CTA click
   */
  trackClick: async (impressionId: string, ctaId: string, micrositeId: string): Promise<void> => {
    return api.post('/personalization/cta/click', { impressionId, ctaId, micrositeId });
  },

  /**
   * Create a personalized CTA
   */
  createCTA: async (data: {
    micrositeId: string;
    name: string;
    defaultText: string;
    defaultUrl: string;
    rules?: PersonalizationRule[];
    abTestEnabled?: boolean;
    abVariants?: ABVariant[];
  }): Promise<{ cta: PersonalizedCTA }> => {
    return api.post('/personalization/cta/create', data);
  },

  /**
   * Get CTA analytics
   */
  getCTAAnalytics: async (ctaId: string): Promise<CTAAnalytics> => {
    return api.get(`/personalization/cta/${ctaId}/analytics`);
  },
};

// ============================================
// ACCESSIBILITY API
// ============================================

export const accessibilityApi = {
  /**
   * Free public accessibility scan (no auth required)
   * Accepts either a URL to scan or raw HTML content
   */
  scanFree: async (
    input: { url?: string; html?: string },
    options?: { standards?: string[]; autoFix?: boolean; email?: string }
  ): Promise<AccessibilityScanResult> => {
    if (!input.url && !input.html) {
      throw new Error('Either url or html must be provided');
    }
    return api.post('/api/ml/accessibility/scan-free', { ...input, ...options });
  },

  /**
   * Authenticated accessibility scan for microsites
   */
  scan: async (data: {
    micrositeId: string;
    url?: string;
    html?: string;
    standards?: string[];
    autoFix?: boolean;
  }): Promise<AccessibilityScanResult> => {
    return api.post('/accessibility/scan', data);
  },

  /**
   * Get scan results by ID
   */
  getScan: async (scanId: string): Promise<{ scan: AccessibilityScanResult }> => {
    return api.get(`/accessibility/scan/${scanId}`);
  },

  /**
   * Get public scan results
   */
  getPublicScan: async (scanId: string): Promise<{ scan: AccessibilityScanResult }> => {
    return api.get(`/accessibility/public/${scanId}`);
  },

  /**
   * Get embeddable badge HTML
   */
  getBadge: async (scanId: string): Promise<string> => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/accessibility/badge/${scanId}`);
    return res.text();
  },

  /**
   * Get active compliance rules
   */
  getRules: async (): Promise<{ rules: ComplianceRule[]; count: number }> => {
    return api.get('/accessibility/rules');
  },
};

// ============================================
// PREDICTIVE ANALYTICS API
// ============================================

export const predictiveApi = {
  /**
   * Train a new ML model
   */
  trainModel: async (
    organizationId: string,
    modelType: MLModelType
  ): Promise<{ modelId: string; message: string }> => {
    return api.post('/ml/models/train', { organizationId, modelType });
  },

  /**
   * Get all models for an organization
   */
  getModels: async (organizationId: string): Promise<{ data: MLModel[]; count: number }> => {
    return api.get(`/ml/models?organizationId=${organizationId}`);
  },

  /**
   * Get model by ID
   */
  getModel: async (modelId: string): Promise<{ data: MLModel }> => {
    return api.get(`/ml/models/${modelId}`);
  },

  /**
   * Make a prediction
   */
  predict: async (
    organizationId: string,
    modelId: string,
    features: Record<string, unknown>
  ): Promise<{ data: MLPrediction }> => {
    return api.post('/ml/predict', { organizationId, modelId, features });
  },

  /**
   * Get predictions for a model
   */
  getPredictions: async (modelId: string, limit?: number): Promise<{ data: MLPrediction[]; count: number }> => {
    const params = limit ? `?limit=${limit}` : '';
    return api.get(`/ml/models/${modelId}/predictions${params}`);
  },

  /**
   * Batch predict QR performance
   */
  batchPredictQR: async (
    organizationId: string,
    scenarios: Array<{ hour: number; dayOfWeek: number; deviceType: string }>
  ): Promise<{ data: MLPrediction[]; modelId: string }> => {
    return api.post('/ml/batch-predict/qr-performance', { organizationId, scenarios });
  },

  /**
   * Get optimal posting times
   */
  getOptimalTimes: async (organizationId: string): Promise<{
    data: {
      optimalTimes: OptimalTime[];
      modelId: string;
      recommendation: OptimalTime;
    };
  }> => {
    return api.get(`/ml/optimal-times?organizationId=${organizationId}`);
  },
};
