"use client";

import { useState } from "react";
import { brands } from "@/lib/data";

export default function SellPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    brand: "", model: "", year: "", kmDriven: "", fuelType: "",
    city: "", name: "", phone: "", expectedPrice: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const update = (key: string, value: string) => setForm({ ...form, [key]: value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name, phone: form.phone, carId: "sell-inquiry",
        carName: `${form.brand} ${form.model} ${form.year}`, source: "sell_page",
      }),
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Request Submitted!</h2>
          <p className="text-gray-500 mt-2 max-w-md">
            Our team will evaluate your {form.brand} {form.model} and contact you within 24 hours with the best offer.
          </p>
          <a href="/" className="btn-primary inline-block mt-6">Back to Home</a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white">Sell Your Car</h1>
          <p className="text-white/80 mt-3 text-lg">Get the best price in just 3 easy steps</p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                step >= s ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"
              }`}>{s}</div>
              {s < 3 && <div className={`w-20 md:w-32 h-1 ${step > s ? "bg-orange-500" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Car Details</h2>
              <select required value={form.brand} onChange={(e) => update("brand", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="">Select Brand</option>
                {brands.map((b) => <option key={b.slug} value={b.name}>{b.name}</option>)}
              </select>
              <input type="text" required placeholder="Model (e.g., Swift, Creta)" value={form.model}
                onChange={(e) => update("model", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
              <select required value={form.year} onChange={(e) => update("year", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="">Manufacturing Year</option>
                {Array.from({ length: 15 }, (_, i) => 2026 - i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <button type="button" onClick={() => setStep(2)} disabled={!form.brand || !form.model || !form.year}
                className="w-full btn-primary disabled:opacity-50">Next →</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">More Details</h2>
              <input type="number" required placeholder="KM Driven" value={form.kmDriven}
                onChange={(e) => update("kmDriven", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
              <select required value={form.fuelType} onChange={(e) => update("fuelType", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="">Fuel Type</option>
                {["Petrol", "Diesel", "Electric", "CNG", "Hybrid"].map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
              <input type="text" required placeholder="City" value={form.city}
                onChange={(e) => update("city", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
              <input type="number" placeholder="Expected Price (₹)" value={form.expectedPrice}
                onChange={(e) => update("expectedPrice", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="flex-1 btn-outline">← Back</button>
                <button type="button" onClick={() => setStep(3)} disabled={!form.kmDriven || !form.fuelType || !form.city}
                  className="flex-1 btn-primary disabled:opacity-50">Next →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Contact Details</h2>
              <input type="text" required placeholder="Your Name" value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
              <input type="tel" required placeholder="Phone Number" value={form.phone}
                onChange={(e) => update("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)} className="flex-1 btn-outline">← Back</button>
                <button type="submit" className="flex-1 btn-primary">Submit Request</button>
              </div>
            </div>
          )}
        </form>
      </div>

      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Share Car Details", desc: "Fill in your car's details and get an instant estimate" },
              { step: "2", title: "Free Inspection", desc: "Our expert will inspect your car at your doorstep" },
              { step: "3", title: "Get Paid", desc: "Accept the offer and receive instant payment" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">{item.step}</div>
                <h3 className="font-bold text-gray-900 mt-3">{item.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
