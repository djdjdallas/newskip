import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  const supabase = createRouteHandlerClient({ cookies })
  const { id } = params

  try {
    // Get public profile data
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url, bio, reputation, created_at')
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data) throw new Error('Profile not found')

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch profile' },
      { status: error.message === 'Profile not found' ? 404 : 400 }
    )
  }
}
