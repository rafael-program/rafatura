'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function alternarStatusVendedor(id: string, statusAtual: string) {
  const novoStatus = statusAtual === 'ativo' ? 'suspenso' : 'ativo'
  await supabaseAdmin.from('vendedores').update({ status: novoStatus }).eq('id', id)
  revalidatePath('/admin')
}

export async function excluirVendedor(id: string) {
  await supabaseAdmin.auth.admin.deleteUser(id)
  await supabaseAdmin.from('vendedores').delete().eq('id', id)
  revalidatePath('/admin')
}

export async function editarVendedor(formData: FormData) {
  const id = formData.get('id') as string
  const nome_loja = formData.get('nome_loja') as string
  const telefone = formData.get('telefone') as string
  const nif = formData.get('nif') as string
  const tipo = formData.get('tipo') as string

  await supabaseAdmin.from('vendedores').update({ nome_loja, telefone, nif, tipo }).eq('id', id)
  revalidatePath('/admin')
  return { sucesso: true }
}

export async function criarVendedor(formData: FormData) {
  const nome_loja = formData.get('nome_loja') as string
  const telefone = formData.get('telefone') as string
  const nif = formData.get('nif') as string
  const senha = formData.get('senha') as string
  const tipo = formData.get('tipo') as string

  const phoneFormatted = telefone.startsWith('+') ? telefone : `+244${telefone.replace(/\D/g, '')}`
  const emailFantasma = `${phoneFormatted}@rafatura.com`

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: emailFantasma,
    password: senha,
    email_confirm: true, 
  })

  if (authError) return { error: `Erro no login: ${authError.message}` }

  const { error: dbError } = await supabaseAdmin.from('vendedores').insert({
    id: authData.user.id,
    nome_loja,
    telefone,
    nif,
    tipo,
    status: 'ativo',
    saldo: 15
  })

  if (dbError) {
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
    return { error: `Erro na base de dados: ${dbError.message}` }
  }
  
  revalidatePath('/admin')
  return { sucesso: true }
}

export async function adicionarSaldoVendedor(id: string, quantidade: number) {
  const { data: vendedor } = await supabaseAdmin
    .from('vendedores')
    .select('saldo')
    .eq('id', id)
    .single()

  const saldoAtual = vendedor?.saldo || 0
  const novoSaldo = saldoAtual + quantidade

  await supabaseAdmin
    .from('vendedores')
    .update({ saldo: novoSaldo })
    .eq('id', id)

  revalidatePath('/admin')
}