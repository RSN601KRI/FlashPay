import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, DollarSign, History, Receipt, Settings, LogOut } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const WalletDashboard = () => {
  const { user, signOut, profile } = useAuth();
  const { walletAddresses, activeSession, disconnectWallet, setPrimaryWallet } = useWallet();
  const { toast } = useToast();
  const [balance, setBalance] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeSession) {
      fetchWalletData();
    }
  }, [activeSession]);

  const fetchWalletData = async () => {
    if (!user || !activeSession) return;

    setLoading(true);
    try {
      // Fetch wallet balance
      const { data: balanceData, error: balanceError } = await supabase.functions.invoke('wallet-operations', {
        body: {
          operation: 'get_balance',
          user_id: user.id,
          session_token: activeSession.session_token,
        }
      });

      if (balanceError) throw balanceError;
      setBalance(balanceData.result);

      // Fetch transaction history
      const { data: txData, error: txError } = await supabase.functions.invoke('wallet-operations', {
        body: {
          operation: 'get_transactions',
          user_id: user.id,
          session_token: activeSession.session_token,
          limit: 5,
        }
      });

      if (txError) throw txError;
      setTransactions(txData.result.transactions || []);

    } catch (error: any) {
      console.error('Error fetching wallet data:', error);
      toast({
        title: "Error",
        description: "Failed to load wallet data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async (walletId: string) => {
    await disconnectWallet(walletId);
  };

  const handleSetPrimary = async (walletId: string) => {
    await setPrimaryWallet(walletId);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Please sign in to view your wallet dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Wallet Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.display_name || user.email}
          </p>
        </div>
        <Button variant="outline" onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>

      {/* Wallet Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {balance ? `$${balance.total_usd?.toFixed(2) || '0.00'}` : 'Loading...'}
            </div>
            <p className="text-xs text-muted-foreground">
              {balance?.currencies?.length || 0} currencies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Wallets</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{walletAddresses.length}</div>
            <p className="text-xs text-muted-foreground">
              {walletAddresses.filter(w => w.is_active).length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-xs text-muted-foreground">
              Last 5 transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Connected Wallets */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Wallets</CardTitle>
          <CardDescription>
            Manage your connected wallet addresses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {walletAddresses.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No wallets connected yet.
            </p>
          ) : (
            walletAddresses.map((wallet) => (
              <div key={wallet.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Wallet className="h-5 w-5 text-primary" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {wallet.wallet_address.slice(0, 6)}...{wallet.wallet_address.slice(-4)}
                      </span>
                      {wallet.is_primary && (
                        <Badge variant="default">Primary</Badge>
                      )}
                      <Badge variant={wallet.wallet_type === 'yellow' ? 'default' : 'secondary'}>
                        {wallet.wallet_type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Connected on {new Date(wallet.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!wallet.is_primary && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetPrimary(wallet.id)}
                    >
                      Set Primary
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDisconnect(wallet.id)}
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      {transactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Your latest transaction history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((tx, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Receipt className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {tx.type === 'send' ? 'Sent' : 'Received'} {tx.amount} {tx.currency}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(tx.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={tx.status === 'completed' ? 'default' : 'secondary'}>
                    {tx.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WalletDashboard;