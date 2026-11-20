'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { FileText, Wallet, Headphones, LogOut, History, Menu, X } from 'lucide-react'

type Vendedor = {
  nome_loja: string
  tipo: string
  status: string
}

export default function SidebarVendedor({ vendedor }: { vendedor: Vendedor }) {
  const [aberto, setAberto] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const links = [
    { href: '/emitir', label: 'Emitir Fatura', icon: FileText },
    { href: '/historico', label: 'Histórico', icon: History },
    { href: '/taxas', label: 'Pagar Taxa', icon: Wallet },
    { href: '/apoio', label: 'Apoio ao Cliente', icon: Headphones },
  ]

  return (
    <>
      {/* Botão Hambúrguer (Apenas Mobile) */}
      <button 
        onClick={() => setAberto(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
      >
        <Menu size={24} className="text-gray-700" />
      </button>

      {/* Overlay (Fundo escuro quando o menu está aberto no mobile) */}
      {aberto && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setAberto(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col shadow-sm
        transform transition-transform duration-300 ease-in-out
        ${aberto ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:shadow-none
      `}>
        {/* Botão Fechar (Apenas Mobile) */}
        <div className="lg:hidden absolute top-4 right-4">
          <button onClick={() => setAberto(false)} className="p-1 text-gray-500 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

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
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                onClick={() => setAberto(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  isActive 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                <Icon size={20} /> {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-50">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl font-medium transition-colors"
          >
            <LogOut size={20} /> Terminar Sessão
          </button>
        </div>
      </aside>
    </>
  )
}