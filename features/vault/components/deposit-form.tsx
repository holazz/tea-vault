'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { TEA_EXPLORER_URL } from '@/lib/chains'
import { TokenInput } from './ui/token-input'
import { ActionButton } from './ui/action-button'
import { useDeposit } from '../hooks/use-deposit'

export function DepositForm() {
  const { address } = useAccount()
  const [amount, setAmount] = useState('')
  const { isBalanceLoading, isMaxAmountLoading, isDepositLoading, balance, maxAmount, deposit } = useDeposit()

  const isDepositDisabled =
    !address || isDepositLoading || !amount || Number.parseFloat(amount) > Number.parseFloat(maxAmount)
  const isInsufficientBalance = Number.parseFloat(amount) > Number.parseFloat(maxAmount)

  const handleDeposit = async () => {
    try {
      const hash = await deposit(amount)
      toast.success('Deposit successful', {
        description: (
          <a href={`${TEA_EXPLORER_URL}/tx/${hash}`} target="_blank" rel="noreferrer" className="underline">
            View on Tea Explorer
          </a>
        ),
      })
      setAmount('')
    } catch (e: any) {
      console.error(e)
      toast.error('Deposit failed', {
        description: e?.shortMessage || e?.message || 'Please try again later',
      })
    }
  }

  return (
    <div className="space-y-4">
      <TokenInput value={amount} onChange={setAmount} onMaxClick={() => setAmount(maxAmount)} />

      <div className="flex justify-between text-sm text-muted-foreground px-1">
        {isBalanceLoading ? <Skeleton className="h-5 w-20" /> : <span>Balance: {balance} TEA</span>}
        {isMaxAmountLoading ? <Skeleton className="h-5 w-20" /> : <span>Max: {maxAmount} TEA</span>}
      </div>

      <ActionButton
        loading={isDepositLoading}
        disabled={isDepositDisabled}
        text="Deposit"
        isInsufficientBalance={isInsufficientBalance}
        onClick={handleDeposit}
      />
    </div>
  )
}
