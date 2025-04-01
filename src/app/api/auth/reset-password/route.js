import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { email } = await request.json()

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${request.headers.get('origin')}/auth/reset-password/confirm`,
    })

    if (error) throw error

    return NextResponse.json({ 
      message: 'Password reset instructions sent to your email' 
    })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to send password reset instructions' },
      { status: 400 }
    )
  }
}
