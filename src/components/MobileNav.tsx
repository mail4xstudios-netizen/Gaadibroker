"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileNav() {
  const pathname = usePathname();

  const tabs = [
    {
      href: "/",
      label: "Home",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      ),
      iconFill: (
        <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689ZM12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
      ),
    },
    {
      href: "/cars",
      label: "Cars",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      ),
      iconFill: (
        <>
          <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h1.218c.367-1.157 1.442-2 2.719-2 1.276 0 2.351.843 2.718 2h7.69c.367-1.157 1.442-2 2.718-2 1.277 0 2.352.843 2.719 2H22.5V6.375c0-1.036-.84-1.875-1.875-1.875H3.375Z" />
          <path d="M5.437 15a2.063 2.063 0 1 0 0-4.125 2.063 2.063 0 0 0 0 4.125Zm13.125 0a2.063 2.063 0 1 0 0-4.125 2.063 2.063 0 0 0 0 4.125Z" />
        </>
      ),
    },
    {
      href: "/sell",
      label: "Sell",
      isCenter: true,
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      ),
      iconFill: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      ),
    },
    {
      href: "/compare",
      label: "EMI",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z" />
      ),
      iconFill: (
        <path d="M12 7.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM1.5 4.875c0-1.036.84-1.875 1.875-1.875h16.25c1.035 0 1.875.84 1.875 1.875v14.25c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 19.125V4.875Z" />
      ),
    },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      {/* Frosted glass background */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,.06)]" />

      <div className="relative flex items-end justify-around px-4 pt-2 pb-2">
        {tabs.map((tab) => {
          const active = isActive(tab.href);
          const isCenter = "isCenter" in tab && tab.isCenter;

          if (isCenter) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex flex-col items-center -mt-5"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                  active
                    ? "bg-gradient-to-br from-orange-500 to-orange-600 shadow-orange-300/40 scale-105"
                    : "bg-gradient-to-br from-orange-500 to-orange-600 shadow-orange-200/30"
                }`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    {tab.icon}
                  </svg>
                </div>
                <span className={`text-[0.6rem] font-bold mt-1 ${active ? "text-orange-600" : "text-slate-500"}`}>
                  {tab.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center gap-1 py-1.5 min-w-[56px]"
            >
              <div className="relative">
                {active && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-orange-500 rounded-full" />
                )}
                <svg
                  className={`w-[22px] h-[22px] transition-colors duration-200 ${
                    active ? "text-orange-600" : "text-slate-400"
                  }`}
                  fill={active ? "currentColor" : "none"}
                  stroke={active ? "none" : "currentColor"}
                  strokeWidth={1.8}
                  viewBox="0 0 24 24"
                >
                  {active ? tab.iconFill : tab.icon}
                </svg>
              </div>
              <span className={`text-[0.6rem] font-semibold transition-colors duration-200 ${
                active ? "text-orange-600" : "text-slate-400"
              }`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
