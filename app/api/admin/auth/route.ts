import { NextResponse } from "next/server"
import { signAdminJwt } from "@/lib/admin"

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123"

    if (password === adminPassword) {
      // Create a short-lived JWT and set it as an HttpOnly cookie.
      const jwtToken = signAdminJwt()

      const maxAge = Number(process.env.ADMIN_JWT_EXPIRES_SECONDS || 900)
      const isProd = process.env.NODE_ENV === "production"
      const cookieParts = [
        `admin_jwt=${encodeURIComponent(jwtToken)}`,
        `Path=/`,
        `Max-Age=${maxAge}`,
        `HttpOnly`,
        `SameSite=Lax`,
      ]
      if (isProd) cookieParts.push("Secure")

      // For backward compatibility with the frontend that uses `x-admin-token`,
      // still return ADMIN_TOKEN in the body if configured. The preferred method
      // is the HttpOnly cookie.
      const adminToken = process.env.ADMIN_TOKEN || null

      return NextResponse.json({ success: true, token: adminToken }, { headers: { "Set-Cookie": cookieParts.join("; ") } })
    }

    return NextResponse.json({ success: false }, { status: 401 })
  } catch (error) {
    console.error("[v0] Auth error:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
