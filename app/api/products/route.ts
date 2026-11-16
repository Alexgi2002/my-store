import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"

export async function GET() {
  try {
    const data = await prisma.product.findMany({ orderBy: { created_at: 'desc' } })
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error fetching products:", error)
    return NextResponse.json({ error: "Error al cargar productos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await request.json()
    const created = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description || null,
        price: Number(body.price) || 0,
        image_url: body.image_url || null,
        stock: Number(body.stock) || 0,
      },
    })

    try {
      await fetch(`${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/push/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "¡Nuevo Producto!",
          body: `${body.name} - $${body.price}`,
          type: "new_product",
        }),
      })
    } catch (notifyError) {
      console.error("Error sending notification:", notifyError)
    }

    return NextResponse.json(created)
  } catch (error) {
    console.error("[v0] Error creating product:", error)
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 })
  }
}
