import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { email, password } = await request.json()

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return NextResponse.json({ 
      user: data.user,
      message: 'Login successful' 
    })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Invalid login credentials' },
      { status: 401 }
    )
  }
}
