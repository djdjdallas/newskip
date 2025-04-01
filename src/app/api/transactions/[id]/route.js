import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  const supabase = createRouteHandlerClient({ cookies })
  const { id } = params

  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError) throw userError
    if (!user) throw new Error('Not authenticated')

    // Get transaction details
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        listing:waitlist_listings(*),
        buyer:profiles!transactions_buyer_id_fkey(id, username, avatar_url, reputation, email),
        seller:profiles!transactions_seller_id_fkey(id, username, avatar_url, reputation, email)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data) throw new Error('Transaction not found')
    
    // Ensure user is either the buyer or seller
    if (data.buyer_id !== user.id && data.seller_id !== user.id) {
      throw new Error('Unauthorized')
    }

    return NextResponse.json(data)
  } catch (error) {
    const status = 
      error.message === 'Not authenticated' ? 401 :
      error.message === 'Unauthorized' ? 403 :
      error.message === 'Transaction not found' ? 404 : 400

    return NextResponse.json(
      { error: error.message || 'Failed to fetch transaction' },
      { status }
    )
  }
}
