'use client'

import { Button } from '@/components/ui/button'
import { Wallet } from 'lucide-react'
import { useAppKit, useAppKitAccount } from '@reown/appkit/react'
import { formatAddress } from '@/lib/utils'

export default function WalletConnectButton() {
  const { open } = useAppKit()
  const { address, isConnected } = useAppKitAccount()

  return (
    <Button size="sm" className="cursor-pointer" onClick={() => open()}>
      {isConnected ? (
        <>
          <Wallet size={24} />
          {formatAddress(address!)}
        </>
      ) : (
        'Connect Wallet'
      )}
    </Button>
  )
}
