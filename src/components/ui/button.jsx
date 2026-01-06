import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-[#00b8a3] focus-visible:ring-[#00b8a3]/50 focus-visible:ring-[3px] aria-invalid:ring-[#ff375f]/20 aria-invalid:border-[#ff375f]",
  {
    variants: {
      variant: {
        default:
          "bg-[#00b8a3] text-white shadow-xs hover:bg-[#00a392]",
        destructive:
          "bg-[#ff375f] text-white shadow-xs hover:bg-[#e62e52] focus-visible:ring-[#ff375f]/20",
        outline:
          "border border-[#303030] bg-[#282828] text-[#eff1f6] shadow-xs hover:bg-[#303030]",
        secondary:
          "bg-[#303030] text-[#eff1f6] shadow-xs hover:bg-[#3a3a3a]",
        ghost:
          "text-[#eff1f6] hover:bg-[#303030]",
        link: "text-[#00b8a3] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
