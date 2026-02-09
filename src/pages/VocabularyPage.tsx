import { useI18n } from "@/contexts/I18nContext";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const words = [
  { word: "Mama", lang: "Creole", category: "Family", active: true },
  { word: "Dog", lang: "English", category: "Animals", active: true },
  { word: "Ball", lang: "English", category: "Toys", active: true },
  { word: "Dlo", lang: "Creole", category: "Food & Drink", active: false },
  { word: "Baby", lang: "English", category: "Family", active: true },
];

export default function VocabularyPage() {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder={t("search") + "..."} className="pl-10" />
      </div>
      <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-muted">
            <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Word</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Language</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Category</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Active</th>
          </tr></thead>
          <tbody>
            {words.map((w, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50">
                <td className="px-5 py-3 font-medium text-foreground">{w.word}</td>
                <td className="px-5 py-3 text-muted-foreground">{w.lang}</td>
                <td className="px-5 py-3 text-muted-foreground">{w.category}</td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${w.active ? "bg-mint text-mint-foreground" : "bg-muted text-muted-foreground"}`}>
                    {w.active ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
