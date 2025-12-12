import { NextResponse } from "next/server"
import { extractAdminJwtFromCookie, verifyAdminJwt } from "@/lib/admin"

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || null
    const jwt = extractAdminJwtFromCookie(cookieHeader)
    if (jwt && verifyAdminJwt(jwt)) {
      return NextResponse.json({ authenticated: true })
    }

    return NextResponse.json({ authenticated: false }, { status: 401 })
  } catch (e) {
    console.error("[v0] /api/admin/me error", e)
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}
