// Small client helper for admin requests
export function getAdminHeaders(contentType: string | null = null) {
  // Do not automatically attach any client-stored admin token.
  // Authentication is performed via the HttpOnly cookie `admin_jwt` set by the server.
  const headers: Record<string, string> = {}
  if (contentType) headers["Content-Type"] = contentType
  return headers
}

export function clearAdminAuth() {
  try {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("adminAuth")
    }
  } catch (e) {
    // ignore
  }
}
