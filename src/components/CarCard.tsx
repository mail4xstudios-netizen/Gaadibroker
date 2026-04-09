"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Car, formatPrice, formatKm } from "@/lib/data";
import { isInWishlist, toggleWishlist } from "@/lib/wishlist";

export default function CarCard({ car, index = 0 }: { car: Car; index?: number }) {
  const [wishlisted, setWishlisted] = useState(false);
  const isSold = car.status === "sold";

  useEffect(() => {
    setWishlisted(isInWishlist(car.id));
  }, [car.id]);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(car.id);
    setWishlisted(added);
  };

  return (
    <Link href={`/cars/${car.id}`} className="block group">
      <div className={`bg-white rounded-xl overflow-hidden border border-slate-100 hover:border-orange-200 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,.08)] hover:-translate-y-1 ${isSold ? "opacity-60 grayscale" : ""}`}>
        {/* Image - 1:1 */}
        <div className="relative aspect-square overflow-hidden bg-slate-100">
          {car.images[0] ? (
            <img
              src={car.images[0]}
              alt={car.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" /></svg>
            </div>
          )}
          {/* Gradient overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-12 md:h-16 bg-gradient-to-t from-black/30 to-transparent" />

          {/* Badges */}
          <div className="absolute top-2 md:top-3 left-2 md:left-3 flex gap-1">
            {car.featured && (
              <span className="badge badge-featured !text-[0.6rem] md:!text-xs !px-1.5 md:!px-2 !py-0.5 md:!py-1">
                <svg className="w-2.5 h-2.5 md:w-3 md:h-3" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" /></svg>
                Featured
              </span>
            )}
            {isSold && (
              <span className="bg-red-600 text-white text-[0.6rem] md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-md">
                SOLD
              </span>
            )}
          </div>

          {/* Wishlist heart */}
          <button
            onClick={handleWishlist}
            className="absolute top-2 md:top-3 right-2 md:right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <svg
              className={`w-4 h-4 transition-colors ${wishlisted ? "text-red-500 fill-red-500" : "text-slate-400"}`}
              fill={wishlisted ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </button>

          {/* Year badge bottom-left */}
          <span className="absolute bottom-2 md:bottom-3 left-2 md:left-3 text-white text-[0.65rem] md:text-xs font-semibold bg-black/40 backdrop-blur-sm px-1.5 md:px-2 py-0.5 rounded">
            {car.year}
          </span>
        </div>

        {/* Content */}
        <div className="p-2.5 md:p-4">
          <h3 className="font-bold text-slate-900 text-[0.75rem] md:text-[0.9375rem] leading-tight truncate group-hover:text-orange-600 transition-colors">
            {car.name}
          </h3>

          {/* Spec chips */}
          <div className="flex flex-wrap items-center gap-1 md:gap-1.5 mt-1.5 md:mt-2.5">
            <span className="chip !py-0.5 md:!py-1 !px-1.5 md:!px-2 !text-[0.6rem] md:!text-xs">{formatKm(car.kmDriven)}</span>
            <span className="chip !py-0.5 md:!py-1 !px-1.5 md:!px-2 !text-[0.6rem] md:!text-xs">{car.fuelType}</span>
            <span className="chip !py-0.5 md:!py-1 !px-1.5 md:!px-2 !text-[0.6rem] md:!text-xs">{car.transmission}</span>
          </div>

          {/* Owner & Location - hidden on mobile for compactness */}
          <div className="hidden md:flex items-center justify-between mt-2.5 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0" /></svg>
              {car.ownerType}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
              {car.location}
            </span>
          </div>

          {/* Price + Recent views */}
          <div className="flex items-end justify-between gap-2 mt-2 md:mt-3 pt-2 md:pt-3 border-t border-slate-100">
            <div className="min-w-0">
              <p className={`text-sm md:text-xl font-extrabold tracking-tight ${isSold ? "text-slate-400" : "text-orange-600"}`}>
                {isSold ? "SOLD" : formatPrice(car.price)}
              </p>
            </div>
            {!isSold && typeof car.recentViews === "number" && car.recentViews > 0 && (
              <span className="flex items-center gap-1 text-[0.6rem] md:text-[0.7rem] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 md:px-2 py-0.5 md:py-1 rounded-md flex-shrink-0 whitespace-nowrap">
                <span className="relative flex w-1.5 h-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </span>
                {car.recentViews} viewing
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
