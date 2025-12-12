"use client"

import type React from "react"

import { useEffect, useState } from "react"
import type { Banner } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Loader2, AlertCircle } from "lucide-react"
import Image from "next/image"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getAdminHeaders } from "@/components/admin/admin-client"

export function BannerManager() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    image_url: "",
    link: "",
  })

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const response = await fetch("/api/banners", {
        headers: getAdminHeaders(null),
      })
      if (!response.ok) {
        setError("La tabla de banners aún no existe. Ejecuta el script SQL primero.")
        setBanners([])
        return
      }
      const data = await response.json()
      setBanners(Array.isArray(data) ? data : [])
      setError(null)
    } catch (error) {
      console.error("[v0] Error fetching banners:", error)
      setError("Error al cargar banners. Verifica que la tabla exista.")
      setBanners([])
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("bucket", "banners")

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: getAdminHeaders(null),
        body: formData,
      })

      const data = await response.json()
      if (data.url) {
        setFormData((prev) => ({ ...prev, image_url: data.url }))
      } else {
        setError(data.error || "Error al subir imagen")
      }
    } catch (error) {
      console.error("[v0] Error uploading image:", error)
      setError("Error al subir imagen")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/banners", {
        method: "POST",
        headers: getAdminHeaders("application/json"),
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData({ title: "", image_url: "", link: "" })
        fetchBanners()
      } else {
        const data = await response.json()
        setError(data.error || "Error al agregar banner")
      }
    } catch (error) {
      console.error("[v0] Error adding banner:", error)
      setError("Error al agregar banner. Verifica que la tabla exista.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este banner?")) return

    try {
      const response = await fetch(`/api/banners/${id}`, {
        method: "DELETE",
        headers: getAdminHeaders(null),
      })

      if (response.ok) {
        setBanners(banners.filter((b) => b.id !== id))
      } else {
        setError("Error al eliminar banner")
      }
    } catch (error) {
      console.error("[v0] Error deleting banner:", error)
      setError("Error al eliminar banner")
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Agregar Banner Promocional</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="banner-title">Título</Label>
              <Input
                id="banner-title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                required
                placeholder="Título del banner"
              />
            </div>
            <div className="space-y-2">
              <Label>Imagen</Label>
              {formData.image_url && (
                <div className="relative h-40 w-full rounded-lg overflow-hidden">
                  <Image src={formData.image_url || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="flex-1"
                />
                {isUploading && <Loader2 className="h-5 w-5 animate-spin" />}
              </div>
              <p className="text-xs text-muted-foreground">O ingresa una URL:</p>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData((prev) => ({ ...prev, image_url: e.target.value }))}
                placeholder="https://ejemplo.com/banner.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="banner-link">Link (opcional)</Label>
              <Input
                id="banner-link"
                value={formData.link}
                onChange={(e) => setFormData((prev) => ({ ...prev, link: e.target.value }))}
                placeholder="https://ejemplo.com/oferta"
              />
            </div>
            <Button type="submit" disabled={isSubmitting || isUploading || !formData.image_url}>
              {isSubmitting ? "Agregando..." : "Agregar Banner"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Banners Activos ({banners.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {banners.map((banner) => (
              <div key={banner.id} className="flex gap-4 p-4 border rounded-lg items-center">
                <div className="relative h-20 w-32 flex-shrink-0">
                  <Image
                    src={banner.image_url || "/placeholder.svg"}
                    alt={banner.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold truncate">{banner.title}</h4>
                  {banner.link && <p className="text-sm text-muted-foreground truncate">Link: {banner.link}</p>}
                </div>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(banner.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {banners.length === 0 && !loading && (
              <div className="text-center py-8 text-muted-foreground">No hay banners disponibles</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
