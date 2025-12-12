import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
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

export async function POST(request: Request) {
  try {
    if (!checkAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "Archivo requerido" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    await fs.mkdir(uploadsDir, { recursive: true })

    const originalName = (file as any).name || `upload-${Date.now()}`
    const ext = path.extname(originalName) || ""
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}${ext}`
    const targetPath = path.join(uploadsDir, filename)

    await fs.writeFile(targetPath, buffer)

    const publicUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ""}/uploads/${filename}`

    // Save metadata in Prisma
    try {
      await prisma.upload.create({
        data: {
          filename: originalName,
          path: `/uploads/${filename}`,
          mime: file.type || null,
          size: buffer.length,
        },
      })
    } catch (e) {
      console.warn('Failed to save upload metadata to DB', e)
    }

    return NextResponse.json({ url: publicUrl })
  } catch (error) {
    console.error("[v0] Error uploading file:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al subir archivo" },
      { status: 500 },
    )
  }
}
