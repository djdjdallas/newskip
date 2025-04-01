import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const supabase = createRouteHandlerClient({ cookies })
  const searchParams = request.nextUrl.searchParams
  
  // Get search query
  const query = searchParams.get('q') || ''
  
  // Parse other query parameters
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
    let queryBuilder = supabase
      .from('waitlist_listings')
      .select(`
        *,
        profiles:seller_id(username, avatar_url),
        categories:category_id(name, slug)
      `)
      .eq('status', 'active')
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(from, to)
    
    // Full text search
    if (query) {
      queryBuilder = queryBuilder.textSearch('fts', query)
    }
    
    // Apply filters
    if (category) {
      queryBuilder = queryBuilder.eq('categories.slug', category)
    }
    if (minPrice) {
      queryBuilder = queryBuilder.gte('price', parseFloat(minPrice))
    }
    if (maxPrice) {
      queryBuilder = queryBuilder.lte('price', parseFloat(maxPrice))
    }
    if (isAuction !== null) {
      queryBuilder = queryBuilder.eq('is_auction', isAuction === 'true')
    }
    
    // Execute query
    const { data, error } = await queryBuilder
    
    if (error) throw error
    
    // Get total count
    const countQuery = supabase
      .from('waitlist_listings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
    
    if (query) {
      countQuery.textSearch('fts', query)
    }
    
    const { count: totalCount } = await countQuery
    
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
      { error: error.message || 'Search failed' },
      { status: 400 }
    )
  }
}
