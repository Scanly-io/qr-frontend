import type { ReactNode } from 'react';
import { Wifi, Battery } from 'lucide-react';

interface DeviceFrameProps {
  children: ReactNode;
  deviceWidth: number;
  deviceName: string;
  deviceCategory: 'Phone' | 'Tablet' | 'Desktop';
}

export default function DeviceFrame({ children, deviceWidth, deviceName, deviceCategory }: DeviceFrameProps) {
  // Don't show frame for desktop/large screens - show clean preview
  if (deviceCategory === 'Desktop' || deviceWidth >= 768) {
    return (
      <div className="w-full max-w-7xl mx-auto">
        <div className="mb-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span>{deviceName} ({deviceWidth}px)</span>
        </div>
        <div 
          className="mx-auto bg-background border border-border rounded-lg shadow-xl overflow-hidden"
          style={{ width: '100%', maxWidth: `${deviceWidth}px` }}
        >
          {children}
        </div>
      </div>
    );
  }

  // Get current time for status bar
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: false 
  });

  const isTablet = deviceCategory === 'Tablet';

  return (
    <div className="relative mx-auto py-8" style={{ width: 'fit-content' }}>
      
      {/* Device Frame - Clean iPhone Style */}
      <div 
        className="relative bg-black rounded-[3rem] shadow-2xl border-[14px] border-black"
        style={{ width: deviceWidth + 28 }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6 bg-black rounded-b-3xl z-20" />
        
        {/* Screen Content */}
        <div 
          className="bg-background rounded-[2.25rem] overflow-hidden flex flex-col"
          style={{ 
            width: deviceWidth,
            height: isTablet ? 1000 : 812,
          }}
        >
          {/* Status Bar */}
          <div className="flex-shrink-0 bg-background px-8 pt-2 pb-2 flex items-center justify-between">
            <div className="text-[11px] font-semibold text-foreground/60 tabular-nums">
              {currentTime}
            </div>
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-foreground/60" strokeWidth={2.5} />
              <Battery className="w-5 h-3.5 text-foreground/60 fill-foreground/20" strokeWidth={2} />
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div 
            className="flex-1 overflow-y-auto scroll-smooth"
            style={{
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <style>{`
              .overflow-y-auto::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {children}
          </div>

          {/* Home Indicator */}
          <div className="flex-shrink-0 flex justify-center py-2 bg-background">
            <div className="w-32 h-1 bg-foreground/30 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
