import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { email, password, username } = await request.json()

  try {
    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${request.headers.get('origin')}/auth/callback`,
      }
    })

    if (authError) throw authError

    // If user is created successfully, also create a profile record
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          username,
          email
        })

      if (profileError) throw profileError
    }

    return NextResponse.json({ 
      message: 'Registration successful. Please check your email to verify your account.' 
    })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'An error occurred during registration' },
      { status: 400 }
    )
  }
}
