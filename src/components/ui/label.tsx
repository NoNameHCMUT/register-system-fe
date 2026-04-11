import * as React from "react"

import { cn } from "@/lib/utils"

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "text-[13px] font-semibold uppercase tracking-[0.16em] text-[#6c738a]",
        className,
      )}
      {...props}
    />
  )
}

export { Label }