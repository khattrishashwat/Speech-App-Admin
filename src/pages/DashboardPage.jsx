import { useNavigate } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";
import { Users, Clock, BookOpen, AudioWaveform, Timer } from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const summaryCards = [
  { key: "totalChildren", icon: Users, value: "1,284", color: "bg-sky text-sky-foreground" },
  { key: "totalSessions", icon: Clock, value: "8,932", color: "bg-mint text-mint-foreground" },
  { key: "activeEpisodes", icon: BookOpen, value: "24", color: "bg-lavender text-lavender-foreground" },
  { key: "commonPattern", icon: AudioWaveform, value: "Fronting", color: "bg-warm text-warm-foreground" },
  { key: "avgDuration", icon: Timer, value: "4m 32s", color: "bg-peach text-peach-foreground" },
];

const speechPatternData = [
  { name: "Fronting", value: 32, color: "hsl(210, 60%, 55%)" },
  { name: "Deletion", value: 24, color: "hsl(160, 45%, 50%)" },
  { name: "Gliding", value: 18, color: "hsl(270, 40%, 60%)" },
  { name: "Stopping", value: 15, color: "hsl(42, 80%, 55%)" },
  { name: "Cluster Reduction", value: 11, color: "hsl(15, 70%, 55%)" },
];

const ageGroupData = [
  { age: "6-12m", Fronting: 12, Deletion: 8, Gliding: 5, Stopping: 4 },
  { age: "12-18m", Fronting: 18, Deletion: 14, Gliding: 10, Stopping: 7 },
  { age: "18-24m", Fronting: 22, Deletion: 16, Gliding: 12, Stopping: 9 },
  { age: "24-36m", Fronting: 15, Deletion: 10, Gliding: 8, Stopping: 6 },
];

const episodeUsageData = [
  { id: 1, name: "Morning Routine", sessions: 342 },
  { id: 2, name: "Animal Friends", sessions: 289 },
  { id: 3, name: "Color World", sessions: 256 },
  { id: 4, name: "Food Fun", sessions: 198 },
  { id: 5, name: "Bath Time", sessions: 176 },
];

const recentSessions = [
  { id: 1, child: "Amaury T.", episode: "Morning Routine", duration: "5m 12s", pattern: "Fronting" },
  { id: 2, child: "Léa M.", episode: "Animal Friends", duration: "3m 45s", pattern: "Deletion" },
  { id: 3, child: "Noah B.", episode: "Color World", duration: "4m 08s", pattern: "Gliding" },
  { id: 4, child: "Chloé R.", episode: "Food Fun", duration: "6m 21s", pattern: "Stopping" },
  { id: 5, child: "Lucas D.", episode: "Bath Time", duration: "4m 55s", pattern: "Fronting" },
];

const insights = [
  "Fronting remains the most frequently observed pattern across all age groups.",
  "Children aged 18–24 months show the highest engagement with story episodes.",
  "Average session duration has increased by 12% this month.",
  "\"Morning Routine\" is the most popular episode among toddlers.",
];

export default function DashboardPage() {
  const { t } = useI18n();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {summaryCards.map((card) => (
          <div 
            key={card.key} 
            className="bg-card rounded-2xl shadow-card p-5 border border-border flex items-start gap-4 hover:shadow-elevated transition-shadow cursor-pointer"
            onClick={() => {
              if (card.key === "totalChildren") navigate("/children");
              else if (card.key === "totalSessions") navigate("/sessions");
              else if (card.key === "activeEpisodes") navigate("/episodes");
              else if (card.key === "commonPattern") navigate("/error-analysis");
            }}
          >
            <div className={`h-11 w-11 rounded-xl ${card.color} flex items-center justify-center shrink-0`}>
              <card.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground font-medium">{t(card.key)}</p>
              <p className="text-xl font-bold text-foreground mt-0.5">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Donut Chart */}
        <div className="bg-card rounded-2xl shadow-card p-5 border border-border">
          <h3 className="text-sm font-bold text-foreground mb-4">{t("speechPatterns")}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={speechPatternData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                {speechPatternData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend iconSize={10} wrapperStyle={{ fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Age Group Chart */}
        <div className="bg-card rounded-2xl shadow-card p-5 border border-border">
          <h3 className="text-sm font-bold text-foreground mb-4">{t("patternsByAge")}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ageGroupData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,20%,90%)" />
              <XAxis dataKey="age" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="Fronting" fill="hsl(210,60%,55%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Deletion" fill="hsl(160,45%,50%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Gliding" fill="hsl(270,40%,60%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Stopping" fill="hsl(42,80%,55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Episode Usage Chart */}
        <div className="bg-card rounded-2xl shadow-card p-5 border border-border">
          <h3 className="text-sm font-bold text-foreground mb-4">{t("episodeUsage")}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={episodeUsageData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,20%,90%)" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar 
                dataKey="sessions" 
                fill="hsl(210,60%,55%)" 
                radius={[0, 4, 4, 0]}
                onClick={(data) => navigate(`/episodes/${data.id}`)}
                className="cursor-pointer"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Sessions */}
        <div className="lg:col-span-2 bg-card rounded-2xl shadow-card border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">{t("recentSessions")}</h3>
            <button 
              onClick={() => navigate("/sessions")}
              className="text-xs font-medium text-primary hover:underline"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">{t("childName")}</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">{t("episodeName")}</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">{t("duration")}</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">{t("detectedPattern")}</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">{t("action")}</th>
                </tr>
              </thead>
              <tbody>
                {recentSessions.map((s) => (
                  <tr 
                    key={s.id} 
                    className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/sessions/${s.id}`)}
                  >
                    <td className="px-5 py-3 font-medium text-foreground">{s.child}</td>
                    <td className="px-5 py-3 text-muted-foreground">{s.episode}</td>
                    <td className="px-5 py-3 text-muted-foreground">{s.duration}</td>
                    <td className="px-5 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-sky text-sky-foreground">
                        {s.pattern}
                      </span>
                    </td>
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
        </div>

        {/* Insights */}
        <div className="bg-card rounded-2xl shadow-card p-5 border border-border">
          <h3 className="text-sm font-bold text-foreground mb-4">{t("insights")}</h3>
          <div className="space-y-3">
            {insights.map((insight, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-xl bg-muted">
                <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}