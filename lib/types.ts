import type { Language } from '@/lib/i18n'

export interface ProductTranslation {
  language: Language
  name: string
  description: string | null
}

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  stock: number
  created_at: string
  updated_at: string
  translations?: ProductTranslation[]
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface CustomerInfo {
  name: string
  phone: string
  address: string
  apartment: string
}

export interface Banner {
  id: string
  title: string
  image_url: string
  link: string | null
  active: boolean
  order_index: number
  created_at: string
  updated_at: string
}
