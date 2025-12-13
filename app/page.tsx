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
  try {
    const res = await fetch('/api/config', { cache: 'no-store' })
    if (res.ok) {
      const cfg = await res.json()
      whatsappNumber = String(cfg?.whatsapp || "")
    }
  } catch (err) {
    // fallback to env if the config endpoint fails
    whatsappNumber = process.env.WHATSAPP_NUMBER || ""
  }

  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Mi Tienda</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
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
