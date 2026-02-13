import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";
import { Filter, Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { getFilterApi, createFilterApi, updateFilterApi, deleteFilterApi } from "../utils/api";

export default function IntrestPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [filters, setFilters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add"); // "add" or "edit"
  const [currentFilter, setCurrentFilter] = useState({ 
    filter: "", 
    options: [] 
  });
  const [optionInput, setOptionInput] = useState("");

  // Fetch filters on component mount
  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      setLoading(true);
      const response = await getFilterApi();
      
      console.log("filters,filters", response.data.data);
      
      if (response?.data?.data && Array.isArray(response.data.data)) {
        setFilters(response.data.data);
      } else if (response?.data && Array.isArray(response.data)) {
        setFilters(response.data);
      } else {
        console.error("Unexpected API response format:", response);
        setFilters([]);
        toast.error("Invalid data format received");
      }
    } catch (error) {
      console.error("Error fetching filters:", error);
      setFilters([]);
      toast.error("Error loading filters");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOption = () => {
    if (!optionInput.trim()) {
      toast.error("Please enter an option");
      return;
    }
    
    setCurrentFilter(prev => ({
      ...prev,
      options: [...prev.options, { label: optionInput.trim() }]
    }));
    setOptionInput("");
  };

  const handleRemoveOption = (indexToRemove) => {
    setCurrentFilter(prev => ({
      ...prev,
      options: prev.options.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleAddFilter = async () => {
    if (!currentFilter.filter.trim()) {
      toast.error("Please enter filter name");
      return;
    }

    if (currentFilter.options.length === 0) {
      toast.error("Please add at least one option");
      return;
    }

    try {
      setSubmitting(true);
      
      // Prepare filter data - only send filter name and array of option labels
      const filterData = {
        filter: currentFilter.filter,
        options: currentFilter.options.map(opt => opt.label || opt)
      };

      const response = await createFilterApi(filterData);
      
      if (response) {
        // Refresh the list to get the complete data with _ids
        await fetchFilters();
        resetDialog();
        toast.success("Filter created successfully!");
      } else {
        toast.error(response?.message || "Failed to create filter");
      }
    } catch (error) {
      console.error("Error adding filter:", error);
      toast.error(error.response?.data?.message || "Error creating filter");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditFilter = async () => {
    if (!currentFilter.filter.trim()) {
      toast.error("Please enter filter name");
      return;
    }

    if (currentFilter.options.length === 0) {
      toast.error("Please add at least one option");
      return;
    }

    try {
      setSubmitting(true);
      
      // Prepare filter data - only send filter name and array of option labels
      const filterData = {
        filter: currentFilter.filter,
        options: currentFilter.options.map(opt => opt.label || opt)
      };

      const response = await updateFilterApi(currentFilter._id, filterData);
      
      if (response) {
        // Refresh the list to get updated data
        await fetchFilters();
        resetDialog();
        toast.success("Filter updated successfully!");
      } else {
        toast.error(response?.message || "Failed to update filter");
      }
    } catch (error) {
      console.error("Error updating filter:", error);
      toast.error(error.response?.data?.message || "Error updating filter");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFilter = async (id) => {
    if (window.confirm("Are you sure you want to delete this filter?")) {
      try {
        const response = await deleteFilterApi(id);
        if (response?.success) {
          setFilters(prevFilters => 
            Array.isArray(prevFilters)
              ? prevFilters.filter(filter => filter._id !== id)
              : []
          );
          toast.success("Filter deleted successfully!");
        } else {
          toast.error(response?.message || "Failed to delete filter");
        }
      } catch (error) {
        console.error("Error deleting filter:", error);
        toast.error(error.response?.data?.message || "Error deleting filter");
      }
    }
  };

  const openAddDialog = () => {
    setDialogMode("add");
    setCurrentFilter({ filter: "", options: [] });
    setOptionInput("");
    setShowDialog(true);
  };

  const openEditDialog = (filter) => {
    setDialogMode("edit");
    // Format the options array to match our structure
    const formattedFilter = {
      ...filter,
      options: filter.options || []
    };
    setCurrentFilter(formattedFilter);
    setOptionInput("");
    setShowDialog(true);
  };

  const resetDialog = () => {
    setShowDialog(false);
    // Reset form state after a tiny delay to ensure dialog close animation completes
    setTimeout(() => {
      setCurrentFilter({ filter: "", options: [] });
      setOptionInput("");
      setDialogMode("add");
    }, 100);
  };

  // Filter filters based on search query
  const filteredFilters = filters.filter(filter => 
    filter.filter?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    filter.options?.some(opt => 
      (opt.label || opt)?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  console.log("filters", filters);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search filters..." 
            className="pl-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="gap-2" onClick={openAddDialog}>
          <Plus className="h-4 w-4" /> Add Filter
        </Button>
      </div>

      <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Filter Name</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Options</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Total Options</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFilters.length > 0 ? (
                filteredFilters.map((filter) => (
                  <tr 
                    key={filter._id} 
                    className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-5 py-3 font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-primary" /> 
                        {filter.filter}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1 max-w-md">
                        {filter.options && filter.options.map((option, index) => (
                          <span 
                            key={option._id || index}
                            className="px-2 py-1 bg-muted rounded-md text-xs"
                          >
                            {option.label || option}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                        {filter.options?.length || 0} options
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button 
                          className="p-1 hover:bg-muted rounded-md transition-colors"
                          onClick={() => openEditDialog(filter)}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button 
                          className="p-1 hover:bg-muted rounded-md transition-colors"
                          onClick={() => handleDeleteFilter(filter._id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-5 py-8 text-center text-muted-foreground">
                    {searchQuery ? "No filters match your search" : "No filters found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Filter Dialog */}
      <Dialog 
        open={showDialog} 
        onOpenChange={(open) => {
          if (!open) {
            resetDialog();
          }
          setShowDialog(open);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "add" ? "Add New Filter" : "Edit Filter"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-2">Filter Name</label>
              <Input 
                value={currentFilter.filter}
                onChange={(e) => setCurrentFilter({ 
                  ...currentFilter, 
                  filter: e.target.value
                })}
                placeholder="e.g. Grade Level, Language, Speech Goals"
                disabled={submitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Options</label>
              
              {/* Options list */}
              {currentFilter.options && currentFilter.options.length > 0 && (
                <div className="mb-3 space-y-2 max-h-48 overflow-y-auto">
                  {currentFilter.options.map((option, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                      <span className="text-sm">{option.label || option}</span>
                      <button
                        onClick={() => handleRemoveOption(index)}
                        className="text-destructive hover:text-destructive/80"
                        disabled={submitting}
                        type="button"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add option input */}
              <div className="flex gap-2">
                <Input 
                  value={optionInput}
                  onChange={(e) => setOptionInput(e.target.value)}
                  placeholder="Add an option"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddOption();
                    }
                  }}
                  disabled={submitting}
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleAddOption}
                  disabled={submitting || !optionInput.trim()}
                >
                  Add
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Add options like "Pre-School", "Early Primary", "English", etc.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={resetDialog} 
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={dialogMode === "add" ? handleAddFilter : handleEditFilter}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                dialogMode === "add" ? "Create Filter" : "Update Filter"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}