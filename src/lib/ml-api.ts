// ML Service API Client
const ML_API_BASE = '/api/ml';

export interface AIGenerationRequest {
  prompt?: string;
  brandUrl?: string;
  brandName?: string;
  industry?: string;
  mobileFirst?: boolean;
}

export interface AIGenerationResponse {
  success: boolean;
  generationId?: string;
  preview?: {
    html: string;
    css: string;
  };
  components?: Record<string, unknown>[];
  brandAesthetic?: Record<string, unknown>;
  error?: string;
}

export interface AccessibilityScanRequest {
  micrositeId: string;
  html: string;
  standards?: string[];
}

export interface AccessibilityScanResponse {
  success: boolean;
  score?: number;
  issues?: AccessibilityIssue[];
  wcagAA?: boolean;
  wcagAAA?: boolean;
  adaCompliant?: boolean;
  autoFixesApplied?: Array<{ rule: string; element: string; fix: string }>;
  error?: string;
}

export interface AccessibilityIssue {
  type: 'error' | 'warning' | 'notice';
  rule: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  element: string;
  suggestion: string;
  autoFixable: boolean;
}

export interface PersonalizedCTA {
  id: string;
  name: string;
  defaultText: string;
  defaultUrl: string;
  rules?: Record<string, unknown>[];
  abTestEnabled?: boolean;
  impressions: number;
  clicks: number;
  conversionRate: number;
}

export interface MLModel {
  id: string;
  name: string;
  type: string;
  version: string;
  accuracy?: number;
  status: 'training' | 'active' | 'deprecated';
  trainedAt?: string;
}

// AI Generation
export async function generateMicrosite(request: AIGenerationRequest): Promise<AIGenerationResponse> {
  const response = await fetch(`${ML_API_BASE}/ai/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': getUserId(),
    },
    body: JSON.stringify(request),
  });
  
  return response.json();
}

export async function regenerateSection(generationId: string, sectionType: string, instructions: string) {
  const response = await fetch(`${ML_API_BASE}/ai/regenerate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': getUserId(),
    },
    body: JSON.stringify({ generationId, sectionType, instructions }),
  });
  
  return response.json();
}

// Accessibility Scanning
export async function scanAccessibility(request: AccessibilityScanRequest): Promise<AccessibilityScanResponse> {
  const response = await fetch(`${ML_API_BASE}/accessibility/scan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': getUserId(),
    },
    body: JSON.stringify(request),
  });
  
  return response.json();
}

export async function applyAutoFixes(scanId: string) {
  const response = await fetch(`${ML_API_BASE}/accessibility/auto-fix/${scanId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': getUserId(),
    },
  });
  
  return response.json();
}

// Personalization
export async function createPersonalizedCTA(data: {
  micrositeId: string;
  name: string;
  defaultText: string;
  defaultUrl: string;
  rules?: Record<string, unknown>[];
}): Promise<{ success: boolean; cta?: PersonalizedCTA; error?: string }> {
  const response = await fetch(`${ML_API_BASE}/personalization/cta`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': getUserId(),
    },
    body: JSON.stringify(data),
  });
  
  return response.json();
}

export async function getPersonalizedCTA(ctaId: string, context: {
  visitorId: string;
  sessionId: string;
  ip: string;
  userAgent: string;
  referrer?: string;
  utmParams?: Record<string, string>;
}) {
  const queryParams = new URLSearchParams({
    visitorId: context.visitorId,
    sessionId: context.sessionId,
    ip: context.ip,
    userAgent: context.userAgent,
    ...(context.referrer && { referrer: context.referrer }),
  });
  
  const response = await fetch(`${ML_API_BASE}/personalization/cta/${ctaId}?${queryParams}`, {
    method: 'GET',
    headers: {
      'x-user-id': getUserId(),
    },
  });
  
  return response.json();
}

// Predictive Analytics
export async function trainModel(organizationId: string, modelType: 'qr_performance' | 'conversion_forecast' | 'churn_prediction' | 'optimal_time') {
  const response = await fetch(`${ML_API_BASE}/models/train`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': getUserId(),
    },
    body: JSON.stringify({ organizationId, modelType }),
  });
  
  return response.json();
}

export async function getModels(organizationId: string): Promise<{ success: boolean; data?: MLModel[]; count?: number }> {
  const response = await fetch(`${ML_API_BASE}/models?organizationId=${organizationId}`, {
    headers: {
      'x-user-id': getUserId(),
    },
  });
  
  return response.json();
}

export async function getPrediction(organizationId: string, modelId: string, features: Record<string, unknown>) {
  const response = await fetch(`${ML_API_BASE}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': getUserId(),
    },
    body: JSON.stringify({ organizationId, modelId, features }),
  });
  
  return response.json();
}

export async function getOptimalTimes(organizationId: string) {
  const response = await fetch(`${ML_API_BASE}/best-times?organizationId=${organizationId}`, {
    headers: {
      'x-user-id': getUserId(),
    },
  });
  
  return response.json();
}

// Micro Interactions
export async function getMicroInteractions(category?: string) {
  const url = category 
    ? `${ML_API_BASE}/micro-interactions?category=${category}`
    : `${ML_API_BASE}/micro-interactions`;
    
  const response = await fetch(url, {
    headers: {
      'x-user-id': getUserId(),
    },
  });
  
  return response.json();
}

export async function addMicroInteraction(micrositeId: string, interactionId: string, config?: Record<string, unknown>) {
  const response = await fetch(`${ML_API_BASE}/micro-interactions/apply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': getUserId(),
    },
    body: JSON.stringify({ micrositeId, interactionId, config }),
  });
  
  return response.json();
}

// Helper function to get user ID (replace with actual auth)
function getUserId(): string {
  // TODO: Get from auth context
  return localStorage.getItem('userId') || '550e8400-e29b-41d4-a716-446655440000';
}
