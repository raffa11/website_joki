import { Resend } from 'resend';

/* ── Types ──────────────────────────────────────────────────── */
interface OrderNotification {
  order_code: string;
  user_name: string;
  phone: string;
  game_id: string;
  server_id: string;
  current_rank: string;
  target_rank: string;
  price: number;
  payment_method: string;
}

interface StatusUpdateNotification {
  order_code: string;
  user_name: string;
  phone?: string;
  new_status: string;
  booster?: string;
  current_rank: string;
  target_rank: string;
  stars_progress?: number;
  stars_total?: number;
}

/* ── Formatting Helpers ─────────────────────────────────────── */
const fmtIDR = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

const statusLabel = (s: string) => {
  const map: Record<string, string> = {
    new: '🆕 New Order',
    paid: '💰 Payment Confirmed',
    in_progress: '🎮 Boosting Started',
    paused: '⏸ Boost Paused',
    completed: '✅ Boost Completed',
  };
  return map[s] || s.toUpperCase();
};

const statusEmoji = (s: string) => {
  const map: Record<string, string> = { new: '🆕', paid: '💰', in_progress: '🎮', paused: '⏸', completed: '✅' };
  return map[s] || '📋';
};

/* ═══════════════════════════════════════════════════════════════
   EMAIL — New Order
   ═══════════════════════════════════════════════════════════════ */
export async function sendOrderEmail(order: OrderNotification) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'BoostTrack <noreply@boosttrack.com>',
      to: [process.env.ADMIN_EMAIL || 'admin@boosttrack.com'],
      subject: `🎮 New Order: ${order.order_code}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f14; color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08);">
          <div style="background: linear-gradient(135deg, rgba(0,255,135,0.1), rgba(0,212,255,0.08)); padding: 32px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.06);">
            <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: 3px;">BOOST<span style="color: #00FF87;">TRACK</span></h1>
            <p style="color: #888; font-size: 12px; margin-top: 8px; letter-spacing: 2px; text-transform: uppercase;">New Order Received</p>
          </div>

          <div style="padding: 32px;">
            <div style="background: rgba(0,255,135,0.06); border: 1px solid rgba(0,255,135,0.15); border-radius: 12px; padding: 20px; margin-bottom: 20px; text-align: center;">
              <p style="margin: 0 0 6px; color: #888; font-size: 10px; text-transform: uppercase; letter-spacing: 2px;">Order Code</p>
              <p style="margin: 0; font-size: 28px; font-weight: 900; color: #00FF87; letter-spacing: 3px;">${order.order_code}</p>
            </div>

            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr><td style="padding: 10px 0; color: #666; width: 130px; vertical-align: top;">👤 Customer</td><td style="padding: 10px 0; font-weight: 600;">${order.user_name}</td></tr>
              <tr><td style="padding: 10px 0; color: #666;">📱 WhatsApp</td><td style="padding: 10px 0;"><a href="https://wa.me/${order.phone}" style="color: #00FF87; text-decoration: none; font-weight: 600;">${order.phone}</a></td></tr>
              <tr><td style="padding: 10px 0; color: #666;">🎮 Game ID</td><td style="padding: 10px 0;">${order.game_id} (${order.server_id})</td></tr>
              <tr><td colspan="2" style="padding: 12px 0 4px;"><hr style="border: none; border-top: 1px solid rgba(255,255,255,0.06);"/></td></tr>
              <tr><td style="padding: 10px 0; color: #666;">📍 From Rank</td><td style="padding: 10px 0; color: #FF6B6B; font-weight: 600;">${order.current_rank}</td></tr>
              <tr><td style="padding: 10px 0; color: #666;">🎯 Target Rank</td><td style="padding: 10px 0; color: #00FF87; font-weight: 600;">${order.target_rank}</td></tr>
              <tr><td colspan="2" style="padding: 12px 0 4px;"><hr style="border: none; border-top: 1px solid rgba(255,255,255,0.06);"/></td></tr>
              <tr><td style="padding: 10px 0; color: #666;">💳 Payment</td><td style="padding: 10px 0;">${order.payment_method}</td></tr>
              <tr><td style="padding: 10px 0; color: #666;">💰 Total</td><td style="padding: 10px 0; font-size: 20px; font-weight: 900; color: #00FF87;">${fmtIDR(order.price)}</td></tr>
            </table>
          </div>

          <div style="padding: 24px 32px 32px; text-align: center; border-top: 1px solid rgba(255,255,255,0.06);">
            <a href="${appUrl}/admin/order-board" style="display: inline-block; background: #00FF87; color: #000; padding: 14px 40px; border-radius: 10px; text-decoration: none; font-weight: 800; font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">OPEN ADMIN PANEL →</a>
          </div>
        </div>
      `,
    });
    console.log('[Notify] ✅ Order email sent for', order.order_code);
    return { success: true };
  } catch (error) {
    console.error('[sendOrderEmail] Error:', error);
    return { success: false, error };
  }
}

/* ═══════════════════════════════════════════════════════════════
   EMAIL — Status Update (Admin → Customer)
   ═══════════════════════════════════════════════════════════════ */
