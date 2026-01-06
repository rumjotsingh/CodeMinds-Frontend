import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-[#00b8a3] focus-visible:ring-[#00b8a3]/50 focus-visible:ring-[3px] aria-invalid:ring-[#ff375f]/20 aria-invalid:border-[#ff375f] transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#00b8a3] text-white [a&]:hover:bg-[#00a392]",
        secondary:
          "border-transparent bg-[#303030] text-[#eff1f6] [a&]:hover:bg-[#404040]",
        destructive:
          "border-transparent bg-[#ff375f] text-white [a&]:hover:bg-[#e62e52] focus-visible:ring-[#ff375f]/20",
        outline:
          "text-[#eff1f6] border-[#303030] [a&]:hover:bg-[#303030]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props} />
  );
}

export { Badge, badgeVariants }
