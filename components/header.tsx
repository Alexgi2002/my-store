"use client"

import { CartButton } from "@/components/cart-button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { MessageCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useTranslation } from "@/hooks/use-language"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

export function Header() {
  const { t, language } = useTranslation()
  const [whatsappNumber, setWhatsappNumber] = useState("")
  const [storeName, setStoreName] = useState("Mi Tienda")
  const [storeIcon, setStoreIcon] = useState("/icon.jpg")
  const [storeDescription, setStoreDescription] = useState("")
  const [infoOpen, setInfoOpen] = useState(false)

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
            if (config.storeDescription) setStoreDescription(config.storeDescription)
            if (config.whatsapp) setWhatsappNumber(config.whatsapp)
          } else {
            // Fallback: leer desde runtime-config.js
            const runtimeConfig = (window as any).__RUNTIME_CONFIG__
            if (runtimeConfig) {
              if (runtimeConfig.STORE_NAME) setStoreName(runtimeConfig.STORE_NAME)
              if (runtimeConfig.STORE_ICON || runtimeConfig.STORE_ICON_URL) {
                setStoreIcon(runtimeConfig.STORE_ICON || runtimeConfig.STORE_ICON_URL)
              }
              if (runtimeConfig.STORE_DESCRIPTION) setStoreDescription(runtimeConfig.STORE_DESCRIPTION)
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
              if (runtimeConfig.STORE_DESCRIPTION) setStoreDescription(runtimeConfig.STORE_DESCRIPTION)
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
    <header className="border-b overflow-hidden">
      <div className="container mx-auto px-4 py-4 max-w-full">
        {/* Barra única: tienda a la izquierda, acciones a la derecha */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-between gap-4 w-full overflow-hidden">
            <Link href="/" className="flex items-center gap-3 min-w-0 overflow-hidden">
              <img id="store-icon" src={storeIcon} alt={storeName} className="h-8 w-8 rounded-full object-cover shrink-0" />
              <div className="flex flex-col gap-0.5 min-w-0 overflow-hidden">
                <h1 id="store-name" className="text-2xl font-semibold truncate">{storeName}</h1>
                {storeDescription && (
                  <p className="text-xs text-muted-foreground line-clamp-2 truncate leading-tight">
                    {storeDescription}
                  </p>
                )}
              </div>
            </Link>

            <div className="flex items-center gap-2 shrink-0">
              {whatsappNumber && (
                <Button variant="outline" size="sm" asChild>
                  <Link className="whatsapp-link" href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    {t('whatsappContact')}
                  </Link>
                </Button>
              )}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setInfoOpen(true)}
                aria-label={t('storeInfoBtn')}
              >
                <Info className="h-4 w-4" />
              </Button>
              <CartButton />
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>

      {/* Información del negocio (dialog) */}
      <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
        <DialogContent className="sm:max-w-md p-6">
          <DialogTitle>{storeName}</DialogTitle>
          <div className="flex flex-col items-center justify-center text-center">
            {storeIcon && (
              <img
                src={storeIcon}
                alt={storeName}
                className="w-32 h-32 rounded-full object-cover mb-4 border border-border"
              />
            )}
            {storeDescription && (
              <p className="mt-2 text-muted-foreground">{storeDescription}</p>
            )}
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={() => setInfoOpen(false)}>{t('close')}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  )
}
