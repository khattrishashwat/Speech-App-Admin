import { useI18n } from "@/contexts/I18nContext";
import { Globe } from "lucide-react";

export function LanguageSelector({ variant = "default" }) {
  const { lang, setLang, languages } = useI18n();

  return (
    <div className="relative inline-flex items-center gap-1.5">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className={`bg-transparent text-sm font-medium text-foreground border-none outline-none cursor-pointer ${
          variant === "minimal" ? "pr-1" : "pr-2"
        }`}
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}