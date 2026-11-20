'use client'

import { useState } from 'react'
import { Printer } from 'lucide-react'
import PreviewFatura from './preview-fatura'

type FaturaReimpressao = {
  id: string
  cliente_nome: string
  cliente_telefone?: string
  itens: { produto: string; qtd: number; precoUnit: number }[]
  total: number
  qr_token: string
}

export default function BotaoReimprimir({ 
  fatura, 
  nomeLoja, 
  nif 
}: { 
  fatura: FaturaReimpressao, 
  nomeLoja: string, 
  nif: string 
}) {
  const [previewAberto, setPreviewAberto] = useState(false)

  return (
    <div className="flex justify-end">
      <button
        onClick={() => setPreviewAberto(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-200 transition-colors"
        title="Pré-visualizar e Imprimir 2ª Via"
      >
        <Printer size={16} /> 2ª Via
      </button>

      {previewAberto && (
        <PreviewFatura
          isOpen={previewAberto}
          onClose={() => setPreviewAberto(false)}
          dados={{
            nomeLoja: nomeLoja,
            nif: nif || 'N/A',
            clienteNome: fatura.cliente_nome,
            clienteTelefone: fatura.cliente_telefone || '',
            itens: fatura.itens,
            total: Number(fatura.total),
            qrToken: fatura.qr_token
          }}
        />
      )}
    </div>
  )
}