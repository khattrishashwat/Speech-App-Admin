import { useState } from "react";
import { Eye, CheckCircle } from "lucide-react";

// Rating stars component
function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      ))}
    </div>
  );
}

// Status badge component
function StatusBadge({ status }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    resolved: "bg-green-100 text-green-800 border-green-200",
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// Filters component
function FeedbackFilters({ searchQuery, onSearchChange, statusFilter, onStatusChange, ratingFilter, onRatingChange }) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
          </select>
          
          <select
            value={ratingFilter || ""}
            onChange={(e) => onRatingChange(e.target.value ? Number(e.target.value) : null)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Ratings</option>
            <option value="5">★★★★★ (5)</option>
            <option value="4">★★★★☆ (4)</option>
            <option value="3">★★★☆☆ (3)</option>
            <option value="2">★★☆☆☆ (2)</option>
            <option value="1">★☆☆☆☆ (1)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// Main FeedbackTable component
export function FeedbackTable({ feedback, onUpdateFeedback }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const filtered = feedback.filter((f) => {
    if (statusFilter !== "all" && f.status !== statusFilter) return false;
    if (ratingFilter && f.rating !== ratingFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!f.userName.toLowerCase().includes(q) && !f.email.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const allSelected = filtered.length > 0 && filtered.every((f) => selectedIds.has(f.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((f) => f.id)));
    }
  };

  const toggleOne = (id) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };

  const markResolved = (id) => {
    onUpdateFeedback(feedback.map((f) => (f.id === id ? { ...f, status: "resolved" } : f)));
    toast({ title: "Feedback marked as resolved" });
  };

  const bulkMarkResolved = () => {
    onUpdateFeedback(feedback.map((f) => (selectedIds.has(f.id) ? { ...f, status: "resolved" } : f)));
    setSelectedIds(new Set());
    toast({ title: `${selectedIds.size} items marked as resolved` });
  };

  return (
    <div className="space-y-4">
      <FeedbackFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        ratingFilter={ratingFilter}
        onRatingChange={setRatingFilter}
      />

      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 rounded-lg border border-blue-100">
          <span className="text-sm font-medium text-gray-900">{selectedIds.size} selected</span>
          <button
            onClick={bulkMarkResolved}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <CheckCircle className="h-3 w-3 mr-1 text-green-600" /> Mark Resolved
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="p-3 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="p-3 text-left font-medium text-gray-600">User</th>
                <th className="p-3 text-left font-medium text-gray-600">Message</th>
                <th className="p-3 text-left font-medium text-gray-600">Rating</th>
                <th className="p-3 text-left font-medium text-gray-600">Date</th>
                <th className="p-3 text-left font-medium text-gray-600">Status</th>
                <th className="p-3 text-right font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <Eye className="h-5 w-5 text-gray-400" />
                      </div>
                      <p className="text-gray-600 font-medium">No feedback found</p>
                      <p className="text-xs text-gray-500">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((f) => (
                  <tr key={f.id} className="border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(f.id)}
                        onChange={() => toggleOne(f.id)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-3">
                      <p className="font-medium text-gray-900">{f.userName}</p>
                      <p className="text-xs text-gray-500">{f.email}</p>
                    </td>
                    <td className="p-3 max-w-[260px]">
                      <p className="text-gray-900 truncate">{f.message}</p>
                    </td>
                    <td className="p-3">
                      <StarRating rating={f.rating} />
                    </td>
                    <td className="p-3 text-gray-500 whitespace-nowrap">{f.date}</td>
                    <td className="p-3">
                      <StatusBadge status={f.status} />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1">
                        {f.status !== "resolved" && (
                          <button
                            onClick={() => markResolved(f.id)}
                            className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-gray-100 rounded-md transition-colors"
                            title="Mark as resolved"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}