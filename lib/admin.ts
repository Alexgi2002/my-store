import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || process.env.ADMIN_TOKEN
const JWT_EXPIRES_SECONDS = Number(process.env.ADMIN_JWT_EXPIRES_SECONDS || 900) // default 15 minutes

export function signAdminJwt() {
  if (!JWT_SECRET) {
    throw new Error("ADMIN_JWT_SECRET or ADMIN_TOKEN must be configured")
  }
  const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: `${JWT_EXPIRES_SECONDS}s` })
  return token
}

export function verifyAdminJwt(token: string) {
  if (!JWT_SECRET) return false
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

/**
 * Centralized admin authorization guard.
 *
 * Default-deny policy: if neither ADMIN_JWT_SECRET nor ADMIN_TOKEN is configured,
 * access is denied. This protects admin endpoints by default so an accidental
 * deployment without secrets never exposes the admin API.
 *
 * Set ADMIN_JWT_SECRET (recommended) or ADMIN_TOKEN in your environment to enable
 * admin access. See README-DEPLOY.md for production setup.
 */
export function requireAdmin(request: Request): boolean {
  const adminToken = process.env.ADMIN_TOKEN
  const hasJwtSecret = !!(process.env.ADMIN_JWT_SECRET || process.env.ADMIN_TOKEN)

  // Default-deny: no admin secret configured -> reject all admin requests
  if (!hasJwtSecret) return false

  // Header-based token (backwards compatibility)
  const provided = request.headers.get("x-admin-token")
  if (adminToken && provided === adminToken) return true

  // Cookie-based JWT
  const cookieHeader = request.headers.get("cookie") || null
  const jwtToken = extractAdminJwtFromCookie(cookieHeader)
  if (jwtToken && verifyAdminJwt(jwtToken)) return true

  return false
}
