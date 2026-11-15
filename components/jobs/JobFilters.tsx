"use client"

// The "Filters" sidebar of the browse jobs page, built from the
// reusable FilterCheckboxGroup and the shared job constants.
// Job Type and Category allow a single selection, Workplace is multi-select.
// Toggling a filter updates the URL query, which re-renders the server
// page with the filtered results. Values match the API query params:
// JobType=full-time · category=engineering · isRemote=true|false.

import { useRouter, useSearchParams } from "next/navigation"

import { JOB_CATEGORIES, JOB_TYPES } from "@/lib/constants/jobs"

import {
    FilterCheckboxGroup,
    type FilterOption,
} from "@/components/jobs/FilterCheckboxGroup"

// Maps to the boolean `isRemote` job field ("true" / "false" param values).
const WORKPLACE_OPTIONS: FilterOption[] = [
    { value: "true", label: "Remote" },
    { value: "false", label: "On-site" },
]

/** Which filter values are selected, keyed by the API param they belong to. */
export interface JobFilterSelection {
    /** Single value, e.g. ["full-time"]. */
    jobTypes: string[];
    /** Single value, e.g. ["engineering"]. */
    categories: string[];
    /** Multiple values, e.g. ["true", "false"]. */
    workplaces: string[];
}

/** Result counts per group, e.g. { jobType: { "full-time": 5 } }. */
export type JobFilterCounts = Record<string, Record<string, number>>;

interface JobFiltersProps {
    selection: JobFilterSelection;
    counts?: JobFilterCounts;
}

export function JobFilters({ selection, counts = {} }: JobFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Updates one query param, keeps the rest, and re-renders the page
    // with the filtered results. scroll: false keeps the sidebar in view.
    const setFilterParam = (param: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value === null) {
            params.delete(param);
        } else {
            params.set(param, value);
        }

        router.push(`/browse-jobs?${params.toString()}`, { scroll: false });
    };

    // Single-select: choosing a value replaces the previous one;
    // clicking it again clears the filter.
    const handleJobTypeToggle = (value: string, checked: boolean) =>
        setFilterParam("JobType", checked ? value : null);

    const handleCategoryToggle = (value: string, checked: boolean) =>
        setFilterParam("category", checked ? value : null);

    // Multi-select: toggling a value keeps the other selections intact.
    const handleWorkplaceToggle = (value: string, checked: boolean) => {
        const params = new URLSearchParams(searchParams.toString());
        const values = new Set(params.getAll("isRemote"));
        if (checked) {
            values.add(value);
        } else {
            values.delete(value);
        }
        params.delete("isRemote");
        for (const item of values) {
            params.append("isRemote", item);
        }

        router.push(`/browse-jobs?${params.toString()}`, { scroll: false });
    };

    const withCounts = (options: FilterOption[], group: string): FilterOption[] =>
        options.map((option) => ({ ...option, count: counts[group]?.[option.value] }));

    return (
        <aside className="h-fit rounded-xl border border-border bg-card p-5">
            <h2 className="text-lg font-bold">Filters</h2>

            <div className="mt-5 space-y-6">
                <FilterCheckboxGroup
                    title="Job Type"
                    options={withCounts(JOB_TYPES, "jobType")}
                    selected={selection.jobTypes}
                    selectionMode="single"
                    onToggle={handleJobTypeToggle}
                />

                <FilterCheckboxGroup
                    title="Category"
                    options={withCounts(JOB_CATEGORIES, "category")}
                    selected={selection.categories}
                    selectionMode="single"
                    onToggle={handleCategoryToggle}
                />

                <FilterCheckboxGroup
                    title="Workplace"
                    options={withCounts(WORKPLACE_OPTIONS, "workplace")}
                    selected={selection.workplaces}
                    onToggle={handleWorkplaceToggle}
                />
            </div>
        </aside>
    );
}
