// The job seeker's "My Applications" page, built as a Server Component (RSC):
// the session is read on the server with auth.api.getSession(), the real
// applications are fetched from the Express API, and the interactive parts
// (status filter + table) are rendered by the ApplicationsView client
// component, which receives the data as props.

import { Suspense } from "react";
import Link from "next/link";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { getMyApplications } from "@/lib/api/applications";
import { PageHeader } from "@/components/layout/PageHeader";
import { ApplicationsView } from "@/components/applications/ApplicationsView";

/* ---------- Loading / fallback states ---------- */

// Shown while the applications are being fetched (Suspense fallback):
// four skeleton stat cards and a few skeleton table rows.
function ApplicationsSkeleton() {
    return (
        <>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {[0, 1, 2, 3].map((card) => (
                    <div
                        key={card}
                        className="h-24 animate-pulse rounded-xl bg-card"
                    />
                ))}
            </div>

            <div className="mt-6 rounded-xl bg-card p-4">
                {[0, 1, 2].map((row) => (
                    <div
                        key={row}
                        className="h-5 max-w-md animate-pulse rounded bg-muted"
                    />
                ))}
            </div>
        </>
    );
}

// Shown when nobody is signed in (e.g. the session cookie is gone).
function NotSignedInState() {
    return (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="text-lg font-semibold">Please sign in</p>
            <p className="mt-1 text-sm text-muted-foreground">
                Sign in to see the jobs you applied for.
            </p>
            <Link
                href="/sign-in?next=%2Fdashboard%2Fseeker%2Fapplications"
                className="mt-4 inline-flex rounded-full bg-brand px-5 py-2 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-hover"
            >
                Sign In
            </Link>
        </div>
    );
}

// Shown when the applications API could not be reached.
// (plain JS file, so the message prop is documented instead of typed)
function ErrorState({ message }) {
    return (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="text-sm text-destructive">{message}</p>
            <p className="mt-1 text-sm text-muted-foreground">
                Please try again later.
            </p>
        </div>
    );
}

/* ---------- Data section (streams in inside Suspense) ---------- */

async function ApplicationsContent() {
    // Read the request headers once (they contain the session cookie).
    const requestHeaders = await headers();

    // 1. Who is viewing the page? better-auth verifies the session cookie.
    const session = await auth.api.getSession({ headers: requestHeaders });

    if (!session) {
        return <NotSignedInState />;
    }

    // 2. Load the applications. The Express API verifies the same session
    //    cookie and only returns rows saved with this user's id
    //    (session.user.id). Forward the cookie so the API can verify it.
    const cookie = requestHeaders.get("cookie") ?? "";
    const result = await getMyApplications(cookie);

    if (!result.ok) {
        return <ErrorState message={result.error ?? "Could not load applications"} />;
    }

    // 3. Safety net: keep only the applications that belong to the
    //    signed-in user (the API already filters by userId, this just
    //    double-checks it on the page).
    const myApplications = result.applications.filter(
        (application) => application.userId === session.user.id
    );

    return <ApplicationsView applications={myApplications} />;
}

/* ---------- Page ---------- */

export default function SeekerApplicationPage() {
    return (
        <main className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8">
            <PageHeader
                breadcrumb={["Dashboard", "My Applications"]}
                title="My Applications"
                description="Track the status of every job you applied for and follow each application from submission to decision."
            />

            <div className="mt-6">
                <Suspense fallback={<ApplicationsSkeleton />}>
                    <ApplicationsContent />
                </Suspense>
            </div>
        </main>
    );
}
