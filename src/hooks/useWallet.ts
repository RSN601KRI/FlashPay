import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';

interface WalletAddress {
  id: string;
  user_id: string;
  wallet_type: 'yellow' | 'external';
  wallet_address: string;
  is_primary: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface WalletSession {
  id: string;
  user_id: string;
  wallet_address: string;
  session_token: string;
  expires_at: string;
  created_at: string;
}

export const useWallet = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [walletAddresses, setWalletAddresses] = useState<WalletAddress[]>([]);
  const [activeSession, setActiveSession] = useState<WalletSession | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWalletAddresses();
      fetchActiveSession();
    } else {
      setWalletAddresses([]);
      setActiveSession(null);
    }
  }, [user]);

  const fetchWalletAddresses = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('wallet_addresses')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('is_primary', { ascending: false });

      if (error) throw error;
      setWalletAddresses((data || []) as WalletAddress[]);
    } catch (error) {
      console.error('Error fetching wallet addresses:', error);
    }
  };

  const fetchActiveSession = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('wallet_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setActiveSession(data);
    } catch (error) {
      console.error('Error fetching active session:', error);
    }
  };

  const connectYellowWallet = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to connect your Yellow wallet.",
        variant: "destructive",
      });
      return { error: new Error('No user logged in') };
    }

    setLoading(true);
    try {
      // Call edge function to connect Yellow wallet
      const { data, error } = await supabase.functions.invoke('yellow-wallet-connect', {
        body: { user_id: user.id }
      });

      if (error) throw error;

      // Add wallet address to database
      const { error: dbError } = await supabase
        .from('wallet_addresses')
        .insert({
          user_id: user.id,
          wallet_type: 'yellow',
          wallet_address: data.wallet_address,
          is_primary: walletAddresses.length === 0, // First wallet is primary
        });

      if (dbError) throw dbError;

      // Create wallet session
      const sessionExpiry = new Date();
      sessionExpiry.setHours(sessionExpiry.getHours() + 24); // 24 hour session

      const { error: sessionError } = await supabase
        .from('wallet_sessions')
        .insert({
          user_id: user.id,
          wallet_address: data.wallet_address,
          session_token: data.session_token,
          expires_at: sessionExpiry.toISOString(),
        });

      if (sessionError) throw sessionError;

      await fetchWalletAddresses();
      await fetchActiveSession();

      toast({
        title: "Wallet connected",
        description: "Your Yellow wallet has been successfully connected.",
      });

      return { error: null, data };
    } catch (error: any) {
      console.error('Error connecting Yellow wallet:', error);
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect Yellow wallet.",
        variant: "destructive",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = async (walletId: string) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      // Deactivate wallet address
      const { error } = await supabase
        .from('wallet_addresses')
        .update({ is_active: false })
        .eq('id', walletId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Remove associated sessions
      const wallet = walletAddresses.find(w => w.id === walletId);
      if (wallet) {
        await supabase
          .from('wallet_sessions')
          .delete()
          .eq('wallet_address', wallet.wallet_address)
          .eq('user_id', user.id);
      }

      await fetchWalletAddresses();
      await fetchActiveSession();

      toast({
        title: "Wallet disconnected",
        description: "The wallet has been successfully disconnected.",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Disconnect failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const setPrimaryWallet = async (walletId: string) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      // Remove primary from all wallets
      await supabase
        .from('wallet_addresses')
        .update({ is_primary: false })
        .eq('user_id', user.id);

      // Set new primary
      const { error } = await supabase
        .from('wallet_addresses')
        .update({ is_primary: true })
        .eq('id', walletId)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchWalletAddresses();

      toast({
        title: "Primary wallet updated",
        description: "Your primary wallet has been updated.",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const refreshSession = async () => {
    if (!user || !activeSession) return;

    try {
      const { data, error } = await supabase.functions.invoke('wallet-refresh-session', {
        body: { 
          user_id: user.id,
          session_token: activeSession.session_token 
        }
      });

      if (error) throw error;

      // Update session expiry
      const newExpiry = new Date();
      newExpiry.setHours(newExpiry.getHours() + 24);

      await supabase
        .from('wallet_sessions')
        .update({ expires_at: newExpiry.toISOString() })
        .eq('id', activeSession.id);

      await fetchActiveSession();
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  };

  return {
    walletAddresses,
    activeSession,
    loading,
    connectYellowWallet,
    disconnectWallet,
    setPrimaryWallet,
    refreshSession,
  };
};