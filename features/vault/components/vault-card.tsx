'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DepositForm } from './deposit-form'
import { WithdrawForm } from './withdraw-form'

export function VaultCard() {
  return (
    <Card className="flex flex-col max-h-[350px]">
      <CardHeader>
        <CardTitle>Vault</CardTitle>
        <CardDescription>Deposit funds or withdraw from the vault</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <Tabs defaultValue="deposit" className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          </TabsList>
          <div className="flex-1">
            <TabsContent value="deposit" className="h-full mt-0">
              <DepositForm />
            </TabsContent>
            <TabsContent value="withdraw" className="h-full mt-0">
              <WithdrawForm />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}
