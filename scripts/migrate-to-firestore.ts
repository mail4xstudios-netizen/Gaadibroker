/**
 * Migration script: Push local JSON data into Firestore
 * Run with: npx tsx scripts/migrate-to-firestore.ts
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

// Load env
const envPath = path.join(__dirname, "..", ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const envVars: Record<string, string> = {};
for (const line of envContent.split("\n")) {
  const match = line.match(/^([^#=]+)=(.+)$/);
  if (match) envVars[match[1].trim()] = match[2].trim();
}

const serviceAccount = JSON.parse(envVars.FIREBASE_SERVICE_ACCOUNT_KEY);

const app = initializeApp({
  credential: cert(serviceAccount),
  storageBucket: envVars.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
});

const db = getFirestore(app);

const dataDir = path.join(__dirname, "..", "src", "data");

async function migrate() {
  console.log("Starting migration to Firestore...\n");

  // 1. Migrate cars
  const cars = JSON.parse(fs.readFileSync(path.join(dataDir, "cars.json"), "utf-8"));
  console.log(`Migrating ${cars.length} car(s)...`);
  for (const car of cars) {
    await db.collection("cars").doc(car.id).set(car);
    console.log(`  ✓ Car: ${car.name} (${car.id})`);
  }

  // 2. Migrate brands
  const brands = JSON.parse(fs.readFileSync(path.join(dataDir, "brands.json"), "utf-8"));
  console.log(`\nMigrating ${brands.length} brand(s)...`);
  for (const brand of brands) {
    await db.collection("brands").doc(brand.id).set(brand);
    console.log(`  ✓ Brand: ${brand.name}`);
  }

  // 3. Migrate content (single document)
  const content = JSON.parse(fs.readFileSync(path.join(dataDir, "content.json"), "utf-8"));
  console.log(`\nMigrating site content...`);
  await db.collection("siteContent").doc("main").set(content);
  console.log(`  ✓ Site content saved`);

  // 4. Migrate leads
  const leads = JSON.parse(fs.readFileSync(path.join(dataDir, "leads.json"), "utf-8"));
  console.log(`\nMigrating ${leads.length} lead(s)...`);
  for (const lead of leads) {
    await db.collection("leads").doc(lead.id).set(lead);
    console.log(`  ✓ Lead: ${lead.name} → ${lead.carName}`);
  }

  // 5. Migrate users
  const users = JSON.parse(fs.readFileSync(path.join(dataDir, "users.json"), "utf-8"));
  console.log(`\nMigrating ${users.length} user(s)...`);
  for (const user of users) {
    await db.collection("users").doc(user.id).set(user);
    console.log(`  ✓ User: ${user.name} (${user.email})`);
  }

  // 6. Migrate sell leads
  const sellLeads = JSON.parse(fs.readFileSync(path.join(dataDir, "sell-leads.json"), "utf-8"));
  console.log(`\nMigrating ${sellLeads.length} sell lead(s)...`);
  for (const lead of sellLeads) {
    await db.collection("sellLeads").doc(lead.id).set(lead);
    console.log(`  ✓ Sell Lead: ${lead.userName} - ${lead.brand} ${lead.model}`);
  }

  console.log("\n✅ Migration complete! All data is now in Firestore.");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
