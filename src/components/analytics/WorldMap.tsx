import { useMemo } from 'react';

interface CountryData {
  country: string;
  count: number;
  countryCode?: string;
}

interface WorldMapProps {
  data: CountryData[];
  maxCount: number;
}

// Simple SVG world map with major countries
export default function WorldMap({ data, maxCount }: WorldMapProps) {
  const colorScale = useMemo(() => {
    return (count: number) => {
      const intensity = Math.min(count / maxCount, 1);
      if (intensity === 0) return '#e2e8f0'; // slate-200
      if (intensity < 0.2) return '#dbeafe'; // blue-100
      if (intensity < 0.4) return '#bfdbfe'; // blue-200
      if (intensity < 0.6) return '#93c5fd'; // blue-300
      if (intensity < 0.8) return '#60a5fa'; // blue-400
      return '#3b82f6'; // blue-500
    };
  }, [maxCount]);

  const countryMap = useMemo(() => {
    const map = new Map();
    data.forEach((item) => {
      map.set(item.country.toLowerCase(), item);
    });
    return map;
  }, [data]);

  const getCountryColor = (countryName: string) => {
    const countryData = countryMap.get(countryName.toLowerCase());
    return countryData ? colorScale(countryData.count) : '#f1f5f9'; // slate-100
  };

  const getCountryInfo = (countryName: string) => {
    return countryMap.get(countryName.toLowerCase());
  };

  return (
    <div className="relative">
      {/* World Map SVG */}
      <svg
        viewBox="0 0 1000 500"
        className="w-full h-auto"
        style={{ maxHeight: '400px' }}
      >
        <defs>
          <filter id="shadow">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.1" />
          </filter>
        </defs>

        {/* Simplified country paths - Major regions */}
        
        {/* North America */}
        <path
          d="M 50 100 L 200 80 L 250 120 L 230 200 L 150 180 Z"
          fill={getCountryColor('United States')}
          stroke="#ffffff"
          strokeWidth="1"
          className="hover:opacity-80 transition-opacity cursor-pointer"
          filter="url(#shadow)"
        >
          <title>
            {getCountryInfo('United States')
              ? `United States: ${getCountryInfo('United States')?.count} scans`
              : 'United States: No data'}
          </title>
        </path>
        <path
          d="M 100 50 L 220 40 L 250 80 L 200 80 L 120 70 Z"
          fill={getCountryColor('Canada')}
          stroke="#ffffff"
          strokeWidth="1"
          className="hover:opacity-80 transition-opacity cursor-pointer"
          filter="url(#shadow)"
        >
          <title>
            {getCountryInfo('Canada')
              ? `Canada: ${getCountryInfo('Canada')?.count} scans`
              : 'Canada: No data'}
          </title>
        </path>

        {/* South America */}
        <path
          d="M 200 250 L 280 240 L 300 320 L 250 340 L 220 300 Z"
          fill={getCountryColor('Brazil')}
          stroke="#ffffff"
          strokeWidth="1"
          className="hover:opacity-80 transition-opacity cursor-pointer"
          filter="url(#shadow)"
        >
          <title>
            {getCountryInfo('Brazil')
              ? `Brazil: ${getCountryInfo('Brazil')?.count} scans`
              : 'Brazil: No data'}
          </title>
        </path>

        {/* Europe */}
        <path
          d="M 450 120 L 520 110 L 530 150 L 480 160 Z"
          fill={getCountryColor('United Kingdom')}
          stroke="#ffffff"
          strokeWidth="1"
          className="hover:opacity-80 transition-opacity cursor-pointer"
          filter="url(#shadow)"
        >
          <title>
            {getCountryInfo('United Kingdom')
              ? `UK: ${getCountryInfo('United Kingdom')?.count} scans`
              : 'UK: No data'}
          </title>
        </path>
        <path
          d="M 480 140 L 550 130 L 570 170 L 500 180 Z"
          fill={getCountryColor('Germany')}
          stroke="#ffffff"
          strokeWidth="1"
          className="hover:opacity-80 transition-opacity cursor-pointer"
          filter="url(#shadow)"
        >
          <title>
            {getCountryInfo('Germany')
              ? `Germany: ${getCountryInfo('Germany')?.count} scans`
              : 'Germany: No data'}
          </title>
        </path>
        <path
          d="M 470 150 L 520 160 L 510 200 L 470 190 Z"
          fill={getCountryColor('France')}
          stroke="#ffffff"
          strokeWidth="1"
          className="hover:opacity-80 transition-opacity cursor-pointer"
          filter="url(#shadow)"
        >
          <title>
            {getCountryInfo('France')
              ? `France: ${getCountryInfo('France')?.count} scans`
              : 'France: No data'}
          </title>
        </path>

        {/* Asia */}
        <path
          d="M 700 160 L 780 150 L 800 200 L 720 210 Z"
          fill={getCountryColor('China')}
          stroke="#ffffff"
          strokeWidth="1"
          className="hover:opacity-80 transition-opacity cursor-pointer"
          filter="url(#shadow)"
        >
          <title>
            {getCountryInfo('China')
              ? `China: ${getCountryInfo('China')?.count} scans`
              : 'China: No data'}
          </title>
        </path>
        <path
          d="M 820 180 L 870 170 L 880 220 L 830 230 Z"
          fill={getCountryColor('Japan')}
          stroke="#ffffff"
          strokeWidth="1"
          className="hover:opacity-80 transition-opacity cursor-pointer"
          filter="url(#shadow)"
        >
          <title>
            {getCountryInfo('Japan')
              ? `Japan: ${getCountryInfo('Japan')?.count} scans`
              : 'Japan: No data'}
          </title>
        </path>
        <path
          d="M 650 200 L 720 190 L 730 250 L 670 260 Z"
          fill={getCountryColor('India')}
          stroke="#ffffff"
          strokeWidth="1"
          className="hover:opacity-80 transition-opacity cursor-pointer"
          filter="url(#shadow)"
        >
          <title>
            {getCountryInfo('India')
              ? `India: ${getCountryInfo('India')?.count} scans`
              : 'India: No data'}
          </title>
        </path>

        {/* Australia */}
        <path
          d="M 820 320 L 900 310 L 920 360 L 850 370 Z"
          fill={getCountryColor('Australia')}
          stroke="#ffffff"
          strokeWidth="1"
          className="hover:opacity-80 transition-opacity cursor-pointer"
          filter="url(#shadow)"
        >
          <title>
            {getCountryInfo('Australia')
              ? `Australia: ${getCountryInfo('Australia')?.count} scans`
              : 'Australia: No data'}
          </title>
        </path>

        {/* Africa */}
        <path
          d="M 480 240 L 550 230 L 560 320 L 500 330 Z"
          fill={getCountryColor('South Africa')}
          stroke="#ffffff"
          strokeWidth="1"
          className="hover:opacity-80 transition-opacity cursor-pointer"
          filter="url(#shadow)"
        >
          <title>
            {getCountryInfo('South Africa')
              ? `South Africa: ${getCountryInfo('South Africa')?.count} scans`
              : 'South Africa: No data'}
          </title>
        </path>

        {/* Add more countries as needed */}
      </svg>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-2 text-sm">
        <span className="text-slate-600">Fewer scans</span>
        <div className="flex gap-1">
          <div className="w-6 h-4 rounded" style={{ backgroundColor: '#dbeafe' }} />
          <div className="w-6 h-4 rounded" style={{ backgroundColor: '#bfdbfe' }} />
          <div className="w-6 h-4 rounded" style={{ backgroundColor: '#93c5fd' }} />
          <div className="w-6 h-4 rounded" style={{ backgroundColor: '#60a5fa' }} />
          <div className="w-6 h-4 rounded" style={{ backgroundColor: '#3b82f6' }} />
        </div>
        <span className="text-slate-600">More scans</span>
      </div>
    </div>
  );
}
