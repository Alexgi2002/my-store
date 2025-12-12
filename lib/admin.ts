import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || process.env.ADMIN_TOKEN || "dev-admin-secret"
const JWT_EXPIRES_SECONDS = Number(process.env.ADMIN_JWT_EXPIRES_SECONDS || 900) // default 15 minutes

export function signAdminJwt() {
  const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: `${JWT_EXPIRES_SECONDS}s` })
  return token
}

export function verifyAdminJwt(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return !!decoded
  } catch (e) {
    return false
  }
}

// Basic cookie parser helper to extract admin_jwt from cookie header
export function extractAdminJwtFromCookie(cookieHeader: string | null) {
  if (!cookieHeader) return null
  const match = cookieHeader.match(/(?:^|; )admin_jwt=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : null
}
