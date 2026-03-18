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
  { id: "1", name: "Maruti Suzuki", slug: "maruti", logo: "/new/brands/maruti.svg" },
  { id: "2", name: "Hyundai", slug: "hyundai", logo: "/new/brands/hyundai.svg" },
  { id: "3", name: "Tata", slug: "tata", logo: "/new/brands/tata.svg" },
  { id: "4", name: "Mahindra", slug: "mahindra", logo: "/new/brands/mahindra.svg" },
  { id: "5", name: "Honda", slug: "honda", logo: "/new/brands/honda.svg" },
  { id: "6", name: "Toyota", slug: "toyota", logo: "/new/brands/toyota.svg" },
  { id: "7", name: "Kia", slug: "kia", logo: "/new/brands/kia.svg" },
  { id: "8", name: "BMW", slug: "bmw", logo: "/new/brands/bmw.svg" },
  { id: "9", name: "Mercedes-Benz", slug: "mercedes", logo: "/new/brands/mercedes.svg" },
  { id: "10", name: "Audi", slug: "audi", logo: "/new/brands/audi.svg" },
  { id: "11", name: "Volkswagen", slug: "volkswagen", logo: "/new/brands/volkswagen.svg" },
  { id: "12", name: "Skoda", slug: "skoda", logo: "/new/brands/skoda.svg" },
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

