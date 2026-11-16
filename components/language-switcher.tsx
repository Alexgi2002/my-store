'use client'

import { useTranslation } from '@/hooks/use-language'
import { LANGUAGES } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation()

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value as typeof language)}
      className={cn(
        'bg-transparent border border-input rounded-md px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors',
      )}
    >
      {Object.values(LANGUAGES).map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.native}
        </option>
      ))}
    </select>
  )
}
