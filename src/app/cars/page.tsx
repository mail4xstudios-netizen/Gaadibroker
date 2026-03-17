"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CarCard from "@/components/CarCard";
import { sampleCars, brands, budgetRanges, Car } from "@/lib/data";

export default function CarsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>}>
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
    fetch("/api/cars")
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <a href="/" className="hover:text-orange-500">Home</a>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">Used Cars</span>
        {filters.brand && (
          <>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{filters.brand}</span>
          </>
        )}
      </nav>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <div className="flex items-center justify-between md:hidden mb-3">
            <h2 className="font-bold text-lg">
              {filteredCars.length} Cars Found
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-orange-500 font-medium text-sm"
            >
              {showFilters ? "Hide" : "Show"} Filters
            </button>
          </div>

          <div className={`${showFilters ? "block" : "hidden"} md:block`}>
            <div className="bg-white rounded-xl shadow-md p-5 space-y-5 border border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg">Filters</h3>

              {/* Search */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Search</label>
                <input
                  type="text"
                  placeholder="Search cars..."
                  value={filters.search}
                  onChange={(e) => updateFilter("search", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Brand */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Brand</label>
                <select
                  value={filters.brand}
                  onChange={(e) => updateFilter("brand", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">All Brands</option>
                  {brands.map((b) => (
                    <option key={b.slug} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>

              {/* Budget */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Budget</label>
                <select
                  value={filters.budget}
                  onChange={(e) => updateFilter("budget", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Any Budget</option>
                  {budgetRanges.map((b) => (
                    <option key={b.slug} value={b.slug}>{b.label}</option>
                  ))}
                </select>
              </div>

              {/* Fuel Type */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Fuel Type</label>
                <select
                  value={filters.fuel}
                  onChange={(e) => updateFilter("fuel", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">All</option>
                  {["Petrol", "Diesel", "Electric", "CNG", "Hybrid"].map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              {/* Transmission */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Transmission</label>
                <select
                  value={filters.transmission}
                  onChange={(e) => updateFilter("transmission", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">All</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Year From</label>
                <select
                  value={filters.year}
                  onChange={(e) => updateFilter("year", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Any Year</option>
                  {[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018].map((y) => (
                    <option key={y} value={y}>{y}+</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() =>
                  setFilters({
                    brand: "",
                    budget: "",
                    fuel: "",
                    transmission: "",
                    year: "",
                    sort: "newest",
                    search: "",
                  })
                }
                className="w-full text-sm text-orange-500 font-medium hover:underline"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 hidden md:block">
              Used Cars {filters.brand ? `- ${filters.brand}` : ""}
              <span className="text-gray-400 text-lg font-normal ml-2">
                ({filteredCars.length})
              </span>
            </h1>
            <select
              value={filters.sort}
              onChange={(e) => updateFilter("sort", e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="km-low">Lowest KM</option>
            </select>
          </div>

          {filteredCars.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🚗</div>
              <h3 className="text-xl font-bold text-gray-900">No cars found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCars.map((car, i) => (
                <CarCard key={car.id} car={car} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
