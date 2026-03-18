"use client";

import { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-fetch";

interface SellLead {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  brand: string;
  model: string;
  year: string;
  kmDriven: string;
  fuelType: string;
  city: string;
  expectedPrice: string;
  images: string[];
  status: string;
  adminNotes: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  inspecting: "bg-purple-100 text-purple-700",
  offer_made: "bg-orange-100 text-orange-700",
  sold: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const statusLabels: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  inspecting: "Inspecting",
  offer_made: "Offer Made",
  sold: "Sold",
  rejected: "Rejected",
};

export default function AdminSellLeadsPage() {
  const [leads, setLeads] = useState<SellLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<SellLead | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const res = await adminFetch("/api/admin/sell-leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data.sort((a: SellLead, b: SellLead) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }
    } catch { /* ignore */ }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await adminFetch("/api/admin/sell-leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
        if (selectedLead?.id === id) setSelectedLead({ ...selectedLead, status });
      }
    } catch { /* ignore */ }
  };

  const updateNotes = async (id: string, adminNotes: string) => {
    try {
      await adminFetch("/api/admin/sell-leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, adminNotes }),
      });
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, adminNotes } : l)));
    } catch { /* ignore */ }
  };

  const filtered = filter === "all" ? leads : leads.filter((l) => l.status === filter);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-gray-500">Loading...</div></div>;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sell Car Leads</h1>
          <p className="text-gray-500 text-sm mt-1">Users who want to sell their cars</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Filter:</span>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="all">All ({leads.length})</option>
            {Object.entries(statusLabels).map(([key, label]) => (
              <option key={key} value={key}>{label} ({leads.filter((l) => l.status === key).length})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-2xl font-bold text-gray-900">{leads.length}</p>
          <p className="text-xs text-gray-500 mt-1">Total Leads</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-2xl font-bold text-blue-600">{leads.filter((l) => l.status === "new").length}</p>
          <p className="text-xs text-gray-500 mt-1">New</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-2xl font-bold text-purple-600">{leads.filter((l) => l.status === "inspecting").length}</p>
          <p className="text-xs text-gray-500 mt-1">Inspecting</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-2xl font-bold text-green-600">{leads.filter((l) => l.status === "sold").length}</p>
          <p className="text-xs text-gray-500 mt-1">Sold</p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
          <p className="text-gray-500">No sell leads yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((lead) => (
            <div key={lead.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedLead(selectedLead?.id === lead.id ? null : lead)}>
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Car image thumbnail */}
                <div className="flex-shrink-0">
                  {lead.images[0] ? (
                    <img src={lead.images[0]} alt="Car" className="w-20 h-20 rounded-lg object-cover border border-gray-200" />
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" /></svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-900">{lead.brand} {lead.model} ({lead.year})</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[lead.status] || "bg-gray-100 text-gray-600"}`}>
                      {statusLabels[lead.status] || lead.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{lead.fuelType} · {Number(lead.kmDriven).toLocaleString()} km · {lead.city}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="font-medium text-gray-700">{lead.userName}</span>
                    <span>{lead.userPhone}</span>
                    <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                    {lead.expectedPrice && <span className="text-orange-600 font-semibold">₹{Number(lead.expectedPrice).toLocaleString()}</span>}
                  </div>
                </div>

                {/* Status change */}
                <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  <select value={lead.status} onChange={(e) => updateStatus(lead.id, e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                    {Object.entries(statusLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Expanded detail */}
              {selectedLead?.id === lead.id && (
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div><p className="text-xs text-gray-400 uppercase">Seller</p><p className="text-sm font-medium">{lead.userName}</p></div>
                    <div><p className="text-xs text-gray-400 uppercase">Phone</p><p className="text-sm font-medium">{lead.userPhone}</p></div>
                    <div><p className="text-xs text-gray-400 uppercase">Email</p><p className="text-sm font-medium">{lead.userEmail || "N/A"}</p></div>
                    <div><p className="text-xs text-gray-400 uppercase">Expected Price</p><p className="text-sm font-medium">{lead.expectedPrice ? `₹${Number(lead.expectedPrice).toLocaleString()}` : "Not specified"}</p></div>
                  </div>

                  {/* All images */}
                  <p className="text-xs text-gray-400 uppercase mb-2">Car Photos ({lead.images.length})</p>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-4">
                    {lead.images.map((img, i) => (
                      <a key={i} href={img} target="_blank" rel="noopener noreferrer">
                        <img src={img} alt={`Car ${i + 1}`} className="w-full aspect-square object-cover rounded-lg border border-gray-200 hover:opacity-80 transition-opacity" />
                      </a>
                    ))}
                  </div>

                  {/* Admin notes */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <p className="text-xs text-gray-400 uppercase mb-2">Admin Notes</p>
                    <textarea
                      value={lead.adminNotes}
                      onChange={(e) => setLeads((prev) => prev.map((l) => l.id === lead.id ? { ...l, adminNotes: e.target.value } : l))}
                      onBlur={(e) => updateNotes(lead.id, e.target.value)}
                      placeholder="Add notes about this lead..."
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[80px] resize-y"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
