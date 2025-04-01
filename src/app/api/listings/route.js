import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const supabase = createRouteHandlerClient({ cookies })
  const searchParams = request.nextUrl.searchParams
  
  // Parse query parameters
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const category = searchParams.get('category')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const isAuction = searchParams.get('isAuction')
  const sortBy = searchParams.get('sortBy') || 'created_at'
  const sortOrder = searchParams.get('sortOrder') || 'desc'
  
  // Calculate pagination
  const from = (page - 1) * limit
  const to = from + limit - 1

  try {
    let query = supabase
      .from('waitlist_listings')
      .select(`
        *,
        profiles:seller_id(username, avatar_url),
        categories:category_id(name, slug)
      `)
      .eq('status', 'active')
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(from, to)
    
    // Apply filters
    if (category) {
      query = query.eq('categories.slug', category)
    }
    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice))
    }
    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice))
    }
    if (isAuction !== null) {
      query = query.eq('is_auction', isAuction === 'true')
    }
    
    // Execute query
    const { data, error, count } = await query
    
    if (error) throw error
    
    // Get total count
    const { count: totalCount } = await supabase
      .from('waitlist_listings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
    
    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch listings' },
      { status: 400 }
    )
  }
}

export async function POST(request) {
  const supabase = createRouteHandlerClient({ cookies })
  const listingData = await request.json()

  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError) throw userError
    if (!user) throw new Error('Not authenticated')

    // Create listing
    const { data, error } = await supabase
      .from('waitlist_listings')
      .insert({
        ...listingData,
        seller_id: user.id,
        status: 'active'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to create listing' },
      { status: error.message === 'Not authenticated' ? 401 : 400 }
    )
  }
}
