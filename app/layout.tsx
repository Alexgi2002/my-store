import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/lib/use-cart"
import { Toaster } from "@/components/ui/toaster"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mi Tienda - Productos para tu negocio",
  description: "Encuentra los mejores productos para tu negocio",
  generator: "v0.app",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans antialiased`}>
        {/* Load runtime config generated at container start (if present) */}
        <script src="/runtime-config.js"></script>
  {/* Set document title at runtime from runtime-config (STORE_NAME) to support per-store branding */}
  <script dangerouslySetInnerHTML={{ __html: "(function(){try{var c=window.__RUNTIME_CONFIG__||{};var name=c.STORE_NAME||document.title; if(name) document.title = name + ' - Productos para tu negocio'; var meta = document.querySelector('meta[name=description]'); if(meta){ meta.setAttribute('content', (c.STORE_NAME? 'Tienda ' + c.STORE_NAME : meta.content)); } }catch(e){} })();" }} />
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
      </body>
    </html>
  )
}
