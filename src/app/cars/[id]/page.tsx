"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Car, sampleCars, formatPrice, formatKm } from "@/lib/data";
import LeadForm from "@/components/LeadForm";
import EMICalculator from "@/components/EMICalculator";
import MobileBottomBar from "@/components/MobileBottomBar";
import CarCard from "@/components/CarCard";

export default function CarDetailPage() {
  const { id } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/cars/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.id) setCar(data);
        else setCar(sampleCars.find((c) => c.id === id) || null);
      })
      .catch(() => setCar(sampleCars.find((c) => c.id === id) || null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold">Car Not Found</h2>
          <a href="/cars" className="text-orange-500 font-medium mt-2 inline-block">
            Browse All Cars →
          </a>
        </div>
      </div>
    );
  }

  const similarCars = sampleCars
    .filter((c) => c.id !== car.id && (c.brand === car.brand || Math.abs(c.price - car.price) < 300000))
    .slice(0, 4);

  return (
    <div className="pb-20 md:pb-0">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="text-sm text-gray-500">
          <a href="/" className="hover:text-orange-500">Home</a>
          <span className="mx-2">/</span>
          <a href="/cars" className="hover:text-orange-500">Used Cars</a>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{car.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="lg:w-2/3">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md">
              <div className="relative h-64 md:h-96 bg-gray-200">
                {car.images[activeImage] ? (
                  <img
                    src={car.images[activeImage]}
                    alt={car.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" /></svg>
                  </div>
                )}
                {car.featured && (
                  <span className="absolute top-4 left-4 bg-orange-500 text-white text-sm font-bold px-4 py-1.5 rounded-full">
                    Featured
                  </span>
                )}
              </div>
              <div className="flex gap-2 p-3 overflow-x-auto">
                {car.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === activeImage ? "border-orange-500" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Car Info */}
            <div className="bg-white rounded-xl shadow-md p-6 mt-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{car.name}</h1>
                  <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
                    <span>📍 {car.location}</span>
                    <span>•</span>
                    <span>{car.registration}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-orange-500">{formatPrice(car.price)}</p>
                  {car.originalPrice && (
                    <p className="text-sm text-gray-400 line-through">{formatPrice(car.originalPrice)}</p>
                  )}
                </div>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                {[
                  { label: "Year", value: car.year.toString(), icon: "📅" },
                  { label: "KM Driven", value: formatKm(car.kmDriven), icon: "🛣️" },
                  { label: "Fuel Type", value: car.fuelType, icon: "⛽" },
                  { label: "Transmission", value: car.transmission, icon: "⚙️" },
                  { label: "Owner", value: car.ownerType, icon: "👤" },
                  { label: "Color", value: car.color, icon: "🎨" },
                  { label: "Insurance", value: car.insurance.replace("Comprehensive till ", ""), icon: "📋" },
                  { label: "Registration", value: car.registration, icon: "🏷️" },
                ].map((spec) => (
                  <div key={spec.label} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">{spec.icon} {spec.label}</p>
                    <p className="font-semibold text-gray-900 text-sm mt-0.5">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-md p-6 mt-5">
              <h2 className="text-lg font-bold text-gray-900 mb-3">About This Car</h2>
              <p className="text-gray-600 leading-relaxed">{car.description}</p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl shadow-md p-6 mt-5">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {car.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-5 h-5 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center text-xs flex-shrink-0">
                      ✓
                    </span>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:w-1/3 space-y-5">
            <LeadForm carId={car.id} carName={car.name} />
            <EMICalculator carPrice={car.price} />

            {/* Safety Tips */}
            <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-200">
              <h3 className="font-bold text-gray-900 text-sm mb-2">🛡️ Safety Tips</h3>
              <ul className="text-xs text-gray-600 space-y-1.5">
                <li>• Always inspect the car in person before purchasing</li>
                <li>• Verify all documents with the RTO</li>
                <li>• Never pay the full amount before delivery</li>
                <li>• Check the car&apos;s service history</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Similar Cars */}
        {similarCars.length > 0 && (
          <div className="mt-12 mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-5">
              Similar Cars You May Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {similarCars.map((c, i) => (
                <CarCard key={c.id} car={c} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>

      <MobileBottomBar carName={car.name} />
    </div>
  );
}
