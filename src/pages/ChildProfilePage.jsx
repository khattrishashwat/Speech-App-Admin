import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";
import { ArrowLeft, Users, Calendar, Award, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, LineChart, Line } from "recharts";

const childrenData = {
  "1": {
    name: "Amaury T.",
    age: "2y 4m",
    level: "Intermediate",
    lastActive: "Today",
    joinDate: "Oct 15, 2025",
    totalSessions: 48,
    avgDuration: "4m 32s",
    sessions: [
      { id: 1, episode: "Morning Routine", duration: "5m 12s", pattern: "Fronting", date: "Feb 9, 2026" },
      { id: 2, episode: "Animal Friends", duration: "4m 45s", pattern: "Gliding", date: "Feb 8, 2026" },
      { id: 3, episode: "Color World", duration: "3m 58s", pattern: "Deletion", date: "Feb 7, 2026" },
      { id: 4, episode: "Food Fun", duration: "5m 21s", pattern: "Stopping", date: "Feb 6, 2026" },
    ],
    patterns: [
      { name: "Fronting", count: 18 },
      { name: "Gliding", count: 12 },
      { name: "Deletion", count: 8 },
      { name: "Stopping", count: 6 },
      { name: "Cluster Red.", count: 4 },
    ],
    progress: [
      { week: "Week 1", sessions: 8, words: 12 },
      { week: "Week 2", sessions: 10, words: 18 },
      { week: "Week 3", sessions: 12, words: 24 },
      { week: "Week 4", sessions: 14, words: 32 },
      { week: "Week 5", sessions: 15, words: 38 },
    ],
  },
  "2": {
    name: "Léa M.",
    age: "1y 8m",
    level: "Beginner",
    lastActive: "Yesterday",
    joinDate: "Dec 3, 2025",
    totalSessions: 24,
    avgDuration: "3m 45s",
    sessions: [
      { id: 1, episode: "Animal Friends", duration: "3m 45s", pattern: "Deletion", date: "Feb 8, 2026" },
      { id: 2, episode: "Morning Routine", duration: "4m 12s", pattern: "Fronting", date: "Feb 7, 2026" },
    ],
    patterns: [
      { name: "Deletion", count: 14 },
      { name: "Fronting", count: 8 },
      { name: "Stopping", count: 2 },
    ],
    progress: [
      { week: "Week 1", sessions: 5, words: 8 },
      { week: "Week 2", sessions: 7, words: 12 },
      { week: "Week 3", sessions: 8, words: 16 },
      { week: "Week 4", sessions: 10, words: 22 },
    ],
  },
};

export default function ChildProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState("overview");

  const childId = id || "1";
  const child = childrenData[childId] || childrenData["1"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/children")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-lavender flex items-center justify-center">
            <Users className="h-7 w-7 text-lavender-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{child.name}</h2>
            <p className="text-sm text-muted-foreground">Age: {child.age} • {child.level}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted rounded-xl p-1">
          <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
          <TabsTrigger value="sessions" className="rounded-lg">Sessions</TabsTrigger>
          <TabsTrigger value="patterns" className="rounded-lg">Speech Patterns</TabsTrigger>
          <TabsTrigger value="progress" className="rounded-lg">Progress</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card rounded-2xl shadow-card border border-border p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-sky flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-sky-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">Joined</span>
              </div>
              <p className="text-xl font-bold text-foreground">{child.joinDate}</p>
            </div>
            <div className="bg-card rounded-2xl shadow-card border border-border p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-mint flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-mint-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">Total Sessions</span>
              </div>
              <p className="text-xl font-bold text-foreground">{child.totalSessions}</p>
            </div>
            <div className="bg-card rounded-2xl shadow-card border border-border p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-lavender flex items-center justify-center">
                  <Award className="h-5 w-5 text-lavender-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">Avg. Duration</span>
              </div>
              <p className="text-xl font-bold text-foreground">{child.avgDuration}</p>
            </div>
            <div className="bg-card rounded-2xl shadow-card border border-border p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-warm flex items-center justify-center">
                  <Users className="h-5 w-5 text-warm-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">Last Active</span>
              </div>
              <p className="text-xl font-bold text-foreground">{child.lastActive}</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-6 bg-card rounded-2xl shadow-card border border-border p-6">
            <h3 className="font-bold text-foreground mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {child.sessions.slice(0, 3).map((session) => (
                <div 
                  key={session.id}
                  onClick={() => navigate(`/sessions/${session.id}`)}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                >
                  <div>
                    <p className="font-medium text-foreground">{session.episode}</p>
                    <p className="text-xs text-muted-foreground">{session.date} • {session.duration}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-sky text-sky-foreground">
                    {session.pattern}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions">
          <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Episode</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Duration</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Pattern</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">{t("action")}</th>
                </tr>
              </thead>
              <tbody>
                {child.sessions.map((session) => (
                  <tr 
                    key={session.id} 
                    className="border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer"
                    onClick={() => navigate(`/sessions/${session.id}`)}
                  >
                    <td className="px-5 py-3 font-medium text-foreground">{session.episode}</td>
                    <td className="px-5 py-3 text-muted-foreground">{session.duration}</td>
                    <td className="px-5 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-sky text-sky-foreground">
                        {session.pattern}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{session.date}</td>
                    <td className="px-5 py-3">
                      <button className="text-xs font-medium text-primary hover:underline">{t("view")}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Speech Patterns Tab */}
        <TabsContent value="patterns">
          <div className="bg-card rounded-2xl shadow-card border border-border p-6">
            <h3 className="font-bold text-foreground mb-4">Speech Pattern Frequency</h3>
            <p className="text-sm text-muted-foreground mb-6">
              These patterns show common developmental speech characteristics. This is informational only.
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={child.patterns} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--sky))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-card rounded-2xl shadow-card border border-border p-6">
              <h3 className="font-bold text-foreground mb-4">Sessions Over Time</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={child.progress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Line type="monotone" dataKey="sessions" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-card rounded-2xl shadow-card border border-border p-6">
              <h3 className="font-bold text-foreground mb-4">Words Learned</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={child.progress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Bar dataKey="words" fill="hsl(var(--mint))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}