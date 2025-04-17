import { DepositorList } from '@/features/vault/components/depositor-list'
import { VaultCard } from '@/features/vault/components/vault-card'
import { WhitelistManager } from '@/features/vault/components/whitelist-manager'
import { Toaster } from '@/components/ui/sonner'

export default function Home() {
  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <VaultCard />
          <DepositorList />
        </div>
        <WhitelistManager />
      </div>
      <Toaster richColors />
    </div>
  )
}
