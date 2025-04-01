import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function PATCH(request, { params }) {
  const supabase = createRouteHandlerClient({ cookies })
  const { id } = params
  const { status } = await request.json()
  
  const validStatuses = ['pending', 'in_progress', 'completed', 'canceled', 'disputed']
  
  if (!validStatuses.includes(status)) {
    return NextResponse.json(
      { error: 'Invalid status value' },
      { status: 400 }
    )
  }

  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError) throw userError
    if (!user) throw new Error('Not authenticated')

    // Get transaction details
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .select('buyer_id, seller_id, status')
      .eq('id', id)
      .single()

    if (transactionError) throw transactionError
    if (!transaction) throw new Error('Transaction not found')
    
    // Ensure user is either the buyer or seller
    if (transaction.buyer_id !== user.id && transaction.seller_id !== user.id) {
      throw new Error('Unauthorized')
    }
    
    // Update transaction status
    const { data, error } = await supabase
      .from('transactions')
      .update({ 
        status,
        updated_at: new Date().toISOString(),
        updated_by: user.id
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    
    // If status changed to completed, update user reputations
    if (status === 'completed' && transaction.status !== 'completed') {
      // Increment reputation for both buyer and seller
      await supabase.rpc('increment_reputation', { 
        user_id: transaction.buyer_id, 
        points: 1
      })
      
      await supabase.rpc('increment_reputation', { 
        user_id: transaction.seller_id, 
        points: 1
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    const status = 
      error.message === 'Not authenticated' ? 401 :
      error.message === 'Unauthorized' ? 403 :
      error.message === 'Transaction not found' ? 404 : 400

    return NextResponse.json(
      { error: error.message || 'Failed to update transaction status' },
      { status }
    )
  }
}
