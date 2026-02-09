import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";
import { ArrowLeft, Save, Play, Pause, Plus, GripVertical, Trash2, Edit2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

const episodesData: Record<string, {
  name: string;
  theme: string;
  age: string;
  status: string;
  storyCreole: string;
  storyEnglish: string;
  targets: { id: number; word: string; language: string; category: string; active: boolean }[];
  speechFocus: { type: string; patterns: string[] }[];
  tasks: { id: number; name: string; enabled: boolean }[];
}> = {
  "1": {
    name: "Morning Routine",
    theme: "Daily Life",
    age: "12-24m",
    status: "Active",
    storyCreole: "Solèy la leve, li lè pou reveye! Ti bebe a ouvri je l, li souriyan. Manman di 'Bonjou!'",
    storyEnglish: "The sun rises, it's time to wake up! The little baby opens their eyes, smiling. Mom says 'Good morning!'",
    targets: [
      { id: 1, word: "Bonjou", language: "Creole", category: "Greeting", active: true },
      { id: 2, word: "Solèy", language: "Creole", category: "Nature", active: true },
      { id: 3, word: "Morning", language: "English", category: "Time", active: true },
      { id: 4, word: "Wake up", language: "English", category: "Action", active: false },
    ],
    speechFocus: [
      { type: "Initial Consonants", patterns: ["Fronting: 'k' → 't'", "Stopping: 's' → 't'"] },
      { type: "Syllable Structure", patterns: ["Final consonant deletion", "Cluster reduction"] },
    ],
    tasks: [
      { id: 1, name: "Listen to story", enabled: true },
      { id: 2, name: "Repeat target words", enabled: true },
      { id: 3, name: "Point to pictures", enabled: true },
      { id: 4, name: "Sing along", enabled: false },
    ],
  },
  "2": {
    name: "Animal Friends",
    theme: "Animals",
    age: "18-36m",
    status: "Active",
    storyCreole: "Nan jaden an, gen anpil bèt. Chat la di 'Myaw!' Chen an di 'Waf waf!'",
    storyEnglish: "In the garden, there are many animals. The cat says 'Meow!' The dog says 'Woof woof!'",
    targets: [
      { id: 1, word: "Chat", language: "Creole", category: "Animal", active: true },
      { id: 2, word: "Chen", language: "Creole", category: "Animal", active: true },
      { id: 3, word: "Cat", language: "English", category: "Animal", active: true },
    ],
    speechFocus: [
      { type: "Animal Sounds", patterns: ["Gliding: 'r' → 'w'", "Vowel substitution"] },
    ],
    tasks: [
      { id: 1, name: "Match animal sounds", enabled: true },
      { id: 2, name: "Name the animals", enabled: true },
    ],
  },
};

export default function EpisodeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useI18n();
  
  const isEditMode = searchParams.get("mode") === "edit";
  const episodeId = id || "1";
  const initialData = episodesData[episodeId] || episodesData["1"];

  const [activeTab, setActiveTab] = useState("story");
  const [isEditing, setIsEditing] = useState(isEditMode);
  const [isPlaying, setIsPlaying] = useState(false);
  const [storyCreole, setStoryCreole] = useState(initialData.storyCreole);
  const [storyEnglish, setStoryEnglish] = useState(initialData.storyEnglish);
  const [targets, setTargets] = useState(initialData.targets);
  const [tasks, setTasks] = useState(initialData.tasks);
  const [showAddTarget, setShowAddTarget] = useState(false);
  const [newTarget, setNewTarget] = useState({ word: "", language: "English", category: "" });
  const [editingTarget, setEditingTarget] = useState<number | null>(null);
  const [draggedTask, setDraggedTask] = useState<number | null>(null);

  const handleSaveStory = () => {
    toast.success("Story saved successfully!");
    setIsEditing(false);
  };

  const toggleTargetActive = (id: number) => {
    setTargets(targets.map(t => t.id === id ? { ...t, active: !t.active } : t));
    toast.success("Target updated!");
  };

  const addTarget = () => {
    if (!newTarget.word || !newTarget.category) {
      toast.error("Please fill all fields");
      return;
    }
    const newId = Math.max(...targets.map(t => t.id)) + 1;
    setTargets([...targets, { ...newTarget, id: newId, active: true }]);
    setNewTarget({ word: "", language: "English", category: "" });
    setShowAddTarget(false);
    toast.success("Target added!");
  };

  const deleteTarget = (id: number) => {
    setTargets(targets.filter(t => t.id !== id));
    toast.success("Target removed");
  };

  const toggleTaskEnabled = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t));
  };

  const handleDragStart = (taskId: number) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    if (draggedTask === null || draggedTask === targetId) return;
    
    const draggedIndex = tasks.findIndex(t => t.id === draggedTask);
    const targetIndex = tasks.findIndex(t => t.id === targetId);
    
    const newTasks = [...tasks];
    const [removed] = newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, removed);
    setTasks(newTasks);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const saveTaskOrder = () => {
    toast.success("Task order saved!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/episodes")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-foreground">{initialData.name}</h2>
            <p className="text-sm text-muted-foreground">{initialData.theme} • {initialData.age}</p>
          </div>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
          initialData.status === "Active" ? "bg-mint text-mint-foreground" : "bg-warm text-warm-foreground"
        }`}>
          {initialData.status}
        </span>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted rounded-xl p-1">
          <TabsTrigger value="story" className="rounded-lg">Story</TabsTrigger>
          <TabsTrigger value="targets" className="rounded-lg">Targets</TabsTrigger>
          <TabsTrigger value="speechFocus" className="rounded-lg">Speech Focus</TabsTrigger>
          <TabsTrigger value="tasks" className="rounded-lg">Tasks</TabsTrigger>
        </TabsList>

        {/* Story Tab */}
        <TabsContent value="story">
          <div className="bg-card rounded-2xl shadow-card border border-border p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground">Story Content</h3>
              <div className="flex gap-2">
                <Button 
                  variant={isEditing ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setIsEditing(!isEditing)}
                  className="gap-1.5"
                >
                  <Edit2 className="h-4 w-4" />
                  {isEditing ? "Editing" : "Edit"}
                </Button>
                {isEditing && (
                  <Button size="sm" onClick={handleSaveStory} className="gap-1.5">
                    <Save className="h-4 w-4" /> Save
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Story (Creole)</label>
                <Textarea
                  value={storyCreole}
                  onChange={(e) => setStoryCreole(e.target.value)}
                  disabled={!isEditing}
                  rows={4}
                  className="resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Story (English)</label>
                <Textarea
                  value={storyEnglish}
                  onChange={(e) => setStoryEnglish(e.target.value)}
                  disabled={!isEditing}
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>

            {/* Audio Player */}
            <div className="bg-muted rounded-xl p-4">
              <div className="flex items-center gap-4">
                <Button 
                  size="icon" 
                  variant="outline"
                  className="h-12 w-12 rounded-full"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                <div className="flex-1">
                  <div className="h-2 bg-border rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: isPlaying ? "45%" : "0%" }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{isPlaying ? "1:23" : "0:00"}</span>
                    <span>3:05</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Targets Tab */}
        <TabsContent value="targets">
          <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-foreground">Target Vocabulary</h3>
              <Button size="sm" onClick={() => setShowAddTarget(true)} className="gap-1.5">
                <Plus className="h-4 w-4" /> Add Target
              </Button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Word</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Language</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Category</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Active</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {targets.map((target) => (
                  <tr key={target.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="px-5 py-3 font-medium text-foreground">{target.word}</td>
                    <td className="px-5 py-3 text-muted-foreground">{target.language}</td>
                    <td className="px-5 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-lavender text-lavender-foreground">
                        {target.category}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <Switch 
                        checked={target.active} 
                        onCheckedChange={() => toggleTargetActive(target.id)}
                      />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button 
                          className="text-xs font-medium text-primary hover:underline"
                          onClick={() => setEditingTarget(target.id)}
                        >
                          Edit
                        </button>
                        <button 
                          className="text-xs font-medium text-muted-foreground hover:text-peach-foreground"
                          onClick={() => deleteTarget(target.id)}
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

          {/* Add Target Dialog */}
          <Dialog open={showAddTarget} onOpenChange={setShowAddTarget}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Target</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Word</label>
                  <Input 
                    value={newTarget.word}
                    onChange={(e) => setNewTarget({ ...newTarget, word: e.target.value })}
                    placeholder="Enter word..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <select 
                    value={newTarget.language}
                    onChange={(e) => setNewTarget({ ...newTarget, language: e.target.value })}
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
                    value={newTarget.category}
                    onChange={(e) => setNewTarget({ ...newTarget, category: e.target.value })}
                    placeholder="e.g. Greeting, Animal, Action..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddTarget(false)}>Cancel</Button>
                <Button onClick={addTarget}>Add Target</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Speech Focus Tab */}
        <TabsContent value="speechFocus">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {initialData.speechFocus.map((focus, idx) => (
              <div key={idx} className="bg-card rounded-2xl shadow-card border border-border p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-sky flex items-center justify-center">
                    <span className="text-sky-foreground font-bold text-lg">{focus.type.charAt(0)}</span>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h4 className="font-bold text-foreground cursor-help">{focus.type}</h4>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This focus area helps identify common speech patterns in young children</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <ul className="space-y-2">
                  {focus.patterns.map((pattern, pIdx) => (
                    <Tooltip key={pIdx}>
                      <TooltipTrigger asChild>
                        <li className="text-sm text-muted-foreground bg-muted rounded-lg px-3 py-2 cursor-help">
                          {pattern}
                        </li>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Common developmental pattern - not an error</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks">
          <div className="bg-card rounded-2xl shadow-card border border-border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground">Interactive Tasks</h3>
              <Button size="sm" onClick={saveTaskOrder} className="gap-1.5">
                <Save className="h-4 w-4" /> Save Order
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Drag tasks to reorder. Toggle to enable/disable.</p>
            
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task.id)}
                  onDragOver={(e) => handleDragOver(e, task.id)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    draggedTask === task.id 
                      ? "border-primary bg-primary/5 scale-[1.02]" 
                      : "border-border bg-muted/50 hover:bg-muted"
                  } cursor-grab active:cursor-grabbing`}
                >
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                  <span className={`flex-1 font-medium ${task.enabled ? "text-foreground" : "text-muted-foreground"}`}>
                    {task.name}
                  </span>
                  <Switch 
                    checked={task.enabled} 
                    onCheckedChange={() => toggleTaskEnabled(task.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
