export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GaadiBroker",
    url: "https://gaadibroker.com",
    description: "India's most trusted platform for buying and selling pre-owned cars.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://gaadibroker.com/new/cars?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GaadiBroker",
    url: "https://gaadibroker.com",
    logo: "https://gaadibroker.com/new/images/logo.png",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-98765-43210",
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Auto Lane, Andheri West",
      addressLocality: "Mumbai",
      addressRegion: "Maharashtra",
      postalCode: "400053",
      addressCountry: "IN",
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function CarSchema({ car }: { car: { name: string; price: number; year: number; kmDriven: number; fuelType: string; transmission: string; color: string; images: string[]; description: string; city: string } }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: car.name,
    vehicleModelDate: car.year.toString(),
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: car.kmDriven,
      unitCode: "KMT",
    },
    fuelType: car.fuelType,
    vehicleTransmission: car.transmission,
    color: car.color,
    image: car.images[0],
    description: car.description,
    offers: {
      "@type": "Offer",
      price: car.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/UsedCondition",
      areaServed: { "@type": "City", name: car.city },
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function FAQSchema({ faqs }: { faqs: { q: string; a: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function LocalBusinessSchema({ city }: { city: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: `GaadiBroker ${city}`,
    url: `https://gaadibroker.com/new/cars?city=${encodeURIComponent(city)}`,
    telephone: "+91-98765-43210",
    address: {
      "@type": "PostalAddress",
      addressLocality: city,
      addressCountry: "IN",
    },
    priceRange: "$$",
    openingHours: "Mo-Sa 09:00-20:00",
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
