import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!checkAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    await prisma.banner.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    // Handle Prisma 'record not found' error (P2025) with a 404 response
    // For other errors return 500 but include the original message in non-production for easier debugging.
    console.error("[v0] Error deleting banner:", error)
    const isPrismaNotFound = (error as any)?.code === 'P2025'
    if (isPrismaNotFound) {
      return NextResponse.json({ error: 'Banner no encontrado' }, { status: 404 })
    }

    const isDev = process.env.NODE_ENV !== 'production'
    if (isDev) {
      // expose error message in development to speed debugging
      return NextResponse.json({ error: (error as any)?.message || String(error) || 'Error al eliminar banner' }, { status: 500 })
    }

    return NextResponse.json({ error: 'Error al eliminar banner' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!checkAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await request.json()
    const updated = await prisma.banner.update({
      where: { id: params.id },
      data: {
        title: body.title,
        image_url: body.image_url || null,
        link: body.link || null,
        active: body.active ?? true,
        order_index: body.order_index ?? 0,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("[v0] Error updating banner:", error)
    return NextResponse.json({ error: "Error al actualizar banner" }, { status: 500 })
  }
}
