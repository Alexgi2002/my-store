"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { getAdminHeaders } from "@/components/admin/admin-client"

export function StoreSettings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [storeName, setStoreName] = useState("")
  const [storeDescription, setStoreDescription] = useState("")
  const [storeIcon, setStoreIcon] = useState("")
  const [storeOgImage, setStoreOgImage] = useState("")
  const [whatsapp, setWhatsapp] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/config", { headers: getAdminHeaders(null) })
        if (!res.ok) throw new Error("No autorizado o error al obtener config")
        const data = await res.json()
        setStoreName(data.storeName || "")
        setStoreDescription(data.storeDescription || "")
        setStoreIcon(data.storeIcon || "")
        setStoreOgImage(data.storeOgImage || "")
        setWhatsapp(data.whatsapp || "")
      } catch (e: any) {
        console.error("[v0] Error loading store config:", e)
        setError(e?.message || "Error al cargar configuración")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const payload = {
        storeName: storeName || null,
        storeDescription: storeDescription || null,
        storeIcon: storeIcon || null,
        storeOgImage: storeOgImage || null,
        whatsapp: whatsapp || null,
      }

      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: getAdminHeaders("application/json"),
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Error saving config")

      // success — show new values (server already wrote runtime-config.js)
      alert("Configuración guardada")
    } catch (err: any) {
      console.error("[v0] Error saving store config:", err)
      setError(err?.message || "Error al guardar")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Configuración de la tienda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground animate-pulse">Cargando...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración de la tienda</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label>Nombre de la tienda</Label>
            <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} />
          </div>

          <div>
            <Label>Descripción (meta)</Label>
            <Textarea value={storeDescription} onChange={(e) => setStoreDescription(e.target.value)} />
          </div>

          <div>
            <Label>Icono (ruta o URL)</Label>
            <Input value={storeIcon} onChange={(e) => setStoreIcon(e.target.value)} placeholder="/icon.jpg or https://..." />
            {storeIcon && (
              <div className="mt-2">
                <img src={storeIcon} alt="preview" className="h-12 w-12 rounded object-cover" />
              </div>
            )}
          </div>

          <div>
            <Label>OG Image (ruta o URL)</Label>
            <Input value={storeOgImage} onChange={(e) => setStoreOgImage(e.target.value)} placeholder="/og.jpg or https://..." />
          </div>

          <div>
            <Label>WhatsApp (ej: +56912345678)</Label>
            <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
          </div>

          {error && <div className="text-sm text-destructive">{error}</div>}

          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default StoreSettings
