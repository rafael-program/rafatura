/// <reference types="web-bluetooth" />

import ReceiptPrinterEncoder from '@point-of-sale/receipt-printer-encoder'

type FaturaData = {
  nomeLoja: string
  nif: string
  clienteNome: string
  itens: { produto: string; qtd: number; precoUnit: number }[]
  total: number
  qrToken: string
}

export async function imprimirFatura(dados: FaturaData) {
  try {
    if (!navigator.bluetooth) {
      return { sucesso: false, erro: 'O seu navegador não suporta Bluetooth. Use o Chrome no Android.' }
    }

    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: ['000018f0-0000-1000-8000-00805f9b34fb'] }],
      optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb'],
    })

    const server = await device.gatt?.connect()
    const service = await server?.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb')
    const characteristic = await service?.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb')

    const encoder = new ReceiptPrinterEncoder({ language: 'esc-pos' })

    encoder
      .initialize()
      .align('center')
      .bold(true)
      .size(2, 2)
      .text(dados.nomeLoja)
      .size(1, 1)
      .text(`NIF: ${dados.nif || 'N/A'}`)
      .text('Fatura de Venda')
      .bold(false)
      .newline()
      .rule({ style: 'double' })
      .align('left')
      .text(`Cliente: ${dados.clienteNome}`)
      .text(`Data: ${new Date().toLocaleString('pt-AO')}`)
      .rule()
      .text('Produtos:')
      .newline()

    dados.itens.forEach((item) => {
      const subtotal = item.qtd * item.precoUnit
      encoder
        .text(`${item.produto} (${item.qtd}x)`)
        .align('right')
        .text(`${subtotal.toLocaleString('pt-AO')} Kz`)
        .align('left')
    })

    encoder
      .rule({ style: 'double' })
      .bold(true)
      .align('right')
      .text(`TOTAL: ${dados.total.toLocaleString('pt-AO')} Kz`)
      .bold(false)
      .align('center')
      .newline()
      .qrcode(`https://rafatura.com/f/${dados.qrToken}`)
      .newline()
      .text('Obrigado pela preferência!')
      .newline(1)
      .rule({ style: 'single' })
      .text('Powered by RafaTura')
      .text('Apoio: 957 377 424')
      .newline(2)
      .cut()

    const buffer = encoder.encode()

    for (let i = 0; i < buffer.length; i += 512) {
      const chunk = buffer.slice(i, i + 512)
      await characteristic?.writeValue(chunk)
    }

    await device.gatt?.disconnect()
    return { sucesso: true }

  } catch (error) {
    console.error('Erro na impressão:', error)
    return {
      sucesso: false,
      erro: 'Não foi possível conectar à impressora. Verifique se o Bluetooth está ligado e a impressora está próxima.'
    }
  }
}