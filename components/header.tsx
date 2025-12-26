"use client"

import { CartButton } from "@/components/cart-button"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"

export function Header() {
  const [whatsappNumber, setWhatsappNumber] = useState("")
  const [storeName, setStoreName] = useState("Mi Tienda")
  const [storeIcon, setStoreIcon] = useState("/icon.jpg")

  useEffect(() => {
    // Leer desde API primero (siempre actualizado), luego desde runtime-config como fallback
    async function loadConfig() {
      if (typeof window !== "undefined") {
        try {
          // Priorizar API que lee directamente de env vars
          const response = await fetch("/api/config")
          if (response.ok) {
            const config = await response.json()
            if (config.storeName) setStoreName(config.storeName)
            if (config.storeIcon) setStoreIcon(config.storeIcon)
            if (config.whatsapp) setWhatsappNumber(config.whatsapp)
          } else {
            // Fallback: leer desde runtime-config.js
            const runtimeConfig = (window as any).__RUNTIME_CONFIG__
            if (runtimeConfig) {
              if (runtimeConfig.STORE_NAME) setStoreName(runtimeConfig.STORE_NAME)
              if (runtimeConfig.STORE_ICON || runtimeConfig.STORE_ICON_URL) {
                setStoreIcon(runtimeConfig.STORE_ICON || runtimeConfig.STORE_ICON_URL)
              }
              if (runtimeConfig.WHATSAPP_NUMBER) setWhatsappNumber(runtimeConfig.WHATSAPP_NUMBER)
            }
          }
        } catch (e) {
          console.error("Error loading config:", e)
          // Último fallback: runtime-config.js
          try {
            const runtimeConfig = (window as any).__RUNTIME_CONFIG__
            if (runtimeConfig) {
              if (runtimeConfig.STORE_NAME) setStoreName(runtimeConfig.STORE_NAME)
              if (runtimeConfig.STORE_ICON || runtimeConfig.STORE_ICON_URL) {
                setStoreIcon(runtimeConfig.STORE_ICON || runtimeConfig.STORE_ICON_URL)
              }
              if (runtimeConfig.WHATSAPP_NUMBER) setWhatsappNumber(runtimeConfig.WHATSAPP_NUMBER)
            }
          } catch (e2) {
            console.error("Error loading from runtime-config:", e2)
          }
        }
      }
    }
    loadConfig()
  }, [])

  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img id="store-icon" src={storeIcon} alt={storeName} className="h-8 w-8 rounded-full object-cover" />
          <h1 id="store-name" className="text-2xl font-semibold">{storeName}</h1>
        </Link>
        <div className="flex items-center gap-2">
          {whatsappNumber && (
            <Button variant="outline" size="sm" asChild>
              <Link className="whatsapp-link" href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                Contactar
              </Link>
            </Button>
          )}
          <CartButton />
        </div>
      </div>
    </header>
  )
}

