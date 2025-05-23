import { cn } from '@/lib/utils'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Bingwa Ordering System',
  description: 'A modern service ordering platform with a dynamic chat interface',
  generator: 'v0.dev'
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={cn('flex min-h-svh flex-col antialiased', inter.className)}
      >
        <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
      </body>
    </html>
  )
}


import './globals.css'
