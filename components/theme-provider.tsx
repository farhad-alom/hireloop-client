
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  // React 19 / Next 16 fix: on the client, tell next-themes to render its
  // inline theme script as a non-executable data block so React does not
  // warn "Encountered a script tag while rendering React component".
  // On the server it stays a normal script and runs before hydration.
  const scriptProps =
    typeof window === "undefined"
      ? undefined
      : ({ type: "application/json" } as const);

  return (
    <NextThemesProvider
      scriptProps={scriptProps}
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
