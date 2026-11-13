import Image from "next/image"
import Link from "next/link"
import { FaFacebookF, FaPinterest, FaLinkedinIn } from "react-icons/fa"

const columns = [
    {
        title: "Product",
        links: [
            { label: "Job discovery", href: "/browse-jobs" },
            { label: "Worker AI", href: "#" },
            { label: "Companies", href: "/company" },
            { label: "Salary data", href: "#" },
        ],
    },
    {
        title: "Navigations",
        links: [
            { label: "Help center", href: "#" },
            { label: "Career library", href: "#" },
            { label: "Contact", href: "#" },
        ],
    },
    {
        title: "Resources",
        links: [
            { label: "Brand Guideline", href: "#" },
            { label: "Newsroom", href: "#" },
        ],
    },
]

const socials = [
    { label: "Facebook", href: "#", Icon: FaFacebookF },
    { label: "Pinterest", href: "#", Icon: FaPinterest },
    { label: "LinkedIn", href: "#", Icon: FaLinkedinIn },
]

export function Footer() {
    return (
        <footer className="relative overflow-hidden bg-card text-sm text-muted-foreground">
            {/* Top grid pattern (fade out) */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[48px_24px] mask-[linear-gradient(to_bottom,black,transparent)]"
            />

            <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-16 md:px-8">
                {/* Main */}
                <div className="flex flex-col gap-12 md:flex-row md:justify-between">
                    <div className="max-w-xs">
                        <Link href="/">
                            <Image
                                src="/images/logo.png"
                                alt="HireLoop"
                                width={112}
                                height={40}
                                className="h-8 w-auto"
                                priority
                            />
                        </Link>
                        <p className="mt-6 leading-7">
                            The AI-native career platform. Built for people who take their
                            work seriously.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:gap-16">
                        {columns.map((col) => (
                            <div key={col.title}>
                                <h4 className="font-medium text-brand">{col.title}</h4>
                                <ul className="mt-5 space-y-3">
                                    {col.links.map((link) => (
                                        <li key={link.label}>
                                            <Link
                                                href={link.href}
                                                className="transition-colors hover:text-foreground"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-16 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex gap-2">
                        {socials.map(({ label, href, Icon }) => (
                            <Link
                                key={label}
                                href={href}
                                aria-label={label}
                                className="flex size-11 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-brand hover:text-brand-foreground"
                            >
                                <Icon className="size-4" />
                            </Link>
                        ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <span>Copyright 2024 —Programming Hero</span>
                        <span className="text-muted-foreground/80">
                            Terms &amp; Policy - Privacy Guideline
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    )
}