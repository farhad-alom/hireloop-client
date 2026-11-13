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

export const SALARY_FREQUENCIES: SelectOption[] = [
    { value: "per hour", label: "per hour" },
    { value: "per day", label: "per day" },
    { value: "per month", label: "per month" },
    { value: "per year", label: "per year" },
];

// Finds the label of a category value, e.g. "engineering" -> "Engineering".
// Returns "Other" when the value is unknown.
export const getJobCategoryLabel = (value: string) =>
    JOB_CATEGORIES.find((category) => category.value === value)?.label ?? "Other";
