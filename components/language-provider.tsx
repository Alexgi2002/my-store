'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { Language, Translations, getTranslations, DEFAULT_LANGUAGE, isValidLanguage } from '@/lib/i18n'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: keyof Translations) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE)

  // Load persisted language from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('my-store-lang')
      if (stored && isValidLanguage(stored)) {
        setLanguageState(stored)
      }
      // Persist to cookie so Server Components can read it
      document.cookie = `language=${language}; path=/; max-age=31536000; SameSite=Lax`
    } catch {
      // ignore
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    try {
      localStorage.setItem('my-store-lang', lang)
      document.cookie = `language=${lang}; path=/; max-age=31536000; SameSite=Lax`
    } catch {
      // ignore
    }
  }

  const translations = getTranslations(language)

  const t = (key: keyof Translations): string => {
    return translations[key] ?? key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
