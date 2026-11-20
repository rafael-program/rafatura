// app/(painel)/apoio/page.tsx
import { Headphones, Phone, MessageCircle } from 'lucide-react'

export default function ApoioPage() {
  return (
    <div className="max-w-2xl mx-auto py-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Headphones className="text-emerald-600" size={32} />
          Apoio ao Cliente
        </h1>
        <p className="text-gray-500 mt-2">Precisa de ajuda? A nossa equipa está disponível.</p>
      </header>

      <div className="grid sm:grid-cols-2 gap-6">
        {/* Cartão de Telefone */}
        <a
          href="tel:+244957377424"
          className="group bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-200 transition-all text-center"
        >
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-50 transition-colors">
            <Phone className="text-gray-400 group-hover:text-emerald-600" size={28} />
          </div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Ligar</p>
          <p className="text-2xl font-bold text-gray-900">957 377 424</p>
        </a>

        {/* Cartão de WhatsApp */}
        <a
          href="https://wa.me/244957377424"
          target="_blank"
          rel="noreferrer"
          className="group bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 shadow-lg shadow-emerald-600/20 hover:scale-[1.02] transition-all text-center text-white"
        >
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-colors">
            <MessageCircle size={28} />
          </div>
          <p className="text-sm font-semibold text-emerald-100 uppercase tracking-wider mb-1">WhatsApp</p>
          <p className="text-2xl font-bold">Falar Connosco</p>
        </a>
      </div>

      <div className="mt-8 bg-blue-50 rounded-2xl p-6 text-blue-800 text-sm border border-blue-100">
        <p><strong>Horário de Atendimento:</strong> Segunda a Sábado, das 08h00 às 18h00.</p>
      </div>
    </div>
  )
}