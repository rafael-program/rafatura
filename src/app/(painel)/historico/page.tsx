// app/(painel)/historico/page.tsx
import { Suspense } from 'react'
import { History, FileText } from 'lucide-react'
import BotaoReimprimir from '@/components/botao-reimprimir'
import { createClient } from '@/lib/supabase/server'

async function TabelaHistorico() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: faturas }, { data: vendedor }] = await Promise.all([
    supabase
      .from('faturas')
      .select('*')
      .eq('vendedor_id', user!.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('vendedores')
      .select('nome_loja, nif')
      .eq('id', user!.id)
      .single()
  ])

  return (
    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap min-w-[600px]">
          <thead className="bg-gray-50/50 text-gray-400 font-medium border-b border-gray-100">
            <tr>
              <th className="px-6 py-5">Data</th>
              <th className="px-6 py-5">Cliente</th>
              <th className="px-6 py-5">Total</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {faturas?.map((f) => (
              <tr key={f.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-5 text-gray-500">
                  {new Date(f.created_at).toLocaleString('pt-AO')}
                </td>
                <td className="px-6 py-5 font-medium text-gray-900">
                  {f.cliente_nome}
                </td>
                <td className="px-6 py-5 font-semibold text-gray-900">
                  {Number(f.total).toLocaleString('pt-AO')} Kz
                </td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${f.pago ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {f.pago ? 'Pago' : 'Pendente'}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <BotaoReimprimir fatura={f} nomeLoja={vendedor?.nome_loja || 'RafaTura'} nif={vendedor?.nif || ''} />
                </td>
              </tr>
            ))}
            {!faturas?.length && (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="text-gray-400" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Nenhuma fatura</h3>
                  <p className="text-gray-500">As faturas que emitires aparecerão aqui.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function HistoricoPage() {
  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-0">
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
          <History className="text-emerald-600" size={28} />
          Histórico de Faturas
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-2">Todas as faturas que já emitiste na plataforma.</p>
      </header>

      <Suspense fallback={<TabelaSkeleton />}>
        <TabelaHistorico />
      </Suspense>
    </div>
  )
}

function TabelaSkeleton() {
  return (
    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-16 bg-gray-50 border-b border-gray-100" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-20 border-b border-gray-50 px-6 flex items-center gap-4">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
        </div>
      ))}
    </div>
  )
}