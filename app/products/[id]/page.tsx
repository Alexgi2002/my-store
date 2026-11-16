"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import type { Product } from "@/lib/types"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Plus, Minus, ArrowLeft, ZoomIn } from "lucide-react"
import { useCart } from "@/lib/use-cart"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { RelatedProducts } from "@/components/related-products"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useTranslation } from "@/hooks/use-language"

export default function ProductDetailPage() {
  const { t } = useTranslation()
  const params = useParams()
  const router = useRouter()
  const { id } = params
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const { addItem, items, updateQuantity, removeItem } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${id}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data)
        } else {
          toast({
            title: t('error'),
            description: t('pageNotFoundDesc'),
            variant: "destructive",
          })
          router.push("/")
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        toast({
          title: t('error'),
          description: "Error al cargar el producto",
          variant: "destructive",
        })
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id, router, toast, t])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return null
  }

  const cartItem = items.find((item) => item.product.id === product.id)
  const isInCart = !!cartItem

  const handleAddToCart = () => {
    addItem(product)
    toast({
      title: t('addToCartShort'),
      description: `${product.name} se agregó al carrito`,
      duration: 2000,
    })
  }

  const handleIncrement = () => {
    if (cartItem && cartItem.quantity < product.stock) {
      updateQuantity(product.id, cartItem.quantity + 1)
    }
  }

  const handleDecrement = () => {
    if (cartItem) {
      if (cartItem.quantity === 1) {
        removeItem(product.id)
      } else {
        updateQuantity(product.id, cartItem.quantity - 1)
      }
    }
  }

  const stockLabel = product.stock > 0 ? `${product.stock} ${t('units')}` : t('outOfStockShort')

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        {/* Botón de regreso */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('back')}
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Imagen del producto */}
          <div className="relative aspect-square w-full max-w-2xl mx-auto">
            <div
              className="relative w-full h-full cursor-pointer group"
              onClick={() => setImageDialogOpen(true)}
            >
              <Image
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
                priority
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center">
                <ZoomIn className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>

          {/* Información del producto */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-3xl font-semibold text-primary">${product.price}</p>
            </div>

            {product.description && (
              <div>
                <h2 className="text-xl font-semibold mb-3">{t('description')}</h2>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{t('stockAvailable')}</span>
              <span className={product.stock > 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                {product.stock > 0 ? stockLabel : t('outOfStockShort')}
              </span>
            </div>

            {/* Botones de carrito */}
            <div className="pt-4">
              {isInCart ? (
                <div className="flex items-center justify-between gap-4 p-4 border rounded-lg">
                  <Button variant="outline" size="icon" onClick={handleDecrement}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-xl font-semibold min-w-[3rem] text-center">
                    {cartItem.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleIncrement}
                    disabled={cartItem.quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleAddToCart}
                  className="w-full"
                  size="lg"
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? (
                    t('outOfStockShort')
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      {t('addToCartShort')}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Productos relacionados */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">{t('relatedProducts')}</h2>
          <RelatedProducts currentProductId={product.id} />
        </div>
      </main>
      <Footer />

      {/* Dialog para imagen en zoom */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-none">
          <div className="relative w-full aspect-square max-h-[90vh]">
            <Image
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-contain rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
