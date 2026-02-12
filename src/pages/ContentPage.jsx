// import { useState, useEffect } from "react";
// import { useI18n } from "@/contexts/I18nContext";
// import { Eye, Save, FileText, Plus, Trash2, Edit } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Textarea } from "@/components/ui/textarea";
// import { Input } from "@/components/ui/input";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { toast } from "sonner";
// import {
//   getTermsApi,
//   createTermsApi,
//   updateTermsApi,
//   getPrivacyApi,
//   createPrivacyApi,
//   updatePrivacyApi,
//   getFaqsApi,
//   createFaqApi,
//   updateFaqApi,
//   deleteFaqApi
// } from "../utils/api";

// export default function ContentPage() {
//   const { t } = useI18n();
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("terms");
//   const [showPreview, setShowPreview] = useState(false);
//   const [previewContent, setPreviewContent] = useState("");
//   const [faqDialogOpen, setFaqDialogOpen] = useState(false);
//   const [editingFaq, setEditingFaq] = useState(null);
  
//   // Terms state
//   const [terms, setTerms] = useState({
//     _id: null,
//     content: "",
//     timestamp: "",
//     updated: ""
//   });
//   console.log("setTerms",terms)
//   // Privacy state
//   const [privacy, setPrivacy] = useState({
//     _id: null,
//     content: "",
//     timestamp: "",
//     updated: ""
//   });
  
//   // FAQs state - always initialize as empty array
//   const [faqs, setFaqs] = useState([]);
  
//   // FAQ form state
//   const [faqForm, setFaqForm] = useState({
//     question: "",
//     answer: "",
//     isActive: true
//   });

//   // Fetch all content on component mount
//   useEffect(() => {
//     fetchAllContent();
//   }, []);

//   const fetchAllContent = async () => {
//     setLoading(true);
//     try {
//       await Promise.all([
//         fetchTerms(),
//         fetchPrivacy(),
//         fetchFaqs()
//       ]);
//     } catch (error) {
//       console.error("Error fetching content:", error);
//       toast.error("Failed to load content");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch Terms
//   const fetchTerms = async () => {
//     try {
//       const response = await getTermsApi();
//       if (response && response.data) {
//         setTerms({
//           _id: response.data.data._id || null,
//           content: response.data.data.content || "",
//           timestamp: response.data.data.timestamp || "",
//           updated: response.data.data.timestamp 
//             ? new Date(response.data.data.timestamp).toLocaleDateString('en-US', { 
//                 month: 'short', 
//                 day: 'numeric', 
//                 year: 'numeric' 
//               })
//             : "Not published"
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching terms:", error);
//       toast.error("Failed to fetch Terms & Conditions");
//     }
//   };

//   // Fetch Privacy
//   const fetchPrivacy = async () => {
//     try {
//       const response = await getPrivacyApi();
//       if (response && response.data) {
//         setPrivacy({
//           _id: response.data.data._id || null,
//           content: response.data.data.content || "",
//           timestamp: response.data.data.timestamp || "",
//           updated: response.data.data.timestamp 
//             ? new Date(response.data.data.timestamp).toLocaleDateString('en-US', { 
//                 month: 'short', 
//                 day: 'numeric', 
//                 year: 'numeric' 
//               })
//             : "Not published"
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching privacy:", error);
//       toast.error("Failed to fetch Privacy Policy");
//     }
//   };

//   // Fetch FAQs - FIXED: Ensure we always set an array
//   const fetchFaqs = async () => {
//     try {
//       const response = await getFaqsApi();
//       console.log("FAQs API response:", response);
      
//       // Handle different possible response structures
//       let faqsData = [];
      
//       if (response.data) {
//         // If response.data is an array
//         if (Array.isArray(response.data)) {
//           faqsData = response.data;
//         }
//         // If response.data.data is an array (nested response)
//         else if (response.data.data && Array.isArray(response.data.data)) {
//           faqsData = response.data.data;
//         }
//         // If response.data is an object with items property
//         else if (response.data.items && Array.isArray(response.data.items)) {
//           faqsData = response.data.items;
//         }
//         // If response.data is an object with faqs property
//         else if (response.data.faqs && Array.isArray(response.data.faqs)) {
//           faqsData = response.data.faqs;
//         }
//         // If it's a single object, wrap in array
//         else if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
//           faqsData = [response.data];
//         }
//       } else if (response.success && response.data) {
//         // Handle response.success pattern
//         if (Array.isArray(response.data)) {
//           faqsData = response.data;
//         } else if (response.data.data && Array.isArray(response.data.data)) {
//           faqsData = response.data.data;
//         }
//       }
      
//       setFaqs(faqsData);
//     } catch (error) {
//       console.error("Error fetching FAQs:", error);
//       toast.error("Failed to fetch FAQs");
//       setFaqs([]); // Set empty array on error
//     }
//   };

