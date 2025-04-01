import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch categories' },
      { status: 400 }
    )
  }
}
