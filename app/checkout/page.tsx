"use client"

import type React from "react"

import { useCart } from "@/lib/use-cart"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import type { CustomerInfo } from "@/lib/types"
import Image from "next/image"
import { useTranslation } from "@/hooks/use-language"

export default function CheckoutPage() {
  const { t } = useTranslation()
  const { items, total, clearCart } = useCart()
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    phone: "",
    address: "",
    apartment: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load customer info from localStorage
  useEffect(() => {
    const savedInfo = localStorage.getItem("customerInfo")
    if (savedInfo) {
      setCustomerInfo(JSON.parse(savedInfo))
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Save customer info to localStorage
    localStorage.setItem("customerInfo", JSON.stringify(customerInfo))

    // Create WhatsApp message
    const itemsList = items
      .map((item) => `• ${item.product.name} x${item.quantity} - $${(item.product.price * item.quantity).toFixed(2)}`)
      .join("\n")

    const message = `¡Hola! Me gustaría hacer un pedido:

${itemsList}

*Total: $${total.toFixed(2)}*

Datos de entrega:
📝 Nombre: ${customerInfo.name}
📱 Teléfono: ${customerInfo.phone}
📍 Dirección: ${customerInfo.address}
🏢 Apto/Casa: ${customerInfo.apartment}

¡Gracias!`

    // fetch runtime config so whatsapp number can be changed without rebuild
    let whatsappNumber = "1234567890"
    try {
      const res = await fetch('/api/config')
      if (res.ok) {
        const cfg = await res.json()
        whatsappNumber = String(cfg?.whatsapp || whatsappNumber)
      }
    } catch (err) {
      // keep default
    }

    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

    // Clear cart and redirect to WhatsApp
    clearCart()
    window.open(whatsappURL, "_blank")

    setIsSubmitting(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCustomerInfo((prev) => ({ ...prev, [name]: value }))
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <Link href="/" className="inline-flex items-center text-sm hover:underline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('backToStore')}
            </Link>
          </div>
        </header>
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-semibold mb-4">{t('emptyCart')}</h1>
          <p className="text-muted-foreground mb-6">{t('addProductsToContinue')}</p>
          <Button asChild>
            <Link href="/">{t('viewProducts')}</Link>
          </Button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center text-sm hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToStore')}
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-8">{t('checkoutTitle')}</h1>
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>{t('deliveryInfo')}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('fullName')}</Label>
                    <Input
                      id="name"
                      name="name"
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Juan Pérez"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('phone')}</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="+57 300 123 4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">{t('address')}</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={customerInfo.address}
                      onChange={handleInputChange}
                      required
                      placeholder="Calle 123 #45-67"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apartment">{t('apartment')}</Label>
                    <Input
                      id="apartment"
                      name="apartment"
                      value={customerInfo.apartment}
                      onChange={handleInputChange}
                      placeholder="Apto 301"
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? t('processing') : t('sendOrderByWhatsapp')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          <div>
            <div className="relative">
              <Card>
                {/* Invoice verifier badge in the corner */}
                <div className="absolute top-3 right-3 pointer-events-none z-10">
                  <div className="bg-white dark:bg-slate-800 rounded-full p-1 shadow">
                    <CheckCircle className="h-5 w-5 text-emerald-600" aria-hidden />
                  </div>
                </div>

                <CardHeader>
                  <CardTitle>{t('orderSummary')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4">
                      <div className="relative h-16 w-16 flex-shrink-0">
                        <Image
                          src={item.product.image_url || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          ${item.product.price} x {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>{t('total')}:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
