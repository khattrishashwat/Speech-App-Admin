import { useNavigate } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";

const sessions = [
  { id: 1, child: "Amaury T.", episode: "Morning Routine", duration: "5m 12s", pattern: "Fronting", date: "Feb 9, 2026" },
  { id: 2, child: "Léa M.", episode: "Animal Friends", duration: "3m 45s", pattern: "Deletion", date: "Feb 9, 2026" },
  { id: 3, child: "Noah B.", episode: "Color World", duration: "4m 08s", pattern: "Gliding", date: "Feb 8, 2026" },
  { id: 4, child: "Chloé R.", episode: "Food Fun", duration: "6m 21s", pattern: "Stopping", date: "Feb 8, 2026" },
  { id: 5, child: "Lucas D.", episode: "Bath Time", duration: "4m 55s", pattern: "Fronting", date: "Feb 7, 2026" },
];

export default function SessionsPage() {
  const { t } = useI18n();
  const navigate = useNavigate();

  return (
    <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead><tr className="bg-muted">
          <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">{t("childName")}</th>
          <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">{t("episodeName")}</th>
          <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">{t("duration")}</th>
          <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">{t("detectedPattern")}</th>
          <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Date</th>
          <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">{t("action")}</th>
        </tr></thead>
        <tbody>
          {sessions.map((s) => (
            <tr 
              key={s.id} 
              className="border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer"
              onClick={() => navigate(`/sessions/${s.id}`)}
            >
              <td className="px-5 py-3 font-medium text-foreground">{s.child}</td>
              <td className="px-5 py-3 text-muted-foreground">{s.episode}</td>
              <td className="px-5 py-3 text-muted-foreground">{s.duration}</td>
              <td className="px-5 py-3"><span className="px-2.5 py-1 rounded-full text-xs font-medium bg-sky text-sky-foreground">{s.pattern}</span></td>
              <td className="px-5 py-3 text-muted-foreground">{s.date}</td>
              <td className="px-5 py-3">
                <button 
                  className="text-xs font-medium text-primary hover:underline"
                  onClick={(e) => { e.stopPropagation(); navigate(`/sessions/${s.id}`); }}
                >
                  {t("view")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
