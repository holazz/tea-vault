# Tea Vault

A decentralized vault application built on the Tea Sepolia that allows users to deposit funds and control who can withdraw them through a whitelist system.

![Tea Vault](/public/screenshot.png)

## Features

- **Deposit Funds**: Securely deposit TEA tokens into the vault
- **Withdraw Funds**: Withdraw available funds that others have deposited for you
- **Whitelist Management**: Control who can withdraw your deposited funds
  - Add individual addresses to your whitelist
  - Batch add multiple addresses with confirmation
  - Remove addresses from your whitelist
  - Your own address is always protected and cannot be removed
- **Depositor Tracking**: View users who have added you to their whitelist

## Technology Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Blockchain Interaction**: Wagmi, Viem
- **Wallet Connection**: Reown AppKit
- **Network**: Tea Sepolia

## License

[MIT](./LICENSE) License © 2025 [zz](https://github.com/holazz)
