"use client";

import Link from "next/link";
import { Car, formatPrice, formatKm } from "@/lib/data";

export default function CarCard({ car, index = 0 }: { car: Car; index?: number }) {
  return (
    <Link href={`/cars/${car.id}`} className="block group">
      <div className="bg-white rounded-xl overflow-hidden border border-slate-100 hover:border-orange-200 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,.08)] hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-40 md:h-52 overflow-hidden bg-slate-100">
          {car.images[0] ? (
            <img
              src={car.images[0]}
              alt={car.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" /></svg>
            </div>
          )}
          {/* Gradient overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            {car.featured && (
              <span className="badge badge-featured">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" /></svg>
                Featured
              </span>
            )}
          </div>
          {car.originalPrice && (
            <span className="absolute top-3 right-3 badge badge-discount">
              {Math.round(((car.originalPrice - car.price) / car.originalPrice) * 100)}% OFF
            </span>
          )}

          {/* Year badge bottom-left */}
          <span className="absolute bottom-3 left-3 text-white text-xs font-semibold bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded">
            {car.year}
          </span>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-slate-900 text-[0.9375rem] leading-tight truncate group-hover:text-orange-600 transition-colors">
            {car.name}
          </h3>

          {/* Spec chips */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            <span className="chip !py-1 !px-2 !text-xs">{formatKm(car.kmDriven)}</span>
            <span className="chip !py-1 !px-2 !text-xs">{car.fuelType}</span>
            <span className="chip !py-1 !px-2 !text-xs">{car.transmission}</span>
          </div>

          {/* Owner & Location */}
          <div className="flex items-center justify-between mt-2.5 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0" /></svg>
              {car.ownerType}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
              {car.location}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-end justify-between mt-3 pt-3 border-t border-slate-100">
            <div>
              <p className="text-xl font-extrabold text-orange-600 tracking-tight">
                {formatPrice(car.price)}
              </p>
              {car.originalPrice && (
                <p className="text-[0.6875rem] text-slate-400 line-through mt-0.5">
                  {formatPrice(car.originalPrice)}
                </p>
              )}
            </div>
            <span className="text-orange-600 text-xs font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              View
              <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
