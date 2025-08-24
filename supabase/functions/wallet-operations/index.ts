import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Wallet operation request received');
    
    const { operation, user_id, session_token, ...operationData } = await req.json();
    
    if (!operation || !user_id || !session_token) {
      throw new Error('Operation, user ID, and session token are required');
    }

    const yellowApiKey = Deno.env.get('YELLOW_API_KEY');
    if (!yellowApiKey) {
      throw new Error('Yellow API key not configured');
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Verifying session for user:', user_id);

    // Verify session is valid
    const { data: session, error: sessionError } = await supabaseClient
      .from('wallet_sessions')
      .select('*')
      .eq('user_id', user_id)
      .eq('session_token', session_token)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (sessionError || !session) {
      throw new Error('Invalid or expired session');
    }

    console.log('Session verified, executing operation:', operation);

    let result;

    switch (operation) {
      case 'get_balance':
        result = await getWalletBalance(session.wallet_address, yellowApiKey);
        break;
      
      case 'send_payment':
        const { recipient, amount, currency } = operationData;
        if (!recipient || !amount) {
          throw new Error('Recipient and amount are required for payment');
        }
        result = await sendPayment(session.wallet_address, recipient, amount, currency || 'USD', yellowApiKey);
        break;
      
      case 'get_transactions':
        const { limit = 10, offset = 0 } = operationData;
        result = await getTransactionHistory(session.wallet_address, limit, offset, yellowApiKey);
        break;
      
      case 'create_invoice':
        const { invoiceAmount, description } = operationData;
        if (!invoiceAmount) {
          throw new Error('Amount is required for creating invoice');
        }
        result = await createInvoice(session.wallet_address, invoiceAmount, description, yellowApiKey);
        break;
      
      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }

    console.log('Operation completed successfully:', operation);

    return new Response(JSON.stringify({
      success: true,
      operation,
      result,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in wallet-operations function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Wallet operation failed'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function getWalletBalance(walletAddress: string, apiKey: string) {
  const response = await fetch(`https://api.yellow.org/v1/wallet/${walletAddress}/balance`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get wallet balance: ${response.status}`);
  }

  return await response.json();
}

async function sendPayment(fromWallet: string, recipient: string, amount: number, currency: string, apiKey: string) {
  const response = await fetch('https://api.yellow.org/v1/payments/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from_wallet: fromWallet,
      to_wallet: recipient,
      amount: amount,
      currency: currency,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send payment: ${response.status}`);
  }

  return await response.json();
}

async function getTransactionHistory(walletAddress: string, limit: number, offset: number, apiKey: string) {
  const response = await fetch(`https://api.yellow.org/v1/wallet/${walletAddress}/transactions?limit=${limit}&offset=${offset}`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get transaction history: ${response.status}`);
  }

  return await response.json();
}

async function createInvoice(walletAddress: string, amount: number, description: string, apiKey: string) {
  const response = await fetch('https://api.yellow.org/v1/invoices/create', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      wallet_address: walletAddress,
      amount: amount,
      description: description || 'FlashPay Invoice',
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create invoice: ${response.status}`);
  }

  return await response.json();
}