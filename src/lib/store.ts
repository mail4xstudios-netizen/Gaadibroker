import { Car, Lead, Brand, User, sampleCars, brands as defaultBrands } from "./data";
import fs from "fs";
import path from "path";
import { logger } from "./logger";

// On Vercel, the filesystem is read-only except /tmp
const isVercel = !!process.env.VERCEL;
const DATA_DIR = isVercel
  ? path.join("/tmp", "gaadibroker-data")
  : path.join(process.cwd(), "src/data");
const SOURCE_DATA_DIR = path.join(process.cwd(), "src/data");

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    // On Vercel, copy source data files to /tmp if they don't exist yet
    if (isVercel && fs.existsSync(SOURCE_DATA_DIR)) {
      const files = fs.readdirSync(SOURCE_DATA_DIR);
      for (const file of files) {
        const dest = path.join(DATA_DIR, file);
        if (!fs.existsSync(dest)) {
          const src = path.join(SOURCE_DATA_DIR, file);
          fs.copyFileSync(src, dest);
        }
      }
    }
  } catch (err) {
    logger.error("Failed to create data directory", err);
  }
}

function readJson<T>(filename: string, defaultValue: T): T {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
      return defaultValue;
    }
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    logger.error(`Failed to read ${filename}`, err);
    return defaultValue;
  }
}

function writeJson<T>(filename: string, data: T): void {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  try {
    // Write to temp file first, then rename (atomic write)
    const tmpPath = `${filePath}.tmp`;
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2));
    fs.renameSync(tmpPath, filePath);
  } catch (err) {
    logger.error(`Failed to write ${filename}`, err);
    throw new Error(`Failed to save data to ${filename}`);
  }
}

export function getCars(): Car[] {
  return readJson<Car[]>("cars.json", sampleCars);
}

export function getCarById(id: string): Car | undefined {
  return getCars().find((c) => c.id === id);
}

export function addCar(car: Car): Car {
  const cars = getCars();
  cars.push(car);
  writeJson("cars.json", cars);
  return car;
}

export function updateCar(id: string, updates: Partial<Car>): Car | null {
  const cars = getCars();
  const index = cars.findIndex((c) => c.id === id);
  if (index === -1) return null;
  cars[index] = { ...cars[index], ...updates };
  writeJson("cars.json", cars);
  return cars[index];
}

export function deleteCar(id: string): boolean {
  const cars = getCars();
  const filtered = cars.filter((c) => c.id !== id);
  if (filtered.length === cars.length) return false;
  writeJson("cars.json", filtered);
  return true;
}

export function getLeads(): Lead[] {
  return readJson<Lead[]>("leads.json", []);
}

export function addLead(lead: Lead): Lead {
  const leads = getLeads();
  leads.push(lead);
  writeJson("leads.json", leads);
  return lead;
}

export function updateLeadStatus(id: string, status: Lead["status"]): Lead | null {
  const leads = getLeads();
  const index = leads.findIndex((l) => l.id === id);
  if (index === -1) return null;
  leads[index].status = status;
  writeJson("leads.json", leads);
  return leads[index];
}

interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  bannerImage: string;
  sliderImages: string[];
  aboutText: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  whatsappNumber: string;
}

const defaultContent: SiteContent = {
  heroTitle: "Find Your Perfect Pre-Owned Car",
  heroSubtitle: "India's most trusted platform for buying and selling used cars. Verified sellers, certified vehicles, best deals.",
  heroCta: "Explore Cars",
  bannerImage: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920",
  sliderImages: [],
  aboutText: "GaadiBroker is India's leading pre-owned car marketplace.",
  contactEmail: "hello@gaadibroker.com",
  contactPhone: "+91 98765 43210",
  contactAddress: "123 Auto Lane, Andheri West, Mumbai 400053",
  whatsappNumber: "919876543210",
};

export function getSiteContent(): SiteContent {
  return readJson<SiteContent>("content.json", defaultContent);
}

export function updateSiteContent(updates: Partial<SiteContent>): SiteContent {
  const content = getSiteContent();
  const updated = { ...content, ...updates };
  writeJson("content.json", updated);
  return updated;
}

// Brand CRUD
export function getBrands(): Brand[] {
  return readJson<Brand[]>("brands.json", defaultBrands);
}

export function addBrand(brand: Brand): Brand {
  const brands = getBrands();
  brands.push(brand);
  writeJson("brands.json", brands);
  return brand;
}

export function updateBrand(id: string, updates: Partial<Brand>): Brand | null {
  const brands = getBrands();
  const index = brands.findIndex((b) => b.id === id);
  if (index === -1) return null;
  brands[index] = { ...brands[index], ...updates };
  writeJson("brands.json", brands);
  return brands[index];
}

export function deleteBrand(id: string): boolean {
  const brands = getBrands();
  const filtered = brands.filter((b) => b.id !== id);
  if (filtered.length === brands.length) return false;
  writeJson("brands.json", filtered);
  return true;
}

// ─── User CRUD ───
export function getUsers(): User[] {
  return readJson<User[]>("users.json", []);
}

export function getUserById(id: string): User | undefined {
  return getUsers().find((u) => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function getUserByPhone(phone: string): User | undefined {
  return getUsers().find((u) => u.phone === phone);
}

export function addUser(user: User): User {
  const users = getUsers();
  users.push(user);
  writeJson("users.json", users);
  return user;
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;
  users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
  writeJson("users.json", users);
  return users[index];
}

export function deleteUser(id: string): boolean {
  const users = getUsers();
  const filtered = users.filter((u) => u.id !== id);
  if (filtered.length === users.length) return false;
  writeJson("users.json", filtered);
  return true;
}
