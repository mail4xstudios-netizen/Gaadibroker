"use client";

import { useState, useRef } from "react";
import { brands } from "@/lib/data";
import { useAuth } from "@/contexts/AuthContext";

export default function SellPage() {
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    brand: "", model: "", year: "", kmDriven: "", fuelType: "",
    city: "", expectedPrice: "",
  });
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const isLoggedIn = !!user;

  const update = (key: string, value: string) => setForm({ ...form, [key]: value });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (images.length + files.length > 15) {
      alert("Maximum 15 images allowed");
      return;
    }

    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const token = user ? await user.getIdToken() : "";
        const res = await fetch("/api/sell-leads/upload", {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          setImages((prev) => [...prev, data.url]);
        }
      } catch { /* ignore failed uploads */ }
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    if (images.length === 0) {
      alert("Please upload at least one car image");
      return;
    }

    await fetch("/api/sell-leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user?.uid || "",
        userName: user?.displayName || "",
        userPhone: user?.phoneNumber || "",
        userEmail: user?.email || "",
        brand: form.brand,
        model: form.model,
        year: form.year,
        kmDriven: form.kmDriven,
        fuelType: form.fuelType,
        city: form.city,
        expectedPrice: form.expectedPrice,
        images,
      }),
    });
    setSubmitted(true);
  };

  // Login prompt modal
  if (showLoginPrompt) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 bg-slate-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">Sign In Required</h2>
          <p className="text-slate-500 text-sm mb-6">Sign in with your mobile number to sell your car. This helps us verify your identity and contact you with offers.</p>
          <a
            href="/auth"
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold text-sm shadow-md shadow-orange-200 mb-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>
            Sign In with Mobile Number
          </a>
          <button onClick={() => setShowLoginPrompt(false)} className="text-slate-500 text-sm hover:text-slate-700">Go Back</button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 bg-slate-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg className="w-10 h-10 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" /></svg>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Request Submitted!</h2>
          <p className="text-slate-500 mt-2 max-w-md text-sm leading-relaxed">
            Our team will evaluate your {form.brand} {form.model} and contact you within 24 hours with the best offer.
          </p>
          <a href="/" className="btn-primary inline-block mt-6">Back to Home</a>
        </div>
      </div>
    );
  }

  const steps = [
    { num: 1, label: "Car Details" },
    { num: 2, label: "Photos" },
    { num: 3, label: "More Info" },
    { num: 4, label: "Review" },
  ];

  return (
    <div className="bg-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 md:px-6 py-14 md:py-20 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">Sell Your Car</h1>
          <p className="text-white/80 mt-3 text-base md:text-lg">Get the best price in just 4 easy steps</p>
          {!isLoggedIn && !authLoading && (
            <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
              Sign in required to submit
            </div>
          )}
        </div>
      </section>

      <div className="max-w-xl mx-auto px-4 md:px-6 py-10">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-10 px-2">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step >= s.num
                    ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md shadow-orange-200"
                    : "bg-slate-200 text-slate-500"
                }`}>{step > s.num ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" /></svg>
                ) : s.num}</div>
                <span className={`text-[0.6rem] font-medium mt-1.5 ${step >= s.num ? "text-orange-600" : "text-slate-400"}`}>{s.label}</span>
              </div>
              {i < 3 && <div className={`w-10 md:w-16 h-0.5 mx-1.5 mb-5 rounded-full transition-colors ${step > s.num ? "bg-orange-500" : "bg-slate-200"}`} />}
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-900 mb-1">Car Details</h2>
                <p className="text-sm text-slate-500 mb-5">Tell us about your car</p>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Brand</label>
                  <select required value={form.brand} onChange={(e) => update("brand", e.target.value)} className="input-premium">
                    <option value="">Select Brand</option>
                    {brands.map((b) => <option key={b.slug} value={b.name}>{b.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Model</label>
                  <input type="text" required placeholder="e.g., Swift, Creta, City" value={form.model}
                    onChange={(e) => update("model", e.target.value)} className="input-premium" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Year</label>
                  <select required value={form.year} onChange={(e) => update("year", e.target.value)} className="input-premium">
                    <option value="">Manufacturing Year</option>
                    {Array.from({ length: 15 }, (_, i) => 2026 - i).map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <button type="button" onClick={() => setStep(2)} disabled={!form.brand || !form.model || !form.year}
                  className="w-full btn-primary disabled:opacity-50 !py-3.5 mt-2">
                  Continue
                  <svg className="w-4 h-4 inline ml-1.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-900 mb-1">Upload Car Photos</h2>
                <p className="text-sm text-slate-500 mb-5">Add at least 1 photo (max 15). Clear photos help get better offers.</p>

                {/* Image grid */}
                <div className="grid grid-cols-3 gap-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
                      <img src={img} alt={`Car ${i + 1}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        ✕
                      </button>
                    </div>
                  ))}
                  {images.length < 15 && (
                    <label className="aspect-square rounded-lg border-2 border-dashed border-slate-300 hover:border-orange-400 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50 hover:bg-orange-50">
                      {uploading ? (
                        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" /></svg>
                          <span className="text-xs text-slate-500 mt-1">Add Photo</span>
                        </>
                      )}
                      <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" multiple className="hidden" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>

                <p className="text-xs text-slate-400">{images.length}/15 photos uploaded</p>

                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 btn-outline !py-3">Back</button>
                  <button type="button" onClick={() => setStep(3)} disabled={images.length === 0}
                    className="flex-1 btn-primary disabled:opacity-50 !py-3">
                    Continue
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-900 mb-1">Additional Details</h2>
                <p className="text-sm text-slate-500 mb-5">Help us evaluate your car better</p>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">KM Driven</label>
                  <input type="number" required placeholder="e.g., 45000" value={form.kmDriven}
                    onChange={(e) => update("kmDriven", e.target.value)} className="input-premium" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Fuel Type</label>
                  <select required value={form.fuelType} onChange={(e) => update("fuelType", e.target.value)} className="input-premium">
                    <option value="">Select Fuel Type</option>
                    {["Petrol", "Diesel", "Electric", "CNG", "Hybrid"].map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">City</label>
                  <input type="text" required placeholder="e.g., Mumbai, Delhi" value={form.city}
                    onChange={(e) => update("city", e.target.value)} className="input-premium" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Expected Price (Optional)</label>
                  <input type="number" placeholder="e.g., 500000" value={form.expectedPrice}
                    onChange={(e) => update("expectedPrice", e.target.value)} className="input-premium" />
                </div>
                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => setStep(2)} className="flex-1 btn-outline !py-3">Back</button>
                  <button type="button" onClick={() => setStep(4)} disabled={!form.kmDriven || !form.fuelType || !form.city}
                    className="flex-1 btn-primary disabled:opacity-50 !py-3">Continue</button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-900 mb-1">Review & Submit</h2>
                <p className="text-sm text-slate-500 mb-5">Check your details before submitting</p>

                {/* Car summary */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Your Car</p>
                  <p className="font-bold text-slate-900 text-sm">{form.brand} {form.model} ({form.year})</p>
                  <p className="text-xs text-slate-500 mt-1">{form.fuelType} · {Number(form.kmDriven).toLocaleString()} km · {form.city}</p>
                  {form.expectedPrice && <p className="text-xs text-orange-600 font-semibold mt-1">Expected: ₹{Number(form.expectedPrice).toLocaleString()}</p>}
                </div>

                {/* Image thumbnails */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, i) => (
                    <img key={i} src={img} alt={`Car ${i + 1}`} className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-slate-200" />
                  ))}
                </div>

                {/* User info */}
                {isLoggedIn && user && (
                  <div className="bg-emerald-50 rounded-lg p-4">
                    <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">Your Contact</p>
                    <p className="font-bold text-slate-900 text-sm">{user.displayName || "User"}</p>
                    <p className="text-xs text-slate-500 mt-1">{user.email}</p>
                  </div>
                )}

                {!isLoggedIn && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                    <p className="text-amber-800 text-sm font-medium">You must sign in to submit</p>
                    <a href="/auth" className="text-orange-600 text-sm font-bold underline mt-1 inline-block">Sign in with Mobile</a>
                  </div>
                )}

                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => setStep(3)} className="flex-1 btn-outline !py-3">Back</button>
                  <button type="submit" disabled={!isLoggedIn} className="flex-1 btn-primary disabled:opacity-50 !py-3">Submit Request</button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* How It Works */}
      <section className="bg-white py-14 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Selling your car has never been easier</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" /></svg>,
                title: "Upload Photos & Details",
                desc: "Share your car details and upload clear photos",
              },
              {
                icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>,
                title: "Free Inspection",
                desc: "Our expert will inspect your car at your doorstep",
              },
              {
                icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" /></svg>,
                title: "Get Paid",
                desc: "Accept the offer and receive instant payment",
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl flex items-center justify-center mx-auto text-orange-500 mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-slate-900">{item.title}</h3>
                <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
