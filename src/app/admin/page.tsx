import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { BotaoNovoVendedor, AcoesVendedor } from '@/components/admin-botoes'
import { connection } from 'next/server'
import { LayoutDashboard, Users, FileText, Settings, Wallet, LogOut } from 'lucide-react'

type FaturaAdmin = {
  id: string
  cliente_nome: string
  total: number
  created_at: string
  pago: boolean
  vendedores: { nome_loja: string } | null
}

function AdminSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-32"></div>)}
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-96"></div>
    </div>
  )
}

async function AdminData({ searchParams }: { searchParams: Promise<{ filtro?: string, ver?: string }> }) {
  await connection()

  // Correção: desestruturar 'ver' como 'visao' para coincidir com o resto do código
  const { filtro = 'hoje', ver: visao = 'dashboard' } = await searchParams

  const cookieStore = await cookies()
  if (cookieStore.get('admin_token')?.value !== 'logado') redirect('/login')

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const dataLimite = new Date()
  if (filtro === 'semana') dataLimite.setDate(dataLimite.getDate() - 7)
  if (filtro === 'mes') dataLimite.setMonth(dataLimite.getMonth() - 1)

  const { data: faturasFiltradas } = await supabaseAdmin
    .from('faturas')
    .select('*, vendedores(nome_loja)')
    .gte('created_at', dataLimite.toISOString())
    .order('created_at', { ascending: false })
  const { data: vendedores } = await supabaseAdmin
    .from('vendedores')
    .select('*')
    .order('created_at', { ascending: false })

  const totalFaturado = faturasFiltradas?.reduce((acc, f) => acc + Number(f.total), 0) || 0
  const totalVendedores = vendedores?.length || 0

  if (visao === 'faturas') {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Todas as Faturas</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white text-gray-400 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Loja</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(faturasFiltradas as FaturaAdmin[])?.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-500">{new Date(f.created_at).toLocaleDateString('pt-AO')}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{f.vendedores?.nome_loja || 'Desconhecida'}</td>
                  <td className="px-6 py-4 text-gray-600">{f.cliente_nome}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{Number(f.total).toLocaleString('pt-AO')} Kz</td>
                  <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${f.pago ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{f.pago ? 'Pago' : 'Pendente'}</span></td>
                </tr>
              ))}
              {!faturasFiltradas?.length && <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Nenhuma fatura emitida.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (visao === 'vendedores') {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Todos os Vendedores</h2>
          <BotaoNovoVendedor />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white text-gray-400 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Loja / Nome</th>
                <th className="px-6 py-4">Telefone</th>
                <th className="px-6 py-4">Saldo</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {vendedores?.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{v.nome_loja}</td>
                  <td className="px-6 py-4 text-gray-500">{v.telefone}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${v.saldo > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                      {v.saldo || 0} faturas
                    </span>
                  </td>
                  <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${v.status === 'ativo' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{v.status}</span></td>
                  <td className="px-6 py-4 text-right"><AcoesVendedor vendedor={v} /></td>
                </tr>
              ))}
              {!vendedores?.length && <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Nenhum vendedor registado.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (visao === 'definicoes') {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Definições do Sistema</h2>
        <p className="text-gray-500">Aqui podes configurar a taxa de faturação, dados de pagamento (Multicaixa), e a chave de API do Supabase.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-3xl shadow-lg text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Total Faturado</p>
              <h3 className="text-3xl font-bold mt-2">{totalFaturado.toLocaleString('pt-AO')} Kz</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-2xl"><Wallet size={24} /></div>
          </div>
          <p className="text-emerald-100 text-xs mt-4">Período: {filtro}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Faturas Emitidas</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{faturasFiltradas?.length || 0}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><FileText size={24} /></div>
          </div>
          <p className="text-gray-400 text-xs mt-4">Período: {filtro}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Vendedores</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{totalVendedores}</h3>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><Users size={24} /></div>
          </div>
          <p className="text-gray-400 text-xs mt-4">Registados na plataforma</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Taxas Recebidas</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">0 Kz</h3>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Wallet size={24} /></div>
          </div>
          <p className="text-gray-400 text-xs mt-4">Período: {filtro}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Últimas Faturas</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white text-gray-400 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Loja</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(faturasFiltradas as FaturaAdmin[])?.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-500">{new Date(f.created_at).toLocaleDateString('pt-AO')}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{f.vendedores?.nome_loja || 'Desconhecida'}</td>
                  <td className="px-6 py-4 text-gray-600">{f.cliente_nome}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{Number(f.total).toLocaleString('pt-AO')} Kz</td>
                  <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${f.pago ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{f.pago ? 'Pago' : 'Pendente'}</span></td>
                </tr>
              ))}
              {!faturasFiltradas?.length && <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Nenhuma fatura neste período.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Gestão Rápida de Vendedores</h2>
          <BotaoNovoVendedor />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white text-gray-400 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Loja / Nome</th>
                <th className="px-6 py-4">Telefone</th>
                <th className="px-6 py-4">Saldo</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {vendedores?.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{v.nome_loja}</td>
                  <td className="px-6 py-4 text-gray-500">{v.telefone}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${v.saldo > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                      {v.saldo || 0} faturas
                    </span>
                  </td>
                  <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${v.status === 'ativo' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{v.status}</span></td>
                  <td className="px-6 py-4 text-right"><AcoesVendedor vendedor={v} /></td>
                </tr>
              ))}
              {!vendedores?.length && <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Nenhum vendedor registado.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default function AdminDashboard({ 
  searchParams 
}: { 
  searchParams: Promise<{ filtro?: string, ver?: string }> 
}) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full z-20 shadow-sm">
        <div className="p-6 flex items-center gap-3 border-b border-gray-50">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">R</div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">RafaTura</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <a href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-gray-500 hover:bg-gray-50 hover:text-gray-900">
            <LayoutDashboard size={20} /> Dashboard
          </a>
          <a href="/admin?ver=vendedores" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-gray-500 hover:bg-gray-50 hover:text-gray-900">
            <Users size={20} /> Vendedores
          </a>
          <a href="/admin?ver=faturas" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-gray-500 hover:bg-gray-50 hover:text-gray-900">
            <FileText size={20} /> Faturas
          </a>
          <a href="/admin?ver=definicoes" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-gray-500 hover:bg-gray-50 hover:text-gray-900">
            <Settings size={20} /> Definições
          </a>
        </nav>

        <div className="p-4 border-t border-gray-50">
          <form action={async () => {
            'use server'
            const cookieStore = await cookies()
            cookieStore.delete('admin_token')
            redirect('/login')
          }}>
            <button type="submit" className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl font-medium transition-colors">
              <LogOut size={20} /> Terminar Sessão
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 capitalize">
              Painel de Administração
            </h1>
            <p className="text-gray-500 text-sm mt-1">Bem-vindo de volta, Rafael.</p>
          </div>
        </header>

        <Suspense fallback={<AdminSkeleton />}>
          <AdminData searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  )
}