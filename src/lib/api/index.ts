/**
 * API Module Exports
 * Centralized exports for all API functions
 */

// Core
export { api } from './client';
export { authApi } from './auth';

// Main Features
export { micrositeApi } from './microsite';
export { qrApi } from './qr';

// B2B Features (New!)
export { agenciesApi } from './agencies';
export { templatesApi } from './templates';
export { aiAssistantApi } from './ai-assistant';

// Analytics & Insights
export { analyticsApi } from './analytics';
export { insightsApi } from './insights';

// Advanced Features
export { experimentsApi } from './experiments';
export { routingApi } from './routing';
export { domainsApi } from './domains';
export { pixelsApi } from './pixels';
export { integrationsApi } from './integrations';

// ML Service
export { aiGeneratorApi, personalizationApi, accessibilityApi, predictiveApi } from './ml';

// Media Service
export { mediaApi } from './media';

// Types
export * from './types';

// Re-export types from individual modules
export type {
  Experiment,
  ExperimentVariant,
  ExperimentResults,
} from './experiments';

export type {
  Agency,
  AgencyMember,
  PricingPlan,
} from './agencies';

export type {
  SalesRoomTemplate,
  EcommerceTemplate,
} from './templates';

export type {
  AIRecommendation,
  AIInsights,
} from './ai-assistant';

export type {
  Webhook,
  WebhookLog,
  WebhookTrigger,
  Integration,
  IntegrationType,
} from './integrations';

export type {
  DashboardMetrics,
} from './insights';

export type {
  CustomDomain,
  DomainStatus,
  Subdomain,
  DomainRoute,
  DomainVerificationStatus,
} from './domains';

export type {
  LinkSchedule,
  GeoFence,
  ScheduleType,
  GeoFenceType,
} from './routing';

export type {
  Pixel,
  PixelPlatform,
  PixelEventType,
  PixelEvent,
  PixelAssignment,
  PixelTemplate,
} from './pixels';

// ML Service Types
export type {
  AIGenerationInput,
  AIGeneration,
  AIComponent,
  BrandAesthetic,
  GenerationRecord,
  PersonalizationType,
  PersonalizedCTA,
  PersonalizationRule,
  ABVariant,
  CTAResponse,
  CTAAnalytics,
  AccessibilityImpact,
  AccessibilityIssue,
  AccessibilityScanResult,
  MLCompliancePrediction,
  ComplianceRule,
  MLModelType,
  MLModelStatus,
  MLModel,
  MLModelMetrics,
  MLPrediction,
  OptimalTime,
} from './ml';
