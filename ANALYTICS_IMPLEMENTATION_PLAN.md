# Analytics Dashboard Implementation Plan

## 🎯 Goal
Build a beautiful, accessible analytics dashboard showing QR code performance metrics.

---

## 📊 Dashboard Components Needed

### 1. **Analytics Overview Page** (`/analytics`)
Main dashboard with key metrics:

```tsx
<AnalyticsDashboard>
  {/* Top Stats Cards */}
  <StatsGrid>
    <StatCard icon="📊" title="Total Scans" value="1,234" change="+12%" />
    <StatCard icon="👁️" title="Microsite Views" value="987" change="+8%" />
    <StatCard icon="🖱️" title="Button Clicks" value="456" change="+15%" />
    <StatCard icon="📧" title="Leads Captured" value="89" change="+23%" />
  </StatsGrid>

  {/* Charts Section */}
  <ChartsGrid>
    <LineChart title="Scans Over Time" data={scanTimeline} />
    <PieChart title="Device Breakdown" data={deviceStats} />
    <BarChart title="Top Performing QRs" data={topQRs} />
    <MapChart title="Geographic Distribution" data={locationData} />
  </ChartsGrid>

  {/* Recent Activity Feed */}
  <ActivityFeed events={recentScans} />
</AnalyticsDashboard>
```

### 2. **Individual QR Analytics** (`/analytics/:qrId`)
Detailed view for single QR code:

```tsx
<QRAnalyticsDetail qrId={qrId}>
  {/* QR Header */}
  <QRHeader 
    name={qr.name}
    totalScans={qr.scanCount}
    createdAt={qr.createdAt}
  />

  {/* Time-based Filters */}
  <TimeRangeSelector
    ranges={['24h', '7d', '30d', '90d', 'all']}
    selected={timeRange}
  />

  {/* Detailed Metrics */}
  <MetricsGrid>
    <DeviceBreakdown data={deviceStats} />
    <BrowserStats data={browserStats} />
    <OSDistribution data={osStats} />
    <LocationMap data={geoData} />
    <ConversionFunnel 
      scans={1234}
      views={987}
      clicks={456}
      leads={89}
    />
  </MetricsGrid>

  {/* Event Timeline */}
  <EventTimeline events={allEvents} />
</QRAnalyticsDetail>
```

### 3. **Real-Time Analytics** (`/analytics/live`)
Live feed of incoming scans:

```tsx
<LiveAnalytics>
  {/* Live Counter */}
  <LiveStats>
    <AnimatedCounter label="Scans Today" value={todayScans} />
    <AnimatedCounter label="Active Now" value={activeUsers} />
  </LiveStats>

  {/* Real-time Event Stream */}
  <EventStream>
    {events.map(event => (
      <EventCard
        type={event.type}
        qrCode={event.qrId}
        location={event.city, event.country}
        device={event.deviceType}
        timestamp={event.timestamp}
        animate={true}
      />
    ))}
  </EventStream>

  {/* Live Map */}
  <LiveWorldMap events={recentScans} />
</LiveAnalytics>
```

---

## 🛠️ Technical Implementation

### **Phase 1: API Integration** (Day 1-2)

Create analytics API client:

```typescript
// src/lib/api/analytics.ts

export const analyticsApi = {
  // Get overview stats
  getOverview: async (timeRange: string) => {
    return client.get(`/analytics/overview?range=${timeRange}`);
  },

  // Get QR-specific analytics
  getQRAnalytics: async (qrId: string, timeRange: string) => {
    return client.get(`/analytics/qr/${qrId}?range=${timeRange}`);
  },

  // Get real-time events (SSE or WebSocket)
  subscribeLiveEvents: (callback: (event: Event) => void) => {
    const eventSource = new EventSource('/analytics/live');
    eventSource.onmessage = (e) => callback(JSON.parse(e.data));
    return eventSource;
  },

  // Get device breakdown
  getDeviceStats: async (qrId: string) => {
    return client.get(`/analytics/qr/${qrId}/devices`);
  },

  // Get location data
  getLocationData: async (qrId: string) => {
    return client.get(`/analytics/qr/${qrId}/locations`);
  },

  // Get conversion funnel
  getFunnelData: async (qrId: string) => {
    return client.get(`/analytics/qr/${qrId}/funnel`);
  },
};
```

### **Phase 2: Chart Components** (Day 3-4)

Use **Recharts** or **Chart.js** for visualizations:

```bash
npm install recharts date-fns
```

```tsx
// src/components/analytics/LineChart.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function ScansLineChart({ data }: { data: ScanDataPoint[] }) {
  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Scans Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="scans" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            dot={{ fill: '#8b5cf6' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

### **Phase 3: Dashboard Pages** (Day 5-7)

```tsx
// src/pages/AnalyticsDashboardPage.tsx
import { useState, useEffect } from 'react';
import { analyticsApi } from '@/lib/api/analytics';
import { StatsCard } from '@/components/analytics/StatsCard';
import { ScansLineChart } from '@/components/analytics/LineChart';
import { DevicePieChart } from '@/components/analytics/PieChart';
import { LocationMap } from '@/components/analytics/Map';

