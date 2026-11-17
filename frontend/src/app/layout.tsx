import type { Metadata } from 'next'
import { Noto_Sans } from 'next/font/google'

import BackToTop from '@/components/common/BackToTop'
import Footer from '@/components/layouts/footer/Footer'
import Header from '@/components/layouts/header/Header'
import { siteConfig } from '@/config/site'

import './globals.css'

const notoSans = Noto_Sans({ subsets: ['latin', 'vietnamese'], display: 'swap' })

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={`${notoSans.className} flex min-h-screen flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  )
}
