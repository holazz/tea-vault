'use client'

import { ThemeProvider } from '@/components/theme/theme-provider'
import { WagmiProvider } from '@/features/auth/providers/wagmi-provider'

const Providers = ({ children, cookies }: { children: React.ReactNode; cookies: string | null }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <WagmiProvider cookies={cookies}>{children}</WagmiProvider>
    </ThemeProvider>
  )
}

export default Providers
