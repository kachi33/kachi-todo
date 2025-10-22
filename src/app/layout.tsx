import type { Metadata } from 'next'
import './globals.css'
import { SidebarProvider } from '@/contexts/SidebarContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import QueryProvider from '@/providers/QueryProvider'
import ThemeToggle from '@/components/ThemeToggle'
import OfflineStatus from '@/components/OfflineStatus'

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
                <header className="flex justify-between items-center p-4 md:p-6 lg:px-12 lg:py-8">
                  <h1 className="md:text-2xl text-xl font-bold text-foreground">
                    Kachi's <span className="text-amber-700 text-3xl">ToDo</span>
                  </h1>
                  <div className="flex items-center gap-2">
                    <OfflineStatus />
                    <ThemeToggle />
                  </div>
                </header>
                <section className="flex lg:max-w-2xl mx-auto justify-center items-center gap-2 md:gap-4">
                {children}
                </section>
              </main>
            </SidebarProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
