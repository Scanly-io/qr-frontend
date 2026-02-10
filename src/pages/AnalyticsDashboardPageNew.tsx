/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { analyticsApi, micrositeApi } from '@/lib/api';
import {
  TrendingUp, Users, MapPin, Smartphone, Clock, MousePointer, Globe, ExternalLink, Activity, ChevronDown,
  ArrowUpRight, ArrowDownRight, Calendar, Download, ChevronRight, BarChart3, Monitor, Tablet
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ComingSoonTooltip } from '@/components/ui/ComingSoonBadge';

// Country name → flag emoji helper
const countryToFlag = (country: string): string => {
  const map: Record<string, string> = {
    'United States': '🇺🇸', 'US': '🇺🇸', 'USA': '🇺🇸',
    'United Kingdom': '🇬🇧', 'UK': '🇬🇧', 'GB': '🇬🇧',
    'Canada': '🇨🇦', 'CA': '🇨🇦',
    'Australia': '🇦🇺', 'AU': '🇦🇺',
    'Germany': '🇩🇪', 'DE': '🇩🇪',
    'France': '🇫🇷', 'FR': '🇫🇷',
    'India': '🇮🇳', 'IN': '🇮🇳',
    'Japan': '🇯🇵', 'JP': '🇯🇵',
    'China': '🇨🇳', 'CN': '🇨🇳',
    'Brazil': '🇧🇷', 'BR': '🇧🇷',
    'Mexico': '🇲🇽', 'MX': '🇲🇽',
    'Spain': '🇪🇸', 'ES': '🇪🇸',
    'Italy': '🇮🇹', 'IT': '🇮🇹',
    'Netherlands': '🇳🇱', 'NL': '🇳🇱',
    'South Korea': '🇰🇷', 'KR': '🇰🇷',
    'Singapore': '🇸🇬', 'SG': '🇸🇬',
    'Sweden': '🇸🇪', 'SE': '🇸🇪',
    'Norway': '🇳🇴', 'NO': '🇳🇴',
    'Denmark': '🇩🇰', 'DK': '🇩🇰',
    'Finland': '🇫🇮', 'FI': '🇫🇮',
    'Switzerland': '🇨🇭', 'CH': '🇨🇭',
    'Austria': '🇦🇹', 'AT': '🇦🇹',
    'Belgium': '🇧🇪', 'BE': '🇧🇪',
    'Portugal': '🇵🇹', 'PT': '🇵🇹',
    'Ireland': '🇮🇪', 'IE': '🇮🇪',
    'New Zealand': '🇳🇿', 'NZ': '🇳🇿',
    'Argentina': '🇦🇷', 'AR': '🇦🇷',
    'Colombia': '🇨🇴', 'CO': '🇨🇴',
    'Chile': '🇨🇱', 'CL': '🇨🇱',
    'Poland': '🇵🇱', 'PL': '🇵🇱',
    'Turkey': '🇹🇷', 'TR': '🇹🇷',
    'Russia': '🇷🇺', 'RU': '🇷🇺',
    'South Africa': '🇿🇦', 'ZA': '🇿🇦',
    'Israel': '🇮🇱', 'IL': '🇮🇱',
    'UAE': '🇦🇪', 'United Arab Emirates': '🇦🇪', 'AE': '🇦🇪',
    'Saudi Arabia': '🇸🇦', 'SA': '🇸🇦',
    'Thailand': '🇹🇭', 'TH': '🇹🇭',
    'Indonesia': '🇮🇩', 'ID': '🇮🇩',
    'Philippines': '🇵🇭', 'PH': '🇵🇭',
    'Vietnam': '🇻🇳', 'VN': '🇻🇳',
    'Malaysia': '🇲🇾', 'MY': '🇲🇾',
    'Taiwan': '🇹🇼', 'TW': '🇹🇼',
    'Hong Kong': '🇭🇰', 'HK': '🇭🇰',
    'Nigeria': '🇳🇬', 'NG': '🇳🇬',
    'Egypt': '🇪🇬', 'EG': '🇪🇬',
    'Kenya': '🇰🇪', 'KE': '🇰🇪',
    'Pakistan': '🇵🇰', 'PK': '🇵🇰',
    'Bangladesh': '🇧🇩', 'BD': '🇧🇩',
    'Unknown': '🌍',
  };
  return map[country] || '🌐';
};

