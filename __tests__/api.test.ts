// API integration tests (run with dev server)
// These tests verify API endpoints respond correctly

const BASE_URL = "http://localhost:3000";

describe("Public API endpoints", () => {
  it("GET /api/cars returns array", async () => {
    const res = await fetch(`${BASE_URL}/api/cars`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it("GET /api/cars/:id returns car or 404", async () => {
    const res = await fetch(`${BASE_URL}/api/cars/1`);
    expect([200, 404]).toContain(res.status);
  });

  it("POST /api/leads validates required fields", async () => {
    const res = await fetch(`${BASE_URL}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });

  it("POST /api/leads validates phone format", async () => {
    const res = await fetch(`${BASE_URL}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test", phone: "123", carId: "1" }),
    });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("phone");
  });

  it("POST /api/leads accepts valid lead", async () => {
    const res = await fetch(`${BASE_URL}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        phone: "9876543210",
        carId: "1",
        carName: "Test Car",
        source: "test",
      }),
    });
    expect(res.status).toBe(201);
  });
});

describe("Admin API protection", () => {
  it("GET /api/admin/cars requires auth", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/cars`);
    expect(res.status).toBe(401);
  });

  it("GET /api/admin/leads requires auth", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/leads`);
    expect(res.status).toBe(401);
  });

  it("POST /api/auth rejects wrong credentials", async () => {
    const res = await fetch(`${BASE_URL}/api/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "wrong", password: "wrong" }),
    });
    expect(res.status).toBe(401);
  });
});
