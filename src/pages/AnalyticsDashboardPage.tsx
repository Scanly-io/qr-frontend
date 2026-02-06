import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { analyticsApi } from '@/lib/api';
import {
  Calendar, TrendingUp, Users, MapPin, Smartphone, Clock,
  MousePointer, Globe, Monitor
} from 'lucide-react';

export default function AnalyticsDashboardPage() {
  const { id } = useParams<{ id: string }>();
  const qrId = id || 'demo-qr';
  const [loading, setLoading] = useState(true);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stats, setStats] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [timeseries, setTimeseries] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [geographic, setGeographic] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [devices, setDevices] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [patterns, setPatterns] = useState<any>(null);

  // Color constants for charts
  const COLORS = {
    violet: '#8b5cf6',
    indigo: '#6366f1',
    purple: '#a855f7',
    emerald: '#10b981',
    teal: '#14b8a6',
    green: '#22c55e',
    blue: '#3b82f6',
    sky: '#0ea5e9',
    cyan: '#06b6d4',
  };

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [summaryRes, timeseriesRes, geoRes, devicesRes, patternsRes] =
        await Promise.all([
          analyticsApi.getSummary(qrId),
          analyticsApi.getTimeseries(qrId),
          analyticsApi.getGeography(qrId),
          analyticsApi.getDevices(qrId),
          analyticsApi.getPatterns(qrId),
        ]);

      setStats(summaryRes);
      setTimeseries(timeseriesRes);
      setGeographic(geoRes);
      setDevices(devicesRes);
      setPatterns(patternsRes);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-slate-600">
            Track your QR code performance and user engagement
          </p>
        </div>

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
              <p className="text-3xl font-bold text-slate-900">
                {stats?.totalevents?.toLocaleString() || '0'}
              </p>
              <p className="text-xs text-emerald-600 mt-2">
                Today: {stats?.todayevents || '0'}
              </p>
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
              <p className="text-3xl font-bold text-slate-900">
                {stats?.last7Daysevents?.toLocaleString() || '0'}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                {((stats?.last7Daysevents / 7) || 0).toFixed(1)} avg/day
              </p>
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
              <p className="text-3xl font-bold text-slate-900">
                {geographic?.byCountry?.length || '0'}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                {geographic?.byCity?.length || '0'} cities
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <Monitor className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Mobile Scans</p>
              <p className="text-3xl font-bold text-slate-900">
                {(
                  ((devices?.byDeviceType?.find(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (d: any) => d.deviceType === 'Mobile'
                  )?.count || 0) /
                    (stats?.totalScans || 1)) *
                  100
                ).toFixed(0)}
                %
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Scan Trends
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Daily scan activity over time
            </p>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={timeseries?.timeSeries || []}>
              <defs>
                <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={COLORS.violet}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={COLORS.violet}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="count"
                name="Scans"
                stroke={COLORS.violet}
                strokeWidth={2}
                fill="url(#colorScans)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-5 h-5 text-violet-500" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Peak Hours
                </h2>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={patterns?.byHourOfDay || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Bar
                  dataKey="count"
                  fill={COLORS.violet}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-5 h-5 text-emerald-500" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Day of Week
                </h2>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={patterns?.byDayOfWeek || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="dayName" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Bar
                  dataKey="count"
                  fill={COLORS.emerald}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Device Type
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={devices?.byDeviceType || []}
                  dataKey="count"
                  nameKey="deviceType"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {(devices?.byDeviceType || []).map(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (_: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          [COLORS.violet, COLORS.indigo, COLORS.purple][
                            index % 3
                          ]
                        }
                      />
                    )
                  )}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Operating System
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={devices?.byOS || []}
                  dataKey="count"
                  nameKey="os"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {(devices?.byOS || []).map(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (_: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        [COLORS.emerald, COLORS.teal, COLORS.green][index % 3]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Browser</h2>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={devices?.byBrowser || []}
                  dataKey="count"
                  nameKey="browser"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {(devices?.byBrowser || []).map(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (_: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        [COLORS.blue, COLORS.sky, COLORS.cyan][index % 3]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Globe className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Global Reach
                </h2>
              </div>
              <p className="text-sm text-slate-600">
                Interactive world map showing scan distribution
              </p>
            </div>
            <WorldMap
              data={geographic?.byCountry || []}
              maxCount={(geographic?.byCountry || [])[0]?.count || 1}
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Top Locations
                </h2>
              </div>
            </div>
            <div className="space-y-3">
              {(geographic?.byCountry || []).slice(0, 8).map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (country: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {country.country}
                    </p>
                    <p className="text-xs text-slate-500">
                      {country.count.toLocaleString()} scans
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                      style={{
                        width: `${
                          (country.count /
                            (geographic?.byCountry[0]?.count || 1)) *
                          100
                        }%`
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 min-w-[3rem] text-right">
                    {((country.count / (stats?.totalScans || 1)) * 100).toFixed(
                      1
                    )}
                    %
                  </span>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
