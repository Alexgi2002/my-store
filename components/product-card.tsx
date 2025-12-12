"use client"

import type { Product } from "@/lib/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Plus, Minus } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/lib/use-cart"
import { useToast } from "@/hooks/use-toast"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, items, updateQuantity, removeItem } = useCart()
  const { toast } = useToast()

  const cartItem = items.find((item) => item.product.id === product.id)
  const isInCart = !!cartItem

  const handleAddToCart = () => {
    addItem(product)
    toast({
      title: "Producto agregado",
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

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="relative aspect-square">
          <Image src={product.image_url || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{product.description}</p>
          )}
          <p className="text-2xl font-bold">${product.price}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {isInCart ? (
          <div className="flex items-center justify-between w-full gap-2">
            <Button variant="outline" size="icon" onClick={handleDecrement}>
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold min-w-[2rem] text-center">{cartItem.quantity}</span>
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
          <Button onClick={handleAddToCart} className="w-full" disabled={product.stock === 0}>
            {product.stock === 0 ? (
              "Sin stock"
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Agregar al carrito
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
