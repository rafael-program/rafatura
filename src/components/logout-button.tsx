'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function AdminLogout() {
  const router = useRouter()
  
  async function handleLogout() {
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.push('/login')
    router.refresh()
  }
  
  return (
    <button 
      onClick={handleLogout}
      className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl font-medium transition-colors"
    >
      <LogOut size={20} /> Terminar Sessão
    </button>
  )
}