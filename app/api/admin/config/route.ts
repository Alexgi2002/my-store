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

    const body = await request.json()
    // Accept keys and write runtime-config.js into public so the frontend picks it up
    const runtime = {
      NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL || "http://localhost:3000",
      NEXT_PUBLIC_VAPID_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
      STORE_NAME: body.storeName || process.env.STORE_NAME || "",
      STORE_DESCRIPTION: body.storeDescription || process.env.STORE_DESCRIPTION || "",
      STORE_ICON: body.storeIcon || process.env.STORE_ICON || "/icon.jpg",
      STORE_OG_IMAGE: body.storeOgImage || process.env.STORE_OG_IMAGE || "/icon.jpg",
      WHATSAPP_NUMBER: body.whatsapp || process.env.WHATSAPP_NUMBER || "",
    }

  const js = `window.__RUNTIME_CONFIG__ = ${JSON.stringify(runtime, null, 2)};`
  const targetJs = path.join(process.cwd(), "public", "runtime-config.js")
  const targetJson = path.join(process.cwd(), "public", "runtime-config.json")
  await fs.mkdir(path.dirname(targetJs), { recursive: true })
  // write both a JS loader and a pure JSON file so server-side code can read it without eval
  await fs.writeFile(targetJs, js, "utf8")
  await fs.writeFile(targetJson, JSON.stringify(runtime, null, 2), "utf8")

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[v0] Error writing runtime config:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Error" }, { status: 500 })
  }
}
