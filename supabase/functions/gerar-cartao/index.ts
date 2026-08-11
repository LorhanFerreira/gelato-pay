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
    const { itens, email } = await req.json()
    const mpToken = Deno.env.get('MP_ACCESS_TOKEN')

    // Cria a preferência de pagamento no Mercado Pago
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mpToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: itens.map((item: any) => ({
          title: item.nome,
          quantity: item.quantidade || 1,
          unit_price: Number(item.preco),
          currency_id: 'BRL',
        })),
        payer: { email: email || 'cliente@email.com' },
        back_urls: {
          success: 'https://gelato-pay.vercel.app',
          failure: 'https://gelato-pay.vercel.app',
          pending: 'https://gelato-pay.vercel.app',
        },
        auto_return: 'approved',
      }),
    })

    const data = await response.json()

    return new Response(
      JSON.stringify({ init_point: data.init_point }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})