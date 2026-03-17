"use client";

import { useState, useEffect } from "react";
import { Lead } from "@/lib/data";
import { adminFetch } from "@/lib/admin-fetch";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

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

  const exportCSV = () => {
    const headers = "Name,Phone,Car,Source,Status,Date\n";
    const rows = filteredLeads
      .map((l) => `"${l.name}","${l.phone}","${l.carName}","${l.source}","${l.status}","${l.createdAt}"`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredLeads = leads
    .filter((l) => {
      if (filter && l.status !== filter) return false;
      if (dateFilter && !l.createdAt.startsWith(dateFilter)) return false;
      return true;
    })
    .reverse();

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Leads ({leads.length})</h1>
        <button onClick={exportCSV} className="btn-outline text-sm !py-2">
          📥 Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-4 flex flex-wrap gap-3">
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
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        {(filter || dateFilter) && (
          <button onClick={() => { setFilter(""); setDateFilter(""); }} className="text-sm text-orange-500 font-medium">
            Clear Filters
          </button>
        )}
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-2">📭</div>
            <p>No leads found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Name</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Phone</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Car</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase hidden md:table-cell">Source</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase hidden md:table-cell">Date</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900 text-sm">{lead.name}</td>
                    <td className="px-4 py-3 text-sm">
                      <a href={`tel:${lead.phone}`} className="text-orange-500 hover:underline">{lead.phone}</a>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{lead.carName}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{lead.source}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                      {new Date(lead.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={lead.status}
                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full font-medium border-0 ${
                          lead.status === "new" ? "bg-green-100 text-green-700" :
                          lead.status === "contacted" ? "bg-blue-100 text-blue-700" :
                          lead.status === "converted" ? "bg-purple-100 text-purple-700" :
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
