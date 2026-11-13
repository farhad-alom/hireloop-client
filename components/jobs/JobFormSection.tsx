// One numbered section of the job form
// (1. Basic Information, 2. Location..., 3. Responsibilities...).

export function JobFormSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-xl bg-card p-5 md:p-6">
            <div className="flex items-center gap-2.5">
                <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-brand" />
                <h2 className="text-lg font-medium">{title}</h2>
            </div>

            <div className="mt-5 space-y-5">{children}</div>
        </section>
    );
}
