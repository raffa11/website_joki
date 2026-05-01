import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { sendStatusEmail, sendStatusTelegram } from '@/lib/notifications'

export async function PATCH(request: NextRequest) {
  try {
    const { id, status, booster, stars_progress } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({ name, value: '', ...options })
          },
        },
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updateData: any = { updated_at: new Date().toISOString() }
    if (status) updateData.status = status
    if (booster !== undefined) updateData.booster = booster
    if (stars_progress !== undefined) updateData.stars_progress = stars_progress

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // ── Log the action ──
    if (status) {
      await supabase
        .from('logs')
        .insert({
          action: `status_updated_to_${status}`,
          order_id: id,
          user_id: user.id
        })
    }

    // ── Send notifications on status changes (fire-and-forget) ──
    if (status && data) {
      const notifData = {
        order_code: data.order_code || id.substring(0, 8),
        user_name: data.user_name || 'Customer',
        phone: data.phone,
        new_status: status,
        booster: data.booster,
        current_rank: data.current_rank,
        target_rank: data.target_rank,
        stars_progress: data.stars_progress,
        stars_total: data.stars_total,
      };
      
      sendStatusEmail(notifData).catch(err => console.error('[Update] Email notification failed:', err));
      sendStatusTelegram(notifData).catch(err => console.error('[Update] Telegram notification failed:', err));
    }

    return NextResponse.json({ success: true, order: data })
  } catch (err) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
