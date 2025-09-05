import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Send, 
  X, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowUpRight 
} from 'lucide-react';
import { useWalletConnection } from '@/hooks/useWalletConnection';

export const ChannelManager: React.FC = () => {
  const { 
    channels, 
    openChannel, 
    sendMicropayment, 
    closeChannel,
    isConnected 
  } = useWalletConnection();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [peerAddress, setPeerAddress] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  const handleCreateChannel = async () => {
    if (!peerAddress || !depositAmount) return;
    
    const result = await openChannel(peerAddress, depositAmount);
    if (!result.error) {
      setPeerAddress('');
      setDepositAmount('');
      setShowCreateForm(false);
    }
  };

  const handleSendPayment = async (channelId: string) => {
    if (!paymentAmount) return;
    
    const channel = channels.find(c => c.id === channelId);
    if (!channel) return;
    
    await sendMicropayment(channelId, paymentAmount, channel.peerAddress);
    setPaymentAmount('');
    setSelectedChannel(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'opening':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'closing':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'closed':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'opening':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closing':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>State Channels</CardTitle>
          <CardDescription>
            Connect your wallet to manage payment channels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Please connect your wallet to view and manage state channels
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          State Channels
          <Button 
            size="sm" 
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Channel
          </Button>
        </CardTitle>
        <CardDescription>
          Manage your Yellow SDK payment channels for instant transactions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {showCreateForm && (
          <Card className="border-dashed">
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="peer-address">Peer Address</Label>
                <Input
                  id="peer-address"
                  placeholder="0x..."
                  value={peerAddress}
                  onChange={(e) => setPeerAddress(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deposit-amount">Initial Deposit (ETH)</Label>
                <Input
                  id="deposit-amount"
                  type="number"
                  step="0.001"
                  placeholder="0.01"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateChannel} className="flex-1">
                  Open Channel
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {channels.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No channels created yet</p>
            <p className="text-sm">Create a channel to start making instant payments</p>
          </div>
        ) : (
          <div className="space-y-3">
            {channels.map((channel) => (
              <Card key={channel.id} className="relative">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(channel.status)}
                        <Badge className={getStatusColor(channel.status)}>
                          {channel.status}
                        </Badge>
                      </div>
                      
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Peer:</span>
                          <code className="text-xs">
                            {`${channel.peerAddress.slice(0, 6)}...${channel.peerAddress.slice(-4)}`}
                          </code>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Balance:</span>
                          <span className="font-mono">{channel.balance} ETH</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last Update:</span>
                          <span className="text-xs">{channel.lastUpdate.toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {channel.status === 'active' && (
                    <>
                      <Separator className="my-4" />
                      <div className="space-y-3">
                        {selectedChannel === channel.id ? (
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              step="0.001"
                              placeholder="Amount (ETH)"
                              value={paymentAmount}
                              onChange={(e) => setPaymentAmount(e.target.value)}
                              className="flex-1"
                            />
                            <Button 
                              size="sm"
                              onClick={() => handleSendPayment(channel.id)}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedChannel(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedChannel(channel.id)}
                              className="flex-1"
                            >
                              <ArrowUpRight className="h-4 w-4 mr-2" />
                              Send Payment
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => closeChannel(channel.id)}
                            >
                              Close Channel
                            </Button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};