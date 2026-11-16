"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/use-cart"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { CartSheet } from "./cart-sheet"
import { useTranslation } from "@/hooks/use-language"

export function CartFAB() {
  const { t } = useTranslation()
  const { items } = useCart()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="default"
          size="icon-lg"
          className="fixed bottom-6 right-6 z-50 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
          aria-label={t('cartTitle')}
        >
          <ShoppingCart className="h-6 w-6" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center border border-background">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{t('cartTitle')}</SheetTitle>
        </SheetHeader>
        <CartSheet />
      </SheetContent>
    </Sheet>
  )
}
