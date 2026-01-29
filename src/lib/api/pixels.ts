/**
 * Pixels API Client
 * Retargeting Pixels for Advertising Platforms
 * 
 * Backend: pixels-service (Port 3011)
 * 
 * Supported Platforms:
 * - Facebook Pixel
 * - Google Ads (Google Tag)
 * - TikTok Pixel
 * - LinkedIn Insight Tag
 * - Twitter Pixel
 * - Snapchat Pixel
 * - Pinterest Tag
 * - Custom Pixels
 */

import { api } from './client';

// ============================================
// TYPES
// ============================================

export type PixelPlatform = 
  | 'facebook'
  | 'google_ads'
  | 'google_analytics'
  | 'tiktok'
  | 'linkedin'
  | 'twitter'
  | 'snapchat'
  | 'pinterest'
  | 'custom';

export type PixelEventType = 
  | 'PageView'
  | 'Lead'
  | 'Purchase'
  | 'AddToCart'
  | 'InitiateCheckout'
  | 'CompleteRegistration'
  | 'Contact'
  | 'SubmitApplication'
  | 'Subscribe'
  | 'ViewContent'
  | 'Search'
  | 'AddPaymentInfo'
  | 'AddToWishlist'
  | 'CustomEvent';

export interface Pixel {
  id: string;
  userId: string;
  platform: PixelPlatform;
  name: string;
  pixelId: string; // The actual pixel ID from the platform
  accessToken?: string; // For server-side tracking
  isActive: boolean;
  
  // Configuration
  config: {
    trackPageViews?: boolean;
    trackClicks?: boolean;
    trackFormSubmits?: boolean;
    customEvents?: string[];
    excludedPaths?: string[];
    // Platform-specific config
    [key: string]: unknown;
  };
  
