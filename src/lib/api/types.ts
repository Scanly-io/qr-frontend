/**
 * API Response Types
 * TypeScript interfaces for backend API responses
 */

import type { Block } from '@/types';
import type { PageTheme } from '@/types/theme';

// ============================================
// AUTH TYPES
// ============================================

export interface User {
  id: string;
  email: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface SignupResponse {
  id: string;
  email: string;
}

export interface RefreshResponse {
  accessToken: string;
}

// ============================================
// MICROSITE TYPES
// ============================================

export interface MicrositeData {
  id: string;
  qrId: string;
  title: string;
  description?: string;
  
  // Type of microsite (NEW!)
  type: 'link-in-bio' | 'digital-sales-room' | 'single-product-funnel';
  
  // Multi-tenancy (NEW!)
  agencyId?: string | null;
  createdBy: string;
  
  // White-label branding (NEW!)
  brandingConfig?: {
    logoUrl?: string;
    primaryColor?: string;
    accentColor?: string;
    customCss?: string;
  } | null;
  
  // Sales Room config (NEW!)
  salesRoomConfig?: {
    prospectName?: string;
    dealValue?: number;
    videoUrls?: string[];
    passwordProtected?: boolean;
    expiresAt?: string;
  } | null;
  
  // E-commerce config (NEW!)
  ecommerceConfig?: {
    productName?: string;
    price?: number;
    checkoutUrl?: string;
    nicheCategory?: 'solar-installation' | 'custom-jewelry' | 'home-energy-audit';
    aeoOptimized?: boolean;
  } | null;
  
  // Advanced features (NEW!)
  advancedFeatures?: {
    videoEmbeds?: boolean;
    utmTracking?: boolean;
    aiAssistantEnabled?: boolean;
  } | null;
  
  // SEO config for AEO (NEW!)
  seoConfig?: {
    structuredData?: Record<string, unknown>;
    speakableContent?: string[];
    faqSchema?: Record<string, unknown>;
  } | null;
  
