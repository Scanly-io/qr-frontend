import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

function Skeleton({
  className,
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  ...props
}: SkeletonProps) {
  const variantStyles = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-xl',
  };

  const baseStyles = cn(
    'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800',
    variantStyles[variant],
    className
  );

  const style = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  };

  if (animation === 'wave') {
    return (
      <div className={cn(baseStyles, 'relative overflow-hidden')} style={style} {...props}>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
    );
  }

  if (animation === 'pulse') {
    return (
      <motion.div
        className={baseStyles}
        style={style}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    );
  }

  return <div className={baseStyles} style={style} {...props} />;
}

// Pre-built skeleton components for common patterns
function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="p-6 space-y-4">
      <Skeleton variant="rounded" width="100%" height={200} animation="wave" />
      <div className="space-y-2">
        <Skeleton width="80%" />
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} width={i === lines - 1 ? '60%' : '100%'} />
        ))}
      </div>
    </div>
  );
}

function SkeletonAvatar({ size = 40 }: { size?: number }) {
  return <Skeleton variant="circular" width={size} height={size} />;
}

function SkeletonButton({ width = 100, height = 40 }: { width?: number; height?: number }) {
  return <Skeleton variant="rounded" width={width} height={height} />;
}

function SkeletonList({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <SkeletonAvatar size={48} />
          <div className="flex-1 space-y-2">
            <Skeleton width="40%" />
            <Skeleton width="80%" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SkeletonTestimonial() {
  return (
    <div className="p-6 space-y-4 border border-gray-200 dark:border-gray-800 rounded-xl">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} variant="circular" width={16} height={16} />
        ))}
      </div>
      <div className="space-y-2">
        <Skeleton width="100%" />
        <Skeleton width="100%" />
        <Skeleton width="80%" />
      </div>
      <div className="flex items-center gap-3 pt-4">
        <SkeletonAvatar size={48} />
        <div className="space-y-2">
          <Skeleton width={120} />
          <Skeleton width={80} />
        </div>
      </div>
    </div>
  );
}

export { 
  Skeleton, 
  SkeletonCard, 
  SkeletonAvatar, 
  SkeletonButton, 
  SkeletonList, 
  SkeletonTestimonial 
};

