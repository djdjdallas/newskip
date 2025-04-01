import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  const supabase = createRouteHandlerClient({ cookies })
  const { id } = params
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const sortBy = searchParams.get('sortBy') || 'created_at'
  const sortOrder = searchParams.get('sortOrder') || 'desc'

  // Calculate pagination
  const from = (page - 1) * limit
  const to = from + limit - 1

  try {
    // Get reviews for the user
    const { data, error, count } = await supabase
      .from('reviews')
      .select(`
        *,
        reviewer:profiles!reviews_reviewer_id_fkey(id, username, avatar_url)
      `, { count: 'exact' })
      .eq('user_id', id)
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(from, to)
      
    if (error) throw error
    
    // Get user's average rating
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('average_rating, review_count')
      .eq('id', id)
      .single()
      
    if (profileError) throw profileError
    
    return NextResponse.json({
      reviews: data,
      averageRating: userProfile.average_rating,
      reviewCount: userProfile.review_count,
      pagination: {
        page,
        limit,
        totalCount: count,
        totalPages: Math.ceil(count / limit)
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user reviews' },
      { status: 400 }
    )
  }
}
