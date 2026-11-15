"use client"

// The "Sort by" dropdown in the browse jobs results header.

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const SORT_OPTIONS = [
    { value: "recent", label: "Most Recent" },
    { value: "salary-desc", label: "Highest Salary" },
    { value: "salary-asc", label: "Lowest Salary" },
];

export function SortSelect({ value = "recent" }: { value?: string }) {
    // TODO: implement — update the URL (e.g. `?sort=...`) and refetch.
    const handleChange = () => {};

    return (
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
            Sort by:
            <Select value={value} onValueChange={handleChange}>
                <SelectTrigger className="w-40 bg-card">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </label>
    );
}
