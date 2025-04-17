'use client'

import { useState, useCallback, useEffect } from 'react'
import { usePublicClient, useReadContract, useWriteContract, useAccount, useBalance } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { useWhitelist } from './use-whitelist'
import { calculateMaxTransactionAmount } from '@/lib/gas'
import { VAULT_CONTRACT_ADDRESS } from '../constants'
import abi from '../constants/abi'
import type { Address } from 'viem'

export const useDeposit = () => {
  const client = usePublicClient()
  const { address } = useAccount()
  const { refetchWhitelist } = useWhitelist()
  const { isLoading: isBalanceLoading, data: balance, refetch: refetchBalance } = useBalance({ address })
  const { writeContractAsync } = useWriteContract()
  const [isMaxAmountLoading, setIsMaxAmountLoading] = useState(false)
  const [isDepositLoading, setIsDepositLoading] = useState(false)
  const [maxAmount, setMaxAmount] = useState('0')

  useEffect(() => {
    const calculateMaxAmount = async () => {
      if (!balance || !address || !client) {
        setMaxAmount('0')
        return
      }
      setIsMaxAmountLoading(true)
      const maxAmountWei = await calculateMaxTransactionAmount(
        client,
        {
          address: VAULT_CONTRACT_ADDRESS,
          abi,
          functionName: 'deposit',
          args: [0n],
          account: address,
          value: 0n,
        },
        balance.value,
        20
      )
      const maxAmountEth = Number(formatEther(maxAmountWei)).toFixed(6)
      setMaxAmount(maxAmountEth)
      setIsMaxAmountLoading(false)
    }

    calculateMaxAmount()
  }, [balance, address, client])

  const {
    isLoading: isFetchDepositorsLoading,
    data: depositors = [],
    refetch: refetchDepositors,
  } = useReadContract({
    address: VAULT_CONTRACT_ADDRESS,
    abi: abi,
    functionName: 'getAuthorizedDepositors',
    args: [address as Address],
    query: {
      enabled: !!address,
    },
  })

  const deposit = useCallback(
    async (amount: string) => {
      if (!address) return

      setIsDepositLoading(true)
      try {
        const hash = await writeContractAsync({
          address: VAULT_CONTRACT_ADDRESS,
          abi: abi,
          functionName: 'deposit',
          args: [parseEther(amount)],
          value: parseEther(amount),
        })
        await client?.waitForTransactionReceipt({ hash })
        refetchBalance()
        refetchDepositors()
        refetchWhitelist()
        return hash
      } catch (e) {
        throw e
      } finally {
        setIsDepositLoading(false)
      }
    },
    [address, writeContractAsync, client, refetchBalance, refetchDepositors, refetchWhitelist]
  )

  return {
    isBalanceLoading,
    isMaxAmountLoading,
    isFetchDepositorsLoading,
    depositors,
    refetchDepositors,
    isDepositLoading,
    balance: balance ? Number(formatEther(balance.value)).toFixed(6) : '0.0',
    maxAmount,
    deposit,
  }
}
