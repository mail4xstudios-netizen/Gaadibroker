export default function AboutPage() {
  return (
    <div>
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white">
            About <span className="text-orange-500">GaadiBroker</span>
          </h1>
          <p className="text-gray-300 mt-4 text-lg max-w-2xl mx-auto">
            India&apos;s most trusted platform for buying and selling pre-owned cars.
            We&apos;re revolutionizing the used car market with transparency, trust, and technology.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
        <div className="prose prose-lg text-gray-600 space-y-4">
          <p>
            GaadiBroker was founded with a simple mission: to make buying and selling used cars
            as easy and trustworthy as possible. We noticed that the used car market was plagued
            with uncertainty — buyers never knew the true condition of a car, and sellers struggled
            to find genuine buyers.
          </p>
          <p>
            Today, we&apos;ve grown into India&apos;s leading pre-owned car marketplace, serving over
            50,000 happy customers across 100+ cities. Every car on our platform undergoes a rigorous
            200-point inspection, ensuring you get exactly what you see.
          </p>
        </div>
      </section>

      <section className="bg-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "🛡️", title: "Trust & Transparency", desc: "Every listing is verified. We provide complete vehicle history, inspection reports, and honest pricing." },
              { icon: "🤝", title: "Customer First", desc: "Your satisfaction is our priority. From browsing to buying, we're with you every step of the way." },
              { icon: "💡", title: "Innovation", desc: "We leverage AI and technology to provide personalized recommendations and streamlined experiences." },
            ].map((value) => (
              <div key={value.title} className="text-center">
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900">{value.title}</h3>
                <p className="text-gray-600 mt-2">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-orange-500 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10,000+", label: "Cars Sold" },
              { value: "50,000+", label: "Happy Customers" },
              { value: "100+", label: "Cities" },
              { value: "200+", label: "Team Members" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl md:text-4xl font-bold text-white">{stat.value}</p>
                <p className="text-white/80 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">Leadership Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {[
            { name: "Arjun Mehta", role: "Founder & CEO", bg: "bg-orange-100" },
            { name: "Sneha Kapoor", role: "COO", bg: "bg-blue-100" },
            { name: "Vikram Singh", role: "CTO", bg: "bg-green-100" },
          ].map((person) => (
            <div key={person.name} className="text-center">
              <div className={`w-32 h-32 ${person.bg} rounded-full mx-auto flex items-center justify-center`}>
                <span className="text-4xl">👤</span>
              </div>
              <h3 className="font-bold text-gray-900 mt-4">{person.name}</h3>
              <p className="text-gray-500 text-sm">{person.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
