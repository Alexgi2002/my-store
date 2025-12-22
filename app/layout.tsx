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
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
    {/* Load runtime config generated at container start (if present) for client-side scripts */}
    <script src="/runtime-config.js"></script>
    {/* Inline script: update header (store name/icon) at runtime from runtime-config so admins' changes reflect immediately */}
    <script dangerouslySetInnerHTML={{ __html: `
      (function(){
        try{
          var cfg = (window && window.__RUNTIME_CONFIG__) || {}
          var name = cfg.storeName || cfg.STORE_NAME || cfg.store_name
          var icon = cfg.storeIcon || cfg.STORE_ICON || cfg.store_icon
          var whatsapp = cfg.whatsapp || cfg.WHATSAPP_NUMBER
          if (name) {
            var el = document.getElementById('store-name')
            if (el) el.textContent = name
            if (typeof document.title === 'string') document.title = name + ' - Productos para tu negocio'
          }
          if (icon) {
            var iel = document.getElementById('store-icon')
            if (iel) {
              try { iel.setAttribute('src', icon) } catch(e){}
            }
          }
          // Update WA links (class .whatsapp-link) if present
          if (whatsapp) {
            var links = document.querySelectorAll('a.whatsapp-link')
            links.forEach(function(a){
              try{
                var num = String(whatsapp).replace(/\D/g,'')
                if (num) a.setAttribute('href', 'https://wa.me/' + num)
              }catch(e){}
            })
          }
        }catch(e){}
      })();
    ` }} />
      </body>
    </html>
  )
}
