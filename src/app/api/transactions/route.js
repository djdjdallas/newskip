import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError) throw userError
    if (!user) throw new Error('Not authenticated')

    // Get transactions where user is either buyer or seller
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        listing:waitlist_listings(*),
        buyer:profiles!transactions_buyer_id_fkey(id, username, avatar_url, reputation),
        seller:profiles!transactions_seller_id_fkey(id, username, avatar_url, reputation)
      `)
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch transactions' },
      { status: error.message === 'Not authenticated' ? 401 : 400 }
    )
  }
}

export async function POST(request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { listingId, bidId } = await request.json()

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
      .eq('status', 'active')
      .single()

    if (listingError) throw listingError
    if (!listing) throw new Error('Listing not found or inactive')

    // Calculate transaction amount
    let amount, sellerId, buyerId;
    
    if (listing.is_auction && bidId) {
      // For auctions, get winning bid
      const { data: bid, error: bidError } = await supabase
        .from('bids')
        .select('*')
        .eq('id', bidId)
        .single()

      if (bidError) throw bidError
      if (!bid) throw new Error('Bid not found')
      
      amount = bid.amount
      sellerId = listing.seller_id
      buyerId = bid.bidder_id
      
      // Ensure current user is either seller or buyer
      if (user.id !== sellerId && user.id !== buyerId) {
        throw new Error('Unauthorized')
      }
    } else if (!listing.is_auction) {
      // For fixed price, user is the buyer
      amount = listing.price
      sellerId = listing.seller_id
      buyerId = user.id
      
      // Ensure user is not buying their own listing
      if (user.id === sellerId) {
        throw new Error('You cannot purchase your own listing')
      }
    } else {
      throw new Error('Invalid transaction request')
    }

    // Create transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        listing_id: listingId,
        bid_id: bidId || null,
        buyer_id: buyerId,
        seller_id: sellerId,
        amount,
        status: 'pending',
        payment_status: 'pending'
      })
      .select()
      .single()

    if (transactionError) throw transactionError

    // Update listing status
    await supabase
      .from('waitlist_listings')
      .update({ status: 'sold' })
      .eq('id', listingId)

    return NextResponse.json(transaction)
  } catch (error) {
    const status = 
      error.message === 'Not authenticated' ? 401 :
      error.message === 'Unauthorized' ? 403 :
      error.message === 'Listing not found or inactive' || error.message === 'Bid not found' ? 404 : 400

    return NextResponse.json(
      { error: error.message || 'Failed to create transaction' },
      { status }
    )
  }
}
