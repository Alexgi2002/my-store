import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ShoppingBag } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold">Página no encontrada</h2>
          <p className="text-muted-foreground">Lo sentimos, la página que buscas no existe o ha sido movida.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Ir al inicio
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Ver productos
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
