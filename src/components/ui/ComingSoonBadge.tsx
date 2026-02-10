import { useState } from 'react';
import { Sparkles } from 'lucide-react';

/**
 * ComingSoonBadge - Inline badge for nav items / labels
 * Shows a small "Soon" pill next to the feature name
 */
export function ComingSoonBadge() {
  return (
    <span className="ml-auto inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-r from-violet-100 to-purple-100 text-violet-600 border border-violet-200">
      <Sparkles className="w-2.5 h-2.5" />
      Soon
    </span>
  );
}

/**
 * ComingSoonTooltip - Wraps any element and shows a floating tooltip on click/hover
 * Prevents the default action and shows "Coming Soon" message
 */
export function ComingSoonTooltip({ 
  children, 
  feature = 'This feature',
  className = '' 
}: { 
  children: React.ReactNode; 
  feature?: string;
  className?: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <div 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShow(true);
          setTimeout(() => setShow(false), 2500);
        }}
        className="cursor-pointer"
      >
        {children}
      </div>
      
      {show && (
        <div className="absolute z-[100] top-full left-1/2 -translate-x-1/2 mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700 whitespace-nowrap">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-xs font-medium">{feature} is coming soon!</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">We're working hard on this. Stay tuned.</p>
          </div>
          {/* Arrow */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 border-l border-t border-slate-700 rotate-45" />
        </div>
      )}
    </div>
  );
}
