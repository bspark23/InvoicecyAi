
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

type LangJson = { [key: string]: string };

const defaultLang = "en";
const fallbackTranslations: LangJson = {};

interface LanguageContextType {
  lang: string;
  setLang: (newLang: string) => void;
  t: (key: string) => string;
  availableLangs: { code: string, name: string }[];
}

const availableLangs = [
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
  { code: "yo", name: "Yorùbá" },
  { code: "ha", name: "Hausa" },
  { code: "ig", name: "Igbo" },
  { code: "es", name: "Español" },
  { code: "de", name: "Deutsch" }
];

const LanguageContext = createContext<LanguageContextType>({
  lang: defaultLang,
  setLang: () => {},
  t: key => key,
  availableLangs
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<string>(defaultLang);
  const [translations, setTranslations] = useState<LangJson>(fallbackTranslations);

  useEffect(() => {
    const stored = localStorage.getItem("invoiceease-language") || defaultLang;
    setLangState(stored);
  }, []);

  useEffect(() => {
    import(`../lang/${lang}.json`)
      .then(mod => setTranslations(mod.default))
      .catch(() => setTranslations(fallbackTranslations));
  }, [lang]);

  const setLang = (newLang: string) => {
    setLangState(newLang);
    localStorage.setItem("invoiceease-language", newLang);
  };

  const t = (key: string): string => translations[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, availableLangs }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
