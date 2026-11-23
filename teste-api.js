// teste-api.js
const payload = {
  vendedor_id: "d6724dd7-c6ae-43c4-93c7-6094d073ba5b",
  cliente_nome: "Teste Final",
  cliente_telefone: "957377424",
  itens: [
    { produto: "Teste", qtd: 1, precoUnit: 1000 }
  ],
  total: 1000,
  pago: true,
  qr_token: "teste-final-777"
};

const response = await fetch('https://rafatura-q81e.vercel.app/api/emitir', {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload)
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error("Erro:", err));