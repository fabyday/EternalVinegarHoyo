import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { I18N_RESOURCES } from "./Resources";

export const SUPPORTED_LOCALES = ["ko", "en"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

const STORAGE_KEY = "bdih.locale";
const FALLBACK_LOCALE: SupportedLocale = "ko";

export function is_supported_locale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

function normalize_locale(locale?: string): SupportedLocale {
  const language = locale?.split("-")[0]?.toLowerCase();

  if (language && is_supported_locale(language)) {
    return language;
  }

  return FALLBACK_LOCALE;
}

export function resolve_initial_locale(): SupportedLocale {
  if (typeof window !== "undefined") {
    const savedLocale = window.localStorage.getItem(STORAGE_KEY);

    if (savedLocale && is_supported_locale(savedLocale)) {
      return savedLocale;
    }

    return normalize_locale(window.navigator.language);
  }

  return FALLBACK_LOCALE;
}

export async function change_renderer_locale(locale: SupportedLocale): Promise<void> {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, locale);
  }

  await i18n.changeLanguage(locale);
}

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources: I18N_RESOURCES,
    lng: resolve_initial_locale(),
    fallbackLng: FALLBACK_LOCALE,
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
  });
}

export default i18n;

