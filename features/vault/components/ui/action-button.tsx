'use client'

import { LoaderCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { withdraw } from 'viem/zksync'

interface ActionButtonProps {
  loading: boolean
  disabled: boolean
  text: 'Deposit' | 'Withdraw'
  isInsufficientBalance: boolean
  onClick: () => void
}

export function ActionButton({ loading, disabled, text, isInsufficientBalance, onClick }: ActionButtonProps) {
  return (
    <Button className="w-full md:mt-4" disabled={disabled} onClick={onClick}>
      {isInsufficientBalance ? (
        'Insufficient balance'
      ) : loading ? (
        <>
          <LoaderCircle className="animate-spin" /> {text}ing...
        </>
      ) : (
        text
      )}
    </Button>
  )
}
