import fs from "fs/promises"
import path from "path"

function mapRuntime(obj: any) {
  return {
    whatsapp: obj.WHATSAPP_NUMBER || obj.whatsapp || null,
    storeName: obj.STORE_NAME || obj.storeName || null,
    storeDescription: obj.STORE_DESCRIPTION || obj.storeDescription || null,
    storeIcon: obj.STORE_ICON || obj.storeIcon || null,
    storeOgImage: obj.STORE_OG_IMAGE || obj.storeOgImage || null,
    baseUrl: obj.NEXT_PUBLIC_URL || obj.baseUrl || null,
  }
}

export async function GET() {
  // Try reading a runtime config file written by the entrypoint or admin UI.
  try {
    const jsonPath = path.join(process.cwd(), "public", "runtime-config.json")
    const jsPath = path.join(process.cwd(), "public", "runtime-config.js")

    // Prefer JSON file if present
    try {
      const raw = await fs.readFile(jsonPath, "utf8")
      const parsed = JSON.parse(raw)
      return Response.json(mapRuntime(parsed))
    } catch (e) {
      // ignore, try JS file next
    }

    // If JS file is present, try to extract the JSON object from it.
    try {
      const raw = await fs.readFile(jsPath, "utf8")
      // Expect something like: window.__RUNTIME_CONFIG__ = { ... };
      const m = raw.match(/window\.__RUNTIME_CONFIG__\s*=\s*(\{[\s\S]*\})/) 
      if (m && m[1]) {
        const parsed = JSON.parse(m[1])
        return Response.json(mapRuntime(parsed))
      }
    } catch (e) {
      // ignore and fallback to env
    }
  } catch (e) {
    // ignore and fallback to env
  }

  // Fallback to env vars
  return Response.json(
    mapRuntime({
      WHATSAPP_NUMBER: process.env.WHATSAPP_NUMBER,
      STORE_NAME: process.env.STORE_NAME,
      STORE_DESCRIPTION: process.env.STORE_DESCRIPTION,
      STORE_ICON: process.env.STORE_ICON,
      STORE_OG_IMAGE: process.env.STORE_OG_IMAGE,
      NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    })
  )
}