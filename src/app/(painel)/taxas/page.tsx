import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { Wallet, AlertCircle, CheckCircle2, Zap, MessageCircle } from 'lucide-react'

async function TaxasContent() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: vendedor } = await supabase
    .from('vendedores')
    .select('saldo, nome_loja')
    .eq('id', user!.id)
    .single()

  const saldo = vendedor?.saldo || 0
  const nomeLoja = vendedor?.nome_loja || 'Vendedor'

  const whatsappUrl = `https://wa.me/244957377424?text=${encodeURIComponent(
    `Olá RafaTura, sou a loja ${nomeLoja}. Acabei de efetuar o pagamento da taxa. Segue o comprovativo:`
  )}`

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Wallet className="text-emerald-600" size={32} />
          Saldo e Taxas
        </h1>
        <p className="text-gray-500 mt-2">Gira o seu saldo para continuar a emitir faturas.</p>
      </header>

      <div className={`rounded-3xl p-8 mb-8 text-white shadow-lg ${saldo > 0 ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : 'bg-gradient-to-br from-red-500 to-rose-600'}`}>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white/80 font-medium">Saldo Disponível</p>
            <h2 className="text-5xl font-bold mt-2 flex items-baseline gap-2">
              {saldo} <span className="text-2xl text-white/80">faturas</span>
            </h2>
          </div>
          {saldo > 0 ? <CheckCircle2 size={48} className="text-white/40" /> : <AlertCircle size={48} className="text-white/40" />}
        </div>
        <p className="mt-6 text-sm text-white/80">
          {saldo > 0 ? 'Pode continuar a emitir faturas normalmente.' : 'O seu saldo esgotou. Recarregue para voltar a emitir.'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <h3 className="font-bold text-gray-900 mb-4">Comprar Saldo</h3>

          <div className="space-y-4 flex-1">
            <div className="p-5 border-2 border-emerald-500 bg-emerald-50 rounded-xl cursor-pointer relative">
              <span className="absolute -top-3 left-4 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <Zap size={12} /> Recomendado
              </span>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-900 text-lg">5 Faturas</p>
                  <p className="text-sm text-gray-500">Para o dia a dia</p>
                </div>
                <span className="font-bold text-emerald-600 text-xl">2.000 Kz</span>
              </div>
            </div>

            <div className="p-5 border border-gray-200 rounded-xl hover:border-emerald-500 cursor-pointer transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-900 text-lg">15 Faturas</p>
                  <p className="text-sm text-gray-500">Poupa mais</p>
                </div>
                <span className="font-bold text-gray-900 text-xl">5.500 Kz</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-6 text-center">Cada fatura emitida custa 400 Kz.</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <h3 className="font-bold text-gray-900 mb-4">Como Pagar</h3>

          <div className="space-y-3 bg-gray-50 p-5 rounded-xl mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Via Express</span>
              <span className="font-bold text-gray-900">926 572 603</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Entidade</span>
              <span className="font-bold text-gray-900">00525</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Referência</span>
              <span className="font-bold text-gray-900">957 377 424</span>
            </div>
          </div>

          <div className="mt-auto">
            <p className="text-xs text-gray-500 mb-3 text-center">
              Após efetuar o pagamento, clique no botão abaixo para enviar o comprovativo.
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              <MessageCircle size={20} /> Enviar Comprovativo
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function TaxasSkeleton() {
  return (
    <div className="max-w-3xl mx-auto animate-pulse space-y-6">
      <div className="h-10 bg-gray-200 rounded w-1/2" />
      <div className="h-40 bg-gray-200 rounded-3xl" />
      <div className="grid md:grid-cols-2 gap-6">
        <div className="h-64 bg-gray-200 rounded-3xl" />
        <div className="h-64 bg-gray-200 rounded-3xl" />
      </div>
    </div>
  )
}

export default function TaxasPage() {
  return (
    <Suspense fallback={<TaxasSkeleton />}>
      <TaxasContent />
    </Suspense>
  )
}