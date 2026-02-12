import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";
import { MessageSquare, HelpCircle, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeedbackTable } from "@/components/support/FeedbackTable";
import { HelpRequestsTable } from "@/components/support/HelpRequestsTable";
import { getHelpApi, getFeedbackApi } from "../utils/api";
import { useToast } from "@/components/ui/use-toast";

export default function SupportPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState({
    feedback: true,
    help: true
  });
  
  // State for real data from API
  const [feedback, setFeedback] = useState([]);
  const [helpRequests, setHelpRequests] = useState([]);

  // Fetch feedback data
  const fetchFeedback = async () => {
    try {
      setLoading(prev => ({ ...prev, feedback: true }));
      const response = await getFeedbackApi();
      
      if (response) {
        const transformedFeedback = response.data.data.map(item => ({
          id: item._id,
          userName: item.name,
          mobile: item.mobile,
          message: item.feedback,
          date: new Date(item.createdAt).toISOString().split('T')[0],
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }));
        setFeedback(transformedFeedback);
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
      toast({
        title: "Error",
        description: "Failed to fetch feedback data",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, feedback: false }));
    }
  };

  // Fetch help requests data
  const fetchHelpRequests = async () => {
    try {
      setLoading(prev => ({ ...prev, help: true }));
      const response = await getHelpApi();
      
      if (response) {
console.log("response response",response.data)   ;
     const transformedRequests = response.data.data.map(item => ({
          id: item._id,
          name: item.name,
          mobile: item.mobile,
          query: item.query,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }));
        setHelpRequests(transformedRequests);
      }
    } catch (error) {
      console.error("Error fetching help requests:", error);
      toast({
        title: "Error",
        description: "Failed to fetch help requests",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, help: false }));
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchFeedback();
    fetchHelpRequests();
  }, []);

  // Calculate statistics
  const totalFeedback = feedback.length;
  const totalHelpRequests = helpRequests.length;

  // Filter help requests based on search
  const filteredHelpRequests = helpRequests.filter(request =>
    request.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.mobile?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.query?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter feedback based on search
  const filteredFeedback = feedback.filter(item =>
    item.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.mobile?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteFeedback = (feedbackId) => {
    setFeedback(prev => prev.filter(item => item.id !== feedbackId));
    toast({
      title: "Success",
      description: "Feedback deleted successfully",
    });
  };

  const handleDeleteHelpRequest = (requestId) => {
    setHelpRequests(prev => prev.filter(item => item.id !== requestId));
    toast({
      title: "Success",
      description: "Help request deleted successfully",
    });
  };

  const handleViewTicket = (ticketId) => {
    navigate(`/support/tickets/${ticketId}`);
  };

  const handleRefresh = () => {
    fetchFeedback();
    fetchHelpRequests();
    toast({
      title: "Refreshed",
      description: "Data has been refreshed successfully",
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-foreground">Support Dashboard</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, mobile, or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 pr-8 border rounded-md bg-background text-sm w-full sm:w-64"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            )}
          </div>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            disabled={loading.feedback || loading.help}
          >
            <RefreshCw className={`h-4 w-4 ${loading.feedback || loading.help ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-4 p-6 bg-card rounded-lg border shadow-sm">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {loading.feedback ? <span className="animate-pulse">...</span> : totalFeedback}
            </p>
            <p className="text-xs text-muted-foreground">Total Feedback</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-6 bg-card rounded-lg border shadow-sm">
          <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
            <HelpCircle className="h-5 w-5 text-warning" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {loading.help ? <span className="animate-pulse">...</span> : totalHelpRequests}
            </p>
            <p className="text-xs text-muted-foreground">Total Help Requests</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="feedback" className="space-y-4">
        <TabsList className="bg-secondary h-10">
          <TabsTrigger value="feedback" className="text-sm">
            Feedback Management
            {!loading.feedback && totalFeedback > 0 && (
              <span className="ml-2 h-5 min-w-[20px] rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center px-1.5">
                {totalFeedback}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="help" className="text-sm">
            Help Requests
            {!loading.help && totalHelpRequests > 0 && (
              <span className="ml-2 h-5 min-w-[20px] rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center px-1.5">
                {totalHelpRequests}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feedback">
          {loading.feedback ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="bg-card rounded-lg border shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 text-xs font-medium text-muted-foreground">Name</th>
                      <th className="text-left p-4 text-xs font-medium text-muted-foreground">Mobile</th>
                      <th className="text-left p-4 text-xs font-medium text-muted-foreground">Feedback</th>
                      <th className="text-left p-4 text-xs font-medium text-muted-foreground">Date</th>
                      <th className="text-right p-4 text-xs font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(searchQuery ? filteredFeedback : feedback).length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center p-8 text-muted-foreground">
                          No feedback found
                        </td>
                      </tr>
                    ) : (
                      (searchQuery ? filteredFeedback : feedback).map((item) => (
                        <tr key={item.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="p-4 text-sm">{item.userName}</td>
                          <td className="p-4 text-sm">{item.mobile}</td>
                          <td className="p-4 text-sm max-w-md truncate">{item.message}</td>
                          <td className="p-4 text-sm">{item.date}</td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteFeedback(item.id)}
                              className="text-destructive hover:text-destructive/80 text-sm"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="help">
          {loading.help ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="bg-card rounded-lg border shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 text-xs font-medium text-muted-foreground">Name</th>
                      <th className="text-left p-4 text-xs font-medium text-muted-foreground">Mobile</th>
                      <th className="text-left p-4 text-xs font-medium text-muted-foreground">Query</th>
                      <th className="text-left p-4 text-xs font-medium text-muted-foreground">Date</th>
                      <th className="text-right p-4 text-xs font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(searchQuery ? filteredHelpRequests : helpRequests).length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center p-8 text-muted-foreground">
                          No help requests found
                        </td>
                      </tr>
                    ) : (
                      (searchQuery ? filteredHelpRequests : helpRequests).map((item) => (
                        <tr key={item.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="p-4 text-sm">{item.name}</td>
                          <td className="p-4 text-sm">{item.mobile}</td>
                          <td className="p-4 text-sm max-w-md truncate">{item.query}</td>
                          <td className="p-4 text-sm">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteHelpRequest(item.id)}
                              className="text-destructive hover:text-destructive/80 text-sm"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}