import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasAdminEmail: !!process.env.ADMIN_EMAIL,
    hasAdminPassword: !!process.env.ADMIN_PASSWORD,
    hasAdminToken: !!process.env.ADMIN_TOKEN,
    adminEmail: process.env.ADMIN_EMAIL,
  })
}
