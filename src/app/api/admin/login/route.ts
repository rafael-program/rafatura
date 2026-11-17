import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { senha } = await req.json()

  if (senha !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Senha errada' }, { status: 401 })
  }

  // Cria a resposta e define o cookie HttpOnly (não pode ser lido por JS no browser)
  const response = NextResponse.json({ ok: true })
  response.cookies.set('admin_session', 'autenticado', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 7 dias
  })

  return response
}