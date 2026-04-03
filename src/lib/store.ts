import { Car, Lead, Brand, User, SellLead, brands as defaultBrands } from "./data";
import { adminDb } from "./firebase-admin";
import { logger } from "./logger";

// ─── Firestore helpers ───
function isFirestoreReady(): boolean {
  return adminDb && typeof adminDb.collection === "function";
}

function collection(name: string) {
  if (!isFirestoreReady()) {
    throw new Error("Firestore not initialized");
  }
  return adminDb.collection(name);
}

async function getAllDocs<T>(collectionName: string): Promise<T[]> {
  const snapshot = await collection(collectionName).get();
  return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as T));
}

// ─── Cars CRUD ───
export async function getCars(): Promise<Car[]> {
  try {
    return await getAllDocs<Car>("cars");
  } catch (err) {
    logger.error("Failed to get cars", err);
    return [];
  }
}

export async function getCarById(id: string): Promise<Car | undefined> {
  try {
    const doc = await collection("cars").doc(id).get();
    if (!doc.exists) return undefined;
    return { ...doc.data(), id: doc.id } as Car;
  } catch (err) {
    logger.error("Failed to get car by id", err);
    return undefined;
  }
}

export async function addCar(car: Car): Promise<Car> {
  if (!isFirestoreReady()) throw new Error("Firestore not initialized");
  await collection("cars").doc(car.id).set(car);
  return car;
}

export async function updateCar(id: string, updates: Partial<Car>): Promise<Car | null> {
  if (!isFirestoreReady()) return null;
  const docRef = collection("cars").doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return null;
  await docRef.update(updates);
  const updated = await docRef.get();
  return { ...updated.data(), id: updated.id } as Car;
}

export async function deleteCar(id: string): Promise<boolean> {
  if (!isFirestoreReady()) return false;
  const docRef = collection("cars").doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return false;
  await docRef.delete();
  return true;
}

// ─── Leads CRUD ───
export async function getLeads(): Promise<Lead[]> {
  try {
    return await getAllDocs<Lead>("leads");
  } catch (err) {
    logger.error("Failed to get leads", err);
    return [];
  }
}

export async function addLead(lead: Lead): Promise<Lead> {
  await collection("leads").doc(lead.id).set(lead);
  return lead;
}

export async function updateLeadStatus(id: string, status: Lead["status"]): Promise<Lead | null> {
  const docRef = collection("leads").doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return null;
  await docRef.update({ status });
  const updated = await docRef.get();
  return { ...updated.data(), id: updated.id } as Lead;
}

export async function updateLead(id: string, updates: Partial<Lead>): Promise<Lead | null> {
  const docRef = collection("leads").doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return null;
  await docRef.update(updates);
  const updated = await docRef.get();
  return { ...updated.data(), id: updated.id } as Lead;
}

// ─── Site Content ───
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
  contactPhone: "+91 8108797000",
  contactAddress: "Shop 48, Shreeji Heights, Sector-46/A, Seawoods, Navi Mumbai, Maharashtra 400706",
  whatsappNumber: "918108797000",
};

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const doc = await collection("siteContent").doc("main").get();
    if (!doc.exists) {
      await collection("siteContent").doc("main").set(defaultContent);
      return defaultContent;
    }
    return doc.data() as SiteContent;
  } catch (err) {
    logger.error("Failed to get site content", err);
    return defaultContent;
  }
}

export async function updateSiteContent(updates: Partial<SiteContent>): Promise<SiteContent> {
  const docRef = collection("siteContent").doc("main");
  const doc = await docRef.get();
  if (!doc.exists) {
    const content = { ...defaultContent, ...updates };
    await docRef.set(content);
    return content;
  }
  await docRef.update(updates);
  const updated = await docRef.get();
  return updated.data() as SiteContent;
}

// ─── Brands CRUD ───
export async function getBrands(): Promise<Brand[]> {
  try {
    const brands = await getAllDocs<Brand>("brands");
    if (brands.length === 0) return defaultBrands;
    return brands;
  } catch (err) {
    logger.error("Failed to get brands", err);
    return defaultBrands;
  }
}

export async function addBrand(brand: Brand): Promise<Brand> {
  await collection("brands").doc(brand.id).set(brand);
  return brand;
}

export async function updateBrand(id: string, updates: Partial<Brand>): Promise<Brand | null> {
  const docRef = collection("brands").doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return null;
  await docRef.update(updates);
  const updated = await docRef.get();
  return { ...updated.data(), id: updated.id } as Brand;
}

export async function deleteBrand(id: string): Promise<boolean> {
  const docRef = collection("brands").doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return false;
  await docRef.delete();
  return true;
}

// ─── User CRUD ───
export async function getUsers(): Promise<User[]> {
  try {
    return await getAllDocs<User>("users");
  } catch (err) {
    logger.error("Failed to get users", err);
    return [];
  }
}

export async function getUserById(id: string): Promise<User | undefined> {
  try {
    const doc = await collection("users").doc(id).get();
    if (!doc.exists) return undefined;
    return { ...doc.data(), id: doc.id } as User;
  } catch (err) {
    logger.error("Failed to get user by id", err);
    return undefined;
  }
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  try {
    const snapshot = await collection("users").where("email", "==", email.toLowerCase()).limit(1).get();
    if (snapshot.empty) return undefined;
    const doc = snapshot.docs[0];
    return { ...doc.data(), id: doc.id } as User;
  } catch (err) {
    logger.error("Failed to get user by email", err);
    return undefined;
  }
}

export async function getUserByPhone(phone: string): Promise<User | undefined> {
  try {
    const snapshot = await collection("users").where("phone", "==", phone).limit(1).get();
    if (snapshot.empty) return undefined;
    const doc = snapshot.docs[0];
    return { ...doc.data(), id: doc.id } as User;
  } catch (err) {
    logger.error("Failed to get user by phone", err);
    return undefined;
  }
}

export async function addUser(user: User): Promise<User> {
  await collection("users").doc(user.id).set(user);
  return user;
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  const docRef = collection("users").doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return null;
  await docRef.update({ ...updates, updatedAt: new Date().toISOString() });
  const updated = await docRef.get();
  return { ...updated.data(), id: updated.id } as User;
}

export async function deleteUser(id: string): Promise<boolean> {
  const docRef = collection("users").doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return false;
  await docRef.delete();
  return true;
}

// ─── Sell Leads CRUD ───
export async function getSellLeads(): Promise<SellLead[]> {
  try {
    return await getAllDocs<SellLead>("sellLeads");
  } catch (err) {
    logger.error("Failed to get sell leads", err);
    return [];
  }
}

export async function addSellLead(lead: SellLead): Promise<SellLead> {
  await collection("sellLeads").doc(lead.id).set(lead);
  return lead;
}

export async function updateSellLead(id: string, updates: Partial<SellLead>): Promise<SellLead | null> {
  const docRef = collection("sellLeads").doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return null;
  await docRef.update(updates);
  const updated = await docRef.get();
  return { ...updated.data(), id: updated.id } as SellLead;
}
