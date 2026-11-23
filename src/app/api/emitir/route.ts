// src/app/api/emitir/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { vendedor_id, cliente_nome, cliente_telefone, itens, total, pago, qr_token } = body

    if (!vendedor_id) {
      return NextResponse.json({ error: 'Vendedor não identificado' }, { status: 400 })
    }

    // 1. Verificar saldo
    const { data: vendedor } = await supabaseAdmin
      .from('vendedores')
      .select('saldo, status')
      .eq('id', vendedor_id)
      .single()

    if (!vendedor) {
      return NextResponse.json({ error: 'Vendedor não encontrado' }, { status: 404 })
    }

    if (vendedor.status === 'suspenso') {
      return NextResponse.json({ error: 'Conta suspensa' }, { status: 403 })
    }

    if (vendedor.saldo <= 0) {
      return NextResponse.json({ error: 'Saldo esgotado' }, { status: 400 })
    }

    // 2. Inserir fatura
    const { data: fatura, error: faturaError } = await supabaseAdmin
      .from('faturas')
      .insert({
        vendedor_id,
        cliente_nome,
        cliente_telefone: cliente_telefone || null,
        itens,
        total,
        pago,
        qr_token,
      })
      .select()
      .single()

    if (faturaError) {
      return NextResponse.json({ error: faturaError.message }, { status: 500 })
    }

    // 3. Descontar saldo
    await supabaseAdmin
      .from('vendedores')
      .update({ saldo: vendedor.saldo - 1 })
      .eq('id', vendedor_id)

    return NextResponse.json({ success: true, fatura })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}