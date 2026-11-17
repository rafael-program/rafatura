'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  
  // Estado para guardar o que o utilizador escreveu
  const [identificador, setIdentificador] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setLoading(true)

    // Verificamos se o utilizador escreveu um email ou um telefone
    const isEmail = identificador.includes('@')

    let authResponse

    if (isEmail) {
      // LOGIN DO ADMIN (Email)
      authResponse = await supabase.auth.signInWithPassword({
        email: identificador,
        password: senha,
      })
    } else {
      // LOGIN DO VENDEDOR (Telefone)
      // Limpamos o número e garantimos o prefixo +244
      const phone = identificador.startsWith('+') 
        ? identificador 
        : `+244${identificador.replace(/\D/g, '')}`

      authResponse = await supabase.auth.signInWithPassword({
        phone,
        password: senha,
      })
    }

    setLoading(false)

    if (authResponse.error) {
      setErro('Credenciais inválidas. Verifique os dados.')
      return
    }

    // Se entrou com sucesso, redirecionamos para o sítio certo
    if (isEmail) {
      router.push('/admin')
    } else {
      router.push('/emitir')
    }
    router.refresh()
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white rounded-2xl shadow p-6 space-y-4"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">RafaTura</h1>
          <p className="text-sm text-gray-500 mt-1">
            Entre com o seu telefone (vendedor) ou email (admin)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telefone ou Email
          </label>
          <input
            type="text"
            placeholder="Ex: 926572603 ou admin@email.com"
            value={identificador}
            onChange={(e) => setIdentificador(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Senha
          </label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium rounded-lg py-2.5 transition"
        >
          {loading ? 'A entrar...' : 'Entrar'}
        </button>
      </form>
    </main>
  )
}