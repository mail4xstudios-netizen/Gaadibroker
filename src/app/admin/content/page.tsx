"use client";

import { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-fetch";

interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  bannerImage: string;
  aboutText: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  whatsappNumber: string;
}

export default function AdminContentPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminFetch("/api/admin/banners").then((r) => r.json()).then(setContent).catch(() => {});
  }, []);

  const update = (key: string, value: string) => {
    if (content) setContent({ ...content, [key]: value });
  };

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    await adminFetch("/api/admin/banners", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!content) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Website Content</h1>
        <button onClick={handleSave} disabled={saving} className="btn-primary text-sm !py-2.5 disabled:opacity-50">
          {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="space-y-6 max-w-3xl">
        {/* Hero Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="font-bold text-gray-900 mb-4">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Hero Title</label>
              <input type="text" value={content.heroTitle} onChange={(e) => update("heroTitle", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Hero Subtitle</label>
              <textarea rows={2} value={content.heroSubtitle} onChange={(e) => update("heroSubtitle", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">CTA Text</label>
              <input type="text" value={content.heroCta} onChange={(e) => update("heroCta", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Banner Image URL</label>
              <input type="text" value={content.bannerImage} onChange={(e) => update("bannerImage", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
              {content.bannerImage && (
                <img src={content.bannerImage} alt="Banner preview" className="mt-2 w-full h-32 object-cover rounded-lg" />
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="font-bold text-gray-900 mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
              <input type="email" value={content.contactEmail} onChange={(e) => update("contactEmail", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Phone</label>
              <input type="text" value={content.contactPhone} onChange={(e) => update("contactPhone", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Address</label>
              <textarea rows={2} value={content.contactAddress} onChange={(e) => update("contactAddress", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">WhatsApp Number (with country code, no +)</label>
              <input type="text" value={content.whatsappNumber} onChange={(e) => update("whatsappNumber", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="font-bold text-gray-900 mb-4">About Section</h2>
          <textarea rows={4} value={content.aboutText} onChange={(e) => update("aboutText", e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
        </div>
      </div>
    </div>
  );
}
