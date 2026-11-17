import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { FileText, Wallet, Headphones, LogOut, History } from 'lucide-react'
import { connection } from 'next/server'

export default async function PainelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await connection() // Silencia o aviso do Date.now() no Next.js 16

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: vendedor } = await supabase
    .from('vendedores')
    .select('nome_loja, tipo, status')
    .eq('id', user.id)
    .single()

  if (!vendedor) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center text-gray-700 bg-gray-50">
        Perfil ainda não configurado. Contacte o administrador.
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar Elegante do Vendedor */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full z-20 shadow-sm">
        <div className="p-6 border-b border-gray-50">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">R</div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">RafaTura</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mt-4">{vendedor.nome_loja}</h2>
          <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider mt-1">{vendedor.tipo}</p>
          {vendedor.status === 'suspenso' && (
            <span className="inline-block mt-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-md font-semibold">
              Conta Suspensa
            </span>
          )}
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/emitir" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
            <FileText size={20} /> Emitir Fatura
          </Link>
          <Link href="/historico" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
            <History size={20} /> Histórico
          </Link>
          <Link href="/taxas" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
            <Wallet size={20} /> Pagar Taxa
          </Link>
          <Link href="/apoio" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
            <Headphones size={20} /> Apoio ao Cliente
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-50">
          <form action={async () => {
            'use server'
            const supabase = await createClient()
            await supabase.auth.signOut()
            redirect('/login')
          }}>
            <button type="submit" className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl font-medium transition-colors">
              <LogOut size={20} /> Terminar Sessão
            </button>
          </form>
        </div>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  )
}