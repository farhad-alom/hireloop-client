// The Full-time / Part-time / Contract / Internship picker.

import { Radio as RadioPrimitive } from "@base-ui/react/radio"

import { RadioGroup } from "@/components/ui/radio-group"
import { JOB_TYPES } from "@/lib/constants/jobs"

export function JobTypeSelector({ defaultValue }: { defaultValue?: string }) {
    return (
        // The radio group is uncontrolled: Base UI renders a hidden
        // native input per item, so FormData picks up `jobType` for free.
        <RadioGroup
            name="jobType"
            defaultValue={defaultValue ?? "full-time"}
            className="grid grid-cols-2 gap-3 md:grid-cols-4"
        >
            {JOB_TYPES.map((jobType) => (
                <RadioPrimitive.Root
                    key={jobType.value}
                    value={jobType.value}
                    className="flex h-10 cursor-pointer select-none items-center justify-center rounded-lg bg-muted px-2 text-sm text-muted-foreground transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 data-checked:border-brand data-checked:bg-card data-checked:text-foreground hover:border-ring hover:not-data-checked:text-foreground border border-transparent"
                >
                    {jobType.label}
                </RadioPrimitive.Root>
            ))}
        </RadioGroup>
    );
}
