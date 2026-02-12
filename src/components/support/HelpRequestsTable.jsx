import { useState } from "react";
import { ExternalLink, Inbox } from "lucide-react";

// Status Badge component
function StatusBadge({ status }) {
  const styles = {
    open: "bg-blue-100 text-blue-800 border-blue-200",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    resolved: "bg-green-100 text-green-800 border-green-200",
    closed: "bg-gray-100 text-gray-800 border-gray-200"
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.pending}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// Priority Badge component
function PriorityBadge({ priority }) {
  const styles = {
    low: "bg-gray-100 text-gray-800 border-gray-200",
    medium: "bg-blue-100 text-blue-800 border-blue-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    critical: "bg-red-100 text-red-800 border-red-200"
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[priority] || styles.medium}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}

// Ticket Detail Panel component
function TicketDetailPanel({ ticket, onClose, onUpdate }) {
  const [status, setStatus] = useState(ticket.status);
  const [priority, setPriority] = useState(ticket.priority);
  const [note, setNote] = useState("");

  const handleUpdate = () => {
    onUpdate({
      ...ticket,
      status,
      priority,
      lastUpdated: new Date().toISOString()
    });
  };

  const handleAddNote = () => {
    if (!note.trim()) return;
    
    const updatedNotes = [
      ...(ticket.notes || []),
      {
        id: Date.now().toString(),
        content: note,
        createdAt: new Date().toISOString(),
        author: "Current User"
      }
    ];
    
    onUpdate({
      ...ticket,
      notes: updatedNotes,
      lastUpdated: new Date().toISOString()
    });
    setNote("");
  };

  if (!ticket) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-xl border-l border-gray-200 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-900">Ticket {ticket.id}</h2>
              <StatusBadge status={ticket.status} />
            </div>
            <p className="text-sm text-gray-500">Opened by {ticket.userName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Ticket Details */}
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Subject</p>
              <p className="text-gray-900 font-medium">{ticket.subject}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Category</p>
                <span className="text-xs text-gray-700 px-2 py-1 bg-white border border-gray-200 rounded">
                  {ticket.category}
                </span>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Last Updated</p>
                <p className="text-sm text-gray-900">{new Date(ticket.lastUpdated).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Message</p>
            <p className="text-gray-900 whitespace-pre-wrap">{ticket.message}</p>
          </div>

          {/* Status & Priority Controls */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Update Ticket</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="open">Open</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs text-gray-500 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={handleUpdate}
              className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Update Ticket
            </button>
          </div>

          {/* Notes */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Notes</h3>
            
            <div className="space-y-3">
              {ticket.notes && ticket.notes.length > 0 ? (
                ticket.notes.map((note) => (
                  <div key={note.id} className="bg-white p-3 rounded-md border border-gray-200">
                    <p className="text-sm text-gray-900">{note.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">{note.author}</span>
                      <span className="text-xs text-gray-400">{new Date(note.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No notes yet</p>
              )}
            </div>
            
            <div>
              <label className="block text-xs text-gray-500 mb-1">Add Note</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your note here..."
              />
              <button
                onClick={handleAddNote}
                disabled={!note.trim()}
                className="mt-2 px-4 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main HelpRequestsTable component
export function HelpRequestsTable({ requests, onUpdateRequests }) {
  const [selectedTicket, setSelectedTicket] = useState(null);

  const handleTicketUpdate = (updated) => {
    onUpdateRequests(requests.map((r) => (r.id === updated.id ? updated : r)));
    setSelectedTicket(updated);
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="p-3 text-left font-medium text-gray-600">Ticket</th>
                <th className="p-3 text-left font-medium text-gray-600">User</th>
                <th className="p-3 text-left font-medium text-gray-600">Subject</th>
                <th className="p-3 text-left font-medium text-gray-600">Category</th>
                <th className="p-3 text-left font-medium text-gray-600">Priority</th>
                <th className="p-3 text-left font-medium text-gray-600">Updated</th>
                <th className="p-3 text-left font-medium text-gray-600">Status</th>
                <th className="p-3 text-right font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <Inbox className="h-5 w-5 text-gray-400" />
                      </div>
                      <p className="text-gray-600 font-medium">No help requests</p>
                      <p className="text-xs text-gray-500">All caught up!</p>
                    </div>
                  </td>
                </tr>
              ) : (
                requests.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedTicket(r)}
                  >
                    <td className="p-3 font-mono text-xs text-gray-500">{r.id}</td>
                    <td className="p-3">
                      <p className="font-medium text-gray-900">{r.userName}</p>
                    </td>
                    <td className="p-3 max-w-[240px]">
                      <p className="text-gray-900 truncate">{r.subject}</p>
                    </td>
                    <td className="p-3">
                      <span className="text-xs text-gray-600 px-2 py-0.5 bg-gray-100 rounded">{r.category}</span>
                    </td>
                    <td className="p-3">
                      <PriorityBadge priority={r.priority} />
                    </td>
                    <td className="p-3 text-gray-500 whitespace-nowrap text-xs">{formatDate(r.lastUpdated)}</td>
                    <td className="p-3">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTicket(r);
                        }}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTicket && (
        <TicketDetailPanel
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdate={handleTicketUpdate}
        />
      )}
    </>
  );
}