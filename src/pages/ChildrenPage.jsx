import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialChildren = [
  { id: 1, name: "Amaury T.", age: "2y 4m", level: "Intermediate", lastActive: "Today" },
  { id: 2, name: "Léa M.", age: "1y 8m", level: "Beginner", lastActive: "Yesterday" },
  { id: 3, name: "Noah B.", age: "2y 1m", level: "Advanced", lastActive: "Today" },
  { id: 4, name: "Chloé R.", age: "1y 2m", level: "Beginner", lastActive: "3 days ago" },
  { id: 5, name: "Lucas D.", age: "2y 9m", level: "Intermediate", lastActive: "Today" },
];

export default function ChildrenPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChildren = initialChildren.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder={t("search") + "..."} 
          className="pl-10" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChildren.map((c) => (
          <div 
            key={c.id} 
            className="bg-card rounded-2xl shadow-card p-5 border border-border hover:shadow-elevated transition-shadow cursor-pointer"
            onClick={() => navigate(`/children/${c.id}`)}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-lavender flex items-center justify-center">
                <Users className="h-5 w-5 text-lavender-foreground" />
              </div>
              <div>
                <p className="font-bold text-foreground">{c.name}</p>
                <p className="text-xs text-muted-foreground">Age: {c.age}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-sky text-sky-foreground">{c.level}</span>
              <span className="text-xs text-muted-foreground">{c.lastActive}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-3"
              onClick={(e) => { e.stopPropagation(); navigate(`/children/${c.id}`); }}
            >
              {t("view")} Profile
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}