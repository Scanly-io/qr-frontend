/**
 * Analytics API Client
 * Aligned with actual analytics-service backend endpoints
 */

import { api, API_BASE_URL } from './client';
import { format } from 'date-fns';
import type {
  AnalyticsSummary,
  TimeSeriesResponse,
  PatternAnalysis,
  DeviceAnalytics,
  PaginatedScans,
  FunnelAnalytics,
  GeographyAnalytics,
  UniqueVisitorAnalytics,
  CTAButtonAnalytics,
  ReferrerAnalytics,
  AnalyticsOverviewResponse,
  LiveEventsResponse,
} from './types';

export const analyticsApi = {
  /**
   * GET /analytics/:qrId/summary
   * Quick overview of scan counts
   */
  getSummary: async (qrId: string, micrositeId?: string): Promise<AnalyticsSummary> => {
    const params = micrositeId ? `?micrositeId=${micrositeId}` : '';
    return api.get<AnalyticsSummary>(`/analytics/${qrId}/summary${params}`);
  },

  /**
   * GET /analytics/:qrId/timeseries
   * Daily scan counts for charting
   */
  getTimeseries: async (qrId: string, micrositeId?: string): Promise<TimeSeriesResponse> => {
    const params = micrositeId ? `?micrositeId=${micrositeId}` : '';
    return api.get<TimeSeriesResponse>(`/analytics/${qrId}/timeseries${params}`);
  },

  /**
   * GET /analytics/:qrId/patterns
   * Scan patterns by hour and day of week
   */
  getPatterns: async (qrId: string, micrositeId?: string): Promise<PatternAnalysis> => {
    const params = micrositeId ? `?micrositeId=${micrositeId}` : '';
    return api.get<PatternAnalysis>(`/analytics/${qrId}/patterns${params}`);
  },

  /**
   * GET /analytics/:qrId/devices
   * Device, OS, and browser breakdown
   */
  getDevices: async (
    qrId: string,
    startDate?: string,
    endDate?: string,
    micrositeId?: string,
  ): Promise<DeviceAnalytics> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (micrositeId) params.append('micrositeId', micrositeId);
    
    const url = `/analytics/${qrId}/devices${params.toString() ? `?${params.toString()}` : ''}`;
    return api.get<DeviceAnalytics>(url);
  },

  /**
   * GET /analytics/:qrId/raw
   * Individual scan records with pagination
   */
  getRawScans: async (
    qrId: string,
    page: number = 1,
    pageSize: number = 50,
    startDate?: string,
    endDate?: string
  ): Promise<PaginatedScans> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    return api.get<PaginatedScans>(`/analytics/${qrId}/raw?${params.toString()}`);
  },

  /**
   * GET /analytics/:qrId/funnel
   * Conversion funnel metrics
   */
  getFunnel: async (qrId: string, startDate?: string, endDate?: string, micrositeId?: string): Promise<FunnelAnalytics> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (micrositeId) params.append('micrositeId', micrositeId);
    
    const url = `/analytics/${qrId}/funnel${params.toString() ? `?${params.toString()}` : ''}`;
    return api.get<FunnelAnalytics>(url);
  },

  /**
   * GET /analytics/:qrId/geography
   * Geographic distribution by country and city
   */
  getGeography: async (qrId: string, startDate?: string, endDate?: string, micrositeId?: string): Promise<GeographyAnalytics> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (micrositeId) params.append('micrositeId', micrositeId);
    
    const url = `/analytics/${qrId}/geography${params.toString() ? `?${params.toString()}` : ''}`;
    return api.get<GeographyAnalytics>(url);
  },

  /**
   * GET /analytics/:qrId/unique-visitors
   * Unique visitor analytics
   */
  getUniqueVisitors: async (qrId: string, startDate?: string, endDate?: string, micrositeId?: string): Promise<UniqueVisitorAnalytics> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (micrositeId) params.append('micrositeId', micrositeId);
    
    const url = `/analytics/${qrId}/unique-visitors${params.toString() ? `?${params.toString()}` : ''}`;
    return api.get<UniqueVisitorAnalytics>(url);
  },

  /**
   * GET /analytics/:qrId/cta-buttons
   * CTA button click analytics
   */
  getCTAButtons: async (qrId: string, startDate?: string, endDate?: string, micrositeId?: string): Promise<CTAButtonAnalytics> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (micrositeId) params.append('micrositeId', micrositeId);
    
    const url = `/analytics/${qrId}/cta-buttons${params.toString() ? `?${params.toString()}` : ''}`;
    return api.get<CTAButtonAnalytics>(url);
  },

  /**
   * GET /analytics/:qrId/referrers
   * Traffic source analytics
   */
  getReferrers: async (qrId: string, startDate?: string, endDate?: string, micrositeId?: string): Promise<ReferrerAnalytics> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (micrositeId) params.append('micrositeId', micrositeId);
    
    const url = `/analytics/${qrId}/referrers${params.toString() ? `?${params.toString()}` : ''}`;
    return api.get<ReferrerAnalytics>(url);
  },

  /**
   * GET /analytics/overview
   * Overview of all QR codes
   */
  getOverview: async (): Promise<AnalyticsOverviewResponse> => {
    return api.get<AnalyticsOverviewResponse>('/analytics/overview');
  },

  /**
   * GET /analytics/live
   * Live events feed for real-time monitoring
   */
  getLiveEvents: async (limit: number = 50, since?: string): Promise<LiveEventsResponse> => {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (since) params.append('since', since);
    
    return api.get<LiveEventsResponse>(`/analytics/live?${params.toString()}`);
  },

  /**
   * GET /analytics/:qrId/export
   * Export analytics as CSV
   */
  exportCSV: (qrId: string, startDate?: string, endDate?: string, limit: number = 10000) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    params.append('limit', limit.toString());
    
    // Trigger browser download
    window.location.href = `${API_BASE_URL}/analytics/${qrId}/export?${params.toString()}`;
  },

  /**
   * AGGREGATE ANALYTICS METHODS
   * For dashboard views that need data across all QR codes
   */

  /**
   * Get aggregate stats across all QR codes
   */
  getStats: async (startDate?: Date, endDate?: Date) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _start = startDate; // Keep for API signature consistency
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _end = endDate; // Keep for API signature consistency
    
    const overview = await api.get<AnalyticsOverviewResponse>('/analytics/overview');
    
    // Calculate growth rate (comparing today vs last 7 days average)
    const avgDaily = overview.totalScansLast7Days / 7;
    const growth = avgDaily > 0 
      ? ((overview.totalScansToday - avgDaily) / avgDaily * 100).toFixed(1)
      : '0';

    return {
      data: {
        totalScans: overview.totalScans,
        uniqueUsers: overview.totalQRCodes, // Using unique QR codes as proxy
        growth: `${growth}%`,
        avgScansPerUser: overview.totalQRCodes > 0 
          ? Math.round(overview.totalScans / overview.totalQRCodes)
          : 0,
        totalScansToday: overview.totalScansToday,
        totalScansLast7Days: overview.totalScansLast7Days,
      }
    };
  },

  /**
   * Get aggregate time series data across all QR codes
   */
  getTimeSeries: async (interval: string, startDate?: Date, endDate?: Date) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _interval = interval; // Keep for API signature consistency
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _start = startDate;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _end = endDate;
    
    // Get live events to build time series (limited approach)
    // In production, would need a dedicated aggregate endpoint
    const events = await api.get<LiveEventsResponse>('/analytics/live?limit=1000');
    
    // Group events by date
    const dateMap = new Map<string, number>();
    
    events.events.forEach((event) => {
      const date = format(new Date(event.timestamp), 'yyyy-MM-dd');
      dateMap.set(date, (dateMap.get(date) || 0) + 1);
    });

    // Convert to array and sort
    const timeSeries = Array.from(dateMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      data: { timeSeries }
    };
  },

  /**
   * Get aggregate geographic data across all QR codes
   */
  getGeographic: async (startDate?: Date, endDate?: Date) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _start = startDate;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _end = endDate;
    
    // Get live events to aggregate geography
    const events = await api.get<LiveEventsResponse>('/analytics/live?limit=1000');
    
    // Aggregate by country
    const countryMap = new Map<string, number>();
    const cityMap = new Map<string, { country: string; city: string; count: number }>();
    
    events.events.forEach((event) => {
      if (event.country) {
        countryMap.set(event.country, (countryMap.get(event.country) || 0) + 1);
      }
      if (event.city && event.country) {
        const key = `${event.country}:${event.city}`;
        const existing = cityMap.get(key) || { country: event.country, city: event.city, count: 0 };
        cityMap.set(key, { ...existing, count: existing.count + 1 });
      }
    });

    const byCountry = Array.from(countryMap.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);

    const byCities = Array.from(cityMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      data: { byCountry, byCities }
    };
  },

  /**
   * Get aggregate device analytics across all QR codes (renamed from getDevices)
   */
  getAggregateDevices: async (startDate?: Date, endDate?: Date) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _start = startDate;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _end = endDate;
    
    // Get live events to aggregate device data
    const events = await api.get<LiveEventsResponse>('/analytics/live?limit=1000');
    
    // Aggregate by device type, OS, and browser
    const deviceMap = new Map<string, number>();
    const osMap = new Map<string, number>();
    const browserMap = new Map<string, number>();
    
    events.events.forEach((event) => {
      if (event.deviceType) {
        deviceMap.set(event.deviceType, (deviceMap.get(event.deviceType) || 0) + 1);
      }
      if (event.os) {
        osMap.set(event.os, (osMap.get(event.os) || 0) + 1);
      }
      if (event.browser) {
        browserMap.set(event.browser, (browserMap.get(event.browser) || 0) + 1);
      }
    });

    const byDeviceType = Array.from(deviceMap.entries())
      .map(([name, value]) => ({ name, value }));

    const byOS = Array.from(osMap.entries())
      .map(([name, value]) => ({ name, value }));

    const byBrowser = Array.from(browserMap.entries())
      .map(([name, value]) => ({ name, value }));

    return {
      data: { byDeviceType, byOS, byBrowser }
    };
  },

  /**
   * Get aggregate usage patterns across all QR codes (renamed from getPatterns)
   */
  getAggregatePatterns: async (startDate?: Date, endDate?: Date) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _start = startDate;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _end = endDate;
    
    // Get live events to aggregate patterns
    const events = await api.get<LiveEventsResponse>('/analytics/live?limit=1000');
    
    // Aggregate by hour and day of week
    const hourMap = new Map<number, number>();
    const dayMap = new Map<number, number>();
    
    events.events.forEach((event) => {
      const date = new Date(event.timestamp);
      const hour = date.getHours();
      const day = date.getDay();
      
      hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
      dayMap.set(day, (dayMap.get(day) || 0) + 1);
    });

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const byHourOfDay = Array.from(hourMap.entries())
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => a.hour - b.hour);

    const byDayOfWeek = Array.from(dayMap.entries())
      .map(([day, count]) => ({ day, dayName: dayNames[day], count }))
      .sort((a, b) => a.day - b.day);

    return {
      data: { byHourOfDay, byDayOfWeek }
    };
  },
};