//   // Get current content based on active tab
//   const getCurrentContent = () => {
//     switch (activeTab) {
//       case "terms":
//         return {
//           ...terms,
//           key: "terms",
//           label: "Terms & Conditions"
//         };
//       case "privacy":
//         return {
//           ...privacy,
//           key: "privacy",
//           label: "Privacy Policy"
//         };
//       case "faq":
//         return {
//           key: "faq",
//           label: "FAQ",
//           faqs: faqs
//         };
//       default:
//         return null;
//     }
//   };

//   const currentContent = getCurrentContent();

//   // Handle content change for Terms and Privacy
//   const handleContentChange = (value) => {
//     console.log("Content value:", value);
//     if (activeTab === "terms") {
//       setTerms(prev => ({
//         ...prev,
//         content: value
//       }));
//     } else if (activeTab === "privacy") {
//       setPrivacy(prev => ({
//         ...prev,
//         content: value
//       }));
//     }
//   };

//   // Publish content
//   const handlePublish = async () => {
//     try {
//       if (activeTab === "terms") {
//         await publishTerms();
//       } else if (activeTab === "privacy") {
//         await publishPrivacy();
//       } else if (activeTab === "faq") {
//         toast.info("FAQ changes are saved individually");
//       }
//     } catch (error) {
//       console.error("Error publishing:", error);
//       toast.error("Failed to publish content");
//     }
//   };

//   // Publish Terms
//   const publishTerms = async () => {
//     const payload = {
//       content: terms.content
//     };

//     let response;
//     if (terms._id) {
//       response = await updateTermsApi(terms._id, payload);
//     } else {
//       response = await createTermsApi(payload);
//     }

//     if (response.success) {
//       const now = new Date();
//       setTerms(prev => ({
//         ...prev,
//         _id: response.data._id || prev._id,
//         timestamp: response.data.timestamp || now.toISOString(),
//         updated: now.toLocaleDateString('en-US', { 
//           month: 'short', 
//           day: 'numeric', 
//           year: 'numeric' 
//         })
//       }));
//       toast.success("Terms & Conditions published successfully!");
//     }
//   };

//   // Publish Privacy
//   const publishPrivacy = async () => {
//  const payload = {
//   content: privacy.content
// };



//     let response;
//     if (privacy._id) {
//       response = await updatePrivacyApi(privacy._id, payload);
//     } else {
//       response = await createPrivacyApi(payload);
//     }

//     if (response.success) {
//       const now = new Date();
//       setPrivacy(prev => ({
//         ...prev,
//         _id: response.data._id || prev._id,
//         timestamp: response.data.timestamp || now.toISOString(),
//         updated: now.toLocaleDateString('en-US', { 
//           month: 'short', 
//           day: 'numeric', 
//           year: 'numeric' 
//         })
//       }));
//       toast.success("Privacy Policy published successfully!");
//     }
//   };

//   // Preview content
//   const handlePreview = () => {
//     if (currentContent) {
//       if (activeTab === "faq") {
//         // Ensure faqs is an array before using map
//         const faqList = Array.isArray(faqs) ? faqs : [];
//         const faqPreview = faqList.map(faq => 
//           `## Q: ${faq.question}\n\nA: ${faq.answer}\n\n---\n`
//         ).join('');
//         setPreviewContent(faqPreview || "No FAQs available");
//       } else {
//         setPreviewContent(currentContent.content || "No content available");
//       }
//       setShowPreview(true);
//     }
//   };
// console.log("play", previewContent);

//   // FAQ Handlers
//   const handleAddFaq = () => {
//     setEditingFaq(null);
//     setFaqForm({
//       question: "",
//       answer: "",
//       isActive: true
//     });
//     setFaqDialogOpen(true);
//   };

//   const handleEditFaq = (faq) => {
//     setEditingFaq(faq);
//     setFaqForm({
//       question: faq.question || "",
//       answer: faq.answer || "",
//       isActive: faq.isActive !== undefined ? faq.isActive : true
//     });
//     setFaqDialogOpen(true);
//   };

//   const handleDeleteFaq = async (faqId) => {
//     if (window.confirm("Are you sure you want to delete this FAQ?")) {
//       try {
//         const response = await deleteFaqApi(faqId);
//         if (response.success) {
//           setFaqs(prev => {
//             // Ensure prev is an array before filtering
//             const currentFaqs = Array.isArray(prev) ? prev : [];
//             return currentFaqs.filter(faq => faq._id !== faqId);
//           });
//           toast.success("FAQ deleted successfully");
//         }
//       } catch (error) {
//         console.error("Error deleting FAQ:", error);
//         toast.error("Failed to delete FAQ");
//       }
//     }
//   };

//   const handleSaveFaq = async () => {
//     if (!faqForm.question.trim()) {
//       toast.error("Question is required");
//       return;
//     }
//     if (!faqForm.answer.trim()) {
//       toast.error("Answer is required");
//       return;
//     }

//     try {
//       let response;
//       const payload = {
//         question: faqForm.question.trim(),
//         answer: faqForm.answer.trim(),
//         isActive: faqForm.isActive
//       };

