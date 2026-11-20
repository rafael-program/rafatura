import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { connection } from 'next/server'
import SidebarVendedor from '@/components/sidebar-vendedor'

async function PainelLayoutContent({ children }: { children: React.ReactNode }) {
  await connection()
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
      <SidebarVendedor vendedor={vendedor} />
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 mt-16 lg:mt-0">
        {children}
      </main>
    </div>
  )
}

function LayoutSkeleton() {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <div className="w-64 bg-gray-100 animate-pulse h-screen fixed hidden lg:block" />
      <main className="flex-1 lg:ml-64 p-8">
        <div className="h-96 bg-white rounded-3xl animate-pulse" />
      </main>
    </div>
  )
}

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LayoutSkeleton />}>
      <PainelLayoutContent>{children}</PainelLayoutContent>
    </Suspense>
  )
}