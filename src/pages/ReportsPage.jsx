import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const reports = [
  { name: "Monthly Speech Analysis", date: "Feb 2026", type: "PDF" },
  { name: "Episode Engagement Report", date: "Jan 2026", type: "PDF" },
  { name: "Child Progress Summary", date: "Jan 2026", type: "CSV" },
  { name: "Pattern Distribution Q4", date: "Dec 2025", type: "PDF" },
];

export default function ReportsPage() {
  return (
    <div className="space-y-4">
      {reports.map((r, i) => (
        <div key={i} className="bg-card rounded-2xl shadow-card p-5 border border-border flex items-center justify-between hover:shadow-elevated transition-shadow">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-lavender flex items-center justify-center">
              <FileText className="h-5 w-5 text-lavender-foreground" />
            </div>
            <div>
              <p className="font-bold text-sm text-foreground">{r.name}</p>
              <p className="text-xs text-muted-foreground">{r.date} · {r.type}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" /> Download
          </Button>
        </div>
      ))}
    </div>
  );
}