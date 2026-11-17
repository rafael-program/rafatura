'use client'

import { useState } from 'react'
import { criarVendedor, excluirVendedor, editarVendedor, alternarStatusVendedor, adicionarSaldoVendedor } from '@/app/actions/admin-acoes'
import { Pencil, Trash2, Plus, Lock, Unlock, Wallet } from 'lucide-react'

type Vendedor = {
  id: string
  nome_loja: string
  telefone: string
  tipo: string
  status: string
  saldo: number
}

export function AcoesVendedor({ vendedor }: { vendedor: Vendedor }) {
  const [editAberto, setEditAberto] = useState(false)
  const [saldoAberto, setSaldoAberto] = useState(false)
  const [loadingStatus, setLoadingStatus] = useState(false)
  const [loadingSaldo, setLoadingSaldo] = useState(false)
  const [quantidadeSaldo, setQuantidadeSaldo] = useState(15)

  async function handleStatus() {
    setLoadingStatus(true)
    await alternarStatusVendedor(vendedor.id, vendedor.status)
    setLoadingStatus(false)
  }

  async function handleAdicionarSaldo(e: React.FormEvent) {
    e.preventDefault()
    setLoadingSaldo(true)
    await adicionarSaldoVendedor(vendedor.id, quantidadeSaldo)
    setLoadingSaldo(false)
    setSaldoAberto(false)
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {/* Botão de Saldo */}
      <button 
        onClick={() => setSaldoAberto(true)} 
        className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors" 
        title="Adicionar Saldo"
      >
        <Wallet size={18} />
      </button>

      {/* Botão de Gelar / Ativar */}
      <button 
        onClick={handleStatus} 
        disabled={loadingStatus}
        className={`p-2 rounded-xl transition-colors ${vendedor.status === 'ativo' ? 'text-amber-600 bg-amber-50 hover:bg-amber-100' : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'}`}
        title={vendedor.status === 'ativo' ? 'Gelar Conta' : 'Ativar Conta'}
      >
        {vendedor.status === 'ativo' ? <Lock size={18} /> : <Unlock size={18} />}
      </button>

      {/* Botão de Editar */}
      <button onClick={() => setEditAberto(true)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors" title="Editar">
        <Pencil size={18} />
      </button>
      
      {/* Botão de Excluir */}
      <form action={async () => { if(confirm('Tens a certeza que queres excluir este vendedor?')) await excluirVendedor(vendedor.id) }}>
        <button type="submit" className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors" title="Excluir">
          <Trash2 size={18} />
        </button>
      </form>

      {/* MODAL DE EDITAR */}
      {editAberto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-6 text-gray-900">Editar Vendedor</h3>
            <form action={async (formData) => { await editarVendedor(formData); setEditAberto(false) }} className="space-y-4 text-left">
              <input type="hidden" name="id" value={vendedor.id} />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Loja</label>
                <input name="nome_loja" defaultValue={vendedor.nome_loja} required className="w-full border border-gray-300 p-3 rounded-xl text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input name="telefone" defaultValue={vendedor.telefone} required className="w-full border border-gray-300 p-3 rounded-xl text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select name="tipo" defaultValue={vendedor.tipo} className="w-full border border-gray-300 p-3 rounded-xl text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
                  <option value="loja">Loja</option>
                  <option value="vendedor">Vendedor Ambulante</option>
                  <option value="pambalairo">Pambalairo</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setEditAberto(false)} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors">Cancelar</button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 shadow-md transition-all">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE ADICIONAR SALDO */}
      {saldoAberto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-left">
            <h3 className="text-xl font-bold mb-2 text-gray-900">Adicionar Saldo</h3>
            <p className="text-sm text-gray-500 mb-6">Adicionar faturas para <strong>{vendedor.nome_loja}</strong>.</p>
            
            <form onSubmit={handleAdicionarSaldo} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade de Faturas</label>
                <input 
                  type="number" 
                  min={1}
                  value={quantidadeSaldo} 
                  onChange={(e) => setQuantidadeSaldo(Number(e.target.value))}
                  required 
                  className="w-full border border-gray-300 p-3 rounded-xl text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none text-center text-2xl font-bold" 
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setSaldoAberto(false)} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors">Cancelar</button>
                <button type="submit" disabled={loadingSaldo} className="px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 shadow-md transition-all disabled:opacity-50">
                  {loadingSaldo ? 'A adicionar...' : 'Confirmar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

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
      <button onClick={() => setAberto(true)} className="flex items-center gap-2 text-sm bg-gray-900 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-all shadow-md">
        <Plus size={18} /> Novo Vendedor
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl text-left">
        <h3 className="text-xl font-bold mb-6 text-gray-900">Novo Vendedor</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Loja</label>
            <input name="nome_loja" placeholder="Ex: Loja do João" required className="w-full border border-gray-300 p-3 rounded-xl text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input name="telefone" placeholder="Ex: +244926572603" required className="w-full border border-gray-300 p-3 rounded-xl text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha de Acesso</label>
            <input name="senha" type="password" placeholder="Crie uma senha" required className="w-full border border-gray-300 p-3 rounded-xl text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select name="tipo" className="w-full border border-gray-300 p-3 rounded-xl text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
              <option value="loja">Loja</option>
              <option value="vendedor">Vendedor Ambulante</option>
              <option value="pambalairo">Pambalairo</option>
            </select>
          </div>
          
          {erro && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">{erro}</p>}
          
          <div className="flex justify-end gap-3 mt-8">
            <button type="button" onClick={() => setAberto(false)} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors">Cancelar</button>
            <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 shadow-md transition-all">Criar Vendedor</button>
          </div>
        </form>
      </div>
    </div>
  )
}