//       if (editingFaq) {
//         response = await updateFaqApi(editingFaq._id, payload);
//       } else {
//         response = await createFaqApi(payload);
//       }

//       if (response.success) {
//         if (editingFaq) {
//           setFaqs(prev => {
//             const currentFaqs = Array.isArray(prev) ? prev : [];
//             return currentFaqs.map(faq => 
//               faq._id === editingFaq._id 
//                 ? { ...faq, ...payload, updatedAt: new Date().toISOString() } 
//                 : faq
//             );
//           });
//           toast.success("FAQ updated successfully");
//         } else {
//           // Handle different response structures for created FAQ
//           const newFaq = response.data?.data || response.data || {};
//           setFaqs(prev => {
//             const currentFaqs = Array.isArray(prev) ? prev : [];
//             return [...currentFaqs, newFaq];
//           });
//           toast.success("FAQ added successfully");
//         }
//         setFaqDialogOpen(false);
//         setFaqForm({ question: "", answer: "", isActive: true });
//       }
//     } catch (error) {
//       console.error("Error saving FAQ:", error);
//       toast.error("Failed to save FAQ");
//     }
//   };

//   const handleToggleFaqStatus = async (faq) => {
//     try {
//       const payload = {
//         question: faq.question,
//         answer: faq.answer,
//         isActive: !faq.isActive
//       };
//       const response = await updateFaqApi(faq._id, payload);
//       if (response.success) {
//         setFaqs(prev => {
//           const currentFaqs = Array.isArray(prev) ? prev : [];
//           return currentFaqs.map(f => 
//             f._id === faq._id ? { ...f, isActive: !f.isActive } : f
//           );
//         });
//         toast.success(`FAQ ${!faq.isActive ? 'activated' : 'deactivated'} successfully`);
//       }
//     } catch (error) {
//       console.error("Error toggling FAQ status:", error);
//       toast.error("Failed to update FAQ status");
//     }
//   };

//   // Markdown renderer
//   const renderMarkdown = (text) => {
//     if (!text) return "";
//     return text
//       .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
//       .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
//       .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
//       .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
//       .replace(/\*(.*?)\*/gim, '<em>$1</em>')
//       .replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
//       .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
//       .replace(/\n/gim, '<br />');
//   };

//   // Safe getter for active FAQs count
//   const getActiveFaqsCount = () => {
//     if (!Array.isArray(faqs)) return 0;
//     return faqs.filter(f => f.isActive).length;
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
//           <p className="mt-4 text-muted-foreground">Loading content...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
//         <TabsList className="bg-muted rounded-xl p-1">
//           <TabsTrigger value="terms" className="rounded-lg text-sm font-medium">
//             Terms & Conditions
//           </TabsTrigger>
//           <TabsTrigger value="privacy" className="rounded-lg text-sm font-medium">
//             Privacy Policy
//           </TabsTrigger>
//           <TabsTrigger value="faq" className="rounded-lg text-sm font-medium">
//             FAQ
//           </TabsTrigger>
//         </TabsList>

//         {/* Terms & Conditions Tab */}
//         <TabsContent value="terms">
//           <div className="bg-card rounded-2xl shadow-card border border-border p-6 space-y-4">
//             <div className="flex items-center justify-between flex-wrap gap-4">
//               <div className="flex items-center gap-3">
//                 <div className="h-10 w-10 rounded-xl bg-lavender flex items-center justify-center">
//                   <FileText className="h-5 w-5 text-lavender-foreground" />
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-foreground">Terms & Conditions</h3>
//                   <p className="text-xs text-muted-foreground">
//                     Last updated: {terms.updated}
//                   </p>
//                 </div>
//               </div>
              
//               <div className="flex items-center gap-2 flex-wrap">
//                 <Button variant="outline" size="sm" className="gap-1.5" onClick={handlePreview}>
//                   <Eye className="h-4 w-4" /> Preview
//                 </Button>
//                 <Button size="sm" className="gap-1.5" onClick={handlePublish}>
//                   <Save className="h-4 w-4" /> Publish
//                 </Button>
//               </div>
//             </div>

//             {/* Editor Toolbar */}
//             <div className="flex items-center gap-1 p-2 bg-muted rounded-lg">
//               <button className="px-2 py-1 text-sm font-bold hover:bg-background rounded">B</button>
//               <button className="px-2 py-1 text-sm italic hover:bg-background rounded">I</button>
//               <button className="px-2 py-1 text-sm underline hover:bg-background rounded">U</button>
//               <span className="w-px h-5 bg-border mx-2" />
//               <button className="px-2 py-1 text-sm hover:bg-background rounded">H1</button>
//               <button className="px-2 py-1 text-sm hover:bg-background rounded">H2</button>
//               <button className="px-2 py-1 text-sm hover:bg-background rounded">H3</button>
//               <span className="w-px h-5 bg-border mx-2" />
//               <button className="px-2 py-1 text-sm hover:bg-background rounded">• List</button>
//               <button className="px-2 py-1 text-sm hover:bg-background rounded">1. List</button>
//               <button className="px-2 py-1 text-sm hover:bg-background rounded">Link</button>
//             </div>

