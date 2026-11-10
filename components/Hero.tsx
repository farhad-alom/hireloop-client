import Image from "next/image"
import Link from "next/link"
import {
  Briefcase,
  Building2,
  FileSearch,
  MapPin,
  Search,
  Star,
  UserSearch,
  type LucideIcon,
} from "lucide-react"

/* ---------- Editable content ---------- */

const trendingPositions = ["Product Designer", "AI Engineering", "Dev-ops Engineer"]

const stats: { icon: LucideIcon; value: string; label: string }[] = [
  { icon: FileSearch, value: "50K", label: "Active Jobs" },
  { icon: Building2, value: "12K", label: "Companies" },
  { icon: UserSearch, value: "2M", label: "Job Seekers" },
  { icon: Star, value: "97%", label: "Satisfaction Rate" },
]

/* ---------- Small pieces ---------- */

function Badge() {
  return (
    <div className="flex items-center justify-center gap-3">
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-border sm:w-20" />
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs shadow-lg">
        <Briefcase className="size-4 text-orange-400" aria-hidden="true" />
        <span className="font-mono font-bold">50,000+</span>
        <span className="font-mono uppercase text-muted-foreground">new jobs this month</span>
      </div>
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-border sm:w-20" />
    </div>
  )
}

function SearchBar() {
  return (
    <form
      action="/browse-jobs"
      className="mx-auto flex w-full max-w-xl flex-col gap-1 rounded-xl border border-border bg-card p-2 sm:h-[46px] sm:flex-row sm:items-center sm:gap-0 sm:p-0 sm:pl-1 sm:pr-2"
    >
      <label className="flex flex-1 items-center gap-2 px-3 py-2">
        <Search className="size-4 shrink-0 text-foreground/80" aria-hidden="true" />
        <input
          name="q"
          type="text"
          placeholder="Job title, skill or company"
          className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </label>

      <span aria-hidden="true" className="hidden h-5 w-px bg-border sm:block" />

      <label className="flex flex-1 items-center gap-2 px-3 py-2">
        <MapPin className="size-4 shrink-0 text-foreground/80" aria-hidden="true" />
        <input
          name="location"
          type="text"
          placeholder="Location or Remote"
          className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </label>

      <button
        type="submit"
        aria-label="Search jobs"
        className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-brand text-brand-foreground transition-colors hover:bg-brand-hover sm:w-9"
      >
        <Search className="size-4" />
      </button>
    </form>
  )
}

function TrendingRow() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
      <span className="text-muted-foreground">Trending Position</span>
      {trendingPositions.map((item) => (
        <Link
          key={item}
          href={`/browse-jobs?q=${encodeURIComponent(item)}`}
          className="rounded-full border border-border bg-muted px-3 py-1.5 text-[11px] text-foreground transition-colors hover:bg-accent"
        >
          {item}
        </Link>
      ))}
    </div>
  )
}

function StatCard({
  icon: Icon,
  value,
  label, }: {
    icon: LucideIcon
    value: string
    label: string
  }) {
  return (
    <div className="flex min-h-40 flex-col justify-between rounded-xl border border-border bg-gradient-to-b from-card to-background p-5 md:min-h-44">
      <Icon className="size-4 text-foreground" aria-hidden="true" />
      <div>
        <p className="text-4xl font-medium text-foreground md:text-[42px]">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

/* ---------- Hero ---------- */

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[linear-gradient(to_bottom,var(--card)_0px,var(--background)_320px)] bg-background">
      {/* Globe: width is set once in --gw, bottom offset is calculated from it */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 -z-10 w-(--gw) -translate-x-1/2 bottom-[calc(var(--gw)*-0.212)] [--gw:210vw] sm:[--gw:130vw] md:[--gw:min(112vw,1100px)]"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, transparent 22%, black 31%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, transparent 22%, black 31%)",
        }}
      >
        <Image
          src="/images/globe.png"
          alt=""
          width={1440}
          height={1582}
          priority
          sizes="100vw"
          className="h-auto w-full"
        />
      </div>

      <div className="mx-auto max-w-7xl px-3 pb-24 pt-24 md:px-5 md:pb-32 md:pt-28">
        <div className="flex flex-col items-center text-center">
          <Badge />

          <h1 className="mt-7 text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
            Find Your Dream Job Today
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            HireLoop connects top talent with world-class companies. Browse thousands
            of curated opportunities and land your next role — faster.
          </p>

          <div className="mt-9 w-full">
            <SearchBar />
          </div>

          <div className="mt-5">
            <TrendingRow />
          </div>

          {/* Space where the globe's top glow shows */}
          <p className="mt-44 max-w-md text-2xl font-light leading-snug text-muted-foreground md:mt-60 md:max-w-lg md:text-[28px]">
            Assisting over{" "}
            <span className="font-normal text-foreground">15,000 job seekers</span> find
            their dream positions.
          </p>
        </div>

        <div className="mt-10 grid w-full grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  )
}
