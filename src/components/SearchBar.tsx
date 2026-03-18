"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { brands, budgetRanges } from "@/lib/data";

export default function SearchBar() {
  const router = useRouter();
  const [brand, setBrand] = useState("");
  const [budget, setBudget] = useState("");
  const [fuelType, setFuelType] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (brand) params.set("brand", brand);
    if (budget) params.set("budget", budget);
    if (fuelType) params.set("fuel", fuelType);
    router.push(`/cars?${params.toString()}`);
  };

  const selectClass = "w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm font-medium focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all appearance-none cursor-pointer";

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,.12)] p-5 md:p-6 max-w-4xl border border-white/50">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">Find Your Perfect Car</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative">
          <label className="block text-[0.6875rem] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Brand</label>
          <select value={brand} onChange={(e) => setBrand(e.target.value)} className={selectClass}>
            <option value="">All Brands</option>
            {brands.map((b) => (
              <option key={b.slug} value={b.name}>{b.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[0.6875rem] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Budget</label>
          <select value={budget} onChange={(e) => setBudget(e.target.value)} className={selectClass}>
            <option value="">Any Budget</option>
            {budgetRanges.map((b) => (
              <option key={b.slug} value={b.slug}>{b.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[0.6875rem] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Fuel Type</label>
          <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} className={selectClass}>
            <option value="">All Types</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="CNG">CNG</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleSearch}
            className="w-full btn-primary rounded-xl flex items-center justify-center gap-2 !py-3.5 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search Cars
          </button>
        </div>
      </div>

      {/* Quick filter chips */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
        <span className="text-xs text-slate-400 font-medium py-1">Popular:</span>
        {["Under 5 Lakh", "SUV", "Automatic", "Diesel", "First Owner"].map((tag) => (
          <button
            key={tag}
            onClick={() => {
              if (tag === "Under 5 Lakh") { setBudget("under-5-lakh"); }
              else if (tag === "Automatic") { router.push("/cars?transmission=Automatic"); }
              else if (tag === "Diesel") { setFuelType("Diesel"); }
              else if (tag === "First Owner") { router.push("/cars?owner=First"); }
              else { router.push("/cars"); }
            }}
            className="chip !text-xs hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
