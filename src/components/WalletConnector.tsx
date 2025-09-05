import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, ExternalLink, Zap } from 'lucide-react';
import { useWalletConnection } from '@/hooks/useWalletConnection';

export const WalletConnector: React.FC = () => {
  const { 
    address, 
    isConnected, 
    chain, 
    balance,
    connectors, 
    isPending, 
    isInitializingSDK,
    connectWallet, 
    disconnectWallet 
  } = useWalletConnection();

  if (isConnected && address) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connected Wallet
          </CardTitle>
          <CardDescription>
            Your Web3 wallet is connected and ready for Yellow SDK operations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Address:</span>
            <code className="text-sm bg-muted px-2 py-1 rounded">
              {`${address.slice(0, 6)}...${address.slice(-4)}`}
            </code>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Network:</span>
            <Badge variant="outline">
              {chain?.name || 'Unknown'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Balance:</span>
            <span className="text-sm font-mono">
              {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : 'Loading...'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">SDK Status:</span>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isInitializingSDK ? 'bg-yellow-500' : 'bg-green-500'}`} />
              <span className="text-sm">
                {isInitializingSDK ? 'Initializing...' : 'Ready'}
              </span>
            </div>
          </div>
          
          <div className="pt-4 flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={disconnectWallet}
              className="flex-1"
            >
              Disconnect
            </Button>
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => window.open(`https://etherscan.io/address/${address}`, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View on Explorer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Connect Your Wallet
        </CardTitle>
        <CardDescription>
          Connect your EVM wallet to start using Yellow SDK for instant micropayments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {connectors.map((connector) => (
          <Button
            key={connector.id}
            variant="outline"
            className="w-full justify-start"
            onClick={() => connectWallet(connector.id)}
            disabled={isPending}
          >
            <Wallet className="h-4 w-4 mr-2" />
            {connector.name}
            {isPending && <span className="ml-auto">Connecting...</span>}
          </Button>
        ))}
        
        <div className="pt-4 space-y-2 text-sm text-muted-foreground">
          <p><strong>Supported Features:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Instant micropayments via state channels</li>
            <li>Gasless off-chain transactions</li>
            <li>Secure wallet-signed updates</li>
            <li>Multi-chain support</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};