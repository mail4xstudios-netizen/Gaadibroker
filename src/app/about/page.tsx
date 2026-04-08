export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-900 py-16 md:py-28">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        </div>
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center relative">
          <span className="inline-flex items-center gap-1.5 bg-orange-500/15 text-orange-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-orange-500/20 mb-5">
            Est. 2020
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500">GaadiBroker</span>
          </h1>
          <p className="text-slate-400 mt-4 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Buying a pre-owned car shouldn&apos;t feel like a gamble&mdash;it should feel like a smart, confident decision.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <h2 className="section-title mb-6">Our Mission</h2>
        <div className="text-slate-600 space-y-4 leading-relaxed text-sm md:text-base">
          <p>
            Founded in 2020, GaadiBroker was built with a simple mission:
            <strong className="text-slate-800"> to bring trust, transparency, and clarity to the used car market.</strong>
          </p>
          <p>
            We noticed a common problem&mdash;buyers were constantly worried about accidental cars, flood-damaged vehicles,
            tampered histories, and hidden issues. The market lacked reliable guidance, and people were often left confused and vulnerable.
          </p>
          <p className="text-slate-800 font-medium">That&apos;s where we stepped in.</p>
        </div>
      </section>

      {/* What We Do */}
      <section className="bg-slate-50 py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="section-title">What We Do</h2>
            <p className="section-subtitle">We go beyond just listing cars&mdash;we verify, inspect, and guide.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {[
              {
                icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>,
                title: "Thorough Car Inspections",
                desc: "Every vehicle is checked for accidents, structural damage, and hidden issues.",
              },
              {
                icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>,
                title: "Service History Verification",
                desc: "Complete transparency with authentic records you can trust.",
              },
              {
                icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>,
                title: "Advanced Vehicle Scanning",
                desc: "Identifying problems that aren't visible to the eye.",
              },
              {
                icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" /></svg>,
                title: "Buyer Consultation",
                desc: "Helping you choose the right car, not just any car.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-5 md:p-6 border border-slate-200/80 hover:border-orange-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 shrink-0 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl flex items-center justify-center text-orange-500">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                    <p className="text-slate-600 text-sm mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <h2 className="section-title mb-6">Our Journey So Far</h2>
        <div className="text-slate-600 space-y-4 leading-relaxed text-sm md:text-base">
          <p>
            Since 2020, we have successfully delivered <strong className="text-slate-800">1000+ cars</strong>, building trust with every transaction.
          </p>
          <p>
            Each deal has strengthened our belief that customers don&apos;t just need options&mdash;they need guidance they can rely on.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-14">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 text-center">
            {[
              { value: "1000+", label: "Cars Delivered" },
              { value: "Since 2020", label: "Trusted Since" },
              { value: "Navi Mumbai", label: "Headquarters" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">{stat.value}</p>
                <p className="text-white/70 text-xs md:text-sm mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <h2 className="section-title mb-6">Our Philosophy</h2>
        <div className="text-slate-600 space-y-4 leading-relaxed text-sm md:text-base">
          <p className="text-lg md:text-xl font-semibold text-slate-800">
            We treat every deal like it&apos;s our own.
          </p>
          <p>
            Our goal is not just to sell cars, but to ensure every customer drives away with
            <strong className="text-slate-800"> confidence, clarity, and peace of mind.</strong>
          </p>
        </div>
      </section>

      {/* Vision */}
      <section className="bg-slate-50 py-12 md:py-20">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <h2 className="section-title mb-6">Our Vision</h2>
          <div className="text-slate-600 space-y-4 leading-relaxed text-sm md:text-base">
            <p>
              We are now building towards the next phase of GaadiBroker.
            </p>
            <p>
              Our aim is to create a trusted platform that directly connects buyers and sellers,
              while maintaining strict quality checks and expert validation&mdash;operating on a
              <strong className="text-slate-800"> transparent commission model.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Why GaadiBroker */}
      <section className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-20 text-center">
        <h2 className="section-title mb-4">Why GaadiBroker?</h2>
        <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
          Because in a market full of doubts,
        </p>
        <p className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600 mt-1">
          we bring certainty.
        </p>
      </section>

    </div>
  );
}
