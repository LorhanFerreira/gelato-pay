import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const mpToken = Deno.env.get('MP_ACCESS_TOKEN') || 'TEST-2875128759111086-081114-704917bbb2c3801f4712068bb5fd6c9a-352427368'
    
    // Pegando também o email vindo do seu frontend
    const { valor, descricao, email } = await req.json()

    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mpToken.trim()}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': crypto.randomUUID(),
      },
      body: JSON.stringify({
        transaction_amount: Number(valor),
        description: descricao || 'Pedido Sorveteria Delicia Gelada',
        payment_method_id: 'pix',
        payer: {
          // Usa o e-mail enviado pelo frontend, ou fallback de teste
          email: email || 'test_user_12345678@testuser.com',
          first_name: 'Cliente',
          last_name: 'Teste'
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Resposta do Mercado Pago com Erro:', data)
      return new Response(JSON.stringify({ error_mp: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: response.status,
      })
    }

    return new Response(
      JSON.stringify({
        qr_code: data.point_of_interaction?.transaction_data?.qr_code,
        qr_code_base64: data.point_of_interaction?.transaction_data?.qr_code_base64,
        status: data.status,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})