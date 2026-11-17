import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center space-y-6">
        
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-emerald-600">RafaTura</h1>
          <p className="text-gray-500 text-sm">
            A plataforma de faturas para vendedores em Angola.
          </p>
        </div>

        <div className="pt-4">
          <Link 
            href="/login" 
            className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg py-3 transition"
          >
            Iniciar Sessão
          </Link>
        </div>

        <p className="text-xs text-gray-400 pt-4 border-t border-gray-100">
          Se és vendedor, usa o teu número de telefone. Se és administrador, usa o teu email.
        </p>
      </div>
    </main>
  )
}