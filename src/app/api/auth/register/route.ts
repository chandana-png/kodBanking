import { NextResponse, type NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { getPool } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { uid, uname, password, email, phone } = await request.json();
    if (!uid || !uname || !password || !email || !phone) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const pool = getPool();
    await pool.execute(
      `INSERT INTO User (uid, uname, password, email, phone, role) VALUES (?, ?, ?, ?, ?, ?)`,
      [uid, uname, hashed, email, phone, 'customer']
    );
    return NextResponse.json({ success: true, user: { uname } }, { status: 201 });
  } catch (err: any) {
    console.error('Register error:', err);
    return NextResponse.json({ error: err.message || 'Registration failed' }, { status: 500 });
  }
}
