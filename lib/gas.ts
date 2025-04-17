import { parseEther } from 'viem'
import type { PublicClient, EstimateContractGasParameters } from 'viem'

/**
 * Estimates the gas cost for a contract interaction
 * @param client The Viem public client
 * @param params Parameters for contract gas estimation (same as publicClient.estimateContractGas)
 * @param bufferPercentage Optional buffer percentage to add to the estimate (default: 20%)
 * @returns The estimated gas cost in wei as a bigint
 */
export async function estimateContractGasCost(
  client: PublicClient,
  params: EstimateContractGasParameters,
  bufferPercentage = 20
) {
  try {
    // Get current fee data (EIP-1559)
    const feeData = await client.estimateFeesPerGas()

    // Use maxFeePerGas if available, otherwise fallback to gasPrice
    const gasPrice = feeData.maxFeePerGas || feeData.gasPrice || BigInt(1000000000) // 1 gwei fallback

    // Estimate gas for the transaction
    const gasEstimate = await client.estimateContractGas(params)

    // Calculate gas cost with buffer
    const buffer = BigInt(100 + bufferPercentage)
    const gasCost = (gasEstimate * gasPrice * buffer) / 100n

    return gasCost
  } catch (e) {
    console.error('Error estimating gas cost:', e)
    // Return a conservative fallback estimate (0.01 TEA)
    return parseEther('0.01')
  }
}

/**
 * Calculates the maximum amount that can be sent in a transaction after accounting for gas
 * @param client The Viem public client
 * @param params Parameters for contract gas estimation
 * @param balance The current balance in Wei
 * @param bufferPercentage Optional buffer percentage to add to the estimate (default: 20%)
 * @returns The maximum amount that can be sent, formatted to 6 decimal places
 */
export async function calculateMaxTransactionAmount(
  client: PublicClient,
  params: EstimateContractGasParameters,
  balance: bigint,
  bufferPercentage = 20
) {
  if (!balance || balance <= 0n) {
    return 0n
  }

  try {
    const gasCost = await estimateContractGasCost(client, params, bufferPercentage)
    // Calculate max amount (balance - gas cost)
    const maxAmount = balance > gasCost ? balance - gasCost : 0n
    return maxAmount
  } catch (e) {
    console.error('Error calculating max transaction amount:', e)
    // Fallback to a conservative estimate
    const safeMaxAmount = balance > parseEther('0.01') ? balance - parseEther('0.01') : 0n
    return safeMaxAmount
  }
}
