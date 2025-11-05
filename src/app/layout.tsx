import type { Metadata } from 'next'
import './globals.css'
import { SidebarProvider } from '@/contexts/SidebarContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import QueryProvider from '@/providers/QueryProvider'
import ThemeToggle from '@/components/ThemeToggle'
import SidebarWrapper from '@/components/SidebarWrapper'
import { Toaster } from "@/components/ui/sonner"
import { SyncToastNotifier } from '@/components/SyncToastNotifier'
import { PWAProvider } from '@/components/PWAProvider'
import { InstallPrompt } from '@/components/InstallPrompt'
import { WelcomeModal } from '@/components/WelcomeModal'
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts'
import { TasqLogo } from '@/components/TasqLogo'
import { Footer } from 'react-day-picker'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })


export const metadata: Metadata = {
  title: "Tasq - Your Personal Task Manager",
  description: 'A modern, offline-first personal task manager with smart sync and productivity tracking',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: "Tasq",
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          <ThemeProvider>
            <SidebarProvider>
              <main className="max-h-screen bg-linea  transition-colors pt-20 md:pt-24 ">
                <header className="flex justify-between items-center p-4 md:p-6 lg:px-20 lg:py-10 fixed top-0 left-0 right-0 z-50">
                  <TasqLogo />
                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                  </div>
                </header>
                <section className="flex lg:max-w-2xl mx-auto justify-center items-center gap-2  md:gap-4 pb-20">
                {children}
                </section>
                <Footer className="text-center p-2 text-sm text-primary fixed bottom-0 left-0 right-0 bg-transparent" >
                  &copy; With ❤️ by Kachi. All rights reserved.
                </Footer>
              </main>
              <Toaster />
              <SyncToastNotifier />
              <PWAProvider />
              <WelcomeModal />
              <InstallPrompt />
              {/* <QuickAddButton /> */}
              <KeyboardShortcuts />
              <SidebarWrapper />
            </SidebarProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
