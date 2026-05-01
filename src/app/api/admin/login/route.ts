import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminToken = process.env.ADMIN_TOKEN;

    if (!adminEmail || !adminPassword || !adminToken) {
      return NextResponse.json({ error: 'Admin credentials not configured' }, { status: 500 });
    }

    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    
    response.cookies.set({
      name: 'admin_token',
      value: adminToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/admin',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