//             <Textarea
//               rows={16}
//               value={terms.content}
//               onChange={(e) => handleContentChange(e.target.value)}
//               placeholder="Enter Terms & Conditions..."
//               className="font-mono text-sm resize-none"
//             />
//           </div>
//         </TabsContent>

//         {/* Privacy Policy Tab */}
//         <TabsContent value="privacy">
//           <div className="bg-card rounded-2xl shadow-card border border-border p-6 space-y-4">
//             <div className="flex items-center justify-between flex-wrap gap-4">
//               <div className="flex items-center gap-3">
//                 <div className="h-10 w-10 rounded-xl bg-lavender flex items-center justify-center">
//                   <FileText className="h-5 w-5 text-lavender-foreground" />
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-foreground">Privacy Policy</h3>
//                   <p className="text-xs text-muted-foreground">
//                     Last updated: {privacy.updated}
//                   </p>
//                 </div>
//               </div>
              
//               <div className="flex items-center gap-2 flex-wrap">
//                 <Button variant="outline" size="sm" className="gap-1.5" onClick={handlePreview}>
//                   <Eye className="h-4 w-4" /> Preview
//                 </Button>
//                 <Button size="sm" className="gap-1.5" onClick={handlePublish}>
//                   <Save className="h-4 w-4" /> Publish
//                 </Button>
//               </div>
//             </div>

//             {/* Editor Toolbar */}
//             <div className="flex items-center gap-1 p-2 bg-muted rounded-lg">
//               <button className="px-2 py-1 text-sm font-bold hover:bg-background rounded">B</button>
//               <button className="px-2 py-1 text-sm italic hover:bg-background rounded">I</button>
//               <button className="px-2 py-1 text-sm underline hover:bg-background rounded">U</button>
//               <span className="w-px h-5 bg-border mx-2" />
//               <button className="px-2 py-1 text-sm hover:bg-background rounded">H1</button>
//               <button className="px-2 py-1 text-sm hover:bg-background rounded">H2</button>
//               <button className="px-2 py-1 text-sm hover:bg-background rounded">H3</button>
//               <span className="w-px h-5 bg-border mx-2" />
//               <button className="px-2 py-1 text-sm hover:bg-background rounded">• List</button>
//               <button className="px-2 py-1 text-sm hover:bg-background rounded">1. List</button>
//               <button className="px-2 py-1 text-sm hover:bg-background rounded">Link</button>
//             </div>

//             <Textarea
//               rows={16}
//               value={privacy.content}
//               onChange={(e) => handleContentChange(e.target.value)}
//               placeholder="Enter Privacy Policy..."
//               className="font-mono text-sm resize-none"
//             />
//           </div>
//         </TabsContent>

//         {/* FAQ Tab */}
//         <TabsContent value="faq">
//           <div className="bg-card rounded-2xl shadow-card border border-border p-6 space-y-6">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="h-10 w-10 rounded-xl bg-lavender flex items-center justify-center">
//                   <FileText className="h-5 w-5 text-lavender-foreground" />
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-foreground">Frequently Asked Questions</h3>
//                   <p className="text-xs text-muted-foreground">
//                     Total FAQs: {Array.isArray(faqs) ? faqs.length : 0} | Active: {getActiveFaqsCount()}
//                   </p>
//                 </div>
//               </div>
              
//               <div className="flex items-center gap-2">
//                 <Button variant="outline" size="sm" className="gap-1.5" onClick={handlePreview}>
//                   <Eye className="h-4 w-4" /> Preview All
//                 </Button>
//                 <Button size="sm" className="gap-1.5" onClick={handleAddFaq}>
//                   <Plus className="h-4 w-4" /> Add FAQ
//                 </Button>
//               </div>
//             </div>

