import { useMarketStore } from "@/store/useMarketStore";
import { id } from "@/locales/id";
import { en } from "@/locales/en";

export const useTranslation = () => {
  const language = useMarketStore((state) => state.language);
  
  const translations = language === "en" ? en : id;
  
  return translations;
};
