import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { sendOrderEmail, sendOrderTelegram } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: "", ...options });
          },
        },
      }
    );
    const body = await req.json();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required to place an order. Please login first." }, { status: 401 });
    }

    const {
      gameId,
      serverId,
      whatsapp,
      currentRank,
      targetRank,
      price,
      starsTotal,
      paymentMethod
    } = body;

    // Validate required fields
    if (!gameId || !serverId || !whatsapp || !currentRank || !targetRank || !price) {
      return NextResponse.json({ error: "Missing required fields. Please fill in all order details." }, { status: 400 });
    }

    // Generate a simple order code (e.g., ML-123456)
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    const orderCode = `ML-${randomCode}`;

    const { data, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        user_name: body.userName || user.email?.split('@')[0] || 'User',
        game_id: gameId,
        server_id: serverId,
        phone: whatsapp,
        current_rank: currentRank,
        target_rank: targetRank,
        price: price,
        stars_total: starsTotal,
        stars_progress: 0,
        order_code: orderCode,
        payment_method: paymentMethod || 'Unknown',
        status: "paid",
        payment_status: "paid"
      })
      .select()
      .single();

    if (error) {
      console.error("[Create Order] Supabase Error:", error);
      if (error.code === '42703') {
        return NextResponse.json({ 
          error: "Database schema mismatch. Please ensure you have run the latest migration in supabase-schema.sql",
          details: error.message 
        }, { status: 500 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // ── Send Notifications (non-blocking) ──
    const notificationData = {
      order_code: data.order_code,
      user_name: data.user_name,
      user_email: data.user_email,
      phone: data.phone || '-',
      game_id: data.game_id || '-',
      server_id: data.server_id || '-',
      current_rank: data.current_rank,
      target_rank: data.target_rank,
      price: data.price,
      payment_method: data.payment_method || '-',
    };

    // Fire-and-forget: notifications fail gracefully without breaking the order
    sendOrderEmail(notificationData).catch(err => console.error('[Notify] Email failed:', err));
    sendOrderTelegram(notificationData).catch(err => console.error('[Notify] Telegram failed:', err));

    return NextResponse.json({ success: true, order: data });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
