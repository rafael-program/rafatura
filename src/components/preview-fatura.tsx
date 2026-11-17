'use client'

import { X, Printer } from 'lucide-react'
import { imprimirFatura } from '@/lib/printer'

type Item = { produto: string; qtd: number; precoUnit: number }

export type FaturaPreview = {
  nomeLoja: string
  clienteNome: string
  itens: Item[]
  total: number
  qrToken: string
}

export default function PreviewFatura({
  isOpen,
  onClose,
  dados,
}: {
  isOpen: boolean
  onClose: () => void
  dados: FaturaPreview | null
}) {
  if (!isOpen || !dados) return null

  const handleImprimir = async () => {
    await imprimirFatura({
      nomeLoja: dados.nomeLoja,
      clienteNome: dados.clienteNome,
      itens: dados.itens,
      total: dados.total,
      qrToken: dados.qrToken,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-900">Pré-visualização</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-lg"><X size={20} /></button>
        </div>

        {/* O "Papel" Térmico */}
        <div className="p-6 bg-white flex-1 overflow-y-auto font-mono text-sm text-black leading-tight">
          <div className="text-center mb-4">
            <h2 className="font-bold text-lg uppercase">{dados.nomeLoja}</h2>
            <p className="text-xs">Fatura de Venda</p>
          </div>
          
          <div className="border-t border-dashed border-gray-400 my-2"></div>
          
          <p><strong>Cliente:</strong> {dados.clienteNome}</p>
          <p className="text-xs"><strong>Data:</strong> {new Date().toLocaleString('pt-AO')}</p>
          
          <div className="border-t border-dashed border-gray-400 my-2"></div>
          
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left">
                <th className="pb-1">Produto</th>
                <th className="pb-1 text-center">Qtd</th>
                <th className="pb-1 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {dados.itens.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.produto}</td>
                  <td className="text-center">{item.qtd}</td>
                  <td className="text-right">{(item.qtd * item.precoUnit).toLocaleString('pt-AO')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t border-dashed border-gray-400 my-2"></div>
          
          <div className="flex justify-between font-bold text-base mt-2">
            <span>TOTAL</span>
            <span>{dados.total.toLocaleString('pt-AO')} Kz</span>
          </div>

          <div className="text-center mt-6">
            <p className="text-xs mb-2">Valide a sua fatura em:</p>
            <p className="text-[10px]">rafatura.com/f/{dados.qrToken.slice(0, 8)}...</p>
            <p className="text-[10px] mt-4">Obrigado pela preferência!</p>
          </div>

          {/* O CRÉDITO DA PLATAFORMA */}
          <div className="mt-8 text-center border-t border-gray-200 pt-4">
            <p className="text-[10px] text-gray-400">Powered by</p>
            <p className="text-xs font-bold text-gray-600">RafaTura</p>
            <p className="text-[10px] text-gray-400 mt-1">Apoio: 957 377 424</p>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-200 transition-colors">
            Cancelar
          </button>
          <button onClick={handleImprimir} className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors">
            <Printer size={18} /> Imprimir
          </button>
        </div>
      </div>
    </div>
  )
}