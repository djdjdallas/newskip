import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const supabase = createRouteHandlerClient({ cookies })
  const searchParams = request.nextUrl.searchParams
  const listingId = searchParams.get('listingId')

  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError) throw userError
    if (!user) throw new Error('Not authenticated')

    let query = supabase
      .from('bids')
      .select(`
        *,
        listing:waitlist_listings(
          id, 
          title,
          is_auction,
          auction_end_time,
          current_bid,
          seller_id
        )
      `)
      .eq('bidder_id', user.id)
      .order('created_at', { ascending: false })

    if (listingId) {
      query = query.eq('listing_id', listingId)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch bids' },
      { status: error.message === 'Not authenticated' ? 401 : 400 }
    )
  }
}

export async function POST(request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { listingId, amount } = await request.json()

  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError) throw userError
    if (!user) throw new Error('Not authenticated')

    // Get listing details
    const { data: listing, error: listingError } = await supabase
      .from('waitlist_listings')
      .select('*')
      .eq('id', listingId)
      .single()

    if (listingError) throw listingError
    if (!listing) throw new Error('Listing not found')
    
    // Validate listing is an auction
    if (!listing.is_auction) {
      throw new Error('This listing is not an auction')
    }
    
    // Check if seller is trying to bid on their own listing
    if (listing.seller_id === user.id) {
      throw new Error('You cannot bid on your own listing')
    }
    
    // Check if auction has ended
    const now = new Date()
    const endTime = new Date(listing.auction_end_time)
    if (now > endTime) {
      throw new Error('This auction has ended')
    }
    
    // Validate bid amount
    const bidAmount = parseFloat(amount)
    if (isNaN(bidAmount) || bidAmount <= 0) {
      throw new Error('Invalid bid amount')
    }
    
    const minBid = (listing.current_bid || listing.minimum_bid) + 1
    if (bidAmount < minBid) {
      throw new Error(`Bid must be at least ${minBid}`)
    }
    
    // Create bid
    const { data: bid, error: bidError } = await supabase
      .from('bids')
      .insert({
        listing_id: listingId,
        bidder_id: user.id,
        amount: bidAmount,
        status: 'active'
      })
      .select()
      .single()
      
    if (bidError) throw bidError
    
    // Update current bid on listing
    const { error: updateError } = await supabase
      .from('waitlist_listings')
      .update({
        current_bid: bidAmount,
        current_bidder_id: user.id
      })
      .eq('id', listingId)
      
    if (updateError) throw updateError

    return NextResponse.json(bid)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to place bid' },
      { status: error.message === 'Not authenticated' ? 401 : 400 }
    )
  }
}
