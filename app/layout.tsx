import { Geist, Geist_Mono } from "next/font/google"
import { Navbar } from "@/components/Navbar"


import "./globals.css"
// import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { Footer } from "@/components/Footer";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata = {
  title: "HireLoop Client",
  description: "Peer-to-Peer Creative Studio Sharing Platform",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html


      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <body>
        {/* <ThemeProvider> */}
        <Navbar />
        {children}

        <Footer />


        {/* </ThemeProvider> */}
      </body>
    </html>
  )
}
