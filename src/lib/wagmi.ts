import { createConfig, http } from 'wagmi'
import { mainnet, sepolia, polygon, arbitrum } from 'wagmi/chains'
import { metaMask, walletConnect, injected } from 'wagmi/connectors'

// Configure supported chains
export const chains = [mainnet, sepolia, polygon, arbitrum] as const

// Configure connectors
const connectors = [
  metaMask(),
  walletConnect({
    projectId: 'your-project-id', // You'll need to get this from WalletConnect
  }),
  injected(),
]

// Create wagmi config
export const wagmiConfig = createConfig({
  chains,
  connectors,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
  },
})