// Custom dark tooltip component for all charts
const DarkTooltip = ({ active, payload, label, formatter }: any) => {
  if (!active || !payload?.length) return null;
  const displayLabel = formatter?.label ? formatter.label(label) : label;
  return (
    <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700">
      <p className="text-xs text-slate-400 mb-1.5">{displayLabel}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color || '#8b5cf6' }} />
          <span className="text-sm font-medium">{Number(entry.value).toLocaleString()} {entry.name || 'scans'}</span>
        </div>
      ))}
    </div>
  );
};

// Empty state component
const EmptyState = ({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle: string }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-slate-300" />
    </div>
    <p className="text-slate-500 text-sm font-medium">{title}</p>
    <p className="text-slate-400 text-xs mt-1 max-w-[240px]">{subtitle}</p>
  </div>
);

// Date range options
type DateRange = '7d' | '30d' | '90d' | 'all';

interface MicrositeOption {
  id: string;
  qrId: string;
  title: string;
}

export default function AnalyticsDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [microsites, setMicrosites] = useState<MicrositeOption[]>([]);
  const [selectedQrId, setSelectedQrId] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  
  const [stats, setStats] = useState<any>(null);
  const [timeseries, setTimeseries] = useState<any>(null);
  const [geographic, setGeographic] = useState<any>(null);
  const [devices, setDevices] = useState<any>(null);
  const [patterns, setPatterns] = useState<any>(null);
  const [ctaButtons, setCtaButtons] = useState<any>(null);
  const [referrers, setReferrers] = useState<any>(null);
  const [funnel, setFunnel] = useState<any>(null);

  // Load microsites on mount, then load analytics for the first one
  useEffect(() => {
    const init = async () => {
      try {
        const data = await micrositeApi.list();
        const options = (data as MicrositeOption[]).map(m => ({
          id: m.id,
          qrId: m.qrId,
          title: m.title,
        }));
        setMicrosites(options);
        if (options.length > 0) {
          setSelectedQrId(options[0].qrId);
        } else {
          setLoading(false);
        }
      } catch {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Load analytics whenever selectedQrId changes
  useEffect(() => {
    if (!selectedQrId) return;
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const [summaryRes, timeseriesRes, geoRes, devicesRes, patternsRes, ctaRes, referrersRes, funnelRes] =
          await Promise.all([
            analyticsApi.getSummary(selectedQrId),
            analyticsApi.getTimeseries(selectedQrId),
            analyticsApi.getGeography(selectedQrId),
            analyticsApi.getDevices(selectedQrId),
            analyticsApi.getPatterns(selectedQrId),
            analyticsApi.getCTAButtons(selectedQrId),
            analyticsApi.getReferrers(selectedQrId),
            analyticsApi.getFunnel(selectedQrId)
          ]);

        setStats(summaryRes);
        setTimeseries(timeseriesRes);
        setGeographic(geoRes);
        setDevices(devicesRes);
        setPatterns(patternsRes);
        setCtaButtons(ctaRes);
        setReferrers(referrersRes);
        setFunnel(funnelRes);
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, [selectedQrId]);

  // Filter timeseries data based on selected date range (must be before early return)
  const filteredTimeseries = useMemo(() => {
    const series = timeseries?.timeSeries || [];
    if (dateRange === 'all' || series.length === 0) return series;
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return series.filter((d: any) => new Date(d.date) >= cutoff);
  }, [timeseries, dateRange]);

  // Device type colors and icons for donut chart
  const DEVICE_COLORS = ['#8b5cf6', '#3b82f6', '#f59e0b', '#10b981'];
  const deviceIcon = (type: string) => {
    if (type === 'mobile') return <Smartphone className="w-4 h-4" />;
    if (type === 'tablet') return <Tablet className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full min-h-[60vh]">
          <div className="text-center">
            <div className="w-14 h-14 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 text-sm">Loading analytics...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const mobilePercentage = devices?.byDeviceType ? 
    ((devices.byDeviceType.find((d: any) => d.deviceType === 'mobile')?.count || 0) / stats?.totalevents * 100).toFixed(0) 
    : '0';

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header with Microsite Selector */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
              <p className="text-sm text-slate-500 mt-1">Track performance and engagement</p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Date Range Picker */}
              <div className="flex items-center bg-slate-100 rounded-lg p-1">
                {([
                  { key: '7d' as DateRange, label: '7 days' },
                  { key: '30d' as DateRange, label: '30 days' },
                  { key: '90d' as DateRange, label: '90 days' },
                  { key: 'all' as DateRange, label: 'All time' },
                ]).map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setDateRange(key)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      dateRange === key 
                        ? 'bg-white text-slate-900 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Export CSV */}
              <ComingSoonTooltip feature="CSV Export">
                <button
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:text-slate-800 transition-all shadow-sm"
                  title="Export as CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </ComingSoonTooltip>

              {/* Microsite Selector */}
              {microsites.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:border-violet-300 transition-all shadow-sm text-sm font-medium text-slate-700 min-w-[200px]"
                  >
                    <span className="truncate flex-1 text-left">
                      {microsites.find(m => m.qrId === selectedQrId)?.title || 'Select microsite'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {showDropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                      <div className="absolute right-0 mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1 max-h-64 overflow-auto">
                        {microsites.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => {
                              setSelectedQrId(m.qrId);
                              setShowDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-violet-50 transition-colors ${
                              m.qrId === selectedQrId ? 'bg-violet-50 text-violet-700 font-medium' : 'text-slate-700'
                            }`}
                          >
                            <div className="truncate font-medium">{m.title}</div>
                            <div className="text-xs text-slate-400 font-mono">/{m.qrId}</div>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
                <MousePointer className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Scans</p>
              <p className="text-3xl font-bold text-slate-900">{stats?.totalevents?.toLocaleString() || '0'}</p>
              <p className="text-xs text-emerald-600 mt-2">Today: {stats?.todayevents || '0'}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                <Users className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Last 7 Days</p>
              <p className="text-3xl font-bold text-slate-900">{stats?.last7Daysevents?.toLocaleString() || '0'}</p>
              <p className="text-xs text-slate-500 mt-2">{((stats?.last7Daysevents / 7) || 0).toFixed(1)} avg/day</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <MapPin className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Countries</p>
              <p className="text-3xl font-bold text-slate-900">{geographic?.byCountry?.length || '0'}</p>
              <p className="text-xs text-slate-500 mt-2">{geographic?.byCity?.length || '0'} cities</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Mobile Traffic</p>
              <p className="text-3xl font-bold text-slate-900">{mobilePercentage}%</p>
              <p className="text-xs text-slate-500 mt-2">
                {devices?.byDeviceType?.find((d: any) => d.deviceType === 'mobile')?.count || 0} mobile users
              </p>
            </div>
          </div>
        </div>

        {/* Scan Trends Chart - Enhanced */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          {/* Chart Header */}
          <div className="px-8 pt-8 pb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Scan Trends</h2>
                  <p className="text-sm text-slate-500">Daily scan activity over time</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {/* Summary stats */}
                {(() => {
                  const series = filteredTimeseries;
                  const totalScans = series.reduce((s: number, d: any) => s + d.count, 0);
                  const avgDaily = series.length ? (totalScans / series.length).toFixed(1) : '0';
                  const maxDay = series.length ? series.reduce((m: any, d: any) => d.count > (m?.count || 0) ? d : m, series[0]) : null;
                  // Trend: compare last half vs first half
                  const mid = Math.floor(series.length / 2);
                  const firstHalf = series.slice(0, mid).reduce((s: number, d: any) => s + d.count, 0);
                  const secondHalf = series.slice(mid).reduce((s: number, d: any) => s + d.count, 0);
                  const trendUp = secondHalf >= firstHalf;
                  const trendPct = firstHalf > 0 ? Math.abs(((secondHalf - firstHalf) / firstHalf) * 100).toFixed(0) : '0';
                  return (
                    <div className="hidden md:flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Total</p>
                        <p className="text-xl font-bold text-slate-900">{totalScans.toLocaleString()}</p>
                      </div>
                      <div className="w-px h-10 bg-slate-200" />
                      <div className="text-right">
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Avg/day</p>
                        <p className="text-xl font-bold text-slate-900">{avgDaily}</p>
                      </div>
                      <div className="w-px h-10 bg-slate-200" />
                      <div className="text-right">
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Trend</p>
                        <div className="flex items-center gap-1">
                          {trendUp ? (
                            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-red-500" />
                          )}
                          <span className={`text-xl font-bold ${trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
                            {trendPct}%
                          </span>
                        </div>
                      </div>
                      {maxDay && (
                        <>
                          <div className="w-px h-10 bg-slate-200" />
                          <div className="text-right">
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Peak</p>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-violet-500" />
                              <span className="text-sm font-semibold text-slate-700">
                                {new Date(maxDay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                              <span className="text-xs text-slate-400">({maxDay.count})</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Chart */}
          {filteredTimeseries.length > 0 ? (
          <>
          <div className="px-4 pb-6">
            <ResponsiveContainer width="100%" height={360}>
              <AreaChart data={filteredTimeseries} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.25} />
                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="0" 
                  stroke="#f1f5f9" 
                  vertical={false}
                />
                <XAxis 
                  dataKey="date" 
                  stroke="#94a3b8" 
                  fontSize={11}
                  fontWeight={500}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickMargin={12}
                  tickFormatter={(value) => {
                    const d = new Date(value);
                    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  }}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={11}
                  fontWeight={500}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  allowDecimals={false}
                />
                <Tooltip 
                  content={({ active, payload, label }: any) => {
                    if (!active || !payload?.length) return null;
                    const d = new Date(label);
                    const dateStr = d.toLocaleDateString('en-US', { 
                      weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' 
                    });
                    return (
                      <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700">
                        <p className="text-xs text-slate-400 mb-1">{dateStr}</p>
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-violet-400" />
                          <span className="text-sm font-medium">{payload[0].value?.toLocaleString()} scans</span>
                        </div>
                      </div>
                    );
                  }}
                  cursor={{ stroke: '#8b5cf6', strokeWidth: 1, strokeDasharray: '5 5' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  name="Scans" 
                  stroke="url(#strokeGradient)" 
                  strokeWidth={2.5}
                  fill="url(#colorScans)"
                  dot={false}
                  activeDot={{ 
                    r: 6, 
                    stroke: '#7c3aed', 
                    strokeWidth: 2, 
                    fill: 'white',
                    filter: 'drop-shadow(0 2px 4px rgba(124, 58, 237, 0.3))'
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Bottom insight bar */}
          {(() => {
            const series = filteredTimeseries;
            if (series.length < 2) return null;
            const sorted = [...series].sort((a: any, b: any) => b.count - a.count);
            const busiest = sorted[0];
            const quietest = sorted[sorted.length - 1];
            return (
              <div className="border-t border-slate-100 bg-slate-50/50 px-8 py-3 flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  <span className="font-medium text-slate-700">Busiest day:</span>{' '}
                  {new Date(busiest.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  {' '}({busiest.count} scans)
                </p>
                <p className="text-xs text-slate-500">
                  <span className="font-medium text-slate-700">Quietest day:</span>{' '}
                  {new Date(quietest.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  {' '}({quietest.count} scans)
                </p>
              </div>
            );
          })()}
          </>
          ) : (
            <EmptyState icon={TrendingUp} title="No scan data yet" subtitle="Scan trends will appear once your QR code is scanned" />
          )}
        </div>

        {/* Device Analytics - Donut + Bars */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Device Type - Donut Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <Smartphone className="w-5 h-5 text-violet-500" />
                <h2 className="text-lg font-semibold text-slate-900">Device Type</h2>
              </div>
              <p className="text-xs text-slate-500">Distribution by device category</p>
            </div>
            {(devices?.byDeviceType || []).length > 0 ? (
              <>
                <div className="flex justify-center">
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={devices.byDeviceType}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="count"
                        nameKey="deviceType"
                        stroke="none"
                      >
                        {devices.byDeviceType.map((_: any, index: number) => (
                          <Cell key={index} fill={DEVICE_COLORS[index % DEVICE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<DarkTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3 mt-2">
                  {devices.byDeviceType.map((device: any, index: number) => {
                    const total = devices.byDeviceType.reduce((sum: number, d: any) => sum + d.count, 0) || 1;
                    const percentage = ((device.count / total) * 100).toFixed(1);
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: DEVICE_COLORS[index % DEVICE_COLORS.length] }} />
                          <span className="text-slate-600">{deviceIcon(device.deviceType)}</span>
                          <span className="text-sm font-medium text-slate-700 capitalize">{device.deviceType}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900">{percentage}%</span>
                          <span className="text-xs text-slate-400">({device.count})</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <EmptyState icon={Smartphone} title="No device data yet" subtitle="Device breakdowns appear after users scan your QR code" />
            )}
          </div>

          {/* Operating System */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Operating System</h2>
              <p className="text-xs text-slate-500">User platform breakdown</p>
            </div>
            {(devices?.byOS || []).length > 0 ? (
              <div className="space-y-4">
                {devices.byOS.map((os: any, index: number) => {
                  const total = devices.byOS.reduce((sum: number, o: any) => sum + o.count, 0) || 1;
                  const percentage = ((os.count / total) * 100).toFixed(1);
                  const colors = ['#10b981', '#22c55e', '#14b8a6', '#0ea5e9', '#06b6d4'];
                  const displayName = os.version ? `${os.os} ${os.version}` : os.os;
                  return (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-700">{displayName}</span>
                        <span className="text-sm font-semibold text-slate-900">{percentage}%</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500" 
                          style={{ width: `${percentage}%`, backgroundColor: colors[index % 5] }}
                        />
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{os.count.toLocaleString()} scans</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState icon={BarChart3} title="No OS data yet" subtitle="OS breakdowns appear after users scan your QR code" />
            )}
          </div>

          {/* Browser */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Browser</h2>
              <p className="text-xs text-slate-500">Browser usage statistics</p>
            </div>
            {(devices?.byBrowser || []).length > 0 ? (
              <div className="space-y-4">
                {devices.byBrowser.map((browser: any, index: number) => {
                  const total = devices.byBrowser.reduce((sum: number, b: any) => sum + b.count, 0) || 1;
                  const percentage = ((browser.count / total) * 100).toFixed(1);
                  const colors = ['#3b82f6', '#f59e0b', '#0ea5e9', '#ef4444'];
                  const displayName = browser.version ? `${browser.browser} ${browser.version.split('.')[0]}` : browser.browser;
                  return (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-700">{displayName}</span>
                        <span className="text-sm font-semibold text-slate-900">{percentage}%</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500" 
                          style={{ width: `${percentage}%`, backgroundColor: colors[index % 4] }}
                        />
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{browser.count.toLocaleString()} scans</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState icon={Globe} title="No browser data yet" subtitle="Browser breakdowns appear after users scan your QR code" />
            )}
          </div>
        </div>

        {/* Business Insights - Time Patterns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Peak Hours with Business Context */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-5 h-5 text-violet-500" />
                    <h2 className="text-lg font-semibold text-slate-900">Peak Hours</h2>
                  </div>
                  <p className="text-xs text-slate-500">Best times for engagement</p>
                </div>
                {patterns?.byHourOfDay && patterns.byHourOfDay.length > 0 && (() => {
                  const peakHour = patterns.byHourOfDay.reduce((max: any, hour: any) => 
                    hour.count > (max?.count || 0) ? hour : max, patterns.byHourOfDay[0]
                  );
                  return (
                    <div className="text-right">
                      <p className="text-2xl font-bold text-violet-600">{peakHour.hour}:00</p>
                      <p className="text-xs text-slate-500">Peak hour</p>
                    </div>
                  );
                })()}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={patterns?.byHourOfDay || []}>
                <defs>
                  <linearGradient id="hourGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip 
                  content={<DarkTooltip formatter={{ label: (v: any) => `${v}:00` }} />}
                  cursor={{ fill: 'rgba(139, 92, 246, 0.08)' }}
                />
                <Bar dataKey="count" name="scans" fill="url(#hourGradient)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            {/* Business Insights */}
            {patterns?.byHourOfDay && patterns.byHourOfDay.length > 0 && (() => {
              const sortedHours = [...patterns.byHourOfDay].sort((a: any, b: any) => b.count - a.count);
              const peakHours = sortedHours.slice(0, 3);
              return (
                <div className="mt-4 p-4 bg-violet-50 rounded-lg">
                  <p className="text-xs font-semibold text-violet-900 mb-2">💡 Business Insight</p>
                  <p className="text-xs text-slate-600">
                    Peak activity: {peakHours.map((h: any) => `${h.hour}:00`).join(', ')}. 
                    <span className="font-medium"> Schedule campaigns during these hours for maximum reach.</span>
                  </p>
                </div>
              );
            })()}
          </div>

          {/* Day of Week with Business Context */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-5 h-5 text-emerald-500" />
                    <h2 className="text-lg font-semibold text-slate-900">Weekly Pattern</h2>
                  </div>
                  <p className="text-xs text-slate-500">Busiest days of the week</p>
                </div>
                {patterns?.byDayOfWeek && patterns.byDayOfWeek.length > 0 && (() => {
                  const peakDay = patterns.byDayOfWeek.reduce((max: any, day: any) => 
                    day.count > (max?.count || 0) ? day : max, patterns.byDayOfWeek[0]
                  );
                  return (
                    <div className="text-right">
                      <p className="text-xl font-bold text-emerald-600">{peakDay.dayName}</p>
                      <p className="text-xs text-slate-500">Peak day</p>
                    </div>
                  );
                })()}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={patterns?.byDayOfWeek || []}>
                <defs>
                  <linearGradient id="dayGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="dayName" 
                  stroke="#94a3b8" 
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickFormatter={(value) => value.substring(0, 3)}
                />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip 
                  content={<DarkTooltip />}
                  cursor={{ fill: 'rgba(16, 185, 129, 0.08)' }}
                />
                <Bar dataKey="count" name="scans" fill="url(#dayGradient)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            {/* Business Insights */}
            {patterns?.byDayOfWeek && patterns.byDayOfWeek.length > 0 && (() => {
              const sortedDays = [...patterns.byDayOfWeek].sort((a: any, b: any) => b.count - a.count);
              const weekdayTotal = sortedDays.filter((d: any) => d.day >= 1 && d.day <= 5).reduce((sum: number, d: any) => sum + d.count, 0);
              const weekendTotal = sortedDays.filter((d: any) => d.day === 0 || d.day === 6).reduce((sum: number, d: any) => sum + d.count, 0);
              const total = weekdayTotal + weekendTotal;
              return (
                <div className="mt-4 p-4 bg-emerald-50 rounded-lg">
                  <p className="text-xs font-semibold text-emerald-900 mb-2">💡 Business Insight</p>
                  <p className="text-xs text-slate-600">
                    {weekdayTotal > weekendTotal 
                      ? `Weekday traffic (${((weekdayTotal/total)*100).toFixed(0)}%) dominates. Target B2B audience on weekdays.`
                      : `Weekend traffic (${((weekendTotal/total)*100).toFixed(0)}%) is higher. Focus on consumer campaigns.`
                    }
                  </p>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Geographic Distribution - Enhanced with Map-style Visual */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="w-5 h-5 text-blue-500" />
                  <h2 className="text-lg font-semibold text-slate-900">Geographic Distribution</h2>
                </div>
                <p className="text-xs text-slate-500">Scans by country and top cities</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{geographic?.byCountry?.length || 0}</p>
                <p className="text-xs text-slate-500">countries</p>
              </div>
            </div>
          </div>

          {(geographic?.byCountry?.length > 0 || geographic?.byCity?.length > 0) ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Countries */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Top Countries</h3>
              <div className="space-y-3">
                {(geographic?.byCountry || []).slice(0, 6).map((country: any, index: number) => (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{countryToFlag(country.country)}</span>
                        <span className="font-medium text-slate-900">{country.country}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">{country.count.toLocaleString()}</span>
                        <span className="text-sm font-semibold text-blue-600 w-12 text-right">{country.percentage}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500 group-hover:from-blue-600 group-hover:to-indigo-700"
                        style={{ width: `${country.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Cities */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Top Cities</h3>
              <div className="space-y-3">
                {(geographic?.byCity || []).slice(0, 6).map((city: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-slate-50 to-blue-50 hover:from-slate-100 hover:to-blue-100 transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-base">{countryToFlag(city.country)}</span>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 truncate">{city.city}</p>
                        <p className="text-xs text-slate-500">{city.country}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(city.count / (geographic?.byCity[0]?.count || 1)) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 w-10 text-right">
                        {city.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          ) : (
            <EmptyState icon={Globe} title="No geographic data yet" subtitle="Location data appears after users scan your QR code from different regions" />
          )}
        </div>

        {/* User Engagement & CTA Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* CTA Button Performance - Enhanced */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <MousePointer className="w-5 h-5 text-violet-500" />
                <h2 className="text-lg font-semibold text-slate-900">User Engagement</h2>
              </div>
              <p className="text-xs text-slate-500">CTA performance and click tracking</p>
            </div>
            {ctaButtons?.buttons && ctaButtons.buttons.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg">
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Total Clicks</p>
                    <p className="text-2xl font-bold text-violet-600">{ctaButtons.totalButtonClicks.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Engagement Rate</p>
                    <p className="text-2xl font-bold text-violet-600">
                      {ctaButtons.totalViews > 0 ? ((ctaButtons.totalButtonClicks / ctaButtons.totalViews) * 100).toFixed(1) : '0'}%
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {ctaButtons.buttons.slice(0, 5).map((button: any, index: number) => (
                    <div key={index} className="p-4 rounded-lg border border-slate-200 hover:border-violet-300 hover:shadow-sm transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-violet-500">#{index + 1}</span>
                            <p className="font-medium text-slate-900 truncate">{button.label}</p>
                          </div>
                          <p className="text-xs text-slate-500 truncate">{button.url}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-lg font-bold text-violet-600">{button.clickThroughRate}%</p>
                          <p className="text-xs text-slate-500">CTR</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden mr-3">
                          <div 
                            className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full"
                            style={{ width: `${Math.min(button.clickThroughRate, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-700">{button.clicks.toLocaleString()} clicks</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <MousePointer className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-500 text-sm font-medium">No button clicks yet</p>
                <p className="text-slate-400 text-xs mt-1">Data will appear when users interact with CTA buttons</p>
              </div>
            )}
          </div>

          {/* Traffic Sources */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <ExternalLink className="w-5 h-5 text-emerald-500" />
                <h2 className="text-lg font-semibold text-slate-900">Traffic Sources</h2>
              </div>
              <p className="text-xs text-slate-500">Where your visitors are coming from</p>
            </div>
            {referrers?.referrers && referrers.referrers.length > 0 ? (
              <div className="space-y-3">
                {referrers.referrers.slice(0, 6).map((referrer: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                        <Globe className="w-4 h-4 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 truncate text-sm">{referrer.domain || referrer.referrer}</p>
                        <p className="text-xs text-slate-400">{referrer.views.toLocaleString()} views</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-3">
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                          style={{ width: `${referrer.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 w-12 text-right">{referrer.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={ExternalLink} title="No traffic source data" subtitle="Referrer data appears when visitors come from external links" />
            )}
          </div>
        </div>

        {/* Conversion Funnel */}
        {funnel && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-5 h-5 text-violet-500" />
                <h2 className="text-lg font-semibold text-slate-900">Conversion Funnel</h2>
              </div>
              <p className="text-xs text-slate-500">User journey from scan to lead</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-7 gap-2 mb-8 items-center">
              {/* Stage 1: Scans */}
              <div className="md:col-span-1">
                <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                  <div className="text-center">
                    <div className="w-11 h-11 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <MousePointer className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xs text-slate-600 mb-1">QR Scans</p>
                    <p className="text-2xl font-bold text-slate-900">{funnel.scans.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-1">100%</p>
                  </div>
                </div>
              </div>

              {/* Arrow 1 */}
              <div className="hidden md:flex items-center justify-center">
                <ChevronRight className="w-6 h-6 text-slate-300" />
              </div>

              {/* Stage 2: Views */}
              <div className="md:col-span-1">
                <div className="p-5 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border-2 border-violet-200">
                  <div className="text-center">
                    <div className="w-11 h-11 bg-violet-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xs text-slate-600 mb-1">Microsite Views</p>
                    <p className="text-2xl font-bold text-slate-900">{funnel.views.toLocaleString()}</p>
                    <p className="text-xs text-emerald-600 font-semibold mt-1">{funnel.viewRate}%</p>
                  </div>
                </div>
              </div>

              {/* Arrow 2 */}
              <div className="hidden md:flex items-center justify-center">
                <ChevronRight className="w-6 h-6 text-slate-300" />
              </div>

              {/* Stage 3: Clicks */}
              <div className="md:col-span-1">
                <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200">
                  <div className="text-center">
                    <div className="w-11 h-11 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <MousePointer className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xs text-slate-600 mb-1">Button Clicks</p>
                    <p className="text-2xl font-bold text-slate-900">{funnel.clicks.toLocaleString()}</p>
                    <p className="text-xs text-emerald-600 font-semibold mt-1">{funnel.clickRate}% CTR</p>
                  </div>
                </div>
              </div>

              {/* Arrow 3 */}
              <div className="hidden md:flex items-center justify-center">
                <ChevronRight className="w-6 h-6 text-slate-300" />
              </div>

              {/* Stage 4: Leads */}
              <div className="md:col-span-1">
                <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200">
                  <div className="text-center">
                    <div className="w-11 h-11 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xs text-slate-600 mb-1">Leads Captured</p>
                    <p className="text-2xl font-bold text-slate-900">{funnel.leads.toLocaleString()}</p>
                    <p className="text-xs text-emerald-600 font-semibold mt-1">{funnel.leadConversionRate}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-xs font-semibold text-blue-900 mb-1">💡 View Rate</p>
                <p className="text-xs text-slate-600">
                  {funnel.viewRate > 90 
                    ? "Excellent! Most scans result in page views."
                    : "Consider improving QR scan to page load experience."}
                </p>
              </div>
              <div className="p-4 bg-violet-50 rounded-lg">
                <p className="text-xs font-semibold text-violet-900 mb-1">💡 Click-Through Rate</p>
                <p className="text-xs text-slate-600">
                  {funnel.clickRate > 30 
                    ? "Great CTR! Your CTAs are working well."
                    : funnel.clickRate > 15
                    ? "Good CTR. Test different button designs."
                    : "Low CTR. Make buttons more prominent."}
                </p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-lg">
                <p className="text-xs font-semibold text-emerald-900 mb-1">💡 Lead Conversion</p>
                <p className="text-xs text-slate-600">
                  {funnel.leadConversionRate > 5 
                    ? "Excellent conversion rate! Keep it up."
                    : funnel.leadConversionRate > 3
                    ? "Good conversion. Add incentives to boost."
                    : "Simplify your lead capture form."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
