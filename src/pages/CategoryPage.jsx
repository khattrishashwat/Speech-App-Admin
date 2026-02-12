import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";
import { BookOpen, Plus, Search, Pencil, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { getCategoriesApi, addCategoryApi, updateCategoryApi, deleteCategoryApi, ImageUrlApi } from "../utils/api";

export default function CategoryPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add"); // "add" or "edit"
  const [currentCategory, setCurrentCategory] = useState({ 
    name: "", 
    iconUrl: "", 
    isActive: true 
  });
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategoriesApi();
      
      // Extract the categories array from response.data.data
      if (response?.data?.data && Array.isArray(response.data.data)) {
        setCategories(response.data.data);
      } else if (Array.isArray(response?.data)) {
        setCategories(response.data);
      } else if (Array.isArray(response)) {
        setCategories(response);
      } else {
        console.error("Unexpected API response format:", response);
        setCategories([]);
        toast.error("Invalid data format received");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
      toast.error("Error loading categories");
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setSelectedFile(file);
      
      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentCategory(prev => ({
          ...prev,
          iconUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to get URL
  const uploadImage = async () => {
    if (!selectedFile) return null;
    
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('thumbnail', selectedFile);
      
      const response = await ImageUrlApi(formData);
      
      // Extract the image URL from response
      // Adjust this based on your ImageUrlApi response structure
      let imageUrl = null;
      
      if (response?.data?.fileUrl) {
        imageUrl = response.data.fileUrl;
      } else if (response?.data?.data?.fileUrl) {
        imageUrl = response.data.data.fileUrl;
      } else if (typeof response === 'string') {
        imageUrl = response;
      }
      
      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Safely filter categories - ensure categories is an array
  const filteredCategories = Array.isArray(categories) 
    ? categories.filter(cat => 
        cat && cat.name && cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleAddCategory = async () => {
    if (!currentCategory.name.trim()) {
      toast.error("Please enter category name");
      return;
    }

    try {
      setUploading(true);
      
      // Upload image first if selected
      let iconUrl = "";
      if (selectedFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          iconUrl = uploadedUrl;
        } else {
          toast.error("Failed to upload icon");
          setUploading(false);
          return;
        }
      }

      // Prepare category data with all fields
      const categoryData = {
        name: currentCategory.name,
        iconUrl: iconUrl || "", // Send empty string if no icon
        isActive: true
      };

      const response = await addCategoryApi(categoryData);
      
      // Check for success in different response structures
      if (response.data?.success || response.success) {
        // Get the created category from response
        const newCategory = response.data?.data || response.data;
        
        setCategories(prevCategories => 
          Array.isArray(prevCategories) 
            ? [...prevCategories, newCategory]
            : [newCategory]
        );
        
        resetDialog();
        toast.success("Category created successfully!");
      } else {
        toast.error("Failed to create category");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Error creating category");
    } finally {
      setUploading(false);
    }
  };

  const handleEditCategory = async () => {
    if (!currentCategory.name.trim()) {
      toast.error("Please enter category name");
      return;
    }

    try {
      setUploading(true);
      
      // Upload new image if selected
      let iconUrl = currentCategory.iconUrl;
      if (selectedFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          iconUrl = uploadedUrl;
        } else {
          toast.error("Failed to upload icon");
          setUploading(false);
          return;
        }
      }

      // Prepare category data with all fields
      const categoryData = {
        name: currentCategory.name,
        iconUrl: iconUrl, // Keep existing URL or use new one
        isActive: currentCategory.isActive
      };

      const response = await updateCategoryApi(currentCategory._id, categoryData);
      
      if (response.data?.success || response.success) {
        const updatedCategory = response.data?.data || response.data;
        
        setCategories(prevCategories => 
          Array.isArray(prevCategories)
            ? prevCategories.map(cat => 
                cat._id === currentCategory._id ? updatedCategory : cat
              )
            : []
        );
        
        resetDialog();
        toast.success("Category updated successfully!");
      } else {
        toast.error("Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Error updating category");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await deleteCategoryApi(id);
        if (response.data?.success || response.success) {
          setCategories(prevCategories => 
            Array.isArray(prevCategories)
              ? prevCategories.filter(cat => cat._id !== id)
              : []
          );
          toast.success("Category deleted successfully!");
        } else {
          toast.error("Failed to delete category");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        toast.error("Error deleting category");
      }
    }
  };

  const handleToggleStatus = async (category) => {
    try {
      const categoryData = {
        name: category.name,
        iconUrl: category.iconUrl, // Include iconUrl in status toggle
        isActive: !category.isActive
      };

      const response = await updateCategoryApi(category._id, categoryData);
      if (response.data?.success || response.success) {
        setCategories(prevCategories => 
          Array.isArray(prevCategories)
            ? prevCategories.map(cat => 
                cat._id === category._id ? { ...cat, isActive: !cat.isActive } : cat
              )
            : []
        );
        toast.success(`Category ${!category.isActive ? 'activated' : 'deactivated'} successfully!`);
      }
    } catch (error) {
      console.error("Error toggling category status:", error);
      toast.error("Error updating category status");
    }
  };

  const openAddDialog = () => {
    setDialogMode("add");
    setCurrentCategory({ name: "", iconUrl: "", isActive: true });
    setSelectedFile(null);
    setShowDialog(true);
  };

  const openEditDialog = (category) => {
    setDialogMode("edit");
    setCurrentCategory({ ...category });
    setSelectedFile(null);
    setShowDialog(true);
  };

  const resetDialog = () => {
    setShowDialog(false);
    setCurrentCategory({ name: "", iconUrl: "", isActive: true });
    setSelectedFile(null);
    setDialogMode("add");
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
        <Button className="gap-2" onClick={openAddDialog}>
          <Plus className="h-4 w-4" /> Add Category
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
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Category Name</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Icon</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">{t("action")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => (
                  <tr 
                    key={cat._id} 
                    className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-5 py-3 font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" /> 
                        {cat.name}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      {cat.iconUrl ? (
                        <img 
                          src={cat.iconUrl} 
                          alt={cat.name} 
                          className="h-8 w-8 object-cover rounded-md"
                        />
                      ) : (
                        <div className="h-8 w-8 bg-muted rounded-md flex items-center justify-center">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleToggleStatus(cat)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          cat.isActive 
                            ? "bg-green-100 text-green-800 hover:bg-green-200" 
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        {cat.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button 
                          className="p-1 hover:bg-muted rounded-md transition-colors"
                          onClick={() => openEditDialog(cat)}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button 
                          className="p-1 hover:bg-muted rounded-md transition-colors"
                          onClick={() => handleDeleteCategory(cat._id)}
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
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Category Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "add" ? "Add New Category" : "Edit Category"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category Name</label>
              <Input 
                value={currentCategory.name}
                onChange={(e) => setCurrentCategory({ 
                  ...currentCategory, 
                  name: e.target.value
                })}
                placeholder="e.g. Morning Routine"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Category Icon</label>
              <div className="space-y-3">
                {/* Current icon preview */}
                {currentCategory.iconUrl && !selectedFile && (
                  <div className="flex items-center gap-3">
                    <img 
                      src={currentCategory.iconUrl} 
                      alt="Category icon" 
                      className="h-12 w-12 object-cover rounded-md border"
                    />
                    <span className="text-sm text-muted-foreground">Current icon</span>
                  </div>
                )}
                
                {/* New image preview */}
                {selectedFile && currentCategory.iconUrl && (
                  <div className="flex items-center gap-3">
                    <img 
                      src={currentCategory.iconUrl} 
                      alt="New icon preview" 
                      className="h-12 w-12 object-cover rounded-md border"
                    />
                    <span className="text-sm text-muted-foreground">New icon</span>
                  </div>
                )}

                {/* File upload input */}
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('icon-upload').click()}
                    disabled={uploading}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {selectedFile ? 'Change Icon' : 'Upload Icon'}
                  </Button>
                  {selectedFile && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedFile(null);
                        if (dialogMode === "edit") {
                          // Revert to original icon URL in edit mode
                          setCurrentCategory(prev => ({
                            ...prev,
                            iconUrl: categories.find(c => c._id === prev._id)?.iconUrl || ""
                          }));
                        } else {
                          // Clear icon in add mode
                          setCurrentCategory(prev => ({ ...prev, iconUrl: "" }));
                        }
                      }}
                    >
                      Clear
                    </Button>
                  )}
                </div>
                <input
                  id="icon-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground">
                  Supported formats: JPEG, PNG, GIF. Max size: 5MB
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetDialog} disabled={uploading}>
              Cancel
            </Button>
            <Button 
              onClick={dialogMode === "add" ? handleAddCategory : handleEditCategory}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                dialogMode === "add" ? "Create Category" : "Update Category"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}