import { NextResponse } from "next/server"
import webpush from "web-push"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    const privateKey = process.env.VAPID_PRIVATE_KEY

    if (!publicKey || !privateKey) {
      return NextResponse.json({ error: "Push notifications not configured. Please set VAPID keys." }, { status: 503 })
    }

    webpush.setVapidDetails("mailto:tu-email@ejemplo.com", publicKey, privateKey)

    const { title, body, type } = await request.json()

    const subscriptions = await prisma.pushSubscription.findMany()

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ message: "No hay suscriptores" })
    }

    const payload = JSON.stringify({
      title,
      body,
      icon: "/icon.jpg",
      badge: "/icon.jpg",
      data: { type },
    })

    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: sub.keys as any,
            },
            payload,
          )
        } catch (error: any) {
          if (error?.statusCode === 410 || error?.statusCode === 404) {
            // Remove invalid subscription
            try {
              await prisma.pushSubscription.delete({ where: { id: sub.id } })
            } catch (e) {
              console.warn('Failed to delete subscription', e)
            }
          }
          throw error
        }
      }),
    )

    const successful = results.filter((r) => r.status === "fulfilled").length

    return NextResponse.json({
      message: `Notificaciones enviadas a ${successful} de ${subscriptions.length} suscriptores`,
    })
  } catch (error) {
    console.error("Error sending notifications:", error)
    return NextResponse.json({ error: "Error al enviar notificaciones" }, { status: 500 })
  }
}
