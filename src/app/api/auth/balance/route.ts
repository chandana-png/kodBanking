import { NextResponse, type NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { getPool, ensureTables } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const uname = payload.sub;
    await ensureTables();
    const pool = getPool();
    const [rows]: any = await pool.execute(`SELECT balance FROM User WHERE uname = ?`, [uname]);
    const user = rows[0];
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ balance: user.balance });
  } catch (err: any) {
    console.error('Balance error:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch balance' }, { status: 500 });
  }
}
