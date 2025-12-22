import { ProductGrid } from "@/components/product-grid"
import { CartButton } from "@/components/cart-button"
import { BannerCarousel } from "@/components/banner-carousel"
import { Footer } from "@/components/footer"
import { InstallAppButton } from "@/components/install-app-button"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function Home() {
  // fetch runtime config so whatsapp number can be changed without rebuild
  let whatsappNumber = ""
  // defaults for runtime store branding
  let storeName = "Mi Tienda"
  let storeIcon = "/icon.jpg"
    try {
      const base = process.env.NEXT_PUBLIC_URL || "http://localhost:3000"
      const res = await fetch(`${base}/api/config`, { cache: 'no-store' })
      if (res.ok) {
        const cfg = await res.json()
      
        console.log('****************************************************')
        console.log(cfg)
        console.log('****************************************************')
      
        whatsappNumber = String(cfg?.whatsapp || "")
        storeName = String(cfg?.storeName || "Mi Tienda")
        storeIcon = String(cfg?.storeIcon || "/icon.jpg")
      }
  } catch (err) {
    console.log('****************************************************')
    console.log(err)
    console.log('****************************************************')

    // fallback to env if the config endpoint fails
    whatsappNumber = process.env.WHATSAPP_NUMBER || ""
  }

  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* show store icon next to name - add ids so client script can update them when runtime-config changes */}
            <img id="store-icon" src={storeIcon} alt={storeName} className="h-8 w-8 rounded-full object-cover" />
            <h1 id="store-name" className="text-2xl font-semibold">{storeName}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link className="whatsapp-link" href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                Contactar
              </Link>
            </Button>
            <CartButton />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <BannerCarousel />
        </div>
        <ProductGrid />
      </main>
      <Footer />
      <InstallAppButton />
    </div>
  )
}
