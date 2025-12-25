import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import { verifyAdminJwt, extractAdminJwtFromCookie } from "@/lib/admin"

function checkAdmin(request: Request) {
  const adminToken = process.env.ADMIN_TOKEN
  const hasJwtSecret = !!(process.env.ADMIN_JWT_SECRET || process.env.ADMIN_TOKEN)
  if (!adminToken && !hasJwtSecret) return true

  const provided = request.headers.get("x-admin-token")
  if (adminToken && provided === adminToken) return true

  const cookieHeader = request.headers.get("cookie") || null
  const jwt = extractAdminJwtFromCookie(cookieHeader)
  if (jwt && verifyAdminJwt(jwt)) return true

  return false
}

export async function GET() {
  // Return same payload as /api/config but guarded for admin usage (public /api/config remains available)
  return NextResponse.json({
    whatsapp: process.env.WHATSAPP_NUMBER || null,
    storeName: process.env.STORE_NAME || null,
    storeDescription: process.env.STORE_DESCRIPTION || null,
    storeIcon: process.env.STORE_ICON || null,
    storeOgImage: process.env.STORE_OG_IMAGE || null,
    baseUrl: process.env.NEXT_PUBLIC_URL || null,
  })
}

export async function POST(request: Request) {
  try {
    if (!checkAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // Admin POST updates are disabled. Runtime config must be managed via environment variables
    // (e.g. set in Portainer) to keep branding immutable and consistent for installed shortcuts.
    return NextResponse.json({ error: 'Runtime configuration is managed via environment variables; POST disabled' }, { status: 405 })
  } catch (error) {
    console.error("[v0] Error writing runtime config:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Error" }, { status: 500 })
  }
}
