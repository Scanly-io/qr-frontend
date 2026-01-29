import { motion } from 'framer-motion';
import { 
  Smartphone, Tablet, Monitor, Loader2, Check, Clock,
  type LucideIcon 
} from 'lucide-react';
import { designSystem } from '@/lib/designSystem';

/**
 * ENHANCED EDITOR TOOLBAR
 * 
 * Premium toolbar with:
 * - Glass morphism design
 * - Smooth animations
 * - Action groups with dividers
 * - Status indicators
 * - Keyboard shortcuts
 */

interface ToolbarAction {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'success' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  shortcut?: string;
  badge?: string | number;
}

interface ToolbarGroup {
  actions: ToolbarAction[];
}

interface EnhancedToolbarProps {
  groups: ToolbarGroup[];
  title?: string;
  subtitle?: string;
  status?: {
    type: 'saved' | 'saving' | 'unsaved' | 'published';
    message: string;
    timestamp?: Date;
  };
  onBack?: () => void;
}

const variantStyles = {
  default: {
    bg: 'bg-white hover:bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
  },
  primary: {
    bg: 'bg-violet-600 hover:bg-violet-700',
    text: 'text-white',
    border: 'border-transparent',
  },
  success: {
    bg: 'bg-green-600 hover:bg-green-700',
    text: 'text-white',
    border: 'border-transparent',
  },
  ghost: {
    bg: 'hover:bg-gray-100',
    text: 'text-gray-600',
    border: 'border-transparent',
  },
} as const;

const statusConfig = {
  saved: {
    icon: Check,
    color: 'text-green-600',
    bg: 'bg-green-50',
    text: 'text-green-700',
  },
  saving: {
    icon: Loader2,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    spin: true,
  },
  unsaved: {
    icon: Clock,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
  },
  published: {
    icon: Check,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
  },
} as const;

export function EnhancedToolbar({ 
  groups, 
  title, 
  subtitle,
  status,
  onBack 
}: EnhancedToolbarProps) {
  const formatRelativeTime = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 10) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <motion.div
      className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b-2 border-gray-100 shadow-sm"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Title & Back */}
          <div className="flex items-center gap-3 min-w-0">
            {onBack && (
              <motion.button
                onClick={onBack}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
            )}
            
            {title && (
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-gray-900 truncate">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-xs text-gray-500 truncate">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Center: Action Groups */}
          <div className="flex items-center gap-2">
            {groups.map((group, groupIdx) => (
              <div key={groupIdx} className="flex items-center gap-2">
                {groupIdx > 0 && (
                  <div className="w-px h-6 bg-gray-200" />
                )}
                
                {group.actions.map((action) => {
                  const Icon = action.icon;
                  const variant = variantStyles[action.variant || 'default'];
                  
                  return (
                    <motion.button
                      key={action.id}
                      onClick={action.onClick}
                      disabled={action.disabled || action.loading}
                      className={`
                        relative flex items-center gap-2 px-4 py-2 rounded-xl
                        font-medium text-sm border-2 transition-all
                        ${variant.bg} ${variant.text} ${variant.border}
                        disabled:opacity-50 disabled:cursor-not-allowed
                        focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
                      `}
                      whileHover={!action.disabled && !action.loading ? { scale: 1.03, y: -1 } : {}}
                      whileTap={!action.disabled && !action.loading ? { scale: 0.97 } : {}}
                      style={{
                        boxShadow: action.variant === 'primary' || action.variant === 'success'
                          ? designSystem.shadows.sm
                          : 'none',
                      }}
                      aria-label={action.label}
                      title={action.shortcut ? `${action.label} (${action.shortcut})` : action.label}
                    >
                      {/* Icon */}
                      {action.loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                      
                      {/* Label (hidden on mobile) */}
                      <span className="hidden sm:inline">
                        {action.label}
                      </span>

                      {/* Badge */}
                      {action.badge && (
                        <motion.span
                          className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        >
                          {action.badge}
                        </motion.span>
                      )}

                      {/* Keyboard shortcut hint */}
                      {action.shortcut && (
                        <span className="hidden lg:inline text-xs opacity-60 ml-1">
                          {action.shortcut}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Right: Status Indicator */}
          {status && (
            <motion.div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig[status.type].bg}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {(() => {
                const StatusIcon = statusConfig[status.type].icon;
                return (
                  <StatusIcon 
                    className={`w-3.5 h-3.5 ${statusConfig[status.type].color} ${statusConfig[status.type].spin ? 'animate-spin' : ''}`}
                  />
                );
              })()}
              <div className="flex flex-col">
                <span className={`text-xs font-semibold ${statusConfig[status.type].text}`}>
                  {status.message}
                </span>
                {status.timestamp && (
                  <span className="text-[10px] text-gray-500">
                    {formatRelativeTime(status.timestamp)}
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * DEVICE SELECTOR COMPONENT
 * 
 * Elegant device size selector with icons
 */

export interface DeviceOption {
  name: string;
  width: number;
  icon: 'phone' | 'tablet' | 'desktop';
  category: string;
}

interface DeviceSelectorProps {
  devices: DeviceOption[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

const deviceIcons = {
  phone: Smartphone,
  tablet: Tablet,
  desktop: Monitor,
} as const;

export function DeviceSelector({ 
  devices, 
  selectedIndex, 
  onChange 
}: DeviceSelectorProps) {
  const selectedDevice = devices[selectedIndex];
  const Icon = deviceIcons[selectedDevice.icon];

  return (
    <div className="flex items-center gap-3">
      {/* Icon Tabs */}
      <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
        {(['phone', 'tablet', 'desktop'] as const).map((deviceType) => {
          const TypeIcon = deviceIcons[deviceType];
          const isActive = selectedDevice.icon === deviceType;
          
          return (
            <motion.button
              key={deviceType}
              onClick={() => {
                const firstOfType = devices.findIndex(d => d.icon === deviceType);
                if (firstOfType >= 0) onChange(firstOfType);
              }}
              className={`
                p-2 rounded-lg transition-all
                ${isActive ? 'bg-white text-violet-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <TypeIcon className="w-4 h-4" />
            </motion.button>
          );
        })}
      </div>

      {/* Device Dropdown */}
      <select
        value={selectedIndex}
        onChange={(e) => onChange(Number(e.target.value))}
        className="px-3 py-2 bg-white border-2 border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-all cursor-pointer"
        style={{
          minWidth: '180px',
        }}
      >
        {devices.map((device, idx) => (
          <option key={idx} value={idx}>
            {device.name} ({device.width}px)
          </option>
        ))}
      </select>

      {/* Width Display */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-violet-50 rounded-lg">
        <span className="text-xs font-medium text-violet-700">
          {selectedDevice.width}px
        </span>
      </div>
    </div>
  );
}
