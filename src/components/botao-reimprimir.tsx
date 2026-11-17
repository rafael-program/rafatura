'use client'

import { useState } from 'react'
import { Printer, Loader2 } from 'lucide-react'
import { imprimirFatura } from '@/lib/printer'
import PreviewFatura from './preview-fatura'

type FaturaReimpressao = {
  id: string
  cliente_nome: string
  itens: { produto: string; qtd: number; precoUnit: number }[]
  total: number
  qr_token: string
}

export default function BotaoReimprimir({ fatura, nomeLoja }: { fatura: FaturaReimpressao, nomeLoja: string }) {
  const [imprimindo, setImprimindo] = useState(false)
  const [erro, setErro] = useState('')
  const [previewAberto, setPreviewAberto] = useState(false)

  async function handleImprimir() {
    setImprimindo(true)
    setErro('')

    const res = await imprimirFatura({
      nomeLoja: nomeLoja,
      clienteNome: fatura.cliente_nome,
      itens: fatura.itens,
      total: Number(fatura.total),
      qrToken: fatura.qr_token
    })

    setImprimindo(false)
    setPreviewAberto(false) // Fecha o preview após imprimir

    if (!res.sucesso) {
      setErro(res.erro || 'Erro ao imprimir.')
    }
  }

  return (
    <div className="flex flex-col items-end">
      <button
        onClick={() => setPreviewAberto(true)}
        disabled={imprimindo}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
        title="Pré-visualizar e Imprimir 2ª Via"
      >
        {imprimindo ? <Loader2 className="animate-spin" size={16} /> : <Printer size={16} />}
        {imprimindo ? 'A imprimir...' : '2ª Via'}
      </button>
      
      {erro && <span className="text-xs text-red-500 mt-1 max-w-[150px] text-right">{erro}</span>}

      {/* O Modal de Preview */}
      <PreviewFatura
        isOpen={previewAberto}
        onClose={() => setPreviewAberto(false)}
        dados={{
          nomeLoja: nomeLoja,
          clienteNome: fatura.cliente_nome,
          itens: fatura.itens,
          total: Number(fatura.total),
          qrToken: fatura.qr_token
        }}
      />
    </div>
  )
}