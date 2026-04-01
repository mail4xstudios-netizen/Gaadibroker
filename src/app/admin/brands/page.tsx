"use client";

import { useState, useEffect } from "react";
import { Brand } from "@/lib/data";
import { adminFetch } from "@/lib/admin-fetch";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", logo: "" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchBrands = () => {
    adminFetch("/api/admin/brands")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setBrands(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBrands(); }, []);

  const resetForm = () => {
    setForm({ name: "", slug: "", logo: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingId) {
        await adminFetch("/api/admin/brands", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...form }),
        });
      } else {
        await adminFetch("/api/admin/brands", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      resetForm();
      fetchBrands();
    } catch {
      alert("Error saving brand");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (brand: Brand) => {
    setForm({ name: brand.name, slug: brand.slug, logo: brand.logo });
    setEditingId(brand.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete brand "${name}"? This cannot be undone.`)) return;
    try {
      await adminFetch("/api/admin/brands", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchBrands();
    } catch {
      alert("Error deleting brand");
    }
  };

  const autoSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Brands</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="btn-primary"
        >
          + Add Brand
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">
            {editingId ? "Edit Brand" : "Add New Brand"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Brand Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g., Maruti Suzuki"
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm({ ...form, name, slug: editingId ? form.slug : autoSlug(name) });
                  }}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Slug *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g., maruti-suzuki"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Logo</label>
                <div className="space-y-2">
                  {form.logo ? (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <img src={form.logo} alt="Logo" className="w-12 h-12 object-contain rounded border border-gray-200 bg-white p-1" onError={(e) => { (e.target as HTMLImageElement).src = ""; }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 truncate">{form.logo}</p>
                      </div>
                      <button type="button" onClick={() => setForm({ ...form, logo: "" })} className="text-red-500 text-xs font-medium hover:text-red-700">Remove</button>
                    </div>
                  ) : (
                    <label className={`flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
                      {uploading ? (
                        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>
                      )}
                      <span className="text-sm text-gray-600 font-medium">{uploading ? "Uploading..." : "Upload Logo"}</span>
                      <span className="text-xs text-gray-400">PNG, SVG, JPG, WebP - Max 5MB</span>
                      <input
                        type="file"
                        accept="image/png,image/svg+xml,image/jpeg,image/webp"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setUploading(true);
                          try {
                            const fd = new FormData();
                            fd.append("file", file);
                            fd.append("folder", "brands");
                            const res = await adminFetch("/api/admin/upload", {
                              method: "POST",
                              body: fd,
                            });
                            const data = await res.json();
                            if (data.url) {
                              setForm((prev) => ({ ...prev, logo: data.url }));
                            } else {
                              alert(data.error || "Upload failed");
                            }
                          } catch {
                            alert("Upload failed");
                          } finally {
                            setUploading(false);
                            e.target.value = "";
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>


            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
                {saving ? "Saving..." : editingId ? "Update Brand" : "Add Brand"}
              </button>
              <button type="button" onClick={resetForm} className="btn-outline">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Brands List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Logo</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Brand Name</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Slug</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {brands.map((brand) => (
              <tr key={brand.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  {brand.logo ? (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-10 h-10 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <div className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center ${brand.logo ? "hidden" : ""}`}>
                    <span className="text-white font-bold text-sm">{brand.name.charAt(0)}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900 text-sm">{brand.name}</p>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{brand.slug}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleEdit(brand)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(brand.id, brand.name)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {brands.length === 0 && (
          <div className="text-center py-8 text-gray-500">No brands added yet</div>
        )}
      </div>
    </div>
  );
}
