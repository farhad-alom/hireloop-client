
"use client"

import { useSyncExternalStore } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

const subscribeNoop = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

/**
 * True once the component has hydrated on the client.
 * SSR/hydration pass uses the server snapshot (false), so markup matches.
 */
function useIsHydrated() {
    return useSyncExternalStore(subscribeNoop, getClientSnapshot, getServerSnapshot)
}

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const isHydrated = useIsHydrated()

    if (!isHydrated) {
        return (
            <button
                type="button"
                disabled
                className="flex size-8 items-center justify-center rounded-lg border border-border"
                aria-label="Loading theme"
                data-slot="theme-toggle-placeholder"
            >
                <Sun className="size-4" />
            </button>
        )
    }

    const isDark = theme === "dark"

    return (
        <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
            className="flex size-8 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-accent"
        >
            {isDark ? (
                <Sun className="size-5" />
            ) : (
                <Moon className="size-5" />
            )}
        </button>
    )
}
