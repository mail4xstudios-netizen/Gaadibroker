export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-900 py-20 md:py-28">
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
            India&apos;s most trusted platform for buying and selling pre-owned cars.
            We&apos;re revolutionizing the used car market with transparency, trust, and technology.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-3xl mx-auto px-4 md:px-6 py-14 md:py-20">
        <h2 className="section-title mb-6">Our Story</h2>
        <div className="text-slate-600 space-y-4 leading-relaxed">
          <p>
            GaadiBroker was founded with a simple mission: to make buying and selling used cars
            as easy and trustworthy as possible. We noticed that the used car market was plagued
            with uncertainty &mdash; buyers never knew the true condition of a car, and sellers struggled
            to find genuine buyers.
          </p>
          <p>
            Today, we&apos;ve grown into India&apos;s leading pre-owned car marketplace, serving over
            50,000 happy customers across 100+ cities. Every car on our platform undergoes a rigorous
            200-point inspection, ensuring you get exactly what you see.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="section-title">Our Values</h2>
            <p className="section-subtitle">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>,
                title: "Trust & Transparency",
                desc: "Every listing is verified. We provide complete vehicle history, inspection reports, and honest pricing.",
              },
              {
                icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>,
                title: "Customer First",
                desc: "Your satisfaction is our priority. From browsing to buying, we\u2019re with you every step of the way.",
              },
              {
                icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg>,
                title: "Innovation",
                desc: "We leverage AI and technology to provide personalized recommendations and streamlined experiences.",
              },
            ].map((value) => (
              <div key={value.title} className="bg-white rounded-xl p-6 border border-slate-200/80 hover:border-orange-200 hover:shadow-md transition-all duration-300 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl flex items-center justify-center text-orange-500 mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{value.title}</h3>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 md:px-6 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10,000+", label: "Cars Sold" },
              { value: "50,000+", label: "Happy Customers" },
              { value: "100+", label: "Cities" },
              { value: "200+", label: "Team Members" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{stat.value}</p>
                <p className="text-white/70 text-sm mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-14 md:py-20">
        <div className="text-center mb-12">
          <h2 className="section-title">Leadership Team</h2>
          <p className="section-subtitle">The people behind GaadiBroker</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { name: "Arjun Mehta", role: "Founder & CEO", gradient: "from-orange-400 to-orange-500" },
            { name: "Sneha Kapoor", role: "COO", gradient: "from-blue-400 to-blue-500" },
            { name: "Vikram Singh", role: "CTO", gradient: "from-emerald-400 to-emerald-500" },
          ].map((person) => (
            <div key={person.name} className="text-center group">
              <div className={`w-28 h-28 bg-gradient-to-br ${person.gradient} rounded-2xl mx-auto flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                <span className="text-white text-3xl font-bold">{person.name.charAt(0)}</span>
              </div>
              <h3 className="font-bold text-slate-900 mt-4 text-base">{person.name}</h3>
              <p className="text-slate-500 text-sm">{person.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
