import { defineChain } from 'viem'

export const TEA_RPC_URL = 'https://tea-sepolia.g.alchemy.com/public'

export const TEA_EXPLORER_URL = 'https://sepolia.tea.xyz'

export const teaTestnet = defineChain({
  id: 10218,
  name: 'Tea Sepolia',
  nativeCurrency: { name: 'TEA', symbol: 'TEA', decimals: 18 },
  rpcUrls: {
    default: { http: [TEA_RPC_URL] },
  },
  blockExplorers: {
    default: { name: 'TeaExplorer', url: TEA_EXPLORER_URL },
  },
})
