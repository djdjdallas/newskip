import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  const supabase = createRouteHandlerClient({ cookies })
  const { id } = params

  try {
    // Get listing with seller and category details
    const { data, error } = await supabase
      .from('waitlist_listings')
      .select(`
        *,
        seller:profiles!waitlist_listings_seller_id_fkey(id, username, avatar_url, reputation),
        category:categories!waitlist_listings_category_id_fkey(id, name, slug)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data) throw new Error('Listing not found')

    // Get listing images
    const { data: images } = await supabase
      .from('listing_images')
      .select('*')
      .eq('listing_id', id)
      .order('is_primary', { ascending: false })

    data.images = images || []

    // If it's an auction, get bids
    if (data.is_auction) {
      const { data: bids } = await supabase
        .from('bids')
        .select(`
          *,
          bidder:profiles!bids_bidder_id_fkey(id, username, avatar_url)
        `)
        .eq('listing_id', id)
        .order('amount', { ascending: false })
        .limit(10)

      data.bids = bids || []
    }

    // Increment view count
    await supabase
      .from('waitlist_listings')
      .update({ views_count: (data.views_count || 0) + 1 })
      .eq('id', id)

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch listing' },
      { status: error.message === 'Listing not found' ? 404 : 400 }
    )
  }
}

export async function PATCH(request, { params }) {
  const supabase = createRouteHandlerClient({ cookies })
  const { id } = params
  const updateData = await request.json()

  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError) throw userError
    if (!user) throw new Error('Not authenticated')

    // Ensure user owns this listing
    const { data: listing, error: listingError } = await supabase
      .from('waitlist_listings')
      .select('seller_id')
      .eq('id', id)
      .single()

    if (listingError) throw listingError
    if (!listing) throw new Error('Listing not found')
    if (listing.seller_id !== user.id) throw new Error('Unauthorized')

    // Update listing
    const { data, error } = await supabase
      .from('waitlist_listings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    const status = 
      error.message === 'Not authenticated' ? 401 :
      error.message === 'Unauthorized' ? 403 :
      error.message === 'Listing not found' ? 404 : 400

    return NextResponse.json(
      { error: error.message || 'Failed to update listing' },
      { status }
    )
  }
}

export async function DELETE(request, { params }) {
  const supabase = createRouteHandlerClient({ cookies })
  const { id } = params

  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError) throw userError
    if (!user) throw new Error('Not authenticated')

    // Ensure user owns this listing
    const { data: listing, error: listingError } = await supabase
      .from('waitlist_listings')
      .select('seller_id')
      .eq('id', id)
      .single()

    if (listingError) throw listingError
    if (!listing) throw new Error('Listing not found')
    if (listing.seller_id !== user.id) throw new Error('Unauthorized')

    // Delete listing (soft delete by updating status)
    const { error } = await supabase
      .from('waitlist_listings')
      .update({ status: 'deleted' })
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ message: 'Listing deleted successfully' })
  } catch (error) {
    const status = 
      error.message === 'Not authenticated' ? 401 :
      error.message === 'Unauthorized' ? 403 :
      error.message === 'Listing not found' ? 404 : 400

    return NextResponse.json(
      { error: error.message || 'Failed to delete listing' },
      { status }
    )
  }
}
