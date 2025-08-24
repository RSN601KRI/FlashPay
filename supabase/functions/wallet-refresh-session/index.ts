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
    console.log('Wallet session refresh request received');
    
    const { user_id, session_token } = await req.json();
    
    if (!user_id || !session_token) {
      throw new Error('User ID and session token are required');
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Verifying existing session for user:', user_id);

    // Verify existing session
    const { data: existingSession, error: sessionError } = await supabaseClient
      .from('wallet_sessions')
      .select('*')
      .eq('user_id', user_id)
      .eq('session_token', session_token)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (sessionError || !existingSession) {
      throw new Error('Invalid or expired session');
    }

    console.log('Session verified, extending expiry');

    // Extend session expiry by 24 hours
    const newExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    const { error: updateError } = await supabaseClient
      .from('wallet_sessions')
      .update({ expires_at: newExpiry.toISOString() })
      .eq('id', existingSession.id);

    if (updateError) {
      console.error('Session update error:', updateError);
      throw new Error('Failed to refresh session');
    }

    console.log('Session refreshed successfully');

    return new Response(JSON.stringify({
      success: true,
      expires_at: newExpiry.toISOString(),
      wallet_address: existingSession.wallet_address,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in wallet-refresh-session function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to refresh wallet session'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});