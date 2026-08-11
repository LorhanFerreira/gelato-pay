import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const body = await req.json().catch(() => ({}))

    // O Mercado Pago envia o ID do pagamento no query param ou no body
    const paymentId = url.searchParams.get('data.id') || body.data?.id || body.id

    if (!paymentId) {
      return new Response(JSON.stringify({ message: "Sem ID de pagamento" }), { status: 200, headers: corsHeaders })
    }

    // Consulta o status atual do pagamento na API do Mercado Pago
    const mpToken = Deno.env.get('MP_ACCESS_TOKEN')
    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${mpToken}`,
      },
    })

    const paymentData = await mpResponse.json()

    console.log(`Status do pagamento ${paymentId}:`, paymentData.status)

    // Se o pagamento for aprovado
    if (paymentData.status === 'approved') {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      // Registre ou atualize a venda na sua tabela do Supabase se necessário
    }

    return new Response(JSON.stringify({ status: "recebido" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("Erro no Webhook:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})