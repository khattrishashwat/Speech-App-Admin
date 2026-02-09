import { useI18n } from "@/contexts/I18nContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const patternData = [
  { name: "Fronting", count: 245, color: "hsl(210,60%,55%)" },
  { name: "Deletion", count: 189, color: "hsl(160,45%,50%)" },
  { name: "Gliding", count: 134, color: "hsl(270,40%,60%)" },
  { name: "Stopping", count: 112, color: "hsl(42,80%,55%)" },
  { name: "Cluster Reduction", count: 78, color: "hsl(15,70%,55%)" },
];

export default function ErrorAnalysisPage() {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-2xl shadow-card p-5 border border-border">
          <h3 className="text-sm font-bold text-foreground mb-4">Pattern Frequency</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={patternData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,20%,90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {patternData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card rounded-2xl shadow-card p-5 border border-border">
          <h3 className="text-sm font-bold text-foreground mb-4">{t("speechPatterns")}</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={patternData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="count" stroke="none">
                {patternData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
              <Legend iconSize={10} wrapperStyle={{ fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
