'use client'

import { useRef, useState, useEffect } from 'react'
import { X, Printer, FileDown, Download, MessageCircle, CheckCircle2 } from 'lucide-react'
import { imprimirFatura } from '@/lib/printer'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas-pro'
import QRCode from 'qrcode'

type Item = { produto: string; qtd: number; precoUnit: number }

export type FaturaPreview = {
  nomeLoja: string
  nif: string
  clienteNome: string
  clienteTelefone: string
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
  const faturaTermicaRef = useRef<HTMLDivElement>(null)
  const faturaPdfRef = useRef<HTMLDivElement>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [qrCodeImage, setQrCodeImage] = useState<string>('')

  useEffect(() => {
    if (dados?.qrToken) {
      QRCode.toDataURL(`https://rafatura.com/f/${dados.qrToken}`, {
        width: 150,
        margin: 1,
        color: { dark: '#000000', light: '#ffffff' },
      })
        .then(setQrCodeImage)
        .catch(console.error)
    }
  }, [dados?.qrToken])

  if (!isOpen || !dados) return null

  const handleImprimir = async () => {
    await imprimirFatura({
      nomeLoja: dados.nomeLoja,
      nif: dados.nif,
      clienteNome: dados.clienteNome,
      itens: dados.itens,
      total: dados.total,
      qrToken: dados.qrToken,
    })
    onClose()
  }

  const handleGerarPDF = async () => {
    if (!faturaPdfRef.current) return

    const canvas = await html2canvas(faturaPdfRef.current, { scale: 2 })
    const imgData = canvas.toDataURL('image/png')
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a5'
    })

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    
    const url = pdf.output('bloburl')
    setPdfUrl(url.toString())
    
    const link = document.createElement('a')
    link.href = url.toString()
    link.download = `fatura-${dados.clienteNome.replace(/\s/g, '_')}.pdf`
    link.click()
  }

  let whatsappUrl = ''
  if (dados.clienteTelefone) {
    const phone = dados.clienteTelefone.replace(/\D/g, '')
    const phoneFormatado = phone.startsWith('244') ? phone : `244${phone}`
    const mensagem = `Olá ${dados.clienteNome}, a sua fatura da ${dados.nomeLoja} está pronta! O total é de ${dados.total.toLocaleString('pt-AO')} Kz. Envio o PDF em anexo.`
    whatsappUrl = `https://wa.me/${phoneFormatado}?text=${encodeURIComponent(mensagem)}`
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      
      {/* ========================================== */}
      {/* LAYOUT ESCONDIDO PARA O PDF (FORMATO FORMAL/ANGOLANO) */}
      {/* ========================================== */}
      <div className="absolute top-0 left-0 -z-50 pointer-events-none opacity-0">
        <div ref={faturaPdfRef} className="w-[559px] bg-white text-black font-sans border border-gray-300" style={{ minHeight: '794px' }}>
          
          {/* Cabeçalho Formal */}
          <div className="text-center pt-8 px-8 pb-4 border-b border-black">
            {/* Logotipo simples (inicial da loja) */}
            <div className="w-12 h-12 mx-auto border-2 border-black rounded-full flex items-center justify-center font-bold text-xl mb-2">
              {dados.nomeLoja.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-lg font-bold uppercase tracking-wide">{dados.nomeLoja}</h1>
            <p className="text-[10px] mt-1">NIF: {dados.nif || 'Não definido'}</p>
            <p className="text-[10px]">Luanda, Angola</p>
            <p className="text-[10px]">Apoio: 957 377 424</p>
          </div>

          <div className="flex justify-between px-8 py-3 border-b border-black bg-gray-50">
            <div>
              <p className="text-[10px] font-bold uppercase">FATURA Nº</p>
              <p className="text-xs font-mono">{dados.qrToken.slice(0, 8).toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase">DATA DE EMISSÃO</p>
              <p className="text-xs">{new Date().toLocaleDateString('pt-AO')}</p>
            </div>
          </div>

          {/* Dados do Cliente */}
          <div className="px-8 py-4 border-b border-black">
            <h2 className="text-[10px] font-bold uppercase mb-2">DADOS DO CLIENTE</h2>
            <div className="border border-black p-2 text-xs">
              <p><span className="font-bold">Nome:</span> {dados.clienteNome}</p>
              {dados.clienteTelefone && <p className="mt-1"><span className="font-bold">Telefone:</span> {dados.clienteTelefone}</p>}
            </div>
          </div>

          {/* Tabela de Produtos Formal */}
          <div className="px-8 py-6">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-y border-black">
                  <th className="py-2 text-left font-bold border-r border-black px-2">DESCRIÇÃO</th>
                  <th className="py-2 text-center font-bold border-r border-black px-2 w-16">QTD</th>
                  <th className="py-2 text-right font-bold border-r border-black px-2 w-24">PREÇO</th>
                  <th className="py-2 text-right font-bold px-2 w-24">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {dados.itens.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-300">
                    <td className="py-2 text-left border-r border-black px-2">{item.produto}</td>
                    <td className="py-2 text-center border-r border-black px-2">{item.qtd}</td>
                    <td className="py-2 text-right border-r border-black px-2">{item.precoUnit.toLocaleString('pt-AO')}</td>
                    <td className="py-2 text-right px-2">{(item.qtd * item.precoUnit).toLocaleString('pt-AO')}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total */}
            <div className="flex justify-end mt-4">
              <div className="w-1/2 border border-black">
                <div className="flex justify-between border-b border-black px-2 py-1 text-xs">
                  <span className="font-bold">VALOR TOTAL</span>
                  <span className="font-bold">{dados.total.toLocaleString('pt-AO')} Kz</span>
                </div>
              </div>
            </div>

            {/* Observações e QR Code */}
            <div className="flex justify-between mt-8 items-end">
              <div>
                {qrCodeImage && (
                  <img src={qrCodeImage} alt="QR Code" className="w-16 h-16 border border-black p-1" />
                )}
                <p className="text-[8px] mt-1">Valide em rafatura.com</p>
              </div>
              <div className="text-right text-[9px]">
                <p>Processado por programa certificado</p>
                <p className="font-bold">Software RafaTura</p>
              </div>
            </div>
          </div>

          {/* Rodapé Formal */}
          {/* Rodapé Formal */}
<div className="absolute bottom-0 w-full border-t border-black px-8 py-2 flex justify-between text-[9px]">
  <span>Original</span>
  <span>
    {/* Ativa esta linha quando tiveres a certificação AGT */}
    {/* Processado por programa certificado n.º XXXXX/AGT */}
    Software RafaTura • Documento emitido eletronicamente
  </span>
  <span>Página 1 de 1</span>
</div>
        </div>
      </div>

      {/* ========================================== */}
      {/* MODAL VISÍVEL */}
      {/* ========================================== */}
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-900">{pdfUrl ? 'PDF Pronto' : 'Pré-visualização'}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-lg"><X size={20} /></button>
        </div>

        {pdfUrl ? (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-6 flex-1">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="text-emerald-600" size={40} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">PDF Gerado!</h4>
              <p className="text-sm text-gray-500">O ficheiro foi descarregado automaticamente.</p>
            </div>
            
            <div className="w-full space-y-3">
              <a 
                href={pdfUrl} 
                download={`fatura-${dados.clienteNome.replace(/\s/g, '_')}.pdf`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-black transition-colors"
              >
                <Download size={20} /> Descarregar Novamente
              </a>
              
              {dados.clienteTelefone ? (
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white font-medium rounded-xl hover:bg-[#20bd5a] transition-colors"
                >
                  <MessageCircle size={20} /> Enviar WhatsApp ao Cliente
                </a>
              ) : (
                <div className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 text-gray-400 font-medium rounded-xl cursor-not-allowed">
                  <MessageCircle size={20} /> Telefone não fornecido
                </div>
              )}
              
              <p className="text-xs text-gray-400 text-center mt-2">
                * Para enviar no WhatsApp, anexe o PDF que foi descarregado na conversa.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div ref={faturaTermicaRef} className="p-6 bg-white flex-1 overflow-y-auto font-mono text-sm text-black leading-tight">
               {/* ... (O mesmo talão térmico que já tinhas) ... */}
               <div className="text-center mb-4">
                <h2 className="font-bold text-lg uppercase">{dados.nomeLoja}</h2>
                <p className="text-xs">NIF: {dados.nif || 'N/A'}</p>
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

              <div className="mt-8 text-center border-t border-gray-200 pt-4">
                <p className="text-[10px] text-gray-400">Powered by</p>
                <p className="text-xs font-bold text-gray-600">RafaTura</p>
                <p className="text-[10px] text-gray-400 mt-1">Apoio: 957 377 424</p>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-2">
              <button onClick={handleGerarPDF} className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors">
                <FileDown size={18} /> PDF
              </button>
              <button onClick={handleImprimir} className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors">
                <Printer size={18} /> Imprimir
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}