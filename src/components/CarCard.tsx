"use client";

import Link from "next/link";
import { Car, formatPrice, formatKm } from "@/lib/data";

export default function CarCard({ car, index = 0 }: { car: Car; index?: number }) {
  return (
    <Link href={`/cars/${car.id}`} className="block">
      <div className="bg-white rounded-xl overflow-hidden shadow-md card-hover group border border-gray-100">
        {/* Image */}
        <div className="relative h-48 md:h-52 overflow-hidden bg-gray-200">
          {car.images[0] ? (
            <img
              src={car.images[0]}
              alt={car.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" /></svg>
            </div>
          )}
          {car.featured && (
            <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              Featured
            </span>
          )}
          {car.originalPrice && (
            <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              {Math.round(((car.originalPrice - car.price) / car.originalPrice) * 100)}% OFF
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-gray-900 text-lg truncate group-hover:text-orange-500 transition-colors">
            {car.name}
          </h3>

          <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
            <span>{car.year}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span>{formatKm(car.kmDriven)}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span>{car.fuelType}</span>
          </div>

          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <span>{car.transmission}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span>{car.ownerType}</span>
          </div>

          <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
            <span>📍</span>
            <span>{car.location}</span>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div>
              <p className="text-xl font-bold text-orange-500">
                {formatPrice(car.price)}
              </p>
              {car.originalPrice && (
                <p className="text-xs text-gray-400 line-through">
                  {formatPrice(car.originalPrice)}
                </p>
              )}
            </div>
            <span className="text-orange-500 font-semibold text-sm group-hover:translate-x-1 transition-transform">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
