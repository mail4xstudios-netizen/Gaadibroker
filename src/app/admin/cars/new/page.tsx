"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Brand, brands as defaultBrands, cities } from "@/lib/data";
import { adminFetch } from "@/lib/admin-fetch";

export default function AdminNewCarPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [brands, setBrands] = useState<Brand[]>(defaultBrands);

  useEffect(() => {
    adminFetch("/api/admin/brands")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setBrands(data); })
      .catch(() => {});
  }, []);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    model: "",
    year: 2024,
    price: 0,
    originalPrice: 0,
    fuelType: "Petrol",
    transmission: "Manual",
    kmDriven: 0,
    ownerType: "1st Owner",
    location: "",
    city: "",
    images: [""],
    features: "",
    description: "",
    color: "",
    registration: "",
    insurance: "",
    featured: false,
  });

  const update = (key: string, value: unknown) => setForm({ ...form, [key]: value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminFetch("/api/admin/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          images: form.images.filter((img) => img.trim()),
          features: form.features.split(",").map((f) => f.trim()).filter(Boolean),
        }),
      });
      router.push("/admin/cars");
    } catch {
      alert("Error saving car");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Car</h1>

      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="bg-white rounded-xl shadow-md p-6 space-y-5">
          <h2 className="font-bold text-gray-900">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Car Name *</label>
              <input
                required
                type="text"
                placeholder="e.g., Maruti Suzuki Swift VXi"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Brand *</label>
              <select
                required
                value={form.brand}
                onChange={(e) => update("brand", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select Brand</option>
                {brands.map((b) => <option key={b.slug} value={b.name}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Model *</label>
              <input
                required
                type="text"
                placeholder="e.g., Swift"
                value={form.model}
                onChange={(e) => update("model", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Year *</label>
              <select
                value={form.year}
                onChange={(e) => update("year", Number(e.target.value))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {Array.from({ length: 15 }, (_, i) => 2026 - i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Price (₹) *</label>
              <input
                required
                type="number"
                value={form.price || ""}
                onChange={(e) => update("price", Number(e.target.value))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Original Price (₹)</label>
              <input
                type="number"
                value={form.originalPrice || ""}
                onChange={(e) => update("originalPrice", Number(e.target.value))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Fuel Type *</label>
              <select
                value={form.fuelType}
                onChange={(e) => update("fuelType", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {["Petrol", "Diesel", "Electric", "CNG", "Hybrid"].map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Transmission *</label>
              <select
                value={form.transmission}
                onChange={(e) => update("transmission", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">KM Driven *</label>
              <input
                required
                type="number"
                value={form.kmDriven || ""}
                onChange={(e) => update("kmDriven", Number(e.target.value))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Owner Type</label>
              <select
                value={form.ownerType}
                onChange={(e) => update("ownerType", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {["1st Owner", "2nd Owner", "3rd Owner", "4th Owner+"].map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">City *</label>
              <select
                required
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select City</option>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Location (Area)</label>
              <input
                type="text"
                placeholder="e.g., Andheri West"
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Color</label>
              <input
                type="text"
                placeholder="e.g., Pearl White"
                value={form.color}
                onChange={(e) => update("color", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Registration</label>
              <input
                type="text"
                placeholder="e.g., MH-02"
                value={form.registration}
                onChange={(e) => update("registration", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Insurance</label>
              <input
                type="text"
                placeholder="e.g., Comprehensive till Dec 2026"
                value={form.insurance}
                onChange={(e) => update("insurance", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Car Images</label>
            <div className="space-y-3">
              {form.images.map((img, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="https://example.com/car-image.jpg"
                      value={img}
                      onChange={(e) => {
                        const newImages = [...form.images];
                        newImages[idx] = e.target.value;
                        update("images", newImages);
                      }}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {img.trim() && (
                      <img src={img} alt={`Preview ${idx + 1}`} className="mt-1 h-16 w-24 object-cover rounded border border-gray-200" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = form.images.filter((_, i) => i !== idx);
                      update("images", newImages.length ? newImages : [""]);
                    }}
                    className="px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => update("images", [...form.images, ""])}
                className="text-sm text-orange-500 font-medium hover:text-orange-700"
              >
                + Add Another Image
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Features (comma separated)</label>
            <input
              type="text"
              placeholder="ABS, Airbags, Sunroof, Touchscreen"
              value={form.features}
              onChange={(e) => update("features", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Describe the car..."
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={form.featured}
              onChange={(e) => update("featured", e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="featured" className="text-sm text-gray-700">Mark as Featured</label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
              {saving ? "Saving..." : "Add Car"}
            </button>
            <button type="button" onClick={() => router.back()} className="btn-outline">
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
