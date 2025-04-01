import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const { error } = await supabase.auth.signOut()

    if (error) throw error

    return NextResponse.json({ message: 'Logged out successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'An error occurred during logout' },
      { status: 400 }
    )
  }
}
