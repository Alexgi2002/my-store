"use client"

import { useEffect, useState } from "react"
import type { Product } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import Image from "next/image"
import { EditProductDialog } from "./edit-product-dialog"

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products", {
        headers: (await import("@/components/admin/admin-client")).getAdminHeaders(null),
      })
      const data = await response.json()
      if (response.ok) {
        if (Array.isArray(data)) {
          setProducts(data)
        } else if (data && Array.isArray(data.products)) {
          setProducts(data.products)
        } else {
          console.warn("[v0] /api/products returned unexpected payload:", data)
          setProducts([])
        }
      } else {
        console.error("[v0] /api/products returned error:", data)
        setProducts([])
      }
    } catch (error) {
      console.error("[v0] Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: (await import("@/components/admin/admin-client")).getAdminHeaders(null),
      })

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== id))
      } else {
        alert("Error al eliminar producto")
      }
    } catch (error) {
      console.error("[v0] Error deleting product:", error)
      alert("Error al eliminar producto")
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Productos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">Cargando...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productos ({products.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="flex gap-4 p-4 border rounded-lg items-center">
              <div className="relative h-20 w-20 flex-shrink-0">
                <Image
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold truncate">{product.name}</h4>
                <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                <div className="flex gap-4 mt-1">
                  <span className="text-sm font-medium">${product.price}</span>
                  <span className="text-sm text-muted-foreground">Stock: {product.stock}</span>
                </div>
              </div>
              <EditProductDialog product={product} onUpdate={fetchProducts} />
              <Button variant="destructive" size="icon" onClick={() => handleDelete(product.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {products.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No hay productos disponibles</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
