import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const supabase = createRouteHandlerClient({ cookies })
  const formData = await request.formData()
  const document = formData.get('document')
  const documentType = formData.get('documentType')

  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError) throw userError
    if (!user) throw new Error('Not authenticated')

    // Upload verification document
    const fileName = `${user.id}/${Date.now()}_verification`
    const { error: uploadError } = await supabase.storage
      .from('verification-documents')
      .upload(fileName, document)

    if (uploadError) throw uploadError

    // Get public URL of uploaded document
    const { data: urlData } = supabase.storage
      .from('verification-documents')
      .getPublicUrl(fileName)

    // Create verification request
    const { error: verificationError } = await supabase
      .from('verification_requests')
      .insert({
        user_id: user.id,
        document_url: urlData.publicUrl,
        document_type: documentType,
        status: 'pending'
      })

    if (verificationError) throw verificationError

    return NextResponse.json({ 
      message: 'Verification documents submitted successfully' 
    })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to submit verification documents' },
      { status: error.message === 'Not authenticated' ? 401 : 400 }
    )
  }
}
