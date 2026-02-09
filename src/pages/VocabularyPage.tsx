import { useState } from "react";
import { useI18n } from "@/contexts/I18nContext";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

interface VocabWord {
  id: number;
  word: string;
  lang: string;
  category: string;
  active: boolean;
}

const initialWords: VocabWord[] = [
  { id: 1, word: "Mama", lang: "Creole", category: "Family", active: true },
  { id: 2, word: "Dog", lang: "English", category: "Animals", active: true },
  { id: 3, word: "Ball", lang: "English", category: "Toys", active: true },
  { id: 4, word: "Dlo", lang: "Creole", category: "Food & Drink", active: false },
  { id: 5, word: "Baby", lang: "English", category: "Family", active: true },
  { id: 6, word: "Cat", lang: "English", category: "Animals", active: true },
  { id: 7, word: "Manje", lang: "Creole", category: "Food & Drink", active: true },
];

export default function VocabularyPage() {
  const { t } = useI18n();
  const [words, setWords] = useState(initialWords);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingWord, setEditingWord] = useState<VocabWord | null>(null);
  const [newWord, setNewWord] = useState({ word: "", lang: "English", category: "" });

  const filteredWords = words.filter(w =>
    w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleActive = (id: number) => {
    setWords(words.map(w => w.id === id ? { ...w, active: !w.active } : w));
    toast.success("Word status updated!");
  };

  const handleAddWord = () => {
    if (!newWord.word || !newWord.category) {
      toast.error("Please fill all fields");
      return;
    }
    const id = Math.max(...words.map(w => w.id)) + 1;
    setWords([...words, { ...newWord, id, active: true }]);
    setNewWord({ word: "", lang: "English", category: "" });
    setShowAddDialog(false);
    toast.success("Word added!");
  };

  const handleEditWord = () => {
    if (!editingWord) return;
    setWords(words.map(w => w.id === editingWord.id ? editingWord : w));
    setEditingWord(null);
    toast.success("Word updated!");
  };

  const handleDeleteWord = (id: number) => {
    setWords(words.filter(w => w.id !== id));
    toast.success("Word removed");
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
          <Plus className="h-4 w-4" /> Add Word
        </Button>
      </div>

      <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-muted">
            <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Word</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Language</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Category</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Active</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">{t("action")}</th>
          </tr></thead>
          <tbody>
            {filteredWords.map((w) => (
              <tr key={w.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                <td className="px-5 py-3 font-medium text-foreground">{w.word}</td>
                <td className="px-5 py-3 text-muted-foreground">{w.lang}</td>
                <td className="px-5 py-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-lavender text-lavender-foreground">
                    {w.category}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <Switch checked={w.active} onCheckedChange={() => toggleActive(w.id)} />
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    <button 
                      className="text-xs font-medium text-primary hover:underline"
                      onClick={() => setEditingWord(w)}
                    >
                      Edit
                    </button>
                    <button 
                      className="text-xs font-medium text-muted-foreground hover:text-peach-foreground"
                      onClick={() => handleDeleteWord(w.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Word Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Word</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-2">Word</label>
              <Input 
                value={newWord.word}
                onChange={(e) => setNewWord({ ...newWord, word: e.target.value })}
                placeholder="Enter word..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <select 
                value={newWord.lang}
                onChange={(e) => setNewWord({ ...newWord, lang: e.target.value })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option>English</option>
                <option>Creole</option>
                <option>French</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Input 
                value={newWord.category}
                onChange={(e) => setNewWord({ ...newWord, category: e.target.value })}
                placeholder="e.g. Animals, Family, Food..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddWord}>Add Word</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Word Dialog */}
      <Dialog open={!!editingWord} onOpenChange={() => setEditingWord(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Word</DialogTitle>
          </DialogHeader>
          {editingWord && (
            <div className="space-y-4 py-4">
              <div>
                <label className="block text-sm font-medium mb-2">Word</label>
                <Input 
                  value={editingWord.word}
                  onChange={(e) => setEditingWord({ ...editingWord, word: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Language</label>
                <select 
                  value={editingWord.lang}
                  onChange={(e) => setEditingWord({ ...editingWord, lang: e.target.value })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option>English</option>
                  <option>Creole</option>
                  <option>French</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Input 
                  value={editingWord.category}
                  onChange={(e) => setEditingWord({ ...editingWord, category: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingWord(null)}>Cancel</Button>
            <Button onClick={handleEditWord}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
