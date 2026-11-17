'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginAdmin(senha: string) {
  if (senha === 'Rafaell509#') {
    const cookieStore = await cookies()
    cookieStore.set('admin_token', 'logado', {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
  } else {
    return { error: 'Senha incorreta' }
  }
  
  // O redirect tem de estar FORA do if para o Next.js o apanhar corretamente
  redirect('/admin')
}