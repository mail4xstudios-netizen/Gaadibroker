"use client";

import { useState, useEffect } from "react";
import { Lead } from "@/lib/data";
import { adminFetch } from "@/lib/admin-fetch";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [showFollowUpForm, setShowFollowUpForm] = useState<string | null>(null);
  const [callLeadType, setCallLeadType] = useState<string>("warm");
  const [callFollowUpDate, setCallFollowUpDate] = useState("");
  const [callNotes, setCallNotes] = useState("");
  const [expandedLead, setExpandedLead] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"all" | "followups">("all");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = () => {
    adminFetch("/api/admin/leads").then((r) => r.json()).then(setLeads).catch(() => {});
  };

  const updateStatus = async (id: string, status: string) => {
    await adminFetch("/api/admin/leads", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchLeads();
  };

  const handleCallDone = async (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    const callEntry = {
      date: new Date().toISOString(),
      leadType: callLeadType,
      notes: callNotes,
    };

    const updates: Record<string, unknown> = {
      id: leadId,
      leadType: callLeadType,
      followUpNotes: callNotes,
      status: "contacted",
      callHistory: [...(lead.callHistory || []), callEntry],
    };

    if (callFollowUpDate) {
      updates.followUpDate = callFollowUpDate;
    }

    await adminFetch("/api/admin/leads", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    setShowFollowUpForm(null);
    setCallLeadType("warm");
    setCallFollowUpDate("");
    setCallNotes("");
    fetchLeads();
  };

  const exportCSV = () => {
    const headers = "Name,Phone,Car,Source,Status,Lead Type,Follow-up Date,Date\n";
    const rows = filteredLeads
      .map((l) => `"${l.name}","${l.phone}","${l.carName}","${l.source}","${l.status}","${l.leadType || ""}","${l.followUpDate || ""}","${l.createdAt}"`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const today = new Date().toISOString().split("T")[0];

  const filteredLeads = leads
    .filter((l) => {
      if (filter && l.status !== filter) return false;
      if (typeFilter && l.leadType !== typeFilter) return false;
      if (dateFilter && !l.createdAt.startsWith(dateFilter)) return false;
      if (viewMode === "followups") {
        return !!l.followUpDate;
      }
      return true;
    })
    .sort((a, b) => {
      if (viewMode === "followups") {
        return (a.followUpDate || "").localeCompare(b.followUpDate || "");
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const todayFollowUps = leads.filter((l) => l.followUpDate && l.followUpDate === today);
  const overdueFollowUps = leads.filter((l) => l.followUpDate && l.followUpDate < today && l.status !== "converted" && l.status !== "closed");

  const leadTypeColor = (type?: string) => {
    switch (type) {
      case "hot": return "bg-red-100 text-red-700";
      case "warm": return "bg-amber-100 text-amber-700";
      case "cold": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-500";
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-green-100 text-green-700";
      case "contacted": return "bg-blue-100 text-blue-700";
      case "converted": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Leads ({leads.length})</h1>
        <button onClick={exportCSV} className="text-sm text-orange-500 font-medium hover:text-orange-600">
          Export CSV
        </button>
      </div>

      {/* Follow-up Alerts */}
      {(todayFollowUps.length > 0 || overdueFollowUps.length > 0) && (
        <div className="space-y-2 mb-4">
          {overdueFollowUps.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
              </div>
              <div>
                <p className="font-semibold text-red-800 text-sm">{overdueFollowUps.length} Overdue Follow-ups</p>
                <p className="text-red-600 text-xs">These leads need immediate attention</p>
              </div>
            </div>
          )}
          {todayFollowUps.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>
              </div>
              <div>
                <p className="font-semibold text-orange-800 text-sm">{todayFollowUps.length} Follow-ups Today</p>
                <p className="text-orange-600 text-xs">Scheduled calls for today</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* View Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setViewMode("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === "all" ? "bg-gray-900 text-white" : "bg-white text-gray-600 border border-gray-200"
          }`}
        >
          All Leads
        </button>
        <button
          onClick={() => setViewMode("followups")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === "followups" ? "bg-orange-500 text-white" : "bg-white text-gray-600 border border-gray-200"
          }`}
        >
          Follow-ups {todayFollowUps.length > 0 && <span className="ml-1 bg-white/20 px-1.5 py-0.5 rounded-full text-xs">{todayFollowUps.length}</span>}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-3 mb-4 flex flex-wrap gap-2">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
          <option value="closed">Closed</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">All Types</option>
          <option value="hot">Hot</option>
          <option value="warm">Warm</option>
          <option value="cold">Cold</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        {(filter || typeFilter || dateFilter) && (
          <button onClick={() => { setFilter(""); setTypeFilter(""); setDateFilter(""); }} className="text-sm text-orange-500 font-medium px-2">
            Clear
          </button>
        )}
      </div>

      {/* Leads List - Card based for mobile */}
      {filteredLeads.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
          <div className="text-4xl mb-2">📭</div>
          <p>No leads found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLeads.map((lead) => {
            const isOverdue = lead.followUpDate && lead.followUpDate < today && lead.status !== "converted" && lead.status !== "closed";
            const isToday = lead.followUpDate === today;
            const isExpanded = expandedLead === lead.id;

            return (
              <div
                key={lead.id}
                className={`bg-white rounded-xl shadow-sm border overflow-hidden ${
                  isOverdue ? "border-red-300" : isToday ? "border-orange-300" : "border-gray-100"
                }`}
              >
                {/* Main Card Row */}
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedLead(isExpanded ? null : lead.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900 text-sm">{lead.name}</p>
                        <span className={`text-[0.65rem] px-1.5 py-0.5 rounded-full font-medium ${leadTypeColor(lead.leadType)}`}>
                          {lead.leadType || "unset"}
                        </span>
                        <span className={`text-[0.65rem] px-1.5 py-0.5 rounded-full font-medium ${statusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{lead.carName}</p>
                      {lead.followUpDate && (
                        <p className={`text-xs mt-1 font-medium ${
                          isOverdue ? "text-red-600" : isToday ? "text-orange-600" : "text-gray-400"
                        }`}>
                          {isOverdue ? "⚠ Overdue: " : isToday ? "📞 Today: " : "📅 "}
                          {new Date(lead.followUpDate + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Call Button - opens dialer */}
                      <a
                        href={`tel:${lead.phone}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Show follow-up form after a short delay (user makes the call)
                          setTimeout(() => setShowFollowUpForm(lead.id), 1000);
                        }}
                        className="w-10 h-10 bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center transition-colors"
                      >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
                      </a>
                      <svg className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-400 text-xs">Phone</p>
                        <a href={`tel:${lead.phone}`} className="text-orange-500 font-medium">{lead.phone}</a>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Source</p>
                        <p className="text-gray-700">{lead.source}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Created</p>
                        <p className="text-gray-700">{new Date(lead.createdAt).toLocaleDateString("en-IN")}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Follow-up</p>
                        <p className="text-gray-700">{lead.followUpDate ? new Date(lead.followUpDate + "T00:00:00").toLocaleDateString("en-IN") : "Not set"}</p>
                      </div>
                    </div>

                    {/* Status changer */}
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Update Status</p>
                      <div className="flex flex-wrap gap-1.5">
                        {["new", "contacted", "converted", "closed"].map((s) => (
                          <button
                            key={s}
                            onClick={() => updateStatus(lead.id, s)}
                            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                              lead.status === s ? statusColor(s) + " ring-2 ring-offset-1 ring-gray-300" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    {lead.followUpNotes && (
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Last Note</p>
                        <p className="text-gray-700 text-sm bg-white rounded-lg p-2 border border-gray-100">{lead.followUpNotes}</p>
                      </div>
                    )}

                    {/* Call History */}
                    {lead.callHistory && lead.callHistory.length > 0 && (
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Call History ({lead.callHistory.length})</p>
                        <div className="space-y-1.5">
                          {lead.callHistory.slice(-3).reverse().map((call, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs bg-white rounded-lg p-2 border border-gray-100">
                              <span className={`px-1.5 py-0.5 rounded-full font-medium ${leadTypeColor(call.leadType)}`}>{call.leadType}</span>
                              <span className="text-gray-500">{new Date(call.date).toLocaleDateString("en-IN")}</span>
                              {call.notes && <span className="text-gray-600 truncate">{call.notes}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick follow-up button */}
                    <button
                      onClick={() => setShowFollowUpForm(lead.id)}
                      className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
                      Log Call & Set Follow-up
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Follow-up Form Modal */}
      {showFollowUpForm && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowFollowUpForm(null)} />
          <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl p-5 max-w-lg mx-auto animate-fade-in-up">
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            <h3 className="font-bold text-gray-900 text-lg mb-4">Log Call Result</h3>

            {/* Lead Type */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Lead Type</p>
              <div className="flex gap-2">
                {[
                  { value: "hot", label: "🔥 Hot", color: "bg-red-100 text-red-700 border-red-300" },
                  { value: "warm", label: "☀️ Warm", color: "bg-amber-100 text-amber-700 border-amber-300" },
                  { value: "cold", label: "❄️ Cold", color: "bg-blue-100 text-blue-700 border-blue-300" },
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setCallLeadType(type.value)}
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                      callLeadType === type.value ? type.color + " scale-105" : "bg-gray-50 text-gray-500 border-gray-200"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Follow-up Date */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Follow-up Date</p>
              <input
                type="date"
                value={callFollowUpDate}
                onChange={(e) => setCallFollowUpDate(e.target.value)}
                min={today}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Notes */}
            <div className="mb-5">
              <p className="text-sm font-medium text-gray-700 mb-2">Notes</p>
              <textarea
                value={callNotes}
                onChange={(e) => setCallNotes(e.target.value)}
                placeholder="What did you discuss? Any action items?"
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowFollowUpForm(null)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCallDone(showFollowUpForm)}
                className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
