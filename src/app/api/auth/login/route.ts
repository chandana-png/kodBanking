import { NextResponse, type NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getPool, ensureTables } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

export async function POST(request: NextRequest) {
  try {
    const { uname, password } = await request.json();
    if (!uname || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    await ensureTables();
    const pool = getPool();
    // fetch user by uname
    const [rows]: any = await pool.execute(`SELECT * FROM User WHERE uname = ?`, [uname]);
    const user = rows[0];
    if (!user) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const token = jwt.sign(
      { role: user.role },
      JWT_SECRET,
      { subject: user.uname, expiresIn: '7d' }
    );

    await pool.execute(`INSERT INTO UserToken (token, userId) VALUES (?, ?)`, [token, user.id]);

    const res = NextResponse.json({ success: true });
    res.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ error: err.message || 'Login failed' }, { status: 500 });
  }
}
