'use client'

import { useState } from 'react'
import { alternarStatusVendedor, criarVendedor } from '@/app/actions/admin-acoes'

// Botão de Gerir (Ativar/Gelar)
export function BotaoStatus({ id, statusAtual }: { id: string, statusAtual: string }) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    await alternarStatusVendedor(id, statusAtual)
    setLoading(false)
  }

  return (
    <button 
      onClick={handleClick} 
      disabled={loading}
      className="text-sm font-medium text-gray-500 hover:text-red-600 disabled:opacity-50"
    >
      {loading ? 'A processar...' : statusAtual === 'ativo' ? 'Gelar Conta' : 'Ativar Conta'}
    </button>
  )
}

// Botão de Novo Vendedor (Formulário Modal simples)
export function BotaoNovoVendedor() {
  const [aberto, setAberto] = useState(false)
  const [erro, setErro] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const result = await criarVendedor(formData)
    
    if (result.error) {
      setErro(result.error)
    } else {
      setAberto(false)
      setErro('')
    }
  }

  if (!aberto) {
    return (
      <button onClick={() => setAberto(true)} className="text-sm bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg font-medium hover:bg-emerald-100 transition">
        + Novo Vendedor
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h3 className="text-lg font-bold mb-4">Novo Vendedor</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="nome_loja" placeholder="Nome da Loja" required className="w-full border p-2 rounded-lg" />
          <input name="telefone" placeholder="Telefone (ex: +244...)" required className="w-full border p-2 rounded-lg" />
          <select name="tipo" className="w-full border p-2 rounded-lg">
            <option value="loja">Loja</option>
            <option value="vendedor">Vendedor Ambulante</option>
            <option value="pambalairo">Pambalairo</option>
          </select>
          
          {erro && <p className="text-sm text-red-600">{erro}</p>}
          
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={() => setAberto(false)} className="px-4 py-2 text-gray-500">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Criar</button>
          </div>
        </form>
      </div>
    </div>
  )
}