import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/lib/use-cart"
import { Toaster } from "@/components/ui/toaster"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const defaultMetadata: Metadata = {
  title: "Mi Tienda",
  description: "Encuentra los mejores productos para tu negocio",
  // generator: "v0.app",
  manifest: "/manifest.json",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.jpg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

// Generate dynamic metadata on the server using runtime config read from /api/config
export async function generateMetadata(): Promise<Metadata> {
  try {
    const base = process.env.NEXT_PUBLIC_URL || "http://localhost:3000"
    const res = await fetch(`${base}/api/config`, { cache: "no-store" })
  if (!res.ok) return defaultMetadata
    const cfg = await res.json()

  const title = cfg.storeName ? `${String(cfg.storeName)}` : (defaultMetadata.title as string)
  const description = String(cfg.storeDescription || defaultMetadata.description || "")
  const icon = String(cfg.storeIcon || "/icon.jpg")
  const ogImage = String(cfg.storeOgImage || icon)

    return {
      title,
      description,
      manifest: "/manifest.json",
      icons: {
        icon: [{ url: icon }],
        apple: icon,
      },
      openGraph: {
        title,
        description,
        url: cfg.baseUrl || base,
        images: [ogImage],
      },
    }
  } catch (e) {
    return defaultMetadata
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans antialiased`}>
    {/* Load runtime config generated at container start (if present) for client-side scripts */}
    <script src="/runtime-config.js"></script>
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
      </body>
    </html>
  )
}
