import { useState } from "react";
import { useI18n } from "@/contexts/I18nContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Calendar, Filter } from "lucide-react";

const patternData = [
  { name: "Fronting", count: 245, color: "hsl(210,60%,55%)" },
  { name: "Deletion", count: 189, color: "hsl(160,45%,50%)" },
  { name: "Gliding", count: 134, color: "hsl(270,40%,60%)" },
  { name: "Stopping", count: 112, color: "hsl(42,80%,55%)" },
  { name: "Cluster Reduction", count: 78, color: "hsl(15,70%,55%)" },
];

const ageGroupPatternData = [
  { age: "6-12m", Fronting: 45, Deletion: 38, Gliding: 22, Stopping: 18, ClusterReduction: 12 },
  { age: "12-18m", Fronting: 72, Deletion: 58, Gliding: 42, Stopping: 35, ClusterReduction: 24 },
  { age: "18-24m", Fronting: 85, Deletion: 62, Gliding: 48, Stopping: 38, ClusterReduction: 28 },
  { age: "24-36m", Fronting: 43, Deletion: 31, Gliding: 22, Stopping: 21, ClusterReduction: 14 },
];

const episodePatternData = [
  { episode: "Morning Routine", patterns: 156 },
  { episode: "Animal Friends", patterns: 134 },
  { episode: "Color World", patterns: 98 },
  { episode: "Food Fun", patterns: 87 },
  { episode: "Bath Time", patterns: 72 },
];

export default function ErrorAnalysisPage() {
  const { t } = useI18n();
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("all");
  const [dateRange, setDateRange] = useState("last30days");

  const filteredPatternData = selectedAgeGroup === "all" 
    ? patternData 
    : patternData.map(p => ({ ...p, count: Math.floor(p.count * (0.5 + Math.random() * 0.5)) }));

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-card rounded-xl px-4 py-2 border border-border">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select 
            value={selectedAgeGroup}
            onChange={(e) => setSelectedAgeGroup(e.target.value)}
            className="bg-transparent text-sm font-medium focus:outline-none"
          >
            <option value="all">All Age Groups</option>
            <option value="6-12m">6-12 months</option>
            <option value="12-18m">12-18 months</option>
            <option value="18-24m">18-24 months</option>
            <option value="24-36m">24-36 months</option>
          </select>
        </div>
        <div className="flex items-center gap-2 bg-card rounded-xl px-4 py-2 border border-border">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-transparent text-sm font-medium focus:outline-none"
          >
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
            <option value="last90days">Last 90 Days</option>
            <option value="alltime">All Time</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar Chart */}
        <div className="bg-card rounded-2xl shadow-card p-5 border border-border">
          <h3 className="text-sm font-bold text-foreground mb-4">Pattern Frequency</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={filteredPatternData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,20%,90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {filteredPatternData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-card rounded-2xl shadow-card p-5 border border-border">
          <h3 className="text-sm font-bold text-foreground mb-4">{t("speechPatterns")} Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={filteredPatternData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="count" stroke="none">
                {filteredPatternData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Legend iconSize={10} wrapperStyle={{ fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Patterns by Age Group */}
      <div className="bg-card rounded-2xl shadow-card p-5 border border-border">
        <h3 className="text-sm font-bold text-foreground mb-4">Patterns by Age Group</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ageGroupPatternData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,20%,90%)" />
            <XAxis dataKey="age" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px"
              }}
            />
            <Legend />
            <Bar dataKey="Fronting" fill="hsl(210,60%,55%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Deletion" fill="hsl(160,45%,50%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Gliding" fill="hsl(270,40%,60%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Stopping" fill="hsl(42,80%,55%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="ClusterReduction" name="Cluster Reduction" fill="hsl(15,70%,55%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Patterns by Episode */}
      <div className="bg-card rounded-2xl shadow-card p-5 border border-border">
        <h3 className="text-sm font-bold text-foreground mb-4">Patterns by Episode</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={episodePatternData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,20%,90%)" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="episode" width={120} tick={{ fontSize: 11 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px"
              }}
            />
            <Bar dataKey="patterns" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Information Panel */}
      <div className="bg-mint/20 rounded-2xl border border-mint p-5">
        <h4 className="font-bold text-foreground mb-2">About Speech Patterns</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          These speech patterns are common developmental characteristics observed in young children learning to speak. 
          They are not errors or problems, but natural stages of language development. Most children naturally 
          outgrow these patterns as their speech matures. This analysis helps track patterns for informational purposes only.
        </p>
      </div>
    </div>
  );
}