import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ 
    isOpen, 
    onClose, 
    title, 
    description,
    size = 'md', 
    showCloseButton = true,
    children,
    className,
    ...props 
  }, ref) => {
    if (!isOpen) return null;

    const sizes = {
      sm: 'max-w-md',
      md: 'max-w-2xl',
      lg: 'max-w-4xl',
      xl: 'max-w-6xl',
      full: 'max-w-[95vw]',
    };

    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
        
        {/* Modal Content */}
        <div
          ref={ref}
          className={cn(
            'relative z-10 w-full bg-white dark:bg-slate-900 rounded-2xl shadow-2xl',
            'flex flex-col max-h-[90vh] overflow-hidden',
            sizes[size],
            className
          )}
          {...props}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-start justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex-1">
                {title && (
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {description}
                  </p>
                )}
              </div>
              
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="ml-4 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </div>,
      document.body
    );
  }
);

Modal.displayName = 'Modal';
