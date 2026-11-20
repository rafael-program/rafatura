'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Phone, Mail, Lock, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()
  const [identificador, setIdentificador] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const whatsappAdmin = `https://wa.me/244957377424?text=${encodeURIComponent(
    'Olá, preciso de ajuda para acessar a minha conta na RafaTura.'
  )}`

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setLoading(true)

    let emailParaLogin = identificador
    const isEmail = identificador.includes('@')

    if (!isEmail) {
      const phoneFormatted = identificador.startsWith('+')
        ? identificador
        : `+244${identificador.replace(/\D/g, '')}`
      emailParaLogin = `${phoneFormatted}@rafatura.com`
    }

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: emailParaLogin,
      password: senha,
    })

    if (error) {
      setErro('Credenciais inválidas. Verifique os dados e tente novamente.')
      setLoading(false)
      return
    }

    if (!isEmail) {
      const { data: vendedor } = await supabase
        .from('vendedores')
        .select('status')
        .eq('id', authData.user.id)
        .single()

      if (vendedor?.status === 'suspenso') {
        await supabase.auth.signOut()
        setErro('A sua conta está suspensa. Por favor, regularize a taxa de faturação.')
        setLoading(false)
        return
      }
    }

    setLoading(false)
    if (isEmail) {
      document.cookie = 'admin_token=logado; path=/; max-age=604800'
      router.push('/admin')
    } else {
      router.push('/emitir')
    }
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Lado Esquerdo: Branding e Animação */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-emerald-900 via-emerald-700 to-teal-800 relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl font-bold border border-white/30">
              R
            </div>
            <span className="text-2xl font-bold tracking-wider">RafaTura</span>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            Fature com <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-teal-100">
              profissionalismo.
            </span>
          </h1>
          <p className="text-emerald-100 text-lg">
            A plataforma definitiva para vendedores e lojas em Angola emitirem faturas sem complicações.
          </p>
        </div>

        <div className="relative z-10 text-sm text-emerald-200/60 flex items-center gap-2">
          <span>© 2026 RafaTura. Todos os direitos reservados.</span>
        </div>
      </div>

      {/* Lado Direito: Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-8 left-8 lg:hidden flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">R</div>
          <span className="text-xl font-bold text-gray-900">RafaTura</span>
        </div>

        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900">Bem-vindo de volta</h2>
            <p className="text-gray-500 mt-2">Insira as suas credenciais para aceder à conta.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 mt-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Telefone ou Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  {identificador.includes('@') ? <Mail size={20} /> : <Phone size={20} />}
                </div>
                <input
                  type="text"
                  value={identificador}
                  onChange={(e) => setIdentificador(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-700">Senha</label>
                <a href="#" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                  Esqueceu a senha?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {erro && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                <div className="w-5 h-5 text-red-500 mt-0.5">⚠️</div>
                <p className="text-sm text-red-600 font-medium">{erro}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl py-4 transition-all shadow-lg shadow-emerald-600/30 group"
            >
              {loading ? (
                'A autenticar...'
              ) : (
                <>
                  Entrar na Plataforma
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Ainda não tem conta? <br className="sm:hidden" />
            <a
              href={whatsappAdmin}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Contacte o administrador
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}