"use client"

import { useEffect, useState } from "react"
import type { Product } from "@/lib/types"
import { ProductCard } from "./product-card"

interface RelatedProductsProps {
  currentProductId: string
}

export function RelatedProducts({ currentProductId }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products")
        const data = await response.json()
        
        if (Array.isArray(data)) {
          // Filtrar el producto actual y obtener productos aleatorios
          const otherProducts = data.filter((p) => p.id !== currentProductId)
          // Mezclar aleatoriamente y tomar máximo 8 productos
          const shuffled = otherProducts.sort(() => Math.random() - 0.5)
          setProducts(shuffled.slice(0, 8))
        } else if (data && Array.isArray(data.products)) {
          const otherProducts = data.products.filter((p: Product) => p.id !== currentProductId)
          const shuffled = otherProducts.sort(() => Math.random() - 0.5)
          setProducts(shuffled.slice(0, 8))
        }
      } catch (error) {
        console.error("Error loading related products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [currentProductId])

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex-shrink-0 w-64 h-80 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No hay productos relacionados disponibles</p>
      </div>
    )
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-primary scrollbar-track-transparent">
      {products.map((product) => (
        <div key={product.id} className="flex-shrink-0 w-64">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  )
}

