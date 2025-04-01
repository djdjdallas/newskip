import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function PATCH(request, { params }) {
  const supabase = createRouteHandlerClient({ cookies })
  const { id } = params
  const { status } = await request.json()

  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError) throw userError
    if (!user) throw new Error('Not authenticated')

    // Get bid details
    const { data: bid, error: bidError } = await supabase
      .from('bids')
      .select('*, listing:waitlist_listings(seller_id)')
      .eq('id', id)
      .single()

    if (bidError) throw bidError
    if (!bid) throw new Error('Bid not found')

    // Only the seller of the listing or the bidder can update bid status
    if (bid.bidder_id !== user.id && bid.listing.seller_id !== user.id) {
      throw new Error('Unauthorized')
    }

    // Update bid status
    const { data, error } = await supabase
      .from('bids')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    const status = 
      error.message === 'Not authenticated' ? 401 :
      error.message === 'Unauthorized' ? 403 :
      error.message === 'Bid not found' ? 404 : 400

    return NextResponse.json(
      { error: error.message || 'Failed to update bid status' },
      { status }
    )
  }
}