//             <div className="space-y-4">
//               {!Array.isArray(faqs) || faqs.length === 0 ? (
//                 <div className="text-center py-12 text-muted-foreground">
//                   No FAQs added yet. Click "Add FAQ" to create one.
//                 </div>
//               ) : (
//                 faqs.map((faq) => (
//                   <div key={faq._id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
//                     <div className="flex justify-between items-start">
//                       <div className="space-y-2 flex-1">
//                         <div className="flex items-center gap-2">
//                           <h4 className="font-semibold text-foreground">{faq.question}</h4>
//                           <span className={`text-xs px-2 py-1 rounded-full ${
//                             faq.isActive 
//                               ? "bg-green-100 text-green-800" 
//                               : "bg-gray-100 text-gray-800"
//                           }`}>
//                             {faq.isActive ? "Active" : "Inactive"}
//                           </span>
//                         </div>
//                         <p className="text-muted-foreground text-sm whitespace-pre-wrap">{faq.answer}</p>
//                         <div className="flex items-center gap-3 text-xs">
//                           <span className="text-muted-foreground">
//                             Created: {faq.createdAt ? new Date(faq.createdAt).toLocaleDateString('en-US', { 
//                               month: 'short', 
//                               day: 'numeric', 
//                               year: 'numeric' 
//                             }) : 'N/A'}
//                           </span>
//                           <span className="text-muted-foreground">
//                             Updated: {faq.updatedAt ? new Date(faq.updatedAt).toLocaleDateString('en-US', { 
//                               month: 'short', 
//                               day: 'numeric', 
//                               year: 'numeric' 
//                             }) : 'N/A'}
//                           </span>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-2 ml-4">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => handleToggleFaqStatus(faq)}
//                           className={faq.isActive ? "text-yellow-600" : "text-green-600"}
//                         >
//                           {faq.isActive ? "Deactivate" : "Activate"}
//                         </Button>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => handleEditFaq(faq)}
//                         >
//                           <Edit className="h-4 w-4" />
//                         </Button>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           className="text-red-600 hover:text-red-700 hover:bg-red-50"
//                           onClick={() => handleDeleteFaq(faq._id)}
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </TabsContent>
//       </Tabs>

//       {/* Preview Dialog */}
//       <Dialog open={showPreview} onOpenChange={setShowPreview}>
//         <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>
//               Preview: {currentContent?.label}
//             </DialogTitle>
//           </DialogHeader>
//           <div 
//             className="prose prose-sm max-w-none py-4"
//             dangerouslySetInnerHTML={{ 
//               __html: renderMarkdown(previewContent) || "<p>No content to preview</p>" 
//             }}
//           />
//         </DialogContent>
//       </Dialog>

//       {/* FAQ Add/Edit Dialog */}
//       <Dialog open={faqDialogOpen} onOpenChange={setFaqDialogOpen}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle>{editingFaq ? "Edit FAQ" : "Add New FAQ"}</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             <div className="space-y-2">
//               <label htmlFor="question" className="text-sm font-medium">
//                 Question <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 id="question"
//                 value={faqForm.question}
//                 onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
//                 placeholder="Enter the frequently asked question"
//                 className="w-full"
//               />
//             </div>
//             <div className="space-y-2">
//               <label htmlFor="answer" className="text-sm font-medium">
//                 Answer <span className="text-red-500">*</span>
//               </label>
//               <Textarea
//                 id="answer"
//                 value={faqForm.answer}
//                 onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
//                 placeholder="Enter the detailed answer"
//                 rows={6}
//                 className="w-full resize-none"
//               />
//             </div>
//             <div className="flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 id="isActive"
//                 checked={faqForm.isActive}
//                 onChange={(e) => setFaqForm({ ...faqForm, isActive: e.target.checked })}
//                 className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
//               />
//               <label htmlFor="isActive" className="text-sm font-medium">
//                 Active (show this FAQ on the help page)
//               </label>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setFaqDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button 
//               onClick={handleSaveFaq}
//               disabled={!faqForm.question.trim() || !faqForm.answer.trim()}
//             >
//               {editingFaq ? "Update FAQ" : "Create FAQ"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }

import { useState, useEffect } from "react";
import { useI18n } from "@/contexts/I18nContext";
import { Eye, Save, FileText, Plus, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  getTermsApi,
  createTermsApi,
  updateTermsApi,
  getPrivacyApi,
  createPrivacyApi,
  updatePrivacyApi,
  getFaqsApi,
  createFaqApi,
  updateFaqApi,
  deleteFaqApi
} from "../utils/api";

