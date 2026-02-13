import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";
import { BookOpen, Plus, Search, Pencil, Trash2, Filter, Clock, Image, Video, FileText, GraduationCap, Languages, Heart, Home, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { getEpisodeApi, createEpisodeApi, updateEpisodeApi, deleteEpisodeApi, ImageUrlApi, getCategoriesApi, getFilterApi } from "../utils/api";

export default function EpisodesPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  
  const [currentEpisode, setCurrentEpisode] = useState({
    _id: null,
    title: "",
    type: "TEXT",
    difficulty: "EASY",
    timeLimitSeconds: 30,
    isActive: true,
    isDailyStory: false,
    textContent: "",
    expectedText: "",
    imageUrl: "",
    thumbnailUrl: "",
    videoUrl: "",
    filters: {},
    category: ""
  });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Fetch initial data
  useEffect(() => {
    fetchEpisodes();
    fetchCategories();
    fetchFilters();
  }, []);

  const fetchEpisodes = async () => {
    try {
      setLoading(true);
      const response = await getEpisodeApi();
      
      if (response?.data?.data && Array.isArray(response.data.data)) {
        setEpisodes(response.data.data);
      } else if (response?.data && Array.isArray(response.data)) {
        setEpisodes(response.data);
      } else if (Array.isArray(response)) {
        setEpisodes(response);
      } else {
        console.error("Unexpected API response format:", response);
        setEpisodes([]);
        toast.error("Invalid data format received");
      }
    } catch (error) {
      console.error("Error fetching episodes:", error);
      setEpisodes([]);
      toast.error("Error loading episodes");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategoriesApi();
      if (response?.data?.data) {
        setCategories(response.data.data);
      } else if (Array.isArray(response?.data)) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchFilters = async () => {
    try {
      const response = await getFilterApi();
      if (response?.data && Array.isArray(response.data)) {
        setFilters(response.data);
      } else if (response?.data?.data && Array.isArray(response.data.data)) {
        setFilters(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching filters:", error);
    }
  };

  // File upload handlers
  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('thumbnail', file);

    try {
      if (type === 'image') setUploadingImage(true);
      if (type === 'thumbnail') setUploadingThumbnail(true);
      if (type === 'video') setUploadingVideo(true);

      const response = await ImageUrlApi(formData);
      
      if (response?.data?.data?.fileUrl) {
        if (type === 'image') {
          setCurrentEpisode({ ...currentEpisode, imageUrl: response.data.data.fileUrl });
          toast.success("Image uploaded successfully!");
        } else if (type === 'thumbnail') {
          setCurrentEpisode({ ...currentEpisode, thumbnailUrl: response.data.data.fileUrl });
          toast.success("Thumbnail uploaded successfully!");
        } else if (type === 'video') {
          setCurrentEpisode({ ...currentEpisode, videoUrl: response.data.data.fileUrl });
          toast.success("Video uploaded successfully!");
        }
      }
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      toast.error(`Error uploading ${type}`);
    } finally {
      if (type === 'image') setUploadingImage(false);
      if (type === 'thumbnail') setUploadingThumbnail(false);
      if (type === 'video') setUploadingVideo(false);
    }
  };

  // Filter episodes based on search query
  const filteredEpisodes = Array.isArray(episodes) 
    ? episodes.filter(ep => 
        ep.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ep.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ep.difficulty?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Helper function to get filter name by ID
  const getFilterNameById = (filterId) => {
    const filter = filters.find(f => f._id === filterId);
    return filter?.filter || filterId;
  };

  // Helper function to get option label by filter ID and option ID
  const getOptionLabel = (filterId, optionId) => {
    const filter = filters.find(f => f._id === filterId);
    const option = filter?.options?.find(opt => opt._id === optionId);
    return option?.label || optionId;
  };

  // Safely get filter options for display - handles both ID arrays and object arrays
  const getFilterOptionsForDisplay = (filterId, optionData) => {
    if (!optionData) return [];
    
    if (Array.isArray(optionData) && optionData.length > 0) {
      if (typeof optionData[0] === 'object') {
        return optionData.map(opt => ({
          id: opt._id || opt.id,
          label: opt.label || opt.name || JSON.stringify(opt)
        }));
      } else {
        return optionData.map(optId => ({
          id: optId,
          label: getOptionLabel(filterId, optId)
        }));
      }
    }
    return [];
  };

  // Get all non-empty filters for an episode
  const getNonEmptyFilters = (episodeFilters) => {
    if (!episodeFilters) return [];
    
    return Object.entries(episodeFilters)
      .filter(([filterId, optionData]) => {
        if (!optionData) return false;
        if (Array.isArray(optionData) && optionData.length > 0) return true;
        return false;
      })
      .map(([filterId, optionData]) => {
        const options = getFilterOptionsForDisplay(filterId, optionData);
        return {
          filterId,
          filterName: getFilterNameById(filterId),
          options
        };
      })
      .filter(group => group.options.length > 0);
  };

  const handleOpenAddDialog = () => {
    setDialogMode("add");
    setSelectedFilter("");
    setCurrentEpisode({
      _id: null,
      title: "",
      type: "TEXT",
      difficulty: "EASY",
      timeLimitSeconds: 30,
      isActive: true,
      isDailyStory: false,
      textContent: "",
      expectedText: "",
      imageUrl: "",
      thumbnailUrl: "",
      videoUrl: "",
      filters: {},
      category: ""
    });
    setShowDialog(true);
  };

  const handleOpenEditDialog = (episode, e) => {
    e.stopPropagation();
    setDialogMode("edit");
    setSelectedFilter("");
    
    const normalizedEpisode = { ...episode };
    if (normalizedEpisode.filters) {
      const normalizedFilters = {};
      Object.entries(normalizedEpisode.filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          normalizedFilters[key] = value.map(item => {
            if (typeof item === 'object' && item !== null) {
              return item._id || item.id;
            }
            return item;
          }).filter(Boolean);
        }
      });
      normalizedEpisode.filters = normalizedFilters;
    }
    
    setCurrentEpisode(normalizedEpisode);
    setShowDialog(true);
  };

  const handleAddFilter = () => {
    if (!selectedFilter) {
      toast.error("Please select a filter");
      return;
    }

    setCurrentEpisode(prev => {
      const currentFilters = { ...prev.filters };
      
      if (!currentFilters[selectedFilter]) {
        currentFilters[selectedFilter] = [];
      }

      return { ...prev, filters: currentFilters };
    });
  };

  const handleFilterOptionChange = (filterId, optionId, isChecked) => {
    setCurrentEpisode(prev => {
      const currentFilters = { ...prev.filters };
      
      if (!currentFilters[filterId]) {
        currentFilters[filterId] = [];
      }

      if (isChecked) {
        if (!currentFilters[filterId].includes(optionId)) {
          currentFilters[filterId] = [...currentFilters[filterId], optionId];
        }
      } else {
        currentFilters[filterId] = currentFilters[filterId].filter(id => id !== optionId);
      }

      if (currentFilters[filterId].length === 0) {
        delete currentFilters[filterId];
      }

      return { ...prev, filters: currentFilters };
    });
  };

  const handleRemoveFilter = (filterId) => {
    setCurrentEpisode(prev => {
      const currentFilters = { ...prev.filters };
      delete currentFilters[filterId];
      return { ...prev, filters: currentFilters };
    });
  };

  const handleSaveEpisode = async () => {
    // Validate all required fields
    if (!currentEpisode.title) {
      toast.error("Please enter episode title");
      return;
    }

    if (!currentEpisode.category) {
      toast.error("Please select a category");
      return;
    }

    if (!currentEpisode.type) {
      toast.error("Please select episode type");
      return;
    }

    if (!currentEpisode.difficulty) {
      toast.error("Please select difficulty level");
      return;
    }

    if (!currentEpisode.timeLimitSeconds) {
      toast.error("Please enter time limit");
      return;
    }

    if (currentEpisode.type === "TEXT" || currentEpisode.type === "IMAGE_TEXT") {
      if (!currentEpisode.textContent) {
        toast.error("Please enter content");
        return;
      }
    }

    if (currentEpisode.type === "IMAGE" || currentEpisode.type === "IMAGE_TEXT") {
      if (!currentEpisode.imageUrl) {
        toast.error("Please upload an image");
        return;
      }
    }

    // Validate filters - at least one filter must be selected
    if (!currentEpisode.filters || Object.keys(currentEpisode.filters).length === 0) {
      toast.error("Please select at least one filter");
      return;
    }

    try {
      setSubmitting(true);
      
      const episodeData = {
        title: currentEpisode.title,
        type: currentEpisode.type,
        difficulty: currentEpisode.difficulty,
        timeLimitSeconds: parseInt(currentEpisode.timeLimitSeconds) || 30,
        isActive: currentEpisode.isActive,
        isDailyStory: currentEpisode.isDailyStory || false,
        category: currentEpisode.category,
        filters: currentEpisode.filters
      };

      if (currentEpisode.type === "TEXT" || currentEpisode.type === "IMAGE_TEXT") {
        episodeData.textContent = currentEpisode.textContent;
        episodeData.expectedText = currentEpisode.expectedText || currentEpisode.textContent;
      }

      if (currentEpisode.type === "IMAGE" || currentEpisode.type === "IMAGE_TEXT") {
        episodeData.imageUrl = currentEpisode.imageUrl;
        if (currentEpisode.thumbnailUrl) {
          episodeData.thumbnailUrl = currentEpisode.thumbnailUrl;
        }
      }

      // Always send videoUrl if it exists
      if (currentEpisode.videoUrl) {
        episodeData.videoUrl = currentEpisode.videoUrl;
      }

      let response;
      if (dialogMode === "add") {
        response = await createEpisodeApi(episodeData);
      } else {
        response = await updateEpisodeApi(currentEpisode._id, episodeData);
      }
      
      if (response) {
        await fetchEpisodes();
        resetDialog();
        toast.success(dialogMode === "add" ? "Episode created successfully!" : "Episode updated successfully!");
      } else {
        toast.error(response?.message || `Failed to ${dialogMode} episode`);
      }
    } catch (error) {
      console.error(`Error ${dialogMode}ing episode:`, error);
      toast.error(error.response?.data?.message || `Error ${dialogMode}ing episode`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (id, e) => {
    e.stopPropagation();
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await deleteEpisodeApi(deleteConfirmId);
      if (response) {
        setEpisodes(prevEpisodes => 
          Array.isArray(prevEpisodes) 
            ? prevEpisodes.filter(ep => ep._id !== deleteConfirmId)
            : []
        );
        setDeleteConfirmId(null);
        toast.success("Episode deleted successfully!");
      } else {
        toast.error(response?.message || "Failed to delete episode");
      }
    } catch (error) {
      console.error("Error deleting episode:", error);
      toast.error(error.response?.data?.message || "Error deleting episode");
    }
  };

  const resetDialog = () => {
    setShowDialog(false);
    setTimeout(() => {
      setCurrentEpisode({
        _id: null,
        title: "",
        type: "TEXT",
        difficulty: "EASY",
        timeLimitSeconds: 30,
        isActive: true,
        isDailyStory: false,
        textContent: "",
        expectedText: "",
        imageUrl: "",
        thumbnailUrl: "",
        videoUrl: "",
        filters: {},
        category: ""
      });
      setSelectedFilter("");
      setDialogMode("add");
    }, 100);
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'IMAGE': return <Image className="h-4 w-4" />;
      case 'TEXT': return <FileText className="h-4 w-4" />;
      case 'IMAGE_TEXT': return <BookOpen className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'EASY': return 'bg-mint text-mint-foreground';
      case 'MEDIUM': return 'bg-warm text-warm-foreground';
      case 'HARD': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getFilterIcon = (filterName) => {
    if (!filterName) return <Filter className="h-3 w-3" />;
    if (filterName.includes('Grade')) return <GraduationCap className="h-3 w-3" />;
    if (filterName.includes('Language')) return <Home className="h-3 w-3" />;
    if (filterName.includes('Speech')) return <Languages className="h-3 w-3" />;
    if (filterName.includes('Interest')) return <Heart className="h-3 w-3" />;
    if (filterName.includes('Medical')) return <AlertCircle className="h-3 w-3" />;
    if (filterName.includes('Communication')) return <Languages className="h-3 w-3" />;
    return <Filter className="h-3 w-3" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={t("search") + " episodes..."} 
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
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Title</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Type</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Difficulty</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Time</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Video URL</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">{t("action")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredEpisodes.length > 0 ? (
                  filteredEpisodes.map((ep) => {
                    const nonEmptyFilters = getNonEmptyFilters(ep.filters);
                    
                    return (
                      <tr 
                        key={ep._id} 
                        className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/episodes/${ep._id}`)}
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2 font-medium text-foreground">
                            {getTypeIcon(ep.type)}
                            <span className="line-clamp-1">{ep.title}</span>
                            {ep.videoUrl && (
                              <Video className="h-3 w-3 text-blue-500 ml-1" />
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className="px-2 py-1 bg-muted rounded-md text-xs">
                            {ep.type?.replace('_', ' ') || 'N/A'}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getDifficultyColor(ep.difficulty)}`}>
                            {ep.difficulty || 'N/A'}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{ep.timeLimitSeconds || 30}s</span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          {ep.videoUrl ? (
                            <a 
                              href={ep.videoUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-500 hover:text-blue-700 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Video className="h-3 w-3" />
                              <span className="text-xs truncate max-w-[150px]">
                                {ep.videoUrl.split('/').pop() || 'View Video'}
                              </span>
                            </a>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            ep.isActive ? "bg-mint text-mint-foreground" : "bg-warm text-warm-foreground"
                          }`}>
                            {ep.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex gap-2">
                            <button 
                              className="p-1 hover:bg-muted rounded-md transition-colors"
                              onClick={(e) => { e.stopPropagation(); navigate(`/episodes/${ep._id}`); }}
                              title="View Details"
                            >
                              <BookOpen className="h-4 w-4 text-muted-foreground" />
                            </button>
                            <button 
                              className="p-1 hover:bg-muted rounded-md transition-colors"
                              onClick={(e) => handleOpenEditDialog(ep, e)}
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4 text-muted-foreground" />
                            </button>
                            <button 
                              className="p-1 hover:bg-muted rounded-md transition-colors"
                              onClick={(e) => handleDeleteClick(ep._id, e)}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="px-5 py-8 text-center text-muted-foreground">
                      {searchQuery ? "No episodes match your search" : "No episodes found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Episode Dialog */}
      <Dialog 
        open={showDialog} 
        onOpenChange={(open) => {
          if (!open) resetDialog();
          setShowDialog(open);
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dialogMode === "add" ? "Add New Episode" : "Edit Episode"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Title and Category - Both Required */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Title <span className="text-destructive">*</span>
                </label>
                <Input 
                  value={currentEpisode.title || ""}
                  onChange={(e) => setCurrentEpisode({ ...currentEpisode, title: e.target.value })}
                  placeholder="e.g. The Friendly Horse"
                  disabled={submitting}
                  className={!currentEpisode.title && currentEpisode.title !== "" ? "border-destructive" : ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category <span className="text-destructive">*</span>
                </label>
                <select 
                  value={currentEpisode.category || ""}
                  onChange={(e) => setCurrentEpisode({ ...currentEpisode, category: e.target.value })}
                  className={`w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ${!currentEpisode.category ? "border-destructive" : ""}`}
                  disabled={submitting}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Type, Difficulty, Time - All Required */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Type <span className="text-destructive">*</span>
                </label>
                <select 
                  value={currentEpisode.type || "TEXT"}
                  onChange={(e) => {
                    const newType = e.target.value;
                    setCurrentEpisode({ 
                      ...currentEpisode, 
                      type: newType,
                      imageUrl: (newType === "TEXT") ? "" : currentEpisode.imageUrl,
                      textContent: (newType === "IMAGE") ? "" : currentEpisode.textContent
                    });
                  }}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  disabled={submitting}
                >
                  <option value="TEXT">Text Only</option>
                  <option value="IMAGE">Image Only</option>
                  <option value="IMAGE_TEXT">Image + Text</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Difficulty <span className="text-destructive">*</span>
                </label>
                <select 
                  value={currentEpisode.difficulty || "EASY"}
                  onChange={(e) => setCurrentEpisode({ ...currentEpisode, difficulty: e.target.value })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  disabled={submitting}
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Time Limit (seconds) <span className="text-destructive">*</span>
                </label>
                <Input 
                  type="number"
                  min="10"
                  max="120"
                  value={currentEpisode.timeLimitSeconds || 30}
                  onChange={(e) => setCurrentEpisode({ ...currentEpisode, timeLimitSeconds: parseInt(e.target.value) || 30 })}
                  disabled={submitting}
                  className={!currentEpisode.timeLimitSeconds ? "border-destructive" : ""}
                />
              </div>
            </div>

            {/* Video Upload Section - Separate Optional Field */}
            <div className="border p-4 rounded-lg bg-muted/10">
              <div className="flex items-center gap-2 mb-3">
                <Video className="h-5 w-5 text-blue-500" />
                <label className="block text-sm font-medium">Video URL (Optional)</label>
              </div>
              <div className="flex gap-2">
                <Input 
                  value={currentEpisode.videoUrl || ""}
                  onChange={(e) => setCurrentEpisode({ ...currentEpisode, videoUrl: e.target.value })}
                  placeholder="Enter video URL or upload"
                  disabled={submitting || uploadingVideo}
                  className="flex-1"
                />
                <div className="relative">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleImageUpload(e, 'video')}
                    disabled={submitting || uploadingVideo}
                    className="absolute inset-0 opacity-0 w-full cursor-pointer"
                  />
                  <Button type="button" variant="outline" disabled={uploadingVideo}>
                    {uploadingVideo ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
              </div>
              {currentEpisode.videoUrl && (
                <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
                  <Video className="h-4 w-4" />
                  <a 
                    href={currentEpisode.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {currentEpisode.videoUrl.split('/').pop() || 'View Video'}
                  </a>
                </div>
              )}
            </div>

            {/* Media Upload Section - Required for Image/Image+Text types */}
            {(currentEpisode.type === 'IMAGE' || currentEpisode.type === 'IMAGE_TEXT') && (
              <div className="grid grid-cols-2 gap-4 border p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Image <span className="text-destructive">*</span>
                  </label>
                  <div className="flex gap-2">
                    <Input 
                      value={currentEpisode.imageUrl || ""}
                      onChange={(e) => setCurrentEpisode({ ...currentEpisode, imageUrl: e.target.value })}
                      placeholder="Image URL"
                      disabled={submitting || uploadingImage}
                      className={`flex-1 ${!currentEpisode.imageUrl ? "border-destructive" : ""}`}
                    />
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'image')}
                        disabled={submitting || uploadingImage}
                        className="absolute inset-0 opacity-0 w-full cursor-pointer"
                      />
                      <Button type="button" variant="outline" disabled={uploadingImage}>
                        {uploadingImage ? 'Uploading...' : 'Upload'}
                      </Button>
                    </div>
                  </div>
                  {currentEpisode.imageUrl && (
                    <img 
                      src={currentEpisode.imageUrl} 
                      alt="Preview" 
                      className="mt-2 h-20 w-20 object-cover rounded-md"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Thumbnail (Optional)</label>
                  <div className="flex gap-2">
                    <Input 
                      value={currentEpisode.thumbnailUrl || ""}
                      onChange={(e) => setCurrentEpisode({ ...currentEpisode, thumbnailUrl: e.target.value })}
                      placeholder="Thumbnail URL"
                      disabled={submitting || uploadingThumbnail}
                      className="flex-1"
                    />
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'thumbnail')}
                        disabled={submitting || uploadingThumbnail}
                        className="absolute inset-0 opacity-0 w-full cursor-pointer"
                      />
                      <Button type="button" variant="outline" disabled={uploadingThumbnail}>
                        {uploadingThumbnail ? 'Uploading...' : 'Upload'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Content Section - Required for Text/Image+Text types */}
            {(currentEpisode.type === 'TEXT' || currentEpisode.type === 'IMAGE_TEXT') && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Content <span className="text-destructive">*</span>
                  </label>
                  <textarea 
                    value={currentEpisode.textContent || ""}
                    onChange={(e) => setCurrentEpisode({ ...currentEpisode, textContent: e.target.value })}
                    placeholder="Enter episode content here..."
                    className={`w-full min-h-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm ${!currentEpisode.textContent ? "border-destructive" : ""}`}
                    disabled={submitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Expected Text (Optional)</label>
                  <textarea 
                    value={currentEpisode.expectedText || ""}
                    onChange={(e) => setCurrentEpisode({ ...currentEpisode, expectedText: e.target.value })}
                    placeholder="Expected text for assessment (if different from content)"
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                    disabled={submitting}
                  />
                </div>
              </>
            )}

            {/* Filters Section - Required */}
            <div className="border-t pt-4">
              <label className="block text-sm font-medium mb-3">
                Filters <span className="text-destructive">*</span>
                {(!currentEpisode.filters || Object.keys(currentEpisode.filters).length === 0) && (
                  <span className="ml-2 text-xs text-destructive">(Required - please select at least one filter)</span>
                )}
              </label>
              
              {/* Display selected filters and their options */}
              {Object.keys(currentEpisode.filters || {}).length > 0 && (
                <div className="mb-4 space-y-3">
                  {Object.entries(currentEpisode.filters).map(([filterId, optionIds]) => {
                    const filter = filters.find(f => f._id === filterId);
                    if (!filter) return null;
                    
                    return (
                      <div key={filterId} className="border rounded-lg p-3 bg-muted/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getFilterIcon(filter.filter)}
                            <span className="text-sm font-medium">{filter.filter}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveFilter(filterId)}
                            className="text-destructive hover:text-destructive/80"
                            disabled={submitting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(optionIds) && optionIds.map(optionId => {
                            const option = filter.options?.find(opt => opt._id === optionId);
                            return (
                              <span 
                                key={optionId} 
                                className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs"
                              >
                                {option?.label || optionId}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add new filter */}
              <div className="flex gap-2">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  disabled={submitting}
                >
                  <option value="">Select a filter...</option>
                  {filters.map((filter) => (
                    <option key={filter._id} value={filter._id}>
                      {filter.filter}
                    </option>
                  ))}
                </select>
                <Button 
                  type="button" 
                  onClick={handleAddFilter}
                  disabled={!selectedFilter || submitting}
                >
                  Add Filter
                </Button>
              </div>

              {/* Show options for selected filter */}
              {selectedFilter && (
                <div className="mt-4 border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    {getFilterIcon(filters.find(f => f._id === selectedFilter)?.filter || '')}
                    <span className="text-sm font-medium">
                      Select options for: {filters.find(f => f._id === selectedFilter)?.filter}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {filters
                      .find(f => f._id === selectedFilter)
                      ?.options?.map((option) => (
                        <label key={option._id} className="flex items-center gap-2 text-sm">
                          <input 
                            type="checkbox"
                            checked={currentEpisode.filters?.[selectedFilter]?.includes(option._id) || false}
                            onChange={(e) => handleFilterOptionChange(selectedFilter, option._id, e.target.checked)}
                            className="rounded border-gray-300"
                            disabled={submitting}
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Status Toggles */}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={currentEpisode.isActive !== false}
                  onChange={(e) => setCurrentEpisode({ ...currentEpisode, isActive: e.target.checked })}
                  className="rounded border-gray-300"
                  disabled={submitting}
                />
                <span className="text-sm">Active</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={currentEpisode.isDailyStory || false}
                  onChange={(e) => setCurrentEpisode({ ...currentEpisode, isDailyStory: e.target.checked })}
                  className="rounded border-gray-300"
                  disabled={submitting}
                />
                <span className="text-sm">Daily Story</span>
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetDialog} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleSaveEpisode} disabled={submitting}>
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                dialogMode === "add" ? "Create Episode" : "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteConfirmId !== null} 
        onOpenChange={(open) => {
          if (!open) setDeleteConfirmId(null);
        }}
      >
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