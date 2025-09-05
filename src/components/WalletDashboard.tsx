import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { WalletConnector } from './WalletConnector';
import { ChannelManager } from './ChannelManager';
import { 
  LogOut, 
  Wallet, 
  TrendingUp, 
  History,
  Zap,
  Activity
} from 'lucide-react';

export const WalletDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const { 
    address,
    isConnected, 
    balance,
    channels,
    chain
  } = useWalletConnection();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Please Sign In</CardTitle>
            <CardDescription>You need to be signed in to access the wallet dashboard</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">FlashPay Wallet Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">Welcome back, {user.email}</span>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isConnected && balance ? (
                  `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}`
                ) : (
                  'Not Connected'
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {isConnected ? `${chain?.name || 'Unknown'} Network` : 'Connect wallet to view balance'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Channels</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {channels.filter(ch => ch.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground">
                {channels.length} total channels
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Network Status</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-lg font-semibold">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {isConnected && address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'No wallet connected'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Wallet Connection */}
          <WalletConnector />
          
          {/* Channel Manager */}
          <ChannelManager />
        </div>

        <Separator className="my-8" />

        {/* Yellow SDK Integration Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Yellow SDK Integration
            </CardTitle>
            <CardDescription>
              Instant micropayments via state channels on Ethereum
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Features:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Gasless off-chain transactions</li>
                  <li>• Instant payment confirmations</li>
                  <li>• Multi-party state channels</li>
                  <li>• Secure wallet-signed updates</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">How it works:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>1. Connect EVM wallet (MetaMask)</li>
                  <li>2. Open state channel with deposit</li>
                  <li>3. Send instant micropayments</li>
                  <li>4. Close channel to settle on-chain</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default WalletDashboard;