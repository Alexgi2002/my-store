import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const subscription = await request.json()

    // Save subscription via Prisma (endpoint is unique)
    try {
      await prisma.pushSubscription.upsert({
        where: { endpoint: subscription.endpoint },
        update: { keys: subscription.keys },
        create: { endpoint: subscription.endpoint, keys: subscription.keys },
      })
    } catch (e: any) {
      // Ignore unique constraint or other DB errors for now
      console.warn('Failed to save subscription', e?.message || e)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving subscription:", error)
    return NextResponse.json({ error: "Error al guardar suscripción" }, { status: 500 })
  }
}
