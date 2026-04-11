import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full rounded-xl border border-input bg-[#f2f2f2] px-4 py-3 text-sm text-foreground shadow-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-[#1d9bf0] focus-visible:ring-3 focus-visible:ring-[#1d9bf0]/15 disabled:cursor-not-allowed disabled:opacity-50 [&::-ms-clear]:hidden [&::-ms-reveal]:hidden [&::-webkit-credentials-auto-fill-button]:invisible [&::-webkit-credentials-auto-fill-button]:pointer-events-none",
        className,
      )}
      {...props}
    />
  )
}

export { Input }