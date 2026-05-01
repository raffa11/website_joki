import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const callbackToken = request.headers.get('x-callback-token')
    
    if (callbackToken !== process.env.XENDIT_CALLBACK_TOKEN) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 })
    }

    const body = await request.json()

    if (body.status === 'PAID' || body.status === 'SETTLED') {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      const { error } = await supabase
        .from('orders')
        .update({ 
          payment_status: 'paid', 
          status: 'paid',
          updated_at: new Date().toISOString()
        })
        .eq('id', body.external_id)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
