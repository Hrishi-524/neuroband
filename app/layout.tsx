import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/Sidebar"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
})

export const metadata = {
    title: "NeuroBand · Classroom Focus Analytics",
    description: "Real-time neuroscience-based concentration tracking dashboard",
  icons: {
    icon: "/favicon.svg",
  }
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
        >
            <body>
                <ThemeProvider defaultTheme="dark">
                    <div className="flex min-h-screen">
                        <Sidebar />
                        <main className="flex-1 ml-64 min-h-screen">
                            {children}
                        </main>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    )
}
