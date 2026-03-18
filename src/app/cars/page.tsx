"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CarCard from "@/components/CarCard";
import { sampleCars, brands, budgetRanges, Car } from "@/lib/data";

export default function CarsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <CarsPageContent />
    </Suspense>
  );
}

function CarsPageContent() {
  const searchParams = useSearchParams();
  const [cars, setCars] = useState<Car[]>(sampleCars);
  const [filters, setFilters] = useState({
    brand: searchParams.get("brand") || "",
    budget: searchParams.get("budget") || "",
    fuel: searchParams.get("fuel") || "",
    transmission: "",
    year: "",
    sort: "newest",
    search: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetch("/new/api/cars")
      .then((r) => r.json())
      .then((data) => { if (data.length) setCars(data); })
      .catch(() => {});
  }, []);

  const filteredCars = useMemo(() => {
    let result = [...cars];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.brand.toLowerCase().includes(q) ||
          c.model.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q)
      );
    }

    if (filters.brand) {
      result = result.filter((c) => c.brand === filters.brand);
    }

    if (filters.budget) {
      const range = budgetRanges.find((b) => b.slug === filters.budget);
      if (range) {
        result = result.filter((c) => c.price >= range.min && c.price < range.max);
      }
    }

    if (filters.fuel) {
      result = result.filter((c) => c.fuelType === filters.fuel);
    }

    if (filters.transmission) {
      result = result.filter((c) => c.transmission === filters.transmission);
    }

    if (filters.year) {
      result = result.filter((c) => c.year >= Number(filters.year));
    }

    switch (filters.sort) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => b.year - a.year);
        break;
      case "km-low":
        result.sort((a, b) => a.kmDriven - b.kmDriven);
        break;
    }

    return result;
  }, [cars, filters]);

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const activeFilterCount = [filters.brand, filters.budget, filters.fuel, filters.transmission, filters.year, filters.search].filter(Boolean).length;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-5">
          <nav className="text-sm text-slate-500 mb-3 flex items-center gap-1.5">
            <a href="/new" className="hover:text-orange-500 transition-colors">Home</a>
            <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
            <span className="text-slate-900 font-medium">Used Cars</span>
            {filters.brand && (
              <>
                <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                <span className="text-slate-900 font-medium">{filters.brand}</span>
              </>
            )}
          </nav>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Buy Used Cars in India
            {filters.brand && <span className="text-orange-600"> - {filters.brand}</span>}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="md:w-[260px] flex-shrink-0">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-slate-200 mb-4"
            >
              <span className="flex items-center gap-2 font-semibold text-sm text-slate-900">
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" /></svg>
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{activeFilterCount}</span>
                )}
              </span>
              <svg className={`w-4 h-4 text-slate-400 transition-transform ${showFilters ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
            </button>

            <div className={`${showFilters ? "block" : "hidden"} md:block`}>
              <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">Filters</h3>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={() => setFilters({ brand: "", budget: "", fuel: "", transmission: "", year: "", sort: "newest", search: "" })}
                      className="text-xs text-orange-600 font-semibold hover:underline"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="p-5 space-y-5">
                  {/* Search */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Search</label>
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                      <input
                        type="text"
                        placeholder="Search cars..."
                        value={filters.search}
                        onChange={(e) => updateFilter("search", e.target.value)}
                        className="input-premium !pl-9"
                      />
                    </div>
                  </div>

                  {/* Brand */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Brand</label>
                    <select value={filters.brand} onChange={(e) => updateFilter("brand", e.target.value)} className="input-premium">
                      <option value="">All Brands</option>
                      {brands.map((b) => (<option key={b.slug} value={b.name}>{b.name}</option>))}
                    </select>
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Budget</label>
                    <select value={filters.budget} onChange={(e) => updateFilter("budget", e.target.value)} className="input-premium">
                      <option value="">Any Budget</option>
                      {budgetRanges.map((b) => (<option key={b.slug} value={b.slug}>{b.label}</option>))}
                    </select>
                  </div>

                  {/* Fuel Type */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Fuel Type</label>
                    <div className="flex flex-wrap gap-1.5">
                      {["", "Petrol", "Diesel", "Electric", "CNG"].map((f) => (
                        <button
                          key={f}
                          onClick={() => updateFilter("fuel", f)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                            filters.fuel === f
                              ? "bg-orange-50 border-orange-300 text-orange-700"
                              : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          {f || "All"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Transmission */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Transmission</label>
                    <div className="flex gap-1.5">
                      {["", "Manual", "Automatic"].map((t) => (
                        <button
                          key={t}
                          onClick={() => updateFilter("transmission", t)}
                          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                            filters.transmission === t
                              ? "bg-orange-50 border-orange-300 text-orange-700"
                              : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          {t || "All"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Year */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Year From</label>
                    <select value={filters.year} onChange={(e) => updateFilter("year", e.target.value)} className="input-premium">
                      <option value="">Any Year</option>
                      {[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018].map((y) => (
                        <option key={y} value={y}>{y}+</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-slate-500">
                <span className="font-bold text-slate-900 text-base">{filteredCars.length}</span> cars found
              </p>
              <select
                value={filters.sort}
                onChange={(e) => updateFilter("sort", e.target.value)}
                className="input-premium !w-auto !py-2 !text-xs"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="km-low">Lowest KM</option>
              </select>
            </div>

            {filteredCars.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
                <svg className="w-16 h-16 text-slate-200 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                <h3 className="text-lg font-bold text-slate-900">No cars found</h3>
                <p className="text-slate-500 mt-1 text-sm">Try adjusting your filters</p>
                <button
                  onClick={() => setFilters({ brand: "", budget: "", fuel: "", transmission: "", year: "", sort: "newest", search: "" })}
                  className="btn-outline mt-4 !text-sm"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCars.map((car, i) => (
                  <CarCard key={car.id} car={car} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
