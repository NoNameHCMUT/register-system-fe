import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

function Select({ className, options, placeholder, ...props }: any) {
    return (
        <div className="relative w-full">
            <select
                className={cn(
                "flex h-11 w-full appearance-none rounded-xl border border-input bg-[#f2f2f2] px-4 py-2 text-sm text-foreground transition-colors focus-visible:border-[#1d9bf0] focus-visible:ring-3 focus-visible:ring-[#1d9bf0]/15 disabled:cursor-not-allowed disabled:opacity-50",
                !props.value ? "text-muted-foreground/70" : "text-foreground",
                className
                )}
                {...props}
            >
                <option value="" disabled selected hidden>
                    {placeholder}
                </option>
                {options.map((opt: any) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
    )
}

export { Select }