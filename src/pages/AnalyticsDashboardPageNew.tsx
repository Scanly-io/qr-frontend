import { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { analyticsApi } from '@/lib/api';
import {
  TrendingUp, Users, MapPin, Smartphone, Clock, MousePointer, Globe, ExternalLink, Activity
} from 'lucide-react';

export default function AnalyticsDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [qrId] = useState('qr-d83ac423');
  const [stats, setStats] = useState<any>(null);
  const [timeseries, setTimeseries] = useState<any>(null);
  const [geographic, setGeographic] = useState<any>(null);
  const [devices, setDevices] = useState<any>(null);
  const [patterns, setPatterns] = useState<any>(null);
  const [ctaButtons, setCtaButtons] = useState<any>(null);
  const [referrers, setReferrers] = useState<any>(null);
  const [funnel, setFunnel] = useState<any>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [summaryRes, timeseriesRes, geoRes, devicesRes, patternsRes, ctaRes, referrersRes, funnelRes] =
        await Promise.all([
          analyticsApi.getSummary(qrId),
          analyticsApi.getTimeseries(qrId),
          analyticsApi.getGeography(qrId),
          analyticsApi.getDevices(qrId),
          analyticsApi.getPatterns(qrId),
          analyticsApi.getCTAButtons(qrId),
          analyticsApi.getReferrers(qrId),
          analyticsApi.getFunnel(qrId)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const mobilePercentage = devices?.byDeviceType ? 
    ((devices.byDeviceType.find((d: any) => d.deviceType === 'mobile')?.count || 0) / stats?.totalevents * 100).toFixed(0) 
    : '0';

  // Calculate engagement metrics
  const engagementRate = ctaButtons?.totalViews > 0 
    ? ((ctaButtons.totalButtonClicks / ctaButtons.totalViews) * 100).toFixed(1)
    : '0';

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with User Tracking Summary */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Analytics Dashboard</h1>
          <div className="flex items-center gap-4 flex-wrap">
            <p className="text-slate-600">Comprehensive tracking enabled:</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">
                <MousePointer className="w-3 h-3" />
                <span>Button Clicks</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                <MapPin className="w-3 h-3" />
                <span>Geo-Location</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                <Smartphone className="w-3 h-3" />
                <span>Device Info</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                <Globe className="w-3 h-3" />
                <span>Referrers</span>
              </div>
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

        {/* Scan Trends Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Scan Trends</h2>
            <p className="text-sm text-slate-500 mt-1">Daily scan activity over time</p>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={timeseries?.timeSeries || []}>
              <defs>
                <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              <Legend />
              <Area type="monotone" dataKey="count" name="Scans" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorScans)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Device Analytics - Modern Horizontal Bars */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Device Type */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Device Type</h2>
              <p className="text-xs text-slate-500">Distribution by device category</p>
            </div>
            <div className="space-y-4">
              {(devices?.byDeviceType || []).map((device: any, index: number) => {
                const total = devices?.byDeviceType.reduce((sum: number, d: any) => sum + d.count, 0) || 1;
                const percentage = ((device.count / total) * 100).toFixed(1);
                const colors = ['#8b5cf6', '#6366f1', '#a855f7'];
                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-700 capitalize">{device.deviceType}</span>
                      <span className="text-sm font-semibold text-slate-900">{percentage}%</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%`, backgroundColor: colors[index % 3] }}
                      />
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{device.count.toLocaleString()} scans</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Operating System */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Operating System</h2>
              <p className="text-xs text-slate-500">User platform breakdown</p>
            </div>
            <div className="space-y-4">
              {(devices?.byOS || []).map((os: any, index: number) => {
                const total = devices?.byOS.reduce((sum: number, o: any) => sum + o.count, 0) || 1;
                const percentage = ((os.count / total) * 100).toFixed(1);
                const colors = ['#10b981', '#22c55e', '#14b8a6', '#0ea5e9', '#06b6d4'];
                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-700">{os.os}</span>
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
          </div>

          {/* Browser */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Browser</h2>
              <p className="text-xs text-slate-500">Browser usage statistics</p>
            </div>
            <div className="space-y-4">
              {(devices?.byBrowser || []).map((browser: any, index: number) => {
                const total = devices?.byBrowser.reduce((sum: number, b: any) => sum + b.count, 0) || 1;
                const percentage = ((browser.count / total) * 100).toFixed(1);
                const colors = ['#3b82f6', '#f59e0b', '#0ea5e9', '#ef4444'];
                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-700">{browser.browser}</span>
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
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  formatter={(value: any) => [value, 'Scans']}
                />
                <Bar dataKey="count" fill="url(#hourGradient)" radius={[4, 4, 0, 0]} />
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
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="dayName" 
                  stroke="#64748b" 
                  fontSize={12}
                  tickFormatter={(value) => value.substring(0, 3)}
                />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  formatter={(value: any) => [value, 'Scans']}
                />
                <Bar dataKey="count" fill="url(#dayGradient)" radius={[4, 4, 0, 0]} />
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Countries */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Top Countries</h3>
              <div className="space-y-3">
                {(geographic?.byCountry || []).slice(0, 6).map((country: any, index: number) => (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400 w-6">{index + 1}</span>
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
                      <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
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

          {/* Traffic Sources - Enhanced */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <ExternalLink className="w-5 h-5 text-violet-500" />
                <h2 className="text-lg font-semibold text-slate-900">CTA Performance</h2>
              </div>
              <p className="text-xs text-slate-500">Button click-through rates</p>
            </div>
            {ctaButtons?.buttons && ctaButtons.buttons.length > 0 ? (
              <div className="space-y-4">
                {ctaButtons.buttons.slice(0, 6).map((button: any, index: number) => (
                  <div key={index} className="p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 mb-1">{button.label}</p>
                        <p className="text-xs text-slate-500 truncate">{button.url}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-lg font-bold text-violet-600">{button.clickThroughRate}%</p>
                        <p className="text-xs text-slate-500">CTR</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <MousePointer className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-600">{button.clicks.toLocaleString()} clicks</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ExternalLink className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-slate-500 text-sm">No CTA button clicks yet</p>
                <p className="text-slate-400 text-xs mt-1">Clicks will appear once users interact with buttons</p>
              </div>
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
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {/* Stage 1: Scans */}
              <div className="relative">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MousePointer className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-xs text-slate-600 mb-1">QR Scans</p>
                    <p className="text-2xl font-bold text-slate-900">{funnel.scans.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-2">100%</p>
                  </div>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-4 bg-blue-500 rounded-full transform -translate-y-1/2 z-10"></div>
              </div>

              {/* Stage 2: Views */}
              <div className="relative">
                <div className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border-2 border-violet-200">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-violet-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-xs text-slate-600 mb-1">Microsite Views</p>
                    <p className="text-2xl font-bold text-slate-900">{funnel.views.toLocaleString()}</p>
                    <p className="text-xs text-emerald-600 font-semibold mt-2">{funnel.viewRate}%</p>
                  </div>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-4 bg-violet-500 rounded-full transform -translate-y-1/2 z-10"></div>
              </div>

              {/* Stage 3: Clicks */}
              <div className="relative">
                <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MousePointer className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-xs text-slate-600 mb-1">Button Clicks</p>
                    <p className="text-2xl font-bold text-slate-900">{funnel.clicks.toLocaleString()}</p>
                    <p className="text-xs text-emerald-600 font-semibold mt-2">{funnel.clickRate}% CTR</p>
                  </div>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-4 bg-amber-500 rounded-full transform -translate-y-1/2 z-10"></div>
              </div>

              {/* Stage 4: Leads */}
              <div>
                <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-xs text-slate-600 mb-1">Leads Captured</p>
                    <p className="text-2xl font-bold text-slate-900">{funnel.leads.toLocaleString()}</p>
                    <p className="text-xs text-emerald-600 font-semibold mt-2">{funnel.leadConversionRate}%</p>
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

        {/* Traffic Sources & Lead Generation Platforms */}
        {referrers?.referrers && referrers.referrers.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Globe className="w-5 h-5 text-emerald-500" />
                <h2 className="text-lg font-semibold text-slate-900">Lead Generation Platforms</h2>
              </div>
              <p className="text-xs text-slate-500">Traffic sources driving views and potential leads</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {referrers.referrers.slice(0, 9).map((referrer: any, index: number) => {
                // Calculate estimated leads from this source based on overall conversion rate
                const estimatedLeads = funnel && funnel.views > 0 
                  ? Math.round((referrer.views * (funnel.leads / funnel.views)))
                  : 0;
                
                return (
                  <div key={index} className="p-4 rounded-lg border-2 border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                        <Globe className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">
                          {referrer.domain || referrer.referrer}
                        </p>
                        <p className="text-xs text-slate-500">{referrer.views.toLocaleString()} views</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-slate-600">Traffic Share</span>
                          <span className="text-sm font-semibold text-slate-900">{referrer.percentage}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"
                            style={{ width: `${referrer.percentage}%` }}
                          />
                        </div>
                      </div>
                      {estimatedLeads > 0 && (
                        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                          <span className="text-xs text-slate-600">Est. Leads</span>
                          <span className="text-sm font-bold text-emerald-600">~{estimatedLeads}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
