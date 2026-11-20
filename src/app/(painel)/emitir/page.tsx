import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import EmitirForm from '@/components/emitir-form'
import { FileText, AlertCircle, Wallet } from 'lucide-react'
import Link from 'next/link'

async function EmitirContent() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: vendedor } = await supabase
    .from('vendedores')
    .select('nome_loja, status, saldo, nif')
    .eq('id', user!.id)
    .single()

  if (vendedor?.status === 'suspenso') {
    return (
      <div className="max-w-2xl mx-auto mt-10 bg-red-50 border border-red-200 text-red-700 rounded-3xl p-8 text-center shadow-sm">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🚫</span>
        </div>
        <h2 className="font-bold text-2xl mb-2">Conta Suspensa</h2>
        <p className="text-red-600">
          Regularize a taxa pendente na página <strong>Pagar Taxa</strong> para voltar a emitir faturas.
        </p>
      </div>
    )
  }

  const saldo = vendedor?.saldo || 0
  if (saldo <= 0) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 sm:p-10 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <AlertCircle className="text-amber-500" size={48} />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-3">Sem saldo disponível</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
            O seu saldo de faturas esgotou. Por favor, pague uma taxa para ter saldo e emitir faturas sem complicações.
          </p>

          <Link
            href="/taxas"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 transition-all transform hover:-translate-y-1"
          >
            <Wallet size={20} /> Pagar Taxa
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 sm:px-0">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="text-emerald-600" size={28} /> 
            Ponto de Venda
          </h1>
          <p className="text-gray-500 mt-2 text-base sm:text-lg">
            Olá, <span className="font-semibold text-gray-800">{vendedor?.nome_loja}</span>. Tens <strong>{saldo}</strong> faturas disponíveis.
          </p>
        </div>
        <div className="hidden sm:flex w-16 h-16 bg-emerald-100 rounded-2xl items-center justify-center shrink-0">
           <FileText className="text-emerald-600" size={32} />
        </div>
      </header>

      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-4 sm:p-10">
        <EmitirForm nomeLoja={vendedor?.nome_loja || 'Loja'} nif={vendedor?.nif || ''} />
      </div>
    </div>
  )
}

function EmitirSkeleton() {
  return (
    <div className="max-w-3xl mx-auto py-6 px-4 sm:px-0 animate-pulse space-y-6">
      <div className="h-10 bg-gray-200 rounded w-1/2" />
      <div className="h-96 bg-gray-200 rounded-3xl" />
    </div>
  )
}

export default function EmitirPage() {
  return (
    <Suspense fallback={<EmitirSkeleton />}>
      <EmitirContent />
    </Suspense>
  )
}