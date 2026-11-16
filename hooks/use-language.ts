import { useLanguage } from '@/components/language-provider'
import { Language } from '@/lib/i18n'

export function useTranslation() {
  const { language, setLanguage, t } = useLanguage()
  return { language, setLanguage, t }
}

export type { Language }
