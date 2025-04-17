import '@/styles/globals.css'
import { Roboto_Mono } from 'next/font/google'
import Providers from './providers'
import { headers } from 'next/headers'
import Header from '@/components/layouts/header'
import type { Metadata } from 'next'

const inter = Roboto_Mono({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Tea Vault',
  description: 'A vault application on Tea Sepolia',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookies = (await headers()).get('cookie')
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers cookies={cookies}>
          <div className="relative flex flex-col min-h-screen">
            <Header />
            <main>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
