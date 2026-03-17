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

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 md:p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
        >
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b.slug} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>

        <select
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
        >
          <option value="">Any Budget</option>
          {budgetRanges.map((b) => (
            <option key={b.slug} value={b.slug}>
              {b.label}
            </option>
          ))}
        </select>

        <select
          value={fuelType}
          onChange={(e) => setFuelType(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
        >
          <option value="">All Fuel Types</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
          <option value="CNG">CNG</option>
          <option value="Hybrid">Hybrid</option>
        </select>

        <button
          onClick={handleSearch}
          className="btn-primary rounded-xl flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search
        </button>
      </div>
    </div>
  );
}
