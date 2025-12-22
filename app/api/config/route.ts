export async function GET() {
  return Response.json({
    whatsapp: process.env.WHATSAPP_NUMBER || null,
    storeName: process.env.STORE_NAME || null,
    storeDescription: process.env.STORE_DESCRIPTION || null,
    storeIcon: process.env.STORE_ICON || null,
    storeOgImage: process.env.STORE_OG_IMAGE || null,
    baseUrl: process.env.NEXT_PUBLIC_URL || null,
  })
}