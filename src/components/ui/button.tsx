/* eslint-disable react-refresh/only-export-components */
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-violet-600 text-white shadow-md hover:bg-violet-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
        destructive:
          "bg-red-500 text-white shadow-md hover:bg-red-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
        outline:
          "border-2 border-stone-300 bg-white shadow-sm hover:bg-stone-50 hover:border-violet-400 hover:text-violet-600 hover:shadow-md",
        secondary:
          "bg-stone-100 text-stone-900 shadow-sm hover:bg-stone-200 hover:shadow-md",
        ghost: "hover:bg-stone-100 hover:text-stone-900",
        link: "text-violet-600 underline-offset-4 hover:underline",
        premium:
          "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg hover:shadow-glow-violet hover:scale-[1.02] active:scale-[0.98]",
        success:
          "bg-emerald-500 text-white shadow-md hover:bg-emerald-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  icon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, icon, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // When using asChild, don't wrap in fragments as Slot merges props
    const content = asChild ? (
      children
    ) : isLoading ? (
      <>
        <Loader2 className="h-4 w-4 animate-spin" />
        {children}
      </>
    ) : (
      <>
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </>
    );
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {content}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
