"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Car, formatPrice } from "@/lib/data";
import { adminFetch } from "@/lib/admin-fetch";

export default function AdminCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = () => {
    adminFetch("/api/admin/cars").then((r) => r.json()).then(setCars).catch(() => {});
  };

  const deleteCar = async (id: string) => {
    if (!confirm("Are you sure you want to delete this car?")) return;
    await adminFetch("/api/admin/cars", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchCars();
  };

  const toggleFeatured = async (car: Car) => {
    await adminFetch("/api/admin/cars", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: car.id, featured: !car.featured }),
    });
    fetchCars();
  };

  const filtered = cars.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Cars ({cars.length})</h1>
        <Link href="/admin/cars/new" className="btn-primary text-sm !py-2.5">
          + Add New Car
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 mb-4">
        <input
          type="text"
          placeholder="Search cars..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Car</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Price</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase hidden md:table-cell">Year</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase hidden md:table-cell">Fuel</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase hidden lg:table-cell">Location</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Featured</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((car) => (
                <tr key={car.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {car.images[0] ? (
                        <img src={car.images[0]} alt={car.name} className="w-14 h-10 object-cover rounded-lg" />
                      ) : (
                        <div className="w-14 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" /></svg>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{car.name}</p>
                        <p className="text-xs text-gray-500">{car.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold text-orange-500 text-sm">{formatPrice(car.price)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 hidden md:table-cell">{car.year}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 hidden md:table-cell">{car.fuelType}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 hidden lg:table-cell">{car.city}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleFeatured(car)}
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        car.featured ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {car.featured ? "Featured" : "Normal"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/cars/${car.id}`} className="text-blue-500 text-sm hover:underline">Edit</Link>
                      <button onClick={() => deleteCar(car.id)} className="text-red-500 text-sm hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
