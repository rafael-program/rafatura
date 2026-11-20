'use client'

import { useState } from 'react'
import { emitirFatura } from '@/app/actions/emitir-fatura'
import { Plus, Trash2, Printer, FileText, CheckCircle2 } from 'lucide-react'
import PreviewFatura, { FaturaPreview } from './preview-fatura'

type Item = { produto: string; qtd: number; precoUnit: number }

export default function EmitirForm({ nomeLoja, nif }: { nomeLoja: string, nif: string }) {
  const [cliente, setCliente] = useState('')
  const [pago, setPago] = useState(true)
  const [itens, setItens] = useState<Item[]>([{ produto: '', qtd: 1, precoUnit: 0 }])
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const [faturaGerada, setFaturaGerada] = useState<string | null>(null)
  const [previewAberto, setPreviewAberto] = useState(false)
  const [dadosParaPreview, setDadosParaPreview] = useState<FaturaPreview | null>(null)

  const total = itens.reduce((s, i) => s + i.qtd * i.precoUnit, 0)

  function atualizarItem(idx: number, campo: keyof Item, valor: string | number) {
    setItens((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, [campo]: valor } : it))
    )
  }

  function adicionarItem() {
    setItens((prev) => [...prev, { produto: '', qtd: 1, precoUnit: 0 }])
  }

  function removerItem(idx: number) {
    setItens((prev) => prev.filter((_, i) => i !== idx))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')

    const itensValidos = itens.filter((i) => i.produto.trim() && i.qtd > 0 && i.precoUnit >= 0)
    if (!cliente.trim() || itensValidos.length === 0) {
      setErro('Preencha o nome do cliente e pelo menos um produto.')
      return
    }

    setLoading(true)
    const result = await emitirFatura({
      clienteNome: cliente.trim(),
      itens: itensValidos,
      pago,
    })
    setLoading(false)

    if (!result.ok) {
      setErro(result.erro)
      return
    }

    setDadosParaPreview({
      nomeLoja: nomeLoja,
      nif: nif,
      clienteNome: cliente.trim(),
      itens: itensValidos,
      total: total,
      qrToken: result.faturaId,
    })

    setFaturaGerada(result.faturaId)
  }

  function resetForm() {
    setFaturaGerada(null)
    setCliente('')
    setItens([{ produto: '', qtd: 1, precoUnit: 0 }])
    setDadosParaPreview(null)
  }

  if (faturaGerada) {
    return (
      <>
        <div className="text-center py-8">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-emerald-600" size={48} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Fatura Gerada!</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            A fatura foi registada no sistema. Pode agora pré-visualizar, gerar PDF ou imprimir.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={resetForm}
              className="px-6 py-3.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Criar Outra Fatura
            </button>
            <button 
              onClick={() => setPreviewAberto(true)}
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all"
            >
              <Printer size={20} /> Ver Fatura
            </button>
          </div>
        </div>

        <PreviewFatura 
          isOpen={previewAberto} 
          onClose={() => setPreviewAberto(false)} 
          dados={dadosParaPreview} 
        />
      </>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ... (O resto do formulário mantém-se exatamente igual) ... */}
      
      {/* Dados do Cliente */}
      <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
        <label className="block text-sm font-bold text-gray-800 mb-3">Nome do Cliente</label>
        <input
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
          placeholder="Ex: João Manuel"
          required
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm"
        />
      </div>

      {/* Lista de Produtos */}
      <div className="space-y-4">
        <div className="flex justify-between items-end mb-2">
          <label className="block text-sm font-bold text-gray-800">Produtos / Serviços</label>
        </div>
        
        {itens.map((item, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row gap-3 items-start bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative group">
            <div className="flex-1 w-full">
              <label className="block text-xs text-gray-500 mb-1 sm:hidden">Produto</label>
              <input
                value={item.produto}
                onChange={(e) => atualizarItem(idx, 'produto', e.target.value)}
                placeholder="Nome do produto"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="w-20">
                <label className="block text-xs text-gray-500 mb-1 sm:hidden">Qtd</label>
                <input
                  type="number"
                  min={1}
                  value={item.qtd}
                  onChange={(e) => atualizarItem(idx, 'qtd', Number(e.target.value))}
                  placeholder="1"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-center"
                />
              </div>
              <div className="w-28">
                <label className="block text-xs text-gray-500 mb-1 sm:hidden">Preço</label>
                <input
                  type="number"
                  min={0}
                  value={item.precoUnit}
                  onChange={(e) => atualizarItem(idx, 'precoUnit', Number(e.target.value))}
                  placeholder="0"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-right"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removerItem(idx)}
                  disabled={itens.length === 1}
                  className="p-2.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg disabled:opacity-30 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        <button
          type="button"
          onClick={adicionarItem}
          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-emerald-200 text-emerald-700 font-semibold rounded-2xl hover:bg-emerald-50 transition-colors"
        >
          <Plus size={18} /> Adicionar Produto
        </button>
      </div>

      <hr className="border-gray-100" />

      {/* Status e Total */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-xl w-full sm:w-auto">
          <input
            type="checkbox"
            checked={pago}
            onChange={(e) => setPago(e.target.checked)}
            className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300"
          />
          <span className="text-sm font-medium text-gray-700">Cliente já pagou</span>
        </label>

        <div className="bg-gray-900 rounded-2xl px-6 py-4 w-full sm:w-auto min-w-[250px] shadow-lg">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total a Pagar</p>
          <div className="text-3xl font-bold text-emerald-400 font-mono tracking-tight flex items-baseline gap-1">
            {total.toLocaleString('pt-AO')} <span className="text-lg text-gray-500">Kz</span>
          </div>
        </div>
      </div>

      {erro && <p className="text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 text-center font-medium">{erro}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-lg font-bold rounded-2xl py-4 transition-all shadow-lg shadow-emerald-600/30"
      >
        {loading ? 'A processar fatura...' : 'Gerar Fatura'}
      </button>
    </form>
  )
}