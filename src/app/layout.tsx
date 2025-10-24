import type { Metadata } from 'next'
import './globals.css'
import { SidebarProvider } from '@/contexts/SidebarContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import QueryProvider from '@/providers/QueryProvider'
import ThemeToggle from '@/components/ThemeToggle'
import SidebarWrapper from '@/components/SidebarWrapper'
import { Toaster } from "@/components/ui/sonner"
import { Footer } from 'react-day-picker'
import Link from 'next/link'


export const metadata: Metadata = {
  title: "Kachi's ToDo App",
  description: 'A modern, feature-rich todo application with productivity tracking',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryProvider>
          <ThemeProvider>
            <SidebarProvider>
              <main className="min-h-screen bg-background transition-colors">
                <header className="flex justify-between items-center p-4 md:p-6 lg:px-20 lg:py-12">
                  <Link href="/">
                  <h1 className="md:text-2xl font-kaushan text-xl font-bold text-foreground">
                    Kachi's <span className="text-amber-700 text-3xl">ToDo</span>
                  </h1>
                  </Link>
                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                  </div>
                </header>
                <section className="flex lg:max-w-2xl mx-auto justify-center items-center gap-2  md:gap-4 pb-20">
                {children}
                </section>
                <Footer className="text-center p-4 text-sm text-muted-foreground fixed bottom-0 left-0 right-0 bg-background" >
                  &copy; {new Date().getFullYear()} Kachi's ToDo App. All rights reserved.
                </Footer>
              </main>
              <Toaster />
              <SidebarWrapper />
            </SidebarProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
