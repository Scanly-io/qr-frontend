import { useState, useRef, useEffect } from 'react';
import { Monitor, Smartphone, Tablet, ChevronDown } from 'lucide-react';

export interface DeviceSize {
  name: string;
  width: number;
  category: 'Phone' | 'Tablet' | 'Desktop';
}

interface DeviceSelectorProps {
  devices: readonly DeviceSize[];
  selectedIndex: number;
  onSelectDevice: (index: number) => void;
}

export function DeviceSelector({ devices, selectedIndex, onSelectDevice }: DeviceSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentDevice = devices[selectedIndex];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (category: string) => {
    switch (category) {
      case 'Phone':
        return <Smartphone className="w-3.5 h-3.5" />;
      case 'Tablet':
        return <Tablet className="w-3.5 h-3.5" />;
      case 'Desktop':
        return <Monitor className="w-3.5 h-3.5" />;
      default:
        return <Smartphone className="w-3.5 h-3.5" />;
    }
  };

  // Group devices by category
  const groupedDevices = [
    { label: 'Mobile', devices: devices.filter(d => d.category === 'Phone') },
    { label: 'Tablet', devices: devices.filter(d => d.category === 'Tablet') },
    { label: 'Desktop', devices: devices.filter(d => d.category === 'Desktop') },
  ].filter(group => group.devices.length > 0);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Minimalist Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-stone-700 hover:text-violet-600 bg-white/80 hover:bg-white border border-stone-200/60 hover:border-violet-300 rounded-lg transition-all duration-200"
      >
        {getIcon(currentDevice.category)}
        <span className="hidden sm:inline">{currentDevice.name}</span>
        <span className="text-xs text-stone-500">{currentDevice.width}px</span>
        <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Clean Dropdown Menu */}
      {isOpen && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 w-72 bg-white border border-stone-200 rounded-xl shadow-2xl z-[99999] animate-in fade-in-0 slide-in-from-top-2 duration-200 overflow-hidden">
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {groupedDevices.map((group, groupIdx) => (
              <div key={groupIdx} className="mb-3 last:mb-0">
                <div className="px-3 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  {group.label}
                </div>
                <div className="space-y-0.5">
                  {group.devices.map((device, deviceIdx) => {
                    const globalIndex = devices.findIndex(d => d.name === device.name);
                    const isSelected = globalIndex === selectedIndex;
                    
                    return (
                      <button
                        key={deviceIdx}
                        onClick={() => {
                          onSelectDevice(globalIndex);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                          isSelected
                            ? 'bg-violet-50 text-violet-700 font-semibold'
                            : 'hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <span className="truncate">{device.name}</span>
                        <span className={`text-xs ml-2 ${isSelected ? 'text-violet-600' : 'text-stone-400'}`}>
                          {device.width}px
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
