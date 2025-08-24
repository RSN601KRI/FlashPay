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
    console.log('Yellow wallet connection request received');
    
    const { user_id } = await req.json();
    
    if (!user_id) {
      throw new Error('User ID is required');
    }

    const yellowApiKey = Deno.env.get('YELLOW_API_KEY');
    if (!yellowApiKey) {
      throw new Error('Yellow API key not configured');
    }

    console.log('Initiating Yellow wallet connection for user:', user_id);

    // Call Yellow API to initiate wallet connection
    const yellowResponse = await fetch('https://api.yellow.org/v1/wallet/connect', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${yellowApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user_id,
        redirect_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/yellow-wallet-callback`
      }),
    });

    if (!yellowResponse.ok) {
      const errorData = await yellowResponse.text();
      console.error('Yellow API error:', errorData);
      throw new Error(`Yellow API error: ${yellowResponse.status}`);
    }

    const yellowData = await yellowResponse.json();
    console.log('Yellow wallet connection successful:', yellowData);

    // Generate session token
    const sessionToken = crypto.randomUUID();
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Store session in database
    const { error: sessionError } = await supabaseClient
      .from('wallet_sessions')
      .insert({
        user_id: user_id,
        wallet_address: yellowData.wallet_address,
        session_token: sessionToken,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      });

    if (sessionError) {
      console.error('Session storage error:', sessionError);
      throw new Error('Failed to store wallet session');
    }

    console.log('Wallet session created successfully');

    return new Response(JSON.stringify({
      success: true,
      wallet_address: yellowData.wallet_address,
      session_token: sessionToken,
      connection_url: yellowData.connection_url,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in yellow-wallet-connect function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to connect Yellow wallet'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});