export const sampleCars: Car[] = [
  {
    id: "1",
    name: "Maruti Suzuki Swift VXi",
    brand: "Maruti Suzuki",
    model: "Swift",
    year: 2022,
    price: 595000,
    originalPrice: 750000,
    fuelType: "Petrol",
    transmission: "Manual",
    kmDriven: 25000,
    ownerType: "1st Owner",
    location: "Andheri West, Mumbai",
    city: "Mumbai",
    images: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800",
    ],
    features: ["ABS", "Airbags", "Power Steering", "AC", "Power Windows", "Central Locking", "Music System"],
    description: "Well-maintained Maruti Swift in excellent condition. Single owner, full service history with authorized dealer. All documents clear.",
    color: "Pearl White",
    registration: "MH-02",
    insurance: "Comprehensive till Dec 2026",
    featured: true,
    createdAt: "2026-03-15",
  },
  {
    id: "2",
    name: "Hyundai Creta SX(O)",
    brand: "Hyundai",
    model: "Creta",
    year: 2023,
    price: 1450000,
    originalPrice: 1800000,
    fuelType: "Diesel",
    transmission: "Automatic",
    kmDriven: 15000,
    ownerType: "1st Owner",
    location: "Koramangala, Bangalore",
    city: "Bangalore",
    images: [
      "https://images.unsplash.com/photo-1606611013016-969c19ba27bc?w=800",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
      "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800",
    ],
    features: ["Panoramic Sunroof", "Ventilated Seats", "ADAS", "360 Camera", "Wireless Charging", "Connected Car Tech", "LED Headlamps"],
    description: "Premium Hyundai Creta top variant with all bells and whistles. Barely driven, showroom condition.",
    color: "Phantom Black",
    registration: "KA-01",
    insurance: "Comprehensive till Mar 2027",
    featured: true,
    createdAt: "2026-03-14",
  },
  {
    id: "3",
    name: "Tata Nexon EV Max",
    brand: "Tata",
    model: "Nexon EV",
    year: 2023,
    price: 1350000,
    originalPrice: 1900000,
    fuelType: "Electric",
    transmission: "Automatic",
    kmDriven: 12000,
    ownerType: "1st Owner",
    location: "Baner, Pune",
    city: "Pune",
    images: [
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800",
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800",
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800",
    ],
    features: ["Fast Charging", "Connected Car", "Sunroof", "Auto Climate", "Cruise Control", "Ventilated Seats", "Air Purifier"],
    description: "Tata Nexon EV Max with extended range. Perfect for city commute with zero emissions. Battery health 98%.",
    color: "Intensi-Teal",
    registration: "MH-12",
    insurance: "Comprehensive till Jun 2027",
    featured: true,
    createdAt: "2026-03-13",
  },
  {
    id: "4",
    name: "BMW 3 Series 320d",
    brand: "BMW",
    model: "3 Series",
    year: 2021,
    price: 3200000,
    originalPrice: 4800000,
    fuelType: "Diesel",
    transmission: "Automatic",
    kmDriven: 35000,
    ownerType: "1st Owner",
    location: "Gurgaon, Delhi",
    city: "Delhi",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
      "https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?w=800",
      "https://images.unsplash.com/photo-1520050206757-78ffa4eeacd4?w=800",
    ],
    features: ["Leather Seats", "Ambient Lighting", "Harman Kardon Sound", "Gesture Control", "Parking Assist", "Head-Up Display", "M Sport Package"],
    description: "Immaculate BMW 3 Series with M Sport package. Full dealer service history, extended warranty available.",
    color: "Alpine White",
    registration: "DL-01",
    insurance: "Comprehensive till Sep 2026",
    featured: true,
    createdAt: "2026-03-12",
  },
  {
    id: "5",
    name: "Honda City ZX CVT",
    brand: "Honda",
    model: "City",
    year: 2022,
    price: 1050000,
    originalPrice: 1350000,
    fuelType: "Petrol",
    transmission: "Automatic",
    kmDriven: 20000,
    ownerType: "1st Owner",
    location: "T Nagar, Chennai",
    city: "Chennai",
    images: [
      "https://images.unsplash.com/photo-1610647752706-3bb12232b3ab?w=800",
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800",
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800",
    ],
    features: ["Lane Watch Camera", "Sunroof", "LED Headlamps", "Alexa Connectivity", "6 Airbags", "Paddle Shifters", "Cruise Control"],
    description: "Honda City top variant with CVT. Known for reliability and low maintenance. Excellent mileage.",
    color: "Radiant Red",
    registration: "TN-09",
    insurance: "Comprehensive till Nov 2026",
    featured: false,
    createdAt: "2026-03-11",
  },
  {
    id: "6",
    name: "Mahindra Thar LX",
    brand: "Mahindra",
    model: "Thar",
    year: 2023,
    price: 1650000,
    originalPrice: 2000000,
    fuelType: "Diesel",
    transmission: "Manual",
    kmDriven: 18000,
    ownerType: "1st Owner",
    location: "Jubilee Hills, Hyderabad",
    city: "Hyderabad",
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
    ],
    features: ["4x4", "Hard Top", "Touchscreen", "Cruise Control", "Adventure Ready", "Roll Cage", "Diff Lock"],
    description: "Mahindra Thar LX - the ultimate adventure vehicle. Capable off-roader with premium on-road manners.",
    color: "Galaxy Grey",
    registration: "TS-08",
    insurance: "Comprehensive till Feb 2027",
    featured: true,
    createdAt: "2026-03-10",
  },
  {
    id: "7",
    name: "Kia Seltos HTX+",
    brand: "Kia",
    model: "Seltos",
    year: 2023,
    price: 1280000,
    originalPrice: 1600000,
    fuelType: "Petrol",
    transmission: "Automatic",
    kmDriven: 10000,
    ownerType: "1st Owner",
    location: "Salt Lake, Kolkata",
    city: "Kolkata",
    images: [
      "https://images.unsplash.com/photo-1568844293986-8d0400f4e948?w=800",
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800",
      "https://images.unsplash.com/photo-1504215680853-026ed2a45def?w=800",
    ],
    features: ["Bose Sound System", "Ventilated Seats", "UVO Connect", "360 Camera", "Sunroof", "Air Purifier", "Wireless Charger"],
    description: "Like-new Kia Seltos with minimal usage. Feature-loaded variant with Bose audio and ventilated seats.",
    color: "Gravity Grey",
    registration: "WB-06",
    insurance: "Comprehensive till Apr 2027",
    featured: false,
    createdAt: "2026-03-09",
  },
  {
    id: "8",
    name: "Toyota Fortuner Legender",
    brand: "Toyota",
    model: "Fortuner",
    year: 2022,
    price: 3850000,
    originalPrice: 4600000,
    fuelType: "Diesel",
    transmission: "Automatic",
    kmDriven: 28000,
    ownerType: "1st Owner",
    location: "Vastrapur, Ahmedabad",
    city: "Ahmedabad",
    images: [
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800",
      "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800",
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800",
    ],
    features: ["4x4", "Leather Interior", "JBL Audio", "360 Camera", "Power Tailgate", "Cooled Seats", "TPMS"],
    description: "Toyota Fortuner Legender - the premium SUV that dominates roads. Bulletproof reliability with luxury features.",
    color: "Phantom Brown",
    registration: "GJ-01",
    insurance: "Comprehensive till Aug 2026",
    featured: true,
    createdAt: "2026-03-08",
  },
  {
    id: "9",
    name: "Maruti Suzuki Baleno Alpha",
    brand: "Maruti Suzuki",
    model: "Baleno",
    year: 2023,
    price: 780000,
    originalPrice: 980000,
    fuelType: "Petrol",
    transmission: "Manual",
    kmDriven: 8000,
    ownerType: "1st Owner",
    location: "Malviya Nagar, Jaipur",
    city: "Jaipur",
    images: [
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800",
    ],
    features: ["Head-Up Display", "360 Camera", "6 Airbags", "Suzuki Connect", "LED DRLs", "Auto AC", "Push Start"],
    description: "Almost new Baleno Alpha with just 8000 km. Loaded with features including segment-first HUD.",
    color: "Nexa Blue",
    registration: "RJ-14",
    insurance: "Comprehensive till Jan 2027",
    featured: false,
    createdAt: "2026-03-07",
  },
  {
    id: "10",
    name: "Mercedes-Benz C-Class C200",
    brand: "Mercedes-Benz",
    model: "C-Class",
    year: 2022,
    price: 4200000,
    originalPrice: 5800000,
    fuelType: "Petrol",
    transmission: "Automatic",
    kmDriven: 22000,
    ownerType: "1st Owner",
    location: "Gomti Nagar, Lucknow",
    city: "Lucknow",
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800",
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800",
      "https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800",
    ],
    features: ["MBUX System", "Burmester Sound", "Digital Cockpit", "Ambient Lighting", "Memory Seats", "Panoramic Roof", "ADAS"],
    description: "Stunning Mercedes-Benz C-Class with the latest MBUX system. Luxury sedan at an incredible value.",
    color: "Obsidian Black",
    registration: "UP-32",
    insurance: "Comprehensive till May 2026",
    featured: true,
    createdAt: "2026-03-06",
  },
  {
    id: "11",
    name: "Tata Punch Adventure",
    brand: "Tata",
    model: "Punch",
    year: 2023,
    price: 720000,
    originalPrice: 880000,
    fuelType: "Petrol",
    transmission: "Manual",
    kmDriven: 12000,
    ownerType: "1st Owner",
    location: "Aundh, Pune",
    city: "Pune",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800",
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800",
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800",
    ],
    features: ["5-Star Safety", "Touchscreen", "Auto AC", "Roof Rails", "Projector Headlamps", "Height Adjustable Seat", "Traction Pro"],
    description: "Tata Punch with 5-star GNCAP safety rating. Perfect city SUV with rugged looks.",
    color: "Tornado Blue",
    registration: "MH-12",
    insurance: "Comprehensive till Oct 2026",
    featured: false,
    createdAt: "2026-03-05",
  },
  {
    id: "12",
    name: "Volkswagen Virtus GT",
    brand: "Volkswagen",
    model: "Virtus",
    year: 2023,
    price: 1520000,
    originalPrice: 1850000,
    fuelType: "Petrol",
    transmission: "Automatic",
    kmDriven: 14000,
    ownerType: "1st Owner",
    location: "Sector 17, Chandigarh",
    city: "Chandigarh",
    images: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800",
    ],
    features: ["1.5 TSI Engine", "DSG Gearbox", "Ventilated Seats", "Digital Cockpit", "Wireless CarPlay", "6 Airbags", "ESC"],
    description: "Volkswagen Virtus GT with the peppy 1.5 TSI turbo engine. Enthusiast's sedan with German build quality.",
    color: "Carbon Steel Grey",
    registration: "CH-01",
    insurance: "Comprehensive till Dec 2026",
    featured: false,
    createdAt: "2026-03-04",
  },
];

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
