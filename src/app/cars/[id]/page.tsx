"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Car, sampleCars, formatPrice, formatKm } from "@/lib/data";
import LeadForm from "@/components/LeadForm";
import EMICalculator from "@/components/EMICalculator";
import MobileBottomBar from "@/components/MobileBottomBar";
import CarCard from "@/components/CarCard";
import { DealerNumberGate } from "@/components/AuthGate";

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <svg className="w-20 h-20 text-slate-200 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
          <h2 className="text-xl font-bold text-slate-900">Car Not Found</h2>
          <a href="/cars" className="text-orange-600 font-semibold text-sm mt-3 inline-flex items-center gap-1 hover:gap-2 transition-all">
            Browse All Cars
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
          </a>
        </div>
      </div>
    );
  }

  const similarCars = sampleCars
    .filter((c) => c.id !== car.id && (c.brand === car.brand || Math.abs(c.price - car.price) < 300000))
    .slice(0, 4);

  const specs = [
    { label: "Year", value: car.year.toString(), icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg> },
    { label: "KM Driven", value: formatKm(car.kmDriven), icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg> },
    { label: "Fuel Type", value: car.fuelType, icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" /></svg> },
    { label: "Transmission", value: car.transmission, icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg> },
    { label: "Owner", value: car.ownerType, icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0" /></svg> },
    { label: "Color", value: car.color, icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072" /></svg> },
    { label: "Insurance", value: car.insurance.replace("Comprehensive till ", ""), icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg> },
    { label: "Registration", value: car.registration, icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" /></svg> },
  ];

  return (
    <div className="bg-slate-50 pb-20 md:pb-0">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <nav className="text-sm text-slate-500 flex items-center gap-1.5">
            <a href="/" className="hover:text-orange-500 transition-colors">Home</a>
            <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
            <a href="/cars" className="hover:text-orange-500 transition-colors">Used Cars</a>
            <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
            <span className="text-slate-900 font-medium truncate max-w-[200px]">{car.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column */}
          <div className="lg:w-2/3">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl overflow-hidden border border-slate-200/80">
              <div className="relative h-64 md:h-[420px] bg-slate-100">
                {car.images[activeImage] ? (
                  <img
                    src={car.images[activeImage]}
                    alt={car.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" /></svg>
                  </div>
                )}
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {car.featured && <span className="badge badge-featured text-sm">Featured</span>}
                  {car.originalPrice && <span className="badge badge-discount text-sm">{Math.round(((car.originalPrice - car.price) / car.originalPrice) * 100)}% OFF</span>}
                </div>
                {/* Image counter */}
                <span className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-lg">
                  {activeImage + 1} / {car.images.length}
                </span>
              </div>
              {/* Thumbnails */}
              <div className="flex gap-2 p-3 overflow-x-auto">
                {car.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      i === activeImage ? "border-orange-500 shadow-sm shadow-orange-200" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Car Info Header */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 md:p-6 mt-4">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">{car.name}</h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="chip !text-xs">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                      {car.location}
                    </span>
                    <span className="chip !text-xs">{car.registration}</span>
                    <span className="badge badge-certified">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" /></svg>
                      Certified
                    </span>
                  </div>
                </div>
                <div className="md:text-right flex-shrink-0">
                  <p className="text-2xl md:text-3xl font-extrabold text-orange-600 tracking-tight">{formatPrice(car.price)}</p>
                  {car.originalPrice && (
                    <p className="text-sm text-slate-400 line-through mt-0.5">{formatPrice(car.originalPrice)}</p>
                  )}
                </div>
              </div>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex items-center gap-3 bg-slate-50 rounded-lg p-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-orange-500 flex-shrink-0 border border-slate-100">
                      {spec.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[0.6875rem] text-slate-400 font-medium">{spec.label}</p>
                      <p className="font-semibold text-slate-900 text-sm truncate">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 md:p-6 mt-4">
              <h2 className="text-base font-bold text-slate-900 mb-3">About This Car</h2>
              <p className="text-slate-600 text-sm leading-relaxed">{car.description}</p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 md:p-6 mt-4">
              <h2 className="text-base font-bold text-slate-900 mb-4">Features & Specifications</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                {car.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5 text-sm text-slate-700">
                    <span className="w-5 h-5 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" /></svg>
                    </span>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:w-1/3 space-y-4">
            <DealerNumberGate carName={car.name} />
            <LeadForm carId={car.id} carName={car.name} />
            <EMICalculator carPrice={car.price} />

            {/* Safety Tips */}
            <div className="bg-amber-50 rounded-xl p-5 border border-amber-200/60">
              <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" /></svg>
                Buyer Safety Tips
              </h3>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start gap-2">
                  <svg className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" /></svg>
                  Always inspect the car in person before purchasing
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" /></svg>
                  Verify all documents with the RTO
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" /></svg>
                  Never pay the full amount before delivery
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" /></svg>
                  Check the car&apos;s service history
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Similar Cars */}
        {similarCars.length > 0 && (
          <div className="mt-12 mb-8">
            <h2 className="section-title mb-5">Similar Cars You May Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