export default function ContentPage() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("terms");
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [faqDialogOpen, setFaqDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  
  // Quill editor modules configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['blockquote', 'code-block'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet', 'indent',
    'align',
    'link', 'image', 'video',
    'blockquote', 'code-block'
  ];

  // Terms state
  const [terms, setTerms] = useState({
    _id: null,
    content: "",
    timestamp: "",
    updated: ""
  });

  // Privacy state
  const [privacy, setPrivacy] = useState({
    _id: null,
    content: "",
    timestamp: "",
    updated: ""
  });
  
  // FAQs state - always initialize as empty array
  const [faqs, setFaqs] = useState([]);
  
  // FAQ form state
  const [faqForm, setFaqForm] = useState({
    question: "",
    answer: "",
    isActive: true
  });

  // Fetch all content on component mount
  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchTerms(),
        fetchPrivacy(),
        fetchFaqs()
      ]);
    } catch (error) {
      console.error("Error fetching content:", error);
      toast.error("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Terms
  const fetchTerms = async () => {
    try {
      const response = await getTermsApi();
      if (response && response.data) {
        setTerms({
          _id: response.data.data._id || null,
          content: response.data.data.content || "",
          timestamp: response.data.data.timestamp || "",
          updated: response.data.data.timestamp 
            ? new Date(response.data.data.timestamp).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })
            : "Not published"
        });
      }
    } catch (error) {
      console.error("Error fetching terms:", error);
      toast.error("Failed to fetch Terms & Conditions");
    }
  };

  // Fetch Privacy
  const fetchPrivacy = async () => {
    try {
      const response = await getPrivacyApi();
      if (response && response.data) {
        setPrivacy({
          _id: response.data.data._id || null,
          content: response.data.data.content || "",
          timestamp: response.data.data.timestamp || "",
          updated: response.data.data.timestamp 
            ? new Date(response.data.data.timestamp).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })
            : "Not published"
        });
      }
    } catch (error) {
      console.error("Error fetching privacy:", error);
      toast.error("Failed to fetch Privacy Policy");
    }
  };

  // Fetch FAQs - FIXED: Ensure we always set an array
  const fetchFaqs = async () => {
    try {
      const response = await getFaqsApi();
      console.log("FAQs API response:", response);
      
      // Handle different possible response structures
      let faqsData = [];
      
      if (response.data) {
        // If response.data is an array
        if (Array.isArray(response.data)) {
          faqsData = response.data;
        }
        // If response.data.data is an array (nested response)
        else if (response.data.data && Array.isArray(response.data.data)) {
          faqsData = response.data.data;
        }
        // If response.data is an object with items property
        else if (response.data.items && Array.isArray(response.data.items)) {
          faqsData = response.data.items;
        }
        // If response.data is an object with faqs property
        else if (response.data.faqs && Array.isArray(response.data.faqs)) {
          faqsData = response.data.faqs;
        }
        // If it's a single object, wrap in array
        else if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
          faqsData = [response.data];
        }
      } else if (response.success && response.data) {
        // Handle response.success pattern
        if (Array.isArray(response.data)) {
          faqsData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          faqsData = response.data.data;
        }
      }
      
      setFaqs(faqsData);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      toast.error("Failed to fetch FAQs");
      setFaqs([]); // Set empty array on error
    }
  };

  // Get current content based on active tab
  const getCurrentContent = () => {
    switch (activeTab) {
      case "terms":
        return {
          ...terms,
          key: "terms",
          label: "Terms & Conditions"
        };
      case "privacy":
        return {
          ...privacy,
          key: "privacy",
          label: "Privacy Policy"
        };
      case "faq":
        return {
          key: "faq",
          label: "FAQ",
          faqs: faqs
        };
      default:
        return null;
    }
  };

  const currentContent = getCurrentContent();

  // Handle content change for Terms and Privacy with Quill
  const handleContentChange = (value) => {
    if (activeTab === "terms") {
      setTerms(prev => ({
        ...prev,
        content: value
      }));
    } else if (activeTab === "privacy") {
      setPrivacy(prev => ({
        ...prev,
        content: value
      }));
    }
  };

  // Publish content
  const handlePublish = async () => {
    try {
      if (activeTab === "terms") {
        await publishTerms();
      } else if (activeTab === "privacy") {
        await publishPrivacy();
      } else if (activeTab === "faq") {
        toast.info("FAQ changes are saved individually");
      }
    } catch (error) {
      console.error("Error publishing:", error);
      toast.error("Failed to publish content");
    }
  };

  // Publish Terms
  const publishTerms = async () => {
    const payload = {
      content: terms.content
    };

    let response;
    if (terms._id) {
      response = await updateTermsApi(terms._id, payload);
    } else {
      response = await createTermsApi(payload);
    }

    if (response.success) {
      const now = new Date();
      setTerms(prev => ({
        ...prev,
        _id: response.data._id || prev._id,
        timestamp: response.data.timestamp || now.toISOString(),
        updated: now.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        })
      }));
      toast.success("Terms & Conditions published successfully!");
    }
  };

  // Publish Privacy
  const publishPrivacy = async () => {
    const payload = {
      content: privacy.content
    };

    let response;
    if (privacy._id) {
      response = await updatePrivacyApi(privacy._id, payload);
    } else {
      response = await createPrivacyApi(payload);
    }

    if (response.success) {
      const now = new Date();
      setPrivacy(prev => ({
        ...prev,
        _id: response.data._id || prev._id,
        timestamp: response.data.timestamp || now.toISOString(),
        updated: now.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        })
      }));
      toast.success("Privacy Policy published successfully!");
    }
  };

  // Preview content - Convert HTML to plain text for preview
  const handlePreview = () => {
    if (currentContent) {
      if (activeTab === "faq") {
        // Ensure faqs is an array before using map
        const faqList = Array.isArray(faqs) ? faqs : [];
        const faqPreview = faqList.map(faq => 
          `## Q: ${faq.question}\n\nA: ${faq.answer.replace(/<[^>]*>/g, '')}\n\n---\n`
        ).join('');
        setPreviewContent(faqPreview || "No FAQs available");
      } else {
        // Strip HTML tags for plain text preview
        const plainText = currentContent.content.replace(/<[^>]*>/g, '');
        setPreviewContent(plainText || "No content available");
      }
      setShowPreview(true);
    }
  };

  // FAQ Handlers
  const handleAddFaq = () => {
    setEditingFaq(null);
    setFaqForm({
      question: "",
      answer: "",
      isActive: true
    });
    setFaqDialogOpen(true);
  };

  const handleEditFaq = (faq) => {
    setEditingFaq(faq);
    setFaqForm({
      question: faq.question || "",
      answer: faq.answer || "",
      isActive: faq.isActive !== undefined ? faq.isActive : true
    });
    setFaqDialogOpen(true);
  };

  const handleDeleteFaq = async (faqId) => {
    if (window.confirm("Are you sure you want to delete this FAQ?")) {
      try {
        const response = await deleteFaqApi(faqId);
        if (response.success) {
          setFaqs(prev => {
            // Ensure prev is an array before filtering
            const currentFaqs = Array.isArray(prev) ? prev : [];
            return currentFaqs.filter(faq => faq._id !== faqId);
          });
          toast.success("FAQ deleted successfully");
        }
      } catch (error) {
        console.error("Error deleting FAQ:", error);
        toast.error("Failed to delete FAQ");
      }
    }
  };

  const handleSaveFaq = async () => {
    if (!faqForm.question.trim()) {
      toast.error("Question is required");
      return;
    }
    if (!faqForm.answer.trim()) {
      toast.error("Answer is required");
      return;
    }

    try {
      let response;
      const payload = {
        question: faqForm.question.trim(),
        answer: faqForm.answer.trim(),
        isActive: faqForm.isActive
      };

      if (editingFaq) {
        response = await updateFaqApi(editingFaq._id, payload);
      } else {
        response = await createFaqApi(payload);
      }

      if (response.success) {
        if (editingFaq) {
          setFaqs(prev => {
            const currentFaqs = Array.isArray(prev) ? prev : [];
            return currentFaqs.map(faq => 
              faq._id === editingFaq._id 
                ? { ...faq, ...payload, updatedAt: new Date().toISOString() } 
                : faq
            );
          });
          toast.success("FAQ updated successfully");
        } else {
          // Handle different response structures for created FAQ
          const newFaq = response.data?.data || response.data || {};
          setFaqs(prev => {
            const currentFaqs = Array.isArray(prev) ? prev : [];
            return [...currentFaqs, newFaq];
          });
          toast.success("FAQ added successfully");
        }
        setFaqDialogOpen(false);
        setFaqForm({ question: "", answer: "", isActive: true });
      }
    } catch (error) {
      console.error("Error saving FAQ:", error);
      toast.error("Failed to save FAQ");
    }
  };

  const handleToggleFaqStatus = async (faq) => {
    try {
      const payload = {
        question: faq.question,
        answer: faq.answer,
        isActive: !faq.isActive
      };
      const response = await updateFaqApi(faq._id, payload);
      if (response.success) {
        setFaqs(prev => {
          const currentFaqs = Array.isArray(prev) ? prev : [];
          return currentFaqs.map(f => 
            f._id === faq._id ? { ...f, isActive: !f.isActive } : f
          );
        });
        toast.success(`FAQ ${!faq.isActive ? 'activated' : 'deactivated'} successfully`);
      }
    } catch (error) {
      console.error("Error toggling FAQ status:", error);
      toast.error("Failed to update FAQ status");
    }
  };

  // Markdown renderer (keep for preview)
  const renderMarkdown = (text) => {
    if (!text) return "";
    return text
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
      .replace(/\n/gim, '<br />');
  };

  // Safe getter for active FAQs count
  const getActiveFaqsCount = () => {
    if (!Array.isArray(faqs)) return 0;
    return faqs.filter(f => f.isActive).length;
  };

  // Strip HTML for preview in FAQ dialog
  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted rounded-xl p-1">
          <TabsTrigger value="terms" className="rounded-lg text-sm font-medium">
            Terms & Conditions
          </TabsTrigger>
          <TabsTrigger value="privacy" className="rounded-lg text-sm font-medium">
            Privacy Policy
          </TabsTrigger>
          <TabsTrigger value="faq" className="rounded-lg text-sm font-medium">
            FAQ
          </TabsTrigger>
        </TabsList>

        {/* Terms & Conditions Tab */}
        <TabsContent value="terms">
          <div className="bg-card rounded-2xl shadow-card border border-border p-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-lavender flex items-center justify-center">
                  <FileText className="h-5 w-5 text-lavender-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Terms & Conditions</h3>
                  <p className="text-xs text-muted-foreground">
                    Last updated: {terms.updated}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                <Button variant="outline" size="sm" className="gap-1.5" onClick={handlePreview}>
                  <Eye className="h-4 w-4" /> Preview
                </Button>
                <Button size="sm" className="gap-1.5" onClick={handlePublish}>
                  <Save className="h-4 w-4" /> Publish
                </Button>
              </div>
            </div>

            {/* React Quill Editor */}
            <div className="quill-editor-container">
              <ReactQuill
                theme="snow"
                value={terms.content}
                onChange={handleContentChange}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Enter Terms & Conditions..."
              />
            </div>
          </div>
        </TabsContent>

        {/* Privacy Policy Tab */}
        <TabsContent value="privacy">
          <div className="bg-card rounded-2xl shadow-card border border-border p-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-lavender flex items-center justify-center">
                  <FileText className="h-5 w-5 text-lavender-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Privacy Policy</h3>
                  <p className="text-xs text-muted-foreground">
                    Last updated: {privacy.updated}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                <Button variant="outline" size="sm" className="gap-1.5" onClick={handlePreview}>
                  <Eye className="h-4 w-4" /> Preview
                </Button>
                <Button size="sm" className="gap-1.5" onClick={handlePublish}>
                  <Save className="h-4 w-4" /> Publish
                </Button>
              </div>
            </div>

            {/* React Quill Editor */}
            <div className="quill-editor-container">
              <ReactQuill
                theme="snow"
                value={privacy.content}
                onChange={handleContentChange}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Enter Privacy Policy..."
              />
            </div>
          </div>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq">
          <div className="bg-card rounded-2xl shadow-card border border-border p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-lavender flex items-center justify-center">
                  <FileText className="h-5 w-5 text-lavender-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Frequently Asked Questions</h3>
                  <p className="text-xs text-muted-foreground">
                    Total FAQs: {Array.isArray(faqs) ? faqs.length : 0} | Active: {getActiveFaqsCount()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1.5" onClick={handlePreview}>
                  <Eye className="h-4 w-4" /> Preview All
                </Button>
                <Button size="sm" className="gap-1.5" onClick={handleAddFaq}>
                  <Plus className="h-4 w-4" /> Add FAQ
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {!Array.isArray(faqs) || faqs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No FAQs added yet. Click "Add FAQ" to create one.
                </div>
              ) : (
                faqs.map((faq) => (
                  <div key={faq._id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-foreground">{faq.question}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            faq.isActive 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {faq.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <div 
                          className="text-muted-foreground text-sm prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: faq.answer || "" }}
                        />
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-muted-foreground">
                            Created: {faq.createdAt ? new Date(faq.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            }) : 'N/A'}
                          </span>
                          <span className="text-muted-foreground">
                            Updated: {faq.updatedAt ? new Date(faq.updatedAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            }) : 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleFaqStatus(faq)}
                          className={faq.isActive ? "text-yellow-600" : "text-green-600"}
                        >
                          {faq.isActive ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditFaq(faq)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteFaq(faq._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Preview: {currentContent?.label}
            </DialogTitle>
          </DialogHeader>
          <div 
            className="prose prose-sm max-w-none py-4"
            dangerouslySetInnerHTML={{ 
              __html: renderMarkdown(previewContent) || "<p>No content to preview</p>" 
            }}
          />
        </DialogContent>
      </Dialog>

      {/* FAQ Add/Edit Dialog */}
      <Dialog open={faqDialogOpen} onOpenChange={setFaqDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingFaq ? "Edit FAQ" : "Add New FAQ"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="question" className="text-sm font-medium">
                Question <span className="text-red-500">*</span>
              </label>
              <Input
                id="question"
                value={faqForm.question}
                onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                placeholder="Enter the frequently asked question"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="answer" className="text-sm font-medium">
                Answer <span className="text-red-500">*</span>
              </label>
              <div className="quill-editor-container">
                <ReactQuill
                  theme="snow"
                  value={faqForm.answer}
                  onChange={(value) => setFaqForm({ ...faqForm, answer: value })}
                  modules={{
                    toolbar: [
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      ['link'],
                      ['clean']
                    ]
                  }}
                  formats={['bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'link']}
                  placeholder="Enter the detailed answer..."
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={faqForm.isActive}
                onChange={(e) => setFaqForm({ ...faqForm, isActive: e.target.checked })}
                className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
              />
              <label htmlFor="isActive" className="text-sm font-medium">
                Active (show this FAQ on the help page)
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFaqDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveFaq}
              disabled={!faqForm.question.trim() || !faqForm.answer.trim()}
            >
              {editingFaq ? "Update FAQ" : "Create FAQ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx>{`
        .quill-editor-container {
          width: 100%;
          border-radius: 0.75rem;
          overflow: hidden;
        }
        :global(.ql-container) {
          border-bottom-left-radius: 0.75rem;
          border-bottom-right-radius: 0.75rem;
          background-color: hsl(var(--background));
          min-height: 400px;
          font-size: 14px;
        }
        :global(.ql-toolbar) {
          border-top-left-radius: 0.75rem;
          border-top-right-radius: 0.75rem;
          border: 1px solid hsl(var(--border));
          background-color: hsl(var(--muted));
        }
        :global(.ql-container) {
          border: 1px solid hsl(var(--border));
          border-top: none;
        }
        :global(.ql-editor) {
          min-height: 400px;
          color: hsl(var(--foreground));
        }
      `}</style>
    </>
  );
}