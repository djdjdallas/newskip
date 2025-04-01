import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request, { params }) {
  const supabase = createRouteHandlerClient({ cookies })
  const { id } = params
  const formData = await request.formData()
  const image = formData.get('image')
  const isPrimary = formData.get('isPrimary') === 'true'

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

    // Upload image
    const fileExt = image.name.split('.').pop()
    const fileName = `${id}/${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('listing-images')
      .upload(fileName, image)

    if (uploadError) throw uploadError

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('listing-images')
      .getPublicUrl(fileName)

    // If this is set as primary, update all other images for this listing
    if (isPrimary) {
      await supabase
        .from('listing_images')
        .update({ is_primary: false })
        .eq('listing_id', id)
    }

    // Insert image record
    const { data, error } = await supabase
      .from('listing_images')
      .insert({
        listing_id: id,
        url: urlData.publicUrl,
        is_primary: isPrimary
      })
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
      { error: error.message || 'Failed to upload image' },
      { status }
    )
  }
}

export async function DELETE(request, { params }) {
  const supabase = createRouteHandlerClient({ cookies })
  const { id } = params
  const searchParams = request.nextUrl.searchParams
  const imageId = searchParams.get('imageId')

  if (!imageId) {
    return NextResponse.json(
      { error: 'Image ID is required' },
      { status: 400 }
    )
  }

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

    // Get image info
    const { data: image, error: imageError } = await supabase
      .from('listing_images')
      .select('*')
      .eq('id', imageId)
      .eq('listing_id', id)
      .single()

    if (imageError) throw imageError
    if (!image) throw new Error('Image not found')

    // Delete image record
    const { error: deleteError } = await supabase
      .from('listing_images')
      .delete()
      .eq('id', imageId)

    if (deleteError) throw deleteError

    // Delete file from storage
    // Extract filename from URL
    const urlParts = image.url.split('/')
    const fileName = `${id}/${urlParts[urlParts.length - 1]}`

    await supabase.storage
      .from('listing-images')
      .remove([fileName])

    // If this was a primary image, set another image as primary
    if (image.is_primary) {
      const { data: otherImages } = await supabase
        .from('listing_images')
        .select('id')
        .eq('listing_id', id)
        .limit(1)

      if (otherImages && otherImages.length > 0) {
        await supabase
          .from('listing_images')
          .update({ is_primary: true })
          .eq('id', otherImages[0].id)
      }
    }

    return NextResponse.json({ message: 'Image deleted successfully' })
  } catch (error) {
    const status = 
      error.message === 'Not authenticated' ? 401 :
      error.message === 'Unauthorized' ? 403 :
      error.message === 'Listing not found' || error.message === 'Image not found' ? 404 : 400

    return NextResponse.json(
      { error: error.message || 'Failed to delete image' },
      { status }
    )
  }
}
