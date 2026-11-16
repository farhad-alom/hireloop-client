// Shared options for the job form and the jobs table.
// Both must use these values so the saved category always matches the table.

export interface SelectOption {
    value: string;
    label: string;
}

export const JOB_CATEGORIES: SelectOption[] = [
    { value: "engineering", label: "Engineering" },
    { value: "design-creative", label: "Design & Creative" },
    { value: "product-management", label: "Product & Management" },
    { value: "data-analytics", label: "Data & Analytics" },
    { value: "sales-marketing", label: "Sales & Marketing" },
    { value: "operations", label: "Operations" },
];

export const JOB_TYPES: SelectOption[] = [
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" },
    { value: "contract", label: "Contract" },
    { value: "internship", label: "Internship" },
];

import type { JobData } from "@/types/job";

// Finds the label of a category value, e.g. "engineering" -> "Engineering".
// Returns "Other" when the value is unknown.
export const getJobCategoryLabel = (value: string) =>
    JOB_CATEGORIES.find((category) => category.value === value)?.label ?? "Other";

// Finds the label of a job type value, e.g. "full-time" -> "Full-time".
// Returns the raw value when it is unknown.
export const getJobTypeLabel = (value: string) =>
    JOB_TYPES.find((jobType) => jobType.value === value)?.label ?? value;

// Builds the display location of a job, e.g. "Dhaka, Bangladesh (Remote)".
// Some saved jobs already include "(Remote)" in their location text,
// so it is only appended when the text does not mention remote yet.
export const getJobLocationLabel = (job: Pick<JobData, "location" | "isRemote">) => {
    const location = job.location.trim();

    if (!job.isRemote) return location || "Not specified";
    if (!location) return "Remote";
    if (/remote/i.test(location)) return location;

    return `${location} (Remote)`;
};
