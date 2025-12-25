"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"

export default function AdminInfo() {
  const [cfg, setCfg] = useState<any | null>(null)
  const [manifest, setManifest] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const [cRes, mRes] = await Promise.all([fetch('/api/config'), fetch('/manifest.json')])
      const cJson = cRes.ok ? await cRes.json() : null
      const mJson = mRes.ok ? await mRes.json() : null
      setCfg(cJson)
      setManifest(mJson)
    } catch (err: any) {
      setError(err?.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function copy(text: string) {
    try {
      void navigator.clipboard.writeText(text)
      // no visual toast to keep component minimal
    } catch (e) {
      // ignore
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información de configuración</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Runtime config (/api/config)</h3>
            <div className="flex gap-2">
              <Button size="sm" onClick={load}>Actualizar</Button>
            </div>
          </div>

          {loading && <div className="text-muted-foreground">Cargando...</div>}
          {error && <div className="text-destructive">Error: {error}</div>}

          {!loading && cfg && (
            <pre className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-sm overflow-auto">
              {JSON.stringify(cfg, null, 2)}
            </pre>
          )}

          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Manifest (/manifest.json)</h3>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => { if (manifest) copy(JSON.stringify(manifest)) }}>
                <Copy className="mr-2 h-4 w-4" /> Copiar
              </Button>
            </div>
          </div>

          {!loading && manifest && (
            <pre className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-sm overflow-auto">
              {JSON.stringify(manifest, null, 2)}
            </pre>
          )}

          <div className="text-sm text-muted-foreground">Nota: estos datos provienen del servidor. Si cambias variables en Portainer, reinicia el contenedor para aplicar cambios.</div>
        </div>
      </CardContent>
    </Card>
  )
}
