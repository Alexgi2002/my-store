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

// Generate dynamic metadata on the server using environment variables.
// We deliberately read from env to make branding immutable and tied to container config.
export async function generateMetadata(): Promise<Metadata> {
  try {
    const base = process.env.NEXT_PUBLIC_URL || "http://localhost:3000"
    const title = process.env.STORE_NAME || (defaultMetadata.title as string)
    const description = process.env.STORE_DESCRIPTION || (defaultMetadata.description as string)
  const icon = process.env.STORE_ICON || process.env.STORE_ICON_URL || "/icon.jpg"
  const ogImage = process.env.STORE_OG_IMAGE || process.env.STORE_OG_IMAGE_URL || icon

    return {
      title: String(title),
      description: String(description),
      manifest: "/manifest.json",
      icons: {
        icon: [{ url: String(icon) }],
        apple: String(icon),
      },
      openGraph: {
        title: String(title),
        description: String(description),
        url: process.env.NEXT_PUBLIC_URL || base,
        images: [String(ogImage)],
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
      <head>
        <script src="/runtime-config.js" />
      </head>
      <body className={`font-sans antialiased`}>
        <CartProvider>
              {children}
              <Toaster />
            </CartProvider>
      </body>
    </html>
  )
}