export async function sendStatusEmail(data: StatusUpdateNotification) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // If no admin email, skip
  if (!process.env.ADMIN_EMAIL) return { success: false, error: 'No ADMIN_EMAIL' };

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'BoostTrack <noreply@boosttrack.com>',
      to: [process.env.ADMIN_EMAIL],
      subject: `${statusEmoji(data.new_status)} Order ${data.order_code} → ${statusLabel(data.new_status)}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f14; color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08);">
          <div style="background: linear-gradient(135deg, rgba(0,212,255,0.1), rgba(0,255,135,0.08)); padding: 32px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.06);">
            <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: 3px;">BOOST<span style="color: #00FF87;">TRACK</span></h1>
            <p style="color: #888; font-size: 12px; margin-top: 8px; letter-spacing: 2px; text-transform: uppercase;">Status Update</p>
          </div>

          <div style="padding: 32px;">
            <div style="background: rgba(0,212,255,0.06); border: 1px solid rgba(0,212,255,0.15); border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
              <p style="margin: 0 0 4px; color: #888; font-size: 10px; text-transform: uppercase; letter-spacing: 2px;">${data.order_code}</p>
              <p style="margin: 0; font-size: 18px; font-weight: 800; color: #00D4FF;">${statusLabel(data.new_status)}</p>
            </div>

            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr><td style="padding: 8px 0; color: #666; width: 120px;">Customer</td><td style="padding: 8px 0;">${data.user_name}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;">Rank</td><td style="padding: 8px 0;">${data.current_rank} → ${data.target_rank}</td></tr>
              ${data.booster ? `<tr><td style="padding: 8px 0; color: #666;">Booster</td><td style="padding: 8px 0; color: #FBBF24; font-weight: 600;">${data.booster}</td></tr>` : ''}
              ${data.stars_progress !== undefined ? `<tr><td style="padding: 8px 0; color: #666;">Progress</td><td style="padding: 8px 0; color: #00FF87; font-weight: 600;">${data.stars_progress} / ${data.stars_total} ⭐</td></tr>` : ''}
            </table>
          </div>

          <div style="padding: 20px 32px 32px; text-align: center; border-top: 1px solid rgba(255,255,255,0.06);">
            <a href="${appUrl}/admin/order-board" style="display: inline-block; background: #00D4FF; color: #000; padding: 12px 36px; border-radius: 10px; text-decoration: none; font-weight: 800; font-size: 12px; letter-spacing: 2px;">VIEW ORDER →</a>
          </div>
        </div>
      `,
    });
    console.log('[Notify] ✅ Status email sent for', data.order_code);
    return { success: true };
  } catch (error) {
    console.error('[sendStatusEmail] Error:', error);
    return { success: false, error };
  }
}

/* ═══════════════════════════════════════════════════════════════
   TELEGRAM — New Order
   ═══════════════════════════════════════════════════════════════ */
export async function sendOrderTelegram(order: OrderNotification) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error('[sendOrderTelegram] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
    return { success: false, error: 'Missing env vars' };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const message = `🔔 <b>NEW ORDER — BOOSTTRACK</b>

━━━━━━━━━━━━━━━━━━━
📋 <b>Order:</b> <code>${order.order_code}</code>
👤 <b>Customer:</b> ${order.user_name}
📱 <b>WhatsApp:</b> ${order.phone}

🎮 <b>Boost Details:</b>
• Game ID: <code>${order.game_id}</code> (${order.server_id})
• From: ${order.current_rank}
• To: ${order.target_rank}

💰 <b>Payment:</b>
• Method: ${order.payment_method}
• Total: <b>${fmtIDR(order.price)}</b>
━━━━━━━━━━━━━━━━━━━

📍 <a href="${appUrl}/admin/order-board">Open Admin Panel</a>`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML', disable_web_page_preview: true }),
    });

    const data = await response.json();
    if (!data.ok) {
      console.error('[sendOrderTelegram] Telegram Error:', data);
      return { success: false, error: data };
    }

    console.log('[Notify] ✅ Order Telegram sent for', order.order_code);
    return { success: true };
  } catch (error) {
    console.error('[sendOrderTelegram] Error:', error);
    return { success: false, error };
  }
}

/* ═══════════════════════════════════════════════════════════════
   TELEGRAM — Status Update
   ═══════════════════════════════════════════════════════════════ */
export async function sendStatusTelegram(data: StatusUpdateNotification) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) return { success: false, error: 'Missing env vars' };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const progressLine = data.stars_progress !== undefined
    ? `\n📊 <b>Progress:</b> ${data.stars_progress} / ${data.stars_total} ⭐`
    : '';
  const boosterLine = data.booster
    ? `\n🛡 <b>Booster:</b> ${data.booster}`
    : '';

  const message = `${statusEmoji(data.new_status)} <b>STATUS UPDATE</b>

━━━━━━━━━━━━━━━━━━━
📋 <b>Order:</b> <code>${data.order_code}</code>
📌 <b>Status:</b> ${statusLabel(data.new_status)}
👤 <b>Customer:</b> ${data.user_name}
🎮 <b>Rank:</b> ${data.current_rank} → ${data.target_rank}${boosterLine}${progressLine}
━━━━━━━━━━━━━━━━━━━

📍 <a href="${appUrl}/admin/order-board">View Board</a>`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML', disable_web_page_preview: true }),
    });

    const result = await response.json();
    if (!result.ok) {
      console.error('[sendStatusTelegram] Error:', result);
      return { success: false, error: result };
    }

    console.log('[Notify] ✅ Status Telegram sent for', data.order_code);
    return { success: true };
  } catch (error) {
    console.error('[sendStatusTelegram] Error:', error);
    return { success: false, error };
  }
}
