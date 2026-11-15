"use client"

// A reusable filter section: a title with a list of checkbox options,
// each optionally showing a result count on the right (like the Figma design).
// With selectionMode="single" only one option can be checked at a time.

import { Checkbox } from "@/components/ui/checkbox"

export interface FilterOption {
    value: string;
    label: string;
    count?: number;
}

interface FilterCheckboxGroupProps {
    /** Used as the section title and to build unique label ids. */
    title: string;
    options: FilterOption[];
    /** Values that are currently checked. */
    selected: string[];
    /** How many options can be checked at once. Defaults to "multiple". */
    selectionMode?: "single" | "multiple";
    /** Called with the option value and the new checked state. */
    onToggle?: (value: string, checked: boolean) => void;
}

export function FilterCheckboxGroup({
    title,
    options,
    selected,
    selectionMode = "multiple",
    onToggle,
}: FilterCheckboxGroupProps) {
    const groupId = title.toLowerCase().replace(/\s+/g, "-");

    // In single mode the whole selection is the one checked value.
    const isChecked = (value: string) =>
        selectionMode === "single"
            ? selected[0] === value
            : selected.includes(value);

    return (
        <div>
            <h3 className="text-sm font-semibold">{title}</h3>

            <ul className="mt-3 space-y-2.5">
                {options.map((option) => {
                    const inputId = `${groupId}-${option.value}`;

                    return (
                        <li key={option.value} className="flex items-center gap-2.5">
                            <Checkbox
                                id={inputId}
                                checked={isChecked(option.value)}
                                onCheckedChange={() =>
                                    onToggle?.(option.value, !isChecked(option.value))
                                }
                            />

                            <label
                                htmlFor={inputId}
                                className="flex flex-1 cursor-pointer items-center justify-between gap-2 text-sm"
                            >
                                <span>{option.label}</span>

                                {option.count !== undefined && (
                                    <span className="text-xs text-muted-foreground">
                                        {option.count}
                                    </span>
                                )}
                            </label>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
