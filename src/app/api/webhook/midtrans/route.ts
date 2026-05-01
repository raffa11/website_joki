import { NextResponse, type NextRequest } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const signature = crypto
      .createHash('sha512')
      .update(
        body.order_id +
        body.status_code +
        body.gross_amount +
        process.env.MIDTRANS_SERVER_KEY!
      )
      .digest('hex')

    if (signature !== body.signature_key) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
    }

    if (body.transaction_status === 'settlement' || body.transaction_status === 'capture') {
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
        .eq('id', body.order_id)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
