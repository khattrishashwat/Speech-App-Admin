import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";
import { BookOpen, Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

const initialEpisodes = [
  { id: 1, name: "Morning Routine", category: "Daily Life", age: "12-24m", status: "Active" },
  { id: 2, name: "Animal Friends", category: "Animals", age: "18-36m", status: "Active" },
  { id: 3, name: "Color World", category: "Colors", age: "12-24m", status: "Draft" },
  { id: 4, name: "Food Fun", category: "Food", age: "6-18m", status: "Active" },
  { id: 5, name: "Bath Time", category: "Hygiene", age: "12-24m", status: "Active" },
  { id: 6, name: "Bedtime Story", category: "Night Routine", age: "18-36m", status: "Draft" },
];

export default function EpisodesPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [episodes, setEpisodes] = useState(initialEpisodes);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add"); // "add" or "edit"
  const [currentEpisode, setCurrentEpisode] = useState({ id: null, name: "", category: "", age: "12-24m" });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const filteredEpisodes = episodes.filter(ep => 
    ep.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ep.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAddDialog = () => {
    setDialogMode("add");
    setCurrentEpisode({ id: null, name: "", category: "", age: "12-24m" });
    setShowDialog(true);
  };

  const handleOpenEditDialog = (episode, e) => {
    e.stopPropagation();
    setDialogMode("edit");
    setCurrentEpisode({ 
      id: episode.id, 
      name: episode.name, 
      category: episode.category, 
      age: episode.age 
    });
    setShowDialog(true);
  };

  const handleSaveEpisode = () => {
    if (!currentEpisode.name || !currentEpisode.category) {
      toast.error("Please fill all fields");
      return;
    }

    if (dialogMode === "add") {
      const newId = Math.max(...episodes.map(e => e.id), 0) + 1;
      setEpisodes([...episodes, { 
        ...currentEpisode, 
        id: newId, 
        status: "Draft" 
      }]);
      toast.success("Episode created!");
    } else {
      setEpisodes(episodes.map(ep => 
        ep.id === currentEpisode.id 
          ? { ...ep, ...currentEpisode }
          : ep
      ));
      toast.success("Episode updated!");
    }
    
    setShowDialog(false);
    setCurrentEpisode({ id: null, name: "", category: "", age: "12-24m" });
  };

  const handleDeleteClick = (id, e) => {
    e.stopPropagation();
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = () => {
    setEpisodes(episodes.filter(ep => ep.id !== deleteConfirmId));
    setDeleteConfirmId(null);
    toast.success("Episode deleted!");
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
        <Button className="gap-2" onClick={handleOpenAddDialog}>
          <Plus className="h-4 w-4" /> Add Episode
        </Button>
      </div>

      <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Episode Name</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Category</th>
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
                <td className="px-5 py-3 text-muted-foreground">{ep.category}</td>
                <td className="px-5 py-3 text-muted-foreground">{ep.age}</td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    ep.status === "Active" ? "bg-mint text-mint-foreground" : "bg-warm text-warm-foreground"
                  }`}>
                    {ep.status}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    <button 
                      className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                      onClick={(e) => { e.stopPropagation(); navigate(`/episodes/${ep.id}`); }}
                    >
                      <BookOpen className="h-3 w-3" /> {t("view")}
                    </button>
                    <button 
                      className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1"
                      onClick={(e) => handleOpenEditDialog(ep, e)}
                    >
                      <Pencil className="h-3 w-3" /> Edit
                    </button>
                    <button 
                      className="text-xs font-medium text-red-600 hover:underline flex items-center gap-1"
                      onClick={(e) => handleDeleteClick(ep.id, e)}
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Episode Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogMode === "add" ? "Add New Episode" : "Edit Episode"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-2">Episode Name</label>
              <Input 
                value={currentEpisode.name}
                onChange={(e) => setCurrentEpisode({ ...currentEpisode, name: e.target.value })}
                placeholder="e.g. Morning Routine"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Input 
                value={currentEpisode.category}
                onChange={(e) => setCurrentEpisode({ ...currentEpisode, category: e.target.value })}
                placeholder="e.g. Daily Life"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Age Group</label>
              <select 
                value={currentEpisode.age}
                onChange={(e) => setCurrentEpisode({ ...currentEpisode, age: e.target.value })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="6-12m">6-12 months</option>
                <option value="12-24m">12-24 months</option>
                <option value="18-36m">18-36 months</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveEpisode}>
              {dialogMode === "add" ? "Create Episode" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmId !== null} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Episode</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this episode? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}