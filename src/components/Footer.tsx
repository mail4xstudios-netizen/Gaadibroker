"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8 md:pt-14 pb-6 md:pb-10">
        {/* Mobile: compact stacked layout */}
        <div className="md:hidden space-y-6">
          {/* Logo + tagline */}
          <div className="text-center">
            <Link href="/" className="inline-block mb-2">
              <img src="/images/logo-v2.png" alt="GaadiBroker" className="h-5 w-auto mx-auto" />
            </Link>
            <p className="text-xs text-slate-400 max-w-[240px] mx-auto">
              India&apos;s trusted platform for buying & selling pre-owned cars.
            </p>
          </div>

          {/* Links in 2 columns */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-center">
            {[
              { href: "/cars", label: "Buy Cars" },
              { href: "/sell", label: "Sell Car" },
              { href: "/loan", label: "Loan Calculator" },
              { href: "/compare", label: "Compare Cars" },
              { href: "/about", label: "About Us" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="text-xs text-slate-400 hover:text-orange-400 transition-colors py-1">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Contact row */}
          <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3 text-orange-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
              +91 98765 43210
            </span>
            <span className="w-0.5 h-3 bg-slate-700 rounded-full" />
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3 text-orange-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
              hello@gaadibroker.com
            </span>
          </div>

          {/* Social */}
          <div className="flex justify-center gap-2">
            {[
              { label: "Facebook", icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /> },
              { label: "Instagram", icon: <><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></> },
              { label: "Twitter", icon: <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /> },
              { label: "YouTube", icon: <><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></> },
            ].map((social) => (
              <button
                key={social.label}
                className="w-8 h-8 bg-slate-800 hover:bg-orange-500 rounded-lg flex items-center justify-center transition-all duration-200"
                aria-label={social.label}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">{social.icon}</svg>
              </button>
            ))}
          </div>
        </div>

        {/* Desktop: full layout */}
        <div className="hidden md:grid lg:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-5">
              <img src="/images/logo-v2.png" alt="GaadiBroker" className="h-9 w-auto" />
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
              India&apos;s most trusted platform for buying and selling pre-owned cars. Verified sellers, certified vehicles, unbeatable deals.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {["200+ Point Inspection", "Safe Payments"].map((badge) => (
                <span key={badge} className="flex items-center gap-1.5 text-[0.6875rem] text-emerald-400 font-medium bg-emerald-400/10 px-2.5 py-1 rounded-full">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" /></svg>
                  {badge}
                </span>
              ))}
            </div>
            <div className="flex gap-2 mt-6">
              {[
                { label: "Facebook", icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /> },
                { label: "Instagram", icon: <><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></> },
                { label: "Twitter", icon: <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /> },
                { label: "YouTube", icon: <><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></> },
              ].map((social) => (
                <button
                  key={social.label}
                  className="w-9 h-9 bg-slate-800 hover:bg-orange-500 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                  aria-label={social.label}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">{social.icon}</svg>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/cars", label: "Buy Used Cars" },
                { href: "/sell", label: "Sell Your Car" },
                { href: "/loan", label: "Loan Calculator" },
                { href: "/compare", label: "Compare Cars" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact Us" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-orange-400 transition-colors flex items-center gap-1.5 group">
                    <svg className="w-3 h-3 text-slate-600 group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Brands */}
          <div className="lg:col-span-3">
            <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Popular Brands</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {["Maruti Suzuki", "Hyundai", "Tata", "Honda", "Toyota", "Kia", "BMW", "Mercedes"].map(
                (brand) => (
                  <li key={brand}>
                    <Link
                      href={`/cars?brand=${encodeURIComponent(brand)}`}
                      className="text-sm text-slate-400 hover:text-orange-400 transition-colors"
                    >
                      {brand}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                </div>
                <span className="text-sm text-slate-400 leading-relaxed">123 Auto Lane, Andheri West, Mumbai 400053</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
                </div>
                <span className="text-sm text-slate-400">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                </div>
                <span className="text-sm text-slate-400">hello@gaadibroker.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-5 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-[0.65rem] md:text-sm text-slate-500">&copy; 2026 GaadiBroker. All rights reserved.</p>
          <div className="flex items-center gap-3 md:gap-5">
            <Link href="/privacy" className="text-[0.65rem] md:text-sm text-slate-500 hover:text-orange-400 transition-colors">
              Privacy Policy
            </Link>
            <span className="w-0.5 h-2.5 bg-slate-700 rounded-full" />
            <Link href="/terms" className="text-[0.65rem] md:text-sm text-slate-500 hover:text-orange-400 transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
