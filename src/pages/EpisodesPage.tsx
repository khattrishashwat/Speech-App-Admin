import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";
import { BookOpen, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

const initialEpisodes = [
  { id: 1, name: "Morning Routine", theme: "Daily Life", age: "12-24m", status: "Active" },
  { id: 2, name: "Animal Friends", theme: "Animals", age: "18-36m", status: "Active" },
  { id: 3, name: "Color World", theme: "Colors", age: "12-24m", status: "Draft" },
  { id: 4, name: "Food Fun", theme: "Food", age: "6-18m", status: "Active" },
  { id: 5, name: "Bath Time", theme: "Hygiene", age: "12-24m", status: "Active" },
  { id: 6, name: "Bedtime Story", theme: "Night Routine", age: "18-36m", status: "Draft" },
];

export default function EpisodesPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [episodes, setEpisodes] = useState(initialEpisodes);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newEpisode, setNewEpisode] = useState({ name: "", theme: "", age: "12-24m" });

  const filteredEpisodes = episodes.filter(ep => 
    ep.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ep.theme.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddEpisode = () => {
    if (!newEpisode.name || !newEpisode.theme) {
      toast.error("Please fill all fields");
      return;
    }
    const newId = Math.max(...episodes.map(e => e.id)) + 1;
    setEpisodes([...episodes, { ...newEpisode, id: newId, status: "Draft" }]);
    setNewEpisode({ name: "", theme: "", age: "12-24m" });
    setShowAddDialog(false);
    toast.success("Episode created!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={t("search") + "..."} 
            className="pl-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="gap-2" onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4" /> Add Episode
        </Button>
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
            {filteredEpisodes.map((ep) => (
              <tr 
                key={ep.id} 
                className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/episodes/${ep.id}`)}
              >
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
                  <button 
                    className="text-xs font-medium text-primary hover:underline"
                    onClick={(e) => { e.stopPropagation(); navigate(`/episodes/${ep.id}`); }}
                  >
                    {t("view")}
                  </button>
                  <button 
                    className="text-xs font-medium text-muted-foreground hover:underline"
                    onClick={(e) => { e.stopPropagation(); navigate(`/episodes/${ep.id}?mode=edit`); }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Episode Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Episode</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-2">Episode Name</label>
              <Input 
                value={newEpisode.name}
                onChange={(e) => setNewEpisode({ ...newEpisode, name: e.target.value })}
                placeholder="e.g. Morning Routine"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <Input 
                value={newEpisode.theme}
                onChange={(e) => setNewEpisode({ ...newEpisode, theme: e.target.value })}
                placeholder="e.g. Daily Life"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Age Group</label>
              <select 
                value={newEpisode.age}
                onChange={(e) => setNewEpisode({ ...newEpisode, age: e.target.value })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="6-12m">6-12 months</option>
                <option value="12-24m">12-24 months</option>
                <option value="18-36m">18-36 months</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddEpisode}>Create Episode</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
