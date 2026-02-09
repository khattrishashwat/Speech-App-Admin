import { AdminLayout } from "@/components/AdminLayout";
import { useI18n } from "@/contexts/I18nContext";
import { BookOpen, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const episodes = [
  { name: "Morning Routine", theme: "Daily Life", age: "12-24m", status: "Active" },
  { name: "Animal Friends", theme: "Animals", age: "18-36m", status: "Active" },
  { name: "Color World", theme: "Colors", age: "12-24m", status: "Draft" },
  { name: "Food Fun", theme: "Food", age: "6-18m", status: "Active" },
  { name: "Bath Time", theme: "Hygiene", age: "12-24m", status: "Active" },
  { name: "Bedtime Story", theme: "Night Routine", age: "18-36m", status: "Draft" },
];

export default function EpisodesPage() {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={t("search") + "..."} className="pl-10" />
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Add Episode</Button>
      </div>

      <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Episode Name</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Theme</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Age Group</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">{t("action")}</th>
            </tr>
          </thead>
          <tbody>
            {episodes.map((ep, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <td className="px-5 py-3 font-medium text-foreground flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" /> {ep.name}
                </td>
                <td className="px-5 py-3 text-muted-foreground">{ep.theme}</td>
                <td className="px-5 py-3 text-muted-foreground">{ep.age}</td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    ep.status === "Active" ? "bg-mint text-mint-foreground" : "bg-warm text-warm-foreground"
                  }`}>
                    {ep.status}
                  </span>
                </td>
                <td className="px-5 py-3 flex gap-2">
                  <button className="text-xs font-medium text-primary hover:underline">{t("view")}</button>
                  <button className="text-xs font-medium text-muted-foreground hover:underline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
