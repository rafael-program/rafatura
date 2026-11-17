'use client'

import { useRouter } from 'next/navigation'

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
      className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors bg-gray-50 hover:bg-red-50 px-3 py-2 rounded-lg"
    >
      Sair
    </button>
  )
}