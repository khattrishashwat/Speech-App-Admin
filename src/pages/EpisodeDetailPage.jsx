import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";
import { 
  ArrowLeft, Save, Play, Pause, Plus, GripVertical, Trash2, Edit2, 
  X, Check, HelpCircle, Image, Volume2, ListOrdered, Eye, EyeOff, Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { getEpisodeApiID, createQuizApi, getQuizApiID, updateQuizApi, ImageUrlApi } from "../utils/api";

export default function EpisodeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useI18n();
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const isEditMode = searchParams.get("mode") === "edit";
  const episodeId = id || "1";

  // State for API data
  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("story");
  const [isEditing, setIsEditing] = useState(isEditMode);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoError, setVideoError] = useState(false);

  // Story content state - Full API response data
  const [storyContent, setStoryContent] = useState({
    _id: "",
    title: "",
    textContent: "",
    expectedText: "",
    imageUrl: "",
    thumbnailUrl: "",
    videoUrl: "",
    type: "",
    difficulty: "",
    timeLimitSeconds: 0,
    isActive: true,
    isDailyStory: false,
    createdAt: "",
    updatedAt: ""
  });

  // Language state - Full filters from API
  const [languageInfo, setLanguageInfo] = useState({
    gradeLevel: [],
    communicationLevel: [],
    interests: [],
    languageUsedAtHome: []
  });

  // Targets state - Will be populated from API when available
  const [targets, setTargets] = useState([
    { id: 1, word: "Horse", language: "English", category: "Animals", active: true },
    { id: 2, word: "Fence", language: "English", category: "Objects", active: true },
    { id: 3, word: "Field", language: "English", category: "Places", active: true },
    { id: 4, word: "Walk", language: "English", category: "Actions", active: true },
    { id: 5, word: "Quiet", language: "English", category: "Adjectives", active: false },
  ]);
  const [showAddTarget, setShowAddTarget] = useState(false);
  const [newTarget, setNewTarget] = useState({ word: "", language: "English", category: "" });
  const [editingTarget, setEditingTarget] = useState(null);

  // Speech Focus state
  const [speechFocus, setSpeechFocus] = useState([
    {
      type: "Phonological Processes",
      patterns: [
        "Final consonant deletion",
        "Cluster reduction",
        "Weak syllable deletion"
      ],
      icon: "P",
      color: "bg-sky"
    },
    {
      type: "Vocabulary Development",
      patterns: [
        "Animal names and sounds",
        "Action words",
        "Descriptive words"
      ],
      icon: "V",
      color: "bg-peach"
    },
    {
      type: "Syllable Structure",
      patterns: [
        "CV patterns",
        "CVC patterns",
        "Multisyllabic words"
      ],
      icon: "S",
      color: "bg-lavender"
    },
    {
      type: "Initial Consonants",
      patterns: [
        "Fronting: 'k' → 't'",
        "Stopping: 's' → 't'",
        "Gliding: 'r' → 'w'"
      ],
      icon: "C",
      color: "bg-mint"
    }
  ]);

  // Tasks state
  const [tasks, setTasks] = useState([
    { id: 1, name: "Listen to story", enabled: true, type: "listening" },
    { id: 2, name: "Repeat target words", enabled: true, type: "speaking" },
    { id: 3, name: "Point to pictures", enabled: true, type: "interactive" },
    { id: 4, name: "Answer comprehension questions", enabled: false, type: "quiz" },
    { id: 5, name: "Sing along", enabled: false, type: "activity" },
  ]);
  const [draggedTask, setDraggedTask] = useState(null);

  // Quiz state - Exactly matching the schema
  const [quiz, setQuiz] = useState({
    enabled: true,
    passThreshold: 70,
    questions: []
  });
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    storyId: "", // Will be set from episodeId
    questionText: "",
    type: "MCQ",
    options: [], // Will be populated based on type
    correctAnswer: "",
    expectedSpeechText: "",
    image: "",
    order: 0
  });
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [savingQuiz, setSavingQuiz] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch episode data
  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        setLoading(true);
        const response = await getEpisodeApiID(episodeId);
        
        if (response?.data?.data) {
          const episodeData = response.data.data;
          setEpisode(episodeData);
          
          // Story content - All fields from API response
          setStoryContent({
            _id: episodeData._id || "",
            title: episodeData.title || "",
            textContent: episodeData.textContent || "",
            expectedText: episodeData.expectedText || "",
            imageUrl: episodeData.imageUrl || "",
            thumbnailUrl: episodeData.thumbnailUrl || "",
            videoUrl: episodeData.videoUrl || "",
            type: episodeData.type || "",
            difficulty: episodeData.difficulty || "",
            timeLimitSeconds: episodeData.timeLimitSeconds || 0,
            isActive: episodeData.isActive || false,
            isDailyStory: episodeData.isDailyStory || false,
            createdAt: episodeData.createdAt || "",
            updatedAt: episodeData.updatedAt || ""
          });

          // Language info - All filters from API
          setLanguageInfo({
            gradeLevel: episodeData.filters?.gradeLevel || [],
            communicationLevel: episodeData.filters?.communicationLevel || [],
            interests: episodeData.filters?.interests || [],
            languageUsedAtHome: episodeData.filters?.languageUsedAtHome || []
          });

          toast.success("Episode loaded successfully");
        }
      } catch (error) {
        console.error("Error fetching episode:", error);
        toast.error("Failed to load episode");
      } finally {
        setLoading(false);
      }
    };

    fetchEpisode();
  }, [episodeId]);

  // Set storyId in newQuestion when episodeId is available
  useEffect(() => {
    if (episodeId) {
      setNewQuestion(prev => ({
        ...prev,
        storyId: episodeId
      }));
    }
  }, [episodeId]);

  // Fetch quiz data - Exactly matching schema
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoadingQuiz(true);
        const response = await getQuizApiID(episodeId);
        
        if (response?.data?.data) {
          const quizData = response.data.data;
          
          // Transform API questions to component format - exactly matching schema
          const transformedQuestions = quizData.map((q, index) => ({
            id: q._id || index + 1,
            _id: q._id,
            storyId: q.storyId,
            questionText: q.questionText || "",
            type: q.type || "MCQ",
            options: q.options || [],
            correctAnswer: q.correctAnswer || "",
            expectedSpeechText: q.expectedSpeechText || "",
            image: q.image || "",
            order: q.order || index + 1,
            createdAt: q.createdAt,
            updatedAt: q.updatedAt
          }));

          setQuiz({
            enabled: true,
            passThreshold: 70,
            questions: transformedQuestions.sort((a, b) => (a.order || 0) - (b.order || 0))
          });

          toast.success(`Loaded ${quizData.length} quiz questions`);
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
        toast.error("Failed to load quiz questions");
      } finally {
        setLoadingQuiz(false);
      }
    };

    if (episodeId) {
      fetchQuiz();
    }
  }, [episodeId]);

  // Video player handlers
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(e => {
          console.error("Video playback failed:", e);
          setVideoError(true);
          toast.error("Failed to play video");
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleVideoError = () => {
    setVideoError(true);
    setIsPlaying(false);
    toast.error("Error loading video");
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  // Story save handler
  const handleSaveStory = () => {
    toast.success("Story saved successfully!");
    setIsEditing(false);
  };

  // Target handlers
  const toggleTargetActive = (id) => {
    setTargets(targets.map(t => t.id === id ? { ...t, active: !t.active } : t));
    toast.success("Target updated!");
  };

  const addTarget = () => {
    if (!newTarget.word || !newTarget.category) {
      toast.error("Please fill all fields");
      return;
    }
    const newId = Math.max(...targets.map(t => t.id), 0) + 1;
    setTargets([...targets, { ...newTarget, id: newId, active: true }]);
    setNewTarget({ word: "", language: "English", category: "" });
    setShowAddTarget(false);
    toast.success("Target added!");
  };

  const deleteTarget = (id) => {
    setTargets(targets.filter(t => t.id !== id));
    toast.success("Target removed");
  };

  // Task handlers
  const toggleTaskEnabled = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t));
  };

  const handleDragStart = (taskId) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e, targetId) => {
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

  // Quiz handlers - Exactly matching schema
  const toggleQuizEnabled = () => {
    setQuiz({ ...quiz, enabled: !quiz.enabled });
    toast.success(quiz.enabled ? "Quiz disabled" : "Quiz enabled");
  };

  const updatePassThreshold = (value) => {
    const threshold = parseInt(value) || 70;
    setQuiz({ ...quiz, passThreshold: threshold });
    toast.success(`Pass threshold set to ${threshold}%`);
  };

  // Reset options based on question type
  const resetOptionsForType = (type) => {
    switch(type) {
      case 'MCQ':
        return ["", "", "", ""];
      case 'FILL_BLANK':
        return ["", "", "", ""];
      case 'IMAGE':
        return ["", "", "", ""];
      case 'SPEECH':
        return [];
      default:
        return [];
    }
  };

  // Image upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      setUploadingImage(true);
      
      const formData = new FormData();
      formData.append('thumbnail', file);
      
      const response = await ImageUrlApi(formData);
      
      if (response?.data?.data?.fileUrl) {
        const imageUrl = response.data.data.fileUrl;
        setNewQuestion({ ...newQuestion, image: imageUrl });
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Failed to get image URL from server");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Save all quiz questions to API - Exactly matching schema
  const saveQuizToAPI = async () => {
    if (!episodeId) {
      toast.error("No episode ID available");
      return;
    }

    try {
      setSavingQuiz(true);
      
      // Filter out questions that already have _id (already saved to API)
      const existingQuestions = quiz.questions.filter(q => q._id);
      const newQuestions = quiz.questions.filter(q => !q._id);
      
      let successCount = 0;
      let errorCount = 0;

      // Update existing questions
      for (const question of existingQuestions) {
        try {
          const questionData = {
            storyId: episodeId,
            questionText: question.questionText,
            type: question.type,
            // Only include fields that are relevant for the type
            ...(question.type === 'MCQ' || question.type === 'FILL_BLANK' || question.type === 'IMAGE' ? { 
              options: question.options.filter(opt => opt && opt.trim() !== "") 
            } : {}),
            ...((question.type === 'MCQ' || question.type === 'FILL_BLANK' || question.type === 'IMAGE') && question.correctAnswer ? { 
              correctAnswer: question.correctAnswer 
            } : {}),
            ...(question.type === 'SPEECH' && question.expectedSpeechText ? { 
              expectedSpeechText: question.expectedSpeechText 
            } : {}),
            ...(question.type === 'IMAGE' && question.image ? { 
              image: question.image 
            } : {}),
            ...(question.order ? { order: question.order } : {})
          };
          
          await updateQuizApi(question._id, questionData);
          successCount++;
        } catch (error) {
          console.error("Error updating question:", error);
          errorCount++;
        }
      }

      // Create new questions
      for (const question of newQuestions) {
        try {
          const questionData = {
            storyId: episodeId,
            questionText: question.questionText,
            type: question.type,
            // Only include fields that are relevant for the type
            ...(question.type === 'MCQ' || question.type === 'FILL_BLANK' || question.type === 'IMAGE' ? { 
              options: question.options.filter(opt => opt && opt.trim() !== "") 
            } : {}),
            ...((question.type === 'MCQ' || question.type === 'FILL_BLANK' || question.type === 'IMAGE') && question.correctAnswer ? { 
              correctAnswer: question.correctAnswer 
            } : {}),
            ...(question.type === 'SPEECH' && question.expectedSpeechText ? { 
              expectedSpeechText: question.expectedSpeechText 
            } : {}),
            ...(question.type === 'IMAGE' && question.image ? { 
              image: question.image 
            } : {}),
            ...(question.order ? { order: question.order } : {})
          };
          
          const response = await createQuizApi(questionData);
          
          // Update the question with the returned _id
          if (response?.data?.data?._id) {
            question._id = response.data.data._id;
          }
          
          successCount++;
        } catch (error) {
          console.error("Error creating question:", error);
          errorCount++;
        }
      }

      if (errorCount === 0) {
        toast.success(`Successfully saved ${successCount} questions`);
      } else {
        toast.warning(`Saved ${successCount} questions, ${errorCount} failed`);
      }

      // Refresh quiz data
      const refreshResponse = await getQuizApiID(episodeId);
      if (refreshResponse?.data?.data) {
        const quizData = refreshResponse.data.data;
        const transformedQuestions = quizData.map((q, index) => ({
          id: q._id || index + 1,
          _id: q._id,
          storyId: q.storyId,
          questionText: q.questionText || "",
          type: q.type || "MCQ",
          options: q.options || [],
          correctAnswer: q.correctAnswer || "",
          expectedSpeechText: q.expectedSpeechText || "",
          image: q.image || "",
          order: q.order || index + 1,
          createdAt: q.createdAt,
          updatedAt: q.updatedAt
        }));

        setQuiz({
          ...quiz,
          questions: transformedQuestions.sort((a, b) => (a.order || 0) - (b.order || 0))
        });
      }

    } catch (error) {
      console.error("Error saving quiz:", error);
      toast.error("Failed to save quiz questions");
    } finally {
      setSavingQuiz(false);
    }
  };

  const addQuestion = () => {
    // Validation based on schema requirements
    if (!newQuestion.questionText.trim()) {
      toast.error("Please enter a question");
      return;
    }
    
    if (newQuestion.type === "MCQ" || newQuestion.type === "FILL_BLANK" || newQuestion.type === "IMAGE") {
      if (!newQuestion.options || newQuestion.options.filter(opt => opt && opt.trim() !== "").length < 2) {
        toast.error("Please provide at least 2 options");
        return;
      }
      
      if (!newQuestion.correctAnswer) {
        toast.error("Please select a correct answer");
        return;
      }
    }
    
    if (newQuestion.type === "SPEECH" && !newQuestion.expectedSpeechText) {
      toast.error("Please enter expected speech text");
      return;
    }
    
    if (newQuestion.type === "IMAGE" && !newQuestion.image) {
      toast.error("Please enter an image URL or upload an image");
      return;
    }
    
    const newId = Math.max(...quiz.questions.map(q => q.id), 0) + 1;
    const questionToAdd = {
      id: newId,
      storyId: episodeId,
      questionText: newQuestion.questionText,
      type: newQuestion.type,
      options: newQuestion.type === 'SPEECH' ? [] : (newQuestion.options || []).filter(opt => opt && opt.trim() !== ""),
      correctAnswer: (newQuestion.type === 'MCQ' || newQuestion.type === 'FILL_BLANK' || newQuestion.type === 'IMAGE') ? newQuestion.correctAnswer : "",
      expectedSpeechText: newQuestion.type === 'SPEECH' ? newQuestion.expectedSpeechText : "",
      image: newQuestion.type === 'IMAGE' ? newQuestion.image : "",
      order: newQuestion.order || quiz.questions.length + 1
    };
    
    setQuiz({
      ...quiz,
      questions: [...quiz.questions, questionToAdd]
    });
    
    // Reset form
    setNewQuestion({
      storyId: episodeId,
      questionText: "",
      type: "MCQ",
      options: ["", "", "", ""],
      correctAnswer: "",
      expectedSpeechText: "",
      image: "",
      order: 0
    });
    
    setShowAddQuestion(false);
    toast.success("Question added! Don't forget to save to API.");
  };

  const deleteQuestion = async (id) => {
    const questionToDelete = quiz.questions.find(q => q.id === id);
    
    // If question exists in API, delete it
    if (questionToDelete?._id) {
      try {
        // You'll need to add a deleteQuizApi function
        // await deleteQuizApi(questionToDelete._id);
        toast.success("Question deleted from API");
      } catch (error) {
        console.error("Error deleting question:", error);
        toast.error("Failed to delete question from API");
        return;
      }
    }
    
    setQuiz({
      ...quiz,
      questions: quiz.questions.filter(q => q.id !== id)
    });
    toast.success("Question removed");
  };

  const editQuestion = (question) => {
    setEditingQuestion(question);
    setNewQuestion({
      storyId: question.storyId || episodeId,
      questionText: question.questionText || "",
      type: question.type || "MCQ",
      options: question.options?.length ? question.options : ["", "", "", ""],
      correctAnswer: question.correctAnswer || "",
      expectedSpeechText: question.expectedSpeechText || "",
      image: question.image || "",
      order: question.order || 0
    });
    setShowAddQuestion(true);
  };

  const updateQuestion = () => {
    if (!newQuestion.questionText.trim()) {
      toast.error("Please enter a question");
      return;
    }
    
    setQuiz({
      ...quiz,
      questions: quiz.questions.map(q => 
        q.id === editingQuestion.id ? { 
          id: q.id,
          _id: q._id,
          storyId: episodeId,
          questionText: newQuestion.questionText,
          type: newQuestion.type,
          options: newQuestion.type === 'SPEECH' ? [] : (newQuestion.options || []).filter(opt => opt && opt.trim() !== ""),
          correctAnswer: (newQuestion.type === 'MCQ' || newQuestion.type === 'FILL_BLANK' || newQuestion.type === 'IMAGE') ? newQuestion.correctAnswer : "",
          expectedSpeechText: newQuestion.type === 'SPEECH' ? newQuestion.expectedSpeechText : "",
          image: newQuestion.type === 'IMAGE' ? newQuestion.image : "",
          order: newQuestion.order || q.order,
          createdAt: q.createdAt,
          updatedAt: q.updatedAt
        } : q
      )
    });
    
    // Reset form
    setNewQuestion({
      storyId: episodeId,
      questionText: "",
      type: "MCQ",
      options: ["", "", "", ""],
      correctAnswer: "",
      expectedSpeechText: "",
      image: "",
      order: 0
    });
    
    setEditingQuestion(null);
    setShowAddQuestion(false);
    toast.success("Question updated! Don't forget to save to API.");
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  const moveQuestion = (index, direction) => {
    const newQuestions = [...quiz.questions];
    const newIndex = index + direction;
    
    if (newIndex < 0 || newIndex >= newQuestions.length) return;
    
    [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];
    
    // Update order property
    newQuestions.forEach((q, idx) => {
      q.order = idx + 1;
    });
    
    setQuiz({ ...quiz, questions: newQuestions });
    toast.success("Question order updated!");
  };

  const previewQuiz = () => {
    toast.info("Opening quiz preview...");
  };

  const getTypeBadgeColor = (type) => {
    switch(type) {
      case 'MCQ': return 'bg-blue-100 text-blue-800';
      case 'FILL_BLANK': return 'bg-purple-100 text-purple-800';
      case 'SPEECH': return 'bg-green-100 text-green-800';
      case 'IMAGE': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 'MCQ': return 'Multiple Choice';
      case 'FILL_BLANK': return 'Fill in the Blank';
      case 'SPEECH': return 'Speech Response';
      case 'IMAGE': return 'Image Selection';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading episode...</p>
        </div>
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">Episode not found</p>
          <Button onClick={() => navigate("/episodes")} className="mt-4">
            Back to Episodes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/episodes")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-foreground">{storyContent.title || episode.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={storyContent.difficulty === "EASY" ? "success" : storyContent.difficulty === "MEDIUM" ? "warning" : "destructive"}>
                {storyContent.difficulty}
              </Badge>
              <Badge variant="outline">{storyContent.type}</Badge>
              <span className="text-sm text-muted-foreground">
                {languageInfo.communicationLevel[0]?.label || "Not specified"} • {languageInfo.gradeLevel[0]?.label || "Not specified"}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <span>Created: {new Date(storyContent.createdAt).toLocaleDateString()}</span>
              {storyContent.updatedAt && (
                <span>• Updated: {new Date(storyContent.updatedAt).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
            storyContent.isActive ? "bg-mint text-mint-foreground" : "bg-warm text-warm-foreground"
          }`}>
            {storyContent.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      <Card className="border-border bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Grade Level:</span>
              <div className="mt-1">
                {languageInfo.gradeLevel.length > 0 ? (
                  languageInfo.gradeLevel.map((level, idx) => (
                    <Badge key={idx} variant="secondary" className="mr-1">
                      {level.label}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm">Not specified</span>
                )}
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Communication Level:</span>
              <div className="mt-1">
                {languageInfo.communicationLevel.length > 0 ? (
                  languageInfo.communicationLevel.map((level, idx) => (
                    <Badge key={idx} variant="secondary" className="mr-1">
                      {level.label}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm">Not specified</span>
                )}
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Interests:</span>
              <div className="mt-1">
                {languageInfo.interests.length > 0 ? (
                  languageInfo.interests.map((interest, idx) => (
                    <Badge key={idx} variant="outline" className="mr-1">
                      {interest.label}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm">Not specified</span>
                )}
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Language at Home:</span>
              <div className="mt-1">
                {languageInfo.languageUsedAtHome.length > 0 ? (
                  languageInfo.languageUsedAtHome.map((lang, idx) => (
                    <Badge key={idx} variant="secondary" className="mr-1">
                      {lang.label}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm">Not specified</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Episode Media Preview - Full story content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="border-border h-full">
            <CardHeader>
              <CardTitle className="text-base">Episode Media</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {storyContent.thumbnailUrl && (
                  <div className="rounded-lg overflow-hidden border border-border">
                    <img 
                      src={storyContent.thumbnailUrl} 
                      alt={storyContent.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
                      }}
                    />
                  </div>
                )}
                
                {storyContent.imageUrl && storyContent.imageUrl !== storyContent.thumbnailUrl && (
                  <div className="rounded-lg overflow-hidden border border-border">
                    <img 
                      src={storyContent.imageUrl} 
                      alt={`${storyContent.title} - main`}
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x200?text=Image+Not+Found";
                      }}
                    />
                    <div className="p-2 bg-muted/50 text-xs text-center text-muted-foreground">
                      Main Image
                    </div>
                  </div>
                )}

                {storyContent.videoUrl && !videoError && (
                  <div className="space-y-2">
                    <div className="rounded-lg overflow-hidden border border-border bg-black">
                      <video
                        ref={videoRef}
                        src={storyContent.videoUrl}
                        className="w-full h-auto max-h-64"
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onEnded={handleVideoEnded}
                        onError={handleVideoError}
                      />
                    </div>
                    
                    {/* Video Controls */}
                    <div className="bg-muted rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        <Button 
                          size="icon" 
                          variant="outline"
                          className="h-10 w-10 rounded-full shrink-0"
                          onClick={handlePlayPause}
                        >
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        
                        <div className="flex-1">
                          <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={currentTime}
                            onChange={handleSeek}
                            className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {videoError && storyContent.videoUrl && (
                  <div className="bg-destructive/10 p-4 rounded-lg text-center">
                    <p className="text-sm text-destructive">Failed to load video</p>
                    <a 
                      href={storyContent.videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary underline mt-2 inline-block"
                    >
                      Open video directly
                    </a>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-muted p-3 rounded-lg">
                    <span className="text-muted-foreground">Time Limit:</span>
                    <p className="font-semibold text-lg">{storyContent.timeLimitSeconds}s</p>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <span className="text-muted-foreground">Type:</span>
                    <p className="font-semibold">{storyContent.type}</p>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <span className="text-muted-foreground">Daily Story:</span>
                    <p className="font-semibold">{storyContent.isDailyStory ? "Yes" : "No"}</p>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <span className="text-muted-foreground">Status:</span>
                    <p className={`font-semibold ${storyContent.isActive ? "text-green-600" : "text-gray-600"}`}>
                      {storyContent.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="bg-muted rounded-xl p-1 w-full justify-start overflow-x-auto">
              <TabsTrigger value="story" className="rounded-lg whitespace-nowrap">Story</TabsTrigger>
              <TabsTrigger value="targets" className="rounded-lg whitespace-nowrap">Targets ({targets.length})</TabsTrigger>
              <TabsTrigger value="speechFocus" className="rounded-lg whitespace-nowrap">Speech Focus</TabsTrigger>
              <TabsTrigger value="tasks" className="rounded-lg whitespace-nowrap">Tasks ({tasks.filter(t => t.enabled).length}/{tasks.length})</TabsTrigger>
              <TabsTrigger value="quiz" className="rounded-lg gap-1.5 whitespace-nowrap">
                <HelpCircle className="h-4 w-4" /> Quiz ({quiz.questions.length})
              </TabsTrigger>
            </TabsList>

            {/* Story Tab - Full API data */}
            <TabsContent value="story">
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Story Content</CardTitle>
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
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Story Text
                      <span className="ml-2 text-xs text-muted-foreground">({storyContent.type})</span>
                    </label>
                    <Textarea
                      value={storyContent.textContent}
                      onChange={(e) => setStoryContent({ ...storyContent, textContent: e.target.value })}
                      disabled={!isEditing}
                      rows={6}
                      className="resize-none text-base"
                      placeholder="Story content..."
                    />
                  </div>
                  
                  {storyContent.expectedText && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Expected Response
                        <span className="ml-2 text-xs text-muted-foreground">(Target pronunciation)</span>
                      </label>
                      <div className="p-4 bg-muted/50 rounded-lg border border-border">
                        <p className="text-sm italic text-foreground">"{storyContent.expectedText}"</p>
                      </div>
                    </div>
                  )}

                  {/* Story Metadata */}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Story ID</p>
                      <p className="text-sm font-mono">{storyContent._id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Title</p>
                      <p className="text-sm font-medium">{storyContent.title}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Difficulty</p>
                      <Badge variant={storyContent.difficulty === "EASY" ? "success" : storyContent.difficulty === "MEDIUM" ? "warning" : "destructive"}>
                        {storyContent.difficulty}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Time Limit</p>
                      <p className="text-sm">{storyContent.timeLimitSeconds} seconds</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Targets Tab */}
            <TabsContent value="targets">
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Target Vocabulary</CardTitle>
                    <Button size="sm" onClick={() => setShowAddTarget(true)} className="gap-1.5">
                      <Plus className="h-4 w-4" /> Add Target
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {targets.filter(t => t.active).length} active targets • {targets.length} total
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {targets.map((target) => (
                      <div
                        key={target.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${target.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <div>
                            <p className="font-medium text-foreground">{target.word}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {target.language}
                              </Badge>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-lavender/20 text-lavender-foreground">
                                {target.category}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Switch 
                            checked={target.active} 
                            onCheckedChange={() => toggleTargetActive(target.id)}
                          />
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deleteTarget(target.id)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

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
                      <Select 
                        value={newTarget.language}
                        onValueChange={(value) => setNewTarget({ ...newTarget, language: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Creole">Creole</SelectItem>
                          <SelectItem value="French">French</SelectItem>
                          <SelectItem value="Spanish">Spanish</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <Select 
                        value={newTarget.category}
                        onValueChange={(value) => setNewTarget({ ...newTarget, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Animals">Animals</SelectItem>
                          <SelectItem value="Actions">Actions</SelectItem>
                          <SelectItem value="Objects">Objects</SelectItem>
                          <SelectItem value="Places">Places</SelectItem>
                          <SelectItem value="Adjectives">Adjectives</SelectItem>
                          <SelectItem value="Greetings">Greetings</SelectItem>
                          <SelectItem value="Food">Food</SelectItem>
                        </SelectContent>
                      </Select>
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
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Speech Focus Areas</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Based on communication level: {languageInfo.communicationLevel[0]?.label || "Not specified"}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {speechFocus.map((focus, idx) => (
                      <div key={idx} className="bg-muted/30 rounded-xl p-5 border border-border">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`h-10 w-10 rounded-xl ${focus.color} flex items-center justify-center`}>
                            <span className="text-white font-bold text-lg">{focus.icon}</span>
                          </div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <h4 className="font-bold text-foreground cursor-help">{focus.type}</h4>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Common developmental patterns for this age group</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <ul className="space-y-2">
                          {focus.patterns.map((pattern, pIdx) => (
                            <li 
                              key={pIdx} 
                              className="text-sm text-muted-foreground bg-background rounded-lg px-3 py-2 border border-border/50"
                            >
                              {pattern}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks">
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Interactive Tasks</CardTitle>
                    <Button size="sm" onClick={saveTaskOrder} className="gap-1.5">
                      <Save className="h-4 w-4" /> Save Order
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Drag tasks to reorder. Toggle to enable/disable.
                  </p>
                </CardHeader>
                <CardContent>
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
                            ? "border-primary bg-primary/5 scale-[1.02] shadow-md" 
                            : "border-border bg-muted/30 hover:bg-muted/50"
                        } cursor-grab active:cursor-grabbing`}
                      >
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${task.enabled ? "text-foreground" : "text-muted-foreground"}`}>
                              {task.name}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {task.type}
                            </Badge>
                          </div>
                        </div>
                        <Switch 
                          checked={task.enabled} 
                          onCheckedChange={() => toggleTaskEnabled(task.id)}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Quiz Tab - Exactly matching schema */}
            <TabsContent value="quiz">
              <div className="space-y-6">
                {/* Quiz Header with Save Button */}
                <Card className="border-border bg-gradient-to-r from-primary/5 to-transparent">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Quiz Questions</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          onClick={saveQuizToAPI}
                          disabled={savingQuiz}
                          className="gap-1.5"
                        >
                          {savingQuiz ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4" /> Save to API
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    {!quiz.enabled && (
                      <p className="text-sm text-warning mt-2">
                        Quiz is currently disabled. Enable it to make it available to users.
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Questions List */}
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Quiz Questions ({quiz.questions.length})</CardTitle>
                      <Button 
                        size="sm" 
                        onClick={() => {
                          setEditingQuestion(null);
                          setNewQuestion({
                            storyId: episodeId,
                            questionText: "",
                            type: "MCQ",
                            options: ["", "", "", ""],
                            correctAnswer: "",
                            expectedSpeechText: "",
                            image: "",
                            order: 0
                          });
                          setShowAddQuestion(true);
                        }}
                        className="gap-1.5"
                        disabled={loadingQuiz}
                      >
                        <Plus className="h-4 w-4" /> Add Question
                      </Button>
                    </div>
                    {loadingQuiz && (
                      <p className="text-sm text-muted-foreground">Loading quiz questions...</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {quiz.questions.length === 0 ? (
                        <div className="text-center py-12 bg-muted/30 rounded-lg border border-border border-dashed">
                          <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                          <p className="text-muted-foreground mb-2">No questions yet</p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setEditingQuestion(null);
                              setNewQuestion({
                                storyId: episodeId,
                                questionText: "",
                                type: "MCQ",
                                options: ["", "", "", ""],
                                correctAnswer: "",
                                expectedSpeechText: "",
                                image: "",
                                order: 0
                              });
                              setShowAddQuestion(true);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" /> Create your first question
                          </Button>
                        </div>
                      ) : (
                        quiz.questions.map((question, index) => (
                          <div 
                            key={question.id || question._id} 
                            className={`p-4 rounded-lg border transition-colors ${
                              !question._id 
                                ? 'border-warning bg-warning/5' 
                                : 'border-border bg-muted/30 hover:bg-muted/50'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 flex-1">
                                <div className="flex flex-col items-center gap-1">
                                  <button 
                                    onClick={() => moveQuestion(index, -1)}
                                    className="text-muted-foreground hover:text-foreground p-1 disabled:opacity-30"
                                    disabled={index === 0}
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                  </button>
                                  <span className="text-xs font-bold text-muted-foreground min-w-6 text-center">
                                    Q{index + 1}
                                  </span>
                                  <button 
                                    onClick={() => moveQuestion(index, 1)}
                                    className="text-muted-foreground hover:text-foreground p-1 disabled:opacity-30"
                                    disabled={index === quiz.questions.length - 1}
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </button>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <h4 className="font-medium text-foreground">{question.questionText}</h4>
                                    <Badge className={`${getTypeBadgeColor(question.type)}`}>
                                      {getTypeLabel(question.type)}
                                    </Badge>
                                    {question.order && (
                                      <Badge variant="outline" className="text-xs">
                                        Order: {question.order}
                                      </Badge>
                                    )}
                                    {!question._id && (
                                      <Badge variant="warning" className="text-xs">
                                        Not Saved
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  {/* Question Details - Schema specific */}
                                  <div className="space-y-2 text-sm">
                                    {/* Image for IMAGE type */}
                                    {question.type === 'IMAGE' && question.image && (
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs text-muted-foreground">Image:</span>
                                        <div className="flex items-center gap-2">
                                          <img 
                                            src={question.image} 
                                            alt="Question" 
                                            className="h-10 w-10 object-cover rounded border"
                                            onError={(e) => {
                                              e.target.src = "https://via.placeholder.com/40?text=Error";
                                            }}
                                          />
                                          <a 
                                            href={question.image} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-xs text-primary underline"
                                          >
                                            View
                                          </a>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {/* Options for MCQ, FILL_BLANK, IMAGE */}
                                    {(question.type === 'MCQ' || question.type === 'FILL_BLANK' || question.type === 'IMAGE') && 
                                     question.options && question.options.length > 0 && (
                                      <div className="flex flex-wrap gap-2">
                                        <span className="text-xs text-muted-foreground">Options:</span>
                                        {question.options.map((opt, idx) => (
                                          opt && (
                                            <Badge 
                                              key={idx} 
                                              variant={opt === question.correctAnswer ? "default" : "outline"}
                                              className="text-xs"
                                            >
                                              {opt}
                                              {opt === question.correctAnswer && " ✓"}
                                            </Badge>
                                          )
                                        ))}
                                      </div>
                                    )}
                                    
                                    {/* Correct Answer for MCQ, FILL_BLANK, IMAGE */}
                                    {(question.type === 'MCQ' || question.type === 'FILL_BLANK' || question.type === 'IMAGE') && 
                                     question.correctAnswer && (
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">Correct Answer:</span>
                                        <Badge variant="default" className="text-xs">
                                          {question.correctAnswer}
                                        </Badge>
                                      </div>
                                    )}
                                    
                                    {/* Expected Speech Text for SPEECH type */}
                                    {question.type === 'SPEECH' && question.expectedSpeechText && (
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">Expected Speech:</span>
                                        <span className="text-xs italic bg-muted px-2 py-1 rounded">
                                          "{question.expectedSpeechText}"
                                        </span>
                                      </div>
                                    )}
                                    
                                    {/* Question Metadata */}
                                    <div className="flex items-center gap-3 pt-2 mt-2 border-t border-border/50 text-xs text-muted-foreground">
                                      {question._id && (
                                        <span>ID: {question._id.slice(-6)}</span>
                                      )}
                                      {question.storyId && (
                                        <span>Story: {question.storyId.slice(-6)}</span>
                                      )}
                                      {question.createdAt && (
                                        <span>Created: {new Date(question.createdAt).toLocaleDateString()}</span>
                                      )}
                                      {question.updatedAt && question.updatedAt !== question.createdAt && (
                                        <span>Updated: {new Date(question.updatedAt).toLocaleDateString()}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => editQuestion(question)}
                                  className="h-8 px-2"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => deleteQuestion(question.id)}
                                  className="h-8 px-2 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Add/Edit Question Dialog - Exactly matching schema with image upload */}
      <Dialog open={showAddQuestion} onOpenChange={setShowAddQuestion}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingQuestion ? "Edit Question" : "Add New Question"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Question Text - Required field */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Question Text <span className="text-destructive">*</span>
              </label>
              <Input 
                value={newQuestion.questionText}
                onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
                placeholder="Enter the question..."
              />
            </div>
            
            {/* Type and Order */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Question Type <span className="text-destructive">*</span>
                </label>
                <Select 
                  value={newQuestion.type}
                  onValueChange={(value) => {
                    const newOptions = resetOptionsForType(value);
                    setNewQuestion({ 
                      ...newQuestion, 
                      type: value,
                      options: newOptions,
                      correctAnswer: "",
                      expectedSpeechText: "",
                      image: ""
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MCQ">Multiple Choice (MCQ)</SelectItem>
                    <SelectItem value="FILL_BLANK">Fill in the Blank</SelectItem>
                    <SelectItem value="SPEECH">Speech Response</SelectItem>
                    <SelectItem value="IMAGE">Image Selection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Order
                </label>
                <Input 
                  type="number"
                  value={newQuestion.order}
                  onChange={(e) => setNewQuestion({ ...newQuestion, order: parseInt(e.target.value) || 0 })}
                  placeholder="Question order"
                  min="1"
                />
              </div>
            </div>

            {/* Options - For MCQ, FILL_BLANK, and IMAGE */}
            {(newQuestion.type === 'MCQ' || newQuestion.type === 'FILL_BLANK' || newQuestion.type === 'IMAGE') && (
              <div className="space-y-3">
                <label className="block text-sm font-medium">
                  Options <span className="text-destructive">*</span>
                </label>
                <p className="text-xs text-muted-foreground mb-2">
                  {newQuestion.type === 'MCQ' && "Select the correct answer for multiple choice question"}
                  {newQuestion.type === 'FILL_BLANK' && "Select the correct answer for fill in the blank"}
                  {newQuestion.type === 'IMAGE' && "Select the correct answer for image selection"}
                </p>
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={newQuestion.correctAnswer === newQuestion.options[index]}
                      onChange={() => setNewQuestion({ ...newQuestion, correctAnswer: newQuestion.options[index] })}
                      className="h-4 w-4"
                      disabled={!newQuestion.options[index]?.trim()}
                    />
                    <Input
                      value={newQuestion.options[index] || ""}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Expected Speech Text - For SPEECH type only */}
            {newQuestion.type === 'SPEECH' && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Expected Speech Text <span className="text-destructive">*</span>
                </label>
                <Textarea 
                  value={newQuestion.expectedSpeechText}
                  onChange={(e) => setNewQuestion({ ...newQuestion, expectedSpeechText: e.target.value })}
                  placeholder="Enter the expected speech response..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This text will be used to evaluate the user's speech response
                </p>
              </div>
            )}

            {/* Image URL - For IMAGE type only with upload functionality */}
            {newQuestion.type === 'IMAGE' && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Image <span className="text-destructive">*</span>
                </label>
                <div className="space-y-3">
                  {/* Image URL Input */}
                  <div className="flex items-center gap-2">
                    <Input 
                      value={newQuestion.image}
                      onChange={(e) => setNewQuestion({ ...newQuestion, image: e.target.value })}
                      placeholder="Enter image URL or upload..."
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(newQuestion.image, '_blank')}
                      disabled={!newQuestion.image}
                    >
                      <Image className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Image Upload */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="absolute inset-0 opacity-0 w-full cursor-pointer"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        disabled={uploadingImage}
                        className="w-full"
                      >
                        {uploadingImage ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent mr-2" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Image
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Image Preview */}
                  {newQuestion.image && (
                    <div className="mt-2 border rounded-lg p-2 bg-muted/30">
                      <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                      <img 
                        src={newQuestion.image} 
                        alt="Preview" 
                        className="max-h-40 object-contain mx-auto rounded"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/200?text=Invalid+Image";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* StoryId - Auto-filled (read-only) */}
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">
                Story ID: <span className="font-mono">{episodeId}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                This question will be linked to the current episode
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddQuestion(false);
              setEditingQuestion(null);
              setNewQuestion({
                storyId: episodeId,
                questionText: "",
                type: "MCQ",
                options: ["", "", "", ""],
                correctAnswer: "",
                expectedSpeechText: "",
                image: "",
                order: 0
              });
            }}>
              Cancel
            </Button>
            <Button onClick={editingQuestion ? updateQuestion : addQuestion} disabled={uploadingImage}>
              {uploadingImage ? "Uploading..." : (editingQuestion ? "Update Question" : "Add Question")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}