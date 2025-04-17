'use client'

import { useEffect } from 'react'
import { cookieToInitialState, WagmiProvider as _WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTheme } from 'next-themes'
import { createAppKit } from '@reown/appkit/react'
import { teaTestnet } from '@/lib/chains'
import { wagmiAdapter, projectId } from '../config'
import type { Config } from 'wagmi'

// Set up queryClient
const queryClient = new QueryClient()

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Set up metadata
const metadata = {
  name: 'Tea Vault',
  description: 'Tea Vault Application',
  url: '',
  icons: [''],
}

// Create the modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [teaTestnet],
  defaultNetwork: teaTestnet,
  metadata: metadata,
  features: {
    analytics: true,
    swaps: false,
    onramp: false,
    socials: false,
    email: false,
    send: false,
  },
})

export function WagmiProvider({ children, cookies }: { children: React.ReactNode; cookies: string | null }) {
  const { resolvedTheme } = useTheme()
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  useEffect(() => {
    const theme = resolvedTheme === 'dark' ? 'dark' : 'light'
    modal.setThemeMode(theme)
  }, [resolvedTheme])

  return (
    <_WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </_WagmiProvider>
  )
}
