import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"

export async function GET() {
  try {
    const data = await prisma.banner.findMany({ where: { active: true }, orderBy: { order_index: 'asc' } })
    return NextResponse.json(data || [])
  } catch (error) {
    // Silently return empty array if table doesn't exist
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  try {
    if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await request.json()
    const created = await prisma.banner.create({
      data: {
        title: body.title,
        image_url: body.image_url || null,
        link: body.link || null,
        active: body.active ?? true,
        order_index: body.order_index ?? 0,
      },
    })

    try {
      const notifyUrl = new URL("/api/push/notify", request.url)
      await fetch(notifyUrl.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "¡Nueva Oferta!",
          body: body.title,
          type: "new_banner",
        }),
      })
    } catch (notifyError) {
      // Silently fail if push notifications aren't set up
    }

    return NextResponse.json(created)
  } catch (error) {
    console.error("Error creating banner:", error)
    return NextResponse.json({ error: "Error al crear banner" }, { status: 500 })
  }
}
