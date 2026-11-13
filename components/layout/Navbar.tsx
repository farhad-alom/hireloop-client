
"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { signOut, useSession } from "@/lib/auth-client"
import { ThemeToggle } from "@/components/layout/ThemeToggle"

type Navlink = {
  label: string
  href: string
}

function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center">
      <Image
        src="/images/logo.png"
        alt="HireLoop"
        width={112}
        height={40}
        className="h-7 w-auto md:h-8"
        priority
      />
    </Link>
  )
}

function ActionLinks({
  navLinks,
  className,
  onNavigate,
  user,
  isPending,
  onSignOut,
  showToggle,
}: {
  navLinks: Navlink[]
  className?: string
  onNavigate?: () => void
  user?: { name?: string | null } | null
  isPending?: boolean
  onSignOut?: () => void
  showToggle?: boolean
}) {
  return (
    <div className={cn("items-center gap-6", className)}>
      {navLinks.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          onClick={onNavigate}
          className="text-xs font-medium text-white transition-colors hover:text-white/70"
        >
          {link.label}
        </Link>
      ))}

      {/* Divider */}
      <span
        aria-hidden="true"
        className="hidden h-5 w-px bg-white/20 md:block"
      />

      {/* Theme Toggle */}
      {showToggle && <ThemeToggle />}

      {/* Authentication */}
      {isPending ? (
        <div className="h-5 w-28" />
      ) : user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-white">
            Welcome,{" "}
            <span className="text-[#7C6BF7]">
              {user.name}
            </span>
          </span>

          <button
            type="button"
            onClick={() => {
              onNavigate?.()
              onSignOut?.()
            }}
            className="text-sm font-medium text-white/70 transition-colors hover:text-white"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <>
          <Link
            href="/sign-in"
            onClick={onNavigate}
            className="text-sm font-medium text-[#7C6BF7] transition-colors hover:text-[#9689fb]"
          >
            Sign In
          </Link>

          <Link
            href="/sign-up"
            onClick={onNavigate}
            className="inline-flex items-center justify-center rounded-lg bg-[#5B4BF5] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#4a3be0]"
          >
            Get Started
          </Link>
        </>
      )}
    </div>
  )
}

export function Navbar() {
  const [open, setOpen] = useState(false)

  const { data: session, isPending } = useSession()
  const router = useRouter()

  // Navigation Links
  const navLinks: Navlink[] = [
    { label: "Home", href: "/" },
    { label: "Browse Jobs", href: "/browse-jobs" },
    { label: "Company", href: "/company" },
    { label: "Pricing", href: "/pricing" },
    ...(session?.user ? [{ label: "Dashboard", href: `/dashboard/${session?.user?.role || "seeker"}`, },] : []),

  ]

  // Sign Out
  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          setOpen(false)
          router.push("/")
          router.refresh()
        },
      },
    })
  }

  return (
    <header className="bg-[#1a1a1a] p-3 md:p-3">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between rounded-xl border border-white/5 bg-[#232323] px-4 py-3 md:px-5">

          <Logo />

          {/* Desktop Navigation */}
          <ActionLinks
            navLinks={navLinks}
            className="hidden md:flex"
            user={session?.user}
            isPending={isPending}
            onSignOut={handleSignOut}
            showToggle
          />

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />

            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex size-9 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10"
            >
              {open ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {open && (
          <div
            id="mobile-menu"
            className="mt-2 rounded-xl border border-white/5 bg-[#232323] p-4 md:hidden"
          >
            <ActionLinks
              navLinks={navLinks}
              onNavigate={() => setOpen(false)}
              user={session?.user}
              isPending={isPending}
              onSignOut={handleSignOut}
              className="flex flex-col items-end gap-4 text-right [&>span[aria-hidden]]:hidden"
            />
          </div>
        )}
      </div>
    </header>
  )
}
