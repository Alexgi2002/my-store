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
  // Return runtime configuration strictly from environment variables.
  // This ensures the store is configured via container/Portainer env and not via mutable files or UI.
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