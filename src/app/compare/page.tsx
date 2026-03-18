"use client";

import { useState, useEffect } from "react";
import { Car, sampleCars, formatPrice, formatKm } from "@/lib/data";

export default function ComparePage() {
  const [cars, setCars] = useState<Car[]>(sampleCars);
  const [selected, setSelected] = useState<(Car | null)[]>([null, null, null]);

  useEffect(() => {
    fetch("/new/api/cars")
      .then((r) => r.json())
      .then((data) => { if (data.length) setCars(data); })
      .catch(() => {});
  }, []);

  const selectCar = (index: number, carId: string) => {
    const car = cars.find((c) => c.id === carId) || null;
    setSelected((prev) => {
      const next = [...prev];
      next[index] = car;
      return next;
    });
  };

  const activeCars = selected.filter((c): c is Car => c !== null);

  const specs = [
    { label: "Price", get: (c: Car) => formatPrice(c.price) },
    { label: "Year", get: (c: Car) => c.year.toString() },
    { label: "KM Driven", get: (c: Car) => formatKm(c.kmDriven) },
    { label: "Fuel Type", get: (c: Car) => c.fuelType },
    { label: "Transmission", get: (c: Car) => c.transmission },
    { label: "Owner", get: (c: Car) => c.ownerType },
    { label: "Color", get: (c: Car) => c.color },
    { label: "Location", get: (c: Car) => c.city },
    { label: "Insurance", get: (c: Car) => c.insurance },
  ];

  return (
    <div>
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white">Compare Cars</h1>
          <p className="text-gray-300 mt-3">Select up to 3 cars to compare side by side</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
              <label className="text-sm font-medium text-gray-700 block mb-2">Car {i + 1}</label>
              <select
                value={selected[i]?.id || ""}
                onChange={(e) => selectCar(i, e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select a car</option>
                {cars.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} - {formatPrice(c.price)}</option>
                ))}
              </select>
              {selected[i] && (
                <div className="mt-3">
                  <img src={selected[i]!.images[0]} alt={selected[i]!.name} className="w-full h-32 object-cover rounded-lg" />
                  <p className="font-semibold text-gray-900 mt-2 text-sm">{selected[i]!.name}</p>
                  <p className="text-orange-500 font-bold">{formatPrice(selected[i]!.price)}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        {activeCars.length >= 2 && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-1/4">Specification</th>
                    {activeCars.map((c) => (
                      <th key={c.id} className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        {c.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {specs.map((spec, i) => (
                    <tr key={spec.label} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-600">{spec.label}</td>
                      {activeCars.map((c) => (
                        <td key={c.id} className="px-4 py-3 text-sm text-gray-900 font-medium">
                          {spec.get(c)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="bg-white">
                    <td className="px-4 py-3 text-sm font-medium text-gray-600">Features</td>
                    {activeCars.map((c) => (
                      <td key={c.id} className="px-4 py-3 text-xs text-gray-700">
                        {c.features.join(", ")}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
        )}

        {activeCars.length < 2 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-5xl mb-3">📊</div>
            <p>Select at least 2 cars to compare</p>
          </div>
        )}
      </div>
    </div>
  );
}
