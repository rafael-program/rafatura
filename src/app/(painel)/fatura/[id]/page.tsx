import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { CheckCircle2, ShieldCheck } from 'lucide-react'

type FaturaComVendedor = {
  id: string
  cliente_nome: string
  total: number
  qr_token: string
  created_at: string
  vendedores: { nome_loja: string } | null
}

async function FaturaContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('faturas')
    .select('*, vendedores(nome_loja)')
    .eq('id', id)
    .single()

  const fatura = data as FaturaComVendedor | null
  if (!fatura) notFound()

  return (
    <div className="max-w-lg mx-auto py-10">
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 overflow-hidden">
        <div className="bg-emerald-50 px-8 pt-10 pb-8 text-center border-b border-emerald-100">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="text-emerald-600" size={40} />
          </div>
          <h1 className="text-2xl font-bold text-emerald-900">Fatura Válida</h1>
          <p className="text-emerald-700 mt-1">Documento verificado com sucesso</p>
        </div>

        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Emitido por</p>
              <p className="text-lg font-bold text-gray-900">{fatura.vendedores?.nome_loja || 'Loja'}</p>
            </div>
            <ShieldCheck className="text-emerald-500" size={32} />
          </div>

          <div className="space-y-4 mb-8 bg-gray-50 p-5 rounded-2xl">
            <div className="flex justify-between">
              <span className="text-gray-500">Cliente</span>
              <span className="font-semibold text-gray-900">{fatura.cliente_nome}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Data</span>
              <span className="font-medium text-gray-900">{new Date(fatura.created_at).toLocaleString('pt-AO')}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-gray-500 font-medium">Total Pago</span>
              <span className="text-2xl font-bold text-emerald-600">
                {Number(fatura.total).toLocaleString('pt-AO')} Kz
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">Código de Autenticidade</p>
            <code className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-mono">
              {fatura.qr_token}
            </code>
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-gray-400 mt-6">
        Fatura emitida eletronicamente via <strong>RafaTura</strong>.
      </p>
    </div>
  )
}

function FaturaSkeleton() {
  return (
    <div className="max-w-lg mx-auto py-10 animate-pulse">
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
        <div className="bg-emerald-50 h-40" />
        <div className="p-8 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/2" />
          <div className="h-32 bg-gray-200 rounded-2xl" />
          <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto" />
        </div>
      </div>
    </div>
  )
}

export default function FaturaPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<FaturaSkeleton />}>
      <FaturaContent params={params} />
    </Suspense>
  )
}