import { NextResponse } from "next/server"

export async function POST() {
  // Clear the admin_jwt cookie
  const cookie = `admin_jwt=deleted; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
  return NextResponse.json({ success: true }, { headers: { "Set-Cookie": cookie } })
}
