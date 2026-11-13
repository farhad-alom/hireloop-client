// Shared page header for the job pages: breadcrumb line, title and description.
// Optional children render on the right side (e.g. the "New Job Post" button).

export function PageHeader({
    breadcrumb,
    title,
    description,
    children,
}: {
    breadcrumb: string[];
    title: string;
    description: string;
    children?: React.ReactNode;
}) {
    return (
        <header>
            <p className="text-sm text-muted-foreground">
                {breadcrumb.map((crumb, index) => {
                    const isLast = index === breadcrumb.length - 1;

                    return (
                        <span key={crumb}>
                            {isLast ? (
                                <span className="text-brand">{crumb}</span>
                            ) : (
                                <>
                                    {crumb}
                                    <span className="mx-1">›</span>{" "}
                                </>
                            )}
                        </span>
                    );
                })}
            </p>

            <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                    <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                </div>

                {children}
            </div>
        </header>
    );
}
