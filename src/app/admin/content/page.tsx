"use client";

import { useState, useEffect, useRef } from "react";
import { adminFetch } from "@/lib/admin-fetch";

interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  bannerImage: string;
  sliderImages: string[];
  aboutText: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  whatsappNumber: string;
  privacyPolicy: string;
  termsOfService: string;
  youtubeVideoUrl: string;
}

export default function AdminContentPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    adminFetch("/api/admin/banners").then((r) => r.json()).then((data) => {
      setContent({ sliderImages: [], ...data });
    }).catch(() => {});
  }, []);

  const update = (key: string, value: string | string[]) => {
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

  const handleSliderUpload = async (files: FileList | null) => {
    if (!files || !content) return;
    setUploading(true);

    const newImages = [...content.sliderImages];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 5 * 1024 * 1024) continue; // 5MB limit

      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "uploads");

      try {
        const res = await adminFetch("/api/admin/upload", {
          method: "POST",
          body: fd,
        });
        const data = await res.json();
        if (data.url) {
          newImages.push(data.url);
        }
      } catch {
        // skip failed uploads
      }
    }

    update("sliderImages", newImages);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeSliderImage = (index: number) => {
    if (!content) return;
    const updated = content.sliderImages.filter((_, i) => i !== index);
    update("sliderImages", updated);
  };

  const moveSliderImage = (index: number, direction: "up" | "down") => {
    if (!content) return;
    const images = [...content.sliderImages];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;
    [images[index], images[newIndex]] = [images[newIndex], images[index]];
    update("sliderImages", images);
  };

  const addSliderImageByUrl = () => {
    if (!content) return;
    const url = prompt("Enter image URL:");
    if (url && url.trim()) {
      update("sliderImages", [...content.sliderImages, url.trim()]);
    }
  };

  if (!content) return <div className="p-8 text-center">Loading...</div>;

  const inputClass = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Website Content</h1>
        <button onClick={handleSave} disabled={saving} className="btn-primary text-sm !py-2.5 disabled:opacity-50">
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="space-y-6 max-w-3xl">
        {/* Hero Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="font-bold text-gray-900 mb-4">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Hero Title</label>
              <input type="text" value={content.heroTitle} onChange={(e) => update("heroTitle", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Hero Subtitle</label>
              <textarea rows={2} value={content.heroSubtitle} onChange={(e) => update("heroSubtitle", e.target.value)} className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">CTA Text</label>
              <input type="text" value={content.heroCta} onChange={(e) => update("heroCta", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Banner Image URL</label>
              <input type="text" value={content.bannerImage} onChange={(e) => update("bannerImage", e.target.value)} className={inputClass} />
              {content.bannerImage && (
                <img src={content.bannerImage} alt="Banner preview" className="mt-2 w-full h-32 object-cover rounded-lg" />
              )}
            </div>
          </div>
        </div>

        {/* Hero Slider Images */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-gray-900">Hero Slider Images</h2>
              <p className="text-xs text-gray-500 mt-1">Add images for the homepage hero slider. Drag to reorder.</p>
            </div>
            <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
              {content.sliderImages.length} images
            </span>
          </div>

          {/* Upload area */}
          <div
            className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-orange-400 transition-colors cursor-pointer mb-4"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("border-orange-400", "bg-orange-50"); }}
            onDragLeave={(e) => { e.currentTarget.classList.remove("border-orange-400", "bg-orange-50"); }}
            onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove("border-orange-400", "bg-orange-50"); handleSliderUpload(e.dataTransfer.files); }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleSliderUpload(e.target.files)}
            />
            {uploading ? (
              <div className="flex items-center justify-center gap-2 text-orange-600">
                <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium">Uploading...</span>
              </div>
            ) : (
              <>
                <svg className="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                </svg>
                <p className="text-sm font-medium text-gray-600">Click or drag images here to upload</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP up to 5MB each. Multiple files allowed.</p>
              </>
            )}
          </div>

          {/* Add by URL button */}
          <button
            onClick={addSliderImageByUrl}
            className="text-sm text-orange-600 font-medium hover:text-orange-700 mb-4 flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.86-2.54a4.5 4.5 0 0 0-1.242-7.244l-4.5-4.5a4.5 4.5 0 0 0-6.364 6.364L4.34 8.374" />
            </svg>
            Add image by URL
          </button>

          {/* Image list */}
          {content.sliderImages.length > 0 ? (
            <div className="space-y-3">
              {content.sliderImages.map((img, index) => (
                <div key={index} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 group">
                  <img
                    src={img.startsWith("/") ? `/new${img}` : img}
                    alt={`Slider ${index + 1}`}
                    className="w-24 h-16 object-cover rounded-lg flex-shrink-0 border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Slide {index + 1}</p>
                    <p className="text-xs text-gray-400 truncate">{img}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Move up */}
                    <button
                      onClick={() => moveSliderImage(index, "up")}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                      </svg>
                    </button>
                    {/* Move down */}
                    <button
                      onClick={() => moveSliderImage(index, "down")}
                      disabled={index === content.sliderImages.length - 1}
                      className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                    {/* Delete */}
                    <button
                      onClick={() => removeSliderImage(index)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600"
                      title="Remove"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400">
              <p className="text-sm">No slider images added yet</p>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="font-bold text-gray-900 mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
              <input type="email" value={content.contactEmail} onChange={(e) => update("contactEmail", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Phone</label>
              <input type="text" value={content.contactPhone} onChange={(e) => update("contactPhone", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Address</label>
              <textarea rows={2} value={content.contactAddress} onChange={(e) => update("contactAddress", e.target.value)} className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">WhatsApp Number (with country code, no +)</label>
              <input type="text" value={content.whatsappNumber} onChange={(e) => update("whatsappNumber", e.target.value)} className={inputClass} />
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="font-bold text-gray-900 mb-4">About Section</h2>
          <textarea rows={4} value={content.aboutText} onChange={(e) => update("aboutText", e.target.value)} className={`${inputClass} resize-none`} />
        </div>

        {/* YouTube Video */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="font-bold text-gray-900 mb-2">YouTube Video</h2>
          <p className="text-xs text-gray-500 mb-4">Add a YouTube video URL to show on the homepage below Browse by Brand. Paste the full YouTube URL (e.g. https://www.youtube.com/watch?v=xxxxx)</p>
          <input type="text" value={content.youtubeVideoUrl || ""} onChange={(e) => update("youtubeVideoUrl", e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className={inputClass} />
          {content.youtubeVideoUrl && (() => {
            const match = content.youtubeVideoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
            const videoId = match ? match[1] : null;
            return videoId ? (
              <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
                <img src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} alt="Video thumbnail" className="w-full h-40 object-cover" />
              </div>
            ) : <p className="text-xs text-red-500 mt-2">Invalid YouTube URL</p>;
          })()}
        </div>

        {/* Privacy Policy */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="font-bold text-gray-900 mb-2">Privacy Policy</h2>
          <p className="text-xs text-gray-500 mb-4">Edit the Privacy Policy page content. Use plain text with line breaks for paragraphs.</p>
          <textarea rows={12} value={content.privacyPolicy || ""} onChange={(e) => update("privacyPolicy", e.target.value)} placeholder="Enter your Privacy Policy content here..." className={`${inputClass} resize-y font-mono text-xs`} />
        </div>

        {/* Terms of Service */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="font-bold text-gray-900 mb-2">Terms &amp; Conditions</h2>
          <p className="text-xs text-gray-500 mb-4">Edit the Terms &amp; Conditions page content. Use plain text with line breaks for paragraphs.</p>
          <textarea rows={12} value={content.termsOfService || ""} onChange={(e) => update("termsOfService", e.target.value)} placeholder="Enter your Terms & Conditions content here..." className={`${inputClass} resize-y font-mono text-xs`} />
        </div>
      </div>
    </div>
  );
}
