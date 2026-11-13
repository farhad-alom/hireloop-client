// The Active / Expired badge shown in the jobs table.

export function JobStatusBadge({ status }: { status: string }) {
    const active = status === "active";

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${active
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-muted text-muted-foreground"
                }`}
        >
            <span
                className={`size-1.5 rounded-full ${active
                    ? "bg-emerald-400"
                    : "bg-muted-foreground/60"
                    }`}
            />

            {active ? "Active" : "Expired"}
        </span>
    );
}
