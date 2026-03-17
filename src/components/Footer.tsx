"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="text-xl font-bold text-white">
                Gaadi<span className="text-orange-500">Broker</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              India&apos;s most trusted platform for buying and selling pre-owned cars.
              Verified sellers, certified vehicles, unbeatable deals.
            </p>
            <div className="flex gap-3 mt-4">
              {["Facebook", "Instagram", "Twitter", "YouTube"].map((social) => (
                <button
                  key={social}
                  className="w-10 h-10 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors text-xs"
                  aria-label={social}
                >
                  {social[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: "/cars", label: "Buy Used Cars" },
                { href: "/sell", label: "Sell Your Car" },
                { href: "/compare", label: "Compare Cars" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact Us" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-orange-500 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Brands */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Popular Brands</h3>
            <ul className="space-y-2">
              {["Maruti Suzuki", "Hyundai", "Tata", "Honda", "Toyota", "Kia", "BMW"].map(
                (brand) => (
                  <li key={brand}>
                    <Link
                      href={`/cars?brand=${encodeURIComponent(brand)}`}
                      className="hover:text-orange-500 transition-colors text-sm"
                    >
                      Used {brand} Cars
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">📍</span>
                123 Auto Lane, Andheri West, Mumbai 400053
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-500">📞</span>
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-500">✉️</span>
                hello@gaadibroker.com
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-sm">
          <p>&copy; 2026 GaadiBroker. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-orange-500 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-orange-500 transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
