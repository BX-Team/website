"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-2 border-neutral-700 bg-neutral-800",
        "data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500",
        "focus-visible:ring-2 focus-visible:ring-blue-500/50",
        "hover:border-blue-500/50 transition-colors",
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        "size-5 shrink-0 rounded-md shadow-sm",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-white transition-none"
      >
        <CheckIcon className="size-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
