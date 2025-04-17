'use client'

import { useState, useCallback } from 'react'
import { useReadContract, useWriteContract, useAccount, useBalance, usePublicClient } from 'wagmi'
import abi from '../constants/abi'
import { VAULT_CONTRACT_ADDRESS } from '../constants'
import type { Address } from 'viem'

export const useWhitelist = () => {
  const client = usePublicClient()
  const { address } = useAccount()
  const { refetch: refetchBalance } = useBalance({ address })
  const { writeContractAsync } = useWriteContract()
  const [isUpdateWhitelistLoading, setIsUpdateWhitelistLoading] = useState(false)

  const {
    isLoading: isFetchWhitelistLoading,
    data: whitelist = [],
    refetch: refetchWhitelist,
  } = useReadContract({
    address: VAULT_CONTRACT_ADDRESS,
    abi: abi,
    functionName: 'getDepositorWhitelist',
    args: [address as Address],
    query: {
      enabled: !!address,
    },
  })

  const updateWhitelist = useCallback(
    async (addresses: Address[], isAdd: boolean) => {
      if (!address || addresses.length === 0) return
      try {
        const hash = await writeContractAsync({
          address: VAULT_CONTRACT_ADDRESS,
          abi: abi,
          functionName: 'batchUpdateWhitelist',
          args: [addresses, isAdd],
        })
        setIsUpdateWhitelistLoading(true)
        await client?.waitForTransactionReceipt({ hash })
        refetchBalance()
        await refetchWhitelist()
        return hash
      } catch (e) {
        throw e
      } finally {
        setIsUpdateWhitelistLoading(false)
      }
    },
    [address, writeContractAsync, client, refetchBalance, refetchWhitelist]
  )

  return {
    isFetchWhitelistLoading,
    whitelist,
    refetchWhitelist,
    isUpdateWhitelistLoading,
    updateWhitelist,
  }
}
