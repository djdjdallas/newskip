import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request, { params }) {
  const supabase = createRouteHandlerClient({ cookies })
  const { id } = params
  const formData = await request.formData()
  const verificationMethod = formData.get('verificationMethod')
  const verificationData = formData.get('verificationData')
  const proofImage = formData.get('proofImage')

  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError) throw userError
    if (!user) throw new Error('Not authenticated')

    // Get transaction details
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .select('buyer_id, seller_id, listing_id, status')
      .eq('id', id)
      .single()

    if (transactionError) throw transactionError
    if (!transaction) throw new Error('Transaction not found')
    
    // Ensure user is either the buyer or seller
    if (transaction.buyer_id !== user.id && transaction.seller_id !== user.id) {
      throw new Error('Unauthorized')
    }
    
    // Prepare verification data
    let verificationRecord = {
      transaction_id: id,
      user_id: user.id,
      verification_method: verificationMethod,
      verification_data: verificationData || null,
      status: user.id === transaction.seller_id ? 'confirmed' : 'pending'
    }
    
    // If proof image is provided, upload it
    if (proofImage) {
      const fileName = `${id}/${Date.now()}_verification`
      const { error: uploadError } = await supabase.storage
        .from('transaction-proofs')
        .upload(fileName, proofImage)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('transaction-proofs')
        .getPublicUrl(fileName)
        
      verificationRecord.proof_image_url = urlData.publicUrl
    }
    
    // Insert verification record
    const { data, error } = await supabase
      .from('transaction_verifications')
      .insert(verificationRecord)
      .select()
      .single()

    if (error) throw error
    
    // If seller is verifying, update transaction status to in_progress
    if (user.id === transaction.seller_id && transaction.status === 'pending') {
      await supabase
        .from('transactions')
        .update({ 
          status: 'in_progress',
          updated_at: new Date().toISOString(),
          updated_by: user.id
        })
        .eq('id', id)
    }
    
    // If buyer is confirming, check if also verified by seller
    if (user.id === transaction.buyer_id) {
      const { data: sellerVerification } = await supabase
        .from('transaction_verifications')
        .select('*')
        .eq('transaction_id', id)
        .eq('user_id', transaction.seller_id)
        .single()
        
      // If already verified by seller, mark as completed
      if (sellerVerification) {
        await supabase
          .from('transactions')
          .update({ 
            status: 'completed',
            updated_at: new Date().toISOString(),
            updated_by: user.id
          })
          .eq('id', id)
          
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
    }

    return NextResponse.json(data)
  } catch (error) {
    const status = 
      error.message === 'Not authenticated' ? 401 :
      error.message === 'Unauthorized' ? 403 :
      error.message === 'Transaction not found' ? 404 : 400

    return NextResponse.json(
      { error: error.message || 'Failed to verify transaction' },
      { status }
    )
  }
}
