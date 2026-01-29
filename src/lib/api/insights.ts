/**
 * Insights API Client
 * Dashboard Metrics, Reports, and Business Intelligence
 * 
 * Backend: insights-service (Port 3015)
 */

import { api } from './client';

// ============================================
// TYPES
// ============================================

export type TimePeriod = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'all_time';

export type MetricType = 
  | 'total_scans'
  | 'unique_visitors'
  | 'conversion_rate'
  | 'engagement_time'
  | 'bounce_rate'
  | 'top_locations'
  | 'top_devices';

export interface DashboardMetric {
  value: number;
  previousValue?: number;
  change?: number;
  changePercent?: number;
  trend: 'up' | 'down' | 'stable';
}

export interface DashboardMetrics {
  totalScans: DashboardMetric;
  uniqueVisitors: DashboardMetric;
  conversionRate: DashboardMetric;
  avgEngagementTime: DashboardMetric;
  bounceRate?: DashboardMetric;
  activeQRCodes?: number;
  activeExperiments?: number;
  period: TimePeriod;
  lastUpdated: string;
}

export interface TopQRCode {
  id: string;
  name: string;
  shortCode: string;
  scans: number;
  conversions: number;
  conversionRate: number;
  trend: 'up' | 'down' | 'stable';
}

export interface GeographicData {
  country: string;
  countryCode: string;
  scans: number;
  percentage: number;
  cities?: Array<{
    city: string;
    scans: number;
  }>;
}

export interface DeviceData {
  category: string;
  value: string;
  count: number;
  percentage: number;
}

export interface ScanTrendPoint {
  date: string;
  scans: number;
  uniqueVisitors: number;
  conversions?: number;
}

// ============================================
// REPORT TYPES
// ============================================

export type ReportType = 
  | 'performance'
  | 'geographic'
  | 'device'
  | 'campaign'
  | 'funnel'
  | 'comparison'
  | 'custom';

export type ExportFormat = 'pdf' | 'csv' | 'excel' | 'json';

export type ScheduleFrequency = 'daily' | 'weekly' | 'monthly';

export interface ReportMetric {
  name: string;
  calculation: 'sum' | 'count' | 'avg' | 'min' | 'max' | 'distinct_count';
  field: string;
}

export interface ReportFilter {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'like';
  value: unknown;
}