  // Stats
  eventsFired: number;
  lastFiredAt?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface PixelEvent {
  id: string;
  pixelId: string;
  qrId?: string;
  micrositeId?: string;
  eventType: PixelEventType;
  eventName?: string; // For custom events
  eventData?: Record<string, unknown>;
  value?: number;
  currency?: string;
  visitorId?: string;
  sessionId?: string;
  userAgent?: string;
  ipAddress?: string;
  referrer?: string;
  pageUrl?: string;
  success: boolean;
  error?: string;
  createdAt: string;
}

export interface CreatePixelInput {
  platform: PixelPlatform;
  name: string;
  pixelId: string;
  accessToken?: string;
  config?: {
    trackPageViews?: boolean;
    trackClicks?: boolean;
    trackFormSubmits?: boolean;
    customEvents?: string[];
    excludedPaths?: string[];
    [key: string]: unknown;
  };
}

export interface UpdatePixelInput {
  name?: string;
  pixelId?: string;
  accessToken?: string;
  isActive?: boolean;
  config?: Pixel['config'];
}

export interface PixelAssignment {
  id: string;
  pixelId: string;
  targetType: 'qr' | 'microsite';
  targetId: string;
  events: PixelEventType[];
  customEventNames?: string[];
  isActive: boolean;
  createdAt: string;
}

export interface PixelTemplate {
  platform: PixelPlatform;
  name: string;
  description: string;
  requiredFields: Array<{
    name: string;
    label: string;
    type: 'text' | 'password' | 'select';
    required: boolean;
    placeholder?: string;
    options?: string[];
  }>;
  supportedEvents: PixelEventType[];
  setupInstructions: string;
  documentationUrl: string;
}

// ============================================
// API FUNCTIONS
// ============================================

export const pixelsApi = {
  // ============================================
  // PIXEL MANAGEMENT
  // ============================================

  /**
   * List all pixels
   */
  listPixels: async (): Promise<{ pixels: Pixel[] }> => {
    return api.get('/pixels');
  },

  /**
   * Get a single pixel
   */
  getPixel: async (pixelId: string): Promise<Pixel> => {
    return api.get(`/pixels/${pixelId}`);
  },

  /**
   * Create a new pixel
   */
  createPixel: async (data: CreatePixelInput): Promise<Pixel> => {
    return api.post('/pixels', data);
  },

  /**
   * Update a pixel
   */
  updatePixel: async (pixelId: string, data: UpdatePixelInput): Promise<Pixel> => {
    return api.patch(`/pixels/${pixelId}`, data);
  },

  /**
   * Delete a pixel
   */
  deletePixel: async (pixelId: string): Promise<void> => {
    return api.delete(`/pixels/${pixelId}`);
  },

  /**
   * Toggle pixel active status
   */
  togglePixel: async (pixelId: string, isActive: boolean): Promise<Pixel> => {
    return api.patch(`/pixels/${pixelId}`, { isActive });
  },

  /**
   * Test pixel connection
   */
  testPixel: async (pixelId: string): Promise<{
    success: boolean;
    message: string;
    testEventSent?: boolean;
  }> => {
    return api.post(`/pixels/${pixelId}/test`);
  },

  // ============================================
  // PIXEL ASSIGNMENTS
  // ============================================

  /**
   * List pixel assignments for a QR code or microsite
   */
  listAssignments: async (params: {
    targetType: 'qr' | 'microsite';
    targetId: string;
  }): Promise<{ assignments: PixelAssignment[] }> => {
    return api.get(`/pixels/assignments?targetType=${params.targetType}&targetId=${params.targetId}`);
  },

  /**
   * Assign a pixel to a QR code or microsite
   */
  assignPixel: async (data: {
    pixelId: string;
    targetType: 'qr' | 'microsite';
    targetId: string;
    events: PixelEventType[];
    customEventNames?: string[];
  }): Promise<PixelAssignment> => {
    return api.post('/pixels/assignments', data);
  },

  /**
   * Update pixel assignment
   */
  updateAssignment: async (assignmentId: string, data: {
    events?: PixelEventType[];
    customEventNames?: string[];
    isActive?: boolean;
  }): Promise<PixelAssignment> => {
    return api.patch(`/pixels/assignments/${assignmentId}`, data);
  },

  /**
   * Remove pixel assignment
   */
  removeAssignment: async (assignmentId: string): Promise<void> => {
    return api.delete(`/pixels/assignments/${assignmentId}`);
  },

  // ============================================
  // PIXEL EVENTS
  // ============================================

  /**
   * Get pixel events log
   */
  getPixelEvents: async (pixelId: string, params?: {
    qrId?: string;
    micrositeId?: string;
    eventType?: PixelEventType;
    success?: boolean;
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<{ events: PixelEvent[]; total: number }> => {
    const searchParams = new URLSearchParams();
    if (params?.qrId) searchParams.append('qrId', params.qrId);
    if (params?.micrositeId) searchParams.append('micrositeId', params.micrositeId);
    if (params?.eventType) searchParams.append('eventType', params.eventType);
    if (params?.success !== undefined) searchParams.append('success', params.success.toString());
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);
    
    const query = searchParams.toString();
    return api.get(`/pixels/${pixelId}/events${query ? `?${query}` : ''}`);
  },

  /**
   * Get pixel event stats
   */
  getPixelStats: async (pixelId: string, params?: {
    period?: 'today' | 'week' | 'month' | 'all';
  }): Promise<{
    totalEvents: number;
    successRate: number;
    eventsByType: Record<PixelEventType, number>;
    eventsByDay: Array<{ date: string; count: number }>;
  }> => {
    const searchParams = new URLSearchParams();
    if (params?.period) searchParams.append('period', params.period);
    
    const query = searchParams.toString();
    return api.get(`/pixels/${pixelId}/stats${query ? `?${query}` : ''}`);
  },

  // ============================================
  // MANUAL EVENT FIRING
  // ============================================

  /**
   * Fire a pixel event manually (server-side)
   */
  fireEvent: async (data: {
    pixelId: string;
    eventType: PixelEventType;
    eventName?: string;
    eventData?: Record<string, unknown>;
    value?: number;
    currency?: string;
    qrId?: string;
    micrositeId?: string;
  }): Promise<{ success: boolean; eventId: string }> => {
    return api.post('/pixels/events/fire', data);
  },

  // ============================================
  // TEMPLATES & SETUP HELP
  // ============================================

  /**
   * Get pixel templates (setup instructions for each platform)
   */
  getTemplates: async (): Promise<{ templates: PixelTemplate[] }> => {
    return api.get('/pixels/templates');
  },

  /**
   * Get template for a specific platform
   */
  getTemplate: async (platform: PixelPlatform): Promise<PixelTemplate> => {
    return api.get(`/pixels/templates/${platform}`);
  },

  // ============================================
  // BULK OPERATIONS
  // ============================================

  /**
   * Assign multiple pixels to a target
   */
  bulkAssign: async (data: {
    pixelIds: string[];
    targetType: 'qr' | 'microsite';
    targetId: string;
    events: PixelEventType[];
  }): Promise<{ assignments: PixelAssignment[] }> => {
    return api.post('/pixels/assignments/bulk', data);
  },

  /**
   * Remove all pixels from a target
   */
  removeAllAssignments: async (params: {
    targetType: 'qr' | 'microsite';
    targetId: string;
  }): Promise<void> => {
    return api.delete(`/pixels/assignments/bulk?targetType=${params.targetType}&targetId=${params.targetId}`);
  },
};
