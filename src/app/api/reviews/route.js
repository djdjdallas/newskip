import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { userId, transactionId, rating, comment } = await request.json()

  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError) throw userError
    if (!user) throw new Error('Not authenticated')

    // Validate rating
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5')
    }

    // If transaction ID is provided, verify user was part of the transaction
    if (transactionId) {
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .select('buyer_id, seller_id, status')
        .eq('id', transactionId)
        .single()

      if (transactionError) throw transactionError
      if (!transaction) throw new Error('Transaction not found')
      
      // Ensure user was part of the transaction
      if (transaction.buyer_id !== user.id && transaction.seller_id !== user.id) {
        throw new Error('You can only review transactions you were part of')
      }
      
      // Ensure transaction is completed
      if (transaction.status !== 'completed') {
        throw new Error('You can only review completed transactions')
      }
      
      // Ensure user is reviewing the other party
      if ((transaction.buyer_id === user.id && userId !== transaction.seller_id) ||
          (transaction.seller_id === user.id && userId !== transaction.buyer_id)) {
        throw new Error('You can only review the other party in the transaction')
      }
    }

    // Create review
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        reviewer_id: user.id,
        user_id: userId,
        transaction_id: transactionId,
        rating,
        comment,
      })
      .select()
      .single()

    if (error) throw error

    // Update user's average rating
    await supabase.rpc('update_user_rating', { 
      user_id_param: userId
    })

    // Create notification for the reviewed user
    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: 'new_review',
        content: `You received a new review with a rating of ${rating}/5`,
        related_id: data.id,
        is_read: false
      })

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to create review' },
      { status: error.message === 'Not authenticated' ? 401 : 400 }
    )
  }
}

export async function GET(request) {
  const supabase = createRouteHandlerClient({ cookies })
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId')
  
  try {
    let query = supabase
      .from('reviews')
      .select(`
        *,
        reviewer:profiles!reviews_reviewer_id_fkey(id, username, avatar_url)
      `)
      .order('created_at', { ascending: false })
    
    if (userId) {
      query = query.eq('user_id', userId)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch reviews' },
      { status: 400 }
    )
  }
}
