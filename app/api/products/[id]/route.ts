import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("[v0] Error fetching product:", error)
    return NextResponse.json({ error: "Error al cargar producto" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await request.json()
    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description || null,
        price: Number(body.price) || 0,
        image_url: body.image_url || null,
        stock: Number(body.stock) || 0,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("[v0] Error updating product:", error)
    return NextResponse.json({ error: "Error al actualizar producto" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting product:", error)
    return NextResponse.json({ error: "Error al eliminar producto" }, { status: 500 })
  }
}
