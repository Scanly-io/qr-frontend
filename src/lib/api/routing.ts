/**
 * Routing API Client
 * Smart QR Routing - Link Scheduling & Geo-Fencing
 * 
 * Backend: routing-service (Port 3012)
 * 
 * Features:
 * - Time-based routing (link scheduling)
 * - Location-based routing (geo-fencing)
 * - Priority-based rule matching
 */

import { api } from './client';

// ============================================
// LINK SCHEDULING TYPES
// ============================================

export type ScheduleType = 'once' | 'recurring' | 'date_range';

export type RecurringPattern = 
  | 'daily'
  | 'weekdays'
  | 'weekends'
  | 'weekly'
  | 'monthly';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface LinkSchedule {
  id: string;
  userId: string;
  qrId: string;
  name: string;
  description?: string;
  scheduleType: ScheduleType;
  targetUrl: string;
  priority: number;
  isActive: boolean;
  
  // For 'once' type
  startDateTime?: string;
  endDateTime?: string;
  
  // For 'recurring' type
  recurringPattern?: RecurringPattern;
  recurringDays?: DayOfWeek[];
  startTime?: string; // HH:mm format
  endTime?: string;   // HH:mm format
  
  // For 'date_range' type
  startDate?: string;
  endDate?: string;
  
  // Timezone
  timezone: string;
  
  // Stats
  matchCount: number;
  lastMatchedAt?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduleInput {
  qrId: string;
  name: string;
  description?: string;
  scheduleType: ScheduleType;
  targetUrl: string;
  priority?: number;
  
  // For 'once' type
  startDateTime?: string;
  endDateTime?: string;
  
  // For 'recurring' type
  recurringPattern?: RecurringPattern;
  recurringDays?: DayOfWeek[];
  startTime?: string;
  endTime?: string;
  
  // For 'date_range' type
  startDate?: string;
  endDate?: string;
  
  timezone?: string;
}

// ============================================
// GEO-FENCING TYPES
// ============================================

export type GeoFenceType = 'country' | 'region' | 'city' | 'radius';

export interface GeoFence {
  id: string;
  userId: string;
  qrId: string;
  name: string;
  description?: string;
  fenceType: GeoFenceType;
  targetUrl: string;
  priority: number;
  isActive: boolean;
  
  // For country/region/city types
  country?: string;      // ISO country code (US, UK, etc.)
  countryName?: string;  // Full country name
  region?: string;       // State/province
  city?: string;         // City name
  
  // For radius type (circular geo-fence)
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  locationName?: string; // Human-readable name for the location
  
  // Stats
  matchCount: number;
  lastMatchedAt?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface CreateGeoFenceInput {
  qrId: string;
  name: string;
  description?: string;
  fenceType: GeoFenceType;
  targetUrl: string;
  priority?: number;
  
  // For country/region/city types
  country?: string;
  region?: string;
  city?: string;
  
  // For radius type
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  locationName?: string;
}

// ============================================
// ROUTING LOG TYPES
// ============================================

export interface RoutingLog {
  id: string;
  qrId: string;
  ruleType: 'schedule' | 'geo_fence';
  ruleId: string;
  ruleName: string;
  matchedUrl: string;
  visitorIp: string;
  visitorLocation?: {
    country?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  matchedAt: string;
}

// ============================================
// API FUNCTIONS
// ============================================

export const routingApi = {
  // ============================================
  // LINK SCHEDULES
  // ============================================

  /**
   * List all schedules for a QR code
   */
  listSchedules: async (qrId: string): Promise<{ schedules: LinkSchedule[] }> => {
    return api.get(`/routing/schedules?qrId=${qrId}`);
  },

  /**
   * List all schedules for the user
   */
  listAllSchedules: async (): Promise<{ schedules: LinkSchedule[] }> => {
    return api.get('/routing/schedules');
  },

  /**
   * Get a single schedule
   */
  getSchedule: async (scheduleId: string): Promise<LinkSchedule> => {
    return api.get(`/routing/schedules/${scheduleId}`);
  },

  /**
   * Create a new schedule
   */
  createSchedule: async (data: CreateScheduleInput): Promise<LinkSchedule> => {
    return api.post('/routing/schedules', data);
  },

  /**
   * Update a schedule
   */
  updateSchedule: async (
    scheduleId: string, 
    data: Partial<CreateScheduleInput>
  ): Promise<LinkSchedule> => {
    return api.patch(`/routing/schedules/${scheduleId}`, data);
  },

  /**
   * Delete a schedule
   */
  deleteSchedule: async (scheduleId: string): Promise<void> => {
    return api.delete(`/routing/schedules/${scheduleId}`);
  },

  /**
   * Toggle schedule active status
   */
  toggleSchedule: async (scheduleId: string, isActive: boolean): Promise<LinkSchedule> => {
    return api.patch(`/routing/schedules/${scheduleId}`, { isActive });
  },

  /**
   * Reorder schedule priorities
   */
  reorderSchedules: async (qrId: string, scheduleIds: string[]): Promise<void> => {
    return api.post(`/routing/schedules/reorder`, { qrId, scheduleIds });
  },

  // ============================================
  // GEO-FENCES
  // ============================================

  /**
   * List all geo-fences for a QR code
   */
  listGeoFences: async (qrId: string): Promise<{ geoFences: GeoFence[] }> => {
    return api.get(`/routing/geo-fences?qrId=${qrId}`);
  },

  /**
   * List all geo-fences for the user
   */
  listAllGeoFences: async (): Promise<{ geoFences: GeoFence[] }> => {
    return api.get('/routing/geo-fences');
  },

  /**
   * Get a single geo-fence
   */
  getGeoFence: async (geoFenceId: string): Promise<GeoFence> => {
    return api.get(`/routing/geo-fences/${geoFenceId}`);
  },

  /**
   * Create a new geo-fence
   */
  createGeoFence: async (data: CreateGeoFenceInput): Promise<GeoFence> => {
    return api.post('/routing/geo-fences', data);
  },

  /**
   * Update a geo-fence
   */
  updateGeoFence: async (
    geoFenceId: string, 
    data: Partial<CreateGeoFenceInput>
  ): Promise<GeoFence> => {
    return api.patch(`/routing/geo-fences/${geoFenceId}`, data);
  },

  /**
   * Delete a geo-fence
   */
  deleteGeoFence: async (geoFenceId: string): Promise<void> => {
    return api.delete(`/routing/geo-fences/${geoFenceId}`);
  },

  /**
   * Toggle geo-fence active status
   */
  toggleGeoFence: async (geoFenceId: string, isActive: boolean): Promise<GeoFence> => {
    return api.patch(`/routing/geo-fences/${geoFenceId}`, { isActive });
  },

  /**
   * Reorder geo-fence priorities
   */
  reorderGeoFences: async (qrId: string, geoFenceIds: string[]): Promise<void> => {
    return api.post(`/routing/geo-fences/reorder`, { qrId, geoFenceIds });
  },

  // ============================================
  // ROUTING LOGS
  // ============================================

  /**
   * Get routing logs for a QR code
   */
  getRoutingLogs: async (qrId: string, params?: {
    ruleType?: 'schedule' | 'geo_fence';
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<{ logs: RoutingLog[]; total: number }> => {
    const searchParams = new URLSearchParams();
    searchParams.append('qrId', qrId);
    if (params?.ruleType) searchParams.append('ruleType', params.ruleType);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);
    
    return api.get(`/routing/logs?${searchParams.toString()}`);
  },

  // ============================================
  // PREVIEW / TESTING
  // ============================================

  /**
   * Preview which URL would be served based on current rules
   */
  previewRouting: async (qrId: string, params?: {
    datetime?: string; // ISO datetime for time-based testing
    country?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  }): Promise<{
    matchedUrl: string;
    matchedRule?: {
      type: 'schedule' | 'geo_fence' | 'default';
      id?: string;
      name?: string;
    };
    allRules: Array<{
      type: 'schedule' | 'geo_fence';
      id: string;
      name: string;
      wouldMatch: boolean;
      priority: number;
    }>;
  }> => {
    const searchParams = new URLSearchParams();
    searchParams.append('qrId', qrId);
    if (params?.datetime) searchParams.append('datetime', params.datetime);
    if (params?.country) searchParams.append('country', params.country);
    if (params?.region) searchParams.append('region', params.region);
    if (params?.city) searchParams.append('city', params.city);
    if (params?.latitude) searchParams.append('latitude', params.latitude.toString());
    if (params?.longitude) searchParams.append('longitude', params.longitude.toString());
    
    return api.get(`/routing/preview?${searchParams.toString()}`);
  },

  // ============================================
  // HELPER DATA
  // ============================================

  /**
   * Get list of supported countries
   */
  getCountries: async (): Promise<{ countries: Array<{ code: string; name: string }> }> => {
    return api.get('/routing/countries');
  },

  /**
   * Get regions/states for a country
   */
  getRegions: async (countryCode: string): Promise<{ regions: Array<{ code: string; name: string }> }> => {
    return api.get(`/routing/countries/${countryCode}/regions`);
  },

  /**
   * Get cities for a region
   */
  getCities: async (countryCode: string, regionCode: string): Promise<{ cities: string[] }> => {
    return api.get(`/routing/countries/${countryCode}/regions/${regionCode}/cities`);
  },

  /**
   * Get available timezones
   */
  getTimezones: async (): Promise<{ timezones: Array<{ value: string; label: string; offset: string }> }> => {
    return api.get('/routing/timezones');
  },
};