  // Existing fields
  theme?: PageTheme | {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
  };
  links?: unknown;
  layout?: Block[]; // Array of blocks
  publishedHtml?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface UpdateMicrositePayload {
  title?: string;
  description?: string;
  theme?: unknown; // Accept full PageTheme object (JSONB in backend)
  layout?: Block[];
  links?: unknown;
}

export interface PublishResponse {
  message: string;
  length: number;
}

// ============================================
// QR CODE TYPES
// ============================================

export interface QRCode {
  id: string;
  qrId: string;
  url: string;
  imageUrl: string;
  createdAt: string;
}

export interface GenerateQRPayload {
  url: string;
  size?: number;
  format?: 'png' | 'svg';
}

// ============================================
// ANALYTICS TYPES - Aligned with Backend API
// ============================================

// /analytics/:qrId/summary response
export interface AnalyticsSummary {
  totalevents: number;      // All-time total scans
  todayevents: number;       // Today's scans
  last7Daysevents: number;   // Last 7 days including today
}

// /analytics/:qrId/timeseries response
export interface TimeSeriesResponse {
  timeSeries: TimeSeriesData[];
}

export interface TimeSeriesData {
  date: string;
  count: number;
}

// /analytics/:qrId/patterns response
export interface PatternAnalysis {
  byHourOfDay: { hour: number; count: number }[];
  byDayOfWeek: { day: number; dayName: string; count: number }[];
}

// /analytics/:qrId/devices response
export interface DeviceAnalytics {
  qrId: string;
  period: {
    start: string;
    end: string;
  };
  byDeviceType: { deviceType: string; count: number }[];
  byOS: { os: string; count: number }[];
  byBrowser: { browser: string; count: number }[];
  totalScans: number;
}

// /analytics/:qrId/raw response
export interface PaginatedScans {
  records: RawScanRecord[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface RawScanRecord {
  id: number;
  qrId: string;
  userId?: string;
  eventType: string;
  timestamp: string;
  rawPayload?: Record<string, unknown>;
  deviceType?: string;
  os?: string;
  browser?: string;
}

// /analytics/:qrId/funnel response
export interface FunnelAnalytics {
  scans: number;         // QR scans (from qr-service /scan/:qrId)
  views: number;         // Microsite views (includes both scans + direct links)
  clicks: number;        // Button clicks
  leads: number;         // Lead captures
  viewRate: number;      // (views / scans) * 100 - can be >100% if shared
  clickRate: number;     // (clicks / views) * 100
  leadConversionRate: number;  // (leads / views) * 100
}

// /analytics/:qrId/geography response
export interface GeographyAnalytics {
  totalScans: number;
  byCountry: { country: string; count: number; percentage: number }[];
  byCity: { country: string; city: string; count: number }[];
}

// /analytics/:qrId/unique-visitors response
export interface UniqueVisitorAnalytics {
  totalEvents: number;
  uniqueVisitors: number;
  returningVisitors: number;
  newVisitorsPercentage: number;
  returningVisitorsPercentage: number;
}

// /analytics/:qrId/cta-buttons response
export interface CTAButtonAnalytics {
  totalClicks: number;
  buttons: {
    buttonId: string;
    label: string;
    url: string;
    clicks: number;
    percentage: number;
  }[];
}

// /analytics/:qrId/referrers response
export interface ReferrerAnalytics {
  totalViews: number;
  referrers: {
    referrer: string;
    domain: string | null;
    views: number;
    percentage: number;
  }[];
}

// /analytics/overview response
export interface AnalyticsOverviewResponse {
  totalQRCodes: number;
  totalScans: number;
  totalScansToday: number;
  totalScansLast7Days: number;
  topQRCodes: {
    qrId: string;
    totalScans: number;
    todayScans: number;
    name: string;
  }[];
}

// /analytics/live response
export interface LiveEvent {
  id: number;
  qrId: string;
  eventType: string;
  timestamp: string;
  deviceType?: string;
  os?: string;
  browser?: string;
  country?: string;
  city?: string;
}

export interface LiveEventsResponse {
  events: LiveEvent[];
  latestTimestamp: string;
}

// Legacy analytics types (for compatibility with old mock data)
export interface DeviceBreakdown {
  devices: Array<{ deviceType: string; count: number }>;
  os: Array<{ os: string; count: number }>;
  browsers: Array<{ browser: string; count: number }>;
}

export interface AnalyticsOverview {
  totalScans: number;
  totalViews: number;
  totalClicks: number;
  totalLeads: number;
  scansChange: string;
  viewsChange: string;
  clicksChange: string;
  leadsChange: string;
  scanTimeline: TimeSeriesData[];
  deviceBreakdown: { name: string; value: number }[];
  geoData: { country: string; city: string; count: number }[];
  topQRs: { id: string; name: string; scans: number }[];
  recentEvents: AnalyticsEvent[];
}

export interface AnalyticsEvent {
  id: string;
  eventType: 'qr.scanned' | 'microsite.viewed' | 'button.clicked' | 'lead.captured';
  qrId: string;
  micrositeId?: string;
  deviceType?: string;
  os?: string;
  browser?: string;
  country?: string;
  city?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface QRAnalytics {
  qrId: string;
  qrName: string;
  totalScans: number;
  totalViews: number;
  totalClicks: number;
  totalLeads: number;
  scanTimeline: TimeSeriesData[];
  deviceStats: { name: string; value: number }[];
  browserStats: { name: string; value: number }[];
  osStats: { name: string; value: number }[];
  geoData: { country: string; city: string; count: number }[];
  funnelData: {
    scans: number;
    views: number;
    clicks: number;
    leads: number;
  };
  events: AnalyticsEvent[];
}

export interface AnalyticsTimeRange {
  range: '24h' | '7d' | '30d' | '90d' | 'all';
}

// ============================================
// ERROR TYPES
// ============================================

export interface APIError {
  error: string;
  message?: string;
}
