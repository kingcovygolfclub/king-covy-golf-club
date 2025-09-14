import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientLayout from '@/components/layout/ClientLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'King Covy Golf Club - Premium Golf Equipment & Collectibles',
  description: 'Discover premium boutique and collector\'s golf clubs, putters, accessories, and golf-related merchandise at King Covy Golf Club.',
  keywords: 'golf clubs, putters, golf accessories, collectible golf, premium golf equipment, custom golf',
  openGraph: {
    title: 'King Covy Golf Club - Premium Golf Equipment & Collectibles',
    description: 'Discover premium boutique and collector\'s golf clubs, putters, accessories, and golf-related merchandise.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
