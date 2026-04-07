export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  originalPrice?: number;
  fuelType: "Petrol" | "Diesel" | "Electric" | "CNG" | "Hybrid";
  transmission: "Manual" | "Automatic";
  kmDriven: number;
  ownerType: "1st Owner" | "2nd Owner" | "3rd Owner" | "4th Owner+";
  location: string;
  city: string;
  images: string[];
  features: string[];
  description: string;
  color: string;
  registration: string;
  insurance: string;
  featured: boolean;
  status?: "available" | "sold";
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  carId: string;
  carName: string;
  source: string;
  status: "new" | "contacted" | "converted" | "closed";
  leadType?: "hot" | "warm" | "cold";
  followUpDate?: string;
  followUpNotes?: string;
  callHistory?: { date: string; leadType: string; notes: string }[];
  createdAt: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash?: string;
  passwordSalt?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: "user" | "seller" | "admin";
  avatar?: string;
  city?: string;
  blocked: boolean;
  lastLoginAt?: string;
  lastLoginIp?: string;
  lastLoginDevice?: string;
  loginCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SellLead {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  brand: string;
  model: string;
  year: string;
  kmDriven: string;
  fuelType: string;
  city: string;
  expectedPrice: string;
  images: string[];
  status: "new" | "contacted" | "inspecting" | "offer_made" | "sold" | "rejected";
  adminNotes: string;
  createdAt: string;
}

export const brands: Brand[] = [
  { id: "1", name: "Maruti Suzuki", slug: "maruti", logo: "https://www.carlogos.org/car-logos/suzuki-logo-400x400.png" },
  { id: "2", name: "Hyundai", slug: "hyundai", logo: "https://www.carlogos.org/car-logos/hyundai-logo-2011-400x400.png" },
  { id: "3", name: "Tata", slug: "tata", logo: "https://www.carlogos.org/car-logos/tata-logo-2000-400x400.png" },
  { id: "4", name: "Mahindra", slug: "mahindra", logo: "https://www.carlogos.org/car-logos/mahindra-logo-2012-400x400.png" },
  { id: "5", name: "Honda", slug: "honda", logo: "https://www.carlogos.org/car-logos/honda-logo-2000-400x400.png" },
  { id: "6", name: "Toyota", slug: "toyota", logo: "https://www.carlogos.org/car-logos/toyota-logo-2020-400x400.png" },
  { id: "7", name: "Kia", slug: "kia", logo: "https://www.carlogos.org/car-logos/kia-logo-2021-400x400.png" },
  { id: "8", name: "BMW", slug: "bmw", logo: "https://www.carlogos.org/car-logos/bmw-logo-2020-400x400.png" },
  { id: "9", name: "Mercedes-Benz", slug: "mercedes", logo: "https://www.carlogos.org/car-logos/mercedes-benz-logo-2011-400x400.png" },
  { id: "10", name: "Audi", slug: "audi", logo: "https://www.carlogos.org/car-logos/audi-logo-2016-400x400.png" },
  { id: "11", name: "Volkswagen", slug: "volkswagen", logo: "https://www.carlogos.org/car-logos/volkswagen-logo-2019-400x400.png" },
  { id: "12", name: "Skoda", slug: "skoda", logo: "https://www.carlogos.org/car-logos/skoda-logo-2016-400x400.png" },
];

export const budgetRanges = [
  { label: "Under 3 Lakh", min: 0, max: 300000, slug: "under-3-lakh" },
  { label: "3 - 5 Lakh", min: 300000, max: 500000, slug: "3-5-lakh" },
  { label: "5 - 10 Lakh", min: 500000, max: 1000000, slug: "5-10-lakh" },
  { label: "10 - 20 Lakh", min: 1000000, max: 2000000, slug: "10-20-lakh" },
  { label: "20 - 50 Lakh", min: 2000000, max: 5000000, slug: "20-50-lakh" },
  { label: "50 Lakh+", min: 5000000, max: 100000000, slug: "luxury" },
];

export const cities = [
  "Mumbai", "Delhi", "Bangalore", "Pune", "Chennai",
  "Hyderabad", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow",
  "Chandigarh", "Indore", "Nagpur", "Surat", "Kochi",
];

export const sampleCars: Car[] = [];

export const testimonials = [
  {
    name: "Rajesh Kumar",
    location: "Mumbai",
    rating: 5,
    text: "Found my dream car through GaadiBroker. The process was seamless and transparent. Got a great deal on a certified pre-owned Creta!",
    car: "Hyundai Creta",
  },
  {
    name: "Priya Sharma",
    location: "Delhi",
    rating: 5,
    text: "Sold my old car within 3 days! The team was professional and I got a fair price. Highly recommend GaadiBroker.",
    car: "Honda City",
  },
  {
    name: "Amit Patel",
    location: "Pune",
    rating: 5,
    text: "Best experience buying a used car. Every vehicle is thoroughly inspected. My BMW was in pristine condition as described.",
    car: "BMW 3 Series",
  },
  {
    name: "Sneha Reddy",
    location: "Bangalore",
    rating: 4,
    text: "The EMI calculator and financing options made it so easy to plan my purchase. Great customer support throughout!",
    car: "Kia Seltos",
  },
];

export function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  }
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2)} Lakh`;
  }
  return `₹${price.toLocaleString("en-IN")}`;
}

export function formatKm(km: number): string {
  if (km >= 1000) {
    return `${(km / 1000).toFixed(0)}K km`;
  }
  return `${km} km`;
}
