'use client'

import { useState } from 'react'
import { isAddress, isAddressEqual } from 'viem'
import { useAccount } from 'wagmi'
import { clsx } from 'clsx'
import { Plus, Trash2, Upload } from 'lucide-react'
import { toast } from '@/components/ui/toast'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { formatAddress } from '@/lib/utils'
import { TEA_EXPLORER_URL } from '@/lib/chains'
import { useWhitelist } from '../hooks/use-whitelist'
import { MAX_WHITELIST_ADDRESS_COUNT } from '../constants'
import type { Address } from 'viem'

export function WhitelistManager() {
  const [newAddress, setNewAddress] = useState('')
  const [batchAddresses, setBatchAddresses] = useState('')
  const [selectedAddresses, setSelectedAddresses] = useState<Address[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const { isFetchWhitelistLoading, isUpdateWhitelistLoading, whitelist, updateWhitelist } = useWhitelist()
  const { address: userAddress } = useAccount()

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [validAddressesToAdd, setValidAddressesToAdd] = useState<Address[]>([])

  const handleAddAddress = async () => {
    if (!isAddress(newAddress)) {
      toast.error('Invalid address')
      return
    }

    if (whitelist.includes(newAddress)) {
      toast.error('Duplicate address')
      return
    }

    if (whitelist.length >= MAX_WHITELIST_ADDRESS_COUNT) {
      toast.error('Whitelist limit reached')
      return
    }

    try {
      await updateWhitelist([newAddress], true)
      toast.success('Address added successfully')
      setNewAddress('')
    } catch (e: any) {
      console.error(e)
      toast.error('Failed to add address')
    }
  }

  const handleBatchAdd = async () => {
    if (!batchAddresses.trim()) {
      toast.error('No addresses provided')
      return
    }

    // Split by newline, comma, or space and filter out empty strings
    const addressArray = batchAddresses
      .split(/[\n,\s]+/)
      .map((addr) => addr.trim())
      .filter((addr) => addr.length > 0) as Address[]

    // Validate addresses
    const validAddresses = addressArray.filter((addr) => isAddress(addr))

    if (validAddresses.length === 0) {
      toast.error('No valid addresses found')
      return
    }

    // Find duplicates within the batch itself
    const addressCounts = new Map<Address, number>()
    validAddresses.forEach((addr) => {
      addressCounts.set(addr, (addressCounts.get(addr) || 0) + 1)
    })

    // Get addresses that appear more than once in the batch
    const internalDuplicates = Array.from(addressCounts.entries())
      .filter(([_, count]) => count > 1)
      .map(([addr]) => addr)

    // Find addresses that already exist in the whitelist
    const existingDuplicates = validAddresses.filter((addr) => whitelist.includes(addr))

    // Combine all duplicates
    const allDuplicates = [...new Set([...internalDuplicates, ...existingDuplicates])]

    // If there are any duplicates, show error and don't proceed
    if (allDuplicates.length > 0) {
      // Format duplicates for display
      const formattedDuplicates = allDuplicates.map((addr) => formatAddress(addr)).join(', ')

      toast.error('Duplicate addresses found')
      return
    }

    // Check whitelist limit
    if (whitelist.length + validAddresses.length > MAX_WHITELIST_ADDRESS_COUNT) {
      toast.error('Whitelist limit exceeded')
      return
    }

    // Set valid addresses and open confirmation dialog
    setValidAddressesToAdd(validAddresses)
    setConfirmDialogOpen(true)
  }

  const handleConfirmedBatchAdd = async () => {
    try {
      await updateWhitelist(validAddressesToAdd, true)
      toast.success('Addresses added successfully')
      setBatchAddresses('')
      setDialogOpen(false)
      setConfirmDialogOpen(false)
      setValidAddressesToAdd([])
    } catch (e: any) {
      console.error(e)
      toast.error('Failed to add addresses')
    }
  }

  const handleToggleSelect = (address: Address) => {
    // Prevent selecting user's own address
    if (userAddress && isAddressEqual(address, userAddress)) {
      return
    }

    setSelectedAddresses((current) =>
      current.includes(address) ? current.filter((addr) => addr !== address) : [...current, address]
    )
  }

  const handleSelectAll = () => {
    // Count all non-user addresses
    const nonUserAddressCount = whitelist.filter((addr) => !userAddress || !isAddressEqual(addr, userAddress)).length

    if (selectedAddresses.length === nonUserAddressCount) {
      setSelectedAddresses([])
    } else {
      // Select all addresses except the user's own address
      setSelectedAddresses(whitelist.filter((addr) => !userAddress || !isAddressEqual(addr, userAddress)))
    }
  }

  const handleRemoveSelected = async () => {
    if (selectedAddresses.length === 0) return

    try {
      await updateWhitelist(selectedAddresses, false)
      toast.success('Addresses removed')
      setSelectedAddresses([])
    } catch (e: any) {
      console.error(e)
      toast.error('Failed to remove addresses')
    }
  }

  const sortedWhitelist = [...whitelist].sort((a, b) => {
    if (userAddress && isAddressEqual(a, userAddress)) return -1
    if (userAddress && isAddressEqual(b, userAddress)) return 1
    return 0
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Whitelist</CardTitle>
        <CardDescription>Control who can withdraw your deposited funds</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter address (0x...)"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
          />
          <Button onClick={handleAddAddress} disabled={!newAddress}>
            <Plus size={16} />
            Add
          </Button>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload size={16} />
                Batch Add
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Multiple Addresses</DialogTitle>
                <DialogDescription>
                  Enter multiple addresses separated by commas, spaces, or new lines.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="addresses">Addresses</Label>
                  <Textarea
                    id="addresses"
                    placeholder={`0x123...\n0x456...\n0x789...`}
                    value={batchAddresses}
                    onChange={(e) => setBatchAddresses(e.target.value)}
                    className="min-h-[150px] max-h-[250px] w-full max-w-full resize-none overflow-x-hidden break-all"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>
                    Current whitelist: {whitelist.length}/{MAX_WHITELIST_ADDRESS_COUNT} addresses
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleBatchAdd} disabled={isUpdateWhitelistLoading}>
                  Add Addresses
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <div className="p-2 border-b flex items-center justify-between">
            <div className="flex items-center">
              <Checkbox
                id="select-all"
                checked={
                  whitelist.length > 0 &&
                  selectedAddresses.length ===
                    whitelist.filter((addr) => !userAddress || !isAddressEqual(addr, userAddress)).length
                }
                onCheckedChange={handleSelectAll}
                className="mr-2"
              />
              <label htmlFor="select-all" className="text-sm font-medium">
                Select All
              </label>
            </div>
            {selectedAddresses.length > 0 && !isFetchWhitelistLoading && !isUpdateWhitelistLoading && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveSelected}
                disabled={selectedAddresses.length === 0 || isFetchWhitelistLoading || isUpdateWhitelistLoading}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 size={16} />
                Remove Selected
              </Button>
            )}
          </div>

          {isFetchWhitelistLoading || isUpdateWhitelistLoading ? (
            <div className="space-y-2 p-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <ScrollArea className="h-[200px] p-2">
              {whitelist.length > 0 ? (
                <ul className="space-y-2">
                  {sortedWhitelist.map((addr, index) => {
                    const isUserAddress = userAddress && isAddressEqual(addr, userAddress)
                    return (
                      <li
                        key={index}
                        className={clsx(
                          'flex items-center gap-2 p-2 rounded-md',
                          isUserAddress ? 'bg-primary/10 border border-primary/30' : 'hover:bg-secondary'
                        )}
                      >
                        <Checkbox
                          id={`address-${index}`}
                          checked={selectedAddresses.includes(addr)}
                          onCheckedChange={() => handleToggleSelect(addr)}
                          disabled={isUserAddress}
                        />
                        <label
                          htmlFor={`address-${index}`}
                          className={clsx('flex-1 cursor-pointer text-sm', isUserAddress ? 'font-medium' : '')}
                        >
                          {formatAddress(addr)}
                          {isUserAddress && ' (You)'}
                        </label>
                        <a
                          href={`${TEA_EXPLORER_URL}/address/${addr}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          View
                        </a>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground mt-8">
                  <p>No addresses in whitelist</p>
                  <p className="text-xs mt-1">Add addresses to allow others to withdraw</p>
                </div>
              )}
            </ScrollArea>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between text-xs text-muted-foreground">
        <span>Add addresses to your whitelist to allow them to withdraw funds you've deposited.</span>
        <span>
          {isFetchWhitelistLoading || isUpdateWhitelistLoading ? (
            <Skeleton className="h-4 w-20" />
          ) : (
            `${whitelist.length}/${MAX_WHITELIST_ADDRESS_COUNT} addresses`
          )}
        </span>
      </CardFooter>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Adding Addresses</DialogTitle>
            <DialogDescription>
              You are about to add {validAddressesToAdd.length} addresses to your whitelist. Please review and confirm.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Addresses to add ({validAddressesToAdd.length})</Label>
              <ScrollArea className="h-[200px] border rounded-md p-2">
                <ul className="space-y-1">
                  {validAddressesToAdd.map((addr, idx) => (
                    <li key={idx} className="text-sm">
                      {formatAddress(addr)}
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmedBatchAdd} disabled={isUpdateWhitelistLoading}>
              {isUpdateWhitelistLoading ? 'Adding...' : 'Confirm Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
