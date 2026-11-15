"use client"

// The full-width search bar at the top of the browse jobs page:
// keyword input + "Search Jobs" button, as in the Figma design.
// Submitting navigates to /browse-jobs with the keyword as the `search`
// query param, keeping the active filters in the URL.

import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface JobSearchBarProps {
    /** Initial keyword, read from the URL `search` param. */
    defaultValue?: string;
}

export function JobSearchBar({ defaultValue = "" }: JobSearchBarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const value = new FormData(event.currentTarget).get("search");
        const keyword = typeof value === "string" ? value.trim() : "";

        // URLSearchParams encodes the keyword for the URL. An empty search
        // is removed so the URL stays clean, and the active filters are kept.
        const params = new URLSearchParams(searchParams.toString());
        if (keyword) {
            params.set("search", keyword);
        } else {
            params.delete("search");
        }

        router.push(`/browse-jobs?${params.toString()}`);
    };

    return (
        <form
            onSubmit={handleSearch}
            className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3 sm:flex-row sm:items-center sm:gap-3 sm:p-2 sm:pl-4"
        >
            <label className="flex flex-1 items-center gap-2.5">
                <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <input
                    name="search"
                    type="text"
                    defaultValue={defaultValue}
                    placeholder="Search by job title, keywords..."
                    className="w-full bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground"
                />
            </label>

            <button
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:h-9"
            >
                Search Jobs
            </button>
        </form>
    );
}