export function AnalyticsDashboardPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    const data = await analyticsApi.getOverview(timeRange);
    setStats(data);
    setLoading(false);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600">Track your QR code performance</p>
      </div>

      {/* Time Range Selector */}
      <TimeRangeSelector value={timeRange} onChange={setTimeRange} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          icon="📊"
          title="Total Scans"
          value={stats.totalScans}
          change={stats.scansChange}
          trend="up"
        />
        <StatsCard
          icon="👁️"
          title="Microsite Views"
          value={stats.totalViews}
          change={stats.viewsChange}
          trend="up"
        />
        <StatsCard
          icon="🖱️"
          title="Button Clicks"
          value={stats.totalClicks}
          change={stats.clicksChange}
          trend="up"
        />
        <StatsCard
          icon="📧"
          title="Leads"
          value={stats.totalLeads}
          change={stats.leadsChange}
          trend="up"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ScansLineChart data={stats.scanTimeline} />
        <DevicePieChart data={stats.deviceBreakdown} />
        <LocationMap data={stats.geoData} />
        <ConversionFunnel data={stats.funnelData} />
      </div>

      {/* Recent Activity */}
      <RecentActivityFeed events={stats.recentEvents} />
    </div>
  );
}
```

### **Phase 4: Accessibility** (Ongoing)

Ensure charts are accessible:

```tsx
// Add screen reader support to charts
<div role="img" aria-label={`Line chart showing ${data.length} data points`}>
  <ResponsiveContainer>
    <LineChart data={data}>
      {/* Chart content */}
    </LineChart>
  </ResponsiveContainer>
</div>

// Provide data table alternative
<details className="mt-4">
  <summary className="cursor-pointer text-sm text-gray-600 hover:text-violet-600">
    View data table
  </summary>
  <table className="mt-2 w-full text-sm">
    <thead>
      <tr>
        <th>Date</th>
        <th>Scans</th>
      </tr>
    </thead>
    <tbody>
      {data.map(row => (
        <tr key={row.date}>
          <td>{row.date}</td>
          <td>{row.scans}</td>
        </tr>
      ))}
    </tbody>
  </table>
</details>
```

---

## 🎨 UI/UX Guidelines

### Design Principles:
1. **Data Visualization Best Practices**
   - Clear labels and legends
   - Color-blind friendly palettes
   - Interactive tooltips
   - Responsive charts

2. **Progressive Disclosure**
   - Overview → Details → Deep Dive
   - Collapsible sections
   - Drill-down capability

3. **Real-time Updates**
   - Live counters with animations
   - Event stream with new item highlights
   - Auto-refresh indicators

4. **Accessibility**
   - All charts have text alternatives
   - Keyboard navigation
   - Screen reader support
   - High contrast mode

---

## 📦 Required Libraries

```json
{
  "dependencies": {
    "recharts": "^2.10.0",           // Charts
    "date-fns": "^3.0.0",             // Date formatting
    "react-countup": "^6.5.0",        // Animated counters
    "framer-motion": "^11.0.0",       // Animations (already have)
    "react-map-gl": "^7.1.0"          // Optional: Interactive maps
  }
}
```

---

## 📋 Implementation Checklist

### Week 1: Foundation
- [ ] Install chart libraries
- [ ] Create analytics API client
- [ ] Build basic dashboard layout
- [ ] Create stats card component
- [ ] Add time range selector

### Week 2: Visualizations
- [ ] Build line chart component
- [ ] Build pie chart component  
- [ ] Build bar chart component
- [ ] Add device breakdown visualization
- [ ] Add location map (optional)

### Week 3: Features
- [ ] Individual QR analytics page
- [ ] Conversion funnel visualization
- [ ] Recent activity feed
- [ ] Export data (CSV/PDF)
- [ ] Real-time live feed (optional)

### Week 4: Polish
- [ ] Accessibility audit
- [ ] Mobile responsive design
- [ ] Loading states & animations
- [ ] Error handling
- [ ] Documentation

---

## 🚀 Quick Start (Next Steps)

```bash
# 1. Install dependencies
cd qr-frontend
npm install recharts date-fns react-countup

# 2. Create analytics folder structure
mkdir -p src/pages/analytics
mkdir -p src/components/analytics
mkdir -p src/lib/api

# 3. Build API client
# Create src/lib/api/analytics.ts with API methods

# 4. Create dashboard page
# Create src/pages/AnalyticsDashboardPage.tsx

# 5. Add route
# In App.tsx: <Route path="/analytics" element={<AnalyticsDashboardPage />} />
```

**Ready to start building analytics? It's fully accessible and will provide immediate value!** 📊✨
