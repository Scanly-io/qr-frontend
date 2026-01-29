import { cva } from "class-variance-authority"

export const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border-2 px-3 py-1 text-xs font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 shadow-soft",
  {
    variants: {
      variant: {
        default:
          "border-violet-200 bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 hover:shadow-glow-violet hover:scale-105",
        secondary:
          "border-stone-200 bg-stone-100 text-stone-700 hover:bg-stone-200 hover:scale-105",
        success:
          "border-emerald-200 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 hover:shadow-lg hover:shadow-emerald-200/50 hover:scale-105",
        warning:
          "border-amber-200 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 hover:shadow-lg hover:shadow-amber-200/50 hover:scale-105",
        destructive:
          "border-red-200 bg-gradient-to-r from-red-100 to-rose-100 text-red-700 hover:shadow-lg hover:shadow-red-200/50 hover:scale-105",
        outline: "text-stone-700 border-stone-300 bg-white hover:bg-stone-50 hover:scale-105",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)
