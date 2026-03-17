"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import CarCard from "@/components/CarCard";
import { sampleCars, Brand, brands as defaultBrands, budgetRanges, testimonials } from "@/lib/data";

export default function Home() {
  const featuredCars = sampleCars.filter((c) => c.featured).slice(0, 8);
  const [brands, setBrands] = useState<Brand[]>(defaultBrands);

  useEffect(() => {
    fetch("/api/brands")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setBrands(data); })
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920"
            alt="Premium car"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 w-full">
          <div className="max-w-2xl">
            <span className="inline-block bg-orange-500/20 text-orange-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              India&apos;s #1 Pre-Owned Car Platform
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Find Your Perfect{" "}
              <span className="text-orange-500">Pre-Owned</span> Car
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mt-4 max-w-xl">
              Verified sellers, certified vehicles, best deals. Browse thousands of quality used cars across India.
            </p>
            <div className="flex gap-3 mt-6">
              <Link href="/cars" className="btn-primary text-lg">
                Explore Cars
              </Link>
              <Link
                href="/sell"
                className="border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-200 inline-block text-lg"
              >
                Sell Your Car
              </Link>
            </div>
          </div>

          <div className="mt-10">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "10,000+", label: "Cars Listed" },
              { value: "50,000+", label: "Happy Customers" },
              { value: "100+", label: "Cities Covered" },
              { value: "4.8/5", label: "Customer Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl md:text-3xl font-bold text-orange-500">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Cars</h2>
            <p className="text-gray-500 mt-1">Handpicked vehicles just for you</p>
          </div>
          <Link
            href="/cars"
            className="text-orange-500 font-semibold hover:underline hidden md:block"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredCars.map((car, i) => (
            <CarCard key={car.id} car={car} index={i} />
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link href="/cars" className="btn-outline">
            View All Cars
          </Link>
        </div>
      </section>

      {/* Browse by Budget */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
            Browse by Budget
          </h2>
          <p className="text-gray-500 mt-1 text-center">Find cars that fit your budget</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
            {budgetRanges.map((range) => {
              const count = sampleCars.filter(
                (c) => c.price >= range.min && c.price < range.max
              ).length;
              return (
                <Link
                  key={range.slug}
                  href={`/cars?budget=${range.slug}`}
                  className="group block bg-white rounded-xl px-4 py-5 text-center border border-gray-200 hover:border-orange-400 hover:shadow-lg transition-all duration-200"
                >
                  <p className="font-bold text-gray-900 group-hover:text-orange-500 transition-colors">
                    {range.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-1.5">{count} cars available</p>
                  <div className="mt-3 text-orange-500 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    View All &rarr;
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Browse by Brand */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
          Browse by Brand
        </h2>
        <p className="text-gray-500 mt-1 text-center">Explore popular car brands</p>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/cars?brand=${encodeURIComponent(brand.name)}`}
              className="block bg-white rounded-xl p-5 text-center card-hover border border-gray-100 hover:border-orange-300 hover:shadow-md transition-all"
            >
              <BrandLogo brand={brand} />
              <p className="font-medium text-gray-800 text-sm mt-3">{brand.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-900 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
            Why Choose <span className="text-orange-500">GaadiBroker</span>?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>
                ),
                title: "100% Verified Cars",
                desc: "Every car undergoes a rigorous 200-point inspection before listing",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                ),
                title: "Best Price Guarantee",
                desc: "Get the most competitive prices with transparent pricing, no hidden charges",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                ),
                title: "Easy Documentation",
                desc: "Hassle-free RC transfer, insurance, and complete paperwork assistance",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" /></svg>
                ),
                title: "Easy Financing",
                desc: "Quick loan approval with low EMIs and minimal documentation required",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-gray-800 rounded-xl p-6 text-center"
              >
                <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 text-orange-400">{item.icon}</div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="text-gray-400 text-sm mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
          What Our Customers Say
        </h2>
        <p className="text-gray-500 mt-1 text-center">Real reviews from real customers</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-xl p-5 shadow-md border border-gray-100"
            >
              <div className="flex gap-1 text-yellow-400 text-sm">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <span key={j}>★</span>
                ))}
              </div>
              <p className="text-gray-600 text-sm mt-3 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                <p className="text-xs text-gray-400">
                  {t.location} • Bought {t.car}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white">
            Want to Sell Your Car?
          </h2>
          <p className="text-white/80 mt-3 text-lg">
            Get the best price for your car. Free evaluation, instant offer, hassle-free process.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link
              href="/sell"
              className="bg-white text-orange-500 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors text-lg inline-block"
            >
              Sell Your Car Now
            </Link>
            <Link
              href="/cars"
              className="border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors text-lg inline-block"
            >
              Browse Cars
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section (AEO Optimized) */}
      <section className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
          Frequently Asked Questions
        </h2>

        <div className="mt-8 space-y-4">
          {[
            {
              q: "How does GaadiBroker verify used cars?",
              a: "Every car listed on GaadiBroker undergoes a comprehensive 200-point inspection covering engine, transmission, body, electrical systems, and more. We also verify ownership documents, service history, and accident records.",
            },
            {
              q: "Can I get financing for a used car on GaadiBroker?",
              a: "Yes! We partner with leading banks and NBFCs to offer competitive car loan rates starting from 8.5% p.a. You can get instant loan approval with minimal documentation.",
            },
            {
              q: "What documents do I need to buy a used car?",
              a: "You need a valid ID proof (Aadhaar/PAN), address proof, income proof (for financing), and passport-size photos. We handle all RC transfer and insurance paperwork.",
            },
            {
              q: "How can I sell my car on GaadiBroker?",
              a: "Simply fill out the 'Sell Your Car' form with your car details. Our team will evaluate your vehicle, provide a fair market price, and complete the sale within 24-48 hours.",
            },
          ].map((faq, i) => (
            <FAQItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </section>
    </div>
  );
}

function BrandLogo({ brand }: { brand: Brand }) {
  const [imgError, setImgError] = useState(false);
  const colors = [
    "bg-blue-600", "bg-indigo-600", "bg-purple-600", "bg-teal-600",
    "bg-orange-600", "bg-red-600", "bg-green-600", "bg-cyan-600",
    "bg-rose-600", "bg-amber-600", "bg-emerald-600", "bg-sky-600",
  ];
  const colorIndex = brand.name.charCodeAt(0) % colors.length;

  if (!brand.logo || imgError) {
    return (
      <div className={`w-16 h-16 ${colors[colorIndex]} rounded-xl flex items-center justify-center mx-auto`}>
        <span className="text-white font-bold text-xl">{brand.name.charAt(0)}</span>
      </div>
    );
  }

  return (
    <img
      src={brand.logo}
      alt={`${brand.name} logo`}
      className="w-16 h-16 object-contain mx-auto"
      onError={() => setImgError(true)}
    />
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-4 text-left font-semibold text-gray-900 hover:text-orange-500 transition-colors flex items-center justify-between"
      >
        {question}
        <span className={`text-orange-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>
      {open && (
        <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}
