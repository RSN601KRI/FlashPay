import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { useToast } from '@/hooks/use-toast';

export interface ChannelState {
  id: string;
  peerAddress: string;
  balance: string;
  status: 'opening' | 'active' | 'closing' | 'closed';
  lastUpdate: Date;
}

export const useWalletConnection = () => {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { toast } = useToast();
  
  const [channels, setChannels] = useState<ChannelState[]>([]);
  const [isInitializingSDK, setIsInitializingSDK] = useState(false);

  // Get wallet balance
  const { data: balance } = useBalance({
    address: address,
  });

  useEffect(() => {
    if (isConnected && address) {
      initializeYellowSDK();
    }
  }, [isConnected, address]);

  const initializeYellowSDK = async () => {
    if (!address) return;
    
    setIsInitializingSDK(true);
    try {
      // Initialize Yellow SDK here
      // const nitro = await YellowSDK.initialize({ address, chain });
      
      toast({
        title: "SDK Initialized",
        description: "Yellow SDK ready for state channel operations",
      });
    } catch (error) {
      console.error('SDK initialization error:', error);
      toast({
        title: "SDK Error",
        description: "Failed to initialize Yellow SDK",
        variant: "destructive",
      });
    } finally {
      setIsInitializingSDK(false);
    }
  };

  const connectWallet = async (connectorId?: string) => {
    try {
      const connector = connectorId 
        ? connectors.find(c => c.id === connectorId) 
        : connectors[0];
      
      if (!connector) {
        throw new Error('No connector available');
      }

      await connect({ connector });
      
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been successfully connected",
      });
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const disconnectWallet = async () => {
    try {
      await disconnect();
      setChannels([]);
      
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected",
      });
    } catch (error: any) {
      toast({
        title: "Disconnect Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openChannel = async (peerAddress: string, depositAmount: string) => {
    if (!address) return { error: new Error('Wallet not connected') };
    
    try {
      // Mock channel creation - replace with actual Yellow SDK call
      const channelId = `channel_${Date.now()}`;
      
      const newChannel: ChannelState = {
        id: channelId,
        peerAddress,
        balance: depositAmount,
        status: 'opening',
        lastUpdate: new Date(),
      };
      
      setChannels(prev => [...prev, newChannel]);
      
      // Simulate channel opening
      setTimeout(() => {
        setChannels(prev => 
          prev.map(ch => 
            ch.id === channelId 
              ? { ...ch, status: 'active' as const }
              : ch
          )
        );
      }, 2000);
      
      toast({
        title: "Channel Opening",
        description: "State channel is being created...",
      });
      
      return { error: null, channelId };
    } catch (error: any) {
      toast({
        title: "Channel Creation Failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const sendMicropayment = async (channelId: string, amount: string, recipient: string) => {
    try {
      // Mock micropayment - replace with actual Yellow SDK call
      setChannels(prev =>
        prev.map(ch =>
          ch.id === channelId
            ? { 
                ...ch, 
                balance: (parseFloat(ch.balance) - parseFloat(amount)).toString(),
                lastUpdate: new Date() 
              }
            : ch
        )
      );
      
      toast({
        title: "Payment Sent",
        description: `Sent ${amount} ETH via state channel`,
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const closeChannel = async (channelId: string) => {
    try {
      setChannels(prev =>
        prev.map(ch =>
          ch.id === channelId
            ? { ...ch, status: 'closing' as const }
            : ch
        )
      );
      
      // Simulate settlement
      setTimeout(() => {
        setChannels(prev =>
          prev.map(ch =>
            ch.id === channelId
              ? { ...ch, status: 'closed' as const }
              : ch
          )
        );
      }, 3000);
      
      toast({
        title: "Channel Closing",
        description: "Settling final state on-chain...",
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Channel Close Failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  return {
    // Wallet state
    address,
    isConnected,
    chain,
    balance,
    connectors,
    isPending,
    isInitializingSDK,
    
    // Channel state
    channels,
    
    // Actions
    connectWallet,
    disconnectWallet,
    openChannel,
    sendMicropayment,
    closeChannel,
  };
};