import { ProductGrid } from "@/components/product-grid"
import { CartButton } from "@/components/cart-button"
import { BannerCarousel } from "@/components/banner-carousel"
import { Footer } from "@/components/footer"
import { InstallAppButton } from "@/components/install-app-button"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function Home() {
  // Read branding and whatsapp directly from environment variables (set via Portainer)
  let whatsappNumber = process.env.WHATSAPP_NUMBER || ""
  // defaults for runtime store branding
  let storeName = process.env.STORE_NAME || "Mi Tienda"
  let storeIcon = process.env.STORE_ICON || "/icon.jpg"

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
