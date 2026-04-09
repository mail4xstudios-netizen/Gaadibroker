"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import CarCard from "@/components/CarCard";
import { Car, sampleCars, Brand, brands as defaultBrands, budgetRanges, testimonials } from "@/lib/data";

export default function Home() {
  const [cars, setCars] = useState<Car[]>(sampleCars);
  const [brands, setBrands] = useState<Brand[]>(defaultBrands);
  const [youtubeVideos, setYoutubeVideos] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/cars")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setCars(data); })
      .catch(() => {});
    fetch("/api/brands")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setBrands(data); })
      .catch(() => {});
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        if (data.youtubeVideos && data.youtubeVideos.length > 0) setYoutubeVideos(data.youtubeVideos);
        else if (data.youtubeVideoUrl) setYoutubeVideos([data.youtubeVideoUrl]);
      })
      .catch(() => {});
  }, []);

  const featuredCars = cars.filter((c) => c.featured).slice(0, 8);

  return (
    <div>
      {/* Hero Section — Luxury Dark Theme with Full-Screen Car Image */}
      <section className="relative bg-[#0B0B0B] overflow-hidden h-screen">
        {/* Full-screen background car image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1920&q=80"
            alt="Luxury pre-owned car"
            className="w-full h-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
          />
          {/* Cinematic overlays — stronger on mobile for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B] via-[#0B0B0B]/80 md:via-[#0B0B0B]/70 to-[#0B0B0B]/40 md:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/50 to-[#0B0B0B]/40 md:from-[#0B0B0B]/90 md:via-transparent md:to-transparent" />
        </div>

        {/* Ambient glow accents */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/15 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-orange-600/15 rounded-full blur-[140px] pointer-events-none z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-12 md:pt-28 pb-8 md:pb-20 min-h-[560px] md:min-h-[720px] flex flex-col justify-center">
          <div className="max-w-2xl">
            {/* Premium badge */}
            <div className="inline-flex items-center gap-2 mb-4 md:mb-6">
              <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500/20 to-orange-400/10 text-orange-300 text-[0.65rem] md:text-xs font-semibold px-3 py-1.5 rounded-full border border-orange-500/30 backdrop-blur-sm uppercase tracking-wider">
                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
                India&apos;s Premium Pre-Owned Marketplace
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-[2rem] md:text-[4rem] font-extrabold text-white leading-[1.1] tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
              Buy Pre-Owned Cars{" "}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6A00] to-[#FF8C00]">
                  Without Risk
                </span>
                <span className="absolute -bottom-1 md:-bottom-2 left-0 right-0 h-[2px] md:h-[3px] bg-gradient-to-r from-[#FF6A00] to-[#FF8C00] rounded-full" />
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-sm md:text-lg text-slate-200 mt-4 md:mt-6 leading-relaxed max-w-xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              <span className="text-white font-semibold">1000+ Cars Delivered</span>
              <span className="text-slate-400 mx-2">|</span>
              <span className="text-white font-semibold">Verified & Inspected Cars</span>
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6 md:mt-8">
              <Link
                href="/contact"
                className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF6A00] to-[#FF8C00] text-white font-semibold px-6 md:px-8 py-3.5 md:py-4 rounded-xl text-sm md:text-base shadow-[0_8px_30px_rgba(255,106,0,0.4)] hover:shadow-[0_12px_40px_rgba(255,106,0,0.55)] hover:scale-[1.02] transition-all duration-300"
              >
                Get Expert Consultation
                <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/cars"
                className="inline-flex items-center justify-center gap-2 border border-white/30 bg-white/10 backdrop-blur-md text-white font-semibold px-6 md:px-8 py-3.5 md:py-4 rounded-xl text-sm md:text-base hover:bg-white/20 hover:border-white/50 transition-all duration-300"
              >
                Browse Verified Cars
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:gap-x-6 mt-6 md:mt-10">
              {[
                "No Accidental Cars",
                "No Hidden History",
                "100% Transparency",
              ].map((text) => (
                <span key={text} className="flex items-center gap-1.5 text-slate-200 text-[0.7rem] md:text-xs font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                  <span className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-br from-[#FF6A00] to-[#FF8C00] flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(255,106,0,0.6)]">
                    <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </span>
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-6 md:mt-12 max-w-4xl">
            <SearchBar />
          </div>
        </div>

        {/* Info Strip — Feature Cards */}
        <div className="relative z-10 border-t border-white/10 bg-black/50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
              {[
                {
                  title: "1000+ Cars",
                  subtitle: "Delivered",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  ),
                },
                {
                  title: "Thorough",
                  subtitle: "Inspections",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                  ),
                },
                {
                  title: "Personalized",
                  subtitle: "Consultation",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  ),
                },
                {
                  title: "Best Price",
                  subtitle: "Guarantee",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                  ),
                },
              ].map((feat) => (
                <div
                  key={feat.title}
                  className="group relative bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-5 hover:border-orange-500/40 transition-all duration-300"
                >
                  <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br from-[#FF6A00]/20 to-[#FF8C00]/5 border border-orange-500/30 flex items-center justify-center mb-2 md:mb-3 shadow-[0_0_20px_rgba(255,106,0,0.25)] group-hover:shadow-[0_0_30px_rgba(255,106,0,0.4)] transition-shadow">
                    <svg className="w-4 h-4 md:w-6 md:h-6 text-[#FF8C00]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      {feat.icon}
                    </svg>
                  </div>
                  <p className="text-white font-bold text-xs md:text-base leading-tight">{feat.title}</p>
                  <p className="text-slate-400 text-[0.65rem] md:text-xs mt-0.5">{feat.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-20">
        <div className="flex items-end justify-between mb-4 md:mb-8">
          <div>
            <h2 className="section-title">Featured Cars</h2>
            <p className="section-subtitle">Handpicked just for you</p>
          </div>
          <Link
            href="/cars"
            className="hidden md:flex items-center gap-1.5 text-orange-600 font-semibold text-sm hover:gap-2.5 transition-all"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-5">
          {featuredCars.map((car, i) => (
            <CarCard key={car.id} car={car} index={i} />
          ))}
        </div>

        <div className="text-center mt-6 md:hidden">
          <Link href="/cars" className="btn-outline text-sm !px-5 !py-2.5">
            View All Cars
          </Link>
        </div>
      </section>

      {/* Browse by Budget */}
      <section className="bg-slate-50 py-8 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-5 md:mb-10">
            <h2 className="section-title">Browse by Budget</h2>
            <p className="section-subtitle">Find cars that fit your budget</p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
            {budgetRanges.map((range) => {
              const count = cars.filter(
                (c) => c.price >= range.min && c.price < range.max
              ).length;
              return (
                <Link
                  key={range.slug}
                  href={`/cars?budget=${range.slug}`}
                  className="group block bg-white rounded-xl px-2 md:px-4 py-3 md:py-5 text-center border border-slate-200/80 hover:border-orange-300 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-50 rounded-lg flex items-center justify-center mx-auto mb-2 md:mb-3 group-hover:bg-orange-100 transition-colors">
                    <span className="text-orange-500 font-bold text-sm md:text-lg">₹</span>
                  </div>
                  <p className="font-bold text-slate-900 text-[0.7rem] md:text-sm group-hover:text-orange-600 transition-colors">
                    {range.label}
                  </p>
                  <p className="text-[0.6rem] md:text-[0.6875rem] text-slate-400 mt-0.5 md:mt-1">{count} cars</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Browse by Brand */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-20">
        <div className="text-center mb-5 md:mb-10">
          <h2 className="section-title">Browse by Brand</h2>
          <p className="section-subtitle">Popular car manufacturers</p>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-1.5 md:gap-3">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/cars?brand=${encodeURIComponent(brand.name)}`}
              className="group block bg-white rounded-lg md:rounded-xl p-2 md:p-5 text-center border border-slate-100 hover:border-orange-200 hover:shadow-md transition-all duration-300"
            >
              <BrandLogo brand={brand} />
              <p className="font-semibold text-slate-800 text-[0.65rem] md:text-sm mt-1.5 md:mt-3 group-hover:text-orange-600 transition-colors truncate">{brand.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* YouTube Videos */}
      {youtubeVideos.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 pb-8 md:pb-16">
          <div className="text-center mb-5 md:mb-8">
            <h2 className="section-title">Our Videos</h2>
            <p className="section-subtitle">Watch our latest videos on YouTube</p>
          </div>
          <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {youtubeVideos.map((url, idx) => {
              const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
              const videoId = match ? match[1] : null;
              if (!videoId) return null;
              return (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 w-[160px] md:w-[220px] snap-start group relative rounded-xl overflow-hidden border border-slate-200 hover:border-orange-300 transition-all hover:shadow-lg"
                >
                  <div className="aspect-[9/16] bg-slate-100">
                    <img
                      src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                      alt={`Video ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-red-600 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 md:w-7 md:h-7 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="bg-slate-900 py-10 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-xl md:text-[2rem] font-extrabold text-white tracking-tight">
              Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500">GaadiBroker</span>?
            </h2>
            <p className="text-slate-400 mt-1.5 md:mt-2 text-xs md:text-base">Simple, safe, and satisfying car buying</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-5">
            {[
              {
                icon: <svg className="w-5 h-5 md:w-7 md:h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>,
                title: "100% Verified",
                desc: "200-point inspection on every car",
              },
              {
                icon: <svg className="w-5 h-5 md:w-7 md:h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>,
                title: "Best Price",
                desc: "No hidden charges, best value",
              },
              {
                icon: <svg className="w-5 h-5 md:w-7 md:h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>,
                title: "Easy Paperwork",
                desc: "Hassle-free RC transfer & docs",
              },
              {
                icon: <svg className="w-5 h-5 md:w-7 md:h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" /></svg>,
                title: "Easy Financing",
                desc: "Quick loan approval, low EMIs",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white/5 backdrop-blur-sm rounded-xl p-3 md:p-6 border border-white/10 hover:border-orange-500/30 hover:bg-white/10 transition-all duration-300">
                <div className="w-9 h-9 md:w-12 md:h-12 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-lg md:rounded-xl flex items-center justify-center text-orange-400 mb-2.5 md:mb-4">
                  {item.icon}
                </div>
                <h3 className="text-[0.8125rem] md:text-base font-bold text-white">{item.title}</h3>
                <p className="text-slate-400 text-xs md:text-sm mt-1 md:mt-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-20">
        <div className="text-center mb-6 md:mb-10">
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle">Real reviews from verified buyers</p>
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="flex md:hidden gap-3 overflow-x-auto pb-3 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-xl p-4 border border-slate-100 min-w-[260px] max-w-[280px] flex-shrink-0 snap-start"
            >
              <div className="flex gap-0.5 text-amber-400">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <svg key={j} className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" /></svg>
                ))}
              </div>
              <p className="text-slate-600 text-xs mt-2 leading-relaxed line-clamp-3">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-[0.6rem]">{t.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-xs">{t.name}</p>
                  <p className="text-[0.6rem] text-slate-400">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-xl p-5 border border-slate-100 hover:border-orange-200 hover:shadow-md transition-all duration-300"
            >
              <div className="flex gap-0.5 text-amber-400 text-sm">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <svg key={j} className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" /></svg>
                ))}
              </div>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-xs">{t.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                  <p className="text-[0.6875rem] text-slate-400">
                    {t.location} &middot; {t.car}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-20 text-center">
          <h2 className="text-lg md:text-4xl font-extrabold text-white tracking-tight">
            Want to Sell Your Car?
          </h2>
          <p className="text-white/80 mt-2 md:mt-3 text-sm md:text-lg max-w-xl mx-auto">
            Free evaluation, instant offer, hassle-free process.
          </p>
          <div className="flex gap-3 justify-center mt-5 md:mt-8">
            <Link
              href="/sell"
              className="bg-white text-orange-600 font-bold px-5 md:px-8 py-3 md:py-4 rounded-xl hover:bg-slate-50 transition-all text-sm md:text-base inline-block shadow-lg shadow-orange-700/20"
            >
              Sell Now
            </Link>
            <Link
              href="/cars"
              className="border-2 border-white/40 text-white font-bold px-5 md:px-8 py-3 md:py-4 rounded-xl hover:bg-white/10 transition-all text-sm md:text-base inline-block backdrop-blur-sm"
            >
              Browse Cars
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-20">
        <div className="text-center mb-6 md:mb-10">
          <h2 className="section-title">FAQs</h2>
          <p className="section-subtitle">Everything you need to know</p>
        </div>

        <div className="space-y-3">
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
  const gradients = [
    "from-blue-500 to-blue-600", "from-indigo-500 to-indigo-600",
    "from-violet-500 to-violet-600", "from-teal-500 to-teal-600",
    "from-orange-500 to-orange-600", "from-rose-500 to-rose-600",
    "from-emerald-500 to-emerald-600", "from-cyan-500 to-cyan-600",
    "from-fuchsia-500 to-fuchsia-600", "from-amber-500 to-amber-600",
    "from-lime-500 to-lime-600", "from-sky-500 to-sky-600",
  ];
  const gradientIndex = brand.name.charCodeAt(0) % gradients.length;

  if (!brand.logo || imgError) {
    return (
      <div className={`w-8 h-8 md:w-14 md:h-14 bg-gradient-to-br ${gradients[gradientIndex]} rounded-lg md:rounded-xl flex items-center justify-center mx-auto shadow-sm`}>
        <span className="text-white font-bold text-xs md:text-lg">{brand.name.charAt(0)}</span>
      </div>
    );
  }

  return (
    <img
      src={brand.logo}
      alt={`${brand.name} logo`}
      className="w-8 h-8 md:w-14 md:h-14 object-contain mx-auto"
      onError={() => setImgError(true)}
    />
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden hover:border-slate-300 transition-colors">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 md:px-5 py-3 md:py-4 text-left font-semibold text-slate-900 hover:text-orange-600 transition-colors flex items-center justify-between gap-3 text-[0.8125rem] md:text-[0.9375rem]"
      >
        {question}
        <svg className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-48" : "max-h-0"}`}>
        <div className="px-4 md:px-5 pb-3 md:pb-4 text-slate-600 text-xs md:text-sm leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
}
