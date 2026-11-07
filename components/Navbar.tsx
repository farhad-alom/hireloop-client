"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Browse Jobs", href: "/browse-jobs" },
  { label: "Company", href: "/company" },
  { label: "Pricing", href: "/pricing" },
]

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
  className,
  onNavigate,
}: {
  className?: string
  onNavigate?: () => void
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

      {/* Divider (hidden on mobile) */}
      <span aria-hidden="true" className="hidden h-5 w-px bg-white/20 md:block" />

      <Link
        href="/sign-in"
        onClick={onNavigate}
        className="text-sm font-medium text-[#7C6BF7] transition-colors hover:text-[#9689fb]"
      >
        Sign In
      </Link>
      <Link
        href="/get-started"
        onClick={onNavigate}
        className="inline-flex items-center justify-center rounded-lg bg-[#5B4BF5] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#4a3be0]"
      >
        Get Started
      </Link>
    </div>
  )
}

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-[#1a1a1a] p-3 md:p-3">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between rounded-xl border border-white/5 bg-[#232323] px-4 py-3 md:px-5">
          <Logo />

          {/* Desktop */}
          <ActionLinks className="hidden md:flex" />

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex size-9 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div
            id="mobile-menu"
            className="mt-2 rounded-xl border border-white/5 bg-[#232323] p-4 md:hidden"
          >
            <ActionLinks
              onNavigate={() => setOpen(false)}
              className="flex flex-col items-end gap-4 text-right [&>span]:hidden"
            />
          </div>
        )}
      </div>
    </header>
  )
}
