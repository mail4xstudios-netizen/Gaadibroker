"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Car, Brand, brands as defaultBrands, cities } from "@/lib/data";
import { adminFetch } from "@/lib/admin-fetch";

export default function AdminEditCarPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : params.id?.[0];
  const [brands, setBrands] = useState<Brand[]>(defaultBrands);
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [form, setForm] = useState<Partial<Car> & { featuresText?: string }>({});

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

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Car: {form.name}</h1>

      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="bg-white rounded-xl shadow-md p-6 space-y-5">
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
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
            <textarea rows={3} value={form.description || ""} onChange={(e) => update("description", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Car Images</label>
            <div className="space-y-3">
              {(form.images || [""]).map((img, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="https://example.com/car-image.jpg"
                      value={img}
                      onChange={(e) => {
                        const newImages = [...(form.images || [""])];
                        newImages[idx] = e.target.value;
                        update("images", newImages);
                      }}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {img && img.trim() && (
                      <img src={img} alt={`Preview ${idx + 1}`} className="mt-1 h-16 w-24 object-cover rounded border border-gray-200" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = (form.images || [""]).filter((_, i) => i !== idx);
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
                onClick={() => update("images", [...(form.images || [""]), ""])}
                className="text-sm text-orange-500 font-medium hover:text-orange-700"
              >
                + Add Another Image
              </button>
            </div>
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
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
              {saving ? "Saving..." : "Update Car"}
            </button>
            <button type="button" onClick={() => router.back()} className="btn-outline">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  );
}
