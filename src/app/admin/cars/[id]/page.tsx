"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Car, Brand, brands as defaultBrands, cities } from "@/lib/data";
import { adminFetch } from "@/lib/admin-fetch";

const MAX_IMAGES = 15;

export default function AdminEditCarPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : params.id?.[0];
  const [brands, setBrands] = useState<Brand[]>(defaultBrands);
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [form, setForm] = useState<Partial<Car> & { featuresText?: string }>({});
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    adminFetch("/api/admin/cars")
      .then((r) => r.json())
      .then((cars: Car[]) => {
        const car = cars.find((c) => c.id === id);
        if (car) {
          setForm({ ...car, featuresText: car.features.join(", ") });
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true));
    adminFetch("/api/admin/brands")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setBrands(data); })
      .catch(() => {});
  }, [id]);

  const update = (key: string, value: unknown) => setForm({ ...form, [key]: value });

  const uploadFiles = async (files: FileList | File[]) => {
    const currentImages = form.images || [];
    const remaining = MAX_IMAGES - currentImages.length;
    const toUpload = Array.from(files).slice(0, remaining);
    if (toUpload.length === 0) return;

    setUploading(true);
    const newUrls: string[] = [];

    for (const file of toUpload) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 5 * 1024 * 1024) continue;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "cars");

      try {
        const res = await adminFetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.url) newUrls.push(data.url);
      } catch { /* skip */ }
    }

    update("images", [...currentImages, ...newUrls]);
    setUploading(false);
  };

  const removeImage = (index: number) => {
    update("images", (form.images || []).filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) uploadFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { featuresText, ...rest } = form;
    try {
      await adminFetch("/api/admin/cars", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...rest,
          features: (featuresText || "").split(",").map((f) => f.trim()).filter(Boolean),
        }),
      });
      router.push("/admin/cars");
    } catch {
      alert("Error updating car");
    } finally {
      setSaving(false);
    }
  };

  if (notFound) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 mb-4">Car not found</p>
        <button onClick={() => router.push("/admin/cars")} className="btn-primary">Back to Cars</button>
      </div>
    );
  }

  if (!form.id) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const images = form.images || [];

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Edit: {form.name}</h1>

      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Car Name</label>
              <input required type="text" value={form.name || ""} onChange={(e) => update("name", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Brand</label>
              <select value={form.brand || ""} onChange={(e) => update("brand", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                {brands.map((b) => <option key={b.slug} value={b.name}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Price (₹)</label>
              <input type="number" value={form.price || ""} onChange={(e) => update("price", Number(e.target.value))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Original Price (₹)</label>
              <input type="number" value={form.originalPrice || ""} onChange={(e) => update("originalPrice", Number(e.target.value))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Year</label>
              <input type="number" value={form.year || ""} onChange={(e) => update("year", Number(e.target.value))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">KM Driven</label>
              <input type="number" value={form.kmDriven || ""} onChange={(e) => update("kmDriven", Number(e.target.value))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">City</label>
              <select value={form.city || ""} onChange={(e) => update("city", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Fuel Type</label>
              <select value={form.fuelType || ""} onChange={(e) => update("fuelType", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                {["Petrol", "Diesel", "Electric", "CNG", "Hybrid"].map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Transmission</label>
              <select value={form.transmission || ""} onChange={(e) => update("transmission", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Owner Type</label>
              <select value={form.ownerType || ""} onChange={(e) => update("ownerType", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                {["1st Owner", "2nd Owner", "3rd Owner", "4th Owner+"].map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Location</label>
              <input type="text" value={form.location || ""} onChange={(e) => update("location", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Color</label>
              <input type="text" value={form.color || ""} onChange={(e) => update("color", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Registration</label>
              <input type="text" value={form.registration || ""} onChange={(e) => update("registration", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Insurance</label>
              <input type="text" value={form.insurance || ""} onChange={(e) => update("insurance", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Car Photos <span className="text-gray-400 font-normal">({images.length}/{MAX_IMAGES})</span>
            </label>

            {images.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-3">
                {images.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <div className="aspect-[4/5] rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      <img src={url} alt={`Car photo ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 bg-orange-500 text-white text-[0.6rem] px-1.5 py-0.5 rounded font-medium">Cover</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {images.length < MAX_IMAGES && (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  uploading ? "border-orange-300 bg-orange-50" : "border-gray-300 hover:border-orange-400 hover:bg-orange-50/50"
                }`}
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-orange-600 font-medium">Uploading...</p>
                  </div>
                ) : (
                  <>
                    <svg className="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" /></svg>
                    <p className="text-sm font-medium text-gray-700">Tap to upload or drag & drop</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP - Max 5MB - Max {MAX_IMAGES} photos</p>
                  </>
                )}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) uploadFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
            <textarea rows={3} value={form.description || ""} onChange={(e) => update("description", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Features (comma separated)</label>
            <input type="text" value={form.featuresText || ""} onChange={(e) => update("featuresText", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="featured" checked={form.featured || false} onChange={(e) => update("featured", e.target.checked)}
              className="rounded border-gray-300" />
            <label htmlFor="featured" className="text-sm text-gray-700">Featured</label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={saving || uploading} className="btn-primary disabled:opacity-50">
              {saving ? "Saving..." : "Update Car"}
            </button>
            <button type="button" onClick={() => router.back()} className="btn-outline">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  );
}
