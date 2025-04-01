import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function PATCH(request, { params }) {
  const supabase = createRouteHandlerClient({ cookies })
  const { id } = params
  const { is_read } = await request.json()

  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError) throw userError
    if (!user) throw new Error('Not authenticated')

    // Ensure notification belongs to user
    const { data: notification, error: notificationError } = await supabase
      .from('notifications')
      .select('user_id')
      .eq('id', id)
      .single()

    if (notificationError) throw notificationError
    if (!notification) throw new Error('Notification not found')
    if (notification.user_id !== user.id) throw new Error('Unauthorized')

    // Update notification
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    const status = 
      error.message === 'Not authenticated' ? 401 :
      error.message === 'Unauthorized' ? 403 :
      error.message === 'Notification not found' ? 404 : 400

    return NextResponse.json(
      { error: error.message || 'Failed to update notification' },
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

    // Ensure notification belongs to user
    const { data: notification, error: notificationError } = await supabase
      .from('notifications')
      .select('user_id')
      .eq('id', id)
      .single()

    if (notificationError) throw notificationError
    if (!notification) throw new Error('Notification not found')
    if (notification.user_id !== user.id) throw new Error('Unauthorized')

    // Delete notification
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ message: 'Notification deleted successfully' })
  } catch (error) {
    const status = 
      error.message === 'Not authenticated' ? 401 :
      error.message === 'Unauthorized' ? 403 :
      error.message === 'Notification not found' ? 404 : 400

    return NextResponse.json(
      { error: error.message || 'Failed to delete notification' },
      { status }
    )
  }
}
