import { Pool } from 'pg'

let pool: Pool | null = null

export function getPool() {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL not set')
    }
    pool = new Pool({ connectionString: process.env.DATABASE_URL })
  }
  return pool
}

export async function query(text: string, params?: any[]) {
  const p = getPool()
  return p.query(text, params)
}
