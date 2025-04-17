'use client'

import { useState, useCallback } from 'react'
import { useReadContract, useWriteContract, useAccount, usePublicClient } from 'wagmi'
import abi from '../constants/abi'
import { VAULT_CONTRACT_ADDRESS } from '../constants'
import { parseEther, formatEther } from 'viem'
import type { Address } from 'viem'

export const useWithdraw = () => {
  const client = usePublicClient()
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false)

  const { isLoading: isWithdrawableAmountLoading, data: withdrawableAmount, refetch: refetchWithdrawable } = useReadContract({
    address: VAULT_CONTRACT_ADDRESS,
    abi: abi,
    functionName: 'getWithdrawableAmount',
    args: [address as Address],
    query: {
      enabled: !!address,
    },
  })

  const withdraw = useCallback(
    async (amount: string) => {
      if (!address) return
      setIsWithdrawLoading(true)
      try {
        const hash = await writeContractAsync({
          address: VAULT_CONTRACT_ADDRESS,
          abi: abi,
          functionName: 'withdraw',
          args: [parseEther(amount)],
        })
        await client?.waitForTransactionReceipt({ hash })
        return hash
      } catch (e) {
        throw e
      } finally {
        setIsWithdrawLoading(false)
      }
    },
    [address, writeContractAsync, client]
  )

  const withdrawAll = useCallback(async () => {
    if (!address) return
    setIsWithdrawLoading(true)
    try {
      const hash = await writeContractAsync({
        address: VAULT_CONTRACT_ADDRESS,
        abi: abi,
        functionName: 'withdrawAll',
      })
      await client?.waitForTransactionReceipt({ hash })
      return hash
    } catch (e) {
      throw e
    } finally {
      setIsWithdrawLoading(false)
    }
  }, [address, writeContractAsync, client])

  return {
    isWithdrawableAmountLoading,
    isWithdrawLoading,
    withdrawableAmount: withdrawableAmount ? formatEther(withdrawableAmount) : '0',
    refetchWithdrawable,
    withdraw,
    withdrawAll,
  }
}
