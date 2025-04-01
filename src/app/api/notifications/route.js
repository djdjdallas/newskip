import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const supabase = createRouteHandlerClient({ cookies })
  const searchParams = request.nextUrl.searchParams
  const unreadOnly = searchParams.get('unreadOnly') === 'true'
  const limit = parseInt(searchParams.get('limit') || '50')

  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError) throw userError
    if (!user) throw new Error('Not authenticated')

    // Query notifications
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)
      
    if (unreadOnly) {
      query = query.eq('is_read', false)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    
    // Get unread count for the badge
    const { count: unreadCount } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false)
    
    return NextResponse.json({
      notifications: data,
      unreadCount
    })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch notifications' },
      { status: error.message === 'Not authenticated' ? 401 : 400 }
    )
  }
}

export async function PATCH(request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { markAllAsRead } = await request.json()

  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError) throw userError
    if (!user) throw new Error('Not authenticated')

    if (markAllAsRead) {
      // Mark all notifications as read
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false)
        
      if (error) throw error
      
      return NextResponse.json({ 
        message: 'All notifications marked as read' 
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to update notifications' },
      { status: error.message === 'Not authenticated' ? 401 : 400 }
    )
  }
}
