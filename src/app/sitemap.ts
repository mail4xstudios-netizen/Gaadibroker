import { MetadataRoute } from "next";
import { getCars } from "@/lib/store";
import { cities, brands } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gaadibroker.com";
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/cars`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${baseUrl}/sell`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/compare`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Car detail pages
  let carPages: MetadataRoute.Sitemap = [];
  try {
    const cars = getCars();
    carPages = cars.map((car) => ({
      url: `${baseUrl}/cars/${car.id}`,
      lastModified: new Date(car.createdAt),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    // Gracefully degrade if car data is unavailable
  }

  // City pages (location-based SEO)
  const cityPages: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${baseUrl}/cars?city=${encodeURIComponent(city)}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  // Brand pages
  const brandPages: MetadataRoute.Sitemap = brands.map((brand) => ({
    url: `${baseUrl}/cars?brand=${encodeURIComponent(brand.name)}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [...staticPages, ...carPages, ...cityPages, ...brandPages];
}