export interface Report {
  id: string;
  organizationId: string;
  userId: string;
  name: string;
  description?: string;
  reportType: ReportType;
  dataSource: {
    services: string[];
    tables: string[];
  };
  metrics: ReportMetric[];
  dimensions?: string[];
  filters?: ReportFilter[];
  dateRange: {
    type: 'relative' | 'absolute';
    start?: string;
    end?: string;
    relativePeriod?: 'last_7_days' | 'last_30_days' | 'last_90_days' | 'this_month' | 'last_month';
  };
  schedule?: ScheduleFrequency;
  scheduleConfig?: Record<string, unknown>;
  exportFormat?: ExportFormat;
  emailRecipients?: string[];
  lastExecutedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportExecution {
  id: string;
  reportId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: Record<string, unknown>;
  error?: string;
  executedAt: string;
  completedAt?: string;
  downloadUrl?: string;
}

export interface CreateReportInput {
  name: string;
  description?: string;
  reportType: ReportType;
  dataSource: {
    services: string[];
    tables: string[];
  };
  metrics: ReportMetric[];
  dimensions?: string[];
  filters?: ReportFilter[];
  dateRange: {
    type: 'relative' | 'absolute';
    start?: string;
    end?: string;
    relativePeriod?: 'last_7_days' | 'last_30_days' | 'last_90_days' | 'this_month' | 'last_month';
  };
  schedule?: ScheduleFrequency;
  scheduleConfig?: Record<string, unknown>;
  exportFormat?: ExportFormat;
  emailRecipients?: string[];
}

// ============================================
// API FUNCTIONS
// ============================================

export const insightsApi = {
  // ============================================
  // DASHBOARD
  // ============================================

  /**
   * Get all dashboard metrics
   */
  getDashboardMetrics: async (params: {
    organizationId?: string;
    period: TimePeriod;
    filters?: Record<string, unknown>;
  }): Promise<DashboardMetrics> => {
    const searchParams = new URLSearchParams();
    if (params.organizationId) searchParams.append('organizationId', params.organizationId);
    searchParams.append('period', params.period);
    if (params.filters) searchParams.append('filters', JSON.stringify(params.filters));
    
    const response = await api.get<{ success: boolean; data: DashboardMetrics }>(
      `/insights/dashboard/metrics?${searchParams.toString()}`
    );
    return response.data;
  },

  /**
   * Get a specific metric
   */
  getMetric: async (
    metricType: MetricType,
    params: {
      organizationId?: string;
      period: TimePeriod;
    }
  ): Promise<DashboardMetric> => {
    const searchParams = new URLSearchParams();
    if (params.organizationId) searchParams.append('organizationId', params.organizationId);
    searchParams.append('period', params.period);
    
    const response = await api.get<{ success: boolean; data: DashboardMetric }>(
      `/insights/dashboard/metrics/${metricType}?${searchParams.toString()}`
    );
    return response.data;
  },

  /**
   * Get top performing QR codes
   */
  getTopQRCodes: async (params: {
    organizationId?: string;
    period: TimePeriod;
    limit?: number;
  }): Promise<TopQRCode[]> => {
    const searchParams = new URLSearchParams();
    if (params.organizationId) searchParams.append('organizationId', params.organizationId);
    searchParams.append('period', params.period);
    if (params.limit) searchParams.append('limit', params.limit.toString());
    
    const response = await api.get<{ success: boolean; data: TopQRCode[] }>(
      `/insights/dashboard/top-qr-codes?${searchParams.toString()}`
    );
    return response.data;
  },

  /**
   * Get geographic distribution
   */
  getGeographicDistribution: async (params: {
    organizationId?: string;
    period: TimePeriod;
    limit?: number;
  }): Promise<GeographicData[]> => {
    const searchParams = new URLSearchParams();
    if (params.organizationId) searchParams.append('organizationId', params.organizationId);
    searchParams.append('period', params.period);
    if (params.limit) searchParams.append('limit', params.limit.toString());
    
    const response = await api.get<{ success: boolean; data: GeographicData[] }>(
      `/insights/dashboard/geographic?${searchParams.toString()}`
    );
    return response.data;
  },

  /**
   * Get device breakdown
   */
  getDeviceBreakdown: async (params: {
    organizationId?: string;
    period: TimePeriod;
  }): Promise<{
    deviceTypes: DeviceData[];
    operatingSystems: DeviceData[];
    browsers: DeviceData[];
  }> => {
    const searchParams = new URLSearchParams();
    if (params.organizationId) searchParams.append('organizationId', params.organizationId);
    searchParams.append('period', params.period);
    
    const response = await api.get<{ success: boolean; data: {
      deviceTypes: DeviceData[];
      operatingSystems: DeviceData[];
      browsers: DeviceData[];
    } }>(`/insights/dashboard/devices?${searchParams.toString()}`);
    return response.data;
  },

  /**
   * Get scan trend over time
   */
  getScanTrend: async (params: {
    organizationId?: string;
    period: TimePeriod;
    granularity?: 'hour' | 'day' | 'week' | 'month';
  }): Promise<ScanTrendPoint[]> => {
    const searchParams = new URLSearchParams();
    if (params.organizationId) searchParams.append('organizationId', params.organizationId);
    searchParams.append('period', params.period);
    if (params.granularity) searchParams.append('granularity', params.granularity);
    
    const response = await api.get<{ success: boolean; data: ScanTrendPoint[] }>(
      `/insights/dashboard/trend?${searchParams.toString()}`
    );
    return response.data;
  },

  // ============================================
  // REPORTS
  // ============================================

  /**
   * List all reports
   */
  listReports: async (organizationId?: string): Promise<Report[]> => {
    const searchParams = new URLSearchParams();
    if (organizationId) searchParams.append('organizationId', organizationId);
    
    const response = await api.get<{ success: boolean; data: Report[] }>(
      `/insights/reports?${searchParams.toString()}`
    );
    return response.data;
  },

  /**
   * Create a custom report
   */
  createReport: async (data: CreateReportInput): Promise<{ reportId: string }> => {
    const response = await api.post<{ success: boolean; data: { reportId: string } }>(
      '/insights/reports',
      data
    );
    return response.data;
  },

  /**
   * Execute a report
   */
  executeReport: async (reportId: string): Promise<ReportExecution> => {
    const response = await api.post<{ success: boolean; data: ReportExecution }>(
      `/insights/reports/${reportId}/execute`
    );
    return response.data;
  },

  /**
   * Get report execution history
   */
  getReportExecutions: async (
    reportId: string,
    params?: { limit?: number }
  ): Promise<ReportExecution[]> => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const response = await api.get<{ success: boolean; data: ReportExecution[] }>(
      `/insights/reports/${reportId}/executions?${searchParams.toString()}`
    );
    return response.data;
  },

  /**
   * Update report schedule
   */
  updateReportSchedule: async (
    reportId: string,
    data: {
      schedule: ScheduleFrequency | null;
      scheduleConfig?: Record<string, unknown>;
    }
  ): Promise<void> => {
    await api.patch(`/insights/reports/${reportId}/schedule`, data);
  },

  /**
   * Delete a report
   */
  deleteReport: async (reportId: string): Promise<void> => {
    await api.delete(`/insights/reports/${reportId}`);
  },

  // ============================================
  // EXPORTS
  // ============================================

  /**
   * Export dashboard data
   */
  exportDashboard: async (params: {
    organizationId?: string;
    period: TimePeriod;
    format: ExportFormat;
  }): Promise<{ downloadUrl: string }> => {
    const searchParams = new URLSearchParams();
    if (params.organizationId) searchParams.append('organizationId', params.organizationId);
    searchParams.append('period', params.period);
    searchParams.append('format', params.format);
    
    const response = await api.get<{ success: boolean; data: { downloadUrl: string } }>(
      `/insights/exports/dashboard?${searchParams.toString()}`
    );
    return response.data;
  },
};
