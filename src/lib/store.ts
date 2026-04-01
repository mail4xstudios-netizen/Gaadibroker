import { Car, Lead, Brand, User, SellLead, sampleCars, brands as defaultBrands } from "./data";
import fs from "fs";
import path from "path";
import { logger } from "./logger";

// Determine writable data directory
function getDataDir(): string {
  const dirs = [
    path.join(process.cwd(), "src/data"),
    path.join(process.cwd(), ".data"),
    path.join("/tmp", "gaadibroker-data"),
  ];
  for (const dir of dirs) {
    try {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      // Test write
      const testFile = path.join(dir, ".write-test");
      fs.writeFileSync(testFile, "ok");
      fs.unlinkSync(testFile);
      return dir;
    } catch { /* try next */ }
  }
  return dirs[0]; // fallback
}
let _dataDir: string | null = null;
const DATA_DIR = (() => {
  if (!_dataDir) _dataDir = getDataDir();
  return _dataDir;
})();
const SOURCE_DATA_DIR = path.join(process.cwd(), "src/data");

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    // Copy source data files if data dir is different from source
    if (DATA_DIR !== SOURCE_DATA_DIR && fs.existsSync(SOURCE_DATA_DIR)) {
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
    // Don't throw - gracefully handle read-only filesystems
  }
}

export function getCars(): Car[] {
  return readJson<Car[]>("cars.json", []);
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

export function updateLead(id: string, updates: Partial<Lead>): Lead | null {
  const leads = getLeads();
  const index = leads.findIndex((l) => l.id === id);
  if (index === -1) return null;
  leads[index] = { ...leads[index], ...updates };
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

// ─── Sell Leads CRUD ───
export function getSellLeads(): SellLead[] {
  return readJson<SellLead[]>("sell-leads.json", []);
}

export function addSellLead(lead: SellLead): SellLead {
  const leads = getSellLeads();
  leads.push(lead);
  writeJson("sell-leads.json", leads);
  return lead;
}

export function updateSellLead(id: string, updates: Partial<SellLead>): SellLead | null {
  const leads = getSellLeads();
  const index = leads.findIndex((l) => l.id === id);
  if (index === -1) return null;
  leads[index] = { ...leads[index], ...updates };
  writeJson("sell-leads.json", leads);
  return leads[index];
}
