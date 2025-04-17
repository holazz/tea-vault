'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { TEA_EXPLORER_URL } from '@/lib/chains'
import { TokenInput } from './ui/token-input'
import { ActionButton } from './ui/action-button'
import { useWithdraw } from '../hooks/use-withdraw'

export function WithdrawForm() {
  const { address } = useAccount()
  const [amount, setAmount] = useState('')
  const { isWithdrawableAmountLoading, isWithdrawLoading, withdrawableAmount, withdraw, withdrawAll } = useWithdraw()

  const isDepositDisabled =
    !address || isWithdrawLoading || !amount || Number.parseFloat(amount) > Number.parseFloat(withdrawableAmount)
  const isInsufficientBalance = Number.parseFloat(amount) > Number.parseFloat(withdrawableAmount)

  const handleWithdraw = async () => {
    try {
      const withdrawFn = Number.parseFloat(withdrawableAmount) === Number.parseFloat(amount) ? withdrawAll : withdraw
      const hash = await withdrawFn(amount)
      toast.success('Withdrawal successful', {
        description: (
          <a href={`${TEA_EXPLORER_URL}/tx/${hash}`} target="_blank" rel="noreferrer" className="underline">
            View on Tea Explorer
          </a>
        ),
      })
      setAmount('')
    } catch (e: any) {
      console.error(e)
      toast.error('Withdrawal failed', {
        description: e?.shortMessage || e?.message || 'Please try again later',
      })
    }
  }

  return (
    <div className="space-y-4">
      <TokenInput value={amount} onChange={setAmount} onMaxClick={() => setAmount(withdrawableAmount)} />

      <div className="flex justify-between text-sm text-muted-foreground px-1">
        {isWithdrawableAmountLoading ? (
          <Skeleton className="h-5 w-20" />
        ) : (
          <span>Available: {withdrawableAmount} TEA</span>
        )}
      </div>

      <ActionButton
        loading={isWithdrawLoading}
        disabled={isDepositDisabled}
        text="Withdraw"
        isInsufficientBalance={isInsufficientBalance}
        onClick={handleWithdraw}
      />
    </div>
  )
}
