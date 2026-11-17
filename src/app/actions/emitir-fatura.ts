'use server'

import { createClient } from '@/lib/supabase/server'
import { randomUUID } from 'crypto'

type Item = { produto: string; qtd: number; precoUnit: number }

export async function emitirFatura(input: {
  clienteNome: string
  itens: Item[]
  pago: boolean
}): Promise<{ ok: true; faturaId: string } | { ok: false; erro: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, erro: 'Sessão expirada. Volte a entrar.' }

  // 1. Busca o perfil do vendedor
  const { data: vendedor } = await supabase
    .from('vendedores')
    .select('status, saldo')
    .eq('id', user.id)
    .single()

  if (!vendedor) return { ok: false, erro: 'Perfil não encontrado.' }
  if (vendedor.status === 'suspenso')
    return { ok: false, erro: 'Conta suspensa. Regularize a taxa.' }
  
  // 2. A TRAVA DO SALDO
  if (vendedor.saldo <= 0) {
    return { ok: false, erro: 'Saldo esgotado. Por favor, recarregue a sua conta na página Pagar Taxa.' }
  }

  const total = input.itens.reduce((s, i) => s + i.qtd * i.precoUnit, 0)
  const qr_token = randomUUID()

  // 3. Emite a fatura
  const { data, error } = await supabase
    .from('faturas')
    .insert({
      vendedor_id: user.id,
      cliente_nome: input.clienteNome,
      itens: input.itens,
      total,
      pago: input.pago,
      qr_token,
    })
    .select('id')
    .single()

  if (error || !data) return { ok: false, erro: 'Erro ao guardar fatura.' }

  // 4. Desconta 1 fatura do saldo
  await supabase
    .from('vendedores')
    .update({ saldo: vendedor.saldo - 1 })
    .eq('id', user.id)

  return { ok: true, faturaId: data.id }
}