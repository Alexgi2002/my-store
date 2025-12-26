import { ProductGrid } from "@/components/product-grid"
import { BannerCarousel } from "@/components/banner-carousel"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { InstallAppButton } from "@/components/install-app-button"

export const dynamic = 'force-dynamic'

export default async function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
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
