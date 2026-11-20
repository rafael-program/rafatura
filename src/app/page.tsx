// app/page.tsx
import Link from 'next/link';
import { ArrowRight, FileText, ShieldCheck, Printer } from 'lucide-react';

async function getCurrentYear() {
  'use cache';
  return new Date().getFullYear();
}

export default async function Home() {
  const year = await getCurrentYear();

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <header className="w-full max-w-5xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">R</div>
          <span className="text-lg font-bold text-gray-900 tracking-tight">RafaTura</span>
        </div>
        <Link href="/login" className="text-sm font-semibold text-gray-500 hover:text-emerald-600 transition-colors">
          Entrar
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-3xl mx-auto pb-20">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
          Fature de forma <br />
          <span className="text-emerald-600">simples e rápida.</span>
        </h1>

        <p className="text-lg text-gray-500 mb-10 max-w-xl">
          A ferramenta essencial para vendedores e lojas em Angola. Emita faturas profissionais e imprima no local, sem complicações.
        </p>

        <Link href="/login" className="group flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-semibold text-lg px-8 py-3.5 rounded-full transition-all w-full sm:w-auto">
          Iniciar Sessão
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-24 w-full">
          <div className="flex flex-col items-center">
            <FileText className="text-gray-400 mb-3" size={24} />
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Emissão Rápida</h3>
            <p className="text-xs text-gray-500">Faturas geradas em segundos.</p>
          </div>
          <div className="flex flex-col items-center">
            <ShieldCheck className="text-gray-400 mb-3" size={24} />
            <h3 className="text-sm font-semibold text-gray-900 mb-1">100% Legal</h3>
            <p className="text-xs text-gray-500">Com NIF e validação por QR.</p>
          </div>
          <div className="flex flex-col items-center">
            <Printer className="text-gray-400 mb-3" size={24} />
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Impressão Fácil</h3>
            <p className="text-xs text-gray-500">Conecta via Bluetooth.</p>
          </div>
        </div>
      </main>

      <footer className="w-full text-center py-8 text-xs text-gray-400">
        © {year} RafaTura.
      </footer>
    </div>
  );
}